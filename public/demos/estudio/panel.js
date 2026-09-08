let items = load();
let selected = items[0]?.id || "";
let filter = "todos";
let fueroFilter = "todos";
let searchTerm = "";
let currentTab = "expedientes";

const createForm = document.getElementById("create");
const openCreate = document.getElementById("open-create");
const searchInput = document.getElementById("search");

openCreate.addEventListener("click", () => {
  currentTab = "expedientes";
  createForm.classList.toggle("open");
  render();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  createForm.classList.remove("open");
  render();
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const dueDate = String(data.get("dueDate") || "");
  const tipoPlazo = String(data.get("tipoPlazo") || "presentacion");
  const item = {
    id: crypto.randomUUID(),
    number: String(data.get("number") || ""),
    caratula: String(data.get("caratula") || ""),
    fuero: String(data.get("fuero") || "Civil"),
    juzgado: String(data.get("juzgado") || "Sin radicar"),
    party: String(data.get("party") || ""),
    role: "Parte",
    abogado: String(data.get("abogado") || "Sin asignar"),
    due: dueDate ? `${formatDue(dueDate)} · ${plazoLabel(tipoPlazo).toLowerCase()}` : "Sin fecha",
    dueDate,
    tipoPlazo,
    status: "consulta",
    escrito: String(data.get("escrito") || "Sin escrito."),
    history: [{ when: "hoy", text: "Cargado en consulta, como ejemplo." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Expediente cargado en la mesa");
  render();
});

function formatDue(iso) {
  if (!iso) return "Sin fecha";
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function visible() {
  let result = items;
  if (filter !== "todos") result = result.filter((item) => item.status === filter);
  if (fueroFilter !== "todos") result = result.filter((item) => item.fuero === fueroFilter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.caratula.toLowerCase().includes(term) ||
      item.number.toLowerCase().includes(term) ||
      (item.party || "").toLowerCase().includes(term) ||
      (item.abogado || "").toLowerCase().includes(term) ||
      (item.juzgado || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function matchingSearch(item) {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return item.caratula.toLowerCase().includes(term) ||
    item.number.toLowerCase().includes(term) ||
    (item.party || "").toLowerCase().includes(term) ||
    (item.abogado || "").toLowerCase().includes(term);
}

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === currentTab);
  });
  document.getElementById("view-expedientes").hidden = currentTab !== "expedientes";
  document.getElementById("view-plazos").hidden = currentTab !== "plazos";
  document.getElementById("view-escritos").hidden = currentTab !== "escritos";
  document.getElementById("view-historial").hidden = currentTab !== "historial";
  createForm.style.display = currentTab === "expedientes" ? "" : "none";
  const titles = {
    expedientes: "Expedientes",
    plazos: "Plazos y audiencias",
    escritos: "Escritos pendientes",
    historial: "Historial de la mesa"
  };
  document.getElementById("panelTitle").textContent = titles[currentTab];
  openCreate.textContent = "Nuevo expediente";
}

function renderStats() {
  const pending = items.filter((item) => item.escrito && item.status !== "archivo").length;
  const vencidos = items.filter((item) => dueUrgency(item.dueDate) === "vencido" || dueUrgency(item.dueDate) === "hoy").length;
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>en la mesa</button>
    ${STATUSES.map((status) => {
      const count = items.filter((item) => item.status === status.id).length;
      return `<button type="button" data-filter="${status.id}" class="${filter === status.id ? "on" : ""}"><strong>${count}</strong>${esc(status.label)}</button>`;
    }).join("")}
    <div><strong>${pending}</strong>con escrito</div>
    <div><strong>${vencidos}</strong>plazo cercano</div>
    <div class="fuero-filters">
      <button type="button" data-fuero="todos" class="${fueroFilter === "todos" ? "on" : ""}">Todos los fueros</button>
      ${FUEROS.map((fuero) => `<button type="button" data-fuero="${esc(fuero.id)}" class="${fueroFilter === fuero.id ? "on" : ""}">${esc(fuero.label)}</button>`).join("")}
    </div>
  `;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      currentTab = "expedientes";
      render();
    });
  });
  document.querySelectorAll("[data-fuero]").forEach((button) => {
    button.addEventListener("click", () => {
      fueroFilter = button.dataset.fuero;
      render();
    });
  });
}

function bindExpediente(item, onDone) {
  return (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const escrito = String(data.get("escrito") || "");
    const nextStatus = String(data.get("status") || item.status);
    const dueDate = String(data.get("dueDate") || "");
    const tipoPlazo = String(data.get("tipoPlazo") || item.tipoPlazo);
    if (escrito !== item.escrito || nextStatus !== item.status) {
      item.history = [{ when: "hoy", text: `Ficha actualizada. Estado: ${label(nextStatus)}.` }, ...(item.history || [])];
    }
    Object.assign(item, {
      number: String(data.get("number") || ""),
      caratula: String(data.get("caratula") || ""),
      fuero: String(data.get("fuero") || ""),
      juzgado: String(data.get("juzgado") || ""),
      party: String(data.get("party") || ""),
      abogado: String(data.get("abogado") || ""),
      dueDate,
      due: dueDate ? `${formatDue(dueDate)} · ${plazoLabel(tipoPlazo).toLowerCase()}` : "Sin fecha",
      tipoPlazo,
      status: nextStatus,
      escrito
    });
    save(items);
    showToast("Cambios guardados");
    onDone();
  };
}

function removeExpediente(item) {
  if (!confirm("¿Sacar este expediente de la mesa? Esta acción no se puede deshacer.")) return;
  items = items.filter((entry) => entry.id !== item.id);
  selected = items[0]?.id || "";
  save(items);
  showToast("Expediente eliminado");
  render();
}

function fichaForm(item) {
  return `
    <form class="ficha" data-edit="${esc(item.id)}">
      <label>Número<input name="number" value="${esc(item.number)}"></label>
      <label>Carátula<input name="caratula" value="${esc(item.caratula)}"></label>
      <label>Fuero
        <select name="fuero">
          ${FUEROS.map((fuero) => `<option value="${esc(fuero.id)}" ${item.fuero === fuero.id ? "selected" : ""}>${esc(fuero.label)}</option>`).join("")}
        </select>
      </label>
      <label>Juzgado<input name="juzgado" value="${esc(item.juzgado)}"></label>
      <label>Parte<input name="party" value="${esc(item.party)}"></label>
      <label>Abogado<input name="abogado" value="${esc(item.abogado || "")}"></label>
      <label>Fecha de plazo<input name="dueDate" type="date" value="${esc(item.dueDate || "")}"></label>
      <label>Tipo de plazo
        <select name="tipoPlazo">
          ${TIPOS_PLAZO.map((tipo) => `<option value="${esc(tipo.id)}" ${item.tipoPlazo === tipo.id ? "selected" : ""}>${esc(tipo.label)}</option>`).join("")}
        </select>
      </label>
      <label>Estado procesal
        <select name="status">
          ${STATUSES.map((status) => `<option value="${status.id}" ${item.status === status.id ? "selected" : ""}>${esc(status.label)}</option>`).join("")}
        </select>
      </label>
      <label>Escrito pendiente<textarea name="escrito">${esc(item.escrito)}</textarea></label>
      <div class="actions">
        <button class="btn" type="submit">Guardar ficha</button>
        <button class="ghost" type="button" data-remove="${esc(item.id)}">Sacar de la mesa</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Historial de la mesa</h3>
      ${(item.history || []).map((line) => `<p><time>${esc(line.when)}</time>${esc(line.text)}</p>`).join("")}
    </div>`;
}

function wireFicha(root) {
  root.querySelectorAll("[data-edit]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const item = items.find((entry) => entry.id === form.dataset.edit);
      if (!item) return;
      bindExpediente(item, render)(event);
    });
  });
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = items.find((entry) => entry.id === btn.dataset.remove);
      if (item) removeExpediente(item);
    });
  });
}

function renderExpedientes() {
  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.number)}</td>
      <td>${esc(item.caratula)}</td>
      <td>${esc(item.fuero)}<br>${esc(item.juzgado)}</td>
      <td>${esc(item.party)}</td>
      <td><span class="urg ${dueUrgency(item.dueDate)}">${esc(item.due)}</span></td>
      <td><span class="pill ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay expedientes con este filtro.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
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
  const urg = dueUrgency(item.dueDate);
  detail.innerHTML = `
    <p class="eyebrow">Ficha de ejemplo</p>
    <h2>${esc(item.caratula)}</h2>
    <p>Exp. ${esc(item.number)} · ${esc(item.role)} · ${esc(item.abogado || "Sin asignar")}</p>
    <div class="meta">
      <div><span>Fuero</span>${esc(item.fuero)}</div>
      <div><span>Juzgado</span>${esc(item.juzgado)}</div>
      <div><span>Parte</span>${esc(item.party)}</div>
      <div><span>Plazo</span><span class="urg ${urg}">${esc(item.due)} · ${esc(urgencyLabel(urg))}</span></div>
    </div>
    ${fichaForm(item)}`;
  wireFicha(detail);
}

function renderPlazos() {
  const list = items
    .filter(matchingSearch)
    .filter((item) => fueroFilter === "todos" || item.fuero === fueroFilter)
    .slice()
    .sort((a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")));
  const close = list.filter((item) => ["vencido", "hoy", "proximo"].includes(dueUrgency(item.dueDate))).length;
  document.getElementById("plazosNote").textContent = list.length
    ? `${list.length} plazos en la mesa · ${close} vencen esta semana o ya vencieron.`
    : "No hay plazos con este filtro.";
  document.getElementById("plazos").innerHTML = list.map((item) => {
    const urg = dueUrgency(item.dueDate);
    return `
      <article class="mesa-card ${item.id === selected ? "on" : ""}" data-open="${esc(item.id)}">
        <div class="mesa-head">
          <span class="urg ${urg}">${esc(urgencyLabel(urg))}</span>
          <span class="pill ${esc(item.status)}">${esc(label(item.status))}</span>
        </div>
        <p class="file">${esc(item.number)} · ${esc(item.fuero)}</p>
        <h3>${esc(item.caratula)}</h3>
        <p>${esc(item.due)} · ${esc(plazoLabel(item.tipoPlazo))}</p>
        <p class="muted">${esc(item.abogado || "Sin asignar")} · ${esc(item.juzgado)}</p>
      </article>`;
  }).join("") || "<p class='note'>No hay plazos cargados.</p>";

  document.querySelectorAll("#plazos [data-open]").forEach((card) => {
    card.addEventListener("click", () => {
      selected = card.dataset.open;
      currentTab = "expedientes";
      render();
    });
  });
}

function renderEscritos() {
  const list = items
    .filter(matchingSearch)
    .filter((item) => item.status !== "archivo")
    .filter((item) => item.escrito && item.escrito !== "Sin escrito.");
  document.getElementById("escritos").innerHTML = list.map((item) => `
    <article class="mesa-card ${item.id === selected ? "on" : ""}">
      <div class="mesa-head">
        <span class="file">${esc(item.number)}</span>
        <span class="pill ${esc(item.status)}">${esc(label(item.status))}</span>
      </div>
      <h3>${esc(item.caratula)}</h3>
      <p>${esc(item.escrito)}</p>
      <p class="muted">${esc(item.due)} · ${esc(item.abogado || "Sin asignar")}</p>
      <div class="actions">
        <button class="btn" type="button" data-open="${esc(item.id)}">Abrir ficha</button>
        <button class="ghost" type="button" data-presentar="${esc(item.id)}">Marcar presentado</button>
      </div>
    </article>
  `).join("") || "<p class='note'>No hay escritos pendientes.</p>";

  document.querySelectorAll("#escritos [data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selected = btn.dataset.open;
      currentTab = "expedientes";
      render();
    });
  });
  document.querySelectorAll("#escritos [data-presentar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = items.find((entry) => entry.id === btn.dataset.presentar);
      if (!item) return;
      item.status = "tramite";
      item.history = [{ when: "hoy", text: "Escrito marcado como presentado." }, ...(item.history || [])];
      save(items);
      showToast("Escrito presentado");
      render();
    });
  });
}

function renderHistorial() {
  const feed = items
    .filter(matchingSearch)
    .flatMap((item) => (item.history || []).map((line) => ({
      when: line.when,
      text: line.text,
      caratula: item.caratula,
      number: item.number,
      id: item.id
    })));
  document.getElementById("historial").innerHTML = feed.map((line) => `
    <button class="history-row" type="button" data-open="${esc(line.id)}">
      <time>${esc(line.when)}</time>
      <div>
        <strong>${esc(line.number)} · ${esc(line.caratula)}</strong>
        <p>${esc(line.text)}</p>
      </div>
    </button>
  `).join("") || "<p class='note'>Todavía no hay movimiento.</p>";

  document.querySelectorAll("#historial [data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selected = btn.dataset.open;
      currentTab = "expedientes";
      render();
    });
  });
}

function render() {
  items = load();
  setTabVisibility();
  renderStats();
  renderExpedientes();
  renderPlazos();
  renderEscritos();
  renderHistorial();
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
