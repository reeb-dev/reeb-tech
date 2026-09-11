/**
 * Panel kit compartido para sistemas de gestión.
 * Requiere: window.SIS_CFG, window.SIS_SEED
 * Opcional: window.SIS_STORAGE_KEY, window.SIS_DASH
 */
(function () {
  var CFG = window.SIS_CFG || {};
  if (!CFG.slug) return;
  var KEY = window.SIS_STORAGE_KEY || ("sistema-" + CFG.slug + "-v1");
  var seed = window.SIS_SEED || {};
  var DASH = window.SIS_DASH || {};
  var state = load();
  var view = document.querySelector('[data-panel-view="resumen"]') ? "resumen" : CFG.primary || "items";
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
  function labelEstado(e) {
    return (CFG.statusLabels && CFG.statusLabels[e]) || e || "—";
  }
  function listKey() {
    return CFG.listKey || "items";
  }
  function items() {
    return state[listKey()] || (state[listKey()] = []);
  }
  function titleOf(x) {
    x = enrich(x);
    return String(
      x[CFG.row && CFG.row[0]] ||
        x.nombre ||
        x.titulo ||
        x.clienteNombre ||
        x.cliente ||
        x.patente ||
        x.hora ||
        x.id ||
        "Registro"
    );
  }
  function subOf(x) {
    x = enrich(x);
    if (x.detalleLineas) return x.detalleLineas;
    if (x.alerta) return x.alerta + " · stock " + x.stock;
    if (x.progreso) return x.concepto || x.progreso;
    if (x.avancePct) return x.avancePct + (x.extras ? " · " + x.extras : "");
    if (x.platoNombre) return x.platoNombre;
    if (x.detalle) return x.detalle;
    if (x.plan) return x.plan;
    if (CFG.row && CFG.row[1] && x[CFG.row[1]] != null) return String(x[CFG.row[1]]);
    return labelEstado(x.estado);
  }

  function enrich(item) {
    var o = Object.assign({}, item);
    if (item.clienteId && state.clientes) {
      var c = byId(state.clientes, item.clienteId) || {};
      o.clienteNombre = c.nombre || "—";
      o.clienteTel = c.tel || "";
      o.cliente = o.clienteNombre;
    }
    if (item.tecnicoId && state.tecnicos) o.tecnicoNombre = (byId(state.tecnicos, item.tecnicoId) || {}).nombre || "—";
    if (item.choferId && state.choferes) o.choferNombre = (byId(state.choferes, item.choferId) || {}).nombre || "—";
    if (item.parteId && state.partes) o.parteNombre = (byId(state.partes, item.parteId) || {}).nombre || "—";
    if (item.platoId && state.carta) o.platoNombre = (byId(state.carta, item.platoId) || {}).nombre || "—";
    if (item.estado) o.estadoLabel = labelEstado(item.estado);
    if (item.total != null) o.totalMoney = money(item.total);
    if (item.monto != null) o.montoMoney = money(item.monto);
    if (item.sena != null) o.senaMoney = money(item.sena);
    if (item.presupuesto != null) o.presupuestoMoney = money(item.presupuesto);
    if (item.avance != null) o.avancePct = item.avance + "%";
    if (item.cuotas != null) {
      o.progreso = (item.pagadas || 0) + "/" + item.cuotas;
      o.planEstado = Number(item.pagadas || 0) >= Number(item.cuotas) ? "Cancelado" : "Activo";
    }
    if (item.lineas)
      o.detalleLineas = item.lineas
        .map(function (l) {
          return l.nombre + " x" + l.cant;
        })
        .join(", ");
    if (item.stock != null && item.minimo != null)
      o.alerta = Number(item.stock) < Number(item.minimo) ? "Bajo mínimo" : "Ok";
    return o;
  }

  function showView(name) {
    view = name;
    document.querySelectorAll("[data-panel-view]").forEach(function (el) {
      el.classList.toggle("panel-hidden", el.getAttribute("data-panel-view") !== name);
    });
    document.querySelectorAll(".panel-tabs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-view") === name);
    });
    var oc = document.getElementById("open-create");
    if (oc) oc.classList.toggle("panel-hidden", name !== CFG.primary && name !== "resumen");
    var sw = document.getElementById("search-wrap");
    if (sw) sw.hidden = name === "resumen";
    var stats = document.getElementById("stats");
    if (stats) stats.classList.toggle("panel-hidden", name === "resumen");
    var titles = Object.assign({ resumen: "Resumen del día" }, CFG.tabTitles || {});
    var vt = document.getElementById("view-title");
    if (vt) vt.textContent = titles[name] || name;
    var f = document.getElementById("create");
    if (f && name !== CFG.primary && name !== "resumen") f.hidden = true;
    render();
  }

  function fillSelects(form) {
    if (!form) return;
    form.querySelectorAll("select[data-source]").forEach(function (sel) {
      var src = sel.getAttribute("data-source");
      var list = state[src] || [];
      sel.innerHTML = list
        .map(function (x) {
          var extra = x.precio != null ? " · " + money(x.precio) : x.rol ? " · " + x.rol : "";
          return '<option value="' + esc(x.id) + '">' + esc(x.nombre || x.id) + esc(extra) + "</option>";
        })
        .join("");
    });
  }

  function renderStats() {
    var el = document.getElementById("stats");
    if (!el || view === "resumen") return;
    var list = items();
    var html = '<div class="stat"><span>Registros</span><strong>' + list.length + "</strong></div>";
    if (CFG.statuses && CFG.statuses.length) {
      CFG.statuses.slice(0, 3).forEach(function (st) {
        html +=
          '<div class="stat"><span>' +
          esc(labelEstado(st)) +
          "</span><strong>" +
          list.filter(function (x) {
            return x.estado === st;
          }).length +
          "</strong></div>";
      });
    } else if (CFG.slug === "stockalertas" || CFG.slug === "inventario") {
      var low = list.filter(function (x) {
        return Number(x.stock) < Number(x.minimo);
      }).length;
      html += '<div class="stat"><span>Bajo mínimo</span><strong>' + low + "</strong></div>";
      html += '<div class="stat"><span>Movimientos</span><strong>' + (state.movs || []).length + "</strong></div>";
    } else {
      html += '<div class="stat"><span>Activos</span><strong>' + list.length + "</strong></div>";
    }
    el.innerHTML = html;
  }

  function dashCopy() {
    var slug = CFG.slug;
    var map = {
      mayorista: ["Despacho de hoy", "Pedidos pendientes, en camino y entregados."],
      ordenes: ["Taller de hoy", "Órdenes por estado y lo que hay que avisar."],
      visitas: ["Ruta de hoy", "Visitas pendientes y técnicos en campo."],
      stockalertas: ["Depósito de hoy", "Qué pedir y movimientos recientes."],
      cuotas: ["Cobros de hoy", "Planes activos, atrasados y al día."],
      obra: ["Obras en curso", "Avance, presupuestos y extras."],
      eventos: ["Agenda del salón", "Próximos eventos, señas y checklist."],
      fichas: ["Consultorio", "Próximos controles e historial reciente."],
      flota: ["Flota del local", "Km, VTV y seguros a controlar."],
      reparto: ["Repartos del día", "Por chofer: pendientes y en ruta."],
      contratos: ["Vencimientos", "Contratos a renovar y vigentes."],
      abonos: ["Suscripciones", "Al día vs mora este período."],
      comandas: ["Salón de hoy", "Mesas abiertas, cocina y listas."],
      turnos: ["Agenda de hoy", "Turnos, en curso y ausentes."],
      cotizaciones: ["Presupuestos", "Borradores, enviados y aceptados."],
      reservas: ["Ocupación", "Consultas, confirmadas y en casa."],
      cuentacorriente: ["Cuentas", "Saldos y movimientos del ejemplo."],
      takeaway: ["Mostrador", "Cola, listos y entregados."],
      inventario: ["Inventario", "Alertas, stock y movimientos."],
    };
    return map[slug] || ["Resumen", "Estado general de este ejemplo."];
  }

  function renderDashboard() {
    var root = document.getElementById("dash");
    if (!root) return;
    var list = items();
    var statuses = CFG.statuses || [];
    var cards = "";
    if (CFG.slug === "stockalertas" || (list[0] && list[0].stock != null)) {
      var low = list.filter(function (x) {
        return Number(x.stock) < Number(x.minimo);
      }).length;
      cards =
        '<article class="dash-card warn"><span>Pedir</span><strong>' +
        low +
        "</strong><small>Bajo mínimo</small></article>" +
        '<article class="dash-card ok"><span>Ok</span><strong>' +
        (list.length - low) +
        "</strong><small>En rango</small></article>" +
        '<article class="dash-card"><span>Ítems</span><strong>' +
        list.length +
        "</strong><small>En depósito</small></article>" +
        '<article class="dash-card"><span>Movimientos</span><strong>' +
        (state.movs || []).length +
        "</strong><small>Registro</small></article>";
    } else if (statuses.length) {
      cards = statuses
        .slice(0, 4)
        .map(function (st, i) {
          var cls = i === 0 ? "warn" : i === statuses.length - 1 || /listo|ok|entreg|cerrad|acept|al_dia|vigente/i.test(st) ? "ok" : "mid";
          var n = list.filter(function (x) {
            return x.estado === st;
          }).length;
          return (
            '<article class="dash-card ' +
            cls +
            '"><span>' +
            esc(labelEstado(st)) +
            "</span><strong>" +
            n +
            "</strong><small>Registros</small></article>"
          );
        })
        .join("");
    } else {
      cards =
        '<article class="dash-card"><span>Total</span><strong>' +
        list.length +
        "</strong><small>Registros</small></article>";
    }

    var attention = list.slice().sort(function (a, b) {
      var aw = /mora|pend|nuevo|consulta|bajo|por_renovar|atras/i.test(String(a.estado || a.alerta || "")) ? 0 : 1;
      var bw = /mora|pend|nuevo|consulta|bajo|por_renovar|atras/i.test(String(b.estado || b.alerta || "")) ? 0 : 1;
      return aw - bw;
    });
    if (list[0] && list[0].stock != null) {
      attention = list
        .filter(function (x) {
          return Number(x.stock) < Number(x.minimo);
        })
        .concat(list.filter(function (x) {
          return Number(x.stock) >= Number(x.minimo);
        }));
    }
    attention = attention.slice(0, 6);
    var copy = dashCopy();
    var jumps = (CFG.tabs || [CFG.primary]).filter(Boolean).slice(0, 3);

    root.innerHTML =
      '<section class="dash-hello"><h2>' +
      esc(DASH.title || copy[0]) +
      "</h2><p>" +
      esc(DASH.lead || copy[1]) +
      "</p></section>" +
      '<div class="dash-cards">' +
      cards +
      "</div>" +
      '<div class="dash-split"><section class="dash-panel"><h3>Atención ahora</h3><p>Lo que conviene mirar primero.</p><ul class="dash-activity">' +
      (attention
        .map(function (x) {
          return (
            '<li data-go="' +
            esc(x.id) +
            '"><strong>' +
            esc(titleOf(x)) +
            "</strong><span>" +
            esc(subOf(x)) +
            "</span></li>"
          );
        })
        .join("") || '<li class="dash-empty">Sin pendientes destacados.</li>') +
      '</ul></section><section class="dash-panel"><h3>Atajos</h3><p>Ir a trabajar en una vista.</p><div class="dash-shortcuts">' +
      jumps
        .map(function (t) {
          return (
            '<button type="button" data-jump="' +
            esc(t) +
            '"><strong>' +
            esc((CFG.tabTitles && CFG.tabTitles[t]) || t) +
            "</strong><small>Abrir vista</small></button>"
          );
        })
        .join("") +
      '<button type="button" data-jump="nuevo"><strong>Nuevo</strong><small>Alta rápida</small></button>' +
      "</div></section></div>";

    root.querySelectorAll("[data-jump]").forEach(function (b) {
      b.onclick = function () {
        var j = b.getAttribute("data-jump");
        if (j === "nuevo") {
          showView(CFG.primary);
          var f = document.getElementById("create");
          if (f) {
            f.hidden = false;
            fillSelects(f);
            var first = f.querySelector("input,select,textarea");
            if (first) first.focus();
          }
          return;
        }
        showView(j);
      };
    });
    root.querySelectorAll("[data-go]").forEach(function (li) {
      li.onclick = function () {
        selected = li.getAttribute("data-go");
        showView(CFG.primary);
      };
    });
  }

  function renderKanban() {
    var host = document.getElementById("kanban");
    if (!host || !CFG.statuses || !CFG.statuses.length) return;
    var list = items().map(enrich);
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (x) {
        return JSON.stringify(x).toLowerCase().indexOf(q) !== -1;
      });
    }
    var cols = CFG.statuses.filter(function (st) {
      return !/entregado|cerrada|checkout|baja|rechazado/i.test(st) || list.some(function (x) {
        return x.estado === st;
      });
    }).slice(0, 4);
    host.innerHTML = cols
      .map(function (st, i) {
        var col = list.filter(function (x) {
          return x.estado === st;
        });
        var cls = i === 1 ? " is-mid" : i === 2 ? " is-ok" : "";
        return (
          '<div class="kanban-col' +
          cls +
          '"><h3>' +
          esc(labelEstado(st)) +
          " (" +
          col.length +
          ")</h3>" +
          (col
            .map(function (x) {
              return (
                '<button type="button" class="kanban-card' +
                (selected === x.id ? " is-on" : "") +
                '" data-id="' +
                esc(x.id) +
                '"><strong>' +
                esc(titleOf(x)) +
                "</strong><span>" +
                esc(subOf(x)) +
                "</span></button>"
              );
            })
            .join("") || '<p class="empty-col">Vacío</p>') +
          "</div>"
        );
      })
      .join("");
    host.querySelectorAll("[data-id]").forEach(function (card) {
      card.onclick = function () {
        selected = card.getAttribute("data-id");
        render();
      };
    });
  }

  function renderPrimary() {
    var list = items().map(enrich);
    if (search) {
      var q = search.toLowerCase();
      list = list.filter(function (x) {
        return JSON.stringify(x).toLowerCase().indexOf(q) !== -1;
      });
    }
    var cols = CFG.columns || [];
    var rowsEl = document.getElementById("rows");
    if (rowsEl) {
      rowsEl.innerHTML =
        list
          .map(function (x) {
            return (
              '<tr data-id="' +
              esc(x.id) +
              '" class="' +
              (selected === x.id ? "is-on" : "") +
              '">' +
              (CFG.row || [])
                .map(function (k) {
                  return "<td>" + esc(String(x[k] != null ? x[k] : "—")) + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("") ||
        '<tr><td colspan="' + (cols.length || 4) + '">Sin datos. Pulse Nuevo.</td></tr>';
      rowsEl.querySelectorAll("tr[data-id]").forEach(function (tr) {
        tr.onclick = function () {
          selected = tr.getAttribute("data-id");
          render();
        };
      });
    }
    renderKanban();

    var sheet = document.getElementById("sheet");
    if (!sheet) return;
    var raw = byId(items(), selected);
    if (!raw) {
      sheet.innerHTML = '<p class="empty-sheet">Elija un registro.</p>';
      return;
    }
    var x = enrich(raw);
    var body = "<h3>" + esc(titleOf(raw)) + "</h3>";
    (CFG.row || []).forEach(function (k, i) {
      if (i === 0) return;
      body += "<p>" + esc(String(x[k] != null ? x[k] : "—")) + "</p>";
    });
    if (raw.lineas && raw.lineas.length) {
      body +=
        "<ul>" +
        raw.lineas
          .map(function (l) {
            return "<li>" + esc(l.nombre) + " ×" + esc(l.cant) + "</li>";
          })
          .join("") +
        "</ul>";
    }
    if (raw.notas && raw.notas.length) {
      body += raw.notas
        .map(function (n) {
          return "<p>" + esc(n.fecha) + " · " + esc(n.texto) + "</p>";
        })
        .join("");
    }
    if (raw.check) body += "<p>Checklist: " + esc(raw.check.join(", ")) + "</p>";
    body += '<div class="actions">';
    if (CFG.statuses && CFG.statuses.length) {
      var ix = CFG.statuses.indexOf(raw.estado);
      var nxt = CFG.statuses[Math.min(Math.max(ix, 0) + 1, CFG.statuses.length - 1)];
      if (nxt && nxt !== raw.estado)
        body +=
          '<button type="button" class="primary" id="advance">Pasar a ' +
          esc(labelEstado(nxt)) +
          "</button>";
      CFG.statuses.forEach(function (st) {
        body += '<button type="button" data-s="' + esc(st) + '">' + esc(labelEstado(st)) + "</button>";
      });
    }
    if (CFG.payCuota) body += '<button type="button" id="pay">Registrar cuota</button>';
    if (CFG.addNota) body += '<button type="button" id="addnota">Agregar nota</button>';
    if (CFG.wa) body += '<button type="button" class="primary" id="wa">WhatsApp</button>';
    body += '<button type="button" class="danger" id="del">Eliminar</button></div>';
    sheet.innerHTML = body;

    var adv = sheet.querySelector("#advance");
    if (adv)
      adv.onclick = function () {
        var ix = CFG.statuses.indexOf(raw.estado);
        raw.estado = CFG.statuses[Math.min(ix + 1, CFG.statuses.length - 1)];
        save();
        toast(labelEstado(raw.estado));
        render();
      };
    sheet.querySelectorAll("[data-s]").forEach(function (b) {
      b.onclick = function () {
        raw.estado = b.getAttribute("data-s");
        save();
        toast(labelEstado(raw.estado));
        render();
      };
    });
    var del = sheet.querySelector("#del");
    if (del)
      del.onclick = function () {
        if (!confirm("¿Eliminar?")) return;
        state[listKey()] = items().filter(function (i) {
          return i.id !== raw.id;
        });
        selected = null;
        save();
        toast("Eliminado");
        render();
      };
    var wa = sheet.querySelector("#wa");
    if (wa)
      wa.onclick = function () {
        var msg =
          "Hola " +
          (x.clienteNombre || x.cliente || "") +
          ", le escribimos por " +
          (CFG.title || "su gestión") +
          ".";
        if (navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(msg).then(function () {
            toast("Copiado");
          });
      };
    var pay = sheet.querySelector("#pay");
    if (pay)
      pay.onclick = function () {
        raw.pagadas = Math.min(Number(raw.cuotas || 0), Number(raw.pagadas || 0) + 1);
        save();
        toast("Cuota registrada");
        render();
      };
    var an = sheet.querySelector("#addnota");
    if (an)
      an.onclick = function () {
        var t = window.prompt("Nota");
        if (!t) return;
        raw.notas = raw.notas || [];
        raw.notas.unshift({ fecha: "2026-09-11", texto: t });
        save();
        toast("Nota ok");
        render();
      };
  }

  function renderRelated(name) {
    var wrap = document.querySelector('[data-panel-view="' + name + '"]');
    var grid = wrap ? wrap.querySelector(".related-grid") : null;
    if (!grid) return;
    if (name === "movimientos" || name === "movs") {
      grid.innerHTML =
        '<div class="list"><div class="table-scroll"><table><thead><tr><th>Fecha</th><th>Ítem</th><th>Tipo</th><th>Cant</th></tr></thead><tbody>' +
        (state.movs || [])
          .map(function (m) {
            var it = byId(state.items, m.itemId) || {};
            return (
              "<tr><td>" +
              esc(m.fecha) +
              "</td><td>" +
              esc(it.nombre || "—") +
              "</td><td>" +
              esc(m.tipo) +
              "</td><td>" +
              esc(m.cant) +
              "</td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div></div>";
      return;
    }
    if (name === "alertas") {
      var low = (state.items || []).filter(function (x) {
        return Number(x.stock) < Number(x.minimo);
      });
      grid.innerHTML =
        low
          .map(function (x) {
            return (
              '<article class="mini-card"><div class="body"><strong>' +
              esc(x.nombre) +
              "</strong><span>Stock " +
              esc(x.stock) +
              " / mín " +
              esc(x.minimo) +
              "</span></div></article>"
            );
          })
          .join("") || "<p>Sin alertas.</p>";
      return;
    }
    if (name === "services") {
      grid.innerHTML =
        (state.services || [])
          .map(function (s) {
            var v = byId(state.items, s.vehiculoId) || {};
            return (
              '<article class="mini-card"><div class="body"><strong>' +
              esc(v.patente || "—") +
              "</strong><span>" +
              esc(s.fecha) +
              " · " +
              esc(s.detalle) +
              "</span></div></article>"
            );
          })
          .join("") || "<p>Sin services.</p>";
      return;
    }
    var key = name;
    if (name === "lista") key = "lista";
    if (name === "carta") key = "carta";
    if (name === "clientes") key = "clientes";
    if (name === "tecnicos") key = "tecnicos";
    if (name === "choferes") key = "choferes";
    if (name === "partes") key = "partes";
    var list = state[key] || [];
    var form = document.getElementById("create-related");
    if (form) form.setAttribute("data-target", key);
    grid.innerHTML =
      list
        .map(function (x) {
          return (
            '<article class="mini-card" data-id="' +
            esc(x.id) +
            '"><div class="body"><strong>' +
            esc(x.nombre || x.rol || x.id) +
            "</strong><span>" +
            esc(x.tel || x.dir || x.rol || (x.precio != null ? money(x.precio) : "") || "") +
            '</span><div class="card-actions"><button type="button" class="danger" data-del>Eliminar</button></div></div></article>'
          );
        })
        .join("") || "<p>Vacío.</p>";
    grid.querySelectorAll("[data-del]").forEach(function (b) {
      b.onclick = function () {
        var id = b.closest("[data-id]").getAttribute("data-id");
        if (!confirm("¿Eliminar?")) return;
        state[key] = state[key].filter(function (i) {
          return i.id !== id;
        });
        save();
        toast("Eliminado");
        render();
      };
    });
  }

  function render() {
    renderStats();
    fillSelects(document.getElementById("create"));
    if (view === "resumen") return renderDashboard();
    if (view === CFG.primary) return renderPrimary();
    renderRelated(view);
  }

  document.querySelectorAll(".panel-tabs button").forEach(function (b) {
    b.onclick = function () {
      showView(b.getAttribute("data-view"));
    };
  });
  var oc = document.getElementById("open-create");
  if (oc)
    oc.onclick = function () {
      if (view === "resumen") showView(CFG.primary);
      var f = document.getElementById("create");
      if (!f) return;
      f.hidden = !f.hidden;
      fillSelects(f);
    };
  var searchEl = document.getElementById("search");
  if (searchEl)
    searchEl.oninput = function (e) {
      search = e.target.value.trim();
      render();
    };
  var reset = document.getElementById("reset-sample");
  if (reset)
    reset.onclick = function () {
      if (!confirm("¿Restablecer ejemplo?")) return;
      localStorage.removeItem(KEY);
      location.reload();
    };

  var create = document.getElementById("create");
  if (create)
    create.onsubmit = function (ev) {
      ev.preventDefault();
      var fd = new FormData(ev.target);
      var item = { id: CFG.slug[0] + Date.now() };
      (CFG.form || []).forEach(function (field) {
        var name = field[0];
        item[name] = String(fd.get(name) || "");
        if (field[2] === "number") item[name] = Number(item[name] || 0);
      });
      if (CFG.statuses && CFG.statuses.length) item.estado = CFG.statuses[0];
      if (CFG.slug === "ordenes" || CFG.slug === "mayorista") item.fecha = "2026-09-11";
      if (CFG.slug === "takeaway") item.hora = new Date().toTimeString().slice(0, 5);
      if (CFG.slug === "cuotas") {
        item.pagadas = 0;
        item.desde = "2026-09-11";
      }
      if (CFG.slug === "fichas") item.notas = [];
      if (CFG.slug === "eventos") item.check = ["Salón"];
      if (CFG.slug === "abonos") {
        item.estado = "al_dia";
        item.ultimo = "2026-09-11";
      }
      if (CFG.slug === "mayorista") {
        var li = byId(state.lista, item.listaId) || {};
        item.lineas = [{ nombre: li.nombre || "Ítem", cant: Number(item.cant || 1), monto: li.precio || 0 }];
        item.estado = "pendiente";
        item.fecha = "2026-09-11";
        delete item.listaId;
        delete item.cant;
      }
      items().unshift(item);
      selected = item.id;
      save();
      ev.target.reset();
      ev.target.hidden = true;
      toast("Guardado");
      render();
    };

  var rel = document.getElementById("create-related");
  if (rel)
    rel.onsubmit = function (ev) {
      ev.preventDefault();
      var fd = new FormData(ev.target);
      var target = rel.getAttribute("data-target") || "clientes";
      var neu = { id: "r" + Date.now(), nombre: String(fd.get("nombre") || "").trim() };
      if (fd.get("tel") != null) neu.tel = String(fd.get("tel") || "");
      if (fd.get("extra")) {
        var ex = String(fd.get("extra"));
        if (target === "lista" || target === "carta") {
          neu.precio = Number(ex) || 0;
          if (target === "lista") neu.minimo = 1;
        } else if (target === "partes") neu.rol = ex;
        else if (target === "clientes") neu.dir = ex;
      }
      state[target] = state[target] || [];
      state[target].unshift(neu);
      save();
      ev.target.reset();
      toast("Alta ok");
      render();
    };

  var mov = document.getElementById("create-mov");
  if (mov)
    mov.onsubmit = function (ev) {
      ev.preventDefault();
      var fd = new FormData(ev.target);
      var itemId = String(fd.get("itemId"));
      var tipo = String(fd.get("tipo"));
      var cant = Number(fd.get("cant") || 0);
      var it = byId(state.items, itemId);
      if (!it) return;
      it.stock = Number(it.stock || 0) + (tipo === "entrada" ? cant : -cant);
      state.movs = state.movs || [];
      state.movs.unshift({
        id: "m" + Date.now(),
        itemId: itemId,
        tipo: tipo,
        cant: cant,
        fecha: "2026-09-11",
        detalle: String(fd.get("detalle") || ""),
      });
      save();
      ev.target.reset();
      toast("Movimiento ok");
      render();
    };

  if (document.getElementById("dash") || document.querySelector('[data-panel-view="resumen"]')) {
    showView(document.querySelector('.panel-tabs button[data-view="resumen"]') ? "resumen" : view);
  } else {
    showView(CFG.primary || view);
  }
})();
