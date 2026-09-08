const STORAGE_RESERVAS = "hospedaje-reservas-v2";
const STORAGE_HABITACIONES = "hospedaje-habitaciones-v2";

const LOCAL = {
  nombre: "Cabañas del Sauce",
  slogan: "Villa Ventana · Sierra de la Ventana",
  direccion: "Calle Los Álamos s/n",
  barrio: "Villa Ventana, partido de Tornquist",
  telefono: "0291-491-2200",
  whatsapp: "5492915757934"
};

const LUGARES = [
  {
    id: "cerro",
    nombre: "Cerro Ventana",
    resumen: "La ventana de cuarcita. Trekking de jornada.",
    texto: "Monumento natural en el Parque Provincial Ernesto Tornquist. La abertura en la cumbre da nombre a la comarca. Salida de jornada; hay que inscribirse en el parque.",
    foto: "img/cerro-ventana.jpg",
    tags: ["Parque Tornquist", "Trekking"]
  },
  {
    id: "garganta",
    nombre: "Garganta del Diablo",
    resumen: "Cañadón y arroyo. Media jornada.",
    texto: "Sendero de cañadón, paredones y agua dentro del parque. Calzado con suela. No conviene con lluvia fuerte.",
    foto: "img/garganta.jpg",
    tags: ["Parque Tornquist", "Media jornada"]
  },
  {
    id: "cueva",
    nombre: "Cueva del Toro",
    resumen: "Cuarcita y cueva. Cupo chico.",
    texto: "Formaciones de cuarcita y cueva en el sistema de Ventania. Recorrido con linterna; el cupo es reducido.",
    foto: "img/cueva.jpg",
    tags: ["Trekking", "Geología"]
  },
  {
    id: "parque",
    nombre: "Parque Provincial Ernesto Tornquist",
    resumen: "Base Cerro Ventana, RP 76 km 226.",
    texto: "Acceso por el portón de la Ruta 76. Miradores, senderos cortos y el cerro. La entrada es arancelada; los senderos se habilitan según el clima.",
    foto: "img/tornquist.jpg",
    tags: ["RP 76", "Miradores"]
  },
  {
    id: "villa",
    nombre: "Villa Ventana",
    resumen: "Pueblo de bosque y arroyo, a 17 km.",
    texto: "Calles de ripio, casas de té y cabañas entre árboles. A 17 km de Sierra de la Ventana. El Sauce Grande pasa por el pueblo.",
    foto: "img/villa-cartel.jpg",
    tags: ["Pueblo", "Arroyo"]
  },
  {
    id: "pueblo",
    nombre: "Sierra de la Ventana",
    resumen: "Pueblo sobre el Sauce Grande y Av. San Martín.",
    texto: "Localidad de servicios de la comarca: avenida, golf y comercios. Base para salidas al parque y a Villa Ventana.",
    foto: "img/pueblo-calle.jpg",
    tags: ["Pueblo", "Av. San Martín"]
  },
  {
    id: "arroyo",
    nombre: "Arroyo Sauce Grande",
    resumen: "Cauce que recorre Villa Ventana y el pueblo.",
    texto: "Caminatas suaves, sauces y piedra en la orilla. Pasa junto a las cabañas del predio.",
    foto: "img/arroyo.jpg",
    tags: ["Caminata suave"]
  },
  {
    id: "golf",
    nombre: "Campo de golf",
    resumen: "Cancha con las sierras al fondo.",
    texto: "Campo de golf de Sierra de la Ventana. Césped, pinos y el cordón de Ventania detrás.",
    foto: "img/golf.jpg",
    tags: ["Sierra de la Ventana"]
  },
  {
    id: "miradores",
    nombre: "Miradores",
    resumen: "Vistas al cordón y a los pueblos del valle.",
    texto: "Cerro Ceferino en el pueblo y miradores del parque. Desde arriba se ven Villa Ventana, el valle y las sierras.",
    foto: "img/mirador.jpg",
    tags: ["Vistas", "Sierras"]
  },
  {
    id: "sierras",
    nombre: "Sierras de Ventania",
    resumen: "El cordón del sudoeste bonaerense.",
    texto: "Sistema serrano de cuarcita. Cerro Ventana, Tres Picos y pastizal. El paisaje de toda la comarca.",
    foto: "img/sierras-panorama.jpg",
    tags: ["Ventania"]
  }
];

const STATUSES = [
  { id: "pendiente", label: "Pendiente" },
  { id: "confirmada", label: "Confirmada" },
  { id: "checkin", label: "Check-in" },
  { id: "checkout", label: "Check-out" },
  { id: "cancelada", label: "Cancelada" }
];

const TIPOS = [
  { id: "cabana", label: "Cabaña" },
  { id: "suite", label: "Suite" },
  { id: "depto", label: "Departamento" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "FA", label: "Factura A" },
  { id: "TK", label: "Ticket" }
];

const HABITACIONES_SEED = [
  {
    id: "arroyo",
    nombre: "Cabaña frente al arroyo",
    tipo: "cabana",
    descripcion: "Dos personas. Deck sobre el arroyo Sauce Grande. Cocina y estufa a leña.",
    precio: 72000,
    pax: 2,
    metros: 42,
    amenities: ["Frente al arroyo", "Cocina", "Estufa a leña", "Deck", "Wi-Fi"],
    imagen: "img/arroyo.jpg",
    publicado: true
  },
  {
    id: "cerro",
    nombre: "Cabaña vista al cerro",
    tipo: "cabana",
    descripcion: "Dos dormitorios. Vista al Cerro Ventana. A 12 minutos del acceso al parque Tornquist.",
    precio: 98000,
    pax: 4,
    metros: 68,
    amenities: ["Vista al cerro", "2 dormitorios", "Parrilla", "Estacionamiento", "Wi-Fi"],
    imagen: "img/cerro-ventana.jpg",
    publicado: true
  },
  {
    id: "suite",
    nombre: "Suite de las sierras",
    tipo: "suite",
    descripcion: "Cama king, hidromasaje y desayuno. Ideal para un fin de semana en Villa Ventana.",
    precio: 88000,
    pax: 2,
    metros: 36,
    amenities: ["Hidromasaje", "Desayuno", "Calefacción", "Caja fuerte", "Wi-Fi"],
    imagen: "img/suite.jpg",
    publicado: true
  },
  {
    id: "loft",
    nombre: "Loft Villa Ventana",
    tipo: "depto",
    descripcion: "Un ambiente con entrepiso. A cuatro cuadras de la plaza del pueblo.",
    precio: 61000,
    pax: 2,
    metros: 30,
    amenities: ["Kitchenette", "Calefacción", "TV", "Wi-Fi"],
    imagen: "img/loft.jpg",
    publicado: true
  },
  {
    id: "familiar",
    nombre: "Cabaña familiar",
    tipo: "cabana",
    descripcion: "Tres dormitorios, living con hogar y parrilla cubierta. Hasta seis personas.",
    precio: 135000,
    pax: 6,
    metros: 90,
    amenities: ["3 dormitorios", "Parrilla", "Lavadero", "Estacionamiento", "Wi-Fi"],
    imagen: "img/cabana.jpg",
    publicado: true
  },
  {
    id: "pueblo",
    nombre: "Depto en el pueblo",
    tipo: "depto",
    descripcion: "Dos ambientes en Villa Ventana. Cama queen y sofá cama. A pie de almacenes y plaza.",
    precio: 69000,
    pax: 3,
    metros: 40,
    amenities: ["En el pueblo", "Cocina", "Calefacción", "Wi-Fi"],
    imagen: "img/villa-ventana.jpg",
    publicado: true
  }
];

function seedReservas() {
  return [
    {
      id: "r1",
      codigo: "H-014",
      habitacionId: "arroyo",
      checkin: "2026-09-12",
      checkout: "2026-09-15",
      huespedes: 2,
      cliente: { nombre: "Laura Benedetti", tel: "11-5555-2010", email: "laura.b@email.com" },
      notas: "Llegan a las 16. Pedido de leña extra.",
      status: "confirmada",
      origen: "web",
      factura: null,
      history: [{ when: "5 sep", text: "Reserva confirmada. Seña por transferencia." }]
    },
    {
      id: "r2",
      codigo: "H-015",
      habitacionId: "cerro",
      checkin: "2026-09-08",
      checkout: "2026-09-11",
      huespedes: 4,
      cliente: { nombre: "Diego y Paula Rivas", tel: "11-4444-8810", email: "" },
      notas: "Suben al Cerro Ventana el sábado.",
      status: "checkin",
      origen: "whatsapp",
      factura: null,
      history: [
        { when: "8 sep", text: "Check-in 14:20." },
        { when: "2 sep", text: "Reserva por WhatsApp." }
      ]
    },
    {
      id: "r3",
      codigo: "H-012",
      habitacionId: "suite",
      checkin: "2026-09-04",
      checkout: "2026-09-07",
      huespedes: 2,
      cliente: { nombre: "Martín Soler", tel: "0291-15-412-330", email: "msoler@email.com" },
      notas: "",
      status: "checkout",
      origen: "web",
      factura: { tipo: "FB", numero: "0001-00000418", cae: "74185296304410", vto: "17 sep", total: 264000 },
      history: [
        { when: "7 sep", text: "Check-out. Factura B emitida." },
        { when: "4 sep", text: "Check-in." }
      ]
    },
    {
      id: "r4",
      codigo: "H-016",
      habitacionId: "familiar",
      checkin: "2026-09-18",
      checkout: "2026-09-25",
      huespedes: 5,
      cliente: { nombre: "Familia Álvarez", tel: "291-488-2201", email: "alvarez.f@email.com" },
      notas: "Semana larga. Preguntaron por Garganta del Diablo.",
      status: "pendiente",
      origen: "web",
      factura: null,
      history: [{ when: "hoy", text: "Pedido desde la web. Esperando seña." }]
    },
    {
      id: "r5",
      codigo: "H-013",
      habitacionId: "loft",
      checkin: "2026-09-06",
      checkout: "2026-09-08",
      huespedes: 2,
      cliente: { nombre: "Sofía Langer", tel: "11-2222-0199", email: "" },
      notas: "",
      status: "cancelada",
      origen: "web",
      factura: null,
      history: [{ when: "6 sep", text: "Canceló el mismo día. Sin seña." }]
    }
  ];
}

function loadHabitaciones() {
  const raw = localStorage.getItem(STORAGE_HABITACIONES);
  if (!raw) {
    localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify(HABITACIONES_SEED));
    return HABITACIONES_SEED.map((h) => ({ ...h, amenities: [...h.amenities] }));
  }
  return JSON.parse(raw);
}

function saveHabitaciones(items) {
  localStorage.setItem(STORAGE_HABITACIONES, JSON.stringify(items));
}

function loadReservas() {
  const raw = localStorage.getItem(STORAGE_RESERVAS);
  if (!raw) {
    const data = seedReservas();
    localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function saveReservas(items) {
  localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(items));
}

function getHabitacion(id, list) {
  return (list || loadHabitaciones()).find((h) => h.id === id);
}

function tipoLabel(id) {
  return TIPOS.find((t) => t.id === id)?.label || id;
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function nights(checkin, checkout) {
  const a = new Date(`${checkin}T12:00:00`);
  const b = new Date(`${checkout}T12:00:00`);
  const n = Math.round((b - a) / 86400000);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function calcTotal(item, list) {
  const hab = getHabitacion(item.habitacionId, list);
  return nights(item.checkin, item.checkout) * (hab?.precio || 0);
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}
