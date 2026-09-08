const STATUSES = [
  { id: "stock", label: "En stock" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" },
  { id: "pedido", label: "Pedido especial" }
];

const CATEGORIAS = [
  { id: "libros", label: "Libros" },
  { id: "utiles", label: "Útiles escolares" },
  { id: "papeleria", label: "Papelería" },
  { id: "arte", label: "Arte y manualidades" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "juegos", label: "Juegos y rompecabezas" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" },
  { id: "RE", label: "Remito" }
];

function seed() {
  return [
    {
      id: "lib1",
      codigo: "LIB-001",
      nombre: "Cien años de soledad - García Márquez",
      categoria: "libros",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      isbn: "978-950-07-0001-0",
      precio: 18500,
      costo: 12000,
      stock: 8,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición: +10 unidades" }]
    },
    {
      id: "lib2",
      codigo: "LIB-002",
      nombre: "El Aleph - Borges",
      categoria: "libros",
      autor: "Jorge Luis Borges",
      editorial: "Emecé",
      isbn: "978-950-04-0002-1",
      precio: 16800,
      costo: 11000,
      stock: 2,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      status: "bajo",
      history: [{ when: "6 sep", text: "Stock bajo. Pedir reposición." }]
    },
    {
      id: "lib3",
      codigo: "UTI-015",
      nombre: "Cuaderno A4 rayado 84 hojas",
      categoria: "utiles",
      autor: "",
      editorial: "Rivadavia",
      isbn: "",
      precio: 3200,
      costo: 2100,
      stock: 45,
      minimo: 20,
      proveedor: "Papelera Central",
      status: "stock",
      history: [{ when: "1 sep", text: "Stock para temporada escolar" }]
    },
    {
      id: "lib4",
      codigo: "UTI-022",
      nombre: "Set de lápices de colores x24",
      categoria: "utiles",
      autor: "",
      editorial: "Faber-Castell",
      isbn: "",
      precio: 8500,
      costo: 5800,
      stock: 0,
      minimo: 10,
      proveedor: "Arte & Diseño",
      status: "agotado",
      history: [{ when: "7 sep", text: "Agotado. Pedido en camino." }]
    },
    {
      id: "lib5",
      codigo: "PAP-008",
      nombre: "Resma A4 80g 500 hojas",
      categoria: "papeleria",
      autor: "",
      editorial: "Ledesma",
      isbn: "",
      precio: 8200,
      costo: 5500,
      stock: 30,
      minimo: 15,
      proveedor: "Papelera Central",
      status: "stock",
      history: [{ when: "3 sep", text: "Stock actualizado" }]
    },
    {
      id: "lib6",
      codigo: "LIB-ESP-001",
      nombre: "Manual de Derecho Civil (pedido especial)",
      categoria: "libros",
      autor: "Varios",
      editorial: "La Ley",
      isbn: "978-987-03-0055-2",
      precio: 45000,
      costo: 32000,
      stock: 0,
      minimo: 0,
      proveedor: "Pedido directo editorial",
      status: "pedido",
      pedidoEspecial: { cliente: "Dr. Fernández", tel: "11-4444-5555", fechaPedido: "4 sep", seña: 20000 },
      history: [
        { when: "6 sep", text: "Editorial confirma envío para el 12 sep." },
        { when: "4 sep", text: "Pedido especial. Seña recibida $20.000." }
      ]
    },
    {
      id: "lib7",
      codigo: "ART-012",
      nombre: "Set acrílicos x12 colores",
      categoria: "arte",
      autor: "",
      editorial: "Alba",
      isbn: "",
      precio: 15800,
      costo: 10500,
      stock: 6,
      minimo: 4,
      proveedor: "Arte & Diseño",
      status: "stock",
      history: [{ when: "2 sep", text: "Nueva línea de arte" }]
    },
    {
      id: "lib8",
      codigo: "TEC-005",
      nombre: "Calculadora científica",
      categoria: "tecnologia",
      autor: "",
      editorial: "Casio",
      isbn: "",
      precio: 28500,
      costo: 19000,
      stock: 4,
      minimo: 3,
      proveedor: "Tech Importaciones",
      status: "stock",
      history: [{ when: "28 ago", text: "Llegada de mercadería" }]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("libreria-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("libreria-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("libreria-demo-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function stockStatus(item) {
  if (item.status === "pedido") return "pedido";
  if (item.stock === 0) return "agotado";
  if (item.stock < item.minimo) return "bajo";
  return "stock";
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
