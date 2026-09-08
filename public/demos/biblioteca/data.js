const STATUSES_LIBRO = [
  { id: "disponible", label: "Disponible" },
  { id: "prestado", label: "Prestado" },
  { id: "reservado", label: "Reservado" },
  { id: "reparacion", label: "En reparación" }
];

const STATUSES_PRESTAMO = [
  { id: "activo", label: "Activo" },
  { id: "vencido", label: "Vencido" },
  { id: "devuelto", label: "Devuelto" }
];

const STATUSES_RESERVA = [
  { id: "pendiente", label: "Pendiente" },
  { id: "lista", label: "Lista para retirar" },
  { id: "cumplida", label: "Retirada" },
  { id: "cancelada", label: "Cancelada" }
];

const CATEGORIAS = [
  { id: "ficcion", label: "Ficción" },
  { id: "noficcion", label: "No ficción" },
  { id: "infantil", label: "Infantil" },
  { id: "juvenil", label: "Juvenil" },
  { id: "tecnico", label: "Técnico" },
  { id: "referencia", label: "Referencia" }
];

const MULTA_POR_DIA = 200;
const DIAS_PRESTAMO = 14;
const MAX_LIBROS_SOCIO = 3;
const MAX_RENOVACIONES = 2;

const STORE = {
  libros: "biblioteca-libros-v2",
  socios: "biblioteca-socios-v2",
  prestamos: "biblioteca-prestamos-v2",
  reservas: "biblioteca-reservas-v2"
};

function seedLibros() {
  return [
    { id: "l1", codigo: "FIC-001", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", editorial: "Sudamericana", año: 1967, categoria: "ficcion", ubicacion: "Estante A-1", ejemplares: 3, disponibles: 2, status: "disponible", tapa: "img/cien-anos.jpg" },
    { id: "l2", codigo: "FIC-002", titulo: "Rayuela", autor: "Julio Cortázar", editorial: "Sudamericana", año: 1963, categoria: "ficcion", ubicacion: "Estante A-1", ejemplares: 2, disponibles: 0, status: "reservado", tapa: "img/rayuela.jpg" },
    { id: "l3", codigo: "INF-015", titulo: "El Principito", autor: "Antoine de Saint-Exupéry", editorial: "Emecé", año: 1943, categoria: "infantil", ubicacion: "Estante C-2", ejemplares: 4, disponibles: 3, status: "disponible", tapa: "img/principito.jpg" },
    { id: "l4", codigo: "TEC-008", titulo: "Introducción a los Algoritmos", autor: "Thomas H. Cormen", editorial: "MIT Press", año: 2009, categoria: "tecnico", ubicacion: "Estante D-3", ejemplares: 2, disponibles: 1, status: "disponible", tapa: "img/algoritmos.jpg" },
    { id: "l5", codigo: "NOF-022", titulo: "Breve historia del tiempo", autor: "Stephen Hawking", editorial: "Crítica", año: 1988, categoria: "noficcion", ubicacion: "Estante B-2", ejemplares: 2, disponibles: 2, status: "disponible", tapa: "img/breve-historia.jpg" },
    { id: "l6", codigo: "JUV-005", titulo: "Harry Potter y la piedra filosofal", autor: "J.K. Rowling", editorial: "Salamandra", año: 1997, categoria: "juvenil", ubicacion: "Estante C-1", ejemplares: 5, disponibles: 4, status: "disponible", tapa: "img/harry-potter.jpg" },
    { id: "l7", codigo: "FIC-010", titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", editorial: "Cátedra", año: 1605, categoria: "ficcion", ubicacion: "Estante A-2", ejemplares: 3, disponibles: 3, status: "disponible", tapa: "img/quijote.jpg" },
    { id: "l8", codigo: "FIC-018", titulo: "1984", autor: "George Orwell", editorial: "Debolsillo", año: 1949, categoria: "ficcion", ubicacion: "Estante A-3", ejemplares: 2, disponibles: 2, status: "disponible", tapa: "img/1984.jpg" },
    { id: "l9", codigo: "FIC-021", titulo: "Martín Fierro", autor: "José Hernández", editorial: "Losada", año: 1872, categoria: "ficcion", ubicacion: "Estante A-2", ejemplares: 3, disponibles: 3, status: "disponible", tapa: "img/martin-fierro.jpg" },
    { id: "l10", codigo: "INF-008", titulo: "Mafalda", autor: "Quino", editorial: "De la Flor", año: 1964, categoria: "infantil", ubicacion: "Estante C-2", ejemplares: 4, disponibles: 4, status: "disponible", tapa: "img/mafalda.jpg" },
    { id: "l11", codigo: "JUV-012", titulo: "El Eternauta", autor: "H. G. Oesterheld", editorial: "Doedytores", año: 1957, categoria: "juvenil", ubicacion: "Estante C-1", ejemplares: 2, disponibles: 1, status: "disponible", tapa: "img/eternauta.jpg" },
    { id: "l12", codigo: "NOF-031", titulo: "Sapiens", autor: "Yuval Noah Harari", editorial: "Debate", año: 2011, categoria: "noficcion", ubicacion: "Estante B-2", ejemplares: 2, disponibles: 1, status: "reservado", tapa: "img/sapiens.jpg" },
    { id: "l13", codigo: "JUV-019", titulo: "El Hobbit", autor: "J. R. R. Tolkien", editorial: "Minotauro", año: 1937, categoria: "juvenil", ubicacion: "Estante C-1", ejemplares: 3, disponibles: 3, status: "disponible", tapa: "img/hobbit.jpg" },
    { id: "l14", codigo: "FIC-027", titulo: "Orgullo y prejuicio", autor: "Jane Austen", editorial: "Alianza", año: 1813, categoria: "ficcion", ubicacion: "Estante A-3", ejemplares: 2, disponibles: 2, status: "disponible", tapa: "img/orgullo.jpg" },
    { id: "l15", codigo: "REF-001", titulo: "Diccionario de la lengua española", autor: "Real Academia Española", editorial: "Espasa", año: 2014, categoria: "referencia", ubicacion: "Estante E-1", ejemplares: 2, disponibles: 2, status: "disponible", tapa: "img/diccionario.jpg" }
  ];
}

function seedSocios() {
  return [
    { id: "s1", numero: "SOC-001", nombre: "María García", dni: "32.456.789", email: "maria.g@email.com", tel: "11-5555-1234", fechaAlta: "2024-03-15", activo: true, multas: 0 },
    { id: "s2", numero: "SOC-002", nombre: "Carlos Rodríguez", dni: "28.123.456", email: "carlos.r@email.com", tel: "11-4444-5678", fechaAlta: "2024-04-20", activo: true, multas: 0 },
    { id: "s3", numero: "SOC-003", nombre: "Ana Martínez", dni: "35.789.012", email: "ana.m@email.com", tel: "11-3333-9012", fechaAlta: "2024-06-01", activo: true, multas: 0 },
    { id: "s4", numero: "SOC-004", nombre: "Luis Fernández", dni: "30.456.123", email: "luis.f@email.com", tel: "11-2222-3456", fechaAlta: "2024-01-10", activo: false, multas: 3500 }
  ];
}

function seedPrestamos() {
  return [
    { id: "p1", libro: "l2", socio: "s1", fechaPrestamo: "2026-08-26", fechaDevolucion: "2026-09-09", fechaDevuelto: null, status: "activo", renovaciones: 0 },
    { id: "p2", libro: "l6", socio: "s2", fechaPrestamo: "2026-08-20", fechaDevolucion: "2026-09-03", fechaDevuelto: null, status: "vencido", renovaciones: 1 },
    { id: "p3", libro: "l3", socio: "s3", fechaPrestamo: "2026-09-01", fechaDevolucion: "2026-09-15", fechaDevuelto: null, status: "activo", renovaciones: 0 },
    { id: "p4", libro: "l2", socio: "s2", fechaPrestamo: "2026-07-10", fechaDevolucion: "2026-07-24", fechaDevuelto: "2026-07-22", status: "devuelto", renovaciones: 0 },
    { id: "p5", libro: "l6", socio: "s1", fechaPrestamo: "2026-07-01", fechaDevolucion: "2026-07-15", fechaDevuelto: "2026-07-14", status: "devuelto", renovaciones: 0 },
    { id: "p6", libro: "l11", socio: "s1", fechaPrestamo: "2026-09-04", fechaDevolucion: "2026-09-18", fechaDevuelto: null, status: "activo", renovaciones: 0 },
    { id: "p7", libro: "l1", socio: "s3", fechaPrestamo: "2026-08-28", fechaDevolucion: "2026-09-11", fechaDevuelto: null, status: "activo", renovaciones: 0 }
  ];
}

function seedReservas() {
  return [
    { id: "r1", libro: "l2", socioNombre: "Pedro López", tel: "11-4000-2211", fecha: "2026-09-06", status: "pendiente" },
    { id: "r2", libro: "l12", socioNombre: "Lucía Vega", tel: "11-4000-8833", fecha: "2026-09-07", status: "pendiente" }
  ];
}

let libros = null;
let socios = null;
let prestamos = null;
let reservas = null;

function loadStore(key, seeder, cacheRef, setter) {
  if (cacheRef()) return cacheRef();
  const raw = localStorage.getItem(key);
  if (!raw) {
    const seeded = seeder();
    localStorage.setItem(key, JSON.stringify(seeded));
    setter(seeded);
    return seeded;
  }
  const parsed = JSON.parse(raw);
  setter(parsed);
  return parsed;
}

function loadLibros() {
  const list = loadStore(STORE.libros, seedLibros, () => libros, (v) => { libros = v; });
  let changed = false;
  list.forEach((libro) => {
    const before = libro.status;
    refreshLibroStatus(libro);
    if (libro.status !== before) changed = true;
  });
  if (changed) saveLibros();
  return list;
}

function loadSocios() {
  return loadStore(STORE.socios, seedSocios, () => socios, (v) => { socios = v; });
}

function loadPrestamos() {
  const list = loadStore(STORE.prestamos, seedPrestamos, () => prestamos, (v) => { prestamos = v; });
  refreshPrestamosVencidos();
  return prestamos;
}

function loadReservas() {
  return loadStore(STORE.reservas, seedReservas, () => reservas, (v) => { reservas = v; });
}

function saveLibros() { localStorage.setItem(STORE.libros, JSON.stringify(libros)); }
function saveSocios() { localStorage.setItem(STORE.socios, JSON.stringify(socios)); }
function savePrestamos() { localStorage.setItem(STORE.prestamos, JSON.stringify(prestamos)); }
function saveReservas() { localStorage.setItem(STORE.reservas, JSON.stringify(reservas)); }

function labelLibro(status) { return STATUSES_LIBRO.find((s) => s.id === status)?.label || status; }
function labelPrestamo(status) { return STATUSES_PRESTAMO.find((s) => s.id === status)?.label || status; }
function labelReserva(status) { return STATUSES_RESERVA.find((s) => s.id === status)?.label || status; }
function catLabel(cat) { return CATEGORIAS.find((c) => c.id === cat)?.label || cat; }

function getLibro(id) { return loadLibros().find((l) => l.id === id); }
function getSocio(id) { return loadSocios().find((s) => s.id === id); }

function money(amount) { return "$ " + Number(amount || 0).toLocaleString("es-AR"); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function hoyISO() {
  const n = new Date();
  return [n.getFullYear(), String(n.getMonth() + 1).padStart(2, "0"), String(n.getDate()).padStart(2, "0")].join("-");
}

function addDays(iso, days) {
  const [y, m, d] = String(iso).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + Number(days || 0));
  return [dt.getFullYear(), String(dt.getMonth() + 1).padStart(2, "0"), String(dt.getDate()).padStart(2, "0")].join("-");
}

const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFecha(iso) {
  if (!iso) return "—";
  const parts = String(iso).split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts.map(Number);
  if (!y || !m) return iso;
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
}

function diasAtraso(isoVence) {
  if (!isoVence) return 0;
  const hoy = hoyISO();
  if (isoVence >= hoy) return 0;
  const [y1, m1, d1] = isoVence.split("-").map(Number);
  const [y2, m2, d2] = hoy.split("-").map(Number);
  const t1 = new Date(y1, m1 - 1, d1);
  const t2 = new Date(y2, m2 - 1, d2);
  return Math.max(0, Math.round((t2 - t1) / 86400000));
}

function multaDe(dias) {
  return Number(dias || 0) * MULTA_POR_DIA;
}

function refreshPrestamosVencidos() {
  if (!prestamos) return;
  let changed = false;
  prestamos.forEach((p) => {
    if (p.status !== "devuelto" && diasAtraso(p.fechaDevolucion) > 0 && p.status !== "vencido") {
      p.status = "vencido";
      changed = true;
    }
  });
  if (changed) savePrestamos();
}

function refreshLibroStatus(libro) {
  if (!libro) return;
  const pendientes = loadReservas().filter((r) => r.libro === libro.id && r.status === "pendiente").length;
  if (libro.disponibles > 0) libro.status = "disponible";
  else if (pendientes > 0) libro.status = "reservado";
  else libro.status = "prestado";
}

function reservasPendientesDe(libroId) {
  return loadReservas().filter((r) => r.libro === libroId && r.status === "pendiente");
}

function prestamosActivosDe(socioId) {
  return loadPrestamos().filter((p) => p.socio === socioId && p.status !== "devuelto");
}

function nextId(prefix, list) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function nextCodigo(cat) {
  const prefix = { ficcion: "FIC", noficcion: "NOF", infantil: "INF", juvenil: "JUV", tecnico: "TEC", referencia: "REF" }[cat] || "LIB";
  const nums = loadLibros()
    .filter((l) => l.codigo.startsWith(prefix + "-"))
    .map((l) => Number(l.codigo.split("-")[1]) || 0);
  const n = Math.max(0, ...nums) + 1;
  return prefix + "-" + String(n).padStart(3, "0");
}

function nextNumeroSocio() {
  const nums = loadSocios().map((s) => Number(String(s.numero || "").replace(/\D/g, "")) || 0);
  const n = Math.max(0, ...nums) + 1;
  return "SOC-" + String(n).padStart(3, "0");
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2800);
}
