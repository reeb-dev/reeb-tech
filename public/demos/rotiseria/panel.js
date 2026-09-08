let prods = loadProductos();
let peds = loadPedidos();
let ings = loadIngredientes();
let tab = "pedidos";
let selectedPed = peds[0]?.id || "";
let filterPed = "todos";

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    tab = btn.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    render();
  });
});

document.getElementById("nuevo-pedido").addEventListener("click", () => {
  tab = "pedidos";
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === "pedidos"));
  const count = peds.length + 1;
  const nuevoPed = {
    id: crypto.randomUUID(),
    numero: `PED-${String(count).padStart(3, "0")}`,
    tipo: "mostrador",
    cliente: { nombre: "Cliente mostrador", tel: "", direccion: "" },
    items: [],
    hora: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    status: "pendiente",
    factura: null,
    notas: ""
  };
  peds.push(nuevoPed);
  selectedPed = nuevoPed.id;
  savePedidos();
  render();
});

function render() {
  if (tab === "pedidos") renderPedidos();
  else if (tab === "produccion") renderProduccion();
  else renderIngredientes();
}

function renderPedidos() {
  const pendientes = peds.filter((p) => p.status === "pendiente").length;
  const preparando = peds.filter((p) => p.status === "preparando").length;
  const listos = peds.filter((p) => p.status === "listo").length;
  const delivery = peds.filter((p) => p.tipo === "delivery" && p.status !== "entregado").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterPed === "todos" ? "on" : ""}"><strong>${peds.length}</strong>pedidos</button>
    <button type="button" data-filter="pendiente" class="${filterPed === "pendiente" ? "on" : ""}"><strong>${pendientes}</strong>pendientes</button>
    <button type="button" data-filter="preparando" class="${filterPed === "preparando" ? "on" : ""}"><strong>${preparando}</strong>preparando</button>
    <button type="button" data-filter="listo" class="${filterPed === "listo" ? "on" : ""}"><strong>${listos}</strong>listos</button>
    <div style="border-color:#be185d;"><strong>${delivery}</strong>delivery</div>
  `;

  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filterPed = btn.dataset.filter; render(); });
  });

  const visible = filterPed === "todos" ? peds : peds.filter((p) => p.status === filterPed);

  document.getElementById("list-area").innerHTML = `
    <table>
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Tipo</th><th>Hora</th><th class="amount">Total</th><th>Estado</th></tr></thead>
      <tbody>
        ${visible.map((p) => `
          <tr class="row ${p.id === selectedPed ? "on" : ""}" data-id="${esc(p.id)}">
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

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedPed = row.dataset.id; render(); });
  });

  const pedido = peds.find((p) => p.id === selectedPed);
  const detail = document.getElementById("detail");
  if (!pedido) { detail.innerHTML = "<p>Elegí un pedido.</p>"; return; }

  const total = calcTotalPedido(pedido);

  detail.innerHTML = `
    <p class="eyebrow">${esc(pedido.numero)} · ${esc(pedido.hora)}</p>
    <h2>${esc(pedido.cliente.nombre)}</h2>
    ${pedido.tipo === "delivery" ? `<p style="color:var(--muted);font-size:13px;">📍 ${esc(pedido.cliente.direccion)} · 📞 ${esc(pedido.cliente.tel)}</p>` : ""}
    <div class="meta">
      <div><span>Tipo</span><span class="tag ${esc(pedido.tipo)}">${esc(tipoLabel(pedido.tipo))}</span></div>
      <div><span>Estado</span><span class="tag ${esc(pedido.status)}">${esc(labelPedido(pedido.status))}</span></div>
    </div>
    ${pedido.notas ? `<p style="font-size:13px;background:#fef3c7;padding:8px;border-radius:4px;">📝 ${esc(pedido.notas)}</p>` : ""}

    <label>Productos</label>
    ${pedido.items.length > 0 ? `
      <ul class="items-pedido">
        ${pedido.items.map((item) => {
          const prod = getProducto(item.producto);
          return `<li><span>${esc(prod?.nombre || "—")} x${item.cantidad}</span><span>${esc(money(item.precio * item.cantidad))}</span></li>`;
        }).join("")}
      </ul>
    ` : `<p style="color:#999;font-size:13px;">Sin productos</p>`}

    <label>Agregar producto</label>
    <select id="agregar-prod">
      <option value="">— Seleccionar —</option>
      ${prods.filter(p => p.stock > 0).map((p) => `<option value="${p.id}">${esc(p.nombre)} - ${esc(money(p.precio))} (${p.stock} disp.)</option>`).join("")}
    </select>
    <button class="ghost" id="btn-agregar" style="margin-top:6px;">+ Agregar</button>

    <div style="text-align:right;font-size:18px;font-weight:700;margin:12px 0;">
      Total: ${esc(money(total))}
    </div>

    ${pedido.factura ? `
      <div class="factura-box">
        <h4>✓ Cobrado</h4>
        <p><strong>${esc(compLabel(pedido.factura.tipo))}</strong> ${esc(pedido.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(pedido.factura.cae)}</span></p>
        <p>Total: ${esc(money(pedido.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>🧾 Cobrar con ARCA</h4>
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
        ${STATUSES_PEDIDO.filter(s => s.id !== "entregado").map((s) => `<option value="${s.id}" ${pedido.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
      </select>
      <button class="ghost" id="btn-status" style="margin-top:6px;">Actualizar estado</button>
    ` : ""}
  `;

  detail.querySelector("#btn-agregar")?.addEventListener("click", () => {
    const prodId = detail.querySelector("#agregar-prod").value;
    if (!prodId) return;
    const prod = getProducto(prodId);
    if (!prod || prod.stock <= 0) return;
    
    const existing = pedido.items.find((i) => i.producto === prodId);
    if (existing) {
      existing.cantidad++;
    } else {
      pedido.items.push({ producto: prodId, cantidad: 1, precio: prod.precio });
    }
    prod.stock--;
    prod.vendidos++;
    saveProductos();
    savePedidos();
    render();
  });

  detail.querySelector("#cobrar")?.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

    pedido.factura = { tipo, numero, cae, vto, total };
    pedido.status = "entregado";
    savePedidos();
    render();
  });

  detail.querySelector("#btn-status")?.addEventListener("click", () => {
    const newStatus = detail.querySelector("#cambiar-status").value;
    pedido.status = newStatus;
    savePedidos();
    render();
  });
}

function renderProduccion() {
  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>Producción</strong>del día</div>
  `;

  const porCategoria = {};
  prods.forEach((p) => {
    if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
    porCategoria[p.categoria].push(p);
  });

  document.getElementById("list-area").innerHTML = `
    ${Object.entries(porCategoria).map(([cat, items]) => `
      <h3 style="margin:16px 0 8px;font-size:14px;color:var(--naranja);">${esc(catLabel(cat))}</h3>
      <div class="produccion-grid">
        ${items.map((p) => `
          <div class="prod-card">
            <div class="nombre">${esc(p.nombre)}</div>
            <div class="numeros">
              <div><div class="num">${p.produccionDia || "—"}</div><small>producidos</small></div>
              <div><div class="num ${p.stock < 3 ? "rojo" : "verde"}">${p.stock}</div><small>disponibles</small></div>
            </div>
          </div>
        `).join("")}
      </div>
    `).join("")}
  `;

  document.getElementById("detail").innerHTML = `
    <h2>Producción del día</h2>
    <p style="color:var(--muted);">Control de lo producido y disponible para venta.</p>
    <p style="margin-top:16px;font-size:13px;">Los números se actualizan automáticamente con cada venta.</p>
  `;
}

function renderIngredientes() {
  const bajos = ings.filter((i) => i.stock <= i.minimo).length;

  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>${ings.length}</strong>ingredientes</div>
    <div style="border-color:#dc2626;"><strong>${bajos}</strong>stock bajo</div>
  `;

  document.getElementById("list-area").innerHTML = `
    <table>
      <thead><tr><th>Ingrediente</th><th>Unidad</th><th class="amount">Stock</th><th class="amount">Mínimo</th><th class="amount">Costo</th><th>Estado</th></tr></thead>
      <tbody>
        ${ings.map((i) => `
          <tr>
            <td>${esc(i.nombre)}</td>
            <td>${esc(i.unidad)}</td>
            <td class="amount">${i.stock}</td>
            <td class="amount">${i.minimo}</td>
            <td class="amount">${esc(money(i.costo))}</td>
            <td><span class="tag ${i.stock <= i.minimo ? "pendiente" : "listo"}">${i.stock <= i.minimo ? "Reponer" : "OK"}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  document.getElementById("detail").innerHTML = `
    <h2>Ingredientes</h2>
    <p style="color:var(--muted);">Stock de materias primas para producción.</p>
    <p style="margin-top:16px;font-size:13px;">Los ingredientes con stock igual o menor al mínimo aparecen marcados para reponer.</p>
  `;
}

render();
