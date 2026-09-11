(function () {
  var KEY = "sistema-turnos-v1";
  var seed = window.TURNOS_SEED;
  var state = load();
  var filter = "todos";
  var selected = null;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { turnos: seed.turnos.slice(), profesionales: seed.profesionales.slice() };
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function labelEstado(e) {
    return ({ pendiente: "Pendiente", en_curso: "En curso", atendido: "Atendido", cancelado: "Cancelado" })[e] || e;
  }

  function badgeClass(e) {
    if (e === "atendido") return "is-ok";
    if (e === "cancelado") return "is-bad";
    if (e === "en_curso") return "is-warn";
    return "";
  }

  function filtered() {
    var list = state.turnos.slice().sort(function (a, b) {
      return (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
    });
    if (filter === "todos") return list;
    return list.filter(function (t) { return t.profesional === filter; });
  }

  function renderStats() {
    var all = state.turnos;
    var counts = {
      total: all.length,
      pendiente: all.filter(function (t) { return t.estado === "pendiente"; }).length,
      en_curso: all.filter(function (t) { return t.estado === "en_curso"; }).length,
      atendido: all.filter(function (t) { return t.estado === "atendido"; }).length
    };
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Turnos</span><strong>' + counts.total + "</strong></div>" +
      '<div class="stat"><span>Pendientes</span><strong>' + counts.pendiente + "</strong></div>" +
      '<div class="stat"><span>En curso</span><strong>' + counts.en_curso + "</strong></div>" +
      '<div class="stat"><span>Atendidos</span><strong>' + counts.atendido + "</strong></div>";
  }

  function renderFilters() {
    var host = document.getElementById("filters");
    var opts = ["todos"].concat(state.profesionales);
    host.innerHTML = opts.map(function (p) {
      var label = p === "todos" ? "Todos" : p;
      return '<button type="button" data-f="' + esc(p) + '" class="' + (filter === p ? "on" : "") + '">' + esc(label) + "</button>";
    }).join("");
    host.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-f");
        render();
      });
    });
  }

  function renderRows() {
    var rows = document.getElementById("rows");
    var list = filtered();
    rows.innerHTML = list.map(function (t) {
      return (
        '<tr data-id="' + esc(t.id) + '" class="' + (selected === t.id ? "is-on" : "") + '">' +
          "<td>" + esc(t.hora) + "<div style=\"color:var(--muted);font-size:0.8rem\">" + esc(t.fecha) + "</div></td>" +
          "<td>" + esc(t.cliente) + "</td>" +
          "<td>" + esc(t.servicio) + "</td>" +
          "<td>" + esc(t.profesional) + "</td>" +
          '<td><span class="badge-state ' + badgeClass(t.estado) + '">' + esc(labelEstado(t.estado)) + "</span></td>" +
        "</tr>"
      );
    }).join("") || '<tr><td colspan="5">Sin turnos en este filtro.</td></tr>';
    rows.querySelectorAll("tr[data-id]").forEach(function (tr) {
      tr.addEventListener("click", function () {
        selected = tr.getAttribute("data-id");
        render();
      });
    });
  }

  function renderSheet() {
    var sheet = document.getElementById("sheet");
    var t = state.turnos.filter(function (x) { return x.id === selected; })[0];
    if (!t) {
      sheet.innerHTML = "<p>Elija un turno de la lista.</p>";
      return;
    }
    var foto = t.profesional === "Lucía" ? "img/servicio-1.jpg" : t.profesional === "Ana" ? "img/servicio-2.jpg" : "img/equipo.jpg";
    sheet.innerHTML =
      '<img class="sheet-hero" src="' + foto + '" alt="">' +
      "<h3>" + esc(t.cliente) + "</h3>" +
      "<p><strong>" + esc(t.hora) + "</strong> · " + esc(t.fecha) + "</p>" +
      "<p>" + esc(t.servicio) + " · " + esc(t.profesional) + "</p>" +
      "<p>Tel: " + esc(t.tel || "—") + "</p>" +
      "<p>Notas: " + esc(t.notas || "—") + "</p>" +
      '<p>Estado: <span class="badge-state ' + badgeClass(t.estado) + '">' + esc(labelEstado(t.estado)) + "</span></p>" +
      '<div class="actions">' +
        '<button type="button" data-s="en_curso">En curso</button>' +
        '<button type="button" data-s="atendido">Atendido</button>' +
        '<button type="button" data-s="cancelado">Cancelar</button>' +
        '<button type="button" data-s="pendiente">Pendiente</button>' +
      "</div>";
    sheet.querySelectorAll("[data-s]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        t.estado = btn.getAttribute("data-s");
        save();
        render();
      });
    });
  }

  function render() {
    renderStats();
    renderFilters();
    renderRows();
    renderSheet();
  }

  var form = document.getElementById("create");
  var sel = form.profesional;
  seed.profesionales.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    sel.appendChild(o);
  });
  form.fecha.value = "2026-09-11";

  document.getElementById("open-create").addEventListener("click", function () {
    form.hidden = !form.hidden;
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var fd = new FormData(form);
    var item = {
      id: "t" + Date.now(),
      fecha: String(fd.get("fecha")),
      hora: String(fd.get("hora")),
      cliente: String(fd.get("cliente")).trim(),
      tel: String(fd.get("tel") || "").trim(),
      profesional: String(fd.get("profesional")),
      servicio: String(fd.get("servicio")).trim(),
      notas: String(fd.get("notas") || "").trim(),
      estado: "pendiente"
    };
    state.turnos.push(item);
    selected = item.id;
    save();
    form.reset();
    form.fecha.value = "2026-09-11";
    form.hidden = true;
    render();
  });

  render();

  var resetBtn = document.getElementById("reset-sample");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!confirm("¿Restablecer los datos de ejemplo de este panel?")) return;
      localStorage.removeItem("sistema-turnos-v1");
      location.reload();
    });
  }
})();
