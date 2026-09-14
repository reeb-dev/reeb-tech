let items = load();
let selected = items[0]?.id || "";
let currentTab = "pedido";
let searchTerm = "";

const forms = {
  pedido: document.getElementById("create-pedido"),
  faltante: document.getElementById("create-faltante"),
  caja: document.getElementById("create-caja")
};
const openCreate = document.getElementById("open-create");
const searchInput = document.getElementById("search");

openCreate.addEventListener("click", () => {
  Object.entries(forms).forEach(([key, form]) => {
    if (key === currentTab) form.classList.toggle("open");
    else form.classList.remove("open");
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  Object.values(forms).forEach((form) => form.classList.remove("open"));
  const first = visible()[0];
  if (first) selected = first.id;
  render();
});

forms.pedido.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  addTicket({
    ticket: String(data.get("ticket") || ""),
    kind: "Supplier order",
    origin: String(data.get("origin") || ""),
    due: String(data.get("due") || "Today"),
    status: "pedido",
    items: [{ name: String(data.get("item") || ""), qty: Number(data.get("qty") || 1), missing: 0 }],
    note: "",
    history: [{ when: "today", text: "Order added at the counter." }]
  });
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Order added");
});

forms.faltante.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  addTicket({
    ticket: String(data.get("ticket") || ""),
    kind: "Shelf shortage",
    origin: String(data.get("origin") || ""),
    due: "Today",
    status: "faltante",
    items: [{
      name: String(data.get("item") || ""),
      qty: Number(data.get("qty") || 1),
      missing: Number(data.get("missing") || 1)
    }],
    note: "",
    history: [{ when: "today", text: "Shelf shortage recorded." }]
  });
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Shortage added");
});

forms.caja.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const efectivo = Number(data.get("efectivo") || 0);
  const tarjetas = Number(data.get("tarjetas") || 0);
  const contado = Number(data.get("contado") || 0);
  const declarado = efectivo + tarjetas;
  addTicket({
    ticket: String(data.get("ticket") || ""),
    kind: "Cash reconciliation",
    origin: String(data.get("origin") || "Register 1"),
    due: String(data.get("due") || "Today"),
    status: "caja",
    items: [],
    caja: { efectivo, tarjetas, declarado, contado },
    note: declarado === contado ? "Register balanced." : "There is a difference. Review the shift.",
    history: [{ when: "today", text: "Reconciliation added." }]
  });
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Reconciliation added");
});

function addTicket(item) {
  item.id = crypto.randomUUID();
  items = [item, ...items];
  selected = item.id;
  save(items);
  render();
}

function visible() {
  let result = items.filter((item) => item.status === currentTab);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.ticket.toLowerCase().includes(term) ||
      item.kind.toLowerCase().includes(term) ||
      (item.origin || "").toLowerCase().includes(term) ||
      (item.items || []).some((line) => line.name.toLowerCase().includes(term))
    );
  }
  return result;
}

function lineFields(item) {
  return (item.items || []).map((line, index) => `
    <div class="item-row">
      <input name="name-${index}" value="${esc(line.name)}" aria-label="Item">
      <input name="qty-${index}" type="number" min="0" value="${esc(line.qty)}" aria-label="Quantity">
      <input name="missing-${index}" type="number" min="0" value="${esc(line.missing)}" aria-label="Missing">
    </div>`).join("");
}

function render() {
  const pedidos = items.filter((item) => item.status === "pedido").length;
  const faltantes = items.filter((item) => item.status === "faltante").length;
  const cajas = items.filter((item) => item.status === "caja");
  const gaps = items.reduce((sum, item) => sum + missingCount(item), 0);
  const difCaja = cajas.reduce((sum, item) => sum + Math.abs(cajaDiff(item)), 0);

  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === currentTab);
  });
  Object.entries(forms).forEach(([key, form]) => {
    form.style.display = key === currentTab ? "" : "none";
  });
  const titles = {
    pedido: "Supplier orders",
    faltante: "Shelf shortages",
    caja: "Shift reconciliation"
  };
  const buttons = {
    pedido: "New order",
    faltante: "New shortage",
    caja: "New reconciliation"
  };
  document.getElementById("panelTitle").textContent = titles[currentTab];
  openCreate.textContent = buttons[currentTab];

  document.getElementById("stats").innerHTML = `
    <button type="button" data-tab-jump="pedido" class="${currentTab === "pedido" ? "on" : ""}"><strong>${pedidos}</strong>orders</button>
    <button type="button" data-tab-jump="faltante" class="${currentTab === "faltante" ? "on" : ""}"><strong>${faltantes}</strong>shortages</button>
    <button type="button" data-tab-jump="caja" class="${currentTab === "caja" ? "on" : ""}"><strong>${cajas.length}</strong>reconciliations</button>
    <div><strong>${gaps}</strong>missing units</div>
    <div><strong>${esc(money(difCaja))}</strong>cash difference</div>
  `;
  document.querySelectorAll("[data-tab-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tabJump;
      const first = visible()[0];
      if (first) selected = first.id;
      render();
    });
  });

  const rows = visible();
  if (!rows.some((item) => item.id === selected) && rows[0]) selected = rows[0].id;

  document.getElementById("tickets").innerHTML = rows.map((item) => `
    <button class="ticket ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}" type="button">
      <div class="ticket-top">
        <strong>${esc(item.ticket)}</strong>
        <span class="tag ${esc(item.status)}">${esc(label(item.status))}</span>
      </div>
      <span>${esc(item.kind)} · ${esc(item.origin)} · ${esc(item.due)}</span>
      ${item.status === "caja" ? `
        <div class="lines">
          <span class="chip">Declared ${esc(money(item.caja?.declarado || 0))}</span>
          <span class="chip ${cajaDiff(item) ? "warn" : ""}">${cajaDiff(item) ? `Diff. ${esc(money(cajaDiff(item)))}` : "Balanced"}</span>
        </div>
      ` : `
        <div class="lines">
          ${(item.items || []).map((line) => `<span class="chip ${line.missing ? "warn" : ""}">${esc(line.name)} × ${esc(line.qty)}${line.missing ? ` · missing ${esc(line.missing)}` : ""}</span>`).join("")}
        </div>
      `}
    </button>`).join("") || `<p class="empty">No ${esc(titles[currentTab].toLowerCase())} match this filter.</p>`;

  document.querySelectorAll(".ticket").forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.id;
      render();
    });
  });

  const item = items.find((entry) => entry.id === selected && entry.status === currentTab) || items.find((entry) => entry.id === selected);
  const sheet = document.getElementById("sheet");
  if (!item) {
    sheet.innerHTML = "<p>Choose a ticket from the list.</p>";
    return;
  }

  const caja = item.caja || { efectivo: 0, tarjetas: 0, declarado: 0, contado: 0 };
  sheet.innerHTML = `
    <p class="kicker">${esc(item.ticket)}</p>
    <h2>${esc(item.kind)}</h2>
    <p>${esc(item.origin)} · ${item.status === "caja" ? `difference ${esc(money(cajaDiff(item)))}` : `missing: ${missingCount(item)}`}</p>
    <form id="edit">
      <label>Ticket<input name="ticket" value="${esc(item.ticket)}"></label>
      <label>Type<input name="kind" value="${esc(item.kind)}"></label>
      <label>Origin<input name="origin" value="${esc(item.origin)}"></label>
      <label>When<input name="due" value="${esc(item.due)}"></label>
      <label>Status
        <select name="status">
          ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
        </select>
      </label>
      ${item.status === "caja" ? `
        <label>Cash<input name="efectivo" type="number" value="${caja.efectivo || 0}"></label>
        <label>Cards<input name="tarjetas" type="number" value="${caja.tarjetas || 0}"></label>
        <label>Counted cash<input name="contado" type="number" value="${caja.contado || 0}"></label>
      ` : `
        <label>Items · quantity · missing</label>
        ${lineFields(item)}
        <button class="ghost" type="button" id="add-line">Add item</button>
      `}
      <label>Note<textarea name="note">${esc(item.note)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Save ticket</button>
        <button class="ghost" id="remove" type="button">Delete</button>
      </div>
    </form>
    <h3>Activity</h3>
    ${(item.history || []).map((line) => `<p><strong>${esc(line.when)}</strong> ${esc(line.text)}</p>`).join("")}`;

  sheet.querySelector("#add-line")?.addEventListener("click", () => {
    item.items = [...(item.items || []), { name: "", qty: 1, missing: 0 }];
    save(items);
    render();
  });

  sheet.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextStatus = String(data.get("status") || item.status);
    const nextItems = item.status === "caja"
      ? item.items
      : (item.items || []).map((line, index) => ({
        name: String(data.get(`name-${index}`) || line.name),
        qty: Number(data.get(`qty-${index}`) || 0),
        missing: Number(data.get(`missing-${index}`) || 0)
      })).filter((line) => line.name.trim());
    const efectivo = Number(data.get("efectivo") || caja.efectivo || 0);
    const tarjetas = Number(data.get("tarjetas") || caja.tarjetas || 0);
    const contado = Number(data.get("contado") || caja.contado || 0);
    Object.assign(item, {
      ticket: String(data.get("ticket") || ""),
      kind: String(data.get("kind") || ""),
      origin: String(data.get("origin") || ""),
      due: String(data.get("due") || ""),
      status: nextStatus,
      items: nextItems,
      note: String(data.get("note") || "")
    });
    if (nextStatus === "caja") {
      item.caja = { efectivo, tarjetas, declarado: efectivo + tarjetas, contado };
    }
    item.history = [{ when: "today", text: `Ticket updated. Status: ${label(nextStatus)}.` }, ...(item.history || [])];
    save(items);
    currentTab = nextStatus;
    showToast("Changes saved");
    render();
  });

  sheet.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("Delete this ticket? This action cannot be undone.")) return;
    items = items.filter((entry) => entry.id !== item.id);
    selected = visible()[0]?.id || items[0]?.id || "";
    save(items);
    showToast("Ticket deleted");
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
