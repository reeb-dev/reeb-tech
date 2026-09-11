(function () {
  var KEY = "sistema-inventario-v1";
  var seed = window.INV_SEED;
  var state = load();
  var view = "stock";
  var selected = null;
  var search = "";
  var lastScan = "";

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function load() {
    try {
      var r = localStorage.getItem(KEY);
      if (r) return JSON.parse(r);
    } catch (e) {}
    return clone(seed);
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function money(n) { return "$ " + Number(n || 0).toLocaleString("es-AR"); }
  function toast(m) {
    var el = document.getElementById("toast");
    el.textContent = m;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 1800);
  }
  function byCodigo(code) {
    var c = String(code || "").trim();
    return (state.items || []).filter(function (x) { return String(x.codigo) === c; })[0];
  }
  function byId(id) {
    return (state.items || []).filter(function (x) { return x.id === id; })[0];
  }
  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function isLow(it) { return Number(it.stock) < Number(it.minimo); }

  function showView(name) {
    view = name;
    document.querySelectorAll("[data-panel-view]").forEach(function (el) {
      el.classList.toggle("panel-hidden", el.getAttribute("data-panel-view") !== name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === name);
    });
    document.getElementById("view-title").textContent = ({
      resumen: "Resumen del día",
      stock: "Inventario",
      escanear: "Escanear / código",
      importar: "Importar planilla",
      movs: "Movimientos",
      proveedores: "Proveedores"
    })[name] || name;
    var stats = document.getElementById("stats");
    if (stats) stats.classList.toggle("panel-hidden", name === "resumen");
    var oc = document.getElementById("open-create");
    if (oc) oc.classList.toggle("panel-hidden", name === "resumen");
    if (name === "resumen") {
      renderDashboard();
      return;
    }
    render();
  }

  function renderDashboard() {
    if (!window.SisPanelDash) return;
    var list = state.items || [];
    var low = list.filter(isLow);
    SisPanelDash.paint({
      title: "Stock bajo control",
      lead: "Códigos, mínimos e importación de planillas.",
      goPrimary: "stock",
      kpis: [
        { label: "Ítems", value: list.length, hint: "En stock" },
        { label: "Bajo mínimo", value: low.length, hint: "Reponer", tone: "warn" },
        { label: "Movimientos", value: (state.movs || []).length, hint: "Entradas/salidas", tone: "ok" }
      ],
      attention: low.slice(0, 5).map(function (it) {
        return { title: it.nombre || it.codigo, sub: "Stock " + it.stock + " · mín. " + it.minimo };
      })
    });
  }

  function renderStats() {
    var list = state.items || [];
    var low = list.filter(isLow).length;
    document.getElementById("stats").innerHTML =
      '<div class="stat"><span>Ítems</span><strong>' + list.length + "</strong></div>" +
      '<div class="stat"><span>Bajo mínimo</span><strong>' + low + "</strong></div>" +
      '<div class="stat"><span>Movimientos</span><strong>' + (state.movs || []).length + "</strong></div>" +
      '<div class="stat"><span>Proveedores</span><strong>' + (state.proveedores || []).length + "</strong></div>";
  }

  function drawCode(code) {
    var host = document.getElementById("barcode-host");
    if (!host) return;
    host.innerHTML = "";
    if (!code) {
      host.innerHTML = "<p class='scan-hint'>Ingrese o escanee un código para ver la barra / QR.</p>";
      return;
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "barcode-svg");
    host.appendChild(svg);
    try {
      if (window.JsBarcode) {
        JsBarcode("#barcode-svg", String(code), {
          format: String(code).length === 13 ? "EAN13" : "CODE128",
          displayValue: true,
          fontSize: 14,
          height: 60,
          margin: 8
        });
      }
    } catch (e) {
      try {
        JsBarcode("#barcode-svg", String(code), { format: "CODE128", displayValue: true, height: 60 });
      } catch (e2) {
        host.innerHTML = "<p class='code-pill'>" + esc(code) + "</p>";
      }
    }
    var qr = document.getElementById("qr-host");
    if (qr && window.QRCode) {
      qr.innerHTML = "";
      try {
        new QRCode(qr, { text: String(code), width: 128, height: 128 });
      } catch (e3) {}
    }
  }

  function applyScan(code, delta) {
    code = String(code || "").trim();
    if (!code) return;
    lastScan = code;
    var it = byCodigo(code);
    var scanInput = document.getElementById("scan-input");
    if (scanInput) scanInput.value = code;
    drawCode(code);
    if (!it) {
      toast("Código no encontrado. Puede darlo de alta.");
      selected = null;
      document.getElementById("scan-result").innerHTML =
        "<p>No hay producto con <span class='code-pill'>" + esc(code) + "</span>. Use «Alta rápida».</p>";
      return;
    }
    if (delta) {
      it.stock = Math.max(0, Number(it.stock || 0) + delta);
      state.movs = state.movs || [];
      state.movs.unshift({
        id: uid("m"),
        fecha: new Date().toISOString().slice(0, 10),
        codigo: it.codigo,
        tipo: delta > 0 ? "entrada" : "salida",
        cant: Math.abs(delta),
        nota: "Desde lector"
      });
      save();
      toast((delta > 0 ? "Entrada" : "Salida") + " · stock " + it.stock);
    }
    selected = it.id;
    document.getElementById("scan-result").innerHTML =
      "<p><strong>" + esc(it.nombre) + "</strong></p>" +
      "<p>Stock: <strong class='" + (isLow(it) ? "low-stock" : "") + "'>" + esc(it.stock) + "</strong> · Mínimo " + esc(it.minimo) + "</p>" +
      "<p>Proveedor: " + esc(it.proveedor) + " · " + money(it.precio) + "</p>";
    render();
  }

  function renderStock() {
    var list = (state.items || []).slice();
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (x) {
        return JSON.stringify(x).toLowerCase().indexOf(q) !== -1;
      });
    }
    document.getElementById("rows").innerHTML = list.map(function (x) {
      return "<tr data-id='" + esc(x.id) + "' class='" + (selected === x.id ? "is-on" : "") + "'>" +
        "<td><span class='code-pill'>" + esc(x.codigo) + "</span></td>" +
        "<td>" + esc(x.nombre) + "</td>" +
        "<td>" + esc(x.proveedor) + "</td>" +
        "<td class='" + (isLow(x) ? "low-stock" : "") + "'>" + esc(x.stock) + "</td>" +
        "<td>" + esc(x.minimo) + "</td>" +
        "<td>" + money(x.precio) + "</td>" +
        "</tr>";
    }).join("") || "<tr><td colspan='6'>Sin ítems.</td></tr>";

    document.querySelectorAll("#rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () {
        selected = tr.getAttribute("data-id");
        render();
      };
    });

    var sheet = document.getElementById("sheet");
    var raw = byId(selected);
    if (!raw) {
      sheet.innerHTML = "<p class='empty-sheet'>Elija un ítem o escanee un código.</p>";
      return;
    }
    sheet.innerHTML =
      "<h3>" + esc(raw.nombre) + "</h3>" +
      "<p>Código: <span class='code-pill'>" + esc(raw.codigo) + "</span></p>" +
      "<p>Stock: <strong class='" + (isLow(raw) ? "low-stock" : "") + "'>" + esc(raw.stock) + "</strong> (mín. " + esc(raw.minimo) + ")</p>" +
      "<p>" + esc(raw.proveedor) + " · " + money(raw.precio) + "</p>" +
      "<div class='actions'>" +
      "<button type='button' id='plus'>+1 entrada</button>" +
      "<button type='button' id='minus'>-1 salida</button>" +
      "<button type='button' id='edit'>Editar</button>" +
      "<button type='button' class='danger' id='del'>Eliminar</button>" +
      "</div>" +
      "<div class='barcode-preview' id='sheet-barcode'></div>";
    var host = document.getElementById("sheet-barcode");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "sheet-bc";
    host.appendChild(svg);
    try {
      JsBarcode("#sheet-bc", String(raw.codigo), { format: "CODE128", displayValue: true, height: 48, fontSize: 12 });
    } catch (e) {}
    document.getElementById("plus").onclick = function () { applyScan(raw.codigo, 1); };
    document.getElementById("minus").onclick = function () { applyScan(raw.codigo, -1); };
    document.getElementById("del").onclick = function () {
      if (!confirm("¿Eliminar?")) return;
      state.items = state.items.filter(function (i) { return i.id !== raw.id; });
      selected = null;
      save();
      toast("Eliminado");
      render();
    };
    document.getElementById("edit").onclick = function () {
      var n = prompt("Nombre", raw.nombre); if (n == null) return;
      var s = prompt("Stock", raw.stock); if (s == null) return;
      var m = prompt("Mínimo", raw.minimo); if (m == null) return;
      var p = prompt("Precio", raw.precio); if (p == null) return;
      raw.nombre = n;
      raw.stock = Number(s) || 0;
      raw.minimo = Number(m) || 0;
      raw.precio = Number(p) || 0;
      save();
      toast("Actualizado");
      render();
    };
  }

  function renderMovs() {
    var list = state.movs || [];
    document.getElementById("mov-rows").innerHTML = list.map(function (m) {
      return "<tr><td>" + esc(m.fecha) + "</td><td><span class='code-pill'>" + esc(m.codigo) + "</span></td><td>" +
        esc(m.tipo) + "</td><td>" + esc(m.cant) + "</td><td>" + esc(m.nota) + "</td></tr>";
    }).join("") || "<tr><td colspan='5'>Sin movimientos.</td></tr>";
  }

  function renderProveedores() {
    var grid = document.getElementById("prov-grid");
    grid.innerHTML = (state.proveedores || []).map(function (p) {
      return "<article class='feature'><strong>" + esc(p.nombre) + "</strong><p>" + esc(p.contacto) + "</p></article>";
    }).join("") || "<p class='empty-sheet'>Sin proveedores.</p>";
  }

  function normalizeHeader(h) {
    return String(h || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function mapRow(obj) {
    var map = {};
    Object.keys(obj).forEach(function (k) { map[normalizeHeader(k)] = obj[k]; });
    var codigo = map.codigo || map.ean || map.barcode || map.barra || map.sku || map.qr;
    var nombre = map.nombre || map.producto || map.descripcion || map.desc;
    if (!codigo || !nombre) return null;
    return {
      codigo: String(codigo).trim(),
      nombre: String(nombre).trim(),
      proveedor: String(map.proveedor || map.provider || "Importado").trim(),
      stock: Number(map.stock || map.cantidad || map.cant || 0) || 0,
      minimo: Number(map.minimo || map.min || map.stockmin || 0) || 0,
      precio: Number(map.precio || map.price || map.costo || 0) || 0,
      unidad: String(map.unidad || "un").trim() || "un"
    };
  }

  function upsertFromRows(rows) {
    var added = 0, updated = 0;
    rows.forEach(function (r) {
      var existing = byCodigo(r.codigo);
      if (existing) {
        existing.nombre = r.nombre;
        existing.proveedor = r.proveedor;
        existing.stock = r.stock;
        existing.minimo = r.minimo;
        existing.precio = r.precio;
        existing.unidad = r.unidad;
        updated += 1;
      } else {
        state.items.push(Object.assign({ id: uid("p") }, r));
        added += 1;
      }
      if (!(state.proveedores || []).some(function (p) { return p.nombre === r.proveedor; })) {
        state.proveedores = state.proveedores || [];
        state.proveedores.push({ id: uid("pr"), nombre: r.proveedor, contacto: "—" });
      }
    });
    save();
    return { added: added, updated: updated };
  }

  function importSheet(file) {
    if (!file) return;
    var name = file.name.toLowerCase();
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var rows = [];
        if (name.endsWith(".csv") || name.endsWith(".txt")) {
          var text = String(ev.target.result);
          var wb = XLSX.read(text, { type: "string" });
          var sheet = wb.Sheets[wb.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        } else {
          var data = new Uint8Array(ev.target.result);
          var wb2 = XLSX.read(data, { type: "array" });
          var sheet2 = wb2.Sheets[wb2.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(sheet2, { defval: "" });
        }
        var mapped = rows.map(mapRow).filter(Boolean);
        if (!mapped.length) {
          toast("No se leyeron filas. Use columnas: codigo, nombre, stock…");
          return;
        }
        var res = upsertFromRows(mapped);
        document.getElementById("import-result").textContent =
          "Listo: " + res.added + " altos, " + res.updated + " actualizados (" + mapped.length + " filas).";
        toast("Planilla importada");
        showView("stock");
      } catch (err) {
        console.error(err);
        toast("No se pudo leer el archivo");
      }
    };
    if (name.endsWith(".csv") || name.endsWith(".txt")) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  }

  function render() {
    if (view === "resumen") {
      renderDashboard();
      return;
    }
    renderStats();
    if (view === "stock") renderStock();
    if (view === "escanear") {
      drawCode(lastScan || (document.getElementById("scan-input") || {}).value);
    }
    if (view === "movs") renderMovs();
    if (view === "proveedores") renderProveedores();
  }

  document.querySelectorAll(".panel-tabs button").forEach(function (b) {
    b.onclick = function () { showView(b.getAttribute("data-view")); };
  });
  var searchEl = document.getElementById("search");
  if (searchEl) searchEl.oninput = function () { search = searchEl.value; render(); };

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
      applyScan(document.getElementById("scan-input").value, 0);
    }
  });
  document.getElementById("scan-new").onclick = function () {
    var code = String(document.getElementById("scan-input").value || "").trim();
    if (!code) { toast("Escriba un código"); return; }
    if (byCodigo(code)) { toast("Ya existe"); applyScan(code, 0); return; }
    var nombre = prompt("Nombre del producto");
    if (!nombre) return;
    var it = {
      id: uid("p"),
      codigo: code,
      nombre: nombre,
      proveedor: prompt("Proveedor", "Nuevo") || "Nuevo",
      stock: Number(prompt("Stock", "0")) || 0,
      minimo: Number(prompt("Mínimo", "5")) || 5,
      precio: Number(prompt("Precio", "0")) || 0,
      unidad: "un"
    };
    state.items.push(it);
    save();
    selected = it.id;
    toast("Alta ok");
    applyScan(code, 0);
    showView("stock");
  };

  document.getElementById("file-import").onchange = function (e) {
    var f = e.target.files && e.target.files[0];
    importSheet(f);
    e.target.value = "";
  };
  document.getElementById("open-create").onclick = function () {
    showView("escanear");
    document.getElementById("scan-input").focus();
  };
  document.getElementById("reset-sample").onclick = function () {
    if (!confirm("¿Restablecer datos de ejemplo?")) return;
    state = clone(seed);
    selected = null;
    save();
    toast("Restablecido");
    render();
  };

  // Optional camera barcode (if BarcodeDetector exists)
  var camBtn = document.getElementById("scan-cam");
  if (camBtn) {
    camBtn.onclick = async function () {
      if (!("BarcodeDetector" in window)) {
        toast("Este navegador no lee cámara. Use el lector USB o tipee el código.");
        return;
      }
      try {
        var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        var video = document.getElementById("cam-video");
        video.srcObject = stream;
        video.classList.remove("panel-hidden");
        await video.play();
        var detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "code_128", "qr_code", "upc_a"] });
        var timer = setInterval(async function () {
          try {
            var codes = await detector.detect(video);
            if (codes && codes[0]) {
              clearInterval(timer);
              stream.getTracks().forEach(function (t) { t.stop(); });
              video.classList.add("panel-hidden");
              applyScan(codes[0].rawValue, 0);
              toast("Código leído");
            }
          } catch (e) {}
        }, 700);
        setTimeout(function () {
          clearInterval(timer);
          stream.getTracks().forEach(function (t) { t.stop(); });
          video.classList.add("panel-hidden");
        }, 15000);
      } catch (err) {
        toast("No se pudo abrir la cámara");
      }
    };
  }

  showView("resumen");
})();
