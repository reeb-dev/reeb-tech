const properties = seed();
const favorites = new Set();
let currentFilters = {
  operacion: "",
  tipo: "",
  barrio: "",
  ambientes: "",
  precio: ""
};
let currentView = "grid";
let currentProperty = null;
let currentImageIndex = 0;

function formatPrice(price, operacion) {
  if (operacion === "venta") {
    return "USD " + Number(price).toLocaleString("es-AR");
  }
  return "$ " + Number(price).toLocaleString("es-AR") + "/mes";
}

function populateBarrios() {
  const barrios = [...new Set(properties.map((p) => p.barrio))].sort((a, b) => a.localeCompare(b, "es"));
  const select = document.getElementById("filterBarrio");
  barrios.forEach((barrio) => {
    const opt = document.createElement("option");
    opt.value = barrio;
    opt.textContent = barrio;
    select.appendChild(opt);
  });
  renderBarrioChips();
}

function renderBarrioChips() {
  const counts = {};
  properties.forEach((p) => {
    if (p.status === "disponible" || p.status === "reservada") {
      counts[p.barrio] = (counts[p.barrio] || 0) + 1;
    }
  });
  const barrios = Object.keys(counts).sort((a, b) => a.localeCompare(b, "es"));
  document.getElementById("barrioChips").innerHTML = barrios.map((barrio) => `
    <button type="button" class="barrio-chip ${currentFilters.barrio === barrio ? "active" : ""}" data-barrio="${esc(barrio)}">
      ${esc(barrio)}
    </button>
  `).join("");
}

function readFiltersFromForm() {
  currentFilters = {
    operacion: document.getElementById("filterOperacion").value,
    tipo: document.getElementById("filterTipo").value,
    barrio: document.getElementById("filterBarrio").value,
    ambientes: document.getElementById("filterAmbientes").value,
    precio: document.getElementById("filterPrecio").value
  };
}

function applyFilters() {
  readFiltersFromForm();
  renderBarrioChips();
  renderProperties();
}

function clearFilters() {
  document.getElementById("filterOperacion").value = "";
  document.getElementById("filterTipo").value = "";
  document.getElementById("filterBarrio").value = "";
  document.getElementById("filterAmbientes").value = "";
  document.getElementById("filterPrecio").value = "";
  document.getElementById("sortSelect").value = "destacados";
  applyFilters();
}

function filterByBarrioChip(barrio) {
  const select = document.getElementById("filterBarrio");
  select.value = select.value === barrio ? "" : barrio;
  applyFilters();
}

function matchesPrice(p, raw) {
  if (!raw) return true;
  const [kind, minStr, maxStr] = raw.split("-");
  const min = Number(minStr);
  const max = Number(maxStr);
  if (kind === "v") {
    if (p.operacion !== "venta") return false;
    return p.precio >= min && p.precio <= max;
  }
  if (kind === "a") {
    if (p.operacion !== "alquiler") return false;
    return p.precio >= min && p.precio <= max;
  }
  return true;
}

function filterProperties() {
  return properties.filter((p) => {
    if (p.status !== "disponible" && p.status !== "reservada") return false;
    if (currentFilters.operacion && p.operacion !== currentFilters.operacion) return false;
    if (currentFilters.tipo && p.tipo !== currentFilters.tipo) return false;
    if (currentFilters.barrio && p.barrio !== currentFilters.barrio) return false;
    if (currentFilters.ambientes) {
      const amb = Number(currentFilters.ambientes);
      if (amb === 4 && p.ambientes < 4) return false;
      if (amb < 4 && p.ambientes !== amb) return false;
    }
    if (!matchesPrice(p, currentFilters.precio)) return false;
    return true;
  });
}

function sortProperties(list) {
  const sortBy = document.getElementById("sortSelect").value;
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case "precio-asc": return a.precio - b.precio;
      case "precio-desc": return b.precio - a.precio;
      case "m2-desc": return b.superficie - a.superficie;
      case "recientes": return a.diasPublicada - b.diasPublicada;
      default:
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        if (a.nuevo && !b.nuevo) return -1;
        if (!a.nuevo && b.nuevo) return 1;
        return b.vistas - a.vistas;
    }
  });
}

function renderProperties() {
  const filtered = sortProperties(filterProperties());
  document.getElementById("resultsCount").textContent = filtered.length;
  const grid = document.getElementById("catalog");
  grid.classList.toggle("list", currentView === "list");

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No encontramos propiedades</h3>
        <p>Probá otro barrio, tipo o rango de precio.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((p) => {
    const fotos = p.imagenes || [];
    const portada = fotos[0] || fotoPorTipo(p.tipo);
    return `
      <article class="property-card" data-id="${esc(p.id)}">
        <div class="image">
          <img src="${esc(portada)}" alt="${esc(p.titulo)}">
          <div class="badges">
            <span class="badge ${esc(p.operacion)}">${esc(opLabel(p.operacion))}</span>
            ${p.destacado ? '<span class="badge destacado">Destacado</span>' : ""}
            ${p.nuevo ? '<span class="badge nuevo">Nuevo</span>' : ""}
            ${p.status === "reservada" ? '<span class="badge reservada">Reservada</span>' : ""}
          </div>
          <button class="favorite ${favorites.has(p.id) ? "on" : ""}" type="button" data-fav="${esc(p.id)}" aria-label="Favorito">${favorites.has(p.id) ? "♥" : "♡"}</button>
          ${fotos.length > 1 ? `<div class="gallery-count">${fotos.length} fotos</div>` : ""}
        </div>
        <div class="body">
          <div class="type-location">${esc(tipoLabel(p.tipo))} en ${esc(p.barrio)}</div>
          <h3>${esc(p.titulo)}</h3>
          <div class="location">${esc(p.direccion)}</div>
          <div class="price">${formatPrice(p.precio, p.operacion)}</div>
          ${p.expensas ? `<div class="expenses">+ Expensas: ${esc(money(p.expensas))}</div>` : ""}
          <div class="specs">
            <span>${p.superficie} m²</span>
            ${p.ambientes > 0 ? `<span>${p.ambientes} amb.</span>` : ""}
            ${p.dormitorios > 0 ? `<span>${p.dormitorios} dorm.</span>` : ""}
            ${p.banos > 0 ? `<span>${p.banos} baño${p.banos > 1 ? "s" : ""}</span>` : ""}
            ${p.cochera ? "<span>Cochera</span>" : ""}
          </div>
          <div class="stats">
            <span>${p.vistas} vistas</span>
            <span>${p.consultas} consultas</span>
            <span>${p.diasPublicada} días</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openModal(id) {
  currentProperty = properties.find((p) => p.id === id);
  currentImageIndex = 0;
  if (!currentProperty) return;

  updateModalImage();

  const p = currentProperty;
  const precioM2 = p.superficie ? Math.round(p.precio / p.superficie) : 0;
  const zonaRef = p.precioM2Zona || precioM2 || 1;
  const diffZona = Math.round(((precioM2 / zonaRef) - 1) * 100);
  const amenities = p.amenities || [];

  document.getElementById("modalContent").innerHTML = `
    <div class="badges">
      <span class="badge ${esc(p.operacion)}">${esc(opLabel(p.operacion))}</span>
      ${p.destacado ? '<span class="badge destacado">Destacado</span>' : ""}
      ${p.nuevo ? '<span class="badge nuevo">Nuevo</span>' : ""}
      ${p.status === "reservada" ? '<span class="badge reservada">Reservada</span>' : ""}
    </div>
    <h2>${esc(p.titulo)}</h2>
    <div class="location">${esc(p.direccion)} · ${esc(p.barrio)}, ${esc(p.zona)}</div>

    <div class="price-box">
      <div class="price">${formatPrice(p.precio, p.operacion)}</div>
      ${p.expensas ? `<div class="expenses">+ Expensas: ${esc(money(p.expensas))}</div>` : ""}
      <div class="expenses">${p.operacion === "venta" ? `USD ${precioM2.toLocaleString("es-AR")}/m²` : ""}</div>
    </div>

    <div class="modal-specs">
      <div class="spec">
        <div class="icon">m²</div>
        <div class="value">${p.superficie}</div>
        <div class="label">m² totales</div>
      </div>
      <div class="spec">
        <div class="icon">cub.</div>
        <div class="value">${p.cubierta || p.superficie}</div>
        <div class="label">m² cubiertos</div>
      </div>
      <div class="spec">
        <div class="icon">amb.</div>
        <div class="value">${p.ambientes || "—"}</div>
        <div class="label">Ambientes</div>
      </div>
      <div class="spec">
        <div class="icon">dorm.</div>
        <div class="value">${p.dormitorios || "—"}</div>
        <div class="label">Dormitorios</div>
      </div>
    </div>

    <div class="modal-description">
      <h4>Descripción</h4>
      <p>${esc(p.descripcion)}</p>
    </div>

    <div class="modal-specs">
      <div class="spec">
        <div class="value">${p.banos || "—"}</div>
        <div class="label">Baños</div>
      </div>
      <div class="spec">
        <div class="value">${p.piso || "PB"}</div>
        <div class="label">Piso</div>
      </div>
      <div class="spec">
        <div class="value">${esc(p.orientacion || "—")}</div>
        <div class="label">Orientación</div>
      </div>
      <div class="spec">
        <div class="value">${p.antiguedad === 0 ? "A estrenar" : (p.antiguedad != null ? p.antiguedad + " años" : "—")}</div>
        <div class="label">Antigüedad</div>
      </div>
    </div>

    ${amenities.length ? `
      <div class="modal-amenities">
        <h4>Amenities y características</h4>
        <div class="amenities-list">
          ${amenities.map((a) => `<span class="amenity-tag">${amenityIcon(a)} ${esc(amenityLabel(a))}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <div class="modal-stats">
      <div class="stat">
        <div class="value">${p.vistas}</div>
        <div class="label">Vistas</div>
      </div>
      <div class="stat">
        <div class="value">${p.consultas}</div>
        <div class="label">Consultas</div>
      </div>
      <div class="stat">
        <div class="value">${p.diasPublicada}</div>
        <div class="label">Días publicada</div>
      </div>
      <div class="stat">
        <div class="value" style="color: ${diffZona >= 0 ? "#ef4444" : "#22c55e"}">${diffZona >= 0 ? "+" : ""}${diffZona}%</div>
        <div class="label">vs. precio zona</div>
      </div>
    </div>

    <div class="modal-contact">
      <div>
        <h4>¿Te interesa esta propiedad?</h4>
        <p>Número y mail de ejemplo. El mensaje no sale a un servidor.</p>
      </div>
      <div class="btns">
        <a href="#" class="btn-whatsapp">WhatsApp</a>
        <a href="tel:+5491140001234" class="btn-call">Llamar</a>
      </div>
    </div>
  `;

  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
  currentProperty = null;
}

function updateModalImage() {
  if (!currentProperty) return;
  const imgs = currentProperty.imagenes && currentProperty.imagenes.length
    ? currentProperty.imagenes
    : [fotoPorTipo(currentProperty.tipo)];
  const safeIndex = ((currentImageIndex % imgs.length) + imgs.length) % imgs.length;
  currentImageIndex = safeIndex;
  const img = document.getElementById("modalImage");
  img.src = imgs[safeIndex];
  img.alt = currentProperty.titulo;
  document.getElementById("imageCounter").textContent = `${safeIndex + 1} / ${imgs.length}`;
  document.getElementById("modalThumbs").innerHTML = imgs.map((src, i) => `
    <button type="button" class="${i === safeIndex ? "active" : ""}" data-thumb="${i}">
      <img src="${esc(src)}" alt="">
    </button>
  `).join("");
}

function nextImage() {
  if (!currentProperty) return;
  currentImageIndex += 1;
  updateModalImage();
}

function prevImage() {
  if (!currentProperty) return;
  currentImageIndex -= 1;
  updateModalImage();
}

document.getElementById("btnBuscar").addEventListener("click", applyFilters);
document.getElementById("btnLimpiar").addEventListener("click", clearFilters);
["filterOperacion", "filterTipo", "filterBarrio", "filterAmbientes", "filterPrecio", "sortSelect"].forEach((id) => {
  document.getElementById(id).addEventListener("change", applyFilters);
});

document.getElementById("barrioChips").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-barrio]");
  if (!chip) return;
  filterByBarrioChip(chip.dataset.barrio);
});

document.querySelector(".view-toggle").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-view]");
  if (!btn) return;
  currentView = btn.dataset.view;
  document.querySelectorAll(".view-toggle button").forEach((b) => b.classList.toggle("active", b === btn));
  renderProperties();
});

document.getElementById("catalog").addEventListener("click", (event) => {
  const fav = event.target.closest("[data-fav]");
  if (fav) {
    event.stopPropagation();
    const id = fav.dataset.fav;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    renderProperties();
    return;
  }
  const card = event.target.closest(".property-card");
  if (card) openModal(card.dataset.id);
});

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("prevImage").addEventListener("click", prevImage);
document.getElementById("nextImage").addEventListener("click", nextImage);
document.getElementById("modalThumbs").addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-thumb]");
  if (!thumb) return;
  currentImageIndex = Number(thumb.dataset.thumb);
  updateModalImage();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

populateBarrios();
renderProperties();
