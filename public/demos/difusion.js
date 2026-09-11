(function () {
  var script = document.currentScript;
  if (!script || document.getElementById("difusion")) return;

  var rubro = script.getAttribute("data-rubro") || "";
  var place = script.getAttribute("data-place") || "vitrina";
  var base = script.src.replace(/difusion\.js(\?.*)?$/, "");
  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "difusion.css?v=3";
  document.head.appendChild(css);

  var D = {
    web: { id: "web", nombre: "Sitio propio", tipo: "api", fijo: true, beneficio: "La página pública toma el catálogo o la oferta de este panel. No hay aviso pago." },
    ml: { id: "ml", nombre: "Mercado Libre", tipo: "api", beneficio: "Se puede enviar por API. Hace falta el paquete de publicación en ML." },
    zonaprop: { id: "zonaprop", nombre: "Zonaprop", tipo: "api", beneficio: "Conexión tipo OpenNavent. El abono del portal es aparte." },
    argenprop: { id: "argenprop", nombre: "Argenprop", tipo: "api", beneficio: "En un sistema real suele ir por un CRM homologado o un acuerdo con el portal." },
    instagram: { id: "instagram", nombre: "Instagram", tipo: "red", beneficio: "Arma el texto y el enlace. No hay API de avisos como en Mercado Libre." },
    facebook: { id: "facebook", nombre: "Facebook", tipo: "red", beneficio: "Texto listo para la página o grupos. Publicar desde ahí, no desde un aviso de portal." },
    whatsapp: { id: "whatsapp", nombre: "WhatsApp", tipo: "red", beneficio: "Comparte la ficha o el pedido con el mensaje ya armado." },
    google: { id: "google", nombre: "Google", tipo: "red", beneficio: "Ficha del negocio (horario, mapa, reseñas). No reemplaza el catálogo propio." },
    booking: { id: "booking", nombre: "Portales de estadía", tipo: "api", beneficio: "Booking u otros: cuenta y comisión aparte. El panel puede armar el aviso, no incluye el cupo." }
  };

  var RUBROS = {
    comercio: { titulo: "Dónde sale cada producto", carga: "el producto", destinos: ["web", "ml", "instagram", "facebook", "whatsapp"] },
    kiosco: { titulo: "Dónde se muestra el kiosco", carga: "el producto", destinos: ["web", "instagram", "facebook", "whatsapp"] },
    taller: { titulo: "Dónde se muestra el taller", carga: "el servicio", destinos: ["web", "instagram", "facebook", "whatsapp", "google"] },
    peluqueria: { titulo: "Dónde se muestra el salón", carga: "el servicio", destinos: ["web", "instagram", "facebook", "whatsapp", "google"] },
    carpinteria: { titulo: "Dónde se muestra el taller", carga: "el trabajo", destinos: ["web", "instagram", "facebook", "whatsapp"] },
    facturacion: { titulo: "Dónde se presenta el estudio de comprobantes", carga: "el dato", destinos: ["web", "whatsapp"] },
    stockfacturacion: { titulo: "Dónde se muestra el depósito", carga: "el stock", destinos: ["web", "ml", "whatsapp"] },
    libreria: { titulo: "Dónde sale cada título", carga: "el título", destinos: ["web", "ml", "instagram", "facebook", "whatsapp"] },
    biblioteca: { titulo: "Dónde se muestra el catálogo", carga: "el título", destinos: ["web", "instagram", "whatsapp"] },
    restaurante: { titulo: "Dónde se muestra la parrilla", carga: "la carta", destinos: ["web", "instagram", "facebook", "whatsapp", "google"] },
    rotiseria: { titulo: "Dónde sale el menú del día", carga: "el menú", destinos: ["web", "instagram", "facebook", "whatsapp", "google"] },
    marketplace: { titulo: "Dónde sale cada publicación", carga: "la publicación", destinos: ["web", "ml", "instagram", "facebook", "whatsapp"] },
    automotores: { titulo: "Dónde sale cada unidad", carga: "el vehículo", destinos: ["web", "ml", "instagram", "facebook", "whatsapp"] },
    hospedaje: { titulo: "Dónde se publica cada cabaña", carga: "la unidad", destinos: ["web", "booking", "instagram", "facebook", "whatsapp", "google"] },
    excursiones: { titulo: "Dónde se publica cada salida", carga: "la excursión", destinos: ["web", "instagram", "facebook", "whatsapp", "google"] },
    complejo: { titulo: "Dónde se publica el predio", carga: "el paquete", destinos: ["web", "booking", "instagram", "facebook", "whatsapp", "google"] },
    arquitectura: { titulo: "Dónde se muestra el estudio", carga: "la obra", destinos: ["web", "instagram", "facebook", "whatsapp"] },
    materiales: { titulo: "Dónde sale cada material", carga: "el material", destinos: ["web", "ml", "instagram", "whatsapp"] },
    steelframe: { titulo: "Dónde se muestran los modelos", carga: "el modelo", destinos: ["web", "instagram", "facebook", "whatsapp"] },
    estudio: { titulo: "Dónde se presenta el estudio", carga: "la consulta", destinos: ["web", "whatsapp"] },
    inmobiliaria: { titulo: "Dónde sale cada aviso", carga: "la propiedad", destinos: ["web", "ml", "zonaprop", "argenprop", "instagram", "facebook", "whatsapp"] }
  };

  var cfg = RUBROS[rubro];
  if (!cfg) return;

  var destinos = cfg.destinos.map(function (id) { return D[id]; }).filter(Boolean);
  var key = "demo-difusion-" + rubro;
  var defaults = {};
  destinos.forEach(function (d) {
    defaults[d.id] = { connected: Boolean(d.fijo) || d.id === "whatsapp" };
  });

  function loadCuentas() {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.setItem(key, JSON.stringify(defaults));
        return Object.assign({}, defaults);
      }
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, defaults);
    }
  }

  function saveCuentas(cuentas) {
    localStorage.setItem(key, JSON.stringify(cuentas));
  }

  function on(cuentas, id, dest) {
    if (dest.fijo) return true;
    return Boolean(cuentas[id] && cuentas[id].connected);
  }

  function texto() {
    var titulo = document.title.replace(/\s+·.*/, "").replace(/\s+—.*$/, "");
    return titulo + "\n" + cfg.titulo + "\nindex.html";
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  var cuentas = loadCuentas();
  var section = document.createElement("section");
  section.id = "difusion";
  section.className = "demo-difusion" + (place === "panel" ? " is-panel" : " is-vitrina");

  function lista(items) {
    if (!items.length) return "la web";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + " o " + items[1];
    return items.slice(0, -1).join(", ") + " o " + items[items.length - 1];
  }

  function render() {
    var extras = destinos.filter(function (d) { return d.id !== "web"; }).map(function (d) { return d.nombre; });
    var destinosTxt = lista(extras);
    var intro = place === "panel"
      ? "Conecte las cuentas de " + destinosTxt + ". Ejemplo: no se envía nada afuera. En un sistema real, un portal (si el rubro lo usa) va por API desde el servidor. El aviso pago de cada portal se contrata aparte."
      : "Se carga " + cfg.carga + " una vez en el panel. Esta web toma esa información. Desde ahí se arma el aviso para " + destinosTxt + ". Los avisos pagos se contratan aparte.";

    var cards = destinos.map(function (dest) {
      var connected = on(cuentas, dest.id, dest);
      var accion = dest.fijo
        ? '<span class="demo-cuenta-fijo">Siempre activa</span>'
        : '<button type="button" data-cuenta="' + esc(dest.id) + '">' + (connected ? "Desconectar" : "Conectar (ejemplo)") + "</button>";
      return (
        '<article class="demo-cuenta' + (connected ? " is-on" : "") + '">' +
          '<p class="demo-cuenta-tipo">' + (dest.tipo === "api" ? "API / portal" : dest.id === "google" ? "Ficha" : "Red") + "</p>" +
          "<h3>" + esc(dest.nombre) + "</h3>" +
          "<p>" + esc(dest.beneficio) + "</p>" +
          '<p class="demo-cuenta-meta">' + (connected ? "Lista para usar" : "Sin conectar") + "</p>" +
          accion +
        "</article>"
      );
    }).join("");

    var extra = place === "panel"
      ? '<div class="demo-difusion-acciones">' +
          '<button type="button" id="demo-difusion-copiar">Copiar texto para redes</button>' +
          '<a href="' + esc("https://wa.me/?text=" + encodeURIComponent(texto())) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
        "</div>"
      : '<div class="demo-difusion-acciones"><a href="panel.html#difusion">Ver difusión en el panel</a></div>';

    section.innerHTML =
      '<p class="demo-difusion-kicker">Una carga · varios destinos</p>' +
      "<h2>" + esc(cfg.titulo) + "</h2>" +
      "<p>" + esc(intro) + "</p>" +
      '<div class="demo-cuentas">' + cards + "</div>" +
      extra;

    section.querySelectorAll("[data-cuenta]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-cuenta");
        var dest = destinos.filter(function (d) { return d.id === id; })[0];
        if (!dest || dest.fijo) return;
        var next = !on(cuentas, id, dest);
        cuentas[id] = { connected: next };
        saveCuentas(cuentas);
        render();
      });
    });

    var copiar = section.querySelector("#demo-difusion-copiar");
    if (copiar) {
      copiar.addEventListener("click", function () {
        var t = texto();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).catch(function () {});
        }
      });
    }
  }

  render();

  if (place === "panel") {
    var header = document.querySelector("header.top") || document.querySelector(".panel-header") || document.querySelector("header");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(section, header.nextSibling);
    } else {
      var toolbar = document.querySelector(".toolbar");
      if (toolbar && toolbar.parentNode) toolbar.parentNode.insertBefore(section, toolbar.nextSibling);
      else (document.querySelector(".app") || document.body).appendChild(section);
    }
  } else {
    var host = document.getElementById("contacto") || document.querySelector(".contact-host");
    var info = document.getElementById("info");
    var footer = document.querySelector("footer");
    if (host && host.parentNode) host.parentNode.insertBefore(section, host);
    else if (info && info.parentNode) info.parentNode.insertBefore(section, info);
    else if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
  }
})();
