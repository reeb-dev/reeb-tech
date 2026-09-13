let properties = load();
const favorites = new Set(loadFavoritoIds());
let currentFilters = {
  operacion: "",
  tipo: "",
  barrio: "",
  ambientes: "",
  precio: "",
  novedad: ""
};
let currentView = "grid";
let currentProperty = null;
let currentImageIndex = 0;
let countedViewId = null;
const PAGE_SIZE = 8;
let shownCount = PAGE_SIZE;
let listObserver = null;

function formatPrice(price, operacion) {
  if (operacion === "venta") {
    return "USD " + Number(price).toLocaleString("es-AR");
  }
  return "$ " + Number(price).toLocaleString("es-AR") + "/mes";
}

let mapaComarca = null;
let mapaFicha = null;

function publicImage(src) {
  const value = String(src || "");
  return value.startsWith("img/") ? value.replace(/\.jpg(?=$|[?#])/, ".webp") : value;
}

function populateBarrios() {
  const select = document.getElementById("filterBarrio");
  if (!select) return;
  const fromZonas = (typeof zonasTodas === "function" ? zonasTodas() : ZONAS).map((z) => z.id);
  const fromList = properties.map((p) => p.barrio).filter(Boolean);
  const seen = new Set();
  const barrios = [];
  fromZonas.concat(fromList).forEach((barrio) => {
    if (!barrio || seen.has(barrio)) return;
    seen.add(barrio);
    barrios.push(barrio);
  });
  barrios.forEach((barrio) => {
    const opt = document.createElement("option");
    opt.value = barrio;
    const z = typeof zonaPorBarrio === "function" ? zonaPorBarrio(barrio) : null;
    const cerca = z && typeof zonaCercaNombre === "function" ? zonaCercaNombre(z) : "";
    opt.textContent = cerca ? barrio + " · cerca de " + cerca : barrio;
    select.appendChild(opt);
  });
  renderBarrioChips();
  renderZoneCards();
}

function renderBarrioChips() {
  const host = document.getElementById("barrioChips");
  if (!host) return;
  host.innerHTML = "";
}

function readFiltersFromForm() {
  const novedad = currentFilters.novedad || "";
  currentFilters = {
    operacion: document.getElementById("filterOperacion").value,
    tipo: document.getElementById("filterTipo").value,
    barrio: document.getElementById("filterBarrio").value,
    ambientes: document.getElementById("filterAmbientes").value,
    precio: document.getElementById("filterPrecio").value,
    novedad
  };
}

function markFilterFields() {
  document.querySelectorAll(".search-box .field").forEach((field) => {
    const control = field.querySelector("select, input");
    field.classList.toggle("is-set", Boolean(control && control.value));
  });
  const extra = document.getElementById("moreFilters");
  if (extra) {
    const hasExtra = Boolean(currentFilters.ambientes || currentFilters.precio);
    extra.classList.toggle("has-extra", hasExtra);
  }
}

function resetListingWindow() {
  shownCount = PAGE_SIZE;
}

function applyFilters() {
  readFiltersFromForm();
  markFilterFields();
  resetListingWindow();
  renderBarrioChips();
  renderZoneCards();
  renderProperties();
  pintarMapaComarca();
}

function clearFilters() {
  document.getElementById("filterOperacion").value = "";
  document.getElementById("filterTipo").value = "";
  document.getElementById("filterBarrio").value = "";
  document.getElementById("filterAmbientes").value = "";
  document.getElementById("filterPrecio").value = "";
  document.getElementById("sortSelect").value = "destacados";
  currentFilters.novedad = "";
  applyFilters();
}

function filterByBarrioChip(barrio) {
  const select = document.getElementById("filterBarrio");
  select.value = select.value === barrio ? "" : barrio;
  applyFilters();
}

function selectZona(id, scroll) {
  const select = document.getElementById("filterBarrio");
  if (select) select.value = id || "";
  applyFilters();
  if (scroll) {
    document.getElementById("propiedades")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function detalleHref(id) {
  const q = new URLSearchParams({ id });
  if (currentFilters.barrio) q.set("zona", currentFilters.barrio);
  return "propiedad.html?" + q.toString();
}

function renderZoneCards() {
  const host = document.getElementById("zoneCards");
  const zonas = typeof zonasTodas === "function" ? zonasTodas() : (typeof ZONAS === "undefined" ? [] : ZONAS);
  if (!host || !zonas.length) return;
  const allBtn = document.getElementById("zoneAll");
  if (allBtn) allBtn.classList.toggle("is-quiet", !currentFilters.barrio);
  host.innerHTML = zonas.filter((z) => z.id).map((z) => {
    const cerca = typeof zonaCercaNombre === "function" ? zonaCercaNombre(z) : "";
    const foto = typeof zonaFotoDe === "function" ? zonaFotoDe(z) : (z.foto || "img/lago.jpg");
    return `
    <button type="button" class="zone-pick ${currentFilters.barrio === z.id ? "active" : ""}" data-zona="${esc(z.id)}" aria-pressed="${currentFilters.barrio === z.id ? "true" : "false"}">
      <img src="${esc(publicImage(foto))}" alt="${esc(z.nombre)}" loading="lazy" decoding="async">
      <span>${esc(z.nombre)}</span>
      ${cerca ? `<em class="zone-cerca">Cerca de ${esc(cerca)}</em>` : ""}
      <small>${esc(z.texto || "")}</small>
    </button>`;
  }).join("");
}

function tilesOsm(map) {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19
  }).addTo(map);
}

function pintarMapaComarca() {
  const el = document.getElementById("mapaComarca");
  const list = typeof zonasTodas === "function" ? zonasTodas() : (typeof ZONAS === "undefined" ? [] : ZONAS);
  if (!el || el.closest("[hidden]") || typeof L === "undefined" || !list.length) return;
  if (mapaComarca) {
    mapaComarca.remove();
    mapaComarca = null;
  }
  const zonas = list.filter((z) => z.id).map((z) => typeof zonaConCoords === "function" ? zonaConCoords(z) : z);
  mapaComarca = L.map(el, { scrollWheelZoom: false }).setView([-41.35, -71.38], 9);
  tilesOsm(mapaComarca);
  zonas.forEach((z) => {
    const activa = currentFilters.barrio === z.id;
    const marker = L.circleMarker([z.lat, z.lng], {
      radius: activa ? 12 : 8,
      color: "#2f3b34",
      fillColor: activa ? "#c45c26" : "#5f7f68",
      fillOpacity: 0.92,
      weight: 2
    }).addTo(mapaComarca);
    marker.bindTooltip(z.nombre, { permanent: true, direction: "top", className: "zona-tip", offset: [0, -6] });
    marker.on("click", () => selectZona(z.id, true));
  });
  const activa = typeof zonaPorBarrio === "function" ? zonaPorBarrio(currentFilters.barrio) : null;
  if (activa) mapaComarca.setView([activa.lat, activa.lng], activa.id === "El Bolsón" || activa.parentId === "El Bolsón" ? 11 : 12);
  else mapaComarca.fitBounds(zonas.map((z) => [z.lat, z.lng]), { padding: [28, 28] });
  window.setTimeout(() => mapaComarca && mapaComarca.invalidateSize(), 80);
}

function watchMapaComarca() {
  const el = document.getElementById("mapaComarca");
  if (!el || typeof IntersectionObserver === "undefined") {
    pintarMapaComarca();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    pintarMapaComarca();
  }, { rootMargin: "320px 0px" });
  observer.observe(el);
}

function pintarMapaFicha(p) {
  const el = document.getElementById("mapaFicha");
  if (!el || typeof L === "undefined") return;
  if (mapaFicha) {
    mapaFicha.remove();
    mapaFicha = null;
  }
  const z = zonaPorBarrio(p.barrio) || { lat: -41.1335, lng: -71.3103, nombre: p.barrio };
  mapaFicha = L.map(el, { scrollWheelZoom: false }).setView([z.lat, z.lng], 13);
  tilesOsm(mapaFicha);
  L.marker([z.lat, z.lng]).addTo(mapaFicha).bindPopup(esc(p.barrio) + " · zona aproximada");
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 120);
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 420);
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
    if (currentFilters.novedad === "nuevo" && !p.nuevo) return false;
    if (currentFilters.novedad === "baja" && !p.bajoPrecio) return false;
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
      case "recientes": {
        const tb = Number(b.ingresada || 0);
        const ta = Number(a.ingresada || 0);
        if (tb !== ta) return tb - ta;
        if (a.nuevo && !b.nuevo) return -1;
        if (!a.nuevo && b.nuevo) return 1;
        return 0;
      }
      default:
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        if (a.nuevo && !b.nuevo) return -1;
        if (!a.nuevo && b.nuevo) return 1;
        return b.vistas - a.vistas;
    }
  });
}

function loadMoreListings() {
  const total = sortProperties(filterProperties()).length;
  if (shownCount >= total) return;
  shownCount = Math.min(shownCount + PAGE_SIZE, total);
  renderProperties();
}

function watchListEnd() {
  if (listObserver) listObserver.disconnect();
  const sentinel = document.getElementById("listSentinel");
  if (!sentinel) return;
  listObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMoreListings();
  }, { rootMargin: "240px 0px" });
  listObserver.observe(sentinel);
}

function renderProperties() {
  const filtered = sortProperties(filterProperties());
  const visible = filtered.slice(0, shownCount);
  const shownEl = document.getElementById("resultsShown");
  const countEl = document.getElementById("resultsCount");
  if (shownEl) shownEl.textContent = filtered.length ? visible.length : 0;
  if (countEl) countEl.textContent = filtered.length;
  const moreBtn = document.getElementById("btnVerMas");
  if (moreBtn) moreBtn.hidden = shownCount >= filtered.length || filtered.length === 0;
  const grid = document.getElementById("catalog");
  grid.classList.toggle("list", currentView === "list");

  if (filtered.length === 0) {
    const shownEl = document.getElementById("resultsShown");
    const countEl = document.getElementById("resultsCount");
    if (shownEl) shownEl.textContent = "0";
    if (countEl) countEl.textContent = "0";
    grid.innerHTML = `
      <div class="no-results">
        <h3>No encontramos propiedades</h3>
        <p>Pruebe otra zona, tipo o rango de precio.</p>
      </div>
    `;
    if (listObserver) listObserver.disconnect();
    const moreBtnEmpty = document.getElementById("btnVerMas");
    if (moreBtnEmpty) moreBtnEmpty.hidden = true;
    renderRecientes();
    return;
  }

  grid.innerHTML = visible.map((p) => {
    const fotos = p.imagenes || [];
    const portada = fotos[0] || fotoPorTipo(p.tipo);
    const cardMods = [
      p.destacado ? "is-destacada" : "",
      p.bajoPrecio ? "is-baja" : "",
      p.nuevo ? "is-nueva" : ""
    ].filter(Boolean).join(" ");
    return `
      <article class="property-card ${cardMods}" data-id="${esc(p.id)}">
        <div class="image">
          <a class="card-cover" href="${esc(detalleHref(p.id))}">
            <img src="${esc(publicImage(portada))}" alt="${esc(p.titulo)}" loading="lazy" decoding="async">
            <div class="badges">
              ${htmlPublicBadges(p)}
            </div>
            <span class="barrio-pill">${esc(p.barrio)}</span>
            ${fotos.length > 1 ? `<div class="gallery-count">${fotos.length} fotos</div>` : ""}
          </a>
          ${htmlLikeButton(p)}
        </div>
        <div class="body">
          <div class="type-location">${esc(tipoLabel(p.tipo))}</div>
          <h3><a href="${esc(detalleHref(p.id))}">${esc(p.titulo)}</a></h3>
          <div class="location">${esc(zonaPublicaTexto(p.barrio))}</div>
          ${htmlPrecioVitrina(p)}
          ${p.expensas ? `<div class="expenses">+ Expensas: ${esc(money(p.expensas))}</div>` : ""}
          <div class="specs">
            <span>${p.cubierta ? p.cubierta + " m² cub." : p.superficie + " m²"}</span>
            ${p.tipo === "terreno" ? `<span>${p.superficie} m² de lote</span>` : ""}
            ${p.dormitorios > 0 ? `<span>${p.dormitorios} dorm.</span>` : ""}
            ${p.vista ? `<span>${esc(p.vista)}</span>` : ""}
            ${p.calefaccion ? `<span>${esc(p.calefaccion)}</span>` : ""}
          </div>
          <a class="ver-detalle" href="${esc(detalleHref(p.id))}">Ver detalle</a>
        </div>
      </article>
    `;
  }).join("") + (shownCount < filtered.length ? '<div id="listSentinel" class="list-sentinel" aria-hidden="true"></div>' : "");
  watchListEnd();
  renderNovedadChips();
  renderRecientes();
  renderBajas();
}

function zonaPublicaTexto(barrio) {
  const z = typeof zonaPorBarrio === "function" ? zonaPorBarrio(barrio) : null;
  const cerca = z && typeof zonaCercaNombre === "function" ? zonaCercaNombre(z) : "";
  return cerca ? "Zona " + barrio + " · cerca de " + cerca : "Zona " + barrio;
}

function htmlNovedadCard(p) {
  const portada = (p.imagenes || [])[0] || fotoPorTipo(p.tipo);
  return `
      <a class="recientes-card${p.nuevo ? " is-nueva" : ""}${p.bajoPrecio ? " is-baja" : ""}" href="${esc(detalleHref(p.id))}">
        <span class="recientes-card-media">
          <img src="${esc(publicImage(portada))}" alt="" loading="lazy" decoding="async">
        </span>
        <strong>${esc(p.titulo)}</strong>
        ${htmlPrecioVitrina(p)}
        <span class="recientes-card-zona">${esc(zonaPublicaTexto(p.barrio))}</span>
      </a>`;
}

function renderNovedadChips() {
  const host = document.getElementById("novedadChips");
  if (!host) return;
  const visibles = properties.filter((p) => p.status === "disponible" || p.status === "reservada");
  const nNuevo = visibles.filter((p) => p.nuevo).length;
  const nBaja = visibles.filter((p) => p.bajoPrecio).length;
  if (!nNuevo && !nBaja) {
    host.innerHTML = "";
    host.hidden = true;
    return;
  }
  host.hidden = false;
  host.innerHTML = `
    ${nNuevo ? `<button type="button" class="${currentFilters.novedad === "nuevo" ? "is-on" : ""}" data-novedad="nuevo">Recién publicadas</button>` : ""}
    ${nBaja ? `<button type="button" class="${currentFilters.novedad === "baja" ? "is-on" : ""}" data-novedad="baja">Bajaron de precio</button>` : ""}
  `;
}

function renderRecientes() {
  const host = document.getElementById("recientes");
  const track = document.getElementById("recientesTrack");
  if (!host || !track) return;
  const visibles = properties.filter((p) => p.status === "disponible" || p.status === "reservada");
  const list = recientesDe(visibles, 4);
  host.hidden = list.length === 0;
  track.innerHTML = list.map(htmlNovedadCard).join("");
}

function renderBajas() {
  const host = document.getElementById("bajas");
  const track = document.getElementById("bajasTrack");
  if (!host || !track) return;
  const visibles = properties.filter((p) => p.status === "disponible" || p.status === "reservada");
  const list = typeof bajasDe === "function" ? bajasDe(visibles, 4) : visibles.filter((p) => p.bajoPrecio).slice(0, 4);
  host.hidden = list.length === 0;
  track.innerHTML = list.map(htmlNovedadCard).join("");
}

function showFichaToast(message) {
  document.querySelector(".ficha-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "ficha-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2800);
}

function openModal(id) {
  const found = properties.find((p) => p.id === id);
  if (!found) return;

  const isNewOpen = countedViewId !== id;
  currentProperty = found;
  if (isNewOpen) currentImageIndex = 0;

  if (isNewOpen) {
    countedViewId = id;
    recordListingView(properties, id);
  }

  updateModalImage();

  const p = currentProperty;
  const amenities = p.amenities || [];
  const esDepto = p.tipo === "departamento";

  document.getElementById("modalContent").innerHTML = `
    <div class="badges">
      ${htmlPublicBadges(p)}
    </div>
    ${htmlLikeButton(p)}
    <h2 id="modalTitle">${esc(p.titulo)}</h2>
    <div class="location">${esc(zonaPublicaTexto(p.barrio))}</div>

    <div class="price-box">
      ${htmlPrecioVitrina(p)}
      ${p.expensas ? `<div class="expenses">+ Expensas: ${esc(money(p.expensas))}</div>` : ""}
    </div>

    <div class="modal-specs">
      <div class="spec">
        <div class="value">${p.cubierta || "—"}</div>
        <div class="label">m² cubiertos</div>
      </div>
      <div class="spec">
        <div class="value">${p.superficie}</div>
        <div class="label">m² de lote</div>
      </div>
      <div class="spec">
        <div class="value">${p.dormitorios || "—"}</div>
        <div class="label">Dormitorios</div>
      </div>
      ${esDepto && p.piso ? `
      <div class="spec">
        <div class="value">${esc(p.piso)}</div>
        <div class="label">Piso</div>
      </div>` : ""}
    </div>

    <dl class="ficha-facts">
      <div><dt>Vista</dt><dd>${esc(p.vista || "—")}</dd></div>
      <div><dt>Calefacción</dt><dd>${esc(p.calefaccion || "—")}</dd></div>
      <div><dt>Servicios</dt><dd>${esc(p.servicios || "—")}</dd></div>
    </dl>

    <div class="modal-description">
      <h4>Descripción</h4>
      <p>${esc(p.descripcion)}</p>
    </div>

    <div class="ficha-mapa">
      <h4>Zona aproximada</h4>
      <p>El pin marca el barrio, no la parcela.</p>
      <div id="mapaFicha" class="mapa"></div>
    </div>

    ${amenities.length ? `
      <div class="modal-amenities">
        <h4>Amenities y características</h4>
        <div class="amenities-list">
          ${amenities.map((a) => `<span class="amenity-tag">${amenityIcon(a)} ${esc(amenityLabel(a))}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <div class="modal-contact">
      <div>
        <h4>¿Le interesa esta propiedad?</h4>
        <p>Escríbanos por WhatsApp. Es el camino más directo.</p>
      </div>
      <div class="btns">
        <a class="btn-ficha-wa" data-consulta="wa" href="${esc(propertyWaUrl(p))}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>
      <form class="modal-consulta" id="modalConsulta" novalidate>
        <div class="nh-field">
          <label for="modal-nombre">Nombre</label>
          <input id="modal-nombre" name="nombre" autocomplete="name">
        </div>
        <div class="nh-field">
          <label for="modal-email">Correo</label>
          <input id="modal-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="nh-field">
          <label for="modal-tel">Teléfono</label>
          <input id="modal-tel" name="telefono" type="tel" autocomplete="tel">
        </div>
        <div class="nh-field">
          <label for="modal-msg">Mensaje</label>
          <textarea id="modal-msg" name="mensaje" required rows="4"></textarea>
        </div>
        <button type="submit">Enviar consulta</button>
      </form>
    </div>
  `;

  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
  pintarMapaFicha(p);
}

function closeModal() {
  if (mapaFicha) {
    mapaFicha.remove();
    mapaFicha = null;
  }
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
  currentProperty = null;
  countedViewId = null;
}

function updateModalImage() {
  if (!currentProperty) return;
  const imgs = currentProperty.imagenes && currentProperty.imagenes.length
    ? currentProperty.imagenes
    : [fotoPorTipo(currentProperty.tipo)];
  const safeIndex = ((currentImageIndex % imgs.length) + imgs.length) % imgs.length;
  currentImageIndex = safeIndex;
  const img = document.getElementById("modalImage");
  img.src = publicImage(imgs[safeIndex]);
  img.alt = currentProperty.titulo;
  document.getElementById("imageCounter").textContent = `${safeIndex + 1} / ${imgs.length}`;
  document.getElementById("modalThumbs").innerHTML = imgs.map((src, i) => `
    <button type="button" class="${i === safeIndex ? "active" : ""}" data-thumb="${i}">
      <img src="${esc(publicImage(src))}" alt="" loading="lazy" decoding="async">
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

document.getElementById("btnLimpiar")?.addEventListener("click", clearFilters);
document.getElementById("btnVerMas")?.addEventListener("click", loadMoreListings);
document.getElementById("zoneAll")?.addEventListener("click", () => selectZona("", true));
["filterOperacion", "filterTipo", "filterBarrio", "filterAmbientes", "filterPrecio", "sortSelect"].forEach((id) => {
  document.getElementById(id).addEventListener("change", applyFilters);
});

document.getElementById("novedadChips")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-novedad]");
  if (!btn) return;
  currentFilters.novedad = currentFilters.novedad === btn.dataset.novedad ? "" : btn.dataset.novedad;
  resetListingWindow();
  renderNovedadChips();
  renderProperties();
});

document.getElementById("zoneCards")?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-zona]");
  if (!card) return;
  selectZona(card.dataset.zona, true);
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
    toggleListingLike(properties, fav.dataset.fav);
    favorites.clear();
    loadFavoritoIds().forEach((id) => favorites.add(id));
    const next = properties.find((p) => p.id === fav.dataset.fav);
    if (currentProperty && next && currentProperty.id === next.id) currentProperty = next;
    renderProperties();
    if (document.getElementById("modal")?.classList.contains("open") && currentProperty) openModal(currentProperty.id);
    return;
  }
  if (event.target.closest("a")) return;
  const card = event.target.closest(".property-card");
  if (card) window.location.href = detalleHref(card.dataset.id);
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

document.getElementById("modalContent").addEventListener("click", (event) => {
  const fav = event.target.closest("[data-fav]");
  if (fav && currentProperty) {
    toggleListingLike(properties, fav.dataset.fav);
    favorites.clear();
    loadFavoritoIds().forEach((id) => favorites.add(id));
    const next = properties.find((p) => p.id === fav.dataset.fav);
    if (next) currentProperty = next;
    openModal(currentProperty.id);
    return;
  }
  const action = event.target.closest("[data-consulta]");
  if (!action || !currentProperty) return;
  recordListingConsulta(properties, currentProperty.id);
});

document.getElementById("modalContent").addEventListener("submit", (event) => {
  const form = event.target.closest("#modalConsulta");
  if (!form || !currentProperty) return;
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();
  const mensaje = String(data.get("mensaje") || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFichaToast("Ingrese un correo válido.");
    return;
  }
  if (!mensaje) {
    showFichaToast("El mensaje no puede estar vacío.");
    return;
  }
  recordListingConsulta(properties, currentProperty.id);
  form.reset();
  showFichaToast("Consulta enviada (ejemplo)");
});

function wireLugares() {
  const track = document.getElementById("lugarTrack");
  const viewport = document.getElementById("lugarViewport");
  const dots = document.getElementById("lugarDots");
  if (!track || !viewport || !dots) return;
  const slides = [...track.children];
  let index = 0;
  let startX = 0;
  let dragging = false;

  slides.forEach((slide, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Ir a " + (slide.querySelector("h3")?.textContent || "lugar"));
    btn.addEventListener("click", () => go(i));
    dots.appendChild(btn);
  });

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = "translateX(" + (-index * 100) + "%)";
    dots.querySelectorAll("button").forEach((btn, i) => {
      btn.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  document.getElementById("lugarPrev")?.addEventListener("click", () => go(index - 1));
  document.getElementById("lugarNext")?.addEventListener("click", () => go(index + 1));
  track.addEventListener("click", (event) => {
    const link = event.target.closest("[data-zona]");
    if (!link) return;
    selectZona(link.dataset.zona, true);
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    dragging = true;
    startX = event.clientX;
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!dragging) return;
    dragging = false;
    const delta = event.clientX - startX;
    if (delta > 40) go(index - 1);
    else if (delta < -40) go(index + 1);
  });
  viewport.addEventListener("pointercancel", () => { dragging = false; });

  go(0);
}

function wireNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Cerrar" : "Menú";
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menú";
    }
  });
}

function ajustarContacto() {
  const root = document.getElementById("contacto");
  if (!root) return;
  const tel = root.querySelector('input[name="telefono"]');
  if (tel) tel.placeholder = "294 442-0000";
  const email = root.querySelector('input[name="email"]');
  if (email) email.placeholder = "su-correo@ejemplo.com";
  const nombre = root.querySelector('input[name="nombre"]');
  if (nombre) nombre.placeholder = "Su nombre";
  const msg = root.querySelector("textarea");
  if (msg) msg.placeholder = "Cuéntenos qué propiedad le interesa";
  const lead = root.querySelector(".demo-contacto-lead");
  if (lead) lead.textContent = "Escríbanos por WhatsApp o deje su consulta. El mensaje no sale a un servidor.";
  const labels = root.querySelectorAll("form label");
  if (labels[0]) labels[0].childNodes[0].textContent = "Su nombre";
}

applyVitrinaPage();
wireNav();
wireLugares();
populateBarrios();
aplicarZonaDesdeUrl();
renderProperties();
markFilterFields();
watchMapaComarca();

function aplicarZonaDesdeUrl() {
  const zona = new URLSearchParams(location.search).get("zona");
  if (!zona) return;
  const select = document.getElementById("filterBarrio");
  if (!select || ![...select.options].some((opt) => opt.value === zona)) return;
  select.value = zona;
  applyFilters();
  if (location.hash === "#propiedades") {
    window.setTimeout(() => {
      document.getElementById("propiedades")?.scrollIntoView({ block: "start" });
    }, 40);
  }
}
window.addEventListener("load", () => {
  ajustarContacto();
  applyVitrinaPage();
});
