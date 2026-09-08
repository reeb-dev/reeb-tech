let items = load();
let selected = items[0]?.id || "";
let filter = "todos";

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
  render();
});

function visible() {
  if (filter === "todos") return items;
  return items.filter((item) => stockStatus(item) === filter || item.status === filter);
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
  `;

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
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    render();
  });
}

render();
