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
    codigo: String(data.get("codigo") || ""),
    marca: String(data.get("marca") || ""),
    modelo: String(data.get("modelo") || ""),
    version: String(data.get("version") || ""),
    ano: Number(data.get("ano") || new Date().getFullYear()),
    tipo: String(data.get("tipo") || "usado"),
    precioUSD: Number(data.get("precioUSD") || 0),
    km: Number(data.get("km") || 0),
    combustible: String(data.get("combustible") || "nafta"),
    transmision: String(data.get("transmision") || "manual"),
    color: String(data.get("color") || ""),
    patente: String(data.get("patente") || "") || null,
    puertas: 4,
    motor: "",
    descripcion: "",
    imagenes: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop"],
    financiacion: true,
    permuta: true,
    destacado: false,
    status: "disponible",
    vistas: 0,
    consultas: 0,
    diasPublicado: 0,
    cliente: null,
    history: [{ when: "hoy", text: "Vehículo ingresado al stock." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Vehículo agregado al stock");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.marca.toLowerCase().includes(term) || 
      item.modelo.toLowerCase().includes(term) ||
      item.codigo.toLowerCase().includes(term) ||
      (item.patente && item.patente.toLowerCase().includes(term))
    );
  }
  return result;
}

function render() {
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const reservados = items.filter((i) => i.status === "reservado").length;
  const vendidos = items.filter((i) => i.status === "vendido").length;
  
  // Calcular valor total del stock
  const valorStock = items
    .filter((i) => i.status === "disponible" || i.status === "reservado")
    .reduce((sum, i) => sum + i.precioUSD, 0);

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>total</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="reservado" class="${filter === "reservado" ? "on" : ""}"><strong>${reservados}</strong>reservados</button>
    <button type="button" data-filter="vendido" class="${filter === "vendido" ? "on" : ""}"><strong>${vendidos}</strong>vendidos</button>
    <div style="cursor:default;"><strong>${formatPrecioUSD(valorStock)}</strong>valor stock</div>
    <input type="text" id="search" placeholder="🔍 Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:10px 14px;border:1px solid var(--line);border-radius:8px;width:200px;">
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
      <td>${esc(item.codigo)}</td>
      <td><strong>${esc(item.marca)} ${esc(item.modelo)}</strong><br><small style="color:#64748b">${esc(item.version)}</small></td>
      <td>${esc(tipoLabel(item.tipo))}</td>
      <td>${item.ano}</td>
      <td class="amount">${esc(formatPrecioUSD(item.precioUSD))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;padding:40px;color:#64748b;">No hay vehículos en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p style='color:#64748b;padding:20px;'>Seleccioná un vehículo del listado.</p>";
    return;
  }

  detail.innerHTML = `
    <p class="eyebrow">${esc(tipoLabel(item.tipo))} · ${item.ano}</p>
    <h2>${esc(item.marca)} ${esc(item.modelo)}</h2>
    <p style="color:var(--muted);margin-bottom:16px;">${esc(item.version)}</p>
    <div class="meta">
      <div><span>Precio USD</span><strong>${esc(formatPrecioUSD(item.precioUSD))}</strong></div>
      <div><span>Precio AR$</span>${esc(formatPrecioARS(item.precioUSD))}</div>
      <div><span>Kilómetros</span>${esc(formatKm(item.km))}</div>
      <div><span>Combustible</span>${esc(combustibleLabel(item.combustible))}</div>
      <div><span>Transmisión</span>${esc(transmisionLabel(item.transmision))}</div>
      <div><span>Color</span>${esc(item.color || '—')}</div>
      ${item.patente ? `<div><span>Patente</span>${esc(item.patente)}</div>` : ''}
      ${item.cliente ? `<div><span>Cliente</span>${esc(item.cliente.nombre)}</div>` : ''}
    </div>
    
    ${item.factura ? `
      <div class="factura-box">
        <h4>✅ Venta facturada</h4>
        <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
        <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
        <div><strong>Total:</strong> ${esc(formatPrecioUSD(item.factura.total))}</div>
        <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
        <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
      </div>
    ` : `
      <div class="arca-section">
        <h4>🧾 Facturación ARCA</h4>
        <label>CUIT comprador<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <label>Concepto
          <select id="arca-concepto">
            <option value="venta">Venta de vehículo</option>
            <option value="sena">Seña/Reserva</option>
            <option value="comision">Comisión por venta</option>
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:12px;">
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:10px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}
    
    <form id="edit">
      <label>Código<input name="codigo" value="${esc(item.codigo)}"></label>
      <label>Marca
        <select name="marca">
          ${MARCAS.map((m) => `<option value="${m}" ${item.marca === m ? "selected" : ""}>${esc(m)}</option>`).join("")}
        </select>
      </label>
      <label>Modelo<input name="modelo" value="${esc(item.modelo)}"></label>
      <label>Versión<input name="version" value="${esc(item.version)}"></label>
      <label>Año<input name="ano" type="number" value="${item.ano}"></label>
      <label>Tipo
        <select name="tipo">
          ${TIPOS.map((t) => `<option value="${t.id}" ${item.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio USD<input name="precioUSD" type="number" value="${item.precioUSD}"></label>
      <label>Kilómetros<input name="km" type="number" value="${item.km}"></label>
      <label>Combustible
        <select name="combustible">
          ${COMBUSTIBLES.map((c) => `<option value="${c.id}" ${item.combustible === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Transmisión
        <select name="transmision">
          ${TRANSMISIONES.map((t) => `<option value="${t.id}" ${item.transmision === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Color<input name="color" value="${esc(item.color)}"></label>
      <label>Patente<input name="patente" value="${esc(item.patente || '')}"></label>
      <label>Estado
        <select name="status">
          ${ESTADOS.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label style="grid-column: span 2;">Descripción
        <textarea name="descripcion" rows="3">${esc(item.descripcion)}</textarea>
      </label>
      <div class="actions" style="grid-column: span 2;">
        <button class="btn-panel" type="submit">Guardar cambios</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
    </div>
  `;

  // Emitir factura ARCA
  detail.querySelector("#emitir-factura")?.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const cuit = detail.querySelector("#arca-cuit").value;
    const concepto = detail.querySelector("#arca-concepto").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
    
    let total = item.precioUSD;
    if (concepto === "sena") total = Math.round(item.precioUSD * 0.1);
    if (concepto === "comision") total = Math.round(item.precioUSD * 0.03);

    item.factura = { tipo, numero, cae, vto, total, cuit, concepto };
    item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida por ${formatPrecioUSD(total)}. CAE: ${cae}` }, ...(item.history || [])];
    
    if (concepto === "venta") {
      item.status = "vendido";
      item.history = [{ when: "hoy", text: "Vehículo marcado como vendido." }, ...item.history];
    }
    
    save(items);
    showToast("Factura emitida correctamente");
    render();
  });

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      marca: String(data.get("marca") || ""),
      modelo: String(data.get("modelo") || ""),
      version: String(data.get("version") || ""),
      ano: Number(data.get("ano") || item.ano),
      tipo: String(data.get("tipo") || "usado"),
      precioUSD: Number(data.get("precioUSD") || 0),
      km: Number(data.get("km") || 0),
      combustible: String(data.get("combustible") || "nafta"),
      transmision: String(data.get("transmision") || "manual"),
      color: String(data.get("color") || ""),
      patente: String(data.get("patente") || "") || null,
      descripcion: String(data.get("descripcion") || ""),
      status: newStatus
    });

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado cambiado a: ${label(newStatus)}.` }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Ficha del vehículo actualizada." }, ...(item.history || [])];
    }

    save(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar este vehículo del stock? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Vehículo eliminado del stock");
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
