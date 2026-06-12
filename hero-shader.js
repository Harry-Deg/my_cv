/* =========================================================
   Hero shader wallpaper — interactif (souris + clics)
   5 modes · palette bleu nuit du CV
   ========================================================= */
(function () {
  "use strict";

  var MODES = { "Aurora": 0, "Plasma": 1, "Voronoï": 2, "Ondes": 3, "Grille": 4 };

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes;",
    "uniform float uTime;",
    "uniform vec2 uMouse;",
    "uniform float uMode;",
    "uniform vec3 cDeep, cMid, cAcc, cSky, cGlow;",
    "const int NR = 6;",
    "uniform vec2 uRipPos[NR];",
    "uniform float uRipAge[NR];",

    "float hash21(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }",
    "vec2 hash22(vec2 p){ float n=sin(dot(p,vec2(41.0,289.0))); return fract(vec2(262144.0,32768.0)*n); }",
    "float vnoise(vec2 p){",
    "  vec2 i=floor(p), f=fract(p);",
    "  vec2 u=f*f*(3.0-2.0*f);",
    "  float a=hash21(i), b=hash21(i+vec2(1.0,0.0)), c=hash21(i+vec2(0.0,1.0)), d=hash21(i+vec2(1.0,1.0));",
    "  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);",
    "}",
    "float fbm(vec2 p){",
    "  float v=0.0, a=0.5;",
    "  for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.02+vec2(7.1,3.7); a*=0.5; }",
    "  return v;",
    "}",
    "float voronoiEdge(vec2 p){",
    "  vec2 g=floor(p), f=fract(p);",
    "  float d1=8.0, d2=8.0;",
    "  for(int y=-1;y<=1;y++){ for(int x=-1;x<=1;x++){",
    "    vec2 o=vec2(float(x),float(y));",
    "    vec2 r=hash22(g+o); r=0.5+0.5*sin(uTime*0.6+6.2831*r);",
    "    vec2 diff=o+r-f; float d=dot(diff,diff);",
    "    if(d<d1){ d2=d1; d1=d; } else if(d<d2){ d2=d; }",
    "  }}",
    "  return sqrt(d2)-sqrt(d1);",
    "}",
    "float ripples(vec2 uv){",
    "  float s=0.0;",
    "  for(int i=0;i<NR;i++){",
    "    float age=uRipAge[i];",
    "    if(age<2.5){",
    "      float d=distance(uv,uRipPos[i]);",
    "      float rad=age*0.55;",
    "      s+=exp(-pow((d-rad)*9.0,2.0))*exp(-age*1.6);",
    "    }",
    "  }",
    "  return s;",
    "}",

    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/uRes.xy;",
    "  float asp=uRes.x/uRes.y;",
    "  vec2 p=(gl_FragCoord.xy-0.5*uRes.xy)/uRes.y;",
    "  vec2 m=(uMouse-0.5)*vec2(asp,1.0);",
    "  float t=uTime*0.08;",
    "  float val=0.0;",
    "  float md=uMode;",

    "  if(md<0.5){",
    "    vec2 q=vec2(fbm(p*1.5+t), fbm(p*1.5+vec2(5.2,1.3)-t));",
    "    vec2 r=vec2(fbm(p*1.5+2.0*q+vec2(1.7,9.2)+0.15*t), fbm(p*1.5+2.0*q+vec2(8.3,2.8)-0.12*t));",
    "    val=fbm(p*1.5+2.5*r + (m-p)*0.25);",
    "  } else if(md<1.5){",
    "    float s=0.0;",
    "    for(int i=0;i<4;i++){",
    "      float fi=float(i);",
    "      vec2 c=0.62*vec2(sin(uTime*0.30+fi*1.7), cos(uTime*0.23+fi*2.1));",
    "      s+=0.055/(0.02+dot(p-c,p-c));",
    "    }",
    "    s+=0.10/(0.025+dot(p-m,p-m));",
    "    val=clamp(s*0.16,0.0,1.0);",
    "  } else if(md<2.5){",
    "    float e=voronoiEdge(p*3.0 + m*0.7);",
    "    val=1.0-smoothstep(0.0,0.28,e);",
    "    val=val*0.85 + 0.10*fbm(p*2.0+t);",
    "  } else if(md<3.5){",
    "    float d=distance(p,m);",
    "    float w=0.5+0.5*sin(d*24.0 - uTime*1.8);",
    "    val=w*smoothstep(1.3,0.0,d) + 0.12*fbm(p*2.0-t);",
    "  } else {",
    "    vec2 d=p-m;",
    "    float a=atan(d.y,d.x); float rr=length(d);",
    "    float rings=0.5+0.5*sin(1.0/(rr+0.18)*5.0 - uTime*1.1);",
    "    float spokes=0.5+0.5*sin(a*9.0+uTime*0.5);",
    "    val=mix(rings,spokes,0.5)*smoothstep(1.4,0.1,rr);",
    "  }",

    "  vec3 col=mix(cDeep,cMid,smoothstep(0.0,0.5,val));",
    "  col=mix(col,cAcc,smoothstep(0.38,0.82,val));",
    "  col=mix(col,cSky,smoothstep(0.72,1.0,val));",
    "  float mg=exp(-dot(p-m,p-m)*2.2);",
    "  col+=cGlow*mg*0.30;",
    "  col+=cGlow*ripples(uv)*0.85;",
    "  float vig=smoothstep(1.35,0.2,length(p));",
    "  col*=mix(0.62,1.0,vig);",
    "  gl_FragColor=vec4(col,1.0);",
    "}"
  ].join("\n");

  var VERT = [
    "attribute vec2 aPos;",
    "void main(){ gl_Position=vec4(aPos,0.0,1.0); }"
  ].join("\n");

  function hexToRGB(h) {
    h = h.replace("#", "");
    return [parseInt(h.substr(0, 2), 16) / 255,
            parseInt(h.substr(2, 2), 16) / 255,
            parseInt(h.substr(4, 2), 16) / 255];
  }

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("shader compile:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function init() {
    var canvas = document.getElementById("hero-shader");
    if (!canvas) return;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return; // fallback: hero keeps its solid dark background

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ["uRes","uTime","uMouse","uMode","cDeep","cMid","cAcc","cSky","cGlow"].forEach(function (n) {
      U[n] = gl.getUniformLocation(prog, n);
    });
    var NR = 6;
    var uRipPos = gl.getUniformLocation(prog, "uRipPos[0]");
    var uRipAge = gl.getUniformLocation(prog, "uRipAge[0]");

    // palette (read from CSS so it follows the theme / tweaks)
    function palette() {
      var cs = getComputedStyle(document.documentElement);
      function v(name, fb) { var x = cs.getPropertyValue(name).trim(); return x || fb; }
      gl.uniform3fv(U.cDeep, hexToRGB(v("--dark", "#0e1d33")));
      gl.uniform3fv(U.cMid,  hexToRGB(v("--dark-2", "#16294a")));
      gl.uniform3fv(U.cAcc,  hexToRGB(v("--accent", "#2f5fa6")));
      gl.uniform3fv(U.cSky,  hexToRGB("#4a86c5"));
      gl.uniform3fv(U.cGlow, hexToRGB("#9fc2ee"));
    }
    palette();
    window.__heroShaderPalette = palette;

    // state
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var mouse = [0.62, 0.6], target = [0.62, 0.6];
    var ripPos = new Float32Array(NR * 2);
    var ripStart = new Array(NR); for (var i = 0; i < NR; i++) ripStart[i] = -999;
    var ripCursor = 0;
    var mode = MODES[(document.body.getAttribute("data-shader")) || "Aurora"] || 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    var host = canvas.parentElement;
    function toNorm(e) {
      var r = canvas.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = 1.0 - (e.clientY - r.top) / r.height;
      return [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
    }
    host.addEventListener("mousemove", function (e) { target = toNorm(e); });
    host.addEventListener("pointermove", function (e) { target = toNorm(e); }, { passive: true });
    host.addEventListener("pointerdown", function (e) {
      var n = toNorm(e);
      ripPos[ripCursor * 2] = n[0]; ripPos[ripCursor * 2 + 1] = n[1];
      ripStart[ripCursor] = performance.now();
      ripCursor = (ripCursor + 1) % NR;
    });

    // public API for tweaks
    window.heroShader = {
      setMode: function (name) {
        if (MODES.hasOwnProperty(name)) { mode = MODES[name]; document.body.setAttribute("data-shader", name); }
      }
    };

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var t0 = performance.now();
    var ages = new Float32Array(NR);

    function frame(now) {
      // skip work when hero scrolled well out of view
      var vh = window.innerHeight || 800;
      var visible = canvas.getBoundingClientRect().bottom > -50 && canvas.getBoundingClientRect().top < vh * 1.1;
      if (visible) {
        mouse[0] += (target[0] - mouse[0]) * 0.06;
        mouse[1] += (target[1] - mouse[1]) * 0.06;
        for (var k = 0; k < NR; k++) {
          var a = (now - ripStart[k]) / 1000;
          ages[k] = (a < 0 || a > 8) ? 99.0 : a;
        }
        gl.uniform2f(U.uRes, canvas.width, canvas.height);
        gl.uniform1f(U.uTime, reduce ? 12.0 : (now - t0) / 1000);
        gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
        gl.uniform1f(U.uMode, mode);
        gl.uniform2fv(uRipPos, ripPos);
        gl.uniform1fv(uRipAge, ages);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (reduce) return; // single frame for reduced-motion
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
