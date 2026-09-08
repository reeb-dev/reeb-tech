let items = loadProductos();
let selected = items[0]?.id || "";
let filter = "todos";
let currentTab = "publicaciones";
let selectedVenta = "";
let selectedPregunta = "";
let ventaFiltro = "todas";
let preguntaFiltro = "pendientes";
let searchTerm = "";

const TAB_TITLES = {
  publicaciones: "Mis Publicaciones",
  ventas: "Ventas",
  preguntas: "Preguntas",
  envios: "Envíos",
  calificaciones: "Calificaciones",
  mercadopago: "Mercado Pago",
  facturacion: "Facturación ARCA"
};

function persistProductos() {
  saveProductos(items);
  items = loadProductos();
}

function reloadState() {
  resetCaches();
  items = loadProductos();
  if (!items.find((i) => i.id === selected)) selected = items[0]?.id || "";
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

function tipoPubLabel(tipo) {
  const tipos = { gratuita: "Gratuita", clasica: "Clásica", premium: "Premium" };
  return tipos[tipo] || tipo;
}

function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tabs button").forEach((b) => {
    b.classList.toggle("on", b.dataset.tab === tab);
  });
  document.getElementById("toolbar-title").textContent = TAB_TITLES[tab] || "Panel";
  document.getElementById("open-create").style.display = tab === "publicaciones" ? "" : "none";
  if (tab !== "publicaciones") document.getElementById("create").classList.remove("open");
  render();
}

function renderNotifBadge() {
  const count = contarNotificacionesNoLeidas();
  const badge = document.getElementById("notif-badge");
  badge.hidden = count === 0;
  badge.textContent = count > 9 ? "9+" : String(count);
}

function renderNotifDropdown() {
  const list = loadNotificaciones();
  const dropdown = document.getElementById("notif-dropdown");
  if (list.length === 0) {
    dropdown.innerHTML = `<div class="notif-empty">No hay notificaciones</div>`;
    return;
  }
  dropdown.innerHTML = `
    <div class="notif-head">
      <strong>Notificaciones</strong>
      <button type="button" class="ghost" id="notif-all-read">Marcar leídas</button>
    </div>
    ${list.slice(0, 12).map((n) => `
      <button type="button" class="notif-item ${n.leida ? "" : "unread"}" data-notif="${esc(n.id)}" data-tipo="${esc(n.tipo)}">
        <span>${esc(n.mensaje)}</span>
        <small>${esc(formatFecha(n.fecha))}</small>
      </button>
    `).join("")}
  `;
  dropdown.querySelector("#notif-all-read")?.addEventListener("click", (e) => {
    e.stopPropagation();
    marcarTodasLeidas();
    renderNotifBadge();
    renderNotifDropdown();
  });
  dropdown.querySelectorAll("[data-notif]").forEach((btn) => {
    btn.addEventListener("click", () => {
      marcarNotificacionLeida(btn.dataset.notif);
      const tipo = btn.dataset.tipo;
      const dest = tipo === "pregunta" || tipo === "respuesta" ? "preguntas"
        : tipo === "venta" ? "ventas"
        : tipo === "envio" ? "envios"
        : tipo === "factura" ? "facturacion"
        : tipo === "calificacion" ? "calificaciones"
        : currentTab;
      document.getElementById("notif-dropdown").hidden = true;
      setTab(dest);
    });
  });
}

document.getElementById("notif-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById("notif-dropdown");
  dropdown.hidden = !dropdown.hidden;
  if (!dropdown.hidden) renderNotifDropdown();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".notif-wrap")) {
    document.getElementById("notif-dropdown").hidden = true;
  }
});

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
});

document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
  btn.addEventListener("click", () => setTab(btn.dataset.navTab));
});

document.getElementById("open-create").addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    mla: `MLA-${Date.now().toString().slice(-10)}`,
    titulo: String(data.get("titulo") || ""),
    categoria: String(data.get("categoria") || "electronica"),
    precio: Number(data.get("precio") || 0),
    cuotas: "3 cuotas sin interés",
    stock: Number(data.get("stock") || 1),
    vendidos: 0,
    envioGratis: data.get("envioGratis") === "on",
    ubicacion: String(data.get("ubicacion") || "Capital Federal"),
    condicion: "nuevo",
    tipoPub: String(data.get("tipoPub") || "gratuita"),
    descripcion: String(data.get("descripcion") || ""),
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    status: "activo",
    visitas: 0,
    preguntas: 0,
    rating: null,
    opiniones: 0,
    history: [{ when: "hoy", text: "Publicación creada." }]
  };
  items = [item, ...items];
  selected = item.id;
  persistProductos();
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Publicación creada. Ya aparece en la tienda.");
  render();
});

function emptyState(text) {
  return `<p class="empty-state">${esc(text)}</p>`;
}

function bindListClicks(selector, onPick) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("click", () => onPick(card.dataset.id));
  });
}

function render() {
  reloadState();
  renderNotifBadge();
  if (currentTab === "publicaciones") renderPublicaciones();
  else if (currentTab === "ventas") renderVentas();
  else if (currentTab === "preguntas") renderPreguntas();
  else if (currentTab === "envios") renderEnvios();
  else if (currentTab === "calificaciones") renderCalificaciones();
  else if (currentTab === "mercadopago") renderMercadoPago();
  else if (currentTab === "facturacion") renderFacturacion();
}

function bindSearch() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
}

function searchField() {
  return `<input type="text" id="search" placeholder="Buscar..." value="${esc(searchTerm)}" style="margin-left:auto;padding:8px 12px;border:1px solid var(--line);border-radius:6px;width:200px;">`;
}

function matchesSearch(text) {
  if (!searchTerm) return true;
  return String(text || "").toLowerCase().includes(searchTerm.toLowerCase());
}

function visiblePublicaciones() {
  let list = items;
  if (filter === "agotado") list = list.filter((item) => item.status === "agotado" || item.stock === 0);
  else if (filter !== "todos") list = list.filter((item) => item.status === filter);
  return list.filter((item) =>
    matchesSearch(item.titulo) || matchesSearch(item.mla) || matchesSearch(item.ubicacion)
  );
}

function renderPublicaciones() {
  const counts = {
    activo: items.filter((i) => i.status === "activo").length,
    pausado: items.filter((i) => i.status === "pausado").length,
    agotado: items.filter((i) => i.status === "agotado" || i.stock === 0).length
  };
  const totalVentas = items.reduce((sum, i) => sum + (i.vendidos || 0), 0);
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
    ${searchField()}
  `;

  bindSearch();
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });

  const rows = visiblePublicaciones();
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
        <span><strong>${item.vendidos || 0}</strong> vendidos</span>
        <span><strong>${item.preguntas || 0}</strong> preguntas</span>
        ${item.rating ? `<span>⭐ ${item.rating}</span>` : ""}
      </div>
    </div>`).join("") || emptyState("No hay publicaciones en este estado.");

  bindListClicks(".pub-card", (id) => {
    selected = id;
    render();
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una publicación del listado.</p>";
    return;
  }

  const total = (item.vendidos || 0) * item.precio;
  detail.innerHTML = `
    <span class="tag ${esc(item.status)}" style="margin-bottom: 8px;">${esc(label(item.status))}</span>
    <h2>${esc(item.titulo)}</h2>
    <p style="color: var(--muted); font-size: 13px;">${esc(item.mla)} · Publicación ${esc(tipoPubLabel(item.tipoPub))}</p>
    <div class="meta">
      <div><span>Precio</span><strong>${money(item.precio)}</strong></div>
      <div><span>Stock</span><strong>${item.stock} unidades</strong></div>
      <div><span>Visitas</span><strong>${item.visitas || 0}</strong></div>
      <div><span>Vendidos</span><strong>${item.vendidos || 0} unidades</strong></div>
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
    <form id="edit">
      <label>Título<input name="titulo" value="${esc(item.titulo)}"></label>
      <label>Categoría
        <select name="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.id}" ${item.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Stock<input name="stock" type="number" value="${item.stock}"></label>
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Ubicación<input name="ubicacion" value="${esc(item.ubicacion)}"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar cambios</button>
        <button class="ghost" type="button" id="remove">Eliminar publicación</button>
      </div>
    </form>
    <div class="timeline">
      <h3 style="font-size: 14px; margin: 16px 0 8px;">Historial</h3>
      ${(item.history || []).map((h) => `<p style="margin: 6px 0; font-size: 13px;"><time style="display: block; color: var(--azul); font-size: 11px; font-weight: 600;">${esc(h.when)}</time>${esc(h.text)}</p>`).join("") || "<p>Sin movimientos.</p>"}
    </div>
  `;

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
    if (item.stock === 0) item.status = "agotado";
    item.history = [{
      when: "hoy",
      text: prevStatus !== item.status ? `Estado: ${label(item.status)}.` : "Publicación actualizada."
    }, ...(item.history || [])];
    persistProductos();
    showToast("Cambios guardados. La tienda ya muestra esta publicación.");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    persistProductos();
    showToast("Publicación eliminada");
    render();
  });
}

function ventasFiltradas() {
  let list = loadVentas();
  if (ventaFiltro !== "todas") list = list.filter((v) => v.envio.estado === ventaFiltro);
  return list.filter((v) =>
    matchesSearch(v.comprador?.nombre) ||
    matchesSearch(v.comprador?.email) ||
    (v.items || []).some((i) => matchesSearch(i.titulo))
  );
}

function renderVentaCard(venta, selectedId) {
  return `
    <div class="pub-card ${venta.id === selectedId ? "on" : ""}" data-id="${esc(venta.id)}">
      <header>
        <span class="title">${esc(venta.comprador.nombre)}</span>
        <span class="tag ${esc(venta.envio.estado)}">${esc(envioLabel(venta.envio.estado))}</span>
      </header>
      <div class="id">${esc(formatFecha(venta.fecha))} · ${esc(venta.comprador.email)}</div>
      <div class="price">${money(venta.total)}</div>
      <div class="metrics">
        <span>${venta.items.length} ítem${venta.items.length === 1 ? "" : "s"}</span>
        ${venta.factura ? "<span>Facturada</span>" : "<span>Sin factura</span>"}
      </div>
    </div>`;
}

function renderVentaDetail(venta, extra = "") {
  if (!venta) return "<p>Elegí una venta del listado.</p>";
  return `
    <span class="tag ${esc(venta.envio.estado)}">${esc(envioLabel(venta.envio.estado))}</span>
    <h2>${esc(venta.comprador.nombre)}</h2>
    <p style="color:var(--muted);font-size:13px;">${esc(venta.comprador.email)} · ${esc(formatFecha(venta.fecha))}</p>
    <div class="meta">
      <div><span>Total</span><strong>${money(venta.total)}</strong></div>
      <div><span>Pago</span><strong>Mercado Pago</strong></div>
      <div><span>Envío</span><strong>${esc(envioLabel(venta.envio.estado))}</strong></div>
      <div><span>Tracking</span><strong>${esc(venta.envio.tracking || "Pendiente")}</strong></div>
    </div>
    <p style="font-size:13px;color:var(--muted);">${esc(venta.direccion || "Sin dirección")}</p>
    <h3 style="font-size:14px;margin:16px 0 8px;">Ítems</h3>
    ${venta.items.map((i) => `
      <div class="sale-item">
        <div>
          <div class="buyer">${esc(i.titulo)}</div>
          <small>${i.cantidad} × ${money(i.precio)}</small>
        </div>
        <div class="amount">${money(i.precio * i.cantidad)}</div>
      </div>
    `).join("")}
    ${extra}
  `;
}

function renderVentas() {
  const list = loadVentas();
  const total = list.reduce((sum, v) => sum + v.total, 0);
  document.getElementById("stats").innerHTML = `
    <button type="button" data-vfiltro="todas" class="${ventaFiltro === "todas" ? "on" : ""}"><strong>${list.length}</strong><span class="label">Ventas</span></button>
    <div class="verde"><strong>${money(total)}</strong><span class="label">Facturado</span></div>
    <button type="button" data-vfiltro="pendiente" class="${ventaFiltro === "pendiente" ? "on" : ""}"><strong>${list.filter((v) => v.envio.estado === "pendiente").length}</strong><span class="label">Pendientes</span></button>
    <button type="button" data-vfiltro="entregado" class="${ventaFiltro === "entregado" ? "on" : ""}"><strong>${list.filter((v) => v.envio.estado === "entregado").length}</strong><span class="label">Entregadas</span></button>
    ${searchField()}
  `;
  bindSearch();
  document.querySelectorAll("[data-vfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ventaFiltro = btn.dataset.vfiltro;
      render();
    });
  });

  const rows = ventasFiltradas();
  if (!selectedVenta && rows[0]) selectedVenta = rows[0].id;
  document.getElementById("publist").innerHTML = rows.map((v) => renderVentaCard(v, selectedVenta)).join("") || emptyState("Todavía no hay ventas. Completá una compra en la tienda.");
  bindListClicks(".pub-card", (id) => {
    selectedVenta = id;
    render();
  });

  const venta = list.find((v) => v.id === selectedVenta);
  document.getElementById("detail").innerHTML = renderVentaDetail(venta, venta ? `
    <div class="shipping-section">
      <h4>Actualizar envío</h4>
      <label>Estado
        <select id="venta-estado">
          ${ENVIO_ESTADOS.map((e) => `<option value="${e.id}" ${venta.envio.estado === e.id ? "selected" : ""}>${esc(e.label)}</option>`).join("")}
        </select>
      </label>
      <button type="button" class="btn-panel" id="guardar-envio" style="margin-top:10px;">Guardar estado</button>
    </div>
  ` : "");

  document.getElementById("guardar-envio")?.addEventListener("click", () => {
    const estado = document.getElementById("venta-estado").value;
    actualizarEnvio(venta.id, estado);
    showToast("Estado de envío actualizado");
    render();
  });
}

function renderPreguntas() {
  const list = loadPreguntas();
  const pendientes = list.filter((p) => !p.respuesta);
  let visible = preguntaFiltro === "pendientes" ? pendientes : preguntaFiltro === "respondidas" ? list.filter((p) => p.respuesta) : list;
  visible = visible.filter((p) =>
    matchesSearch(p.nombreUsuario) || matchesSearch(p.productoTitulo) || matchesSearch(p.texto)
  );

  document.getElementById("stats").innerHTML = `
    <button type="button" data-pfiltro="todas" class="${preguntaFiltro === "todas" ? "on" : ""}"><strong>${list.length}</strong><span class="label">Todas</span></button>
    <button type="button" data-pfiltro="pendientes" class="${preguntaFiltro === "pendientes" ? "on" : ""}"><strong>${pendientes.length}</strong><span class="label">Sin responder</span></button>
    <button type="button" data-pfiltro="respondidas" class="${preguntaFiltro === "respondidas" ? "on" : ""}"><strong>${list.length - pendientes.length}</strong><span class="label">Respondidas</span></button>
    ${searchField()}
  `;
  bindSearch();
  document.querySelectorAll("[data-pfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      preguntaFiltro = btn.dataset.pfiltro;
      render();
    });
  });

  if (!selectedPregunta && visible[0]) selectedPregunta = visible[0].id;
  document.getElementById("publist").innerHTML = visible.map((p) => `
    <div class="pub-card ${p.id === selectedPregunta ? "on" : ""}" data-id="${esc(p.id)}">
      <header>
        <span class="title">${esc(p.nombreUsuario)}</span>
        <span class="tag ${p.respuesta ? "respondida" : "pregunta"}">${p.respuesta ? "Respondida" : "Pendiente"}</span>
      </header>
      <div class="id">${esc(p.productoTitulo)}</div>
      <p style="margin:8px 0 0;font-size:13px;">${esc(p.texto)}</p>
    </div>
  `).join("") || emptyState("No hay preguntas. Los compradores preguntan desde el detalle del producto.");

  bindListClicks(".pub-card", (id) => {
    selectedPregunta = id;
    render();
  });

  const pregunta = list.find((p) => p.id === selectedPregunta);
  const detail = document.getElementById("detail");
  if (!pregunta) {
    detail.innerHTML = "<p>Elegí una pregunta del listado.</p>";
    return;
  }
  detail.innerHTML = `
    <span class="tag ${pregunta.respuesta ? "respondida" : "pregunta"}">${pregunta.respuesta ? "Respondida" : "Pendiente"}</span>
    <h2>${esc(pregunta.productoTitulo)}</h2>
    <p style="color:var(--muted);font-size:13px;">${esc(pregunta.nombreUsuario)} · ${esc(formatFecha(pregunta.fecha))}</p>
    <div class="question-item">
      <div class="q">${esc(pregunta.texto)}</div>
      ${pregunta.respuesta ? `<div class="a">${esc(pregunta.respuesta)}</div><div class="date">${esc(formatFecha(pregunta.fechaRespuesta))}</div>` : ""}
    </div>
    ${pregunta.respuesta ? "" : `
      <form id="reply-form">
        <label>Tu respuesta
          <textarea name="respuesta" rows="4" required placeholder="Respondé para que el comprador vea la respuesta en la tienda."></textarea>
        </label>
        <button class="btn-panel" type="submit" style="margin-top:10px;">Responder</button>
      </form>
    `}
  `;
  detail.querySelector("#reply-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const texto = String(new FormData(event.target).get("respuesta") || "").trim();
    if (!texto) return;
    responderPregunta(pregunta.id, texto);
    showToast("Respuesta publicada en la tienda");
    render();
  });
}

function renderEnvios() {
  const list = loadVentas();
  const counts = Object.fromEntries(ENVIO_ESTADOS.map((e) => [e.id, list.filter((v) => v.envio.estado === e.id).length]));
  document.getElementById("stats").innerHTML = ENVIO_ESTADOS.map((e) => `
    <button type="button" data-vfiltro="${e.id}" class="${ventaFiltro === e.id ? "on" : ""}">
      <strong>${counts[e.id] || 0}</strong><span class="label">${esc(e.label)}</span>
    </button>
  `).join("") + `<button type="button" data-vfiltro="todas" class="${ventaFiltro === "todas" ? "on" : ""}"><strong>${list.length}</strong><span class="label">Todos</span></button>${searchField()}`;

  bindSearch();
  document.querySelectorAll("[data-vfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ventaFiltro = btn.dataset.vfiltro;
      render();
    });
  });

  const rows = ventasFiltradas();
  if (!selectedVenta && rows[0]) selectedVenta = rows[0].id;
  document.getElementById("publist").innerHTML = rows.map((v) => renderVentaCard(v, selectedVenta)).join("") || emptyState("No hay envíos para este estado.");
  bindListClicks(".pub-card", (id) => {
    selectedVenta = id;
    render();
  });

  const venta = list.find((v) => v.id === selectedVenta);
  document.getElementById("detail").innerHTML = renderVentaDetail(venta, venta ? `
    <div class="shipping-section">
      <h4>Línea de envío</h4>
      <div class="envio-steps">
        ${ENVIO_ESTADOS.map((e) => `<span class="envio-step ${venta.envio.estado === e.id ? "on" : ""}">${esc(e.label)}</span>`).join("")}
      </div>
      <div class="actions" style="margin-top:12px;">
        ${ENVIO_ESTADOS.filter((e) => e.id !== venta.envio.estado).map((e) => `
          <button type="button" class="ghost" data-envio="${e.id}">Marcar ${esc(e.label)}</button>
        `).join("")}
      </div>
      <p class="tracking" style="margin-top:12px;">Tracking: ${esc(venta.envio.tracking || "Se genera al despachar")}</p>
      <h4 style="margin-top:16px;">Historial</h4>
      ${(venta.envio.historial || []).map((h) => `<p style="font-size:13px;margin:6px 0;"><strong>${esc(formatFecha(h.fecha))}</strong> ${esc(h.nota)}</p>`).join("")}
    </div>
  ` : "");

  document.querySelectorAll("[data-envio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      actualizarEnvio(venta.id, btn.dataset.envio);
      showToast("Envío actualizado");
      render();
    });
  });
}

function renderCalificaciones() {
  const list = loadVentas();
  const conRating = list.filter((v) => v.calificacion);
  const promedio = conRating.length
    ? (conRating.reduce((sum, v) => sum + v.calificacion.rating, 0) / conRating.length).toFixed(1)
    : "—";

  document.getElementById("stats").innerHTML = `
    <div><strong>${conRating.length}</strong><span class="label">Calificaciones</span></div>
    <div class="verde"><strong>${promedio}</strong><span class="label">Promedio</span></div>
    <div><strong>${list.filter((v) => v.envio.estado === "entregado" && !v.calificacion).length}</strong><span class="label">Pendientes</span></div>
  `;

  document.getElementById("publist").innerHTML = conRating.map((v) => `
    <div class="pub-card ${v.id === selectedVenta ? "on" : ""}" data-id="${esc(v.id)}">
      <header>
        <span class="title">${esc(v.comprador.nombre)}</span>
        <span>⭐ ${v.calificacion.rating}</span>
      </header>
      <div class="id">${esc(formatFecha(v.calificacion.fecha))}</div>
      <p style="margin:8px 0 0;font-size:13px;">${esc(v.calificacion.comentario || "Sin comentario")}</p>
    </div>
  `).join("") || emptyState("Todavía no hay calificaciones. El comprador puede calificar desde Mis compras cuando el envío está entregado.");

  bindListClicks(".pub-card", (id) => {
    selectedVenta = id;
    render();
  });

  const venta = conRating.find((v) => v.id === selectedVenta) || conRating[0];
  document.getElementById("detail").innerHTML = venta ? `
    <div class="ratings-display">
      <span class="big">${venta.calificacion.rating}</span>
      <div class="stars">${"★".repeat(venta.calificacion.rating)}${"☆".repeat(5 - venta.calificacion.rating)}</div>
      <div class="count">${esc(formatFecha(venta.calificacion.fecha))}</div>
    </div>
    <h2>${esc(venta.comprador.nombre)}</h2>
    <p>${esc(venta.calificacion.comentario || "Sin comentario")}</p>
    ${venta.items.map((i) => `<p style="font-size:13px;color:var(--muted);">${esc(i.titulo)}</p>`).join("")}
  ` : "<p>Cuando un comprador califique, vas a ver el detalle acá.</p>";
}

function renderMercadoPago() {
  const mp = loadMercadoPago();
  const ventasCount = loadVentas().length;
  document.getElementById("stats").innerHTML = `
    <div class="verde"><strong>${money(mp.saldoDisponible)}</strong><span class="label">Disponible</span></div>
    <div><strong>${money(mp.saldoPendiente)}</strong><span class="label">Pendiente</span></div>
    <div><strong>${ventasCount}</strong><span class="label">Ventas cobradas</span></div>
  `;

  document.getElementById("publist").innerHTML = `
    <div class="mp-section">
      <h4>Saldo Mercado Pago (simulado)</h4>
      <div class="mp-balance">${money(mp.saldoDisponible)}</div>
      <div class="mp-available">Comisión demo: 5% por venta</div>
    </div>
    ${(mp.movimientos || []).map((m) => `
      <div class="sale-item">
        <div>
          <div class="buyer">${esc(m.descripcion)}</div>
          <small>${esc(formatFecha(m.fecha))}${m.comision ? ` · comisión ${money(m.comision)}` : ""}</small>
        </div>
        <div class="amount" style="color:${m.monto < 0 ? "#c62828" : "var(--verde)"}">${m.monto < 0 ? "−" : "+"}${money(Math.abs(m.monto))}</div>
      </div>
    `).join("") || emptyState("Todavía no hay movimientos. Las ventas de la tienda acreditan el saldo.")}
  `;

  document.getElementById("detail").innerHTML = `
    <h2>Retirar dinero</h2>
    <p style="color:var(--muted);font-size:13px;">Simulación: no hay transferencia real.</p>
    <form id="retiro-form">
      <label>Monto<input name="monto" type="number" min="1" step="1" required placeholder="${mp.saldoDisponible}"></label>
      <label>CBU / CVU<input name="cbu" required placeholder="0000003100010000000001" minlength="8"></label>
      <button class="btn-panel" type="submit" style="margin-top:12px;" ${mp.saldoDisponible <= 0 ? "disabled" : ""}>Solicitar retiro</button>
    </form>
    <h3 style="font-size:14px;margin:24px 0 8px;">Retiros</h3>
    ${(mp.retiros || []).map((r) => `
      <div class="sale-item">
        <div>
          <div class="buyer">${money(r.monto)}</div>
          <small>CBU ***${esc(String(r.cbu).slice(-4))} · ${esc(r.estado)}</small>
        </div>
        <small>${esc(formatFecha(r.fecha))}</small>
      </div>
    `).join("") || "<p>Sin retiros.</p>"}
  `;

  document.getElementById("retiro-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const monto = Number(data.get("monto") || 0);
    const cbu = String(data.get("cbu") || "");
    const ok = retirarDinero(monto, cbu);
    if (!ok) {
      showToast("No hay saldo suficiente");
      return;
    }
    showToast("Retiro simulado en proceso");
    render();
  });
}

function renderFacturacion() {
  const list = loadVentas();
  const facturadas = list.filter((v) => v.factura);
  const pendientes = list.filter((v) => !v.factura);
  document.getElementById("stats").innerHTML = `
    <div><strong>${list.length}</strong><span class="label">Ventas</span></div>
    <div class="verde"><strong>${facturadas.length}</strong><span class="label">Facturadas</span></div>
    <div class="naranja"><strong>${pendientes.length}</strong><span class="label">Pendientes</span></div>
    ${searchField()}
  `;
  bindSearch();

  document.getElementById("publist").innerHTML = list.filter((v) =>
    matchesSearch(v.comprador?.nombre) || matchesSearch(v.comprador?.email)
  ).map((v) => `
    <div class="pub-card ${v.id === selectedVenta ? "on" : ""}" data-id="${esc(v.id)}">
      <header>
        <span class="title">${esc(v.comprador.nombre)}</span>
        <span class="tag ${v.factura ? "pagado" : "pendiente"}">${v.factura ? "Facturada" : "Pendiente"}</span>
      </header>
      <div class="id">${esc(formatFecha(v.fecha))}</div>
      <div class="price">${money(v.total)}</div>
    </div>
  `).join("") || emptyState("No hay ventas para facturar.");

  bindListClicks(".pub-card", (id) => {
    selectedVenta = id;
    render();
  });

  const venta = list.find((v) => v.id === selectedVenta) || list[0];
  if (!venta) {
    document.getElementById("detail").innerHTML = "<p>Cuando haya una venta, podés emitir el comprobante ARCA simulado.</p>";
    return;
  }

  document.getElementById("detail").innerHTML = venta.factura ? `
    <div class="factura-box">
      <h4>Comprobante emitido</h4>
      <div><strong>Tipo:</strong> ${esc(compLabel(venta.factura.tipo))}</div>
      <div><strong>Número:</strong> ${esc(venta.factura.numero)}</div>
      <div><strong>CUIT:</strong> ${esc(venta.factura.cuit || "Consumidor final")}</div>
      <div><strong>Total:</strong> ${money(venta.factura.total)}</div>
      <div><strong>CAE:</strong> <span class="cae">${esc(venta.factura.cae)}</span></div>
      <div><strong>Vto CAE:</strong> ${esc(venta.factura.vto)}</div>
    </div>
    <p style="font-size:12px;color:var(--muted);">Demo: CAE simulado. En producción se conecta a ARCA/AFIP.</p>
  ` : `
    <h2>Emitir factura</h2>
    <p style="color:var(--muted);font-size:13px;">${esc(venta.comprador.nombre)} · ${money(venta.total)}</p>
    <div class="arca-section">
      <h4>Facturación ARCA (simulado)</h4>
      <label>CUIT comprador<input id="arca-cuit" placeholder="20-12345678-9"></label>
      <label>Tipo comprobante
        <select id="arca-tipo">
          ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;">Emitir factura</button>
      <p style="font-size:11px;color:var(--muted);margin-top:8px;">Genera CAE simulado. No hay envío real a ARCA.</p>
    </div>
  `;

  document.getElementById("emitir-factura")?.addEventListener("click", () => {
    selectedVenta = venta.id;
    emitirFacturaVenta(venta.id, document.getElementById("arca-tipo").value, document.getElementById("arca-cuit").value);
    showToast("Factura emitida (simulado)");
    render();
  });
}

render();
