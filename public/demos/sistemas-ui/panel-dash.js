/**
 * Pintado compartido del tab Resumen en paneles custom.
 * Uso: SisPanelDash.paint({ title, lead, kpis:[{label,value,hint,tone}], attention:[{title,sub}], goPrimary })
 */
(function (w) {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function paint(opts) {
    opts = opts || {};
    var dash = document.getElementById("dash");
    if (!dash) return;
    var kpis = opts.kpis || [];
    var attention = opts.attention || [];
    var cards = kpis
      .map(function (k) {
        return (
          '<article class="dash-card' +
          (k.tone ? " " + esc(k.tone) : "") +
          '"><span>' +
          esc(k.label) +
          "</span><strong>" +
          esc(k.value) +
          "</strong><small>" +
          esc(k.hint || "") +
          "</small></article>"
        );
      })
      .join("");
    var att =
      attention.length === 0
        ? "<p class=\"dash-empty\">Nada urgente por ahora.</p>"
        : "<ul class=\"dash-attn\">" +
          attention
            .map(function (a) {
              return "<li><strong>" + esc(a.title) + "</strong><span>" + esc(a.sub || "") + "</span></li>";
            })
            .join("") +
          "</ul>";
    var tabs = Array.prototype.slice.call(
      document.querySelectorAll('.panel-tabs [data-view]:not([data-view="resumen"])')
    ).slice(0, 3);
    var shortcuts =
      '<div class="dash-shortcuts">' +
      tabs
        .map(function (b) {
          return (
            '<button type="button" data-go="' +
            esc(b.getAttribute("data-view")) +
            '"><strong>' +
            esc(b.textContent.replace(/\s+/g, " ").trim()) +
            "</strong><small>Abrir vista</small></button>"
          );
        })
        .join("") +
      (opts.goPrimary
        ? '<button type="button" data-go-primary="1"><strong>Nuevo</strong><small>Alta rápida</small></button>'
        : "") +
      "</div>";
    dash.innerHTML =
      '<section class="dash-hello"><h2>' +
      esc(opts.title || "Resumen del día") +
      "</h2><p>" +
      esc(opts.lead || "") +
      "</p></section>" +
      '<div class="dash-cards">' +
      cards +
      "</div>" +
      '<section class="dash-block"><h3>Atención ahora</h3><p>Lo que conviene mirar primero.</p>' +
      att +
      "</section>" +
      '<section class="dash-block"><h3>Atajos</h3><p>Ir a trabajar en una vista.</p>' +
      shortcuts +
      "</section>";
    dash.querySelectorAll("[data-go]").forEach(function (b) {
      b.onclick = function () {
        var t = document.querySelector('.panel-tabs [data-view="' + b.getAttribute("data-go") + '"]');
        if (t) t.click();
      };
    });
    var gp = dash.querySelector("[data-go-primary]");
    if (gp) {
      gp.onclick = function () {
        var oc = document.getElementById("open-create");
        if (oc) {
          var primary = opts.goPrimary;
          if (primary) {
            var tab = document.querySelector('.panel-tabs [data-view="' + primary + '"]');
            if (tab) tab.click();
          }
          setTimeout(function () {
            oc.click();
          }, 0);
        }
      };
    }
  }
  w.SisPanelDash = { paint: paint, esc: esc };
})(window);
