let prods = loadProductos();
let peds = loadPedidos();
let ings = loadIngredientes();
let suc = loadSucursal();
let tab = "pedidos";
let selectedPed = peds[0]?.id || "";
let selectedProd = prods[0]?.id || "";
let selectedIng = ings[0]?.id || "";
let filterPed = "todos";
let filterIng = "todos";
let filterDel = "todos";
let searchTerm = "";

const createPedido = document.getElementById("create-pedido");
const createProd = document.getElementById("create-prod");
const createIng = document.getElementById("create-ing");
const openCreate = document.getElementById("open-create");

openCreate.addEventListener("click", () => {
  if (tab === "produccion") createProd.classList.toggle("open");
  else if (tab === "ingredientes") createIng.classList.toggle("open");
  else {
    tab = tab === "delivery" ? "delivery" : "pedidos";
    createPedido.classList.toggle("open");
  }
  render();
});

createPedido.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "mostrador");
  const count = peds.length + 1;
  const nuevo = {
    id: crypto.randomUUID(),
    numero: `PED-${String(count).padStart(3, "0")}`,
    tipo,
    cliente: {
      nombre: String(data.get("cliente") || "").trim(),
      tel: String(data.get("tel") || "").trim(),
      direccion: String(data.get("direccion") || "").trim()
    },
    items: [],
    hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    status: "pendiente",
    factura: null,
    notas: String(data.get("notas") || "").trim()
  };
  peds = [nuevo, ...peds];
  selectedPed = nuevo.id;
  savePedidos(peds);
  event.target.reset();
  event.target.classList.remove("open");
  tab = tipo === "delivery" ? "delivery" : "pedidos";
  showToast("Pedido creado");
  render();
});

createProd.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const prod = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "pollos"),
    precio: Number(data.get("precio") || 0),
    produccionDia: Number(data.get("produccionDia") || 0),
    vendidos: 0,
    stock: Number(data.get("stock") || 0),
    imagen: ""
  };
  prods = [prod, ...prods];
  selectedProd = prod.id;
  saveProductos(prods);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "produccion";
  showToast("Producto agregado");
  render();
});

createIng.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const ing = {
    id: crypto.randomUUID(),
    nombre: String(data.get("nombre") || ""),
    unidad: String(data.get("unidad") || "kg"),
    stock: Number(data.get("stock") || 0),
    minimo: Number(data.get("minimo") || 0),
    costo: Number(data.get("costo") || 0)
  };
  ings = [ing, ...ings];
  selectedIng = ing.id;
  saveIngredientes(ings);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "ingredientes";
  showToast("Ingrediente agregado");
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  tab = btn.dataset.tab;
  createPedido.classList.remove("open");
  createProd.classList.remove("open");
  createIng.classList.remove("open");
  render();
});

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === tab);
  });
  document.getElementById("view-pedidos").hidden = tab !== "pedidos";
  document.getElementById("view-produccion").hidden = tab !== "produccion";
  document.getElementById("view-ingredientes").hidden = tab !== "ingredientes";
  document.getElementById("view-delivery").hidden = tab !== "delivery";
  createPedido.style.display = tab === "pedidos" || tab === "delivery" ? "" : "none";
  createProd.style.display = tab === "produccion" ? "" : "none";
  createIng.style.display = tab === "ingredientes" ? "" : "none";
  const labels = {
    pedidos: "Nuevo pedido",
    delivery: "Nuevo delivery",
    produccion: "Nuevo producto",
    ingredientes: "Nuevo ingrediente"
  };
  const titles = {
    pedidos: "Pedidos del día",
    produccion: "Producción del día",
    ingredientes: "Ingredientes",
    delivery: "Delivery"
  };
  openCreate.textContent = labels[tab] || labels.pedidos;
  document.getElementById("panelTitle").textContent = titles[tab] || titles.pedidos;
}

function bindSearch() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
}

function renderSucursalChip() {
  const chip = document.getElementById("sucursal-chip");
  if (!chip) return;
  chip.innerHTML = `
    <strong>Sucursal</strong>
    ${esc(direccionCompleta(suc))}
    <div style="color:var(--muted);margin-top:4px;">Delivery: radio ${esc(String(suc.radioCuadras))} cuadras · mínimo ${esc(money(suc.minimoDelivery))}</div>
  `;
}

function render() {
  prods = loadProductos();
  peds = loadPedidos();
  ings = loadIngredientes();
  suc = loadSucursal();
  renderSucursalChip();
  setTabVisibility();
  if (tab === "pedidos") renderPedidos();
  else if (tab === "produccion") renderProduccion();
  else if (tab === "ingredientes") renderIngredientes();
  else renderDelivery();
}

function pedidosVisibles(base, filter) {
  let list = base;
  if (filter !== "todos") list = list.filter((p) => p.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    list = list.filter((p) =>
      p.numero.toLowerCase().includes(term) ||
      p.cliente.nombre.toLowerCase().includes(term) ||
      (p.cliente.direccion || "").toLowerCase().includes(term)
    );
  }
  return list;
}

function renderPedidoTable(list, selectedId) {
  return `
    <table>
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Tipo</th><th>Hora</th><th class="amount">Total</th><th>Estado</th></tr></thead>
      <tbody>
        ${list.map((p) => `
          <tr class="row ${p.id === selectedId ? "on" : ""}" data-id="${esc(p.id)}">
            <td>${esc(p.numero)}</td>
            <td>${esc(p.cliente.nombre)}</td>
            <td><span class="tag ${esc(p.tipo)}">${esc(tipoLabel(p.tipo))}</span></td>
            <td>${esc(p.hora)}</td>
            <td class="amount">${esc(money(calcTotalPedido(p)))}</td>
            <td><span class="tag ${esc(p.status)}">${esc(labelPedido(p.status))}</span></td>
          </tr>
        `).join("") || `<tr><td colspan="6">No hay pedidos.</td></tr>`}
      </tbody>
    </table>
  `;
}

function fillPedidoDetail(detail, pedido, extra = "") {
  if (!pedido) {
    detail.innerHTML = "<p>Elegí un pedido.</p>";
    return;
  }
  const total = calcTotalPedido(pedido);
  detail.innerHTML = `
    <p class="eyebrow">${esc(pedido.numero)} · ${esc(pedido.hora)}</p>
    <h2>${esc(pedido.cliente.nombre)}</h2>
    ${pedido.tipo === "delivery" ? `<p style="color:var(--muted);font-size:13px;">${esc(pedido.cliente.direccion)} · ${esc(pedido.cliente.tel)}</p>` : ""}
    <div class="meta">
      <div><span>Tipo</span><span class="tag ${esc(pedido.tipo)}">${esc(tipoLabel(pedido.tipo))}</span></div>
      <div><span>Estado</span><span class="tag ${esc(pedido.status)}">${esc(labelPedido(pedido.status))}</span></div>
    </div>
    ${pedido.notas ? `<p style="font-size:13px;background:#fef3c7;padding:8px;border-radius:4px;">${esc(pedido.notas)}</p>` : ""}
    ${pedido.tipo === "delivery" ? `
      <div class="zona-box">
        <strong>Zona de entrega</strong>
        Radio ${esc(String(suc.radioCuadras))} cuadras desde ${esc(suc.direccion)}, ${esc(suc.barrio)}.
        Envío gratis · mínimo ${esc(money(suc.minimoDelivery))}.
        ${pedido.cliente.direccion ? `<div style="margin-top:6px;">Destino: ${esc(pedido.cliente.direccion)}</div>` : ""}
      </div>
    ` : `<p class="place-line">Retiro en mostrador · ${esc(direccionCompleta(suc))}</p>`}

    <label>Productos</label>
    ${pedido.items.length > 0 ? `
      <ul class="items-pedido">
        ${pedido.items.map((item, idx) => {
          const prod = getProducto(item.producto);
          const img = fotoProducto(prod);
          return `<li>${img ? `<img src="${esc(img)}" alt="">` : ""}<span class="item-txt">${esc(prod?.nombre || "—")} x${item.cantidad}</span><span>${esc(money(item.precio * item.cantidad))}</span><button class="ghost" type="button" data-quitar="${idx}" ${pedido.factura ? "disabled" : ""}>Quitar</button></li>`;
        }).join("")}
      </ul>
    ` : `<p class="note">Sin productos</p>`}

    ${pedido.factura ? "" : `
      <label>Agregar producto</label>
      <select id="agregar-prod">
        <option value="">— Seleccionar —</option>
        ${prods.filter((p) => p.stock > 0).map((p) => `<option value="${p.id}">${esc(p.nombre)} - ${esc(money(p.precio))} (${p.stock} disp.)</option>`).join("")}
      </select>
      <button class="ghost" type="button" id="btn-agregar" style="margin-top:6px;">+ Agregar</button>
    `}

    <div style="text-align:right;font-size:18px;font-weight:700;margin:12px 0;">
      Total: ${esc(money(total))}
    </div>

    ${pedido.factura ? `
      <div class="factura-box">
        <h4>Cobrado</h4>
        <p><strong>${esc(compLabel(pedido.factura.tipo))}</strong> ${esc(pedido.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(pedido.factura.cae)}</span></p>
        <p>Total: ${esc(money(pedido.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Cobrar con ARCA</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="cobrar" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Cobrar y entregar (simulado)
        </button>
      </div>
    `}

    ${pedido.status !== "entregado" && !pedido.factura ? `
      <label>Cambiar estado</label>
      <select id="cambiar-status">
        ${STATUSES_PEDIDO.map((s) => `<option value="${s.id}" ${pedido.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
      </select>
      <button class="ghost" type="button" id="btn-status" style="margin-top:6px;">Actualizar estado</button>
    ` : ""}

    <form id="edit-pedido">
      <label>Cliente<input name="cliente" value="${esc(pedido.cliente.nombre)}"></label>
      <label>Teléfono<input name="tel" value="${esc(pedido.cliente.tel || "")}"></label>
      <label>Dirección<input name="direccion" value="${esc(pedido.cliente.direccion || "")}"></label>
      <label>Notas<input name="notas" value="${esc(pedido.notas || "")}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-pedido">Eliminar pedido</button>
      </div>
    </form>
    ${extra}
  `;

  detail.querySelector("#btn-agregar")?.addEventListener("click", () => {
    const prodId = detail.querySelector("#agregar-prod").value;
    if (!prodId) return;
    const prod = getProducto(prodId);
    if (!prod || prod.stock <= 0) return;
    const existing = pedido.items.find((i) => i.producto === prodId);
    if (existing) existing.cantidad++;
    else pedido.items.push({ producto: prodId, cantidad: 1, precio: prod.precio });
    prod.stock--;
    prod.vendidos = (prod.vendidos || 0) + 1;
    saveProductos(prods);
    savePedidos(peds);
    showToast("Producto agregado");
    render();
  });

  detail.querySelectorAll("[data-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.quitar);
      const line = pedido.items[idx];
      if (!line) return;
      const prod = getProducto(line.producto);
      if (prod) {
        prod.stock += line.cantidad;
        prod.vendidos = Math.max(0, (prod.vendidos || 0) - line.cantidad);
      }
      pedido.items.splice(idx, 1);
      saveProductos(prods);
      savePedidos(peds);
      showToast("Producto quitado");
      render();
    });
  });

  detail.querySelector("#cobrar")?.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    pedido.factura = {
      tipo, numero, cae,
      vto: vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" }),
      total
    };
    pedido.status = "entregado";
    savePedidos(peds);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#btn-status")?.addEventListener("click", () => {
    pedido.status = detail.querySelector("#cambiar-status").value;
    savePedidos(peds);
    showToast("Estado actualizado");
    render();
  });

  detail.querySelector("#edit-pedido")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    pedido.cliente.nombre = String(data.get("cliente") || "");
    pedido.cliente.tel = String(data.get("tel") || "");
    pedido.cliente.direccion = String(data.get("direccion") || "");
    pedido.notas = String(data.get("notas") || "");
    savePedidos(peds);
    showToast("Pedido actualizado");
    render();
  });

  detail.querySelector("#remove-pedido")?.addEventListener("click", () => {
    if (!confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.")) return;
    peds = peds.filter((p) => p.id !== pedido.id);
    selectedPed = peds[0]?.id || "";
    savePedidos(peds);
    showToast("Pedido eliminado");
    render();
  });
}

function renderPedidos() {
  const pendientes = peds.filter((p) => p.status === "pendiente").length;
  const preparando = peds.filter((p) => p.status === "preparando").length;
  const listos = peds.filter((p) => p.status === "listo").length;
  const delivery = peds.filter((p) => p.tipo === "delivery" && p.status !== "entregado").length;
  const visible = pedidosVisibles(peds, filterPed);

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterPed === "todos" ? "on" : ""}"><strong>${peds.length}</strong>pedidos</button>
    <button type="button" data-filter="pendiente" class="${filterPed === "pendiente" ? "on" : ""}"><strong>${pendientes}</strong>pendientes</button>
    <button type="button" data-filter="preparando" class="${filterPed === "preparando" ? "on" : ""}"><strong>${preparando}</strong>preparando</button>
    <button type="button" data-filter="listo" class="${filterPed === "listo" ? "on" : ""}"><strong>${listos}</strong>listos</button>
    <div><strong>${delivery}</strong>delivery activo</div>
    <input type="text" id="search" placeholder="Buscar pedido..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filterPed = btn.dataset.filter; render(); });
  });

  document.getElementById("pedidos-list").innerHTML = renderPedidoTable(visible, selectedPed);
  document.querySelectorAll("#pedidos-list .row").forEach((row) => {
    row.addEventListener("click", () => { selectedPed = row.dataset.id; render(); });
  });
  fillPedidoDetail(document.getElementById("pedidos-detail"), peds.find((p) => p.id === selectedPed));
}

function renderDelivery() {
  const deliveries = peds.filter((p) => p.tipo === "delivery");
  const activos = deliveries.filter((p) => p.status !== "entregado" && p.status !== "cancelado");
  const visible = pedidosVisibles(deliveries, filterDel);
  if (!deliveries.find((p) => p.id === selectedPed) && visible[0]) selectedPed = visible[0].id;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterDel === "todos" ? "on" : ""}"><strong>${deliveries.length}</strong>deliveries</button>
    <button type="button" data-filter="pendiente" class="${filterDel === "pendiente" ? "on" : ""}"><strong>${deliveries.filter((p) => p.status === "pendiente").length}</strong>pendientes</button>
    <button type="button" data-filter="preparando" class="${filterDel === "preparando" ? "on" : ""}"><strong>${deliveries.filter((p) => p.status === "preparando").length}</strong>preparando</button>
    <button type="button" data-filter="listo" class="${filterDel === "listo" ? "on" : ""}"><strong>${deliveries.filter((p) => p.status === "listo").length}</strong>en camino</button>
    <div><strong>${activos.length}</strong>activos</div>
    <input type="text" id="search" placeholder="Buscar dirección o cliente..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filterDel = btn.dataset.filter; render(); });
  });

  document.getElementById("del-list").innerHTML = renderPedidoTable(visible, selectedPed);
  document.querySelectorAll("#del-list .row").forEach((row) => {
    row.addEventListener("click", () => { selectedPed = row.dataset.id; render(); });
  });
  fillPedidoDetail(document.getElementById("del-detail"), peds.find((p) => p.id === selectedPed), `
    <form class="sucursal-form" id="form-sucursal" style="margin-top:16px;">
      <h3 style="font-size:14px;margin:0;">Zona de delivery</h3>
      <label>Radio (cuadras)<input name="radioCuadras" type="number" min="1" value="${esc(String(suc.radioCuadras))}"></label>
      <label>Mínimo<input name="minimoDelivery" type="number" min="0" value="${esc(String(suc.minimoDelivery))}"></label>
      <label>Dirección del local<input name="direccion" value="${esc(suc.direccion)}"></label>
      <div class="actions"><button class="btn-panel" type="submit">Guardar zona</button></div>
    </form>
  `);
  document.getElementById("form-sucursal")?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = ev.target;
    suc.radioCuadras = Number(form.radioCuadras.value) || suc.radioCuadras;
    suc.minimoDelivery = Number(form.minimoDelivery.value) || 0;
    suc.direccion = form.direccion.value.trim() || suc.direccion;
    saveSucursal();
    showToast("Zona actualizada");
    render();
  });
}

function renderProduccion() {
  const term = searchTerm.toLowerCase();
  const visible = term
    ? prods.filter((p) => p.nombre.toLowerCase().includes(term) || p.codigo.toLowerCase().includes(term))
    : prods;
  const bajos = prods.filter((p) => p.stock < 3).length;

  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>${prods.length}</strong>productos</div>
    <div><strong>${prods.reduce((s, p) => s + (p.produccionDia || 0), 0)}</strong>producidos hoy</div>
    <div><strong>${bajos}</strong>stock bajo</div>
    <input type="text" id="search" placeholder="Buscar producto..." value="${esc(searchTerm)}">
  `;
  bindSearch();

  const porCategoria = {};
  visible.forEach((p) => {
    if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
    porCategoria[p.categoria].push(p);
  });

  document.getElementById("prod-list").innerHTML = Object.entries(porCategoria).map(([cat, items]) => `
    <h3 style="margin:16px 0 8px;font-size:14px;color:var(--naranja);">${esc(catLabel(cat))}</h3>
    <div class="produccion-grid">
      ${items.map((p) => `
        <div class="prod-card ${p.id === selectedProd ? "on" : ""}" data-id="${esc(p.id)}">
          <div class="card-photo">${p.imagen ? `<img src="${esc(fotoProducto(p))}" alt="${esc(p.nombre)}">` : ""}</div>
          <div class="prod-card-body">
            <div class="nombre">${esc(p.nombre)}</div>
            <div class="numeros">
              <div><div class="num">${p.produccionDia || 0}</div><small>producidos</small></div>
              <div><div class="num ${p.stock < 3 ? "rojo" : "verde"}">${p.stock}</div><small>disponibles</small></div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `).join("") || `<p class="note">No hay productos.</p>`;

  document.querySelectorAll(".prod-card").forEach((card) => {
    card.addEventListener("click", () => { selectedProd = card.dataset.id; render(); });
  });

  const prod = prods.find((p) => p.id === selectedProd);
  const detail = document.getElementById("prod-detail");
  if (!prod) { detail.innerHTML = "<p>Elegí un producto.</p>"; return; }

  detail.innerHTML = `
    <p class="eyebrow">${esc(prod.codigo)} · ${esc(catLabel(prod.categoria))}</p>
    <h2>${esc(prod.nombre)}</h2>
    <div class="meta">
      <div><span>Precio</span>${esc(money(prod.precio))}</div>
      <div><span>Vendidos</span>${prod.vendidos || 0}</div>
    </div>
    <div class="actions">
      <button class="btn-panel" type="button" id="prod-plus">+1 producción</button>
      <button class="ghost" type="button" id="stock-plus">+1 stock</button>
    </div>
    <form id="edit-prod">
      <label>Nombre<input name="nombre" value="${esc(prod.nombre)}"></label>
      <label>Categoría
        <select name="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.id}" ${prod.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio<input name="precio" type="number" value="${prod.precio}"></label>
      <label>Producción del día<input name="produccionDia" type="number" value="${prod.produccionDia || 0}"></label>
      <label>Stock<input name="stock" type="number" value="${prod.stock}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-prod">Eliminar</button>
      </div>
    </form>
  `;

  detail.querySelector("#prod-plus").addEventListener("click", () => {
    prod.produccionDia = (prod.produccionDia || 0) + 1;
    prod.stock += 1;
    saveProductos(prods);
    showToast("Producción +1");
    render();
  });
  detail.querySelector("#stock-plus").addEventListener("click", () => {
    prod.stock += 1;
    saveProductos(prods);
    showToast("Stock +1");
    render();
  });
  detail.querySelector("#edit-prod").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    Object.assign(prod, {
      nombre: String(data.get("nombre") || ""),
      categoria: String(data.get("categoria") || prod.categoria),
      precio: Number(data.get("precio") || 0),
      produccionDia: Number(data.get("produccionDia") || 0),
      stock: Number(data.get("stock") || 0)
    });
    saveProductos(prods);
    showToast("Producto actualizado");
    render();
  });
  detail.querySelector("#remove-prod").addEventListener("click", () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    prods = prods.filter((p) => p.id !== prod.id);
    selectedProd = prods[0]?.id || "";
    saveProductos(prods);
    showToast("Producto eliminado");
    render();
  });
}

function renderIngredientes() {
  const bajos = ings.filter((i) => i.stock <= i.minimo);
  const term = searchTerm.toLowerCase();
  let visible = filterIng === "bajo" ? bajos : ings;
  if (term) visible = visible.filter((i) => i.nombre.toLowerCase().includes(term));

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterIng === "todos" ? "on" : ""}"><strong>${ings.length}</strong>ingredientes</button>
    <button type="button" data-filter="bajo" class="${filterIng === "bajo" ? "on" : ""}"><strong>${bajos.length}</strong>stock bajo</button>
    <input type="text" id="search" placeholder="Buscar ingrediente..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filterIng = btn.dataset.filter; render(); });
  });

  document.getElementById("ing-list").innerHTML = `
    <table>
      <thead><tr><th>Ingrediente</th><th>Unidad</th><th class="amount">Stock</th><th class="amount">Mínimo</th><th class="amount">Costo</th><th>Estado</th></tr></thead>
      <tbody>
        ${visible.map((i) => `
          <tr class="row ${i.id === selectedIng ? "on" : ""}" data-id="${esc(i.id)}">
            <td>${esc(i.nombre)}</td>
            <td>${esc(i.unidad)}</td>
            <td class="amount">${i.stock}</td>
            <td class="amount">${i.minimo}</td>
            <td class="amount">${esc(money(i.costo))}</td>
            <td><span class="tag ${i.stock <= i.minimo ? "pendiente" : "listo"}">${i.stock <= i.minimo ? "Reponer" : "OK"}</span></td>
          </tr>
        `).join("") || `<tr><td colspan="6">No hay ingredientes.</td></tr>`}
      </tbody>
    </table>
  `;
  document.querySelectorAll("#ing-list .row").forEach((row) => {
    row.addEventListener("click", () => { selectedIng = row.dataset.id; render(); });
  });

  const ing = ings.find((i) => i.id === selectedIng);
  const detail = document.getElementById("ing-detail");
  if (!ing) { detail.innerHTML = "<p>Elegí un ingrediente.</p>"; return; }

  detail.innerHTML = `
    <h2>${esc(ing.nombre)}</h2>
    <p class="note">Stock de materia prima para la producción del día.</p>
    <form id="edit-ing">
      <label>Nombre<input name="nombre" value="${esc(ing.nombre)}"></label>
      <label>Unidad<input name="unidad" value="${esc(ing.unidad)}"></label>
      <label>Stock<input name="stock" type="number" value="${ing.stock}"></label>
      <label>Mínimo<input name="minimo" type="number" value="${ing.minimo}"></label>
      <label>Costo<input name="costo" type="number" value="${ing.costo}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="reponer">Reponer mínimo</button>
        <button class="ghost" type="button" id="remove-ing">Eliminar</button>
      </div>
    </form>
  `;

  detail.querySelector("#edit-ing").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    Object.assign(ing, {
      nombre: String(data.get("nombre") || ""),
      unidad: String(data.get("unidad") || ""),
      stock: Number(data.get("stock") || 0),
      minimo: Number(data.get("minimo") || 0),
      costo: Number(data.get("costo") || 0)
    });
    saveIngredientes(ings);
    showToast("Ingrediente actualizado");
    render();
  });
  detail.querySelector("#reponer").addEventListener("click", () => {
    if (ing.stock < ing.minimo) ing.stock = ing.minimo;
    else ing.stock += ing.minimo;
    saveIngredientes(ings);
    showToast("Stock repuesto");
    render();
  });
  detail.querySelector("#remove-ing").addEventListener("click", () => {
    if (!confirm("¿Eliminar este ingrediente? Esta acción no se puede deshacer.")) return;
    ings = ings.filter((i) => i.id !== ing.id);
    selectedIng = ings[0]?.id || "";
    saveIngredientes(ings);
    showToast("Ingrediente eliminado");
    render();
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
