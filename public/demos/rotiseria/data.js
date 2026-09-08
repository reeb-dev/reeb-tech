const STATUSES_PEDIDO = [
  { id: "pendiente", label: "Pendiente" },
  { id: "preparando", label: "Preparando" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Entregado" },
  { id: "cancelado", label: "Cancelado" }
];

const TIPOS_ENTREGA = [
  { id: "mostrador", label: "Mostrador" },
  { id: "delivery", label: "Delivery" }
];

const CATEGORIAS = [
  { id: "pollos", label: "Pollos" },
  { id: "empanadas", label: "Empanadas" },
  { id: "milanesas", label: "Milanesas" },
  { id: "tartas", label: "Tartas y pizzas" },
  { id: "guarniciones", label: "Guarniciones" },
  { id: "bebidas", label: "Bebidas" },
  { id: "postres", label: "Postres" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

function seedProductos() {
  return [
    { id: "p1", codigo: "POL-01", nombre: "Pollo entero", categoria: "pollos", precio: 12500, produccionDia: 15, vendidos: 8, stock: 7 },
    { id: "p2", codigo: "POL-02", nombre: "Medio pollo", categoria: "pollos", precio: 6800, produccionDia: 20, vendidos: 12, stock: 8 },
    { id: "p3", codigo: "POL-03", nombre: "Cuarto de pollo", categoria: "pollos", precio: 3800, produccionDia: 30, vendidos: 18, stock: 12 },
    { id: "p4", codigo: "EMP-01", nombre: "Empanada carne", categoria: "empanadas", precio: 1200, produccionDia: 60, vendidos: 35, stock: 25 },
    { id: "p5", codigo: "EMP-02", nombre: "Empanada jamón y queso", categoria: "empanadas", precio: 1200, produccionDia: 48, vendidos: 28, stock: 20 },
    { id: "p6", codigo: "EMP-03", nombre: "Empanada pollo", categoria: "empanadas", precio: 1200, produccionDia: 36, vendidos: 22, stock: 14 },
    { id: "p7", codigo: "EMP-04", nombre: "Empanada verdura", categoria: "empanadas", precio: 1100, produccionDia: 24, vendidos: 10, stock: 14 },
    { id: "p8", codigo: "MIL-01", nombre: "Milanesa de carne", categoria: "milanesas", precio: 4500, produccionDia: 20, vendidos: 12, stock: 8 },
    { id: "p9", codigo: "MIL-02", nombre: "Milanesa de pollo", categoria: "milanesas", precio: 4200, produccionDia: 15, vendidos: 9, stock: 6 },
    { id: "p10", codigo: "MIL-03", nombre: "Suprema napolitana", categoria: "milanesas", precio: 6500, produccionDia: 10, vendidos: 7, stock: 3 },
    { id: "p11", codigo: "TAR-01", nombre: "Tarta de jamón y queso", categoria: "tartas", precio: 8500, produccionDia: 6, vendidos: 4, stock: 2 },
    { id: "p12", codigo: "TAR-02", nombre: "Pizza muzzarella", categoria: "tartas", precio: 7500, produccionDia: 8, vendidos: 5, stock: 3 },
    { id: "p13", codigo: "GUA-01", nombre: "Papas fritas (porción)", categoria: "guarniciones", precio: 3200, produccionDia: 0, vendidos: 15, stock: 999 },
    { id: "p14", codigo: "GUA-02", nombre: "Ensalada rusa", categoria: "guarniciones", precio: 2800, produccionDia: 5, vendidos: 3, stock: 2 },
    { id: "p15", codigo: "BEB-01", nombre: "Gaseosa 1.5L", categoria: "bebidas", precio: 2500, produccionDia: 0, vendidos: 8, stock: 20 },
    { id: "p16", codigo: "BEB-02", nombre: "Agua mineral", categoria: "bebidas", precio: 1200, produccionDia: 0, vendidos: 5, stock: 15 }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      numero: "PED-001",
      tipo: "delivery",
      cliente: { nombre: "Juan Pérez", tel: "11-5555-1234", direccion: "Av. Rivadavia 4500" },
      items: [
        { producto: "p1", cantidad: 1, precio: 12500 },
        { producto: "p4", cantidad: 6, precio: 1200 },
        { producto: "p15", cantidad: 1, precio: 2500 }
      ],
      hora: "12:30",
      status: "preparando",
      factura: null,
      notas: "Sin sal en el pollo"
    },
    {
      id: "ped2",
      numero: "PED-002",
      tipo: "mostrador",
      cliente: { nombre: "María García", tel: "", direccion: "" },
      items: [
        { producto: "p2", cantidad: 2, precio: 6800 },
        { producto: "p13", cantidad: 2, precio: 3200 }
      ],
      hora: "12:45",
      status: "listo",
      factura: null,
      notas: ""
    },
    {
      id: "ped3",
      numero: "PED-003",
      tipo: "delivery",
      cliente: { nombre: "Carlos Rodríguez", tel: "11-4444-5678", direccion: "Belgrano 1200, 3ro B" },
      items: [
        { producto: "p8", cantidad: 4, precio: 4500 },
        { producto: "p5", cantidad: 12, precio: 1200 },
        { producto: "p15", cantidad: 2, precio: 2500 }
      ],
      hora: "13:00",
      status: "pendiente",
      factura: null,
      notas: "Llamar al llegar"
    },
    {
      id: "ped4",
      numero: "PED-004",
      tipo: "mostrador",
      cliente: { nombre: "Ana Martínez", tel: "", direccion: "" },
      items: [
        { producto: "p4", cantidad: 12, precio: 1200 }
      ],
      hora: "11:30",
      status: "entregado",
      factura: { tipo: "TK", numero: "0001-00008850", cae: "74185296301234", vto: "18 sep", total: 14400 },
      notas: ""
    },
    {
      id: "ped5",
      numero: "PED-005",
      tipo: "mostrador",
      cliente: { nombre: "Roberto Fernández", tel: "", direccion: "" },
      items: [
        { producto: "p10", cantidad: 2, precio: 6500 },
        { producto: "p12", cantidad: 1, precio: 7500 }
      ],
      hora: "12:15",
      status: "entregado",
      factura: { tipo: "FB", numero: "0002-00000125", cae: "74185296301235", vto: "18 sep", total: 20500 },
      notas: ""
    }
  ];
}

function seedIngredientes() {
  return [
    { id: "i1", nombre: "Pollo entero crudo", unidad: "unidad", stock: 25, minimo: 15, costo: 5500 },
    { id: "i2", nombre: "Carne picada", unidad: "kg", stock: 8, minimo: 5, costo: 6500 },
    { id: "i3", nombre: "Tapas empanadas", unidad: "docena", stock: 12, minimo: 8, costo: 1800 },
    { id: "i4", nombre: "Jamón cocido", unidad: "kg", stock: 3, minimo: 2, costo: 8500 },
    { id: "i5", nombre: "Queso muzzarella", unidad: "kg", stock: 4, minimo: 3, costo: 9200 },
    { id: "i6", nombre: "Milanesas crudas", unidad: "kg", stock: 6, minimo: 4, costo: 7800 },
    { id: "i7", nombre: "Pan rallado", unidad: "kg", stock: 2, minimo: 1, costo: 2500 },
    { id: "i8", nombre: "Papas", unidad: "kg", stock: 15, minimo: 10, costo: 1200 },
    { id: "i9", nombre: "Aceite girasol", unidad: "litro", stock: 8, minimo: 5, costo: 2800 }
  ];
}

let productos = null;
let pedidos = null;
let ingredientes = null;

function loadProductos() {
  if (productos) return productos;
  const raw = localStorage.getItem("rotiseria-productos-v1");
  if (!raw) { productos = seedProductos(); localStorage.setItem("rotiseria-productos-v1", JSON.stringify(productos)); return productos; }
  return productos = JSON.parse(raw);
}

function loadPedidos() {
  if (pedidos) return pedidos;
  const raw = localStorage.getItem("rotiseria-pedidos-v1");
  if (!raw) { pedidos = seedPedidos(); localStorage.setItem("rotiseria-pedidos-v1", JSON.stringify(pedidos)); return pedidos; }
  return pedidos = JSON.parse(raw);
}

function loadIngredientes() {
  if (ingredientes) return ingredientes;
  const raw = localStorage.getItem("rotiseria-ingredientes-v1");
  if (!raw) { ingredientes = seedIngredientes(); localStorage.setItem("rotiseria-ingredientes-v1", JSON.stringify(ingredientes)); return ingredientes; }
  return ingredientes = JSON.parse(raw);
}

function saveProductos() { localStorage.setItem("rotiseria-productos-v1", JSON.stringify(productos)); }
function savePedidos() { localStorage.setItem("rotiseria-pedidos-v1", JSON.stringify(pedidos)); }
function saveIngredientes() { localStorage.setItem("rotiseria-ingredientes-v1", JSON.stringify(ingredientes)); }

function labelPedido(status) { return STATUSES_PEDIDO.find((s) => s.id === status)?.label || status; }
function tipoLabel(tipo) { return TIPOS_ENTREGA.find((t) => t.id === tipo)?.label || tipo; }
function catLabel(cat) { return CATEGORIAS.find((c) => c.id === cat)?.label || cat; }
function compLabel(comp) { return COMPROBANTES.find((c) => c.id === comp)?.label || comp; }

function getProducto(id) { return loadProductos().find((p) => p.id === id); }

function calcTotalPedido(pedido) {
  return (pedido.items || []).reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function money(amount) { return "$ " + Number(amount || 0).toLocaleString("es-AR"); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
