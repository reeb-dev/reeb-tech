const STORAGE_PROYECTOS = "arquitectura-proyectos-v1";
const STORAGE_OBRAS = "arquitectura-obras-v1";
const STORAGE_CONSULTAS = "arquitectura-consultas-v1";

const LOCAL = {
  nombre: "Estudio Loma",
  slogan: "Arquitectura · Palermo",
  direccion: "Humboldt 2140",
  barrio: "Palermo, CABA",
  telefono: "011-4555-2140",
  whatsapp: "5492915757934",
  horarios: [
    "Lunes a viernes: 9 a 18",
    "Sábados: con cita"
  ]
};

const ETAPAS = [
  { id: "anteproyecto", label: "Anteproyecto" },
  { id: "ejecutivos", label: "Ejecutivos" },
  { id: "en_obra", label: "En obra" },
  { id: "finalizado", label: "Finalizado" }
];

const TIPOS = [
  { id: "casa", label: "Casa nueva" },
  { id: "reforma", label: "Reforma" },
  { id: "ph", label: "PH" },
  { id: "departamento", label: "Departamento" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

const SERVICIOS = [
  {
    id: "proyecto",
    titulo: "Proyecto",
    descripcion: "Anteproyecto y planos ejecutivos. Plantas, cortes, detalles y documentación para el municipio.",
    imagen: "img/hero.jpg"
  },
  {
    id: "direccion",
    titulo: "Dirección de obra",
    descripcion: "Seguimiento en obra: visitas, control de avance y coordinación con el constructor.",
    imagen: "img/servicio-obra.jpg"
  },
  {
    id: "renders",
    titulo: "Renders",
    descripcion: "Imágenes del proyecto para ver materiales, luz y espacios antes de construir.",
    imagen: "img/servicio-renders.jpg"
  }
];

const IMAGEN_TIPO = {
  casa: "img/casa-palermo.jpg",
  reforma: "img/reforma-ph.jpg",
  ph: "img/reforma-ph.jpg",
  departamento: "img/servicio-renders.jpg"
};

function seedProyectos() {
  return [
    {
      id: "p-palermo",
      titulo: "Casa en Palermo Soho",
      tipo: "casa",
      descripcion: "Casa de dos plantas sobre lote entre medianeras. Patio posterior y terraza.",
      superficie: "186 m²",
      anio: "2025",
      barrio: "Palermo, CABA",
      imagen: "img/casa-palermo.jpg",
      publicado: true
    },
    {
      id: "p-belgrano",
      titulo: "Casa en Belgrano R",
      tipo: "casa",
      descripcion: "Vivienda con patio y deck. Planta baja abierta al jardín, suite arriba.",
      superficie: "240 m²",
      anio: "2024",
      barrio: "Belgrano, CABA",
      imagen: "img/casa-belgrano.jpg",
      publicado: true
    },
    {
      id: "p-nunez",
      titulo: "Casa en Núñez",
      tipo: "casa",
      descripcion: "Casa con pileta y galería. Ampliación de una planta existente hacia el fondo.",
      superficie: "210 m²",
      anio: "2024",
      barrio: "Núñez, CABA",
      imagen: "img/casa-nunez.jpg",
      publicado: true
    },
    {
      id: "p-ph",
      titulo: "Reforma de PH en Colegiales",
      tipo: "reforma",
      descripcion: "Unificación de living y cocina, patio interno y nueva carpintería.",
      superficie: "92 m²",
      anio: "2025",
      barrio: "Colegiales, CABA",
      imagen: "img/reforma-ph.jpg",
      publicado: true
    },
    {
      id: "p-living",
      titulo: "Reforma de living en Villa Crespo",
      tipo: "reforma",
      descripcion: "Cambio de piso, iluminación y carpintería. El cliente pidió un estar más claro.",
      superficie: "48 m²",
      anio: "2025",
      barrio: "Villa Crespo, CABA",
      imagen: "img/reforma-cocina.jpg",
      publicado: true
    },
    {
      id: "p-depto",
      titulo: "Reforma de departamento en Recoleta",
      tipo: "departamento",
      descripcion: "Redistribución de un tres ambientes: cocina integrada y baño nuevo.",
      superficie: "78 m²",
      anio: "2024",
      barrio: "Recoleta, CABA",
      imagen: "img/servicio-renders.jpg",
      publicado: true
    }
  ];
}

function seedObras() {
  return [
    {
      id: "o1",
      codigo: "OB-2026-12",
      titulo: "Casa en Palermo Soho",
      tipo: "casa",
      cliente: { nombre: "Familia Álvarez", tel: "11-5555-2140", mail: "alvarez@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 4200000,
      direccion: "Humboldt 1800, Palermo",
      superficie: "186 m²",
      imagen: "img/casa-palermo.jpg",
      factura: null,
      history: [
        { when: "2 sep", text: "Visita de obra. Replanteo de la planta alta." },
        { when: "18 ago", text: "Ejecutivos aprobados. Inicio de obra." }
      ]
    },
    {
      id: "o2",
      codigo: "OB-2026-08",
      titulo: "Reforma de PH en Colegiales",
      tipo: "reforma",
      cliente: { nombre: "Lucía Ferreyra", tel: "11-4444-8810", mail: "lucia@ejemplo.local" },
      etapa: "ejecutivos",
      honorarios: 1850000,
      direccion: "Céspedes 900, Colegiales",
      superficie: "92 m²",
      imagen: "img/reforma-ph.jpg",
      factura: { tipo: "FA", numero: "0001-00000044", cae: "74185296301102", vto: "18 sep", total: 1850000, cuit: "27-38451209-1" },
      history: [
        { when: "5 sep", text: "Planos ejecutivos en revisión municipal." },
        { when: "20 ago", text: "Anteproyecto cerrado." }
      ]
    },
    {
      id: "o3",
      codigo: "OB-2026-15",
      titulo: "Casa en Núñez",
      tipo: "casa",
      cliente: { nombre: "Martín Costa", tel: "11-3333-2201", mail: "costa@ejemplo.local" },
      etapa: "anteproyecto",
      honorarios: 0,
      direccion: "Iberá 3200, Núñez",
      superficie: "210 m²",
      imagen: "img/casa-nunez.jpg",
      factura: null,
      history: [
        { when: "7 sep", text: "Primera reunión. Croquis de implantación." }
      ]
    },
    {
      id: "o4",
      codigo: "OB-2025-31",
      titulo: "Casa en Belgrano R",
      tipo: "casa",
      cliente: { nombre: "Estudio Norte SRL", tel: "11-2222-7788", mail: "obras@ejemplo.local" },
      etapa: "finalizado",
      honorarios: 5600000,
      direccion: "Conde 2100, Belgrano",
      superficie: "240 m²",
      imagen: "img/casa-belgrano.jpg",
      factura: { tipo: "FA", numero: "0001-00000028", cae: "74185296300881", vto: "12 ago", total: 5600000, cuit: "30-71582391-4" },
      history: [
        { when: "30 ago", text: "Obra entregada. Plano conforme a obra." },
        { when: "12 ago", text: "Honorarios facturados." }
      ]
    },
    {
      id: "o5",
      codigo: "OB-2026-16",
      titulo: "Reforma de living en Villa Crespo",
      tipo: "reforma",
      cliente: { nombre: "Paula Iglesias", tel: "11-6666-4410", mail: "paula@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 980000,
      direccion: "Corrientes 5400, Villa Crespo",
      superficie: "48 m²",
      imagen: "img/reforma-cocina.jpg",
      factura: null,
      history: [
        { when: "6 sep", text: "Demolición de tabique. Obra en curso." }
      ]
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

function loadProyectos() {
  return loadList(STORAGE_PROYECTOS, seedProyectos);
}

function saveProyectos(items) {
  localStorage.setItem(STORAGE_PROYECTOS, JSON.stringify(items));
}

function loadObras() {
  return loadList(STORAGE_OBRAS, seedObras);
}

function saveObras(items) {
  localStorage.setItem(STORAGE_OBRAS, JSON.stringify(items));
}

function loadConsultas() {
  const raw = localStorage.getItem(STORAGE_CONSULTAS);
  return raw ? JSON.parse(raw) : [];
}

function saveConsultas(items) {
  localStorage.setItem(STORAGE_CONSULTAS, JSON.stringify(items));
}

function addConsulta(consulta) {
  const items = loadConsultas();
  saveConsultas([consulta, ...items]);
  const obras = loadObras();
  const obra = {
    id: consulta.id,
    codigo: consulta.codigo,
    titulo: consulta.titulo || tipoLabel(consulta.tipo),
    tipo: consulta.tipo,
    cliente: { nombre: consulta.nombre, tel: consulta.contacto, mail: "" },
    etapa: "anteproyecto",
    honorarios: 0,
    direccion: consulta.lugar || "",
    superficie: consulta.superficie || "",
    imagen: IMAGEN_TIPO[consulta.tipo] || IMAGEN_TIPO.casa,
    factura: null,
    history: [{ when: "hoy", text: "Consulta desde la web. " + (consulta.detalle || "") }]
  };
  saveObras([obra, ...obras]);
}

function etapaLabel(id) {
  return ETAPAS.find((e) => e.id === id)?.label || id;
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
  return IMAGEN_TIPO[tipo] || IMAGEN_TIPO.casa;
}

function clientesDeObras(obras) {
  const map = new Map();
  (obras || loadObras()).forEach((o) => {
    const key = (o.cliente?.nombre || "").trim() || "Sin nombre";
    if (!map.has(key)) {
      map.set(key, {
        nombre: key,
        tel: o.cliente?.tel || "",
        mail: o.cliente?.mail || "",
        obras: []
      });
    }
    map.get(key).obras.push(o);
  });
  return Array.from(map.values());
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
