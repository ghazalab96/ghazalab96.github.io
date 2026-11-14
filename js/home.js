(function () {
  var D = window.SITE_DATA;
  var SW = 1440, SH = 680;
  var PATH = "M180,40 C480,40 800,55 1010,95 C1120,120 1120,230 1000,255 C760,290 480,320 330,370 C200,410 200,500 340,535 C600,565 900,570 1180,560";
  var G = "#2F6F5E";
  var stage = document.getElementById("stage");
  var layerMain = document.getElementById("layer-main");
  var layerChap = document.getElementById("layer-chap");
  var tlwrap = document.getElementById("tlwrap");
  var heroTitle = document.getElementById("hero-title");
  var heroSub = document.getElementById("hero-sub");
  var brand = document.getElementById("brand");
  var backbtn = document.getElementById("backbtn");
  var hint = document.getElementById("hint");
  var view = null, closeTimer = null;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function narrow() { return window.matchMedia("(max-width: 900px)").matches; }

  /* ---------- main view ---------- */
  function renderMain() {
    var nodes = D.main.map(function (m, i) {
      if (i === 0) return '<circle cx="' + m.x + '" cy="' + m.y + '" r="20" fill="#D9822B" fill-opacity="0.2"/><circle cx="' + m.x + '" cy="' + m.y + '" r="10" fill="#D9822B"/>';
      return '<circle cx="' + m.x + '" cy="' + m.y + '" r="9" fill="#F6F3EC" stroke="' + G + '" stroke-width="3"/>';
    }).join("");
    var svg = '<svg viewBox="0 0 ' + SW + ' ' + SH + '" role="img" aria-label="A dashed winding path from today at Schneider Electric back through Computer Science and Data Analysis to Dentistry"><path d="' + PATH + '" fill="none" stroke="' + G + '" stroke-width="2.5" stroke-dasharray="3 11" stroke-linecap="round"/>' + nodes + '</svg>';
    var labels = D.main.map(function (m, i) {
      return '<button type="button" class="lbl' + (i === 0 ? " today" : "") + '" data-open="' + m.key + '" style="' + m.css + ';text-align:' + m.ta + '"><span class="y">' + esc(m.year) + '</span><span class="t">' + esc(m.title) + '</span><span class="l">' + esc(m.line) + '</span></button>' +
        '<button type="button" class="hit" data-open="' + m.key + '" aria-label="Open ' + esc(m.title) + '" tabindex="-1" style="left:' + m.hx + '%;top:' + m.hy + '%"></button>';
    }).join("");
    layerMain.innerHTML = svg + labels;
  }

  /* ---------- chapter view ---------- */
  function renderChap(key) {
    var ch = D.chapters[key];
    var S = ch.last;
    var mid = "m_" + key;
    var nodes = ch.items.map(function (it) {
      var circle = it.kind === "lesson"
        ? '<circle cx="' + it.x + '" cy="' + it.y + '" r="9" fill="#F6F3EC" stroke="' + G + '" stroke-width="3"/>'
        : '<circle cx="' + it.x + '" cy="' + it.y + '" r="9" fill="' + G + '"/>';
      if (it.first) circle = '<circle cx="' + it.x + '" cy="' + it.y + '" r="20" fill="' + G + '" fill-opacity="0.18"/>' + circle;
      return '<g style="animation:fadein 500ms ease ' + it.delay + 's backwards">' + circle + '</g>';
    }).join("");
    var svg = '<svg viewBox="0 0 ' + SW + ' ' + SH + '" role="img" aria-label="' + esc(ch.name) + ': projects and lessons along a dashed path"><defs><mask id="' + mid + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + SW + '" height="' + SH + '"><path d="' + PATH + '" pathLength="1" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + S + ' 2" stroke-dashoffset="' + S + '" style="animation:draw ' + (1.7 * S).toFixed(2) + 's ease-in-out .6s forwards"/></mask></defs><path d="' + PATH + '" fill="none" stroke="' + G + '" stroke-width="2.5" stroke-dasharray="3 11" stroke-linecap="round" mask="url(#' + mid + ')"/>' + nodes + '</svg>';
    var labels = ch.items.map(function (it) {
      var inner = '<span class="y">' + esc(it.year) + '</span><span class="t">' + esc(it.title) + (it.href ? '<span class="arr" aria-hidden="true">&rarr;</span>' : '') + '</span><span class="l">' + esc(it.line) + '</span>';
      var st = it.css + ';text-align:' + it.ta + ';animation:fadein 500ms ease ' + it.delay + 's backwards';
      var cls = "lbl" + (it.kind === "lesson" ? " lesson" : "");
      return it.href ? '<a class="' + cls + '" href="' + esc(it.href) + '" style="' + st + '">' + inner + '</a>' : '<div class="' + cls + '" style="' + st + '">' + inner + '</div>';
    }).join("");
    layerChap.innerHTML = svg + labels;
  }

  /* ---------- mobile list ---------- */
  function renderList(key) {
    var html;
    if (!key) {
      html = '<ol class="tl">' + D.main.map(function (m, i) {
        return '<li class="' + (i === 0 ? "today" : "") + '"><button type="button" class="lbl item" data-open="' + m.key + '"><span class="y">' + esc(m.year) + '</span><span class="t">' + esc(m.title) + '</span><span class="l">' + esc(m.line) + '</span></button></li>';
      }).join("") + "</ol>";
    } else {
      var ch = D.chapters[key];
      html = '<ol class="tl">' + ch.items.map(function (it) {
        var inner = '<span class="y">' + esc(it.year) + '</span><span class="t">' + esc(it.title) + (it.href ? '<span class="arr" aria-hidden="true">&rarr;</span>' : "") + '</span><span class="l">' + esc(it.line) + '</span>';
        var cls = "lbl item" + (it.kind === "lesson" ? " lesson" : "");
        var li = it.kind === "lesson" ? ' class="ring"' : "";
        return "<li" + li + ">" + (it.href ? '<a class="' + cls + '" href="' + esc(it.href) + '">' + inner + "</a>" : '<div class="' + cls + '">' + inner + "</div>") + "</li>";
      }).join("") + "</ol>";
    }
    tlwrap.innerHTML = html;
  }

  /* ---------- state ---------- */
  function setHero(key) {
    if (!key) { heroTitle.textContent = D.hero.title; heroSub.textContent = D.hero.sub; document.title = "Ghazal Arbabzadeh"; return; }
    var ch = D.chapters[key];
    heroTitle.textContent = ch.name; heroSub.textContent = ch.sub;
    document.title = ch.name + " | Ghazal Arbabzadeh";
  }
  function show(key, instant) {
    clearTimeout(closeTimer);
    view = key;
    if (instant) stage.classList.add("instant");
    renderChap(key);
    stage.style.setProperty("--ox", D.chapters[key].ox + "%");
    layerMain.style.transformOrigin = D.chapters[key].ox + "% " + D.chapters[key].oy + "%";
    stage.classList.add("zoomed");
    document.body.classList.add("zoomed");
    setHero(key); renderList(key);
    brand.hidden = true; backbtn.hidden = false;
    if (instant) requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.remove("instant"); }); });
  }
  function hide(instant) {
    var key = view; view = null;
    if (instant) stage.classList.add("instant");
    stage.classList.remove("zoomed");
    document.body.classList.remove("zoomed");
    setHero(null); renderList(null);
    brand.hidden = false; backbtn.hidden = true;
    closeTimer = setTimeout(function () { layerChap.innerHTML = ""; }, instant ? 0 : 900);
    if (instant) requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.remove("instant"); }); });
    return key;
  }
  function open(key) {
    if (!D.chapters[key] || view === key) return;
    show(key, narrow());
    try { history.pushState({ chapter: key, pushed: true }, "", "?chapter=" + key); } catch (e) {}
    backbtn.focus({ preventScroll: true });
  }
  function back() {
    if (!view) return;
    if (history.state && history.state.pushed) { history.back(); return; }
    var key = hide(narrow());
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    focusNode(key);
  }
  function focusNode(key) {
    var el = key && document.querySelector('.lbl[data-open="' + key + '"]');
    if (el && el.offsetParent !== null) el.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (t) { e.preventDefault(); open(t.getAttribute("data-open")); }
  });
  backbtn.addEventListener("click", back);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && view) back(); });
  window.addEventListener("popstate", function () {
    var key = new URLSearchParams(location.search).get("chapter");
    if (key && D.chapters[key]) { if (view !== key) show(key, true); }
    else if (view) { var k = hide(false); focusNode(k); }
  });

  renderMain(); renderList(null);
  var start = new URLSearchParams(location.search).get("chapter");
  if (start && D.chapters[start]) {
    show(start, true);
    try { history.replaceState({ chapter: start }, "", "?chapter=" + start); } catch (e) {}
  }
})();
