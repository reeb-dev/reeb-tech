(function () {
  function isHubPath() {
    var path = String(location.pathname || "").replace(/\/+$/, "") || "/";
    return (
      path === "/demos" ||
      path === "/demos/index.html" ||
      /(^|\/)demos\/index\.html$/.test(path) ||
      path === "/" ||
      path === "/index.html"
    );
  }

  function ensureCss(href) {
    if (document.querySelector('link[href*="reeb-mark.css"]')) return;
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = href;
    document.head.appendChild(css);
  }

  function inject(base) {
    if (document.getElementById("reeb-mark") || isHubPath()) return;
    var root = base || "/demos/";
    ensureCss(root + "reeb-mark.css?v=rm3");
    var a = document.createElement("a");
    a.id = "reeb-mark";
    a.href = "/demos/";
    a.title = "Ejemplo by REEB · volver al catálogo";
    a.setAttribute("aria-label", "Ejemplo by REEB · volver al catálogo");
    a.innerHTML =
      '<img src="/brand/reeb-mark.svg?v=rm3" alt="" width="22" height="22">' +
      "<span><em>by</em>REEB</span>";
    (document.body || document.documentElement).appendChild(a);
  }

  var script = document.currentScript;
  var base =
    script && script.src
      ? script.src.replace(/reeb-mark\.js(\?.*)?$/, "")
      : "/demos/";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      inject(base);
    });
  } else {
    inject(base);
  }

  window.REEB_MARK = { inject: inject };
})();
