(function () {
  var KEY = "sistema-turnos-v3";
  var seed = window.TURNOS_SEED;
  var state = load();
  var view = "agenda";
  var filter = "todos";
  var waFilter = "nuevos";
  var search = "";
  var selected = null;
  var selectedWa = null;
  var editingTurno = null;
  var editingCliente = null;
  var editingServicio = null;
  var editingPro = null;

  function clone(list) {
    return JSON.parse(JSON.stringify(list || []));
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (!parsed.waInbox) parsed.waInbox = clone(seed.waInbox);
        return parsed;
      }
    } catch (e) {}
    return {
      turnos: clone(seed.turnos),
      clientes: clone(seed.clientes),
      servicios: clone(seed.servicios),
      profesionales: clone(seed.profesionales),
      waInbox: clone(seed.waInbox)
    };
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function money(n) { return "$ " + Number(n || 0).toLocaleString("es-AR"); }
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 1800);
  }
  function byId(list, id) {
    return (list || []).filter(function (x) { return x.id === id; })[0];
  }
  function labelEstado(e) {
    return ({ pendiente: "Pendiente", en_curso: "En curso", atendido: "Atendido", cancelado: "Cancelado" })[e] || e;
  }
  function badgeClass(e) {
    if (e === "atendido" || e === "confirmado") return "is-ok";
    if (e === "cancelado" || e === "rechazado") return "is-bad";
    if (e === "en_curso" || e === "nuevo") return "is-warn";
    return "";
  }
  function labelWa(e) {
    return ({ nuevo: "Nuevo", confirmado: "Confirmado", rechazado: "Rechazado" })[e] || e;
  }
  function waNuevos() {
    return state.waInbox.filter(function (w) { return w.estado === "nuevo"; }).length;
  }
  function updateWaBadge() {
    var n = waNuevos();
    var badge = document.getElementById("wa-badge");
    badge.hidden = n === 0;
    badge.textContent = String(n);
  }
  function findClienteByTel(tel) {
    var t = String(tel || "").replace(/\D/g, "");
    return state.clientes.filter(function (c) {
      return String(c.tel || "").replace(/\D/g, "") === t && t;
    })[0];
  }
  function ensureCliente(nombre, tel) {
    var existing = findClienteByTel(tel);
    if (existing) return existing;
    var neu = {
      id: "c" + Date.now(),
      nombre: nombre,
      tel: tel || "",
      email: "",
      notas: "Alta desde WhatsApp",
      foto: "img/hero.jpg"
    };
    state.clientes.unshift(neu);
    return neu;
  }

  function fillSelects(form) {
    form = form || document.getElementById("create");
    var c = form.querySelector("[name=clienteId]");
    var p = form.querySelector("[name=profesionalId]");
    var s = form.querySelector("[name=servicioId]");
    if (c) {
      c.innerHTML = state.clientes.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.nombre) + "</option>";
      }).join("");
    }
    if (p) {
      p.innerHTML = state.profesionales.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.nombre) + "</option>";
      }).join("");
    }
    if (s) {
      s.innerHTML = state.servicios.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.nombre) + " · " + money(x.precio) + "</option>";
      }).join("");
    }
  }

  function showView(name) {
    view = name;
    ["resumen", "agenda", "whatsapp", "clientes", "servicios", "equipo"].forEach(function (v) {
      var el = document.getElementById("view-" + v);
      if (el) el.classList.toggle("panel-hidden", v !== name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === name);
    });
    document.getElementById("open-create").classList.toggle("panel-hidden", name !== "agenda");
    document.getElementById("view-title").textContent = ({
      resumen: "Resumen del día",
      agenda: "Agenda de turnos",
      whatsapp: "Pedidos por WhatsApp",
      clientes: "Clientes",
      servicios: "Servicios",
      equipo: "Equipo"
    })[name] || name;
    var stats = document.getElementById("stats");
    if (stats) stats.classList.toggle("panel-hidden", name === "resumen");
    if (name === "resumen") {
      renderDashboard();
      return;
    }
    render();
  }

  function renderDashboard() {
    if (!window.SisPanelDash) return;
    var list = state.turnos || [];
    var pend = list.filter(function (t) { return t.estado === "pendiente" || t.estado === "en_curso"; });
    SisPanelDash.paint({
      title: "Agenda de hoy",
      lead: "Turnos, WhatsApp y equipo en un vistazo.",
      goPrimary: "agenda",
      kpis: [
        { label: "Turnos", value: list.length, hint: "En agenda" },
        { label: "Pendientes", value: pend.length, hint: "Requieren atención", tone: "warn" },
        { label: "Atendidos", value: list.filter(function (t) { return t.estado === "atendido"; }).length, hint: "Cerrados", tone: "ok" }
      ],
      attention: pend.slice(0, 5).map(function (t) {
        var c = byId(state.clientes, t.clienteId) || {};
        return { title: (t.hora || "") + " · " + (c.nombre || "Cliente"), sub: labelEstado(t.estado) };
      })
    });
  }

  function filteredTurnos() {
    var list = state.turnos.slice().sort(function (a, b) {
      return (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
    });
    if (filter === "pendiente" || filter === "en_curso" || filter === "atendido" || filter === "cancelado") {
      list = list.filter(function (t) { return t.estado === filter; });
    } else if (filter === "whatsapp") {
      list = list.filter(function (t) { return t.origen === "whatsapp"; });
    } else if (filter !== "todos") {
      list = list.filter(function (t) { return t.profesionalId === filter; });
    }
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (t) {
        var c = byId(state.clientes, t.clienteId) || {};
        var s = byId(state.servicios, t.servicioId) || {};
        var p = byId(state.profesionales, t.profesionalId) || {};
        return [c.nombre, s.nombre, p.nombre, t.notas, t.hora, t.origen].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function renderStats() {
    var all = state.turnos;
    var hoy = all.filter(function (t) { return t.fecha === "2026-09-11"; });
    var total$ = hoy.filter(function (t) { return t.estado === "atendido"; }).reduce(function (a, t) {
      var s = byId(state.servicios, t.servicioId);
      return a + (s ? Number(s.precio) : 0);
    }, 0);
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Hoy</span><strong>' + hoy.length + "</strong></div>" +
      '<div class="stat"><span>Pendientes</span><strong>' + all.filter(function (t) { return t.estado === "pendiente"; }).length + "</strong></div>" +
      '<div class="stat"><span>WhatsApp nuevos</span><strong>' + waNuevos() + "</strong></div>" +
      '<div class="stat"><span>Cobrados hoy</span><strong>' + money(total$) + "</strong></div>";
  }

  function renderFilters() {
    var opts = [
      ["todos", "Todos"],
      ["pendiente", "Pendientes"],
      ["en_curso", "En curso"],
      ["atendido", "Atendidos"],
      ["whatsapp", "Desde WhatsApp"]
    ];
    state.profesionales.forEach(function (p) { opts.push([p.id, p.nombre]); });
    document.getElementById("filters").innerHTML = opts.map(function (o) {
      return '<button type="button" data-f="' + esc(o[0]) + '" class="' + (filter === o[0] ? "on" : "") + '">' + esc(o[1]) + "</button>";
    }).join("");
    document.querySelectorAll("#filters button").forEach(function (b) {
      b.onclick = function () { filter = b.getAttribute("data-f"); render(); };
    });
  }

  function openEditTurno(t) {
    editingTurno = t.id;
    var form = document.getElementById("create");
    form.hidden = false;
    fillSelects(form);
    form.id.value = t.id;
    form.fecha.value = t.fecha;
    form.hora.value = t.hora;
    form.clienteId.value = t.clienteId;
    form.profesionalId.value = t.profesionalId;
    form.servicioId.value = t.servicioId;
    form.notas.value = t.notas || "";
    document.getElementById("create-submit").textContent = "Actualizar turno";
    document.getElementById("create-cancel").hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function resetTurnoForm() {
    editingTurno = null;
    var form = document.getElementById("create");
    form.reset();
    form.id.value = "";
    form.fecha.value = "2026-09-11";
    fillSelects(form);
    document.getElementById("create-submit").textContent = "Guardar turno";
    document.getElementById("create-cancel").hidden = true;
  }

  function deleteTurno(id) {
    if (!confirm("¿Eliminar este turno?")) return;
    state.turnos = state.turnos.filter(function (t) { return t.id !== id; });
    if (selected === id) selected = null;
    save();
    toast("Turno eliminado");
    render();
  }

  function renderAgenda() {
    renderStats();
    renderFilters();
    updateWaBadge();
    var rows = document.getElementById("rows");
    var list = filteredTurnos();
    rows.innerHTML = list.map(function (t) {
      var c = byId(state.clientes, t.clienteId) || { nombre: "—" };
      var s = byId(state.servicios, t.servicioId) || { nombre: "—" };
      var p = byId(state.profesionales, t.profesionalId) || { nombre: "—" };
      var origen = t.origen === "whatsapp"
        ? '<span class="origen-pill is-wa">WhatsApp</span>'
        : '<span class="origen-pill">Panel</span>';
      return '<tr data-id="' + esc(t.id) + '" class="' + (selected === t.id ? "is-on" : "") + '">' +
        "<td>" + esc(t.hora) + '<div style="color:var(--muted);font-size:0.8rem">' + esc(t.fecha) + "</div></td>" +
        "<td>" + esc(c.nombre) + "</td>" +
        "<td>" + esc(s.nombre) + '<div style="color:var(--muted);font-size:0.8rem">' + money(s.precio || 0) + "</div></td>" +
        "<td>" + esc(p.nombre) + "</td>" +
        "<td>" + origen + "</td>" +
        '<td><span class="badge-state ' + badgeClass(t.estado) + '">' + esc(labelEstado(t.estado)) + "</span></td></tr>";
    }).join("") || '<tr><td colspan="6">Sin turnos en este filtro.</td></tr>';
    rows.querySelectorAll("tr[data-id]").forEach(function (tr) {
      tr.onclick = function () { selected = tr.getAttribute("data-id"); render(); };
    });

    var sheet = document.getElementById("sheet");
    var t = byId(state.turnos, selected);
    if (!t) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un turno de la lista.</p>';
      return;
    }
    var c = byId(state.clientes, t.clienteId) || {};
    var s = byId(state.servicios, t.servicioId) || {};
    var p = byId(state.profesionales, t.profesionalId) || {};
    var foto = s.foto || p.foto || "img/hero.jpg";
    sheet.innerHTML =
      '<img class="sheet-hero" src="' + esc(foto) + '" alt="">' +
      "<h3>" + esc(c.nombre || "Cliente") + "</h3>" +
      "<p><strong>" + esc(t.hora) + "</strong> · " + esc(t.fecha) + "</p>" +
      "<p>" + esc(s.nombre || "") + " · " + money(s.precio || 0) + " · " + esc(String(s.minutos || "")) + " min</p>" +
      "<p>Profesional: " + esc(p.nombre || "") + "</p>" +
      "<p>Tel: " + esc(c.tel || "—") + "</p>" +
      "<p>Notas: " + esc(t.notas || "—") + "</p>" +
      "<p>Origen: " + (t.origen === "whatsapp" ? "WhatsApp" : "Panel") + "</p>" +
      '<p><span class="badge-state ' + badgeClass(t.estado) + '">' + esc(labelEstado(t.estado)) + "</span></p>" +
      '<div class="actions">' +
        '<button type="button" data-s="en_curso">En curso</button>' +
        '<button type="button" data-s="atendido">Atendido</button>' +
        '<button type="button" data-s="cancelado">Cancelar</button>' +
        '<button type="button" data-s="pendiente">Pendiente</button>' +
        '<button type="button" id="edit-turno">Editar</button>' +
        '<button type="button" id="del-turno">Eliminar</button>' +
        '<button type="button" id="wa-turno">Texto WhatsApp</button>' +
      "</div>";
    sheet.querySelectorAll("[data-s]").forEach(function (b) {
      b.onclick = function () {
        t.estado = b.getAttribute("data-s");
        save();
        toast("Estado: " + labelEstado(t.estado));
        render();
      };
    });
    sheet.querySelector("#edit-turno").onclick = function () { openEditTurno(t); };
    sheet.querySelector("#del-turno").onclick = function () { deleteTurno(t.id); };
    sheet.querySelector("#wa-turno").onclick = function () {
      var msg = "Hola " + (c.nombre || "") + ", le confirmamos su turno el " + t.fecha + " a las " + t.hora +
        " (" + (s.nombre || "servicio") + " con " + (p.nombre || "") + ").";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(function () { toast("Texto copiado"); });
      } else prompt("Copie el texto", msg);
    };
  }

  function filteredWa() {
    var list = state.waInbox.slice().sort(function (a, b) {
      return String(b.recibido).localeCompare(String(a.recibido));
    });
    if (waFilter === "nuevos") list = list.filter(function (w) { return w.estado === "nuevo"; });
    else if (waFilter !== "todos") list = list.filter(function (w) { return w.estado === waFilter; });
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (w) {
        return [w.from, w.tel, w.mensaje].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function confirmWa(w, opts) {
    opts = opts || {};
    var fecha = opts.fecha || w.fechaSugerida;
    var hora = opts.hora || w.horaSugerida;
    var servicioId = opts.servicioId || w.servicioId;
    var profesionalId = opts.profesionalId || w.profesionalId;
    var cliente = ensureCliente(w.from, w.tel);
    var turno = {
      id: "t" + Date.now(),
      fecha: fecha,
      hora: hora,
      clienteId: cliente.id,
      profesionalId: profesionalId,
      servicioId: servicioId,
      notas: "Pedido por WhatsApp: " + (w.mensaje || "").slice(0, 80),
      estado: "pendiente",
      origen: "whatsapp"
    };
    state.turnos.unshift(turno);
    w.estado = "confirmado";
    w.turnoId = turno.id;
    w.fechaSugerida = fecha;
    w.horaSugerida = hora;
    w.servicioId = servicioId;
    w.profesionalId = profesionalId;
    selected = turno.id;
    save();
    toast("Turno confirmado en la agenda");
    showView("agenda");
  }

  function rejectWa(w) {
    if (!confirm("¿Rechazar este pedido?")) return;
    w.estado = "rechazado";
    save();
    toast("Pedido rechazado");
    render();
  }

  function renderWhatsapp() {
    updateWaBadge();
    document.getElementById("wa-stats").innerHTML =
      '<div class="stat"><span>Nuevos</span><strong>' + waNuevos() + "</strong></div>" +
      '<div class="stat"><span>Confirmados</span><strong>' + state.waInbox.filter(function (w) { return w.estado === "confirmado"; }).length + "</strong></div>" +
      '<div class="stat"><span>Rechazados</span><strong>' + state.waInbox.filter(function (w) { return w.estado === "rechazado"; }).length + "</strong></div>" +
      '<div class="stat"><span>Total</span><strong>' + state.waInbox.length + "</strong></div>";

    var opts = [["nuevos", "Nuevos"], ["confirmado", "Confirmados"], ["rechazado", "Rechazados"], ["todos", "Todos"]];
    document.getElementById("wa-filters").innerHTML = opts.map(function (o) {
      return '<button type="button" data-f="' + o[0] + '" class="' + (waFilter === o[0] ? "on" : "") + '">' + o[1] + "</button>";
    }).join("");
    document.querySelectorAll("#wa-filters button").forEach(function (b) {
      b.onclick = function () { waFilter = b.getAttribute("data-f"); render(); };
    });

    var list = filteredWa();
    document.getElementById("wa-rows").innerHTML = list.map(function (w) {
      var s = byId(state.servicios, w.servicioId) || { nombre: "—" };
      var horaTxt = (w.fechaSugerida || "—") + " " + (w.horaSugerida || "");
      var breve = (w.mensaje || "").slice(0, 48) + ((w.mensaje || "").length > 48 ? "…" : "");
      var rec = (w.recibido || "").replace("T", " ").slice(0, 16);
      return '<tr data-id="' + esc(w.id) + '" class="' + (selectedWa === w.id ? "is-on" : "") + '">' +
        "<td>" + esc(rec) + "</td>" +
        "<td>" + esc(w.from) + '<div style="color:var(--muted);font-size:0.8rem">' + esc(w.tel || "") + "</div></td>" +
        "<td>" + esc(breve) + "</td>" +
        "<td>" + esc(s.nombre) + '<div style="color:var(--muted);font-size:0.8rem">' + esc(horaTxt) + "</div></td>" +
        '<td><span class="badge-state ' + badgeClass(w.estado) + '">' + esc(labelWa(w.estado)) + "</span></td></tr>";
    }).join("") || '<tr><td colspan="5">Sin mensajes en este filtro.</td></tr>';
    document.querySelectorAll("#wa-rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () { selectedWa = tr.getAttribute("data-id"); render(); };
    });

    var sheet = document.getElementById("wa-sheet");
    var w = byId(state.waInbox, selectedWa);
    if (!w) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un mensaje de WhatsApp.</p>';
      return;
    }
    var s = byId(state.servicios, w.servicioId) || {};
    var p = byId(state.profesionales, w.profesionalId) || {};
    var servOpts = state.servicios.map(function (x) {
      return '<option value="' + esc(x.id) + '"' + (x.id === w.servicioId ? " selected" : "") + ">" + esc(x.nombre) + "</option>";
    }).join("");
    var proOpts = state.profesionales.map(function (x) {
      return '<option value="' + esc(x.id) + '"' + (x.id === w.profesionalId ? " selected" : "") + ">" + esc(x.nombre) + "</option>";
    }).join("");
    sheet.innerHTML =
      "<h3>" + esc(w.from) + "</h3>" +
      "<p>Tel: " + esc(w.tel || "—") + "</p>" +
      "<p>Recibido: " + esc((w.recibido || "").replace("T", " ").slice(0, 16)) + "</p>" +
      '<div class="wa-bubble">' + esc(w.mensaje) + "</div>" +
      '<p><span class="badge-state ' + badgeClass(w.estado) + '">' + esc(labelWa(w.estado)) + "</span></p>" +
      (w.estado === "nuevo" ? (
        '<form class="create" id="wa-confirm" style="margin-top:0.5rem">' +
          "<label>Fecha<input name=\"fecha\" type=\"date\" value=\"" + esc(w.fechaSugerida || "") + "\" required></label>" +
          "<label>Hora<input name=\"hora\" type=\"time\" value=\"" + esc(w.horaSugerida || "") + "\" required></label>" +
          "<label>Servicio<select name=\"servicioId\" required>" + servOpts + "</select></label>" +
          "<label>Profesional<select name=\"profesionalId\" required>" + proOpts + "</select></label>" +
          '<button type="submit">Confirmar y agendar</button>' +
          '<button type="button" id="wa-reject" class="btn-soft">Rechazar</button>' +
          '<button type="button" id="wa-copy" class="btn-soft">Copiar respuesta</button>' +
        "</form>"
      ) : (
        "<p>Servicio: " + esc(s.nombre || "—") + "</p>" +
        "<p>Profesional: " + esc(p.nombre || "—") + "</p>" +
        "<p>Sugerido: " + esc(w.fechaSugerida || "—") + " " + esc(w.horaSugerida || "") + "</p>" +
        (w.turnoId ? "<p>Turno en agenda: " + esc(w.turnoId) + "</p>" : "") +
        '<div class="actions"><button type="button" id="wa-copy">Copiar respuesta</button>' +
        (w.turnoId ? '<button type="button" id="wa-goto">Ver en agenda</button>' : "") +
        "</div>"
      ));

    var form = sheet.querySelector("#wa-confirm");
    if (form) {
      form.onsubmit = function (ev) {
        ev.preventDefault();
        var fd = new FormData(form);
        confirmWa(w, {
          fecha: String(fd.get("fecha")),
          hora: String(fd.get("hora")),
          servicioId: String(fd.get("servicioId")),
          profesionalId: String(fd.get("profesionalId"))
        });
      };
      sheet.querySelector("#wa-reject").onclick = function () { rejectWa(w); };
    }
    var copyBtn = sheet.querySelector("#wa-copy");
    if (copyBtn) {
      copyBtn.onclick = function () {
        var msg;
        if (w.estado === "confirmado") {
          msg = "Hola " + w.from + ", le confirmamos el turno el " + w.fechaSugerida + " a las " + w.horaSugerida + ". ¡Lo esperamos!";
        } else if (w.estado === "rechazado") {
          msg = "Hola " + w.from + ", por ahora no tenemos lugar en ese horario. ¿Le sirve otra fecha?";
        } else {
          msg = "Hola " + w.from + ", recibimos su pedido. ¿Confirmamos " + (s.nombre || "el servicio") +
            " el " + w.fechaSugerida + " a las " + w.horaSugerida + "?";
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(msg).then(function () { toast("Respuesta copiada"); });
        } else prompt("Copie", msg);
      };
    }
    var go = sheet.querySelector("#wa-goto");
    if (go) {
      go.onclick = function () {
        selected = w.turnoId;
        showView("agenda");
      };
    }
  }

  function renderClientes() {
    var q = search.toLowerCase();
    var list = state.clientes.filter(function (c) {
      return !q || (c.nombre + " " + c.tel + " " + c.email).toLowerCase().indexOf(q) !== -1;
    });
    document.getElementById("clientes-grid").innerHTML = list.map(function (c) {
      return '<article class="mini-card" data-id="' + esc(c.id) + '"><img src="' + esc(c.foto || "img/hero.jpg") + '" alt="">' +
        '<div class="body"><strong>' + esc(c.nombre) + "</strong><span>" + esc(c.tel || "Sin teléfono") +
        "</span><span style=\"display:block;margin-top:0.35rem\">" + esc(c.notas || "") + "</span>" +
        '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div>' +
        "</div></article>";
    }).join("") || "<p>Sin clientes.</p>";
    document.querySelectorAll("#clientes-grid [data-edit]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        var c = byId(state.clientes, id);
        if (!c) return;
        editingCliente = id;
        var form = document.getElementById("create-cliente");
        form.id.value = c.id;
        form.nombre.value = c.nombre;
        form.tel.value = c.tel || "";
        form.email.value = c.email || "";
        form.notas.value = c.notas || "";
        document.getElementById("cliente-submit").textContent = "Actualizar cliente";
        document.getElementById("cliente-cancel").hidden = false;
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
    document.querySelectorAll("#clientes-grid [data-del]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        var used = state.turnos.some(function (t) { return t.clienteId === id; });
        if (used && !confirm("Este cliente tiene turnos. ¿Eliminar igual?")) return;
        if (!used && !confirm("¿Eliminar cliente?")) return;
        state.clientes = state.clientes.filter(function (c) { return c.id !== id; });
        save();
        fillSelects();
        toast("Cliente eliminado");
        render();
      };
    });
  }

  function renderServicios() {
    document.getElementById("servicios-grid").innerHTML = state.servicios.map(function (s) {
      return '<article class="mini-card" data-id="' + esc(s.id) + '"><img src="' + esc(s.foto || "img/hero.jpg") + '" alt="">' +
        '<div class="body"><strong>' + esc(s.nombre) + "</strong><span>" + esc(String(s.minutos)) + " min · " + money(s.precio) +
        "</span>" +
        '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div>' +
        "</div></article>";
    }).join("");
    document.querySelectorAll("#servicios-grid [data-edit]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        var s = byId(state.servicios, id);
        if (!s) return;
        editingServicio = id;
        var form = document.getElementById("create-servicio");
        form.id.value = s.id;
        form.nombre.value = s.nombre;
        form.minutos.value = s.minutos;
        form.precio.value = s.precio;
        document.getElementById("servicio-submit").textContent = "Actualizar servicio";
        document.getElementById("servicio-cancel").hidden = false;
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
    document.querySelectorAll("#servicios-grid [data-del]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        if (!confirm("¿Eliminar servicio?")) return;
        state.servicios = state.servicios.filter(function (s) { return s.id !== id; });
        save();
        fillSelects();
        toast("Servicio eliminado");
        render();
      };
    });
  }

  function renderEquipo() {
    document.getElementById("equipo-grid").innerHTML = state.profesionales.map(function (p) {
      var n = state.turnos.filter(function (t) { return t.profesionalId === p.id && t.fecha === "2026-09-11"; }).length;
      return '<article class="mini-card" data-id="' + esc(p.id) + '"><img src="' + esc(p.foto || "img/hero.jpg") + '" alt="">' +
        '<div class="body"><strong>' + esc(p.nombre) + "</strong><span>" + esc(p.rol) +
        "</span><span style=\"display:block;margin-top:0.35rem\">" + n + " turnos hoy</span>" +
        '<div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div>' +
        "</div></article>";
    }).join("");
    document.querySelectorAll("#equipo-grid [data-edit]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        var p = byId(state.profesionales, id);
        if (!p) return;
        editingPro = id;
        var form = document.getElementById("create-pro");
        form.id.value = p.id;
        form.nombre.value = p.nombre;
        form.rol.value = p.rol || "";
        document.getElementById("pro-submit").textContent = "Actualizar profesional";
        document.getElementById("pro-cancel").hidden = false;
        form.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
    document.querySelectorAll("#equipo-grid [data-del]").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        var id = b.closest("[data-id]").getAttribute("data-id");
        if (!confirm("¿Eliminar profesional?")) return;
        state.profesionales = state.profesionales.filter(function (p) { return p.id !== id; });
        save();
        fillSelects();
        toast("Profesional eliminado");
        render();
      };
    });
  }

  function render() {
    updateWaBadge();
    if (view === "resumen") { renderDashboard(); return; }
    if (view === "agenda") renderAgenda();
    if (view === "whatsapp") renderWhatsapp();
    if (view === "clientes") renderClientes();
    if (view === "servicios") renderServicios();
    if (view === "equipo") renderEquipo();
  }

  document.querySelectorAll(".panel-tabs button").forEach(function (b) {
    b.addEventListener("click", function () { showView(b.getAttribute("data-view")); });
  });
  document.getElementById("open-create").onclick = function () {
    var form = document.getElementById("create");
    if (form.hidden) {
      resetTurnoForm();
      form.hidden = false;
    } else {
      form.hidden = true;
      resetTurnoForm();
    }
  };
  document.getElementById("create-cancel").onclick = function () {
    document.getElementById("create").hidden = true;
    resetTurnoForm();
  };
  document.getElementById("search").oninput = function (e) {
    search = e.target.value.trim();
    render();
  };
  document.getElementById("reset-sample").onclick = function () {
    if (!confirm("¿Restablecer todos los datos de ejemplo?")) return;
    localStorage.removeItem(KEY);
    location.reload();
  };
  document.getElementById("simular-wa").onclick = function () {
    var samples = [
      { from: "Nadia Cruz", tel: "2915553001", mensaje: "Hola, ¿hay turno de corte dama para hoy a la tarde?", servicioId: "s1", hora: "18:00" },
      { from: "Bruno Ortiz", tel: "2915553002", mensaje: "Quiero barba y corte con Marco si se puede", servicioId: "s4", hora: "11:30" },
      { from: "Paula Gómez", tel: "2915553003", mensaje: "Buenas, manicura para el sábado por la mañana", servicioId: "s3", hora: "10:00" }
    ];
    var s = samples[state.waInbox.length % samples.length];
    var item = {
      id: "w" + Date.now(),
      from: s.from,
      tel: s.tel,
      mensaje: s.mensaje,
      servicioId: s.servicioId,
      fechaSugerida: "2026-09-11",
      horaSugerida: s.hora,
      profesionalId: state.profesionales[0] ? state.profesionales[0].id : "lucia",
      estado: "nuevo",
      recibido: new Date().toISOString().slice(0, 19)
    };
    state.waInbox.unshift(item);
    selectedWa = item.id;
    waFilter = "nuevos";
    save();
    toast("Llegó un pedido por WhatsApp");
    render();
  };

  var form = document.getElementById("create");
  form.fecha.value = "2026-09-11";
  fillSelects(form);
  form.onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(form);
    var id = String(fd.get("id") || "");
    var payload = {
      fecha: String(fd.get("fecha")),
      hora: String(fd.get("hora")),
      clienteId: String(fd.get("clienteId")),
      profesionalId: String(fd.get("profesionalId")),
      servicioId: String(fd.get("servicioId")),
      notas: String(fd.get("notas") || "")
    };
    if (id && byId(state.turnos, id)) {
      var t = byId(state.turnos, id);
      Object.keys(payload).forEach(function (k) { t[k] = payload[k]; });
      selected = id;
      toast("Turno actualizado");
    } else {
      var item = {
        id: "t" + Date.now(),
        estado: "pendiente",
        origen: "panel"
      };
      Object.keys(payload).forEach(function (k) { item[k] = payload[k]; });
      state.turnos.unshift(item);
      selected = item.id;
      toast("Turno guardado");
    }
    save();
    form.hidden = true;
    resetTurnoForm();
    render();
  };

  document.getElementById("create-cliente").onsubmit = function (ev) {
    ev.preventDefault();
    var formC = ev.target;
    var fd = new FormData(formC);
    var id = String(fd.get("id") || "");
    var payload = {
      nombre: String(fd.get("nombre")).trim(),
      tel: String(fd.get("tel") || ""),
      email: String(fd.get("email") || ""),
      notas: String(fd.get("notas") || "")
    };
    if (id && byId(state.clientes, id)) {
      var c = byId(state.clientes, id);
      Object.keys(payload).forEach(function (k) { c[k] = payload[k]; });
      toast("Cliente actualizado");
    } else {
      state.clientes.unshift({
        id: "c" + Date.now(),
        foto: "img/hero.jpg",
        nombre: payload.nombre,
        tel: payload.tel,
        email: payload.email,
        notas: payload.notas
      });
      toast("Cliente guardado");
    }
    save();
    fillSelects();
    formC.reset();
    formC.id.value = "";
    editingCliente = null;
    document.getElementById("cliente-submit").textContent = "Guardar cliente";
    document.getElementById("cliente-cancel").hidden = true;
    render();
  };
  document.getElementById("cliente-cancel").onclick = function () {
    var formC = document.getElementById("create-cliente");
    formC.reset();
    formC.id.value = "";
    editingCliente = null;
    document.getElementById("cliente-submit").textContent = "Guardar cliente";
    document.getElementById("cliente-cancel").hidden = true;
  };

  document.getElementById("create-servicio").onsubmit = function (ev) {
    ev.preventDefault();
    var formS = ev.target;
    var fd = new FormData(formS);
    var id = String(fd.get("id") || "");
    var payload = {
      nombre: String(fd.get("nombre")).trim(),
      minutos: Number(fd.get("minutos") || 30),
      precio: Number(fd.get("precio") || 0)
    };
    if (id && byId(state.servicios, id)) {
      var s = byId(state.servicios, id);
      Object.keys(payload).forEach(function (k) { s[k] = payload[k]; });
      toast("Servicio actualizado");
    } else {
      state.servicios.unshift({
        id: "s" + Date.now(),
        foto: "img/servicio-1.jpg",
        nombre: payload.nombre,
        minutos: payload.minutos,
        precio: payload.precio
      });
      toast("Servicio guardado");
    }
    save();
    fillSelects();
    formS.reset();
    formS.id.value = "";
    editingServicio = null;
    document.getElementById("servicio-submit").textContent = "Guardar servicio";
    document.getElementById("servicio-cancel").hidden = true;
    render();
  };
  document.getElementById("servicio-cancel").onclick = function () {
    var formS = document.getElementById("create-servicio");
    formS.reset();
    formS.id.value = "";
    editingServicio = null;
    document.getElementById("servicio-submit").textContent = "Guardar servicio";
    document.getElementById("servicio-cancel").hidden = true;
  };

  document.getElementById("create-pro").onsubmit = function (ev) {
    ev.preventDefault();
    var formP = ev.target;
    var fd = new FormData(formP);
    var id = String(fd.get("id") || "");
    var payload = {
      nombre: String(fd.get("nombre")).trim(),
      rol: String(fd.get("rol") || "").trim()
    };
    if (id && byId(state.profesionales, id)) {
      var p = byId(state.profesionales, id);
      Object.keys(payload).forEach(function (k) { p[k] = payload[k]; });
      toast("Profesional actualizado");
    } else {
      state.profesionales.unshift({
        id: "p" + Date.now(),
        foto: "img/equipo.jpg",
        nombre: payload.nombre,
        rol: payload.rol
      });
      toast("Profesional guardado");
    }
    save();
    fillSelects();
    formP.reset();
    formP.id.value = "";
    editingPro = null;
    document.getElementById("pro-submit").textContent = "Guardar profesional";
    document.getElementById("pro-cancel").hidden = true;
    render();
  };
  document.getElementById("pro-cancel").onclick = function () {
    var formP = document.getElementById("create-pro");
    formP.reset();
    formP.id.value = "";
    editingPro = null;
    document.getElementById("pro-submit").textContent = "Guardar profesional";
    document.getElementById("pro-cancel").hidden = true;
  };

  showView("resumen");
})();
