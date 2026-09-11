let items = loadTurnos();
let servicios = loadServicios();
let clientes = loadClientes();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let editingServicio = "";
let editingCliente = "";

const viewAgenda = document.getElementById("view-agenda");
const viewClientes = document.getElementById("view-clientes");
const viewServicios = document.getElementById("view-servicios");
const tabAgenda = document.getElementById("tab-agenda");
const tabClientes = document.getElementById("tab-clientes");
const tabServicios = document.getElementById("tab-servicios");
const openCreate = document.getElementById("open-create");

function showView(name) {
  viewAgenda.classList.toggle("panel-hidden", name !== "agenda");
  viewClientes.classList.toggle("panel-hidden", name !== "clientes");
  viewServicios.classList.toggle("panel-hidden", name !== "servicios");
  tabAgenda.classList.toggle("on", name === "agenda");
  tabClientes.classList.toggle("on", name === "clientes");
  tabServicios.classList.toggle("on", name === "servicios");
  openCreate.classList.toggle("panel-hidden", name !== "agenda");
  if (name === "clientes") renderClientes();
  if (name === "servicios") renderServiciosAdmin();
}

tabAgenda.addEventListener("click", () => showView("agenda"));
tabClientes.addEventListener("click", () => showView("clientes"));
tabServicios.addEventListener("click", () => showView("servicios"));

const createServicioSelect = document.querySelector("#create [name='servicio']");
createServicioSelect.innerHTML = `<option value="">Sin servicio aún</option>` +
  servicios.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join("");

openCreate.addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const count = items.length + 1;
  const srv = String(data.get("servicio") || "");
  const item = {
    id: crypto.randomUUID(),
    turno: `T-${String(count + 8).padStart(3, "0")}`,
    fecha: String(data.get("fecha") || ""),
    hora: String(data.get("hora") || ""),
    cliente: {
      nombre: String(data.get("cliente") || ""),
      tel: String(data.get("tel") || ""),
      email: ""
    },
    servicios: srv ? [srv] : [],
    profesional: String(data.get("profesional") || "Lucía"),
    notas: String(data.get("notas") || ""),
    status: "reservado",
    origen: "salon",
    factura: null,
    history: [{ when: "hoy", text: "Turno reservado." }]
  };
  items = [item, ...items];
  selected = item.id;
  saveTurnos(items);
  upsertCliente(item.cliente.nombre, item.cliente.tel, item.profesional, item.notas);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Turno creado");
  render();
});

function upsertCliente(nombre, tel, profesional, notas) {
  const existing = clientes.find((c) =>
    c.nombre.toLowerCase() === String(nombre).toLowerCase() && c.tel === tel
  );
  if (existing) {
    existing.profesional = profesional || existing.profesional;
    if (notas) existing.notas = notas;
  } else {
    clientes = [{
      id: crypto.randomUUID(),
      nombre,
      tel,
      email: "",
      profesional: profesional || "Lucía",
      notas: notas || ""
    }, ...clientes];
  }
  saveClientes(clientes);
}

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) =>
      item.cliente.nombre.toLowerCase().includes(term) ||
      item.turno.toLowerCase().includes(term) ||
      item.profesional.toLowerCase().includes(term)
    );
  }
  return result;
}

function render() {
  const counts = {
    reservado: items.filter((i) => i.status === "reservado").length,
    en_atencion: items.filter((i) => i.status === "en_atencion").length,
    terminado: items.filter((i) => i.status === "terminado").length
  };

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>turnos</button>
    <button type="button" data-filter="reservado" class="${filter === "reservado" ? "on" : ""}"><strong>${counts.reservado}</strong>reservados</button>
    <button type="button" data-filter="en_atencion" class="${filter === "en_atencion" ? "on" : ""}"><strong>${counts.en_atencion}</strong>en atención</button>
    <button type="button" data-filter="terminado" class="${filter === "terminado" ? "on" : ""}"><strong>${counts.terminado}</strong>terminados</button>
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
          <img class="thumb" src="${esc(imagenDeTurno(item))}" alt="">
          <span><strong>${esc(item.hora)}</strong><br><small style="color:#999">${esc(item.fecha)}</small></span>
        </div>
      </td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${item.servicios.length > 0 ? item.servicios.map((s) => esc(servicioLabel(s))).join(", ") : "<em style='color:#999'>Sin servicios</em>"}</td>
      <td>${esc(item.profesional)}</td>
      <td class="amount">${calcTotal(item, servicios) > 0 ? esc(money(calcTotal(item, servicios))) : "—"}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay turnos en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí un turno del listado.</p>";
    return;
  }

  const total = calcTotal(item, servicios);
  const duracion = calcDuracion(item, servicios);

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.turno)} · ${esc(item.fecha)} ${esc(item.hora)}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.tel) || "Sin teléfono"}</p>
    <img class="detail-photo" src="${esc(imagenDeTurno(item))}" alt="">

    <div class="meta">
      <div><span>Profesional</span>${esc(item.profesional)}</div>
      <div><span>Duración</span>${duracion} min</div>
      <div><span>Total</span><strong>${esc(money(total))}</strong></div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>

    ${item.notas ? `<p style="font-size:13px;background:#fff1f2;padding:8px;border-radius:6px;">${esc(item.notas)}</p>` : ""}

    <label>Servicios</label>
    ${item.servicios.length > 0 ? `
      <ul class="servicios-list">
        ${item.servicios.map((s) => {
          const srv = getServicio(s, servicios);
          return `<li><span>${esc(srv?.label || s)} (${srv?.duracion || 0} min)</span><span>${esc(money(srv?.precio || 0))}</span></li>`;
        }).join("")}
      </ul>
    ` : `<p style="color:#999;font-size:13px;">Sin servicios agregados</p>`}

    <label>Agregar servicio</label>
    <select id="add-servicio">
      <option value="">— Seleccionar —</option>
      ${servicios.map((s) => `<option value="${s.id}">${esc(s.label)} (${s.duracion} min) - ${esc(money(s.precio))}</option>`).join("")}
    </select>
    <button class="ghost" type="button" id="agregar-srv" style="margin-top:6px;">+ Agregar</button>

    ${item.factura ? `
      <div class="factura-box">
        <h4>✓ Comprobante emitido</h4>
        <p><strong>${esc(compLabel(item.factura.tipo))}</strong> ${esc(item.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(item.factura.cae)}</span></p>
        <p>Vto CAE: ${esc(item.factura.vto)} · Total: ${esc(money(item.factura.total))}</p>
      </div>
    ` : `
      <div class="arca-section">
        <h4>Cobro y Facturación ARCA</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Cobrar y emitir (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Ejemplo: genera CAE simulado. En un sistema real se conecta a ARCA/AFIP.</p>
      </div>
    `}

    <form id="edit">
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Profesional
        <select name="profesional">
          <option value="Lucía" ${item.profesional === "Lucía" ? "selected" : ""}>Lucía</option>
          <option value="Diego" ${item.profesional === "Diego" ? "selected" : ""}>Diego</option>
          <option value="Yamila" ${item.profesional === "Yamila" ? "selected" : ""}>Yamila</option>
        </select>
      </label>
      <label>Notas<textarea name="notas">${esc(item.notas)}</textarea></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Cancelar turno</button>
      </div>
    </form>

    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  detail.querySelector("#agregar-srv").addEventListener("click", () => {
    const srv = detail.querySelector("#add-servicio").value;
    if (srv && !item.servicios.includes(srv)) {
      item.servicios.push(srv);
      item.history = [{ when: "hoy", text: `Servicio agregado: ${servicioLabel(srv)}` }, ...(item.history || [])];
      saveTurnos(items);
      render();
    }
  });

  const emitirBtn = detail.querySelector("#emitir-factura");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#arca-tipo").value;
      const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
      const cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

      item.factura = { tipo, numero, cae, vto, total: calcTotal(item, servicios) };
      item.status = "terminado";
      item.history = [{ when: "hoy", text: `Cobrado. ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
      saveTurnos(items);
      showToast("Factura emitida");
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    item.profesional = String(data.get("profesional") || item.profesional);
    item.notas = String(data.get("notas") || "");
    item.status = newStatus;

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado: ${label(newStatus)}.` }, ...(item.history || [])];
    }

    saveTurnos(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Cancelar este turno? Esta acción no se puede deshacer.")) return;
    item.status = "cancelado";
    item.history = [{ when: "hoy", text: "Turno cancelado." }, ...(item.history || [])];
    saveTurnos(items);
    showToast("Turno cancelado");
    render();
  });
}

document.getElementById("open-cliente").addEventListener("click", () => {
  editingCliente = "";
  document.getElementById("create-cliente").classList.toggle("open");
  document.getElementById("create-cliente").reset();
});

document.getElementById("create-cliente").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    tel: String(data.get("tel") || "").trim(),
    email: String(data.get("email") || "").trim(),
    profesional: String(data.get("profesional") || "Lucía"),
    notas: String(data.get("notas") || "").trim()
  };
  if (editingCliente) {
    clientes = clientes.map((c) => c.id === editingCliente ? { ...c, ...payload } : c);
    showToast("Cliente actualizado");
  } else {
    clientes = [{ id: crypto.randomUUID(), ...payload }, ...clientes];
    showToast("Cliente guardado");
  }
  editingCliente = "";
  saveClientes(clientes);
  event.target.reset();
  event.target.classList.remove("open");
  renderClientes();
});

function renderClientes() {
  document.getElementById("clientesGrid").innerHTML = clientes.map((c) => {
    const turnos = items.filter((i) => i.cliente.nombre === c.nombre);
    const foto = fotoProfesional(c.profesional);
    return `
    <article class="trabajo-admin">
      <img src="${esc(foto)}" alt="${esc(c.profesional)}">
      <div>
        <h3>${esc(c.nombre)}</h3>
        <p style="margin:0 0 4px;font-size:13px;color:var(--muted)">${esc(c.tel) || "Sin teléfono"}</p>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(c.profesional)} · ${turnos.length} turno${turnos.length === 1 ? "" : "s"}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit-cli="${esc(c.id)}">Editar</button>
          <button class="ghost" type="button" data-del-cli="${esc(c.id)}">Quitar</button>
        </div>
      </div>
    </article>`;
  }).join("") || "<p style='padding:0 24px'>No hay clientes.</p>";

  document.querySelectorAll("[data-edit-cli]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = clientes.find((x) => x.id === btn.dataset.editCli);
      if (!c) return;
      editingCliente = c.id;
      const form = document.getElementById("create-cliente");
      form.classList.add("open");
      form.nombre.value = c.nombre;
      form.tel.value = c.tel || "";
      form.email.value = c.email || "";
      form.profesional.value = c.profesional;
      form.notas.value = c.notas || "";
    });
  });

  document.querySelectorAll("[data-del-cli]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar este cliente?")) return;
      clientes = clientes.filter((c) => c.id !== btn.dataset.delCli);
      saveClientes(clientes);
      showToast("Cliente quitado");
      renderClientes();
    });
  });
}

document.getElementById("open-servicio").addEventListener("click", () => {
  editingServicio = "";
  document.getElementById("create-servicio").classList.toggle("open");
  document.getElementById("create-servicio").reset();
});

document.getElementById("create-servicio").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    label: String(data.get("label") || "").trim(),
    categoria: String(data.get("categoria") || "cabello"),
    descripcion: String(data.get("descripcion") || "").trim(),
    precio: Number(data.get("precio") || 0),
    duracion: Number(data.get("duracion") || 30),
    profesional: String(data.get("profesional") || "Lucía"),
    imagen: String(data.get("imagen") || "img/hero-salon.jpg"),
    publicado: true
  };

  if (editingServicio) {
    servicios = servicios.map((s) => s.id === editingServicio ? { ...s, ...payload } : s);
    showToast("Servicio actualizado");
  } else {
    servicios = [{ id: crypto.randomUUID(), ...payload }, ...servicios];
    showToast("Servicio publicado");
  }
  editingServicio = "";
  saveServicios(servicios);
  event.target.reset();
  event.target.classList.remove("open");
  renderServiciosAdmin();
});

function renderServiciosAdmin() {
  document.getElementById("serviciosGrid").innerHTML = servicios.map((s) => `
    <article class="trabajo-admin">
      <img src="${esc(s.imagen)}" alt="${esc(s.label)}">
      <div>
        <h3>${esc(s.label)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(catLabel(s.categoria))} · ${s.duracion} min · ${esc(money(s.precio))}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit="${esc(s.id)}">Editar</button>
          <button class="ghost" type="button" data-del="${esc(s.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("") || "<p style='padding:0 24px'>No hay servicios.</p>";

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = servicios.find((x) => x.id === btn.dataset.edit);
      if (!s) return;
      editingServicio = s.id;
      const form = document.getElementById("create-servicio");
      form.classList.add("open");
      form.label.value = s.label;
      form.categoria.value = s.categoria;
      form.precio.value = s.precio;
      form.duracion.value = s.duracion;
      form.profesional.value = s.profesional;
      form.imagen.value = s.imagen;
      form.descripcion.value = s.descripcion || "";
    });
  });

  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar este servicio de la carta?")) return;
      servicios = servicios.filter((s) => s.id !== btn.dataset.del);
      saveServicios(servicios);
      showToast("Servicio quitado");
      renderServiciosAdmin();
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
