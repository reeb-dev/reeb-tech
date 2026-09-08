let prods = loadProductos();
let facts = loadFacturas();
let tab = "stock";
let selectedProd = prods[0]?.id || "";
let selectedFact = facts[0]?.id || "";
let filterStock = "todos";
let filterFact = "todos";

// Tab switching
document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    tab = btn.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    render();
  });
});

document.getElementById("nueva-factura").addEventListener("click", () => {
  tab = "facturas";
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === "facturas"));
  // Create new factura
  const count = facts.length + 1;
  const fac = {
    id: crypto.randomUUID(),
    tipo: "FB",
    numero: `0002-${String(count + 89).padStart(8, "0")}`,
    fecha: "hoy",
    cliente: { nombre: "Consumidor Final", cuit: "", direccion: "" },
    items: [],
    subtotal: 0,
    iva: 0,
    total: 0,
    cae: "",
    vencimientoCae: "",
    status: "borrador",
    pagada: false
  };
  facts = [fac, ...facts];
  selectedFact = fac.id;
  saveFacturas();
  render();
});

function render() {
  if (tab === "stock") renderStock();
  else renderFacturas();
}

function renderStock() {
  const activos = prods.filter((p) => stockStatus(p) === "activo").length;
  const bajos = prods.filter((p) => stockStatus(p) === "bajo").length;
  const agotados = prods.filter((p) => stockStatus(p) === "agotado").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterStock === "todos" ? "on" : ""}"><strong>${prods.length}</strong>productos</button>
    <button type="button" data-filter="activo" class="${filterStock === "activo" ? "on" : ""}"><strong>${activos}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filterStock === "bajo" ? "on" : ""}"><strong>${bajos}</strong>stock bajo</button>
    <button type="button" data-filter="agotado" class="${filterStock === "agotado" ? "on" : ""}"><strong>${agotados}</strong>agotados</button>
  `;

  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterStock = btn.dataset.filter;
      render();
    });
  });

  document.getElementById("thead").innerHTML = `
    <tr><th>Código</th><th>Producto</th><th>Categoría</th><th class="amount">Stock</th><th>Estado</th></tr>
  `;

  const visible = filterStock === "todos" ? prods : prods.filter((p) => stockStatus(p) === filterStock);
  document.getElementById("rows").innerHTML = visible.map((p) => `
    <tr class="row ${p.id === selectedProd ? "on" : ""}" data-id="${esc(p.id)}">
      <td>${esc(p.codigo)}</td>
      <td>${esc(p.nombre)}</td>
      <td>${esc(catLabel(p.categoria))}</td>
      <td class="amount">${p.stock}</td>
      <td><span class="tag ${esc(stockStatus(p))}">${esc(label(stockStatus(p)))}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No hay productos.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedProd = row.dataset.id;
      render();
    });
  });

  const prod = prods.find((p) => p.id === selectedProd);
  const detail = document.getElementById("detail");
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
      <div><span>Stock</span><strong style="color:${prod.stock < prod.minimo ? 'var(--naranja)' : 'var(--verde)'}">${prod.stock}</strong> / mín: ${prod.minimo}</div>
      <div><span>Ubicación</span>${esc(prod.ubicacion)}</div>
      <div><span>Proveedor</span>${esc(prod.proveedor)}</div>
    </div>

    <div class="arca-section">
      <h4>🔄 Registrar movimiento</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <select id="mov-tipo">
          ${MOVIMIENTOS.map((m) => `<option value="${m.id}">${esc(m.label)}</option>`).join("")}
        </select>
        <input id="mov-cant" type="number" placeholder="Cantidad" min="1">
      </div>
      <input id="mov-nota" placeholder="Nota / motivo" style="margin-top:6px;">
      <button class="btn-panel" type="button" id="registrar-mov" style="margin-top:8px;">Registrar</button>
    </div>

    <div class="movimientos">
      <h3>Últimos movimientos</h3>
      ${(prod.movimientos || []).slice(0, 5).map((m) => `
        <div class="mov-item">
          <span><strong>${esc(movLabel(m.tipo))}</strong> ${m.tipo === "egreso" ? "-" : "+"}${m.cantidad}</span>
          <span>${esc(m.fecha)} · ${esc(m.nota)}</span>
        </div>
      `).join("") || "<p style='font-size:13px;color:#999;'>Sin movimientos</p>"}
    </div>
  `;

  detail.querySelector("#registrar-mov").addEventListener("click", () => {
    const tipo = detail.querySelector("#mov-tipo").value;
    const cantidad = parseInt(detail.querySelector("#mov-cant").value) || 0;
    const nota = detail.querySelector("#mov-nota").value;

    if (cantidad <= 0) return;

    if (tipo === "egreso" && cantidad > prod.stock) {
      alert("No hay stock suficiente");
      return;
    }

    prod.movimientos = [
      { tipo, cantidad, fecha: "hoy", nota: nota || movLabel(tipo) },
      ...(prod.movimientos || [])
    ];

    if (tipo === "ingreso" || tipo === "devolucion") {
      prod.stock += cantidad;
    } else if (tipo === "egreso") {
      prod.stock -= cantidad;
    } else if (tipo === "ajuste") {
      prod.stock = cantidad;
    }

    prod.status = stockStatus(prod);
    saveProductos();
    render();
  });
}

function renderFacturas() {
  const emitidas = facts.filter((f) => f.status === "emitida").length;
  const pagadas = facts.filter((f) => f.pagada).length;
  const borradores = facts.filter((f) => f.status === "borrador").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterFact === "todos" ? "on" : ""}"><strong>${facts.length}</strong>comprobantes</button>
    <button type="button" data-filter="emitida" class="${filterFact === "emitida" ? "on" : ""}"><strong>${emitidas}</strong>emitidas</button>
    <button type="button" data-filter="pagada" class="${filterFact === "pagada" ? "on" : ""}"><strong>${pagadas}</strong>pagadas</button>
    <button type="button" data-filter="borrador" class="${filterFact === "borrador" ? "on" : ""}"><strong>${borradores}</strong>borradores</button>
  `;

  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterFact = btn.dataset.filter;
      render();
    });
  });

  document.getElementById("thead").innerHTML = `
    <tr><th>Tipo</th><th>Número</th><th>Fecha</th><th>Cliente</th><th class="amount">Total</th><th>Estado</th></tr>
  `;

  let visible = facts;
  if (filterFact === "emitida") visible = facts.filter((f) => f.status === "emitida");
  else if (filterFact === "pagada") visible = facts.filter((f) => f.pagada);
  else if (filterFact === "borrador") visible = facts.filter((f) => f.status === "borrador");

  document.getElementById("rows").innerHTML = visible.map((f) => `
    <tr class="row ${f.id === selectedFact ? "on" : ""}" data-id="${esc(f.id)}">
      <td><strong>${esc(compLabel(f.tipo))}</strong></td>
      <td>${esc(f.numero)}</td>
      <td>${esc(f.fecha)}</td>
      <td>${esc(f.cliente.nombre)}</td>
      <td class="amount">${esc(money(f.total))}</td>
      <td><span class="tag ${f.pagada ? "pagada" : esc(f.status)}">${f.pagada ? "Pagada" : (f.status === "borrador" ? "Borrador" : "Emitida")}</span></td>
    </tr>
  `).join("") || `<tr><td colspan="6">No hay comprobantes.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedFact = row.dataset.id;
      render();
    });
  });

  const fac = facts.find((f) => f.id === selectedFact);
  const detail = document.getElementById("detail");
  if (!fac) {
    detail.innerHTML = "<p>Elegí una factura.</p>";
    return;
  }

  detail.innerHTML = `
    <p class="eyebrow">${esc(compLabel(fac.tipo))} · ${esc(fac.numero)}</p>
    <h2>${esc(fac.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:13px;">${esc(fac.cliente.cuit) || "Consumidor Final"} ${fac.cliente.direccion ? `· ${esc(fac.cliente.direccion)}` : ""}</p>
    
    <div class="meta">
      <div><span>Fecha</span>${esc(fac.fecha)}</div>
      <div><span>Estado</span>${fac.pagada ? "Pagada" : (fac.status === "borrador" ? "Borrador" : "Emitida")}</div>
      ${fac.tipo === "FA" ? `<div><span>Subtotal</span>${esc(money(fac.subtotal))}</div><div><span>IVA 21%</span>${esc(money(fac.iva))}</div>` : ""}
      <div><span>Total</span><strong>${esc(money(fac.total))}</strong></div>
    </div>

    ${fac.items.length > 0 ? `
      <label>Items</label>
      <ul class="items-list">
        ${fac.items.map((i) => `<li><span>${esc(i.nombre)} x${i.cantidad}</span><span>${esc(money(i.precio * i.cantidad))}</span></li>`).join("")}
      </ul>
    ` : `<p style="color:#999;font-size:13px;">Sin items</p>`}

    ${fac.cae ? `
      <div class="factura-box">
        <h4>✓ CAE obtenido</h4>
        <p>CAE: <span class="cae">${esc(fac.cae)}</span></p>
        <p>Vencimiento: ${esc(fac.vencimientoCae)}</p>
      </div>
    ` : (fac.status === "borrador" ? `
      <div class="arca-section">
        <h4>🧾 Emitir con ARCA (AFIP)</h4>
        <label>Tipo comprobante
          <select id="fac-tipo">
            ${COMPROBANTES.filter(c => !["NC", "ND", "RE"].includes(c.id)).map((c) => `<option value="${c.id}" ${fac.tipo === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <label>CUIT cliente (solo Factura A)<input id="fac-cuit" value="${esc(fac.cliente.cuit)}" placeholder="30-12345678-9"></label>
        <label>Razón social<input id="fac-nombre" value="${esc(fac.cliente.nombre)}"></label>
        <button class="btn-panel" type="button" id="emitir" style="margin-top:10px;">Emitir factura (simulado)</button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    ` : "")}

    ${!fac.pagada && fac.status === "emitida" ? `
      <button class="ghost" type="button" id="marcar-pagada" style="margin-top:12px;">✓ Marcar como pagada</button>
    ` : ""}
  `;

  const emitirBtn = detail.querySelector("#emitir");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#fac-tipo").value;
      const cuit = detail.querySelector("#fac-cuit").value;
      const nombre = detail.querySelector("#fac-nombre").value;

      fac.tipo = tipo;
      fac.cliente.cuit = cuit;
      fac.cliente.nombre = nombre;
      
      // Simular emisión ARCA
      fac.cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      fac.vencimientoCae = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
      fac.status = "emitida";

      saveFacturas();
      render();
    });
  }

  const pagarBtn = detail.querySelector("#marcar-pagada");
  if (pagarBtn) {
    pagarBtn.addEventListener("click", () => {
      fac.pagada = true;
      saveFacturas();
      render();
    });
  }
}

render();
