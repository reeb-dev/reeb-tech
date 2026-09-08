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

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function seed() {
  return [
    {
      id: "p1",
      codigo: "ALQ-001",
      titulo: "2 amb. luminoso con balcón",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Av. Corrientes 3200, CABA",
      barrio: "Almagro",
      ambientes: 2,
      superficie: 45,
      precio: 380000,
      expensas: 45000,
      status: "disponible",
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
      ambientes: 4,
      superficie: 180,
      precio: 185000,
      expensas: 0,
      status: "reservada",
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
      titulo: "Monoambiente a estrenar",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Chile 1100, CABA",
      barrio: "San Telmo",
      ambientes: 1,
      superficie: 28,
      precio: 290000,
      expensas: 35000,
      status: "alquilada",
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
      titulo: "PH reciclado con terraza",
      tipo: "ph",
      operacion: "venta",
      direccion: "Gurruchaga 800, CABA",
      barrio: "Villa Crespo",
      ambientes: 3,
      superficie: 95,
      precio: 145000,
      expensas: 0,
      status: "disponible",
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
      titulo: "Local sobre avenida",
      tipo: "local",
      operacion: "alquiler",
      direccion: "Av. Rivadavia 5600, CABA",
      barrio: "Caballito",
      ambientes: 1,
      superficie: 60,
      precio: 520000,
      expensas: 25000,
      status: "disponible",
      cliente: null,
      visitas: [],
      history: [
        { when: "4 sep", text: "Disponible para mostrar." }
      ]
    },
    {
      id: "p6",
      codigo: "VTA-030",
      titulo: "Terreno esquina 300m²",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Ruta 8 km 42, Pilar",
      barrio: "Pilar Centro",
      ambientes: 0,
      superficie: 300,
      precio: 95000,
      expensas: 0,
      status: "disponible",
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
      titulo: "Oficina 3 amb. en torre",
      tipo: "oficina",
      operacion: "alquiler",
      direccion: "Av. del Libertador 6200, CABA",
      barrio: "Belgrano",
      ambientes: 3,
      superficie: 75,
      precio: 890000,
      expensas: 120000,
      status: "reservada",
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
      titulo: "Dúplex 3 amb. con cochera",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Mendoza 2400, Vicente López",
      barrio: "Vicente López",
      ambientes: 3,
      superficie: 110,
      precio: 220000,
      expensas: 85000,
      status: "vendida",
      cliente: { nombre: "Familia Domínguez", tel: "11-2222-7777", desde: "15 ago" },
      visitas: [],
      history: [
        { when: "1 sep", text: "Escritura firmada." },
        { when: "20 ago", text: "Boleto de compraventa." },
        { when: "15 ago", text: "Seña recibida." }
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
