const STATUSES_MESA = [
  { id: "libre", label: "Libre" },
  { id: "ocupada", label: "Ocupada" },
  { id: "reservada", label: "Reservada" },
  { id: "cuenta", label: "Pidió cuenta" }
];

const STATUSES_PEDIDO = [
  { id: "pendiente", label: "Pendiente" },
  { id: "preparando", label: "Preparando" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Entregado" }
];

const CATEGORIAS = [
  { id: "entrada", label: "Entradas" },
  { id: "principal", label: "Platos principales" },
  { id: "guarnicion", label: "Guarniciones" },
  { id: "postre", label: "Postres" },
  { id: "bebida", label: "Bebidas" },
  { id: "menu", label: "Menú del día" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

function seedMenu() {
  return [
    { id: "m1", codigo: "ENT-01", nombre: "Empanadas x3", categoria: "entrada", precio: 4500, disponible: true },
    { id: "m2", codigo: "ENT-02", nombre: "Provoleta", categoria: "entrada", precio: 6800, disponible: true },
    { id: "m3", codigo: "ENT-03", nombre: "Tabla de fiambres", categoria: "entrada", precio: 12500, disponible: true },
    { id: "m4", codigo: "PRI-01", nombre: "Bife de chorizo", categoria: "principal", precio: 18500, disponible: true },
    { id: "m5", codigo: "PRI-02", nombre: "Milanesa napolitana", categoria: "principal", precio: 14800, disponible: true },
    { id: "m6", codigo: "PRI-03", nombre: "Pollo al verdeo", categoria: "principal", precio: 12500, disponible: true },
    { id: "m7", codigo: "PRI-04", nombre: "Ravioles caseros", categoria: "principal", precio: 11800, disponible: true },
    { id: "m8", codigo: "PRI-05", nombre: "Salmón grillé", categoria: "principal", precio: 22000, disponible: false },
    { id: "m9", codigo: "GUA-01", nombre: "Papas fritas", categoria: "guarnicion", precio: 4200, disponible: true },
    { id: "m10", codigo: "GUA-02", nombre: "Ensalada mixta", categoria: "guarnicion", precio: 3800, disponible: true },
    { id: "m11", codigo: "POS-01", nombre: "Flan con dulce de leche", categoria: "postre", precio: 5500, disponible: true },
    { id: "m12", codigo: "POS-02", nombre: "Tiramisú", categoria: "postre", precio: 6800, disponible: true },
    { id: "m13", codigo: "BEB-01", nombre: "Agua mineral 500ml", categoria: "bebida", precio: 1800, disponible: true },
    { id: "m14", codigo: "BEB-02", nombre: "Gaseosa línea", categoria: "bebida", precio: 2500, disponible: true },
    { id: "m15", codigo: "BEB-03", nombre: "Vino de la casa (copa)", categoria: "bebida", precio: 4500, disponible: true },
    { id: "m16", codigo: "MEN-01", nombre: "Menú ejecutivo", categoria: "menu", precio: 15800, disponible: true, descripcion: "Entrada + principal + bebida" }
  ];
}

function seedMesas() {
  return [
    { id: "mesa1", numero: 1, capacidad: 2, status: "ocupada", mozo: "Carlos" },
    { id: "mesa2", numero: 2, capacidad: 4, status: "libre", mozo: null },
    { id: "mesa3", numero: 3, capacidad: 4, status: "ocupada", mozo: "María" },
    { id: "mesa4", numero: 4, capacidad: 6, status: "reservada", mozo: null, reserva: { nombre: "Familia López", hora: "21:00", personas: 5 } },
    { id: "mesa5", numero: 5, capacidad: 2, status: "cuenta", mozo: "Carlos" },
    { id: "mesa6", numero: 6, capacidad: 8, status: "libre", mozo: null },
    { id: "mesa7", numero: 7, capacidad: 4, status: "ocupada", mozo: "María" },
    { id: "mesa8", numero: 8, capacidad: 2, status: "libre", mozo: null }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      mesa: "mesa1",
      items: [
        { menu: "m2", cantidad: 1, status: "entregado", nota: "" },
        { menu: "m4", cantidad: 1, status: "preparando", nota: "A punto" },
        { menu: "m9", cantidad: 1, status: "preparando", nota: "" },
        { menu: "m15", cantidad: 2, status: "entregado", nota: "" }
      ],
      horaApertura: "20:15",
      mozo: "Carlos",
      factura: null
    },
    {
      id: "ped2",
      mesa: "mesa3",
      items: [
        { menu: "m1", cantidad: 2, status: "entregado", nota: "" },
        { menu: "m5", cantidad: 2, status: "listo", nota: "Una sin jamón" },
        { menu: "m10", cantidad: 2, status: "listo", nota: "" },
        { menu: "m14", cantidad: 3, status: "entregado", nota: "" }
      ],
      horaApertura: "20:30",
      mozo: "María",
      factura: null
    },
    {
      id: "ped3",
      mesa: "mesa5",
      items: [
        { menu: "m16", cantidad: 2, status: "entregado", nota: "" },
        { menu: "m11", cantidad: 2, status: "entregado", nota: "" }
      ],
      horaApertura: "19:45",
      mozo: "Carlos",
      factura: { tipo: "TK", numero: "0001-00008845", cae: "74185296301234", vto: "18 sep", total: 42600 }
    },
    {
      id: "ped4",
      mesa: "mesa7",
      items: [
        { menu: "m3", cantidad: 1, status: "pendiente", nota: "" },
        { menu: "m7", cantidad: 3, status: "pendiente", nota: "Un plato sin queso" }
      ],
      horaApertura: "21:00",
      mozo: "María",
      factura: null
    }
  ];
}

let menu = null;
let mesas = null;
let pedidos = null;

function loadMenu() {
  if (menu) return menu;
  const raw = localStorage.getItem("restaurante-menu-v1");
  if (!raw) { menu = seedMenu(); localStorage.setItem("restaurante-menu-v1", JSON.stringify(menu)); return menu; }
  return menu = JSON.parse(raw);
}

function loadMesas() {
  if (mesas) return mesas;
  const raw = localStorage.getItem("restaurante-mesas-v1");
  if (!raw) { mesas = seedMesas(); localStorage.setItem("restaurante-mesas-v1", JSON.stringify(mesas)); return mesas; }
  return mesas = JSON.parse(raw);
}

function loadPedidos() {
  if (pedidos) return pedidos;
  const raw = localStorage.getItem("restaurante-pedidos-v1");
  if (!raw) { pedidos = seedPedidos(); localStorage.setItem("restaurante-pedidos-v1", JSON.stringify(pedidos)); return pedidos; }
  return pedidos = JSON.parse(raw);
}

function saveMenu() { localStorage.setItem("restaurante-menu-v1", JSON.stringify(menu)); }
function saveMesas() { localStorage.setItem("restaurante-mesas-v1", JSON.stringify(mesas)); }
function savePedidos() { localStorage.setItem("restaurante-pedidos-v1", JSON.stringify(pedidos)); }

function labelMesa(status) { return STATUSES_MESA.find((s) => s.id === status)?.label || status; }
function labelPedido(status) { return STATUSES_PEDIDO.find((s) => s.id === status)?.label || status; }
function catLabel(cat) { return CATEGORIAS.find((c) => c.id === cat)?.label || cat; }
function compLabel(comp) { return COMPROBANTES.find((c) => c.id === comp)?.label || comp; }

function getMenuItem(id) { return loadMenu().find((m) => m.id === id); }
function getMesa(id) { return loadMesas().find((m) => m.id === id); }
function getPedidoByMesa(mesaId) { return loadPedidos().find((p) => p.mesa === mesaId && !p.factura); }

function calcTotalPedido(pedido) {
  return (pedido.items || []).reduce((sum, item) => {
    const menuItem = getMenuItem(item.menu);
    return sum + ((menuItem?.precio || 0) * item.cantidad);
  }, 0);
}

function money(amount) { return "$ " + Number(amount || 0).toLocaleString("es-AR"); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
