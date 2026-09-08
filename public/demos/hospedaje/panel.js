let items = loadReservas();
let habitaciones = loadHabitaciones();
let selected = items[0]?.id || "";
let filter = "todos";
let editingHab = "";

const viewReservas = document.getElementById("view-reservas");
const viewHab = document.getElementById("view-habitaciones");
const tabReservas = document.getElementById("tab-reservas");
const tabHab = document.getElementById("tab-habitaciones");
const openCreate = document.getElementById("open-create");

function showView(name) {
  viewReservas.classList.toggle("panel-hidden", name !== "reservas");
  viewHab.classList.toggle("panel-hidden", name !== "habitaciones");
  tabReservas.classList.toggle("on", name === "reservas");
  tabHab.classList.toggle("on", name === "habitaciones");
  openCreate.classList.toggle("panel-hidden", name !== "reservas");
  if (name === "habitaciones") renderHabAdmin();
}

tabReservas.addEventListener("click", () => showView("reservas"));
tabHab.addEventListener("click", () => showView("habitaciones"));

const createHabSelect = document.querySelector("#create [name='habitacion']");
createHabSelect.innerHTML = habitaciones.map((h) =>
  `<option value="${esc(h.id)}">${esc(h.nombre)}</option>`
).join("");

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    codigo: `H-${String(items.length + 20).padStart(3, "0")}`,
    habitacionId: String(data.get("habitacion") || ""),
    checkin: String(data.get("checkin") || ""),
    checkout: String(data.get("checkout") || ""),
    huespedes: Number(data.get("huespedes") || 1),
    cliente: { nombre: String(data.get("cliente") || ""), tel: String(data.get("tel") || ""), email: "" },
    notas: String(data.get("notas") || ""),
    status: "confirmada",
    origen: "recepcion",
    factura: null,
    history: [{ when: "hoy", text: "Alta desde el panel." }]
  };
  items = [item, ...items];
  selected = item.id;
  saveReservas(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Reserva creada");
  render();
});

function visible() {
  return filter === "todos" ? items : items.filter((item) => item.status === filter);
}

function render() {
  const counts = {
    pendiente: items.filter((i) => i.status === "pendiente").length,
    confirmada: items.filter((i) => i.status === "confirmada").length,
    checkin: items.filter((i) => i.status === "checkin").length
  };

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>reservas</button>
    <button type="button" data-filter="pendiente" class="${filter === "pendiente" ? "on" : ""}"><strong>${counts.pendiente}</strong>pendientes</button>
    <button type="button" data-filter="confirmada" class="${filter === "confirmada" ? "on" : ""}"><strong>${counts.confirmada}</strong>confirmadas</button>
    <button type="button" data-filter="checkin" class="${filter === "checkin" ? "on" : ""}"><strong>${counts.checkin}</strong>en casa</button>
  `;

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => {
    const hab = getHabitacion(item.habitacionId, habitaciones);
    return `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(hab?.imagen || "img/hero.jpg")}" alt="">
          <span><strong>${esc(item.codigo)}</strong><br><small>${esc(fmtDate(item.checkin))} → ${esc(fmtDate(item.checkout))}</small></span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}<br><small>${item.huespedes} pers.</small></td>
      <td>${esc(hab?.nombre || item.habitacionId)}</td>
      <td class="amount">${esc(money(calcTotal(item, habitaciones)))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">No hay reservas en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una reserva del listado.</p>";
    return;
  }

  const hab = getHabitacion(item.habitacionId, habitaciones);
  const total = calcTotal(item, habitaciones);
  const n = nights(item.checkin, item.checkout);

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)} · ${n} noche${n === 1 ? "" : "s"}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.tel) || "Sin teléfono"}</p>
    <img class="detail-photo" src="${esc(hab?.imagen || "img/hero.jpg")}" alt="">

    <div class="meta">
      <div><span>Unidad</span>${esc(hab?.nombre || "—")}</div>
      <div><span>Huéspedes</span>${item.huespedes}</div>
      <div><span>Check-in</span>${esc(fmtDate(item.checkin))}</div>
      <div><span>Check-out</span>${esc(fmtDate(item.checkout))}</div>
      <div><span>Total</span><strong>${esc(money(total))}</strong></div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>

    ${item.notas ? `<p style="font-size:13px;background:var(--blush);padding:8px;border-radius:6px;">${esc(item.notas)}</p>` : ""}

    <div class="actions">
      ${item.status === "confirmada" || item.status === "pendiente" ? `<button class="btn-panel" type="button" id="do-checkin">Registrar check-in</button>` : ""}
      ${item.status === "checkin" ? `<button class="btn-panel" type="button" id="do-checkout">Registrar check-out</button>` : ""}
    </div>

    ${item.factura ? `
      <div class="factura-box">
        <h4>✓ Factura de hospedaje</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA — hospedaje</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;">
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:var(--muted);margin-top:8px;">Demo: genera CAE simulado. En un sistema real se conecta a ARCA/AFIP.</p>
      </div>
    `}

    <form id="edit">
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Notas<textarea name="notas">${esc(item.notas)}</textarea></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Cancelar reserva</button>
      </div>
    </form>

    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  const checkinBtn = detail.querySelector("#do-checkin");
  if (checkinBtn) {
    checkinBtn.addEventListener("click", () => {
      item.status = "checkin";
      item.history = [{ when: "hoy", text: "Check-in registrado." }, ...(item.history || [])];
      saveReservas(items);
      showToast("Check-in listo");
      render();
    });
  }
  const checkoutBtn = detail.querySelector("#do-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      item.status = "checkout";
      item.history = [{ when: "hoy", text: "Check-out registrado." }, ...(item.history || [])];
      saveReservas(items);
      showToast("Check-out listo");
      render();
    });
  }

  const emitirBtn = detail.querySelector("#emitir-factura");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#arca-tipo").value;
      const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
      const cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
      item.factura = { tipo, numero, cae, vto, total: calcTotal(item, habitaciones) };
      item.history = [{ when: "hoy", text: `Factura de hospedaje ${compLabel(tipo)}. CAE: ${cae}` }, ...(item.history || [])];
      saveReservas(items);
      showToast("Factura emitida");
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prev = item.status;
    item.status = String(data.get("status") || item.status);
    item.notas = String(data.get("notas") || "");
    if (prev !== item.status) {
      item.history = [{ when: "hoy", text: `Estado: ${label(item.status)}.` }, ...(item.history || [])];
    }
    saveReservas(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    item.status = "cancelada";
    item.history = [{ when: "hoy", text: "Reserva cancelada." }, ...(item.history || [])];
    saveReservas(items);
    showToast("Reserva cancelada");
    render();
  });
}

document.getElementById("open-hab").addEventListener("click", () => {
  editingHab = "";
  document.getElementById("create-hab").classList.toggle("open");
  document.getElementById("create-hab").reset();
});

document.getElementById("create-hab").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    tipo: String(data.get("tipo") || "cabana"),
    descripcion: String(data.get("descripcion") || "").trim(),
    precio: Number(data.get("precio") || 0),
    pax: Number(data.get("pax") || 2),
    metros: Number(data.get("metros") || 30),
    amenities: String(data.get("amenities") || "").split(",").map((s) => s.trim()).filter(Boolean),
    imagen: String(data.get("imagen") || "img/hero.jpg"),
    publicado: true
  };
  if (editingHab) {
    habitaciones = habitaciones.map((h) => h.id === editingHab ? { ...h, ...payload } : h);
    showToast("Unidad actualizada");
  } else {
    habitaciones = [{ id: crypto.randomUUID(), ...payload }, ...habitaciones];
    showToast("Unidad publicada");
  }
  editingHab = "";
  saveHabitaciones(habitaciones);
  event.target.reset();
  event.target.classList.remove("open");
  renderHabAdmin();
});

function renderHabAdmin() {
  document.getElementById("habGrid").innerHTML = habitaciones.map((h) => `
    <article class="trabajo-admin">
      <img src="${esc(h.imagen)}" alt="${esc(h.nombre)}">
      <div>
        <h3>${esc(h.nombre)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(tipoLabel(h.tipo))} · ${h.pax} pers. · ${esc(money(h.precio))}/noche</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit="${esc(h.id)}">Editar</button>
          <button class="ghost" type="button" data-del="${esc(h.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("") || "<p style='padding:0 24px'>No hay unidades.</p>";

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const h = habitaciones.find((x) => x.id === btn.dataset.edit);
      if (!h) return;
      editingHab = h.id;
      const form = document.getElementById("create-hab");
      form.classList.add("open");
      form.nombre.value = h.nombre;
      form.tipo.value = h.tipo;
      form.precio.value = h.precio;
      form.pax.value = h.pax;
      form.metros.value = h.metros;
      form.imagen.value = h.imagen;
      form.descripcion.value = h.descripcion || "";
      form.amenities.value = (h.amenities || []).join(", ");
    });
  });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar esta unidad de la carta?")) return;
      habitaciones = habitaciones.filter((h) => h.id !== btn.dataset.del);
      saveHabitaciones(habitaciones);
      showToast("Unidad quitada");
      renderHabAdmin();
    });
  });
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

render();
