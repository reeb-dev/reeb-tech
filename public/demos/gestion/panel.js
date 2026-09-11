(function () {
  var KEY = "sistema-gestion-v3";
  var seed = window.GESTION_SEED || { items: [], clientes: [], movs: [] };
  var state = load();
  var view = "resumen";
  var selectedItem = null;
  var selectedCliente = null;
  var search = "";
  var stockFilter = "todos";
  var cliFilter = "todos";
  var mapFilter = "todas";
  var facFilter = "todas";
  var selectedFactura = null;
  var map = null;
  var markers = {};
  var mapReady = false;
  var pickerMap = null;
  var pickerMarker = null;
  var DEFAULT_LAT = -38.7183;
  var DEFAULT_LNG = -62.2663;

  function clone(x) {
    return JSON.parse(JSON.stringify(x));
  }
  function load() {
    try {
      var r = localStorage.getItem(KEY);
      if (r) return JSON.parse(r);
    } catch (e) {}
    return {
      items: clone(seed.items || []),
      clientes: clone(seed.clientes || []),
      movs: clone(seed.movs || []),
      facturas: clone(seed.facturas || []),
      caja: clone(seed.caja || [])
    };
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function money(n) {
    return "$ " + Number(n || 0).toLocaleString("es-AR");
  }

  function itemFoto(it) {
    return (it && it.foto) || "img/productos/aceite.jpg";
  }
  function facturaTotal(f) {
    return (f.lineas || []).reduce(function (a, l) {
      return a + Number(l.cant || 0) * Number(l.precio || 0);
    }, 0);
  }
  function byFacturaId(id) {
    return (state.facturas || []).find(function (f) { return f.id === id; }) || null;
  }
  function nextFacturaNro() {
    var max = 216;
    (state.facturas || []).forEach(function (f) {
      var n = Number(String(f.nro || "").split("-").pop());
      if (n > max) max = n;
    });
    return "0001-" + String(max + 1).padStart(8, "0");
  }
  function todayStr() {
    return "2026-09-11";
  }
  function nowHora() {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function toast(m) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = m;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 1600);
  }
  function byCodigo(code) {
    code = String(code || "").trim();
    return (state.items || []).filter(function (x) {
      return String(x.codigo) === code;
    })[0];
  }
  function byItemId(id) {
    return (state.items || []).filter(function (x) {
      return x.id === id;
    })[0];
  }
  function byClienteId(id) {
    return (state.clientes || []).filter(function (x) {
      return x.id === id;
    })[0];
  }
  function isLow(it) {
    return Number(it.stock) < Number(it.minimo);
  }
  function valorStock() {
    return (state.items || []).reduce(function (a, x) {
      return a + Number(x.stock || 0) * Number(x.precio || 0);
    }, 0);
  }
  function addMov(codigo, tipo, cant, nota, cliente) {
    state.movs = state.movs || [];
    state.movs.unshift({
      id: "m" + Date.now(),
      fecha: "2026-09-11",
      hora: new Date().toTimeString().slice(0, 5),
      codigo: codigo,
      tipo: tipo,
      cant: cant,
      nota: nota || "",
      cliente: cliente || ""
    });
  }

  function setHidden(el, hide) {
    if (!el) return;
    if (hide) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function phoneToWa(tel) {
    var d = String(tel || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.indexOf("54") === 0) return d;
    if (d.length === 10) return "54" + d;
    return "54" + d;
  }

  function closeModal() {
    var modal = document.getElementById("form-modal");
    var card = modal && modal.querySelector(".g-modal-card");
    if (modal) modal.classList.remove("is-open");
    if (card) card.classList.remove("is-client");
    setHidden(modal, true);
    setHidden(document.getElementById("create-item"), true);
    setHidden(document.getElementById("create-cliente"), true);
    setHidden(document.getElementById("create-factura"), true);
    document.body.classList.remove("modal-open");
  }

  function setPickerCoords(lat, lng, opts) {
    lat = Number(lat);
    lng = Number(lng);
    if (!isFinite(lat) || !isFinite(lng)) return;
    var f = document.getElementById("create-cliente");
    if (f) {
      f.lat.value = lat;
      f.lng.value = lng;
    }
    var hint = document.getElementById("cli-map-hint");
    if (hint) {
      hint.textContent =
        "Punto marcado. Puede arrastrar el pin o tocar otro lugar del mapa.";
    }
    if (!pickerMap || !window.L) return;
    if (!pickerMarker) {
      pickerMarker = L.marker([lat, lng], { draggable: true }).addTo(pickerMap);
      pickerMarker.on("dragend", function () {
        var p = pickerMarker.getLatLng();
        setPickerCoords(p.lat, p.lng);
      });
    } else {
      pickerMarker.setLatLng([lat, lng]);
    }
    if (!opts || opts.pan !== false) {
      pickerMap.setView([lat, lng], Math.max(pickerMap.getZoom(), 15));
    }
  }

  function ensurePickerMap() {
    if (!window.L) return;
    var host = document.getElementById("cli-picker-map");
    if (!host) return;
    var lat = Number((document.getElementById("cli-lat") || {}).value) || DEFAULT_LAT;
    var lng = Number((document.getElementById("cli-lng") || {}).value) || DEFAULT_LNG;
    if (!pickerMap) {
      pickerMap = L.map(host, { scrollWheelZoom: false }).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }).addTo(pickerMap);
      pickerMap.on("click", function (ev) {
        setPickerCoords(ev.latlng.lat, ev.latlng.lng, { pan: false });
      });
    }
    setPickerCoords(lat, lng, { pan: true });
    setTimeout(function () {
      if (pickerMap) pickerMap.invalidateSize();
    }, 60);
    setTimeout(function () {
      if (pickerMap) pickerMap.invalidateSize();
    }, 220);
  }

  function openModal(kind, title) {
    var modal = document.getElementById("form-modal");
    var card = modal && modal.querySelector(".g-modal-card");
    document.getElementById("modal-title").textContent = title;
    setHidden(document.getElementById("create-item"), kind !== "item");
    setHidden(document.getElementById("create-cliente"), kind !== "cliente");
    setHidden(document.getElementById("create-factura"), kind !== "factura");
    if (card) {
      card.classList.toggle("is-client", kind === "cliente" || kind === "factura");
    }
    setHidden(modal, false);
    if (modal) modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    if (kind === "cliente") ensurePickerMap();
    var form =
      kind === "item"
        ? document.getElementById("create-item")
        : kind === "cliente"
          ? document.getElementById("create-cliente")
          : document.getElementById("create-factura");
    var first = form && form.querySelector("input:not([type=hidden]), select");
    if (first) setTimeout(function () { first.focus(); }, 40);
  }

  function openItemModal(it) {
    var f = document.getElementById("create-item");
    f.reset();
    f.id.value = "";
    document.getElementById("item-submit").textContent = it ? "Actualizar" : "Guardar";
    if (it) {
      f.id.value = it.id;
      f.codigo.value = it.codigo;
      f.nombre.value = it.nombre;
      f.categoria.value = it.categoria || "";
      f.stock.value = it.stock;
      f.minimo.value = it.minimo;
      f.precio.value = it.precio;
      f.ubicacion.value = it.ubicacion || "";
      f.proveedor.value = it.proveedor || "";
    }
    openModal("item", it ? "Editar ítem" : "Alta de ítem");
  }

  function openClienteModal(c) {
    var f = document.getElementById("create-cliente");
    f.reset();
    f.id.value = "";
    f.lat.value = DEFAULT_LAT;
    f.lng.value = DEFAULT_LNG;
    f.saldo.value = 0;
    f.zona.value = "Centro";
    var hint = document.getElementById("cli-map-hint");
    if (hint) {
      hint.textContent = "Toque el mapa para marcar el punto. Puede arrastrar el pin.";
    }
    document.getElementById("cli-submit").textContent = c ? "Actualizar" : "Guardar cliente";
    if (c) {
      f.id.value = c.id;
      f.nombre.value = c.nombre;
      f.tel.value = c.tel || "";
      f.zona.value = c.zona || "Centro";
      f.saldo.value = c.saldo || 0;
      f.direccion.value = c.direccion;
      f.lat.value = c.lat;
      f.lng.value = c.lng;
      f.nota.value = c.nota || "";
    }
    openModal("cliente", c ? "Editar cliente" : "Nuevo cliente");
  }

  function filteredStockList() {
    var list = (state.items || []).slice();
    if (stockFilter === "bajo") list = list.filter(isLow);
    else if (stockFilter !== "todos") {
      list = list.filter(function (x) {
        return (x.categoria || "Otros") === stockFilter;
      });
    }
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (x) {
        return [x.codigo, x.nombre, x.categoria, x.proveedor, x.ubicacion].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function filteredClientList() {
    var list = (state.clientes || []).slice();
    if (cliFilter === "deuda") {
      list = list.filter(function (c) {
        return Number(c.saldo) > 0;
      });
    } else if (cliFilter === "mora") {
      list = list.filter(function (c) {
        return c.estado === "mora";
      });
    } else if (cliFilter !== "todos") {
      list = list.filter(function (c) {
        return c.zona === cliFilter;
      });
    }
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (c) {
        return [c.nombre, c.tel, c.direccion, c.zona, c.nota].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function ensureStockSelection() {
    var list = filteredStockList();
    if (!list.length) {
      selectedItem = null;
      return;
    }
    if (!selectedItem || !list.some(function (x) { return x.id === selectedItem; })) {
      selectedItem = list[0].id;
    }
  }

  function ensureClienteSelection() {
    var list = filteredClientList();
    if (!list.length) {
      selectedCliente = null;
      return;
    }
    if (!selectedCliente || !list.some(function (c) { return c.id === selectedCliente; })) {
      selectedCliente = list[0].id;
    }
  }

  function showView(name) {
    view = name;
    closeModal();
    document.querySelectorAll("[data-panel-view]").forEach(function (el) {
      el.classList.toggle("panel-hidden", el.getAttribute("data-panel-view") !== name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === name);
    });
    document.getElementById("view-title").textContent = ({
      resumen: "Resumen del día",
      stock: "Mercadería",
      escanear: "Código de barras",
      clientes: "Clientes",
      facturas: "Facturas",
      caja: "Caja y contabilidad",
      mapa: "Mapa de ubicaciones"
    })[name] || name;

    document.getElementById("hint-bar").textContent = ({
      resumen: "Hoy: stock bajo, facturas, caja y clientes con saldo.",
      stock: "Fotos, stock y ficha de cada producto. Filtre por categoría o mínimos.",
      escanear: "Pruebe un código de ejemplo o importe una planilla CSV.",
      clientes: "Cartera con zona, saldo y estado. Puede abrir el mapa o WhatsApp desde la ficha.",
      facturas: "Emita, revise e imprima facturas de ejemplo (no es AFIP/ARCA).",
      caja: "Ingresos y egresos del día. Contabilidad simple de ejemplo.",
      mapa: "Ubicaciones de ejemplo en Bahía Blanca. Filtre por zona."
    })[name];

    var stats = document.getElementById("stats");
    setHidden(stats, name === "resumen" || name === "mapa" || name === "escanear" || name === "caja");

    var oc = document.getElementById("open-create");
    setHidden(oc, name !== "stock" && name !== "clientes" && name !== "facturas");
    if (oc) {
      oc.textContent =
        name === "clientes" ? "Nuevo cliente" : name === "facturas" ? "Nueva factura" : "Alta de ítem";
    }

    var sw = document.getElementById("search-wrap");
    setHidden(sw, name !== "stock" && name !== "clientes" && name !== "facturas");

    if (name === "stock") ensureStockSelection();
    if (name === "clientes") ensureClienteSelection();
    if (name === "facturas") ensureFacturaSelection();

    render();
  }

  function renderDashboard() {
    var items = state.items || [];
    var low = items.filter(isLow);
    var clientes = state.clientes || [];
    var deuda = clientes.filter(function (c) {
      return Number(c.saldo) > 0;
    });
    var mora = clientes.filter(function (c) {
      return c.estado === "mora";
    });
    var dash = document.getElementById("dash");
    dash.innerHTML =
      '<section class="dash-hello"><h2>Depósito Los Álamos</h2><p>Depósito de ejemplo: mercadería con foto, facturas, caja, clientes y mapa.</p></section>' +
      '<div class="dash-cards">' +
      '<article class="dash-card"><span>Ítems</span><strong>' +
      items.length +
      "</strong><small>En depósito</small></article>" +
      '<article class="dash-card warn"><span>Bajo mínimo</span><strong>' +
      low.length +
      "</strong><small>Reponer hoy</small></article>" +
      '<article class="dash-card"><span>Valor stock</span><strong>' +
      money(valorStock()) +
      "</strong><small>A precio de lista</small></article>" +
      '<article class="dash-card ok"><span>A cobrar</span><strong>' +
      money(
        deuda.reduce(function (a, c) {
          return a + Number(c.saldo || 0);
        }, 0)
      ) +
      "</strong><small>" +
      deuda.length +
      " con saldo · " +
      mora.length +
      " en mora</small></article>" +
      "</div>" +
      '<div class="dash-split">' +
      '<section class="dash-panel"><h3>Atención ahora</h3><p>Stock crítico y clientes en mora.</p><ul class="dash-attn">' +
      low
        .slice(0, 4)
        .map(function (it) {
          return (
            '<li data-go-stock="' +
            esc(it.id) +
            '"><strong>' +
            esc(it.nombre) +
            "</strong><span>Stock " +
            esc(it.stock) +
            " · mín. " +
            esc(it.minimo) +
            " · " +
            esc(it.codigo) +
            "</span></li>"
          );
        })
        .join("") +
      mora
        .map(function (c) {
          return (
            '<li data-go-cli="' +
            esc(c.id) +
            '"><strong>' +
            esc(c.nombre) +
            "</strong><span>Mora · " +
            money(c.saldo) +
            " · " +
            esc(c.zona) +
            "</span></li>"
          );
        })
        .join("") +
      (low.length + mora.length === 0 ? "<li><strong>Nada urgente</strong><span>Todo en orden por ahora.</span></li>" : "") +
      "</ul></section>" +
      '<section class="dash-panel"><h3>Atajos</h3><p>Ir directo a trabajar.</p><div class="dash-shortcuts">' +
      '<button type="button" data-go="stock"><strong>Mercadería</strong><small>Fotos y stock</small></button>' +
      '<button type="button" data-go="facturas"><strong>Facturas</strong><small>Emitir e imprimir</small></button>' +
      '<button type="button" data-go="caja"><strong>Caja</strong><small>Ingresos y egresos</small></button>' +
      '<button type="button" data-go="mapa"><strong>Mapa</strong><small>Ubicaciones</small></button>' +
      "</div></section></div>";

    dash.querySelectorAll("[data-go]").forEach(function (b) {
      b.onclick = function () {
        showView(b.getAttribute("data-go"));
      };
    });
    dash.querySelectorAll("[data-go-stock]").forEach(function (b) {
      b.onclick = function () {
        selectedItem = b.getAttribute("data-go-stock");
        stockFilter = "bajo";
        showView("stock");
      };
    });
    dash.querySelectorAll("[data-go-cli]").forEach(function (b) {
      b.onclick = function () {
        selectedCliente = b.getAttribute("data-go-cli");
        cliFilter = "mora";
        showView("clientes");
      };
    });
    renderMovs();
  }

  function renderMovs() {
    var rows = document.getElementById("mov-rows");
    if (!rows) return;
    var movs = (state.movs || []).slice(0, 8);
    rows.innerHTML =
      movs
        .map(function (m) {
          var it = byCodigo(m.codigo) || {};
          return (
            "<tr><td>" +
            esc(m.fecha) +
            " " +
            esc(m.hora || "") +
            "</td><td>" +
            esc(m.codigo) +
            (it.nombre ? "<br><small>" + esc(it.nombre) + "</small>" : "") +
            '</td><td><span class="badge ' +
            (m.tipo === "entrada" ? "ok" : "warn") +
            '">' +
            esc(m.tipo) +
            "</span></td><td>" +
            esc(m.cant) +
            "</td><td>" +
            esc(m.nota || "—") +
            "</td></tr>"
          );
        })
        .join("") || '<tr><td colspan="5">Sin movimientos.</td></tr>';
  }

  function renderStats() {
    var items = state.items || [];
    var low = items.filter(isLow).length;
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Ítems</span><strong>' +
      items.length +
      "</strong></div>" +
      '<div class="stat"><span>Bajo mínimo</span><strong>' +
      low +
      "</strong></div>" +
      '<div class="stat"><span>Clientes</span><strong>' +
      (state.clientes || []).length +
      "</strong></div>" +
      '<div class="stat"><span>Valor stock</span><strong>' +
      money(valorStock()) +
      "</strong></div>";
  }

  function renderStockFilters() {
    var cats = ["todos", "bajo"].concat(
      Array.from(
        new Set(
          (state.items || []).map(function (x) {
            return x.categoria || "Otros";
          })
        )
      )
    );
    var host = document.getElementById("stock-filters");
    host.innerHTML = cats
      .map(function (c) {
        var label = c === "todos" ? "Todos" : c === "bajo" ? "Bajo mínimo" : c;
        return (
          '<button type="button" data-f="' +
          esc(c) +
          '" class="' +
          (stockFilter === c ? "on" : "") +
          '">' +
          esc(label) +
          "</button>"
        );
      })
      .join("");
    host.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        stockFilter = b.getAttribute("data-f");
        render();
      };
    });
  }

  function renderStock() {
    renderStockFilters();
    ensureStockSelection();
    var list = filteredStockList();
    document.getElementById("stock-rows").innerHTML =
      list
        .map(function (x) {
          return (
            '<tr data-id="' +
            esc(x.id) +
            '" class="' +
            (selectedItem === x.id ? "is-on" : "") +
            '"><td class="td-foto"><img class="prod-thumb" src="' +
            esc(itemFoto(x)) +
            '" alt=""></td><td class="mono">' +
            esc(x.codigo) +
            '</td><td class="td-name">' +
            esc(x.nombre) +
            "</td><td>" +
            esc(x.categoria || "—") +
            '</td><td class="' +
            (isLow(x) ? "low-stock" : "") +
            '">' +
            esc(x.stock) +
            "</td><td>" +
            esc(x.minimo) +
            '</td><td class="amount">' +
            money(x.precio) +
            "</td></tr>"
          );
        })
        .join("") || '<tr><td colspan="7">Sin ítems con ese filtro.</td></tr>';
    document.querySelectorAll("#stock-rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () {
        selectedItem = tr.getAttribute("data-id");
        render();
      };
    });

    var sheet = document.getElementById("sheet");
    var it = byItemId(selectedItem);
    if (!it) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un ítem de la lista.</p>';
      return;
    }
    sheet.innerHTML =
      '<div class="sheet-foto"><img src="' +
      esc(itemFoto(it)) +
      '" alt="' +
      esc(it.nombre) +
      '"></div><div class="sheet-head"><h3>' +
      esc(it.nombre) +
      '</h3><div class="meta">' +
      '<span class="badge">' +
      esc(it.categoria || "Sin cat.") +
      "</span>" +
      (isLow(it) ? '<span class="badge warn">Bajo mínimo</span>' : '<span class="badge ok">Stock ok</span>') +
      "</div></div>" +
      '<dl class="sheet-facts">' +
      "<div><dt>Código</dt><dd>" +
      esc(it.codigo) +
      "</dd></div>" +
      '<div class="' +
      (isLow(it) ? "is-warn" : "") +
      '"><dt>Stock</dt><dd>' +
      esc(it.stock) +
      " · mín. " +
      esc(it.minimo) +
      "</dd></div>" +
      "<div><dt>Precio</dt><dd>" +
      money(it.precio) +
      "</dd></div>" +
      "<div><dt>Ubicación</dt><dd>" +
      esc(it.ubicacion || "Sin ubicación") +
      "</dd></div>" +
      "<div class='is-wide'><dt>Proveedor</dt><dd>" +
      esc(it.proveedor || "Sin proveedor") +
      "</dd></div>" +
      "</dl>" +
      '<div class="actions">' +
      '<button type="button" data-act="in">+1 entrada</button>' +
      '<button type="button" data-act="out">−1 salida</button>' +
      '<button type="button" data-act="edit">Editar</button>' +
      '<button type="button" class="primary" data-act="scan">Ver código</button>' +
      '<button type="button" data-act="fac">Facturar</button>' +
      "</div>" +
      '<div class="actions actions-danger"><button type="button" class="danger" data-act="del">Eliminar</button></div>';
    sheet.querySelector("[data-act=in]").onclick = function () {
      it.stock = Number(it.stock) + 1;
      addMov(it.codigo, "entrada", 1, "Ajuste manual");
      save();
      toast("Entrada +1");
      render();
    };
    sheet.querySelector("[data-act=out]").onclick = function () {
      it.stock = Math.max(0, Number(it.stock) - 1);
      addMov(it.codigo, "salida", 1, "Ajuste manual");
      save();
      toast("Salida −1");
      render();
    };
    sheet.querySelector("[data-act=edit]").onclick = function () {
      openItemModal(it);
    };
    sheet.querySelector("[data-act=scan]").onclick = function () {
      document.getElementById("scan-input").value = it.codigo;
      showView("escanear");
      applyScan(it.codigo, 0);
    };
    sheet.querySelector("[data-act=fac]").onclick = function () {
      openFacturaModal(it.id);
    };
    sheet.querySelector("[data-act=del]").onclick = function () {
      if (!confirm("¿Eliminar ítem?")) return;
      state.items = state.items.filter(function (x) {
        return x.id !== it.id;
      });
      selectedItem = null;
      save();
      toast("Eliminado");
      render();
    };
  }

  function renderCliFilters() {
    var host = document.getElementById("cli-filters");
    var opts = [
      ["todos", "Todos"],
      ["deuda", "Con saldo"],
      ["mora", "En mora"],
      ["Centro", "Centro"],
      ["Norte", "Norte"],
      ["Sur", "Sur"],
      ["Este", "Este"],
      ["Oeste", "Oeste"]
    ];
    host.innerHTML = opts
      .map(function (o) {
        return (
          '<button type="button" data-f="' +
          esc(o[0]) +
          '" class="' +
          (cliFilter === o[0] ? "on" : "") +
          '">' +
          esc(o[1]) +
          "</button>"
        );
      })
      .join("");
    host.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        cliFilter = b.getAttribute("data-f");
        render();
      };
    });
  }

  function renderClientes() {
    renderCliFilters();
    ensureClienteSelection();
    var list = filteredClientList();
    document.getElementById("cli-rows").innerHTML =
      list
        .map(function (c) {
          return (
            '<tr data-id="' +
            esc(c.id) +
            '" class="' +
            (selectedCliente === c.id ? "is-on" : "") +
            '"><td class="td-name">' +
            esc(c.nombre) +
            "</td><td>" +
            esc(c.zona || "—") +
            '</td><td class="amount ' +
            (Number(c.saldo) > 0 ? "is-debt" : "") +
            '">' +
            money(c.saldo) +
            '</td><td><span class="badge ' +
            (c.estado === "mora" ? "bad" : Number(c.saldo) > 0 ? "warn" : "ok") +
            '">' +
            esc(c.estado === "mora" ? "Mora" : Number(c.saldo) > 0 ? "Saldo" : "Al día") +
            "</span></td></tr>"
          );
        })
        .join("") || '<tr><td colspan="4">Sin clientes con ese filtro.</td></tr>';
    document.querySelectorAll("#cli-rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () {
        selectedCliente = tr.getAttribute("data-id");
        render();
      };
    });

    var sheet = document.getElementById("cli-sheet");
    var c = byClienteId(selectedCliente);
    if (!c) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un cliente.</p>';
      return;
    }
    var wa = phoneToWa(c.tel);
    var waHref = wa
      ? "https://wa.me/" +
        wa +
        "?text=" +
        encodeURIComponent("Hola " + c.nombre + ", le escribimos desde Depósito Los Álamos.")
      : "";
    sheet.innerHTML =
      '<div class="sheet-head"><h3>' +
      esc(c.nombre) +
      '</h3><div class="meta"><span class="badge">' +
      esc(c.zona || "Sin zona") +
      '</span><span class="badge ' +
      (c.estado === "mora" ? "bad" : Number(c.saldo) > 0 ? "warn" : "ok") +
      '">' +
      esc(c.estado === "mora" ? "En mora" : Number(c.saldo) > 0 ? "Con saldo" : "Al día") +
      "</span></div></div>" +
      '<dl class="sheet-facts">' +
      "<div><dt>Teléfono</dt><dd>" +
      esc(c.tel || "Sin teléfono") +
      "</dd></div>" +
      "<div><dt>Dirección</dt><dd>" +
      esc(c.direccion) +
      "</dd></div>" +
      '<div class="is-saldo"><dt>Saldo</dt><dd>' +
      money(c.saldo) +
      "</dd></div>" +
      "<div><dt>Último pedido</dt><dd>" +
      esc(c.ultimoPedido || "—") +
      "</dd></div>" +
      (c.nota
        ? "<div class='is-wide'><dt>Nota</dt><dd>" + esc(c.nota) + "</dd></div>"
        : "") +
      "</dl>" +
      '<div class="actions">' +
      (waHref
        ? '<a class="btn wa-btn" href="' + waHref + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>'
        : "") +
      '<button type="button" class="primary" data-act="map">Ver en mapa</button>' +
      '<button type="button" data-act="edit">Editar</button>' +
      "</div>" +
      '<div class="actions actions-danger"><button type="button" class="danger" data-act="del">Eliminar</button></div>';
    sheet.querySelector("[data-act=map]").onclick = function () {
      selectedCliente = c.id;
      mapFilter = c.zona || "todas";
      showView("mapa");
    };
    sheet.querySelector("[data-act=edit]").onclick = function () {
      openClienteModal(c);
    };
    sheet.querySelector("[data-act=del]").onclick = function () {
      if (!confirm("¿Eliminar cliente?")) return;
      state.clientes = state.clientes.filter(function (x) {
        return x.id !== c.id;
      });
      selectedCliente = null;
      save();
      toast("Cliente eliminado");
      render();
    };
  }

  function ensureMap() {
    if (mapReady || !window.L) return;
    map = L.map("map").setView([DEFAULT_LAT, DEFAULT_LNG], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19
    }).addTo(map);
    mapReady = true;
  }

  function renderMapFilters() {
    var zonas = ["todas"].concat(
      Array.from(
        new Set(
          (state.clientes || []).map(function (c) {
            return c.zona || "Sin zona";
          })
        )
      )
    );
    var host = document.getElementById("map-filters");
    host.innerHTML = zonas
      .map(function (z) {
        return (
          '<button type="button" data-f="' +
          esc(z) +
          '" class="' +
          (mapFilter === z ? "on" : "") +
          '">' +
          esc(z === "todas" ? "Todas" : z) +
          "</button>"
        );
      })
      .join("");
    host.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        mapFilter = b.getAttribute("data-f");
        renderMap();
      };
    });
  }

  function renderMap() {
    ensureMap();
    if (!map) return;
    renderMapFilters();
    Object.keys(markers).forEach(function (k) {
      map.removeLayer(markers[k]);
    });
    markers = {};
    var list = (state.clientes || []).filter(function (c) {
      return mapFilter === "todas" || c.zona === mapFilter;
    });
    document.getElementById("map-summary").textContent =
      list.length + " cliente" + (list.length === 1 ? "" : "s") + " en el mapa";
    var bounds = [];
    document.getElementById("map-list").innerHTML = list
      .map(function (c) {
        var m = L.marker([Number(c.lat), Number(c.lng)]).addTo(map);
        m.bindPopup(
          "<strong>" +
            esc(c.nombre) +
            "</strong><br>" +
            esc(c.direccion) +
            "<br>" +
            esc(c.zona || "") +
            " · " +
            money(c.saldo)
        );
        markers[c.id] = m;
        bounds.push([Number(c.lat), Number(c.lng)]);
        return (
          '<li><button type="button" data-id="' +
          esc(c.id) +
          '" class="' +
          (selectedCliente === c.id ? "is-on" : "") +
          '"><strong>' +
          esc(c.nombre) +
          "</strong><span>" +
          esc(c.zona || "") +
          " · " +
          money(c.saldo) +
          "<br>" +
          esc(c.direccion) +
          "</span></button></li>"
        );
      })
      .join("") || "<li><p class='scan-hint'>Sin clientes en esta zona.</p></li>";
    document.querySelectorAll("#map-list button").forEach(function (b) {
      b.onclick = function () {
        selectedCliente = b.getAttribute("data-id");
        var c = byClienteId(selectedCliente);
        if (c && markers[c.id]) {
          map.setView([Number(c.lat), Number(c.lng)], 15);
          markers[c.id].openPopup();
        }
        renderMap();
      };
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [28, 28] });
    if (selectedCliente && markers[selectedCliente]) markers[selectedCliente].openPopup();
    setTimeout(function () {
      map.invalidateSize();
    }, 100);
  }

  function drawCode(code) {
    var host = document.getElementById("barcode-host");
    var qrHost = document.getElementById("qr-host");
    if (host) host.innerHTML = "";
    if (qrHost) qrHost.innerHTML = "";
    if (!code) return;
    if (host && window.JsBarcode) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      host.appendChild(svg);
      try {
        JsBarcode(svg, String(code), {
          format: String(code).length === 13 ? "EAN13" : "CODE128",
          displayValue: true,
          fontSize: 14,
          height: 60,
          margin: 8
        });
      } catch (e) {
        host.textContent = "Código: " + code;
      }
    }
    if (qrHost && window.QRCode) {
      try {
        new QRCode(qrHost, { text: String(code), width: 120, height: 120 });
      } catch (e) {}
    }
  }

  function renderScanChips() {
    var host = document.getElementById("scan-chips");
    var samples = (state.items || []).slice(0, 6);
    host.innerHTML = samples
      .map(function (it) {
        return (
          '<button type="button" data-code="' +
          esc(it.codigo) +
          '">' +
          esc(it.codigo) +
          "</button>"
        );
      })
      .join("");
    host.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        document.getElementById("scan-input").value = b.getAttribute("data-code");
        applyScan(b.getAttribute("data-code"), 0);
      };
    });
  }

  function applyScan(code, delta) {
    code = String(code || "").trim();
    if (!code) {
      toast("Ingrese un código");
      return;
    }
    drawCode(code);
    var it = byCodigo(code);
    var box = document.getElementById("scan-result");
    if (!it) {
      box.innerHTML = "<p>No hay ítem con ese código. Use <strong>Alta rápida</strong> para crearlo.</p>";
      return;
    }
    if (delta) {
      it.stock = Math.max(0, Number(it.stock) + delta);
      addMov(it.codigo, delta > 0 ? "entrada" : "salida", Math.abs(delta), "Desde lector");
      save();
      toast(delta > 0 ? "Entrada +1" : "Salida −1");
    }
    selectedItem = it.id;
    box.innerHTML =
      "<p><strong>" +
      esc(it.nombre) +
      "</strong> · " +
      esc(it.categoria || "") +
      "<br>Stock <strong class='" +
      (isLow(it) ? "low-stock" : "") +
      "'>" +
      esc(it.stock) +
      "</strong> · mín. " +
      esc(it.minimo) +
      " · " +
      money(it.precio) +
      (isLow(it) ? ' <span class="badge warn">Bajo mínimo</span>' : "") +
      "</p>";
  }


  function ensureFacturaSelection() {
    var list = filteredFacturas();
    if (!list.length) {
      selectedFactura = null;
      return;
    }
    if (!selectedFactura || !list.some(function (f) { return f.id === selectedFactura; })) {
      selectedFactura = list[0].id;
    }
  }

  function filteredFacturas() {
    var list = (state.facturas || []).slice();
    if (facFilter === "impaga") list = list.filter(function (f) { return f.estado === "impaga"; });
    else if (facFilter === "cobrada") list = list.filter(function (f) { return f.estado === "cobrada"; });
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (f) {
        var c = byClienteId(f.clienteId) || {};
        return [f.nro, f.fecha, f.estado, c.nombre].join(" ").toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function openFacturaModal(preferItemId) {
    var selC = document.getElementById("fac-cliente");
    var selI = document.getElementById("fac-item");
    var selI2 = document.getElementById("fac-item2");
    selC.innerHTML = (state.clientes || [])
      .map(function (c) {
        return '<option value="' + esc(c.id) + '">' + esc(c.nombre) + "</option>";
      })
      .join("");
    var opts = (state.items || [])
      .map(function (it) {
        return (
          '<option value="' +
          esc(it.id) +
          '">' +
          esc(it.nombre) +
          " · " +
          money(it.precio) +
          "</option>"
        );
      })
      .join("");
    selI.innerHTML = opts;
    selI2.innerHTML = '<option value="">— opcional —</option>' + opts;
    if (preferItemId) selI.value = preferItemId;
    if (selectedCliente) selC.value = selectedCliente;
    document.getElementById("create-factura").reset();
    // restore selects after reset
    if (preferItemId) selI.value = preferItemId;
    if (selectedCliente) selC.value = selectedCliente;
    openModal("factura", "Nueva factura");
  }

  function printFactura(f) {
    var host = document.getElementById("invoice-print");
    var c = byClienteId(f.clienteId) || {};
    var rows = (f.lineas || [])
      .map(function (l) {
        var it = byItemId(l.itemId) || {};
        var sub = Number(l.cant) * Number(l.precio);
        return (
          "<tr><td>" +
          esc(it.nombre || l.itemId) +
          "</td><td>" +
          esc(l.cant) +
          "</td><td>" +
          money(l.precio) +
          "</td><td>" +
          money(sub) +
          "</td></tr>"
        );
      })
      .join("");
    host.innerHTML =
      '<div class="invoice-sheet">' +
      "<header><strong>Depósito Los Álamos</strong><span>Factura de ejemplo · no fiscal</span></header>" +
      "<p><strong>Nº " +
      esc(f.nro) +
      "</strong> · " +
      esc(f.fecha) +
      "</p>" +
      "<p>Cliente: <strong>" +
      esc(c.nombre || "—") +
      "</strong><br>" +
      esc(c.direccion || "") +
      "<br>CUIT/DNI ejemplo · " +
      esc(c.tel || "") +
      "</p>" +
      "<table><thead><tr><th>Detalle</th><th>Cant.</th><th>P. unit.</th><th>Subtotal</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      "<p class='invoice-total'>Total " +
      money(facturaTotal(f)) +
      "</p>" +
      "<p>Pago: " +
      esc(f.pago) +
      " · Estado: " +
      esc(f.estado) +
      "</p>" +
      "<p class='invoice-note'>Documento de ejemplo para mostrar el panel. No es comprobante AFIP/ARCA.</p>" +
      "</div>";
    setHidden(host, false);
    document.body.classList.add("printing-invoice");
    window.print();
    setTimeout(function () {
      document.body.classList.remove("printing-invoice");
      setHidden(host, true);
    }, 300);
  }

  function renderFacturas() {
    var host = document.getElementById("fac-filters");
    if (host) {
      var opts = [
        ["todas", "Todas"],
        ["impaga", "Impagas"],
        ["cobrada", "Cobradas"]
      ];
      host.innerHTML = opts
        .map(function (o) {
          return (
            '<button type="button" data-f="' +
            o[0] +
            '" class="' +
            (facFilter === o[0] ? "on" : "") +
            '">' +
            o[1] +
            "</button>"
          );
        })
        .join("");
      host.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          facFilter = b.getAttribute("data-f");
          render();
        };
      });
    }
    ensureFacturaSelection();
    var list = filteredFacturas();
    document.getElementById("fac-rows").innerHTML =
      list
        .map(function (f) {
          var c = byClienteId(f.clienteId) || {};
          return (
            '<tr data-id="' +
            esc(f.id) +
            '" class="' +
            (selectedFactura === f.id ? "is-on" : "") +
            '"><td>' +
            esc(f.nro) +
            "</td><td>" +
            esc(f.fecha) +
            "</td><td>" +
            esc(c.nombre || "—") +
            '</td><td class="amount">' +
            money(facturaTotal(f)) +
            '</td><td><span class="badge ' +
            (f.estado === "impaga" ? "warn" : "ok") +
            '">' +
            esc(f.estado) +
            "</span></td></tr>"
          );
        })
        .join("") || '<tr><td colspan="5">Sin facturas con ese filtro.</td></tr>';
    document.querySelectorAll("#fac-rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () {
        selectedFactura = tr.getAttribute("data-id");
        render();
      };
    });

    var sheet = document.getElementById("fac-sheet");
    var f = byFacturaId(selectedFactura);
    if (!f) {
      sheet.innerHTML = '<p class="empty-sheet">Elija una factura.</p>';
      return;
    }
    var c = byClienteId(f.clienteId) || {};
    var lines = (f.lineas || [])
      .map(function (l) {
        var it = byItemId(l.itemId) || {};
        return (
          "<li><img class='prod-thumb' src='" +
          esc(itemFoto(it)) +
          "' alt=''> <span><strong>" +
          esc(it.nombre || "Ítem") +
          "</strong><br>" +
          esc(l.cant) +
          " × " +
          money(l.precio) +
          "</span></li>"
        );
      })
      .join("");
    sheet.innerHTML =
      "<h3>Factura " +
      esc(f.nro) +
      '</h3><div class="meta"><span class="badge ' +
      (f.estado === "impaga" ? "warn" : "ok") +
      '">' +
      esc(f.estado) +
      "</span><span class='badge'>" +
      esc(f.pago) +
      "</span></div><p>" +
      esc(f.fecha) +
      " · " +
      esc(c.nombre || "") +
      "</p><ul class='fac-lines'>" +
      lines +
      "</ul><p class='amount'><strong>Total " +
      money(facturaTotal(f)) +
      '</strong></p><div class="actions">' +
      '<button type="button" class="primary" data-act="print">Imprimir</button>' +
      (f.estado === "impaga"
        ? '<button type="button" data-act="cobrar">Marcar cobrada</button>'
        : "") +
      "</div>";
    sheet.querySelector("[data-act=print]").onclick = function () {
      printFactura(f);
    };
    var cobrar = sheet.querySelector("[data-act=cobrar]");
    if (cobrar) {
      cobrar.onclick = function () {
        f.estado = "cobrada";
        var tot = facturaTotal(f);
        if (c && c.id) {
          c.saldo = Math.max(0, Number(c.saldo || 0) - tot);
          if (c.saldo < 50000 && c.estado === "mora") c.estado = "activo";
        }
        state.caja = state.caja || [];
        state.caja.unshift({
          id: "k" + Date.now(),
          fecha: todayStr(),
          hora: nowHora(),
          tipo: "ingreso",
          concepto: "Cobro factura " + f.nro + " · " + (c.nombre || ""),
          monto: tot,
          facturaId: f.id
        });
        save();
        toast("Factura cobrada");
        render();
      };
    }
  }

  function renderCaja() {
    var rows = state.caja || [];
    var ing = 0;
    var egr = 0;
    rows.forEach(function (r) {
      if (r.tipo === "ingreso") ing += Number(r.monto || 0);
      else egr += Number(r.monto || 0);
    });
    var sum = document.getElementById("caja-summary");
    if (sum) {
      sum.innerHTML =
        '<article><span>Ingresos</span><strong class="ok">' +
        money(ing) +
        "</strong></article>" +
        "<article><span>Egresos</span><strong class='warn'>" +
        money(egr) +
        "</strong></article>" +
        "<article><span>Saldo de caja</span><strong>" +
        money(ing - egr) +
        "</strong></article>" +
        "<article><span>Movimientos</span><strong>" +
        rows.length +
        "</strong></article>";
    }
    document.getElementById("caja-rows").innerHTML =
      rows
        .map(function (r) {
          return (
            "<tr><td>" +
            esc(r.fecha) +
            " " +
            esc(r.hora || "") +
            '</td><td><span class="badge ' +
            (r.tipo === "ingreso" ? "ok" : "warn") +
            '">' +
            esc(r.tipo) +
            "</span></td><td>" +
            esc(r.concepto) +
            '</td><td class="amount">' +
            money(r.monto) +
            "</td></tr>"
          );
        })
        .join("") || "<tr><td colspan='4'>Sin movimientos de caja.</td></tr>";
  }

  function render() {
    if (view === "resumen") {
      renderDashboard();
      return;
    }
    if (view === "mapa") {
      renderMap();
      return;
    }
    if (view === "escanear") {
      renderScanChips();
      return;
    }
    if (view === "caja") {
      renderCaja();
      return;
    }
    renderStats();
    if (view === "stock") renderStock();
    if (view === "clientes") renderClientes();
    if (view === "facturas") renderFacturas();
  }

  document.querySelectorAll(".panel-tabs button").forEach(function (b) {
    b.onclick = function () {
      showView(b.getAttribute("data-view"));
    };
  });
  document.getElementById("search").oninput = function (e) {
    search = e.target.value.trim();
    render();
  };
  document.getElementById("reset-sample").onclick = function () {
    if (!confirm("¿Restablecer datos de ejemplo?")) return;
    localStorage.removeItem(KEY);
    localStorage.removeItem("sistema-gestion-v1");
    localStorage.removeItem("sistema-gestion-v2");
    location.reload();
  };
  document.getElementById("open-create").onclick = function () {
    if (view === "clientes") openClienteModal(null);
    else if (view === "facturas") openFacturaModal(null);
    else openItemModal(null);
  };
  document.querySelectorAll("[data-close-modal]").forEach(function (b) {
    b.onclick = function () {
      closeModal();
    };
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("create-item").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var id = String(fd.get("id") || "");
    var payload = {
      codigo: String(fd.get("codigo")).trim(),
      nombre: String(fd.get("nombre")).trim(),
      categoria: String(fd.get("categoria") || "").trim() || "Otros",
      stock: Number(fd.get("stock") || 0),
      minimo: Number(fd.get("minimo") || 0),
      precio: Number(fd.get("precio") || 0),
      ubicacion: String(fd.get("ubicacion") || "").trim(),
      proveedor: String(fd.get("proveedor") || "").trim()
    };
    if (id && byItemId(id)) {
      var it = byItemId(id);
      Object.keys(payload).forEach(function (k) {
        it[k] = payload[k];
      });
      selectedItem = id;
      toast("Ítem actualizado");
    } else {
      var neu = { id: "p" + Date.now(), foto: "img/productos/jabon.jpg" };
      Object.keys(payload).forEach(function (k) {
        neu[k] = payload[k];
      });
      state.items.unshift(neu);
      selectedItem = neu.id;
      addMov(neu.codigo, "entrada", neu.stock, "Alta de ítem");
      toast("Ítem creado");
    }
    save();
    closeModal();
    render();
  };

  document.getElementById("create-cliente").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var id = String(fd.get("id") || "");
    var payload = {
      nombre: String(fd.get("nombre")).trim(),
      tel: String(fd.get("tel") || "").trim(),
      zona: String(fd.get("zona") || "").trim() || "Centro",
      saldo: Number(fd.get("saldo") || 0),
      direccion: String(fd.get("direccion")).trim(),
      lat: Number(fd.get("lat")),
      lng: Number(fd.get("lng")),
      nota: String(fd.get("nota") || "").trim(),
      estado: Number(fd.get("saldo") || 0) > 50000 ? "mora" : "activo",
      ultimoPedido: "2026-09-11"
    };
    if (id && byClienteId(id)) {
      var c = byClienteId(id);
      Object.keys(payload).forEach(function (k) {
        c[k] = payload[k];
      });
      if (c.estado !== "mora" && Number(c.saldo) > 50000) c.estado = "mora";
      selectedCliente = id;
      toast("Cliente actualizado");
    } else {
      var neu = { id: "c" + Date.now() };
      Object.keys(payload).forEach(function (k) {
        neu[k] = payload[k];
      });
      state.clientes.unshift(neu);
      selectedCliente = neu.id;
      toast("Cliente creado");
    }
    save();
    closeModal();
    render();
  };


  document.getElementById("create-factura").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var clienteId = String(fd.get("clienteId") || "");
    var pago = String(fd.get("pago") || "cuenta corriente");
    var lineas = [];
    var i1 = String(fd.get("itemId") || "");
    var c1 = Number(fd.get("cant") || 0);
    if (i1 && c1 > 0) {
      var it1 = byItemId(i1);
      lineas.push({ itemId: i1, cant: c1, precio: it1 ? Number(it1.precio) : 0 });
    }
    var i2 = String(fd.get("itemId2") || "");
    var c2 = Number(fd.get("cant2") || 0);
    if (i2 && c2 > 0) {
      var it2 = byItemId(i2);
      lineas.push({ itemId: i2, cant: c2, precio: it2 ? Number(it2.precio) : 0 });
    }
    if (!clienteId || !lineas.length) {
      toast("Complete cliente y al menos un producto");
      return;
    }
    for (var i = 0; i < lineas.length; i++) {
      var it = byItemId(lineas[i].itemId);
      if (!it || Number(it.stock) < lineas[i].cant) {
        toast("Stock insuficiente en " + (it ? it.nombre : "ítem"));
        return;
      }
    }
    var nro = nextFacturaNro();
    lineas.forEach(function (l) {
      var it = byItemId(l.itemId);
      it.stock = Number(it.stock) - l.cant;
      addMov(it.codigo, "salida", l.cant, "Factura " + nro);
    });
    var fac = {
      id: "f" + Date.now(),
      nro: nro,
      fecha: todayStr(),
      clienteId: clienteId,
      estado: pago === "cuenta corriente" ? "impaga" : "cobrada",
      pago: pago,
      lineas: lineas
    };
    state.facturas = state.facturas || [];
    state.facturas.unshift(fac);
    var tot = facturaTotal(fac);
    var cli = byClienteId(clienteId);
    if (pago === "cuenta corriente" && cli) {
      cli.saldo = Number(cli.saldo || 0) + tot;
      cli.ultimoPedido = todayStr();
      if (cli.saldo > 50000) cli.estado = "mora";
    } else {
      state.caja = state.caja || [];
      state.caja.unshift({
        id: "k" + Date.now(),
        fecha: todayStr(),
        hora: nowHora(),
        tipo: "ingreso",
        concepto: "Cobro factura " + fac.nro + " · " + (cli ? cli.nombre : ""),
        monto: tot,
        facturaId: fac.id
      });
    }
    selectedFactura = fac.id;
    save();
    closeModal();
    toast("Factura " + fac.nro + " emitida");
    showView("facturas");
  };

  document.getElementById("caja-form").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    state.caja = state.caja || [];
    state.caja.unshift({
      id: "k" + Date.now(),
      fecha: todayStr(),
      hora: nowHora(),
      tipo: String(fd.get("tipo") || "ingreso"),
      concepto: String(fd.get("concepto") || "").trim(),
      monto: Number(fd.get("monto") || 0),
      facturaId: ""
    });
    save();
    ev.target.reset();
    toast("Movimiento de caja registrado");
    render();
  };

  document.getElementById("scan-go").onclick = function () {
    applyScan(document.getElementById("scan-input").value, 0);
  };
  document.getElementById("scan-in").onclick = function () {
    applyScan(document.getElementById("scan-input").value, 1);
  };
  document.getElementById("scan-out").onclick = function () {
    applyScan(document.getElementById("scan-input").value, -1);
  };
  document.getElementById("scan-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      applyScan(e.target.value, 0);
    }
  });
  document.getElementById("scan-new").onclick = function () {
    var code = String(document.getElementById("scan-input").value || "").trim();
    if (!code) {
      toast("Ingrese un código");
      return;
    }
    if (byCodigo(code)) {
      toast("Ya existe");
      applyScan(code, 0);
      return;
    }
    var neu = {
      id: "p" + Date.now(),
      codigo: code,
      nombre: "Nuevo ítem " + code.slice(-4),
      categoria: "Otros",
      stock: 1,
      minimo: 5,
      precio: 0,
      ubicacion: "Depósito",
      proveedor: ""
    };
    state.items.unshift(neu);
    selectedItem = neu.id;
    addMov(code, "entrada", 1, "Alta rápida");
    save();
    drawCode(code);
    toast("Alta rápida ok");
    document.getElementById("scan-result").innerHTML =
      "<p>Creado <strong>" + esc(neu.nombre) + "</strong>. Edítelo en Mercadería.</p>";
  };

  document.getElementById("file-import").onchange = function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var text = String(ev.target.result || "");
      var lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        toast("CSV vacío");
        return;
      }
      var headers = lines[0].split(",").map(function (h) {
        return h.trim().toLowerCase();
      });
      var added = 0;
      for (var i = 1; i < lines.length; i++) {
        var cols = lines[i].split(",");
        var row = {};
        headers.forEach(function (h, idx) {
          row[h] = (cols[idx] || "").trim();
        });
        if (!row.codigo || !row.nombre) continue;
        var existing = byCodigo(row.codigo);
        if (existing) {
          existing.nombre = row.nombre;
          if (row.stock !== "") existing.stock = Number(row.stock);
          if (row.minimo !== "") existing.minimo = Number(row.minimo);
          if (row.precio !== "") existing.precio = Number(row.precio);
        } else {
          state.items.unshift({
            id: "p" + Date.now() + i,
            codigo: row.codigo,
            nombre: row.nombre,
            categoria: "Importado",
            stock: Number(row.stock || 0),
            minimo: Number(row.minimo || 0),
            precio: Number(row.precio || 0),
            ubicacion: "Depósito",
            proveedor: ""
          });
          added += 1;
        }
      }
      save();
      document.getElementById("import-result").textContent = "Importación ok. Altas nuevas: " + added + ".";
      toast("Planilla importada");
    };
    reader.readAsText(file);
  };

  showView("resumen");
})();
