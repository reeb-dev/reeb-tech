let items = loadObras();
let clientes = loadClientes();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let selectedCliente = clientes[0]?.id || "";
let searchCliente = "";
let selectedDoc = "";
let searchDoc = "";
let filterDoc = "todos";
let selectedArca = items.find((i) => i.factura)?.id || items[0]?.id || "";
let filterArca = "todos";
let searchArca = "";
let searchEtapa = "";

const views = {
  obras: document.getElementById("view-obras"),
  clientes: document.getElementById("view-clientes"),
  etapas: document.getElementById("view-etapas"),
  docs: document.getElementById("view-docs"),
  arca: document.getElementById("view-arca")
};
const tabs = {
  obras: document.getElementById("tab-obras"),
  clientes: document.getElementById("tab-clientes"),
  etapas: document.getElementById("tab-etapas"),
  docs: document.getElementById("tab-docs"),
  arca: document.getElementById("tab-arca")
};
const openCreate = document.getElementById("open-create");
let currentView = "obras";

Object.keys(tabs).forEach((name) => {
  tabs[name].addEventListener("click", () => showView(name));
});

function showView(name) {
  currentView = name;
  Object.keys(views).forEach((key) => {
    views[key].classList.toggle("panel-hidden", key !== name);
    tabs[key].classList.toggle("on", key === name);
  });
  openCreate.classList.toggle("panel-hidden", name === "etapas" || name === "arca");
  openCreate.textContent = name === "clientes" ? "Nuevo cliente" : name === "docs" ? "Nuevo documento" : "Nueva obra";
  if (name === "obras") render();
  if (name === "clientes") renderClientes();
  if (name === "etapas") renderEtapas();
  if (name === "docs") renderDocs();
  if (name === "arca") renderArca();
}

openCreate.addEventListener("click", () => {
  const formId = currentView === "clientes" ? "create-cliente" : currentView === "docs" ? "create-doc" : "create";
  document.getElementById(formId).classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "casa");
  const nombre = String(data.get("cliente") || "").trim();
  const tel = String(data.get("tel") || "");
  let cliente = clientes.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
  if (!cliente) {
    cliente = { id: crypto.randomUUID(), nombre, tel, mail: "", cuit: "", barrio: "" };
    clientes = [cliente, ...clientes];
    saveClientes(clientes);
  }
  const count = items.length + 18;
  const item = {
    id: crypto.randomUUID(),
    codigo: `OB-2026-${String(count).padStart(2, "0")}`,
    titulo: String(data.get("titulo") || tipoLabel(tipo)),
    tipo,
    clienteId: cliente.id,
    cliente: { nombre: cliente.nombre, tel: cliente.tel || tel, mail: cliente.mail },
    etapa: "anteproyecto",
    honorarios: 0,
    direccion: String(data.get("direccion") || ""),
    superficie: String(data.get("superficie") || ""),
    imagen: imagenDeTipo(tipo),
    factura: null,
    documentos: [],
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

document.getElementById("create-cliente").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const cliente = {
    id: crypto.randomUUID(),
    nombre: String(data.get("nombre") || "").trim(),
    tel: String(data.get("tel") || ""),
    mail: String(data.get("mail") || ""),
    cuit: String(data.get("cuit") || ""),
    barrio: String(data.get("barrio") || "")
  };
  clientes = [cliente, ...clientes];
  selectedCliente = cliente.id;
  saveClientes(clientes);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Cliente guardado");
  renderClientes();
});

document.getElementById("create-doc").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const obraId = String(data.get("obraId") || "");
  const obra = items.find((o) => o.id === obraId);
  if (!obra) return;
  const doc = {
    id: crypto.randomUUID(),
    nombre: String(data.get("nombre") || "").trim(),
    tipo: String(data.get("tipo") || "plano"),
    fecha: "hoy"
  };
  obra.documentos = [doc, ...(obra.documentos || [])];
  obra.history = [{ when: "hoy", text: "Documento: " + doc.nombre }, ...(obra.history || [])];
  saveObras(items);
  selectedDoc = doc.id;
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Documento agregado a la lista");
  renderDocs();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.etapa === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.titulo.toLowerCase().includes(term) ||
      item.codigo.toLowerCase().includes(term) ||
      (item.cliente?.nombre || "").toLowerCase().includes(term) ||
      (item.direccion || "").toLowerCase().includes(term)
    );
  }
  return result;
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
    <input type="search" id="search" placeholder="Buscar obra o cliente…" value="${esc(searchTerm)}">
  `;
  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
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
    <div class="doc-list">
      <h4>Planos y documentos</h4>
      ${(item.documentos || []).length
        ? `<ul>${(item.documentos || []).map((d) => `<li>${esc(d.nombre)} <small>${esc(docLabel(d.tipo))} · ${esc(d.fecha)}</small></li>`).join("")}</ul>`
        : "<p>Sin documentos en esta obra.</p>"}
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
        <p style="font-size:11px;color:#6b6b6b;margin-top:8px;">Ejemplo: genera CAE simulado. En un sistema real se conecta a ARCA/AFIP.</p>
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

function obrasDeCliente(clienteId, nombre) {
  return items.filter((o) => o.clienteId === clienteId || (o.cliente?.nombre || "") === nombre);
}

function renderClientes() {
  let list = clientes;
  if (searchCliente) {
    const term = searchCliente.toLowerCase();
    list = list.filter((c) =>
      c.nombre.toLowerCase().includes(term) ||
      (c.tel || "").toLowerCase().includes(term) ||
      (c.barrio || "").toLowerCase().includes(term)
    );
  }
  document.getElementById("clientes-stats").innerHTML = `
    <button type="button" class="on"><strong>${clientes.length}</strong>clientes</button>
    <input type="search" id="search-cliente" placeholder="Buscar cliente…" value="${esc(searchCliente)}">
  `;
  document.getElementById("search-cliente").addEventListener("input", (e) => {
    searchCliente = e.target.value;
    renderClientes();
  });

  if (!list.find((c) => c.id === selectedCliente) && list[0]) selectedCliente = list[0].id;

  document.getElementById("cliente-rows").innerHTML = list.map((c) => `
    <tr class="row ${c.id === selectedCliente ? "on" : ""}" data-id="${esc(c.id)}">
      <td>${esc(c.nombre)}</td>
      <td>${esc(c.tel) || "—"}</td>
      <td>${esc(c.barrio) || "—"}</td>
      <td>${obrasDeCliente(c.id, c.nombre).length}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay clientes.</td></tr>`;

  document.querySelectorAll("#cliente-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedCliente = row.dataset.id; renderClientes(); });
  });

  const c = clientes.find((item) => item.id === selectedCliente);
  const detail = document.getElementById("cliente-detail");
  if (!c) {
    detail.innerHTML = "<p>Elegí un cliente.</p>";
    return;
  }
  const obras = obrasDeCliente(c.id, c.nombre);
  detail.innerHTML = `
    <p class="eyebrow">Cliente</p>
    <h2>${esc(c.nombre)}</h2>
    <form id="edit-cliente">
      <label>Nombre<input name="nombre" value="${esc(c.nombre)}" required></label>
      <label>Teléfono<input name="tel" value="${esc(c.tel || "")}"></label>
      <label>Mail<input name="mail" value="${esc(c.mail || "")}"></label>
      <label>CUIT<input name="cuit" value="${esc(c.cuit || "")}"></label>
      <label>Barrio<input name="barrio" value="${esc(c.barrio || "")}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-cliente">Eliminar</button>
      </div>
    </form>
    <div class="timeline">
      <h3>Obras</h3>
      ${obras.length
        ? obras.map((o) => `<p><time>${esc(o.codigo)}</time>${esc(o.titulo)} · ${esc(etapaLabel(o.etapa))}</p>`).join("")
        : "<p>Sin obras asociadas.</p>"}
    </div>
  `;
  detail.querySelector("#edit-cliente").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevNombre = c.nombre;
    c.nombre = String(data.get("nombre") || "").trim();
    c.tel = String(data.get("tel") || "");
    c.mail = String(data.get("mail") || "");
    c.cuit = String(data.get("cuit") || "");
    c.barrio = String(data.get("barrio") || "");
    saveClientes(clientes);
    items.forEach((o) => {
      if (o.clienteId === c.id || o.cliente?.nombre === prevNombre) {
        o.clienteId = c.id;
        o.cliente = { nombre: c.nombre, tel: c.tel, mail: c.mail };
      }
    });
    saveObras(items);
    showToast("Cliente actualizado");
    renderClientes();
  });
  detail.querySelector("#remove-cliente").addEventListener("click", () => {
    if (!confirm("¿Eliminar este cliente?")) return;
    clientes = clientes.filter((item) => item.id !== c.id);
    selectedCliente = clientes[0]?.id || "";
    saveClientes(clientes);
    showToast("Cliente eliminado");
    renderClientes();
  });
}

function renderEtapas() {
  const counts = ETAPAS.map((e) => ({
    ...e,
    obras: items.filter((i) => i.etapa === e.id)
  }));
  document.getElementById("etapas-stats").innerHTML = `
    <button type="button" class="on"><strong>${items.length}</strong>obras</button>
    ${counts.map((c) => `<button type="button"><strong>${c.obras.length}</strong>${esc(c.label.toLowerCase())}</button>`).join("")}
    <input type="search" id="search-etapa" placeholder="Buscar…" value="${esc(searchEtapa)}">
  `;
  document.getElementById("search-etapa").addEventListener("input", (e) => {
    searchEtapa = e.target.value;
    renderEtapas();
  });

  const term = (searchEtapa || "").toLowerCase();
  document.getElementById("etapasBoard").innerHTML = counts.map((col) => {
    const obras = term
      ? col.obras.filter((o) => o.titulo.toLowerCase().includes(term) || (o.cliente?.nombre || "").toLowerCase().includes(term))
      : col.obras;
    return `
      <section class="etapa-col">
        <h3>${esc(col.label)} <small>${obras.length}</small></h3>
        ${obras.map((o) => `
          <article class="etapa-card" data-id="${esc(o.id)}">
            <img src="${esc(o.imagen)}" alt="">
            <p class="work-tipo">${esc(o.codigo)}</p>
            <h4>${esc(o.titulo)}</h4>
            <p>${esc(o.cliente.nombre)}</p>
            <label>Pasar a
              <select data-move="${esc(o.id)}">
                ${ETAPAS.map((s) => `<option value="${s.id}" ${o.etapa === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
              </select>
            </label>
          </article>
        `).join("") || "<p class='empty-col'>Sin obras</p>"}
      </section>
    `;
  }).join("");

  document.querySelectorAll("[data-move]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const obra = items.find((o) => o.id === sel.dataset.move);
      if (!obra) return;
      const prev = obra.etapa;
      obra.etapa = sel.value;
      if (prev !== obra.etapa) {
        obra.history = [{ when: "hoy", text: `Etapa: ${etapaLabel(obra.etapa)}.` }, ...(obra.history || [])];
        saveObras(items);
        showToast("Etapa actualizada");
        renderEtapas();
      }
    });
  });
}

function renderDocs() {
  const all = documentosDeObras(items);
  let list = filterDoc === "todos" ? all : all.filter((d) => d.tipo === filterDoc);
  if (searchDoc) {
    const term = searchDoc.toLowerCase();
    list = list.filter((d) =>
      d.nombre.toLowerCase().includes(term) ||
      (d.obraTitulo || "").toLowerCase().includes(term) ||
      (d.obraCodigo || "").toLowerCase().includes(term)
    );
  }
  if (!list.find((d) => d.id === selectedDoc) && list[0]) selectedDoc = list[0].id;

  document.getElementById("docs-stats").innerHTML = `
    <button type="button" data-docfiltro="todos" class="${filterDoc === "todos" ? "on" : ""}"><strong>${all.length}</strong>documentos</button>
    ${DOC_TIPOS.map((t) => {
      const n = all.filter((d) => d.tipo === t.id).length;
      return `<button type="button" data-docfiltro="${t.id}" class="${filterDoc === t.id ? "on" : ""}"><strong>${n}</strong>${esc(t.label.toLowerCase())}</button>`;
    }).join("")}
    <input type="search" id="search-doc" placeholder="Buscar plano…" value="${esc(searchDoc)}">
  `;
  document.querySelectorAll("[data-docfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterDoc = btn.dataset.docfiltro; renderDocs(); });
  });
  document.getElementById("search-doc").addEventListener("input", (e) => {
    searchDoc = e.target.value;
    renderDocs();
  });

  const obraSelect = document.querySelector('#create-doc [name="obraId"]');
  obraSelect.innerHTML = items.map((o) =>
    `<option value="${esc(o.id)}">${esc(o.codigo)} · ${esc(o.titulo)}</option>`
  ).join("");
  const tipoSelect = document.querySelector('#create-doc [name="tipo"]');
  tipoSelect.innerHTML = DOC_TIPOS.map((t) =>
    `<option value="${esc(t.id)}">${esc(t.label)}</option>`
  ).join("");

  document.getElementById("doc-rows").innerHTML = list.map((d) => `
    <tr class="row ${d.id === selectedDoc ? "on" : ""}" data-id="${esc(d.id)}">
      <td>${esc(d.nombre)}</td>
      <td>${esc(docLabel(d.tipo))}</td>
      <td>${esc(d.obraCodigo)}<br><small>${esc(d.obraTitulo)}</small></td>
      <td>${esc(d.fecha)}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">No hay documentos.</td></tr>`;

  document.querySelectorAll("#doc-rows .row").forEach((row) => {
    row.addEventListener("click", () => { selectedDoc = row.dataset.id; renderDocs(); });
  });

  const doc = all.find((d) => d.id === selectedDoc);
  const detail = document.getElementById("doc-detail");
  if (!doc) {
    detail.innerHTML = "<p>Elegí un documento de la lista. En este ejemplo no se suben archivos: es un listado de planos.</p>";
    return;
  }
  const obra = items.find((o) => o.id === doc.obraId);
  detail.innerHTML = `
    <p class="eyebrow">${esc(docLabel(doc.tipo))}</p>
    <h2>${esc(doc.nombre)}</h2>
    <div class="meta">
      <div><span>Obra</span>${esc(doc.obraCodigo)} · ${esc(doc.obraTitulo)}</div>
      <div><span>Fecha</span>${esc(doc.fecha)}</div>
    </div>
    <p style="font-size:13px;color:var(--muted)">Lista de ejemplo. En un estudio real acá iría el PDF o el DWG.</p>
    <form id="edit-doc">
      <label>Nombre<input name="nombre" value="${esc(doc.nombre)}" required></label>
      <label>Tipo
        <select name="tipo">
          ${DOC_TIPOS.map((t) => `<option value="${t.id}" ${doc.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-doc">Quitar de la lista</button>
      </div>
    </form>
  `;
  detail.querySelector("#edit-doc").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!obra) return;
    const data = new FormData(event.target);
    const target = (obra.documentos || []).find((d) => d.id === doc.id);
    if (!target) return;
    target.nombre = String(data.get("nombre") || "").trim();
    target.tipo = String(data.get("tipo") || target.tipo);
    saveObras(items);
    showToast("Documento actualizado");
    renderDocs();
  });
  detail.querySelector("#remove-doc").addEventListener("click", () => {
    if (!obra || !confirm("¿Quitar este documento de la lista?")) return;
    obra.documentos = (obra.documentos || []).filter((d) => d.id !== doc.id);
    saveObras(items);
    selectedDoc = "";
    showToast("Documento quitado");
    renderDocs();
  });
}

function renderArca() {
  const facturados = items.filter((i) => i.factura);
  const pendientes = items.filter((i) => !i.factura && i.honorarios > 0);
  let visibleArca = items;
  if (filterArca === "facturado") visibleArca = facturados;
  else if (filterArca === "pendiente") visibleArca = pendientes;
  if (searchArca) {
    const term = searchArca.toLowerCase();
    visibleArca = visibleArca.filter((i) =>
      i.titulo.toLowerCase().includes(term) ||
      i.codigo.toLowerCase().includes(term) ||
      (i.cliente?.nombre || "").toLowerCase().includes(term)
    );
  }

  document.getElementById("arca-stats").innerHTML = `
    <button type="button" data-afiltro="todos" class="${filterArca === "todos" ? "on" : ""}"><strong>${items.length}</strong>obras</button>
    <button type="button" data-afiltro="pendiente" class="${filterArca === "pendiente" ? "on" : ""}"><strong>${pendientes.length}</strong>sin factura</button>
    <button type="button" data-afiltro="facturado" class="${filterArca === "facturado" ? "on" : ""}"><strong>${facturados.length}</strong>facturados</button>
    <input type="search" id="search-arca" placeholder="Buscar…" value="${esc(searchArca)}">
  `;
  document.querySelectorAll("[data-afiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterArca = btn.dataset.afiltro; renderArca(); });
  });
  document.getElementById("search-arca").addEventListener("input", (e) => {
    searchArca = e.target.value;
    renderArca();
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
        <label>CUIT cliente<input id="arca-cuit-tab" placeholder="20-12345678-9" value="${esc(item.cliente?.mail ? "" : "")}"></label>
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
