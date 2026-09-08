let salidas = loadSalidas();
let tours = loadTours();
let reservas = loadReservas();
let guias = loadGuias();
let selected = salidas[0]?.id || "";
let filter = "todos";
let editingGuia = "";

const viewSalidas = document.getElementById("view-salidas");
const viewPax = document.getElementById("view-pasajeros");
const viewGuias = document.getElementById("view-guias");
const tabSalidas = document.getElementById("tab-salidas");
const tabPax = document.getElementById("tab-pasajeros");
const tabGuias = document.getElementById("tab-guias");
const openCreate = document.getElementById("open-create");

function showView(name) {
  viewSalidas.classList.toggle("panel-hidden", name !== "salidas");
  viewPax.classList.toggle("panel-hidden", name !== "pasajeros");
  viewGuias.classList.toggle("panel-hidden", name !== "guias");
  tabSalidas.classList.toggle("on", name === "salidas");
  tabPax.classList.toggle("on", name === "pasajeros");
  tabGuias.classList.toggle("on", name === "guias");
  openCreate.classList.toggle("panel-hidden", name !== "salidas");
  if (name === "pasajeros") renderPax();
  if (name === "guias") renderGuias();
}

tabSalidas.addEventListener("click", () => showView("salidas"));
tabPax.addEventListener("click", () => showView("pasajeros"));
tabGuias.addEventListener("click", () => showView("guias"));

document.querySelector("#create [name='tour']").innerHTML = tours.map((t) =>
  `<option value="${esc(t.id)}">${esc(t.nombre)}</option>`
).join("");

openCreate.addEventListener("click", () => document.getElementById("create").classList.toggle("open"));

document.getElementById("create").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    tourId: String(data.get("tour") || ""),
    fecha: String(data.get("fecha") || ""),
    hora: String(data.get("hora") || "08:00"),
    guia: String(data.get("guia") || "Laura"),
    cupoTomado: 0,
    estado: "abierta"
  };
  salidas = [item, ...salidas];
  selected = item.id;
  saveSalidas(salidas);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Salida cargada");
  render();
});

function render() {
  const abiertas = salidas.filter((s) => s.estado === "abierta").length;
  const completas = salidas.filter((s) => s.estado === "completa").length;
  document.getElementById("stats").innerHTML = `
    <button type="button" data-filter="todos" class="${filter === "todos" ? "on" : ""}"><strong>${salidas.length}</strong>salidas</button>
    <button type="button" data-filter="abierta" class="${filter === "abierta" ? "on" : ""}"><strong>${abiertas}</strong>abiertas</button>
    <button type="button" data-filter="completa" class="${filter === "completa" ? "on" : ""}"><strong>${completas}</strong>completas</button>
  `;
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => { filter = btn.dataset.filter; render(); });
  });

  const rows = filter === "todos" ? salidas : salidas.filter((s) => s.estado === filter);
  document.getElementById("rows").innerHTML = rows.map((s) => {
    const t = getTour(s.tourId, tours);
    const libres = cupoLibre(s, t);
    const pct = t ? Math.round((s.cupoTomado / t.cupo) * 100) : 0;
    return `
    <tr class="row ${s.id === selected ? "on" : ""}" data-id="${esc(s.id)}">
      <td>
        <div class="row-main">
          <img class="thumb" src="${esc(t?.imagen || "img/hero.jpg")}" alt="">
          <span><strong>${esc(t?.nombre || s.tourId)}</strong><br><small>${esc(fmtDate(s.fecha))} ${esc(s.hora)}</small></span>
        </div>
      </td>
      <td>${esc(s.guia)}</td>
      <td>${s.cupoTomado}/${t?.cupo || "—"} <div class="cupo-bar"><span style="width:${pct}%"></span></div></td>
      <td><span class="tag ${esc(s.estado)}">${esc(s.estado)}</span> · ${libres} libres</td>
    </tr>`;
  }).join("") || `<tr><td colspan="4">No hay salidas.</td></tr>`;

  document.querySelectorAll(".row").forEach((row) => {
    row.addEventListener("click", () => { selected = row.dataset.id; render(); });
  });

  const s = salidas.find((i) => i.id === selected);
  const detail = document.getElementById("detail");
  if (!s) {
    detail.innerHTML = "<p>Elegí una salida.</p>";
    return;
  }
  const t = getTour(s.tourId, tours);
  const pax = reservas.filter((r) => r.salidaId === s.id);
  detail.innerHTML = `
    <p class="eyebrow">${esc(fmtDate(s.fecha))} · ${esc(s.hora)}</p>
    <h2>${esc(t?.nombre || "Salida")}</h2>
    <img class="detail-photo" src="${esc(t?.imagen || "img/hero.jpg")}" alt="">
    <div class="meta">
      <div><span>Guía</span>${esc(s.guia)}</div>
      <div><span>Cupo</span>${s.cupoTomado} / ${t?.cupo || 0}</div>
      <div><span>Libres</span>${cupoLibre(s, t)}</div>
      <div><span>Idioma</span>${esc(idiomaLabel(t?.idioma))}</div>
    </div>
    <h3 style="font-size:14px">Pasajeros de esta salida</h3>
    ${pax.length ? `<ul class="ficha-amenities" style="margin:8px 0">${pax.map((p) => `<span>${esc(p.cliente.nombre)} ×${p.plazas}</span>`).join("")}</ul>` : "<p style='color:var(--muted);font-size:13px'>Todavía no hay pasajeros.</p>"}
    <form id="edit">
      <label>Estado
        <select name="estado">
          <option value="abierta" ${s.estado === "abierta" ? "selected" : ""}>Abierta</option>
          <option value="completa" ${s.estado === "completa" ? "selected" : ""}>Completa</option>
          <option value="en_curso" ${s.estado === "en_curso" ? "selected" : ""}>En salida</option>
          <option value="cancelada" ${s.estado === "cancelada" ? "selected" : ""}>Cancelada</option>
        </select>
      </label>
      <label>Guía
        <select name="guia">
          ${guias.map((g) => `<option ${s.guia === g.corto ? "selected" : ""}>${esc(g.corto)}</option>`).join("")}
        </select>
      </label>
      <div class="actions">
        <button class="btn-panel" type="submit">Guardar</button>
        <button class="ghost" type="button" id="remove">Quitar salida</button>
      </div>
    </form>
  `;
  detail.querySelector("#edit").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    s.estado = String(data.get("estado") || s.estado);
    s.guia = String(data.get("guia") || s.guia);
    saveSalidas(salidas);
    showToast("Salida actualizada");
    render();
  });
  detail.querySelector("#remove").addEventListener("click", () => {
    if (!confirm("¿Quitar esta salida?")) return;
    salidas = salidas.filter((x) => x.id !== s.id);
    saveSalidas(salidas);
    selected = salidas[0]?.id || "";
    showToast("Salida quitada");
    render();
  });
}

function renderPax() {
  document.getElementById("paxGrid").innerHTML = reservas.map((r) => {
    const t = getTour(r.tourId, tours);
    const s = getSalida(r.salidaId, salidas);
    return `
    <article class="trabajo-admin">
      <img src="${esc(t?.imagen || "img/hero.jpg")}" alt="">
      <div>
        <h3>${esc(r.cliente.nombre)}</h3>
        <p style="margin:0 0 6px;font-size:13px;color:var(--muted)">${esc(r.codigo)} · ${r.plazas} plaza${r.plazas === 1 ? "" : "s"}</p>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(t?.nombre || "")} · ${esc(s ? fmtDate(s.fecha) : "")}</p>
        <span class="tag ${esc(r.status)}">${esc(label(r.status))}</span>
        <div class="actions">
          <button class="btn-panel" type="button" data-ok="${esc(r.id)}">Confirmar</button>
          <button class="ghost" type="button" data-del="${esc(r.id)}">Cancelar</button>
        </div>
      </div>
    </article>`;
  }).join("") || "<p style='padding:0 24px'>No hay pasajeros.</p>";

  document.querySelectorAll("[data-ok]").forEach((btn) => {
    btn.addEventListener("click", () => {
      reservas = reservas.map((r) => r.id === btn.dataset.ok ? { ...r, status: "confirmada" } : r);
      saveReservas(reservas);
      showToast("Pasajero confirmado");
      renderPax();
    });
  });
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = reservas.find((x) => x.id === btn.dataset.del);
      if (r) {
        const s = salidas.find((x) => x.id === r.salidaId);
        if (s) {
          s.cupoTomado = Math.max(0, s.cupoTomado - r.plazas);
          if (s.estado === "completa") s.estado = "abierta";
          saveSalidas(salidas);
        }
      }
      reservas = reservas.filter((x) => x.id !== btn.dataset.del);
      saveReservas(reservas);
      showToast("Reserva cancelada");
      renderPax();
      render();
    });
  });
}

document.getElementById("open-guia").addEventListener("click", () => {
  editingGuia = "";
  document.getElementById("create-guia").classList.toggle("open");
  document.getElementById("create-guia").reset();
});

document.getElementById("create-guia").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const payload = {
    nombre: String(data.get("nombre") || "").trim(),
    corto: String(data.get("corto") || "").trim(),
    rol: String(data.get("rol") || "").trim(),
    idiomas: String(data.get("idiomas") || "ES").trim(),
    bio: String(data.get("bio") || "").trim(),
    imagen: String(data.get("imagen") || "img/guia-laura.jpg")
  };
  if (editingGuia) {
    guias = guias.map((g) => g.id === editingGuia ? { ...g, ...payload } : g);
  } else {
    guias = [{ id: crypto.randomUUID(), ...payload }, ...guias];
  }
  editingGuia = "";
  saveGuias(guias);
  event.target.reset();
  event.target.classList.remove("open");
  showToast("Guía guardado");
  renderGuias();
});

function renderGuias() {
  document.getElementById("guiasGrid").innerHTML = guias.map((g) => `
    <article class="trabajo-admin">
      <img src="${esc(g.imagen)}" alt="${esc(g.nombre)}">
      <div>
        <h3>${esc(g.nombre)}</h3>
        <p style="margin:0 0 8px;font-size:13px;color:var(--muted)">${esc(g.rol)} · ${esc(g.idiomas)}</p>
        <div class="actions">
          <button class="btn-panel" type="button" data-edit="${esc(g.id)}">Editar</button>
          <button class="ghost" type="button" data-delg="${esc(g.id)}">Quitar</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = guias.find((x) => x.id === btn.dataset.edit);
      if (!g) return;
      editingGuia = g.id;
      const form = document.getElementById("create-guia");
      form.classList.add("open");
      form.nombre.value = g.nombre;
      form.corto.value = g.corto;
      form.rol.value = g.rol;
      form.idiomas.value = g.idiomas;
      form.imagen.value = g.imagen;
      form.bio.value = g.bio;
    });
  });
  document.querySelectorAll("[data-delg]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("¿Quitar este guía?")) return;
      guias = guias.filter((g) => g.id !== btn.dataset.delg);
      saveGuias(guias);
      showToast("Guía quitado");
      renderGuias();
    });
  });
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

render();
