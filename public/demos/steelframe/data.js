const STORAGE_MODELOS = "steelframe-modelos-v2";
const STORAGE_OBRAS = "steelframe-obras-v2";

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
  { id: "casa4", label: "Casa 4 dormitorios" },
  { id: "duplex", label: "Dúplex" },
  { id: "duplexc", label: "Dúplex compacto" },
  { id: "ph", label: "PH" },
  { id: "ph2", label: "PH con patio" },
  { id: "ampliacion", label: "Ampliación" },
  { id: "ampliacionalta", label: "Ampliación planta alta" },
  { id: "modulo", label: "Módulo estudio" }
];

const FILTROS = [
  { id: "all", label: "Todos" },
  { id: "casa", label: "Casa" },
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
  casa4: "img/casa-4dorm.jpg",
  duplex: "img/duplex.jpg",
  duplexc: "img/duplex-compacto.jpg",
  ph: "img/ph.jpg",
  ph2: "img/ph-patio.jpg",
  ampliacion: "img/ampliacion.jpg",
  ampliacionalta: "img/ampliacion-alta.jpg",
  modulo: "img/modulo.jpg"
};

const IMAGENES_CATALOGO = [
  { id: "img/casa-2dorm.jpg", label: "Casa compacta" },
  { id: "img/casa-3dorm.jpg", label: "Casa contemporánea" },
  { id: "img/casa-4dorm.jpg", label: "Casa amplia" },
  { id: "img/duplex.jpg", label: "Dúplex" },
  { id: "img/duplex-compacto.jpg", label: "Dúplex compacto" },
  { id: "img/ph.jpg", label: "PH" },
  { id: "img/ph-patio.jpg", label: "PH con patio" },
  { id: "img/ampliacion.jpg", label: "Ampliación" },
  { id: "img/ampliacion-alta.jpg", label: "Ampliación alta" },
  { id: "img/modulo.jpg", label: "Módulo" },
  { id: "img/hero.jpg", label: "Fachada" },
  { id: "img/estructura-sf.jpg", label: "Estructura" }
];

const CHECKLIST_ITEMS = [
  { id: "lote", label: "Relevamiento de lote" },
  { id: "plano", label: "Plano y cómputo" },
  { id: "sena", label: "Seña y contrato" },
  { id: "fundacion", label: "Fundación / platea" },
  { id: "fabricacion", label: "Fabricación de paneles" },
  { id: "transporte", label: "Transporte al lote" },
  { id: "montaje", label: "Montaje de estructura" },
  { id: "cubierta", label: "Cubierta" },
  { id: "instalaciones", label: "Instalaciones" },
  { id: "cerramientos", label: "Cerramientos y aislación" },
  { id: "terminaciones", label: "Terminaciones" },
  { id: "entrega", label: "Entrega de llaves" }
];

const PASOS = [
  {
    n: "01",
    titulo: "Consulta y visita al lote",
    texto: "Medimos el terreno, orientación y medianeras. Con eso se elige el modelo o se ajusta un módulo.",
    imagen: "img/hero.jpg"
  },
  {
    n: "02",
    titulo: "Proyecto y cómputo",
    texto: "Plano de estructura, aberturas y m². El cómputo sale del modelo: no se improvisa en obra.",
    imagen: "img/planos.jpg"
  },
  {
    n: "03",
    titulo: "Fundación",
    texto: "Platea o zapata según el suelo. La estructura liviana pide menos hormigón que la mampostería.",
    imagen: "img/estructura.jpg"
  },
  {
    n: "04",
    titulo: "Fabricación en taller",
    texto: "Perfiles galvanizados y paneles cortados en Villa Urquiza. El lote espera el montaje, no el corte.",
    imagen: "img/taller.jpg"
  },
  {
    n: "05",
    titulo: "Montaje",
    texto: "Paneles, entrepiso y cubierta. En días se cierra la caja: viento y lluvia dejan de frenar la obra.",
    imagen: "img/montaje.jpg"
  },
  {
    n: "06",
    titulo: "Cerramientos e instalaciones",
    texto: "Aislación, placas, eléctrica y sanitaria. Las instalaciones van entre montantes, sin picar muros.",
    imagen: "img/estructura-sf.jpg"
  },
  {
    n: "07",
    titulo: "Entrega",
    texto: "Terminaciones, limpieza y llaves. La fecha queda en la ficha de obra, no en un presupuesto suelto.",
    imagen: "img/casa-3dorm.jpg"
  }
];

const COMPARATIVA_SISTEMA = [
  { criterio: "Plazo de obra", steel: "45 a 150 días según modelo", tradicional: "8 a 18 meses" },
  { criterio: "Obra húmeda", steel: "Fundación y poco más", tradicional: "Alta: revoque, mezcla, espera" },
  { criterio: "Peso de la estructura", steel: "Liviana; sirve en suelos flojos", tradicional: "Alta; pide fundación más pesada" },
  { criterio: "Aislación", steel: "Continua, entre montantes", tradicional: "Depende del muro y del revoque" },
  { criterio: "Instalaciones", steel: "Pasan por la estructura", tradicional: "Hay que picar o prever cañeros" },
  { criterio: "Ampliación", steel: "Módulo anclado a lo existente", tradicional: "Obra sucia y más lenta" }
];

function grupoDeTipo(tipo) {
  if (tipo === "casa2" || tipo === "casa3" || tipo === "casa4") return "casa";
  if (tipo === "duplex" || tipo === "duplexc") return "duplex";
  if (tipo === "ph" || tipo === "ph2") return "ph";
  return "ampliacion";
}

function checklistForStatus(status) {
  const doneUntil = { consulta: 1, fabricacion: 5, montaje: 8, entregada: 12 };
  const n = doneUntil[status] || 0;
  return CHECKLIST_ITEMS.map((item, i) => ({ id: item.id, label: item.label, done: i < n }));
}

function seedModelos() {
  return [
    {
      id: "mod-2d",
      nombre: "Casa 2 dormitorios",
      tipo: "casa2",
      descripcion: "Vivienda compacta en planta única. Techo a dos aguas, envolvente de chapa y estar integrado a la cocina.",
      m2: 68,
      ambientes: "2 dormitorios · estar · cocina · baño",
      plazo: "90 días de obra",
      sistema: "Steel frame + chapa",
      precio: 48500000,
      imagen: "img/casa-2dorm.jpg",
      publicado: true
    },
    {
      id: "mod-3d",
      nombre: "Casa 3 dormitorios",
      tipo: "casa3",
      descripcion: "Casa contemporánea de una planta, galería y siding. Tres dormitorios; el principal con vestidor.",
      m2: 98,
      ambientes: "3 dormitorios · estar · cocina · 2 baños · galería",
      plazo: "120 días de obra",
      sistema: "Steel frame + siding",
      precio: 67200000,
      imagen: "img/casa-3dorm.jpg",
      publicado: true
    },
    {
      id: "mod-4d",
      nombre: "Casa 4 dormitorios",
      tipo: "casa4",
      descripcion: "Vivienda amplia, estar de doble altura y suite. Pensada para lote de 10 m de frente o más.",
      m2: 168,
      ambientes: "4 dormitorios · estar · cocina · 3 baños · cochera",
      plazo: "150 días de obra",
      sistema: "Steel frame + EIFS",
      precio: 118500000,
      imagen: "img/casa-4dorm.jpg",
      publicado: true
    },
    {
      id: "mod-dup",
      nombre: "Dúplex",
      tipo: "duplex",
      descripcion: "Dos plantas. Planta baja de estar y cocina; arriba, dormitorios. Perfiles galvanizados y entrepiso seco.",
      m2: 142,
      ambientes: "3 dormitorios · estar · cocina · 2 baños · cochera",
      plazo: "150 días de obra",
      sistema: "Steel frame + siding",
      precio: 91800000,
      imagen: "img/duplex.jpg",
      publicado: true
    },
    {
      id: "mod-dupc",
      nombre: "Dúplex compacto",
      tipo: "duplexc",
      descripcion: "Dúplex de frente angosto. Sirve en lote de PH o entre medianeras. Cochera opcional al frente.",
      m2: 118,
      ambientes: "3 dormitorios · estar · cocina · 2 baños",
      plazo: "135 días de obra",
      sistema: "Steel frame + chapa",
      precio: 79400000,
      imagen: "img/duplex-compacto.jpg",
      publicado: true
    },
    {
      id: "mod-ph",
      nombre: "PH steel frame",
      tipo: "ph",
      descripcion: "Vivienda entre medianeras, dos plantas. Paneles en taller y montaje en el lote, con patio al fondo.",
      m2: 110,
      ambientes: "3 dormitorios · estar · cocina · 2 baños · patio",
      plazo: "130 días de obra",
      sistema: "Steel frame + siding",
      precio: 75400000,
      imagen: "img/ph.jpg",
      publicado: true
    },
    {
      id: "mod-ph2",
      nombre: "PH con patio",
      tipo: "ph2",
      descripcion: "PH de planta baja más un piso. Patio posterior y terraza. Pensado para reciclar un lote de casa chorizo.",
      m2: 96,
      ambientes: "2 dormitorios · estar · cocina · baño · patio",
      plazo: "120 días de obra",
      sistema: "Steel frame + EIFS",
      precio: 68900000,
      imagen: "img/ph-patio.jpg",
      publicado: true
    },
    {
      id: "mod-amp",
      nombre: "Ampliación",
      tipo: "ampliacion",
      descripcion: "Módulo al fondo o al costado de una casa existente: dormitorio extra o estar. Anclaje a la estructura actual.",
      m2: 36,
      ambientes: "1 ambiente · o 1 dormitorio + baño",
      plazo: "45 días de obra",
      sistema: "Steel frame + chapa",
      precio: 18900000,
      imagen: "img/ampliacion.jpg",
      publicado: true
    },
    {
      id: "mod-ampa",
      nombre: "Ampliación planta alta",
      tipo: "ampliacionalta",
      descripcion: "Piso extra sobre una casa de mampostería. Se verifica la fundación y se ancla la estructura liviana.",
      m2: 52,
      ambientes: "2 dormitorios · baño · o estar + terraza",
      plazo: "70 días de obra",
      sistema: "Steel frame + siding",
      precio: 27600000,
      imagen: "img/ampliacion-alta.jpg",
      publicado: true
    },
    {
      id: "mod-mod",
      nombre: "Módulo estudio",
      tipo: "modulo",
      descripcion: "Oficina o estudio en el fondo del lote. Independiente de la casa: entrada propia y baño.",
      m2: 28,
      ambientes: "1 ambiente · baño",
      plazo: "40 días de obra",
      sistema: "Steel frame + OSB",
      precio: 15200000,
      imagen: "img/modulo.jpg",
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
      checklist: checklistForStatus("montaje"),
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
      checklist: checklistForStatus("fabricacion"),
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
      checklist: checklistForStatus("consulta"),
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
      checklist: checklistForStatus("entregada"),
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
      checklist: checklistForStatus("consulta"),
      history: [{ when: "7 sep", text: "Consulta desde la web. Pedido de visita al lote." }]
    },
    {
      id: "sf6",
      codigo: "SF-2026-16",
      modelo: "casa4",
      titulo: "Casa 4 dormitorios · Saavedra",
      cliente: { nombre: "Esteban Molina", tel: "11-4777-2091" },
      lote: "Ramallo 2100, Saavedra",
      status: "fabricacion",
      precio: 118500000,
      imagen: "img/casa-4dorm.jpg",
      factura: null,
      checklist: checklistForStatus("fabricacion"),
      history: [
        { when: "5 sep", text: "Platea hormigonada. Paneles en taller." },
        { when: "18 ago", text: "Contrato firmado." }
      ]
    },
    {
      id: "sf7",
      codigo: "SF-2026-09",
      modelo: "duplexc",
      titulo: "Dúplex compacto · Coghlan",
      cliente: { nombre: "Nadia Pérez", tel: "11-5888-4412" },
      lote: "Washington 1600, Coghlan",
      status: "montaje",
      precio: 79400000,
      imagen: "img/duplex-compacto.jpg",
      factura: { tipo: "FB", numero: "0001-00000021", cae: "74185296302110", vto: "18 sep", total: 79400000, cuit: "27-30991882-1" },
      checklist: checklistForStatus("montaje"),
      history: [
        { when: "3 sep", text: "Montaje de planta alta." },
        { when: "20 ago", text: "Paneles despachados." }
      ]
    },
    {
      id: "sf8",
      codigo: "SF-2026-12",
      modelo: "modulo",
      titulo: "Módulo estudio · Villa Pueyrredón",
      cliente: { nombre: "Oficina Klein", tel: "11-4001-8820" },
      lote: "Artigas 3500, Villa Pueyrredón",
      status: "consulta",
      precio: 15200000,
      imagen: "img/modulo.jpg",
      factura: null,
      checklist: checklistForStatus("consulta"),
      history: [{ when: "8 sep", text: "Consulta: estudio en el fondo del lote." }]
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
  const obras = loadList(STORAGE_OBRAS, seedObras);
  return obras.map((obra) => {
    if (!Array.isArray(obra.checklist) || !obra.checklist.length) {
      obra.checklist = checklistForStatus(obra.status);
    }
    return obra;
  });
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
    imagen: modelo.imagen || IMAGEN_TIPO[consulta.tipo] || "img/hero.jpg",
    factura: null,
    checklist: checklistForStatus("consulta"),
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

function checklistDone(obra) {
  const list = obra.checklist || [];
  const done = list.filter((c) => c.done).length;
  return { done, total: list.length };
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
