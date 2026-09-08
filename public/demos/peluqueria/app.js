(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const form = document.getElementById("turnoForm");
  let currentFilter = "all";

  function serviciosPublicados() {
    return loadServicios().filter((s) => s.publicado !== false);
  }

  function renderServicios() {
    const list = serviciosPublicados().filter((s) =>
      currentFilter === "all" || s.categoria === currentFilter
    );
    catalog.innerHTML = list.map((s) => `
      <article class="service-card" data-id="${esc(s.id)}">
        <img src="${esc(s.imagen)}" alt="${esc(s.label)}">
        <div>
          <p class="service-cat">${esc(catLabel(s.categoria))}</p>
          <h3>${esc(s.label)}</h3>
          <p>${esc(s.descripcion)}</p>
          <p class="service-meta">${s.duracion} min · ${esc(s.profesional)}</p>
          <p class="service-price">${esc(money(s.precio))}</p>
        </div>
      </article>
    `).join("") || "<p class='note'>No hay servicios en esta categoría.</p>";

    catalog.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("click", () => openFicha(card.dataset.id));
    });
  }

  function openFicha(id) {
    const s = serviciosPublicados().find((item) => item.id === id);
    if (!s) return;
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(s.imagen)}" alt="${esc(s.label)}">
      <p class="kicker">${esc(catLabel(s.categoria))}</p>
      <h2 id="fichaTitle">${esc(s.label)}</h2>
      <p>${esc(s.descripcion)}</p>
      <dl class="ficha-meta">
        <div><dt>Duración</dt><dd>${s.duracion} min</dd></div>
        <div><dt>Precio</dt><dd>${esc(money(s.precio))}</dd></div>
        <div><dt>Profesional</dt><dd>${esc(s.profesional)}</dd></div>
        <div><dt>Salón</dt><dd>Av. Cabildo 2840</dd></div>
      </dl>
      <a class="btn" href="#turnos" id="fichaReservar">Pedir este turno</a>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("fichaReservar").addEventListener("click", () => {
      form.servicio.value = s.id;
      form.profesional.value = s.profesional;
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
      renderServicios();
    });
  });

  document.getElementById("equipoGrid").innerHTML = PROFESIONALES.map((p) => `
    <article class="profesional-card">
      <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
      <h3>${esc(p.nombre)}</h3>
      <p class="pro-rol">${esc(p.rol)}</p>
      <p>${esc(p.bio)}</p>
    </article>
  `).join("");

  const srvSelect = form.querySelector('[name="servicio"]');
  srvSelect.innerHTML = serviciosPublicados().map((s) =>
    `<option value="${esc(s.id)}">${esc(s.label)} · ${s.duracion} min · ${esc(money(s.precio))}</option>`
  ).join("");

  const proSelect = form.querySelector('[name="profesional"]');
  proSelect.innerHTML = PROFESIONALES.map((p) =>
    `<option value="${esc(p.corto)}">${esc(p.nombre)} · ${esc(p.rol)}</option>`
  ).join("");

  srvSelect.addEventListener("change", () => {
    const s = getServicio(srvSelect.value, serviciosPublicados());
    if (s?.profesional) proSelect.value = s.profesional;
  });

  const fechaInput = form.querySelector('[name="fecha"]');
  const today = new Date();
  fechaInput.min = today.toISOString().slice(0, 10);
  fechaInput.value = today.toISOString().slice(0, 10);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const servicioId = String(data.get("servicio") || "");
    const nombre = String(data.get("nombre") || "").trim();
    const tel = String(data.get("tel") || "").trim();
    if (!servicioId || !nombre || !tel) return;

    const fechaRaw = String(data.get("fecha") || "");
    const fechaObj = fechaRaw ? new Date(`${fechaRaw}T12:00:00`) : new Date();
    const fecha = fechaObj.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
    const hora = String(data.get("hora") || "10:00");
    const profesional = String(data.get("profesional") || "Lucía");
    const notas = String(data.get("notas") || "").trim();

    const items = loadTurnos();
    const n = items.length + 9;
    const item = {
      id: crypto.randomUUID(),
      turno: `T-${String(n).padStart(3, "0")}`,
      fecha,
      hora,
      cliente: { nombre, tel, email: "" },
      servicios: [servicioId],
      profesional,
      notas,
      status: "reservado",
      origen: "web",
      factura: null,
      history: [{ when: "hoy", text: "Turno pedido desde la web." }]
    };
    saveTurnos([item, ...items]);

    const clientes = loadClientes();
    const existing = clientes.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.tel === tel);
    if (existing) {
      existing.profesional = profesional;
      if (notas) existing.notas = notas;
      saveClientes(clientes);
    } else {
      saveClientes([{
        id: crypto.randomUUID(),
        nombre,
        tel,
        email: "",
        profesional,
        notas
      }, ...clientes]);
    }

    form.reset();
    fechaInput.value = today.toISOString().slice(0, 10);
    srvSelect.selectedIndex = 0;
    const first = getServicio(srvSelect.value, serviciosPublicados());
    if (first?.profesional) proSelect.value = first.profesional;
    showToast("Turno anotado. Lo ves en el panel del salón.");
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

  renderServicios();
})();
