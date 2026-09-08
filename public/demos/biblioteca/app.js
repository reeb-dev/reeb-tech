const catalogo = loadLibros();
const reservasPublicas = loadReservas();

let currentFilter = "all";
let searchTerm = "";

function estadoPublico(libro) {
  if (libro.disponibles > 0) return "disponible";
  if (reservasPendientesDe(libro.id).length > 0) return "reservado";
  return "prestado";
}

function textoEstado(libro) {
  const estado = estadoPublico(libro);
  if (estado === "disponible") {
    return libro.disponibles === 1 ? "1 disponible" : `${libro.disponibles} disponibles`;
  }
  if (estado === "reservado") return "Reservado";
  return "Prestado";
}

function visible() {
  const term = foldText(searchTerm);
  return catalogo.filter((l) => {
    if (currentFilter !== "all" && l.categoria !== currentFilter) return false;
    if (!term) return true;
    return foldText(l.titulo).includes(term) || foldText(l.autor).includes(term);
  });
}

function renderCatalog() {
  const list = visible();
  const host = document.getElementById("catalog");
  host.classList.toggle("is-empty", !list.length);
  if (!list.length) {
    host.innerHTML = `<p class="empty-catalog">No hay títulos que coincidan con la búsqueda.</p>`;
    return;
  }
  host.innerHTML = list.map((l) => {
    const estado = estadoPublico(l);
    return `
      <article class="book-card" data-id="${esc(l.id)}" tabindex="0" role="button">
        <div class="cover-wrap"><img src="${esc(l.tapa)}" alt="Tapa de ${esc(l.titulo)}"></div>
        <div class="info">
          <h3>${esc(l.titulo)}</h3>
          <div class="autor">${esc(l.autor)}</div>
          <span class="disponibilidad ${estado}">${esc(textoEstado(l))}</span>
        </div>
      </article>
    `;
  }).join("");

  host.querySelectorAll(".book-card").forEach((card) => {
    const open = () => openFicha(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function fillReservaSelect(selectedId) {
  const select = document.getElementById("reserva-libro");
  select.innerHTML = catalogo.map((l) => {
    const estado = textoEstado(l);
    return `<option value="${esc(l.id)}" ${l.id === selectedId ? "selected" : ""}>${esc(l.titulo)} — ${esc(estado)}</option>`;
  }).join("");
}

function openFicha(id) {
  const libro = getLibro(id);
  if (!libro) return;
  const estado = estadoPublico(libro);
  document.getElementById("ficha-img").src = libro.tapa;
  document.getElementById("ficha-img").alt = "Tapa de " + libro.titulo;
  document.getElementById("ficha-cat").textContent = catLabel(libro.categoria);
  document.getElementById("ficha-titulo").textContent = libro.titulo;
  document.getElementById("ficha-autor").textContent = libro.autor;
  document.getElementById("ficha-ubi").textContent = libro.ubicacion;
  document.getElementById("ficha-disp").textContent = labelLibro(estado);
  document.getElementById("ficha-edit").textContent = `${libro.editorial} · ${libro.año}`;
  document.getElementById("ficha-ejem").textContent = `${libro.disponibles} de ${libro.ejemplares} en sala`;
  document.getElementById("ficha-reservar").dataset.id = libro.id;
  document.getElementById("ficha").hidden = false;
  document.body.classList.add("ficha-open");
}

function closeFicha() {
  document.getElementById("ficha").hidden = true;
  document.body.classList.remove("ficha-open");
}

document.getElementById("filters").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-filter]");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b === btn));
  renderCatalog();
});

document.getElementById("search").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderCatalog();
});

document.getElementById("ficha-cerrar").addEventListener("click", closeFicha);
document.getElementById("ficha").addEventListener("click", (event) => {
  if (event.target.id === "ficha") closeFicha();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeFicha();
});

document.getElementById("ficha-reservar").addEventListener("click", () => {
  const id = document.getElementById("ficha-reservar").dataset.id;
  fillReservaSelect(id);
  closeFicha();
  document.getElementById("reservar").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#form-reserva [name=socioNombre]").focus();
});

document.getElementById("form-reserva").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const socioNombre = String(data.get("socioNombre") || "").trim();
  const tel = String(data.get("tel") || "").trim();
  const libroId = String(data.get("libro") || "");
  const error = document.getElementById("reserva-error");
  if (socioNombre.length < 3) {
    error.textContent = "Ingresá el nombre de socio.";
    return;
  }
  if (!getLibro(libroId)) {
    error.textContent = "Elegí un libro del catálogo.";
    return;
  }
  const duplicada = reservasPublicas.some((r) =>
    r.libro === libroId && r.status === "pendiente" && r.socioNombre.toLowerCase() === socioNombre.toLowerCase()
  );
  if (duplicada) {
    error.textContent = "Ya hay una reserva pendiente de este socio para ese título.";
    return;
  }
  reservasPublicas.unshift({
    id: nextId("r"),
    libro: libroId,
    socioNombre,
    tel,
    fecha: hoyISO(),
    status: "pendiente"
  });
  saveReservas();
  const libro = getLibro(libroId);
  refreshLibroStatus(libro);
  saveLibros();
  error.textContent = "";
  event.target.reset();
  fillReservaSelect(libroId);
  renderCatalog();
  toast("Reserva anotada (demo)");
});

fillReservaSelect();
renderCatalog();
