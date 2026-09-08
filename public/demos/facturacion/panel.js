let items = load();
let selected = items.find((item) => item.status === "cobrar")?.id || items[0]?.id || "";
let filter = "todos";
let typeFilter = "todos";
let searchTerm = "";

const createForm = document.getElementById("create");
const typeSelect = createForm.querySelector('[name="type"]');
typeSelect.innerHTML = TYPES.map((type) => `<option value="${esc(type.label)}">${esc(type.label)}</option>`).join("");

function suggestNumber() {
  createForm.number.value = nextNumber(items, typeSelect.value);
}

typeSelect.addEventListener("change", suggestNumber);
suggestNumber();

document.getElementById("open-create").addEventListener("click", () => {
  createForm.classList.toggle("open");
  if (createForm.classList.contains("open")) suggestNumber();
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const type = String(data.get("type") || "Factura B");
  const amount = Number(data.get("amount") || 0);
  const detalle = String(data.get("detalle") || "").trim() || `${type} de ejemplo`;
  const item = normalize({
    id: crypto.randomUUID(),
    type,
    number: String(data.get("number") || nextNumber(items, type)),
    receptor: String(data.get("receptor") || ""),
    cuit: String(data.get("cuit") || ""),
    ivaCond: String(data.get("ivaCond") || ""),
    amount,
    due: String(data.get("due") || ""),
    status: "borrador",
    aviso: String(data.get("aviso") || ""),
    lines: [{ desc: detalle, qty: 1, pu: amount }],
    history: [{ when: "hoy", text: "Borrador cargado en el libro de ejemplo." }]
  });
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  suggestNumber();
  showToast("Borrador cargado");
  render();
});

document.getElementById("search").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  render();
});

function sum(status) {
  return items
    .filter((item) => (status ? item.status === status : true))
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (typeFilter !== "todos") {
    result = result.filter((item) => item.type === typeFilter);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.receptor.toLowerCase().includes(term) ||
      item.number.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      (item.cuit || "").toLowerCase().includes(term) ||
      (item.cae || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  const overdueCount = items.filter(isOverdue).length;
  document.getElementById("totals").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>comprobantes</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
    <div><strong>${esc(money(sum("emitido")))}</strong>emitido</div>
    <div class="${overdueCount ? "warn" : ""}"><strong>${esc(money(sum("cobrar")))}</strong>a cobrar${overdueCount ? ` · ${overdueCount} vencido${overdueCount > 1 ? "s" : ""}` : ""}</div>
    <div><strong>${esc(money(sum("cobrado")))}</strong>cobrado</div>
  `;

  document.getElementById("typeFilters").innerHTML = `
    <button type="button" data-type="todos" class="${typeFilter === "todos" ? "on" : ""}">Todos los tipos</button>
    ${TYPES.map((type) => `
      <button type="button" data-type="${esc(type.label)}" class="${typeFilter === type.label ? "on" : ""}">${esc(type.label)}</button>
    `).join("")}
  `;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      typeFilter = button.dataset.type;
      render();
    });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""} ${isOverdue(item) ? "late" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.type)}</td>
      <td class="num">${esc(item.number)}</td>
      <td>${esc(item.receptor)}<br><small>${esc(item.cuit)}</small></td>
      <td class="amount">${esc(money(item.amount))}</td>
      <td>${esc(formatDue(item.due))}</td>
      <td class="num">${item.cae ? esc(item.cae.slice(0, 6) + "…" + item.cae.slice(-4)) : "—"}</td>
      <td><span class="state ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="7">No hay comprobantes con este filtro.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  renderSheet();
}

function renderSheet() {
  const item = items.find((entry) => entry.id === selected);
  const sheet = document.getElementById("sheet");
  if (!item) {
    sheet.innerHTML = "<p>Elegí un comprobante del libro.</p>";
    return;
  }

  const parts = breakdown(item);
  const canEmit = item.status === "borrador" || !item.cae;

  sheet.innerHTML = `
    ${renderComprobante(item, { compact: true })}
    ${item.cae ? `
      <div class="arca-box done">
        <p>Autorizado (simulado)</p>
        <p><strong>CAE ${esc(item.cae)}</strong></p>
        <p>Vto. CAE ${esc(formatDate(item.caeVto))} · emitido ${esc(formatDate(item.emitted))}</p>
      </div>
    ` : `
      <div class="arca-box">
        <h3>Emitir en ARCA (simulado)</h3>
        <p>Genera un CAE de 14 dígitos y pasa el comprobante a emitido. No consulta AFIP.</p>
        <button class="btn" type="button" id="emit-arca">Emitir ${esc(item.type)}</button>
      </div>
    `}
    <form id="edit">
      <div class="grid">
        <label>Tipo
          <select name="type">${TYPES.map((type) => `<option ${item.type === type.label ? "selected" : ""}>${esc(type.label)}</option>`).join("")}</select>
        </label>
        <label>Número<input name="number" value="${esc(item.number)}"></label>
        <label>Receptor<input name="receptor" value="${esc(item.receptor)}"></label>
        <label>CUIT<input name="cuit" value="${esc(item.cuit)}"></label>
        <label>Condición IVA
          <select name="ivaCond">
            ${["IVA Responsable Inscripto", "Consumidor Final", "Monotributo"].map((cond) =>
              `<option ${item.ivaCond === cond ? "selected" : ""}>${esc(cond)}</option>`).join("")}
          </select>
        </label>
        <label>Monto<input name="amount" type="number" min="0" value="${esc(item.amount)}"></label>
        <label>Vencimiento<input name="due" type="date" value="${esc(item.due)}"></label>
        <label>Estado
          <select name="status">
            ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
          </select>
        </label>
      </div>
      <label>Detalle<input name="detalle" value="${esc(item.lines?.[0]?.desc || "")}"></label>
      <label>Aviso de cobro<textarea name="aviso">${esc(item.aviso)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Guardar comprobante</button>
        ${item.status !== "cobrado" && item.cae ? `<button class="btn" type="button" id="mark-paid">Marcar cobrado</button>` : ""}
        <button class="ghost" type="button" id="duplicate">Duplicar</button>
        <button class="ghost danger" id="remove" type="button">Borrar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Movimiento</h3>
      ${(item.history || []).map((line) => `<p><time>${esc(line.when)}</time>${esc(line.text)}</p>`).join("")}
      ${canEmit ? "" : `<p class="note">Neto ${esc(money(parts.neto))} · IVA ${esc(money(parts.iva))} · Total ${esc(money(parts.total))}</p>`}
    </div>
  `;

  const emitBtn = sheet.querySelector("#emit-arca");
  if (emitBtn) {
    emitBtn.addEventListener("click", () => {
      item.cae = generateCae();
      item.emitted = todayISO();
      item.caeVto = caeVtoFrom(item.emitted);
      item.status = "emitido";
      item.history = [{ when: "hoy", text: `Emitido. CAE ${item.cae} · vto. ${formatDue(item.caeVto)}.` }, ...(item.history || [])];
      save(items);
      showToast("Comprobante emitido · CAE simulado");
      render();
    });
  }

  const paidBtn = sheet.querySelector("#mark-paid");
  if (paidBtn) {
    paidBtn.addEventListener("click", () => {
      item.status = "cobrado";
      item.aviso = item.aviso || "Marcado cobrado en el libro de ejemplo.";
      item.history = [{ when: "hoy", text: "Marcado como cobrado." }, ...(item.history || [])];
      save(items);
      showToast("Marcado cobrado");
      render();
    });
  }

  sheet.querySelector("#duplicate").addEventListener("click", () => {
    const copy = normalize({
      ...item,
      id: crypto.randomUUID(),
      number: nextNumber(items, item.type),
      status: "borrador",
      cae: "",
      caeVto: "",
      emitted: "",
      aviso: "Copia. Falta emitir.",
      history: [{ when: "hoy", text: `Copia de ${item.number}.` }]
    });
    items = [copy, ...items];
    selected = copy.id;
    save(items);
    showToast("Comprobante duplicado");
    render();
  });

  sheet.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextStatus = String(data.get("status") || item.status);
    const amount = Number(data.get("amount") || 0);
    const detalle = String(data.get("detalle") || item.lines?.[0]?.desc || item.type);
    Object.assign(item, {
      type: String(data.get("type") || ""),
      number: String(data.get("number") || ""),
      receptor: String(data.get("receptor") || ""),
      cuit: String(data.get("cuit") || ""),
      ivaCond: String(data.get("ivaCond") || ""),
      amount,
      due: String(data.get("due") || ""),
      status: nextStatus,
      aviso: String(data.get("aviso") || ""),
      lines: [{ desc: detalle, qty: 1, pu: amount }]
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

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

render();
