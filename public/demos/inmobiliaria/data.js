const STATUSES = [
  { id: "disponible", label: "Disponible" },
  { id: "reservada", label: "Reservada" },
  { id: "alquilada", label: "Alquilada" },
  { id: "vendida", label: "Vendida" }
];

const TIPOS = [
  { id: "casa", label: "Casa" },
  { id: "cabana", label: "Cabaña" },
  { id: "departamento", label: "Departamento" },
  { id: "terreno", label: "Lote" },
  { id: "local", label: "Local" }
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
  casaLago: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&h=800&fit=crop",
  casaPinos: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&h=800&fit=crop",
  casaMadera: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdbc?w=1200&h=800&fit=crop",
  casaInterior: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop",
  cabanaBosque: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop",
  cabanaAframe: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&h=800&fit=crop",
  cabanaHogar: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&h=800&fit=crop",
  cabanaDeck: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&h=800&fit=crop",
  cabanaDormi: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop",
  deptoVista: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
  deptoLiving: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop",
  deptoBalcon: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop",
  loteCerro: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop",
  loteValle: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop",
  lotePastizal: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop",
  localPueblo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop",
  localVidriera: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&h=800&fit=crop"
};

function fotoPorTipo(tipo) {
  if (tipo === "casa") return FOTOS.casaPinos;
  if (tipo === "cabana") return FOTOS.cabanaBosque;
  if (tipo === "terreno") return FOTOS.loteCerro;
  if (tipo === "local") return FOTOS.localPueblo;
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
  const zona = "Sierra de la Ventana";
  return [
    {
      id: "p1",
      codigo: "ALQ-001",
      titulo: "Cabaña 2 dorm. entre pinos, alquiler permanente",
      tipo: "cabana",
      operacion: "alquiler",
      direccion: "Calle Los Pinos 120, Villa Ventana",
      barrio: "Villa Ventana",
      zona,
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 68,
      cubierta: 58,
      precio: 420000,
      expensas: 0,
      antiguedad: 12,
      orientacion: "Norte",
      piso: "PB",
      cochera: false,
      amenities: ["parrilla", "jardin"],
      descripcion: "Cabaña de madera en Villa Ventana, para alquiler permanente. Living con hogar a leña, dos dormitorios y deck hacia los pinos. A minutos del arroyo y del pueblo. No es una reserva de fin de semana.",
      imagenes: [FOTOS.cabanaBosque, FOTOS.cabanaHogar, FOTOS.cabanaDormi],
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
      titulo: "Casa de piedra y madera con vista al cordón",
      tipo: "casa",
      operacion: "venta",
      direccion: "Av. San Martín 210, Sierra de la Ventana",
      barrio: "Sierra de la Ventana",
      zona,
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
      amenities: ["parrilla", "jardin", "cochera"],
      descripcion: "Casa en el pueblo de Sierra de la Ventana, lote propio. Living con hogar, tres dormitorios y jardín hacia el cordón de Ventania. Cochera y quincho. Venta, no estadía.",
      imagenes: [FOTOS.casaPinos, FOTOS.casaMadera, FOTOS.casaInterior],
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
      titulo: "Departamento con vista al cerro, La Gruta",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Los Teros 40, Villa Serrana La Gruta",
      barrio: "Villa Serrana La Gruta",
      zona,
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
      amenities: ["balcon"],
      descripcion: "Departamento bajo en Villa Serrana La Gruta, alquilado. Ambiente integrado, kitchenette y balcón hacia el cerro. Contrato vigente de alquiler permanente.",
      imagenes: [FOTOS.deptoVista, FOTOS.deptoBalcon],
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
      titulo: "Cabaña de dos plantas con deck al valle",
      tipo: "cabana",
      operacion: "venta",
      direccion: "Calle Los Cerezos 55, Villa Ventana",
      barrio: "Villa Ventana",
      zona,
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
      amenities: ["terraza", "parrilla", "jardin"],
      descripcion: "Cabaña en Villa Ventana. Planta baja con living y cocina, dos dormitorios arriba y deck con parrilla hacia el valle. Lote con pinos. Venta de la vivienda, no reserva de fechas.",
      imagenes: [FOTOS.cabanaAframe, FOTOS.cabanaDeck, FOTOS.cabanaHogar],
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
      titulo: "Local sobre Av. San Martín",
      tipo: "local",
      operacion: "alquiler",
      direccion: "Av. San Martín 480, Sierra de la Ventana",
      barrio: "Sierra de la Ventana",
      zona,
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
      descripcion: "Local sobre la avenida del pueblo, con vidriera, salón y baño. Sirve para comercio o estudio. Alquiler permanente, no local de temporada.",
      imagenes: [FOTOS.localPueblo, FOTOS.localVidriera],
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
      titulo: "Casa baja en Tornquist, alquiler permanente",
      tipo: "casa",
      operacion: "alquiler",
      direccion: "Calle Sarmiento 310, Tornquist",
      barrio: "Tornquist",
      zona,
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 92,
      cubierta: 80,
      precio: 380000,
      expensas: 0,
      antiguedad: 18,
      orientacion: "Norte",
      piso: "PB",
      cochera: true,
      amenities: ["jardin", "cochera"],
      descripcion: "Casa baja en el pueblo de Tornquist, reservada. Living, tres ambientes, patio y cochera. Alquiler permanente de vivienda, no paquete turístico.",
      imagenes: [FOTOS.casaMadera, FOTOS.casaInterior],
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
      titulo: "Casa con pileta y vista al valle en Villa Ventana",
      tipo: "casa",
      operacion: "venta",
      direccion: "Calle Las Acacias 18, Villa Ventana",
      barrio: "Villa Ventana",
      zona,
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
      amenities: ["pileta", "parrilla", "jardin", "cochera"],
      descripcion: "Casa en Villa Ventana sobre lote con pinos. Living amplio, tres dormitorios, pileta y quincho. Vista al valle y al cordón. Venta de la propiedad.",
      imagenes: [FOTOS.casaLago, FOTOS.casaPinos, FOTOS.cabanaDeck],
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
      titulo: "Departamento 3 amb. con vista al cerro",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Av. San Martín 890, Sierra de la Ventana",
      barrio: "Sierra de la Ventana",
      zona,
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
      amenities: ["balcon", "cochera"],
      descripcion: "Departamento en el pueblo, piso alto, living con ventana al cerro. Dos dormitorios, cocina y cochera. Alquiler permanente.",
      imagenes: [FOTOS.deptoLiving, FOTOS.deptoVista, FOTOS.deptoBalcon],
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
      titulo: "Casa familiar en Saldungaray",
      tipo: "casa",
      operacion: "venta",
      direccion: "Calle Belgrano 150, Saldungaray",
      barrio: "Saldungaray",
      zona,
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
      amenities: ["jardin", "cochera", "parrilla"],
      descripcion: "Casa en Saldungaray, partido de Tornquist. Living, comedor, cuatro dormitorios, jardín y cochera. Pueblo chico, a minutos de Sierra de la Ventana por la ruta.",
      imagenes: [FOTOS.casaMadera, FOTOS.casaPinos, FOTOS.lotePastizal],
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
      titulo: "Cabaña compacta, alquiler permanente",
      tipo: "cabana",
      operacion: "alquiler",
      direccion: "Calle Los Notros 8, Villa Serrana La Gruta",
      barrio: "Villa Serrana La Gruta",
      zona,
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
      amenities: ["parrilla"],
      descripcion: "Cabaña de un dormitorio en La Gruta. Living con hogar, cocina y parrilla. Alquiler permanente, cerca del cerro y de Sierra de la Ventana.",
      imagenes: [FOTOS.cabanaBosque, FOTOS.cabanaDormi],
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
      titulo: "Lote con vista al cerro en Tornquist",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Camino al cerro, Tornquist",
      barrio: "Tornquist",
      zona,
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 1200,
      cubierta: 0,
      precio: 85000,
      expensas: 0,
      antiguedad: null,
      orientacion: "Noreste",
      piso: null,
      cochera: false,
      amenities: ["jardin"],
      descripcion: "Lote en altura sobre Tornquist, vista al cerro y al valle. Sin construcción. Escritura y mensura de ejemplo. No incluye proyecto de obra.",
      imagenes: [FOTOS.loteCerro, FOTOS.loteValle],
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
      titulo: "Lote con vista al cordón, Cerro Ventana",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Ruta 76, acceso Cerro Ventana",
      barrio: "Cerro Ventana",
      zona,
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 1800,
      cubierta: 0,
      precio: 140000,
      expensas: 0,
      antiguedad: null,
      orientacion: "Oeste",
      piso: null,
      cochera: false,
      amenities: [],
      descripcion: "Lote sobre la Ruta 76, cerca del acceso al Cerro Ventana, partido de Tornquist. Vista al cordón, pastizal y piedra. Sin edificación. Venta del terreno.",
      imagenes: [FOTOS.loteValle, FOTOS.loteCerro, FOTOS.lotePastizal],
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

const STORAGE_KEY = "inmobiliaria-demo-v4";
const DEMO_WA_PHONE = "5492915757934";

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
