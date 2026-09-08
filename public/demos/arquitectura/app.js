(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("consultaForm");
  let filtro = "all";

  function publicados() {
    return loadProyectos().filter((p) => p.publicado !== false);
  }

  function visibles() {
    const all = publicados();
    return filtro === "all" ? all : all.filter((p) => p.tipo === filtro);
  }

  function renderPortfolio() {
    const items = visibles();
    catalog.innerHTML = items.map((p) => `
      <article class="work-card" data-id="${esc(p.id)}">
        <img src="${esc(p.imagen)}" alt="${esc(p.titulo)}">
        <div class="work-body">
          <p class="work-tipo">${esc(tipoLabel(p.tipo))}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="work-desc">${esc(p.descripcion)}</p>
          <p class="work-meta">${esc(p.superficie)} · ${esc(etapaLabel(p.etapa))} · ${esc(p.barrio)}</p>
        </div>
      </article>
    `).join("") || "<p>No hay proyectos en este tipo.</p>";
    catalog.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const p = publicados().find((item) => item.id === id);
    if (!p) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(p.imagen)}" alt="${esc(p.titulo)}">
      <p class="kicker">${esc(tipoLabel(p.tipo))}</p>
      <h2 id="fichaTitle">${esc(p.titulo)}</h2>
      <p>${esc(p.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Programa</dt><dd>${esc(p.programa || tipoLabel(p.tipo))}</dd></div>
        <div><dt>Superficie</dt><dd>${esc(p.superficie)}</dd></div>
        <div><dt>Etapa</dt><dd>${esc(etapaLabel(p.etapa))}</dd></div>
        <div><dt>Materiales</dt><dd>${esc(p.materiales || "—")}</dd></div>
        <div><dt>Barrio</dt><dd>${esc(p.barrio)}</dd></div>
        <div><dt>Año</dt><dd>${esc(p.anio)}</dd></div>
      </dl>
      <a class="btn" href="#consulta">Pedir un proyecto similar</a>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function openGaleria(id) {
    const g = GALERIA.find((item) => item.id === id);
    if (!g) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(g.imagen)}" alt="${esc(g.titulo)}">
      <p class="kicker">Galería</p>
      <h2 id="fichaTitle">${esc(g.titulo)}</h2>
      <p>${esc(g.caption)}</p>
      <a class="btn" href="#consulta">Consultar un proyecto</a>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeFicha() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  fichaClose.addEventListener("click", closeFicha);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeFicha();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeFicha();
  });

  document.querySelectorAll("#filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filters button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filtro = btn.dataset.filter;
      renderPortfolio();
    });
  });

  document.getElementById("serviciosGrid").innerHTML = SERVICIOS.map((s) => `
    <article class="service-card">
      <img src="${esc(s.imagen)}" alt="${esc(s.titulo)}">
      <div>
        <h3>${esc(s.titulo)}</h3>
        <p>${esc(s.descripcion)}</p>
      </div>
    </article>
  `).join("");

  document.getElementById("equipoGrid").innerHTML = EQUIPO.map((p) => `
    <article class="profesional-card">
      <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
      <h3>${esc(p.nombre)}</h3>
      <p class="pro-rol">${esc(p.rol)}</p>
      <p>${esc(p.bio)}</p>
    </article>
  `).join("");

  document.getElementById("galeriaGrid").innerHTML = GALERIA.map((g) => `
    <article class="galeria-card" data-id="${esc(g.id)}">
      <img src="${esc(g.imagen)}" alt="${esc(g.titulo)}">
      <p>${esc(g.caption)}</p>
    </article>
  `).join("");
  document.querySelectorAll(".galeria-card").forEach((card) => {
    card.addEventListener("click", () => openGaleria(card.dataset.id));
  });

  function pintarMapa() {
    const el = document.getElementById("mapa-local");
    if (!el || typeof L === "undefined") return;
    const map = L.map(el, { scrollWheelZoom: false }).setView([LOCAL.lat, LOCAL.lng], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);
    L.marker([LOCAL.lat, LOCAL.lng]).addTo(map).bindPopup("Estudio Loma · Humboldt 2140, Palermo");
    setTimeout(() => map.invalidateSize(), 80);
  }
  pintarMapa();

  form.querySelector('[name="tipo"]').innerHTML = TIPOS.map((t) =>
    `<option value="${esc(t.id)}">${esc(t.label)}</option>`
  ).join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const tipo = String(data.get("tipo") || "casa");
    const n = loadObras().length + 18;
    addConsulta({
      id: crypto.randomUUID(),
      codigo: `OB-2026-${String(n).padStart(2, "0")}`,
      tipo,
      titulo: tipoLabel(tipo) + " · consulta web",
      nombre: String(data.get("nombre") || "").trim(),
      contacto: String(data.get("contacto") || "").trim(),
      lugar: String(data.get("lugar") || "").trim(),
      superficie: String(data.get("superficie") || "").trim(),
      detalle: String(data.get("detalle") || "").trim()
    });
    form.reset();
    showToast("Consulta guardada. La ves en el panel del estudio.");
  });

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
    }, 3200);
  }

  renderPortfolio();
})();
