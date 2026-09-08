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
    titulo: String(data.get("titulo") || ""),
    tipo: String(data.get("tipo") || "departamento"),
    operacion: String(data.get("operacion") || "alquiler"),
    direccion: String(data.get("direccion") || ""),
    barrio: String(data.get("barrio") || ""),
    ambientes: Number(data.get("ambientes") || 0),
    superficie: Number(data.get("superficie") || 0),
    precio: Number(data.get("precio") || 0),
    expensas: Number(data.get("expensas") || 0),
    status: "disponible",
    cliente: null,
    visitas: [],
    history: [{ when: "hoy", text: "Propiedad agregada a la cartera." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  render();
});

function visible() {
  if (filter === "todos") return items;
  return items.filter((item) => item.status === filter);
}

function render() {
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const reservadas = items.filter((i) => i.status === "reservada").length;
  const alquiladas = items.filter((i) => i.status === "alquilada").length;
  const vendidas = items.filter((i) => i.status === "vendida").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>propiedades</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="reservada" class="${filter === "reservada" ? "on" : ""}"><strong>${reservadas}</strong>reservadas</button>
    <button type="button" data-filter="alquilada" class="${filter === "alquilada" ? "on" : ""}"><strong>${alquiladas}</strong>alquiladas</button>
    <button type="button" data-filter="vendida" class="${filter === "vendida" ? "on" : ""}"><strong>${vendidas}</strong>vendidas</button>
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
      <td>${esc(item.titulo)}<br><small style="color:#666">${esc(tipoLabel(item.tipo))}</small></td>
      <td>${esc(opLabel(item.operacion))}</td>
      <td>${esc(item.barrio)}</td>
      <td class="amount">${item.operacion === "venta" ? esc(money(item.precio, true)) : esc(money(item.precio))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay propiedades en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una propiedad del listado.</p>";
    return;
  }

  const precioStr = item.operacion === "venta" ? money(item.precio, true) : money(item.precio) + " /mes";

  detail.innerHTML = `
    <p class="eyebrow">${esc(opLabel(item.operacion))} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.titulo)}</h2>
    <p>${esc(item.direccion)}</p>
    <div class="meta">
      <div><span>Barrio</span>${esc(item.barrio)}</div>
      <div><span>Precio</span>${esc(precioStr)}</div>
      <div><span>Superficie</span>${item.superficie} m²</div>
      <div><span>Ambientes</span>${item.ambientes || "—"}</div>
      ${item.expensas ? `<div><span>Expensas</span>${esc(money(item.expensas))}</div>` : ""}
      ${item.cliente ? `<div><span>Cliente</span>${esc(item.cliente.nombre)}</div>` : ""}
    </div>
    <form id="edit">
      <label>Código<input name="codigo" value="${esc(item.codigo)}"></label>
      <label>Título<input name="titulo" value="${esc(item.titulo)}"></label>
      <label>Tipo
        <select name="tipo">
          ${TIPOS.map((t) => `<option value="${t.id}" ${item.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Operación
        <select name="operacion">
          ${OPERACIONES.map((o) => `<option value="${o.id}" ${item.operacion === o.id ? "selected" : ""}>${esc(o.label)}</option>`).join("")}
        </select>
      </label>
      <label>Dirección<input name="direccion" value="${esc(item.direccion)}"></label>
      <label>Barrio<input name="barrio" value="${esc(item.barrio)}"></label>
      <label>Ambientes<input name="ambientes" type="number" value="${item.ambientes}"></label>
      <label>Superficie m²<input name="superficie" type="number" value="${item.superficie}"></label>
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Expensas<input name="expensas" type="number" value="${item.expensas}"></label>
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    ${item.visitas.length > 0 ? `
      <div class="visitas">
        <h3>Visitas registradas</h3>
        ${item.visitas.map((v) => `
          <div class="visita-item">
            <strong>${esc(v.fecha)}</strong> — ${esc(v.cliente)}<br>
            <small>${esc(v.nota)}</small>
          </div>
        `).join("")}
      </div>
    ` : ""}
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      titulo: String(data.get("titulo") || ""),
      tipo: String(data.get("tipo") || "departamento"),
      operacion: String(data.get("operacion") || "alquiler"),
      direccion: String(data.get("direccion") || ""),
      barrio: String(data.get("barrio") || ""),
      ambientes: Number(data.get("ambientes") || 0),
      superficie: Number(data.get("superficie") || 0),
      precio: Number(data.get("precio") || 0),
      expensas: Number(data.get("expensas") || 0),
      status: newStatus
    });

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado cambiado a: ${label(newStatus)}.` }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Ficha actualizada." }, ...(item.history || [])];
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
