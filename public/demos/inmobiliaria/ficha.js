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
    btn.classList.toggle("active", Number(btn.dataset.thumb) === fotoIndex);
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
    || (typeof ZONAS !== "undefined" ? ZONAS.find((item) => item.id === p.barrio) : null)
    || { lat: -41.1335, lng: -71.3103, nombre: p.barrio };
  mapaFicha = L.map(el, { scrollWheelZoom: false }).setView([z.lat, z.lng], p.barrio === "El Bolsón" ? 12 : 13);
  if (typeof tilesOsm === "function") tilesOsm(mapaFicha);
  else L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(mapaFicha);
  L.marker([z.lat, z.lng]).addTo(mapaFicha).bindPopup(esc(p.barrio) + " · zona aproximada");
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 120);
  window.setTimeout(() => mapaFicha && mapaFicha.invalidateSize(), 420);
}

function renderVacia() {
  const root = document.getElementById("fichaRoot");
  document.title = "Propiedad no encontrada — Estudio Nahuel Huapi";
  root.innerHTML = `
    <p class="ficha-back"><a href="${esc(listadoHref(zonaVolver))}">← Volver al listado</a></p>
    <article class="ficha-sheet">
      <div class="modal-content">
        <h2>No encontramos esa propiedad</h2>
        <p>El enlace no coincide con ninguna ficha de la cartera.</p>
        <p><a href="${esc(listadoHref(zonaVolver))}">Volver al listado</a></p>
      </div>
    </article>
  `;
}

function renderFicha(p) {
  const root = document.getElementById("fichaRoot");
  fotos = fotosDe(p);
  fotoIndex = 0;
  const esDepto = p.tipo === "departamento";
  const amenities = p.amenities || [];
  const volver = listadoHref(zonaVolver);
  document.title = p.titulo;

  root.innerHTML = `
    <p class="ficha-back"><a href="${esc(volver)}">← Volver al listado</a></p>
    <article class="ficha-sheet">
      <div class="modal-gallery">
        <img id="fichaFoto" src="${esc(fotos[0])}" alt="${esc(p.titulo)}">
        ${fotos.length > 1 ? `
          <button class="nav-btn prev" type="button" id="prevImage" aria-label="Foto anterior">‹</button>
          <button class="nav-btn next" type="button" id="nextImage" aria-label="Foto siguiente">›</button>
          <div class="counter" id="fichaCounter">1 / ${fotos.length}</div>
        ` : `<div class="counter" id="fichaCounter">1 / 1</div>`}
      </div>
      ${fotos.length > 1 ? `
        <div class="modal-thumbs" id="fichaThumbs">
          ${fotos.map((src, i) => `<button type="button" data-thumb="${i}" class="${i === 0 ? "active" : ""}"><img src="${esc(src)}" alt=""></button>`).join("")}
        </div>
      ` : ""}
      <div class="modal-content">
        <div class="badges">
          <span class="badge ${esc(p.operacion)}">${esc(opLabel(p.operacion))}</span>
          ${p.destacado ? '<span class="badge destacado">Destacado</span>' : ""}
          ${p.nuevo ? '<span class="badge nuevo">Nuevo</span>' : ""}
          ${p.status === "reservada" ? '<span class="badge reservada">Reservada</span>' : ""}
        </div>
        <h1>${esc(p.titulo)}</h1>
        <div class="location">Zona ${esc(p.barrio)}</div>

        <div class="price-box">
          <div class="price">${formatPrice(p.precio, p.operacion)}</div>
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
          <div class="spec">
            <div class="value">${p.banos || "—"}</div>
            <div class="label">Baños</div>
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
          <h2>Descripción</h2>
          <p>${esc(p.descripcion)}</p>
        </div>

        <div class="ficha-mapa">
          <h2>Zona aproximada</h2>
          <p>El pin marca la zona, no la parcela.</p>
          <div id="mapaFicha" class="mapa"></div>
        </div>

        ${amenities.length ? `
          <div class="modal-amenities">
            <h2>Características</h2>
            <div class="amenities-list">
              ${amenities.map((a) => `<span class="amenity-tag">${amenityIcon(a)} ${esc(amenityLabel(a))}</span>`).join("")}
            </div>
          </div>
        ` : ""}

        <div class="modal-contact">
          <div>
            <h2>¿Le interesa esta propiedad?</h2>
            <p>Escríbanos por WhatsApp. Es el camino más directo.</p>
          </div>
          <div class="btns">
            <a class="btn-ficha-wa" href="${esc(propertyWaUrl(p))}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
          </div>
        </div>
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
  });
  pintarMapaFicha(p);
}

function formatPrice(price, operacion) {
  if (operacion === "venta") {
    return "USD " + Number(price).toLocaleString("es-AR");
  }
  return "$ " + Number(price).toLocaleString("es-AR") + "/mes";
}

function zonaPorBarrio(barrio) {
  if (typeof ZONAS === "undefined") return null;
  return ZONAS.find((z) => z.id === barrio) || null;
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
