let items = load();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";

document.getElementById("open-create").addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "ficcion"),
    autor: String(data.get("autor") || ""),
    editorial: "",
    isbn: "",
    precio: Number(data.get("precio") || 0),
    costo: Math.round(Number(data.get("precio") || 0) * 0.65),
    stock: Number(data.get("stock") || 0),
    minimo: 3,
    proveedor: String(data.get("proveedor") || ""),
    imagen: "",
    status: "stock",
    history: [{ when: "hoy", text: "Producto agregado." }]
  };
  item.status = stockStatus(item);
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Producto agregado");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => stockStatus(item) === filter || item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.nombre.toLowerCase().includes(term) ||
      (item.autor || "").toLowerCase().includes(term) ||
      item.codigo.toLowerCase().includes(term)
    );
  }
  return result;
}

function thumbHtml(item) {
  if (item.imagen) {
    return `<img class="thumb" src="${esc(item.imagen)}" alt="">`;
  }
  return `<div class="thumb fallback">${esc((item.nombre || "?").slice(0, 1))}</div>`;
}

function renderVentas() {
  const ventas = loadVentas();
  const box = document.getElementById("ventas");
  if (!ventas.length) {
    box.innerHTML = `<p class="note">Todavía no hay ventas. Se registran desde el catálogo o con ARCA.</p>`;
    return;
  }
  box.innerHTML = ventas.slice(0, 12).map((venta) => `
    <article class="venta-card">
      <div class="venta-meta">
        <strong>${esc(formatFecha(venta.fecha))}</strong>
        <span>${esc(venta.cliente || "Cliente")} · ${esc(compLabel(venta.comprobante))}</span>
        <span class="amount">${esc(money(venta.total))}</span>
      </div>
      <div class="venta-items">
        ${(venta.items || []).map((line) => `
          <div class="venta-line">
            ${line.imagen ? `<img class="thumb" src="${esc(line.imagen)}" alt="">` : `<div class="thumb fallback">${esc((line.nombre || "?").slice(0, 1))}</div>`}
            <span>${esc(line.nombre)} × ${line.cantidad || 1}</span>
          </div>`).join("")}
      </div>
    </article>`).join("");
}

function render() {
  items = load();
  const counts = {
    stock: items.filter((i) => stockStatus(i) === "stock").length,
    bajo: items.filter((i) => stockStatus(i) === "bajo").length,
    agotado: items.filter((i) => stockStatus(i) === "agotado").length,
    pedido: items.filter((i) => i.status === "pedido").length
  };
  const ventas = loadVentas();

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>productos</button>
    <button type="button" data-filter="stock" class="${filter === "stock" ? "on" : ""}"><strong>${counts.stock}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filter === "bajo" ? "on" : ""}"><strong>${counts.bajo}</strong>stock bajo</button>
    <button type="button" data-filter="pedido" class="${filter === "pedido" ? "on" : ""}"><strong>${counts.pedido}</strong>ped. especial</button>
    <div><strong>${ventas.length}</strong>ventas</div>
    <input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:4px;width:180px;">
  `;

  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${thumbHtml(item)}</td>
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.nombre)}${item.autor ? `<br><small style="color:#666">${esc(item.autor)}</small>` : ""}${item.descripcion ? `<br><small class="row-desc">${esc(item.descripcion)}</small>` : ""}</td>
      <td>${esc(catLabel(item.categoria))}</td>
      <td class="amount">${esc(money(item.precio))}</td>
      <td class="amount">${item.status === "pedido" ? "—" : item.stock}</td>
      <td><span class="tag ${esc(stockStatus(item))}">${esc(label(stockStatus(item)))}</span></td>
    </tr>`).join("") || `<tr><td colspan="7">No hay productos.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  renderVentas();

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) { detail.innerHTML = "<p>Elegí un producto.</p>"; return; }

  const isPedido = item.status === "pedido";

  detail.innerHTML = `
    ${item.imagen ? `<img class="detail-cover" src="${esc(item.imagen)}" alt="Tapa de ${esc(item.nombre)}">` : ""}
    <p class="eyebrow">${esc(item.codigo)} · ${esc(catLabel(item.categoria))}</p>
    <h2>${esc(item.nombre)}</h2>
    ${item.autor ? `<p style="color:var(--muted);font-size:14px;">${esc(item.autor)} · ${esc(item.editorial || "")}</p>` : ""}
    ${item.descripcion ? `<p class="detail-desc">${esc(item.descripcion)}</p>` : ""}
    <div class="meta">
      <div><span>Precio</span>${esc(money(item.precio))}</div>
      <div><span>Costo</span>${esc(money(item.costo))}</div>
      <div><span>Stock</span>${isPedido ? "Pedido especial" : `${item.stock} / mín: ${item.minimo}`}</div>
      <div><span>Proveedor</span>${esc(item.proveedor)}</div>
    </div>

    ${isPedido && item.pedidoEspecial ? `
      <div class="pedido-especial">
        <h4>Pedido especial</h4>
        <p><strong>${esc(item.pedidoEspecial.cliente)}</strong> · ${esc(item.pedidoEspecial.tel)}</p>
        <p>Pedido: ${esc(item.pedidoEspecial.fechaPedido)} · Seña: ${esc(money(item.pedidoEspecial.seña))}</p>
      </div>
    ` : ""}

    <div class="arca-section">
      <h4>Venta con ARCA</h4>
      <label>Cantidad<input id="venta-cant" type="number" value="1" min="1" ${isPedido ? "" : `max="${item.stock}"`}></label>
      <label>Tipo comprobante
        <select id="venta-tipo">
          ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <button class="btn-panel" type="button" id="registrar-venta" style="margin-top:10px;" ${!isPedido && item.stock === 0 ? "disabled" : ""}>
        Vender y facturar (simulado)
      </button>
      <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado y descuenta stock.</p>
    </div>

    <div class="actions" style="margin-top: 16px;">
      <button class="ghost" type="button" id="remove">Eliminar producto</button>
    </div>

    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Producto eliminado");
    render();
  });

  detail.querySelector("#registrar-venta")?.addEventListener("click", () => {
    const cantidad = parseInt(detail.querySelector("#venta-cant").value, 10) || 1;
    const tipo = detail.querySelector("#venta-tipo").value;
    const result = registrarVentaPanel(item.id, cantidad, tipo);
    if (!result.ok) {
      alert(result.reason === "sin-stock" ? "Stock insuficiente" : "No se pudo registrar la venta");
      return;
    }
    selected = result.item.id;
    showToast("Venta registrada");
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
