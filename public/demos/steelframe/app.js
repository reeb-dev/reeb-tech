(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("consultaForm");

  function publicados() {
    return loadModelos().filter((m) => m.publicado !== false);
  }

  function renderCatalog() {
    catalog.innerHTML = publicados().map((m) => `
      <article class="work-card" data-id="${esc(m.id)}">
        <img src="${esc(m.imagen)}" alt="${esc(m.nombre)}">
        <div class="work-body">
          <p class="work-tipo">${esc(tipoLabel(m.tipo))}</p>
          <h3>${esc(m.nombre)}</h3>
          <p class="work-desc">${esc(m.descripcion)}</p>
          <p class="work-meta">${m.m2} m² · ${esc(m.plazo)}</p>
          <p class="work-price">${esc(money(m.precio))}</p>
        </div>
      </article>
    `).join("");
    catalog.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const m = publicados().find((item) => item.id === id);
    if (!m) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(m.imagen)}" alt="${esc(m.nombre)}">
      <p class="kicker">${esc(tipoLabel(m.tipo))}</p>
      <h2 id="fichaTitle">${esc(m.nombre)}</h2>
      <p>${esc(m.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Superficie</dt><dd>${m.m2} m²</dd></div>
        <div><dt>Ambientes</dt><dd>${esc(m.ambientes)}</dd></div>
        <div><dt>Plazo de obra</dt><dd>${esc(m.plazo)}</dd></div>
        <div><dt>Precio de ejemplo</dt><dd>${esc(money(m.precio))}</dd></div>
      </dl>
      <a class="btn" href="#consulta">Pedir este modelo</a>
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

  form.querySelector('[name="tipo"]').innerHTML = TIPOS.map((t) =>
    `<option value="${esc(t.id)}">${esc(t.label)}</option>`
  ).join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    addConsulta({
      id: crypto.randomUUID(),
      tipo: String(data.get("tipo") || "casa2"),
      nombre: String(data.get("nombre") || "").trim(),
      contacto: String(data.get("contacto") || "").trim(),
      lote: String(data.get("lote") || "").trim(),
      detalle: String(data.get("detalle") || "").trim()
    });
    form.reset();
    showToast("Consulta guardada. La ves en el panel.");
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

  renderCatalog();
})();
