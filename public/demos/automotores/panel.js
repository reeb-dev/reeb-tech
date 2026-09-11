let items = load();
let consultas = loadConsultas();
let selected = items[0]?.id || "";
let selectedConsulta = consultas[0]?.id || "";
let selectedArca = items.find((i) => i.factura)?.id || items[0]?.id || "";
let filter = "todos";
let filterConsulta = "todos";
let filterArca = "todos";
let searchTerm = "";
let currentTab = "stock";

const createForm = document.getElementById("create");
const createConsulta = document.getElementById("create-consulta");
const openCreate = document.getElementById("open-create");

function fillVehiculoSelect() {
  const select = document.getElementById("consulta-vehiculo");
  select.innerHTML = `<option value="">Vehículo</option>` +
    items.map((v) => `<option value="${esc(v.id)}">${esc(v.marca)} ${esc(v.modelo)} · ${esc(v.codigo)}</option>`).join("");
}
fillVehiculoSelect();

openCreate.addEventListener("click", () => {
  if (currentTab === "consultas") createConsulta.classList.toggle("open");
  else {
    currentTab = "stock";
    createForm.classList.toggle("open");
  }
  render();
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    marca: String(data.get("marca") || ""),
    modelo: String(data.get("modelo") || ""),
    version: String(data.get("version") || ""),
    ano: Number(data.get("ano") || new Date().getFullYear()),
    tipo: String(data.get("tipo") || "usado"),
    precioUSD: Number(data.get("precioUSD") || 0),
    km: Number(data.get("km") || 0),
    combustible: String(data.get("combustible") || "nafta"),
    transmision: String(data.get("transmision") || "manual"),
    color: String(data.get("color") || ""),
    patente: String(data.get("patente") || "") || null,
    puertas: 4,
    motor: "",
    descripcion: "",
    imagenes: [fotoModelo(String(data.get("marca") || ""), String(data.get("modelo") || ""))],
    financiacion: true,
    permuta: true,
    destacado: false,
    status: "disponible",
    vistas: 0,
    consultas: 0,
    diasPublicado: 0,
    cliente: null,
    history: [{ when: "hoy", text: "Vehículo ingresado al stock." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  fillVehiculoSelect();
  event.target.reset();
  event.target.classList.remove("open");
  currentTab = "stock";
  showToast("Vehículo agregado al stock");
  render();
});

createConsulta.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const vehiculoId = String(data.get("vehiculoId") || "");
  const consulta = {
    id: crypto.randomUUID(),
    vehiculoId,
    nombre: String(data.get("nombre") || "").trim(),
    tel: String(data.get("tel") || "").trim(),
    email: String(data.get("email") || "").trim(),
    mensaje: String(data.get("mensaje") || "").trim(),
    fecha: new Date().toISOString(),
    estado: "pendiente",
    history: [{ when: "hoy", text: "Consulta registrada en el panel." }]
  };
  consultas = [consulta, ...consultas];
  selectedConsulta = consulta.id;
  saveConsultas(consultas);
  const veh = items.find((v) => v.id === vehiculoId);
  if (veh) {
    veh.consultas = (veh.consultas || 0) + 1;
    save(items);
  }
  event.target.reset();
  event.target.classList.remove("open");
  currentTab = "consultas";
  showToast("Consulta registrada");
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  createForm.classList.remove("open");
  createConsulta.classList.remove("open");
  render();
});

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === currentTab);
  });
  document.getElementById("view-stock").hidden = currentTab !== "stock";
  document.getElementById("view-consultas").hidden = currentTab !== "consultas";
  document.getElementById("view-arca").hidden = currentTab !== "arca";
  createForm.style.display = currentTab === "stock" ? "" : "none";
  createConsulta.style.display = currentTab === "consultas" ? "" : "none";
  openCreate.textContent = currentTab === "consultas" ? "+ Nueva consulta" : "+ Nuevo vehículo";
  openCreate.style.display = currentTab === "arca" ? "none" : "";
  const titles = {
    stock: "Stock de vehículos",
    consultas: "Consultas de clientes",
    arca: "Facturación ARCA"
  };
  document.getElementById("panelTitle").textContent = titles[currentTab] || titles.stock;
}

function bindSearch() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
}

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.marca.toLowerCase().includes(term) ||
      item.modelo.toLowerCase().includes(term) ||
      item.codigo.toLowerCase().includes(term) ||
      (item.patente && item.patente.toLowerCase().includes(term))
    );
  }
  return result;
}

function renderArcaBox(item, prefix = "arca") {
  if (item.factura) {
    return `
      <div class="factura-box">
        <h4>Venta facturada</h4>
        <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
        <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
        <div><strong>Total:</strong> ${esc(formatPrecioUSD(item.factura.total))}</div>
        <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
        <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
      </div>
    `;
  }
  return `
    <div class="arca-section">
      <h4>Facturación ARCA</h4>
      <label>CUIT comprador<input id="${prefix}-cuit" placeholder="20-12345678-9"></label>
      <label>Tipo comprobante
        <select id="${prefix}-tipo">
          ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Concepto
        <select id="${prefix}-concepto">
          <option value="venta">Venta de vehículo</option>
          <option value="sena">Seña/Reserva</option>
          <option value="comision">Comisión por venta</option>
        </select>
      </label>
      <button class="btn-panel" type="button" id="${prefix}-emitir" style="margin-top:12px;">
        Emitir factura (simulado)
      </button>
      <p style="font-size:11px;color:#64748b;margin-top:10px;">Ejemplo: genera CAE simulado. En un sistema real se conecta a ARCA/AFIP.</p>
    </div>
  `;
}

function bindEmitir(detail, item, prefix) {
  detail.querySelector(`#${prefix}-emitir`)?.addEventListener("click", () => {
    const tipo = detail.querySelector(`#${prefix}-tipo`).value;
    const cuit = detail.querySelector(`#${prefix}-cuit`).value;
    const concepto = detail.querySelector(`#${prefix}-concepto`).value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
    let total = item.precioUSD;
    if (concepto === "sena") total = Math.round(item.precioUSD * 0.1);
    if (concepto === "comision") total = Math.round(item.precioUSD * 0.03);
    item.factura = { tipo, numero, cae, vto, total, cuit, concepto };
    item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida por ${formatPrecioUSD(total)}. CAE: ${cae}` }, ...(item.history || [])];
    if (concepto === "venta") {
      item.status = "vendido";
      item.history = [{ when: "hoy", text: "Vehículo marcado como vendido." }, ...item.history];
    } else if (concepto === "sena") {
      item.status = "reservado";
    }
    save(items);
    showToast("Factura emitida correctamente");
    render();
  });
}

function render() {
  items = load();
  consultas = loadConsultas();
  setTabVisibility();
  if (currentTab === "consultas") renderConsultas();
  else if (currentTab === "arca") renderArca();
  else renderStock();
}

function renderStock() {
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const reservados = items.filter((i) => i.status === "reservado").length;
  const vendidos = items.filter((i) => i.status === "vendido").length;
  const valorStock = items
    .filter((i) => i.status === "disponible" || i.status === "reservado")
    .reduce((sum, i) => sum + i.precioUSD, 0);
  const pendientes = consultas.filter((c) => c.estado === "pendiente").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>total</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="reservado" class="${filter === "reservado" ? "on" : ""}"><strong>${reservados}</strong>reservados</button>
    <button type="button" data-filter="vendido" class="${filter === "vendido" ? "on" : ""}"><strong>${vendidos}</strong>vendidos</button>
    <div style="cursor:default;"><strong>${formatPrecioUSD(valorStock)}</strong>valor stock</div>
    <div style="cursor:default;"><strong>${pendientes}</strong>consultas abiertas</div>
    <input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.codigo)}</td>
      <td><strong>${esc(item.marca)} ${esc(item.modelo)}</strong><br><small style="color:#64748b">${esc(item.version)}</small></td>
      <td>${esc(tipoLabel(item.tipo))}</td>
      <td>${item.ano}</td>
      <td class="amount">${esc(formatPrecioUSD(item.precioUSD))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;">No hay vehículos en este estado.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p style='color:#64748b;padding:20px;'>Seleccioná un vehículo del listado.</p>";
    return;
  }

  const relacionadas = consultas.filter((c) => c.vehiculoId === item.id);

  detail.innerHTML = `
    <p class="eyebrow">${esc(tipoLabel(item.tipo))} · ${item.ano}</p>
    <h2>${esc(item.marca)} ${esc(item.modelo)}</h2>
    <p style="color:var(--muted);margin-bottom:16px;">${esc(item.version)}</p>
    <div class="meta">
      <div><span>Precio USD</span><strong>${esc(formatPrecioUSD(item.precioUSD))}</strong></div>
      <div><span>Precio AR$</span>${esc(formatPrecioARS(item.precioUSD))}</div>
      <div><span>Kilómetros</span>${esc(formatKm(item.km))}</div>
      <div><span>Combustible</span>${esc(combustibleLabel(item.combustible))}</div>
      <div><span>Transmisión</span>${esc(transmisionLabel(item.transmision))}</div>
      <div><span>Color</span>${esc(item.color || "—")}</div>
      ${item.patente ? `<div><span>Patente</span>${esc(item.patente)}</div>` : ""}
      <div><span>Consultas</span>${relacionadas.length}</div>
    </div>
    ${renderArcaBox(item, "stock")}
    <form id="edit">
      <label>Código<input name="codigo" value="${esc(item.codigo)}"></label>
      <label>Marca
        <select name="marca">
          ${MARCAS.map((m) => `<option value="${m}" ${item.marca === m ? "selected" : ""}>${esc(m)}</option>`).join("")}
        </select>
      </label>
      <label>Modelo<input name="modelo" value="${esc(item.modelo)}"></label>
      <label>Versión<input name="version" value="${esc(item.version)}"></label>
      <label>Año<input name="ano" type="number" value="${item.ano}"></label>
      <label>Tipo
        <select name="tipo">
          ${TIPOS.map((t) => `<option value="${t.id}" ${item.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio USD<input name="precioUSD" type="number" value="${item.precioUSD}"></label>
      <label>Kilómetros<input name="km" type="number" value="${item.km}"></label>
      <label>Combustible
        <select name="combustible">
          ${COMBUSTIBLES.map((c) => `<option value="${c.id}" ${item.combustible === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Transmisión
        <select name="transmision">
          ${TRANSMISIONES.map((t) => `<option value="${t.id}" ${item.transmision === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Color<input name="color" value="${esc(item.color)}"></label>
      <label>Patente<input name="patente" value="${esc(item.patente || "")}"></label>
      <label>Estado
        <select name="status">
          ${ESTADOS.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label style="grid-column: span 2;">Descripción
        <textarea name="descripcion" rows="3">${esc(item.descripcion)}</textarea>
      </label>
      <div class="actions" style="grid-column: span 2;">
        <button class="btn-panel" type="submit">Guardar cambios</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  bindEmitir(detail, item, "stock");

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);
    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      marca: String(data.get("marca") || ""),
      modelo: String(data.get("modelo") || ""),
      version: String(data.get("version") || ""),
      ano: Number(data.get("ano") || item.ano),
      tipo: String(data.get("tipo") || "usado"),
      precioUSD: Number(data.get("precioUSD") || 0),
      km: Number(data.get("km") || 0),
      combustible: String(data.get("combustible") || "nafta"),
      transmision: String(data.get("transmision") || "manual"),
      color: String(data.get("color") || ""),
      patente: String(data.get("patente") || "") || null,
      descripcion: String(data.get("descripcion") || ""),
      status: newStatus
    });
    item.history = [{
      when: "hoy",
      text: prevStatus !== newStatus ? `Estado cambiado a: ${label(newStatus)}.` : "Ficha del vehículo actualizada."
    }, ...(item.history || [])];
    save(items);
    fillVehiculoSelect();
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este vehículo del stock? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    fillVehiculoSelect();
    showToast("Vehículo eliminado del stock");
    render();
  });
}

function renderConsultas() {
  const counts = {
    pendiente: consultas.filter((c) => c.estado === "pendiente").length,
    contactado: consultas.filter((c) => c.estado === "contactado").length,
    visita: consultas.filter((c) => c.estado === "visita").length,
    cerrada: consultas.filter((c) => c.estado === "cerrada").length
  };
  let visibleList = filterConsulta === "todos" ? consultas : consultas.filter((c) => c.estado === filterConsulta);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    visibleList = visibleList.filter((c) =>
      c.nombre.toLowerCase().includes(term) ||
      (c.mensaje || "").toLowerCase().includes(term) ||
      vehiculoLabel(c.vehiculoId, items).toLowerCase().includes(term)
    );
  }

  document.getElementById("stats").innerHTML = `
    <button type="button" data-cfiltro="todos" class="${filterConsulta === "todos" ? "on" : ""}"><strong>${consultas.length}</strong>consultas</button>
    <button type="button" data-cfiltro="pendiente" class="${filterConsulta === "pendiente" ? "on" : ""}"><strong>${counts.pendiente}</strong>pendientes</button>
    <button type="button" data-cfiltro="contactado" class="${filterConsulta === "contactado" ? "on" : ""}"><strong>${counts.contactado}</strong>contactados</button>
    <button type="button" data-cfiltro="visita" class="${filterConsulta === "visita" ? "on" : ""}"><strong>${counts.visita}</strong>visitas</button>
    <input type="text" id="search" placeholder="Buscar consulta..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("[data-cfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterConsulta = btn.dataset.cfiltro; render(); });
  });

  document.getElementById("consulta-rows").innerHTML = visibleList.map((c) => `
    <tr class="row ${c.id === selectedConsulta ? "on" : ""}" data-id="${esc(c.id)}">
      <td>${esc(formatFechaConsulta(c.fecha))}</td>
      <td>${esc(c.nombre)}</td>
      <td>${esc(vehiculoLabel(c.vehiculoId, items))}</td>
      <td>${esc((c.mensaje || "").slice(0, 48))}${(c.mensaje || "").length > 48 ? "…" : ""}</td>
      <td><span class="tag ${esc(c.estado)}">${esc(consultaLabel(c.estado))}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay consultas.</td></tr>`;

  document.querySelectorAll("#consulta-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedConsulta = row.dataset.id; render(); });
  });

  const c = consultas.find((x) => x.id === selectedConsulta);
  const detail = document.getElementById("consulta-detail");
  if (!c) { detail.innerHTML = "<p>Elegí una consulta.</p>"; return; }

  detail.innerHTML = `
    <p class="eyebrow">${esc(formatFechaConsulta(c.fecha))}</p>
    <h2>${esc(c.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(c.tel || "Sin teléfono")} · ${esc(c.email || "Sin email")}</p>
    <div class="meta">
      <div><span>Vehículo</span>${esc(vehiculoLabel(c.vehiculoId, items))}</div>
      <div><span>Estado</span>${esc(consultaLabel(c.estado))}</div>
    </div>
    <p style="font-size:14px;background:#f8fafc;padding:10px;border-radius:8px;">${esc(c.mensaje)}</p>
    <form id="edit-consulta">
      <label>Nombre<input name="nombre" value="${esc(c.nombre)}"></label>
      <label>Teléfono<input name="tel" value="${esc(c.tel || "")}"></label>
      <label>Email<input name="email" value="${esc(c.email || "")}"></label>
      <label>Vehículo
        <select name="vehiculoId">
          ${items.map((v) => `<option value="${esc(v.id)}" ${c.vehiculoId === v.id ? "selected" : ""}>${esc(v.marca)} ${esc(v.modelo)}</option>`).join("")}
        </select>
      </label>
      <label>Estado
        <select name="estado">
          ${CONSULTA_ESTADOS.map((s) => `<option value="${s.id}" ${c.estado === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Mensaje<textarea name="mensaje" rows="3">${esc(c.mensaje)}</textarea></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-consulta">Eliminar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(c.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  detail.querySelector("#edit-consulta").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prev = c.estado;
    c.nombre = String(data.get("nombre") || "");
    c.tel = String(data.get("tel") || "");
    c.email = String(data.get("email") || "");
    c.vehiculoId = String(data.get("vehiculoId") || "");
    c.estado = String(data.get("estado") || "pendiente");
    c.mensaje = String(data.get("mensaje") || "");
    if (prev !== c.estado) {
      c.history = [{ when: "hoy", text: `Estado: ${consultaLabel(c.estado)}.` }, ...(c.history || [])];
    }
    saveConsultas(consultas);
    showToast("Consulta actualizada");
    render();
  });

  detail.querySelector("#remove-consulta").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta consulta? Esta acción no se puede deshacer.")) return;
    consultas = consultas.filter((x) => x.id !== c.id);
    selectedConsulta = consultas[0]?.id || "";
    saveConsultas(consultas);
    showToast("Consulta eliminada");
    render();
  });
}

function renderArca() {
  const facturados = items.filter((i) => i.factura);
  const pendientes = items.filter((i) => !i.factura && (i.status === "disponible" || i.status === "reservado"));
  let visibleList = items;
  if (filterArca === "facturado") visibleList = facturados;
  else if (filterArca === "pendiente") visibleList = pendientes;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    visibleList = visibleList.filter((i) =>
      i.marca.toLowerCase().includes(term) || i.modelo.toLowerCase().includes(term) || i.codigo.toLowerCase().includes(term)
    );
  }

  document.getElementById("stats").innerHTML = `
    <button type="button" data-afiltro="todos" class="${filterArca === "todos" ? "on" : ""}"><strong>${items.length}</strong>unidades</button>
    <button type="button" data-afiltro="pendiente" class="${filterArca === "pendiente" ? "on" : ""}"><strong>${pendientes.length}</strong>sin factura</button>
    <button type="button" data-afiltro="facturado" class="${filterArca === "facturado" ? "on" : ""}"><strong>${facturados.length}</strong>facturados</button>
    <input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("[data-afiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterArca = btn.dataset.afiltro; render(); });
  });

  document.getElementById("arca-rows").innerHTML = visibleList.map((item) => `
    <tr class="row ${item.id === selectedArca ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.marca)} ${esc(item.modelo)}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
      <td class="amount">${esc(formatPrecioUSD(item.precioUSD))}</td>
      <td>${item.factura ? esc(item.factura.numero) : "Pendiente"}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay unidades.</td></tr>`;

  document.querySelectorAll("#arca-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedArca = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selectedArca) || visibleList[0];
  const detail = document.getElementById("arca-detail");
  if (!item) { detail.innerHTML = "<p>Elegí un vehículo para facturar.</p>"; return; }

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.marca)} ${esc(item.modelo)}</h2>
    <div class="meta">
      <div><span>Precio</span>${esc(formatPrecioUSD(item.precioUSD))}</div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>
    ${renderArcaBox(item, "panel")}
  `;
  bindEmitir(detail, item, "panel");
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
