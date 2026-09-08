let items = load();
let fiados = loadFiados();
let selected = items[0]?.id || "";
let selectedFiado = fiados[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let currentTab = "stock";

const createForm = document.getElementById("create");
const createFiado = document.getElementById("create-fiado");
const openCreate = document.getElementById("open-create");

openCreate.addEventListener("click", () => {
  if (currentTab === "fiado") createFiado.classList.toggle("open");
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
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "snacks"),
    precio: Number(data.get("precio") || 0),
    stock: Number(data.get("stock") || 0),
    minimo: Number(data.get("minimo") || 5),
    proveedor: String(data.get("proveedor") || "Sin proveedor"),
    imagen: "",
    descripcion: "",
    status: "stock",
    history: [{ when: "hoy", text: "Producto agregado al stock." }]
  };
  item.status = stockStatus(item);
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  currentTab = "stock";
  showToast("Producto agregado");
  render();
});

createFiado.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const monto = Number(data.get("monto") || 0);
  const fiado = {
    id: crypto.randomUUID(),
    cliente: String(data.get("cliente") || "").trim(),
    fecha: new Date().toISOString().slice(0, 10),
    items: String(data.get("items") || "").trim(),
    monto,
    saldo: monto,
    status: "abierto",
    history: [{ when: "hoy", text: "Fiado anotado." }]
  };
  fiados = [fiado, ...fiados];
  selectedFiado = fiado.id;
  saveFiados(fiados);
  event.target.reset();
  event.target.classList.remove("open");
  currentTab = "fiado";
  showToast("Fiado anotado");
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  createForm.classList.remove("open");
  createFiado.classList.remove("open");
  render();
});

function visible() {
  let result = items;
  if (filter !== "todos") result = result.filter((item) => stockStatus(item) === filter);
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

function thumbHtml(item) {
  if (item.imagen) return `<img class="thumb" src="${esc(item.imagen)}" alt="">`;
  return `<div class="thumb fallback">${esc((item.nombre || "?").slice(0, 1))}</div>`;
}

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === currentTab);
  });
  document.getElementById("view-stock").hidden = currentTab !== "stock";
  document.getElementById("view-ventas").hidden = currentTab !== "ventas";
  document.getElementById("view-fiado").hidden = currentTab !== "fiado";
  createForm.style.display = currentTab === "stock" ? "" : "none";
  createFiado.style.display = currentTab === "fiado" ? "" : "none";
  openCreate.textContent = currentTab === "fiado" ? "Nuevo fiado" : "Nuevo producto";
  const titles = {
    stock: "Stock del kiosco",
    ventas: "Ventas del día",
    fiado: "Libreta de fiado"
  };
  document.getElementById("panelTitle").textContent = titles[currentTab] || titles.stock;
}

function renderVentas() {
  const delDia = ventasDelDia();
  const box = document.getElementById("ventas");
  document.getElementById("ventasNote").textContent = delDia.length
    ? `${delDia.length} venta${delDia.length === 1 ? "" : "s"} · ${money(totalVentas(delDia))}`
    : "Todavía no hay ventas de hoy. Salen del carrito de la vidriera o de ARCA en el stock.";
  if (!delDia.length) {
    box.innerHTML = `<p class="note">Registrá una venta desde el catálogo o facturá un producto con ARCA.</p>`;
    return;
  }
  box.innerHTML = delDia.map((venta) => `
    <article class="venta-card">
      <div class="venta-meta">
        <strong>${esc(formatFecha(venta.fecha))}</strong>
        <span>${esc(venta.cliente || "Cliente")} · ${esc(compLabel(venta.comprobante))}</span>
        <span class="amount">${esc(money(venta.total))}</span>
        ${venta.cae ? `<span>CAE ${esc(venta.cae)}</span>` : ""}
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

function renderFiados() {
  const box = document.getElementById("fiados");
  if (!fiados.length) {
    box.innerHTML = `<p class="note">No hay cuentas de fiado.</p>`;
    return;
  }
  box.innerHTML = fiados.map((f) => `
    <article class="fiado-card ${f.id === selectedFiado ? "on" : ""}" data-fiado="${esc(f.id)}">
      <div class="fiado-head">
        <div>
          <h3>${esc(f.cliente)}</h3>
          <p class="meta-line">${esc(f.items || "Sin detalle")} · desde ${esc(f.fecha)}</p>
        </div>
        <span class="tag ${esc(f.status)}">${esc(fiadoLabel(f.status))}</span>
      </div>
      <div class="fiado-amounts">
        <div><span>Original</span>${esc(money(f.monto))}</div>
        <div><span>Saldo</span>${esc(money(f.saldo))}</div>
      </div>
      ${f.id === selectedFiado ? `
        <form class="fiado-edit" data-edit="${esc(f.id)}">
          <label>Cliente<input name="cliente" value="${esc(f.cliente)}"></label>
          <label>Detalle<input name="items" value="${esc(f.items || "")}"></label>
          <label>Saldo<input name="saldo" type="number" value="${f.saldo}"></label>
          <label>Estado
            <select name="status">
              ${FIADO_ESTADOS.map((s) => `<option value="${s.id}" ${f.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
            </select>
          </label>
          <div class="actions">
            <button class="btn-panel" type="submit">Guardar</button>
            <button class="ghost" type="button" data-cobrar="${esc(f.id)}">Marcar cobrado</button>
            <button class="ghost" type="button" data-borrar="${esc(f.id)}">Eliminar</button>
          </div>
        </form>
        <div class="timeline">
          <h3>Historial</h3>
          ${(f.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
        </div>
      ` : ""}
    </article>
  `).join("");

  box.querySelectorAll("[data-fiado]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("form, button, input, select")) return;
      selectedFiado = card.dataset.fiado;
      render();
    });
  });
  box.querySelectorAll("[data-edit]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const f = fiados.find((x) => x.id === form.dataset.edit);
      if (!f) return;
      const data = new FormData(form);
      f.cliente = String(data.get("cliente") || "");
      f.items = String(data.get("items") || "");
      f.saldo = Number(data.get("saldo") || 0);
      f.status = String(data.get("status") || "abierto");
      if (f.saldo <= 0) f.status = "cobrado";
      f.history = [{ when: "hoy", text: "Cuenta actualizada." }, ...(f.history || [])];
      saveFiados(fiados);
      showToast("Fiado actualizado");
      render();
    });
  });
  box.querySelectorAll("[data-cobrar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = fiados.find((x) => x.id === btn.dataset.cobrar);
      if (!f) return;
      f.saldo = 0;
      f.status = "cobrado";
      f.history = [{ when: "hoy", text: "Cobrado el total." }, ...(f.history || [])];
      saveFiados(fiados);
      showToast("Fiado cobrado");
      render();
    });
  });
  box.querySelectorAll("[data-borrar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Eliminar esta cuenta de fiado?")) return;
      fiados = fiados.filter((x) => x.id !== btn.dataset.borrar);
      selectedFiado = fiados[0]?.id || "";
      saveFiados(fiados);
      showToast("Cuenta eliminada");
      render();
    });
  });
}

function render() {
  items = load();
  fiados = loadFiados();
  const enStock = items.filter((i) => stockStatus(i) === "stock").length;
  const bajo = items.filter((i) => stockStatus(i) === "bajo").length;
  const agotado = items.filter((i) => stockStatus(i) === "agotado").length;
  const delDia = ventasDelDia();
  const abiertos = fiados.filter((f) => f.status !== "cobrado");
  const saldoFiado = abiertos.reduce((sum, f) => sum + Number(f.saldo || 0), 0);

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>productos</button>
    <button type="button" data-filter="stock" class="${filter === "stock" ? "on" : ""}"><strong>${enStock}</strong>en stock</button>
    <button type="button" data-filter="bajo" class="${filter === "bajo" ? "on" : ""}"><strong>${bajo}</strong>stock bajo</button>
    <button type="button" data-filter="agotado" class="${filter === "agotado" ? "on" : ""}"><strong>${agotado}</strong>agotados</button>
    <div><strong>${delDia.length}</strong>ventas hoy · ${esc(money(totalVentas(delDia)))}</div>
    <div><strong>${abiertos.length}</strong>fiados · ${esc(money(saldoFiado))}</div>
    <input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:4px;width:180px;">
  `;

  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      currentTab = "stock";
      render();
    });
  });

  setTabVisibility();
  renderVentas();
  renderFiados();

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${thumbHtml(item)}</td>
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.nombre)}</td>
      <td>${esc(catLabel(item.categoria))}</td>
      <td class="amount">${esc(money(item.precio))}</td>
      <td class="amount">${item.stock}</td>
      <td><span class="tag ${esc(stockStatus(item))}">${esc(label(stockStatus(item)))}</span></td>
    </tr>`).join("") || `<tr><td colspan="7">No hay productos en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      currentTab = "stock";
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un producto del listado.</p>";
    return;
  }

  detail.innerHTML = `
    ${item.imagen ? `<img class="detail-cover" src="${esc(item.imagen)}" alt="${esc(item.nombre)}">` : `<div class="detail-cover cover-fallback">${esc((item.nombre || "?").slice(0, 1))}</div>`}
    <p class="eyebrow">${esc(item.codigo)} · ${esc(catLabel(item.categoria))}</p>
    <h2>${esc(item.nombre)}</h2>
    ${item.descripcion ? `<p class="detail-desc">${esc(item.descripcion)}</p>` : ""}
    <div class="meta">
      <div><span>Precio</span>${esc(money(item.precio))}</div>
      <div><span>Stock</span>${item.stock} unidades</div>
      <div><span>Mínimo</span>${item.minimo} unidades</div>
      <div><span>Proveedor</span>${esc(item.proveedor)}</div>
    </div>

    ${item.factura ? `
      <div class="factura-box">
        <h4>Última venta facturada</h4>
        <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
        <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
        <div><strong>Total:</strong> ${esc(money(item.factura.total))}</div>
        <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
        <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
      </div>
    ` : ""}

    ${item.stock > 0 ? `
      <div class="arca-section">
        <h4>Venta con ARCA</h4>
        <label>Cantidad<input id="venta-cant" type="number" value="1" min="1" max="${item.stock}"></label>
        <label>Tipo comprobante
          <select id="venta-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="registrar-venta" style="margin-top:10px;">
          Vender y facturar (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado y descuenta stock.</p>
      </div>
    ` : `<p class="note">Sin stock para facturar.</p>`}

    <form id="edit">
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
      <label>Descripción<textarea name="descripcion">${esc(item.descripcion || "")}</textarea></label>
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

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      nombre: String(data.get("nombre") || ""),
      categoria: String(data.get("categoria") || "snacks"),
      precio: Number(data.get("precio") || 0),
      stock: Number(data.get("stock") || 0),
      minimo: Number(data.get("minimo") || 5),
      proveedor: String(data.get("proveedor") || ""),
      descripcion: String(data.get("descripcion") || "")
    });
    item.status = stockStatus(item);
    item.history = [{ when: "hoy", text: "Ficha actualizada." }, ...(item.history || [])];
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
