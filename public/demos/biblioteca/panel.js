let libs = loadLibros();
let socs = loadSocios();
let pres = loadPrestamos();
let resv = loadReservas();
let tab = "libros";
let mode = "ver";
let selectedLib = libs[0]?.id || "";
let selectedSoc = socs[0]?.id || "";
let selectedPres = pres.find((p) => p.status !== "devuelto")?.id || pres[0]?.id || "";
let searchTerm = "";
let filter = "todos";

function goTab(next) {
  tab = next;
  mode = "ver";
  filter = "todos";
  searchTerm = "";
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  render();
}

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => goTab(btn.dataset.tab));
});

function openCreate(nextTab, nextMode) {
  tab = nextTab;
  mode = nextMode;
  filter = "todos";
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  render();
}

document.getElementById("nuevo-prestamo").addEventListener("click", () => openCreate("prestamos", "crear-prestamo"));
document.getElementById("nuevo-socio").addEventListener("click", () => openCreate("socios", "crear-socio"));
document.getElementById("nuevo-libro").addEventListener("click", () => openCreate("libros", "crear-libro"));

function render() {
  libs = loadLibros();
  socs = loadSocios();
  pres = loadPrestamos();
  resv = loadReservas();
  if (tab === "libros") renderLibros();
  else if (tab === "socios") renderSocios();
  else renderPrestamos();
}

function matchesSearch(values) {
  const term = foldText(searchTerm);
  if (!term) return true;
  return values.some((v) => foldText(v).includes(term));
}

function bindSearch() {
  const input = document.getElementById("search");
  if (!input) return;
  input.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    render();
  });
}

function bindFilters() {
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      render();
    });
  });
}

function renderLibros() {
  const disponibles = libs.filter((l) => l.status === "disponible").length;
  const prestados = libs.filter((l) => l.status === "prestado").length;
  const reservados = libs.filter((l) => l.status === "reservado").length;
  const rows = libs.filter((l) => {
    if (filter !== "todos" && l.status !== filter) return false;
    return matchesSearch([l.titulo, l.autor, l.codigo, l.ubicacion]);
  });

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${libs.length}</strong>títulos</button>
    <button type="button" data-filter="disponible" class="${filter === "disponible" ? "on" : ""}"><strong>${disponibles}</strong>disponibles</button>
    <button type="button" data-filter="prestado" class="${filter === "prestado" ? "on" : ""}"><strong>${prestados}</strong>prestados</button>
    <button type="button" data-filter="reservado" class="${filter === "reservado" ? "on" : ""}"><strong>${reservados}</strong>reservados</button>
    <input type="search" id="search" placeholder="Buscar título o autor" value="${esc(searchTerm)}">
  `;
  bindSearch();
  bindFilters();

  document.getElementById("thead").innerHTML = `<tr><th></th><th>Código</th><th>Título</th><th>Autor</th><th>Estante</th><th>Disp.</th><th>Estado</th></tr>`;
  document.getElementById("rows").innerHTML = rows.map((l) => `
    <tr class="row ${l.id === selectedLib ? "on" : ""}" data-id="${esc(l.id)}">
      <td class="thumb-cell">${l.tapa ? `<img class="thumb" src="${esc(l.tapa)}" alt="">` : ""}</td>
      <td data-label="Código">${esc(l.codigo)}</td>
      <td data-label="Título">${esc(l.titulo)}</td>
      <td data-label="Autor">${esc(l.autor)}</td>
      <td data-label="Estante">${esc(l.ubicacion)}</td>
      <td data-label="Disp.">${l.disponibles}/${l.ejemplares}</td>
      <td data-label="Estado"><span class="tag ${esc(l.status)}">${esc(labelLibro(l.status))}</span></td>
    </tr>
  `).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedLib = row.dataset.id; mode = "ver"; render(); });
  });

  const detail = document.getElementById("detail");
  if (mode === "crear-libro") {
    detail.innerHTML = formNuevoLibro();
    bindNuevoLibro();
    return;
  }

  const libro = libs.find((l) => l.id === selectedLib);
  if (!libro) { detail.innerHTML = "<p>Elegí un título.</p>"; return; }

  const activos = pres.filter((p) => p.libro === libro.id && p.status !== "devuelto");
  const pendientes = resv.filter((r) => r.libro === libro.id && r.status === "pendiente");

  detail.innerHTML = `
    <div class="detail-head">
      ${libro.tapa ? `<img class="cover-lg" src="${esc(libro.tapa)}" alt="">` : `<div class="cover-lg cover-fallback" aria-hidden="true">${esc((libro.titulo || "?").charAt(0))}</div>`}
      <div>
        <p class="eyebrow">${esc(libro.codigo)} · ${esc(catLabel(libro.categoria))}</p>
        <h2>${esc(libro.titulo)}</h2>
        <p class="lead-sm">${esc(libro.autor)} · ${esc(libro.editorial)} (${libro.año})</p>
      </div>
    </div>
    <form id="edit-libro">
      <label>Ubicación de estante<input name="ubicacion" value="${esc(libro.ubicacion)}"></label>
      <label>Ejemplares totales<input name="ejemplares" type="number" min="${libro.ejemplares - libro.disponibles}" value="${libro.ejemplares}"></label>
      <div class="meta">
        <div><span>Disponibles</span>${libro.disponibles}</div>
        <div><span>Estado</span>${esc(labelLibro(libro.status))}</div>
      </div>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar catálogo</button>
      </div>
    </form>
    ${activos.length ? `
      <h3 style="font-size:14px;margin-top:16px;">Préstamos activos</h3>
      ${activos.map((p) => {
        const socio = getSocio(p.socio);
        const atraso = diasAtraso(p.fechaDevolucion);
        return `<div class="prestamo-section">
          <strong>${esc(socio?.nombre || "—")}</strong><br>
          <small>Vence ${esc(formatFecha(p.fechaDevolucion))}${atraso ? ` · ${atraso} día(s) de atraso` : ""}</small>
        </div>`;
      }).join("")}
    ` : ""}
    ${pendientes.length ? `
      <h3 style="font-size:14px;margin-top:16px;">Reservas pendientes</h3>
      ${pendientes.map((r) => `
        <div class="prestamo-section">
          <strong>${esc(r.socioNombre)}</strong><br>
          <small>${esc(formatFecha(r.fecha))}${r.tel ? " · " + esc(r.tel) : ""}</small>
          <div class="actions">
            <button class="ghost" data-lista="${esc(r.id)}" type="button">Marcar lista</button>
            <button class="ghost" data-cancel="${esc(r.id)}" type="button">Cancelar</button>
          </div>
        </div>
      `).join("")}
    ` : ""}
  `;

  detail.querySelector("#edit-libro").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const ejemplares = Number(data.get("ejemplares") || libro.ejemplares);
    const prestados = libro.ejemplares - libro.disponibles;
    if (ejemplares < prestados) {
      toast("No podés bajar ejemplares por debajo de los que están prestados");
      return;
    }
    libro.ubicacion = String(data.get("ubicacion") || libro.ubicacion).trim();
    libro.disponibles += ejemplares - libro.ejemplares;
    libro.ejemplares = ejemplares;
    refreshLibroStatus(libro);
    saveLibros();
    toast("Catálogo actualizado");
    render();
  });

  detail.querySelectorAll("[data-lista]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const reserva = resv.find((r) => r.id === btn.dataset.lista);
      if (reserva) { reserva.status = "lista"; saveReservas(); refreshLibroStatus(libro); saveLibros(); toast("Reserva lista para retirar"); render(); }
    });
  });
  detail.querySelectorAll("[data-cancel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const reserva = resv.find((r) => r.id === btn.dataset.cancel);
      if (reserva) { reserva.status = "cancelada"; saveReservas(); refreshLibroStatus(libro); saveLibros(); toast("Reserva cancelada"); render(); }
    });
  });
}

function formNuevoLibro() {
  return `
    <p class="eyebrow">Alta de título</p>
    <h2>Nuevo libro</h2>
    <form id="form-libro">
      <label>Título<input name="titulo" required></label>
      <label>Autor<input name="autor" required></label>
      <label>Editorial<input name="editorial"></label>
      <label>Año<input name="año" type="number" min="1400" max="2100"></label>
      <label>Categoría
        <select name="categoria">${CATEGORIAS.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}</select>
      </label>
      <label>Estante<input name="ubicacion" required placeholder="Estante A-1"></label>
      <label>Ejemplares<input name="ejemplares" type="number" min="1" value="1"></label>
      <div class="actions">
        <button class="btn-panel" type="submit">Agregar al catálogo</button>
        <button class="ghost" type="button" id="cancelar">Cancelar</button>
      </div>
    </form>
  `;
}

function bindNuevoLibro() {
  document.getElementById("cancelar").addEventListener("click", () => { mode = "ver"; render(); });
  document.getElementById("form-libro").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const ejemplares = Math.max(1, Number(data.get("ejemplares") || 1));
    const categoria = String(data.get("categoria") || "ficcion");
    const libro = {
      id: nextId("l"),
      codigo: nextCodigo(categoria),
      titulo: String(data.get("titulo") || "").trim(),
      autor: String(data.get("autor") || "").trim(),
      editorial: String(data.get("editorial") || "").trim() || "—",
      año: Number(data.get("año") || new Date().getFullYear()),
      categoria,
      ubicacion: String(data.get("ubicacion") || "").trim(),
      ejemplares,
      disponibles: ejemplares,
      status: "disponible",
      tapa: ""
    };
    if (!libro.titulo || !libro.autor) return;
    libs.unshift(libro);
    selectedLib = libro.id;
    saveLibros();
    mode = "ver";
    toast("Título agregado");
    render();
  });
}

function renderSocios() {
  const activos = socs.filter((s) => s.activo).length;
  const conMulta = socs.filter((s) => s.multas > 0).length;
  const rows = socs.filter((s) => {
    if (filter === "activos" && !s.activo) return false;
    if (filter === "multa" && !(s.multas > 0)) return false;
    return matchesSearch([s.nombre, s.dni, s.numero, s.email]);
  });

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${socs.length}</strong>socios</button>
    <button type="button" data-filter="activos" class="${filter === "activos" ? "on" : ""}"><strong>${activos}</strong>activos</button>
    <button type="button" data-filter="multa" class="${filter === "multa" ? "on" : ""}"><strong>${conMulta}</strong>con multa</button>
    <input type="search" id="search" placeholder="Buscar socio o DNI" value="${esc(searchTerm)}">
  `;
  bindSearch();
  bindFilters();

  document.getElementById("thead").innerHTML = `<tr><th>Número</th><th>Nombre</th><th>DNI</th><th>Alta</th><th>Multa</th><th>Estado</th></tr>`;
  document.getElementById("rows").innerHTML = rows.map((s) => `
    <tr class="row ${s.id === selectedSoc ? "on" : ""}" data-id="${esc(s.id)}">
      <td data-label="Número">${esc(s.numero)}</td>
      <td data-label="Nombre">${esc(s.nombre)}</td>
      <td data-label="DNI">${esc(s.dni)}</td>
      <td data-label="Alta">${esc(formatFecha(s.fechaAlta))}</td>
      <td class="amount" data-label="Multa">${s.multas > 0 ? esc(money(s.multas)) : "—"}</td>
      <td data-label="Estado"><span class="tag ${s.activo ? "disponible" : "vencido"}">${s.activo ? "Activo" : "Inactivo"}</span></td>
    </tr>
  `).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedSoc = row.dataset.id; mode = "ver"; render(); });
  });

  const detail = document.getElementById("detail");
  if (mode === "crear-socio") {
    detail.innerHTML = `
      <p class="eyebrow">Alta</p>
      <h2>Nuevo socio</h2>
      <form id="form-socio">
        <label>Nombre y apellido<input name="nombre" required></label>
        <label>DNI<input name="dni" required placeholder="32.456.789"></label>
        <label>Email<input name="email" type="email"></label>
        <label>Teléfono<input name="tel" type="tel"></label>
        <div class="actions">
          <button class="btn-panel" type="submit">Registrar socio</button>
          <button class="ghost" type="button" id="cancelar">Cancelar</button>
        </div>
      </form>
    `;
    document.getElementById("cancelar").addEventListener("click", () => { mode = "ver"; render(); });
    document.getElementById("form-socio").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const socio = {
        id: nextId("s"),
        numero: nextNumeroSocio(),
        nombre: String(data.get("nombre") || "").trim(),
        dni: String(data.get("dni") || "").trim(),
        email: String(data.get("email") || "").trim(),
        tel: String(data.get("tel") || "").trim(),
        fechaAlta: hoyISO(),
        activo: true,
        multas: 0
      };
      socs.unshift(socio);
      selectedSoc = socio.id;
      saveSocios();
      mode = "ver";
      toast("Socio dado de alta");
      render();
    });
    return;
  }

  const socio = socs.find((s) => s.id === selectedSoc);
  if (!socio) { detail.innerHTML = "<p>Elegí un socio.</p>"; return; }

  const historial = pres.filter((p) => p.socio === socio.id);
  const activos_ = historial.filter((p) => p.status !== "devuelto");

  detail.innerHTML = `
    <p class="eyebrow">${esc(socio.numero)}</p>
    <h2>${esc(socio.nombre)}</h2>
    <form id="edit-socio">
      <label>Nombre<input name="nombre" value="${esc(socio.nombre)}" required></label>
      <label>DNI<input name="dni" value="${esc(socio.dni)}" required></label>
      <label>Email<input name="email" type="email" value="${esc(socio.email)}"></label>
      <label>Teléfono<input name="tel" value="${esc(socio.tel)}"></label>
      <div class="meta">
        <div><span>Alta</span>${esc(formatFecha(socio.fechaAlta))}</div>
        <div><span>Préstamos activos</span>${activos_.length}</div>
      </div>
      ${socio.multas > 0 ? `
        <div class="multa-box">
          <h4>Multa pendiente</h4>
          <p>${esc(money(socio.multas))}</p>
          <button class="ghost" id="pagar-multa" type="button">Registrar pago</button>
        </div>
      ` : ""}
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar socio</button>
        <button class="ghost" id="toggle-activo" type="button">${socio.activo ? "Dar de baja" : "Reactivar"}</button>
        <button class="btn-danger" id="borrar-socio" type="button">Eliminar</button>
      </div>
    </form>
    ${activos_.length ? `
      <h3 style="font-size:14px;margin-top:16px;">En su poder</h3>
      ${activos_.map((p) => {
        const libro = getLibro(p.libro);
        return `<div class="prestamo-section">
          <strong>${esc(libro?.titulo || "—")}</strong><br>
          <small>Vence ${esc(formatFecha(p.fechaDevolucion))}</small>
          <span class="tag ${esc(p.status)}" style="margin-left:8px;">${esc(labelPrestamo(p.status))}</span>
        </div>`;
      }).join("")}
    ` : ""}
  `;

  detail.querySelector("#edit-socio").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    socio.nombre = String(data.get("nombre") || "").trim();
    socio.dni = String(data.get("dni") || "").trim();
    socio.email = String(data.get("email") || "").trim();
    socio.tel = String(data.get("tel") || "").trim();
    saveSocios();
    toast("Socio actualizado");
    render();
  });

  detail.querySelector("#pagar-multa")?.addEventListener("click", () => {
    socio.multas = 0;
    saveSocios();
    toast("Pago de multa registrado");
    render();
  });

  detail.querySelector("#toggle-activo").addEventListener("click", () => {
    if (socio.activo && activos_.length) {
      toast("Devolvé los ejemplares antes de dar de baja");
      return;
    }
    socio.activo = !socio.activo;
    saveSocios();
    toast(socio.activo ? "Socio reactivado" : "Socio inactivo");
    render();
  });

  detail.querySelector("#borrar-socio").addEventListener("click", () => {
    if (activos_.length) {
      toast("No se puede eliminar: tiene préstamos abiertos");
      return;
    }
    socs = socs.filter((s) => s.id !== socio.id);
    socios = socs;
    selectedSoc = socs[0]?.id || "";
    saveSocios();
    toast("Socio eliminado");
    render();
  });
}

function renderPrestamos() {
  const activos = pres.filter((p) => p.status === "activo").length;
  const vencidos = pres.filter((p) => p.status === "vencido").length;
  const pendientes = resv.filter((r) => r.status === "pendiente" || r.status === "lista").length;
  const rows = pres.filter((p) => {
    if (filter !== "todos" && p.status !== filter) return false;
    const libro = getLibro(p.libro);
    const socio = getSocio(p.socio);
    return matchesSearch([libro?.titulo, socio?.nombre]);
  });

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${pres.length}</strong>préstamos</button>
    <button type="button" data-filter="activo" class="${filter === "activo" ? "on" : ""}"><strong>${activos}</strong>activos</button>
    <button type="button" data-filter="vencido" class="${filter === "vencido" ? "on" : ""}"><strong>${vencidos}</strong>vencidos</button>
    <div><strong>${pendientes}</strong>reservas</div>
    <input type="search" id="search" placeholder="Buscar libro o socio" value="${esc(searchTerm)}">
  `;
  bindSearch();
  bindFilters();

  document.getElementById("thead").innerHTML = `<tr><th>Libro</th><th>Socio</th><th>Retiro</th><th>Vencimiento</th><th>Multa</th><th>Estado</th></tr>`;
  document.getElementById("rows").innerHTML = rows.map((p) => {
    const libro = getLibro(p.libro);
    const socio = getSocio(p.socio);
    const atraso = p.status === "devuelto" ? 0 : diasAtraso(p.fechaDevolucion);
    return `
      <tr class="row ${p.id === selectedPres ? "on" : ""}" data-id="${esc(p.id)}">
        <td data-label="Libro">${esc(libro?.titulo || "—")}</td>
        <td data-label="Socio">${esc(socio?.nombre || "—")}</td>
        <td data-label="Retiro">${esc(formatFecha(p.fechaPrestamo))}</td>
        <td data-label="Vencimiento">${esc(formatFecha(p.fechaDevolucion))}</td>
        <td class="amount" data-label="Multa">${atraso ? esc(money(multaDe(atraso))) : "—"}</td>
        <td data-label="Estado"><span class="tag ${esc(p.status)}">${esc(labelPrestamo(p.status))}</span></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedPres = row.dataset.id; mode = "ver"; render(); });
  });

  const detail = document.getElementById("detail");
  if (mode === "crear-prestamo") {
    const disponibles = libs.filter((l) => l.disponibles > 0);
    const sociosOk = socs.filter((s) => s.activo);
    detail.innerHTML = `
      <p class="eyebrow">Circulación</p>
      <h2>Nuevo préstamo</h2>
      <form id="form-prestamo">
        <label>Socio
          <select name="socio" required>
            ${sociosOk.map((s) => `<option value="${esc(s.id)}">${esc(s.nombre)} · ${esc(s.numero)}${s.multas ? " · multa " + money(s.multas) : ""}</option>`).join("")}
          </select>
        </label>
        <label>Libro
          <select name="libro" required>
            ${disponibles.map((l) => `<option value="${esc(l.id)}">${esc(l.titulo)} · ${l.disponibles} en sala</option>`).join("")}
          </select>
        </label>
        <label>Días de préstamo<input name="dias" type="number" min="1" max="60" value="${DIAS_PRESTAMO}"></label>
        <p class="form-error" id="prestamo-error"></p>
        <div class="actions">
          <button class="btn-panel" type="submit">Registrar préstamo</button>
          <button class="ghost" type="button" id="cancelar">Cancelar</button>
        </div>
      </form>
      ${reservasAbiertasHtml()}
    `;
    document.getElementById("cancelar").addEventListener("click", () => { mode = "ver"; render(); });
    document.getElementById("form-prestamo").addEventListener("submit", onCrearPrestamo);
    return;
  }

  const prestamo = pres.find((p) => p.id === selectedPres);
  if (!prestamo) {
    detail.innerHTML = `<p>Elegí un préstamo o registrá uno nuevo.</p>${reservasAbiertasHtml()}`;
    return;
  }

  const libro = getLibro(prestamo.libro);
  const socio = getSocio(prestamo.socio);
  const atraso = prestamo.status === "devuelto" ? 0 : diasAtraso(prestamo.fechaDevolucion);
  const multa = multaDe(atraso);

  detail.innerHTML = `
    <p class="eyebrow">Préstamo</p>
    <h2>${esc(libro?.titulo || "—")}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(libro?.autor || "")}</p>
    <div class="meta">
      <div><span>Socio</span>${esc(socio?.nombre || "—")}</div>
      <div><span>Carnet</span>${esc(socio?.numero || "—")}</div>
      <div><span>Retiro</span>${esc(formatFecha(prestamo.fechaPrestamo))}</div>
      <div><span>Vencimiento</span>${esc(formatFecha(prestamo.fechaDevolucion))}</div>
      <div><span>Renovaciones</span>${prestamo.renovaciones} / ${MAX_RENOVACIONES}</div>
      <div><span>Estado</span><span class="tag ${esc(prestamo.status)}">${esc(labelPrestamo(prestamo.status))}</span></div>
      ${prestamo.fechaDevuelto ? `<div><span>Devuelto</span>${esc(formatFecha(prestamo.fechaDevuelto))}</div>` : ""}
    </div>
    ${atraso ? `
      <div class="multa-box">
        <h4>Atraso: ${atraso} día(s)</h4>
        <p>Multa a aplicar al devolver: ${esc(money(multa))} ($ ${MULTA_POR_DIA} por día).</p>
      </div>
    ` : ""}
    ${prestamo.status !== "devuelto" ? `
      <div class="actions">
        <button class="btn-panel" id="devolver" type="button">Registrar devolución</button>
        ${prestamo.status === "activo" && prestamo.renovaciones < MAX_RENOVACIONES ? `<button class="ghost" id="renovar" type="button">Renovar +${DIAS_PRESTAMO} días</button>` : ""}
      </div>
    ` : ""}
    ${reservasAbiertasHtml()}
  `;

  detail.querySelector("#devolver")?.addEventListener("click", () => devolverPrestamo(prestamo, libro, socio, atraso, multa));
  detail.querySelector("#renovar")?.addEventListener("click", () => {
    prestamo.renovaciones += 1;
    prestamo.fechaDevolucion = addDays(prestamo.fechaDevolucion, DIAS_PRESTAMO);
    prestamo.status = "activo";
    savePrestamos();
    toast("Renovado hasta " + formatFecha(prestamo.fechaDevolucion));
    render();
  });
}

function reservasAbiertasHtml() {
  const abiertas = resv.filter((r) => r.status === "pendiente" || r.status === "lista");
  if (!abiertas.length) return "";
  return `
    <h3 style="font-size:14px;margin-top:20px;">Reservas del catálogo público</h3>
    ${abiertas.map((r) => {
      const libro = getLibro(r.libro);
      return `<div class="prestamo-section">
        <strong>${esc(r.socioNombre)}</strong> · ${esc(libro?.titulo || "—")}<br>
        <small>${esc(formatFecha(r.fecha))} · ${esc(labelReserva(r.status))}</small>
      </div>`;
    }).join("")}
  `;
}

function onCrearPrestamo(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const error = document.getElementById("prestamo-error");
  const socio = getSocio(String(data.get("socio") || ""));
  const libro = getLibro(String(data.get("libro") || ""));
  const dias = Math.max(1, Number(data.get("dias") || DIAS_PRESTAMO));
  if (!socio || !libro) {
    error.textContent = "Elegí socio y libro.";
    return;
  }
  if (!socio.activo) {
    error.textContent = "El socio no está activo.";
    return;
  }
  if (socio.multas > 0) {
    error.textContent = "Hay una multa pendiente. Registrá el pago antes de prestar.";
    return;
  }
  if (prestamosActivosDe(socio.id).length >= MAX_LIBROS_SOCIO) {
    error.textContent = `Tope de ${MAX_LIBROS_SOCIO} libros por socio.`;
    return;
  }
  if (libro.disponibles < 1) {
    error.textContent = "No hay ejemplares en sala.";
    return;
  }
  const prestamo = {
    id: nextId("p"),
    libro: libro.id,
    socio: socio.id,
    fechaPrestamo: hoyISO(),
    fechaDevolucion: addDays(hoyISO(), dias),
    fechaDevuelto: null,
    status: "activo",
    renovaciones: 0
  };
  pres.unshift(prestamo);
  selectedPres = prestamo.id;
  libro.disponibles -= 1;
  const matchReserva = resv.find((r) =>
    r.libro === libro.id &&
    (r.status === "pendiente" || r.status === "lista") &&
    r.socioNombre.toLowerCase() === socio.nombre.toLowerCase()
  );
  if (matchReserva) matchReserva.status = "cumplida";
  refreshLibroStatus(libro);
  savePrestamos();
  saveLibros();
  saveReservas();
  mode = "ver";
  toast("Préstamo hasta " + formatFecha(prestamo.fechaDevolucion));
  render();
}

function devolverPrestamo(prestamo, libro, socio, atraso, multa) {
  prestamo.status = "devuelto";
  prestamo.fechaDevuelto = hoyISO();
  if (libro) {
    libro.disponibles += 1;
    refreshLibroStatus(libro);
    saveLibros();
  }
  if (socio && multa > 0) {
    socio.multas += multa;
    saveSocios();
  }
  savePrestamos();
  toast(multa > 0 ? `Devuelto. Multa ${money(multa)}` : "Devolución registrada");
  render();
}

render();
