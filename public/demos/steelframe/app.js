(function () {
  const catalog = document.getElementById("catalog");
  const filtersEl = document.getElementById("filters");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("consultaForm");
  const pasosEl = document.getElementById("pasos");
  let filtro = "all";

  function publicados() {
    return loadModelos().filter((m) => m.publicado !== false);
  }

  function visibles() {
    const list = publicados();
    if (filtro === "all") return list;
    return list.filter((m) => grupoDeTipo(m.tipo) === filtro);
  }

  function renderFilters() {
    filtersEl.innerHTML = FILTROS.map((f) => `
      <button type="button" class="${filtro === f.id ? "active" : ""}" data-filter="${esc(f.id)}">${esc(f.label)}</button>
    `).join("");
    filtersEl.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filtro = btn.dataset.filter;
        renderFilters();
        renderCatalog();
      });
    });
  }

  function renderCatalog() {
    const list = visibles();
    catalog.innerHTML = list.map((m) => `
      <article class="work-card" data-id="${esc(m.id)}">
        <img src="${esc(m.imagen)}" alt="${esc(m.nombre)}">
        <div class="work-body">
          <p class="work-tipo">${esc(tipoLabel(m.tipo))}</p>
          <h3>${esc(m.nombre)}</h3>
          <p class="work-desc">${esc(m.descripcion)}</p>
          <p class="work-meta">${m.m2} m² · ${esc(m.ambientes)}</p>
          <p class="work-meta">${esc(m.plazo)} · ${esc(m.sistema || "Steel frame")}</p>
          <p class="work-price">${esc(money(m.precio))}</p>
        </div>
      </article>
    `).join("") || "<p class='section-lead'>No hay modelos en este filtro.</p>";
    catalog.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function renderPasos() {
    pasosEl.innerHTML = PASOS.map((p) => `
      <li class="paso">
        <img src="${esc(p.imagen)}" alt="">
        <div>
          <span class="paso-n">${esc(p.n)}</span>
          <h3>${esc(p.titulo)}</h3>
          <p>${esc(p.texto)}</p>
        </div>
      </li>
    `).join("");
  }

  function renderComparativa() {
    const body = document.querySelector("#compModelos tbody");
    body.innerHTML = publicados().map((m) => `
      <tr>
        <td>
          <button type="button" class="linkish" data-id="${esc(m.id)}">${esc(m.nombre)}</button>
        </td>
        <td>${m.m2}</td>
        <td>${esc(m.ambientes)}</td>
        <td>${esc(m.plazo)}</td>
        <td>${esc(m.sistema || "Steel frame")}</td>
        <td class="amount">${esc(money(m.precio))}</td>
      </tr>
    `).join("");
    body.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => openFicha(btn.dataset.id));
    });

    document.querySelector("#compSistema tbody").innerHTML = COMPARATIVA_SISTEMA.map((row) => `
      <tr>
        <th scope="row">${esc(row.criterio)}</th>
        <td>${esc(row.steel)}</td>
        <td>${esc(row.tradicional)}</td>
      </tr>
    `).join("");
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
        <div><dt>Sistema</dt><dd>${esc(m.sistema || "Steel frame")}</dd></div>
        <div><dt>Precio de ejemplo</dt><dd>${esc(money(m.precio))}</dd></div>
      </dl>
      <button class="btn" type="button" id="fichaPedir">Pedir este modelo</button>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("fichaPedir").addEventListener("click", () => {
      form.querySelector('[name="tipo"]').value = m.tipo;
      closeFicha();
      document.getElementById("consulta").scrollIntoView({ behavior: "smooth" });
    });
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

  renderFilters();
  renderCatalog();
  renderPasos();
  renderComparativa();
})();
