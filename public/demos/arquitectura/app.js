(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("consultaForm");

  function publicados() {
    return loadProyectos().filter((p) => p.publicado !== false);
  }

  function renderPortfolio() {
    catalog.innerHTML = publicados().map((p) => `
      <article class="work-card" data-id="${esc(p.id)}">
        <img src="${esc(p.imagen)}" alt="${esc(p.titulo)}">
        <div class="work-body">
          <p class="work-tipo">${esc(tipoLabel(p.tipo))}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="work-desc">${esc(p.descripcion)}</p>
          <p class="work-meta">${esc(p.superficie)} · ${esc(p.barrio)}</p>
        </div>
      </article>
    `).join("");
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
        <div><dt>Superficie</dt><dd>${esc(p.superficie)}</dd></div>
        <div><dt>Barrio</dt><dd>${esc(p.barrio)}</dd></div>
        <div><dt>Año</dt><dd>${esc(p.anio)}</dd></div>
        <div><dt>Tipo</dt><dd>${esc(tipoLabel(p.tipo))}</dd></div>
      </dl>
      <a class="btn" href="#consulta">Pedir un proyecto similar</a>
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

  document.getElementById("serviciosGrid").innerHTML = SERVICIOS.map((s) => `
    <article class="service-card">
      <img src="${esc(s.imagen)}" alt="${esc(s.titulo)}">
      <div>
        <h3>${esc(s.titulo)}</h3>
        <p>${esc(s.descripcion)}</p>
      </div>
    </article>
  `).join("");

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
