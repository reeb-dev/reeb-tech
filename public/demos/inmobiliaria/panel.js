let items = load();
let cuentas = loadCuentas();
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";

document.getElementById("open-create").addEventListener("click", () => {
  document.getElementById("create").classList.toggle("open");
});

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "departamento");
  const superficie = Number(data.get("superficie") || 0);
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    titulo: String(data.get("titulo") || ""),
    tipo,
    operacion: String(data.get("operacion") || "alquiler"),
    direccion: String(data.get("direccion") || ""),
    barrio: String(data.get("barrio") || ""),
    zona: "Bariloche",
    ambientes: Number(data.get("ambientes") || 0),
    dormitorios: 0,
    banos: 1,
    superficie,
    cubierta: superficie,
    precio: Number(data.get("precio") || 0),
    expensas: Number(data.get("expensas") || 0),
    antiguedad: null,
    orientacion: "",
    piso: "",
    cochera: false,
    amenities: [],
    descripcion: "",
    imagenes: [fotoPorTipo(tipo)],
    destacado: false,
    nuevo: true,
    vistas: 0,
    consultas: 0,
    diasPublicada: 0,
    precioM2Zona: 0,
    status: "disponible",
    cliente: null,
    visitas: [],
    portales: { web: true, ml: false, zonaprop: false, argenprop: false, instagram: false, facebook: false, whatsapp: false },
    history: [{ when: "hoy", text: "Propiedad agregada a la cartera." }]
  };
  items = [item, ...items];
  selected = item.id;
  save(items);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Propiedad agregada");
  render();
});

function visible() {
  let result = filter === "todos" ? items : items.filter((item) => item.status === filter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((item) => 
      item.titulo.toLowerCase().includes(term) || 
      item.direccion.toLowerCase().includes(term) ||
      item.barrio.toLowerCase().includes(term)
    );
  }
  return result;
}

function destinoConectado(id) {
  const dest = DESTINOS.find((d) => d.id === id);
  if (dest?.fijo) return true;
  return Boolean(cuentas[id]?.connected);
}

function renderCuentas() {
  const host = document.getElementById("cuentas");
  if (!host) return;
  host.innerHTML = DESTINOS.map((dest) => {
    const on = destinoConectado(dest.id);
    const publicados = items.filter((item) => portalesDe(item)[dest.id]).length;
    const accion = dest.fijo
      ? `<span class="cuenta-estado on">Siempre activa</span>`
      : `<button type="button" class="ghost cuenta-btn" data-cuenta="${esc(dest.id)}">${on ? "Desconectar" : "Conectar (demo)"}</button>`;
    return `
      <article class="cuenta ${on ? "is-on" : ""}">
        <p class="cuenta-tipo">${dest.tipo === "api" ? "API" : "Red"}</p>
        <h3>${esc(dest.nombre)}</h3>
        <p>${esc(dest.beneficio)}</p>
        <p class="cuenta-meta">${on ? publicados + " aviso" + (publicados === 1 ? "" : "s") + " en este destino" : "Sin conectar"}</p>
        ${accion}
      </article>`;
  }).join("");

  host.querySelectorAll("[data-cuenta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.cuenta;
      const dest = DESTINOS.find((d) => d.id === id);
      if (!dest || dest.fijo) return;
      const next = !destinoConectado(id);
      cuentas = { ...cuentas, [id]: { connected: next } };
      saveCuentas(cuentas);
      if (!next) {
        items = items.map((item) => ({
          ...item,
          portales: { ...portalesDe(item), [id]: false }
        }));
        save(items);
      }
      showToast(next ? dest.nombre + " conectada (demo)" : dest.nombre + " desconectada");
      render();
    });
  });
}

function render() {
  renderCuentas();
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const reservadas = items.filter((i) => i.status === "reservada").length;
  const alquiladas = items.filter((i) => i.status === "alquilada").length;
  const vendidas = items.filter((i) => i.status === "vendida").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>propiedades</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="reservada" class="${filter === "reservada" ? "on" : ""}"><strong>${reservadas}</strong>reservadas</button>
    <button type="button" data-filter="alquilada" class="${filter === "alquilada" ? "on" : ""}"><strong>${alquiladas}</strong>alquiladas</button>
    <button type="button" data-filter="vendida" class="${filter === "vendida" ? "on" : ""}"><strong>${vendidas}</strong>vendidas</button>
    <input class="panel-search" type="text" id="search" placeholder="Buscar zona o dirección" value="${esc(searchTerm)}" aria-label="Buscar">
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
  document.getElementById("rows").innerHTML = rows.map((item) => {
    const foto = (item.imagenes && item.imagenes[0]) || fotoPorTipo(item.tipo);
    return `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td><img class="thumb" src="${esc(foto)}" alt=""></td>
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.titulo)}<br><small style="color:#666">${esc(tipoLabel(item.tipo))} · ${item.superficie || "—"} m² · ${item.ambientes || "—"} amb.</small></td>
      <td>${esc(opLabel(item.operacion))}</td>
      <td>${esc(item.barrio)}</td>
      <td class="amount">${item.operacion === "venta" ? esc(money(item.precio, true)) : esc(money(item.precio))}</td>
      <td class="amount">${Number(item.vistas || 0)}</td>
      <td class="amount">${Number(item.consultas || 0)}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
    </tr>`;
  }).join("") || `<tr><td colspan="9">No hay propiedades en este estado.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => {
      selected = row.dataset.id;
      render();
    });
  });

  const item = items.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!item) {
    detail.innerHTML = "<p>Elegí una propiedad del listado.</p>";
    return;
  }

  const precioStr = item.operacion === "venta" ? money(item.precio, true) : money(item.precio) + " /mes";

  const foto = (item.imagenes && item.imagenes[0]) || fotoPorTipo(item.tipo);
  detail.innerHTML = `
    <p class="eyebrow">${esc(opLabel(item.operacion))} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.titulo)}</h2>
    <p>${esc(item.direccion)}</p>
    <img class="detail-photo" src="${esc(foto)}" alt="${esc(item.titulo)}">
    <div class="meta">
      <div><span>Zona</span>${esc(item.barrio)}</div>
      <div><span>Precio</span>${esc(precioStr)}</div>
      <div><span>Superficie</span>${item.superficie} m²</div>
      <div><span>Ambientes</span>${item.ambientes || "—"}</div>
      ${item.expensas ? `<div><span>Expensas</span>${esc(money(item.expensas))}</div>` : ""}
      ${item.cliente ? `<div><span>Cliente</span>${esc(item.cliente.nombre)}</div>` : ""}
    </div>
    <div class="metric-box">
      <div><span>Visitas al anuncio</span><strong>${Number(item.vistas || 0)}</strong></div>
      <div><span>Consultas</span><strong>${Number(item.consultas || 0)}</strong></div>
    </div>
    <div class="difusion-ficha">
      <h4>Publicar este aviso</h4>
      <p>Elija destinos. La web ya toma la ficha. Portales y redes solo si la cuenta de arriba está conectada.</p>
      ${DESTINOS.map((dest) => {
        const on = dest.fijo ? true : Boolean(portalesDe(item)[dest.id]);
        const lista = destinoConectado(dest.id);
        const disabled = dest.fijo || !lista;
        return `
          <label class="destino-row ${disabled && !dest.fijo ? "is-off" : ""}">
            <input type="checkbox" data-portal="${esc(dest.id)}" ${on ? "checked" : ""} ${disabled ? "disabled" : ""}>
            <span>
              <strong>${esc(dest.nombre)}</strong>
              <small>${dest.fijo ? "Siempre en la vitrina" : lista ? (dest.tipo === "red" ? "Texto y enlace listos" : "Listo para enviar (demo)") : "Conecte la cuenta arriba"}</small>
            </span>
          </label>`;
      }).join("")}
      <div class="difusion-acciones">
        <button class="ghost" type="button" id="copiar-aviso">Copiar texto para redes</button>
        <a class="ghost" id="wa-aviso" href="${esc("https://wa.me/?text=" + encodeURIComponent(textoRed(item)))}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
      </div>
    </div>
    
    ${item.factura ? `
      <div class="factura-box">
        <h4>✅ Operación facturada</h4>
        <div><strong>Tipo:</strong> ${esc(compLabel(item.factura.tipo))}</div>
        <div><strong>Número:</strong> ${esc(item.factura.numero)}</div>
        <div><strong>Total:</strong> ${item.factura.total > 100000 ? money(item.factura.total, true) : money(item.factura.total)}</div>
        <div><strong>CAE:</strong> <span class="cae">${esc(item.factura.cae)}</span></div>
        <div><strong>Vto CAE:</strong> ${esc(item.factura.vto)}</div>
      </div>
    ` : `
      <div class="arca-section">
        <h4>🧾 Facturación ARCA</h4>
        <label>CUIT cliente<input id="arca-cuit" placeholder="20-12345678-9"></label>
        <label>Tipo comprobante
          <select id="arca-tipo">
            ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
          </select>
        </label>
        <label>Concepto
          <select id="arca-concepto">
            <option value="alquiler">Alquiler mensual</option>
            <option value="comision">Comisión de venta</option>
            <option value="reserva">Reserva</option>
            <option value="expensas">Expensas</option>
          </select>
        </label>
        <button class="btn-panel" type="button" id="emitir-factura" style="margin-top:10px;">
          Emitir factura (simulado)
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:8px;">Demo: genera CAE simulado. En producción se conecta a ARCA/AFIP.</p>
      </div>
    `}
    
    <form id="edit">
      <label>Código<input name="codigo" value="${esc(item.codigo)}"></label>
      <label>Título<input name="titulo" value="${esc(item.titulo)}"></label>
      <label>Tipo
        <select name="tipo">
          ${TIPOS.map((t) => `<option value="${t.id}" ${item.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
        </select>
      </label>
      <label>Operación
        <select name="operacion">
          ${OPERACIONES.map((o) => `<option value="${o.id}" ${item.operacion === o.id ? "selected" : ""}>${esc(o.label)}</option>`).join("")}
        </select>
      </label>
      <label>Dirección<input name="direccion" value="${esc(item.direccion)}"></label>
      <label>Zona<input name="barrio" value="${esc(item.barrio)}"></label>
      <label>Ambientes<input name="ambientes" type="number" value="${item.ambientes}"></label>
      <label>Superficie m²<input name="superficie" type="number" value="${item.superficie}"></label>
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Expensas<input name="expensas" type="number" value="${item.expensas}"></label>
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Eliminar</button>
      </div>
    </form>
    ${(item.visitas || []).length > 0 ? `
      <div class="visitas">
        <h3>Visitas presenciales</h3>
        ${item.visitas.map((v) => `
          <div class="visita-item">
            <strong>${esc(v.fecha)}</strong> — ${esc(v.cliente)}<br>
            <small>${esc(v.nota)}</small>
          </div>
        `).join("")}
      </div>
    ` : ""}
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
    
    const total = concepto === "comision" ? Math.round(item.precio * 0.03) : 
                  concepto === "alquiler" ? item.precio : 
                  concepto === "reserva" ? Math.round(item.precio * 0.1) : item.expensas || 0;

    item.factura = { tipo, numero, cae, vto, total, cuit, concepto };
    item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
    save(items);
    showToast("Factura emitida");
    render();
  });

  detail.querySelectorAll("[data-portal]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.portal;
      const dest = DESTINOS.find((d) => d.id === id);
      if (!dest || dest.fijo || !destinoConectado(id)) {
        input.checked = Boolean(portalesDe(item)[id]);
        return;
      }
      item.portales = { ...portalesDe(item), [id]: input.checked };
      item.history = [{
        when: "hoy",
        text: input.checked ? "Publicado en " + dest.nombre + " (demo)." : "Sacado de " + dest.nombre + "."
      }, ...(item.history || [])];
      save(items);
      showToast(input.checked ? "Publicado en " + dest.nombre + " (demo)" : "Sacado de " + dest.nombre);
      render();
    });
  });

  detail.querySelector("#copiar-aviso")?.addEventListener("click", async () => {
    const texto = textoRed(item);
    try {
      await navigator.clipboard.writeText(texto);
      showToast("Texto copiado");
    } catch {
      showToast("No se pudo copiar. Seleccione el texto a mano.");
    }
  });

  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const prevStatus = item.status;
    const newStatus = String(data.get("status") || item.status);

    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      titulo: String(data.get("titulo") || ""),
      tipo: String(data.get("tipo") || "departamento"),
      operacion: String(data.get("operacion") || "alquiler"),
      direccion: String(data.get("direccion") || ""),
      barrio: String(data.get("barrio") || ""),
      ambientes: Number(data.get("ambientes") || 0),
      superficie: Number(data.get("superficie") || 0),
      precio: Number(data.get("precio") || 0),
      expensas: Number(data.get("expensas") || 0),
      status: newStatus
    });

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado cambiado a: ${label(newStatus)}.` }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Ficha actualizada." }, ...(item.history || [])];
    }

    save(items);
    showToast("Cambios guardados");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showToast("Propiedad eliminada");
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

function wireNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Cerrar" : "Menú";
  });
}

wireNav();
render();
