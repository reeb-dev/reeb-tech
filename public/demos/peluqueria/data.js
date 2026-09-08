const STORAGE_TURNOS = "peluqueria-turnos-v2";
const STORAGE_SERVICIOS = "peluqueria-servicios-v2";
const STORAGE_CLIENTES = "peluqueria-clientes-v2";

const LOCAL = {
  nombre: "Salón Camelia",
  slogan: "Cabello y uñas · Belgrano",
  direccion: "Av. Cabildo 2840",
  barrio: "Belgrano, CABA",
  horarios: [
    "Martes a viernes: 10 a 20",
    "Sábados: 9 a 18",
    "Lunes y domingo: cerrado"
  ],
  telefono: "011-4783-4410",
  whatsapp: "5492915757934"
};

const STATUSES = [
  { id: "reservado", label: "Reservado" },
  { id: "en_atencion", label: "En atención" },
  { id: "terminado", label: "Terminado" },
  { id: "cancelado", label: "Cancelado" },
  { id: "no_show", label: "No se presentó" }
];

const CATEGORIAS = [
  { id: "cabello", label: "Cabello" },
  { id: "color", label: "Color" },
  { id: "uñas", label: "Uñas" }
];

const PROFESIONALES = [
  {
    id: "lucia",
    nombre: "Lucía Ferraro",
    corto: "Lucía",
    rol: "Color y corte dama",
    bio: "Once años en salón. Color, mechas y cortes que se mantienen.",
    imagen: "img/lucia.jpg"
  },
  {
    id: "diego",
    nombre: "Diego Molina",
    corto: "Diego",
    rol: "Barbería",
    bio: "Fade, barba a navaja y corte clásico. Martes a sábado.",
    imagen: "img/diego.jpg"
  },
  {
    id: "yamila",
    nombre: "Yamila Soto",
    corto: "Yamila",
    rol: "Uñas",
    bio: "Manicura, semipermanente y diseño. Turnos de 45 a 60 minutos.",
    imagen: "img/yamila.jpg"
  }
];

const IMAGEN_SERVICIO = {
  corte_m: "img/corte-caballero.jpg",
  corte_f: "img/corte-dama.jpg",
  barba: "img/barba.jpg",
  tintura: "img/tintura.jpg",
  mechas: "img/mechas.jpg",
  brushing: "img/brushing.jpg",
  alisado: "img/alisado.jpg",
  tratamiento: "img/tratamiento.jpg",
  peinado: "img/peinado.jpg",
  manicura: "img/manicura.jpg",
  pedicura: "img/pedicura.jpg"
};

const SERVICIOS_SEED = [
  {
    id: "corte_m",
    label: "Corte caballero",
    descripcion: "Fade o clásico, con lavado. Diego en silla de barbería.",
    precio: 8500,
    duracion: 30,
    categoria: "cabello",
    profesional: "Diego",
    imagen: "img/corte-caballero.jpg",
    publicado: true
  },
  {
    id: "corte_f",
    label: "Corte dama",
    descripcion: "Corte con lavado. Largo, bob o flequillo, según el pelo.",
    precio: 12000,
    duracion: 45,
    categoria: "cabello",
    profesional: "Lucía",
    imagen: "img/corte-dama.jpg",
    publicado: true
  },
  {
    id: "barba",
    label: "Barba a navaja",
    descripcion: "Perfilado con navaja, toalla caliente y bálsamo.",
    precio: 5000,
    duracion: 20,
    categoria: "cabello",
    profesional: "Diego",
    imagen: "img/barba.jpg",
    publicado: true
  },
  {
    id: "tintura",
    label: "Tintura",
    descripcion: "Color entero, incluyendo fantasía. Prueba de mecha si hace falta.",
    precio: 25000,
    duracion: 90,
    categoria: "color",
    profesional: "Lucía",
    imagen: "img/tintura.jpg",
    publicado: true
  },
  {
    id: "mechas",
    label: "Mechas y balayage",
    descripcion: "Reflejos, balayage o babylights. Incluye tono y tratamiento.",
    precio: 35000,
    duracion: 120,
    categoria: "color",
    profesional: "Lucía",
    imagen: "img/mechas.jpg",
    publicado: true
  },
  {
    id: "brushing",
    label: "Brushing",
    descripcion: "Secado con cepillo. Volumen o liso, según el corte.",
    precio: 8000,
    duracion: 30,
    categoria: "cabello",
    profesional: "Lucía",
    imagen: "img/brushing.jpg",
    publicado: true
  },
  {
    id: "alisado",
    label: "Alisado",
    descripcion: "Keratina o alisado progresivo. Primera vez: prueba de sensibilidad.",
    precio: 45000,
    duracion: 180,
    categoria: "cabello",
    profesional: "Lucía",
    imagen: "img/alisado.jpg",
    publicado: true
  },
  {
    id: "tratamiento",
    label: "Tratamiento capilar",
    descripcion: "Lavado, masaje y máscara. Pelo reseco, teñido o con rulos.",
    precio: 15000,
    duracion: 45,
    categoria: "cabello",
    profesional: "Lucía",
    imagen: "img/tratamiento.jpg",
    publicado: true
  },
  {
    id: "peinado",
    label: "Peinado de evento",
    descripcion: "Recogido, ondas o extensiones para casamiento, 15 o foto.",
    precio: 18000,
    duracion: 60,
    categoria: "cabello",
    profesional: "Lucía",
    imagen: "img/peinado.jpg",
    publicado: true
  },
  {
    id: "manicura",
    label: "Manicura",
    descripcion: "Limado, cutícula y esmaltado. Rosa, nude o diseño simple.",
    precio: 9000,
    duracion: 45,
    categoria: "uñas",
    profesional: "Yamila",
    imagen: "img/manicura.jpg",
    publicado: true
  },
  {
    id: "pedicura",
    label: "Semipermanente",
    descripcion: "Esmaltado gel con lámpara. Dura dos o tres semanas.",
    precio: 11000,
    duracion: 60,
    categoria: "uñas",
    profesional: "Yamila",
    imagen: "img/pedicura.jpg",
    publicado: true
  }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "RC", label: "Recibo" },
  { id: "TK", label: "Ticket" }
];

function seedTurnos() {
  return [
    {
      id: "p1",
      turno: "T-001",
      fecha: "8 sep",
      hora: "10:00",
      cliente: { nombre: "Carolina Méndez", tel: "11-5555-1234", email: "carolina.m@email.com" },
      servicios: ["corte_f", "brushing"],
      profesional: "Lucía",
      notas: "Prefiere largo hasta los hombros",
      status: "en_atencion",
      origen: "salon",
      factura: null,
      history: [
        { when: "10:05", text: "Cliente en atención con Lucía." },
        { when: "9:55", text: "Cliente llegó." }
      ]
    },
    {
      id: "p2",
      turno: "T-002",
      fecha: "8 sep",
      hora: "10:30",
      cliente: { nombre: "Martín Gómez", tel: "11-4444-5678", email: "" },
      servicios: ["corte_m", "barba"],
      profesional: "Diego",
      notas: "",
      status: "reservado",
      origen: "whatsapp",
      factura: null,
      history: [
        { when: "7 sep", text: "Turno reservado por WhatsApp." }
      ]
    },
    {
      id: "p3",
      turno: "T-003",
      fecha: "8 sep",
      hora: "11:00",
      cliente: { nombre: "Sofía Ruiz", tel: "11-3333-9999", email: "sofi.ruiz@email.com" },
      servicios: ["tintura", "corte_f"],
      profesional: "Lucía",
      notas: "Tintura castaño oscuro. Alérgica a amoníaco.",
      status: "reservado",
      origen: "web",
      factura: null,
      history: [
        { when: "5 sep", text: "Turno reservado. Se anotó alergia." }
      ]
    },
    {
      id: "p4",
      turno: "T-004",
      fecha: "8 sep",
      hora: "09:00",
      cliente: { nombre: "Roberto Fernández", tel: "11-2222-7777", email: "" },
      servicios: ["corte_m"],
      profesional: "Diego",
      notas: "",
      status: "terminado",
      origen: "salon",
      factura: { tipo: "TK", numero: "0001-00008842", cae: "74185296301234", vto: "18 sep", total: 8500 },
      history: [
        { when: "09:28", text: "Servicio terminado. Pagó en efectivo." },
        { when: "09:00", text: "Comenzó atención." }
      ]
    },
    {
      id: "p5",
      turno: "T-005",
      fecha: "8 sep",
      hora: "14:00",
      cliente: { nombre: "Ana Belén Torres", tel: "11-6666-3333", email: "anabelen@email.com" },
      servicios: ["mechas", "tratamiento"],
      profesional: "Lucía",
      notas: "Mechas balayage. Traer foto de referencia.",
      status: "reservado",
      origen: "web",
      factura: null,
      history: [
        { when: "6 sep", text: "Turno confirmado." }
      ]
    },
    {
      id: "p6",
      turno: "T-006",
      fecha: "7 sep",
      hora: "16:00",
      cliente: { nombre: "Claudia Pereyra", tel: "11-8888-4444", email: "" },
      servicios: ["manicura", "pedicura"],
      profesional: "Yamila",
      notas: "",
      status: "terminado",
      origen: "salon",
      factura: { tipo: "FB", numero: "0001-00000223", cae: "74185296301230", vto: "17 sep", total: 20000 },
      history: [
        { when: "17:45", text: "Servicios completados." },
        { when: "16:00", text: "Comenzó manicura." }
      ]
    },
    {
      id: "p7",
      turno: "T-007",
      fecha: "7 sep",
      hora: "11:00",
      cliente: { nombre: "Pedro Sánchez", tel: "11-7777-2222", email: "" },
      servicios: ["corte_m"],
      profesional: "Diego",
      notas: "",
      status: "no_show",
      origen: "whatsapp",
      factura: null,
      history: [
        { when: "11:15", text: "No se presentó. Sin aviso." }
      ]
    },
    {
      id: "p8",
      turno: "T-008",
      fecha: "9 sep",
      hora: "10:00",
      cliente: { nombre: "Valentina López", tel: "11-1111-8888", email: "vale.lopez@email.com" },
      servicios: ["alisado"],
      profesional: "Lucía",
      notas: "Primer alisado. Hacer prueba de sensibilidad.",
      status: "reservado",
      origen: "web",
      factura: null,
      history: [
        { when: "8 sep", text: "Turno reservado para mañana." }
      ]
    }
  ];
}

function seedClientes() {
  return [
    { id: "c1", nombre: "Carolina Méndez", tel: "11-5555-1234", email: "carolina.m@email.com", profesional: "Lucía", notas: "Largo hasta los hombros." },
    { id: "c2", nombre: "Martín Gómez", tel: "11-4444-5678", email: "", profesional: "Diego", notas: "Fade medio." },
    { id: "c3", nombre: "Sofía Ruiz", tel: "11-3333-9999", email: "sofi.ruiz@email.com", profesional: "Lucía", notas: "Alérgica a amoníaco." },
    { id: "c4", nombre: "Roberto Fernández", tel: "11-2222-7777", email: "", profesional: "Diego", notas: "" },
    { id: "c5", nombre: "Ana Belén Torres", tel: "11-6666-3333", email: "anabelen@email.com", profesional: "Lucía", notas: "Trae foto de referencia para balayage." },
    { id: "c6", nombre: "Claudia Pereyra", tel: "11-8888-4444", email: "", profesional: "Yamila", notas: "" },
    { id: "c7", nombre: "Pedro Sánchez", tel: "11-7777-2222", email: "", profesional: "Diego", notas: "Faltó sin aviso el 7 sep." },
    { id: "c8", nombre: "Valentina López", tel: "11-1111-8888", email: "vale.lopez@email.com", profesional: "Lucía", notas: "Primer alisado." }
  ];
}

function loadTurnos() {
  const raw = localStorage.getItem(STORAGE_TURNOS);
  if (!raw) {
    const data = seedTurnos();
    localStorage.setItem(STORAGE_TURNOS, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function saveTurnos(items) {
  localStorage.setItem(STORAGE_TURNOS, JSON.stringify(items));
}

function load() {
  return loadTurnos();
}

function save(items) {
  saveTurnos(items);
}

function loadServicios() {
  const raw = localStorage.getItem(STORAGE_SERVICIOS);
  if (!raw) {
    localStorage.setItem(STORAGE_SERVICIOS, JSON.stringify(SERVICIOS_SEED));
    return SERVICIOS_SEED.map((s) => ({ ...s }));
  }
  return JSON.parse(raw);
}

function saveServicios(items) {
  localStorage.setItem(STORAGE_SERVICIOS, JSON.stringify(items));
}

function loadClientes() {
  const raw = localStorage.getItem(STORAGE_CLIENTES);
  if (!raw) {
    const data = seedClientes();
    localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function saveClientes(items) {
  localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function catLabel(id) {
  return CATEGORIAS.find((c) => c.id === id)?.label || id;
}

function getServicio(id, list) {
  const servicios = list || loadServicios();
  return servicios.find((s) => s.id === id);
}

function servicioLabel(id) {
  return getServicio(id)?.label || id;
}

function imagenDeServicio(id) {
  const srv = getServicio(id);
  return srv?.imagen || IMAGEN_SERVICIO[id] || "img/hero-salon.jpg";
}

function imagenDeTurno(item) {
  const first = (item.servicios || [])[0];
  return first ? imagenDeServicio(first) : "img/hero-salon.jpg";
}

function profesionalDe(nombre) {
  return PROFESIONALES.find((p) => p.corto === nombre || p.nombre === nombre);
}

function fotoProfesional(nombre) {
  return profesionalDe(nombre)?.imagen || "img/equipo.jpg";
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function calcTotal(item, list) {
  const servicios = list || loadServicios();
  return (item.servicios || []).reduce((sum, id) => {
    const srv = servicios.find((s) => s.id === id);
    return sum + (srv?.precio || 0);
  }, 0);
}

function calcDuracion(item, list) {
  const servicios = list || loadServicios();
  return (item.servicios || []).reduce((sum, id) => {
    const srv = servicios.find((s) => s.id === id);
    return sum + (srv?.duracion || 0);
  }, 0);
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
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

const SERVICIOS = SERVICIOS_SEED;
