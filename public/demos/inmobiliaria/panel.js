let items = load();
let cuentas = loadCuentas();
let cola = loadCola();
let staff = loadUsers();
let session = null;
let selected = items[0]?.id || "";
let filter = "todos";
let searchTerm = "";
let currentView = "resumen";
let loadingTimer = 0;
let carteraMode = "list";
let editorFocus = "";
let editorDraft = null;
const MAX_FOTOS = 6;
const PANEL_VIEWS = ["resumen", "cartera", "zonas", "vitrina", "difusion", "usuarios", "contacto"];

document.addEventListener("click", (event) => {
  if (!event.target.closest("#open-create, [data-open-create]")) return;
  openCarteraCreate();
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

function zonaOptions(selected) {
  const list = typeof zonasTodas === "function" ? zonasTodas() : ZONAS;
  const ids = list.map((z) => z.id);
  const extra = selected && !ids.includes(selected)
    ? `<option value="${esc(selected)}" selected>${esc(selected)}</option>`
    : "";
  return extra + list.map((z) => {
    const cerca = typeof zonaCercaNombre === "function" ? zonaCercaNombre(z) : "";
    const label = cerca ? z.nombre + " (cerca de " + cerca + ")" : z.nombre;
    return `<option value="${esc(z.id)}" ${selected === z.id ? "selected" : ""}>${esc(label)}</option>`;
  }).join("");
}

function nhField(id, label, control, span) {
  return `<div class="nh-field${span ? " " + span : ""}">
    <label for="${id}">${label}</label>
    ${control}
  </div>`;
}

function htmlGaleria(fotos, readonly) {
  return `
    <div class="foto-editor nh-form-section">
      <h3>Fotos</h3>
      <p class="lead-mini">La primera es la portada del aviso. Hasta ${MAX_FOTOS} fotos; salen en la galería de la ficha.</p>
      <div class="foto-thumbs">
        ${fotos.map((src, i) => `
          <figure class="foto-thumb ${i === 0 ? "is-portada" : ""}">
            <img src="${esc(src)}" alt="Foto ${i + 1}">
            ${i === 0 ? "<figcaption>Portada</figcaption>" : ""}
            ${readonly ? "" : `
            <div class="foto-thumb-actions">
              ${i > 0 ? `<button type="button" data-portada="${i}">Portada</button>` : ""}
              <button type="button" data-quitar="${i}">Quitar</button>
            </div>`}
          </figure>`).join("")}
      </div>
      ${readonly ? "" : `<label class="foto-cargar" for="add-fotos">
        <span class="foto-cargar-btn">Elegir fotos</span>
        <input id="add-fotos" type="file" accept="image/*" multiple data-add-fotos>
      </label>`}
    </div>`;
}

function aplicarFotos(item, next, persist) {
  const prev = [...(item.imagenes || [])];
  const prevHistory = item.history;
  item.imagenes = next.length ? next : (persist === false ? [] : [fotoPorTipo(item.tipo)]);
  if (persist !== false) {
    item.history = [{ when: "hoy", text: "Fotos de la vitrina actualizadas." }, ...(item.history || [])];
    if (!persistCartera()) {
      item.imagenes = prev;
      item.history = prevHistory;
      return false;
    }
  }
  return true;
}

function wireFotoEditor(root, item, persist) {
  root.querySelector("[data-add-fotos]")?.addEventListener("change", async (event) => {
    captureEditorForm();
    const extra = await leerArchivosFoto(event.target.files, MAX_FOTOS - (item.imagenes || []).filter(Boolean).length);
    event.target.value = "";
    if (!extra.length) return;
    const next = [...(item.imagenes || []).filter(Boolean), ...extra].slice(0, MAX_FOTOS);
    if (aplicarFotos(item, next, persist)) {
      showToast(persist === false ? "Fotos listas. Guarde para que salgan en la vitrina." : "Fotos actualizadas en la vitrina");
      render();
    }
  });
  root.querySelectorAll("[data-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureEditorForm();
      const next = (item.imagenes || []).filter(Boolean).filter((_, idx) => idx !== Number(btn.dataset.quitar));
      if (aplicarFotos(item, next, persist)) {
        showToast("Foto quitada");
        render();
      }
    });
  });
  root.querySelectorAll("[data-portada]").forEach((btn) => {
    btn.addEventListener("click", () => {
      captureEditorForm();
      const list = (item.imagenes || []).filter(Boolean).slice();
      const picked = list.splice(Number(btn.dataset.portada), 1)[0];
      if (aplicarFotos(item, [picked, ...list], persist)) {
        showToast("Esa foto es la portada de la vitrina");
        render();
      }
    });
  });
}

function roleIs(...roles) {
  return roles.includes(session?.rol);
}

function canManageUsers() {
  return roleIs("titular");
}

/** Alta / edición de fichas y zonas: titular, agente, comercial. Administración edita fichas existentes. */
function canEditCartera() {
  return roleIs("titular", "agente", "comercial", "administracion");
}

function canCreateCartera() {
  return roleIs("titular", "agente", "comercial");
}

function canDeleteCartera() {
  return roleIs("titular", "agente", "comercial");
}

function canEditZonas() {
  return roleIs("titular", "agente", "comercial");
}

function canEditDifusion() {
  return roleIs("titular", "agente", "comercial", "marketing");
}

function canEditVitrina() {
  return roleIs("titular", "agente", "marketing");
}

function canEmitArca() {
  return roleIs("titular", "agente", "comercial", "administracion");
}

function denyCarteraMsg(accion) {
  const rol = session?.rol;
  if (rol === "agenda") {
    return accion === "eliminar"
      ? "La agenda no elimina fichas."
      : "La agenda no carga propiedades. Eso lo hace un agente, comercial o el titular.";
  }
  if (rol === "marketing") {
    return "Marketing no carga ni borra avisos. Use Difusión o el gestor de la vitrina.";
  }
  if (rol === "administracion") {
    return accion === "eliminar"
      ? "Administración no elimina fichas. Puede editar la cartera y emitir ARCA de ejemplo."
      : "Administración puede editar fichas existentes y emitir ARCA, pero no da de alta avisos nuevos.";
  }
  return "Su rol no permite esa acción en esta demo.";
}

function blankItem() {
  return {
    id: "",
    codigo: "",
    titulo: "",
    tipo: "departamento",
    operacion: "alquiler",
    direccion: "",
    barrio: "Centro",
    zona: "Bariloche",
    ambientes: 0,
    dormitorios: 0,
    banos: 1,
    superficie: 0,
    cubierta: 0,
    precio: 0,
    expensas: 0,
    antiguedad: null,
    orientacion: "",
    piso: "",
    vista: "",
    calefaccion: "",
    servicios: "",
    cochera: false,
    amenities: [],
    descripcion: "",
    imagenes: [],
    destacado: false,
    nuevo: true,
    bajoPrecio: false,
    precioAnterior: 0,
    ingresada: 0,
    vistas: 0,
    consultas: 0,
    likes: 0,
    diasPublicada: 0,
    precioM2Zona: 0,
    status: "disponible",
    cliente: null,
    visitas: [],
    portales: portalesBase(),
    history: []
  };
}

function applyFormToItem(form, item) {
  const data = new FormData(form);
  const barrio = String(data.get("barrio") || item.barrio);
  const nextPrecio = Number(data.get("precio") || 0);
  if (item.id) aplicarBajaPrecio(item, nextPrecio);
  Object.assign(item, {
    codigo: String(data.get("codigo") || ""),
    titulo: String(data.get("titulo") || ""),
    tipo: String(data.get("tipo") || "departamento"),
    operacion: String(data.get("operacion") || "alquiler"),
    direccion: String(data.get("direccion") || ""),
    barrio,
    zona: typeof zonaRegionDe === "function" ? zonaRegionDe(barrio) : (barrio === "El Bolsón" ? "El Bolsón" : "Bariloche"),
    ambientes: Number(data.get("ambientes") || 0),
    dormitorios: Number(data.get("dormitorios") || 0),
    banos: Number(data.get("banos") || 0),
    cubierta: Number(data.get("cubierta") || 0),
    superficie: Number(data.get("superficie") || 0),
    piso: String(data.get("piso") || ""),
    vista: String(data.get("vista") || ""),
    calefaccion: String(data.get("calefaccion") || ""),
    servicios: String(data.get("servicios") || ""),
    precio: nextPrecio,
    expensas: Number(data.get("expensas") || 0),
    descripcion: String(data.get("descripcion") || ""),
    amenities: data.getAll("amenity").map(String),
    destacado: Boolean(form.destacado?.checked),
    nuevo: Boolean(form.nuevo?.checked),
    status: String(data.get("status") || item.status)
  });
}

function editorWorkingItem() {
  if (carteraMode === "create") return editorDraft;
  return items.find((i) => i.id === selected) || null;
}

function captureEditorForm() {
  const form = document.getElementById("edit");
  const item = editorWorkingItem();
  if (!form || !item) return item;
  applyFormToItem(form, item);
  return item;
}

function destinosActivosDe(item) {
  return DESTINOS.filter((d) => d.fijo || Boolean(portalesDe(item)[d.id]));
}

function htmlDestinosChips(item) {
  const bits = destinosActivosDe(item);
  if (!bits.length) return `<span class="destino-chip is-off">Sin destinos</span>`;
  return `<div class="destino-chips">${bits.map((d) => {
    return `<span class="destino-chip">${esc(destChipNombre(d))}</span>`;
  }).join("")}</div>`;
}

function estadoDestino(dest, item) {
  if (dest.fijo) return { label: "En vitrina", on: true };
  if (!destinoConectado(dest.id)) return { label: "No conectado", on: false };
  if (portalesDe(item)[dest.id]) {
    const label = dest.id === "ml" ? "En ML" : "En " + dest.nombre;
    return { label, on: true };
  }
  return { label: "Sin publicar", on: false };
}

function htmlDestinoFila(dest, item, readonly) {
  const st = estadoDestino(dest, item);
  const on = dest.fijo ? true : Boolean(portalesDe(item)[dest.id]);
  const lista = destinoConectado(dest.id);
  const disabled = dest.fijo || !lista || readonly;
  const hint = dest.fijo
    ? "Siempre en la vitrina"
    : lista
      ? (dest.grupo === "red" ? "Texto y enlace listos. No se publica solo." : "Listo para marcar (demo)")
      : "Conecte la cuenta en Difusión";
  return `
    <label class="destino-row ${!lista && !dest.fijo ? "is-off" : ""}">
      <span class="cuenta-mark destino-row-mark" data-dest="${esc(dest.id)}" aria-hidden="true">${esc(destMarca(dest))}</span>
      <span class="destino-check">
        <input type="checkbox" data-pub-dest="${esc(dest.id)}" ${on ? "checked" : ""} ${disabled ? "disabled" : ""}>
      </span>
      <span>
        <strong>${esc(dest.nombre)} <em class="destino-estado ${st.on ? "" : "is-off"}">${esc(st.label)}</em></strong>
        <small>${esc(hint)}</small>
      </span>
    </label>`;
}

function htmlPublishBlock(item, isCreate, readonly) {
  if (isCreate) {
    return `
      <section class="nh-form-section difusion-ficha" id="bloque-publicar">
        <h3>Publicación</h3>
        <p class="lead-mini">Guarde la propiedad primero. El sitio propio toma la ficha apenas exista en la cartera. Después podrá marcar portales y redes. Demo: no se envía nada afuera.</p>
      </section>`;
  }
  const sitiosOn = destinosPorGrupo("sitio").filter((d) => d.fijo || destinoConectado(d.id)).length;
  const redesOn = destinosPorGrupo("red").filter((d) => destinoConectado(d.id)).length;
  return `
    <section class="nh-form-section difusion-ficha" id="bloque-publicar">
      <h3>Publicación en otras páginas y redes</h3>
      <p class="lead-mini">Marque destinos ya conectados en Difusión. Sitio propio: siempre en la vitrina. Hoy hay ${sitiosOn} sitios/portales y ${redesOn} redes listas. Demo: no se envía nada afuera.</p>
      <div class="publish-grid">
        <fieldset class="publish-set">
          <legend>Sitios y portales</legend>
          ${destinosPorGrupo("sitio").map((dest) => htmlDestinoFila(dest, item, readonly)).join("")}
        </fieldset>
        <fieldset class="publish-set">
          <legend>Redes sociales</legend>
          ${destinosPorGrupo("red").map((dest) => htmlDestinoFila(dest, item, readonly)).join("")}
        </fieldset>
      </div>
      <div class="difusion-toolbar">
        ${readonly ? "" : `<button class="btn-panel" type="button" id="publicar-aviso">Publicar este aviso</button>`}
        <button class="ghost" type="button" id="copiar-aviso">Copiar texto</button>
        <a class="ghost" id="wa-aviso" href="${esc("https://wa.me/?text=" + encodeURIComponent(textoRed(item)))}" target="_blank" rel="noopener">WhatsApp</a>
        <button class="ghost" type="button" data-go-difusion>Abrir Difusión</button>
      </div>
    </section>`;
}

function publicarAviso(item, destIds) {
  if (!canEditDifusion() || !item?.id) return;
  const destinos = destIds
    .map((id) => DESTINOS.find((d) => d.id === id))
    .filter(Boolean)
    .filter((d) => d.fijo || destinoConectado(d.id));
  if (!destinos.length) {
    showToast("Elija al menos un destino conectado.");
    return;
  }
  showPanelLoading(
    "Publicando el aviso…",
    "Marcando destinos en esta demo. No se envía nada afuera.",
    () => {
      const nombres = [];
      destinos.forEach((dest) => {
        nombres.push(dest.nombre);
        if (dest.fijo) return;
        item.portales = { ...portalesDe(item), [dest.id]: true };
        cola = { ...cola, [colaClave(item.id, dest.id)]: { estado: "publicado", when: ahoraDemo() } };
        setCuentaAccion(dest.id, true, "Aviso " + item.codigo + " publicado (demo).");
      });
      item.history = [{
        when: "hoy",
        text: "Marcado para " + nombres.join(", ") + " (demo). No se envió nada afuera."
      }, ...(item.history || [])];
      saveCola(cola);
      persistCartera();
      showToast("Marcado (demo) en: " + nombres.join(", ") + ". No se envió nada afuera.");
      render();
      if (currentView === "difusion") renderDifusion();
    },
    720
  );
}

function showCarteraList() {
  carteraMode = "list";
  editorFocus = "";
  editorDraft = null;
  const list = document.getElementById("cartera-list");
  const detail = document.getElementById("detail");
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
}

function openCarteraEditor(id, opts) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  const paint = () => {
    selected = id;
    carteraMode = "edit";
    editorDraft = null;
    editorFocus = opts?.focus || "";
    if (currentView !== "cartera") {
      showPanelView("cartera", { instant: true, keepEditor: true });
    } else {
      render();
    }
    if (editorFocus === "publicar") {
      document.getElementById("bloque-publicar")?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };
  if (opts?.instant) {
    paint();
    return;
  }
  showPanelLoading("Abriendo la ficha…", "Cargando los datos de esta propiedad.", paint, 520);
}

function openCarteraCreate() {
  if (!canCreateCartera()) {
    showToast(denyCarteraMsg("crear"));
    return;
  }
  const paint = () => {
    carteraMode = "create";
    editorDraft = blankItem();
    editorFocus = "";
    if (currentView !== "cartera") {
      showPanelView("cartera", { instant: true, keepEditor: true });
    } else {
      render();
    }
  };
  showPanelLoading("Abriendo el alta…", "Formulario para una propiedad nueva.", paint, 480);
}

function guardarAlta(item) {
  if (!canCreateCartera()) {
    showToast(denyCarteraMsg("crear"));
    return;
  }
  if (!item.codigo || !item.titulo) {
    showToast("Indique código y título.");
    return;
  }
  const imagenes = (item.imagenes || []).filter(Boolean);
  const nuevo = {
    ...item,
    id: crypto.randomUUID(),
    imagenes: imagenes.length ? imagenes : [fotoPorTipo(item.tipo)],
    status: "disponible",
    nuevo: true,
    portales: typeof portalesBase === "function" ? portalesBase() : (item.portales || {}),
    ingresada: Date.now(),
    bajoPrecio: false,
    precioAnterior: 0,
    history: [{ when: "hoy", text: "Propiedad agregada a la cartera." }]
  };
  const prevItems = items;
  items = [nuevo, ...items];
  selected = nuevo.id;
  filter = "todos";
  if (!persistCartera()) {
    items = prevItems;
    selected = items[0]?.id || "";
    return;
  }
  editorDraft = null;
  carteraMode = "edit";
  showToast("Propiedad agregada. Ya sale en la vitrina.");
  render();
}

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
    ? `${meta.lastAction}${meta.lastAt ? " · " + meta.lastAt : ""}`
    : "Sin movimientos.";
  const editable = canEditDifusion();
  const accion = dest.fijo
    ? `<span class="cuenta-estado on">Siempre en la vitrina</span>`
    : `<button type="button" class="cuenta-btn ${on ? "is-ghost" : "is-primary"}" data-cuenta="${esc(dest.id)}" ${editable ? "" : "disabled"}>${on ? "Desconectar" : "Conectar"}</button>`;
  return `
    <article class="cuenta ${on ? "is-on" : ""}">
      <header class="cuenta-head">
        <span class="cuenta-mark" data-dest="${esc(dest.id)}" aria-hidden="true">${esc(destMarca(dest))}</span>
        <div class="cuenta-titles">
          <p class="cuenta-tipo">${esc(destTipoLabel(dest))}</p>
          <h3>${esc(dest.nombre)}</h3>
        </div>
        <span class="cuenta-badge ${on ? "is-on" : ""}">${on ? "Conectado" : "Libre"}</span>
      </header>
      <p class="cuenta-beneficio">${esc(dest.beneficio)}</p>
      <p class="cuenta-meta">${on
        ? (publicados + " aviso" + (publicados === 1 ? "" : "s") + " en cartera")
        : "Sin avisos marcados"}</p>
      <p class="cuenta-accion" title="${esc(last)}">${esc(last)}</p>
      <footer class="cuenta-foot">${accion}</footer>
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

function conectarRedesMuestra() {
  if (!canEditDifusion()) return;
  ["instagram", "facebook", "fbmarket", "whatsapp", "tiktok"].forEach((id) => {
    if (!DESTINOS.some((d) => d.id === id)) return;
    setCuentaAccion(id, true, "Conectada de muestra (demo). No se envió nada afuera.");
  });
  showToast("Redes de muestra conectadas. Puede marcar avisos en Instagram, Facebook y WhatsApp.");
  renderDifusion();
}

function publicarListosCola() {
  if (!canEditDifusion()) return;
  const listos = filasCola().filter((f) => f.estado === "listo" && destinoConectado(f.dest.id));
  if (!listos.length) {
    showToast("No hay avisos en estado Listo. Agréguelos a la cola o márquelos desde Publicar.");
    return;
  }
  showPanelLoading(
    "Publicando la cola…",
    "Marcando " + listos.length + " aviso" + (listos.length === 1 ? "" : "s") + " como publicados (demo).",
    () => {
      listos.forEach((fila) => {
        cola = {
          ...cola,
          [colaClave(fila.item.id, fila.dest.id)]: { estado: "publicado", when: ahoraDemo() }
        };
        items = items.map((row) => row.id !== fila.item.id ? row : {
          ...row,
          portales: { ...portalesDe(row), [fila.dest.id]: true },
          history: [{
            when: "hoy",
            text: fila.dest.nombre + " marcado como publicado desde la cola (demo)."
          }, ...(row.history || [])]
        });
        setCuentaAccion(fila.dest.id, true, "Cola: " + fila.item.codigo + " publicado (demo).");
      });
      saveCola(cola);
      save(items);
      showToast(listos.length + " marcado" + (listos.length === 1 ? "" : "s") + " como publicado. Nada salió afuera.");
      renderDifusion();
      if (currentView === "cartera") render();
    },
    720
  );
}

function htmlGrupoCuentas(grupo, titulo, texto, paso) {
  const destinos = destinosPorGrupo(grupo);
  const conectados = destinos.filter((d) => destinoConectado(d.id)).length;
  return `
    <section class="difusion-grupo" id="difusion-${esc(grupo)}">
      <header class="difusion-grupo-head">
        <div>
          <p class="difusion-paso">${esc(paso)}. ${esc(titulo)}</p>
          <p class="difusion-grupo-lead">${esc(texto)}</p>
        </div>
        <p class="difusion-grupo-count"><strong>${conectados}</strong> / ${destinos.length} conectados</p>
      </header>
      <div class="cuentas">${destinos.map(htmlCuenta).join("")}</div>
    </section>`;
}

function htmlDifusionResumen(editable) {
  const sitios = destinosPorGrupo("sitio");
  const redes = destinosPorGrupo("red");
  const sitiosOn = sitios.filter((d) => destinoConectado(d.id)).length;
  const redesOn = redes.filter((d) => destinoConectado(d.id)).length;
  const filas = filasCola();
  const listos = filas.filter((f) => f.estado === "listo").length;
  const publicados = filas.filter((f) => f.estado === "publicado").length;
  return `
    <section class="difusion-resumen" aria-label="Resumen de difusión">
      <header class="difusion-resumen-head">
        <div>
          <p class="difusion-paso">Resumen</p>
          <h2>Estado de la difusión</h2>
        </div>
        <p class="difusion-aviso-demo">Demo: no se envía nada a portales ni redes. Solo quedan marcas en este navegador.</p>
      </header>
      <div class="difusion-resumen-grid">
        <article><span>Vitrina</span><strong>${items.length}</strong><small>avisos</small></article>
        <article><span>Portales</span><strong>${sitiosOn}</strong><small>de ${sitios.length}</small></article>
        <article><span>Redes</span><strong>${redesOn}</strong><small>de ${redes.length}</small></article>
        <article><span>Cola</span><strong>${listos}</strong><small>${publicados} publicados</small></article>
      </div>
      ${editable ? `
      <div class="difusion-toolbar">
        <button type="button" class="btn-panel" data-difusion-scroll="difusion-publicar">Publicar un aviso</button>
        <button type="button" class="ghost" data-conectar-redes>Conectar redes de muestra</button>
        <button type="button" class="ghost" data-publicar-listos ${listos ? "" : "disabled"}>Publicar listos (${listos})</button>
      </div>` : `<p class="cola-vacia">Con su rol solo puede ver. Quien administra las cuentas publica.</p>`}
    </section>`;
}

function htmlDifusionPublicar(editable) {
  const destinosOk = DESTINOS.filter((d) => !d.fijo && destinoConectado(d.id));
  const shareItem = items.find((i) => i.id === selected) || items[0];
  const sitiosOk = destinosPorGrupo("sitio").filter((d) => !d.fijo && destinoConectado(d.id));
  const redesOk = destinosPorGrupo("red").filter((d) => destinoConectado(d.id));
  if (!editable) {
    return `
      <section class="difusion-panel" id="difusion-publicar">
        <header class="difusion-grupo-head">
          <p class="difusion-paso">3. Publicar un aviso</p>
          <p class="difusion-grupo-lead">Solo lectura con su rol.</p>
        </header>
      </section>`;
  }
  if (!destinosOk.length) {
    return `
      <section class="difusion-panel" id="difusion-publicar">
        <header class="difusion-grupo-head">
          <p class="difusion-paso">3. Publicar un aviso</p>
          <p class="difusion-grupo-lead">Conecte un portal o use “Conectar redes de muestra” arriba.</p>
        </header>
      </section>`;
  }
  return `
    <section class="difusion-panel" id="difusion-publicar">
      <header class="difusion-grupo-head">
        <div>
          <p class="difusion-paso">3. Publicar un aviso</p>
          <p class="difusion-grupo-lead">Elija la ficha y marque destinos conectados. El sitio propio ya está en la vitrina.</p>
        </div>
      </header>
      <form class="difusion-publicar-form" id="difusion-publicar-form">
        <div class="nh-field">
          <label for="pub-item">Aviso</label>
          <select id="pub-item" name="item" required>
            ${items.map((item) => `<option value="${esc(item.id)}" ${shareItem && item.id === shareItem.id ? "selected" : ""}>${esc(item.codigo)} · ${esc(item.titulo)}</option>`).join("")}
          </select>
        </div>
        <div class="publish-grid">
          <fieldset class="publish-set">
            <legend>Portales</legend>
            ${sitiosOk.map((dest) => `
              <label class="destino-row">
                <span class="cuenta-mark destino-row-mark" data-dest="${esc(dest.id)}" aria-hidden="true">${esc(destMarca(dest))}</span>
                <span class="destino-check"><input type="checkbox" name="dest" value="${esc(dest.id)}"></span>
                <span class="destino-copy"><strong>${esc(dest.nombre)}</strong></span>
              </label>`).join("") || "<p class=\"cola-vacia\">Ninguno conectado</p>"}
          </fieldset>
          <fieldset class="publish-set">
            <legend>Redes</legend>
            ${redesOk.map((dest) => `
              <label class="destino-row">
                <span class="cuenta-mark destino-row-mark" data-dest="${esc(dest.id)}" aria-hidden="true">${esc(destMarca(dest))}</span>
                <span class="destino-check"><input type="checkbox" name="dest" value="${esc(dest.id)}" checked></span>
                <span class="destino-copy"><strong>${esc(dest.nombre)}</strong></span>
              </label>`).join("") || "<p class=\"cola-vacia\">Ninguna conectada</p>"}
          </fieldset>
        </div>
        <div class="difusion-toolbar">
          <button class="btn-panel" type="submit">Publicar marcados</button>
          <button class="ghost" type="button" data-panel-nav="cartera">Abrir en cartera</button>
        </div>
      </form>
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
    ${htmlDifusionResumen(editable)}
    ${htmlGrupoCuentas("sitio", "Sitios y portales", "Vitrina y portales de Argentina. Conectar solo marca la cuenta en esta demo.", "1")}
    ${htmlGrupoCuentas("red", "Redes sociales", "Instagram, Facebook, Marketplace, WhatsApp y TikTok. El texto se copia a mano.", "2")}
    ${htmlDifusionPublicar(editable)}
    <section class="difusion-panel" id="difusion-cola">
      <header class="difusion-grupo-head">
        <div>
          <p class="difusion-paso">4. Cola de publicación</p>
          <p class="difusion-grupo-lead">Estados de ejemplo: listo, programado o publicado. Publicado solo marca el aviso.</p>
        </div>
      </header>
      ${editable && destinosCola.length ? `
        <form class="cola-alta" id="cola-alta">
          <div class="nh-field">
            <label for="cola-item">Aviso</label>
            <select id="cola-item" name="item">
              ${items.map((item) => `<option value="${esc(item.id)}" ${item.id === selected ? "selected" : ""}>${esc(item.codigo)} · ${esc(item.titulo)}</option>`).join("")}
            </select>
          </div>
          <div class="nh-field">
            <label for="cola-dest">Destino</label>
            <select id="cola-dest" name="dest">
              ${destinosCola.map((d) => `<option value="${esc(d.id)}">${esc(d.nombre)}</option>`).join("")}
            </select>
          </div>
          <div class="cola-alta-action">
            <button class="btn-panel" type="submit">Agregar</button>
          </div>
        </form>` : editable ? `<p class="cola-vacia">Conecte un portal o una red para armar la cola.</p>` : `<p class="cola-vacia">Solo lectura con su rol.</p>`}
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
                <td><strong>${esc(fila.item.codigo)}</strong><br><small>${esc(fila.item.titulo)}</small></td>
                <td>
                  <span class="cola-dest-cell">
                    <span class="cuenta-mark destino-row-mark" data-dest="${esc(fila.dest.id)}" aria-hidden="true">${esc(destMarca(fila.dest))}</span>
                    <span>${esc(fila.dest.nombre)}</span>
                  </span>
                </td>
                <td>
                  ${fila.dest.fijo || !editable
                    ? `<span class="tag cola-${esc(fila.estado)}">${esc(colaEstadoLabel(fila.estado))}</span>`
                    : `<select class="cola-estado" data-cola-estado="${esc(fila.item.id)}" data-dest="${esc(fila.dest.id)}" aria-label="Estado">
                        ${COLA_ESTADOS.map((e) => `<option value="${esc(e.id)}" ${fila.estado === e.id ? "selected" : ""}>${esc(e.label)}</option>`).join("")}
                      </select>`}
                </td>
                <td>${esc(fila.when || "—")}</td>
                <td>${fila.dest.fijo || !editable ? "" : `<button type="button" class="ghost" data-cola-quitar="${esc(fila.item.id)}" data-dest="${esc(fila.dest.id)}">Sacar</button>`}</td>
              </tr>`).join("") : `<tr><td colspan="5">La cola está vacía. El sitio propio ya muestra la cartera.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
    <section class="difusion-panel" id="difusion-share">
      <header class="difusion-grupo-head">
        <div>
          <p class="difusion-paso">5. Texto para redes</p>
          <p class="difusion-grupo-lead">Copie el texto o ábralo en WhatsApp. No se publica solo.</p>
        </div>
      </header>
      <div class="difusion-share-grid">
        <div class="nh-field">
          <label for="difusion-share-item">Aviso</label>
          <select id="difusion-share-item">
            ${items.map((item) => `<option value="${esc(item.id)}" ${shareItem && item.id === shareItem.id ? "selected" : ""}>${esc(item.codigo)} · ${esc(item.titulo)}</option>`).join("")}
          </select>
        </div>
        <div class="nh-field difusion-share-text-field">
          <label for="difusion-share-text">Texto</label>
          <textarea id="difusion-share-text" rows="4" readonly>${esc(shareText)}</textarea>
        </div>
      </div>
      <div class="difusion-toolbar">
        <button class="btn-panel" type="button" id="difusion-copiar" ${shareItem ? "" : "disabled"}>Copiar texto</button>
        <a class="ghost" id="difusion-wa" ${shareItem ? `href="${esc("https://wa.me/?text=" + encodeURIComponent(shareText))}"` : ""} target="_blank" rel="noopener">WhatsApp</a>
        <button class="ghost" type="button" data-panel-nav="cartera">Ver en cartera</button>
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

  host.querySelector("[data-conectar-redes]")?.addEventListener("click", () => conectarRedesMuestra());
  host.querySelector("[data-publicar-listos]")?.addEventListener("click", () => publicarListosCola());
  host.querySelectorAll("[data-difusion-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.difusionScroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  host.querySelector("#difusion-publicar-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const itemId = String(data.get("item") || "");
    const destIds = data.getAll("dest").map(String);
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      showToast("Elija un aviso de la cartera.");
      return;
    }
    selected = item.id;
    if (!destIds.length) {
      showToast("Marque al menos un portal o una red.");
      return;
    }
    publicarAviso(item, destIds);
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

  host.querySelectorAll("[data-panel-nav='cartera']").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCarteraEditor(selected || items[0]?.id, { instant: false });
    });
  });
}

function renderCuentas() {
  renderDifusion();
}

function render() {
  if (currentView === "difusion") renderDifusion();
  paintCarteraStats();
  if (carteraMode === "edit" || carteraMode === "create") {
    paintCarteraEditor();
    return;
  }
  paintCarteraList();
}

function paintCarteraStats() {
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const reservadas = items.filter((i) => i.status === "reservada").length;
  const alquiladas = items.filter((i) => i.status === "alquilada").length;
  const vendidas = items.filter((i) => i.status === "vendida").length;
  const stats = document.getElementById("stats");
  if (!stats) return;
  stats.hidden = carteraMode !== "list";
  stats.innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${items.length}</strong>propiedades</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="reservada" class="${filter === "reservada" ? "on" : ""}"><strong>${reservadas}</strong>reservadas</button>
    <button type="button" data-filter="alquilada" class="${filter === "alquilada" ? "on" : ""}"><strong>${alquiladas}</strong>alquiladas</button>
    <button type="button" data-filter="vendida" class="${filter === "vendida" ? "on" : ""}"><strong>${vendidas}</strong>vendidas</button>
    <input class="panel-search" type="text" id="search" placeholder="Buscar zona o dirección" value="${esc(searchTerm)}" aria-label="Buscar">
  `;
  document.getElementById("search")?.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });
  stats.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });
}

function paintCarteraList() {
  const list = document.getElementById("cartera-list");
  const detail = document.getElementById("detail");
  if (list) list.hidden = false;
  if (detail) {
    detail.hidden = true;
    detail.innerHTML = "";
  }
  const editable = canEditCartera();
  const rows = visible();
  const host = document.getElementById("rows");
  if (!host) return;
  host.innerHTML = rows.map((item) => {
    const foto = fotosDeItem(item)[0];
    return `
    <tr class="row ${item.id === selected ? "on" : ""}" data-id="${esc(item.id)}">
      <td><img class="thumb" src="${esc(foto)}" alt=""></td>
      <td>${esc(item.codigo)}</td>
      <td>${esc(item.titulo)}<br><small style="color:#666">${esc(tipoLabel(item.tipo))} · ${esc(opLabel(item.operacion))} · ${item.superficie || "—"} m²</small></td>
      <td>${esc(item.barrio)}</td>
      <td class="amount">${item.operacion === "venta" ? esc(money(item.precio, true)) : esc(money(item.precio))}</td>
      <td><span class="tag ${esc(item.status)}">${esc(label(item.status))}</span></td>
      <td class="cartera-metricas">
        <strong>${Number(item.vistas || 0)}</strong> visitas web
        <small>${Number(item.consultas || 0)} consultas · ${interaccionesDe(item)} interacc.</small>
      </td>
      <td>${htmlDestinosChips(item)}</td>
      <td>
        <div class="row-actions">
          <button type="button" class="ghost" data-edit="${esc(item.id)}">${editable ? "Editar" : "Ver ficha"}</button>
          ${editable ? `<button type="button" class="ghost" data-pub="${esc(item.id)}">Publicar</button>` : ""}
          <a class="ghost" href="propiedad.html?id=${esc(item.id)}" target="_blank" rel="noopener">Ver vitrina</a>
        </div>
      </td>
    </tr>`;
      }).join("") || `<tr><td colspan="9">No hay propiedades en este estado.</td></tr>`;

  host.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openCarteraEditor(btn.dataset.edit));
  });
  host.querySelectorAll("[data-pub]").forEach((btn) => {
    btn.addEventListener("click", () => openCarteraEditor(btn.dataset.pub, { focus: "publicar" }));
  });
}

function paintCarteraEditor() {
  const list = document.getElementById("cartera-list");
  const detail = document.getElementById("detail");
  const isCreate = carteraMode === "create";
  const item = isCreate ? editorDraft : items.find((i) => i.id === selected);
  if (list) list.hidden = true;
  if (!detail) return;
  detail.hidden = false;
  if (!item) {
    showCarteraList();
    paintCarteraList();
    return;
  }

  const formReadonly = !canEditCartera();
  const publishReadonly = !canEditDifusion();
  const dis = formReadonly ? "disabled" : "";
  const fotos = (item.imagenes || []).filter(Boolean);
  const precioStr = item.operacion === "venta" ? money(item.precio, true) : money(item.precio) + " /mes";
  const readonlyHint = formReadonly
    ? (session?.rol === "marketing"
      ? `<p class="editor-readonly">Marketing no edita la ficha. Puede marcar destinos en Difusión y textos de la vitrina.</p>`
      : session?.rol === "agenda"
        ? `<p class="editor-readonly">La agenda puede ver la ficha. Un agente, comercial o el titular la edita o la publica.</p>`
        : `<p class="editor-readonly">Su rol puede ver esta ficha en solo lectura.</p>`)
    : "";

  detail.innerHTML = `
    <div class="editor-head">
      <div>
        <p class="eyebrow">${isCreate ? "Alta en cartera" : esc(opLabel(item.operacion)) + " · " + esc(tipoLabel(item.tipo))}</p>
        <h2>${isCreate ? "Nueva propiedad" : esc(item.titulo || "Ficha")}</h2>
        <p>${isCreate ? "Complete la ficha. Al guardar, sale en la vitrina de este navegador." : esc(item.direccion || "Sin dirección") + " · " + precioStr}</p>
      </div>
      <button type="button" class="ghost" id="volver-listado">Volver al listado</button>
    </div>
    ${readonlyHint}
    ${htmlGaleria(fotos, formReadonly)}
    ${isCreate ? "" : `
    <div class="metric-box">
      <div><span>Visitas en la web</span><strong>${Number(item.vistas || 0)}</strong><small>Aperturas de esta ficha en la vitrina. Solo se ven en el panel.</small></div>
      <div><span>Consultas</span><strong>${Number(item.consultas || 0)}</strong><small>WhatsApp o formulario de esta propiedad.</small></div>
      <div><span>Les gusta</span><strong>${likesDe(item)}</strong><small>Marcas de me gusta en este navegador. Demo: no hay servidor ni recuento de personas reales.</small></div>
      <div><span>Visitas presenciales</span><strong>${visitasPresencialesDe(item)}</strong><small>Agenda cargada en esta ficha.</small></div>
      <div><span>Interacciones</span><strong>${interaccionesDe(item)}</strong><small>Consultas + les gusta + visitas presenciales. No hay tráfico inventado.</small></div>
    </div>
    ${item.bajoPrecio ? `<p class="editor-precio-nota">Este aviso muestra “Bajó de precio” en la vitrina${item.precioAnterior ? " (antes " + esc(item.operacion === "venta" ? money(item.precioAnterior, true) : money(item.precioAnterior)) + ")" : ""}. Si sube el precio y guarda, se quita.</p>` : ""}`}
    <form id="edit" class="ficha-form" novalidate>
      <p class="nh-form-error" id="edit-error" role="alert"></p>
      <section class="nh-form-section">
        <h3>Datos del aviso</h3>
        <div class="editor-grid">
          ${nhField("edit-codigo", "Código", `<input id="edit-codigo" name="codigo" value="${esc(item.codigo)}" required ${dis}>`)}
          ${nhField("edit-titulo", "Título", `<input id="edit-titulo" name="titulo" value="${esc(item.titulo)}" required ${dis}>`, "editor-span-2")}
          ${nhField("edit-tipo", "Tipo", `<select id="edit-tipo" name="tipo" ${dis}>
            ${TIPOS.map((t) => `<option value="${t.id}" ${item.tipo === t.id ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
          </select>`)}
          ${nhField("edit-operacion", "Operación", `<select id="edit-operacion" name="operacion" ${dis}>
            ${OPERACIONES.map((o) => `<option value="${o.id}" ${item.operacion === o.id ? "selected" : ""}>${esc(o.label)}</option>`).join("")}
          </select>`)}
          ${nhField("edit-status", "Estado", `<select id="edit-status" name="status" ${dis}>
            ${STATUSES.map((s) => `<option value="${s.id}" ${item.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
          </select>`)}
        </div>
      </section>
      <section class="nh-form-section">
        <h3>Ubicación</h3>
        <div class="editor-grid">
          ${nhField("edit-direccion", "Dirección", `<input id="edit-direccion" name="direccion" value="${esc(item.direccion)}" ${dis}>`, "editor-span")}
          ${nhField("edit-barrio", "Zona", `<select id="edit-barrio" name="barrio" ${dis}>${zonaOptions(item.barrio)}</select>`)}
        </div>
      </section>
      <section class="nh-form-section">
        <h3>Superficie y ambientes</h3>
        <div class="editor-grid">
          ${nhField("edit-ambientes", "Ambientes", `<input id="edit-ambientes" name="ambientes" type="number" min="0" step="1" value="${item.ambientes || 0}" ${dis}>`)}
          ${nhField("edit-dormitorios", "Dormitorios", `<input id="edit-dormitorios" name="dormitorios" type="number" min="0" step="1" value="${item.dormitorios || 0}" ${dis}>`)}
          ${nhField("edit-banos", "Baños", `<input id="edit-banos" name="banos" type="number" min="0" step="1" value="${item.banos || 0}" ${dis}>`)}
          ${nhField("edit-cubierta", "m² cubiertos", `<input id="edit-cubierta" name="cubierta" type="number" min="0" step="1" value="${item.cubierta || 0}" ${dis}>`)}
          ${nhField("edit-superficie", "m² de lote", `<input id="edit-superficie" name="superficie" type="number" min="0" step="1" value="${item.superficie || 0}" ${dis}>`)}
          ${nhField("edit-piso", "Piso", `<input id="edit-piso" name="piso" value="${esc(item.piso || "")}" ${dis}>`)}
          ${nhField("edit-vista", "Vista", `<input id="edit-vista" name="vista" value="${esc(item.vista || "")}" ${dis}>`)}
          ${nhField("edit-calefaccion", "Calefacción", `<input id="edit-calefaccion" name="calefaccion" value="${esc(item.calefaccion || "")}" ${dis}>`)}
          ${nhField("edit-servicios", "Servicios", `<input id="edit-servicios" name="servicios" value="${esc(item.servicios || "")}" ${dis}>`)}
        </div>
      </section>
      <section class="nh-form-section">
        <h3>Precios</h3>
        <p class="lead-mini">La venta se muestra en dólares y el alquiler permanente en pesos. Si baja el precio al guardar, la vitrina muestra “Bajó de precio”.</p>
        <div class="editor-grid">
          ${nhField("edit-precio", "Precio", `<input id="edit-precio" name="precio" type="number" min="0" step="1" value="${item.precio || 0}" required ${dis}>`)}
          ${nhField("edit-expensas", "Expensas", `<input id="edit-expensas" name="expensas" type="number" min="0" step="1" value="${item.expensas || 0}" ${dis}>`)}
        </div>
      </section>
      <section class="nh-form-section">
        <h3>Descripción</h3>
        <div class="editor-grid">
          ${nhField("edit-descripcion", "Texto de la ficha", `<textarea id="edit-descripcion" name="descripcion" rows="6" ${dis}>${esc(item.descripcion || "")}</textarea>`, "editor-span")}
        </div>
      </section>
      <section class="nh-form-section">
        <h3>Características</h3>
        <p class="lead-mini">Salen como etiquetas en la ficha pública.</p>
        <div class="edit-amenities check-wrap">
          ${AMENITIES.map((a) => `
            <label class="nh-check">
              <input type="checkbox" name="amenity" value="${esc(a.id)}" ${(item.amenities || []).includes(a.id) ? "checked" : ""} ${dis}>
              <span>${esc(a.label)}</span>
            </label>`).join("")}
        </div>
        <div class="edit-flags check-wrap">
          <label class="nh-check"><input type="checkbox" name="destacado" ${item.destacado ? "checked" : ""} ${dis}> <span>Destacar en la vitrina</span></label>
          <label class="nh-check"><input type="checkbox" name="nuevo" ${item.nuevo ? "checked" : ""} ${dis}> <span>Mostrar como nueva publicación</span></label>
        </div>
        <p class="lead-mini">Puede destacar varias. “Nueva publicación” sale en la tira de recién publicadas y con el sello en la vitrina. Bajar el precio al guardar marca “Bajó de precio” en la web; subirlo lo quita.</p>
      </section>
      ${formReadonly ? "" : `
      <div class="form-actions form-actions--sticky actions">
        <button class="btn-panel" type="submit">${isCreate ? "Agregar a la cartera" : "Guardar en vitrina"}</button>
        <button class="ghost" type="button" id="cancelar-edicion">Cancelar</button>
        ${isCreate || !canDeleteCartera() ? "" : `<button class="ghost ghost-danger" type="button" id="remove">Eliminar</button>`}
      </div>`}
    </form>
    ${htmlPublishBlock(item, isCreate, publishReadonly)}
    ${isCreate || item.factura ? (item.factura ? `
      <section class="nh-form-section factura-box">
        <h3>Operación facturada</h3>
        <div class="factura-grid">
          <div><span>Tipo</span><strong>${esc(compLabel(item.factura.tipo))}</strong></div>
          <div><span>Número</span><strong>${esc(item.factura.numero)}</strong></div>
          <div><span>Total</span><strong>${item.factura.total > 100000 ? money(item.factura.total, true) : money(item.factura.total)}</strong></div>
          <div><span>CAE</span><strong class="cae">${esc(item.factura.cae)}</strong></div>
          <div><span>Vto CAE</span><strong>${esc(item.factura.vto)}</strong></div>
        </div>
      </section>
    ` : "") : (!canEmitArca() ? "" : `
      <section class="nh-form-section arca-section">
        <h3>Facturación ARCA</h3>
        <p class="lead-mini">Demo: genera un CAE de ejemplo. En un sistema real se conecta a ARCA.</p>
        <div class="editor-grid">
          ${nhField("arca-cuit", "CUIT del cliente", `<input id="arca-cuit" inputmode="numeric" autocomplete="off">`)}
          ${nhField("arca-tipo", "Tipo de comprobante", `<select id="arca-tipo">
              ${COMPROBANTES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
            </select>`)}
          ${nhField("arca-concepto", "Concepto", `<select id="arca-concepto">
              <option value="alquiler">Alquiler mensual</option>
              <option value="comision">Comisión de venta</option>
              <option value="reserva">Reserva</option>
              <option value="expensas">Expensas</option>
            </select>`)}
        </div>
        <div class="form-actions">
          <button class="btn-panel" type="button" id="emitir-factura">Emitir factura (simulado)</button>
        </div>
      </section>
    `)}
    ${!isCreate && (item.visitas || []).length ? `
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
    ${!isCreate ? `
    <div class="timeline">
      <h3>Historial</h3>
      ${(item.history || []).map((h) => `<p><time>${esc(h.when)}</time>${esc(h.text)}</p>`).join("") || "<p>Sin movimientos todavía.</p>"}
    </div>` : ""}
  `;

  detail.querySelector("#volver-listado")?.addEventListener("click", () => {
    showCarteraList();
    render();
  });
  detail.querySelector("#cancelar-edicion")?.addEventListener("click", () => {
    showCarteraList();
    render();
  });

  wireFotoEditor(detail, item, isCreate ? false : true);

  detail.querySelector("#emitir-factura")?.addEventListener("click", () => {
    if (!canEmitArca()) return;
    const tipo = detail.querySelector("#arca-tipo").value;
    const cuit = detail.querySelector("#arca-cuit").value;
    const concepto = detail.querySelector("#arca-concepto").value;
    const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
    const cae = String(Math.floor(Math.random() * 99999999999999));
    const vtoDate = new Date();
    vtoDate.setDate(vtoDate.getDate() + 10);
    const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
    const total = concepto === "comision" ? Math.round(item.precio * 0.03)
      : concepto === "alquiler" ? item.precio
      : concepto === "reserva" ? Math.round(item.precio * 0.1)
      : item.expensas || 0;
    item.factura = { tipo, numero, cae, vto, total, cuit, concepto };
    item.history = [{ when: "hoy", text: `Factura ${compLabel(tipo)} emitida. CAE: ${cae}` }, ...(item.history || [])];
    save(items);
    showToast("Factura emitida");
    render();
  });

  detail.querySelector("#publicar-aviso")?.addEventListener("click", () => {
    const ids = [...detail.querySelectorAll("[data-pub-dest]:checked")].map((el) => el.dataset.pubDest);
    publicarAviso(item, ids);
  });

  detail.querySelector("#copiar-aviso")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(textoRed(item));
      showToast("Texto copiado");
    } catch {
      showToast("No se pudo copiar. Seleccione el texto a mano.");
    }
  });

  detail.querySelector("[data-go-difusion]")?.addEventListener("click", () => {
    showPanelView("difusion");
  });

  detail.querySelector("#edit")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEditCartera()) return;
    const form = event.target;
    const err = form.querySelector("#edit-error");
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    const invalid = [...form.querySelectorAll(":invalid")];
    if (invalid.length) {
      invalid.forEach((el) => el.classList.add("is-invalid"));
      if (err) err.textContent = "Complete código, título y precio.";
      invalid[0].focus();
      return;
    }
    if (err) err.textContent = "";
    const prevStatus = item.status;
    const prevPrecio = Number(item.precio || 0);
    applyFormToItem(form, item);
    if (isCreate) {
      guardarAlta(item);
      return;
    }
    if (prevStatus !== item.status) {
      item.history = [{ when: "hoy", text: `Estado cambiado a: ${label(item.status)}.` }, ...(item.history || [])];
    } else if (item.precio < prevPrecio) {
      item.history = [{ when: "hoy", text: "Precio bajado. La vitrina muestra “Bajó de precio”. No se inventó un descuento." }, ...(item.history || [])];
    } else {
      item.history = [{ when: "hoy", text: "Ficha actualizada. La vitrina ya toma estos datos." }, ...(item.history || [])];
    }
    if (!persistCartera()) return;
    showToast("Cambios guardados en la vitrina");
    render();
  });

  detail.querySelector("#remove")?.addEventListener("click", () => {
    if (!canDeleteCartera()) {
      showToast(denyCarteraMsg("eliminar"));
      return;
    }
    if (!confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    items = items.filter((i) => i.id !== item.id);
    selected = items[0]?.id || "";
    save(items);
    showCarteraList();
    showToast("Propiedad eliminada");
    render();
  });

  if (editorFocus === "publicar") {
    detail.querySelector("#bloque-publicar")?.scrollIntoView({ block: "start" });
  }
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
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, Math.min(5600, 2800 + message.length * 18));
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
    if (next === "cartera" && !opts?.keepEditor) showCarteraList();
    if (next === "resumen") renderResumen();
    if (next === "cartera") render();
    if (next === "zonas") renderZonas();
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

function actividadReciente() {
  const rows = [];
  items.forEach((item) => {
    (item.history || []).slice(0, 2).forEach((h) => {
      rows.push({
        when: h.when || "",
        text: h.text || "",
        codigo: item.codigo,
        kind: "ficha"
      });
    });
    (item.visitas || []).slice(0, 1).forEach((v) => {
      rows.push({
        when: v.fecha || "",
        text: "Visita presencial: " + (v.cliente || "") + (v.nota ? " — " + v.nota : ""),
        codigo: item.codigo,
        kind: "visita"
      });
    });
  });
  filasCola().forEach((fila) => {
    rows.push({
      when: fila.when || "",
      text: fila.dest.nombre + ": " + colaEstadoLabel(fila.estado) + " (demo)",
      codigo: fila.item.codigo,
      kind: "cola"
    });
  });
  return rows.slice(0, 8);
}

function renderResumen() {
  const host = document.getElementById("resumen-desk");
  if (!host) return;
  const nombre = session?.nombre || "el estudio";
  const rol = roleLabel(session?.rol);
  const disponibles = items.filter((i) => i.status === "disponible").length;
  const visitas = items.reduce((sum, i) => sum + Number(i.vistas || 0), 0);
  const consultas = items.reduce((sum, i) => sum + Number(i.consultas || 0), 0);
  const avisosPortales = items.filter((item) => DESTINOS.some((d) => !d.fijo && portalesDe(item)[d.id])).length;
  const cuentasOn = DESTINOS.filter((d) => destinoConectado(d.id)).length;
  const destacadas = items.filter((i) => i.destacado);
  const recientes = recientesDe(items, 4);
  const topVistas = [...items].sort((a, b) => Number(b.vistas || 0) - Number(a.vistas || 0)).slice(0, 5);
  const topInter = [...items].sort((a, b) => interaccionesDe(b) - interaccionesDe(a)).slice(0, 5);
  const actividad = actividadReciente();
  host.innerHTML = `
    <header class="resumen-hello">
      <p class="eyebrow">Inicio del panel</p>
      <span class="resumen-rol">${esc(rol)}</span>
      <h1>Hola, ${esc(nombre)}</h1>
      <p>Está adentro como ${esc(rol).toLowerCase()}. Estas cifras salen de la cartera, las visitas al aviso, las consultas y las cuentas de Difusión en este navegador. No son métricas de un producto en internet.</p>
    </header>
    <div class="resumen-cards">
      <button type="button" class="resumen-card" data-go="cartera">
        <span>Propiedades</span>
        <strong>${items.length}</strong>
        <small>en la cartera de este navegador</small>
      </button>
      <button type="button" class="resumen-card" data-go="cartera">
        <span>Disponibles</span>
        <strong>${disponibles}</strong>
        <small>listas para la vitrina</small>
      </button>
      <button type="button" class="resumen-card" data-go="cartera">
        <span>Visitas al anuncio</span>
        <strong>${visitas}</strong>
        <small>solo se ven en el panel</small>
      </button>
      <button type="button" class="resumen-card" data-go="cartera">
        <span>Consultas</span>
        <strong>${consultas}</strong>
        <small>solo se ven en el panel</small>
      </button>
      <button type="button" class="resumen-card" data-go="difusion">
        <span>Avisos en portales</span>
        <strong>${avisosPortales}</strong>
        <small>marcados en portales o redes de esta demo</small>
      </button>
      <button type="button" class="resumen-card" data-go="difusion">
        <span>Cuentas conectadas</span>
        <strong>${cuentasOn}</strong>
        <small>de ${DESTINOS.length} destinos de esta demo</small>
      </button>
    </div>
    <div class="resumen-split">
      <section class="resumen-panel">
        <h2>Actividad reciente</h2>
        <p>Historial de fichas, visitas presenciales y cola de difusión. Todo es de ejemplo.</p>
        ${actividad.length ? `<ul class="resumen-activity">${actividad.map((row) => `
          <li>
            <strong>${esc(row.codigo)} · ${esc(row.text)}</strong>
            <span>${esc(row.when || "sin fecha")}</span>
          </li>`).join("")}</ul>` : `<p class="resumen-empty">Todavía no hay movimientos en esta demo.</p>`}
      </section>
      <section class="resumen-panel">
        <h2>Atajos</h2>
        <p>Entre a la sección que necesita. El menú de arriba sigue disponible.</p>
        <div class="resumen-shortcuts">
          <button type="button" data-open-create><strong>Nueva propiedad</strong><small>Alta en la cartera. Sale en la vitrina de este navegador</small></button>
          <button type="button" data-go="cartera"><strong>Ir a Cartera</strong><small>Editar avisos y publicar destinos</small></button>
          <button type="button" data-go="zonas"><strong>Ir a Zonas</strong><small>Localidades y zonas relacionadas de la comarca</small></button>
          <button type="button" data-go="vitrina"><strong>Ir a Vitrina</strong><small>Textos y bloques de la web pública</small></button>
          <button type="button" data-go="difusion"><strong>Ir a Difusión</strong><small>Conectar portales y armar la cola</small></button>
          <button type="button" data-go="usuarios"><strong>Ir a Usuarios</strong><small>${staff.filter((u) => u.activo !== false).length} cuentas activas de ${staff.length}</small></button>
        </div>
      </section>
    </div>
    <div class="resumen-split">
      <section class="resumen-panel">
        <h2>Más vistas en la web</h2>
        <p>Aperturas de cada ficha en este navegador. No se muestran en la vitrina pública.</p>
        <ul class="resumen-rank">
          ${topVistas.map((row) => `
            <li>
              <button type="button" data-ficha="${esc(row.id)}">
                <strong>${esc(row.codigo)} · ${esc(row.titulo)}</strong>
                <span>${Number(row.vistas || 0)} visitas web · ${interaccionesDe(row)} interacc.</span>
              </button>
            </li>`).join("")}
        </ul>
      </section>
      <section class="resumen-panel">
        <h2>Más interacciones</h2>
        <p>Consultas + favorito de este navegador + visitas presenciales. Sin números inventados.</p>
        <ul class="resumen-rank">
          ${topInter.map((row) => `
            <li>
              <button type="button" data-ficha="${esc(row.id)}">
                <strong>${esc(row.codigo)} · ${esc(row.titulo)}</strong>
                <span>${Number(row.consultas || 0)} consultas · ${likesDe(row)} les gusta · ${visitasPresencialesDe(row)} presenciales</span>
              </button>
            </li>`).join("")}
        </ul>
      </section>
    </div>
    <div class="resumen-split">
      <section class="resumen-panel">
        <h2>Destacadas en la vitrina</h2>
        <p>Puede destacar una o varias. El catálogo público las pone primero y con sello Destacado.</p>
        ${destacadas.length ? `<ul class="resumen-rank">${destacadas.map((row) => `
          <li>
            <button type="button" data-ficha="${esc(row.id)}">
              <strong>${esc(row.codigo)} · ${esc(row.titulo)}</strong>
              <span>${esc(row.barrio)}</span>
            </button>
          </li>`).join("")}</ul>` : `<p class="resumen-empty">Ningún aviso está destacado. Márquelo en la ficha de Cartera.</p>`}
        <h2 class="resumen-sub">Recientes</h2>
        <p>Avisos con “Mostrar como reciente” o recién cargados.</p>
        ${recientes.length ? `<ul class="resumen-rank">${recientes.map((row) => `
          <li>
            <button type="button" data-ficha="${esc(row.id)}">
              <strong>${esc(row.codigo)} · ${esc(row.titulo)}</strong>
              <span>${row.nuevo ? "Reciente en vitrina" : "Alta reciente"}</span>
            </button>
          </li>`).join("")}</ul>` : `<p class="resumen-empty">Ningún aviso está marcado como reciente.</p>`}
      </section>
      <section class="resumen-panel">
        <h2>Destinos de esta demo</h2>
        <p>Sitios, portales y redes. Conecte en Difusión. Nada se envía afuera.</p>
        <p class="difusion-ficha-grupo">Sitios y portales</p>
        <ul class="resumen-cuentas">
          ${destinosPorGrupo("sitio").map((d) => {
            const on = destinoConectado(d.id);
            const n = avisosEnDestino(d.id);
            return `<li><strong>${esc(d.nombre)}</strong><span>${on ? n + " aviso" + (n === 1 ? "" : "s") : "No conectado"}</span></li>`;
          }).join("")}
        </ul>
        <p class="difusion-ficha-grupo">Redes sociales</p>
        <ul class="resumen-cuentas">
          ${destinosPorGrupo("red").map((d) => {
            const on = destinoConectado(d.id);
            const n = avisosEnDestino(d.id);
            return `<li><strong>${esc(d.nombre)}</strong><span>${on ? n + " aviso" + (n === 1 ? "" : "s") : "No conectado"}</span></li>`;
          }).join("")}
        </ul>
      </section>
    </div>`;
  host.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showPanelView(btn.dataset.go));
  });
  host.querySelectorAll("[data-ficha]").forEach((btn) => {
    btn.addEventListener("click", () => openCarteraEditor(btn.dataset.ficha, { instant: false }));
  });
}

function renderZonas() {
  const host = document.getElementById("zonas-desk");
  if (!host) return;
  const editable = canEditZonas();
  const list = typeof zonasTodas === "function" ? zonasTodas() : ZONAS;
  const parentOpts = `<option value="">Ninguna · pin general de Bariloche</option>` + list.map((z) =>
    `<option value="${esc(z.id)}">${esc(z.nombre)}</option>`
  ).join("");
  host.innerHTML = `
    ${editable ? `
    <form class="zona-alta form-shell" id="zona-alta">
      <div class="nh-field">
        <label for="zona-nombre">Nombre</label>
        <input id="zona-nombre" name="nombre" required maxlength="60" placeholder="Villa Catedral">
      </div>
      <div class="nh-field">
        <label for="zona-texto">Texto corto</label>
        <input id="zona-texto" name="texto" maxlength="160" placeholder="Cerro y bosque, al oeste">
      </div>
      <div class="nh-field">
        <label for="zona-parent">Zona relacionada</label>
        <select id="zona-parent" name="parentId">${parentOpts}</select>
      </div>
      <p class="nh-form-error" id="zona-alta-error" role="alert"></p>
      <div class="form-actions">
        <button class="btn-panel" type="submit">Agregar zona</button>
      </div>
    </form>` : `<p class="cola-vacia">La agenda puede ver las zonas. Un agente o el titular carga una localidad nueva.</p>`}
    <div class="table-scroll">
      <table class="cartera-tabla">
        <thead>
          <tr>
            <th>Zona</th>
            <th>Texto</th>
            <th>Relacionada</th>
            <th>Origen</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${list.map((z) => {
            const cerca = typeof zonaCercaNombre === "function" ? zonaCercaNombre(z) : "";
            const fija = !z.custom;
            return `<tr>
              <td><strong>${esc(z.nombre)}</strong></td>
              <td>${esc(z.texto || "—")}</td>
              <td>${cerca ? "Cerca de " + esc(cerca) : "—"}</td>
              <td>${fija ? "Comarca" : "Cargada por el estudio"}</td>
              <td>${fija || !editable ? "" : `<button type="button" class="ghost" data-zona-quitar="${esc(z.id)}">Quitar</button>`}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
    <p class="lead-mini">Agregar una zona no crea avisos. Después elija esa localidad en la ficha de Cartera. El mapa usa el pin de la zona relacionada o el centro de Bariloche; no marca una parcela.</p>
  `;

  host.querySelector("#zona-alta")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEditZonas()) {
      showToast("Su rol no carga zonas. Eso lo hace un agente, comercial o el titular.");
      return;
    }
    const data = new FormData(event.target);
    const err = document.getElementById("zona-alta-error");
    const result = agregarZonaCustom({
      nombre: String(data.get("nombre") || ""),
      texto: String(data.get("texto") || ""),
      parentId: String(data.get("parentId") || "")
    });
    if (!result.ok) {
      if (err) err.textContent = result.error;
      event.target.nombre?.focus();
      return;
    }
    if (err) err.textContent = "";
    event.target.reset();
    showToast("Zona agregada. Ya aparece en la vitrina y en el alta de propiedades. No se inventaron avisos.");
    renderZonas();
  });

  host.querySelectorAll("[data-zona-quitar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!canEditZonas()) return;
      if (!quitarZonaCustom(btn.dataset.zonaQuitar)) {
        showToast("Las zonas de la comarca no se quitan.");
        return;
      }
      showToast("Zona quitada. Los avisos que la usaban siguen en la cartera.");
      renderZonas();
    });
  });
}

function renderVitrinaGestor() {
  const host = document.getElementById("vitrina-gestor");
  if (!host) return;
  const page = loadVitrinaPage();
  const editable = canEditVitrina();
  host.innerHTML = VITRINA_SECTIONS.map((sec) => {
    const on = sec.alwaysOn ? true : page.visible[sec.id] !== false;
    const fields = (sec.fields || []).map((field, i) => {
      const val = vitrinaCopyAt(page.copy, field.path);
      const fid = "vit-" + sec.id + "-" + i;
      const control = field.kind === "area"
        ? `<textarea id="${fid}" name="${esc(field.path)}" rows="3" ${editable ? "" : "disabled"}>${esc(val || "")}</textarea>`
        : `<input id="${fid}" name="${esc(field.path)}" value="${esc(val || "")}" ${editable ? "" : "disabled"}>`;
      return nhField(fid, field.label, control);
    }).join("");
    const toggle = sec.alwaysOn
      ? `<p class="vitrina-always">Siempre visible en la vitrina.</p>`
      : `<label class="vitrina-toggle"><input type="checkbox" data-vitrina-visible="${esc(sec.id)}" ${on ? "checked" : ""} ${editable ? "" : "disabled"}> Mostrar en la vitrina</label>`;
    const save = editable
      ? `<button class="btn-panel" type="submit">Guardar esta sección</button>`
      : `<p class="vitrina-readonly">Solo titular, agente o marketing publican u ocultan la vitrina. Usted puede leer los textos.</p>`;
    return `
      <article class="vitrina-block ${on ? "is-on" : "is-off"}">
        <header>
          <div>
            <h3>${esc(sec.label)}</h3>
            <p>${esc(sec.hint)}</p>
          </div>
          ${toggle}
        </header>
        <form data-vitrina-form="${esc(sec.id)}" class="vitrina-section-form">
          ${fields}
          <div class="form-actions">${save}</div>
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
  renderZonas();
  renderResumen();
  render();
  showPanelView(viewFromHash() || "resumen", { instant: true });
}

function applySessionChrome() {
  document.body.classList.add("nh-authed");
  document.getElementById("nh-login").hidden = true;
  ["titular", "agente", "comercial", "marketing", "administracion", "agenda"].forEach((rol) => {
    document.body.classList.toggle("nh-rol-" + rol, session.rol === rol);
  });
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
      document.body.classList.remove(
        "nh-authed",
        "nh-rol-titular",
        "nh-rol-agente",
        "nh-rol-comercial",
        "nh-rol-marketing",
        "nh-rol-administracion",
        "nh-rol-agenda"
      );
      box.remove();
      history.replaceState(null, "", location.pathname + location.search);
      showStaffLogin();
    });
    nav.appendChild(box);
  }
  const alta = document.getElementById("usuario-alta");
  if (alta) alta.hidden = !canManageUsers();
  const rolSelect = document.getElementById("alta-rol");
  if (rolSelect && STAFF_ROLES) {
    rolSelect.innerHTML = STAFF_ROLES.map((r) =>
      `<option value="${esc(r.id)}">${esc(r.label)}</option>`
    ).join("");
    rolSelect.value = "agente";
  }
  paintUsuarioAlta();
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

function paintUsuarioAlta() {
  const alta = document.getElementById("usuario-alta");
  const nota = document.getElementById("usuario-alta-nota");
  const puede = canManageUsers();
  if (alta) {
    alta.hidden = !puede;
    alta.setAttribute("aria-hidden", puede ? "false" : "true");
    alta.querySelectorAll("input, select, button").forEach((el) => {
      el.disabled = !puede;
    });
  }
  if (nota) nota.hidden = puede;
}

function newStaffId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "u-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function renderUsuarios() {
  const host = document.getElementById("usuario-rows");
  if (!host) return;
  paintUsuarioAlta();
  const titular = canManageUsers();
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
  if (!canManageUsers()) return;
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
  if (!canManageUsers()) return;
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
  const form = event.target;
  const err = document.getElementById("usuario-alta-error");
  if (!canManageUsers()) {
    if (err) err.textContent = "Solo el titular puede agregar usuarios en esta demo.";
    showToast("Entre como milena (titular) para dar de alta cuentas.");
    return;
  }
  const data = new FormData(form);
  const user = String(data.get("user") || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const nombre = String(data.get("nombre") || "").trim();
  const rol = String(data.get("rol") || "agente");
  const pass = String(data.get("pass") || "demo").trim() || "demo";
  form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  if (!STAFF_ROLES.some((r) => r.id === rol)) {
    if (err) err.textContent = "Elija un rol válido.";
    return;
  }
  if (!user || !nombre) {
    const nombreEl = form.elements.namedItem("nombre");
    const userEl = form.elements.namedItem("user");
    if (nombreEl && !nombre) nombreEl.classList.add("is-invalid");
    if (userEl && !user) userEl.classList.add("is-invalid");
    if (err) err.textContent = "Complete nombre y usuario.";
    (nombre ? userEl : nombreEl)?.focus();
    return;
  }
  if (staff.some((u) => u.user === user)) {
    form.elements.namedItem("user")?.classList.add("is-invalid");
    if (err) err.textContent = "Ese usuario ya existe. Elija otro nombre de usuario.";
    form.elements.namedItem("user")?.focus();
    return;
  }
  if (err) err.textContent = "";
  try {
    staff = [{ id: newStaffId(), user, pass, nombre, rol, activo: true }, ...staff];
    saveUsers(staff);
    form.reset();
    const passEl = form.elements.namedItem("pass");
    const rolEl = form.elements.namedItem("rol");
    if (passEl) passEl.value = "demo";
    if (rolEl) rolEl.value = "agente";
    showToast("Usuario agregado. Puede entrar con " + user + " / " + pass + ".");
    renderUsuarios();
  } catch (e) {
    if (err) err.textContent = "No se pudo guardar la cuenta en este navegador.";
    showToast("No se pudo agregar el usuario. Pruebe de nuevo.");
  }
});
