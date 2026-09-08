let items = load();
let pedidos = loadPedidos();
let selected = items[0]?.id || "";
let selectedPedido = pedidos[0]?.id || "";
let selectedArca = pedidos.find((p) => p.factura)?.id || pedidos[0]?.id || "";
let filter = "todos";
let filterPedido = "todos";
let filterArca = "todos";

const viewStock = document.getElementById("view-stock");
const viewPedidos = document.getElementById("view-pedidos");
const viewArca = document.getElementById("view-arca");
const tabStock = document.getElementById("tab-stock");
const tabPedidos = document.getElementById("tab-pedidos");
const tabArca = document.getElementById("tab-arca");
const openCreate = document.getElementById("open-create");

tabStock.addEventListener("click", () => showView("stock"));
tabPedidos.addEventListener("click", () => showView("pedidos"));
tabArca.addEventListener("click", () => showView("arca"));

function showView(name) {
  viewStock.classList.toggle("panel-hidden", name !== "stock");
  viewPedidos.classList.toggle("panel-hidden", name !== "pedidos");
  viewArca.classList.toggle("panel-hidden", name !== "arca");
  tabStock.classList.toggle("on", name === "stock");
  tabPedidos.classList.toggle("on", name === "pedidos");
  tabArca.classList.toggle("on", name === "arca");
  openCreate.classList.toggle("panel-hidden", name !== "stock");
  if (name === "pedidos") renderPedidos();
  if (name === "arca") renderArca();
}

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "cemento"),
    unidad: String(data.get("unidad") || "unidad"),
    precio: Number(data.get("precio") || 0),
    stock: Number(data.get("stock") || 0),
    minimo: Number(data.get("minimo") || 5),
    imagen: "img/hero.jpg",
    descripcion: "",
    history: [{ when: "hoy", text: "Material agregado al stock." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Material agregado");
  render();
});

function render() {
  const counts = {
    stock: items.filter((i) => stockStatus(i) === "stock").length,
    bajo: items.filter((i) => stockStatus(i) === "bajo").length,
    agotado: items.filter((i) => stockStatus(i) === "agotado").length
  };
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>materiales</button>
    <button type="button" data-filter="stock" class="${filter === "stock" ? "on" : ""}"><strong>${counts.stock}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filter === "bajo" ? "on" : ""}"><strong>${counts.bajo}</strong>bajo</button>
    <button type="button" data-filter="agotado" class="${filter === "agotado" ? "on" : ""}"><strong>${counts.agotado}</strong>sin stock</button>
  `;
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = filter === "todos" ? items : items.filter((i) => stockStatus(i) === filter);
  document.getElementById("rows").innerHTML = rows.map((item) => {
    const st = stockStatus(item);
    return `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td><img class="thumb" src="${esc(item.imagen)}" alt=""></td>
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.nombre)}</td>
      <td class="amount">${esc(money(item.precio))}</td>
      <td class="amount">${item.stock} ${esc(item.unidad)}</td>
      <td><span class="tag ${esc(st)}">${st === "stock" ? "En stock" : st === "bajo" ? "Bajo" : "Agotado"}</span></td>
    </tr>`;
  }).join("") || `<tr><td colspan="6">No hay materiales.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) { detail.innerHTML = "<p>Elegí un material.</p>"; return; }
  const st = stockStatus(item);
  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)} · ${esc(catLabel(item.categoria))}</p>
    <h2>${esc(item.nombre)}</h2>
    <img class="detail-photo" src="${esc(item.imagen)}" alt="">
    <p style="font-size:14px;color:var(--muted)">${esc(item.descripcion || "")}</p>
    <div class="meta">
      <div><span>Precio</span>${esc(money(item.precio))} / ${esc(item.unidad)}</div>
      <div><span>Stock</span>${item.stock} ${esc(item.unidad)}</div>
      <div><span>Mínimo</span>${item.minimo}</div>
      <div><span>Estado</span>${st === "stock" ? "En stock" : st === "bajo" ? "Bajo" : "Agotado"}</div>
    </div>
    <form id="edit">
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Stock<input name="stock" type="number" value="${item.stock}"></label>
      <label>Mínimo<input name="minimo" type="number" value="${item.minimo}"></label>
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
  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    item.precio = Number(data.get("precio") || 0);
    item.stock = Number(data.get("stock") || 0);
    item.minimo = Number(data.get("minimo") || 0);
    item.history = [{ when: "hoy", text: "Stock o precio actualizado." }, ...(item.history || [])];
    save(items);
    showToast("Guardado");
    render();
  });
  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este material?")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Eliminado");
    render();
  });
}

function emitirFacturaPedido(pedido, tipo, cuit) {
  const total = pedidoTotal(pedido);
  const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);
  const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  pedido.factura = { tipo, numero, cae, vto, total, cuit };
  pedido.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(pedido.history || [])];
  savePedidos(pedidos);
}

function renderPedidos() {
  const visible = filterPedido === "todos" ? pedidos : pedidos.filter((p) => p.status === filterPedido);
  const counts = {
    consulta: pedidos.filter((p) => p.status === "consulta").length,
    preparacion: pedidos.filter((p) => p.status === "preparacion").length,
    entregado: pedidos.filter((p) => p.status === "entregado").length
  };
  document.getElementById("pedido-stats").innerHTML = `
    <button type="button" data-pfiltro="todos" class="${filterPedido === "todos" ? "on" : ""}"><strong>${pedidos.length}</strong>pedidos</button>
    <button type="button" data-pfiltro="consulta" class="${filterPedido === "consulta" ? "on" : ""}"><strong>${counts.consulta}</strong>consulta</button>
    <button type="button" data-pfiltro="preparacion" class="${filterPedido === "preparacion" ? "on" : ""}"><strong>${counts.preparacion}</strong>preparación</button>
    <button type="button" data-pfiltro="entregado" class="${filterPedido === "entregado" ? "on" : ""}"><strong>${counts.entregado}</strong>entregados</button>
  `;
  document.querySelectorAll("[data-pfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterPedido = btn.dataset.pfiltro; renderPedidos(); });
  });
  if (!visible.find((p) => p.id === selectedPedido) && visible[0]) selectedPedido = visible[0].id;

  document.getElementById("pedido-rows").innerHTML = visible.map((p) => `
    <tr class="row ${p.id === selectedPedido ? "on" : ""}" data-id="${esc(p.id)}">
      <td>${esc(p.codigo)}</td>
      <td>${esc(p.cliente)}<br><small>${esc(p.obra)}</small></td>
      <td class="amount">${esc(money(pedidoTotal(p)))}</td>
      <td><span class="tag ${esc(p.status)}">${esc(pedidoLabel(p.status))}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay pedidos.</td></tr>`;
  document.querySelectorAll("#pedido-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedPedido = row.dataset.id; renderPedidos(); });
  });

  const p = pedidos.find((i) => i.id === selectedPedido);
  const detail = document.getElementById("pedido-detail");
  if (!p) { detail.innerHTML = "<p>Elegí un pedido.</p>"; return; }
  const total = pedidoTotal(p);
  detail.innerHTML = `
    <p class="eyebrow">${esc(p.codigo)}</p>
    <h2>${esc(p.cliente)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(p.obra)}</p>
    <ul style="padding-left:18px;font-size:14px;">
      ${(p.items || []).map((i) => `<li>${esc(i.nombre)} × ${i.cantidad} — ${esc(money(i.precio * i.cantidad))}</li>`).join("")}
    </ul>
    <p><strong>Total ${esc(money(total))}</strong></p>
    ${p.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(p.factura.tipo))}</strong> ${esc(p.factura.numero)}</p>
        <p>CAE: ${esc(p.factura.cae)}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA</h4>
        <label>CUIT<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo
          <select id="arca-tipo">
            ${COMPROBANTES.filter((c) => c.id !== "RE").map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;">Emitir factura (simulado)</button>
      </div>
    `}
    <form id="edit-pedido">
      <label>Estado
        <select name="status">
          ${PEDIDO_ESTADOS.map((s) => `<option value="${s.id}" ${p.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(p.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;
  document.getElementById("emitir-factura")?.addEventListener("click", () => {
    emitirFacturaPedido(p, document.getElementById("arca-tipo").value, document.getElementById("arca-cuit").value);
    showToast("Factura emitida");
    renderPedidos();
  });
  detail.querySelector("#edit-pedido").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const next = String(data.get("status") || p.status);
    if (next !== p.status) {
      p.status = next;
      p.history = [{ when: "hoy", text: `Estado: ${pedidoLabel(next)}.` }, ...(p.history || [])];
      savePedidos(pedidos);
    }
    showToast("Pedido actualizado");
    renderPedidos();
  });
}

function renderArca() {
  const facturados = pedidos.filter((p) => p.factura);
  const pendientes = pedidos.filter((p) => !p.factura);
  let visible = pedidos;
  if (filterArca === "facturado") visible = facturados;
  else if (filterArca === "pendiente") visible = pendientes;

  document.getElementById("arca-stats").innerHTML = `
    <button type="button" data-afiltro="todos" class="${filterArca === "todos" ? "on" : ""}"><strong>${pedidos.length}</strong>pedidos</button>
    <button type="button" data-afiltro="pendiente" class="${filterArca === "pendiente" ? "on" : ""}"><strong>${pendientes.length}</strong>sin factura</button>
    <button type="button" data-afiltro="facturado" class="${filterArca === "facturado" ? "on" : ""}"><strong>${facturados.length}</strong>facturados</button>
  `;
  document.querySelectorAll("[data-afiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterArca = btn.dataset.afiltro; renderArca(); });
  });
  if (!visible.find((p) => p.id === selectedArca) && visible[0]) selectedArca = visible[0].id;

  document.getElementById("arca-rows").innerHTML = visible.map((p) => `
    <tr class="row ${p.id === selectedArca ? "on" : ""}" data-id="${esc(p.id)}">
      <td>${esc(p.codigo)}</td>
      <td>${esc(p.cliente)}</td>
      <td class="amount">${esc(money(pedidoTotal(p)))}</td>
      <td>${p.factura ? esc(p.factura.numero) : "Pendiente"}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay pedidos.</td></tr>`;
  document.querySelectorAll("#arca-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedArca = row.dataset.id; renderArca(); });
  });

  const p = pedidos.find((i) => i.id === selectedArca);
  const detail = document.getElementById("arca-detail");
  if (!p) { detail.innerHTML = "<p>Elegí un pedido.</p>"; return; }
  detail.innerHTML = `
    <p class="eyebrow">${esc(p.codigo)}</p>
    <h2>${esc(p.cliente)}</h2>
    <p><strong>Total ${esc(money(pedidoTotal(p)))}</strong></p>
    ${p.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(p.factura.tipo))}</strong> ${esc(p.factura.numero)}</p>
        <p>CAE: ${esc(p.factura.cae)}</p>
        <p>Vto CAE: ${esc(p.factura.vto)}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (AFIP)</h4>
        <label>CUIT<input id="arca-cuit-tab" placeholder="20-12345678-9"></label>
        <label>Tipo
          <select id="arca-tipo-tab">
            ${COMPROBANTES.filter((c) => c.id !== "RE").map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura-tab" style="margin-top:10px;">Emitir factura (simulado)</button>
      </div>
    `}
  `;
  document.getElementById("emitir-factura-tab")?.addEventListener("click", () => {
    emitirFacturaPedido(p, document.getElementById("arca-tipo-tab").value, document.getElementById("arca-cuit-tab").value);
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
