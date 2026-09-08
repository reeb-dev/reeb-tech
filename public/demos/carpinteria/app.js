(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("presupuestoForm");

  function trabajosPublicados() {
    return loadTrabajos().filter((t) => t.publicado !== false);
  }

  function renderPortfolio() {
    catalog.innerHTML = trabajosPublicados().map((t) => `
      <article class="work-card" data-id="${esc(t.id)}">
        <img src="${esc(t.imagen)}" alt="${esc(t.titulo)}">
        <div class="work-body">
          <p class="work-tipo">${esc(tipoLabel(t.tipo))}</p>
          <h3>${esc(t.titulo)}</h3>
          <p class="work-desc">${esc(t.descripcion)}</p>
          <p class="work-price">${esc(money(t.precio))}</p>
        </div>
      </article>
    `).join("");

    catalog.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const t = trabajosPublicados().find((item) => item.id === id);
    if (!t) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(t.imagen)}" alt="${esc(t.titulo)}">
      <p class="kicker">${esc(tipoLabel(t.tipo))}</p>
      <h2 id="fichaTitle">${esc(t.titulo)}</h2>
      <p>${esc(t.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Materiales</dt><dd>${esc(t.materiales)}</dd></div>
        <div><dt>Medidas</dt><dd>${esc(t.medidas)}</dd></div>
        <div><dt>Plazo</dt><dd>${esc(t.plazo)}</dd></div>
        <div><dt>Precio</dt><dd>${esc(money(t.precio))}</dd></div>
      </dl>
      <a class="btn" href="#presupuesto">Pedir uno similar</a>
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
        <p class="service-price">Desde ${esc(money(s.precioDesde))}</p>
      </div>
    </article>
  `).join("");

  const tipoSelect = form.querySelector('[name="tipo"]');
  tipoSelect.innerHTML = TIPOS_MUEBLE.map((t) =>
    `<option value="${esc(t.id)}">${esc(t.label)}</option>`
  ).join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const tipo = String(data.get("tipo") || "otro");
    const items = loadPedidos();
    const n = items.length + 46;
    const item = {
      id: crypto.randomUUID(),
      pedido: `PED-2026-${String(n).padStart(3, "0")}`,
      cliente: {
        nombre: String(data.get("nombre") || "").trim(),
        tel: String(data.get("contacto") || "").trim(),
        direccion: ""
      },
      tipo,
      descripcion: String(data.get("detalle") || "Consulta desde la web.").trim(),
      medidas: String(data.get("medidas") || "").trim(),
      materiales: [],
      manoObra: 0,
      seña: 0,
      status: "consulta",
      fechaPedido: "hoy",
      fechaEntrega: "Pendiente",
      imagen: imagenDeTipo(tipo),
      origen: "presupuesto",
      factura: null,
      history: [{ when: "hoy", text: "Consulta enviada desde el formulario de presupuesto." }]
    };
    savePedidos([item, ...items]);
    form.reset();
    showToast("Consulta guardada. La ves en el panel del taller.");
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
