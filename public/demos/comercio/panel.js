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
    ticket: String(data.get("ticket") || ""),
    kind: String(data.get("kind") || "Pedido a proveedor"),
    origin: String(data.get("origin") || ""),
    due: String(data.get("due") || "Hoy"),
    status: "pedido",
    items: [{ name: String(data.get("item") || ""), qty: Number(data.get("qty") || 1), missing: 0 }],
    note: "",
    history: [{ when: "hoy", text: "Ticket cargado en pedido." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Ticket creado");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.ticket.toLowerCase().includes(term) || 
      item.kind.toLowerCase().includes(term) ||
      (item.origin || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function lineFields(item) {
  return (item.items || []).map((line, index) => `
    <div class="item-row">
      <input name="name-${index}" value="${esc(line.name)}" aria-label="Ítem">
      <input name="qty-${index}" type="number" min="0" value="${esc(line.qty)}" aria-label="Cantidad">
      <input name="missing-${index}" type="number" min="0" value="${esc(line.missing)}" aria-label="Faltante">
    </div>`).join("");
}

function render() {
  const gaps = items.reduce((sum, item) => sum + missingCount(item), 0);
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>tickets</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
    <div><strong>${gaps}</strong>faltantes, ejemplo</div>
    <input type="text" id="search" placeholder="🔍 Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:4px;width:180px;">
  `;
  
  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });

  document.getElementById("tickets").innerHTML = visible().map((item) => `
    <button class="ticket ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}" type="button">
      <div class="ticket-top">
        <strong>${esc(item.ticket)}</strong>
        <span class="tag ${esc(item.status)}">${esc(label(item.status))}</span>
      </div>
      <span>${esc(item.kind)} · ${esc(item.origin)} · ${esc(item.due)}</span>
      <div class="lines">
        ${(item.items || []).map((line) => `<span class="chip ${line.missing ? "warn" : ""}">${esc(line.name)} × ${esc(line.qty)}${line.missing ? ` · faltan ${esc(line.missing)}` : ""}</span>`).join("")}
      </div>
    </button>`).join("") || "<p>No hay tickets en este estado.</p>";

  document.querySelectorAll(".ticket").forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.id;
      render();
    });
  });

  const item = items.find((entry) => entry.id === selected);
  const sheet = document.getElementById("sheet");
  if (!item) {
    sheet.innerHTML = "<p>Elegí un ticket del turno.</p>";
    return;
  }
  sheet.innerHTML = `
    <p class="kicker">${esc(item.ticket)}</p>
    <h2>${esc(item.kind)}</h2>
    <p>${esc(item.origin)} · faltantes de ejemplo: ${missingCount(item)}</p>
    <form id="edit">
      <label>Ticket<input name="ticket" value="${esc(item.ticket)}"></label>
      <label>Tipo<input name="kind" value="${esc(item.kind)}"></label>
      <label>Origen<input name="origin" value="${esc(item.origin)}"></label>
      <label>Cuándo<input name="due" value="${esc(item.due)}"></label>
      <label>Estado
        <select name="status">
          ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
        </select>
      </label>
      <label>Ítems · cantidad · faltante</label>
      ${lineFields(item)}
      <label>Nota de caja o recepción<textarea name="note">${esc(item.note)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Guardar ticket</button>
        <button class="ghost" id="remove" type="button">Borrar</button>
      </div>
    </form>
    <h3>Movimiento</h3>
    ${(item.history || []).map((line) => `<p><strong>${esc(line.when)}</strong> ${esc(line.text)}</p>`).join("")}`;

  sheet.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextItems = (item.items || []).map((line, index) => ({
      name: String(data.get(`name-${index}`) || line.name),
      qty: Number(data.get(`qty-${index}`) || 0),
      missing: Number(data.get(`missing-${index}`) || 0)
    }));
    const nextStatus = String(data.get("status") || item.status);
    Object.assign(item, {
      ticket: String(data.get("ticket") || ""),
      kind: String(data.get("kind") || ""),
      origin: String(data.get("origin") || ""),
      due: String(data.get("due") || ""),
      status: nextStatus,
      items: nextItems,
      note: String(data.get("note") || "")
    });
    item.history = [{ when: "hoy", text: `Ticket actualizado. Estado: ${label(nextStatus)}.` }, ...(item.history || [])];
    save(items);
    showToast("Cambios guardados");
    render();
  });

  sheet.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer.")) return;
    items = items.filter((entry) => entry.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Ticket eliminado");
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
