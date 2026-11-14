(function () {
  var el = document.getElementById("yr");
  if (!el) return;
  var now = new Date().getFullYear();
  el.textContent = now > 2025 ? "2025-" + now : "2025";
})();
