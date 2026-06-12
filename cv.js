/* =========================================================
   Harry Degbegni — CV récit · interactions
   ========================================================= */
(function () {
  "use strict";

  /* =========================================================
     Chargement dynamique depuis cv.json
     ========================================================= */

  var ICON_MAP = {
    "snowflake": "snowflake",
    "python": "python",
    "kafka": "apachekafka",
    "apache kafka": "apachekafka",
    "spark": "apachespark",
    "apache spark": "apachespark",
    "docker": "docker",
    "kubernetes": "kubernetes",
    "scala": "scala",
    "databricks": "databricks",
    "aws s3": "amazons3",
    "tableau": "tableau",
    "tableau software": "tableau",
    "postgresql": "postgresql",
    "postgre": "postgresql",
    "postgres": "postgresql",
    "gitlab": "gitlab",
    "streamlit": "streamlit",
    "oracle": "oracle",
    "grafana": "grafana",
    "jenkins": "jenkins",
    "ansible": "ansible",
    "mysql": "mysql",
    "mongodb": "mongodb",
    "prometheus": "prometheus",
    "linux": "linux",
    "sap": "sap",
    "azure devops": "azuredevops",
    "node-red": "nodered",
    "kotlin": "kotlin",
    "groovy": "groovy",
    "bash": "gnubash",
    "power bi": "powerbi",
    "powerbi": "powerbi"
  };

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function techHtml(name) {
    var icon = ICON_MAP[name.trim().toLowerCase()];
    if (icon) {
      return '<span class="mini" data-name="' + esc(name) + '" data-icon="' + icon + '"></span>';
    }
    return '<span class="chip chip--ghost">' + esc(name) + '</span>';
  }

  function renderTechs(list) {
    if (!list) return "";
    if (typeof list === "string") list = list.split(",").map(function (s) { return s.trim(); });
    return list
      .filter(function (t) { return t && t !== "_" && t !== "-"; })
      .map(techHtml).join("");
  }

  function renderMissions(list) {
    if (!list || !list.length) return "";
    return list
      .filter(function (m) { return m && m !== "_" && m !== "-"; })
      .map(function (m) { return "<li>" + esc(m) + "</li>"; })
      .join("");
  }

  function formatPeriode(periode) {
    var years = (periode || "").match(/\d{4}/g);
    if (years && years.length >= 2) return years[0] + " — " + years[1];
    if (years && years.length === 1) return years[0];
    return periode;
  }

  function extractStartYear(periode) {
    var m = (periode || "").match(/\d{4}/);
    return m ? m[0] : "";
  }

  function renderExpArticle(exp) {
    var year = extractStartYear(exp["Période"]);
    var client = exp["Client"] ? " · client " + esc(exp["Client"]) : "";
    var desc = (exp["Description"] && exp["Description"] !== "_")
      ? '<p class="chapter__desc rev" data-d="1">' + esc(exp["Description"]) + '</p>'
      : "";
    var missions = renderMissions(exp["Missions"]);
    var tech = renderTechs(exp["Principales Technologies"]);
    var dataYear = esc(year + " · " + exp["Entreprise"]);

    return '<article class="chapter" data-year="' + dataYear + '">' +
      '<div class="chapter__year rev"><b>' + esc(year) + '</b></div>' +
      '<div>' +
        '<h3 class="chapter__role rev">' + esc(exp["Nom"]) + '</h3>' +
        '<p class="chapter__org rev" data-d="1">' +
          '<span>' + esc(exp["Entreprise"] + client) + '</span>' +
          '<span class="sep">/</span>' +
          '<span>' + esc(exp["Localisation"]) + '</span>' +
        '</p>' +
        desc +
        (missions ? '<ul class="chapter__missions rev" data-d="2">' + missions + '</ul>' : '') +
        (tech ? '<div class="chapter__tech rev" data-d="2">' + tech + '</div>' : '') +
      '</div>' +
    '</article>';
  }

  function renderFormation(f, i) {
    var desc = (f["Description"] && f["Description"] !== "_")
      ? " — " + esc(f["Description"]) : "";
    return '<article class="edu__row rev"' + (i > 0 ? ' data-d="' + i + '"' : '') + '>' +
      '<span class="edu__per">' + esc(formatPeriode(f["Période"])) + '</span>' +
      '<div>' +
        '<h3 class="edu__name">' + esc(f["Nom"]) + '</h3>' +
        '<p class="edu__meta">' + esc(f["Ecole"]) + ' · ' + esc(f["Localisation"]) + desc + '</p>' +
      '</div>' +
      '<span class="edu__lvl">' + esc(f["Niveau Étude"]) + '</span>' +
    '</article>';
  }

  function renderSkillGroup(grp, i) {
    var chips = (grp["Liste"] || [])
      .map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; })
      .join("");
    return '<div class="skgroup rev"' + (i > 0 ? ' data-d="' + i + '"' : '') + '>' +
      '<p class="skgroup__t">' + esc(grp["Nom"]) + '</p>' +
      '<div class="skgroup__chips">' + chips + '</div>' +
    '</div>';
  }

  function renderAwards(cv) {
    var html = "";
    var idx = 0;

    (cv["Réalisations"] || [])
      .filter(function (r) { return r["Nom"]; })
      .forEach(function (r) {
        html += '<article class="award award--prize rev"' + (idx > 0 ? ' data-d="' + idx + '"' : '') + '>' +
          '<p class="award__k">★ ' + esc(r["Nom"]) + '</p>' +
          '<p class="award__d">' + esc(r["Description"]) + '</p>' +
        '</article>';
        idx++;
      });

    var acadMap = {};
    (cv["Expériences Académiques"] || []).forEach(function (p) {
      acadMap[p["Programme"]] = p["Réalisation"] || [];
    });

    [{ prog: "ESIGELEC", i: 1 }, { prog: "PSB", i: 1 }].forEach(function (sel) {
      var real = (acadMap[sel.prog] || [])[sel.i];
      if (!real || !real["Intitulé"]) return;
      html += '<article class="award rev" data-d="' + idx + '">' +
        '<p class="award__k">Projet académique · ' + esc(sel.prog) + '</p>' +
        '<h3 class="award__t">' + esc(real["Intitulé"]) + '</h3>' +
        '<p class="award__d">' + esc(real["Description"]) + '</p>' +
      '</article>';
      idx++;
    });

    return html;
  }

  function renderLanguage(lang, i) {
    return '<div class="lang rev"' + (i > 0 ? ' data-d="' + i + '"' : '') + '>' +
      '<p class="lang__n">' + esc(lang["Nom"]) + '</p>' +
      '<p class="lang__lv">' + esc(lang["Niveau"]) + '</p>' +
    '</div>';
  }

  function hobbyCard(h, spanClass, delay) {
    var attrs = ' class="life-card ' + spanClass + ' rev"' + (delay ? ' data-d="' + delay + '"' : '');
    var inner = '<h3 class="life-card__t">' + esc(h["Nom"]) + '</h3>' +
      '<p class="life-card__d">' + esc(h["Description"]) + '</p>';
    if (h["Lien"]) {
      inner += '<span class="life-card__link">Voir le portfolio →</span>';
      return '<a href="' + esc(h["Lien"]) + '" target="_blank" rel="noopener"' + attrs + '>' + inner + '</a>';
    }
    return '<div' + attrs + '>' + inner + '</div>';
  }

  function renderHobbies(hobbies) {
    var html = "";
    var spans = ["span4", "span4", "span4", "span3", "span3", "span4", "span4", "span4"];

    for (var i = 0; i < Math.min(3, hobbies.length); i++) {
      html += hobbyCard(hobbies[i], spans[i], i > 0 ? i : null);
    }

    html += '<div class="span6 photo rev" data-d="1">' +
      '<image-slot id="photo1" class="photo-slot" shape="rounded" radius="16"' +
      ' placeholder="Une de vos photos (paysage / portrait)"></image-slot>' +
    '</div>';

    for (var j = 3; j < Math.min(5, hobbies.length); j++) {
      html += hobbyCard(hobbies[j], "span3", j - 2);
    }

    for (var k = 5; k < hobbies.length; k++) {
      html += hobbyCard(hobbies[k], "span4", k > 5 ? k - 5 : null);
    }

    return html;
  }

  function populateAll(cv) {
    var exps = cv["Expériences Professionnelles"] || [];

    /* Pochet : missions + tech (1re expérience) */
    var pochet = exps[0];
    if (pochet) {
      var mEl = document.getElementById("pochet-missions");
      if (mEl) mEl.innerHTML = renderMissions(pochet["Missions"]);
      var tEl = document.getElementById("pochet-tech");
      if (tEl) tEl.innerHTML = renderTechs(pochet["Principales Technologies"]);
    }

    /* Timeline : toutes les expériences sauf la première */
    var timelineEl = document.getElementById("timeline-entries");
    if (timelineEl) {
      timelineEl.innerHTML = exps.slice(1).map(renderExpArticle).join("");
    }

    /* Formations */
    var eduEl = document.getElementById("edu-list");
    if (eduEl) {
      eduEl.innerHTML = (cv["Formations"] || []).map(renderFormation).join("");
    }

    /* Compétences */
    var skEl = document.getElementById("skills-grid");
    if (skEl) {
      skEl.innerHTML = (cv["Compétences"] || []).map(renderSkillGroup).join("");
    }

    /* Réalisations / Awards */
    var awardsEl = document.getElementById("awards-grid");
    if (awardsEl) awardsEl.innerHTML = renderAwards(cv);

    /* Langues */
    var langEl = document.getElementById("lang-grid");
    if (langEl) {
      langEl.innerHTML = (cv["Langues"] || []).map(renderLanguage).join("");
    }

    /* Hobbies */
    var lifeEl = document.getElementById("life-grid");
    if (lifeEl) lifeEl.innerHTML = renderHobbies(cv["Hobbies"] || []);

    /* Recharger logos + animations après injection DOM */
    hydrateTech();
    buildRail();
    collectReveals();
    revealPass();
  }

  function loadCV() {
    fetch("cv.json")
      .then(function (r) { return r.json(); })
      .then(populateAll)
      .catch(function (e) { console.warn("Impossible de charger cv.json :", e); });
  }

  /* ---------- Tech logos (Simple Icons CDN + repli texte) ---------- */
  function hydrateTech() {
    document.querySelectorAll(".tech:not([data-h]), .mini:not([data-h])").forEach(function (el) {
      el.setAttribute("data-h", "1");
      var name = el.getAttribute("data-name") || "";

      var icon = el.getAttribute("data-icon") || "";
      var tip = document.createElement("span");
      tip.className = "tech__tip";
      tip.textContent = name;

      if (icon) {
        var img = new Image();
        img.alt = name;
        img.loading = "lazy";
        img.decoding = "async";
        img.src = "https://cdn.simpleicons.org/" + icon;
        img.addEventListener("error", function () {
          el.innerHTML = "";
          renderText(el, name);
          el.appendChild(tip.cloneNode(true));
        });
        el.appendChild(img);
      } else {
        renderText(el, name);
      }
      el.appendChild(tip);
    });
  }

  function renderText(el, name) {
    var t = document.createElement("span");
    t.className = "tech__txt";
    t.textContent = name;
    el.appendChild(t);
  }

  /* ---------- Constellation: scatter -> assemble ---------- */
  function scatterConstellation() {
    var grid = document.querySelector(".constellation");
    if (!grid) return;
    var tiles = grid.querySelectorAll(".tech");
    tiles.forEach(function (t, i) {
      var ang = (i * 137.5) * Math.PI / 180;
      var rad = 120 + (i % 5) * 60;
      var dx = Math.cos(ang) * rad;
      var dy = Math.sin(ang) * rad * 0.7;
      var rot = ((i % 2 ? 1 : -1) * (8 + (i % 4) * 6));
      t.style.setProperty("--dx", dx.toFixed(0) + "px");
      t.style.setProperty("--dy", dy.toFixed(0) + "px");
      t.style.setProperty("--rot", rot + "deg");
      t.style.transitionDelay = (i * 30) + "ms";
    });
  }

  /* ---------- Reveal on scroll (scroll/resize driven — robust) ---------- */
  var revEls = [];
  function collectReveals() {
    revEls = Array.prototype.slice.call(document.querySelectorAll(".rev, .constellation"));
  }
  function revealPass() {
    if (!revEls.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var trigger = vh * 0.92;
    for (var i = revEls.length - 1; i >= 0; i--) {
      var el = revEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < trigger && r.bottom > 0) {
        el.classList.add("in");
        revEls.splice(i, 1);
      }
    }
  }

  /* ---------- Year rail ---------- */
  var railSections = [];
  var railItems = [];
  function buildRail() {
    var rail = document.querySelector(".rail");
    if (!rail) return;
    rail.innerHTML = "";
    railSections = Array.prototype.slice.call(document.querySelectorAll("[data-year]"));
    if (!railSections.length) return;
    railSections.forEach(function (sec) {
      var b = document.createElement("button");
      b.className = "rail__item";
      b.innerHTML = '<span class="rail__dot"></span><span class="rail__label">' +
        sec.getAttribute("data-year") + "</span>";
      b.addEventListener("click", function () {
        sec.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      rail.appendChild(b);
    });
    railItems = Array.prototype.slice.call(rail.querySelectorAll(".rail__item"));
  }
  function railPass() {
    if (!railSections.length) return;
    var mid = (window.innerHeight || 0) * 0.4;
    var active = 0;
    for (var i = 0; i < railSections.length; i++) {
      var top = railSections[i].getBoundingClientRect().top;
      if (top - mid <= 0) active = i;
    }
    railItems.forEach(function (it, j) { it.classList.toggle("active", j === active); });
  }

  /* ---------- loop ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      revealPass();
      railPass();
      ticking = false;
    });
  }

  function init() {
    hydrateTech();
    scatterConstellation();
    collectReveals();
    buildRail();
    loadCV();
    // initial passes (a few frames to catch late layout/fonts)
    revealPass();
    railPass();
    window.requestAnimationFrame(function () { revealPass(); railPass(); });
    setTimeout(function () { revealPass(); railPass(); }, 250);
    setTimeout(function () { revealPass(); railPass(); }, 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", function () { revealPass(); railPass(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
