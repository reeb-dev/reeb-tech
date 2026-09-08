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
    number: String(data.get("number") || ""),
    caratula: String(data.get("caratula") || ""),
    fuero: String(data.get("fuero") || "Sin fuero"),
    juzgado: String(data.get("juzgado") || "Sin radicar"),
    party: String(data.get("party") || ""),
    role: "Parte",
    due: String(data.get("due") || "Sin fecha"),
    status: "consulta",
    escrito: String(data.get("escrito") || "Sin escrito."),
    history: [{ when: "hoy", text: "Cargado en consulta, como ejemplo." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Expediente agregado");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.caratula.toLowerCase().includes(term) || 
      item.number.toLowerCase().includes(term) ||
      (item.party || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  const pending = items.filter((item) => item.escrito && item.status !== "consulta").length;
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>en la mesa</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
    <div><strong>${pending}</strong>con escrito</div>
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

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.number)}</td>
      <td>${esc(item.caratula)}</td>
      <td>${esc(item.fuero)}<br>${esc(item.juzgado)}</td>
      <td>${esc(item.party)}</td>
      <td>${esc(item.due)}</td>
      <td><span class="pill">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay expedientes en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((entry) => entry.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un expediente de la mesa.</p>";
    return;
  }
  detail.innerHTML = `
    <p class="eyebrow">Ficha de ejemplo</p>
    <h2>${esc(item.caratula)}</h2>
    <p>Exp. ${esc(item.number)} · ${esc(item.role)}</p>
    <div class="meta">
      <div><span>Fuero</span>${esc(item.fuero)}</div>
      <div><span>Juzgado</span>${esc(item.juzgado)}</div>
      <div><span>Parte</span>${esc(item.party)}</div>
      <div><span>Plazo</span>${esc(item.due)}</div>
    </div>
    <form id="edit">
      <label>Número<input name="number" value="${esc(item.number)}"></label>
      <label>Carátula<input name="caratula" value="${esc(item.caratula)}"></label>
      <label>Fuero<input name="fuero" value="${esc(item.fuero)}"></label>
      <label>Juzgado<input name="juzgado" value="${esc(item.juzgado)}"></label>
      <label>Parte<input name="party" value="${esc(item.party)}"></label>
      <label>Plazo o audiencia<input name="due" value="${esc(item.due)}"></label>
      <label>Estado procesal
        <select name="status">
          ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
        </select>
      </label>
      <label>Escrito pendiente<textarea name="escrito">${esc(item.escrito)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Guardar ficha</button>
        <button class="ghost" type="button" id="remove">Sacar de la mesa</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial de la mesa</h3>
      ${(item.history || []).map((line) => `<p><time>${esc(line.when)}</time>${esc(line.text)}</p>`).join("")}
    </div>`;

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const escrito = String(data.get("escrito") || "");
    const nextStatus = String(data.get("status") || item.status);
    if (escrito !== item.escrito || nextStatus !== item.status) {
      item.history = [{ when: "hoy", text: `Ficha actualizada. Estado: ${label(nextStatus)}.` }, ...(item.history || [])];
    }
    Object.assign(item, {
      number: String(data.get("number") || ""),
      caratula: String(data.get("caratula") || ""),
      fuero: String(data.get("fuero") || ""),
      juzgado: String(data.get("juzgado") || ""),
      party: String(data.get("party") || ""),
      due: String(data.get("due") || ""),
      status: nextStatus,
      escrito
    });
    save(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este expediente? Esta acción no se puede deshacer.")) return;
    items = items.filter((entry) => entry.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Expediente eliminado");
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
