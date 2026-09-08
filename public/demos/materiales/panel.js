let items = load();
let pedidos = loadPedidos();
let proveedores = loadProveedores();
let selected = items[0]?.id || "";
let selectedPedido = pedidos[0]?.id || "";
let selectedArca = pedidos.find((p) => p.factura)?.id || pedidos[0]?.id || "";
let selectedProv = proveedores[0]?.id || "";
let filter = "todos";
let filterPedido = "todos";
let filterArca = "todos";
let searchStock = "";
let currentView = "stock";

const viewStock = document.getElementById("view-stock");
const viewPedidos = document.getElementById("view-pedidos");
const viewProveedores = document.getElementById("view-proveedores");
const viewArca = document.getElementById("view-arca");
const tabStock = document.getElementById("tab-stock");
const tabPedidos = document.getElementById("tab-pedidos");
const tabProveedores = document.getElementById("tab-proveedores");
const tabArca = document.getElementById("tab-arca");
const openCreate = document.getElementById("open-create");
const formStock = document.getElementById("create");
const formPedido = document.getElementById("create-pedido");
const formProv = document.getElementById("create-prov");

tabStock.addEventListener("click", () => showView("stock"));
tabPedidos.addEventListener("click", () => showView("pedidos"));
tabProveedores.addEventListener("click", () => showView("proveedores"));
tabArca.addEventListener("click", () => showView("arca"));

function showView(name) {
  currentView = name;
  viewStock.classList.toggle("panel-hidden", name !== "stock");
  viewPedidos.classList.toggle("panel-hidden", name !== "pedidos");
  viewProveedores.classList.toggle("panel-hidden", name !== "proveedores");
  viewArca.classList.toggle("panel-hidden", name !== "arca");
  tabStock.classList.toggle("on", name === "stock");
  tabPedidos.classList.toggle("on", name === "pedidos");
  tabProveedores.classList.toggle("on", name === "proveedores");
  tabArca.classList.toggle("on", name === "arca");
  formStock.classList.remove("open");
  formPedido.classList.remove("open");
  formProv.classList.remove("open");
  openCreate.classList.toggle("panel-hidden", name === "arca");
  if (name === "pedidos") fillPedidoSelect();
  renderBanner();
  if (name === "stock") render();
  if (name === "pedidos") renderPedidos();
  if (name === "proveedores") renderProveedores();
  if (name === "arca") renderArca();
}

openCreate.addEventListener("click", () => {
  if (currentView === "stock") {
    fillCreateSelects();
    formStock.classList.toggle("open");
  } else if (currentView === "pedidos") {
    fillPedidoSelect();
    formPedido.classList.toggle("open");
  } else if (currentView === "proveedores") {
    formProv.classList.toggle("open");
  }
});

function fillCreateSelects() {
  document.getElementById("createCat").innerHTML = CATEGORIAS.map(
    (c) => `<option value="${c.id}">${esc(c.label)}</option>`
  ).join("");
  document.getElementById("createProv").innerHTML = proveedores.map(
    (p) => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`
  ).join("");
}

function fillPedidoSelect() {
  document.getElementById("pedidoProd").innerHTML = items.map(
    (p) => `<option value="${esc(p.id)}">${esc(p.nombre)} · ${esc(money(p.precio))}</option>`
  ).join("");
}

formStock.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const cat = String(data.get("categoria") || "cemento");
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: cat,
    proveedorId: String(data.get("proveedorId") || ""),
    unidad: String(data.get("unidad") || "unidad"),
    precio: Number(data.get("precio") || 0),
    stock: Number(data.get("stock") || 0),
    minimo: Number(data.get("minimo") || 5),
    imagen: catImagen(cat),
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

formPedido.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const prod = items.find((p) => p.id === data.get("prodId"));
  const qty = Number(data.get("cantidad") || 1);
  if (!prod) return;
  if (prod.stock < qty) {
    showToast("Sin stock suficiente");
    return;
  }
  prod.stock -= qty;
  prod.history = [{ when: "hoy", text: `Pedido a obra x${qty}.` }, ...(prod.history || [])];
  save(items);
  const n = pedidos.length + 47;
  const pedido = {
    id: crypto.randomUUID(),
    codigo: `PED-2026-${String(n).padStart(3, "0")}`,
    cliente: String(data.get("cliente") || ""),
    obra: String(data.get("obra") || ""),
    tel: String(data.get("tel") || ""),
    status: "consulta",
    items: [{ id: prod.id, nombre: prod.nombre, cantidad: qty, precio: prod.precio, imagen: prod.imagen }],
    factura: null,
    history: [{ when: "hoy", text: "Pedido cargado desde el panel." }]
  };
  pedidos = [pedido, ...pedidos];
  selectedPedido = pedido.id;
  savePedidos(pedidos);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Pedido " + pedido.codigo);
  renderPedidos();
});

formProv.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const prov = {
    id: crypto.randomUUID(),
    nombre: String(data.get("nombre") || ""),
    rubro: String(data.get("rubro") || ""),
    tel: String(data.get("tel") || ""),
    cuit: String(data.get("cuit") || ""),
    contacto: String(data.get("contacto") || ""),
    nota: String(data.get("nota") || "")
  };
  proveedores = [prov, ...proveedores];
  selectedProv = prov.id;
  saveProveedores(proveedores);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Proveedor agregado");
  renderProveedores();
});

document.getElementById("searchStock").addEventListener("input", (event) => {
  searchStock = event.target.value;
  render();
});

function renderBanner() {
  const alerts = alertsList(items);
  const box = document.getElementById("alertBanner");
  if (!alerts.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `<button class="alert-banner" type="button" id="go-alertas"><strong>${alerts.length}</strong> material${alerts.length === 1 ? "" : "es"} para reponer</button>`;
  document.getElementById("go-alertas").addEventListener("click", () => {
    filter = "reposicion";
    showView("stock");
  });
}

function render() {
  renderBanner();
  fillCreateSelects();
  const alerts = alertsList(items);
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
    <button type="button" data-filter="reposicion" class="${filter === "reposicion" ? "on" : ""}"><strong>${alerts.length}</strong>a reponer</button>
  `;
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const term = searchStock.trim().toLowerCase();
  let rows = items;
  if (filter === "reposicion") rows = alerts;
  else if (filter !== "todos") rows = items.filter((i) => stockStatus(i) === filter);
  if (term) {
    rows = rows.filter((i) =>
      `${i.nombre} ${i.codigo} ${catLabel(i.categoria)} ${proveedorNombre(i.proveedorId)}`.toLowerCase().includes(term)
    );
  }
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
  const needs = st !== "stock";
  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)} · ${esc(catLabel(item.categoria))}</p>
    <h2>${esc(item.nombre)}</h2>
    <img class="detail-photo" src="${esc(item.imagen)}" alt="">
    <p style="font-size:14px;color:var(--muted)">${esc(item.descripcion || "")}</p>
    <div class="meta">
      <div><span>Precio</span>${esc(money(item.precio))} / ${esc(item.unidad)}</div>
      <div><span>Stock</span>${item.stock} ${esc(item.unidad)}</div>
      <div><span>Mínimo</span>${item.minimo}</div>
      <div><span>Proveedor</span>${esc(proveedorNombre(item.proveedorId))}</div>
    </div>
    ${needs ? `<p class="alert-note">Alerta de reposición · ${st === "agotado" ? "sin stock" : "por debajo del mínimo"}.</p>` : ""}
    <form id="edit">
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Stock<input name="stock" type="number" value="${item.stock}"></label>
      <label>Mínimo<input name="minimo" type="number" value="${item.minimo}"></label>
      <label>Proveedor
        <select name="proveedorId">
          ${proveedores.map((p) => `<option value="${esc(p.id)}" ${item.proveedorId === p.id ? "selected" : ""}>${esc(p.nombre)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        ${needs ? `<button class="ghost" type="button" id="reponer">Reponer mínimo</button>` : ""}
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
    item.proveedorId = String(data.get("proveedorId") || item.proveedorId);
    item.history = [{ when: "hoy", text: "Stock o precio actualizado." }, ...(item.history || [])];
    save(items);
    showToast("Guardado");
    render();
  });
  detail.querySelector("#reponer")?.addEventListener("click", () => {
    const result = reponerItem(item.id);
    items = load();
    showToast(`Reposición x${result.qty} · ${result.proveedor}`);
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
  renderBanner();
  fillPedidoSelect();
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
    ${p.tel ? `<p style="font-size:14px;">Tel. ${esc(p.tel)}</p>` : ""}
    <ul class="pedido-items">
      ${(p.items || []).map((i) => `<li><img src="${esc(i.imagen || "")}" alt=""> ${esc(i.nombre)} × ${i.cantidad} — ${esc(money(i.precio * i.cantidad))}</li>`).join("")}
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
      <label>Cliente<input name="cliente" value="${esc(p.cliente)}"></label>
      <label>Obra<input name="obra" value="${esc(p.obra)}"></label>
      <label>Teléfono<input name="tel" value="${esc(p.tel || "")}"></label>
      <label>Estado
        <select name="status">
          ${PEDIDO_ESTADOS.map((s) => `<option value="${s.id}" ${p.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-pedido">Eliminar</button>
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
    p.cliente = String(data.get("cliente") || p.cliente);
    p.obra = String(data.get("obra") || p.obra);
    p.tel = String(data.get("tel") || "");
    if (next !== p.status) {
      p.status = next;
      p.history = [{ when: "hoy", text: `Estado: ${pedidoLabel(next)}.` }, ...(p.history || [])];
    } else {
      p.history = [{ when: "hoy", text: "Pedido actualizado." }, ...(p.history || [])];
    }
    savePedidos(pedidos);
    showToast("Pedido actualizado");
    renderPedidos();
  });
  detail.querySelector("#remove-pedido").addEventListener("click", () => {
    if (!confirm("¿Eliminar este pedido?")) return;
    pedidos = pedidos.filter((i) => i.id !== p.id);
    selectedPedido = pedidos[0]?.id || "";
    savePedidos(pedidos);
    showToast("Pedido eliminado");
    renderPedidos();
  });
}

function renderProveedores() {
  renderBanner();
  const alerts = alertsList(items);
  document.getElementById("prov-stats").innerHTML = `
    <button type="button" class="on"><strong>${proveedores.length}</strong>proveedores</button>
    <button type="button"><strong>${alerts.length}</strong>ítems a reponer</button>
  `;
  document.getElementById("prov-rows").innerHTML = proveedores.map((p) => {
    const faltantes = items.filter((i) => i.proveedorId === p.id && stockStatus(i) !== "stock").length;
    return `
    <tr class="row ${p.id === selectedProv ? "on" : ""}" data-id="${esc(p.id)}">
      <td>${esc(p.nombre)}</td>
      <td>${esc(p.rubro)}</td>
      <td>${esc(p.tel)}</td>
      <td>${faltantes ? `<span class="tag bajo">${faltantes} a reponer</span>` : `<span class="tag stock">Ok</span>`}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="4">No hay proveedores.</td></tr>`;
  document.querySelectorAll("#prov-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedProv = row.dataset.id; renderProveedores(); });
  });

  const p = proveedores.find((i) => i.id === selectedProv);
  const detail = document.getElementById("prov-detail");
  if (!p) { detail.innerHTML = "<p>Elegí un proveedor.</p>"; return; }
  const linked = items.filter((i) => i.proveedorId === p.id);
  const faltantes = linked.filter((i) => stockStatus(i) !== "stock");
  detail.innerHTML = `
    <p class="eyebrow">${esc(p.cuit || "CUIT —")}</p>
    <h2>${esc(p.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(p.rubro)}</p>
    <div class="meta">
      <div><span>Teléfono</span>${esc(p.tel || "—")}</div>
      <div><span>Contacto</span>${esc(p.contacto || "—")}</div>
      <div><span>Materiales</span>${linked.length}</div>
      <div><span>A reponer</span>${faltantes.length}</div>
    </div>
    <p style="font-size:14px;color:var(--muted)">${esc(p.nota || "")}</p>
    ${faltantes.length ? `
      <div class="arca-section">
        <h4>Alertas de reposición</h4>
        ${faltantes.map((i) => `
          <p>${esc(i.nombre)} · ${i.stock}/${i.minimo}
            <button type="button" class="ghost" data-reponer="${esc(i.id)}">Reponer</button>
          </p>`).join("")}
      </div>
    ` : "<p class='muted'>Sin alertas con este proveedor.</p>"}
    <form id="edit-prov">
      <label>Nombre<input name="nombre" value="${esc(p.nombre)}"></label>
      <label>Rubro<input name="rubro" value="${esc(p.rubro)}"></label>
      <label>Teléfono<input name="tel" value="${esc(p.tel)}"></label>
      <label>CUIT<input name="cuit" value="${esc(p.cuit)}"></label>
      <label>Contacto<input name="contacto" value="${esc(p.contacto)}"></label>
      <label>Nota<input name="nota" value="${esc(p.nota)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-prov">Eliminar</button>
      </div>
    </form>
  `;
  detail.querySelectorAll("[data-reponer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const result = reponerItem(btn.dataset.reponer);
      items = load();
      showToast(`Reposición x${result.qty}`);
      renderProveedores();
    });
  });
  detail.querySelector("#edit-prov").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    p.nombre = String(data.get("nombre") || p.nombre);
    p.rubro = String(data.get("rubro") || "");
    p.tel = String(data.get("tel") || "");
    p.cuit = String(data.get("cuit") || "");
    p.contacto = String(data.get("contacto") || "");
    p.nota = String(data.get("nota") || "");
    saveProveedores(proveedores);
    showToast("Proveedor actualizado");
    renderProveedores();
  });
  detail.querySelector("#remove-prov").addEventListener("click", () => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    proveedores = proveedores.filter((i) => i.id !== p.id);
    selectedProv = proveedores[0]?.id || "";
    saveProveedores(proveedores);
    showToast("Proveedor eliminado");
    renderProveedores();
  });
}

function renderArca() {
  renderBanner();
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
    <p style="color:var(--muted);font-size:14px;">${esc(p.obra)}</p>
    <p><strong>Total ${esc(money(pedidoTotal(p)))}</strong></p>
    ${p.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(p.factura.tipo))}</strong> ${esc(p.factura.numero)}</p>
        <p>CUIT: ${esc(p.factura.cuit || "—")}</p>
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

fillCreateSelects();
render();
