(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("reservaForm");
  let currentFilter = "all";

  function publicados() {
    return loadHabitaciones().filter((h) => h.publicado !== false);
  }

  function renderCatalog() {
    const list = publicados().filter((h) => currentFilter === "all" || h.tipo === currentFilter);
    catalog.innerHTML = list.map((h) => `
      <article class="card-item" data-id="${esc(h.id)}">
        <img src="${esc(h.imagen)}" alt="${esc(h.nombre)}">
        <div>
          <p class="card-cat">${esc(tipoLabel(h.tipo))} · ${h.pax} pers.</p>
          <h3>${esc(h.nombre)}</h3>
          <p>${esc(h.descripcion)}</p>
          <p class="card-meta">${h.metros} m² · ${esc((h.amenities || []).slice(0, 3).join(" · "))}</p>
          <p class="card-price">${esc(money(h.precio))} <small>/ noche</small></p>
        </div>
      </article>
    `).join("") || "<p class='note'>No hay unidades en esta categoría.</p>";

    catalog.querySelectorAll(".card-item").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const h = publicados().find((item) => item.id === id);
    if (!h) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(h.imagen)}" alt="${esc(h.nombre)}">
      <div class="ficha-copy">
        <p class="kicker">${esc(tipoLabel(h.tipo))}</p>
        <h2 id="fichaTitle">${esc(h.nombre)}</h2>
        <p>${esc(h.descripcion)}</p>
        <dl class="ficha-meta">
          <div><dt>Precio</dt><dd>${esc(money(h.precio))} / noche</dd></div>
          <div><dt>Huéspedes</dt><dd>Hasta ${h.pax}</dd></div>
          <div><dt>Superficie</dt><dd>${h.metros} m²</dd></div>
          <div><dt>Lugar</dt><dd>Villa Ventana</dd></div>
        </dl>
        <p class="ficha-amenities">${(h.amenities || []).map((a) => `<span>${esc(a)}</span>`).join("")}</p>
        <a class="btn" href="#reserva" id="fichaReservar">Pedir estas fechas</a>
      </div>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("fichaReservar").addEventListener("click", () => {
      form.habitacion.value = h.id;
      form.huespedes.max = h.pax;
      if (Number(form.huespedes.value) > h.pax) form.huespedes.value = h.pax;
      updateTotal();
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
      <div class="ficha-copy">
        <p class="kicker">Qué visitar</p>
        <h2 id="fichaTitle">${esc(l.nombre)}</h2>
        <p>${esc(l.texto)}</p>
        <p class="ficha-amenities">${(l.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</p>
      </div>
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
    const map = L.map(el, {
      scrollWheelZoom: false,
      preferCanvas: true
    }).setView([lat, lng], zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup(popup);
    const refresh = () => map.invalidateSize();
    setTimeout(refresh, 80);
    setTimeout(refresh, 400);
    window.addEventListener("resize", refresh);
  }

  const navToggle = document.querySelector(".nav-toggle");
  const topEl = document.querySelector("header.top");
  if (navToggle && topEl) {
    navToggle.addEventListener("click", () => {
      const open = topEl.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    topEl.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        topEl.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
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

  const habSelect = form.querySelector('[name="habitacion"]');
  habSelect.innerHTML = publicados().map((h) =>
    `<option value="${esc(h.id)}">${esc(h.nombre)} · ${esc(money(h.precio))}/noche</option>`
  ).join("");

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const inDate = form.querySelector('[name="checkin"]');
  const outDate = form.querySelector('[name="checkout"]');
  inDate.min = iso(today);
  inDate.value = iso(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);
  outDate.min = iso(tomorrow);
  outDate.value = iso(tomorrow);

  function updateTotal() {
    const hab = getHabitacion(habSelect.value, publicados());
    if (!hab || !inDate.value || !outDate.value) {
      document.getElementById("reservaTotal").textContent = "";
      return;
    }
    const n = nights(inDate.value, outDate.value);
    document.getElementById("reservaTotal").textContent =
      `${n} noche${n === 1 ? "" : "s"} · ${money(n * hab.precio)} (ejemplo)`;
  }

  habSelect.addEventListener("change", () => {
    const hab = getHabitacion(habSelect.value, publicados());
    if (hab) {
      form.huespedes.max = hab.pax;
      if (Number(form.huespedes.value) > hab.pax) form.huespedes.value = hab.pax;
    }
    updateTotal();
  });
  inDate.addEventListener("change", () => {
    const next = new Date(`${inDate.value}T12:00:00`);
    next.setDate(next.getDate() + 1);
    outDate.min = iso(next);
    if (outDate.value <= inDate.value) outDate.value = iso(next);
    updateTotal();
  });
  outDate.addEventListener("change", updateTotal);
  updateTotal();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const habitacionId = String(data.get("habitacion") || "");
    const nombre = String(data.get("nombre") || "").trim();
    const tel = String(data.get("tel") || "").trim();
    const checkin = String(data.get("checkin") || "");
    const checkout = String(data.get("checkout") || "");
    if (!habitacionId || !nombre || !tel || !checkin || !checkout) return;
    if (checkout <= checkin) {
      showToast("El check-out tiene que ser después del check-in.");
      return;
    }
    const hab = getHabitacion(habitacionId, publicados());
    const huespedes = Number(data.get("huespedes") || 1);
    if (hab && huespedes > hab.pax) {
      showToast(`Esa unidad admite hasta ${hab.pax} huéspedes.`);
      return;
    }

    const items = loadReservas();
    const item = {
      id: crypto.randomUUID(),
      codigo: `H-${String(items.length + 17).padStart(3, "0")}`,
      habitacionId,
      checkin,
      checkout,
      huespedes,
      cliente: { nombre, tel, email: "" },
      notas: String(data.get("notas") || "").trim(),
      status: "pendiente",
      origen: "web",
      factura: null,
      history: [{ when: "hoy", text: "Pedido desde la web." }]
    };
    saveReservas([item, ...items]);
    form.reset();
    inDate.value = iso(today);
    outDate.value = iso(tomorrow);
    habSelect.selectedIndex = 0;
    updateTotal();
    showToast("Reserva anotada. La ves en el panel.");
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
  pintarMapa("mapa-local", -38.0694, -61.9333, "Villa Ventana · Cabañas del Sauce", 14);
})();
