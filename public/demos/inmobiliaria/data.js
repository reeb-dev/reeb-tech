const STATUSES = [
  { id: "disponible", label: "Disponible" },
  { id: "reservada", label: "Reservada" },
  { id: "alquilada", label: "Alquilada" },
  { id: "vendida", label: "Vendida" }
];

const TIPOS = [
  { id: "departamento", label: "Departamento" },
  { id: "casa", label: "Casa" },
  { id: "ph", label: "PH" },
  { id: "local", label: "Local comercial" },
  { id: "oficina", label: "Oficina" },
  { id: "terreno", label: "Terreno" }
];

const OPERACIONES = [
  { id: "alquiler", label: "Alquiler" },
  { id: "venta", label: "Venta" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "RC", label: "Recibo" }
];

const AMENITIES = [
  { id: "pileta", label: "Pileta", icon: "🏊" },
  { id: "gimnasio", label: "Gimnasio", icon: "🏋️" },
  { id: "parrilla", label: "Parrilla", icon: "🔥" },
  { id: "sum", label: "SUM", icon: "🎉" },
  { id: "laundry", label: "Laundry", icon: "🧺" },
  { id: "seguridad", label: "Seguridad 24hs", icon: "👮" },
  { id: "cochera", label: "Cochera", icon: "🚗" },
  { id: "baulera", label: "Baulera", icon: "📦" },
  { id: "balcon", label: "Balcón", icon: "🌿" },
  { id: "terraza", label: "Terraza", icon: "☀️" },
  { id: "jardin", label: "Jardín", icon: "🌳" },
  { id: "apto_profesional", label: "Apto profesional", icon: "💼" }
];

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function amenityLabel(id) {
  return AMENITIES.find((a) => a.id === id)?.label || id;
}

function amenityIcon(id) {
  return AMENITIES.find((a) => a.id === id)?.icon || "✓";
}

function seed() {
  return [
    {
      id: "p1",
      codigo: "ALQ-001",
      titulo: "Departamento 2 amb. luminoso con balcón",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Av. Corrientes 3200, CABA",
      barrio: "Almagro",
      zona: "CABA",
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie: 45,
      cubierta: 42,
      precio: 450000,
      expensas: 55000,
      antiguedad: 15,
      orientacion: "Norte",
      piso: "5°",
      cochera: false,
      amenities: ["balcon", "laundry"],
      descripcion: "Hermoso departamento de 2 ambientes ubicado en pleno Almagro. Living-comedor con balcón al frente, dormitorio con placard, cocina separada, baño completo. Muy luminoso, excelente estado. A 2 cuadras del subte B.",
      imagenes: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 234,
      consultas: 12,
      diasPublicada: 15,
      precioM2Zona: 12000,
      cliente: null,
      visitas: [
        { fecha: "6 sep", cliente: "María González", nota: "Le gustó pero pide garage." }
      ],
      history: [
        { when: "5 sep", text: "Publicado en portales." },
        { when: "1 sep", text: "Fotos actualizadas." }
      ]
    },
    {
      id: "p2",
      codigo: "VTA-012",
      titulo: "Casa 4 amb. con jardín y pileta",
      tipo: "casa",
      operacion: "venta",
      direccion: "Los Aromos 450, Ituzaingó",
      barrio: "Ituzaingó Norte",
      zona: "GBA Oeste",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 180,
      cubierta: 140,
      precio: 185000,
      expensas: 0,
      antiguedad: 8,
      orientacion: "Noreste",
      piso: null,
      cochera: true,
      amenities: ["pileta", "parrilla", "jardin", "cochera"],
      descripcion: "Espectacular casa en barrio residencial. Living-comedor amplio, cocina-comedor diaria, 3 dormitorios (suite con vestidor), 2 baños completos. Jardín con pileta y quincho con parrilla. Cochera para 2 autos. Ideal familia.",
      imagenes: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop"
      ],
      status: "reservada",
      destacado: true,
      nuevo: false,
      vistas: 567,
      consultas: 28,
      diasPublicada: 45,
      precioM2Zona: 1200,
      cliente: { nombre: "Carlos Méndez", tel: "11-5555-1234", desde: "3 sep" },
      visitas: [
        { fecha: "3 sep", cliente: "Carlos Méndez", nota: "Hizo seña. Esperando escribano." },
        { fecha: "28 ago", cliente: "Laura Ríos", nota: "Le pareció grande." }
      ],
      history: [
        { when: "3 sep", text: "Seña recibida. Reservada." },
        { when: "28 ago", text: "Segunda visita." }
      ]
    },
    {
      id: "p3",
      codigo: "ALQ-008",
      titulo: "Monoambiente a estrenar en San Telmo",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Chile 1100, CABA",
      barrio: "San Telmo",
      zona: "CABA",
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie: 28,
      cubierta: 28,
      precio: 320000,
      expensas: 40000,
      antiguedad: 0,
      orientacion: "Este",
      piso: "3°",
      cochera: false,
      amenities: ["laundry", "seguridad"],
      descripcion: "Monoambiente a estrenar en edificio con amenities. Ambiente principal con kitchenette integrada, baño completo. Ideal para inversión o primera vivienda. Excelente ubicación cerca de Plaza Dorrego.",
      imagenes: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=500&fit=crop"
      ],
      status: "alquilada",
      destacado: false,
      nuevo: true,
      vistas: 189,
      consultas: 15,
      diasPublicada: 8,
      precioM2Zona: 13500,
      cliente: { nombre: "Sofía Paredes", tel: "11-4444-5678", desde: "1 sep" },
      visitas: [],
      history: [
        { when: "1 sep", text: "Contrato firmado por 2 años." },
        { when: "25 ago", text: "Visita y aprobación de garantía." }
      ]
    },
    {
      id: "p4",
      codigo: "VTA-025",
      titulo: "PH reciclado con terraza propia",
      tipo: "ph",
      operacion: "venta",
      direccion: "Gurruchaga 800, CABA",
      barrio: "Villa Crespo",
      zona: "CABA",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 95,
      cubierta: 75,
      precio: 165000,
      expensas: 0,
      antiguedad: 60,
      orientacion: "Oeste",
      piso: "PB",
      cochera: false,
      amenities: ["terraza", "parrilla"],
      descripcion: "Increíble PH totalmente reciclado con terraza propia de 20m². Living-comedor con doble altura, 2 dormitorios, baño completo, cocina equipada. Terraza con parrilla y vista despejada. Sin expensas. Barrio de moda.",
      imagenes: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 423,
      consultas: 19,
      diasPublicada: 30,
      precioM2Zona: 2100,
      cliente: null,
      visitas: [
        { fecha: "7 sep", cliente: "Martín Gómez", nota: "Pidió segunda visita con arquitecto." }
      ],
      history: [
        { when: "7 sep", text: "Primera visita realizada." },
        { when: "20 ago", text: "Tasación actualizada." }
      ]
    },
    {
      id: "p5",
      codigo: "ALQ-015",
      titulo: "Local comercial sobre Av. Rivadavia",
      tipo: "local",
      operacion: "alquiler",
      direccion: "Av. Rivadavia 5600, CABA",
      barrio: "Caballito",
      zona: "CABA",
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie: 60,
      cubierta: 60,
      precio: 650000,
      expensas: 30000,
      antiguedad: 25,
      orientacion: "Norte",
      piso: "PB",
      cochera: false,
      amenities: ["apto_profesional"],
      descripcion: "Excelente local comercial sobre avenida principal. Gran vidriera, salón principal amplio, depósito y baño. Ideal para comercio, oficina o consultorio. Alto tránsito peatonal y vehicular. Apto todo rubro.",
      imagenes: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: false,
      nuevo: false,
      vistas: 156,
      consultas: 8,
      diasPublicada: 60,
      precioM2Zona: 11000,
      cliente: null,
      visitas: [],
      history: [
        { when: "4 sep", text: "Disponible para mostrar." }
      ]
    },
    {
      id: "p6",
      codigo: "VTA-030",
      titulo: "Terreno esquina 300m² en Pilar",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Ruta 8 km 42, Pilar",
      barrio: "Pilar Centro",
      zona: "GBA Norte",
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 300,
      cubierta: 0,
      precio: 95000,
      expensas: 0,
      antiguedad: null,
      orientacion: "Esquina NE",
      piso: null,
      cochera: false,
      amenities: [],
      descripcion: "Terreno en esquina con excelente ubicación comercial. Sobre ruta con alto tránsito. Ideal para desarrollo comercial o residencial. Todos los servicios. Escritura inmediata.",
      imagenes: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: false,
      nuevo: false,
      vistas: 89,
      consultas: 4,
      diasPublicada: 90,
      precioM2Zona: 350,
      cliente: null,
      visitas: [
        { fecha: "5 sep", cliente: "Inmobiliaria del Norte", nota: "Consulta por subdivisión." }
      ],
      history: [
        { when: "5 sep", text: "Consulta de otra inmobiliaria." },
        { when: "1 ago", text: "Publicado." }
      ]
    },
    {
      id: "p7",
      codigo: "ALQ-022",
      titulo: "Oficina premium en torre de Belgrano",
      tipo: "oficina",
      operacion: "alquiler",
      direccion: "Av. del Libertador 6200, CABA",
      barrio: "Belgrano",
      zona: "CABA",
      ambientes: 3,
      dormitorios: 0,
      banos: 2,
      superficie: 85,
      cubierta: 85,
      precio: 1200000,
      expensas: 180000,
      antiguedad: 5,
      orientacion: "Norte",
      piso: "12°",
      cochera: true,
      amenities: ["seguridad", "cochera"],
      descripcion: "Oficina de categoría en torre AAA. Recepción, 2 despachos privados, sala de reuniones, office y 2 baños. Vista panorámica al río. Cochera incluida. Edificio con seguridad 24hs y generador.",
      imagenes: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop"
      ],
      status: "reservada",
      destacado: false,
      nuevo: false,
      vistas: 245,
      consultas: 11,
      diasPublicada: 22,
      precioM2Zona: 15000,
      cliente: { nombre: "Estudio Contable Ruiz", tel: "11-3333-9999", desde: "6 sep" },
      visitas: [
        { fecha: "6 sep", cliente: "Estudio Contable Ruiz", nota: "Firmaron reserva." }
      ],
      history: [
        { when: "6 sep", text: "Reserva firmada. Próximo: contrato." }
      ]
    },
    {
      id: "p8",
      codigo: "VTA-018",
      titulo: "Dúplex 3 amb. con cochera en Vicente López",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Mendoza 2400, Vicente López",
      barrio: "Vicente López",
      zona: "GBA Norte",
      ambientes: 3,
      dormitorios: 2,
      banos: 2,
      superficie: 110,
      cubierta: 95,
      precio: 245000,
      expensas: 95000,
      antiguedad: 3,
      orientacion: "Noroeste",
      piso: "1° y 2°",
      cochera: true,
      amenities: ["pileta", "gimnasio", "cochera", "sum", "seguridad"],
      descripcion: "Espectacular dúplex en complejo con amenities. Planta baja: living-comedor, cocina, toilette y patio. Planta alta: 2 dormitorios en suite, balcón terraza. Cochera cubierta. Pileta, gimnasio, SUM.",
      imagenes: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop"
      ],
      status: "vendida",
      destacado: false,
      nuevo: false,
      vistas: 678,
      consultas: 34,
      diasPublicada: 75,
      precioM2Zona: 2400,
      cliente: { nombre: "Familia Domínguez", tel: "11-2222-7777", desde: "15 ago" },
      visitas: [],
      history: [
        { when: "1 sep", text: "Escritura firmada." },
        { when: "20 ago", text: "Boleto de compraventa." },
        { when: "15 ago", text: "Seña recibida." }
      ]
    },
    {
      id: "p9",
      codigo: "VTA-035",
      titulo: "Penthouse 4 amb. con terraza en Palermo",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Honduras 5800, CABA",
      barrio: "Palermo Hollywood",
      zona: "CABA",
      ambientes: 4,
      dormitorios: 3,
      banos: 3,
      superficie: 180,
      cubierta: 140,
      precio: 420000,
      expensas: 180000,
      antiguedad: 2,
      orientacion: "Norte",
      piso: "10°",
      cochera: true,
      amenities: ["terraza", "pileta", "gimnasio", "parrilla", "cochera", "seguridad", "sum"],
      descripcion: "Espectacular penthouse en el corazón de Palermo Hollywood. Living-comedor de 40m², cocina con isla, 3 suites, family room. Terraza propia de 40m² con parrilla y jacuzzi. 2 cocheras. Edificio full amenities.",
      imagenes: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: true,
      nuevo: true,
      vistas: 892,
      consultas: 45,
      diasPublicada: 5,
      precioM2Zona: 3200,
      cliente: null,
      visitas: [],
      history: [
        { when: "3 sep", text: "Publicado como destacado." }
      ]
    },
    {
      id: "p10",
      codigo: "ALQ-028",
      titulo: "Depto 3 amb. vista al río en Puerto Madero",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Olga Cossettini 1500, CABA",
      barrio: "Puerto Madero",
      zona: "CABA",
      ambientes: 3,
      dormitorios: 2,
      banos: 2,
      superficie: 95,
      cubierta: 90,
      precio: 2800000,
      expensas: 450000,
      antiguedad: 8,
      orientacion: "Este",
      piso: "18°",
      cochera: true,
      amenities: ["pileta", "gimnasio", "seguridad", "cochera", "sum", "laundry"],
      descripcion: "Departamento de lujo con vista directa al río y reserva ecológica. Living-comedor con ventanales de piso a techo, cocina equipada, 2 dormitorios en suite. Amenities completos: pileta, gym, spa. Cochera incluida.",
      imagenes: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 567,
      consultas: 23,
      diasPublicada: 12,
      precioM2Zona: 35000,
      cliente: null,
      visitas: [],
      history: [
        { when: "27 ago", text: "Publicado en cartera premium." }
      ]
    },
    {
      id: "p11",
      codigo: "VTA-040",
      titulo: "Casa estilo inglés en Recoleta",
      tipo: "casa",
      operacion: "venta",
      direccion: "Arenales 2100, CABA",
      barrio: "Recoleta",
      zona: "CABA",
      ambientes: 6,
      dormitorios: 4,
      banos: 4,
      superficie: 350,
      cubierta: 280,
      precio: 980000,
      expensas: 0,
      antiguedad: 90,
      orientacion: "Norte",
      piso: null,
      cochera: true,
      amenities: ["jardin", "cochera", "terraza"],
      descripcion: "Exclusiva casa de estilo inglés en el corazón de Recoleta. Hall de entrada, living con hogar, comedor formal, escritorio, 4 dormitorios (principal en suite), dependencia de servicio. Jardín interno, terraza y cochera para 2 autos.",
      imagenes: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 1234,
      consultas: 56,
      diasPublicada: 60,
      precioM2Zona: 4500,
      cliente: null,
      visitas: [],
      history: [
        { when: "10 jul", text: "Propiedad exclusiva captada." }
      ]
    },
    {
      id: "p12",
      codigo: "ALQ-030",
      titulo: "Loft industrial en Palermo Soho",
      tipo: "ph",
      operacion: "alquiler",
      direccion: "Armenia 1700, CABA",
      barrio: "Palermo Soho",
      zona: "CABA",
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie: 65,
      cubierta: 65,
      precio: 850000,
      expensas: 45000,
      antiguedad: 80,
      orientacion: "Sur",
      piso: "PB",
      cochera: false,
      amenities: ["apto_profesional"],
      descripcion: "Espectacular loft estilo industrial con techos de 5 metros, vigas de madera a la vista y grandes ventanales. Ambiente integrado con entrepiso para dormitorio. Ideal para profesionales creativos. A pasos de Plaza Armenia.",
      imagenes: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=500&fit=crop"
      ],
      status: "disponible",
      destacado: false,
      nuevo: true,
      vistas: 345,
      consultas: 18,
      diasPublicada: 3,
      precioM2Zona: 14000,
      cliente: null,
      visitas: [],
      history: [
        { when: "5 sep", text: "Nueva publicación." }
      ]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("inmobiliaria-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("inmobiliaria-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("inmobiliaria-demo-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS.find((t) => t.id === tipo)?.label || tipo;
}

function opLabel(op) {
  return OPERACIONES.find((o) => o.id === op)?.label || op;
}

function money(amount, usd = false) {
  if (usd) return "USD " + Number(amount || 0).toLocaleString("es-AR");
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
