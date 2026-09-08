let items = loadPedidos();
let trabajos = loadTrabajos();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let editingTrabajo = "";

const viewPedidos = document.getElementById("view-pedidos");
const viewTrabajos = document.getElementById("view-trabajos");
const tabPedidos = document.getElementById("tab-pedidos");
const tabTrabajos = document.getElementById("tab-trabajos");
const openCreate = document.getElementById("open-create");

tabPedidos.addEventListener("click", () => showView("pedidos"));
tabTrabajos.addEventListener("click", () => showView("trabajos"));

function showView(name) {
  const pedidos = name === "pedidos";
  viewPedidos.classList.toggle("panel-hidden", !pedidos);
  viewTrabajos.classList.toggle("panel-hidden", pedidos);
  tabPedidos.classList.toggle("on", pedidos);
  tabTrabajos.classList.toggle("on", !pedidos);
  openCreate.classList.toggle("panel-hidden", !pedidos);
  if (!pedidos) renderTrabajos();
}

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "otro");
  const count = items.length + 1;
  const item = {
    id: crypto.randomUUID(),
    pedido: `PED-2026-${String(count + 45).padStart(3, "0")}`,
    cliente: {
      nombre: String(data.get("cliente") || ""),
      tel: String(data.get("tel") || ""),
      direccion: String(data.get("direccion") || "")
    },
    tipo,
    descripcion: String(data.get("descripcion") || ""),
    medidas: String(data.get("medidas") || ""),
    materiales: [],
    manoObra: 0,
    seña: 0,
    status: "consulta",
    fechaPedido: "hoy",
    fechaEntrega: "Pendiente",
    imagen: imagenDeTipo(tipo),
    factura: null,
    history: [{ when: "hoy", text: "Pedido creado como consulta." }]
  };
  items = [item, ...items];
  selected = item.id;
  savePedidos(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Pedido creado");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.cliente.nombre.toLowerCase().includes(term) ||
      item.pedido.toLowerCase().includes(term) ||
      (item.descripcion || "").toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  const counts = {
    consulta: items.filter((i) => i.status === "consulta").length,
    en_taller: items.filter((i) => i.status === "en_taller").length,
    listo: items.filter((i) => i.status === "listo").length,
    entregado: items.filter((i) => i.status === "entregado").length
  };

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>pedidos</button>
    <button type="button" data-filter="consulta" class="${filter === "consulta" ? "on" : ""}"><strong>${counts.consulta}</strong>consultas</button>
    <button type="button" data-filter="en_taller" class="${filter === "en_taller" ? "on" : ""}"><strong>${counts.en_taller}</strong>en taller</button>
    <button type="button" data-filter="listo" class="${filter === "listo" ? "on" : ""}"><strong>${counts.listo}</strong>listos</button>
    <button type="button" data-filter="entregado" class="${filter === "entregado" ? "on" : ""}"><strong>${counts.entregado}</strong>entregados</button>
    <input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:4px;width:180px;">
  `;

  document.getElementById("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(item.imagen || imagenDeTipo(item.tipo))}" alt="">
          <span>${esc(item.pedido)}</span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(tipoLabel(item.tipo))}<br><small style="color:#666">${esc(item.medidas)}</small></td>
      <td>${esc(item.fechaEntrega)}</td>
      <td class="amount">${calcTotal(item) > 0 ? esc(money(calcTotal(item))) : "—"}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay pedidos en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un pedido del listado.</p>";
    return;
  }

  const total = calcTotal(item);
  const saldo = total - (item.seña || 0);

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.pedido)} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.tel) || "Sin teléfono"} · ${esc(item.cliente.direccion) || "Sin dirección"}</p>
    <img class="detail-photo" src="${esc(item.imagen || imagenDeTipo(item.tipo))}" alt="${esc(tipoLabel(item.tipo))}">

    <div class="meta">
      <div><span>Medidas</span>${esc(item.medidas) || "—"}</div>
      <div><span>Fecha pedido</span>${esc(item.fechaPedido)}</div>
      <div><span>Entrega estimada</span>${esc(item.fechaEntrega)}</div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>

    <label>Descripción</label>
    <p style="font-size:14px;margin:4px 0;background:#f9fafb;padding:8px;border-radius:4px;">${esc(item.descripcion) || "Sin descripción"}</p>

    ${item.materiales.length > 0 ? `
      <label>Materiales</label>
      <ul class="materiales-list">
        ${item.materiales.map((m) => `<li><span>${esc(matLabel(m.id))} x${m.cantidad}</span><span>${esc(money(m.precio * m.cantidad))}</span></li>`).join("")}
      </ul>
    ` : `<p style="color:#999;font-size:13px;margin-top:12px;">Sin materiales cargados</p>`}

    <div class="meta" style="margin-top:16px;">
      <div><span>Materiales</span>${esc(money(calcMateriales(item)))}</div>
      <div><span>Mano de obra</span>${esc(money(item.manoObra))}</div>
      <div><span>Total</span><strong>${esc(money(total))}</strong></div>
      <div><span>Seña</span>${esc(money(item.seña))}</div>
      <div><span>Saldo</span><strong style="color:${saldo > 0 ? "var(--marron)" : "#666"}">${esc(money(saldo))}</strong></div>
    </div>

    ${item.factura ? `
      <div class="factura-box">
        <h4>✓ Factura emitida</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Facturación ARCA (AFIP)</h4>
        <label>CUIT Cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.filter((c) => c.id !== "PR").map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}

    <form id="edit">
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Mano de obra<input name="manoObra" type="number" value="${item.manoObra}"></label>
      <label>Seña recibida<input name="seña" type="number" value="${item.seña}"></label>
      <label>Fecha entrega<input name="fechaEntrega" value="${esc(item.fechaEntrega)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Eliminar pedido</button>
      </div>
    </form>

    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  const emitirBtn = detail.querySelector("#emitir-factura");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#arca-tipo").value;
      const cuit = detail.querySelector("#arca-cuit").value;
      const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
      const cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

      item.factura = { tipo, numero, cae, vto, total: calcTotal(item), cuit };
      item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
      savePedidos(items);
      showToast("Factura emitida");
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    item.manoObra = Number(data.get("manoObra") || 0);
    item.seña = Number(data.get("seña") || 0);
    item.fechaEntrega = String(data.get("fechaEntrega") || "");
    item.status = newStatus;

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado: ${label(newStatus)}.` }, ...(item.history || [])];
    }

    savePedidos(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este pedido? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    savePedidos(items);
    showToast("Pedido eliminado");
    render();
  });
}

document.getElementById("open-trabajo").addEventListener("click", () => {
  editingTrabajo = "";
  document.getElementById("create-trabajo").classList.toggle("open");
  document.getElementById("create-trabajo").reset();
});

document.getElementById("create-trabajo").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "otro");
  const payload = {
    titulo: String(data.get("titulo") || "").trim(),
    tipo,
    descripcion: String(data.get("descripcion") || "").trim(),
    materiales: String(data.get("materiales") || "").trim(),
    plazo: String(data.get("plazo") || "").trim(),
    precio: Number(data.get("precio") || 0),
    medidas: String(data.get("medidas") || "").trim(),
    imagen: imagenDeTipo(tipo),
    publicado: true
  };

  if (editingTrabajo) {
    trabajos = trabajos.map((t) => t.id === editingTrabajo ? { ...t, ...payload } : t);
    showToast("Trabajo actualizado");
  } else {
    trabajos = [{ id: crypto.randomUUID(), ...payload }, ...trabajos];
    showToast("Trabajo publicado");
  }
  editingTrabajo = "";
  saveTrabajos(trabajos);
  event.target.reset();
  event.target.classList.remove("open");
  renderTrabajos();
});

function renderTrabajos() {
  document.getElementById("trabajosGrid").innerHTML = trabajos.map((t) => `
    <article class="trabajo-admin">
      <img src="${esc(t.imagen)}" alt="${esc(t.titulo)}">
      <div>
        <h3>${esc(t.titulo)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(tipoLabel(t.tipo))} · ${esc(money(t.precio))}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit="${esc(t.id)}">Editar</button>
          <button class="ghost" type="button" data-del="${esc(t.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("") || "<p style='padding:0 24px'>No hay trabajos en el portfolio.</p>";

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = trabajos.find((x) => x.id === btn.dataset.edit);
      if (!t) return;
      editingTrabajo = t.id;
      const form = document.getElementById("create-trabajo");
      form.classList.add("open");
      form.titulo.value = t.titulo;
      form.tipo.value = t.tipo;
      form.precio.value = t.precio;
      form.plazo.value = t.plazo;
      form.medidas.value = t.medidas || "";
      form.materiales.value = t.materiales || "";
      form.descripcion.value = t.descripcion || "";
    });
  });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar este trabajo del portfolio?")) return;
      trabajos = trabajos.filter((t) => t.id !== btn.dataset.del);
      saveTrabajos(trabajos);
      showToast("Trabajo quitado");
      renderTrabajos();
    });
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
