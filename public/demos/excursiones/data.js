const STORAGE_RESERVAS = "excursiones-reservas-v2";
const STORAGE_TOURS = "excursiones-tours-v3";
const STORAGE_SALIDAS = "excursiones-salidas-v2";
const STORAGE_GUIAS = "excursiones-guias-v2";

const LOCAL = {
  nombre: "Senderos Tornquist",
  slogan: "Excursiones · Sierra de la Ventana",
  direccion: "Av. San Martín 540",
  barrio: "Sierra de la Ventana, Buenos Aires",
  telefono: "0291-491-1180",
  whatsapp: "5492915757934"
};

const LUGARES = [
  {
    id: "cerro",
    nombre: "Cerro Ventana",
    resumen: "Ventana natural. Trekking exigente.",
    texto: "Monumento natural en el Parque Tornquist. La abertura de la cumbre es la postal de la comarca. Jornada completa; inscripción en el parque.",
    foto: "img/cerro-ventana.jpg",
    tags: ["Exigente", "6 h"]
  },
  {
    id: "garganta",
    nombre: "Garganta del Diablo",
    resumen: "Cañadón y arroyo. Dificultad media.",
    texto: "Sendero de paredones y agua. Media jornada. No conviene con lluvia fuerte.",
    foto: "img/garganta.jpg",
    tags: ["Media", "4 h"]
  },
  {
    id: "cueva",
    nombre: "Cueva del Toro",
    resumen: "Cuarcita y cueva. Cupo chico.",
    texto: "Formaciones de cuarcita y cueva. Linterna incluida en la salida guiada.",
    foto: "img/cueva.jpg",
    tags: ["Media", "5 h"]
  },
  {
    id: "parque",
    nombre: "Parque Provincial Ernesto Tornquist",
    resumen: "Base Cerro Ventana, RP 76 km 226.",
    texto: "Miradores, senderos cortos y acceso al cerro. Entrada al parque aparte del valor de la excursión.",
    foto: "img/tornquist.jpg",
    tags: ["Baja / media"]
  },
  {
    id: "villa",
    nombre: "Villa Ventana",
    resumen: "Bosque, plaza y arroyo.",
    texto: "Paseo por el pueblo, casas de té y tramo del Sauce Grande. Ritmo suave.",
    foto: "img/villa-cartel.jpg",
    tags: ["Baja", "3 h"]
  },
  {
    id: "pueblo",
    nombre: "Sierra de la Ventana",
    resumen: "Av. San Martín y el Sauce Grande.",
    texto: "Punto de encuentro de las salidas. Comercios, golf y el cauce del arroyo.",
    foto: "img/pueblo-calle.jpg",
    tags: ["Pueblo"]
  },
  {
    id: "arroyo",
    nombre: "Arroyo Sauce Grande",
    resumen: "Cauce de la comarca.",
    texto: "Tramos para caminar sin desnivel. Sauces, piedra y sombra.",
    foto: "img/arroyo.jpg",
    tags: ["Baja"]
  },
  {
    id: "golf",
    nombre: "Campo de golf",
    resumen: "Cancha con sierras al fondo.",
    texto: "El golf del pueblo, con pinos y el cordón de Ventania. No es una salida de trekking.",
    foto: "img/golf.jpg",
    tags: ["Pueblo"]
  },
  {
    id: "miradores",
    nombre: "Miradores",
    resumen: "Vistas al valle y al cordón.",
    texto: "Cerro Ceferino y miradores del parque. Buena foto del pueblo y de las sierras.",
    foto: "img/mirador.jpg",
    tags: ["Vistas"]
  },
  {
    id: "sierras",
    nombre: "Sierras de Ventania",
    resumen: "El paisaje de todas las salidas.",
    texto: "Cuarcita, pastizal y pinares. Cerro Ventana y Tres Picos marcan el horizonte.",
    foto: "img/sierras-panorama.jpg",
    tags: ["Ventania"]
  }
];

const STATUSES = [
  { id: "pendiente", label: "Pendiente" },
  { id: "confirmada", label: "Confirmada" },
  { id: "en_curso", label: "En salida" },
  { id: "completa", label: "Completa" },
  { id: "cancelada", label: "Cancelada" }
];

const IDIOMAS = [
  { id: "es", label: "Español" },
  { id: "en", label: "Inglés" },
  { id: "es-en", label: "Español / inglés" }
];

const GUIAS_SEED = [
  {
    id: "laura",
    nombre: "Laura Quiroga",
    corto: "Laura",
    rol: "Cerro Ventana y parque",
    idiomas: "ES / EN",
    bio: "Guía del Parque Provincial Ernesto Tornquist. Cerro Ventana y miradores.",
    imagen: "img/guia-laura.jpg"
  },
  {
    id: "martin",
    nombre: "Martín Pescara",
    corto: "Martín",
    rol: "Garganta del Diablo",
    idiomas: "ES",
    bio: "Senderos de cañadón y arroyo. Salidas de media jornada.",
    imagen: "img/guia-martin.jpg"
  },
  {
    id: "sofia",
    nombre: "Sofía Herrera",
    corto: "Sofía",
    rol: "Cueva del Toro y cabalgatas",
    idiomas: "ES / EN",
    bio: "Cueva del Toro, Villa Ventana y cabalgata por las sierras.",
    imagen: "img/guia-sofia.jpg"
  }
];

const TOURS_SEED = [
  {
    id: "ventana",
    nombre: "Cerro Ventana",
    categoria: "trekking",
    descripcion: "Trekking al cerro con la ventana natural. Parque Provincial Ernesto Tornquist. Jornada completa.",
    duracion: "6 h",
    dificultad: "Exigente",
    horas: 6,
    cupo: 12,
    precio: 28000,
    idioma: "es-en",
    guia: "Laura",
    imagen: "img/cerro-ventana.jpg",
    publicado: true
  },
  {
    id: "garganta",
    nombre: "Garganta del Diablo",
    categoria: "trekking",
    descripcion: "Cañadón, paredones y arroyo. Media jornada. Calzado con suela, no es apto con lluvia fuerte.",
    duracion: "4 h",
    dificultad: "Media",
    horas: 4,
    cupo: 14,
    precio: 22000,
    idioma: "es",
    guia: "Martín",
    imagen: "img/garganta.jpg",
    publicado: true
  },
  {
    id: "cueva",
    nombre: "Cueva del Toro",
    categoria: "trekking",
    descripcion: "Formaciones de cuarcita y cueva. Linterna incluida. Cupo chico.",
    duracion: "5 h",
    dificultad: "Media",
    horas: 5,
    cupo: 10,
    precio: 24000,
    idioma: "es",
    guia: "Sofía",
    imagen: "img/cueva.jpg",
    publicado: true
  },
  {
    id: "parque",
    nombre: "Parque Provincial Tornquist",
    categoria: "parque",
    descripcion: "Circuito de miradores y senderos cortos. Entrada al parque no incluida.",
    duracion: "5 h",
    dificultad: "Baja / media",
    horas: 5,
    cupo: 16,
    precio: 18000,
    idioma: "es-en",
    guia: "Laura",
    imagen: "img/tornquist.jpg",
    publicado: true
  },
  {
    id: "villa",
    nombre: "Villa Ventana y arroyo",
    categoria: "pueblo",
    descripcion: "Paseo por el pueblo, plaza y tramo del arroyo Sauce Grande. Ritmo suave.",
    duracion: "3 h",
    dificultad: "Baja",
    horas: 3,
    cupo: 20,
    precio: 12000,
    idioma: "es-en",
    guia: "Martín",
    imagen: "img/arroyo.jpg",
    publicado: true
  },
  {
    id: "caballo",
    nombre: "Cabalgata en las sierras",
    categoria: "cabalgata",
    descripcion: "Caballo por pastizal y lomas. Nivel inicial. Mate al final. Traslado desde Sierra de la Ventana.",
    duracion: "3 h",
    dificultad: "Baja",
    horas: 3,
    cupo: 8,
    precio: 26000,
    idioma: "es",
    guia: "Sofía",
    imagen: "img/cabalgata.jpg",
    publicado: true
  }
];

function seedSalidas() {
  return [
    { id: "s1", tourId: "ventana", fecha: "2026-09-12", hora: "07:30", guia: "Laura", cupoTomado: 9, estado: "abierta" },
    { id: "s2", tourId: "garganta", fecha: "2026-09-10", hora: "09:00", guia: "Martín", cupoTomado: 14, estado: "completa" },
    { id: "s3", tourId: "cueva", fecha: "2026-09-11", hora: "08:30", guia: "Sofía", cupoTomado: 6, estado: "abierta" },
    { id: "s4", tourId: "caballo", fecha: "2026-09-13", hora: "09:30", guia: "Sofía", cupoTomado: 4, estado: "abierta" },
    { id: "s5", tourId: "villa", fecha: "2026-09-09", hora: "15:00", guia: "Martín", cupoTomado: 8, estado: "abierta" },
    { id: "s6", tourId: "parque", fecha: "2026-09-16", hora: "08:00", guia: "Laura", cupoTomado: 5, estado: "abierta" }
  ];
}

function seedReservas() {
  return [
    {
      id: "p1",
      codigo: "E-041",
      tourId: "ventana",
      salidaId: "s1",
      plazas: 2,
      cliente: { nombre: "Ana Kovacic", tel: "11-4300-2211", email: "ana.k@email.com" },
      idioma: "es",
      notas: "Primera vez en el cerro. Piden ritmo medio.",
      status: "confirmada",
      origen: "web",
      history: [{ when: "4 sep", text: "Plazas confirmadas para Cerro Ventana." }]
    },
    {
      id: "p2",
      codigo: "E-042",
      tourId: "garganta",
      salidaId: "s2",
      plazas: 2,
      cliente: { nombre: "Tom Harris", tel: "11-5555-0190", email: "" },
      idioma: "en",
      notas: "Prefiere guía en inglés; Martín habla español. Se anotó igual.",
      status: "completa",
      origen: "web",
      history: [{ when: "10 sep", text: "Salida completa. Volvieron a las 13:30." }]
    },
    {
      id: "p3",
      codigo: "E-043",
      tourId: "cueva",
      salidaId: "s3",
      plazas: 3,
      cliente: { nombre: "Familia Ruiz", tel: "291-15-333-441", email: "ruiz.tv@email.com" },
      idioma: "es",
      notas: "Dos adultos, un adolescente.",
      status: "confirmada",
      origen: "whatsapp",
      history: [{ when: "6 sep", text: "Reserva por WhatsApp." }]
    },
    {
      id: "p4",
      codigo: "E-044",
      tourId: "caballo",
      salidaId: "s4",
      plazas: 1,
      cliente: { nombre: "Lucía Ferreyra", tel: "291-411-8820", email: "" },
      idioma: "es",
      notas: "Primera vez a caballo.",
      status: "pendiente",
      origen: "web",
      history: [{ when: "hoy", text: "Pedido desde la web." }]
    }
  ];
}

function loadTours() {
  const raw = localStorage.getItem(STORAGE_TOURS);
  if (!raw) {
    localStorage.setItem(STORAGE_TOURS, JSON.stringify(TOURS_SEED));
    return TOURS_SEED.map((t) => ({ ...t }));
  }
  return JSON.parse(raw);
}
function saveTours(items) { localStorage.setItem(STORAGE_TOURS, JSON.stringify(items)); }

function loadGuias() {
  const raw = localStorage.getItem(STORAGE_GUIAS);
  if (!raw) {
    localStorage.setItem(STORAGE_GUIAS, JSON.stringify(GUIAS_SEED));
    return GUIAS_SEED.map((g) => ({ ...g }));
  }
  return JSON.parse(raw);
}
function saveGuias(items) { localStorage.setItem(STORAGE_GUIAS, JSON.stringify(items)); }

function loadSalidas() {
  const raw = localStorage.getItem(STORAGE_SALIDAS);
  if (!raw) {
    const data = seedSalidas();
    localStorage.setItem(STORAGE_SALIDAS, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}
function saveSalidas(items) { localStorage.setItem(STORAGE_SALIDAS, JSON.stringify(items)); }

function loadReservas() {
  const raw = localStorage.getItem(STORAGE_RESERVAS);
  if (!raw) {
    const data = seedReservas();
    localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}
function saveReservas(items) { localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(items)); }

function getTour(id, list) { return (list || loadTours()).find((t) => t.id === id); }
function getSalida(id, list) { return (list || loadSalidas()).find((s) => s.id === id); }
function idiomaLabel(id) { return IDIOMAS.find((i) => i.id === id)?.label || id; }
function label(status) { return STATUSES.find((s) => s.id === status)?.label || status; }
function cupoLibre(salida, tour) {
  const t = tour || getTour(salida.tourId);
  return Math.max(0, (t?.cupo || 0) - (salida.cupoTomado || 0));
}
function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
