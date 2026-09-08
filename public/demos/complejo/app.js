(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("reservaForm");
  let currentFilter = "all";

  function publicados() {
    return loadPaquetes().filter((p) => p.publicado !== false);
  }

  function renderCatalog() {
    const list = publicados().filter((p) => currentFilter === "all" || p.tipo === currentFilter);
    catalog.innerHTML = list.map((p) => `
      <article class="card-item" data-id="${esc(p.id)}">
        <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
        <div>
          <p class="card-cat">${p.noches ? p.noches + " noche" + (p.noches === 1 ? "" : "s") : "Sin pernocte"} · ${p.pax} pers.</p>
          <h3>${esc(p.nombre)}</h3>
          <p>${esc(p.descripcion)}</p>
          <p class="card-meta">${esc((p.incluye || []).slice(0, 3).join(" · "))}</p>
          <p class="card-price">${esc(money(p.precio))}</p>
        </div>
      </article>
    `).join("") || "<p class='note'>No hay paquetes en este filtro.</p>";

    catalog.querySelectorAll(".card-item").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const p = publicados().find((item) => item.id === id);
    if (!p) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
      <p class="kicker">El Palomar</p>
      <h2 id="fichaTitle">${esc(p.nombre)}</h2>
      <p>${esc(p.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Precio</dt><dd>${esc(money(p.precio))}</dd></div>
        <div><dt>Huéspedes</dt><dd>Hasta ${p.pax}</dd></div>
        <div><dt>Noches</dt><dd>${p.noches || "Día"}</dd></div>
        <div><dt>Lugar</dt><dd>Ruta 76 km 227</dd></div>
      </dl>
      <p class="ficha-amenities">${(p.incluye || []).map((a) => `<span>${esc(a)}</span>`).join("")}</p>
      <a class="btn" href="#reserva" id="fichaReservar">Pedir este paquete</a>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("fichaReservar").addEventListener("click", () => {
      form.paquete.value = p.id;
      updateTotal();
      closeFicha();
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

  document.querySelectorAll("#filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filters button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderCatalog();
    });
  });

  document.getElementById("actGrid").innerHTML = loadActividades().map((a) => `
    <article class="card-item" style="cursor:default">
      <img src="${esc(a.imagen)}" alt="${esc(a.nombre)}">
      <div>
        <p class="card-cat">${esc(a.hora)} · ${esc(a.lugar)}</p>
        <h3>${esc(a.nombre)}</h3>
        <p class="card-meta">Cupo ${a.tomados}/${a.cupo}</p>
        <div class="cupo-bar"><span style="width:${Math.round((a.tomados / a.cupo) * 100)}%"></span></div>
      </div>
    </article>
  `).join("");

  const pkgSelect = form.querySelector('[name="paquete"]');
  pkgSelect.innerHTML = publicados().map((p) =>
    `<option value="${esc(p.id)}">${esc(p.nombre)} · ${esc(money(p.precio))}</option>`
  ).join("");

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const inDate = form.querySelector('[name="checkin"]');
  const outDate = form.querySelector('[name="checkout"]');
  inDate.min = iso(today);
  inDate.value = iso(today);
  const next = new Date(today);
  next.setDate(next.getDate() + 2);
  outDate.value = iso(next);

  function updateTotal() {
    const p = getPaquete(pkgSelect.value, publicados());
    if (!p) return;
    document.getElementById("reservaTotal").textContent = `${esc(p.nombre)} · ${money(p.precio)}`;
  }
  pkgSelect.addEventListener("change", updateTotal);
  updateTotal();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const paqueteId = String(data.get("paquete") || "");
    const nombre = String(data.get("nombre") || "").trim();
    const tel = String(data.get("tel") || "").trim();
    const checkin = String(data.get("checkin") || "");
    if (!paqueteId || !nombre || !tel || !checkin) return;

    const items = loadReservas();
    saveReservas([{
      id: crypto.randomUUID(),
      codigo: `C-${String(items.length + 30).padStart(3, "0")}`,
      paqueteId,
      checkin,
      checkout: String(data.get("checkout") || checkin),
      huespedes: Number(data.get("huespedes") || 1),
      cliente: { nombre, tel, email: "" },
      notas: String(data.get("notas") || "").trim(),
      status: "pendiente",
      origen: "web",
      factura: null,
      history: [{ when: "hoy", text: "Pedido desde la web." }]
    }, ...items]);

    const spaServ = String(data.get("spa") || "");
    if (spaServ) {
      const spa = loadSpa();
      saveSpa([{
        id: crypto.randomUUID(),
        nombre,
        servicio: spaServ,
        fecha: checkin,
        hora: String(data.get("horaSpa") || "10:00"),
        status: "reservado"
      }, ...spa]);
    }

    form.reset();
    form.huespedes.value = 2;
    inDate.value = iso(today);
    outDate.value = iso(next);
    pkgSelect.selectedIndex = 0;
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
})();
