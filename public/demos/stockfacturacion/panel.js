let prods = loadProductos();
let facts = loadFacturas();
let tab = "stock";
let selectedProd = prods[0]?.id || "";
let selectedFact = facts[0]?.id || "";
let filterStock = "todos";
let filterFact = "todos";
let searchTerm = "";

const createProd = document.getElementById("create-prod");
const createFac = document.getElementById("create-fac");
const openCreate = document.getElementById("open-create");
const searchInput = document.getElementById("search");

openCreate.addEventListener("click", () => {
  if (tab === "facturas") {
    createFac.classList.toggle("open");
    createProd.classList.remove("open");
  } else {
    tab = "stock";
    createProd.classList.toggle("open");
    createFac.classList.remove("open");
  }
  render();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  tab = btn.dataset.tab;
  createProd.classList.remove("open");
  createFac.classList.remove("open");
  render();
});

createProd.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const stock = Number(data.get("stock") || 0);
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "otros"),
    precioCompra: Number(data.get("precioCompra") || 0),
    precioVenta: Number(data.get("precioVenta") || 0),
    stock,
    minimo: Number(data.get("minimo") || 3),
    ubicacion: String(data.get("ubicacion") || "Sin ubicar"),
    proveedor: String(data.get("proveedor") || "Sin proveedor"),
    status: "activo",
    movimientos: stock ? [{ tipo: "ingreso", cantidad: stock, fecha: "hoy", nota: "Alta inicial" }] : []
  };
  item.status = stockStatus(item);
  prods = [item, ...prods];
  selectedProd = item.id;
  saveProductos(prods);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "stock";
  showToast("Producto agregado");
  render();
});

createFac.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const prod = prods.find((p) => p.id === data.get("prodId"));
  const cantidad = Number(data.get("cantidad") || 1);
  const tipo = String(data.get("tipo") || "FB");
  const items = prod ? [{ codigo: prod.codigo, nombre: prod.nombre, cantidad, precio: prod.precioVenta }] : [];
  const subtotal = items.reduce((sum, line) => sum + line.precio * line.cantidad, 0);
  const iva = tipo === "FA" ? Math.round(subtotal * 0.21) : 0;
  const count = facts.length + 1;
  const fac = {
    id: crypto.randomUUID(),
    tipo,
    numero: `0002-${String(count + 89).padStart(8, "0")}`,
    fecha: "hoy",
    cliente: {
      nombre: String(data.get("nombre") || "Consumidor Final"),
      cuit: String(data.get("cuit") || ""),
      direccion: ""
    },
    items,
    subtotal,
    iva,
    total: subtotal + iva,
    cae: "",
    vencimientoCae: "",
    status: "borrador",
    pagada: false
  };
  facts = [fac, ...facts];
  selectedFact = fac.id;
  saveFacturas(facts);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "facturas";
  showToast("Borrador de factura creado");
  render();
});

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === tab);
  });
  document.getElementById("view-stock").hidden = tab !== "stock";
  document.getElementById("view-facturas").hidden = tab !== "facturas";
  document.getElementById("view-movimientos").hidden = tab !== "movimientos";
  document.getElementById("view-alertas").hidden = tab !== "alertas";
  createProd.style.display = tab === "stock" ? "" : "none";
  createFac.style.display = tab === "facturas" ? "" : "none";
  const titles = {
    stock: "Stock",
    facturas: "Facturas ARCA",
    movimientos: "Movimientos de stock",
    alertas: "Alertas de reposición"
  };
  document.getElementById("panelTitle").textContent = titles[tab];
  openCreate.textContent = tab === "facturas" ? "Nueva factura" : "Nuevo producto";
}

function fillFactProductSelect() {
  const select = createFac.querySelector("[name=prodId]");
  select.innerHTML = prods.map((p) => `<option value="${esc(p.id)}">${esc(p.codigo)} · ${esc(p.nombre)}</option>`).join("");
}

function renderBanner() {
  const alerts = restockAlerts(prods);
  const box = document.getElementById("alertBanner");
  if (!alerts.length || tab === "alertas") {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `<button class="alert-banner" type="button" id="go-alertas"><strong>${alerts.length}</strong> producto${alerts.length === 1 ? "" : "s"} para reponer</button>`;
  document.getElementById("go-alertas").addEventListener("click", () => {
    tab = "alertas";
    render();
  });
}

function renderStats() {
  const alerts = restockAlerts(prods);
  const emitidas = facts.filter((f) => f.status === "emitida").length;
  document.getElementById("stats").innerHTML = tab === "stock" || tab === "alertas" || tab === "movimientos" ? `
    <button type="button" data-filter="todos" class="${filterStock === "todos" ? "on" : ""}"><strong>${prods.length}</strong>productos</button>
    <button type="button" data-filter="activo" class="${filterStock === "activo" ? "on" : ""}"><strong>${prods.filter((p) => stockStatus(p) === "activo").length}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filterStock === "bajo" ? "on" : ""}"><strong>${prods.filter((p) => stockStatus(p) === "bajo").length}</strong>stock bajo</button>
    <button type="button" data-filter="agotado" class="${filterStock === "agotado" ? "on" : ""}"><strong>${prods.filter((p) => stockStatus(p) === "agotado").length}</strong>agotados</button>
    <div><strong>${alerts.length}</strong>a reponer</div>
  ` : `
    <button type="button" data-filter="todos" class="${filterFact === "todos" ? "on" : ""}"><strong>${facts.length}</strong>comprobantes</button>
    <button type="button" data-filter="emitida" class="${filterFact === "emitida" ? "on" : ""}"><strong>${emitidas}</strong>emitidas</button>
    <button type="button" data-filter="pagada" class="${filterFact === "pagada" ? "on" : ""}"><strong>${facts.filter((f) => f.pagada).length}</strong>pagadas</button>
    <button type="button" data-filter="borrador" class="${filterFact === "borrador" ? "on" : ""}"><strong>${facts.filter((f) => f.status === "borrador").length}</strong>borradores</button>
  `;

  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (tab === "facturas") filterFact = btn.dataset.filter;
      else filterStock = btn.dataset.filter;
      if (btn.dataset.filter === "bajo" || btn.dataset.filter === "agotado") tab = "stock";
      render();
    });
  });
}

function prodVisible() {
  let result = filterStock === "todos" ? prods : prods.filter((p) => stockStatus(p) === filterStock);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((p) =>
      p.nombre.toLowerCase().includes(term) ||
      p.codigo.toLowerCase().includes(term) ||
      (p.proveedor || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function factVisible() {
  let result = facts;
  if (filterFact === "emitida") result = facts.filter((f) => f.status === "emitida");
  else if (filterFact === "pagada") result = facts.filter((f) => f.pagada);
  else if (filterFact === "borrador") result = facts.filter((f) => f.status === "borrador");
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((f) =>
      f.numero.toLowerCase().includes(term) ||
      f.cliente.nombre.toLowerCase().includes(term) ||
      (f.cliente.cuit || "").includes(term)
    );
  }
  return result;
}

function renderStock() {
  const visible = prodVisible();
  document.getElementById("rows-stock").innerHTML = visible.map((p) => `
    <tr class="row ${p.id === selectedProd ? "on" : ""}" data-id="${esc(p.id)}">
      <td>${esc(p.codigo)}</td>
      <td>${esc(p.nombre)}</td>
      <td>${esc(catLabel(p.categoria))}</td>
      <td class="amount">${esc(money(p.precioVenta))}</td>
      <td class="amount">${p.stock}</td>
      <td><span class="tag ${esc(stockStatus(p))}">${esc(label(stockStatus(p)))}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No hay productos.</td></tr>`;

  document.querySelectorAll("#rows-stock .row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedProd = row.dataset.id;
      render();
    });
  });

  const prod = prods.find((p) => p.id === selectedProd);
  const detail = document.getElementById("detail-stock");
  if (!prod) {
    detail.innerHTML = "<p>Elegí un producto.</p>";
    return;
  }
  const margen = prod.precioVenta - prod.precioCompra;
  const margenPct = prod.precioCompra > 0 ? Math.round((margen / prod.precioCompra) * 100) : 0;
  detail.innerHTML = `
    <p class="eyebrow">${esc(prod.codigo)} · ${esc(catLabel(prod.categoria))}</p>
    <h2>${esc(prod.nombre)}</h2>
    <div class="meta">
      <div><span>Precio compra</span>${esc(money(prod.precioCompra))}</div>
      <div><span>Precio venta</span>${esc(money(prod.precioVenta))}</div>
      <div><span>Margen</span>${esc(money(margen))} (${margenPct}%)</div>
      <div><span>Stock</span><strong class="${stockStatus(prod) === "activo" ? "ok" : "warn"}">${prod.stock}</strong> / mín: ${prod.minimo}</div>
      <div><span>Ubicación</span>${esc(prod.ubicacion)}</div>
      <div><span>Proveedor</span>${esc(prod.proveedor)}</div>
    </div>
    <div class="arca-section">
      <h4>Registrar movimiento</h4>
      <div class="mov-grid">
        <select id="mov-tipo">
          ${MOVIMIENTOS.map((m) => `<option value="${m.id}">${esc(m.label)}</option>`).join("")}
        </select>
        <input id="mov-cant" type="number" placeholder="Cantidad" min="1">
      </div>
      <input id="mov-nota" placeholder="Nota / motivo">
      <button class="btn-panel" type="button" id="registrar-mov">Registrar</button>
    </div>
    <form id="edit-prod">
      <label>Código<input name="codigo" value="${esc(prod.codigo)}"></label>
      <label>Nombre<input name="nombre" value="${esc(prod.nombre)}"></label>
      <label>Categoría
        <select name="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.id}" ${prod.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio compra<input name="precioCompra" type="number" value="${prod.precioCompra}"></label>
      <label>Precio venta<input name="precioVenta" type="number" value="${prod.precioVenta}"></label>
      <label>Mínimo<input name="minimo" type="number" value="${prod.minimo}"></label>
      <label>Proveedor<input name="proveedor" value="${esc(prod.proveedor)}"></label>
      <label>Ubicación<input name="ubicacion" value="${esc(prod.ubicacion)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-prod">Eliminar</button>
      </div>
    </form>
    <div class="movimientos">
      <h3>Últimos movimientos</h3>
      ${(prod.movimientos || []).slice(0, 8).map((m) => `
        <div class="mov-item">
          <span><strong>${esc(movLabel(m.tipo))}</strong> ${m.tipo === "egreso" ? "-" : "+"}${m.cantidad}</span>
          <span>${esc(m.fecha)} · ${esc(m.nota)}</span>
        </div>
      `).join("") || "<p class='note'>Sin movimientos</p>"}
    </div>
  `;

  detail.querySelector("#registrar-mov").addEventListener("click", () => {
    const tipo = detail.querySelector("#mov-tipo").value;
    const cantidad = parseInt(detail.querySelector("#mov-cant").value, 10) || 0;
    const nota = detail.querySelector("#mov-nota").value;
    if (cantidad <= 0) {
      showToast("Indicá una cantidad");
      return;
    }
    if (tipo === "egreso" && cantidad > prod.stock) {
      showToast("No hay stock suficiente");
      return;
    }
    prod.movimientos = [
      { tipo, cantidad, fecha: "hoy", nota: nota || movLabel(tipo) },
      ...(prod.movimientos || [])
    ];
    if (tipo === "ingreso" || tipo === "devolucion") prod.stock += cantidad;
    else if (tipo === "egreso") prod.stock -= cantidad;
    else if (tipo === "ajuste") prod.stock = cantidad;
    prod.status = stockStatus(prod);
    saveProductos(prods);
    showToast("Movimiento registrado");
    render();
  });

  detail.querySelector("#edit-prod").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    Object.assign(prod, {
      codigo: String(data.get("codigo") || ""),
      nombre: String(data.get("nombre") || ""),
      categoria: String(data.get("categoria") || "otros"),
      precioCompra: Number(data.get("precioCompra") || 0),
      precioVenta: Number(data.get("precioVenta") || 0),
      minimo: Number(data.get("minimo") || 0),
      proveedor: String(data.get("proveedor") || ""),
      ubicacion: String(data.get("ubicacion") || "")
    });
    prod.status = stockStatus(prod);
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

function renderFacturas() {
  const visible = factVisible();
  document.getElementById("rows-fact").innerHTML = visible.map((f) => `
    <tr class="row ${f.id === selectedFact ? "on" : ""}" data-id="${esc(f.id)}">
      <td><strong>${esc(compLabel(f.tipo))}</strong></td>
      <td>${esc(f.numero)}</td>
      <td>${esc(f.fecha)}</td>
      <td>${esc(f.cliente.nombre)}</td>
      <td class="amount">${esc(money(f.total))}</td>
      <td><span class="tag ${f.pagada ? "pagada" : esc(f.status)}">${f.pagada ? "Pagada" : (f.status === "borrador" ? "Borrador" : "Emitida")}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No hay comprobantes.</td></tr>`;

  document.querySelectorAll("#rows-fact .row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedFact = row.dataset.id;
      render();
    });
  });

  const fac = facts.find((f) => f.id === selectedFact);
  const detail = document.getElementById("detail-fact");
  if (!fac) {
    detail.innerHTML = "<p>Elegí una factura.</p>";
    return;
  }

  detail.innerHTML = `
    <p class="eyebrow">${esc(compLabel(fac.tipo))} · ${esc(fac.numero)}</p>
    <h2>${esc(fac.cliente.nombre)}</h2>
    <p class="muted">${esc(fac.cliente.cuit) || "Consumidor Final"} ${fac.cliente.direccion ? `· ${esc(fac.cliente.direccion)}` : ""}</p>
    <div class="meta">
      <div><span>Fecha</span>${esc(fac.fecha)}</div>
      <div><span>Estado</span>${fac.pagada ? "Pagada" : (fac.status === "borrador" ? "Borrador" : "Emitida")}</div>
      ${fac.tipo === "FA" ? `<div><span>Subtotal</span>${esc(money(fac.subtotal))}</div><div><span>IVA 21%</span>${esc(money(fac.iva))}</div>` : ""}
      <div><span>Total</span><strong>${esc(money(fac.total))}</strong></div>
    </div>
    ${fac.items.length ? `
      <label>Ítems</label>
      <ul class="items-list">
        ${fac.items.map((i) => `<li><span>${esc(i.nombre)} x${i.cantidad}</span><span>${esc(money(i.precio * i.cantidad))}</span></li>`).join("")}
      </ul>
    ` : `<p class="note">Sin ítems</p>`}
    ${fac.status === "borrador" ? `
      <form id="add-item" class="rep-form">
        <select name="prodId">
          ${prods.map((p) => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join("")}
        </select>
        <input name="cantidad" type="number" min="1" value="1">
        <button class="ghost" type="submit">Agregar ítem</button>
      </form>
    ` : ""}
    ${fac.cae ? `
      <div class="factura-box">
        <h4>CAE obtenido</h4>
        <p>CAE: <span class="cae">${esc(fac.cae)}</span></p>
        <p>Vencimiento: ${esc(fac.vencimientoCae)}</p>
      </div>
    ` : (fac.status === "borrador" ? `
      <div class="arca-section">
        <h4>Emitir con ARCA (AFIP)</h4>
        <label>Tipo comprobante
          <select id="fac-tipo">
            ${COMPROBANTES.filter((c) => !["NC", "ND", "RE"].includes(c.id)).map((c) => `<option value="${c.id}" ${fac.tipo === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <label>CUIT cliente<input id="fac-cuit" value="${esc(fac.cliente.cuit)}" placeholder="30-12345678-9"></label>
        <label>Razón social<input id="fac-nombre" value="${esc(fac.cliente.nombre)}"></label>
        <button class="btn-panel" type="button" id="emitir">Emitir factura (simulado)</button>
        <p class="hint">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    ` : "")}
    <div class="actions">
      ${!fac.pagada && fac.status === "emitida" ? `<button class="ghost" type="button" id="marcar-pagada">Marcar como pagada</button>` : ""}
      <button class="ghost" type="button" id="remove-fac">Eliminar</button>
    </div>
  `;

  detail.querySelector("#add-item")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prod = prods.find((p) => p.id === data.get("prodId"));
    if (!prod) return;
    const cantidad = Number(data.get("cantidad") || 1);
    fac.items = [...fac.items, { codigo: prod.codigo, nombre: prod.nombre, cantidad, precio: prod.precioVenta }];
    fac.subtotal = fac.items.reduce((sum, line) => sum + line.precio * line.cantidad, 0);
    fac.iva = fac.tipo === "FA" ? Math.round(fac.subtotal * 0.21) : 0;
    fac.total = fac.subtotal + fac.iva;
    saveFacturas(facts);
    showToast("Ítem agregado");
    render();
  });

  detail.querySelector("#emitir")?.addEventListener("click", () => {
    if (!fac.items.length) {
      showToast("Agregá al menos un ítem");
      return;
    }
    fac.tipo = detail.querySelector("#fac-tipo").value;
    fac.cliente.cuit = detail.querySelector("#fac-cuit").value;
    fac.cliente.nombre = detail.querySelector("#fac-nombre").value;
    fac.cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    fac.vencimientoCae = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
    fac.status = "emitida";
    fac.items.forEach((line) => {
      const prod = prods.find((p) => p.codigo === line.codigo);
      if (!prod) return;
      prod.stock = Math.max(0, prod.stock - line.cantidad);
      prod.status = stockStatus(prod);
      prod.movimientos = [
        { tipo: "egreso", cantidad: line.cantidad, fecha: "hoy", nota: `Venta ${fac.numero}` },
        ...(prod.movimientos || [])
      ];
    });
    saveProductos(prods);
    saveFacturas(facts);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#marcar-pagada")?.addEventListener("click", () => {
    fac.pagada = true;
    saveFacturas(facts);
    showToast("Factura marcada como pagada");
    render();
  });

  detail.querySelector("#remove-fac").addEventListener("click", () => {
    if (!confirm("¿Eliminar este comprobante? Esta acción no se puede deshacer.")) return;
    facts = facts.filter((f) => f.id !== fac.id);
    selectedFact = facts[0]?.id || "";
    saveFacturas(facts);
    showToast("Comprobante eliminado");
    render();
  });
}

function renderMovimientos() {
  const term = searchTerm.toLowerCase();
  const rows = allMovimientos(prods).filter((m) =>
    !term || m.nombre.toLowerCase().includes(term) || m.codigo.toLowerCase().includes(term) || (m.nota || "").toLowerCase().includes(term)
  );
  document.getElementById("rows-mov").innerHTML = rows.map((m) => `
    <tr class="row" data-id="${esc(m.prodId)}">
      <td>${esc(m.fecha)}</td>
      <td><span class="tag ${m.tipo === "egreso" ? "agotado" : "activo"}">${esc(movLabel(m.tipo))}</span></td>
      <td>${esc(m.codigo)} · ${esc(m.nombre)}</td>
      <td class="amount">${m.tipo === "egreso" ? "-" : "+"}${m.cantidad}</td>
      <td>${esc(m.nota || "")}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay movimientos.</td></tr>`;
  document.querySelectorAll("#rows-mov .row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedProd = row.dataset.id;
      tab = "stock";
      render();
    });
  });
}

function renderAlertas() {
  const list = restockAlerts(prods).filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.nombre.toLowerCase().includes(term) || p.codigo.toLowerCase().includes(term);
  });
  document.getElementById("alertas").innerHTML = list.map((p) => `
    <article class="mesa-card">
      <div class="mesa-head">
        <span>${esc(p.codigo)}</span>
        <span class="tag ${esc(stockStatus(p))}">${esc(label(stockStatus(p)))}</span>
      </div>
      <h3>${esc(p.nombre)}</h3>
      <p>Stock ${p.stock} · mínimo ${p.minimo}</p>
      <p class="muted">${esc(p.proveedor)} · ${esc(p.ubicacion)}</p>
      <div class="actions">
        <button class="btn-panel" type="button" data-open="${esc(p.id)}">Abrir ficha</button>
        <button class="ghost" type="button" data-reponer="${esc(p.id)}">Reponer mínimo</button>
      </div>
    </article>
  `).join("") || "<p class='note'>No hay alertas de reposición.</p>";

  document.querySelectorAll("#alertas [data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedProd = btn.dataset.open;
      tab = "stock";
      render();
    });
  });
  document.querySelectorAll("#alertas [data-reponer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = prods.find((p) => p.id === btn.dataset.reponer);
      if (!prod) return;
      const qty = Math.max(prod.minimo - prod.stock, prod.minimo);
      prod.stock += qty;
      prod.status = stockStatus(prod);
      prod.movimientos = [
        { tipo: "ingreso", cantidad: qty, fecha: "hoy", nota: "Reposición por alerta" },
        ...(prod.movimientos || [])
      ];
      saveProductos(prods);
      showToast("Reposición registrada");
      render();
    });
  });
}

function render() {
  setTabVisibility();
  fillFactProductSelect();
  renderBanner();
  renderStats();
  renderStock();
  renderFacturas();
  renderMovimientos();
  renderAlertas();
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
