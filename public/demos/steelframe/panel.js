let items = loadObras();
let modelos = loadModelos();
let selected = items[0]?.id || "";
let filter = "todos";
let selectedArca = items.find((i) => i.factura)?.id || items[0]?.id || "";
let filterArca = "todos";

const viewObras = document.getElementById("view-obras");
const viewModelos = document.getElementById("view-modelos");
const viewArca = document.getElementById("view-arca");
const tabObras = document.getElementById("tab-obras");
const tabModelos = document.getElementById("tab-modelos");
const tabArca = document.getElementById("tab-arca");
const openCreate = document.getElementById("open-create");

tabObras.addEventListener("click", () => showView("obras"));
tabModelos.addEventListener("click", () => showView("modelos"));
tabArca.addEventListener("click", () => showView("arca"));

function showView(name) {
  viewObras.classList.toggle("panel-hidden", name !== "obras");
  viewModelos.classList.toggle("panel-hidden", name !== "modelos");
  viewArca.classList.toggle("panel-hidden", name !== "arca");
  tabObras.classList.toggle("on", name === "obras");
  tabModelos.classList.toggle("on", name === "modelos");
  tabArca.classList.toggle("on", name === "arca");
  openCreate.classList.toggle("panel-hidden", name !== "obras");
  if (name === "modelos") renderModelos();
  if (name === "arca") renderArca();
}

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "casa2");
  const modelo = modelos.find((m) => m.tipo === tipo) || {};
  const count = items.length + 16;
  const item = {
    id: crypto.randomUUID(),
    codigo: `SF-2026-${String(count).padStart(2, "0")}`,
    modelo: tipo,
    titulo: (modelo.nombre || tipoLabel(tipo)) + " · nueva",
    cliente: { nombre: String(data.get("cliente") || ""), tel: String(data.get("tel") || "") },
    lote: String(data.get("lote") || ""),
    status: "consulta",
    precio: modelo.precio || 0,
    imagen: imagenDeTipo(tipo),
    factura: null,
    history: [{ when: "hoy", text: "Obra creada como consulta." }]
  };
  items = [item, ...items];
  selected = item.id;
  saveObras(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Obra creada");
  render();
});

function render() {
  const counts = {
    consulta: items.filter((i) => i.status === "consulta").length,
    fabricacion: items.filter((i) => i.status === "fabricacion").length,
    montaje: items.filter((i) => i.status === "montaje").length,
    entregada: items.filter((i) => i.status === "entregada").length
  };
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>obras</button>
    <button type="button" data-filter="consulta" class="${filter === "consulta" ? "on" : ""}"><strong>${counts.consulta}</strong>consulta</button>
    <button type="button" data-filter="fabricacion" class="${filter === "fabricacion" ? "on" : ""}"><strong>${counts.fabricacion}</strong>fabricación</button>
    <button type="button" data-filter="montaje" class="${filter === "montaje" ? "on" : ""}"><strong>${counts.montaje}</strong>montaje</button>
    <button type="button" data-filter="entregada" class="${filter === "entregada" ? "on" : ""}"><strong>${counts.entregada}</strong>entregadas</button>
  `;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = filter === "todos" ? items : items.filter((i) => i.status === filter);
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(item.imagen)}" alt="">
          <span>${esc(item.codigo)}<br><small>${esc(item.titulo)}</small></span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(tipoLabel(item.modelo))}</td>
      <td class="amount">${item.precio ? esc(money(item.precio)) : "—"}</td>
      <td><span class="tag ${esc(item.status)}">${esc(estadoLabel(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="5">No hay obras en este estado.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) { detail.innerHTML = "<p>Elegí una obra.</p>"; return; }

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.titulo)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.nombre)} · ${esc(item.cliente.tel) || "Sin teléfono"}</p>
    <img class="detail-photo" src="${esc(item.imagen)}" alt="">
    <div class="meta">
      <div><span>Modelo</span>${esc(tipoLabel(item.modelo))}</div>
      <div><span>Estado</span>${esc(estadoLabel(item.status))}</div>
      <div><span>Lote</span>${esc(item.lote) || "—"}</div>
      <div><span>Precio</span>${esc(money(item.precio))}</div>
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: ${esc(item.factura.cae)}</p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA</h4>
        <label>CUIT cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${!item.precio ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:var(--muted);margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}
    <form id="edit">
      <label>Estado
        <select name="status">
          ${ESTADOS.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio<input name="precio" type="number" value="${item.precio || 0}"></label>
      <label>Lote<input name="lote" value="${esc(item.lote || "")}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  document.getElementById("emitir-factura")?.addEventListener("click", () => {
    emitirFactura(item, document.getElementById("arca-tipo").value, document.getElementById("arca-cuit").value);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prev = item.status;
    item.status = String(data.get("status") || item.status);
    item.precio = Number(data.get("precio") || 0);
    item.lote = String(data.get("lote") || "");
    if (prev !== item.status) {
      item.history = [{ when: "hoy", text: `Estado: ${estadoLabel(item.status)}.` }, ...(item.history || [])];
    }
    saveObras(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta obra?")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    saveObras(items);
    showToast("Obra eliminada");
    render();
  });
}

function emitirFactura(item, tipo, cuit) {
  const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);
  const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  item.factura = { tipo, numero, cae, vto, total: item.precio, cuit };
  item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
  saveObras(items);
}

function renderModelos() {
  document.getElementById("modelosGrid").innerHTML = modelos.map((m) => `
    <article class="modelo-admin">
      <img src="${esc(m.imagen)}" alt="${esc(m.nombre)}">
      <div>
        <h3>${esc(m.nombre)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${m.m2} m² · ${esc(money(m.precio))}</p>
        <p style="margin:0;font-size:12px;color:var(--muted)">${m.publicado === false ? "Oculto" : "Publicado"}</p>
      </div>
    </article>
  `).join("");
}

function renderArca() {
  const facturados = items.filter((i) => i.factura);
  const pendientes = items.filter((i) => !i.factura && i.precio > 0);
  let visible = items;
  if (filterArca === "facturado") visible = facturados;
  else if (filterArca === "pendiente") visible = pendientes;

  document.getElementById("arca-stats").innerHTML = `
    <button type="button" data-afiltro="todos" class="${filterArca === "todos" ? "on" : ""}"><strong>${items.length}</strong>obras</button>
    <button type="button" data-afiltro="pendiente" class="${filterArca === "pendiente" ? "on" : ""}"><strong>${pendientes.length}</strong>sin factura</button>
    <button type="button" data-afiltro="facturado" class="${filterArca === "facturado" ? "on" : ""}"><strong>${facturados.length}</strong>facturados</button>
  `;
  document.querySelectorAll("[data-afiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterArca = btn.dataset.afiltro; renderArca(); });
  });
  if (!visible.find((i) => i.id === selectedArca) && visible[0]) selectedArca = visible[0].id;

  document.getElementById("arca-rows").innerHTML = visible.map((item) => `
    <tr class="row ${item.id === selectedArca ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.cliente.nombre)}</td>
      <td class="amount">${item.precio ? esc(money(item.precio)) : "—"}</td>
      <td>${item.factura ? esc(item.factura.numero) : "Pendiente"}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay obras.</td></tr>`;
  document.querySelectorAll("#arca-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedArca = row.dataset.id; renderArca(); });
  });

  const item = items.find((i) => i.id === selectedArca);
  const detail = document.getElementById("arca-detail");
  if (!item) { detail.innerHTML = "<p>Elegí una obra.</p>"; return; }
  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <div class="meta">
      <div><span>Modelo</span>${esc(tipoLabel(item.modelo))}</div>
      <div><span>Total</span>${esc(money(item.precio))}</div>
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: ${esc(item.factura.cae)}</p>
        <p>Vto CAE: ${esc(item.factura.vto)}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (AFIP)</h4>
        <label>CUIT cliente<input id="arca-cuit-tab" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo-tab">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura-tab" style="margin-top:10px;" ${!item.precio ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
      </div>
    `}
  `;
  document.getElementById("emitir-factura-tab")?.addEventListener("click", () => {
    emitirFactura(item, document.getElementById("arca-tipo-tab").value, document.getElementById("arca-cuit-tab").value);
    showToast("Factura emitida");
    renderArca();
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
