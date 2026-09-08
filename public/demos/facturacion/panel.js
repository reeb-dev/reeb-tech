let items = load();
let selected = items.find((item) => item.status === "cobrar")?.id || items[0]?.id || "";
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
    type: String(data.get("type") || "Factura B"),
    number: String(data.get("number") || ""),
    receptor: String(data.get("receptor") || ""),
    cuit: "Ejemplo",
    amount: Number(data.get("amount") || 0),
    due: String(data.get("due") || ""),
    status: "borrador",
    aviso: String(data.get("aviso") || ""),
    history: [{ when: "hoy", text: "Borrador cargado en el libro de ejemplo." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  render();
});

function sum(status) {
  return items
    .filter((item) => (status ? item.status === status : true))
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.receptor.toLowerCase().includes(term) || 
      item.number.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  document.getElementById("totals").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>comprobantes</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
    <div><strong>${esc(money(sum("emitido")))}</strong>emitido, ejemplo</div>
    <div><strong>${esc(money(sum("cobrar")))}</strong>a cobrar, ejemplo</div>
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

  document.getElementById("rows").innerHTML = visible().map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.type)}</td>
      <td class="num">${esc(item.number)}</td>
      <td>${esc(item.receptor)}</td>
      <td class="amount">${esc(money(item.amount))}</td>
      <td>${esc(formatDue(item.due))}</td>
      <td><span class="state ${esc(item.status)}">${esc(label(item.status))}</span></td>
      <td>${esc(item.aviso)}</td>
    </tr>`).join("") || `<tr><td colspan="7">No hay comprobantes en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((entry) => entry.id === selected);
  const sheet = document.getElementById("sheet");
  if (!item) {
    sheet.innerHTML = "<p>Elegí un comprobante del libro.</p>";
    return;
  }
  sheet.innerHTML = `
    <div>
      <p class="kicker">Ficha de ejemplo</p>
      <h2>${esc(item.type)} ${esc(item.number)}</h2>
      <p>${esc(item.receptor)} · ${esc(item.cuit)}</p>
      <p class="num">${esc(money(item.amount))} · vence ${esc(formatDue(item.due))}</p>
      <h3>Aviso de cobro</h3>
      <p>${esc(item.aviso || "Sin aviso.")}</p>
      <h3>Movimiento</h3>
      ${(item.history || []).map((line) => `<p><strong>${esc(line.when)}</strong> ${esc(line.text)}</p>`).join("")}
    </div>
    <form id="edit">
      <div class="grid">
        <label>Tipo
          <select name="type">${TYPES.map((type) => `<option ${item.type === type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select>
        </label>
        <label>Número<input name="number" value="${esc(item.number)}"></label>
        <label>Receptor<input name="receptor" value="${esc(item.receptor)}"></label>
        <label>CUIT de ejemplo<input name="cuit" value="${esc(item.cuit)}"></label>
        <label>Monto<input name="amount" type="number" min="0" value="${esc(item.amount)}"></label>
        <label>Vencimiento<input name="due" type="date" value="${esc(item.due)}"></label>
      </div>
      <label>Estado
        <select name="status">
          ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
        </select>
      </label>
      <label>Aviso de cobro<textarea name="aviso">${esc(item.aviso)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Guardar comprobante</button>
        <button class="ghost" id="remove" type="button">Borrar</button>
      </div>
    </form>`;

  sheet.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextStatus = String(data.get("status") || item.status);
    Object.assign(item, {
      type: String(data.get("type") || ""),
      number: String(data.get("number") || ""),
      receptor: String(data.get("receptor") || ""),
      cuit: String(data.get("cuit") || ""),
      amount: Number(data.get("amount") || 0),
      due: String(data.get("due") || ""),
      status: nextStatus,
      aviso: String(data.get("aviso") || "")
    });
    item.history = [{ when: "hoy", text: `Comprobante actualizado. Estado: ${label(nextStatus)}.` }, ...(item.history || [])];
    save(items);
    showToast("Cambios guardados");
    render();
  });

  sheet.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este comprobante? Esta acción no se puede deshacer.")) return;
    items = items.filter((entry) => entry.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Comprobante eliminado");
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
