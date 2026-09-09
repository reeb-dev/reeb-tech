const params = new URLSearchParams(location.search);
const propertyId = params.get("id") || "";
const zonaVolver = params.get("zona") || "";

let fotos = [];
let fotoIndex = 0;
let mapaFicha = null;

function listadoHref(zona) {
  const q = new URLSearchParams();
  if (zona) q.set("zona", zona);
  const query = q.toString();
  return "index.html" + (query ? "?" + query : "") + "#propiedades";
}

function fotosDe(p) {
  const list = (p.imagenes || []).filter(Boolean);
  return list.length ? list : [fotoPorTipo(p.tipo)];
}

function pintarGaleria() {
  const img = document.getElementById("fichaFoto");
  const counter = document.getElementById("fichaCounter");
  if (!img || !fotos.length) return;
  img.src = fotos[fotoIndex];
  if (counter) counter.textContent = (fotoIndex + 1) + " / " + fotos.length;
  document.querySelectorAll("[data-thumb]").forEach((btn) => {
    const active = Number(btn.dataset.thumb) === fotoIndex;
    btn.classList.toggle("active", active);
    if (active) btn.scrollIntoView({ inline: "nearest", block: "nearest" });
  });
}

function pasoFoto(delta) {
  if (!fotos.length) return;
  fotoIndex = (fotoIndex + delta + fotos.length) % fotos.length;
  pintarGaleria();
}

function pintarMapaFicha(p) {
  const el = document.getElementById("mapaFicha");
  if (!el || typeof L === "undefined") return;
  if (mapaFicha) {
    mapaFicha.remove();
    mapaFicha = null;
  }
  const z = (typeof zonaPorBarrio === "function" ? zonaPorBarrio(p.barrio) : null)
    || { lat: -41.1335, lng: -71.3103, nombre: p.barrio };
  const zoom = (z.id === "El Bolsón" || z.parentId === "El Bolsón") ? 12 : 13;
  mapaFicha = L.map(el, { scrollWheelZoom: false }).setView([z.lat, z.lng], zoom);
  if (typeof tilesOsm === "function") tilesOsm(mapaFicha);
  else L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(mapaFicha);
  L.marker([z.lat, z.lng]).addTo(mapaFicha).bindPopup(esc(p.barrio) + " · zona aproximada");
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 120);
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 420);
}

function renderVacia() {
  const root = document.getElementById("fichaRoot");
  const volver = listadoHref(zonaVolver);
  document.title = "Propiedad no encontrada — Estudio Nahuel Huapi";
  root.innerHTML = `
    <p class="ficha-back"><a href="${esc(volver)}">← Volver al listado</a></p>
    <article class="ficha-sheet">
      <div class="ficha-vacia">
        <h1>No encontramos esa propiedad</h1>
        <p>El enlace no coincide con ninguna ficha de la cartera.</p>
        <p><a href="${esc(volver)}">Volver al listado</a></p>
      </div>
    </article>
  `;
}

function dato(etiqueta, valor, ancho) {
  return `
    <div class="ficha-dato${ancho ? " ancho" : ""}">
      <span>${esc(etiqueta)}</span>
      <strong>${esc(valor || "—")}</strong>
    </div>
  `;
}

function renderFicha(p) {
  const root = document.getElementById("fichaRoot");
  fotos = fotosDe(p);
  fotoIndex = 0;
  const esDepto = p.tipo === "departamento";
  const amenities = p.amenities || [];
  const volver = listadoHref(zonaVolver);
  const zona = typeof zonaPorBarrio === "function" ? zonaPorBarrio(p.barrio) : null;
  const cerca = zona && typeof zonaCercaNombre === "function" ? zonaCercaNombre(zona) : "";
  document.title = p.titulo;

  root.innerHTML = `
    <p class="ficha-back"><a href="${esc(volver)}">← Volver al listado</a></p>
    <article class="ficha-sheet">
      <section class="ficha-galeria" aria-label="Fotos de la propiedad">
        <div class="ficha-stage" id="fichaStage">
          <img id="fichaFoto" src="${esc(fotos[0])}" alt="${esc(p.titulo)}">
          ${fotos.length > 1 ? `
            <button class="ficha-arrow prev" type="button" id="prevImage" aria-label="Foto anterior">‹</button>
            <button class="ficha-arrow next" type="button" id="nextImage" aria-label="Foto siguiente">›</button>
          ` : ""}
          ${htmlLikeButton(p)}
          <div class="ficha-counter" id="fichaCounter">1 / ${fotos.length}</div>
        </div>
        ${fotos.length > 1 ? `
          <div class="ficha-thumbs" id="fichaThumbs">
            ${fotos.map((src, i) => `<button type="button" data-thumb="${i}" class="${i === 0 ? "active" : ""}" aria-label="Foto ${i + 1}"><img src="${esc(src)}" alt=""></button>`).join("")}
          </div>
        ` : ""}
      </section>
      <div class="ficha-layout">
        <div class="ficha-story">
          <div class="ficha-badges">
            ${htmlPublicBadges(p)}
          </div>
          <p class="ficha-zona">${esc(tipoLabel(p.tipo))} · Zona ${esc(p.barrio)}${cerca ? " · cerca de " + esc(cerca) : ""}</p>
          <h1 class="ficha-titulo">${esc(p.titulo)}</h1>
          ${htmlPrecioVitrina(p)}
          ${p.expensas ? `<p class="ficha-expensas">+ Expensas: ${esc(money(p.expensas))}</p>` : ""}

          <div class="ficha-datos">
            ${dato("m² cubiertos", p.cubierta ? String(p.cubierta) : "—")}
            ${dato("m² de lote", p.superficie ? String(p.superficie) : "—")}
            ${dato("Dormitorios", p.dormitorios ? String(p.dormitorios) : "—")}
            ${dato("Baños", p.banos || "—")}
            ${esDepto && p.piso ? dato("Piso", p.piso) : ""}
            ${dato("Vista", p.vista || "—", true)}
            ${dato("Calefacción", p.calefaccion || "—", true)}
            ${dato("Servicios", p.servicios || "—", true)}
          </div>

          <section class="ficha-bloque">
            <h2>Descripción</h2>
            <p class="ficha-descripcion">${esc(p.descripcion)}</p>
          </section>

          ${amenities.length ? `
            <section class="ficha-bloque">
              <h2>Características</h2>
              <div class="ficha-chips">
                ${amenities.map((a) => `<span class="amenity-tag">${amenityIcon(a)} ${esc(amenityLabel(a))}</span>`).join("")}
              </div>
            </section>
          ` : ""}

          <section class="ficha-bloque">
            <h2>Zona aproximada</h2>
            <p class="ficha-nota">El pin marca la zona, no la parcela.</p>
            <div id="mapaFicha" class="mapa ficha-mapa-box"></div>
          </section>
        </div>
        <aside class="ficha-aside">
          <p class="ficha-aside-kicker">Consulta</p>
          <h2>¿Le interesa esta propiedad?</h2>
          <p>Escríbanos por WhatsApp. Es el camino más directo.</p>
          ${htmlPrecioVitrina(p)}
          ${htmlLikeButton(p)}
          <a class="ficha-wa" href="${esc(propertyWaUrl(p))}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
          <a class="ficha-aside-back" href="${esc(volver)}">Volver al listado</a>
        </aside>
      </div>
    </article>
  `;

  document.getElementById("prevImage")?.addEventListener("click", () => pasoFoto(-1));
  document.getElementById("nextImage")?.addEventListener("click", () => pasoFoto(1));
  document.getElementById("fichaThumbs")?.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-thumb]");
    if (!thumb) return;
    fotoIndex = Number(thumb.dataset.thumb);
    pintarGaleria();
    thumb.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  });
  wireSwipe();
  pintarMapaFicha(p);
  document.querySelector(".ficha-wa")?.addEventListener("click", () => {
    recordListingConsulta(items, p.id);
  });
  document.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleListingLike(items, p.id);
      const idx = fotoIndex;
      renderFicha(p);
      fotoIndex = idx;
      pintarGaleria();
    });
  });
}

function wireSwipe() {
  const stage = document.getElementById("fichaStage");
  if (!stage || fotos.length < 2) return;
  let startX = 0;
  let tracking = false;
  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    tracking = true;
    startX = event.clientX;
  });
  stage.addEventListener("pointerup", (event) => {
    if (!tracking) return;
    tracking = false;
    const delta = event.clientX - startX;
    if (delta > 48) pasoFoto(-1);
    else if (delta < -48) pasoFoto(1);
  });
  stage.addEventListener("pointercancel", () => { tracking = false; });
}

function formatPrice(price, operacion) {
  if (operacion === "venta") {
    return "USD " + Number(price).toLocaleString("es-AR");
  }
  return "$ " + Number(price).toLocaleString("es-AR") + "/mes";
}

const items = load();
const found = items.find((p) => p.id === propertyId);
if (!found) {
  renderVacia();
} else {
  recordListingView(items, found.id);
  renderFicha(found);
}

document.addEventListener("keydown", (event) => {
  if (!fotos.length) return;
  if (event.key === "ArrowRight") pasoFoto(1);
  if (event.key === "ArrowLeft") pasoFoto(-1);
});

if (typeof applyVitrinaPage === "function") applyVitrinaPage();
