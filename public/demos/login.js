(function () {
  var script = document.currentScript;
  if (!script || document.getElementById("demo-login") || document.querySelector(".demo-login-session")) return;

  var rubro = script.getAttribute("data-rubro") || "";
  var place = script.getAttribute("data-place") || "panel";
  if (place !== "panel" || !rubro) return;

  var base = script.src.replace(/login\.js(\?.*)?$/, "");
  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "login.css?v=1";
  document.head.appendChild(css);

  var USERS = {
    comercio: [
      { user: "ana", pass: "demo", nombre: "Ana Gómez", rol: "Dueña" },
      { user: "mario", pass: "demo", nombre: "Mario Díaz", rol: "Cajero" }
    ],
    kiosco: [
      { user: "pedro", pass: "demo", nombre: "Pedro López", rol: "Dueño" },
      { user: "lucia", pass: "demo", nombre: "Lucía Pérez", rol: "Cajera" }
    ],
    taller: [
      { user: "hector", pass: "demo", nombre: "Héctor Ruiz", rol: "Dueño" },
      { user: "diego", pass: "demo", nombre: "Diego Molina", rol: "Mecánico" }
    ],
    peluqueria: [
      { user: "camelia", pass: "demo", nombre: "Camelia Sosa", rol: "Dueña" },
      { user: "lucia", pass: "demo", nombre: "Lucía Ferraro", rol: "Profesional" }
    ],
    carpinteria: [
      { user: "martin", pass: "demo", nombre: "Martín Quebracho", rol: "Taller" }
    ],
    facturacion: [
      { user: "laura", pass: "demo", nombre: "Laura Benítez", rol: "Quien factura" }
    ],
    stockfacturacion: [
      { user: "nora", pass: "demo", nombre: "Nora Palacios", rol: "Dueña" },
      { user: "tomas", pass: "demo", nombre: "Tomás Vega", rol: "Depósito" }
    ],
    libreria: [
      { user: "silvia", pass: "demo", nombre: "Silvia Rivadavia", rol: "Dueña" }
    ],
    biblioteca: [
      { user: "marta", pass: "demo", nombre: "Marta Almagro", rol: "Sala" }
    ],
    restaurante: [
      { user: "ernesto", pass: "demo", nombre: "Ernesto Paz", rol: "Caja" },
      { user: "sofia", pass: "demo", nombre: "Sofía Paz", rol: "Cocina" }
    ],
    rotiseria: [
      { user: "claudia", pass: "demo", nombre: "Claudia Ríos", rol: "Dueña" }
    ],
    marketplace: [
      { user: "vale", pass: "demo", nombre: "Valentina Feria", rol: "Vendedora" },
      { user: "admin", pass: "demo", nombre: "Administración", rol: "La feria" }
    ],
    automotores: [
      { user: "pablo", pass: "demo", nombre: "Pablo Herrera", rol: "Vendedor" },
      { user: "gerencia", pass: "demo", nombre: "Gerencia", rol: "Concesionaria" }
    ],
    hospedaje: [
      { user: "elena", pass: "demo", nombre: "Elena Sauce", rol: "Dueña" },
      { user: "recepcion", pass: "demo", nombre: "Recepción", rol: "Turno" }
    ],
    excursiones: [
      { user: "nico", pass: "demo", nombre: "Nico Tornquist", rol: "Operador" },
      { user: "guia", pass: "demo", nombre: "Guía", rol: "Salidas" }
    ],
    complejo: [
      { user: "paula", pass: "demo", nombre: "Paula Palomar", rol: "Recepción" },
      { user: "spa", pass: "demo", nombre: "Spa", rol: "Turnos" }
    ],
    arquitectura: [
      { user: "loma", pass: "demo", nombre: "Estudio Loma", rol: "Estudio" }
    ],
    materiales: [
      { user: "omar", pass: "demo", nombre: "Omar Árido", rol: "Mostrador" },
      { user: "deposito", pass: "demo", nombre: "Depósito", rol: "Stock" }
    ],
    steelframe: [
      { user: "bruno", pass: "demo", nombre: "Bruno Framehaus", rol: "Obras" }
    ],
    estudio: [
      { user: "mesa", pass: "demo", nombre: "Mesa de entradas", rol: "Estudio" }
    ],
    inmobiliaria: [
      { user: "nahuel", pass: "demo", nombre: "Nahuel Huapi", rol: "Agente" },
      { user: "agenda", pass: "demo", nombre: "Agenda", rol: "Visitas" }
    ]
  };

  var users = USERS[rubro];
  if (!users || !users.length) return;

  var key = "demo-login-" + rubro;

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.user) return null;
      return users.filter(function (u) { return u.user === data.user; })[0] || null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(user) {
    localStorage.setItem(key, JSON.stringify({ user: user.user, nombre: user.nombre, rol: user.rol }));
  }

  function clearSession() {
    localStorage.removeItem(key);
  }

  function unlock() {
    document.documentElement.classList.remove("demo-login-locked");
    var gate = document.getElementById("demo-login");
    if (gate) gate.remove();
  }

  function showSession(user) {
    var host = document.querySelector(".top-inner nav") ||
      document.querySelector(".panel-header .inner nav") ||
      document.querySelector("header nav") ||
      document.querySelector("header");
    if (!host || host.querySelector(".demo-login-session")) return;
    var box = document.createElement("div");
    box.className = "demo-login-session";
    box.innerHTML =
      "<span>" + esc(user.nombre) + " · " + esc(user.rol) + "</span>" +
      '<button type="button">Salir</button>';
    box.querySelector("button").addEventListener("click", function () {
      clearSession();
      location.reload();
    });
    host.appendChild(box);
  }

  function enter(user) {
    saveSession(user);
    unlock();
    showSession(user);
  }

  function showGate() {
    document.documentElement.classList.add("demo-login-locked");
    var gate = document.createElement("section");
    gate.id = "demo-login";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "demo-login-title");

    var cards = users.map(function (u) {
      return (
        '<button type="button" data-user="' + esc(u.user) + '">' +
          "<strong>" + esc(u.nombre) + "</strong>" +
          "<span>" + esc(u.rol) + " · usuario " + esc(u.user) + " · clave demo</span>" +
        "</button>"
      );
    }).join("");

    gate.innerHTML =
      '<div class="demo-login-card">' +
        '<p class="demo-login-kicker">Acceso de ejemplo</p>' +
        '<h1 id="demo-login-title">Entre con un usuario del negocio</h1>' +
        "<p class=\"demo-login-lead\">El público no entra al panel. Estas cuentas son de muestra: toque una o escriba la clave <strong>demo</strong>.</p>" +
        '<div class="demo-login-users">' + cards + "</div>" +
        '<form class="demo-login-form" novalidate>' +
          '<label>Usuario<input name="user" autocomplete="username" spellcheck="false"></label>' +
          '<label>Clave<input name="pass" type="password" autocomplete="current-password"></label>' +
          '<p class="demo-login-error" role="alert"></p>' +
          '<button type="submit">Entrar</button>' +
        "</form>" +
        '<p class="demo-login-hint">Demo: no hay servidor ni clave real. En un sistema a medida cada persona tiene la suya.</p>' +
        '<p class="demo-login-hint"><a href="index.html">Volver a la vitrina</a></p>' +
      "</div>";

    (document.body || document.documentElement).appendChild(gate);

    gate.querySelectorAll("[data-user]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var found = users.filter(function (u) { return u.user === btn.getAttribute("data-user"); })[0];
        if (found) enter(found);
      });
    });

    var form = gate.querySelector("form");
    var error = gate.querySelector(".demo-login-error");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var userName = String((form.user && form.user.value) || "").trim().toLowerCase();
      var pass = String((form.pass && form.pass.value) || "");
      var found = users.filter(function (u) { return u.user === userName && u.pass === pass; })[0];
      if (!found) {
        error.textContent = "Usuario o clave no coinciden. Pruebe una cuenta de la lista; la clave es demo.";
        return;
      }
      enter(found);
    });
  }

  function start() {
    var session = loadSession();
    if (session) {
      unlock();
      showSession(session);
      return;
    }
    showGate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
