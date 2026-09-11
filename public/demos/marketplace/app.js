let currentFilter = "all";
let priceFilter = "all";
let envioFilter = "all";
let searchTerm = "";
let sortMode = "relevancia";
let soloFavoritos = false;
let cart = JSON.parse(localStorage.getItem("marketplace-cart") || "[]");

function getCatalog() {
  resetCaches();
  return loadProductos();
}

function saveCart() {
  localStorage.setItem("marketplace-cart", JSON.stringify(cart));
  renderCartBadge();
}

function renderCartBadge() {
  document.getElementById("cartBadge").textContent = cart.reduce((sum, c) => sum + (c.cantidad || 1), 0);
}

function addToCart(productId) {
  const product = getCatalog().find((p) => p.id === productId);
  if (!product || product.stock < 1 || product.status !== "activo") {
    showToast("Este producto no tiene stock");
    return;
  }
  const existing = cart.find((c) => c.id === productId);
  if (existing) {
    if (existing.cantidad >= product.stock) {
      showToast("No hay más stock disponible");
      return;
    }
    existing.cantidad += 1;
  } else {
    cart.push({
      id: product.id,
      titulo: product.titulo,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1
    });
  }
  saveCart();
  showToast("Agregado a la bolsa");
  closeModal();
}

function removeFromCart(productId) {
  cart = cart.filter((c) => c.id !== productId);
  saveCart();
  renderCartDrawer();
}

function cartTotal() {
  return cart.reduce((sum, c) => sum + c.precio * (c.cantidad || 1), 0);
}

function renderCartDrawer() {
  const itemsEl = document.getElementById("cartItems");
  const footerEl = document.getElementById("cartFooter");

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty">Tu bolsa está vacía.</p>';
    footerEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = cart.map((c) => `
    <div class="cart-item">
      <img src="${esc(c.imagen)}" alt="${esc(c.titulo)}">
      <div>
        <p class="title">${esc(c.titulo)}</p>
        <p class="price">${c.cantidad || 1} × ${money(c.precio)}</p>
      </div>
      <button type="button" class="remove" data-remove="${esc(c.id)}" aria-label="Quitar">×</button>
    </div>
  `).join("");

  footerEl.innerHTML = `
    <div class="total"><span>Total</span><span>${money(cartTotal())}</span></div>
    <button type="button" class="btn coral" id="goCheckout" style="width:100%;">Ir al checkout</button>
  `;

  itemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
  });
  document.getElementById("goCheckout")?.addEventListener("click", mostrarCheckout);
}

function openCart() {
  renderCartDrawer();
  document.getElementById("cartOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

function renderPreguntasModal(productoId) {
  const qs = preguntasDeProducto(productoId);
  if (!qs.length) return `<p style="font-size:13px;color:var(--muted);">Nadie preguntó todavía. Sé el primero.</p>`;
  return qs.map((q) => `
    <div class="qa-item">
      <div><strong>${esc(q.nombreUsuario)}</strong> preguntó: ${esc(q.texto)}</div>
      ${q.respuesta ? `<div class="a"><strong>${esc(q.respuesta)}</strong></div>` : `<div class="meta">El vendedor todavía no respondió</div>`}
      <div class="meta">${esc(formatFecha(q.fecha))}</div>
    </div>
  `).join("");
}

function openModal(productId) {
  const product = getCatalog().find((p) => p.id === productId);
  if (!product) return;

  product.visitas = (product.visitas || 0) + 1;
  saveProductos();

  const inCart = cart.find((c) => c.id === productId);
  const sinStock = product.stock < 1 || product.status !== "activo";
  const fotos = product.imagenes && product.imagenes.length ? product.imagenes : [product.imagen];
  const fav = esFavorito(product.id);
  const v = product.vendedor || {};

  document.getElementById("productModal").innerHTML = `
    <header>
      <h3>Ficha</h3>
      <button type="button" class="modal-close" id="modalClose">×</button>
    </header>
    <div class="ficha-grid">
      <div>
        <img class="gallery-main" id="galleryMain" src="${esc(fotos[0])}" alt="${esc(product.titulo)}">
        <div class="thumbs">
          ${fotos.map((src, i) => `
            <button type="button" class="${i === 0 ? "on" : ""}" data-src="${esc(src)}">
              <img src="${esc(src)}" alt="">
            </button>
          `).join("")}
        </div>
      </div>
      <div class="ficha-info">
        <div style="font-size:12px;color:var(--muted);">${esc(catLabel(product.categoria))} · ${product.vendidos || 0} vendidos${product.rating ? ` · ★ ${product.rating}` : ""}</div>
        <h2>${esc(product.titulo)}</h2>
        <div class="price">${money(product.precio)}</div>
        <div class="cuotas" style="color:var(--verde);font-size:14px;">${esc(product.cuotas)}</div>
        <p style="font-size:14px;color:var(--muted);margin:12px 0;">${esc(product.descripcion || "Publicación de ejemplo en Feria.")}</p>
        <p style="font-size:13px;">${product.envioGratis ? '<span class="tag activo">Envío incluido</span>' : '<span class="tag pendiente">Envío a cargo</span>'} · ${esc(product.ubicacion)}</p>
        <p style="font-size:13px;color:var(--muted);">Stock: <strong>${product.stock}</strong> · Código ${esc(product.mla)}</p>
        <div class="seller-card">
          <div>
            <strong>${esc(v.nombre || "Vendedor Feria")}</strong>
            <span>${esc(v.ciudad || product.ubicacion)}</span>
          </div>
          <div style="text-align:right;color:var(--muted);">
            ${v.reputacion ? `<strong>★ ${esc(v.reputacion)}</strong>` : ""}
            <span>${v.ventas || 0} ventas</span>
          </div>
        </div>
        <div class="ficha-actions">
          <button type="button" class="btn" id="addCartBtn" ${sinStock ? "disabled" : ""}>
            ${sinStock ? "Sin stock" : inCart ? "Sumar otra unidad" : "Agregar a la bolsa"}
          </button>
          <button type="button" class="btn ghost" id="favDetailBtn">${fav ? "Quitar de favoritos" : "Guardar"}</button>
        </div>
      </div>
    </div>
    <div class="qa-section">
      <h3>Preguntas al vendedor</h3>
      <div id="qaList">${renderPreguntasModal(product.id)}</div>
      <form class="qa-form" id="qaForm">
        <input name="nombre" required placeholder="Tu nombre" maxlength="40">
        <textarea name="texto" required placeholder="Preguntale al vendedor…" rows="2" maxlength="280"></textarea>
        <button type="submit">Preguntar</button>
      </form>
    </div>
  `;

  document.getElementById("modalOverlay").classList.add("show");
  document.body.style.overflow = "hidden";

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("addCartBtn")?.addEventListener("click", () => addToCart(product.id));
  document.getElementById("favDetailBtn")?.addEventListener("click", () => {
    toggleFavorito(product.id);
    openModal(product.id);
    renderCatalog();
  });
  document.querySelectorAll(".thumbs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("galleryMain").src = btn.dataset.src;
      document.querySelectorAll(".thumbs button").forEach((b) => b.classList.toggle("on", b === btn));
    });
  });
  document.getElementById("qaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const ok = crearPregunta(product.id, String(data.get("texto") || "").trim(), String(data.get("nombre") || "").trim());
    if (!ok) {
      showToast("No se pudo enviar la pregunta");
      return;
    }
    showToast("Pregunta enviada al vendedor");
    openModal(product.id);
  });
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

function mostrarCheckout() {
  if (!cart.length) return;
  closeCart();
  document.getElementById("checkoutResumen").innerHTML = `
    ${cart.map((c) => `<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;"><span>${esc(c.titulo)} × ${c.cantidad || 1}</span><strong>${money(c.precio * (c.cantidad || 1))}</strong></div>`).join("")}
    <div style="display:flex;justify-content:space-between;margin:12px 0;font-weight:700;"><span>Total</span><span>${money(cartTotal())}</span></div>
  `;
  document.getElementById("checkoutOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function cerrarCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

function procesarCompra(event) {
  event.preventDefault();
  if (!cart.length) return;
  const nombre = document.getElementById("checkNombre").value.trim();
  const email = document.getElementById("checkEmail").value.trim();
  const direccion = document.getElementById("checkDireccion").value.trim();
  getCatalog();
  const venta = crearVenta(cart, nombre, email, direccion);
  if (!venta) {
    showToast("No se pudo completar: revisá el stock");
    renderCatalog();
    return;
  }
  const copia = cart.slice();
  cart = [];
  saveCart();
  cerrarCheckout();
  document.getElementById("successDetails").innerHTML = `
    <p style="margin:0 0 8px;"><strong>Pedido:</strong> ${esc(venta.id.slice(0, 8))}</p>
    ${copia.map((c) => `<p style="margin:0 0 4px;font-size:13px;">${esc(c.titulo)} × ${c.cantidad || 1}</p>`).join("")}
    <p style="margin:8px 0 0;"><strong>Total:</strong> ${money(venta.total)}</p>
    <p style="margin:4px 0 0;font-size:12px;color:var(--muted);">Pagado con Billetera Feria (ejemplo)</p>
  `;
  document.getElementById("successOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
  renderCatalog();
}

function mostrarCompras() {
  resetCaches();
  const list = loadVentas();
  const el = document.getElementById("comprasList");
  if (!list.length) {
    el.innerHTML = '<p style="color:var(--muted);">Todavía no hay compras en este ejemplo.</p>';
  } else {
    el.innerHTML = list.map((v) => `
      <div class="compra-card">
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <strong>${esc(formatFecha(v.fecha))}</strong>
          <span class="tag ${esc(v.envio.estado)}">${esc(envioLabel(v.envio.estado))}</span>
        </div>
        <p style="margin:8px 0;font-size:13px;">${v.items.map((i) => esc(i.titulo)).join(", ")}</p>
        <p style="margin:0;font-weight:700;">${money(v.total)}</p>
        ${v.envio.tracking ? `<p style="margin:6px 0 0;font-size:12px;">Tracking: ${esc(v.envio.tracking)}</p>` : ""}
        ${v.calificacion ? `<p style="margin:8px 0 0;">★ ${v.calificacion.rating} · ${esc(v.calificacion.comentario || "")}</p>` : ""}
        ${v.envio.estado === "entregado" && !v.calificacion ? `
          <form class="qa-form" data-calificar="${esc(v.id)}" style="margin-top:12px;">
            <label style="font-size:13px;">Calificá tu compra</label>
            <select name="rating" required>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
            <textarea name="comentario" placeholder="Comentario (opcional)" rows="2"></textarea>
            <button type="submit">Enviar calificación</button>
          </form>
        ` : ""}
      </div>
    `).join("");
    el.querySelectorAll("[data-calificar]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const ok = calificarVenta(form.dataset.calificar, Number(data.get("rating")), String(data.get("comentario") || "").trim());
        if (!ok) {
          showToast("No se pudo calificar");
          return;
        }
        showToast("Gracias por la calificación");
        mostrarCompras();
      });
    });
  }
  document.getElementById("comprasOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function cerrarCompras() {
  document.getElementById("comprasOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function inPriceRange(precio) {
  if (priceFilter === "all") return true;
  if (priceFilter === "0-150000") return precio <= 150000;
  if (priceFilter === "150000-500000") return precio >= 150000 && precio <= 500000;
  if (priceFilter === "500000-") return precio > 500000;
  return true;
}

function filteredCatalog() {
  let list = getCatalog().filter((p) => p.status === "activo");
  if (currentFilter !== "all") list = list.filter((p) => p.categoria === currentFilter);
  if (envioFilter === "gratis") list = list.filter((p) => p.envioGratis);
  if (envioFilter === "pago") list = list.filter((p) => !p.envioGratis);
  list = list.filter((p) => inPriceRange(p.precio));
  if (soloFavoritos) {
    const favs = loadFavoritos();
    list = list.filter((p) => favs.includes(p.id));
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    list = list.filter((p) =>
      p.titulo.toLowerCase().includes(term) ||
      catLabel(p.categoria).toLowerCase().includes(term) ||
      String(p.vendedor?.nombre || "").toLowerCase().includes(term) ||
      String(p.descripcion || "").toLowerCase().includes(term)
    );
  }
  if (sortMode === "precio-asc") list = list.slice().sort((a, b) => a.precio - b.precio);
  else if (sortMode === "precio-desc") list = list.slice().sort((a, b) => b.precio - a.precio);
  else if (sortMode === "nuevo") list = list.slice().reverse();
  else list = list.slice().sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0));
  return list;
}

function renderCatalog() {
  const filtered = filteredCatalog();
  document.getElementById("resultsCount").textContent = `${filtered.length} publicación${filtered.length !== 1 ? "es" : ""}`;

  if (filtered.length === 0) {
    document.getElementById("catalog").innerHTML = '<div class="empty">No hay publicaciones con estos filtros.</div>';
    return;
  }

  document.getElementById("catalog").innerHTML = filtered.map((p) => `
    <article class="catalog-card" data-open="${esc(p.id)}">
      <button type="button" class="fav-btn ${esFavorito(p.id) ? "on" : ""}" data-fav="${esc(p.id)}" aria-label="Favorito">${esFavorito(p.id) ? "♥" : "♡"}</button>
      <div class="img"><img src="${esc(p.imagen)}" alt="${esc(p.titulo)}"></div>
      <div class="body">
        <div class="price">${money(p.precio)}</div>
        <div class="cuotas">${esc(p.cuotas)}</div>
        <div class="title">${esc(p.titulo)}</div>
        <div class="${p.envioGratis ? "envio" : "envio pago"}">${p.envioGratis ? "Envío incluido" : "Envío a cargo"}</div>
        <div class="meta-row">
          <span>${esc(p.vendedor?.nombre || p.ubicacion)}</span>
          <span>${p.vendidos || 0} vendidos</span>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-open]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.open));
  });
  document.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorito(btn.dataset.fav);
      renderCatalog();
    });
  });
}

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim();
  renderCatalog();
});

document.getElementById("searchInput").addEventListener("input", () => {
  searchTerm = document.getElementById("searchInput").value.trim();
  renderCatalog();
});

document.querySelectorAll('input[name="cat"]').forEach((input) => {
  input.addEventListener("change", () => {
    currentFilter = input.value;
    renderCatalog();
  });
});
document.querySelectorAll('input[name="precio"]').forEach((input) => {
  input.addEventListener("change", () => {
    priceFilter = input.value;
    renderCatalog();
  });
});
document.querySelectorAll('input[name="envio"]').forEach((input) => {
  input.addEventListener("change", () => {
    envioFilter = input.value;
    renderCatalog();
  });
});
document.getElementById("soloFav").addEventListener("change", (e) => {
  soloFavoritos = e.target.checked;
  renderCatalog();
});
document.getElementById("sortSelect").addEventListener("change", (e) => {
  sortMode = e.target.value;
  renderCatalog();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeCart();
});

document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.getElementById("checkoutClose").addEventListener("click", cerrarCheckout);
document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) cerrarCheckout();
});
document.getElementById("checkoutForm").addEventListener("submit", procesarCompra);
document.getElementById("successClose").addEventListener("click", () => {
  document.getElementById("successOverlay").classList.remove("show");
  document.body.style.overflow = "";
});
document.getElementById("comprasClose").addEventListener("click", cerrarCompras);
document.getElementById("comprasOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) cerrarCompras();
});
document.getElementById("misComprasLink").addEventListener("click", mostrarCompras);
document.getElementById("favLink").addEventListener("click", () => {
  document.getElementById("soloFav").checked = true;
  soloFavoritos = true;
  renderCatalog();
  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("storage", (e) => {
  if (String(e.key || "").startsWith("marketplace-")) renderCatalog();
});

renderCatalog();
renderCartBadge();
