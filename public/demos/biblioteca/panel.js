let libs = loadLibros();
let socs = loadSocios();
let pres = loadPrestamos();
let tab = "libros";
let selectedLib = libs[0]?.id || "";
let selectedSoc = socs[0]?.id || "";
let selectedPres = pres[0]?.id || "";

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    tab = btn.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    render();
  });
});

document.getElementById("nuevo-prestamo").addEventListener("click", () => {
  tab = "prestamos";
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === "prestamos"));
  render();
});

function render() {
  if (tab === "libros") renderLibros();
  else if (tab === "socios") renderSocios();
  else renderPrestamos();
}

function renderLibros() {
  const disponibles = libs.filter((l) => l.status === "disponible").length;
  const prestados = libs.filter((l) => l.status === "prestado").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="on"><strong>${libs.length}</strong>títulos</button>
    <div><strong>${disponibles}</strong>disponibles</div>
    <div><strong>${prestados}</strong>prestados</div>
  `;

  document.getElementById("thead").innerHTML = `<tr><th>Código</th><th>Título</th><th>Autor</th><th>Ubicación</th><th>Disp.</th><th>Estado</th></tr>`;

  document.getElementById("rows").innerHTML = libs.map((l) => `
    <tr class="row ${l.id === selectedLib ? "on" : ""}" data-id="${esc(l.id)}">
      <td>${esc(l.codigo)}</td>
      <td>${esc(l.titulo)}</td>
      <td>${esc(l.autor)}</td>
      <td>${esc(l.ubicacion)}</td>
      <td>${l.disponibles}/${l.ejemplares}</td>
      <td><span class="tag ${esc(l.status)}">${esc(labelLibro(l.status))}</span></td>
    </tr>
  `).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedLib = row.dataset.id; render(); });
  });

  const libro = libs.find((l) => l.id === selectedLib);
  const detail = document.getElementById("detail");
  if (!libro) { detail.innerHTML = "<p>Elegí un libro.</p>"; return; }

  const prestamosLibro = pres.filter((p) => p.libro === libro.id && p.status !== "devuelto");

  detail.innerHTML = `
    <p class="eyebrow">${esc(libro.codigo)} · ${esc(catLabel(libro.categoria))}</p>
    <h2>${esc(libro.titulo)}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(libro.autor)} · ${esc(libro.editorial)} (${libro.año})</p>
    <div class="meta">
      <div><span>Ubicación</span>${esc(libro.ubicacion)}</div>
      <div><span>Ejemplares</span>${libro.ejemplares}</div>
      <div><span>Disponibles</span>${libro.disponibles}</div>
      <div><span>Estado</span>${esc(labelLibro(libro.status))}</div>
    </div>
    ${prestamosLibro.length > 0 ? `
      <h3 style="font-size:14px;margin-top:16px;">Préstamos activos</h3>
      ${prestamosLibro.map((p) => {
        const socio = getSocio(p.socio);
        return `<div class="prestamo-section" style="margin:8px 0;padding:8px;">
          <strong>${esc(socio?.nombre || "—")}</strong><br>
          <small>Desde ${esc(p.fechaPrestamo)} · Devolver ${esc(p.fechaDevolucion)}</small>
        </div>`;
      }).join("")}
    ` : ""}
  `;
}

function renderSocios() {
  const activos = socs.filter((s) => s.activo).length;
  const conMulta = socs.filter((s) => s.multas > 0).length;

  document.getElementById("stats").innerHTML = `
    <button type="button" class="on"><strong>${socs.length}</strong>socios</button>
    <div><strong>${activos}</strong>activos</div>
    <div><strong>${conMulta}</strong>con multa</div>
  `;

  document.getElementById("thead").innerHTML = `<tr><th>Número</th><th>Nombre</th><th>DNI</th><th>Alta</th><th>Multa</th><th>Estado</th></tr>`;

  document.getElementById("rows").innerHTML = socs.map((s) => `
    <tr class="row ${s.id === selectedSoc ? "on" : ""}" data-id="${esc(s.id)}">
      <td>${esc(s.numero)}</td>
      <td>${esc(s.nombre)}</td>
      <td>${esc(s.dni)}</td>
      <td>${esc(s.fechaAlta)}</td>
      <td class="amount">${s.multas > 0 ? esc(money(s.multas)) : "—"}</td>
      <td><span class="tag ${s.activo ? "disponible" : "vencido"}">${s.activo ? "Activo" : "Inactivo"}</span></td>
    </tr>
  `).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedSoc = row.dataset.id; render(); });
  });

  const socio = socs.find((s) => s.id === selectedSoc);
  const detail = document.getElementById("detail");
  if (!socio) { detail.innerHTML = "<p>Elegí un socio.</p>"; return; }

  const prestamosSocio = pres.filter((p) => p.socio === socio.id);
  const activos_ = prestamosSocio.filter((p) => p.status === "activo" || p.status === "vencido");

  detail.innerHTML = `
    <p class="eyebrow">${esc(socio.numero)}</p>
    <h2>${esc(socio.nombre)}</h2>
    <p style="color:var(--muted);font-size:14px;">DNI: ${esc(socio.dni)} · ${esc(socio.email)}</p>
    <div class="meta">
      <div><span>Teléfono</span>${esc(socio.tel)}</div>
      <div><span>Alta</span>${esc(socio.fechaAlta)}</div>
      <div><span>Estado</span>${socio.activo ? "Activo" : "Inactivo"}</div>
      <div><span>Préstamos</span>${prestamosSocio.length} total</div>
    </div>
    ${socio.multas > 0 ? `
      <div class="multa-box">
        <h4>⚠️ Multa pendiente</h4>
        <p>${esc(money(socio.multas))}</p>
        <button class="ghost" id="pagar-multa">Registrar pago</button>
      </div>
    ` : ""}
    ${activos_.length > 0 ? `
      <h3 style="font-size:14px;margin-top:16px;">Préstamos activos</h3>
      ${activos_.map((p) => {
        const libro = getLibro(p.libro);
        return `<div class="prestamo-section" style="margin:8px 0;padding:8px;">
          <strong>${esc(libro?.titulo || "—")}</strong><br>
          <small>Devolver: ${esc(p.fechaDevolucion)}</small>
          <span class="tag ${esc(p.status)}" style="margin-left:8px;">${esc(labelPrestamo(p.status))}</span>
        </div>`;
      }).join("")}
    ` : ""}
  `;

  detail.querySelector("#pagar-multa")?.addEventListener("click", () => {
    socio.multas = 0;
    saveSocios();
    render();
  });
}

function renderPrestamos() {
  const activos = pres.filter((p) => p.status === "activo").length;
  const vencidos = pres.filter((p) => p.status === "vencido").length;

  document.getElementById("stats").innerHTML = `
    <button type="button" class="on"><strong>${pres.length}</strong>préstamos</button>
    <div><strong>${activos}</strong>activos</div>
    <div style="color:#991b1b;"><strong>${vencidos}</strong>vencidos</div>
  `;

  document.getElementById("thead").innerHTML = `<tr><th>Libro</th><th>Socio</th><th>Préstamo</th><th>Devolución</th><th>Estado</th></tr>`;

  document.getElementById("rows").innerHTML = pres.map((p) => {
    const libro = getLibro(p.libro);
    const socio = getSocio(p.socio);
    return `
      <tr class="row ${p.id === selectedPres ? "on" : ""}" data-id="${esc(p.id)}">
        <td>${esc(libro?.titulo || "—")}</td>
        <td>${esc(socio?.nombre || "—")}</td>
        <td>${esc(p.fechaPrestamo)}</td>
        <td>${esc(p.fechaDevolucion)}</td>
        <td><span class="tag ${esc(p.status)}">${esc(labelPrestamo(p.status))}</span></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selectedPres = row.dataset.id; render(); });
  });

  const prestamo = pres.find((p) => p.id === selectedPres);
  const detail = document.getElementById("detail");
  if (!prestamo) { detail.innerHTML = "<p>Elegí un préstamo.</p>"; return; }

  const libro = getLibro(prestamo.libro);
  const socio = getSocio(prestamo.socio);

  detail.innerHTML = `
    <p class="eyebrow">Préstamo</p>
    <h2>${esc(libro?.titulo || "—")}</h2>
    <p style="color:var(--muted);font-size:14px;">${esc(libro?.autor || "")}</p>
    <div class="meta">
      <div><span>Socio</span>${esc(socio?.nombre || "—")}</div>
      <div><span>Préstamo</span>${esc(prestamo.fechaPrestamo)}</div>
      <div><span>Devolución</span>${esc(prestamo.fechaDevolucion)}</div>
      <div><span>Renovaciones</span>${prestamo.renovaciones}</div>
      <div><span>Estado</span><span class="tag ${esc(prestamo.status)}">${esc(labelPrestamo(prestamo.status))}</span></div>
      ${prestamo.fechaDevuelto ? `<div><span>Devuelto</span>${esc(prestamo.fechaDevuelto)}</div>` : ""}
    </div>
    ${prestamo.status !== "devuelto" ? `
      <div class="actions">
        <button class="btn-panel" id="devolver">Registrar devolución</button>
        ${prestamo.renovaciones < 2 ? `<button class="ghost" id="renovar">Renovar (+14 días)</button>` : ""}
      </div>
    ` : ""}
  `;

  detail.querySelector("#devolver")?.addEventListener("click", () => {
    prestamo.status = "devuelto";
    prestamo.fechaDevuelto = "hoy";
    if (libro) { libro.disponibles++; libro.status = libro.disponibles > 0 ? "disponible" : "prestado"; saveLibros(); }
    savePrestamos();
    render();
  });

  detail.querySelector("#renovar")?.addEventListener("click", () => {
    prestamo.renovaciones++;
    prestamo.fechaDevolucion = "+14 días";
    prestamo.status = "activo";
    savePrestamos();
    render();
  });
}

render();
