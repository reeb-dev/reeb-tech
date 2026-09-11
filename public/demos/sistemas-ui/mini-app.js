/**
 * Mini app CRUD for sistema landings.
 * Shares localStorage with panel.js: sistema-<slug>-v1 (scaffold) or known keys.
 */
(function () {
  var CFG = window.SIS_CFG || {};
  var slug = CFG.slug || (document.body.className.match(/sys-([a-z]+)/) || [])[1] || "";
  var KEY = window.SIS_STORAGE_KEY || ("sistema-" + slug + "-v1");
  var seed = window.SIS_SEED || {};
  var state = load();
  var root = document.getElementById("app");
  if (!root) return;

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
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function uid(p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function toast(m) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "mini-toast";
      document.body.appendChild(el);
    }
    el.textContent = m;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 1600);
  }
  function byId(list, id) {
    return (list || []).filter(function (x) { return x.id === id; })[0];
  }
  function listKey() { return CFG.listKey || "items"; }
  function items() { return state[listKey()] || (state[listKey()] = []); }

  function toolbar(extra) {
    return (
      '<div class="mini-bar" role="toolbar" aria-label="Acciones">' +
      '<button type="button" class="btn" id="mini-new">Nuevo</button>' +
      '<button type="button" class="btn-ghost" id="mini-reset">Restablecer</button>' +
      (extra || "") +
      "</div>"
    );
  }

  function bindBar(onNew) {
    var n = document.getElementById("mini-new");
    if (n) n.onclick = onNew;
    var r = document.getElementById("mini-reset");
    if (r) {
      r.onclick = function () {
        if (!confirm("¿Volver a los datos de ejemplo?")) return;
        localStorage.removeItem(KEY);
        state = clone(seed);
        save();
        toast("Ejemplo restablecido");
        render();
      };
    }
  }

  function closeModal() {
    var m = document.getElementById("sis-modal");
    if (m) m.remove();
  }

  function openForm(opts, done) {
    closeModal();
    opts = opts || {};
    var fields = opts.fields || [];
    var values = Object.assign({}, opts.values || {});
    var overlay = document.createElement("div");
    overlay.id = "sis-modal";
    overlay.className = "sis-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", opts.title || "Formulario");

    var body = fields
      .map(function (f, i) {
        var cur = values[f.key] != null ? values[f.key] : f.def != null ? f.def : "";
        var id = "sis-f-" + i;
        var req = f.required ? " *" : "";
        var html =
          '<label class="sis-field" for="' +
          id +
          '"><span>' +
          esc(f.label) +
          req +
          "</span>";
        if (f.type === "select") {
          html +=
            '<select id="' +
            id +
            '" name="' +
            esc(f.key) +
            '"' +
            (f.required ? " required" : "") +
            ">" +
            (f.options || [])
              .map(function (o) {
                var val = typeof o === "object" ? o.value : o;
                var lab = typeof o === "object" ? o.label : o;
                return (
                  '<option value="' +
                  esc(val) +
                  '"' +
                  (String(cur) === String(val) ? " selected" : "") +
                  ">" +
                  esc(lab) +
                  "</option>"
                );
              })
              .join("") +
            "</select>";
        } else if (f.type === "textarea") {
          html +=
            '<textarea id="' +
            id +
            '" name="' +
            esc(f.key) +
            '" rows="' +
            (f.rows || 3) +
            '"' +
            (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") +
            (f.required ? " required" : "") +
            ">" +
            esc(cur) +
            "</textarea>";
        } else {
          var t = f.type || "text";
          html +=
            '<input id="' +
            id +
            '" name="' +
            esc(f.key) +
            '" type="' +
            t +
            '" value="' +
            esc(cur) +
            '"' +
            (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : "") +
            (f.min != null ? ' min="' + esc(f.min) + '"' : "") +
            (f.max != null ? ' max="' + esc(f.max) + '"' : "") +
            (f.step != null ? ' step="' + esc(f.step) + '"' : "") +
            (f.required ? " required" : "") +
            ">";
        }
        return html + "</label>";
      })
      .join("");

    overlay.innerHTML =
      '<div class="sis-modal-card">' +
      "<header><h2>" +
      esc(opts.title || "Formulario") +
      "</h2>" +
      (opts.hint ? "<p>" + esc(opts.hint) + "</p>" : "") +
      "</header>" +
      '<form id="sis-form" class="sis-form">' +
      body +
      '<div class="sis-form-actions">' +
      '<button type="button" class="btn-ghost" data-cancel>Cancelar</button>' +
      '<button type="submit" class="btn">' +
      esc(opts.saveLabel || "Guardar") +
      "</button>" +
      "</div></form></div>";

    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      overlay.classList.add("open");
    });

    var form = overlay.querySelector("#sis-form");
    var first = form.querySelector("input, select, textarea");
    if (first) setTimeout(function () { first.focus(); }, 40);

    function finish(data) {
      overlay.classList.remove("open");
      setTimeout(function () {
        closeModal();
        done(data);
      }, 140);
    }

    overlay.querySelector("[data-cancel]").onclick = function () {
      finish(null);
    };
    overlay.addEventListener("click", function (ev) {
      if (ev.target === overlay) finish(null);
    });
    document.addEventListener(
      "keydown",
      function onKey(ev) {
        if (ev.key === "Escape") {
          document.removeEventListener("keydown", onKey);
          finish(null);
        }
      },
      { once: true }
    );

    form.onsubmit = function (ev) {
      ev.preventDefault();
      var out = Object.assign({}, values);
      var ok = true;
      fields.forEach(function (f, i) {
        var el = document.getElementById("sis-f-" + i);
        if (!el) return;
        var v = el.value;
        if (f.required && !String(v).trim()) {
          ok = false;
          el.classList.add("invalid");
        } else el.classList.remove("invalid");
        if (f.type === "number") out[f.key] = Number(v || 0);
        else out[f.key] = v;
      });
      if (!ok) {
        toast("Complete los campos obligatorios");
        return;
      }
      finish(out);
    };
  }

  function openChoice(opts, done) {
    closeModal();
    opts = opts || {};
    var overlay = document.createElement("div");
    overlay.id = "sis-modal";
    overlay.className = "sis-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="sis-modal-card">' +
      "<header><h2>" +
      esc(opts.title || "Elegir") +
      "</h2>" +
      (opts.hint ? "<p>" + esc(opts.hint) + "</p>" : "") +
      "</header>" +
      '<div class="sis-choice">' +
      (opts.choices || [])
        .map(function (c) {
          return (
            '<button type="button" class="' +
            (c.danger ? "danger" : "") +
            '" data-choice="' +
            esc(c.id) +
            '"><span>' +
            esc(c.label) +
            "</span>" +
            (c.hint ? "<em>" + esc(c.hint) + "</em>" : "") +
            "</button>"
          );
        })
        .join("") +
      '</div><div class="sis-form-actions" style="margin-top:1rem">' +
      '<button type="button" class="btn-ghost" data-cancel>Cancelar</button></div></div>';

    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      overlay.classList.add("open");
    });

    function finish(data) {
      overlay.classList.remove("open");
      setTimeout(function () {
        closeModal();
        done(data);
      }, 140);
    }

    overlay.querySelector("[data-cancel]").onclick = function () {
      finish(null);
    };
    overlay.addEventListener("click", function (ev) {
      if (ev.target === overlay) finish(null);
    });
    overlay.querySelectorAll("[data-choice]").forEach(function (b) {
      b.onclick = function () {
        finish(b.getAttribute("data-choice"));
      };
    });
  }

  function fieldDefsFromCfg(formCfg) {
    return (formCfg || []).map(function (f) {
      var type = "text";
      var key = f[0];
      var label = f[1];
      var hint = f[2] || "";
      if (hint === "number" || /monto|total|precio|stock|cuota|persona|sena|km|avance/i.test(key + label))
        type = "number";
      else if (hint === "date" || /fecha|vence|desde|hasta|proxima|vtv|seguro/i.test(key)) type = "date";
      else if (/hora/i.test(key)) type = "time";
      else if (/nota|detalle|menu|extras|check/i.test(key)) type = "textarea";
      else if (String(hint).indexOf("select:") === 0) type = "select";
      var out = { key: key, label: label, type: type };
      if (type === "number") {
        out.min = 0;
        out.step = 1;
        out.def = 0;
      }
      if (type === "select") {
        var src = String(hint).slice(7);
        out.options = (state[src] || []).map(function (x) {
          return { value: x.id, label: x.nombre || x.titulo || x.id };
        });
        if (!out.options.length) out.options = [{ value: "", label: "—" }];
      }
      if (/nombre|cliente|huesped|titulo|patente/i.test(key)) out.required = true;
      return out;
    });
  }

  /* ——— Renderers ——— */

  function renderStock() {
    var list = items().slice().sort(function (a, b) {
      var al = Number(a.stock) < Number(a.minimo) ? 0 : 1;
      var bl = Number(b.stock) < Number(b.minimo) ? 0 : 1;
      return al - bl;
    });
    var low = list.filter(function (x) { return Number(x.stock) < Number(x.minimo); }).length;
    root.innerHTML =
      '<aside class="app-side"><p class="side-kicker">Vista</p>' +
      '<button type="button" class="on">Alertas (' + low + ")</button>" +
      "<button type=\"button\" disabled>Todo el stock</button>" +
      '<p class="side-note">Datos en este navegador. Igual que el panel.</p></aside>' +
      '<section class="app-main">' +
      toolbar() +
      "<div class=\"app-head\"><h1>Hay que pedir hoy</h1><p>Toque un ítem para editar stock o borrar.</p></div>" +
      '<div class="stock-meter"><div><strong>' + low + "</strong><span>Pedir</span></div>" +
      "<div><strong>" + (list.length - low) + "</strong><span>Ok</span></div>" +
      "<div><strong>" + list.length + "</strong><span>Total</span></div></div>" +
      '<ul class="stock-rows">' +
      list
        .map(function (x) {
          var ask = Number(x.stock) < Number(x.minimo);
          var diff = Number(x.stock) - Number(x.minimo);
          return (
            '<li class="' + (ask ? "ask" : "ok") + '" data-id="' + esc(x.id) + '">' +
            "<b>" + (ask ? "PEDIR" : "OK") + "</b>" +
            "<div><strong>" + esc(x.nombre) + "</strong><span>" +
            esc(x.stock) + " en stock · mínimo " + esc(x.minimo) +
            (x.unidad ? " · " + esc(x.unidad) : "") +
            "</span></div><em>" + (diff >= 0 ? "+" : "") + diff + "</em></li>"
          );
        })
        .join("") +
      "</ul></section>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo ítem",
          hint: "Queda guardado en este navegador.",
          saveLabel: "Agregar",
          fields: [
            { key: "nombre", label: "Nombre del producto", required: true, placeholder: "Ej. Aceite 1L" },
            { key: "stock", label: "Stock actual", type: "number", def: 0, min: 0 },
            { key: "minimo", label: "Mínimo para alertar", type: "number", def: 5, min: 0 },
            { key: "unidad", label: "Unidad", def: "u", placeholder: "u, kg, caja…" },
          ],
        },
        function (row) {
          if (!row) return;
          row.id = uid("i");
          items().unshift(row);
          save();
          toast("Ítem agregado");
          render();
        }
      );
    });

    root.querySelectorAll(".stock-rows li").forEach(function (li) {
      li.onclick = function () {
        var id = li.getAttribute("data-id");
        var raw = byId(items(), id);
        if (!raw) return;
        openChoice(
          {
            title: raw.nombre,
            hint: "Stock " + raw.stock + " · mínimo " + raw.minimo,
            choices: [
              { id: "editar", label: "Editar ficha", hint: "Nombre, stock, mínimo" },
              { id: "entrada", label: "Entrada de stock", hint: "Sumar unidades" },
              { id: "salida", label: "Salida de stock", hint: "Restar unidades" },
              { id: "borrar", label: "Eliminar", hint: "No se puede deshacer", danger: true },
            ],
          },
          function (action) {
            if (!action) return;
            if (action === "borrar") {
              if (!confirm("¿Eliminar " + raw.nombre + "?")) return;
              state[listKey()] = items().filter(function (x) { return x.id !== id; });
              save();
              toast("Eliminado");
              render();
              return;
            }
            if (action === "entrada" || action === "salida") {
              openForm(
                {
                  title: action === "entrada" ? "Entrada de stock" : "Salida de stock",
                  hint: raw.nombre,
                  saveLabel: "Confirmar",
                  fields: [{ key: "cant", label: "Cantidad", type: "number", def: 1, min: 1, required: true }],
                },
                function (row) {
                  if (!row || !row.cant) return;
                  var n = Number(row.cant);
                  raw.stock = Number(raw.stock || 0) + (action === "entrada" ? n : -n);
                  if (raw.stock < 0) raw.stock = 0;
                  state.movs = state.movs || [];
                  state.movs.unshift({
                    id: uid("m"),
                    itemId: id,
                    tipo: action,
                    cant: n,
                    fecha: "2026-09-11",
                    detalle: "Desde página de ejemplo",
                  });
                  save();
                  toast(action === "entrada" ? "Entrada ok" : "Salida ok");
                  render();
                }
              );
              return;
            }
            openForm(
              {
                title: "Editar ítem",
                saveLabel: "Guardar",
                values: raw,
                fields: [
                  { key: "nombre", label: "Nombre", required: true },
                  { key: "stock", label: "Stock", type: "number", min: 0 },
                  { key: "minimo", label: "Mínimo", type: "number", min: 0 },
                  { key: "unidad", label: "Unidad" },
                ],
              },
              function (edited) {
                if (!edited) return;
                Object.assign(raw, edited);
                save();
                toast("Guardado");
                render();
              }
            );
          }
        );
      };
    });
  }

  function renderStatusBoard(opts) {
    var statuses = opts.statuses;
    var labels = opts.labels;
    var titleField = opts.titleField || "nombre";
    var subFn = opts.sub || function () { return ""; };
    var list = items();
    var cols = statuses
      .map(function (st) {
        var col = list.filter(function (x) { return x.estado === st; });
        return (
          '<div class="col' + (st === opts.mid ? " mid" : "") + (st === opts.ok ? " ok" : "") + '">' +
          "<h2>" + esc(labels[st] || st) + " (" + col.length + ")</h2>" +
          col
            .map(function (x) {
              return (
                '<article data-id="' + esc(x.id) + '"><strong>' + esc(x[titleField] || x.id) +
                "</strong><span>" + esc(subFn(x)) + "</span>" +
                cardActions("Avanzar") +
                "</article>"
              );
            })
            .join("") +
          "</div>"
        );
      })
      .join("");

    root.innerHTML =
      '<h1 class="board-title">' + esc(opts.title) + "</h1>" +
      toolbar() +
      '<div class="kanban big">' + cols + "</div>" +
      '<p class="foot-help">Use los botones de cada tarjeta. Se guarda en este navegador.</p>';

    bindBar(function () {
      openForm(
        {
          title: "Nueva carga",
          hint: opts.title,
          saveLabel: "Crear",
          fields: (opts.createFields || []).map(function (f) {
            return Object.assign({ required: !f.def && f.key !== "notas" }, f);
          }),
        },
        function (row) {
          if (!row) return;
          row.id = uid("r");
          row.estado = statuses[0];
          if (opts.onCreate) opts.onCreate(row);
          items().unshift(row);
          save();
          toast("Alta ok");
          render();
        }
      );
    });

    root.querySelectorAll("article[data-id]").forEach(function (card) {
      card._onEdit = function (raw) {
        openForm(
          {
            title: "Editar",
            saveLabel: "Guardar",
            values: raw,
            fields: opts.createFields || [],
          },
          function (edited) {
            if (!edited) return;
            Object.assign(raw, edited);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
    bindCardActions(statuses);
  }

  function renderVisitas() {
    var list = items().slice().sort(function (a, b) {
      return String(a.hora || "").localeCompare(String(b.hora || ""));
    });
    root.innerHTML =
      '<section class="map-fake" aria-hidden="true">' +
      list
        .slice(0, 5)
        .map(function (x, i) {
          return '<div class="pin p' + (i + 1) + (x.estado === "en_camino" ? " on" : "") + '">' + (i + 1) + "</div>";
        })
        .join("") +
      "<p>Ruta de ejemplo</p></section>" +
      '<section class="route-panel">' +
      toolbar() +
      "<h1>Ruta de hoy</h1>" +
      '<p class="lead-mini">Toque una visita para marcar llegada, editar o borrar.</p>' +
      '<ol class="route-big">' +
      list
        .map(function (x) {
          var cli = byId(state.clientes, x.clienteId) || {};
          var tec = byId(state.tecnicos, x.tecnicoId) || {};
          var cls = x.estado === "hecha" || x.estado === "done" ? "done" : x.estado === "en_camino" ? "now" : "";
          var label =
            ({ pendiente: "Pendiente", en_camino: "En camino", hecha: "Hecha", cancelada: "Cancelada" })[x.estado] ||
            x.estado;
          return (
            '<li class="' + cls + '" data-id="' + esc(x.id) + '"><time>' + esc(x.hora || "—") +
            "</time><div><strong>" + esc(cli.nombre || "Cliente") + "</strong><span>" +
            esc(cli.dir || x.motivo || "") + " · " + esc(tec.nombre || "") +
            "</span></div><b>" + esc(label) + "</b>" +
            cardActions("Avanzar") +
            "</li>"
          );
        })
        .join("") +
      "</ol></section>";

    bindBar(function () {
      openForm(
        {
          title: "Nueva visita",
          hint: "Se suma a la ruta de hoy.",
          saveLabel: "Agregar",
          fields: [
            { key: "cliName", label: "Cliente / lugar", required: true, placeholder: "Ej. Kiosco Centro" },
            { key: "hora", label: "Hora", type: "time", def: "16:00", required: true },
            { key: "motivo", label: "Motivo", def: "Visita", placeholder: "Instalación, revisión…" },
          ],
        },
        function (row) {
          if (!row) return;
          var c = { id: uid("c"), nombre: row.cliName, dir: "A confirmar", tel: "" };
          state.clientes = state.clientes || [];
          state.clientes.push(c);
          var t = (state.tecnicos && state.tecnicos[0]) || { id: "t1", nombre: "Técnico" };
          items().push({
            id: uid("v"),
            clienteId: c.id,
            tecnicoId: t.id,
            fecha: "2026-09-11",
            hora: row.hora,
            motivo: row.motivo || "Visita",
            estado: "pendiente",
          });
          save();
          toast("Visita agregada");
          render();
        }
      );
    });

    root.querySelectorAll("li[data-id]").forEach(function (li) {
      li._onEdit = function (raw) {
        openForm(
          {
            title: "Editar visita",
            values: raw,
            fields: [
              { key: "hora", label: "Hora", type: "time" },
              { key: "motivo", label: "Motivo", type: "textarea", rows: 2 },
            ],
          },
          function (edited) {
            if (!edited) return;
            Object.assign(raw, edited);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
    bindCardActions(["pendiente", "en_camino", "hecha", "cancelada"]);
  }

  function renderGenericTable() {
    var cols = CFG.columns || [["nombre", "Nombre"]];
    var list = items().map(function (item) {
      var o = Object.assign({}, item);
      if (item.clienteId && state.clientes) {
        o.clienteNombre = (byId(state.clientes, item.clienteId) || {}).nombre || "—";
        o.cliente = o.clienteNombre;
      }
      if (item.platoId && state.carta) o.plato = (byId(state.carta, item.platoId) || {}).nombre || "—";
      if (item.stock != null && item.minimo != null) {
        o.alerta = Number(item.stock) < Number(item.minimo) ? "Bajo mínimo" : "Ok";
      }
      if (item.cuotas != null) o.progreso = (item.pagadas || 0) + "/" + item.cuotas;
      if (item.avance != null) o.avancePct = item.avance + "%";
      return o;
    });
    var statuses = CFG.statuses || [];
    var labels = CFG.statusLabels || {};

    root.innerHTML =
      toolbar() +
      '<div class="mini-table-wrap"><table class="ledger"><thead><tr>' +
      cols.map(function (c) { return "<th>" + esc(c[1]) + "</th>"; }).join("") +
      "<th></th></tr></thead><tbody>" +
      (list
        .map(function (x) {
          return (
            '<tr data-id="' + esc(x.id) + '">' +
            cols
              .map(function (c) {
                return "<td>" + esc(x[c[0]] != null ? x[c[0]] : "—") + "</td>";
              })
              .join("") +
            '<td>' +
            (statuses.length ? cardActions() : cardActions(null, { hideState: true })) +
            "</td></tr>"
          );
        })
        .join("") ||
        '<tr><td colspan="' + (cols.length + 1) + '">Sin datos. Pulse Nuevo.</td></tr>') +
      "</tbody></table></div>" +
      '<p class="foot-help">CRUD de ejemplo en este navegador. El panel completo tiene más vistas.</p>';

    bindBar(function () {
      var fields = fieldDefsFromCfg(CFG.form);
      if (!fields.length) fields = [{ key: "nombre", label: "Nombre", required: true }];
      openForm(
        {
          title: "Nuevo registro",
          saveLabel: "Crear",
          fields: fields,
        },
        function (row) {
          if (!row) return;
          row.id = uid("r");
          if (statuses.length) row.estado = statuses[0];
          items().unshift(row);
          save();
          toast("Guardado");
          render();
        }
      );
    });

    root.querySelectorAll("tr[data-id]").forEach(function (tr) {
      tr._onEdit = function (raw) {
        var fields = fieldDefsFromCfg(CFG.form);
        if (!fields.length) {
          Object.keys(raw).forEach(function (k) {
            if (k === "id" || k === "lineas" || k === "notas" || k === "check" || typeof raw[k] === "object") return;
            fields.push({
              key: k,
              label: k,
              type: typeof raw[k] === "number" ? "number" : "text",
            });
          });
        }
        openForm(
          {
            title: "Editar",
            values: raw,
            fields: fields,
          },
          function (edited) {
            if (!edited) return;
            Object.assign(raw, edited);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
    bindCardActions(statuses);
  }

  function renderAbonos() {
    var list = items().map(function (x) {
      var c = byId(state.clientes, x.clienteId) || {};
      return Object.assign({}, x, { nombre: x.nombre || c.nombre || "Abonado" });
    });
    var mora = list.filter(function (x) {
      return x.estado === "mora" || x.estado === "debe";
    });
    var ok = list.filter(function (x) { return mora.indexOf(x) === -1; });
    root.innerHTML =
      toolbar() +
      '<div class="mega-split"><div class="ok"><strong>' + ok.length + "</strong><span>Al día</span></div>" +
      '<div class="bad"><strong>' + mora.length + "</strong><span>Deben</span></div></div>" +
      "<h2>Listado</h2><ul class=\"mora-big\">" +
      list
        .map(function (x) {
          var debe = mora.indexOf(x) !== -1;
          return (
            '<li data-id="' + esc(x.id) + '"><strong>' + esc(x.nombre) +
            "</strong><span>" + esc(x.plan || "") +
            (x.saldo != null ? " · saldo $ " + Number(x.saldo).toLocaleString("es-AR") : "") +
            (x.monto != null ? " · $ " + Number(x.monto).toLocaleString("es-AR") : "") +
            "</span><b>" + (debe ? "Debe" : "Al día") + "</b>" +
            cardActions("Estado") +
            "</li>"
          );
        })
        .join("") +
      "</ul>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo abonado",
          saveLabel: "Dar de alta",
          fields: [
            { key: "nombre", label: "Nombre", required: true },
            { key: "plan", label: "Plan", def: "Mensual", placeholder: "Mensual, trimestral…" },
            { key: "monto", label: "Monto $", type: "number", def: 25000, min: 0, step: 100 },
          ],
        },
        function (row) {
          if (!row) return;
          var c = { id: uid("c"), nombre: row.nombre, tel: "" };
          state.clientes = state.clientes || [];
          state.clientes.push(c);
          items().unshift({
            id: uid("a"),
            clienteId: c.id,
            plan: row.plan || "Mensual",
            monto: Number(row.monto || 0),
            estado: "al_dia",
            ultimo: "2026-09-11",
          });
          save();
          toast("Alta ok");
          render();
        }
      );
    });

    root.querySelectorAll("li[data-id]").forEach(function (li) {
      li._onEdit = function (raw) {
        openForm(
          {
            title: "Editar abono",
            values: { plan: raw.plan, monto: raw.monto },
            fields: [
              { key: "plan", label: "Plan" },
              { key: "monto", label: "Monto $", type: "number", min: 0, step: 100 },
            ],
          },
          function (edited) {
            if (!edited) return;
            raw.plan = edited.plan;
            raw.monto = Number(edited.monto || 0);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
    bindCardActions(["al_dia", "mora"]);
  }

  function money(n) {
    return "$ " + Number(n || 0).toLocaleString("es-AR");
  }
  function stBadge(estado) {
    var labels = (CFG.statusLabels && CFG.statusLabels[estado]) || estado || "—";
    var cls = "st";
    if (/entreg|hecho|listo|ok|al_dia|vigente|cerrad|acept|pagad|ocupad|checkin/i.test(String(estado))) cls += " st-ok";
    else if (/pend|consulta|ingreso|recib|aprob|ruta|camino|despach|enviad|por_renovar|mora|debe|prep/i.test(String(estado))) cls += " st-warn";
    else if (/cancel|rechaz|atras/i.test(String(estado))) cls += " st-bad";
    return '<span class="' + cls + '">' + esc(labels) + "</span>";
  }
  function cardActions(stateLabel, opts) {
    opts = opts || {};
    var html = '<div class="row-actions">';
    if (!opts.hideState) {
      html +=
        '<button type="button" class="btn" data-act="state">' +
        esc(stateLabel || "Estado") +
        "</button>";
    }
    html +=
      '<button type="button" class="btn-ghost" data-act="edit">Editar</button>' +
      '<button type="button" class="btn-ghost btn-danger" data-act="del">Borrar</button>' +
      "</div>";
    return html;
  }
  function bindCardActions(statuses) {
    var labels = CFG.statusLabels || {};
    var sts = statuses || CFG.statuses || [];
    root.querySelectorAll("[data-id]").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var raw = byId(items(), id);
      if (!raw) return;
      el.querySelectorAll("button[data-act]").forEach(function (b) {
        b.onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var act = b.getAttribute("data-act");
          if (act === "del") {
            if (!confirm("¿Eliminar?")) return;
            state[listKey()] = items().filter(function (x) { return x.id !== id; });
            save();
            toast("Eliminado");
            render();
          } else if (act === "state") {
            if (!sts.length) {
              toast("Sin estados configurados");
              return;
            }
            var cur = sts.indexOf(raw.estado);
            var next = sts[(cur + 1) % sts.length];
            raw.estado = next;
            save();
            toast(labels[raw.estado] || raw.estado);
            render();
          } else if (act === "edit") {
            if (typeof el._onEdit === "function") {
              el._onEdit(raw);
              return;
            }
            var fields = fieldDefsFromCfg(CFG.form);
            if (!fields.length) {
              ["nombre", "cliente", "detalle", "total", "fecha", "hora", "notas"].forEach(function (k) {
                if (raw[k] != null)
                  fields.push({
                    key: k,
                    label: k,
                    type: typeof raw[k] === "number" ? "number" : "text",
                  });
              });
            }
            if (!fields.length) {
              toast("Nada para editar aquí");
              return;
            }
            openForm(
              {
                title: "Editar",
                values: raw,
                fields: fields,
              },
              function (edited) {
                if (!edited) return;
                Object.assign(raw, edited);
                save();
                toast("Guardado");
                render();
              }
            );
          }
        };
      });
    });
  }

  function renderMayorista() {
    var list = items().slice().sort(function (a, b) {
      return String(b.fecha || "").localeCompare(String(a.fecha || ""));
    });
    var stats = {
      pendiente: list.filter(function (x) { return x.estado === "pendiente"; }).length,
      despachado: list.filter(function (x) { return x.estado === "despachado"; }).length,
      entregado: list.filter(function (x) { return x.estado === "entregado"; }).length,
    };
    root.innerHTML =
      '<div class="app-head"><h1>Pedidos B2B</h1><p>Pedidos de comercios: ítems, mínimo y estado de despacho.</p></div>' +
      toolbar() +
      '<div class="ledger-top">' +
      "<div><strong>" + stats.pendiente + "</strong><span>Pendientes</span></div>" +
      '<div class="warn"><strong>' + stats.despachado + "</strong><span>En despacho</span></div>" +
      "<div><strong>" + stats.entregado + "</strong><span>Entregados</span></div></div>" +
      '<div class="pack-rail">' +
      list
        .map(function (x) {
          var cli = byId(state.clientes, x.clienteId) || {};
          var lineas = x.lineas || [];
          var total = lineas.reduce(function (a, l) {
            return a + Number(l.monto || 0) * Number(l.cant || 1);
          }, 0);
          var cls =
            x.estado === "pendiente" ? "new" : x.estado === "despachado" ? "ship" : "done";
          return (
            '<article class="' + cls + '" data-id="' + esc(x.id) + '">' +
            "<header>" + esc(x.fecha || "") + " · " + stBadge(x.estado) + "</header>" +
            "<strong>" + esc(cli.nombre || "Cliente") + "</strong>" +
            "<ul class=\"lineas\">" +
            lineas
              .map(function (l) {
                return "<li>" + esc(l.nombre) + " ×" + esc(l.cant) + " · " + money(Number(l.monto) * Number(l.cant || 1)) + "</li>";
              })
              .join("") +
            "</ul>" +
            "<p class=\"pack-total\">Total " + money(total) + "</p>" +
            cardActions() +
            "</article>"
          );
        })
        .join("") +
      "</div>" +
      '<p class="foot-help">Toque Estado para avanzar el pedido. Nuevo arma un pedido con un ítem de la lista.</p>';

    bindBar(function () {
      var clientes = state.clientes || [];
      var lista = state.lista || [];
      if (!clientes.length || !lista.length) {
        toast("Faltan clientes o lista de precio");
        return;
      }
      openForm(
        {
          title: "Nuevo pedido B2B",
          hint: "Cliente, producto y cantidad (respeta mínimos).",
          saveLabel: "Crear pedido",
          fields: [
            {
              key: "clienteId",
              label: "Cliente",
              type: "select",
              required: true,
              options: clientes.map(function (c) { return { value: c.id, label: c.nombre }; }),
            },
            {
              key: "productoId",
              label: "Producto",
              type: "select",
              required: true,
              options: lista.map(function (l) {
                return { value: l.id, label: l.nombre + " · " + money(l.precio) + " (mín. " + l.minimo + ")" };
              }),
            },
            { key: "cant", label: "Cantidad", type: "number", def: lista[0] ? lista[0].minimo : 1, min: 1, required: true },
          ],
        },
        function (row) {
          if (!row) return;
          var prod = byId(lista, row.productoId);
          if (!prod) return;
          var cant = Number(row.cant || 0);
          if (!cant) return;
          if (cant < Number(prod.minimo || 0)) {
            if (!confirm("Está bajo el mínimo (" + prod.minimo + "). ¿Crear igual?")) return;
          }
          items().unshift({
            id: uid("p"),
            clienteId: row.clienteId,
            fecha: "2026-09-11",
            estado: "pendiente",
            lineas: [{ nombre: prod.nombre, cant: cant, monto: prod.precio }],
          });
          save();
          toast("Pedido creado");
          render();
        }
      );
    });

    bindCardActions(["pendiente", "despachado", "entregado"]);
    root.querySelectorAll("article[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        var line = (raw.lineas && raw.lineas[0]) || { nombre: "", cant: 1, monto: 0 };
        openForm(
          {
            title: "Editar pedido",
            hint: line.nombre || "Primer ítem",
            values: { cant: line.cant || 1 },
            fields: [{ key: "cant", label: "Cantidad del primer ítem", type: "number", min: 1, required: true }],
          },
          function (edited) {
            if (!edited || !edited.cant) return;
            line.cant = Number(edited.cant);
            raw.lineas = raw.lineas || [line];
            raw.lineas[0] = line;
            save();
            toast("Actualizado");
            render();
          }
        );
      };
    });
  }

  function renderEventos() {
    var list = items().slice().sort(function (a, b) {
      return String(a.fecha || "").localeCompare(String(b.fecha || ""));
    });
    root.innerHTML =
      '<div class="app-head"><h1>Agenda del salón</h1><p>Fecha, seña, menú y checklist del día.</p></div>' +
      toolbar() +
      '<ul class="agenda-live">' +
      list
        .map(function (x) {
          var cli = byId(state.clientes, x.clienteId) || {};
          return (
            '<li data-id="' + esc(x.id) + '">' +
            "<time>" + esc(x.fecha) + "</time>" +
            "<div><strong>" + esc(cli.nombre || "Evento") + "</strong>" +
            "<span>" + esc(x.personas || 0) + " personas · " + esc(x.menu || "") +
            " · seña " + money(x.sena) + "</span>" +
            "<span class=\"checks\">" + esc((x.check || []).join(" · ") || "Sin checklist") + "</span></div>" +
            stBadge(x.estado) +
            cardActions() +
            "</li>"
          );
        })
        .join("") +
      "</ul>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo evento",
          saveLabel: "Cargar",
          fields: [
            { key: "nombre", label: "Cliente / evento", required: true },
            { key: "fecha", label: "Fecha", type: "date", def: "2026-10-20", required: true },
            { key: "personas", label: "Personas", type: "number", def: 50, min: 1 },
            { key: "menu", label: "Menú", def: "Menú 1" },
            { key: "sena", label: "Seña $", type: "number", def: 50000, min: 0, step: 1000 },
            { key: "check", label: "Checklist (separar con coma)", def: "Salón", placeholder: "Salón, Luces, DJ" },
          ],
        },
        function (row) {
          if (!row) return;
          var c = { id: uid("c"), nombre: row.nombre, tel: "" };
          state.clientes = state.clientes || [];
          state.clientes.push(c);
          items().unshift({
            id: uid("e"),
            clienteId: c.id,
            fecha: row.fecha,
            personas: Number(row.personas || 0),
            menu: row.menu || "Menú 1",
            sena: Number(row.sena || 0),
            estado: "consulta",
            check: String(row.check || "Salón").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          });
          save();
          toast("Evento cargado");
          render();
        }
      );
    });
    bindCardActions(CFG.statuses || ["consulta", "reservado", "confirmado", "realizado"]);
    root.querySelectorAll("li[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        openForm(
          {
            title: "Editar evento",
            values: {
              personas: raw.personas,
              menu: raw.menu,
              sena: raw.sena,
              check: (raw.check || []).join(", "),
              fecha: raw.fecha,
            },
            fields: [
              { key: "fecha", label: "Fecha", type: "date" },
              { key: "personas", label: "Personas", type: "number", min: 1 },
              { key: "menu", label: "Menú" },
              { key: "sena", label: "Seña $", type: "number", min: 0, step: 1000 },
              { key: "check", label: "Checklist (separar con coma)", type: "textarea", rows: 2 },
            ],
          },
          function (edited) {
            if (!edited) return;
            raw.fecha = edited.fecha;
            raw.personas = Number(edited.personas || 0);
            raw.menu = edited.menu;
            raw.sena = Number(edited.sena || 0);
            raw.check = String(edited.check || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
  }

  function renderCuotas() {
    var list = items();
    root.innerHTML =
      '<div class="app-head"><h1>Planes en cuotas</h1><p>Quién pagó, quién vence y quién está atrasado.</p></div>' +
      toolbar() +
      '<div class="bars-live">' +
      list
        .map(function (x) {
          var cli = byId(state.clientes, x.clienteId) || {};
          var pag = Number(x.pagadas || 0);
          var tot = Number(x.cuotas || 1);
          var pct = Math.round((pag / tot) * 100);
          var done = pag >= tot;
          var atras = !done && pag === 0;
          var cls = done ? "ok" : atras ? "bad" : "warn";
          return (
            '<article class="' + cls + '" data-id="' + esc(x.id) + '">' +
            "<div class=\"bar-head\"><strong>" + esc(cli.nombre || "Cliente") + "</strong>" +
            stBadge(done ? "pagado" : atras ? "atrasada" : "activo") + "</div>" +
            "<p>" + esc(x.concepto || "") + " · " + money(x.total) + " · " + pag + "/" + tot + "</p>" +
            '<div class="bar"><i style="--p:' + pct + '%"></i></div>' +
            '<div class="row-actions">' +
            '<button type="button" class="btn" data-act="pay">Registrar cuota</button>' +
            '<button type="button" class="btn-ghost" data-act="edit">Editar</button>' +
            '<button type="button" class="btn-ghost btn-danger" data-act="del">Borrar</button>' +
            "</div></article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo plan en cuotas",
          saveLabel: "Crear plan",
          fields: [
            { key: "nombre", label: "Cliente", required: true },
            { key: "concepto", label: "Qué compró", def: "Producto", required: true },
            { key: "total", label: "Total $", type: "number", def: 100000, min: 0, step: 1000 },
            { key: "cuotas", label: "Cantidad de cuotas", type: "number", def: 6, min: 1 },
          ],
        },
        function (row) {
          if (!row) return;
          var c = { id: uid("c"), nombre: row.nombre, tel: "" };
          state.clientes = state.clientes || [];
          state.clientes.push(c);
          items().unshift({
            id: uid("p"),
            clienteId: c.id,
            concepto: row.concepto || "Producto",
            total: Number(row.total || 0),
            cuotas: Number(row.cuotas || 1),
            pagadas: 0,
            desde: "2026-09-01",
          });
          save();
          toast("Plan creado");
          render();
        }
      );
    });

    root.querySelectorAll("article[data-id]").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var raw = byId(items(), id);
      el.querySelectorAll("button[data-act]").forEach(function (b) {
        b.onclick = function () {
          if (!raw) return;
          var act = b.getAttribute("data-act");
          if (act === "del") {
            if (!confirm("¿Eliminar plan?")) return;
            state[listKey()] = items().filter(function (x) { return x.id !== id; });
            save();
            render();
          } else if (act === "pay") {
            raw.pagadas = Math.min(Number(raw.cuotas || 0), Number(raw.pagadas || 0) + 1);
            save();
            toast("Cuota " + raw.pagadas + "/" + raw.cuotas);
            render();
          } else if (act === "edit") {
            openForm(
              {
                title: "Editar plan",
                values: raw,
                fields: [
                  { key: "concepto", label: "Concepto", required: true },
                  { key: "total", label: "Total $", type: "number", min: 0, step: 1000 },
                  { key: "cuotas", label: "Cuotas", type: "number", min: 1 },
                ],
              },
              function (edited) {
                if (!edited) return;
                raw.concepto = edited.concepto;
                raw.total = Number(edited.total || 0);
                raw.cuotas = Number(edited.cuotas || 1);
                save();
                toast("Guardado");
                render();
              }
            );
          }
        };
      });
    });
  }

  function renderObra() {
    var list = items();
    root.innerHTML =
      '<div class="app-head"><h1>Obras en curso</h1><p>Avance por reforma, presupuesto y extras.</p></div>' +
      toolbar() +
      '<div class="obra-cards">' +
      list
        .map(function (x) {
          var cli = byId(state.clientes, x.clienteId) || {};
          var av = Number(x.avance || 0);
          return (
            '<article data-id="' + esc(x.id) + '">' +
            "<header><strong>" + esc(x.nombre) + "</strong><span>" + esc(cli.nombre || "") + "</span></header>" +
            '<div class="big-meter"><i style="--p:' + av + '%"></i></div>' +
            "<p>" + av + "% · " + money(x.presupuesto) + (x.extras ? " · extras: " + esc(x.extras) : "") + "</p>" +
            stBadge(x.estado) +
            '<div class="row-actions" style="margin-top:.55rem">' +
            '<button type="button" class="btn" data-act="avance">+10% avance</button>' +
            '<button type="button" class="btn-ghost" data-act="edit">Editar</button>' +
            '<button type="button" class="btn-ghost btn-danger" data-act="del">Borrar</button>' +
            "</div></article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      openForm(
        {
          title: "Nueva obra",
          saveLabel: "Crear",
          fields: [
            { key: "nombre", label: "Nombre de la obra", required: true },
            { key: "cli", label: "Cliente", def: "Cliente", required: true },
            { key: "presupuesto", label: "Presupuesto $", type: "number", def: 500000, min: 0, step: 1000 },
            { key: "extras", label: "Extras / notas", type: "textarea", rows: 2, placeholder: "Opcional" },
          ],
        },
        function (row) {
          if (!row) return;
          var c = { id: uid("c"), nombre: row.cli || "Cliente", tel: "" };
          state.clientes = state.clientes || [];
          state.clientes.push(c);
          items().unshift({
            id: uid("w"),
            clienteId: c.id,
            nombre: row.nombre,
            avance: 0,
            estado: "aprobada",
            extras: row.extras || "",
            presupuesto: Number(row.presupuesto || 0),
          });
          save();
          toast("Obra creada");
          render();
        }
      );
    });

    root.querySelectorAll("article[data-id]").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var raw = byId(items(), id);
      el.querySelectorAll("button[data-act]").forEach(function (b) {
        b.onclick = function () {
          if (!raw) return;
          var act = b.getAttribute("data-act");
          if (act === "del") {
            if (!confirm("¿Eliminar obra?")) return;
            state[listKey()] = items().filter(function (x) { return x.id !== id; });
            save();
            render();
          } else if (act === "avance") {
            raw.avance = Math.min(100, Number(raw.avance || 0) + 10);
            if (raw.avance >= 100) raw.estado = "cerrada";
            else if (raw.avance > 0) raw.estado = "en_obra";
            save();
            toast(raw.avance + "%");
            render();
          } else if (act === "edit") {
            openForm(
              {
                title: "Editar obra",
                values: raw,
                fields: [
                  { key: "nombre", label: "Obra", required: true },
                  { key: "presupuesto", label: "Presupuesto $", type: "number", min: 0, step: 1000 },
                  { key: "extras", label: "Extras", type: "textarea", rows: 2 },
                ],
              },
              function (edited) {
                if (!edited) return;
                raw.nombre = edited.nombre;
                raw.extras = edited.extras || "";
                raw.presupuesto = Number(edited.presupuesto || 0);
                save();
                toast("Guardado");
                render();
              }
            );
          }
        };
      });
    });
  }

  function renderReparto() {
    var choferes = state.choferes || [];
    root.innerHTML =
      '<div class="app-head"><h1>Repartos del día</h1><p>Por chofer: zona, pedido y estado.</p></div>' +
      toolbar() +
      '<div class="dispatch">' +
      choferes
        .map(function (h) {
          var envios = items().filter(function (x) { return x.choferId === h.id; });
          return (
            "<section><h2>" + esc(h.nombre) + " · " + envios.length + " envíos</h2><ul>" +
            envios
              .map(function (x) {
                var cls = x.estado === "entregado" ? "done" : x.estado === "en_ruta" ? "now" : "";
                return (
                  '<li class="' + cls + '" data-id="' + esc(x.id) + '">' +
                  "<div><strong>" + esc(x.cliente) + "</strong><span>" + esc(x.zona) + " · " + esc(x.detalle) + "</span></div>" +
                  stBadge(x.estado) +
                  cardActions() +
                  "</li>"
                );
              })
              .join("") +
            "</ul></section>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      if (!choferes.length) return toast("Sin choferes");
      openForm(
        {
          title: "Nuevo reparto",
          saveLabel: "Asignar",
          fields: [
            { key: "cliente", label: "Cliente / local", required: true },
            { key: "zona", label: "Zona", def: "Centro" },
            { key: "detalle", label: "Qué lleva", def: "Pedido", type: "textarea", rows: 2 },
            {
              key: "choferId",
              label: "Chofer",
              type: "select",
              required: true,
              options: choferes.map(function (h) { return { value: h.id, label: h.nombre }; }),
            },
          ],
        },
        function (row) {
          if (!row) return;
          items().unshift({
            id: uid("r"),
            cliente: row.cliente,
            zona: row.zona || "Centro",
            detalle: row.detalle || "Pedido",
            choferId: row.choferId,
            estado: "pendiente",
          });
          save();
          toast("Reparto cargado");
          render();
        }
      );
    });
    bindCardActions(CFG.statuses || ["pendiente", "en_ruta", "entregado"]);
    root.querySelectorAll("li[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        openForm(
          {
            title: "Editar reparto",
            values: raw,
            fields: [
              { key: "cliente", label: "Cliente", required: true },
              { key: "zona", label: "Zona" },
              { key: "detalle", label: "Detalle", type: "textarea", rows: 2 },
            ],
          },
          function (edited) {
            if (!edited) return;
            Object.assign(raw, edited);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
  }

  function renderContratos() {
    var list = items().slice().sort(function (a, b) {
      return String(a.vence || "").localeCompare(String(b.vence || ""));
    });
    root.innerHTML =
      '<div class="app-head"><h1>Contratos y vencimientos</h1><p>Vigentes y los que hay que renovar.</p></div>' +
      toolbar() +
      '<div class="renew-board">' +
      list
        .map(function (x) {
          var parte = byId(state.partes, x.parteId) || {};
          var hot = x.estado === "por_renovar";
          return (
            '<article class="' + (hot ? "hot" : "") + '" data-id="' + esc(x.id) + '">' +
            "<time>" + esc(x.vence) + "</time>" +
            "<div><strong>" + esc(x.titulo) + "</strong><span>" +
            esc(parte.nombre || "") + " · " + money(x.monto) + "</span></div>" +
            stBadge(x.estado) +
            cardActions() +
            "</article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo contrato",
          saveLabel: "Guardar",
          fields: [
            { key: "titulo", label: "Título", required: true },
            { key: "parte", label: "Contraparte", def: "Locatario", required: true },
            { key: "vence", label: "Vence", type: "date", def: "2026-12-01", required: true },
            { key: "monto", label: "Monto $", type: "number", def: 200000, min: 0, step: 1000 },
          ],
        },
        function (row) {
          if (!row) return;
          var p = { id: uid("p"), nombre: row.parte || "Locatario", rol: "Parte" };
          state.partes = state.partes || [];
          state.partes.push(p);
          items().unshift({
            id: uid("k"),
            titulo: row.titulo,
            parteId: p.id,
            vence: row.vence,
            estado: "vigente",
            monto: Number(row.monto || 0),
          });
          save();
          toast("Contrato cargado");
          render();
        }
      );
    });
    bindCardActions(CFG.statuses || ["vigente", "por_renovar", "cerrado"]);
    root.querySelectorAll("article[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        openForm(
          {
            title: "Editar contrato",
            values: raw,
            fields: [
              { key: "titulo", label: "Título", required: true },
              { key: "vence", label: "Vence", type: "date" },
              { key: "monto", label: "Monto $", type: "number", min: 0, step: 1000 },
            ],
          },
          function (edited) {
            if (!edited) return;
            raw.titulo = edited.titulo;
            raw.vence = edited.vence;
            raw.monto = Number(edited.monto || 0);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
  }

  function renderFichas() {
    var list = items();
    var open = list[0];
    root.innerHTML =
      '<div class="app-head"><h1>Fichas</h1><p>Historial y próximo control.</p></div>' +
      toolbar() +
      '<div class="ficha-spread">' +
      (open
        ? '<article class="open" data-id="' + esc(open.id) + '"><header><strong>' + esc(open.nombre) +
          "</strong><span>" + esc(open.tipo) + (open.dueño && open.dueño !== "—" ? " · " + esc(open.dueño) : "") +
          "</span></header>" +
          "<p><b>Próximo</b> " + esc(open.proxima) + "</p>" +
          "<p><b>Tel</b> " + esc(open.tel) + "</p>" +
          "<div class=\"notas\">" +
          (open.notas || [])
            .map(function (n) {
              return "<p>" + esc(n.fecha) + " · " + esc(n.texto) + "</p>";
            })
            .join("") +
          "</div>" +
          cardActions(null, { hideState: true }) +
          '<button type="button" class="btn" data-act="nota" style="margin-top:.5rem">Agregar nota</button></article>'
        : "<p>Sin fichas</p>") +
      '<div class="ficha-stack">' +
      list
        .map(function (x) {
          return (
            '<article data-id="' + esc(x.id) + '" data-open="1"><strong>' + esc(x.nombre) +
            "</strong><span>" + esc(x.tipo) + " · próximo " + esc(x.proxima) + "</span></article>"
          );
        })
        .join("") +
      "</div></div>";

    bindBar(function () {
      openForm(
        {
          title: "Nueva ficha",
          saveLabel: "Crear",
          fields: [
            { key: "nombre", label: "Nombre", required: true },
            { key: "tipo", label: "Tipo", def: "Mascota", placeholder: "Paciente / Mascota" },
            { key: "dueño", label: "Dueño / responsable", placeholder: "Opcional" },
            { key: "tel", label: "Teléfono", type: "tel" },
            { key: "proxima", label: "Próximo control", type: "date", def: "2026-09-20" },
          ],
        },
        function (row) {
          if (!row) return;
          items().unshift({
            id: uid("f"),
            nombre: row.nombre,
            tipo: row.tipo || "Mascota",
            dueño: row.dueño || "—",
            tel: row.tel || "",
            proxima: row.proxima || "2026-09-20",
            notas: [],
          });
          save();
          toast("Ficha creada");
          render();
        }
      );
    });

    root.querySelectorAll(".ficha-stack [data-open]").forEach(function (el) {
      el.onclick = function () {
        var id = el.getAttribute("data-id");
        var idx = items().findIndex(function (x) { return x.id === id; });
        if (idx <= 0) return;
        var it = items().splice(idx, 1)[0];
        items().unshift(it);
        save();
        render();
      };
    });

    var openEl = root.querySelector(".open");
    if (openEl) {
      var raw = byId(items(), openEl.getAttribute("data-id"));
      openEl.querySelectorAll("button[data-act]").forEach(function (b) {
        b.onclick = function (ev) {
          ev.stopPropagation();
          if (!raw) return;
          var act = b.getAttribute("data-act");
          if (act === "del") {
            if (!confirm("¿Eliminar ficha?")) return;
            state[listKey()] = items().filter(function (x) { return x.id !== raw.id; });
            save();
            render();
          } else if (act === "edit") {
            openForm(
              {
                title: "Editar ficha",
                values: raw,
                fields: [
                  { key: "proxima", label: "Próximo control", type: "date" },
                  { key: "tel", label: "Teléfono", type: "tel" },
                ],
              },
              function (edited) {
                if (!edited) return;
                raw.proxima = edited.proxima;
                raw.tel = edited.tel || "";
                save();
                toast("Guardado");
                render();
              }
            );
          } else if (act === "nota") {
            openForm(
              {
                title: "Nota de la visita",
                saveLabel: "Agregar",
                fields: [{ key: "texto", label: "Qué se hizo / observó", type: "textarea", rows: 3, required: true }],
              },
              function (row) {
                if (!row || !row.texto) return;
                raw.notas = raw.notas || [];
                raw.notas.unshift({ fecha: "2026-09-11", texto: row.texto });
                save();
                toast("Nota agregada");
                render();
              }
            );
          } else if (act === "state") {
            toast("Las fichas no tienen estado: use notas y próximo control");
          }
        };
      });
    }
  }

  function renderFlota() {
    var list = items();
    root.innerHTML =
      '<div class="app-head"><h1>Flota propia</h1><p>Patente, km y vencimientos de papeles.</p></div>' +
      toolbar() +
      '<div class="fleet-live">' +
      list
        .map(function (x) {
          return (
            '<article data-id="' + esc(x.id) + '">' +
            "<strong>" + esc(x.patente) + "</strong>" +
            "<span>" + esc(x.modelo) + " · " + Number(x.km || 0).toLocaleString("es-AR") + " km</span>" +
            "<span>VTV " + esc(x.vtv || "—") + " · Seguro " + esc(x.seguro || "—") + "</span>" +
            cardActions("Km+") +
            "</article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      openForm(
        {
          title: "Nueva unidad",
          saveLabel: "Agregar",
          fields: [
            { key: "patente", label: "Patente", required: true, placeholder: "AB123CD" },
            { key: "modelo", label: "Modelo", def: "Utilitario" },
            { key: "km", label: "Kilómetros", type: "number", def: 50000, min: 0, step: 100 },
            { key: "vtv", label: "VTV hasta", type: "date", def: "2027-01-01" },
            { key: "seguro", label: "Seguro hasta", type: "date", def: "2026-12-01" },
          ],
        },
        function (row) {
          if (!row) return;
          items().unshift({
            id: uid("v"),
            patente: String(row.patente || "").toUpperCase(),
            modelo: row.modelo || "Utilitario",
            km: Number(row.km || 0),
            vtv: row.vtv || "2027-01-01",
            seguro: row.seguro || "2026-12-01",
          });
          save();
          toast("Unidad agregada");
          render();
        }
      );
    });

    root.querySelectorAll("article[data-id]").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var raw = byId(items(), id);
      el.querySelectorAll("button[data-act]").forEach(function (b) {
        b.onclick = function () {
          if (!raw) return;
          var act = b.getAttribute("data-act");
          if (act === "del") {
            if (!confirm("¿Eliminar unidad?")) return;
            state[listKey()] = items().filter(function (x) { return x.id !== id; });
            save();
            render();
          } else if (act === "state") {
            raw.km = Number(raw.km || 0) + 100;
            save();
            toast("Km: " + raw.km);
            render();
          } else if (act === "edit") {
            openForm(
              {
                title: "Editar unidad",
                values: raw,
                fields: [
                  { key: "patente", label: "Patente", required: true },
                  { key: "modelo", label: "Modelo" },
                  { key: "km", label: "Kilómetros", type: "number", min: 0, step: 100 },
                  { key: "vtv", label: "VTV hasta", type: "date" },
                  { key: "seguro", label: "Seguro hasta", type: "date" },
                ],
              },
              function (edited) {
                if (!edited) return;
                raw.patente = String(edited.patente || "").toUpperCase();
                raw.modelo = edited.modelo;
                raw.km = Number(edited.km || 0);
                raw.vtv = edited.vtv;
                raw.seguro = edited.seguro;
                save();
                toast("Guardado");
                render();
              }
            );
          }
        };
      });
    });
  }

  function renderCotizaciones() {
    var list = items();
    var stats = {
      borrador: list.filter(function (x) { return x.estado === "borrador"; }).length,
      enviado: list.filter(function (x) { return x.estado === "enviado"; }).length,
      aceptado: list.filter(function (x) { return x.estado === "aceptado"; }).length,
    };
    root.innerHTML =
      '<div class="app-head"><h1>Presupuestos</h1><p>Cliente, detalle, total y estado del envío.</p></div>' +
      toolbar() +
      '<div class="ledger-top">' +
      "<div><strong>" + stats.borrador + "</strong><span>Borrador</span></div>" +
      '<div class="warn"><strong>' + stats.enviado + "</strong><span>Enviados</span></div>" +
      "<div><strong>" + stats.aceptado + "</strong><span>Aceptados</span></div></div>" +
      '<div class="quote-live">' +
      list
        .map(function (x) {
          return (
            '<article data-id="' + esc(x.id) + '">' +
            "<div><strong>" + esc(x.cliente || "Cliente") + "</strong>" +
            "<span>" + esc(x.detalle || "Sin detalle") + "</span></div>" +
            '<div class="amt">' + money(x.total) + "<br>" + stBadge(x.estado) + "</div>" +
            cardActions() +
            "</article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      openForm(
        {
          title: "Nuevo presupuesto",
          saveLabel: "Crear",
          fields: [
            { key: "cliente", label: "Cliente", required: true },
            { key: "detalle", label: "Detalle / ítems", type: "textarea", rows: 3, def: "Trabajo a medida", required: true },
            { key: "total", label: "Total $", type: "number", def: 100000, min: 0, step: 1000 },
          ],
        },
        function (row) {
          if (!row) return;
          items().unshift({
            id: uid("c"),
            cliente: row.cliente,
            detalle: row.detalle || "Trabajo a medida",
            total: Number(row.total || 0),
            estado: "borrador",
          });
          save();
          toast("Presupuesto creado");
          render();
        }
      );
    });
    bindCardActions(CFG.statuses || ["borrador", "enviado", "aceptado", "rechazado"]);
    root.querySelectorAll("article[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        openForm(
          {
            title: "Editar presupuesto",
            values: raw,
            fields: [
              { key: "cliente", label: "Cliente", required: true },
              { key: "detalle", label: "Detalle", type: "textarea", rows: 3 },
              { key: "total", label: "Total $", type: "number", min: 0, step: 1000 },
            ],
          },
          function (edited) {
            if (!edited) return;
            raw.cliente = edited.cliente;
            raw.detalle = edited.detalle;
            raw.total = Number(edited.total || 0);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
  }

  function renderReservas() {
    var list = items().slice().sort(function (a, b) {
      return String(a.desde || "").localeCompare(String(b.desde || ""));
    });
    var stats = {
      consulta: list.filter(function (x) { return x.estado === "consulta"; }).length,
      confirmada: list.filter(function (x) { return x.estado === "confirmada"; }).length,
      checkin: list.filter(function (x) { return x.estado === "checkin"; }).length,
    };
    root.innerHTML =
      '<div class="app-head"><h1>Ocupación</h1><p>Huésped, unidad, fechas y seña.</p></div>' +
      toolbar() +
      '<div class="ledger-top">' +
      "<div><strong>" + stats.consulta + "</strong><span>Consultas</span></div>" +
      "<div><strong>" + stats.confirmada + "</strong><span>Confirmadas</span></div>" +
      '<div class="warn"><strong>' + stats.checkin + "</strong><span>En casa</span></div></div>" +
      '<div class="stay-live">' +
      list
        .map(function (x) {
          return (
            '<article data-id="' + esc(x.id) + '">' +
            "<time>" + esc(x.desde) + "<br>→ " + esc(x.hasta) + "</time>" +
            "<div><strong>" + esc(x.nombre || "Huésped") + "</strong>" +
            "<span>" + esc(x.unidad || "Unidad") +
            (x.sena != null ? " · seña " + money(x.sena) : "") +
            "</span></div>" +
            stBadge(x.estado) +
            cardActions() +
            "</article>"
          );
        })
        .join("") +
      "</div>";

    bindBar(function () {
      var unidadOpts = (state.unidades || []).map(function (u) {
        return { value: u.nombre, label: u.nombre };
      });
      if (!unidadOpts.length) unidadOpts = [{ value: "Cabaña", label: "Cabaña" }];
      openForm(
        {
          title: "Nueva reserva",
          saveLabel: "Cargar",
          fields: [
            { key: "nombre", label: "Huésped", required: true },
            { key: "unidad", label: "Unidad", type: "select", options: unidadOpts, required: true },
            { key: "desde", label: "Desde", type: "date", def: "2026-09-20", required: true },
            { key: "hasta", label: "Hasta", type: "date", def: "2026-09-23", required: true },
            { key: "sena", label: "Seña $", type: "number", def: 50000, min: 0, step: 1000 },
          ],
        },
        function (row) {
          if (!row) return;
          items().unshift({
            id: uid("r"),
            nombre: row.nombre,
            unidad: row.unidad || "Cabaña",
            desde: row.desde,
            hasta: row.hasta,
            sena: Number(row.sena || 0),
            estado: "consulta",
          });
          save();
          toast("Reserva cargada");
          render();
        }
      );
    });
    bindCardActions(CFG.statuses || ["consulta", "confirmada", "checkin", "checkout", "cancelada"]);
    root.querySelectorAll("article[data-id]").forEach(function (el) {
      el._onEdit = function (raw) {
        openForm(
          {
            title: "Editar reserva",
            values: raw,
            fields: [
              { key: "nombre", label: "Huésped", required: true },
              { key: "unidad", label: "Unidad" },
              { key: "desde", label: "Desde", type: "date" },
              { key: "hasta", label: "Hasta", type: "date" },
              { key: "sena", label: "Seña $", type: "number", min: 0, step: 1000 },
            ],
          },
          function (edited) {
            if (!edited) return;
            Object.assign(raw, edited);
            raw.sena = Number(edited.sena || 0);
            save();
            toast("Guardado");
            render();
          }
        );
      };
    });
  }

  function render() {
    root.className = "app-shell is-" + (slug === "stockalertas" || slug === "inventario" ? "stock" : slug === "visitas" ? "visitas" : slug === "ordenes" || slug === "turnos" || slug === "comandas" || slug === "takeaway" ? "ordenes" : slug === "abonos" || slug === "cuentacorriente" ? "abonos" : slug === "mayorista" ? "b2b" : slug === "reparto" ? "reparto" : slug === "eventos" ? "eventos" : slug === "obra" ? "obra" : slug === "fichas" ? "fichas" : slug === "flota" ? "flota" : slug === "contratos" ? "contratos" : slug === "cuotas" ? "cuotas" : slug === "cotizaciones" ? "cotizaciones" : slug === "reservas" ? "reservas" : slug);
    if (slug === "turnos") {
      return renderStatusBoard({
        title: "Agenda del día",
        statuses: ["pendiente", "en_curso", "atendido", "ausente"],
        labels: { pendiente: "Pendiente", en_curso: "En curso", atendido: "Atendido", ausente: "Ausente" },
        mid: "en_curso",
        ok: "atendido",
        titleField: "hora",
        sub: function (x) {
          var c = byId(state.clientes, x.clienteId) || {};
          var p = byId(state.profesionales, x.profesionalId) || {};
          return (c.nombre || "Cliente") + " · " + (p.nombre || "Profesional");
        },
        createFields: [
          { key: "hora", label: "Hora", type: "time", def: "15:00", required: true },
          { key: "fecha", label: "Fecha", type: "date", def: "2026-09-11", required: true },
          { key: "notas", label: "Notas", type: "textarea", rows: 2, def: "" },
        ],
        onCreate: function (row) {
          row.clienteId = state.clientes && state.clientes[0] ? state.clientes[0].id : "";
          row.profesionalId = state.profesionales && state.profesionales[0] ? state.profesionales[0].id : "";
          row.servicioId = state.servicios && state.servicios[0] ? state.servicios[0].id : "";
          row.origen = "panel";
        },
      });
    }
    if (slug === "comandas") {
      return renderStatusBoard({
        title: "Mesas del salón",
        statuses: ["abierta", "cocina", "lista", "cerrada"],
        labels: { abierta: "Abierta", cocina: "Cocina", lista: "Lista", cerrada: "Cerrada" },
        mid: "cocina",
        ok: "lista",
        titleField: "nombre",
        sub: function (x) {
          return (x.detalle || "") + (x.total != null ? " · $ " + Number(x.total).toLocaleString("es-AR") : "");
        },
        createFields: [
          { key: "nombre", label: "Mesa", def: "Mesa 9", required: true },
          { key: "cubiertos", label: "Personas", type: "number", def: 2, min: 1 },
          { key: "detalle", label: "Pedidos", type: "textarea", rows: 2, def: "" },
        ],
        onCreate: function (row) {
          row.total = 0;
          row.mozo = "Mozo";
        },
      });
    }
    if (slug === "inventario" || slug === "stockalertas") return renderStock();
    if (slug === "cuentacorriente" || slug === "abonos") return renderAbonos();
    if (slug === "visitas") return renderVisitas();
    if (slug === "ordenes") {
      return renderStatusBoard({
        title: "Pizarrón del taller",
        statuses: CFG.statuses && CFG.statuses.length ? CFG.statuses : ["ingreso", "en_curso", "listo", "entregado"],
        labels: CFG.statusLabels || { ingreso: "Ingreso", en_curso: "En curso", listo: "Listo", entregado: "Entregado" },
        mid: "en_curso",
        ok: "listo",
        titleField: "equipo",
        sub: function (x) {
          var c = byId(state.clientes, x.clienteId) || {};
          return (c.nombre || x.cliente || "") + " · " + (x.detalle || "");
        },
        createFields: [
          { key: "equipo", label: "Vehículo / equipo", required: true, placeholder: "Ej. Gol 2018" },
          { key: "detalle", label: "Qué hay que hacer", type: "textarea", rows: 2, required: true },
          { key: "fecha", label: "Fecha", type: "date", def: "2026-09-11" },
        ],
        onCreate: function (row) {
          row.clienteId = (state.clientes && state.clientes[0] && state.clientes[0].id) || "";
        },
      });
    }
    if (slug === "takeaway") {
      return renderStatusBoard({
        title: "Cola del mostrador",
        statuses: CFG.statuses && CFG.statuses.length ? CFG.statuses : ["recibido", "preparacion", "listo", "entregado"],
        labels: CFG.statusLabels || {
          recibido: "Recibido",
          preparacion: "En prep.",
          listo: "Listo",
          entregado: "Entregado",
        },
        mid: "preparacion",
        ok: "listo",
        titleField: "cliente",
        sub: function (x) {
          return (x.plato || x.detalle || "") + " · " + (x.hora || "");
        },
        createFields: [
          { key: "cliente", label: "Nombre del cliente", required: true },
          { key: "detalle", label: "Pedido", type: "textarea", rows: 2, required: true },
          { key: "hora", label: "Hora", type: "time", def: "12:30" },
        ],
        onCreate: function (row) {
          row.plato = row.detalle;
        },
      });
    }
    if (slug === "mayorista") return renderMayorista();
    if (slug === "eventos") return renderEventos();
    if (slug === "cuotas") return renderCuotas();
    if (slug === "obra") return renderObra();
    if (slug === "reparto") return renderReparto();
    if (slug === "contratos") return renderContratos();
    if (slug === "fichas") return renderFichas();
    if (slug === "flota") return renderFlota();
    if (slug === "cotizaciones") return renderCotizaciones();
    if (slug === "reservas") return renderReservas();
    return renderGenericTable();
  }

  // styles live in app-shells.css
  render();
})();
