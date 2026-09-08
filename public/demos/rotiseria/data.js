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

const SUCURSAL_DEFAULT = {
  nombre: "Rotisería Caballito",
  direccion: "Av. Rivadavia 4500",
  barrio: "Caballito",
  ciudad: "CABA",
  telefono: "011-4555-1234",
  lat: -34.6184,
  lng: -58.4369,
  radioCuadras: 10,
  minimoDelivery: 5000
};

function seedProductos() {
  return [
    { id: "p1", codigo: "POL-01", nombre: "Pollo entero", categoria: "pollos", precio: 12500, produccionDia: 15, vendidos: 8, stock: 7, imagen: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop" },
    { id: "p2", codigo: "POL-02", nombre: "Medio pollo", categoria: "pollos", precio: 6800, produccionDia: 20, vendidos: 12, stock: 8, imagen: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=600&fit=crop" },
    { id: "p3", codigo: "POL-03", nombre: "Cuarto de pollo", categoria: "pollos", precio: 3800, produccionDia: 30, vendidos: 18, stock: 12, imagen: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop" },
    { id: "p4", codigo: "EMP-01", nombre: "Empanada carne", categoria: "empanadas", precio: 1200, produccionDia: 60, vendidos: 35, stock: 25, imagen: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop" },
    { id: "p5", codigo: "EMP-02", nombre: "Empanada jamón y queso", categoria: "empanadas", precio: 1200, produccionDia: 48, vendidos: 28, stock: 20, imagen: "https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "p6", codigo: "EMP-03", nombre: "Empanada pollo", categoria: "empanadas", precio: 1200, produccionDia: 36, vendidos: 22, stock: 14, imagen: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "p7", codigo: "EMP-04", nombre: "Empanada verdura", categoria: "empanadas", precio: 1100, produccionDia: 24, vendidos: 10, stock: 14, imagen: "https://images.pexels.com/photos/5639411/pexels-photo-5639411.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { id: "p8", codigo: "MIL-01", nombre: "Milanesa de carne", categoria: "milanesas", precio: 4500, produccionDia: 20, vendidos: 12, stock: 8, imagen: "https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&h=600&fit=crop" },
    { id: "p9", codigo: "MIL-02", nombre: "Milanesa de pollo", categoria: "milanesas", precio: 4200, produccionDia: 15, vendidos: 9, stock: 6, imagen: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&h=600&fit=crop" },
    { id: "p10", codigo: "MIL-03", nombre: "Suprema napolitana", categoria: "milanesas", precio: 6500, produccionDia: 10, vendidos: 7, stock: 3, imagen: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop" },
    { id: "p11", codigo: "TAR-01", nombre: "Tarta de jamón y queso", categoria: "tartas", precio: 8500, produccionDia: 6, vendidos: 4, stock: 2, imagen: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&h=600&fit=crop" },
    { id: "p12", codigo: "TAR-02", nombre: "Pizza muzzarella", categoria: "tartas", precio: 7500, produccionDia: 8, vendidos: 5, stock: 3, imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop" },
    { id: "p13", codigo: "GUA-01", nombre: "Papas fritas (porción)", categoria: "guarniciones", precio: 3200, produccionDia: 0, vendidos: 15, stock: 999, imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" },
    { id: "p14", codigo: "GUA-02", nombre: "Ensalada rusa", categoria: "guarniciones", precio: 2800, produccionDia: 5, vendidos: 3, stock: 2, imagen: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop" },
    { id: "p15", codigo: "BEB-01", nombre: "Gaseosa 1.5L", categoria: "bebidas", precio: 2500, produccionDia: 0, vendidos: 8, stock: 20, imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=600&fit=crop" },
    { id: "p16", codigo: "BEB-02", nombre: "Agua mineral", categoria: "bebidas", precio: 1200, produccionDia: 0, vendidos: 5, stock: 15, imagen: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=600&fit=crop" }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      numero: "PED-001",
      tipo: "delivery",
      cliente: { nombre: "Juan Pérez", tel: "11-5555-1234", direccion: "Hidalgo 850, Caballito" },
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
      cliente: { nombre: "Carlos Rodríguez", tel: "11-4444-5678", direccion: "Av. Acoyte 500, Caballito" },
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
let sucursal = null;

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota */
  }
}

function loadProductos() {
  if (productos) return productos;
  const seed = seedProductos();
  const parsed = readJson("rotiseria-productos-v1");
  if (!Array.isArray(parsed)) {
    productos = seed;
    writeJson("rotiseria-productos-v1", productos);
    return productos;
  }
  productos = parsed;
  const seedById = Object.fromEntries(seed.map((p) => [p.id, p]));
  let changed = false;
  productos.forEach((p) => {
    if (!p.imagen && seedById[p.id]?.imagen) {
      p.imagen = seedById[p.id].imagen;
      changed = true;
    }
  });
  if (changed) saveProductos();
  return productos;
}

function loadPedidos() {
  if (pedidos) return pedidos;
  const parsed = readJson("rotiseria-pedidos-v1");
  if (!Array.isArray(parsed)) {
    pedidos = seedPedidos();
    writeJson("rotiseria-pedidos-v1", pedidos);
    return pedidos;
  }
  return pedidos = parsed;
}

function loadIngredientes() {
  if (ingredientes) return ingredientes;
  const parsed = readJson("rotiseria-ingredientes-v1");
  if (!Array.isArray(parsed)) {
    ingredientes = seedIngredientes();
    writeJson("rotiseria-ingredientes-v1", ingredientes);
    return ingredientes;
  }
  return ingredientes = parsed;
}

function saveProductos(list) {
  if (Array.isArray(list)) productos = list;
  writeJson("rotiseria-productos-v1", productos);
}
function savePedidos(list) {
  if (Array.isArray(list)) pedidos = list;
  writeJson("rotiseria-pedidos-v1", pedidos);
}
function saveIngredientes(list) {
  if (Array.isArray(list)) ingredientes = list;
  writeJson("rotiseria-ingredientes-v1", ingredientes);
}

function loadSucursal() {
  if (sucursal) return sucursal;
  const parsed = readJson("rotiseria-sucursal-v1");
  sucursal = parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? { ...SUCURSAL_DEFAULT, ...parsed }
    : { ...SUCURSAL_DEFAULT };
  if (!parsed) writeJson("rotiseria-sucursal-v1", sucursal);
  return sucursal;
}

function saveSucursal() {
  writeJson("rotiseria-sucursal-v1", sucursal);
}

function direccionCompleta(s = loadSucursal()) {
  return `${s.direccion}, ${s.barrio}, ${s.ciudad}`;
}

function zonaEntregaTexto(s = loadSucursal()) {
  return `Radio ${s.radioCuadras} cuadras desde ${s.barrio} · mínimo ${money(s.minimoDelivery)} · envío gratis`;
}

function mapaEmbedUrl(s = loadSucursal()) {
  const lat = Number(s.lat);
  const lng = Number(s.lng);
  const padLng = 0.012;
  const padLat = 0.008;
  const bbox = `${lng - padLng},${lat - padLat},${lng + padLng},${lat + padLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function fotoProducto(p) {
  return p?.imagen || "";
}

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
