(function () {
  var script = document.currentScript;
  if (!script || document.getElementById("wa-float")) return;

  var phone = script.getAttribute("data-phone") || "5492915757934";
  var text =
    script.getAttribute("data-text") ||
    "Hola, vi este ejemplo y quiero consultar una página web a medida para mi local";
  var subject = script.getAttribute("data-subject") || "Consulta por un sistema a medida";
  var title = script.getAttribute("data-title") || "Consultar";
  var place = script.getAttribute("data-place") || "landing";
  var floatOnly = script.getAttribute("data-float-only") === "1";
  var mail = "manuelreeb@icloud.com";
  var waUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);

  var base = script.src.replace(/contacto\.js(\?.*)?$/, "");
  if (!document.querySelector('link[href*="contacto.css"]')) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "contacto.css?v=wa7";
    document.head.appendChild(css);
  }
  if (!document.querySelector('link[href*="Fraunces"]')) {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;600&display=swap";
    document.head.appendChild(font);
  }

  if (place !== "hub") {
    (function injectReebMarkLocal() {
      if (document.getElementById("reeb-mark")) return;
      var path = String(location.pathname || "").replace(/\/+$/, "") || "/";
      if (path === "/demos" || path === "/demos/index.html" || path === "/" || path === "/index.html") return;
      if (!document.querySelector('link[href*="reeb-mark.css"]')) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = base + "reeb-mark.css?v=rm3";
        document.head.appendChild(link);
      }
      var a = document.createElement("a");
      a.id = "reeb-mark";
      a.href = "/demos/";
      a.title = "Ejemplo by REEB · volver al catálogo";
      a.setAttribute("aria-label", "Ejemplo by REEB · volver al catálogo");
      a.innerHTML =
        '<img src="/brand/reeb-mark.svg?v=rm3" alt="" width="22" height="22">' +
        "<span><em>by</em>REEB</span>";
      document.body.appendChild(a);
    })();
  }

  var preciosHref = place === "hub" ? "#precios" : "/demos/#precios";
  var waIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.44-8.45zM12.07 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74 1 .98-3.64-.24-.38a9.86 9.86 0 0 1-1.52-5.3c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.89-9.89 9.89zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>';

  var wa = document.createElement("aside");
  wa.id = "wa-float";
  wa.className = "wa-float wa-float--hub";
  if (place === "panel" || document.body.classList.contains("panel-body") || document.body.classList.contains("panel-page")) {
    wa.classList.add("wa-float--panel");
    document.body.classList.add("panel-body");
  }
  wa.setAttribute("aria-label", "Consulta por WhatsApp");
  wa.innerHTML =
    '<div class="wa-hub-top">' +
    '<p class="wa-hub-kicker">Consulta</p>' +
    '<button type="button" class="wa-hub-min" aria-label="Minimizar consulta" title="Minimizar">×</button>' +
    "</div>" +
    "<h2>¿Quiere una página para su local?</h2>" +
    '<p class="wa-hub-lead">Escríbanos por WhatsApp. Es el camino más directo.</p>' +
    '<a class="wa-hub-btn" href="' +
    waUrl +
    '" target="_blank" rel="noopener noreferrer">' +
    waIcon +
    "Escribir por WhatsApp</a>" +
    '<a class="wa-hub-link" href="' +
    preciosHref +
    '">Ver precios</a>' +
    '<button type="button" class="wa-hub-expand" aria-label="Abrir consulta">Consulta</button>';
  document.body.appendChild(wa);
  themeWaCard(wa);

  (function wireMinimize(card) {
    var key = "reeb-wa-card-min";
    var minBtn = card.querySelector(".wa-hub-min");
    var expandBtn = card.querySelector(".wa-hub-expand");
    function setMin(on) {
      card.classList.toggle("is-min", on);
      try {
        localStorage.setItem(key, on ? "1" : "0");
      } catch (e) {}
    }
    if (minBtn) {
      minBtn.addEventListener("click", function () {
        setMin(true);
      });
    }
    if (expandBtn) {
      expandBtn.addEventListener("click", function () {
        setMin(false);
      });
    }
    try {
      var stored = localStorage.getItem(key);
      if (stored === "1") setMin(true);
      else if (stored === "0") setMin(false);
      // Primera visita en panel: minimizado para no tapar la operación.
      else if (card.classList.contains("wa-float--panel")) setMin(true);
    } catch (e) {}
  })(wa);

  function cssVar(name) {
    var body = getComputedStyle(document.body).getPropertyValue(name).trim();
    if (body) return body;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function parseRgb(color) {
    if (!color) return null;
    var probe = document.createElement("span");
    probe.style.color = color;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    var out = getComputedStyle(probe).color;
    probe.remove();
    var m = out && out.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function luminance(rgb) {
    if (!rgb) return 0;
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  }

  function mixHex(rgb, toward, t) {
    if (!rgb) return toward;
    var tr = toward === "#fff" ? 255 : 0;
    var tg = toward === "#fff" ? 255 : 0;
    var tb = toward === "#fff" ? 255 : 0;
    var r = Math.round(rgb.r + (tr - rgb.r) * t);
    var g = Math.round(rgb.g + (tg - rgb.g) * t);
    var b = Math.round(rgb.b + (tb - rgb.b) * t);
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  function themeWaCard(el) {
    var band = cssVar("--band");
    var ink = cssVar("--ink");
    var brand = cssVar("--brand") || cssVar("--rojo") || cssVar("--primary");
    // --accent suele ser un tint claro: no usarlo como color de marca.
    var gold = cssVar("--gold") || cssVar("--dorado");
    var bg = band || ink || "#1a1510";
    var bgRgb = parseRgb(bg);
    if (bgRgb && luminance(bgRgb) > 0.45) {
      bg = brand ? mixHex(parseRgb(brand), "#000", 0.55) : "#1a1510";
      bgRgb = parseRgb(bg);
    }
    var accent = gold || brand || "#e3c48a";
    var accentRgb = parseRgb(accent);
    if (accentRgb && luminance(accentRgb) > 0.72) {
      accent = brand || "#e3c48a";
      accentRgb = parseRgb(accent);
    }
    if (accentRgb && luminance(accentRgb) < 0.25) {
      accent = mixHex(accentRgb, "#fff", 0.45);
    }
    var border =
      accentRgb
        ? "rgba(" + accentRgb.r + ", " + accentRgb.g + ", " + accentRgb.b + ", 0.34)"
        : "rgba(227, 196, 138, 0.32)";
    el.style.setProperty("--wa-card-bg", bg);
    el.style.setProperty("--wa-card-accent", accent);
    el.style.setProperty("--wa-card-border", border);
    el.style.setProperty("--wa-card-text", "#fbf7f0");
    el.style.setProperty("--wa-card-muted", "rgba(251, 247, 240, 0.78)");
  }

  function wire(root) {
    root.querySelectorAll("a.btn-whatsapp").forEach(function (a) {
      if (a.dataset.waWired) return;
      a.dataset.waWired = "1";
      a.href = waUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  wire(document);
  if (window.MutationObserver) {
    new MutationObserver(function () {
      wire(document);
    }).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (floatOnly) return;

  var section = document.createElement("section");
  section.id = "demo-contacto";
  section.className = "demo-contacto";
  if (place === "hub") section.classList.add("wrap", "is-hub");

  var leadAttr = script.getAttribute("data-lead");

  var lead =
    leadAttr ||
    (place === "panel"
      ? "Canal de ejemplo para un mensaje del cliente. No sale a un servidor."
      : place === "hub"
        ? "Si necesita un sistema parecido al de su rubro, escríbanos por WhatsApp, correo o este formulario. Respondemos a su consulta."
        : "Deje un mensaje o escriba por WhatsApp.");

  var fields =
    place === "hub"
      ? '<label for="hub-nombre">Su nombre<input id="hub-nombre" name="nombre" autocomplete="name" placeholder="Nombre y apellido"></label>' +
        '<label for="hub-email">Su correo<input id="hub-email" name="email" type="email" autocomplete="email" required placeholder="su-correo@ejemplo.com"></label>' +
        '<label for="hub-tel">Su teléfono <span class="demo-contacto-opt">(opcional)</span><input id="hub-tel" name="telefono" type="tel" autocomplete="tel" inputmode="tel" placeholder="291 575-7934"></label>' +
        '<label for="hub-msg">En qué podemos ayudarle<textarea id="hub-msg" name="mensaje" required rows="5" placeholder="Cuéntenos su rubro y qué necesita: kiosco, hotel, taller…"></textarea></label>'
      : '<label for="demo-nombre">Nombre<input id="demo-nombre" name="nombre" autocomplete="name" placeholder="Su nombre"></label>' +
        '<label for="demo-email">Correo<input id="demo-email" name="email" type="email" autocomplete="email" required placeholder="su-correo@ejemplo.com"></label>' +
        '<label for="demo-tel">Teléfono<input id="demo-tel" name="telefono" type="tel" autocomplete="tel" placeholder="294 442-0000"></label>' +
        '<label for="demo-msg">Mensaje<textarea id="demo-msg" name="mensaje" required placeholder="Cuéntenos su consulta"></textarea></label>';

  var afterForm =
    place === "hub"
      ? '<p class="demo-contacto-hint">Al enviar se abre su correo con el mensaje listo. No hay servidor: es el canal de consulta.</p>'
      : '<a class="demo-wa-inline" href="' +
        waUrl +
        '" target="_blank" rel="noopener">WhatsApp · +54 9 291 575-7934</a>' +
        '<a class="demo-mail-inline" href="mailto:' +
        mail +
        '">' +
        mail +
        "</a>";

  var channels =
    place === "hub"
      ? '<div class="demo-contacto-channels">' +
        '<a class="btn btn-primary" href="' +
        waUrl +
        '" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>' +
        '<a class="btn btn-ghost" href="mailto:' +
        mail +
        '">' +
        mail +
        "</a>" +
        '<p class="demo-contacto-phone">WhatsApp · +54 9 2915 75-7934</p>' +
        "</div>"
      : "";

  section.innerHTML =
    "<h2>" +
    title +
    "</h2>" +
    '<p class="demo-contacto-lead">' +
    lead +
    "</p>" +
    channels +
    "<form novalidate>" +
    fields +
    '<p class="demo-contacto-error" role="alert"></p>' +
    '<button type="submit">' +
    (place === "hub" ? "Enviar consulta" : "Enviar mensaje") +
    "</button>" +
    "</form>" +
    afterForm;

  var host = document.getElementById("contacto");
  var info = document.getElementById("info");
  var footer = document.querySelector("footer");
  if (host) host.appendChild(section);
  else if (info) info.appendChild(section);
  else if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);

  var form = section.querySelector("form");
  var error = section.querySelector(".demo-contacto-error");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var email = String(data.get("email") || "").trim();
    var mensaje = String(data.get("mensaje") || "").trim();
    var nombre = String(data.get("nombre") || "").trim();
    var telefono = String(data.get("telefono") || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = "Ingrese un correo válido.";
      return;
    }
    if (!mensaje) {
      error.textContent = "El mensaje no puede quedar vacío.";
      return;
    }
    error.textContent = "";
    showToast("Mensaje enviado (demo)");
    form.reset();
    var body = [
      "Nombre: " + (nombre || "—"),
      "Email: " + email,
      "Teléfono: " + (telefono || "—"),
      "",
      mensaje,
      "",
      "(demo, sin servidor)"
    ].join("\n");
    window.location.href =
      "mailto:" + mail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "demo-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 3200);
  }
})();
