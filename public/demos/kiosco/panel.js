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
    categoria: String(data.get("categoria") || "varios"),
    precio: Number(data.get("precio") || 0),
    stock: Number(data.get("stock") || 0),
    minimo: Number(data.get("minimo") || 5),
    proveedor: String(data.get("proveedor") || "Sin proveedor"),
    status: "stock",
    fiado: null,
    history: [{ when: "hoy", text: "Producto agregado al stock." }]
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
  let result = items;
  if (filter !== "todos") {
    result = result.filter((item) => stockStatus(item) === filter || item.status === filter);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.nombre.toLowerCase().includes(term) || 
      item.codigo.toLowerCase().includes(term) ||
      (item.proveedor || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  const enStock = items.filter((i) => stockStatus(i) === "stock").length;
  const bajo = items.filter((i) => stockStatus(i) === "bajo").length;
  const agotado = items.filter((i) => stockStatus(i) === "agotado").length;
  const fiados = items.filter((i) => i.status === "fiado").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>productos</button>
    <button type="button" data-filter="stock" class="${filter === "stock" ? "on" : ""}"><strong>${enStock}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filter === "bajo" ? "on" : ""}"><strong>${bajo}</strong>stock bajo</button>
    <button type="button" data-filter="agotado" class="${filter === "agotado" ? "on" : ""}"><strong>${agotado}</strong>agotados</button>
    <button type="button" data-filter="fiado" class="${filter === "fiado" ? "on" : ""}"><strong>${fiados}</strong>fiados</button>
    <input type="text" id="search" placeholder="🔍 Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:4px;width:180px;">
  `;
  
  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.nombre)}</td>
      <td>${esc(catLabel(item.categoria))}</td>
      <td class="amount">${esc(money(item.precio))}</td>
      <td class="amount">${item.status === "fiado" ? "—" : item.stock}</td>
      <td><span class="tag ${esc(stockStatus(item))}">${esc(label(stockStatus(item)))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay productos en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un producto del listado.</p>";
    return;
  }

  const isFiado = item.status === "fiado";

  detail.innerHTML = `
    <p class="eyebrow">${isFiado ? "Fiado" : "Producto"}</p>
    <h2>${esc(item.nombre)}</h2>
    <p>${esc(item.codigo)} · ${esc(catLabel(item.categoria))}</p>
    ${isFiado && item.fiado ? `
      <div class="meta">
        <div><span>Cliente</span>${esc(item.fiado.cliente)}</div>
        <div><span>Desde</span>${esc(item.fiado.fecha)}</div>
        <div><span>Monto</span>${esc(money(item.precio))}</div>
        <div><span>Detalle</span>${esc(item.fiado.items)}</div>
      </div>
    ` : `
      <div class="meta">
        <div><span>Precio</span>${esc(money(item.precio))}</div>
        <div><span>Stock</span>${item.stock} unidades</div>
        <div><span>Mínimo</span>${item.minimo} unidades</div>
        <div><span>Proveedor</span>${esc(item.proveedor)}</div>
      </div>
    `}
    
    ${!isFiado && item.stock > 0 ? `
      ${item.factura ? `
        <div class="factura-box">
          <h4>✅ Última venta facturada</h4>
          <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
          <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
          <div><strong>Total:</strong> ${esc(money(item.factura.total))}</div>
          <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
          <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
        </div>
      ` : ""}
      <div class="arca-section">
        <h4>🧾 Venta con ARCA</h4>
        <label>Cantidad<input id="venta-cant" type="number" value="1" min="1" max="${item.stock}"></label>
        <label>Tipo comprobante
          <select id="venta-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="registrar-venta" style="margin-top:10px;">
          Vender y facturar (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado.</p>
      </div>
    ` : ""}
    
    <form id="edit">
      ${isFiado ? `
        <label>Cliente<input name="fiadoCliente" value="${esc(item.fiado?.cliente || "")}"></label>
        <label>Monto<input name="precio" type="number" value="${item.precio}"></label>
        <label>Detalle<textarea name="fiadoItems">${esc(item.fiado?.items || "")}</textarea></label>
      ` : `
        <label>Código<input name="codigo" value="${esc(item.codigo)}"></label>
        <label>Nombre<input name="nombre" value="${esc(item.nombre)}"></label>
        <label>Categoría
          <select name="categoria">
            ${CATEGORIAS.map((c) => `<option value="${c.id}" ${item.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
        <label>Stock<input name="stock" type="number" value="${item.stock}"></label>
        <label>Mínimo<input name="minimo" type="number" value="${item.minimo}"></label>
        <label>Proveedor<input name="proveedor" value="${esc(item.proveedor)}"></label>
      `}
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">${isFiado ? "Cobrado / eliminar" : "Eliminar"}</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;
  
  // Registrar venta con ARCA
  detail.querySelector("#registrar-venta")?.addEventListener("click", () => {
    const cantidad = parseInt(detail.querySelector("#venta-cant").value) || 1;
    const tipo = detail.querySelector("#venta-tipo").value;
    if (cantidad > item.stock) { alert("Stock insuficiente"); return; }
    
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const total = item.precio * cantidad;
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
    
    item.stock -= cantidad;
    item.status = stockStatus(item);
    item.factura = { tipo, numero, cae, vto, total };
    item.history = [{ when: "hoy", text: `Venta x${cantidad}. ${compLabel(tipo)}. CAE: ${cae}. Total: ${money(total)}` }, ...(item.history || [])];
    
    save(items);
    showToast("Venta registrada");
    render();
  });

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    item.history = [{ when: "hoy", text: "Ficha actualizada." }, ...(item.history || [])];

    if (isFiado) {
      item.fiado = {
        cliente: String(data.get("fiadoCliente") || ""),
        fecha: item.fiado?.fecha || "hoy",
        items: String(data.get("fiadoItems") || "")
      };
      item.precio = Number(data.get("precio") || 0);
    } else {
      Object.assign(item, {
        codigo: String(data.get("codigo") || ""),
        nombre: String(data.get("nombre") || ""),
        categoria: String(data.get("categoria") || "varios"),
        precio: Number(data.get("precio") || 0),
        stock: Number(data.get("stock") || 0),
        minimo: Number(data.get("minimo") || 5),
        proveedor: String(data.get("proveedor") || "")
      });
      item.status = stockStatus(item);
    }

    save(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Producto eliminado");
    render();
  });
}

// Toast notification
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
