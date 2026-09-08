const STORAGE_RESERVAS = "complejo-reservas-v2";
const STORAGE_PAQUETES = "complejo-paquetes-v2";
const STORAGE_ACTIVIDADES = "complejo-actividades-v2";
const STORAGE_SPA = "complejo-spa-v2";

const LOCAL = {
  nombre: "Complejo El Palomar",
  slogan: "Golf, spa y sierras · Sierra de la Ventana",
  direccion: "Ruta 76 km 227",
  barrio: "Sierra de la Ventana, partido de Tornquist",
  telefono: "0291-491-3300",
  whatsapp: "5492915757934"
};

const LUGARES = [
  {
    id: "cerro",
    nombre: "Cerro Ventana",
    resumen: "La postal del parque, a minutos del predio.",
    texto: "Monumento natural dentro del Parque Tornquist. Desde El Palomar se llega por Ruta 76 hasta la Base Cerro Ventana (km 226).",
    foto: "img/cerro-ventana.jpg",
    tags: ["Parque Tornquist"]
  },
  {
    id: "garganta",
    nombre: "Garganta del Diablo",
    resumen: "Cañadón del parque. Media jornada.",
    texto: "Sendero de paredones y arroyo. Conviene calzado con suela y consultar si el sendero está habilitado.",
    foto: "img/garganta.jpg",
    tags: ["Parque Tornquist"]
  },
  {
    id: "cueva",
    nombre: "Cueva del Toro",
    resumen: "Cuarcita y cueva.",
    texto: "Formaciones del sistema de Ventania. Recorrido con linterna; cupo chico.",
    foto: "img/cueva.jpg",
    tags: ["Geología"]
  },
  {
    id: "parque",
    nombre: "Parque Provincial Ernesto Tornquist",
    resumen: "A minutos por Ruta 76.",
    texto: "El predio queda cerca de la Base Cerro Ventana. Miradores, senderos cortos y el cerro. Entrada al parque aparte.",
    foto: "img/tornquist.jpg",
    tags: ["RP 76 km 226"]
  },
  {
    id: "villa",
    nombre: "Villa Ventana",
    resumen: "Bosque y arroyo, unos 20 minutos.",
    texto: "Pueblo de ripio y casas de té. Buen paseo si no se sale al cerro ese día.",
    foto: "img/villa-cartel.jpg",
    tags: ["Pueblo"]
  },
  {
    id: "pueblo",
    nombre: "Sierra de la Ventana",
    resumen: "Av. San Martín y servicios.",
    texto: "La localidad sobre el Sauce Grande. Comercios, golf del pueblo y el cauce.",
    foto: "img/pueblo-calle.jpg",
    tags: ["Pueblo"]
  },
  {
    id: "arroyo",
    nombre: "Arroyo Sauce Grande",
    resumen: "Sendero Sauce, en el predio y afuera.",
    texto: "El arroyo recorre la comarca. En El Palomar hay un tramo para caminar a la tarde.",
    foto: "img/arroyo.jpg",
    tags: ["Predio"]
  },
  {
    id: "miradores",
    nombre: "Miradores",
    resumen: "Vistas al cordón y al valle.",
    texto: "Miradores del parque y del cerro Ceferino. Desde arriba se ven los pueblos y las sierras.",
    foto: "img/mirador.jpg",
    tags: ["Vistas"]
  },
  {
    id: "sierras",
    nombre: "Sierras de Ventania",
    resumen: "El horizonte de todo el predio.",
    texto: "Cordón de cuarcita del sudoeste bonaerense. Se ve desde la cancha, la pileta y las habitaciones.",
    foto: "img/sierras-panorama.jpg",
    tags: ["Ventania"]
  }
];

const STATUSES = [
  { id: "pendiente", label: "Pendiente" },
  { id: "confirmada", label: "Confirmada" },
  { id: "checkin", label: "En el predio" },
  { id: "checkout", label: "Check-out" },
  { id: "cancelada", label: "Cancelada" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

const PAQUETES_SEED = [
  {
    id: "finde",
    nombre: "Fin de semana en las sierras",
    tipo: "estadia",
    descripcion: "Dos noches, desayuno y una green fee de 9 hoyos. Habitación con vista a las lomas.",
    precio: 210000,
    noches: 2,
    pax: 2,
    incluye: ["2 noches", "Desayuno", "9 hoyos", "Pileta"],
    imagen: "img/hab.jpg",
    publicado: true
  },
  {
    id: "golfspa",
    nombre: "Golf + spa",
    tipo: "spa",
    descripcion: "Una noche, masaje de 50 min y green fee. Pensado para un día de juego y descanso.",
    precio: 165000,
    noches: 1,
    pax: 2,
    incluye: ["1 noche", "Masaje", "Green fee", "Hidromasaje"],
    imagen: "img/spa.jpg",
    publicado: true
  },
  {
    id: "semana",
    nombre: "Semana familiar",
    tipo: "estadia",
    descripcion: "Siete noches. Habitación familiar, pileta y una cabalgata corta en el predio.",
    precio: 580000,
    noches: 7,
    pax: 4,
    incluye: ["7 noches", "Pileta", "Cabalgata", "Desayuno"],
    imagen: "img/sierras.jpg",
    publicado: true
  },
  {
    id: "relax",
    nombre: "Día de spa",
    tipo: "spa",
    descripcion: "Sin pernocte. Circuito de hidromasaje, sauna y masaje. Almuerzo en el resto del predio.",
    precio: 45000,
    noches: 0,
    pax: 1,
    incluye: ["Circuito spa", "Masaje 40 min", "Almuerzo"],
    imagen: "img/spa.jpg",
    publicado: true
  }
];

const ACTIVIDADES_SEED = [
  {
    id: "a1",
    nombre: "Green fee 9 hoyos",
    hora: "09:00",
    lugar: "Cancha del predio",
    cupo: 16,
    tomados: 7,
    imagen: "img/golf.jpg"
  },
  {
    id: "a2",
    nombre: "Trekking corto al mirador",
    hora: "10:30",
    lugar: "Salida desde recepción",
    cupo: 12,
    tomados: 5,
    imagen: "img/trekking.jpg"
  },
  {
    id: "a3",
    nombre: "Yoga en el deck",
    hora: "08:00",
    lugar: "Deck pileta",
    cupo: 10,
    tomados: 4,
    imagen: "img/yoga.jpg"
  },
  {
    id: "a4",
    nombre: "Paseo por el arroyo",
    hora: "16:00",
    lugar: "Sendero Sauce",
    cupo: 14,
    tomados: 3,
    imagen: "img/arroyo.jpg"
  }
];

function seedReservas() {
  return [
    {
      id: "h1",
      codigo: "C-021",
      paqueteId: "finde",
      checkin: "2026-09-12",
      checkout: "2026-09-14",
      huespedes: 2,
      cliente: { nombre: "Clara Méndez", tel: "11-4300-8810", email: "clara.m@email.com" },
      notas: "Pidieron turno de spa el sábado 11 hs.",
      status: "confirmada",
      origen: "web",
      factura: null,
      history: [{ when: "3 sep", text: "Paquete fin de semana confirmado." }]
    },
    {
      id: "h2",
      codigo: "C-022",
      paqueteId: "golfspa",
      checkin: "2026-09-08",
      checkout: "2026-09-09",
      huespedes: 2,
      cliente: { nombre: "Pablo Irigoyen", tel: "291-15-220-441", email: "" },
      notas: "Sale a las 9 a la cancha.",
      status: "checkin",
      origen: "recepcion",
      factura: null,
      history: [{ when: "8 sep", text: "Check-in. Green fee anotado." }]
    },
    {
      id: "h3",
      codigo: "C-019",
      paqueteId: "relax",
      checkin: "2026-09-07",
      checkout: "2026-09-07",
      huespedes: 1,
      cliente: { nombre: "Elena Duarte", tel: "11-2222-0190", email: "elena.d@email.com" },
      notas: "",
      status: "checkout",
      origen: "web",
      factura: { tipo: "FB", numero: "0001-00000312", cae: "74185296303301", vto: "17 sep", total: 45000 },
      history: [{ when: "7 sep", text: "Día de spa. Factura B." }]
    }
  ];
}

function seedSpa() {
  return [
    { id: "sp1", nombre: "Clara Méndez", servicio: "Masaje 50 min", fecha: "2026-09-13", hora: "11:00", status: "reservado" },
    { id: "sp2", nombre: "Pablo Irigoyen", servicio: "Hidromasaje", fecha: "2026-09-08", hora: "18:00", status: "hecho" }
  ];
}

function loadPaquetes() {
  const raw = localStorage.getItem(STORAGE_PAQUETES);
  if (!raw) {
    localStorage.setItem(STORAGE_PAQUETES, JSON.stringify(PAQUETES_SEED));
    return PAQUETES_SEED.map((p) => ({ ...p, incluye: [...p.incluye] }));
  }
  return JSON.parse(raw);
}
function savePaquetes(items) { localStorage.setItem(STORAGE_PAQUETES, JSON.stringify(items)); }

function loadActividades() {
  const raw = localStorage.getItem(STORAGE_ACTIVIDADES);
  if (!raw) {
    localStorage.setItem(STORAGE_ACTIVIDADES, JSON.stringify(ACTIVIDADES_SEED));
    return ACTIVIDADES_SEED.map((a) => ({ ...a }));
  }
  return JSON.parse(raw);
}
function saveActividades(items) { localStorage.setItem(STORAGE_ACTIVIDADES, JSON.stringify(items)); }

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

function loadSpa() {
  const raw = localStorage.getItem(STORAGE_SPA);
  if (!raw) {
    const data = seedSpa();
    localStorage.setItem(STORAGE_SPA, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}
function saveSpa(items) { localStorage.setItem(STORAGE_SPA, JSON.stringify(items)); }

function getPaquete(id, list) { return (list || loadPaquetes()).find((p) => p.id === id); }
function label(status) { return STATUSES.find((s) => s.id === status)?.label || status; }
function compLabel(comp) { return COMPROBANTES.find((c) => c.id === comp)?.label || comp; }
function money(amount) { return "$ " + Number(amount || 0).toLocaleString("es-AR"); }
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
