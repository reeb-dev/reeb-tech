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

const CATEGORIAS = [
  { id: "ficcion", label: "Ficción" },
  { id: "noficcion", label: "No ficción" },
  { id: "infantil", label: "Infantil" },
  { id: "juvenil", label: "Juvenil" },
  { id: "tecnico", label: "Técnico" },
  { id: "referencia", label: "Referencia" }
];

function seedLibros() {
  return [
    { id: "l1", codigo: "FIC-001", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", editorial: "Sudamericana", año: 1967, categoria: "ficcion", ubicacion: "Estante A-1", ejemplares: 3, disponibles: 1, status: "disponible" },
    { id: "l2", codigo: "FIC-002", titulo: "Rayuela", autor: "Julio Cortázar", editorial: "Sudamericana", año: 1963, categoria: "ficcion", ubicacion: "Estante A-1", ejemplares: 2, disponibles: 0, status: "prestado" },
    { id: "l3", codigo: "INF-015", titulo: "El Principito", autor: "Antoine de Saint-Exupéry", editorial: "Emecé", año: 1943, categoria: "infantil", ubicacion: "Estante C-2", ejemplares: 4, disponibles: 2, status: "disponible" },
    { id: "l4", codigo: "TEC-008", titulo: "Introducción a los Algoritmos", autor: "Thomas H. Cormen", editorial: "MIT Press", año: 2009, categoria: "tecnico", ubicacion: "Estante D-3", ejemplares: 2, disponibles: 1, status: "reservado" },
    { id: "l5", codigo: "NOF-022", titulo: "Breve historia del tiempo", autor: "Stephen Hawking", editorial: "Crítica", año: 1988, categoria: "noficcion", ubicacion: "Estante B-2", ejemplares: 2, disponibles: 2, status: "disponible" },
    { id: "l6", codigo: "JUV-005", titulo: "Harry Potter y la piedra filosofal", autor: "J.K. Rowling", editorial: "Salamandra", año: 1997, categoria: "juvenil", ubicacion: "Estante C-1", ejemplares: 5, disponibles: 0, status: "prestado" }
  ];
}

function seedSocios() {
  return [
    { id: "s1", numero: "SOC-001", nombre: "María García", dni: "32.456.789", email: "maria.g@email.com", tel: "11-5555-1234", fechaAlta: "15 mar 2024", activo: true, multas: 0 },
    { id: "s2", numero: "SOC-002", nombre: "Carlos Rodríguez", dni: "28.123.456", email: "carlos.r@email.com", tel: "11-4444-5678", fechaAlta: "20 abr 2024", activo: true, multas: 1500 },
    { id: "s3", numero: "SOC-003", nombre: "Ana Martínez", dni: "35.789.012", email: "ana.m@email.com", tel: "11-3333-9012", fechaAlta: "1 jun 2024", activo: true, multas: 0 },
    { id: "s4", numero: "SOC-004", nombre: "Luis Fernández", dni: "30.456.123", email: "luis.f@email.com", tel: "11-2222-3456", fechaAlta: "10 ene 2024", activo: false, multas: 3500 }
  ];
}

function seedPrestamos() {
  return [
    { id: "p1", libro: "l2", socio: "s1", fechaPrestamo: "1 sep", fechaDevolucion: "15 sep", fechaDevuelto: null, status: "activo", renovaciones: 0 },
    { id: "p2", libro: "l6", socio: "s2", fechaPrestamo: "25 ago", fechaDevolucion: "8 sep", fechaDevuelto: null, status: "vencido", renovaciones: 1 },
    { id: "p3", libro: "l3", socio: "s3", fechaPrestamo: "5 sep", fechaDevolucion: "19 sep", fechaDevuelto: null, status: "activo", renovaciones: 0 },
    { id: "p4", libro: "l2", socio: "s2", fechaPrestamo: "10 ago", fechaDevolucion: "24 ago", fechaDevuelto: "22 ago", status: "devuelto", renovaciones: 0 },
    { id: "p5", libro: "l6", socio: "s1", fechaPrestamo: "1 ago", fechaDevolucion: "15 ago", fechaDevuelto: "14 ago", status: "devuelto", renovaciones: 0 }
  ];
}

let libros = null;
let socios = null;
let prestamos = null;

function loadLibros() {
  if (libros) return libros;
  const raw = localStorage.getItem("biblioteca-libros-v1");
  if (!raw) { libros = seedLibros(); localStorage.setItem("biblioteca-libros-v1", JSON.stringify(libros)); return libros; }
  return libros = JSON.parse(raw);
}

function loadSocios() {
  if (socios) return socios;
  const raw = localStorage.getItem("biblioteca-socios-v1");
  if (!raw) { socios = seedSocios(); localStorage.setItem("biblioteca-socios-v1", JSON.stringify(socios)); return socios; }
  return socios = JSON.parse(raw);
}

function loadPrestamos() {
  if (prestamos) return prestamos;
  const raw = localStorage.getItem("biblioteca-prestamos-v1");
  if (!raw) { prestamos = seedPrestamos(); localStorage.setItem("biblioteca-prestamos-v1", JSON.stringify(prestamos)); return prestamos; }
  return prestamos = JSON.parse(raw);
}

function saveLibros() { localStorage.setItem("biblioteca-libros-v1", JSON.stringify(libros)); }
function saveSocios() { localStorage.setItem("biblioteca-socios-v1", JSON.stringify(socios)); }
function savePrestamos() { localStorage.setItem("biblioteca-prestamos-v1", JSON.stringify(prestamos)); }

function labelLibro(status) { return STATUSES_LIBRO.find((s) => s.id === status)?.label || status; }
function labelPrestamo(status) { return STATUSES_PRESTAMO.find((s) => s.id === status)?.label || status; }
function catLabel(cat) { return CATEGORIAS.find((c) => c.id === cat)?.label || cat; }

function getLibro(id) { return loadLibros().find((l) => l.id === id); }
function getSocio(id) { return loadSocios().find((s) => s.id === id); }

function money(amount) { return "$ " + Number(amount || 0).toLocaleString("es-AR"); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
