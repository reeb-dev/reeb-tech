const STORAGE_TRABAJOS = "carpinteria-trabajos-v2";
const STORAGE_PEDIDOS = "carpinteria-pedidos-v2";

const LOCAL = {
  nombre: "Carpintería El Quebracho",
  slogan: "Muebles a medida · Villa Devoto",
  direccion: "Av. San Martín 3456",
  barrio: "Villa Devoto, CABA",
  horarios: [
    "Lunes a viernes: 8 a 18",
    "Sábados: 8 a 13",
    "Domingo: cerrado"
  ],
  telefono: "011-4555-3480",
  whatsapp: "5492915757934"
};

const STATUSES = [
  { id: "consulta", label: "Consulta" },
  { id: "en_taller", label: "En taller" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Entregado" }
];

const TIPOS_MUEBLE = [
  { id: "mesa", label: "Mesa" },
  { id: "placard", label: "Placard" },
  { id: "cocina", label: "Cocina" },
  { id: "deck", label: "Deck" },
  { id: "silla", label: "Silla" },
  { id: "restauracion", label: "Restauración" },
  { id: "escritorio", label: "Escritorio" },
  { id: "vestidor", label: "Vestidor" },
  { id: "otro", label: "Otro" }
];

const IMAGEN_TIPO = {
  mesa: "img/mesa.jpg",
  placard: "img/placard.jpg",
  cocina: "img/cocina.jpg",
  deck: "img/deck.jpg",
  silla: "img/silla.jpg",
  restauracion: "img/restauracion.jpg",
  escritorio: "img/escritorio.jpg",
  vestidor: "img/vestidor.jpg",
  otro: "img/hero-taller.jpg"
};

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

const SERVICIOS = [
  {
    id: "medida",
    titulo: "Muebles a medida",
    descripcion: "Mesas, escritorios, sillas y bibliotecas según el espacio. Medimos en casa y entregamos instalado.",
    precioDesde: 180000,
    imagen: "img/mesa.jpg"
  },
  {
    id: "restauracion",
    titulo: "Restauración",
    descripcion: "Lijado, reparación de juntas, tinte y laca. Devolvemos el mueble sin cambiarle el carácter.",
    precioDesde: 45000,
    imagen: "img/restauracion.jpg"
  },
  {
    id: "cocina",
    titulo: "Cocina integral",
    descripcion: "Bajo mesada, alacenas y torres para horno. Melamina o enchapado, herrajes de corredera suave.",
    precioDesde: 850000,
    imagen: "img/cocina.jpg"
  },
  {
    id: "placares",
    titulo: "Placares y vestidores",
    descripcion: "Frente corredizo o abatible, interiores con cajones, barras y zapatero. Espejo opcional.",
    precioDesde: 320000,
    imagen: "img/placard.jpg"
  }
];

function seedTrabajos() {
  return [
    {
      id: "tr-mesa",
      titulo: "Mesa de comedor paraíso",
      tipo: "mesa",
      descripcion: "Mesa de 6 puestos para un PH en Villa Devoto. Tapa de paraíso de 4 cm y patas de hierro negro mate.",
      materiales: "Paraíso macizo, aceite de tung, patas de hierro",
      plazo: "3 semanas",
      precio: 420000,
      medidas: "1.80 × 0.90 m",
      imagen: "img/mesa.jpg",
      publicado: true
    },
    {
      id: "tr-placard",
      titulo: "Placard de tres cuerpos",
      tipo: "placard",
      descripcion: "Placard de dormitorio en madera enchapada, tres puertas y cajonera interna. Acabado brillante a muñeca.",
      materiales: "MDF enchapado caoba, bisagras y cerraduras",
      plazo: "4 semanas",
      precio: 680000,
      medidas: "2.40 × 2.20 × 0.58 m",
      imagen: "img/placard.jpg",
      publicado: true
    },
    {
      id: "tr-cocina",
      titulo: "Cocina integral blanca",
      tipo: "cocina",
      descripcion: "Cocina en U con isla, cajones de extracción total y torre para horno y microondas. Instalación en un día.",
      materiales: "Melamina blanca, herrajes Blum, mesada de cuarzo (cliente)",
      plazo: "6 semanas",
      precio: 1850000,
      medidas: "4.80 m lineales + isla",
      imagen: "img/cocina.jpg",
      publicado: true
    },
    {
      id: "tr-deck",
      titulo: "Deck de lapacho",
      tipo: "deck",
      descripcion: "Deck perimetral de pileta en Costa Esmeralda. Tablas de lapacho con tornillería oculta y escalón de acceso.",
      materiales: "Lapacho, clips inox, aceite hidrorrepelente",
      plazo: "2 semanas",
      precio: 980000,
      medidas: "28 m²",
      imagen: "img/deck.jpg",
      publicado: true
    },
    {
      id: "tr-silla",
      titulo: "Banquetas de fresno",
      tipo: "silla",
      descripcion: "Juego de cuatro banquetas altas para barra de cocina. Asiento con recorte para llevar y travesaños de apoyo.",
      materiales: "Fresno macizo, laca mate",
      plazo: "10 días",
      precio: 196000,
      medidas: "Asiento 32 × 32 cm · alto 75 cm",
      imagen: "img/silla.jpg",
      publicado: true
    },
    {
      id: "tr-escritorio",
      titulo: "Escritorio en bloque",
      tipo: "escritorio",
      descripcion: "Escritorio de home office con panel lateral y pasacables. Melamina roble claro a medida del rincón.",
      materiales: "Melamina roble, canto ABS, herrajes",
      plazo: "2 semanas",
      precio: 245000,
      medidas: "1.40 × 0.65 × 0.75 m",
      imagen: "img/escritorio.jpg",
      publicado: true
    },
    {
      id: "tr-resto",
      titulo: "Restauración y laca",
      tipo: "restauracion",
      descripcion: "Lijado, masillado y nueva laca sobre un escritorio de los 60. El cliente eligió un color petróleo sobre la tapa.",
      materiales: "Masilla para madera, tinte, laca poliuretánica",
      plazo: "12 días",
      precio: 78000,
      medidas: "Pieza única",
      imagen: "img/restauracion.jpg",
      publicado: true
    }
  ];
}

function seedPedidos() {
  return [
    {
      id: "c1",
      pedido: "PED-2026-041",
      cliente: { nombre: "Familia Rodríguez", tel: "11-5555-1234", direccion: "Av. Rivadavia 4500, CABA" },
      tipo: "placard",
      descripcion: "Placard 3 puertas corredizas con espejo. Medición hecha en Villa Urquiza.",
      medidas: "2.40 × 2.60 × 0.60",
      materiales: [
        { id: "melamina", cantidad: 8, precio: 45000 },
        { id: "correderas", cantidad: 3, precio: 35000 },
        { id: "herrajes", cantidad: 1, precio: 28000 },
        { id: "vidrio", cantidad: 2, precio: 42000 }
      ],
      manoObra: 180000,
      seña: 150000,
      status: "en_taller",
      fechaPedido: "20 ago",
      fechaEntrega: "15 sep",
      imagen: "img/placard.jpg",
      factura: null,
      history: [
        { when: "5 sep", text: "En taller: corte de placas." },
        { when: "25 ago", text: "Seña recibida $150.000. Materiales pedidos." },
        { when: "22 ago", text: "Presupuesto aprobado." }
      ]
    },
    {
      id: "c2",
      pedido: "PED-2026-042",
      cliente: { nombre: "Consultorio Médico Norte", tel: "11-4444-5678", direccion: "Callao 1200, CABA" },
      tipo: "escritorio",
      descripcion: "Escritorio en L con cajonera y pasacables. Melamina blanca.",
      medidas: "1.60 × 1.40 (L)",
      materiales: [
        { id: "melamina", cantidad: 4, precio: 45000 },
        { id: "herrajes", cantidad: 1, precio: 15000 },
        { id: "tiradores", cantidad: 6, precio: 1800 }
      ],
      manoObra: 85000,
      seña: 100000,
      status: "listo",
      fechaPedido: "1 sep",
      fechaEntrega: "10 sep",
      imagen: "img/escritorio.jpg",
      factura: null,
      history: [
        { when: "8 sep", text: "Listo para entrega e instalación." },
        { when: "5 sep", text: "Armado completo." },
        { when: "2 sep", text: "Ingresó al taller." }
      ]
    },
    {
      id: "c3",
      pedido: "PED-2026-043",
      cliente: { nombre: "Laura Méndez", tel: "11-3333-9999", direccion: "Belgrano 800, Vicente López" },
      tipo: "cocina",
      descripcion: "Muebles de cocina: bajo mesada, alacena y torre para horno/micro.",
      medidas: "3.20 m lineales",
      materiales: [
        { id: "melamina", cantidad: 12, precio: 45000 },
        { id: "herrajes", cantidad: 2, precio: 28000 },
        { id: "bisagras", cantidad: 24, precio: 1200 },
        { id: "tiradores", cantidad: 14, precio: 2500 }
      ],
      manoObra: 320000,
      seña: 0,
      status: "consulta",
      fechaPedido: "6 sep",
      fechaEntrega: "Pendiente",
      imagen: "img/cocina.jpg",
      factura: null,
      history: [
        { when: "7 sep", text: "Presupuesto enviado. Esperando visita de confirmación." },
        { when: "6 sep", text: "Consulta: visita técnica para medición." }
      ]
    },
    {
      id: "c4",
      pedido: "PED-2026-038",
      cliente: { nombre: "Martín Gómez", tel: "11-2222-7777", direccion: "Monroe 3400, CABA" },
      tipo: "mesa",
      descripcion: "Mesa de comedor de paraíso para 6 personas.",
      medidas: "1.80 × 0.90",
      materiales: [
        { id: "madera", cantidad: 4, precio: 65000 },
        { id: "herrajes", cantidad: 1, precio: 18000 }
      ],
      manoObra: 160000,
      seña: 200000,
      status: "entregado",
      fechaPedido: "1 ago",
      fechaEntrega: "30 ago",
      imagen: "img/mesa.jpg",
      factura: { tipo: "FA", numero: "0001-00000156", cae: "74185296301234", vto: "10 sep", total: 438000 },
      history: [
        { when: "30 ago", text: "Entregada e instalada. Cliente conforme." },
        { when: "28 ago", text: "Terminada. Coordinando entrega." },
        { when: "15 ago", text: "Aceite de tung aplicado." }
      ]
    },
    {
      id: "c5",
      pedido: "PED-2026-044",
      cliente: { nombre: "Restaurante El Roble", tel: "11-6666-3333", direccion: "Corrientes 5600, CABA" },
      tipo: "silla",
      descripcion: "12 banquetas de fresno para barra del salón.",
      medidas: "75 cm alto × 12 u.",
      materiales: [
        { id: "madera", cantidad: 6, precio: 65000 },
        { id: "herrajes", cantidad: 12, precio: 4000 }
      ],
      manoObra: 180000,
      seña: 200000,
      status: "en_taller",
      fechaPedido: "28 ago",
      fechaEntrega: "20 sep",
      imagen: "img/silla.jpg",
      factura: null,
      history: [
        { when: "6 sep", text: "8 banquetas listas. Faltan 4." },
        { when: "1 sep", text: "Ingresó al taller." }
      ]
    },
    {
      id: "c6",
      pedido: "PED-2026-045",
      cliente: { nombre: "Carolina Torres", tel: "11-8888-4444", direccion: "Juncal 2200, CABA" },
      tipo: "deck",
      descripcion: "Deck de lapacho para patio. Consulta por 20 m².",
      medidas: "20 m²",
      materiales: [],
      manoObra: 0,
      seña: 0,
      status: "consulta",
      fechaPedido: "8 sep",
      fechaEntrega: "Pendiente",
      imagen: "img/deck.jpg",
      factura: null,
      history: [
        { when: "8 sep", text: "Consulta por WhatsApp. Coordinar visita para medir." }
      ]
    },
    {
      id: "c7",
      pedido: "PED-2026-040",
      cliente: { nombre: "Oficina Contable Sur", tel: "11-7777-2222", direccion: "San Martín 450, Quilmes" },
      tipo: "restauracion",
      descripcion: "Restauración de mesa de reunión de los 80. Lijado y laca.",
      medidas: "2.40 × 1.10",
      materiales: [
        { id: "madera", cantidad: 1, precio: 22000 }
      ],
      manoObra: 65000,
      seña: 40000,
      status: "listo",
      fechaPedido: "4 sep",
      fechaEntrega: "12 sep",
      imagen: "img/restauracion.jpg",
      factura: null,
      history: [
        { when: "8 sep", text: "Laca curada. Lista para retirar." },
        { when: "5 sep", text: "Lijado terminado." }
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

function loadTrabajos() {
  return loadList(STORAGE_TRABAJOS, seedTrabajos);
}

function saveTrabajos(items) {
  localStorage.setItem(STORAGE_TRABAJOS, JSON.stringify(items));
}

function loadPedidos() {
  return loadList(STORAGE_PEDIDOS, seedPedidos).map(normalizePedido);
}

function savePedidos(items) {
  localStorage.setItem(STORAGE_PEDIDOS, JSON.stringify(items));
}

function normalizePedido(item) {
  const map = {
    presupuestado: "consulta",
    aprobado: "en_taller",
    produccion: "en_taller",
    terminado: "listo"
  };
  return {
    ...item,
    status: map[item.status] || item.status,
    imagen: item.imagen || IMAGEN_TIPO[item.tipo] || IMAGEN_TIPO.otro
  };
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

function imagenDeTipo(tipo) {
  return IMAGEN_TIPO[tipo] || IMAGEN_TIPO.otro;
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
