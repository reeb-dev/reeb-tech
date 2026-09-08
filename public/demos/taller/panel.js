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
    orden: `OT-2024-${String(count + 92).padStart(4, "0")}`,
    vehiculo: {
      marca: String(data.get("marca") || ""),
      modelo: String(data.get("modelo") || ""),
      año: Number(data.get("año") || new Date().getFullYear()),
      patente: String(data.get("patente") || "").toUpperCase(),
      km: Number(data.get("km") || 0)
    },
    cliente: {
      nombre: String(data.get("cliente") || ""),
      tel: String(data.get("tel") || ""),
      email: ""
    },
    tipo: String(data.get("tipo") || "service"),
    descripcion: String(data.get("descripcion") || ""),
    diagnostico: "Pendiente de diagnóstico",
    presupuesto: 0,
    aprobado: false,
    repuestos: [],
    manoObra: 0,
    status: "ingresado",
    factura: null,
    fechaIngreso: "hoy",
    fechaEstimada: "Pendiente",
    history: [{ when: "hoy", text: "Vehículo ingresado al taller." }]
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
    ingresado: items.filter((i) => i.status === "ingresado").length,
    diagnostico: items.filter((i) => i.status === "diagnostico").length,
    esperando: items.filter((i) => i.status === "esperando").length,
    reparacion: items.filter((i) => i.status === "reparacion").length,
    listo: items.filter((i) => i.status === "listo").length,
    entregado: items.filter((i) => i.status === "entregado").length
  };

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>total</button>
    <button type="button" data-filter="ingresado" class="${filter === "ingresado" ? "on" : ""}"><strong>${counts.ingresado}</strong>ingresados</button>
    <button type="button" data-filter="reparacion" class="${filter === "reparacion" ? "on" : ""}"><strong>${counts.reparacion}</strong>en rep.</button>
    <button type="button" data-filter="esperando" class="${filter === "esperando" ? "on" : ""}"><strong>${counts.esperando}</strong>esperando</button>
    <button type="button" data-filter="listo" class="${filter === "listo" ? "on" : ""}"><strong>${counts.listo}</strong>listos</button>
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
      <td>${esc(item.orden)}</td>
      <td>${esc(item.vehiculo.marca)} ${esc(item.vehiculo.modelo)}<br><small style="color:#666">${esc(item.vehiculo.patente)}</small></td>
      <td>${esc(item.cliente.nombre)}</td>
      <td>${esc(tipoLabel(item.tipo))}</td>
      <td class="amount">${calcTotal(item) > 0 ? esc(money(calcTotal(item))) : "—"}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6">No hay órdenes en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una orden del listado.</p>";
    return;
  }

  const total = calcTotal(item);

  detail.innerHTML = `
    <p class="eyebrow">${esc(item.orden)} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.vehiculo.marca)} ${esc(item.vehiculo.modelo)} ${item.vehiculo.año}</h2>
    <p style="font-family:monospace;color:var(--muted);">${esc(item.vehiculo.patente)} · ${item.vehiculo.km.toLocaleString()} km</p>
    
    <div class="meta">
      <div><span>Cliente</span>${esc(item.cliente.nombre)}</div>
      <div><span>Teléfono</span>${esc(item.cliente.tel) || "—"}</div>
      <div><span>Ingreso</span>${esc(item.fechaIngreso)}</div>
      <div><span>Estimado</span>${esc(item.fechaEstimada)}</div>
    </div>

    <label>Descripción</label>
    <p style="font-size:14px;margin:4px 0;">${esc(item.descripcion) || "Sin descripción"}</p>

    <label>Diagnóstico</label>
    <p style="font-size:14px;margin:4px 0;">${esc(item.diagnostico)}</p>

    ${item.repuestos.length > 0 ? `
      <label>Repuestos</label>
      <ul class="repuestos-list">
        ${item.repuestos.map((r) => `<li><span>${esc(r.nombre)} x${r.cantidad}</span><span>${esc(money(r.precio * r.cantidad))}</span></li>`).join("")}
      </ul>
    ` : ""}

    <div class="meta">
      <div><span>Mano de obra</span>${esc(money(item.manoObra))}</div>
      <div><span>Total</span><strong>${esc(money(total))}</strong></div>
      <div><span>Aprobado</span>${item.aprobado ? "✓ Sí" : "✗ Pendiente"}</div>
      <div><span>Estado</span>${esc(label(item.status))}</div>
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
        <h4>🧾 Facturación ARCA (AFIP)</h4>
        <label>CUIT Cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.filter(c => c.id !== "PR").map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
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
      <label>Diagnóstico<textarea name="diagnostico">${esc(item.diagnostico)}</textarea></label>
      <label>Mano de obra<input name="manoObra" type="number" value="${item.manoObra}"></label>
      <label>Fecha estimada<input name="fechaEstimada" value="${esc(item.fechaEstimada)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="aprobar" ${item.aprobado ? "disabled" : ""}>Marcar aprobado</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>

    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  // Emitir factura simulada ARCA
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
      save(items);
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    item.diagnostico = String(data.get("diagnostico") || "");
    item.manoObra = Number(data.get("manoObra") || 0);
    item.fechaEstimada = String(data.get("fechaEstimada") || "");
    item.status = newStatus;

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado: ${label(newStatus)}.` }, ...(item.history || [])];
    }

    save(items);
    render();
  });

  detail.querySelector("#aprobar")?.addEventListener("click", () => {
    item.aprobado = true;
    item.history = [{ when: "hoy", text: "Presupuesto aprobado por el cliente." }, ...(item.history || [])];
    save(items);
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    render();
  });
}

render();
