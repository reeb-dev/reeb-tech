const STORAGE_MODELOS = "steelframe-modelos-v1";
const STORAGE_OBRAS = "steelframe-obras-v1";

const LOCAL = {
  nombre: "Framehaus",
  slogan: "Vivienda steel frame · Villa Urquiza",
  direccion: "Av. Triunvirato 3800",
  barrio: "Villa Urquiza, CABA",
  telefono: "011-4555-3800",
  whatsapp: "5492915757934",
  horarios: [
    "Lunes a viernes: 9 a 18",
    "Sábados: 9 a 13"
  ]
};

const ESTADOS = [
  { id: "consulta", label: "Consulta" },
  { id: "fabricacion", label: "En fabricación" },
  { id: "montaje", label: "Montaje" },
  { id: "entregada", label: "Entregada" }
];

const TIPOS = [
  { id: "casa2", label: "Casa 2 dormitorios" },
  { id: "casa3", label: "Casa 3 dormitorios" },
  { id: "duplex", label: "Dúplex" },
  { id: "ph", label: "PH" },
  { id: "ampliacion", label: "Ampliación" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

const IMAGEN_TIPO = {
  casa2: "img/casa-2dorm.jpg",
  casa3: "img/casa-3dorm.jpg",
  duplex: "img/duplex.jpg",
  ph: "img/ph.jpg",
  ampliacion: "img/ampliacion.jpg"
};

function seedModelos() {
  return [
    {
      id: "mod-2d",
      nombre: "Casa 2 dormitorios",
      tipo: "casa2",
      descripcion: "Vivienda compacta en steel frame. Planta única, techo a dos aguas y envolvente de chapa.",
      m2: 68,
      ambientes: "2 dormitorios · estar · cocina · baño",
      plazo: "90 días de obra",
      precio: 48500000,
      imagen: "img/casa-2dorm.jpg",
      publicado: true
    },
    {
      id: "mod-3d",
      nombre: "Casa 3 dormitorios",
      tipo: "casa3",
      descripcion: "Casa de una planta, tres dormitorios y galería. Estructura liviana, terminación de siding.",
      m2: 98,
      ambientes: "3 dormitorios · estar · cocina · 2 baños",
      plazo: "120 días de obra",
      precio: 67200000,
      imagen: "img/casa-3dorm.jpg",
      publicado: true
    },
    {
      id: "mod-dup",
      nombre: "Dúplex",
      tipo: "duplex",
      descripcion: "Dos plantas. Planta baja de estar y cocina; arriba, dormitorios. Estructura de perfiles galvanizados.",
      m2: 142,
      ambientes: "3 dormitorios · estar · cocina · 2 baños · cochera",
      plazo: "150 días de obra",
      precio: 91800000,
      imagen: "img/duplex.jpg",
      publicado: true
    },
    {
      id: "mod-ph",
      nombre: "PH steel frame",
      tipo: "ph",
      descripcion: "Vivienda entre medianeras, patio posterior. Paneles en taller y montaje en el lote.",
      m2: 110,
      ambientes: "3 dormitorios · estar · patio",
      plazo: "130 días de obra",
      precio: 75400000,
      imagen: "img/ph.jpg",
      publicado: true
    },
    {
      id: "mod-amp",
      nombre: "Ampliación",
      tipo: "ampliacion",
      descripcion: "Módulo de ampliación sobre una casa existente: dormitorio extra o estar. Anclaje a la estructura actual.",
      m2: 36,
      ambientes: "1 ambiente · o 1 dormitorio + baño",
      plazo: "45 días de obra",
      precio: 18900000,
      imagen: "img/ampliacion.jpg",
      publicado: true
    }
  ];
}

function seedObras() {
  return [
    {
      id: "sf1",
      codigo: "SF-2026-11",
      modelo: "casa2",
      titulo: "Casa 2 dormitorios · Villa Urquiza",
      cliente: { nombre: "Familia Ruiz", tel: "11-5555-3800" },
      lote: "Miller 2400, Villa Urquiza",
      status: "montaje",
      precio: 48500000,
      imagen: "img/casa-2dorm.jpg",
      factura: null,
      history: [
        { when: "4 sep", text: "Paneles en obra. Montaje de planta." },
        { when: "12 ago", text: "Fabricación cerrada en taller." }
      ]
    },
    {
      id: "sf2",
      codigo: "SF-2026-08",
      modelo: "duplex",
      titulo: "Dúplex · Belgrano",
      cliente: { nombre: "Costa, Martín", tel: "11-4444-2200" },
      lote: "Conde 1900, Belgrano",
      status: "fabricacion",
      precio: 91800000,
      imagen: "img/duplex.jpg",
      factura: { tipo: "FA", numero: "0001-00000019", cae: "74185296302001", vto: "20 sep", total: 91800000, cuit: "20-28451209-3" },
      history: [
        { when: "6 sep", text: "Perfiles en corte. En fabricación." },
        { when: "22 ago", text: "Seña recibida. Pedido al taller." }
      ]
    },
    {
      id: "sf3",
      codigo: "SF-2026-14",
      modelo: "ampliacion",
      titulo: "Ampliación · Colegiales",
      cliente: { nombre: "Lucía Ferreyra", tel: "11-3333-8810" },
      lote: "Céspedes 1100, Colegiales",
      status: "consulta",
      precio: 18900000,
      imagen: "img/ampliacion.jpg",
      factura: null,
      history: [{ when: "8 sep", text: "Consulta: ampliar un dormitorio al fondo." }]
    },
    {
      id: "sf4",
      codigo: "SF-2025-22",
      modelo: "ph",
      titulo: "PH · Núñez",
      cliente: { nombre: "Obra Álvarez", tel: "11-2222-4410" },
      lote: "Iberá 2800, Núñez",
      status: "entregada",
      precio: 75400000,
      imagen: "img/ph.jpg",
      factura: { tipo: "FA", numero: "0001-00000011", cae: "74185296301550", vto: "2 ago", total: 75400000, cuit: "30-71200944-4" },
      history: [
        { when: "28 ago", text: "Entregada. Cliente recibió llaves." },
        { when: "10 ago", text: "Montaje cerrado." }
      ]
    },
    {
      id: "sf5",
      codigo: "SF-2026-15",
      modelo: "casa3",
      titulo: "Casa 3 dormitorios · Villa Devoto",
      cliente: { nombre: "Paula Iglesias", tel: "11-6666-1102" },
      lote: "San Martín 4200, Villa Devoto",
      status: "consulta",
      precio: 67200000,
      imagen: "img/casa-3dorm.jpg",
      factura: null,
      history: [{ when: "7 sep", text: "Consulta desde la web. Pedido de visita al lote." }]
    }
  ];
}

function loadList(key, seedFn) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const data = seedFn();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedFn();
  } catch {
    return seedFn();
  }
}

function loadModelos() {
  return loadList(STORAGE_MODELOS, seedModelos);
}

function saveModelos(items) {
  localStorage.setItem(STORAGE_MODELOS, JSON.stringify(items));
}

function loadObras() {
  return loadList(STORAGE_OBRAS, seedObras);
}

function saveObras(items) {
  localStorage.setItem(STORAGE_OBRAS, JSON.stringify(items));
}

function addConsulta(consulta) {
  const obras = loadObras();
  const n = obras.length + 16;
  const modelo = loadModelos().find((m) => m.tipo === consulta.tipo) || {};
  const obra = {
    id: consulta.id,
    codigo: `SF-2026-${String(n).padStart(2, "0")}`,
    modelo: consulta.tipo,
    titulo: (modelo.nombre || tipoLabel(consulta.tipo)) + " · consulta web",
    cliente: { nombre: consulta.nombre, tel: consulta.contacto },
    lote: consulta.lote || "",
    status: "consulta",
    precio: modelo.precio || 0,
    imagen: IMAGEN_TIPO[consulta.tipo] || "img/hero.jpg",
    factura: null,
    history: [{ when: "hoy", text: "Consulta desde la web. " + (consulta.detalle || "") }]
  };
  saveObras([obra, ...obras]);
}

function estadoLabel(id) {
  return ESTADOS.find((e) => e.id === id)?.label || id;
}

function tipoLabel(id) {
  return TIPOS.find((t) => t.id === id)?.label || id;
}

function compLabel(id) {
  return COMPROBANTES.find((c) => c.id === id)?.label || id;
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function imagenDeTipo(tipo) {
  return IMAGEN_TIPO[tipo] || "img/hero.jpg";
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
