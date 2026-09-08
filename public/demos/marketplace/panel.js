let items = loadProductos();
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
    mla: `MLA-${Date.now().toString().slice(-10)}`,
    titulo: String(data.get("titulo") || ""),
    categoria: String(data.get("categoria") || "electronica"),
    precio: Number(data.get("precio") || 0),
    cuotas: String(data.get("cuotas") || "Sin cuotas"),
    stock: Number(data.get("stock") || 1),
    vendidos: 0,
    envioGratis: data.get("envioGratis") === "on",
    ubicacion: String(data.get("ubicacion") || "Capital Federal"),
    condicion: String(data.get("condicion") || "nuevo"),
    tipoPub: String(data.get("tipoPub") || "gratuita"),
    descripcion: String(data.get("descripcion") || ""),
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    status: "activo",
    visitas: 0,
    preguntas: 0,
    rating: null,
    factura: null,
    history: [{ when: "hoy", text: "Publicación creada." }]
  };
  items = [item, ...items];
  selected = item.id;
  saveProductos();
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Publicación creada correctamente");
  render();
});

function visible() {
  if (filter === "todos") return items;
  return items.filter((item) => item.status === filter);
}

function render() {
  const counts = {
    activo: items.filter((i) => i.status === "activo").length,
    pausado: items.filter((i) => i.status === "pausado").length,
    agotado: items.filter((i) => i.status === "agotado" || i.stock === 0).length
  };

  const totalVentas = items.reduce((sum, i) => sum + i.vendidos, 0);
  const totalPreguntas = items.reduce((sum, i) => sum + (i.preguntas || 0), 0);

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}">
      <strong>${items.length}</strong>
      <span class="label">Publicaciones</span>
    </button>
    <button type="button" data-filter="activo" class="${filter === "activo" ? "on" : ""}">
      <strong>${counts.activo}</strong>
      <span class="label">Activas</span>
    </button>
    <button type="button" data-filter="pausado" class="${filter === "pausado" ? "on" : ""}">
      <strong>${counts.pausado}</strong>
      <span class="label">Pausadas</span>
    </button>
    <div class="verde">
      <strong>${totalVentas}</strong>
      <span class="label">Vendidos</span>
    </div>
    <div class="naranja">
      <strong>${totalPreguntas}</strong>
      <span class="label">Preguntas</span>
    </div>
  `;

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visible();
  document.getElementById("publist").innerHTML = rows.map((item) => `
    <div class="pub-card ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <header>
        <span class="title">${esc(item.titulo)}</span>
        <span class="tag ${esc(item.status)}">${esc(label(item.status))}</span>
      </header>
      <div class="id">${esc(item.mla)}</div>
      <div class="price">${money(item.precio)}</div>
      <div class="metrics">
        <span><strong>${item.visitas || 0}</strong> visitas</span>
        <span><strong>${item.vendidos}</strong> vendidos</span>
        <span><strong>${item.preguntas || 0}</strong> preguntas</span>
        ${item.rating ? `<span>⭐ ${item.rating}</span>` : ""}
      </div>
    </div>`).join("") || `<p style="padding: 24px; color: var(--muted);">No hay publicaciones en este estado.</p>`;

  document.querySelectorAll(".pub-card").forEach((card) => {
    card.addEventListener("click", () => {
      selected = card.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una publicación del listado.</p>";
    return;
  }

  const total = item.vendidos * item.precio;

  detail.innerHTML = `
    <span class="tag ${esc(item.status)}" style="margin-bottom: 8px;">${esc(label(item.status))}</span>
    <h2>${esc(item.titulo)}</h2>
    <p style="color: var(--muted); font-size: 13px;">${esc(item.mla)} · Publicación ${esc(tipoPubLabel(item.tipoPub))}</p>

    <div class="meta">
      <div>
        <span>Precio</span>
        <strong>${money(item.precio)}</strong>
      </div>
      <div>
        <span>Stock</span>
        <strong>${item.stock} unidades</strong>
      </div>
      <div>
        <span>Visitas (30 días)</span>
        <strong>${item.visitas || 0}</strong>
      </div>
      <div>
        <span>Vendidos</span>
        <strong>${item.vendidos} unidades</strong>
      </div>
    </div>

    ${item.rating ? `
      <div class="ratings-display">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="big">${item.rating}</span>
          <div>
            <div class="stars">★★★★★</div>
            <div class="count">${item.opiniones || 0} opiniones</div>
          </div>
        </div>
      </div>
    ` : ""}

    <div class="mp-section">
      <h4>💳 Mercado Pago</h4>
      <div class="mp-balance">${money(total)}</div>
      <div class="mp-available">Total vendido en esta publicación</div>
    </div>

    ${item.factura ? `
      <div class="factura-box">
        <h4>✅ Última factura emitida</h4>
        <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
        <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
        <div><strong>Total:</strong> ${money(item.factura.total)}</div>
        <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
        <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
      </div>
    ` : `
      <div class="arca-section">
        <h4>🧾 Facturación ARCA</h4>
        <label>CUIT Comprador<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:var(--muted);margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}

    <form id="edit">
      <label>Título
        <input name="titulo" value="${esc(item.titulo)}">
      </label>
      <label>Categoría
        <select name="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.id}" ${item.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio
        <input name="precio" type="number" value="${item.precio}">
      </label>
      <label>Stock
        <input name="stock" type="number" value="${item.stock}">
      </label>
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Ubicación
        <input name="ubicacion" value="${esc(item.ubicacion)}">
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar cambios</button>
        <button class="ghost" type="button" id="remove">Eliminar publicación</button>
      </div>
    </form>

    <div class="timeline">
      <h3 style="font-size: 14px; margin: 0 0 8px;">Historial</h3>
      ${(item.history || []).map((h) => `<p style="margin: 6px 0; font-size: 13px;"><time style="display: block; color: var(--azul); font-size: 11px; font-weight: 600;">${esc(h.when)}</time>${esc(h.text)}</p>`).join("")}
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
      const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

      item.factura = { tipo, numero, cae, vto, total: item.vendidos * item.precio, cuit };
      item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
      saveProductos();
      showToast("Factura emitida correctamente");
      render();
    });
  }

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    Object.assign(item, {
      titulo: String(data.get("titulo") || ""),
      categoria: String(data.get("categoria") || "electronica"),
      precio: Number(data.get("precio") || 0),
      stock: Number(data.get("stock") || 0),
      status: newStatus,
      ubicacion: String(data.get("ubicacion") || "")
    });

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado: ${label(newStatus)}.` }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Publicación actualizada." }, ...(item.history || [])];
    }

    saveProductos();
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    saveProductos();
    showToast("Publicación eliminada");
    render();
  });
}

// Tab switching
document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
  });
});

// Toast notification
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

// Helpers
const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function tipoPubLabel(tipo) {
  const tipos = { gratuita: "Gratuita", clasica: "Clásica", premium: "Premium" };
  return tipos[tipo] || tipo;
}

render();
