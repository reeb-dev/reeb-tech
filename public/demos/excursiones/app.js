(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("reservaForm");
  let currentFilter = "all";

  function publicados() {
    return loadTours().filter((t) => t.publicado !== false);
  }

  function renderCatalog() {
    const list = publicados().filter((t) =>
      currentFilter === "all" || t.categoria === currentFilter
    );
    catalog.innerHTML = list.map((t) => `
      <article class="card-item" data-id="${esc(t.id)}">
        <img src="${esc(t.imagen)}" alt="${esc(t.nombre)}">
        <div>
          <p class="card-cat">${esc(t.duracion)} · ${esc(t.dificultad || idiomaLabel(t.idioma))}</p>
          <h3>${esc(t.nombre)}</h3>
          <p>${esc(t.descripcion)}</p>
          <p class="card-meta">Cupo ${t.cupo} · Guía ${esc(t.guia)}</p>
          <p class="card-price">${esc(money(t.precio))} <small>/ persona</small></p>
        </div>
      </article>
    `).join("") || "<p class='note'>No hay excursiones en este filtro.</p>";

    catalog.querySelectorAll(".card-item").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const t = publicados().find((item) => item.id === id);
    if (!t) return;
    const salidas = loadSalidas().filter((s) => s.tourId === t.id);
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(t.imagen)}" alt="${esc(t.nombre)}">
      <p class="kicker">${esc(t.dificultad || idiomaLabel(t.idioma))}</p>
      <h2 id="fichaTitle">${esc(t.nombre)}</h2>
      <p>${esc(t.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Duración</dt><dd>${esc(t.duracion)}</dd></div>
        <div><dt>Dificultad</dt><dd>${esc(t.dificultad || "—")}</dd></div>
        <div><dt>Precio</dt><dd>${esc(money(t.precio))} / pers.</dd></div>
        <div><dt>Guía</dt><dd>${esc(t.guia)}</dd></div>
      </dl>
      <p style="margin:0 22px 12px;font-size:14px;color:var(--muted)">Próximas salidas: ${
        salidas.length
          ? salidas.map((s) => `${fmtDate(s.fecha)} ${s.hora} (${cupoLibre(s, t)} libres)`).join(" · ")
          : "a coordinar"
      }</p>
      <a class="btn" href="#reserva" id="fichaReservar">Pedir plaza</a>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("fichaReservar").addEventListener("click", () => {
      form.tour.value = t.id;
      fillSalidas();
      closeFicha();
    });
  }

  function closeFicha() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  function openLugar(id) {
    const l = (typeof LUGARES !== "undefined" ? LUGARES : []).find((item) => item.id === id);
    if (!l) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(l.foto)}" alt="${esc(l.nombre)}">
      <p class="kicker">Qué visitar</p>
      <h2 id="fichaTitle">${esc(l.nombre)}</h2>
      <p>${esc(l.texto)}</p>
      <p class="ficha-amenities">${(l.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</p>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function renderLugares() {
    const grid = document.getElementById("lugaresGrid");
    if (!grid || typeof LUGARES === "undefined") return;
    grid.innerHTML = LUGARES.map((l) => `
      <button type="button" class="lugar-card" data-lugar="${esc(l.id)}">
        <img src="${esc(l.foto)}" alt="${esc(l.nombre)}">
        <div>
          <h3>${esc(l.nombre)}</h3>
          <p>${esc(l.resumen)}</p>
        </div>
      </button>
    `).join("");
    grid.querySelectorAll(".lugar-card").forEach((card) => {
      card.addEventListener("click", () => openLugar(card.dataset.lugar));
    });
  }

  function pintarMapa(elId, lat, lng, popup, zoom) {
    const el = document.getElementById(elId);
    if (!el || typeof L === "undefined") return;
    const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup(popup);
    setTimeout(() => map.invalidateSize(), 80);
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
      currentFilter = btn.dataset.filter;
      renderCatalog();
    });
  });

  document.getElementById("guiasGrid").innerHTML = loadGuias().map((g) => `
    <article class="profesional-card">
      <img src="${esc(g.imagen)}" alt="${esc(g.nombre)}">
      <h3>${esc(g.nombre)}</h3>
      <p class="pro-rol">${esc(g.rol)}</p>
      <p>${esc(g.bio)}</p>
    </article>
  `).join("");

  const tourSelect = form.querySelector('[name="tour"]');
  const salidaSelect = form.querySelector('[name="salida"]');
  tourSelect.innerHTML = publicados().map((t) =>
    `<option value="${esc(t.id)}">${esc(t.nombre)} · ${esc(money(t.precio))}</option>`
  ).join("");

  function fillSalidas() {
    const tourId = tourSelect.value;
    const t = getTour(tourId, publicados());
    const salidas = loadSalidas().filter((s) => s.tourId === tourId && s.estado !== "cancelada");
    salidaSelect.innerHTML = salidas.map((s) => {
      const libres = cupoLibre(s, t);
      return `<option value="${esc(s.id)}" ${libres === 0 ? "disabled" : ""}>${esc(fmtDate(s.fecha))} ${esc(s.hora)} · ${libres} libres</option>`;
    }).join("") || `<option value="">Sin salida cargada</option>`;
    updateTotal();
  }

  function updateTotal() {
    const t = getTour(tourSelect.value, publicados());
    const plazas = Number(form.plazas.value || 1);
    if (!t) return;
    document.getElementById("reservaTotal").textContent =
      `${plazas} plaza${plazas === 1 ? "" : "s"} · ${money(plazas * t.precio)}`;
  }

  tourSelect.addEventListener("change", fillSalidas);
  form.plazas.addEventListener("input", updateTotal);
  fillSalidas();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const tourId = String(data.get("tour") || "");
    const salidaId = String(data.get("salida") || "");
    const nombre = String(data.get("nombre") || "").trim();
    const tel = String(data.get("tel") || "").trim();
    const plazas = Number(data.get("plazas") || 1);
    if (!tourId || !salidaId || !nombre || !tel) return;

    const salidas = loadSalidas();
    const salida = salidas.find((s) => s.id === salidaId);
    const tour = getTour(tourId, publicados());
    if (!salida || !tour) return;
    if (cupoLibre(salida, tour) < plazas) {
      showToast("No hay cupo suficiente en esa salida.");
      return;
    }

    salida.cupoTomado += plazas;
    if (cupoLibre(salida, tour) === 0) salida.estado = "completa";
    saveSalidas(salidas);

    const items = loadReservas();
    saveReservas([{
      id: crypto.randomUUID(),
      codigo: `E-${String(items.length + 50).padStart(3, "0")}`,
      tourId,
      salidaId,
      plazas,
      cliente: { nombre, tel, email: "" },
      idioma: String(data.get("idioma") || "es"),
      notas: String(data.get("notas") || "").trim(),
      status: "pendiente",
      origen: "web",
      history: [{ when: "hoy", text: "Plaza pedida desde la web." }]
    }, ...items]);

    form.reset();
    form.plazas.value = 1;
    tourSelect.selectedIndex = 0;
    fillSalidas();
    showToast("Plaza anotada. La ves en el panel.");
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
  renderLugares();
  pintarMapa("mapa-local", -38.1372, -61.7958, "Sierra de la Ventana · Senderos Tornquist", 15);
})();
