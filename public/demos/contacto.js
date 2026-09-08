(function () {
  var script = document.currentScript;
  if (!script || document.getElementById("wa-float")) return;

  var phone = script.getAttribute("data-phone") || "5492915757934";
  var text = script.getAttribute("data-text") || "Hola, quiero consultar por esta demo";
  var subject = script.getAttribute("data-subject") || "Consulta demo";
  var title = script.getAttribute("data-title") || "Escribinos";
  var place = script.getAttribute("data-place") || "landing";
  var mail = "manuelreeb@icloud.com";
  var waUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);

  var base = script.src.replace(/contacto\.js(\?.*)?$/, "");
  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "contacto.css";
  document.head.appendChild(css);

  var wa = document.createElement("a");
  wa.id = "wa-float";
  wa.className = "wa-float";
  wa.href = waUrl;
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Escribir por WhatsApp");
  wa.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.44-8.45zM12.07 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74 1 .98-3.64-.24-.38a9.86 9.86 0 0 1-1.52-5.3c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.89-9.89 9.89zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>';
  document.body.appendChild(wa);

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
    new MutationObserver(function () { wire(document); }).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  var section = document.createElement("section");
  section.id = "demo-contacto";
  section.className = "demo-contacto";
  if (place === "hub") section.classList.add("wrap");

  var lead = place === "panel"
    ? "Canal de ejemplo para un mensaje del cliente. No sale a un servidor."
    : place === "hub"
      ? "Si necesita un sistema parecido al de su rubro, escriba por este formulario, WhatsApp o correo."
      : "Dejá un mensaje o escribí por WhatsApp.";

  section.innerHTML =
    "<h2>" + title + "</h2>" +
    '<p class="demo-contacto-lead">' + lead + "</p>" +
    '<form novalidate>' +
      '<label>Nombre<input name="nombre" autocomplete="name" placeholder="Nombre"></label>' +
      '<label>Email<input name="email" type="email" autocomplete="email" required placeholder="correo@ejemplo.com"></label>' +
      '<label>Teléfono<input name="telefono" type="tel" autocomplete="tel" placeholder="11 4000-1234"></label>' +
      '<label>Mensaje<textarea name="mensaje" required placeholder="Contanos qué necesitás"></textarea></label>' +
      '<p class="demo-contacto-error" role="alert"></p>' +
      '<button type="submit">Enviar mensaje</button>' +
    "</form>" +
    '<a class="demo-wa-inline" href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp · +54 9 291 575-7934</a>' +
    '<a class="demo-mail-inline" href="mailto:' + mail + '">' + mail + "</a>";

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
      error.textContent = "Ingresá un email válido.";
      return;
    }
    if (!mensaje) {
      error.textContent = "El mensaje no puede estar vacío.";
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
    window.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "demo-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 3200);
  }
})();
