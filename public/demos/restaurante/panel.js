const MOZOS = ["Carlos", "María", "Lucía"];
const FOTOS_CARTA = [
  "img/provoleta.jpg", "img/empanadas.jpg", "img/tabla.jpg", "img/bife-chorizo.jpg",
  "img/ojo-bife.jpg", "img/asado.jpg", "img/milanesa.jpg", "img/pastas.jpg",
  "img/risotto.jpg", "img/pescado.jpg", "img/papas.jpg", "img/pure.jpg",
  "img/ensalada.jpg", "img/flan.jpg", "img/panqueque.jpg", "img/malbec.jpg",
  "img/malbec-botella.jpg", "img/agua.jpg", "img/gaseosa.jpg", "img/hero-salon.jpg"
];

let menuItems = loadMenu();
let mesasData = loadMesas();
let pedidosData = loadPedidos();
let tab = "mesas";
let selectedMesa = mesasData[0]?.id || "";
let selectedPlato = menuItems[0]?.id || "";
let selectedCocina = "";
let filterMesa = "todos";
let filterCocina = "activos";
let searchTerm = "";

const createMesa = document.getElementById("create-mesa");
const createPlato = document.getElementById("create-plato");
const openCreate = document.getElementById("open-create");
const fotoSelect = document.getElementById("foto-plato");

fotoSelect.innerHTML = FOTOS_CARTA.map((src) => {
  const name = src.replace("img/", "").replace(".jpg", "").replace(/-/g, " ");
  return `<option value="${esc(src)}">${esc(name)}</option>`;
}).join("");

openCreate.addEventListener("click", () => {
  if (tab === "carta") createPlato.classList.toggle("open");
  else {
    tab = "mesas";
    createMesa.classList.toggle("open");
  }
  render();
});

createMesa.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const numero = Number(data.get("numero") || 0);
  if (mesasData.some((m) => m.numero === numero)) {
    showToast("Ya existe una mesa con ese número");
    return;
  }
  const status = String(data.get("status") || "libre");
  const reservaNombre = String(data.get("reservaNombre") || "").trim();
  const mesa = {
    id: crypto.randomUUID(),
    numero,
    capacidad: Number(data.get("capacidad") || 4),
    zona: String(data.get("zona") || "salón"),
    status,
    mozo: null,
    reserva: status === "reservada" && reservaNombre
      ? { nombre: reservaNombre, hora: String(data.get("reservaHora") || ""), personas: Number(data.get("capacidad") || 4) }
      : null
  };
  mesasData = [mesa, ...mesasData];
  selectedMesa = mesa.id;
  saveMesas(mesasData);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "mesas";
  showToast("Mesa agregada");
  render();
});

createPlato.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const plato = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    nombre: String(data.get("nombre") || ""),
    categoria: String(data.get("categoria") || "principal"),
    precio: Number(data.get("precio") || 0),
    disponible: true,
    foto: String(data.get("foto") || "img/hero-salon.jpg"),
    descripcion: String(data.get("descripcion") || "")
  };
  menuItems = [plato, ...menuItems];
  selectedPlato = plato.id;
  saveMenu(menuItems);
  event.target.reset();
  event.target.classList.remove("open");
  tab = "carta";
  showToast("Plato agregado a la carta");
  render();
});

document.getElementById("tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-tab]");
  if (!btn) return;
  tab = btn.dataset.tab;
  createMesa.classList.remove("open");
  createPlato.classList.remove("open");
  render();
});

function setTabVisibility() {
  document.querySelectorAll("#tabs [data-tab]").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.tab === tab);
  });
  document.getElementById("view-mesas").hidden = tab !== "mesas";
  document.getElementById("view-cocina").hidden = tab !== "cocina";
  document.getElementById("view-carta").hidden = tab !== "carta";
  createMesa.style.display = tab === "mesas" ? "" : "none";
  createPlato.style.display = tab === "carta" ? "" : "none";
  openCreate.textContent = tab === "carta" ? "Nuevo plato" : "Nueva mesa";
  const titles = {
    mesas: "Salón del restaurante",
    cocina: "Comandas de cocina",
    carta: "Carta del día"
  };
  document.getElementById("panelTitle").textContent = titles[tab] || titles.mesas;
}

function cocinaItems() {
  const list = [];
  pedidosData.forEach((p) => {
    if (p.factura) return;
    const mesa = getMesa(p.mesa);
    p.items.forEach((item, idx) => {
      const menuItem = getMenuItem(item.menu);
      list.push({ key: `${p.id}-${idx}`, pedido: p, item, idx, mesa, menuItem });
    });
  });
  return list;
}

function render() {
  menuItems = loadMenu();
  mesasData = loadMesas();
  pedidosData = loadPedidos();
  setTabVisibility();
  if (tab === "mesas") renderMesas();
  else if (tab === "cocina") renderCocina();
  else renderCarta();
}

function renderMesas() {
  const libres = mesasData.filter((m) => m.status === "libre").length;
  const ocupadas = mesasData.filter((m) => m.status === "ocupada").length;
  const reservadas = mesasData.filter((m) => m.status === "reservada").length;
  const term = searchTerm.toLowerCase();
  let visible = mesasData;
  if (filterMesa !== "todos") visible = visible.filter((m) => m.status === filterMesa);
  if (term) {
    visible = visible.filter((m) =>
      String(m.numero).includes(term) ||
      (m.mozo || "").toLowerCase().includes(term) ||
      (m.reserva?.nombre || "").toLowerCase().includes(term) ||
      (m.zona || "").toLowerCase().includes(term)
    );
  }

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filterMesa === "todos" ? "on" : ""}"><strong>${mesasData.length}</strong>mesas</button>
    <button type="button" data-filter="libre" class="${filterMesa === "libre" ? "on" : ""}"><strong>${libres}</strong>libres</button>
    <button type="button" data-filter="ocupada" class="${filterMesa === "ocupada" ? "on" : ""}"><strong>${ocupadas}</strong>ocupadas</button>
    <button type="button" data-filter="reservada" class="${filterMesa === "reservada" ? "on" : ""}"><strong>${reservadas}</strong>reservadas</button>
    <input type="text" id="search" placeholder="Buscar mesa, mozo..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("#stats [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filterMesa = btn.dataset.filter; render(); });
  });

  document.getElementById("mesas-list").innerHTML = `
    <div class="mesas-grid">
      ${visible.map((m) => `
        <div class="mesa-card ${esc(m.status)} ${m.id === selectedMesa ? "on" : ""}" data-id="${esc(m.id)}">
          <div class="numero">${m.numero}</div>
          <div class="cap">${m.capacidad} pers. · ${esc(m.zona)} ${m.mozo ? `· ${esc(m.mozo)}` : ""}</div>
          <div class="status"><span class="tag ${esc(m.status)}">${esc(labelMesa(m.status))}</span></div>
        </div>
      `).join("") || `<p class="note">No hay mesas en este filtro.</p>`}
    </div>
  `;

  document.querySelectorAll(".mesa-card").forEach((card) => {
    card.addEventListener("click", () => { selectedMesa = card.dataset.id; render(); });
  });

  const mesa = mesasData.find((m) => m.id === selectedMesa);
  const detail = document.getElementById("mesa-detail");
  if (!mesa) { detail.innerHTML = "<p>Elegí una mesa.</p>"; return; }

  const pedido = getPedidoByMesa(mesa.id);
  const cerrado = !pedido && mesa.status === "cuenta" ? getUltimoPedidoMesa(mesa.id) : null;
  const ticket = pedido || (cerrado?.factura ? cerrado : null);
  const total = ticket ? calcTotalPedido(ticket) : 0;

  detail.innerHTML = `
    <p class="eyebrow">Mesa ${mesa.numero} · ${esc(mesa.zona)}</p>
    <h2>${esc(labelMesa(mesa.status))}</h2>
    <div class="meta">
      <div><span>Capacidad</span>${mesa.capacidad} personas</div>
      <div><span>Mozo</span>${esc(mesa.mozo) || "Sin asignar"}</div>
      ${ticket ? `<div><span>Abierta</span>${esc(ticket.horaApertura)}</div>` : ""}
      ${mesa.reserva ? `<div><span>Reserva</span>${esc(mesa.reserva.nombre)} · ${esc(mesa.reserva.hora)}</div>` : ""}
    </div>

    ${mesa.status === "libre" || mesa.status === "reservada" ? `
      <div class="actions">
        <button class="btn-panel" type="button" id="abrir-mesa">${mesa.status === "reservada" ? "Sentar reserva" : "Abrir mesa"}</button>
      </div>
    ` : ""}

    ${ticket ? `
      <h3 style="font-size:14px;margin-top:16px;">Comanda</h3>
      <div class="comanda">
        ${ticket.items.map((item, idx) => {
          const menuItem = getMenuItem(item.menu);
          const estado = ticket.factura ? "cobrado" : item.status;
          return `<div class="comanda-item">
            <img class="thumb" src="${esc(fotoPlato(menuItem))}" alt="">
            <div style="flex:1;">
              <span class="nombre">${esc(menuItem?.nombre || "—")} x${item.cantidad}</span>
              ${item.nota ? `<div class="nota">${esc(item.nota)}</div>` : ""}
              ${pedido ? `<div class="actions" style="margin-top:6px;">
                <button type="button" class="ghost" data-estado="pendiente" data-idx="${idx}">Pedido</button>
                <button type="button" class="ghost" data-estado="preparando" data-idx="${idx}">Cocina</button>
                <button type="button" class="ghost" data-estado="listo" data-idx="${idx}">Listo</button>
              </div>` : ""}
            </div>
            <div>
              <span class="tag ${esc(estado)}">${esc(labelPedido(estado))}</span>
              <span style="margin-left:8px;">${esc(money((menuItem?.precio || 0) * item.cantidad))}</span>
            </div>
          </div>`;
        }).join("") || `<p class="note">Sin platos todavía.</p>`}
      </div>
      <div style="text-align:right;font-size:18px;font-weight:700;margin:12px 0;">
        Total: ${esc(money(ticket.factura ? ticket.factura.total : total))}
      </div>
      ${pedido ? `
        <label>Agregar plato</label>
        <select id="agregar-plato">
          <option value="">— Seleccionar —</option>
          ${menuItems.filter((m) => m.disponible).map((m) => `<option value="${m.id}">${esc(m.nombre)} - ${esc(money(m.precio))}</option>`).join("")}
        </select>
        <button class="ghost" type="button" id="btn-agregar" style="margin-top:6px;">+ Agregar</button>
      ` : ""}
    ` : ""}

    ${pedido && !pedido.factura ? `
      <div class="arca-section">
        <h4>Cerrar mesa con ARCA</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="cerrar-mesa" style="margin-top:10px;" ${total === 0 ? "disabled" : ""}>
          Cobrar y cerrar (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Ejemplo: genera CAE simulado.</p>
      </div>
    ` : ""}

    ${ticket?.factura ? `
      <div class="factura-box">
        <h4>Mesa cobrada</h4>
        <p><strong>${esc(compLabel(ticket.factura.tipo))}</strong> ${esc(ticket.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(ticket.factura.cae)}</span></p>
        <p>Total: ${esc(money(ticket.factura.total))}</p>
        <button class="ghost" type="button" id="liberar-mesa" style="margin-top:8px;">Liberar mesa</button>
      </div>
    ` : ""}

    <form id="edit-mesa">
      <label>Capacidad<input name="capacidad" type="number" min="1" value="${mesa.capacidad}"></label>
      <label>Zona
        <select name="zona">
          <option value="salón" ${mesa.zona === "salón" ? "selected" : ""}>Salón</option>
          <option value="terraza" ${mesa.zona === "terraza" ? "selected" : ""}>Terraza</option>
        </select>
      </label>
      <label>Mozo
        <select name="mozo">
          <option value="">Sin asignar</option>
          ${MOZOS.map((n) => `<option value="${esc(n)}" ${mesa.mozo === n ? "selected" : ""}>${esc(n)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove-mesa">Eliminar mesa</button>
      </div>
    </form>
  `;

  detail.querySelector("#abrir-mesa")?.addEventListener("click", () => {
    mesa.status = "ocupada";
    mesa.mozo = mesa.mozo || MOZOS[mesa.numero % MOZOS.length];
    pedidosData.push({
      id: crypto.randomUUID(),
      mesa: mesa.id,
      items: [],
      horaApertura: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      mozo: mesa.mozo,
      factura: null
    });
    saveMesas(mesasData);
    savePedidos(pedidosData);
    showToast("Mesa abierta");
    render();
  });

  detail.querySelectorAll("[data-estado]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!pedido) return;
      const idx = Number(btn.dataset.idx);
      if (!pedido.items[idx]) return;
      pedido.items[idx].status = btn.dataset.estado;
      savePedidos(pedidosData);
      showToast("Comanda actualizada");
      render();
    });
  });

  detail.querySelector("#btn-agregar")?.addEventListener("click", () => {
    const platoId = detail.querySelector("#agregar-plato").value;
    if (!platoId || !pedido) return;
    const existing = pedido.items.find((i) => i.menu === platoId && i.status === "pendiente");
    if (existing) existing.cantidad += 1;
    else pedido.items.push({ menu: platoId, cantidad: 1, status: "pendiente", nota: "" });
    savePedidos(pedidosData);
    showToast("Plato agregado");
    render();
  });

  detail.querySelector("#cerrar-mesa")?.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    pedido.items.forEach((item) => { item.status = "cobrado"; });
    pedido.factura = {
      tipo, numero, cae,
      vto: vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" }),
      total
    };
    mesa.status = "cuenta";
    savePedidos(pedidosData);
    saveMesas(mesasData);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#liberar-mesa")?.addEventListener("click", () => {
    mesa.status = "libre";
    mesa.mozo = null;
    mesa.reserva = null;
    saveMesas(mesasData);
    showToast("Mesa liberada");
    render();
  });

  detail.querySelector("#edit-mesa")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    mesa.capacidad = Number(data.get("capacidad") || mesa.capacidad);
    mesa.zona = String(data.get("zona") || mesa.zona);
    mesa.mozo = String(data.get("mozo") || "") || null;
    saveMesas(mesasData);
    showToast("Mesa actualizada");
    render();
  });

  detail.querySelector("#remove-mesa")?.addEventListener("click", () => {
    if (!confirm("¿Eliminar esta mesa? Esta acción no se puede deshacer.")) return;
    mesasData = mesasData.filter((m) => m.id !== mesa.id);
    selectedMesa = mesasData[0]?.id || "";
    saveMesas(mesasData);
    showToast("Mesa eliminada");
    render();
  });
}

function renderCocina() {
  const all = cocinaItems();
  const pendientes = all.filter((p) => p.item.status === "pendiente").length;
  const preparando = all.filter((p) => p.item.status === "preparando").length;
  const listos = all.filter((p) => p.item.status === "listo" || p.item.status === "entregado").length;
  let visible = all;
  if (filterCocina === "activos") visible = all.filter((p) => p.item.status === "pendiente" || p.item.status === "preparando");
  else if (filterCocina !== "todos") visible = all.filter((p) => p.item.status === filterCocina);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    visible = visible.filter((p) =>
      String(p.mesa?.numero || "").includes(term) ||
      (p.menuItem?.nombre || "").toLowerCase().includes(term) ||
      (p.pedido.mozo || "").toLowerCase().includes(term)
    );
  }
  if (!selectedCocina && visible[0]) selectedCocina = visible[0].key;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-cfiltro="activos" class="${filterCocina === "activos" ? "on" : ""}"><strong>${pendientes + preparando}</strong>en cocina</button>
    <button type="button" data-cfiltro="pendiente" class="${filterCocina === "pendiente" ? "on" : ""}"><strong>${pendientes}</strong>pedidos</button>
    <button type="button" data-cfiltro="preparando" class="${filterCocina === "preparando" ? "on" : ""}"><strong>${preparando}</strong>preparando</button>
    <button type="button" data-cfiltro="listo" class="${filterCocina === "listo" ? "on" : ""}"><strong>${listos}</strong>listos</button>
    <input type="text" id="search" placeholder="Buscar plato o mesa..." value="${esc(searchTerm)}">
  `;
  bindSearch();
  document.querySelectorAll("#stats [data-cfiltro]").forEach((btn) => {
    btn.addEventListener("click", () => { filterCocina = btn.dataset.cfiltro; render(); });
  });

  document.getElementById("cocina-list").innerHTML = `
    <div class="cocina-board">
      ${visible.map((p) => `
        <div class="cocina-item ${p.item.status === "listo" || p.item.status === "entregado" ? "listo" : ""} ${p.key === selectedCocina ? "on" : ""}" data-key="${esc(p.key)}">
          <img class="thumb" src="${esc(fotoPlato(p.menuItem))}" alt="">
          <div>
            <div class="mesa">Mesa ${p.mesa?.numero || "?"} · ${esc(p.pedido.mozo || "—")}</div>
            <div class="items"><strong>${esc(p.menuItem?.nombre || "—")} x${p.item.cantidad}</strong>${p.item.nota ? ` · <em>${esc(p.item.nota)}</em>` : ""}</div>
            <div style="margin-top:8px;"><span class="tag ${esc(p.item.status)}">${esc(labelPedido(p.item.status))}</span></div>
          </div>
        </div>
      `).join("") || `<p class="note">No hay comandas en este estado.</p>`}
    </div>
  `;

  document.querySelectorAll("#cocina-list [data-key]").forEach((card) => {
    card.addEventListener("click", () => { selectedCocina = card.dataset.key; render(); });
  });

  const current = all.find((p) => p.key === selectedCocina) || visible[0];
  const detail = document.getElementById("cocina-detail");
  if (!current) {
    detail.innerHTML = `<h2>Cocina</h2><p class="note">Cuando una mesa pide un plato, aparece acá para pasarlo a fuego y marcarlo listo.</p>`;
    return;
  }

  detail.innerHTML = `
    <p class="eyebrow">Mesa ${current.mesa?.numero || "?"} · ${esc(current.pedido.horaApertura)}</p>
    <h2>${esc(current.menuItem?.nombre || "Plato")}</h2>
    <img src="${esc(fotoPlato(current.menuItem))}" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin:8px 0;">
    <div class="meta">
      <div><span>Cantidad</span>x${current.item.cantidad}</div>
      <div><span>Mozo</span>${esc(current.pedido.mozo || "—")}</div>
      <div><span>Estado</span>${esc(labelPedido(current.item.status))}</div>
      <div><span>Nota</span>${esc(current.item.nota || "Sin nota")}</div>
    </div>
    <div class="actions">
      ${current.item.status === "pendiente" ? `<button class="btn-panel" type="button" data-action="preparando">Pasar a cocina</button>` : ""}
      ${current.item.status === "preparando" ? `<button class="btn-panel" type="button" data-action="listo">Marcar listo</button>` : ""}
      ${current.item.status === "listo" ? `<button class="btn-panel" type="button" data-action="entregado">Entregar a mesa</button>` : ""}
    </div>
  `;

  detail.querySelector("[data-action]")?.addEventListener("click", (event) => {
    current.item.status = event.currentTarget.dataset.action;
    savePedidos(pedidosData);
    showToast("Comanda actualizada");
    render();
  });
}

function renderCarta() {
  const disponibles = menuItems.filter((m) => m.disponible).length;
  const term = searchTerm.toLowerCase();
  const visible = term
    ? menuItems.filter((m) =>
        m.nombre.toLowerCase().includes(term) ||
        m.codigo.toLowerCase().includes(term) ||
        catLabel(m.categoria).toLowerCase().includes(term)
      )
    : menuItems;

  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>${menuItems.length}</strong>platos</div>
    <div><strong>${disponibles}</strong>disponibles</div>
    <div><strong>${menuItems.length - disponibles}</strong>no disponibles</div>
    <input type="text" id="search" placeholder="Buscar plato..." value="${esc(searchTerm)}">
  `;
  bindSearch();

  document.getElementById("carta-list").innerHTML = `
    <div class="menu-admin">
      ${visible.map((m) => `
        <article class="${m.id === selectedPlato ? "on" : ""}" data-id="${esc(m.id)}">
          <div class="card-photo"><img src="${esc(fotoPlato(m))}" alt="${esc(m.nombre)}"></div>
          <div class="txt">
            <h3>${esc(m.nombre)}</h3>
            <div style="font-size:12px;color:var(--muted);">${esc(m.codigo)} · ${esc(catLabel(m.categoria))}</div>
            <div style="margin-top:6px;font-weight:700;color:var(--rojo);">${esc(money(m.precio))}</div>
            <div style="font-size:12px;margin-top:4px;">${m.disponible ? "Disponible" : "No disponible"}</div>
          </div>
        </article>
      `).join("") || `<p class="note">No hay platos con esa búsqueda.</p>`}
    </div>
  `;

  document.querySelectorAll("#carta-list article").forEach((card) => {
    card.addEventListener("click", () => { selectedPlato = card.dataset.id; render(); });
  });

  const plato = menuItems.find((m) => m.id === selectedPlato);
  const detail = document.getElementById("carta-detail");
  if (!plato) { detail.innerHTML = "<p>Elegí un plato.</p>"; return; }

  detail.innerHTML = `
    <img src="${esc(fotoPlato(plato))}" alt="${esc(plato.nombre)}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">
    <p class="eyebrow">${esc(plato.codigo)} · ${esc(catLabel(plato.categoria))}</p>
    <h2>${esc(plato.nombre)}</h2>
    <form id="edit-plato">
      <label>Código<input name="codigo" value="${esc(plato.codigo)}"></label>
      <label>Nombre<input name="nombre" value="${esc(plato.nombre)}"></label>
      <label>Categoría
        <select name="categoria">
          ${CATEGORIAS.map((c) => `<option value="${c.id}" ${plato.categoria === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
        </select>
      </label>
      <label>Precio<input name="precio" type="number" value="${plato.precio}"></label>
      <label>Foto
        <select name="foto">
          ${FOTOS_CARTA.map((src) => `<option value="${esc(src)}" ${plato.foto === src ? "selected" : ""}>${esc(src.replace("img/", ""))}</option>`).join("")}
        </select>
      </label>
      <label>Descripción<textarea name="descripcion" rows="3">${esc(plato.descripcion || "")}</textarea></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="toggle-disp">${plato.disponible ? "Marcar no disponible" : "Marcar disponible"}</button>
        <button class="ghost" type="button" id="remove-plato">Eliminar</button>
      </div>
    </form>
  `;

  detail.querySelector("#edit-plato").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    Object.assign(plato, {
      codigo: String(data.get("codigo") || ""),
      nombre: String(data.get("nombre") || ""),
      categoria: String(data.get("categoria") || "principal"),
      precio: Number(data.get("precio") || 0),
      foto: String(data.get("foto") || plato.foto),
      descripcion: String(data.get("descripcion") || "")
    });
    saveMenu(menuItems);
    showToast("Plato actualizado");
    render();
  });

  detail.querySelector("#toggle-disp").addEventListener("click", () => {
    plato.disponible = !plato.disponible;
    saveMenu(menuItems);
    showToast(plato.disponible ? "Plato disponible" : "Plato no disponible");
    render();
  });

  detail.querySelector("#remove-plato").addEventListener("click", () => {
    if (!confirm("¿Eliminar este plato de la carta? Esta acción no se puede deshacer.")) return;
    menuItems = menuItems.filter((m) => m.id !== plato.id);
    selectedPlato = menuItems[0]?.id || "";
    saveMenu(menuItems);
    showToast("Plato eliminado");
    render();
  });
}

function bindSearch() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
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
