// ZN Specialists: shared behaviour for every page.

// Mobile menu
(function () {
  var header = document.querySelector("header.site");
  var btn = document.querySelector(".menu-btn");
  if (!header || !btn) return;
  btn.addEventListener("click", function () {
    var open = header.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

// Home hero graphic: one-compartment oral PK curve, C(t) ∝ e^(−ke·t) − e^(−ka·t)
(function () {
  var curve = document.getElementById("pk-curve");
  if (!curve) return;
  var NS = "http://www.w3.org/2000/svg";
  var ka = 1.2, ke = 0.25, tEnd = 12;
  var x0 = 56, x1 = 456, yBase = 268, yTop = 68;
  var f = function (t) { return Math.exp(-ke * t) - Math.exp(-ka * t); };
  var tmax = Math.log(ka / ke) / (ka - ke), cmax = f(tmax);
  var X = function (t) { return x0 + (t / tEnd) * (x1 - x0); };
  var Y = function (c) { return yBase - (c / cmax) * (yBase - yTop); };
  var pts = [];
  for (var i = 0; i <= 120; i++) { var t = i * tEnd / 120; pts.push(X(t).toFixed(1) + " " + Y(f(t)).toFixed(1)); }
  var line = "M" + pts.join(" L");
  curve.setAttribute("d", line);
  document.getElementById("pk-area").setAttribute("d", line + " L" + x1 + " " + yBase + " L" + x0 + " " + yBase + " Z");

  function el(tag, attrs, parent, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    parent.appendChild(n); return n;
  }
  var grid = document.getElementById("pk-grid"), ticks = document.getElementById("pk-ticks");
  [0, 2, 4, 6, 8, 10, 12].forEach(function (t) {
    if (t) el("line", { "class": "grid", x1: X(t), x2: X(t), y1: 40, y2: yBase }, grid);
    el("text", { x: X(t), y: yBase + 16, "text-anchor": "middle" }, ticks, String(t));
  });
  var cx = X(tmax), cy = Y(cmax);
  var cm = document.getElementById("pk-cmax"); cm.setAttribute("x1", x0); cm.setAttribute("x2", cx); cm.setAttribute("y1", cy); cm.setAttribute("y2", cy);
  var tm = document.getElementById("pk-tmax"); tm.setAttribute("x1", cx); tm.setAttribute("x2", cx); tm.setAttribute("y1", cy); tm.setAttribute("y2", yBase);
  var lab = document.getElementById("pk-cmax-label"); lab.setAttribute("x", cx + 10); lab.setAttribute("y", cy - 8);
  el("text", { "class": "tag", x: cx, y: yBase - 6, dx: 5 }, ticks, "tmax");
  var obs = document.getElementById("pk-obs");
  [[0.5, .04], [1, -.05], [1.5, .03], [2, -.02], [3, .05], [4, -.03], [6, .02], [8, -.04], [10, .03]].forEach(function (p) {
    el("circle", { "class": "obs", cx: X(p[0]), cy: Y(f(p[0]) * (1 + p[1])), r: 3.5 }, obs);
  });
})();

// Forms: preview only until they're connected to a real inbox or form service
document.querySelectorAll("form[data-preview]").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = form.querySelector(".form-msg");
    var name = (form.querySelector("[name=name]") || {}).value || "";
    var email = (form.querySelector("[name=email]") || {}).value || "";
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) { msg.textContent = "Add your name and a valid email address."; return; }
    msg.textContent = "Thanks, " + name.trim().split(" ")[0] + ". This is a preview, so nothing was sent yet.";
  });
});

// Preselect a dropdown option by its label, e.g. <select data-select="New to pharma">
document.querySelectorAll("[data-select]").forEach(function (sel) {
  var want = sel.getAttribute("data-select");
  Array.prototype.forEach.call(sel.options, function (o) { if (o.text === want) o.selected = true; });
});

// Jobs page filters
(function () {
  var list = document.getElementById("jobs");
  if (!list) return;
  var area = document.getElementById("f-area"), type = document.getElementById("f-type"), loc = document.getElementById("f-loc");
  var count = document.getElementById("job-count"), empty = document.getElementById("jobs-empty");
  function apply() {
    var shown = 0;
    list.querySelectorAll(".job").forEach(function (job) {
      var ok = (!area.value || job.dataset.area === area.value) &&
               (!type.value || job.dataset.type === type.value) &&
               (!loc.value || job.dataset.loc === loc.value);
      job.hidden = !ok; if (ok) shown++;
    });
    count.textContent = shown + (shown === 1 ? " role" : " roles");
    empty.hidden = shown !== 0;
  }
  [area, type, loc].forEach(function (s) { s.addEventListener("change", apply); });
  document.getElementById("f-reset").addEventListener("click", function () { area.value = ""; type.value = ""; loc.value = ""; apply(); });
  apply();
})();

// Photo frames: drop any photo that hasn't been added to images/ yet, so its description shows
document.querySelectorAll(".photo img").forEach(function (img) {
  if (img.complete && img.naturalWidth === 0) img.remove();
  else img.addEventListener("error", function () { img.remove(); });
});
