const STATUSES = [
  { id: "consulta", label: "Consulta" },
  { id: "presupuestado", label: "Presupuestado" },
  { id: "aprobado", label: "Aprobado" },
  { id: "produccion", label: "En producción" },
  { id: "terminado", label: "Terminado" },
  { id: "entregado", label: "Entregado" }
];

const TIPOS_MUEBLE = [
  { id: "placard", label: "Placard" },
  { id: "cocina", label: "Mueble de cocina" },
  { id: "escritorio", label: "Escritorio" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "mesa", label: "Mesa" },
  { id: "sillas", label: "Sillas" },
  { id: "cama", label: "Cama/Respaldo" },
  { id: "vanitory", label: "Vanitory" },
  { id: "rack", label: "Rack/Mueble TV" },
  { id: "vestidor", label: "Vestidor" },
  { id: "otro", label: "Otro" }
];

const MATERIALES = [
  { id: "melamina", label: "Melamina", unidad: "placa" },
  { id: "mdf", label: "MDF", unidad: "placa" },
  { id: "madera", label: "Madera maciza", unidad: "m²" },
  { id: "enchapado", label: "Enchapado", unidad: "m²" },
  { id: "vidrio", label: "Vidrio", unidad: "m²" },
  { id: "herrajes", label: "Herrajes", unidad: "kit" },
  { id: "tiradores", label: "Tiradores", unidad: "unidad" },
  { id: "correderas", label: "Correderas", unidad: "par" },
  { id: "bisagras", label: "Bisagras", unidad: "unidad" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "PR", label: "Presupuesto" }
];

function seed() {
  return [
    {
      id: "c1",
      pedido: "PED-2024-041",
      cliente: { nombre: "Familia Rodríguez", tel: "11-5555-1234", direccion: "Av. Rivadavia 4500, CABA" },
      tipo: "placard",
      descripcion: "Placard 3 puertas corredizas con espejo. Medidas: 2.40m x 2.60m alto x 0.60m prof.",
      medidas: "2.40 x 2.60 x 0.60",
      materiales: [
        { id: "melamina", cantidad: 8, precio: 45000 },
        { id: "correderas", cantidad: 3, precio: 35000 },
        { id: "herrajes", cantidad: 1, precio: 28000 },
        { id: "vidrio", cantidad: 2, precio: 42000 }
      ],
      manoObra: 180000,
      seña: 150000,
      status: "produccion",
      fechaPedido: "20 ago",
      fechaEntrega: "15 sep",
      factura: null,
      history: [
        { when: "5 sep", text: "Comenzó producción. Corte de placas." },
        { when: "25 ago", text: "Seña recibida $150.000. Materiales pedidos." },
        { when: "22 ago", text: "Presupuesto aprobado." }
      ]
    },
    {
      id: "c2",
      pedido: "PED-2024-042",
      cliente: { nombre: "Consultorio Médico Norte", tel: "11-4444-5678", direccion: "Callao 1200, CABA" },
      tipo: "escritorio",
      descripcion: "Escritorio en L con cajonera y pasacables. Melamina blanca.",
      medidas: "1.60 x 1.40 (L)",
      materiales: [
        { id: "melamina", cantidad: 4, precio: 45000 },
        { id: "herrajes", cantidad: 1, precio: 15000 },
        { id: "tiradores", cantidad: 6, precio: 1800 }
      ],
      manoObra: 85000,
      seña: 100000,
      status: "terminado",
      fechaPedido: "1 sep",
      fechaEntrega: "10 sep",
      factura: null,
      history: [
        { when: "8 sep", text: "Mueble terminado. Listo para entrega." },
        { when: "5 sep", text: "Armado completo." },
        { when: "2 sep", text: "Comenzó producción." }
      ]
    },
    {
      id: "c3",
      pedido: "PED-2024-043",
      cliente: { nombre: "Laura Méndez", tel: "11-3333-9999", direccion: "Belgrano 800, Vicente López" },
      tipo: "cocina",
      descripcion: "Muebles de cocina completos: bajo mesada, alacena y torre para horno/micro.",
      medidas: "3.20m lineales",
      materiales: [
        { id: "melamina", cantidad: 12, precio: 45000 },
        { id: "herrajes", cantidad: 2, precio: 28000 },
        { id: "bisagras", cantidad: 24, precio: 1200 },
        { id: "tiradores", cantidad: 14, precio: 2500 }
      ],
      manoObra: 320000,
      seña: 0,
      status: "presupuestado",
      fechaPedido: "6 sep",
      fechaEntrega: "Pendiente",
      factura: null,
      history: [
        { when: "7 sep", text: "Presupuesto enviado. Esperando aprobación." },
        { when: "6 sep", text: "Visita técnica para medición." }
      ]
    },
    {
      id: "c4",
      pedido: "PED-2024-038",
      cliente: { nombre: "Martín Gómez", tel: "11-2222-7777", direccion: "Monroe 3400, CABA" },
      tipo: "biblioteca",
      descripcion: "Biblioteca pared a pared con escalera. Madera enchapada roble.",
      medidas: "4.50m x 2.80m alto",
      materiales: [
        { id: "mdf", cantidad: 15, precio: 38000 },
        { id: "enchapado", cantidad: 18, precio: 12000 },
        { id: "herrajes", cantidad: 2, precio: 28000 }
      ],
      manoObra: 450000,
      seña: 400000,
      status: "entregado",
      fechaPedido: "1 ago",
      fechaEntrega: "30 ago",
      factura: { tipo: "FA", numero: "0001-00000156", cae: "74185296301234", vto: "10 sep", total: 1306000 },
      history: [
        { when: "30 ago", text: "Entregado e instalado. Cliente conforme." },
        { when: "28 ago", text: "Terminado. Coordinando entrega." },
        { when: "15 ago", text: "Lacado terminado." }
      ]
    },
    {
      id: "c5",
      pedido: "PED-2024-044",
      cliente: { nombre: "Restaurante El Roble", tel: "11-6666-3333", direccion: "Corrientes 5600, CABA" },
      tipo: "mesa",
      descripcion: "6 mesas de madera maciza para salón. 1.20m x 0.80m cada una.",
      medidas: "1.20 x 0.80 x6",
      materiales: [
        { id: "madera", cantidad: 8, precio: 65000 },
        { id: "herrajes", cantidad: 6, precio: 8000 }
      ],
      manoObra: 240000,
      seña: 200000,
      status: "produccion",
      fechaPedido: "28 ago",
      fechaEntrega: "20 sep",
      factura: null,
      history: [
        { when: "6 sep", text: "4 mesas terminadas. Continúan las 2 restantes." },
        { when: "1 sep", text: "Comenzó producción." }
      ]
    },
    {
      id: "c6",
      pedido: "PED-2024-045",
      cliente: { nombre: "Carolina Torres", tel: "11-8888-4444", direccion: "Juncal 2200, CABA" },
      tipo: "vestidor",
      descripcion: "Vestidor completo en habitación. Barras, cajones, zapatero.",
      medidas: "2.80m x 2.40m",
      materiales: [],
      manoObra: 0,
      seña: 0,
      status: "consulta",
      fechaPedido: "8 sep",
      fechaEntrega: "Pendiente",
      factura: null,
      history: [
        { when: "8 sep", text: "Primera consulta. Coordinar visita para medir." }
      ]
    },
    {
      id: "c7",
      pedido: "PED-2024-040",
      cliente: { nombre: "Oficina Contable Sur", tel: "11-7777-2222", direccion: "San Martín 450, Quilmes" },
      tipo: "rack",
      descripcion: "Rack flotante para TV 65\" con panel y luces LED.",
      medidas: "2.00m x 1.20m",
      materiales: [
        { id: "melamina", cantidad: 3, precio: 45000 },
        { id: "mdf", cantidad: 2, precio: 38000 },
        { id: "herrajes", cantidad: 1, precio: 22000 }
      ],
      manoObra: 75000,
      seña: 100000,
      status: "aprobado",
      fechaPedido: "4 sep",
      fechaEntrega: "18 sep",
      factura: null,
      history: [
        { when: "6 sep", text: "Presupuesto aprobado. Seña pendiente." },
        { when: "5 sep", text: "Presupuesto enviado." }
      ]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("carpinteria-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("carpinteria-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("carpinteria-demo-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS_MUEBLE.find((t) => t.id === tipo)?.label || tipo;
}

function matLabel(mat) {
  return MATERIALES.find((m) => m.id === mat)?.label || mat;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function calcMateriales(item) {
  return (item.materiales || []).reduce((sum, m) => sum + (m.precio * m.cantidad), 0);
}

function calcTotal(item) {
  return calcMateriales(item) + (item.manoObra || 0);
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
