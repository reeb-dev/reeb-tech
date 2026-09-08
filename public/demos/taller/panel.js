let items = load();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let currentTab = "ordenes";

const createForm = document.getElementById("create");
const openCreate = document.getElementById("open-create");
const searchInput = document.getElementById("search");

openCreate.addEventListener("click", () => {
  currentTab = "ordenes";
  createForm.classList.toggle("open");
  render();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  createForm.classList.remove("open");
  render();
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const count = items.length + 1;
  const manoObra = Number(data.get("manoObra") || 0);
  const item = {
    id: crypto.randomUUID(),
    orden: `OT-2026-${String(count + 92).padStart(4, "0")}`,
    vehiculo: {
      marca: String(data.get("marca") || ""),
      modelo: String(data.get("modelo") || ""),
      año: Number(data.get("año") || new Date().getFullYear()),
      patente: String(data.get("patente") || "").toUpperCase(),
      km: Number(data.get("km") || 0)
    },
    cliente: {
      nombre: String(data.get("cliente") || ""),
      tel: String(data.get("tel") || ""),
      email: ""
    },
    tipo: String(data.get("tipo") || "service"),
    descripcion: String(data.get("descripcion") || ""),
    diagnostico: "Pendiente de diagnóstico",
    presupuesto: manoObra,
    aprobado: false,
    repuestos: [],
    manoObra,
    status: "ingreso",
    factura: null,
    fechaIngreso: "hoy",
    fechaEstimada: "Pendiente",
    history: [{ when: "hoy", text: "Vehículo ingresado al taller." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Orden de ingreso creada");
  render();
});

function matchesSearch(item) {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return item.cliente.nombre.toLowerCase().includes(term) ||
    item.vehiculo.patente.toLowerCase().includes(term) ||
    item.orden.toLowerCase().includes(term) ||
    `${item.vehiculo.marca} ${item.vehiculo.modelo}`.toLowerCase().includes(term);
}

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  return result.filter(matchesSearch);
}

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === currentTab);
  });
  document.getElementById("view-ordenes").hidden = currentTab !== "ordenes";
  document.getElementById("view-vehiculos").hidden = currentTab !== "vehiculos";
  document.getElementById("view-presupuestos").hidden = currentTab !== "presupuestos";
  createForm.style.display = currentTab === "ordenes" ? "" : "none";
  const titles = {
    ordenes: "Órdenes de trabajo",
    vehiculos: "Vehículos",
    presupuestos: "Presupuestos"
  };
  document.getElementById("panelTitle").textContent = titles[currentTab];
}

function renderStats() {
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>órdenes</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
  `;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      currentTab = "ordenes";
      render();
    });
  });
}

function openOrden(id) {
  selected = id;
  currentTab = "ordenes";
  render();
}

function renderOrdenes() {
  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.orden)}</td>
      <td>${esc(item.vehiculo.marca)} ${esc(item.vehiculo.modelo)}<br><small>${esc(item.vehiculo.patente)}</small></td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(tipoLabel(item.tipo))}</td>
      <td class="amount">${calcTotal(item) > 0 ? esc(money(calcTotal(item))) : "—"}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay órdenes en este estado.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((entry) => entry.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una orden del listado.</p>";
    return;
  }

  const total = calcTotal(item);
  detail.innerHTML = `
    <p class="eyebrow">${esc(item.orden)} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.vehiculo.marca)} ${esc(item.vehiculo.modelo)} ${item.vehiculo.año}</h2>
    <p class="patente-line">${esc(item.vehiculo.patente)} · ${item.vehiculo.km.toLocaleString("es-AR")} km</p>
    <div class="meta">
      <div><span>Cliente</span>${esc(item.cliente.nombre)}</div>
      <div><span>Teléfono</span>${esc(item.cliente.tel) || "—"}</div>
      <div><span>Ingreso</span>${esc(item.fechaIngreso)}</div>
      <div><span>Estimado</span>${esc(item.fechaEstimada)}</div>
    </div>
    <label>Descripción</label>
    <p>${esc(item.descripcion) || "Sin descripción"}</p>
    <label>Repuestos</label>
    <ul class="repuestos-list">
      ${(item.repuestos || []).map((r, index) => `<li><span>${esc(r.nombre)} x${r.cantidad}</span><span>${esc(money(r.precio * r.cantidad))} <button class="ghost tiny" type="button" data-del-rep="${index}">×</button></span></li>`).join("") || "<li>Sin repuestos</li>"}
    </ul>
    <form id="add-rep" class="rep-form">
      <input name="nombre" placeholder="Repuesto" required>
      <input name="precio" type="number" placeholder="Precio" required>
      <input name="cantidad" type="number" min="1" value="1">
      <button class="ghost" type="submit">Agregar</button>
    </form>
    <div class="meta">
      <div><span>Mano de obra</span>${esc(money(item.manoObra))}</div>
      <div><span>Presupuesto</span><strong>${esc(money(total))}</strong></div>
      <div><span>Aprobado</span>${item.aprobado ? "Sí" : "Pendiente"}</div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (AFIP)</h4>
        <label>CUIT cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.filter((c) => c.id !== "PR").map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" ${total === 0 ? "disabled" : ""}>Emitir factura (simulado)</button>
        <p class="hint">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}
    <form id="edit">
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Diagnóstico<textarea name="diagnostico">${esc(item.diagnostico)}</textarea></label>
      <label>Mano de obra<input name="manoObra" type="number" value="${item.manoObra}"></label>
      <label>Fecha estimada<input name="fechaEstimada" value="${esc(item.fechaEstimada)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="aprobar" ${item.aprobado ? "disabled" : ""}>Aprobar presupuesto</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  detail.querySelector("#add-rep").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    item.repuestos = [...(item.repuestos || []), {
      nombre: String(data.get("nombre") || ""),
      precio: Number(data.get("precio") || 0),
      cantidad: Number(data.get("cantidad") || 1)
    }];
    item.presupuesto = calcTotal(item);
    item.history = [{ when: "hoy", text: `Repuesto agregado: ${String(data.get("nombre") || "")}.` }, ...(item.history || [])];
    save(items);
    showToast("Repuesto agregado");
    render();
  });

  detail.querySelectorAll("[data-del-rep]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.delRep);
      const nombre = item.repuestos[index]?.nombre || "repuesto";
      if (!confirm(`¿Quitar ${nombre} de la orden?`)) return;
      item.repuestos = item.repuestos.filter((_, i) => i !== index);
      item.presupuesto = calcTotal(item);
      save(items);
      showToast("Repuesto quitado");
      render();
    });
  });

  const emitirBtn = detail.querySelector("#emitir-factura");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#arca-tipo").value;
      const cuit = detail.querySelector("#arca-cuit").value;
      const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
      const cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
      item.factura = { tipo, numero, cae, vto, total: calcTotal(item), cuit };
      item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
      save(items);
      showToast("Factura emitida");
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);
    item.diagnostico = String(data.get("diagnostico") || "");
    item.manoObra = Number(data.get("manoObra") || 0);
    item.fechaEstimada = String(data.get("fechaEstimada") || "");
    item.status = newStatus;
    item.presupuesto = calcTotal(item);
    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado: ${label(newStatus)}.` }, ...(item.history || [])];
    }
    save(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#aprobar")?.addEventListener("click", () => {
    item.aprobado = true;
    if (item.status === "ingreso") item.status = "taller";
    item.history = [{ when: "hoy", text: "Presupuesto aprobado. Pasa a taller." }, ...(item.history || [])];
    save(items);
    showToast("Presupuesto aprobado");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.")) return;
    items = items.filter((entry) => entry.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Orden eliminada");
    render();
  });
}

function renderVehiculos() {
  const map = new Map();
  items.filter(matchesSearch).forEach((item) => {
    const key = item.vehiculo.patente;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        ...item.vehiculo,
        cliente: item.cliente.nombre,
        tel: item.cliente.tel,
        ordenes: [item]
      });
    } else {
      prev.ordenes.push(item);
    }
  });
  const list = [...map.values()];
  document.getElementById("vehiculos").innerHTML = list.map((auto) => {
    const last = auto.ordenes[0];
    return `
      <article class="mesa-card">
        <div class="mesa-head">
          <strong class="patente-line">${esc(auto.patente)}</strong>
          <span class="tag ${esc(last.status)}">${esc(label(last.status))}</span>
        </div>
        <h3>${esc(auto.marca)} ${esc(auto.modelo)} ${auto.año}</h3>
        <p>${esc(auto.km.toLocaleString("es-AR"))} km · ${esc(auto.cliente)}</p>
        <p class="muted">${auto.ordenes.length} orden${auto.ordenes.length === 1 ? "" : "es"}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-open="${esc(last.id)}">Abrir última orden</button>
        </div>
      </article>`;
  }).join("") || "<p class='note'>No hay vehículos con este filtro.</p>";

  document.querySelectorAll("#vehiculos [data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openOrden(btn.dataset.open));
  });
}

function renderPresupuestos() {
  const list = items.filter(matchesSearch).filter((item) => calcTotal(item) > 0 || item.status !== "entregado");
  document.getElementById("presupuestos").innerHTML = list.map((item) => `
    <article class="mesa-card">
      <div class="mesa-head">
        <span>${esc(item.orden)}</span>
        <span class="tag ${item.aprobado ? "listo" : "ingreso"}">${item.aprobado ? "Aprobado" : "Pendiente"}</span>
      </div>
      <h3>${esc(item.vehiculo.marca)} ${esc(item.vehiculo.modelo)}</h3>
      <p>${esc(item.vehiculo.patente)} · ${esc(item.cliente.nombre)}</p>
      <p class="presup">${esc(money(calcTotal(item)))}</p>
      <p class="muted">${(item.repuestos || []).length} repuestos · mano de obra ${esc(money(item.manoObra))}</p>
      <div class="actions">
        <button class="btn-panel" type="button" data-open="${esc(item.id)}">Abrir orden</button>
        ${item.aprobado ? "" : `<button class="ghost" type="button" data-aprobar="${esc(item.id)}">Aprobar</button>`}
      </div>
    </article>
  `).join("") || "<p class='note'>No hay presupuestos.</p>";

  document.querySelectorAll("#presupuestos [data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openOrden(btn.dataset.open));
  });
  document.querySelectorAll("#presupuestos [data-aprobar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = items.find((entry) => entry.id === btn.dataset.aprobar);
      if (!item) return;
      item.aprobado = true;
      if (item.status === "ingreso") item.status = "taller";
      item.history = [{ when: "hoy", text: "Presupuesto aprobado. Pasa a taller." }, ...(item.history || [])];
      save(items);
      showToast("Presupuesto aprobado");
      render();
    });
  });
}

function render() {
  items = load();
  setTabVisibility();
  renderStats();
  renderOrdenes();
  renderVehiculos();
  renderPresupuestos();
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
