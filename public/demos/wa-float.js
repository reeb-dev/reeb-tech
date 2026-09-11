(function () {
  var script = document.currentScript;
  if (!script) return;
  var base = script.src.replace(/wa-float\.js(\?.*)?$/, "");

  if (!document.querySelector('script[src*="reeb-mark.js"]')) {
    var mark = document.createElement("script");
    mark.src = base + "reeb-mark.js?v=rm3";
    mark.async = false;
    document.head.appendChild(mark);
  } else if (window.REEB_MARK && typeof window.REEB_MARK.inject === "function") {
    window.REEB_MARK.inject(base);
  }

  if (document.getElementById("wa-float") || document.querySelector('script[src*="contacto.js"]')) {
    return;
  }

  var s = document.createElement("script");
  s.src = base + "contacto.js?v=wa8";
  s.setAttribute("data-float-only", "1");
  s.setAttribute("data-place", "landing");
  s.setAttribute("data-tone", "usted");
  s.setAttribute("data-phone", "5492915757934");
  s.setAttribute(
    "data-text",
    "Hola, vi este ejemplo y quiero consultar una página web a medida para mi local"
  );
  s.setAttribute("data-subject", "Consulta por un sistema a medida");
  document.body.appendChild(s);
})();
