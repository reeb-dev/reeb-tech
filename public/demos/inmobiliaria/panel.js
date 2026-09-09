let items = load();
let cuentas = loadCuentas();
let cola = loadCola();
let staff = loadUsers();
let session = null;
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let createDraftFotos = [];
let currentView = "resumen";
let loadingTimer = 0;
const MAX_FOTOS = 6;
const PANEL_VIEWS = ["resumen", "cartera", "vitrina", "difusion", "usuarios", "contacto"];

document.getElementById("open-create").addEventListener("click", () => {
  if (session?.rol === "agenda") {
    showToast("La agenda no carga propiedades. Eso lo hace un agente o el titular.");
    return;
  }
  showPanelView("cartera", { instant: true });
  document.getElementById("create").classList.toggle("open");
});

function fotosDeItem(item) {
  const list = (item?.imagenes || []).filter(Boolean);
  return list.length ? list : [fotoPorTipo(item?.tipo)];
}

function persistCartera() {
  try {
    save(items);
    return true;
  } catch {
    showToast("Las fotos ocupan demasiado para esta demo. Quite alguna o use una más chica.");
    return false;
  }
}

function comprimirFoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("no-image"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1100;
      let w = img.width;
      let h = img.height;
      if (w > max || h > max) {
        const scale = Math.min(max / w, max / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

async function leerArchivosFoto(fileList, cupo) {
  const files = [...(fileList || [])].filter((file) => String(file.type || "").startsWith("image/")).slice(0, Math.max(0, cupo));
  const out = [];
  for (const file of files) {
    try {
      out.push(await comprimirFoto(file));
    } catch {
      /* archivo no usable */
    }
  }
  return out;
}

function pintarCreatePreview() {
  const host = document.getElementById("create-fotos-preview");
  if (!host) return;
  host.innerHTML = createDraftFotos.map((src, i) => `
    <figure class="foto-thumb ${i === 0 ? "is-portada" : ""}">
      <img src="${esc(src)}" alt="Foto ${i + 1}">
      ${i === 0 ? "<figcaption>Portada</figcaption>" : ""}
      <div class="foto-thumb-actions">
        ${i > 0 ? `<button type="button" data-create-portada="${i}">Portada</button>` : ""}
        <button type="button" data-create-quitar="${i}">Quitar</button>
      </div>
    </figure>`).join("");
  host.querySelectorAll("[data-create-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      createDraftFotos = createDraftFotos.filter((_, idx) => idx !== Number(btn.dataset.createQuitar));
      pintarCreatePreview();
    });
  });
  host.querySelectorAll("[data-create-portada]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.createPortada);
      const picked = createDraftFotos.splice(i, 1)[0];
      createDraftFotos = [picked, ...createDraftFotos];
      pintarCreatePreview();
    });
  });
}

document.getElementById("create-fotos")?.addEventListener("change", async (event) => {
  const extra = await leerArchivosFoto(event.target.files, MAX_FOTOS - createDraftFotos.length);
  createDraftFotos = [...createDraftFotos, ...extra].slice(0, MAX_FOTOS);
  pintarCreatePreview();
  event.target.value = "";
});

function zonaOptions(selected) {
  const ids = ZONAS.map((z) => z.id);
  const extra = selected && !ids.includes(selected)
    ? `<option value="${esc(selected)}" selected>${esc(selected)}</option>`
    : "";
  return extra + ZONAS.map((z) => `<option value="${esc(z.id)}" ${selected === z.id ? "selected" : ""}>${esc(z.nombre)}</option>`).join("");
}

function htmlGaleria(fotos) {
  return `
    <div class="foto-editor">
      <p class="eyebrow">Fotos de la vitrina</p>
      <div class="foto-thumbs">
        ${fotos.map((src, i) => `
          <figure class="foto-thumb ${i === 0 ? "is-portada" : ""}">
            <img src="${esc(src)}" alt="Foto ${i + 1}">
            ${i === 0 ? "<figcaption>Portada</figcaption>" : ""}
            <div class="foto-thumb-actions">
              ${i > 0 ? `<button type="button" data-portada="${i}">Portada</button>` : ""}
              <button type="button" data-quitar="${i}">Quitar</button>
            </div>
          </figure>`).join("")}
      </div>
      <label class="foto-cargar">Cargar fotos<input type="file" accept="image/*" multiple data-add-fotos></label>
      <p class="create-fotos-hint">La primera es la portada del aviso. Hasta ${MAX_FOTOS} fotos; salen en la galería de la ficha.</p>
    </div>`;
}

function aplicarFotos(item, next) {
  const prev = [...(item.imagenes || [])];
  const prevHistory = item.history;
  item.imagenes = next.length ? next : [fotoPorTipo(item.tipo)];
  item.history = [{ when: "hoy", text: "Fotos de la vitrina actualizadas." }, ...(item.history || [])];
  if (!persistCartera()) {
    item.imagenes = prev;
    item.history = prevHistory;
    return false;
  }
  return true;
}

function wireFotoEditor(root, item) {
  root.querySelector("[data-add-fotos]")?.addEventListener("change", async (event) => {
    const extra = await leerArchivosFoto(event.target.files, MAX_FOTOS - fotosDeItem(item).length);
    event.target.value = "";
    if (!extra.length) return;
    if (aplicarFotos(item, [...fotosDeItem(item), ...extra].slice(0, MAX_FOTOS))) {
      showToast("Fotos actualizadas en la vitrina");
      render();
    }
  });
  root.querySelectorAll("[data-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = fotosDeItem(item).filter((_, idx) => idx !== Number(btn.dataset.quitar));
      if (aplicarFotos(item, next)) {
        showToast("Foto quitada");
        render();
      }
    });
  });
  root.querySelectorAll("[data-portada]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = fotosDeItem(item).slice();
      const picked = list.splice(Number(btn.dataset.portada), 1)[0];
      if (aplicarFotos(item, [picked, ...list])) {
        showToast("Esa foto es la portada de la vitrina");
        render();
      }
    });
  });
}

document.getElementById("create").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (session?.rol === "agenda") return;
  const data = new FormData(event.target);
  const tipo = String(data.get("tipo") || "departamento");
  const superficie = Number(data.get("superficie") || 0);
  const cubierta = Number(data.get("cubierta") || 0);
  let imagenes = createDraftFotos.filter(Boolean);
  if (!imagenes.length) {
    imagenes = await leerArchivosFoto(event.target.fotos?.files, MAX_FOTOS);
  }
  if (!imagenes.length) imagenes = [fotoPorTipo(tipo)];
  const barrio = String(data.get("barrio") || "Centro");
  const item = {
    id: crypto.randomUUID(),
    codigo: String(data.get("codigo") || ""),
    titulo: String(data.get("titulo") || ""),
    tipo,
    operacion: String(data.get("operacion") || "alquiler"),
    direccion: String(data.get("direccion") || ""),
    barrio,
    zona: barrio === "El Bolsón" ? "El Bolsón" : "Bariloche",
    ambientes: Number(data.get("ambientes") || 0),
    dormitorios: Number(data.get("dormitorios") || 0),
    banos: Number(data.get("banos") || 1),
    superficie,
    cubierta: cubierta || superficie,
    precio: Number(data.get("precio") || 0),
    expensas: Number(data.get("expensas") || 0),
    antiguedad: null,
    orientacion: "",
    piso: "",
    cochera: false,
    amenities: [],
    descripcion: String(data.get("descripcion") || ""),
    imagenes,
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
  const prevItems = items;
  items = [item, ...items];
  selected = item.id;
  if (!persistCartera()) {
    items = prevItems;
    selected = items[0]?.id || "";
    return;
  }
  createDraftFotos = [];
  pintarCreatePreview();
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Propiedad agregada. Ya sale en la vitrina.");
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

function canEditDifusion() {
  return session?.rol === "titular" || session?.rol === "agente";
}

function cuentaDe(id) {
  return cuentas[id] || { connected: false, lastAction: "Sin conectar", lastAt: "" };
}

function setCuentaAccion(id, connected, text) {
  const prev = cuentaDe(id);
  cuentas = {
    ...cuentas,
    [id]: {
      ...prev,
      connected,
      lastAction: text,
      lastAt: ahoraDemo()
    }
  };
  saveCuentas(cuentas);
}

function avisosEnDestino(destId) {
  return items.filter((item) => portalesDe(item)[destId]).length;
}

function htmlCuenta(dest) {
  const on = destinoConectado(dest.id);
  const publicados = avisosEnDestino(dest.id);
  const meta = cuentaDe(dest.id);
  const last = meta.lastAction
    ? `Última acción: ${esc(meta.lastAction)}${meta.lastAt ? " · " + esc(meta.lastAt) : ""}`
    : "Sin movimientos todavía.";
  const editable = canEditDifusion();
  const accion = dest.fijo
    ? `<span class="cuenta-estado on">Siempre activa</span>`
    : `<button type="button" class="ghost cuenta-btn" data-cuenta="${esc(dest.id)}" ${editable ? "" : "disabled"}>${on ? "Desconectar" : "Conectar (demo)"}</button>`;
  return `
    <article class="cuenta ${on ? "is-on" : ""}">
      <p class="cuenta-tipo">${esc(destTipoLabel(dest))}</p>
      <h3>${esc(dest.nombre)}</h3>
      <p>${esc(dest.beneficio)}</p>
      <p class="cuenta-meta">${on ? publicados + " aviso" + (publicados === 1 ? "" : "s") + " de la cartera en este destino" : "Sin conectar"}</p>
      <p class="cuenta-accion">${last}</p>
      ${accion}
    </article>`;
}

function filasCola() {
  const filas = [];
  items.forEach((item) => {
    DESTINOS.forEach((dest) => {
      if (dest.fijo) return;
      const key = colaClave(item.id, dest.id);
      const saved = cola[key];
      const publicadoFlag = Boolean(portalesDe(item)[dest.id]);
      if (!saved && !publicadoFlag) return;
      let estado = saved?.estado;
      if (!estado) estado = publicadoFlag ? "publicado" : "listo";
      filas.push({
        key,
        item,
        dest,
        estado,
        when: saved?.when || (publicadoFlag ? "en cartera" : "")
      });
    });
  });
  return filas;
}

function setColaEstado(itemId, destId, estado) {
  if (!canEditDifusion()) return;
  const dest = DESTINOS.find((d) => d.id === destId);
  const item = items.find((i) => i.id === itemId);
  if (!dest || !item || dest.fijo) return;
  if (!COLA_ESTADOS.some((e) => e.id === estado)) return;
  if (!destinoConectado(destId) && estado !== "listo") {
    showToast("Conecte la cuenta de " + dest.nombre + " antes de programar o publicar.");
    return;
  }
  cola = {
    ...cola,
    [colaClave(itemId, destId)]: { estado, when: ahoraDemo() }
  };
  saveCola(cola);
  const nextOn = estado === "publicado";
  items = items.map((row) => row.id !== itemId ? row : {
    ...row,
    portales: { ...portalesDe(row), [destId]: nextOn },
    history: [{
      when: "hoy",
      text: nextOn
        ? dest.nombre + " marcado como publicado (demo). No se envió nada afuera."
        : dest.nombre + " quedó en " + colaEstadoLabel(estado) + " (demo)."
    }, ...(row.history || [])]
  });
  save(items);
  setCuentaAccion(destId, true, "Aviso " + item.codigo + ": " + colaEstadoLabel(estado).toLowerCase() + " (demo).");
  showToast("Cola actualizada. Nada se publicó afuera.");
  renderDifusion();
  if (currentView === "cartera") render();
}

function quitarDeCola(itemId, destId) {
  if (!canEditDifusion()) return;
  const dest = DESTINOS.find((d) => d.id === destId);
  if (!dest || dest.fijo) return;
  const next = { ...cola };
  delete next[colaClave(itemId, destId)];
  cola = next;
  saveCola(cola);
  items = items.map((row) => row.id !== itemId ? row : {
    ...row,
    portales: { ...portalesDe(row), [destId]: false }
  });
  save(items);
  showToast("Salida de la cola. El aviso sigue en la cartera.");
  renderDifusion();
}

function agregarACola(itemId, destId) {
  if (!canEditDifusion()) return;
  const dest = DESTINOS.find((d) => d.id === destId);
  const item = items.find((i) => i.id === itemId);
  if (!dest || !item || dest.fijo) return;
  if (!destinoConectado(destId)) {
    showToast("Conecte primero la cuenta de " + dest.nombre + ".");
    return;
  }
  const key = colaClave(itemId, destId);
  if (cola[key] || portalesDe(item)[destId]) {
    showToast("Ese aviso ya está en este destino.");
    return;
  }
  cola = { ...cola, [key]: { estado: "listo", when: ahoraDemo() } };
  saveCola(cola);
  setCuentaAccion(destId, true, "Aviso " + item.codigo + " agregado a la cola (demo).");
  showToast("Aviso en cola como listo. No se envió nada afuera.");
  renderDifusion();
}

function htmlGrupoCuentas(grupo, titulo, texto) {
  const destinos = destinosPorGrupo(grupo);
  return `
    <section class="difusion-grupo">
      <div class="difusion-grupo-head">
        <h2>${esc(titulo)}</h2>
        <p>${esc(texto)}</p>
      </div>
      <div class="cuentas">${destinos.map(htmlCuenta).join("")}</div>
    </section>`;
}

function renderDifusion() {
  const host = document.getElementById("difusion-desk");
  if (!host) return;
  const editable = canEditDifusion();
  const filas = filasCola();
  const destinosCola = DESTINOS.filter((d) => !d.fijo && destinoConectado(d.id));
  const shareItem = items.find((i) => i.id === selected) || items[0];
  const shareText = shareItem ? textoRed(shareItem) : "";
  host.innerHTML = `
    ${htmlGrupoCuentas("sitio", "Sitios y portales", "Vitrina propia y portales de inmuebles de esta demo. Conectar no envía el aviso: es una marca de ejemplo.")}
    ${htmlGrupoCuentas("red", "Redes sociales", "Instagram, Facebook y WhatsApp. Acá se arma el texto; usted lo pega o lo envía a mano. No hay publicación automática.")}
    <section class="difusion-cola">
      <div class="difusion-grupo-head">
        <h2>Cola de publicación</h2>
        <p>Sitio propio: ${items.length} propiedades de esta cartera salen en la vitrina. Abajo, portales y redes. Estados de ejemplo: listo, programado o publicado. No hay alcance ni seguidores inventados. Publicado, en esta demo, solo marca el aviso: no sale afuera.</p>
      </div>
      ${editable && destinosCola.length ? `
        <form class="cola-alta" id="cola-alta">
          <select name="item" aria-label="Propiedad">
            ${items.map((item) => `<option value="${esc(item.id)}" ${item.id === selected ? "selected" : ""}>${esc(item.codigo)} · ${esc(item.titulo)}</option>`).join("")}
          </select>
          <select name="dest" aria-label="Destino">
            ${destinosCola.map((d) => `<option value="${esc(d.id)}">${esc(d.nombre)}</option>`).join("")}
          </select>
          <button class="btn-panel" type="submit">Agregar a la cola</button>
        </form>` : editable ? `<p class="cola-vacia">Conecte un portal o una red para armar la cola.</p>` : `<p class="cola-vacia">La agenda puede ver la cola. Un agente o el titular la arma.</p>`}
      <div class="table-scroll">
        <table class="cola-tabla">
          <thead>
            <tr>
              <th>Aviso</th>
              <th>Destino</th>
              <th>Estado</th>
              <th>Cuándo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${filas.length ? filas.map((fila) => `
              <tr>
                <td>${esc(fila.item.codigo)}<br><small>${esc(fila.item.titulo)}</small></td>
                <td>${esc(fila.dest.nombre)}<br><small>${esc(destTipoLabel(fila.dest))}</small></td>
                <td>
                  ${fila.dest.fijo || !editable
                    ? `<span class="tag cola-${esc(fila.estado)}">${esc(colaEstadoLabel(fila.estado))}</span>`
                    : `<select data-cola-estado="${esc(fila.item.id)}" data-dest="${esc(fila.dest.id)}" aria-label="Estado">
                        ${COLA_ESTADOS.map((e) => `<option value="${esc(e.id)}" ${fila.estado === e.id ? "selected" : ""}>${esc(e.label)}</option>`).join("")}
                      </select>`}
                </td>
                <td>${esc(fila.when || "—")}</td>
                <td>${fila.dest.fijo || !editable ? "" : `<button type="button" class="ghost" data-cola-quitar="${esc(fila.item.id)}" data-dest="${esc(fila.dest.id)}">Sacar</button>`}</td>
              </tr>`).join("") : `<tr><td colspan="5">No hay avisos en cola todavía. En la vitrina el sitio propio ya muestra la cartera.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
    <section class="difusion-share">
      <div class="difusion-grupo-head">
        <h2>Texto para redes</h2>
        <p>El mismo texto de la ficha. Cópielo o ábralo en WhatsApp. No se publica solo.</p>
      </div>
      <label>Aviso de la cartera
        <select id="difusion-share-item">
          ${items.map((item) => `<option value="${esc(item.id)}" ${shareItem && item.id === shareItem.id ? "selected" : ""}>${esc(item.codigo)} · ${esc(item.titulo)}</option>`).join("")}
        </select>
      </label>
      <textarea id="difusion-share-text" rows="5" readonly>${esc(shareText)}</textarea>
      <div class="difusion-acciones">
        <button class="btn-panel" type="button" id="difusion-copiar" ${shareItem ? "" : "disabled"}>Copiar texto</button>
        <a class="ghost" id="difusion-wa" ${shareItem ? `href="${esc("https://wa.me/?text=" + encodeURIComponent(shareText))}"` : ""} target="_blank" rel="noopener">Abrir WhatsApp</a>
        <button class="ghost" type="button" data-panel-nav="cartera">Ver ficha en cartera</button>
      </div>
    </section>`;

  host.querySelectorAll("[data-cuenta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!canEditDifusion()) return;
      const id = btn.dataset.cuenta;
      const dest = DESTINOS.find((d) => d.id === id);
      if (!dest || dest.fijo) return;
      const next = !destinoConectado(id);
      setCuentaAccion(
        id,
        next,
        next ? "Cuenta conectada (demo). No se envió nada afuera." : "Cuenta desconectada. Los avisos de este destino se apagaron."
      );
      if (!next) {
        items = items.map((item) => ({
          ...item,
          portales: { ...portalesDe(item), [id]: false }
        }));
        save(items);
        const nextCola = { ...cola };
        Object.keys(nextCola).forEach((key) => {
          if (key.endsWith(":" + id)) delete nextCola[key];
        });
        cola = nextCola;
        saveCola(cola);
      }
      showToast(next ? dest.nombre + " conectada (demo)" : dest.nombre + " desconectada");
      renderDifusion();
    });
  });

  host.querySelector("#cola-alta")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    agregarACola(String(data.get("item") || ""), String(data.get("dest") || ""));
  });

  host.querySelectorAll("[data-cola-estado]").forEach((select) => {
    select.addEventListener("change", () => {
      setColaEstado(select.dataset.colaEstado, select.dataset.dest, select.value);
    });
  });

  host.querySelectorAll("[data-cola-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => quitarDeCola(btn.dataset.colaQuitar, btn.dataset.dest));
  });

  host.querySelector("#difusion-share-item")?.addEventListener("change", (event) => {
    selected = event.target.value;
    renderDifusion();
  });

  host.querySelector("#difusion-copiar")?.addEventListener("click", async () => {
    const item = items.find((i) => i.id === selected) || items[0];
    if (!item) return;
    try {
      await navigator.clipboard.writeText(textoRed(item));
      showToast("Texto copiado");
    } catch {
      showToast("No se pudo copiar. Seleccione el texto a mano.");
    }
  });

  host.querySelector("[data-panel-nav='cartera']")?.addEventListener("click", () => {
    showPanelView("cartera");
  });
}

function renderCuentas() {
  renderDifusion();
}

function render() {
  if (currentView === "difusion") renderDifusion();
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
    const foto = fotosDeItem(item)[0];
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
    detail.innerHTML = "<p>Elija una propiedad del listado.</p>";
    return;
  }

  const precioStr = item.operacion === "venta" ? money(item.precio, true) : money(item.precio) + " /mes";

  const fotos = fotosDeItem(item);
  const foto = fotos[0];
  detail.innerHTML = `
    <p class="eyebrow">${esc(opLabel(item.operacion))} · ${esc(tipoLabel(item.tipo))}</p>
    <h2>${esc(item.titulo)}</h2>
    <p>${esc(item.direccion)}</p>
    <img class="detail-photo" src="${esc(foto)}" alt="${esc(item.titulo)}">
    ${htmlGaleria(fotos)}
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
      <p>Elija destinos. El sitio propio siempre toma la ficha. Portales y redes solo si la cuenta está conectada en Difusión. Demo: no se envía nada afuera.</p>
      <p class="difusion-ficha-grupo">Sitios y portales</p>
      ${DESTINOS.filter((d) => d.grupo !== "red").map((dest) => {
        const on = dest.fijo ? true : Boolean(portalesDe(item)[dest.id]);
        const lista = destinoConectado(dest.id);
        const disabled = dest.fijo || !lista;
        return `
          <label class="destino-row ${disabled && !dest.fijo ? "is-off" : ""}">
            <input type="checkbox" data-portal="${esc(dest.id)}" ${on ? "checked" : ""} ${disabled ? "disabled" : ""}>
            <span>
              <strong>${esc(dest.nombre)}</strong>
              <small>${dest.fijo ? "Siempre en la vitrina" : lista ? "Listo para enviar (demo)" : "Conecte la cuenta en Difusión"}</small>
            </span>
          </label>`;
      }).join("")}
      <p class="difusion-ficha-grupo">Redes sociales</p>
      ${DESTINOS.filter((d) => d.grupo === "red").map((dest) => {
        const on = Boolean(portalesDe(item)[dest.id]);
        const lista = destinoConectado(dest.id);
        const disabled = !lista;
        return `
          <label class="destino-row ${disabled ? "is-off" : ""}">
            <input type="checkbox" data-portal="${esc(dest.id)}" ${on ? "checked" : ""} ${disabled ? "disabled" : ""}>
            <span>
              <strong>${esc(dest.nombre)}</strong>
              <small>${lista ? "Texto y enlace listos. No se publica solo." : "Conecte la cuenta en Difusión"}</small>
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
      <label>Zona
        <select name="barrio">${zonaOptions(item.barrio)}</select>
      </label>
      <label>Ambientes<input name="ambientes" type="number" value="${item.ambientes || 0}"></label>
      <label>Dormitorios<input name="dormitorios" type="number" value="${item.dormitorios || 0}"></label>
      <label>Baños<input name="banos" type="number" value="${item.banos || 0}"></label>
      <label>m² cubiertos<input name="cubierta" type="number" value="${item.cubierta || 0}"></label>
      <label>m² de lote<input name="superficie" type="number" value="${item.superficie || 0}"></label>
      <label>Piso<input name="piso" value="${esc(item.piso || "")}"></label>
      <label>Vista<input name="vista" value="${esc(item.vista || "")}"></label>
      <label>Calefacción<input name="calefaccion" value="${esc(item.calefaccion || "")}"></label>
      <label>Servicios<input name="servicios" value="${esc(item.servicios || "")}"></label>
      <label>Precio<input name="precio" type="number" value="${item.precio}"></label>
      <label>Expensas<input name="expensas" type="number" value="${item.expensas || 0}"></label>
      <label>Descripción de la ficha<textarea name="descripcion" rows="4">${esc(item.descripcion || "")}</textarea></label>
      <p class="eyebrow" style="margin-top:12px">Características</p>
      <div class="edit-amenities">
        ${AMENITIES.map((a) => `
          <label>
            <input type="checkbox" name="amenity" value="${esc(a.id)}" ${(item.amenities || []).includes(a.id) ? "checked" : ""}>
            ${esc(a.label)}
          </label>`).join("")}
      </div>
      <div class="edit-flags">
        <label><input type="checkbox" name="destacado" ${item.destacado ? "checked" : ""}> Destacado en vitrina</label>
        <label><input type="checkbox" name="nuevo" ${item.nuevo ? "checked" : ""}> Nuevo</label>
      </div>
      <label>Estado
        <select name="status">
          ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar en vitrina</button>
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

  wireFotoEditor(detail, item);

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
        text: input.checked ? "Marcado para " + dest.nombre + " (demo). No se envió nada afuera." : "Sacado de " + dest.nombre + "."
      }, ...(item.history || [])];
      save(items);
      if (input.checked) {
        cola = { ...cola, [colaClave(item.id, id)]: { estado: "publicado", when: ahoraDemo() } };
      } else {
        const nextCola = { ...cola };
        delete nextCola[colaClave(item.id, id)];
        cola = nextCola;
      }
      saveCola(cola);
      setCuentaAccion(id, true, "Aviso " + item.codigo + (input.checked ? " publicado (demo)." : " sacado de este destino."));
      showToast(input.checked ? "Marcado para " + dest.nombre + " (demo)" : "Sacado de " + dest.nombre);
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
    const barrio = String(data.get("barrio") || item.barrio);

    Object.assign(item, {
      codigo: String(data.get("codigo") || ""),
      titulo: String(data.get("titulo") || ""),
      tipo: String(data.get("tipo") || "departamento"),
      operacion: String(data.get("operacion") || "alquiler"),
      direccion: String(data.get("direccion") || ""),
      barrio,
      zona: barrio === "El Bolsón" ? "El Bolsón" : "Bariloche",
      ambientes: Number(data.get("ambientes") || 0),
      dormitorios: Number(data.get("dormitorios") || 0),
      banos: Number(data.get("banos") || 0),
      cubierta: Number(data.get("cubierta") || 0),
      superficie: Number(data.get("superficie") || 0),
      piso: String(data.get("piso") || ""),
      vista: String(data.get("vista") || ""),
      calefaccion: String(data.get("calefaccion") || ""),
      servicios: String(data.get("servicios") || ""),
      precio: Number(data.get("precio") || 0),
      expensas: Number(data.get("expensas") || 0),
      descripcion: String(data.get("descripcion") || ""),
      amenities: data.getAll("amenity").map(String),
      destacado: Boolean(event.target.destacado?.checked),
      nuevo: Boolean(event.target.nuevo?.checked),
      status: newStatus
    });

    if (prevStatus !== newStatus) {
      item.history = [{ when: "hoy", text: `Estado cambiado a: ${label(newStatus)}.` }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Ficha actualizada. La vitrina ya toma estos datos." }, ...(item.history || [])];
    }

    if (!persistCartera()) return;
    showToast("Cambios guardados en la vitrina");
    render();
  });

  detail.querySelector("#remove").addEventListener("click", () => {
    if (session?.rol === "agenda") {
      showToast("La agenda no elimina fichas.");
      return;
    }
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

function canEditVitrina() {
  return session?.rol === "titular" || session?.rol === "agente";
}

function hidePanelLoading() {
  const overlay = document.getElementById("nh-loading");
  if (overlay) overlay.hidden = true;
  document.body.classList.remove("nh-booting");
}

function showPanelLoading(title, lead, done, ms) {
  const overlay = document.getElementById("nh-loading");
  const titleEl = document.getElementById("nh-loading-title");
  const leadEl = document.getElementById("nh-loading-lead");
  if (titleEl) titleEl.textContent = title || "Cargando el panel…";
  if (leadEl) leadEl.textContent = lead || "Un momento.";
  if (overlay) overlay.hidden = false;
  document.body.classList.add("nh-booting");
  window.clearTimeout(loadingTimer);
  loadingTimer = window.setTimeout(() => {
    hidePanelLoading();
    if (typeof done === "function") done();
  }, ms || 900);
}

function viewFromHash() {
  const id = (location.hash || "").replace("#", "");
  if (id === "view-contacto") return "contacto";
  return PANEL_VIEWS.includes(id) ? id : "";
}

function paintPanelNav(active) {
  document.querySelectorAll("[data-panel-nav]").forEach((el) => {
    const on = el.getAttribute("data-panel-nav") === active;
    el.classList.toggle("is-on", on);
    if (on) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
}

function showPanelView(id, opts) {
  const next = PANEL_VIEWS.includes(id) ? id : "resumen";
  const go = () => {
    currentView = next;
    document.querySelectorAll("[data-panel-view]").forEach((el) => {
      el.hidden = el.getAttribute("data-panel-view") !== next;
    });
    paintPanelNav(next);
    if (next === "resumen") renderResumen();
    if (next === "cartera") render();
    if (next === "vitrina") renderVitrinaGestor();
    if (next === "difusion") renderCuentas();
    if (next === "usuarios") renderUsuarios();
    const hash = "#" + next;
    if (location.hash !== hash) history.replaceState(null, "", hash);
    document.querySelector(".mobile-menu")?.removeAttribute("open");
  };
  if (opts?.instant || next === currentView) {
    go();
    return;
  }
  showPanelLoading("Cargando la sección…", "Cambiando de área del panel.", go, 520);
}

function wirePanelNav() {
  document.querySelectorAll("[data-panel-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      showPanelView(el.getAttribute("data-panel-nav"));
    });
  });
}

function renderResumen() {
  const host = document.getElementById("resumen-grid");
  if (!host) return;
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const visitas = items.reduce((sum, i) => sum + Number(i.vistas || 0), 0);
  const consultas = items.reduce((sum, i) => sum + Number(i.consultas || 0), 0);
  const activos = staff.filter((u) => u.activo !== false).length;
  const page = loadVitrinaPage();
  const visibles = VITRINA_SECTIONS.filter((s) => !s.alwaysOn && page.visible[s.id] !== false).length;
  const totalSec = VITRINA_SECTIONS.filter((s) => !s.alwaysOn).length;
  host.innerHTML = `
    <button type="button" class="resumen-card" data-go="cartera">
      <span>Cartera</span>
      <strong>${items.length}</strong>
      <small>propiedades en este navegador</small>
    </button>
    <button type="button" class="resumen-card" data-go="cartera">
      <span>Disponibles</span>
      <strong>${disponibles}</strong>
      <small>listas para la vitrina</small>
    </button>
    <button type="button" class="resumen-card" data-go="cartera">
      <span>Visitas al aviso</span>
      <strong>${visitas}</strong>
      <small>solo se ven en el panel</small>
    </button>
    <button type="button" class="resumen-card" data-go="cartera">
      <span>Consultas</span>
      <strong>${consultas}</strong>
      <small>solo se ven en el panel</small>
    </button>
    <button type="button" class="resumen-card" data-go="usuarios">
      <span>Usuarios activos</span>
      <strong>${activos}</strong>
      <small>de ${staff.length} cuentas del estudio</small>
    </button>
    <button type="button" class="resumen-card" data-go="vitrina">
      <span>Vitrina visible</span>
      <strong>${visibles}/${totalSec}</strong>
      <small>bloques públicos encendidos</small>
    </button>`;
  host.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showPanelView(btn.dataset.go));
  });
}

function renderVitrinaGestor() {
  const host = document.getElementById("vitrina-gestor");
  if (!host) return;
  const page = loadVitrinaPage();
  const editable = canEditVitrina();
  host.innerHTML = VITRINA_SECTIONS.map((sec) => {
    const on = sec.alwaysOn ? true : page.visible[sec.id] !== false;
    const fields = (sec.fields || []).map((field) => {
      const val = vitrinaCopyAt(page.copy, field.path);
      const control = field.kind === "area"
        ? `<textarea name="${esc(field.path)}" rows="3" ${editable ? "" : "disabled"}>${esc(val || "")}</textarea>`
        : `<input name="${esc(field.path)}" value="${esc(val || "")}" ${editable ? "" : "disabled"}>`;
      return `<label>${esc(field.label)}${control}</label>`;
    }).join("");
    const toggle = sec.alwaysOn
      ? `<p class="vitrina-always">Siempre visible en la vitrina.</p>`
      : `<label class="vitrina-toggle"><input type="checkbox" data-vitrina-visible="${esc(sec.id)}" ${on ? "checked" : ""} ${editable ? "" : "disabled"}> Mostrar en la vitrina</label>`;
    const save = editable
      ? `<button class="btn-panel" type="submit">Guardar esta sección</button>`
      : `<p class="vitrina-readonly">Solo titular o agente publican u ocultan la vitrina. Usted puede leer los textos.</p>`;
    return `
      <article class="vitrina-block ${on ? "is-on" : "is-off"}">
        <header>
          <div>
            <h3>${esc(sec.label)}</h3>
            <p>${esc(sec.hint)}</p>
          </div>
          ${toggle}
        </header>
        <form data-vitrina-form="${esc(sec.id)}">
          ${fields}
          ${save}
        </form>
      </article>`;
  }).join("");
  host.querySelectorAll("[data-vitrina-visible]").forEach((input) => {
    input.addEventListener("change", () => {
      if (!canEditVitrina()) return;
      const next = loadVitrinaPage();
      next.visible[input.dataset.vitrinaVisible] = input.checked;
      saveVitrinaPage(next);
      showToast(input.checked ? "Esa sección vuelve a verse en la vitrina." : "Esa sección queda oculta en la vitrina.");
      renderVitrinaGestor();
      renderResumen();
    });
  });
  host.querySelectorAll("[data-vitrina-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canEditVitrina()) return;
      const next = loadVitrinaPage();
      form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
        setVitrinaCopyAt(next.copy, field.name, field.value);
      });
      saveVitrinaPage(next);
      showToast("Textos guardados. Ábralos en la vitrina pública.");
    });
  });
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
wirePanelNav();
bootPanel();

function bootPanel() {
  if (!session) {
    hidePanelLoading();
    showStaffLogin();
    return;
  }
  applySessionChrome();
  renderUsuarios();
  renderCuentas();
  renderVitrinaGestor();
  renderResumen();
  render();
  showPanelView(viewFromHash() || "resumen", { instant: true });
}

function applySessionChrome() {
  document.body.classList.add("nh-authed");
  document.getElementById("nh-login").hidden = true;
  document.body.classList.toggle("nh-rol-titular", session.rol === "titular");
  document.body.classList.toggle("nh-rol-agente", session.rol === "agente");
  document.body.classList.toggle("nh-rol-agenda", session.rol === "agenda");
  const nav = document.getElementById("siteNav");
  nav?.querySelector(".nh-session")?.remove();
  if (nav) {
    const box = document.createElement("div");
    box.className = "nh-session";
    box.innerHTML = `<span>${esc(session.nombre)} · ${esc(roleLabel(session.rol))}</span><button type="button" class="ghost">Salir</button>`;
    box.querySelector("button").addEventListener("click", () => {
      session = null;
      currentView = "resumen";
      hidePanelLoading();
      clearStaffSession();
      document.body.classList.remove("nh-authed", "nh-rol-titular", "nh-rol-agente", "nh-rol-agenda");
      box.remove();
      history.replaceState(null, "", location.pathname + location.search);
      showStaffLogin();
    });
    nav.appendChild(box);
  }
  const alta = document.getElementById("usuario-alta");
  if (alta) alta.hidden = session.rol !== "titular";
}

function placedLoginUser() {
  return staff.find((u) => u.user === "milena" && u.activo !== false)
    || staff.find((u) => u.rol === "titular" && u.activo !== false)
    || staff.find((u) => u.activo !== false)
    || { user: "milena", pass: "demo" };
}

function fillLoginForm(user) {
  const form = document.getElementById("nh-login-form");
  if (!form) return;
  const placed = user || placedLoginUser();
  form.user.value = placed.user || "milena";
  form.pass.value = placed.pass || "demo";
}

function enterFromLoginForm() {
  const form = document.getElementById("nh-login-form");
  const error = document.querySelector("#nh-login .nh-login-error");
  const userName = String(form?.user.value || "").trim().toLowerCase();
  const pass = String(form?.pass.value || "");
  const found = staff.find((u) => u.user === userName && u.pass === pass && u.activo !== false);
  if (!found) {
    if (error) error.textContent = "Usuario o clave no coinciden, o la cuenta está pausada. Toque una cuenta de la lista o use milena / demo.";
    return;
  }
  enterStaff(found);
}

function showStaffLogin() {
  document.body.classList.remove("nh-authed");
  const gate = document.getElementById("nh-login");
  gate.hidden = false;
  const host = document.getElementById("nh-login-users");
  const activos = staff.filter((u) => u.activo !== false);
  host.innerHTML = activos.map((u) => `
    <button type="button" data-user="${esc(u.user)}">
      <strong>${esc(u.nombre)}</strong>
      <span>${esc(roleLabel(u.rol))} · usuario ${esc(u.user)}</span>
    </button>`).join("");
  host.querySelectorAll("[data-user]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const found = staff.find((u) => u.user === btn.dataset.user && u.activo !== false);
      if (!found) return;
      fillLoginForm(found);
      enterStaff(found);
    });
  });
  fillLoginForm(placedLoginUser());
  const form = document.getElementById("nh-login-form");
  form.onsubmit = (event) => {
    event.preventDefault();
    enterFromLoginForm();
  };
}

function enterStaff(user) {
  session = user;
  saveStaffSession(user);
  document.getElementById("nh-login").hidden = true;
  showPanelLoading(
    "Cargando el panel…",
    "Abriendo la cartera y las secciones de la vitrina.",
    () => bootPanel(),
    900
  );
}

function renderUsuarios() {
  const host = document.getElementById("usuario-rows");
  if (!host) return;
  const titular = session?.rol === "titular";
  host.innerHTML = staff.map((u) => {
    const rolSelect = titular
      ? `<select data-rol="${esc(u.id)}" aria-label="Rol de ${esc(u.nombre)}">
          ${STAFF_ROLES.map((r) => `<option value="${esc(r.id)}" ${u.rol === r.id ? "selected" : ""}>${esc(r.label)}</option>`).join("")}
        </select>`
      : esc(roleLabel(u.rol));
    const estado = u.activo === false ? "Pausado" : "Activo";
    const actions = titular
      ? `<button type="button" class="ghost" data-toggle="${esc(u.id)}">${u.activo === false ? "Activar" : "Pausar"}</button>`
      : "Solo lectura";
    return `
    <tr>
      <td>${esc(u.nombre)}</td>
      <td><code>${esc(u.user)}</code></td>
      <td>${rolSelect}</td>
      <td><span class="tag ${u.activo === false ? "reservada" : "disponible"}">${estado}</span></td>
      <td>${actions}</td>
    </tr>`;
  }).join("");
  host.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => toggleStaff(btn.dataset.toggle));
  });
  host.querySelectorAll("[data-rol]").forEach((select) => {
    select.addEventListener("change", () => changeStaffRole(select.dataset.rol, select.value));
  });
}

function changeStaffRole(id, rol) {
  if (session?.rol !== "titular") return;
  if (!STAFF_ROLES.some((r) => r.id === rol)) return;
  const user = staff.find((u) => u.id === id);
  if (!user) return;
  const titularesActivos = staff.filter((u) => u.rol === "titular" && u.activo !== false);
  if (user.rol === "titular" && rol !== "titular" && user.activo !== false && titularesActivos.length < 2) {
    showToast("Tiene que quedar al menos un titular activo.");
    renderUsuarios();
    return;
  }
  user.rol = rol;
  saveUsers(staff);
  if (user.user === session.user) {
    session = user;
    applySessionChrome();
  }
  showToast("Rol actualizado.");
  renderUsuarios();
}

function toggleStaff(id) {
  if (session?.rol !== "titular") return;
  const user = staff.find((u) => u.id === id);
  if (!user) return;
  if (user.user === session.user) {
    showToast("No puede pausar la cuenta con la que está dentro.");
    return;
  }
  const titularesActivos = staff.filter((u) => u.rol === "titular" && u.activo !== false);
  if (user.rol === "titular" && user.activo !== false && titularesActivos.length < 2) {
    showToast("Tiene que quedar al menos un titular activo.");
    return;
  }
  user.activo = user.activo === false;
  saveUsers(staff);
  showToast(user.activo ? "Cuenta activa" : "Cuenta pausada. No podrá entrar.");
  renderUsuarios();
}

document.getElementById("usuario-alta")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (session?.rol !== "titular") return;
  const data = new FormData(event.target);
  const user = String(data.get("user") || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const nombre = String(data.get("nombre") || "").trim();
  const rol = String(data.get("rol") || "agente");
  const pass = String(data.get("pass") || "demo").trim() || "demo";
  if (!user || !nombre) {
    showToast("Indique nombre y usuario.");
    return;
  }
  if (staff.some((u) => u.user === user)) {
    showToast("Ese usuario ya existe.");
    return;
  }
  staff = [{ id: crypto.randomUUID(), user, pass, nombre, rol, activo: true }, ...staff];
  saveUsers(staff);
  event.target.reset();
  event.target.pass.value = "demo";
  showToast("Usuario agregado. Puede entrar con clave " + pass + ".");
  renderUsuarios();
});
