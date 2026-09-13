(function () {
  var script = document.currentScript;
  if (!script || document.getElementById("demo-login") || document.querySelector(".demo-login-session")) return;

  var rubro = script.getAttribute("data-rubro") || "";
  var place = script.getAttribute("data-place") || "panel";
  var lang = script.getAttribute("data-lang") || "es";
  var isEnglish = lang === "en";
  if (place !== "panel" || !rubro) return;

  var copy = isEnglish ? {
    exit: "Sign out",
    user: "user",
    password: "password",
    kicker: "Example access",
    title: "Sign in with a business user",
    lead: "Customers do not access the admin panel. These are sample accounts: choose one or enter the password <strong>demo</strong>.",
    userLabel: "User",
    passwordLabel: "Password",
    enter: "Sign in",
    hint: "Demo: there is no server or real password. In a custom system, each person has their own account.",
    back: "Back to the website",
    error: "The user or password does not match. Choose an account from the list; the password is demo."
  } : {
    exit: "Salir",
    user: "usuario",
    password: "clave",
    kicker: "Acceso de ejemplo",
    title: "Entre con un usuario del negocio",
    lead: "El público no entra al panel. Estas cuentas son de muestra: toque una o escriba la clave <strong>demo</strong>.",
    userLabel: "Usuario",
    passwordLabel: "Clave",
    enter: "Entrar",
    hint: "Demo: no hay servidor ni clave real. En un sistema a medida cada persona tiene la suya.",
    back: "Volver a la página",
    error: "Usuario o clave no coinciden. Pruebe una cuenta de la lista; la clave es demo."
  };

  var base = script.src.replace(/login\.js(\?.*)?$/, "");
  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "login.css?v=1";
  document.head.appendChild(css);

  if (!document.querySelector('script[src*="reeb-mark.js"]')) {
    var mark = document.createElement("script");
    mark.src = base + "reeb-mark.js?v=rm4";
    mark.async = false;
    document.head.appendChild(mark);
  } else if (window.REEB_MARK && typeof window.REEB_MARK.inject === "function") {
    window.REEB_MARK.inject(base);
  }

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
    ],
    turnos: [
      { user: "lucia", pass: "demo", nombre: "Lucía Agenda", rol: "Recepción" },
      { user: "marco", pass: "demo", nombre: "Marco", rol: "Profesional" }
    ],
    cotizaciones: [
      { user: "nora", pass: "demo", nombre: "Nora Méndez", rol: "Mostrador" }
    ],
    cuentacorriente: [
      { user: "raul", pass: "demo", nombre: "Raúl Castro", rol: "Caja" }
    ],
    comandas: [
      { user: "caja", pass: "demo", nombre: "Caja", rol: "Salón" },
      { user: "cocina", pass: "demo", nombre: "Cocina", rol: "Preparación" }
    ],
    reservas: [
      { user: "elena", pass: "demo", nombre: "Elena Recepción", rol: "Recepción" }
    ],
    ordenes: [
      { user: "hector", pass: "demo", nombre: "Héctor OT", rol: "Taller" }
    ],
    inventario: [
      { user: "nora", pass: "demo", nombre: "Nora Palacios", rol: "Depósito" },
      { user: "demo", pass: "demo", nombre: "Demo", rol: "Depósito" }
    ],
    stockalertas: [
      { user: "nora", pass: "demo", nombre: "Nora Stock", rol: "Depósito" }
    ],
    visitas: [
      { user: "diego", pass: "demo", nombre: "Diego Campo", rol: "Técnico" }
    ],
    takeaway: [
      { user: "caja", pass: "demo", nombre: "Mostrador", rol: "Pedidos" }
    ],
    cuotas: [
      { user: "raul", pass: "demo", nombre: "Raúl Cobros", rol: "Caja" }
    ],
    obra: [
      { user: "martin", pass: "demo", nombre: "Martín Obra", rol: "Obra" }
    ],
    fichas: [
      { user: "lucia", pass: "demo", nombre: "Lucía Fichas", rol: "Consultorio" }
    ],
    flota: [
      { user: "pablo", pass: "demo", nombre: "Pablo Flota", rol: "Logística" }
    ],
    eventos: [
      { user: "paula", pass: "demo", nombre: "Paula Eventos", rol: "Salón" }
    ],
    abonos: [
      { user: "vale", pass: "demo", nombre: "Vale Abonos", rol: "Recepción" }
    ],
    mayorista: [
      { user: "ana", pass: "demo", nombre: "Ana Mayorista", rol: "Ventas" }
    ],
    reparto: [
      { user: "luis", pass: "demo", nombre: "Luis Reparto", rol: "Chofer" }
    ],
    contratos: [
      { user: "mesa", pass: "demo", nombre: "Mesa Contratos", rol: "Admin" }
    ],

  };

  var users = USERS[rubro];
  if (!users || !users.length) return;
  if (isEnglish && rubro === "comercio") {
    users = users.map(function (user) {
      return Object.assign({}, user, {
        rol: user.rol === "Dueña" ? "Owner" : user.rol === "Cajero" ? "Cashier" : user.rol
      });
    });
  }
  if (isEnglish && rubro === "restaurante") {
    users = users.map(function (user) {
      return Object.assign({}, user, {
        rol: user.rol === "Caja" ? "Front of house" : user.rol === "Cocina" ? "Kitchen" : user.rol
      });
    });
  }

  var key = "demo-login-" + rubro + "-" + lang;

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
      '<button type="button">' + copy.exit + "</button>";
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
          "<span>" + esc(u.rol) + " · " + copy.user + " " + esc(u.user) + " · " + copy.password + " demo</span>" +
        "</button>"
      );
    }).join("");

    gate.innerHTML =
      '<div class="demo-login-card">' +
        '<p class="demo-login-kicker">' + copy.kicker + "</p>" +
        '<h1 id="demo-login-title">' + copy.title + "</h1>" +
        '<p class="demo-login-lead">' + copy.lead + "</p>" +
        '<div class="demo-login-users">' + cards + "</div>" +
        '<form class="demo-login-form" novalidate>' +
          "<label>" + copy.userLabel + '<input name="user" autocomplete="username" spellcheck="false"></label>' +
          "<label>" + copy.passwordLabel + '<input name="pass" type="password" autocomplete="current-password"></label>' +
          '<p class="demo-login-error" role="alert"></p>' +
          '<button type="submit">' + copy.enter + "</button>" +
        "</form>" +
        '<p class="demo-login-hint">' + copy.hint + "</p>" +
        '<p class="demo-login-hint"><a href="index.html">' + copy.back + "</a></p>" +
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
        error.textContent = copy.error;
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
    if (script.getAttribute("data-auto-enter") === "1") {
      enter(users[0]);
      return;
    }
    showGate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
