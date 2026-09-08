let items = loadReservas();
let paquetes = loadPaquetes();
let actividades = loadActividades();
let selected = items[0]?.id || "";
let filter = "todos";
let editingPkg = "";
let editingAct = "";

const viewH = document.getElementById("view-huespedes");
const viewP = document.getElementById("view-paquetes");
const viewA = document.getElementById("view-actividades");
const tabH = document.getElementById("tab-huespedes");
const tabP = document.getElementById("tab-paquetes");
const tabA = document.getElementById("tab-actividades");
const openCreate = document.getElementById("open-create");

function showView(name) {
  viewH.classList.toggle("panel-hidden", name !== "huespedes");
  viewP.classList.toggle("panel-hidden", name !== "paquetes");
  viewA.classList.toggle("panel-hidden", name !== "actividades");
  tabH.classList.toggle("on", name === "huespedes");
  tabP.classList.toggle("on", name === "paquetes");
  tabA.classList.toggle("on", name === "actividades");
  openCreate.classList.toggle("panel-hidden", name !== "huespedes");
  if (name === "paquetes") renderPkgs();
  if (name === "actividades") renderActs();
}

tabH.addEventListener("click", () => showView("huespedes"));
tabP.addEventListener("click", () => showView("paquetes"));
tabA.addEventListener("click", () => showView("actividades"));

document.querySelector("#create [name='paquete']").innerHTML = paquetes.map((p) =>
  `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`
).join("");

openCreate.addEventListener("click", () => document.getElementById("create").classList.toggle("open"));

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    codigo: `C-${String(items.length + 40).padStart(3, "0")}`,
    paqueteId: String(data.get("paquete") || ""),
    checkin: String(data.get("checkin") || ""),
    checkout: String(data.get("checkout") || data.get("checkin") || ""),
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

function render() {
  const counts = {
    pendiente: items.filter((i) => i.status === "pendiente").length,
    confirmada: items.filter((i) => i.status === "confirmada").length,
    checkin: items.filter((i) => i.status === "checkin").length
  };
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>huéspedes</button>
    <button type="button" data-filter="pendiente" class="${filter === "pendiente" ? "on" : ""}"><strong>${counts.pendiente}</strong>pendientes</button>
    <button type="button" data-filter="confirmada" class="${filter === "confirmada" ? "on" : ""}"><strong>${counts.confirmada}</strong>confirmados</button>
    <button type="button" data-filter="checkin" class="${filter === "checkin" ? "on" : ""}"><strong>${counts.checkin}</strong>en el predio</button>
  `;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = filter === "todos" ? items : items.filter((i) => i.status === filter);
  document.getElementById("rows").innerHTML = rows.map((item) => {
    const p = getPaquete(item.paqueteId, paquetes);
    return `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(p?.imagen || "img/hero.jpg")}" alt="">
          <span><strong>${esc(item.codigo)}</strong><br><small>${esc(fmtDate(item.checkin))}</small></span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(p?.nombre || item.paqueteId)}</td>
      <td class="amount">${esc(money(p?.precio || 0))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`;
  }).join("") || `<tr><td colspan="5">No hay huéspedes.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un huésped.</p>";
    return;
  }
  const p = getPaquete(item.paqueteId, paquetes);
  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.tel) || "Sin teléfono"}</p>
    <img class="detail-photo" src="${esc(p?.imagen || "img/hero.jpg")}" alt="">
    <div class="meta">
      <div><span>Paquete</span>${esc(p?.nombre || "—")}</div>
      <div><span>Huéspedes</span>${item.huespedes}</div>
      <div><span>Ingreso</span>${esc(fmtDate(item.checkin))}</div>
      <div><span>Salida</span>${esc(fmtDate(item.checkout))}</div>
      <div><span>Total</span><strong>${esc(money(p?.precio || 0))}</strong></div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>
    ${item.notas ? `<p style="font-size:13px;background:var(--blush);padding:8px;border-radius:6px;">${esc(item.notas)}</p>` : ""}
    <div class="actions">
      ${item.status === "confirmada" || item.status === "pendiente" ? `<button class="btn-panel" type="button" id="do-checkin">Marcar en el predio</button>` : ""}
      ${item.status === "checkin" ? `<button class="btn-panel" type="button" id="do-checkout">Check-out</button>` : ""}
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>✓ Comprobante</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA</h4>
        <label>Tipo
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;">Emitir (simulado)</button>
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
        <button class="ghost" type="button" id="remove">Cancelar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  const ci = detail.querySelector("#do-checkin");
  if (ci) ci.addEventListener("click", () => {
    item.status = "checkin";
    item.history = [{ when: "hoy", text: "Ingreso al predio." }, ...(item.history || [])];
    saveReservas(items); showToast("En el predio"); render();
  });
  const co = detail.querySelector("#do-checkout");
  if (co) co.addEventListener("click", () => {
    item.status = "checkout";
    item.history = [{ when: "hoy", text: "Check-out." }, ...(item.history || [])];
    saveReservas(items); showToast("Check-out"); render();
  });
  const emitir = detail.querySelector("#emitir-factura");
  if (emitir) emitir.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    item.factura = { tipo, numero, cae, vto: "18 sep", total: p?.precio || 0 };
    item.history = [{ when: "hoy", text: `Comprobante ${compLabel(tipo)}. CAE ${cae}` }, ...(item.history || [])];
    saveReservas(items); showToast("Factura emitida"); render();
  });
  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    item.status = String(data.get("status") || item.status);
    item.notas = String(data.get("notas") || "");
    saveReservas(items); showToast("Guardado"); render();
  });
  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    item.status = "cancelada";
    saveReservas(items); showToast("Cancelada"); render();
  });
}

document.getElementById("open-pkg").addEventListener("click", () => {
  editingPkg = "";
  document.getElementById("create-pkg").classList.toggle("open");
  document.getElementById("create-pkg").reset();
});
document.getElementById("create-pkg").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    tipo: String(data.get("tipo") || "estadia"),
    descripcion: String(data.get("descripcion") || "").trim(),
    precio: Number(data.get("precio") || 0),
    noches: Number(data.get("noches") || 0),
    pax: Number(data.get("pax") || 2),
    incluye: String(data.get("incluye") || "").split(",").map((s) => s.trim()).filter(Boolean),
    imagen: String(data.get("imagen") || "img/hab.jpg"),
    publicado: true
  };
  if (editingPkg) {
    paquetes = paquetes.map((p) => p.id === editingPkg ? { ...p, ...payload } : p);
  } else {
    paquetes = [{ id: crypto.randomUUID(), ...payload }, ...paquetes];
  }
  editingPkg = "";
  savePaquetes(paquetes);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Paquete guardado");
  renderPkgs();
});

function renderPkgs() {
  document.getElementById("pkgGrid").innerHTML = paquetes.map((p) => `
    <article class="trabajo-admin">
      <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
      <div>
        <h3>${esc(p.nombre)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(money(p.precio))}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit="${esc(p.id)}">Editar</button>
          <button class="ghost" type="button" data-del="${esc(p.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("");
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = paquetes.find((x) => x.id === btn.dataset.edit);
      if (!p) return;
      editingPkg = p.id;
      const form = document.getElementById("create-pkg");
      form.classList.add("open");
      form.nombre.value = p.nombre;
      form.tipo.value = p.tipo;
      form.precio.value = p.precio;
      form.noches.value = p.noches;
      form.pax.value = p.pax;
      form.imagen.value = p.imagen;
      form.descripcion.value = p.descripcion || "";
      form.incluye.value = (p.incluye || []).join(", ");
    });
  });
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar este paquete?")) return;
      paquetes = paquetes.filter((p) => p.id !== btn.dataset.del);
      savePaquetes(paquetes);
      showToast("Paquete quitado");
      renderPkgs();
    });
  });
}

document.getElementById("open-act").addEventListener("click", () => {
  editingAct = "";
  document.getElementById("create-act").classList.toggle("open");
  document.getElementById("create-act").reset();
});
document.getElementById("create-act").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    hora: String(data.get("hora") || ""),
    lugar: String(data.get("lugar") || ""),
    cupo: Number(data.get("cupo") || 10),
    tomados: Number(data.get("tomados") || 0),
    imagen: String(data.get("imagen") || "img/golf.jpg")
  };
  if (editingAct) {
    actividades = actividades.map((a) => a.id === editingAct ? { ...a, ...payload } : a);
  } else {
    actividades = [{ id: crypto.randomUUID(), ...payload }, ...actividades];
  }
  editingAct = "";
  saveActividades(actividades);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Actividad guardada");
  renderActs();
});

function renderActs() {
  document.getElementById("actGrid").innerHTML = actividades.map((a) => `
    <article class="trabajo-admin">
      <img src="${esc(a.imagen)}" alt="${esc(a.nombre)}">
      <div>
        <h3>${esc(a.nombre)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(a.hora)} · ${a.tomados}/${a.cupo}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edita="${esc(a.id)}">Editar</button>
          <button class="ghost" type="button" data-dela="${esc(a.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("");
  document.querySelectorAll("[data-edita]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const a = actividades.find((x) => x.id === btn.dataset.edita);
      if (!a) return;
      editingAct = a.id;
      const form = document.getElementById("create-act");
      form.classList.add("open");
      form.nombre.value = a.nombre;
      form.hora.value = a.hora;
      form.lugar.value = a.lugar;
      form.cupo.value = a.cupo;
      form.tomados.value = a.tomados;
      form.imagen.value = a.imagen;
    });
  });
  document.querySelectorAll("[data-dela]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar esta actividad?")) return;
      actividades = actividades.filter((a) => a.id !== btn.dataset.dela);
      saveActividades(actividades);
      showToast("Actividad quitada");
      renderActs();
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
