(function () {
  const catalog = document.getElementById("catalog");
  const overlay = document.getElementById("fichaOverlay");
  const fichaBody = document.getElementById("fichaBody");
  const fichaClose = document.getElementById("fichaClose");
  const cartDropdown = document.getElementById("cartDropdown");
  const checkoutOverlay = document.getElementById("checkoutOverlay");

  let currentFilter = "all";
  let stockFilter = "all";
  let searchTerm = "";

  function products() { return load(); }

  function filteredList() {
    const term = searchTerm.trim().toLowerCase();
    return products().filter((p) => {
      if (currentFilter !== "all" && p.categoria !== currentFilter) return false;
      if (stockFilter === "ok" && stockStatus(p) !== "stock") return false;
      if (stockFilter === "bajo" && stockStatus(p) === "stock") return false;
      if (!term) return true;
      const hay = `${p.nombre} ${p.descripcion || ""} ${p.codigo || ""} ${catLabel(p.categoria)}`.toLowerCase();
      return hay.includes(term);
    });
  }

  function stockLine(item) {
    const status = stockStatus(item);
    if (status === "agotado") return "Sin stock";
    if (status === "bajo") return `Últimas ${item.stock} ${item.unidad}`;
    return `Stock: ${item.stock} ${item.unidad}`;
  }

  function cardHtml(p) {
    const status = stockStatus(p);
    return `
      <article class="product-card" data-open="${esc(p.id)}" tabindex="0">
        <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">
        <div class="card-body">
          <p class="cat">${esc(catLabel(p.categoria))}</p>
          <h3>${esc(p.nombre)}</h3>
          <p class="price">${money(p.precio)} <small>/${esc(p.unidad)}</small></p>
          <p class="stock ${esc(status)}">${stockLine(p)}</p>
          <div class="tile-actions">
            <button type="button" class="ghost" data-add="${esc(p.id)}" ${status === "agotado" ? "disabled" : ""}>Agregar</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCats() {
    document.getElementById("catGrid").innerHTML = CATEGORIAS.map((c) => `
      <button type="button" class="cat-card" data-cat="${esc(c.id)}">
        <img src="${esc(c.imagen)}" alt="">
        <span>${esc(c.label)}</span>
      </button>
    `).join("");
    document.querySelectorAll("#catGrid [data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.cat;
        renderFilters();
        renderCatalog();
        document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderFilters() {
    const buttons = [{ id: "all", label: "Todos" }, ...CATEGORIAS];
    document.getElementById("filters").innerHTML = buttons.map((f) =>
      `<button type="button" data-filter="${f.id}" class="${currentFilter === f.id ? "active" : ""}">${esc(f.label)}</button>`
    ).join("");
    document.querySelectorAll("#filters button").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderFilters();
        renderCatalog();
      });
    });
    const stockBtns = [
      { id: "all", label: "Cualquier stock" },
      { id: "ok", label: "En stock" },
      { id: "bajo", label: "Bajo o sin stock" }
    ];
    document.getElementById("stockFilters").innerHTML = stockBtns.map((f) =>
      `<button type="button" data-stock="${f.id}" class="${stockFilter === f.id ? "active" : ""}">${esc(f.label)}</button>`
    ).join("");
    document.querySelectorAll("#stockFilters button").forEach((btn) => {
      btn.addEventListener("click", () => {
        stockFilter = btn.dataset.stock;
        renderFilters();
        renderCatalog();
      });
    });
  }

  function renderDestacados() {
    const list = products().filter((p) => p.destacado);
    document.getElementById("destacadosGrid").innerHTML = list.map(cardHtml).join("");
  }

  function renderCatalog() {
    const list = filteredList();
    document.getElementById("catalogCount").textContent = list.length
      ? `${list.length} material${list.length === 1 ? "" : "es"}`
      : "No hay materiales con ese filtro.";
    catalog.innerHTML = list.map(cardHtml).join("");
  }

  function openFicha(productId) {
    const item = products().find((p) => p.id === productId);
    if (!item) return;
    const status = stockStatus(item);
    const agotado = status === "agotado";
    const prov = proveedorNombre(item.proveedorId);
    fichaBody.innerHTML = `
      <img class="ficha-photo" src="${esc(item.imagen)}" alt="${esc(item.nombre)}">
      <div class="ficha-info">
        <p class="cat">${esc(catLabel(item.categoria))} · ${esc(item.codigo)}</p>
        <h2 id="fichaTitle">${esc(item.nombre)}</h2>
        <p class="ficha-desc">${esc(item.descripcion || "")}</p>
        <dl class="ficha-meta">
          <div><dt>Precio</dt><dd>${esc(money(item.precio))} / ${esc(item.unidad)}</dd></div>
          <div><dt>Stock</dt><dd>${stockLine(item)}</dd></div>
          <div><dt>Proveedor</dt><dd>${esc(prov)}</dd></div>
          <div><dt>Unidad</dt><dd>${esc(item.unidad)}</dd></div>
        </dl>
        <label class="qty-label">Cantidad
          <input id="fichaQty" type="number" min="1" max="${item.stock}" value="1" ${agotado ? "disabled" : ""}>
        </label>
        <div class="tile-actions">
          <button type="button" class="ghost" data-add="${esc(item.id)}" ${agotado ? "disabled" : ""}>Agregar al pedido</button>
          <button type="button" class="btn-panel" data-buy="${esc(item.id)}" ${agotado ? "disabled" : ""}>Pedir a obra</button>
        </div>
      </div>
    `;
    cartDropdown.hidden = true;
    overlay.hidden = false;
    document.body.classList.add("ficha-open");
  }

  function fichaQty() {
    return Number(document.getElementById("fichaQty")?.value || 1);
  }

  function closeFicha() {
    overlay.hidden = true;
    document.body.classList.remove("ficha-open");
  }

  function onAddClick(productId, qty) {
    const result = addToCart(productId, qty);
    showToast(result.ok ? "Agregado al pedido" : "Sin stock suficiente");
    renderCart();
    return result;
  }

  catalog.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add]");
    const tile = event.target.closest("[data-open]");
    if (addBtn) {
      event.stopPropagation();
      onAddClick(addBtn.dataset.add, 1);
      return;
    }
    if (tile) openFicha(tile.dataset.open);
  });

  document.getElementById("destacadosGrid").addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add]");
    const tile = event.target.closest("[data-open]");
    if (addBtn) {
      event.stopPropagation();
      onAddClick(addBtn.dataset.add, 1);
      return;
    }
    if (tile) openFicha(tile.dataset.open);
  });

  fichaBody.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add]");
    const buyBtn = event.target.closest("[data-buy]");
    if (addBtn) {
      const result = onAddClick(addBtn.dataset.add, fichaQty());
      if (result.ok) openFicha(addBtn.dataset.add);
      return;
    }
    if (buyBtn) {
      const result = addToCart(buyBtn.dataset.buy, fichaQty());
      if (!result.ok) { showToast("Sin stock suficiente"); return; }
      renderCart();
      closeFicha();
      openCheckout();
    }
  });

  fichaClose.addEventListener("click", closeFicha);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) closeFicha(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeFicha();
  });

  function renderCartBadge() {
    document.getElementById("cartBadge").textContent = String(cartCount());
  }

  function renderCartDropdown() {
    const cart = loadCart();
    if (!cart.length) {
      cartDropdown.innerHTML = `<h4>Pedido</h4><p class="cart-empty">Todavía no hay materiales.</p>`;
      return;
    }
    cartDropdown.innerHTML = `
      <h4>Pedido a obra</h4>
      <div class="cart-items">
        ${cart.map((c) => `
          <div class="cart-item">
            <img src="${esc(c.imagen)}" alt="">
            <div class="info">
              <p class="title">${esc(c.nombre)}</p>
              <p class="price">${money(c.precio * (c.cantidad || 1))}</p>
              <div class="qty-ctrl">
                <button type="button" data-qty-minus="${esc(c.id)}">−</button>
                <span>${c.cantidad || 1}</span>
                <button type="button" data-qty-plus="${esc(c.id)}">+</button>
              </div>
            </div>
            <button type="button" class="remove" data-remove="${esc(c.id)}">×</button>
          </div>`).join("")}
      </div>
      <div class="cart-footer">
        <div class="total"><span>Total</span><strong>${money(cartTotal(cart))}</strong></div>
        <button type="button" class="btn-panel" id="openCheckout">Confirmar pedido</button>
      </div>`;
    cartDropdown.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => { removeFromCart(btn.dataset.remove); renderCart(); });
    });
    cartDropdown.querySelectorAll("[data-qty-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const line = loadCart().find((c) => c.id === btn.dataset.qtyPlus);
        const result = setCartQty(btn.dataset.qtyPlus, (line?.cantidad || 1) + 1);
        if (!result.ok) showToast("Sin stock suficiente");
        renderCart();
      });
    });
    cartDropdown.querySelectorAll("[data-qty-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const line = loadCart().find((c) => c.id === btn.dataset.qtyMinus);
        setCartQty(btn.dataset.qtyMinus, (line?.cantidad || 1) - 1);
        renderCart();
      });
    });
    cartDropdown.querySelector("#openCheckout")?.addEventListener("click", openCheckout);
  }

  function renderCart() {
    renderCartBadge();
    if (!cartDropdown.hidden) renderCartDropdown();
  }

  function openCheckout() {
    const cart = loadCart();
    if (!cart.length) { showToast("El pedido está vacío"); return; }
    document.getElementById("checkoutSummary").innerHTML = `
      ${cart.map((c) => `<p>${esc(c.nombre)} × ${c.cantidad || 1} — ${money(c.precio * (c.cantidad || 1))}</p>`).join("")}
      <p class="checkout-total">Total ${money(cartTotal(cart))}</p>`;
    cartDropdown.hidden = true;
    closeFicha();
    checkoutOverlay.hidden = false;
  }

  document.getElementById("cartBtn").addEventListener("click", (event) => {
    event.stopPropagation();
    cartDropdown.hidden = !cartDropdown.hidden;
    if (!cartDropdown.hidden) renderCartDropdown();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".cart-wrap")) cartDropdown.hidden = true;
  });
  document.getElementById("checkoutCancel").addEventListener("click", () => {
    checkoutOverlay.hidden = true;
  });
  document.getElementById("checkoutConfirm").addEventListener("click", () => {
    const nombre = document.getElementById("checkoutNombre").value.trim();
    const obra = document.getElementById("checkoutObra").value.trim();
    const tel = document.getElementById("checkoutTel").value.trim();
    const result = checkoutCart(nombre, obra, tel);
    if (!result.ok) {
      showToast(result.reason === "vacio" ? "El pedido está vacío" : `Sin stock: ${result.nombre || "un material"}`);
      return;
    }
    checkoutOverlay.hidden = true;
    document.getElementById("checkoutNombre").value = "";
    document.getElementById("checkoutObra").value = "";
    document.getElementById("checkoutTel").value = "";
    showToast("Pedido a obra · " + result.pedido.codigo);
    renderDestacados();
    renderCatalog();
    renderCart();
  });

  function applySearch(value) {
    searchTerm = value;
    document.getElementById("searchProd").value = value;
    document.getElementById("searchHero").value = value;
    renderCatalog();
  }

  document.getElementById("searchProd").addEventListener("input", (event) => {
    applySearch(event.target.value);
  });
  document.getElementById("heroSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applySearch(document.getElementById("searchHero").value);
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("searchHero").addEventListener("input", (event) => {
    applySearch(event.target.value);
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

  renderCats();
  renderFilters();
  renderDestacados();
  renderCatalog();
  renderCartBadge();
})();
