let items = loadObras();
let selected = items[0]?.id || "";
let filter = "todos";
let selectedArca = items.find((i) => i.factura)?.id || items[0]?.id || "";
let filterArca = "todos";

const viewObras = document.getElementById("view-obras");
const viewClientes = document.getElementById("view-clientes");
const viewArca = document.getElementById("view-arca");
const tabObras = document.getElementById("tab-obras");
const tabClientes = document.getElementById("tab-clientes");
const tabArca = document.getElementById("tab-arca");
const openCreate = document.getElementById("open-create");

tabObras.addEventListener("click", () => showView("obras"));
tabClientes.addEventListener("click", () => showView("clientes"));
tabArca.addEventListener("click", () => showView("arca"));

function showView(name) {
  viewObras.classList.toggle("panel-hidden", name !== "obras");
  viewClientes.classList.toggle("panel-hidden", name !== "clientes");
  viewArca.classList.toggle("panel-hidden", name !== "arca");
  tabObras.classList.toggle("on", name === "obras");
  tabClientes.classList.toggle("on", name === "clientes");
  tabArca.classList.toggle("on", name === "arca");
  openCreate.classList.toggle("panel-hidden", name !== "obras");
  if (name === "clientes") renderClientes();
  if (name === "arca") renderArca();
}

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "casa");
  const count = items.length + 18;
  const item = {
    id: crypto.randomUUID(),
    codigo: `OB-2026-${String(count).padStart(2, "0")}`,
    titulo: String(data.get("titulo") || tipoLabel(tipo)),
    tipo,
    cliente: {
      nombre: String(data.get("cliente") || ""),
      tel: String(data.get("tel") || ""),
      mail: ""
    },
    etapa: "anteproyecto",
    honorarios: 0,
    direccion: String(data.get("direccion") || ""),
    superficie: String(data.get("superficie") || ""),
    imagen: imagenDeTipo(tipo),
    factura: null,
    history: [{ when: "hoy", text: "Obra creada en anteproyecto." }]
  };
  items = [item, ...items];
  selected = item.id;
  saveObras(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Obra creada");
  render();
});

function visible() {
  return filter === "todos" ? items : items.filter((item) => item.etapa === filter);
}

function render() {
  const counts = {
    anteproyecto: items.filter((i) => i.etapa === "anteproyecto").length,
    ejecutivos: items.filter((i) => i.etapa === "ejecutivos").length,
    en_obra: items.filter((i) => i.etapa === "en_obra").length,
    finalizado: items.filter((i) => i.etapa === "finalizado").length
  };

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>obras</button>
    <button type="button" data-filter="anteproyecto" class="${filter === "anteproyecto" ? "on" : ""}"><strong>${counts.anteproyecto}</strong>anteproyecto</button>
    <button type="button" data-filter="ejecutivos" class="${filter === "ejecutivos" ? "on" : ""}"><strong>${counts.ejecutivos}</strong>ejecutivos</button>
    <button type="button" data-filter="en_obra" class="${filter === "en_obra" ? "on" : ""}"><strong>${counts.en_obra}</strong>en obra</button>
    <button type="button" data-filter="finalizado" class="${filter === "finalizado" ? "on" : ""}"><strong>${counts.finalizado}</strong>finalizado</button>
  `;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(item.imagen)}" alt="">
          <span>${esc(item.codigo)}<br><small>${esc(item.titulo)}</small></span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(tipoLabel(item.tipo))}</td>
      <td class="amount">${item.honorarios ? esc(money(item.honorarios)) : "—"}</td>
      <td><span class="tag ${esc(item.etapa)}">${esc(etapaLabel(item.etapa))}</span></td>
    </tr>`).join("") || `<tr><td colspan="5">No hay obras en esta etapa.</td></tr>`;

  document.querySelectorAll("#rows .row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una obra del listado.</p>";
    return;
  }

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.titulo)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.nombre)} · ${esc(item.cliente.tel) || "Sin teléfono"}</p>
    <img class="detail-photo" src="${esc(item.imagen)}" alt="">
    <div class="meta">
      <div><span>Tipo</span>${esc(tipoLabel(item.tipo))}</div>
      <div><span>Etapa</span>${esc(etapaLabel(item.etapa))}</div>
      <div><span>Superficie</span>${esc(item.superficie) || "—"}</div>
      <div><span>Dirección</span>${esc(item.direccion) || "—"}</div>
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>Honorarios facturados</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (honorarios)</h4>
        <label>CUIT cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${!item.honorarios ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:#6b6b6b;margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}
    <form id="edit">
      <label>Etapa
        <select name="etapa">
          ${ETAPAS.map((s) => `<option value="${s.id}" ${item.etapa === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Honorarios<input name="honorarios" type="number" value="${item.honorarios || 0}"></label>
      <label>Dirección<input name="direccion" value="${esc(item.direccion || "")}"></label>
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

  document.getElementById("emitir-factura")?.addEventListener("click", () => {
    emitirFactura(item, document.getElementById("arca-tipo").value, document.getElementById("arca-cuit").value);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prev = item.etapa;
    item.etapa = String(data.get("etapa") || item.etapa);
    item.honorarios = Number(data.get("honorarios") || 0);
    item.direccion = String(data.get("direccion") || "");
    if (prev !== item.etapa) {
      item.history = [{ when: "hoy", text: `Etapa: ${etapaLabel(item.etapa)}.` }, ...(item.history || [])];
    }
    saveObras(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta obra?")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    saveObras(items);
    showToast("Obra eliminada");
    render();
  });
}

function emitirFactura(item, tipo, cuit) {
  const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);
  const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  item.factura = { tipo, numero, cae, vto, total: item.honorarios, cuit };
  item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
  saveObras(items);
}

function renderClientes() {
  const clientes = clientesDeObras(items);
  document.getElementById("clientesGrid").innerHTML = clientes.map((c) => `
    <article class="cliente-card">
      <h3>${esc(c.nombre)}</h3>
      <p>${esc(c.tel) || "Sin teléfono"}</p>
      <p>${esc(c.mail) || ""}</p>
      <p style="margin-top:10px;font-size:13px;color:var(--muted)">${c.obras.map((o) => esc(o.codigo) + " · " + esc(etapaLabel(o.etapa))).join("<br>")}</p>
    </article>
  `).join("") || "<p>No hay clientes.</p>";
}

function renderArca() {
  const facturados = items.filter((i) => i.factura);
  const pendientes = items.filter((i) => !i.factura && i.honorarios > 0);
  let visibleArca = items;
  if (filterArca === "facturado") visibleArca = facturados;
  else if (filterArca === "pendiente") visibleArca = pendientes;

  document.getElementById("arca-stats").innerHTML = `
    <button type="button" data-afiltro="todos" class="${filterArca === "todos" ? "on" : ""}"><strong>${items.length}</strong>obras</button>
    <button type="button" data-afiltro="pendiente" class="${filterArca === "pendiente" ? "on" : ""}"><strong>${pendientes.length}</strong>sin factura</button>
    <button type="button" data-afiltro="facturado" class="${filterArca === "facturado" ? "on" : ""}"><strong>${facturados.length}</strong>facturados</button>
  `;
  document.querySelectorAll("[data-afiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterArca = btn.dataset.afiltro; renderArca(); });
  });

  if (!visibleArca.find((i) => i.id === selectedArca) && visibleArca[0]) selectedArca = visibleArca[0].id;

  document.getElementById("arca-rows").innerHTML = visibleArca.map((item) => `
    <tr class="row ${item.id === selectedArca ? "on" : ""}" data-id="${esc(item.id)}">
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.cliente.nombre)}</td>
      <td class="amount">${item.honorarios ? esc(money(item.honorarios)) : "—"}</td>
      <td>${item.factura ? esc(item.factura.numero) : "Pendiente"}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay obras.</td></tr>`;

  document.querySelectorAll("#arca-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedArca = row.dataset.id; renderArca(); });
  });

  const item = items.find((i) => i.id === selectedArca);
  const detail = document.getElementById("arca-detail");
  if (!item) { detail.innerHTML = "<p>Elegí una obra.</p>"; return; }

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.codigo)}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <div class="meta">
      <div><span>Obra</span>${esc(item.titulo)}</div>
      <div><span>Honorarios</span>${esc(money(item.honorarios))}</div>
    </div>
    ${item.factura ? `
      <div class="factura-box">
        <h4>Factura emitida</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (AFIP)</h4>
        <label>CUIT cliente<input id="arca-cuit-tab" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo-tab">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura-tab" style="margin-top:10px;" ${!item.honorarios ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
      </div>
    `}
  `;
  document.getElementById("emitir-factura-tab")?.addEventListener("click", () => {
    emitirFactura(item, document.getElementById("arca-tipo-tab").value, document.getElementById("arca-cuit-tab").value);
    showToast("Factura emitida");
    renderArca();
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
