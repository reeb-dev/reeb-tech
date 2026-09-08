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

const FOTOS = {
  deptoLiving: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
  deptoCocina: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
  deptoDormi: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
  deptoStudio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
  deptoStudio2: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&h=800&fit=crop",
  deptoLujo: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop",
  deptoLujo2: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop",
  deptoLujo3: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop",
  deptoTorre: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
  deptoLiving2: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&h=800&fit=crop",
  deptoLiving3: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop",
  loft: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
  loft2: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=800&fit=crop",
  loft3: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop",
  phInterior: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop",
  phInterior2: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
  phTerraza: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop",
  casaPileta: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
  casaFachada: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
  casaInterior: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop",
  casaClasica: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop",
  casaJardin: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop",
  casaNoche: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
  casaCocina: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
  local: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
  local2: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&h=800&fit=crop",
  oficina: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
  oficina2: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop"
};

function fotoPorTipo(tipo) {
  if (tipo === "casa") return FOTOS.casaFachada;
  if (tipo === "ph") return FOTOS.phInterior;
  if (tipo === "local") return FOTOS.local;
  if (tipo === "oficina") return FOTOS.oficina;
  if (tipo === "terreno") return FOTOS.casaJardin;
  return FOTOS.deptoLiving;
}

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
      descripcion: "Departamento de 2 ambientes en Almagro. Living-comedor con balcón al frente, dormitorio con placard, cocina separada y baño completo. Muy luminoso. A 2 cuadras del subte B (Medrano).",
      imagenes: [FOTOS.deptoLiving, FOTOS.deptoCocina, FOTOS.deptoDormi],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 14,
      consultas: 2,
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
      direccion: "Concepción Arenal 2140, CABA",
      barrio: "Colegiales",
      zona: "CABA",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 180,
      cubierta: 140,
      precio: 340000,
      expensas: 0,
      antiguedad: 8,
      orientacion: "Noreste",
      piso: null,
      cochera: true,
      amenities: ["pileta", "parrilla", "jardin", "cochera"],
      descripcion: "Casa en lote propio en Colegiales. Living-comedor, cocina-comedor diaria, 3 dormitorios (suite con vestidor) y 2 baños. Jardín con pileta y quincho. Cochera para 2 autos. Ideal familia.",
      imagenes: [FOTOS.casaPileta, FOTOS.casaFachada, FOTOS.casaInterior, FOTOS.casaCocina],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 22,
      consultas: 4,
      diasPublicada: 22,
      precioM2Zona: 2100,
      cliente: null,
      visitas: [
        { fecha: "3 sep", cliente: "Carlos Méndez", nota: "Pidió segunda visita el fin de semana." },
        { fecha: "28 ago", cliente: "Laura Ríos", nota: "Le pareció grande." }
      ],
      history: [
        { when: "28 ago", text: "Segunda visita." },
        { when: "12 ago", text: "Publicada en cartera." }
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
      descripcion: "Monoambiente a estrenar en edificio con laundry y seguridad. Ambiente principal con kitchenette, baño completo. Cerca de Plaza Dorrego y de la estación Independencia.",
      imagenes: [FOTOS.deptoStudio, FOTOS.deptoStudio2],
      status: "alquilada",
      destacado: false,
      nuevo: true,
      vistas: 8,
      consultas: 1,
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
      precio: 175000,
      expensas: 0,
      antiguedad: 60,
      orientacion: "Oeste",
      piso: "PB",
      cochera: false,
      amenities: ["terraza", "parrilla"],
      descripcion: "PH reciclado con terraza propia de 20 m². Living-comedor con doble altura, 2 dormitorios, baño completo y cocina equipada. Terraza con parrilla. Sin expensas. A pasos de Serrano y del subte B.",
      imagenes: [FOTOS.phInterior, FOTOS.phInterior2, FOTOS.phTerraza],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 18,
      consultas: 3,
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
      descripcion: "Local sobre avenida, con vidriera, salón, depósito y baño. Alto tránsito peatonal y vehicular, a metros del subte A (Primera Junta). Apto comercio, oficina o consultorio.",
      imagenes: [FOTOS.local, FOTOS.local2],
      status: "disponible",
      destacado: false,
      nuevo: false,
      vistas: 6,
      consultas: 1,
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
      codigo: "ALQ-022",
      titulo: "Oficina en torre de Belgrano",
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
      descripcion: "Oficina en torre AAA. Recepción, 2 despachos, sala de reuniones, office y 2 baños. Vista al río. Cochera incluida. Seguridad 24 hs y grupo electrógeno.",
      imagenes: [FOTOS.oficina, FOTOS.oficina2],
      status: "reservada",
      destacado: false,
      nuevo: false,
      vistas: 11,
      consultas: 2,
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
      id: "p7",
      codigo: "VTA-035",
      titulo: "Penthouse 4 amb. con terraza en Palermo",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Honduras 5800, CABA",
      barrio: "Palermo",
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
      descripcion: "Penthouse en Palermo Hollywood. Living-comedor de 40 m², cocina con isla, 3 suites y family. Terraza propia de 40 m² con parrilla. 2 cocheras. Edificio con pileta, gym y SUM.",
      imagenes: [FOTOS.deptoLujo, FOTOS.deptoLujo2, FOTOS.deptoLujo3],
      status: "disponible",
      destacado: true,
      nuevo: true,
      vistas: 28,
      consultas: 5,
      diasPublicada: 5,
      precioM2Zona: 3200,
      cliente: null,
      visitas: [],
      history: [
        { when: "3 sep", text: "Publicado como destacado." }
      ]
    },
    {
      id: "p8",
      codigo: "ALQ-028",
      titulo: "Depto 3 amb. con vista al río en Puerto Madero",
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
      descripcion: "Departamento en torre de Puerto Madero, vista a la reserva y al río. Living con ventanales, cocina equipada y 2 dormitorios en suite. Pileta, gym y spa. Cochera incluida.",
      imagenes: [FOTOS.deptoTorre, FOTOS.deptoLiving2, FOTOS.deptoLujo3],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 19,
      consultas: 3,
      diasPublicada: 12,
      precioM2Zona: 35000,
      cliente: null,
      visitas: [],
      history: [
        { when: "27 ago", text: "Publicado en cartera premium." }
      ]
    },
    {
      id: "p9",
      codigo: "VTA-040",
      titulo: "Casa de estilo clásico en Recoleta",
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
      precio: 890000,
      expensas: 0,
      antiguedad: 90,
      orientacion: "Norte",
      piso: null,
      cochera: true,
      amenities: ["jardin", "cochera", "terraza"],
      descripcion: "Casa de estilo clásico en Recoleta. Hall, living con hogar, comedor, escritorio, 4 dormitorios (principal en suite) y dependencia. Jardín interno, terraza y cochera para 2 autos.",
      imagenes: [FOTOS.casaInterior, FOTOS.casaClasica, FOTOS.casaJardin],
      status: "disponible",
      destacado: true,
      nuevo: false,
      vistas: 31,
      consultas: 4,
      diasPublicada: 60,
      precioM2Zona: 4500,
      cliente: null,
      visitas: [],
      history: [
        { when: "10 jul", text: "Propiedad exclusiva captada." }
      ]
    },
    {
      id: "p10",
      codigo: "ALQ-030",
      titulo: "PH 2 amb. luminoso en Palermo Soho",
      tipo: "ph",
      operacion: "alquiler",
      direccion: "Armenia 1700, CABA",
      barrio: "Palermo",
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
      descripcion: "PH en planta baja cerca de Plaza Armenia. Living luminoso, dormitorio separado y baño completo. Apto profesional. Sin amenities de torre: es un PH de barrio.",
      imagenes: [FOTOS.loft, FOTOS.loft2, FOTOS.loft3],
      status: "disponible",
      destacado: false,
      nuevo: true,
      vistas: 9,
      consultas: 2,
      diasPublicada: 3,
      precioM2Zona: 14000,
      cliente: null,
      visitas: [],
      history: [
        { when: "5 sep", text: "Nueva publicación." }
      ]
    },
    {
      id: "p11",
      codigo: "VTA-041",
      titulo: "Departamento 3 amb. con cochera en Núñez",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Av. Cabildo 3700, CABA",
      barrio: "Núñez",
      zona: "CABA",
      ambientes: 3,
      dormitorios: 2,
      banos: 2,
      superficie: 78,
      cubierta: 72,
      precio: 198000,
      expensas: 72000,
      antiguedad: 6,
      orientacion: "Noreste",
      piso: "7°",
      cochera: true,
      amenities: ["cochera", "baulera", "laundry", "seguridad"],
      descripcion: "3 ambientes en Núñez, frente a Cabildo. Living-comedor, 2 dormitorios (uno en suite), cocina independiente y baulera. Cochera cubierta. Cerca del subte D (Congreso de Tucumán).",
      imagenes: [FOTOS.deptoLiving3, FOTOS.deptoCocina, FOTOS.deptoDormi],
      status: "disponible",
      destacado: false,
      nuevo: false,
      vistas: 7,
      consultas: 1,
      diasPublicada: 18,
      precioM2Zona: 2400,
      cliente: null,
      visitas: [],
      history: [
        { when: "21 ago", text: "Publicado." }
      ]
    },
    {
      id: "p12",
      codigo: "VTA-042",
      titulo: "Casa 5 amb. con jardín en Villa Devoto",
      tipo: "casa",
      operacion: "venta",
      direccion: "Av. San Martín 6400, CABA",
      barrio: "Villa Devoto",
      zona: "CABA",
      ambientes: 5,
      dormitorios: 3,
      banos: 3,
      superficie: 220,
      cubierta: 170,
      precio: 265000,
      expensas: 0,
      antiguedad: 12,
      orientacion: "Norte",
      piso: null,
      cochera: true,
      amenities: ["jardin", "parrilla", "cochera"],
      descripcion: "Casa en Villa Devoto, lote propio. Living, comedor, cocina, 3 dormitorios y 3 baños. Jardín posterior con parrilla. Cochera. Zona de casas bajas, cerca de Plaza Arenales.",
      imagenes: [FOTOS.casaNoche, FOTOS.casaJardin, FOTOS.casaCocina],
      status: "disponible",
      destacado: false,
      nuevo: true,
      vistas: 12,
      consultas: 2,
      diasPublicada: 9,
      precioM2Zona: 1300,
      cliente: null,
      visitas: [],
      history: [
        { when: "30 ago", text: "Captada y publicada." }
      ]
    }
  ];
}

const STORAGE_KEY = "inmobiliaria-demo-v3";
const DEMO_WA_PHONE = "5491140001234";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function recordListingView(list, id) {
  const item = list.find((p) => p.id === id);
  if (!item) return null;
  item.vistas = Number(item.vistas || 0) + 1;
  save(list);
  return item;
}

function recordListingConsulta(list, id) {
  const item = list.find((p) => p.id === id);
  if (!item) return null;
  item.consultas = Number(item.consultas || 0) + 1;
  save(list);
  return item;
}

function propertyWaUrl(p) {
  const text = `Hola, quiero consultar por ${p.codigo}: ${p.titulo}`;
  return "https://wa.me/" + DEMO_WA_PHONE + "?text=" + encodeURIComponent(text);
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
