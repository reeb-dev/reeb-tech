let items = load();
let selected = items[0]?.id || "";
let filter = "todos";

document.getElementById("open-create").addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const count = items.length + 1;
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
    servicios: [],
    profesional: String(data.get("profesional") || "Lucía"),
    notas: String(data.get("notas") || ""),
    status: "reservado",
    factura: null,
    history: [{ when: "hoy", text: "Turno reservado." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  render();
});

function visible() {
  if (filter === "todos") return items;
  return items.filter((item) => item.status === filter);
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
  `;

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visible();
  document.getElementById("rows").innerHTML = rows.map((item) => `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td><strong>${esc(item.hora)}</strong><br><small style="color:#999">${esc(item.fecha)}</small></td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${item.servicios.length > 0 ? item.servicios.map(s => esc(servicioLabel(s))).join(", ") : "<em style='color:#999'>Sin servicios</em>"}</td>
      <td>${esc(item.profesional)}</td>
      <td class="amount">${calcTotal(item) > 0 ? esc(money(calcTotal(item))) : "—"}</td>
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

  const total = calcTotal(item);
  const duracion = calcDuracion(item);

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.turno)} · ${esc(item.fecha)} ${esc(item.hora)}</p>
    <h2>${esc(item.cliente.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(item.cliente.tel) || "Sin teléfono"}</p>
    
    <div class="meta">
      <div><span>Profesional</span>${esc(item.profesional)}</div>
      <div><span>Duración</span>${duracion} min</div>
      <div><span>Total</span><strong>${esc(money(total))}</strong></div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
    </div>

    ${item.notas ? `<p style="font-size:13px;background:#fef3c7;padding:8px;border-radius:6px;">📝 ${esc(item.notas)}</p>` : ""}

    <label>Servicios</label>
    ${item.servicios.length > 0 ? `
      <ul class="servicios-list">
        ${item.servicios.map((s) => {
          const srv = getServicio(s);
          return `<li><span>${esc(srv?.label || s)} (${srv?.duracion || 0} min)</span><span>${esc(money(srv?.precio || 0))}</span></li>`;
        }).join("")}
      </ul>
    ` : `<p style="color:#999;font-size:13px;">Sin servicios agregados</p>`}

    <label>Agregar servicio</label>
    <select id="add-servicio">
      <option value="">— Seleccionar —</option>
      ${SERVICIOS.map((s) => `<option value="${s.id}">${esc(s.label)} (${s.duracion} min) - ${esc(money(s.precio))}</option>`).join("")}
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
        <h4>🧾 Cobro y Facturación ARCA</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Cobrar y emitir (simulado)
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

  // Agregar servicio
  detail.querySelector("#agregar-srv").addEventListener("click", () => {
    const srv = detail.querySelector("#add-servicio").value;
    if (srv && !item.servicios.includes(srv)) {
      item.servicios.push(srv);
      item.history = [{ when: "hoy", text: `Servicio agregado: ${servicioLabel(srv)}` }, ...(item.history || [])];
      save(items);
      render();
    }
  });

  // Emitir factura simulada ARCA
  const emitirBtn = detail.querySelector("#emitir-factura");
  if (emitirBtn) {
    emitirBtn.addEventListener("click", () => {
      const tipo = detail.querySelector("#arca-tipo").value;
      const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
      const cae = String(Math.floor(Math.random() * 99999999999999));
      const vtoDate = new Date();
      vtoDate.setDate(vtoDate.getDate() + 10);
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

      item.factura = { tipo, numero, cae, vto, total: calcTotal(item) };
      item.status = "terminado";
      item.history = [{ when: "hoy", text: `Cobrado. ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
      save(items);
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

    save(items);
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    item.status = "cancelado";
    item.history = [{ when: "hoy", text: "Turno cancelado." }, ...(item.history || [])];
    save(items);
    render();
  });
}

render();
