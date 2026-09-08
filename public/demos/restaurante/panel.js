let menuItems = loadMenu();
let mesasData = loadMesas();
let pedidosData = loadPedidos();
let tab = "mesas";
let selectedMesa = mesasData[0]?.id || "";

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    tab = btn.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    render();
  });
});

function render() {
  if (tab === "mesas") renderMesas();
  else if (tab === "cocina") renderCocina();
  else renderMenu();
}

function renderMesas() {
  const libres = mesasData.filter((m) => m.status === "libre").length;
  const ocupadas = mesasData.filter((m) => m.status === "ocupada").length;
  const reservadas = mesasData.filter((m) => m.status === "reservada").length;

  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>${mesasData.length}</strong>mesas</div>
    <div style="border-color:#22c55e;"><strong>${libres}</strong>libres</div>
    <div style="border-color:var(--rojo);"><strong>${ocupadas}</strong>ocupadas</div>
    <div style="border-color:var(--dorado);"><strong>${reservadas}</strong>reservadas</div>
  `;

  document.getElementById("list-area").innerHTML = `
    <div class="mesas-grid">
      ${mesasData.map((m) => `
        <div class="mesa-card ${esc(m.status)} ${m.id === selectedMesa ? "on" : ""}" data-id="${esc(m.id)}" style="cursor:pointer;">
          <div class="numero">${m.numero}</div>
          <div class="cap">${m.capacidad} pers. ${m.mozo ? `· ${esc(m.mozo)}` : ""}</div>
          <div class="status"><span class="tag ${esc(m.status)}">${esc(labelMesa(m.status))}</span></div>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".mesa-card").forEach((card) => {
    card.addEventListener("click", () => { selectedMesa = card.dataset.id; render(); });
  });

  const mesa = mesasData.find((m) => m.id === selectedMesa);
  const detail = document.getElementById("detail");
  if (!mesa) { detail.innerHTML = "<p>Elegí una mesa.</p>"; return; }

  const pedido = getPedidoByMesa(mesa.id);
  const total = pedido ? calcTotalPedido(pedido) : 0;

  detail.innerHTML = `
    <p class="eyebrow">Mesa ${mesa.numero}</p>
    <h2>${esc(labelMesa(mesa.status))}</h2>
    <div class="meta">
      <div><span>Capacidad</span>${mesa.capacidad} personas</div>
      <div><span>Mozo</span>${esc(mesa.mozo) || "Sin asignar"}</div>
      ${pedido ? `<div><span>Abierta</span>${esc(pedido.horaApertura)}</div>` : ""}
      ${mesa.reserva ? `<div><span>Reserva</span>${esc(mesa.reserva.nombre)} · ${esc(mesa.reserva.hora)}</div>` : ""}
    </div>

    ${mesa.status === "libre" ? `
      <div class="actions">
        <button class="btn-panel" id="abrir-mesa">Abrir mesa</button>
      </div>
    ` : ""}

    ${pedido ? `
      <h3 style="font-size:14px;margin-top:16px;">Comanda</h3>
      <div class="comanda">
        ${pedido.items.map((item) => {
          const menuItem = getMenuItem(item.menu);
          return `<div class="comanda-item">
            <div>
              <span class="nombre">${esc(menuItem?.nombre || "—")} x${item.cantidad}</span>
              ${item.nota ? `<div class="nota">${esc(item.nota)}</div>` : ""}
            </div>
            <div>
              <span class="tag ${esc(item.status)}">${esc(labelPedido(item.status))}</span>
              <span style="margin-left:8px;">${esc(money((menuItem?.precio || 0) * item.cantidad))}</span>
            </div>
          </div>`;
        }).join("")}
      </div>
      <div style="text-align:right;font-size:18px;font-weight:700;margin:12px 0;">
        Total: ${esc(money(total))}
      </div>

      <label>Agregar plato</label>
      <select id="agregar-plato">
        <option value="">— Seleccionar —</option>
        ${menuItems.filter(m => m.disponible).map((m) => `<option value="${m.id}">${esc(m.nombre)} - ${esc(money(m.precio))}</option>`).join("")}
      </select>
      <button class="ghost" id="btn-agregar" style="margin-top:6px;">+ Agregar</button>
    ` : ""}

    ${pedido && !pedido.factura ? `
      <div class="arca-section">
        <h4>🧾 Cerrar mesa con ARCA</h4>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <button class="btn-panel" type="button" id="cerrar-mesa" style="margin-top:10px;">
          Cobrar y cerrar (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado.</p>
      </div>
    ` : ""}

    ${pedido?.factura ? `
      <div class="factura-box">
        <h4>✓ Mesa cerrada</h4>
        <p><strong>${esc(compLabel(pedido.factura.tipo))}</strong> ${esc(pedido.factura.numero)}</p>
        <p>CAE: <span class="cae">${esc(pedido.factura.cae)}</span></p>
        <p>Total: ${esc(money(pedido.factura.total))}</p>
        <button class="ghost" id="liberar-mesa" style="margin-top:8px;">Liberar mesa</button>
      </div>
    ` : ""}
  `;

  detail.querySelector("#abrir-mesa")?.addEventListener("click", () => {
    mesa.status = "ocupada";
    mesa.mozo = "Carlos";
    const nuevoPedido = {
      id: crypto.randomUUID(),
      mesa: mesa.id,
      items: [],
      horaApertura: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      mozo: mesa.mozo,
      factura: null
    };
    pedidosData.push(nuevoPedido);
    saveMesas();
    savePedidos();
    showToast("Mesa abierta");
    render();
  });

  detail.querySelector("#btn-agregar")?.addEventListener("click", () => {
    const platoId = detail.querySelector("#agregar-plato").value;
    if (!platoId || !pedido) return;
    pedido.items.push({ menu: platoId, cantidad: 1, status: "pendiente", nota: "" });
    savePedidos();
    showToast("Plato agregado");
    render();
  });

  detail.querySelector("#cerrar-mesa")?.addEventListener("click", () => {
    const tipo = detail.querySelector("#arca-tipo").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

    pedido.factura = { tipo, numero, cae, vto, total };
    mesa.status = "cuenta";
    savePedidos();
    saveMesas();
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#liberar-mesa")?.addEventListener("click", () => {
    mesa.status = "libre";
    mesa.mozo = null;
    saveMesas();
    showToast("Mesa liberada");
    render();
  });
}

function renderCocina() {
  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>Cocina</strong>Pedidos pendientes</div>
  `;

  const pendientes = [];
  pedidosData.forEach((p) => {
    if (p.factura) return;
    const mesa = getMesa(p.mesa);
    p.items.forEach((item, idx) => {
      if (item.status === "pendiente" || item.status === "preparando") {
        const menuItem = getMenuItem(item.menu);
        pendientes.push({ pedido: p, item, idx, mesa, menuItem });
      }
    });
  });

  document.getElementById("list-area").innerHTML = `
    <div style="padding-bottom:20px;">
      ${pendientes.length === 0 ? "<p>No hay pedidos pendientes en cocina.</p>" : ""}
      ${pendientes.map((p) => `
        <div class="cocina-item ${p.item.status === "listo" ? "listo" : ""}" data-pedido="${esc(p.pedido.id)}" data-idx="${p.idx}">
          <div class="mesa">Mesa ${p.mesa?.numero || "?"} · ${esc(p.pedido.mozo)}</div>
          <div class="items">
            <strong>${esc(p.menuItem?.nombre || "—")} x${p.item.cantidad}</strong>
            ${p.item.nota ? ` · <em>${esc(p.item.nota)}</em>` : ""}
          </div>
          <div style="margin-top:8px;">
            <span class="tag ${esc(p.item.status)}">${esc(labelPedido(p.item.status))}</span>
            ${p.item.status === "pendiente" ? `<button class="ghost" data-action="preparando" style="margin-left:8px;">Preparando</button>` : ""}
            ${p.item.status === "preparando" ? `<button class="ghost" data-action="listo" style="margin-left:8px;">Listo</button>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".cocina-item button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.closest(".cocina-item");
      const pedidoId = parent.dataset.pedido;
      const idx = parseInt(parent.dataset.idx);
      const action = btn.dataset.action;
      const pedido = pedidosData.find((p) => p.id === pedidoId);
      if (pedido && pedido.items[idx]) {
        pedido.items[idx].status = action;
        savePedidos();
        render();
      }
    });
  });

  document.getElementById("detail").innerHTML = `
    <h2>Cocina</h2>
    <p style="color:var(--muted);">Vista de cocina: pedidos pendientes de preparación.</p>
    <p style="margin-top:20px;">Hacé clic en "Preparando" o "Listo" para cambiar el estado del plato.</p>
  `;
}

function renderMenu() {
  document.getElementById("stats").innerHTML = `
    <div class="on"><strong>${menuItems.length}</strong>platos</div>
    <div><strong>${menuItems.filter(m => m.disponible).length}</strong>disponibles</div>
  `;

  document.getElementById("list-area").innerHTML = `
    <table>
      <thead><tr><th>Código</th><th>Plato</th><th>Categoría</th><th class="amount">Precio</th><th>Disp.</th></tr></thead>
      <tbody>
        ${menuItems.map((m) => `
          <tr>
            <td>${esc(m.codigo)}</td>
            <td>${esc(m.nombre)}</td>
            <td>${esc(catLabel(m.categoria))}</td>
            <td class="amount">${esc(money(m.precio))}</td>
            <td>${m.disponible ? "✓" : "✗"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  document.getElementById("detail").innerHTML = `
    <h2>Menú</h2>
    <p style="color:var(--muted);">Carta del restaurante con precios y disponibilidad.</p>
  `;
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
