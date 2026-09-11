/**
 * Panel Takeaway — cola KDS + carta CRUD.
 * Mismo localStorage que la landing: sistema-takeaway-v1
 */
(function () {
  var KEY = "sistema-takeaway-v1";
  var seed = window.SIS_SEED || { carta: [], items: [] };
  var CFG = window.SIS_CFG || {};
  var STATUSES = CFG.statuses || ["nuevo", "preparando", "listo", "entregado"];
  var LABELS = CFG.statusLabels || {
    nuevo: "Nuevo",
    preparando: "Preparando",
    listo: "Listo",
    entregado: "Entregado",
  };

  var state = load();
  var view = "resumen";
  var selected = null;
  var search = "";

  function clone(x) {
    return JSON.parse(JSON.stringify(x));
  }
  function load() {
    try {
      var r = localStorage.getItem(KEY);
      if (r) return JSON.parse(r);
    } catch (e) {}
    return clone(seed);
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
  function toast(m) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = m;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 1600);
  }
  function byId(list, id) {
    return (list || []).filter(function (x) {
      return x.id === id;
    })[0];
  }
  function label(e) {
    return LABELS[e] || e || "—";
  }
  function badge(e) {
    if (e === "listo" || e === "entregado") return "is-ok";
    if (e === "preparando") return "is-warn";
    if (e === "nuevo") return "";
    return "";
  }
  function platoNombre(id) {
    var p = byId(state.carta, id);
    return p ? p.nombre : "—";
  }
  function platoPrecio(id) {
    var p = byId(state.carta, id);
    return p ? Number(p.precio || 0) : 0;
  }
  function nowHora() {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function nextStatus(cur) {
    var i = STATUSES.indexOf(cur);
    if (i < 0) return STATUSES[0];
    return STATUSES[Math.min(i + 1, STATUSES.length - 1)];
  }

  function showView(name) {
    view = name;
    document.getElementById("view-resumen").classList.toggle("panel-hidden", name !== "resumen");
    document.getElementById("view-cola").classList.toggle("panel-hidden", name !== "cola");
    document.getElementById("view-carta").classList.toggle("panel-hidden", name !== "carta");
    document.querySelectorAll(".panel-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === name);
    });
    document.getElementById("open-create").classList.toggle("panel-hidden", name === "carta");
    var searchWrap = document.getElementById("search-wrap");
    if (searchWrap) searchWrap.hidden = name !== "cola";
    document.getElementById("view-title").textContent =
      name === "carta" ? "Carta" : name === "resumen" ? "Resumen del día" : "Cola del mostrador";
    var f = document.getElementById("create");
    if (f && name === "carta") f.hidden = true;
    var stats = document.getElementById("stats");
    if (stats) stats.classList.toggle("panel-hidden", name === "resumen");
    render();
  }

  function countBy(estado) {
    return (state.items || []).filter(function (x) {
      return x.estado === estado;
    }).length;
  }

  function renderDashboard() {
    var list = state.items || [];
    var activos = list.filter(function (x) {
      return x.estado !== "entregado";
    });
    var listos = list.filter(function (x) {
      return x.estado === "listo";
    });
    var vendido = list
      .filter(function (x) {
        return x.estado === "entregado" || x.estado === "listo";
      })
      .reduce(function (a, x) {
        return a + platoPrecio(x.platoId);
      }, 0);
    var enCola$ = activos.reduce(function (a, x) {
      return a + platoPrecio(x.platoId);
    }, 0);

    var topMap = {};
    list.forEach(function (x) {
      var n = platoNombre(x.platoId);
      topMap[n] = (topMap[n] || 0) + 1;
    });
    var top = Object.keys(topMap)
      .map(function (k) {
        return { nombre: k, n: topMap[k] };
      })
      .sort(function (a, b) {
        return b.n - a.n;
      })
      .slice(0, 4);

    var atencion = listos
      .concat(
        list.filter(function (x) {
          return x.estado === "nuevo";
        })
      )
      .slice(0, 6);

    document.getElementById("dash").innerHTML =
      '<section class="dash-hello">' +
      "<h2>Mostrador de hoy</h2>" +
      "<p>Pedidos en curso, listos para retirar y un estimado de lo movido. Toque un atajo para trabajar.</p>" +
      "</section>" +
      '<div class="dash-cards">' +
      '<article class="dash-card"><span>En cola</span><strong>' +
      activos.length +
      "</strong><small>Sin entregar aún</small></article>" +
      '<article class="dash-card warn"><span>Nuevos</span><strong>' +
      countBy("nuevo") +
      "</strong><small>Acaban de entrar</small></article>" +
      '<article class="dash-card mid"><span>Preparando</span><strong>' +
      countBy("preparando") +
      "</strong><small>En cocina</small></article>" +
      '<article class="dash-card ok"><span>Listos</span><strong>' +
      countBy("listo") +
      "</strong><small>Esperan retiro</small></article>" +
      '<article class="dash-card"><span>Estimado en cola</span><strong>' +
      money(enCola$) +
      "</strong><small>Según carta</small></article>" +
      '<article class="dash-card"><span>Listo + entregado</span><strong>' +
      money(vendido) +
      "</strong><small>Estimado del día</small></article>" +
      "</div>" +
      '<div class="dash-split">' +
      '<section class="dash-panel">' +
      "<h3>Atención ahora</h3>" +
      "<p>Listos y nuevos primero.</p>" +
      '<ul class="dash-activity">' +
      (atencion
        .map(function (x) {
          return (
            '<li data-go="' +
            esc(x.id) +
            '"><strong>' +
            esc(x.hora || "—") +
            " · " +
            esc(x.cliente || "Cliente") +
            "</strong><span>" +
            esc(platoNombre(x.platoId)) +
            " · " +
            esc(label(x.estado)) +
            "</span></li>"
          );
        })
        .join("") ||
        '<li class="dash-empty">Sin pedidos pendientes.</li>') +
      "</ul></section>" +
      '<section class="dash-panel">' +
      "<h3>Más pedidos</h3>" +
      "<p>Ítems de la carta en la cola de ejemplo.</p>" +
      '<ul class="dash-top">' +
      (top
        .map(function (t) {
          return (
            "<li><strong>" +
            esc(t.nombre) +
            "</strong><span>" +
            t.n +
            (t.n === 1 ? " pedido" : " pedidos") +
            "</span></li>"
          );
        })
        .join("") ||
        '<li class="dash-empty">Sin datos aún.</li>') +
      "</ul>" +
      '<div class="dash-shortcuts">' +
      '<button type="button" data-jump="cola"><strong>Ir a la cola</strong><small>Avanzar estados</small></button>' +
      '<button type="button" data-jump="carta"><strong>Editar carta</strong><small>Precios e ítems</small></button>' +
      '<button type="button" data-jump="nuevo"><strong>Nuevo pedido</strong><small>Tomar en mostrador</small></button>' +
      "</div></section></div>";

    document.querySelectorAll("#dash [data-jump]").forEach(function (b) {
      b.onclick = function () {
        var j = b.getAttribute("data-jump");
        if (j === "nuevo") {
          showView("cola");
          var f = document.getElementById("create");
          f.hidden = false;
          fillPlatoSelect();
          var h = f.querySelector("[name=hora]");
          if (h && !h.value) h.value = nowHora();
          f.querySelector("[name=cliente]").focus();
          return;
        }
        showView(j);
      };
    });
    document.querySelectorAll("#dash [data-go]").forEach(function (li) {
      li.onclick = function () {
        selected = li.getAttribute("data-go");
        showView("cola");
      };
    });
  }

  function fillPlatoSelect() {
    var sel = document.querySelector("#create [name=platoId]");
    if (!sel) return;
    sel.innerHTML = (state.carta || [])
      .map(function (p) {
        return (
          '<option value="' +
          esc(p.id) +
          '">' +
          esc(p.nombre) +
          " · " +
          money(p.precio) +
          "</option>"
        );
      })
      .join("");
  }

  function filteredItems() {
    var list = (state.items || []).slice();
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (x) {
        return (
          String(x.cliente || "").toLowerCase().indexOf(q) !== -1 ||
          String(x.tel || "").toLowerCase().indexOf(q) !== -1 ||
          platoNombre(x.platoId).toLowerCase().indexOf(q) !== -1 ||
          String(x.nota || "").toLowerCase().indexOf(q) !== -1 ||
          label(x.estado).toLowerCase().indexOf(q) !== -1
        );
      });
    }
    return list.sort(function (a, b) {
      return String(a.hora || "").localeCompare(String(b.hora || ""));
    });
  }

  function renderStats() {
    var list = state.items || [];
    var html =
      '<div class="stat"><span>En cola</span><strong>' +
      list.filter(function (x) {
        return x.estado !== "entregado";
      }).length +
      "</strong></div>";
    STATUSES.slice(0, 3).forEach(function (st) {
      html +=
        '<div class="stat"><span>' +
        esc(label(st)) +
        "</span><strong>" +
        list.filter(function (x) {
          return x.estado === st;
        }).length +
        "</strong></div>";
    });
    document.getElementById("stats").innerHTML = html;
  }

  function renderKanban() {
    var cols = [
      ["nuevo", "Nuevos"],
      ["preparando", "Preparando"],
      ["listo", "Listos"],
    ];
    var list = filteredItems().filter(function (x) {
      return x.estado !== "entregado";
    });
    document.getElementById("kanban").innerHTML = cols
      .map(function (col) {
        var cards = list
          .filter(function (x) {
            return x.estado === col[0];
          })
          .map(function (x) {
            return (
              '<button type="button" class="kanban-card' +
              (selected === x.id ? " is-on" : "") +
              '" data-id="' +
              esc(x.id) +
              '"><strong>' +
              esc(x.hora || "—") +
              " · " +
              esc(x.cliente || "Cliente") +
              "</strong><span>" +
              esc(platoNombre(x.platoId)) +
              (x.nota ? " · " + esc(x.nota) : "") +
              "</span></button>"
            );
          })
          .join("");
        return (
          '<div class="kanban-col' +
          (col[0] === "preparando" ? " is-mid" : "") +
          (col[0] === "listo" ? " is-ok" : "") +
          '"><h3>' +
          col[1] +
          " (" +
          list.filter(function (x) {
            return x.estado === col[0];
          }).length +
          ")</h3>" +
          (cards || '<p class="empty-col">Vacío</p>') +
          "</div>"
        );
      })
      .join("");

    document.querySelectorAll("#kanban [data-id]").forEach(function (card) {
      card.onclick = function () {
        selected = card.getAttribute("data-id");
        render();
      };
    });
  }

  function renderTable() {
    var list = filteredItems();
    document.getElementById("rows").innerHTML =
      list
        .map(function (x) {
          return (
            '<tr data-id="' +
            esc(x.id) +
            '" class="' +
            (selected === x.id ? "is-on" : "") +
            '"><td>' +
            esc(x.hora || "—") +
            "</td><td>" +
            esc(x.cliente || "—") +
            "</td><td>" +
            esc(platoNombre(x.platoId)) +
            '</td><td><span class="badge-state ' +
            badge(x.estado) +
            '">' +
            esc(label(x.estado)) +
            "</span></td></tr>"
          );
        })
        .join("") || '<tr><td colspan="4">Sin pedidos. Pulse Nuevo pedido.</td></tr>';

    document.querySelectorAll("#rows tr[data-id]").forEach(function (tr) {
      tr.onclick = function () {
        selected = tr.getAttribute("data-id");
        render();
      };
    });
  }

  function renderSheet() {
    var sheet = document.getElementById("sheet");
    var raw = byId(state.items, selected);
    if (!raw) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un pedido de la cola o de la lista.</p>';
      return;
    }
    var precio = platoPrecio(raw.platoId);
    var nxt = nextStatus(raw.estado);
    var body =
      "<h3>" +
      esc(raw.cliente || "Pedido") +
      "</h3>" +
      "<p><strong>" +
      esc(raw.hora || "—") +
      "</strong> · " +
      esc(platoNombre(raw.platoId)) +
      " · " +
      money(precio) +
      "</p>" +
      "<p>Tel: " +
      esc(raw.tel || "—") +
      "</p>" +
      (raw.nota ? "<p>Nota: " + esc(raw.nota) + "</p>" : "") +
      '<p><span class="badge-state ' +
      badge(raw.estado) +
      '">' +
      esc(label(raw.estado)) +
      "</span></p>" +
      '<div class="actions">';

    if (raw.estado !== "entregado") {
      body +=
        '<button type="button" class="primary" id="advance">Pasar a ' +
        esc(label(nxt)) +
        "</button>";
    }
    STATUSES.forEach(function (st) {
      body +=
        '<button type="button" data-s="' +
        esc(st) +
        '">' +
        esc(label(st)) +
        "</button>";
    });
    if (raw.tel) body += '<button type="button" class="primary" id="wa">WhatsApp</button>';
    body += '<button type="button" class="danger" id="del">Eliminar</button></div>';
    sheet.innerHTML = body;

    var adv = sheet.querySelector("#advance");
    if (adv) {
      adv.onclick = function () {
        raw.estado = nxt;
        save();
        toast(label(raw.estado));
        render();
      };
    }
    sheet.querySelectorAll("[data-s]").forEach(function (b) {
      b.onclick = function () {
        raw.estado = b.getAttribute("data-s");
        save();
        toast(label(raw.estado));
        render();
      };
    });
    var wa = sheet.querySelector("#wa");
    if (wa) {
      wa.onclick = function () {
        var msg =
          "Hola " +
          (raw.cliente || "") +
          ", su pedido (" +
          platoNombre(raw.platoId) +
          ") está " +
          label(raw.estado).toLowerCase() +
          ".";
        var url = "https://wa.me/549" + String(raw.tel).replace(/\D/g, "").replace(/^549/, "") + "?text=" + encodeURIComponent(msg);
        window.open(url, "_blank", "noopener");
      };
    }
    var del = sheet.querySelector("#del");
    if (del) {
      del.onclick = function () {
        if (!confirm("¿Eliminar este pedido?")) return;
        state.items = state.items.filter(function (x) {
          return x.id !== raw.id;
        });
        selected = null;
        save();
        toast("Eliminado");
        render();
      };
    }
  }

  function renderCarta() {
    document.getElementById("carta-grid").innerHTML =
      (state.carta || [])
        .map(function (p) {
          return (
            '<article class="mini-card" data-id="' +
            esc(p.id) +
            '"><div class="body"><strong>' +
            esc(p.nombre) +
            "</strong><span>" +
            money(p.precio) +
            '</span><div class="card-actions"><button type="button" data-edit>Editar</button><button type="button" class="danger" data-del>Eliminar</button></div></div></article>'
          );
        })
        .join("") || "<p>Carta vacía. Agregue el primer ítem.</p>";

    document.querySelectorAll("#carta-grid [data-edit]").forEach(function (b) {
      b.onclick = function () {
        var p = byId(state.carta, b.closest("[data-id]").getAttribute("data-id"));
        if (!p) return;
        var f = document.getElementById("create-plato");
        f.id.value = p.id;
        f.nombre.value = p.nombre;
        f.precio.value = p.precio;
        document.getElementById("plato-submit").textContent = "Actualizar";
        document.getElementById("plato-cancel").hidden = false;
      };
    });
    document.querySelectorAll("#carta-grid [data-del]").forEach(function (b) {
      b.onclick = function () {
        var id = b.closest("[data-id]").getAttribute("data-id");
        if (!confirm("¿Eliminar de la carta?")) return;
        state.carta = state.carta.filter(function (p) {
          return p.id !== id;
        });
        save();
        toast("Eliminado");
        render();
      };
    });
  }

  function render() {
    if (!state.items) state.items = [];
    if (!state.carta) state.carta = [];
    renderStats();
    fillPlatoSelect();
    if (view === "resumen") {
      renderDashboard();
      return;
    }
    if (view === "carta") {
      renderCarta();
      return;
    }
    renderKanban();
    renderTable();
    renderSheet();
  }

  document.querySelectorAll(".panel-tabs button").forEach(function (b) {
    b.onclick = function () {
      showView(b.getAttribute("data-view"));
    };
  });

  document.getElementById("open-create").onclick = function () {
    var f = document.getElementById("create");
    f.hidden = !f.hidden;
    if (!f.hidden) {
      fillPlatoSelect();
      var h = f.querySelector("[name=hora]");
      if (h && !h.value) h.value = nowHora();
      f.querySelector("[name=cliente]").focus();
    }
  };

  document.getElementById("search").oninput = function (e) {
    search = e.target.value.trim();
    render();
  };

  document.getElementById("reset-sample").onclick = function () {
    if (!confirm("¿Volver a los datos de ejemplo?")) return;
    localStorage.removeItem(KEY);
    location.reload();
  };

  document.getElementById("create").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var item = {
      id: "x" + Date.now(),
      cliente: String(fd.get("cliente") || "").trim(),
      tel: String(fd.get("tel") || "").trim(),
      platoId: String(fd.get("platoId") || ""),
      nota: String(fd.get("nota") || "").trim(),
      hora: String(fd.get("hora") || nowHora()),
      estado: STATUSES[0],
    };
    if (!item.cliente || !item.platoId) return;
    state.items.unshift(item);
    selected = item.id;
    save();
    ev.target.reset();
    ev.target.hidden = true;
    toast("Pedido tomado");
    render();
  };

  document.getElementById("create-plato").onsubmit = function (ev) {
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var id = String(fd.get("id") || "").trim();
    var nombre = String(fd.get("nombre") || "").trim();
    var precio = Number(fd.get("precio") || 0);
    if (!nombre) return;
    if (id) {
      var p = byId(state.carta, id);
      if (p) {
        p.nombre = nombre;
        p.precio = precio;
      }
      toast("Carta actualizada");
    } else {
      state.carta.unshift({ id: "p" + Date.now(), nombre: nombre, precio: precio });
      toast("Ítem agregado");
    }
    ev.target.reset();
    ev.target.id.value = "";
    document.getElementById("plato-submit").textContent = "Agregar a la carta";
    document.getElementById("plato-cancel").hidden = true;
    save();
    render();
  };

  document.getElementById("plato-cancel").onclick = function () {
    var f = document.getElementById("create-plato");
    f.reset();
    f.id.value = "";
    document.getElementById("plato-submit").textContent = "Agregar a la carta";
    this.hidden = true;
  };

  showView("resumen");
})();
