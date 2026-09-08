const STORAGE_PROYECTOS = "arquitectura-proyectos-v2";
const STORAGE_OBRAS = "arquitectura-obras-v2";
const STORAGE_CLIENTES = "arquitectura-clientes-v2";
const STORAGE_CONSULTAS = "arquitectura-consultas-v2";

const LOCAL = {
  nombre: "Estudio Loma",
  slogan: "Arquitectura · Palermo",
  direccion: "Humboldt 2140",
  barrio: "Palermo, CABA",
  telefono: "011-4555-2140",
  whatsapp: "5492915757934",
  lat: -34.5858,
  lng: -58.4395,
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

const DOC_TIPOS = [
  { id: "plano", label: "Plano" },
  { id: "memoria", label: "Memoria" },
  { id: "render", label: "Render" },
  { id: "municipal", label: "Municipal" },
  { id: "contrato", label: "Contrato" }
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
    imagen: "img/galeria-planos.jpg"
  },
  {
    id: "direccion",
    titulo: "Dirección de obra",
    descripcion: "Visitas, control de avance y coordinación con el constructor. El plano y la obra en la misma ficha.",
    imagen: "img/servicio-obra.jpg"
  },
  {
    id: "renders",
    titulo: "Renders",
    descripcion: "Imágenes del proyecto para ver materiales, luz y espacios antes de construir.",
    imagen: "img/servicio-renders.jpg"
  },
  {
    id: "interiorismo",
    titulo: "Interiorismo",
    descripcion: "Cocina, living y mobiliario a medida. Materiales y iluminación en la misma documentación.",
    imagen: "img/cocina-reforma.jpg"
  },
  {
    id: "municipal",
    titulo: "Gestión municipal",
    descripcion: "Permiso de obra, planos conforme y seguimiento en CABA o el partido del GBA que corresponda.",
    imagen: "img/servicio-proyecto.jpg"
  }
];

const EQUIPO = [
  {
    id: "ana",
    nombre: "Ana Loma",
    rol: "Socia · proyecto",
    bio: "Anteproyecto y definición de materiales. Casas y PH en CABA.",
    imagen: "img/equipo-ana.jpg"
  },
  {
    id: "martin",
    nombre: "Martín Rivas",
    rol: "Dirección de obra",
    bio: "Visitas de obra y coordinación con el constructor. Honorarios y etapas.",
    imagen: "img/equipo-martin.jpg"
  },
  {
    id: "lucia",
    nombre: "Lucía Benítez",
    rol: "Ejecutivos y municipal",
    bio: "Planos, memorias y trámite en CABA o GBA. Documentación de obra.",
    imagen: "img/equipo-lucia.jpg"
  }
];

const GALERIA = [
  { id: "g1", titulo: "Casa entre medianeras", imagen: "img/casa-medianeras.jpg", caption: "Villa Urquiza · ladrillo visto" },
  { id: "g2", titulo: "Patio de PH", imagen: "img/ph-san-telmo.jpg", caption: "San Telmo · patio interno" },
  { id: "g3", titulo: "Cocina reformada", imagen: "img/cocina-reforma.jpg", caption: "Villa Crespo · isla de roble" },
  { id: "g4", titulo: "Loft", imagen: "img/loft-chacarita.jpg", caption: "Chacarita · ladrillo y acero" },
  { id: "g5", titulo: "Terraza", imagen: "img/terraza-palermo.jpg", caption: "Palermo Hollywood · deck" },
  { id: "g6", titulo: "Planos de trabajo", imagen: "img/galeria-planos.jpg", caption: "Plantas y cortes en mesa" },
  { id: "g7", titulo: "Obra en ladrillo", imagen: "img/galeria-obra.jpg", caption: "Caballito · etapa estructura" },
  { id: "g8", titulo: "El estudio", imagen: "img/equipo-loma.jpg", caption: "Mesa de trabajo · Palermo" }
];

const IMAGEN_TIPO = {
  casa: "img/casa-medianeras.jpg",
  reforma: "img/cocina-reforma.jpg",
  ph: "img/ph-san-telmo.jpg",
  departamento: "img/depto-recoleta.jpg"
};

function seedProyectos() {
  return [
    {
      id: "p-urquiza",
      titulo: "Casa entre medianeras en Villa Urquiza",
      tipo: "casa",
      programa: "Vivienda unifamiliar de dos plantas sobre lote entre medianeras. Patio posterior.",
      descripcion: "Casa nueva de dos plantas. Planta baja abierta al patio; suite y dos dormitorios arriba.",
      superficie: "168 m²",
      etapa: "en_obra",
      materiales: "Ladrillo visto, revoque gris, carpintería de aluminio negro, losa de hormigón.",
      anio: "2026",
      barrio: "Villa Urquiza, CABA",
      imagen: "img/casa-medianeras.jpg",
      publicado: true
    },
    {
      id: "p-san-isidro",
      titulo: "Casa en San Isidro",
      tipo: "casa",
      programa: "Vivienda unifamiliar con garage y jardín. GBA norte.",
      descripcion: "Casa de dos plantas sobre lote amplio. Estar a doble altura y jardín al frente.",
      superficie: "280 m²",
      etapa: "finalizado",
      materiales: "Siding de madera, revestimiento de piedra, tejas, carpintería de PVC.",
      anio: "2025",
      barrio: "San Isidro, GBA",
      imagen: "img/casa-palermo.jpg",
      publicado: true
    },
    {
      id: "p-vicente",
      titulo: "Casa patio en Vicente López",
      tipo: "casa",
      programa: "Vivienda con deck, galería y jardín. Planta baja abierta al fondo.",
      descripcion: "Volúmenes de madera y blanco. Deck con parrilla y un árbol existente en el centro del lote.",
      superficie: "246 m²",
      etapa: "finalizado",
      materiales: "Revestimiento de madera vertical, revoque blanco, DVH, deck de lapacho.",
      anio: "2024",
      barrio: "Vicente López, GBA",
      imagen: "img/casa-belgrano.jpg",
      publicado: true
    },
    {
      id: "p-nunez",
      titulo: "Casa con pileta en Núñez",
      tipo: "casa",
      programa: "Ampliación de vivienda existente hacia el fondo. Galería y pileta.",
      descripcion: "Casa con pileta y galería. Ampliación de una planta existente: estar nuevo abierto al jardín.",
      superficie: "210 m²",
      etapa: "finalizado",
      materiales: "Siding blanco, revestimiento de madera, aberturas de aluminio, solado de piedra.",
      anio: "2024",
      barrio: "Núñez, CABA",
      imagen: "img/casa-nunez.jpg",
      publicado: true
    },
    {
      id: "p-ph-colegiales",
      titulo: "Reforma de PH en Colegiales",
      tipo: "ph",
      programa: "Unificación de living y cocina. Patio interno y carpintería nueva.",
      descripcion: "PH de planta baja. Se derribó el tabique entre estar y cocina; el patio queda como extensión del living.",
      superficie: "92 m²",
      etapa: "ejecutivos",
      materiales: "Roble, piedra, aluminio negro, piso de madera.",
      anio: "2025",
      barrio: "Colegiales, CABA",
      imagen: "img/reforma-ph.jpg",
      publicado: true
    },
    {
      id: "p-ph-telmo",
      titulo: "PH con patio en San Telmo",
      tipo: "ph",
      programa: "Restauración de patio interno. Casa chorizo de un dormitorio más escritorio.",
      descripcion: "Patio de ladrillo visto, piso calcáreo y plantas. Se conservan muros originales y se cambia la carpintería.",
      superficie: "78 m²",
      etapa: "en_obra",
      materiales: "Ladrillo visto, piso calcáreo, hierro, madera recuperada.",
      anio: "2026",
      barrio: "San Telmo, CABA",
      imagen: "img/ph-san-telmo.jpg",
      publicado: true
    },
    {
      id: "p-depto-recoleta",
      titulo: "Reforma de departamento en Recoleta",
      tipo: "departamento",
      programa: "Tres ambientes. Cocina integrada y baño nuevo. Fachada original.",
      descripcion: "Redistribución de un tres ambientes en un edificio de Recoleta. Se mantiene la carpintería de la fachada.",
      superficie: "86 m²",
      etapa: "finalizado",
      materiales: "Yeso, carpintería original restaurada, porcelanato, grifería negra.",
      anio: "2024",
      barrio: "Recoleta, CABA",
      imagen: "img/depto-recoleta.jpg",
      publicado: true
    },
    {
      id: "p-living-palermo",
      titulo: "Interiorismo de living en Palermo",
      tipo: "departamento",
      programa: "Estar de un departamento con vista a la ciudad. Mobiliario y iluminación.",
      descripcion: "Cambio de piso, iluminación y carpintería. El cliente pidió un estar más claro, con plantas y una galería de fotos.",
      superficie: "42 m²",
      etapa: "finalizado",
      materiales: "Madera clara, cuero, metal negro, lino.",
      anio: "2025",
      barrio: "Palermo, CABA",
      imagen: "img/reforma-cocina.jpg",
      publicado: true
    },
    {
      id: "p-cocina-crespo",
      titulo: "Reforma de cocina en Villa Crespo",
      tipo: "reforma",
      programa: "Cocina-comedor con isla. Demolición de tabique hacia el living.",
      descripcion: "Isla de roble, alzada blanca y ventana al contrafrente. El trabajo incluye mesada, grifería e iluminación.",
      superficie: "22 m²",
      etapa: "finalizado",
      materiales: "Melamina blanca, roble, mesada de piedra, grifería negra.",
      anio: "2025",
      barrio: "Villa Crespo, CABA",
      imagen: "img/cocina-reforma.jpg",
      publicado: true
    },
    {
      id: "p-loft",
      titulo: "Loft en Chacarita",
      tipo: "departamento",
      programa: "Vivienda en un solo ambiente con entrepiso. Dormitorio arriba.",
      descripcion: "Local reciclado: ladrillo, ventanales de acero y entrepiso metálico. Estar y cocina abajo; dormitorio en el altillo.",
      superficie: "110 m²",
      etapa: "ejecutivos",
      materiales: "Ladrillo visto, acero negro, hormigón, madera.",
      anio: "2026",
      barrio: "Chacarita, CABA",
      imagen: "img/loft-chacarita.jpg",
      publicado: true
    },
    {
      id: "p-terraza",
      titulo: "Terraza en Palermo Hollywood",
      tipo: "reforma",
      programa: "Terraza de PH. Deck, jardineras y estar exterior.",
      descripcion: "Deck de madera, banco corrido y plantas. Vista a las azoteas del barrio. Uso de día y de atardecer.",
      superficie: "45 m²",
      etapa: "finalizado",
      materiales: "Deck de madera, jardineras de chapa, iluminación baja.",
      anio: "2025",
      barrio: "Palermo Hollywood, CABA",
      imagen: "img/terraza-palermo.jpg",
      publicado: true
    },
    {
      id: "p-caballito",
      titulo: "Casa en obra en Caballito",
      tipo: "casa",
      programa: "Vivienda de dos plantas. Etapa de estructura y mampostería.",
      descripcion: "Obra en ladrillo sobre lote entre medianeras. Losa de planta alta ya hormigonada; arranque de muros del primer piso.",
      superficie: "142 m²",
      etapa: "en_obra",
      materiales: "Ladrillo, losa de hormigón, revoque grueso.",
      anio: "2026",
      barrio: "Caballito, CABA",
      imagen: "img/galeria-obra.jpg",
      publicado: true
    }
  ];
}

function seedClientes() {
  return [
    { id: "c1", nombre: "Familia Álvarez", tel: "11-5555-2140", mail: "alvarez@ejemplo.local", cuit: "20-28451209-3", barrio: "Palermo, CABA" },
    { id: "c2", nombre: "Lucía Ferreyra", tel: "11-4444-8810", mail: "lucia@ejemplo.local", cuit: "27-38451209-1", barrio: "Colegiales, CABA" },
    { id: "c3", nombre: "Martín Costa", tel: "11-3333-2201", mail: "costa@ejemplo.local", cuit: "20-30112233-4", barrio: "Núñez, CABA" },
    { id: "c4", nombre: "Estudio Norte SRL", tel: "11-2222-7788", mail: "obras@ejemplo.local", cuit: "30-71582391-4", barrio: "Vicente López, GBA" },
    { id: "c5", nombre: "Paula Iglesias", tel: "11-6666-4410", mail: "paula@ejemplo.local", cuit: "27-35998811-2", barrio: "Villa Crespo, CABA" },
    { id: "c6", nombre: "Tomás Vidal", tel: "11-4777-1200", mail: "vidal@ejemplo.local", cuit: "20-32881144-8", barrio: "San Telmo, CABA" },
    { id: "c7", nombre: "Sofía Kramer", tel: "11-4888-3301", mail: "sofia@ejemplo.local", cuit: "27-40112255-6", barrio: "Chacarita, CABA" },
    { id: "c8", nombre: "Familia Rossi", tel: "11-4722-0091", mail: "rossi@ejemplo.local", cuit: "20-27114488-9", barrio: "Caballito, CABA" }
  ];
}

function seedObras() {
  return [
    {
      id: "o1",
      codigo: "OB-2026-12",
      titulo: "Casa entre medianeras en Villa Urquiza",
      tipo: "casa",
      clienteId: "c1",
      cliente: { nombre: "Familia Álvarez", tel: "11-5555-2140", mail: "alvarez@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 4200000,
      direccion: "Miller 2400, Villa Urquiza",
      superficie: "168 m²",
      imagen: "img/casa-medianeras.jpg",
      factura: null,
      documentos: [
        { id: "d1a", nombre: "Planta baja.pdf", tipo: "plano", fecha: "18 ago" },
        { id: "d1b", nombre: "Planta alta y cortes.pdf", tipo: "plano", fecha: "18 ago" },
        { id: "d1c", nombre: "Permiso de obra.pdf", tipo: "municipal", fecha: "2 sep" }
      ],
      history: [
        { when: "2 sep", text: "Visita de obra. Replanteo de la planta alta." },
        { when: "18 ago", text: "Ejecutivos aprobados. Inicio de obra." }
      ]
    },
    {
      id: "o2",
      codigo: "OB-2026-08",
      titulo: "Reforma de PH en Colegiales",
      tipo: "ph",
      clienteId: "c2",
      cliente: { nombre: "Lucía Ferreyra", tel: "11-4444-8810", mail: "lucia@ejemplo.local" },
      etapa: "ejecutivos",
      honorarios: 1850000,
      direccion: "Céspedes 900, Colegiales",
      superficie: "92 m²",
      imagen: "img/reforma-ph.jpg",
      factura: { tipo: "FA", numero: "0001-00000044", cae: "74185296301102", vto: "18 sep", total: 1850000, cuit: "27-38451209-1" },
      documentos: [
        { id: "d2a", nombre: "Anteproyecto.pdf", tipo: "plano", fecha: "20 ago" },
        { id: "d2b", nombre: "Memoria descriptiva.pdf", tipo: "memoria", fecha: "5 sep" }
      ],
      history: [
        { when: "5 sep", text: "Planos ejecutivos en revisión municipal." },
        { when: "20 ago", text: "Anteproyecto cerrado." }
      ]
    },
    {
      id: "o3",
      codigo: "OB-2026-15",
      titulo: "Casa con pileta en Núñez",
      tipo: "casa",
      clienteId: "c3",
      cliente: { nombre: "Martín Costa", tel: "11-3333-2201", mail: "costa@ejemplo.local" },
      etapa: "anteproyecto",
      honorarios: 0,
      direccion: "Iberá 3200, Núñez",
      superficie: "210 m²",
      imagen: "img/casa-nunez.jpg",
      factura: null,
      documentos: [
        { id: "d3a", nombre: "Croquis de implantación.pdf", tipo: "plano", fecha: "7 sep" }
      ],
      history: [
        { when: "7 sep", text: "Primera reunión. Croquis de implantación." }
      ]
    },
    {
      id: "o4",
      codigo: "OB-2025-31",
      titulo: "Casa patio en Vicente López",
      tipo: "casa",
      clienteId: "c4",
      cliente: { nombre: "Estudio Norte SRL", tel: "11-2222-7788", mail: "obras@ejemplo.local" },
      etapa: "finalizado",
      honorarios: 5600000,
      direccion: "Av. Maipú 2100, Vicente López",
      superficie: "246 m²",
      imagen: "img/casa-belgrano.jpg",
      factura: { tipo: "FA", numero: "0001-00000028", cae: "74185296300881", vto: "12 ago", total: 5600000, cuit: "30-71582391-4" },
      documentos: [
        { id: "d4a", nombre: "Plano conforme a obra.pdf", tipo: "plano", fecha: "30 ago" },
        { id: "d4b", nombre: "Contrato de honorarios.pdf", tipo: "contrato", fecha: "12 mar" }
      ],
      history: [
        { when: "30 ago", text: "Obra entregada. Plano conforme a obra." },
        { when: "12 ago", text: "Honorarios facturados." }
      ]
    },
    {
      id: "o5",
      codigo: "OB-2026-16",
      titulo: "Reforma de cocina en Villa Crespo",
      tipo: "reforma",
      clienteId: "c5",
      cliente: { nombre: "Paula Iglesias", tel: "11-6666-4410", mail: "paula@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 980000,
      direccion: "Corrientes 5400, Villa Crespo",
      superficie: "22 m²",
      imagen: "img/cocina-reforma.jpg",
      factura: null,
      documentos: [
        { id: "d5a", nombre: "Planta de cocina.pdf", tipo: "plano", fecha: "22 ago" },
        { id: "d5b", nombre: "Detalle de mesada.pdf", tipo: "plano", fecha: "28 ago" }
      ],
      history: [
        { when: "6 sep", text: "Demolición de tabique. Obra en curso." }
      ]
    },
    {
      id: "o6",
      codigo: "OB-2026-19",
      titulo: "PH con patio en San Telmo",
      tipo: "ph",
      clienteId: "c6",
      cliente: { nombre: "Tomás Vidal", tel: "11-4777-1200", mail: "vidal@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 2100000,
      direccion: "Defensa 800, San Telmo",
      superficie: "78 m²",
      imagen: "img/ph-san-telmo.jpg",
      factura: null,
      documentos: [
        { id: "d6a", nombre: "Relevamiento del patio.pdf", tipo: "plano", fecha: "1 sep" },
        { id: "d6b", nombre: "Permiso de obra.pdf", tipo: "municipal", fecha: "4 sep" }
      ],
      history: [
        { when: "4 sep", text: "Arranque de obra. Limpieza de revoques del patio." }
      ]
    },
    {
      id: "o7",
      codigo: "OB-2026-21",
      titulo: "Loft en Chacarita",
      tipo: "departamento",
      clienteId: "c7",
      cliente: { nombre: "Sofía Kramer", tel: "11-4888-3301", mail: "sofia@ejemplo.local" },
      etapa: "ejecutivos",
      honorarios: 2650000,
      direccion: "Leiva 4200, Chacarita",
      superficie: "110 m²",
      imagen: "img/loft-chacarita.jpg",
      factura: { tipo: "FB", numero: "0001-00000051", cae: "74185296301220", vto: "22 sep", total: 2650000, cuit: "27-40112255-6" },
      documentos: [
        { id: "d7a", nombre: "Planta y entrepiso.pdf", tipo: "plano", fecha: "28 ago" },
        { id: "d7b", nombre: "Renders del estar.jpg", tipo: "render", fecha: "30 ago" }
      ],
      history: [
        { when: "30 ago", text: "Ejecutivos en curso. Entrepiso definido." }
      ]
    },
    {
      id: "o8",
      codigo: "OB-2026-22",
      titulo: "Casa en obra en Caballito",
      tipo: "casa",
      clienteId: "c8",
      cliente: { nombre: "Familia Rossi", tel: "11-4722-0091", mail: "rossi@ejemplo.local" },
      etapa: "en_obra",
      honorarios: 3800000,
      direccion: "Av. Rivadavia 5100, Caballito",
      superficie: "142 m²",
      imagen: "img/galeria-obra.jpg",
      factura: null,
      documentos: [
        { id: "d8a", nombre: "Estructura de losas.pdf", tipo: "plano", fecha: "10 ago" },
        { id: "d8b", nombre: "Planilla de hierros.pdf", tipo: "plano", fecha: "10 ago" }
      ],
      history: [
        { when: "8 sep", text: "Losa de planta alta hormigonada." }
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

function loadClientes() {
  return loadList(STORAGE_CLIENTES, seedClientes);
}

function saveClientes(items) {
  localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(items));
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
  const clientes = loadClientes();
  let cliente = clientes.find((c) => c.nombre.toLowerCase() === consulta.nombre.toLowerCase());
  if (!cliente) {
    cliente = {
      id: crypto.randomUUID(),
      nombre: consulta.nombre,
      tel: consulta.contacto,
      mail: consulta.contacto.includes("@") ? consulta.contacto : "",
      cuit: "",
      barrio: consulta.lugar || ""
    };
    saveClientes([cliente, ...clientes]);
  }
  const obras = loadObras();
  const obra = {
    id: consulta.id,
    codigo: consulta.codigo,
    titulo: consulta.titulo || tipoLabel(consulta.tipo),
    tipo: consulta.tipo,
    clienteId: cliente.id,
    cliente: { nombre: consulta.nombre, tel: consulta.contacto, mail: cliente.mail },
    etapa: "anteproyecto",
    honorarios: 0,
    direccion: consulta.lugar || "",
    superficie: consulta.superficie || "",
    imagen: IMAGEN_TIPO[consulta.tipo] || IMAGEN_TIPO.casa,
    factura: null,
    documentos: [],
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

function docLabel(id) {
  return DOC_TIPOS.find((d) => d.id === id)?.label || id;
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

function documentosDeObras(obras) {
  const list = [];
  (obras || loadObras()).forEach((o) => {
    (o.documentos || []).forEach((d) => {
      list.push({ ...d, obraId: o.id, obraCodigo: o.codigo, obraTitulo: o.titulo });
    });
  });
  return list;
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
