const STATUSES_MESA = [
  { id: "libre", label: "Libre" },
  { id: "ocupada", label: "Ocupada" },
  { id: "reservada", label: "Reservada" },
  { id: "cuenta", label: "Cobrado" }
];

const STATUSES_PEDIDO = [
  { id: "pendiente", label: "Pedido" },
  { id: "preparando", label: "Cocina" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Listo" },
  { id: "cobrado", label: "Cobrado" }
];

const CATEGORIAS = [
  { id: "entrada", label: "Entradas" },
  { id: "principal", label: "Platos principales" },
  { id: "guarnicion", label: "Guarniciones" },
  { id: "postre", label: "Postres" },
  { id: "bebida", label: "Vinos y bebidas" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

const MENU_KEY = "restaurante-menu-v2";
const MESAS_KEY = "restaurante-mesas-v2";
const PEDIDOS_KEY = "restaurante-pedidos-v2";

function seedLocal() {
  return {
    nombre: "Parrilla Don Ernesto",
    direccion: "Honduras 4827",
    barrio: "Palermo",
    ciudad: "CABA",
    telefono: "011-4774-1820",
    lat: -34.5889,
    lng: -58.4307,
    capacidadSalon: 32,
    capacidadTerraza: 16,
    horarios: "Mar a jue 12–15:30 y 20–00 · Vie a dom 12–16 y 20–01 · Lunes cerrado"
  };
}

function seedMenu() {
  return [
    { id: "m1", codigo: "ENT-01", nombre: "Provoleta", categoria: "entrada", precio: 7800, disponible: true, foto: "img/provoleta.jpg", descripcion: "Queso provolone a la parrilla, orégano y aceite de oliva." },
    { id: "m2", codigo: "ENT-02", nombre: "Empanadas de carne", categoria: "entrada", precio: 5200, disponible: true, foto: "img/empanadas.jpg", descripcion: "Tres empanadas fritas, carne cortada a cuchillo." },
    { id: "m3", codigo: "ENT-03", nombre: "Tabla de fiambres", categoria: "entrada", precio: 14800, disponible: true, foto: "img/tabla.jpg", descripcion: "Jamón, salame, quesos y aceitunas, para compartir." },
    { id: "m4", codigo: "PRI-01", nombre: "Bife de chorizo", categoria: "principal", precio: 19800, disponible: true, foto: "img/bife-chorizo.jpg", descripcion: "Corte jugoso a la parrilla. Pedilo jugoso, a punto o cocido." },
    { id: "m5", codigo: "PRI-02", nombre: "Ojo de bife", categoria: "principal", precio: 22400, disponible: true, foto: "img/ojo-bife.jpg", descripcion: "Bife ancho con hueso, a la parrilla." },
    { id: "m6", codigo: "PRI-03", nombre: "Asado a la parrilla", categoria: "principal", precio: 18600, disponible: true, foto: "img/asado.jpg", descripcion: "Parrillada de cortes, chorizo y achuras, con chimichurri." },
    { id: "m7", codigo: "PRI-04", nombre: "Milanesa napolitana", categoria: "principal", precio: 16200, disponible: true, foto: "img/milanesa.jpg", descripcion: "Napolitana con jamón, salsa de tomate y muzzarella." },
    { id: "m8", codigo: "PRI-05", nombre: "Penne a la bolognesa", categoria: "principal", precio: 12400, disponible: true, foto: "img/pastas.jpg", descripcion: "Pasta al dente con salsa de carne y queso rallado." },
    { id: "m9", codigo: "PRI-06", nombre: "Risotto de hongos", categoria: "principal", precio: 13600, disponible: true, foto: "img/risotto.jpg", descripcion: "Arroz cremoso con hongos y queso." },
    { id: "m10", codigo: "PRI-07", nombre: "Salmón a la plancha", categoria: "principal", precio: 21800, disponible: false, foto: "img/pescado.jpg", descripcion: "Salmón grillado con vegetales. Hoy no hay." },
    { id: "m11", codigo: "GUA-01", nombre: "Papas fritas", categoria: "guarnicion", precio: 4800, disponible: true, foto: "img/papas.jpg", descripcion: "Porción de papas fritas crocantes." },
    { id: "m12", codigo: "GUA-02", nombre: "Puré de papas", categoria: "guarnicion", precio: 4200, disponible: true, foto: "img/pure.jpg", descripcion: "Puré casero, manteca y un toque de nuez moscada." },
    { id: "m13", codigo: "GUA-03", nombre: "Ensalada mixta", categoria: "guarnicion", precio: 4500, disponible: true, foto: "img/ensalada.jpg", descripcion: "Lechuga, tomate y cebolla, con aceite y vinagre." },
    { id: "m14", codigo: "POS-01", nombre: "Flan con dulce de leche", categoria: "postre", precio: 5800, disponible: true, foto: "img/flan.jpg", descripcion: "Flan casero con caramelo y dulce de leche." },
    { id: "m15", codigo: "POS-02", nombre: "Panqueque de dulce de leche", categoria: "postre", precio: 6200, disponible: true, foto: "img/panqueque.jpg", descripcion: "Panqueque tibio, relleno de dulce de leche." },
    { id: "m16", codigo: "BEB-01", nombre: "Copa de malbec", categoria: "bebida", precio: 4900, disponible: true, foto: "img/malbec.jpg", descripcion: "Copa de malbec de la casa." },
    { id: "m17", codigo: "BEB-02", nombre: "Malbec botella", categoria: "bebida", precio: 16800, disponible: true, foto: "img/malbec-botella.jpg", descripcion: "Botella de malbec para la mesa." },
    { id: "m18", codigo: "BEB-03", nombre: "Agua mineral 500 ml", categoria: "bebida", precio: 2200, disponible: true, foto: "img/agua.jpg", descripcion: "Agua sin gas." },
    { id: "m19", codigo: "BEB-04", nombre: "Gaseosa de línea", categoria: "bebida", precio: 2800, disponible: true, foto: "img/gaseosa.jpg", descripcion: "Vaso de gaseosa de la casa." },
    { id: "m20", codigo: "PRI-08", nombre: "Menú del mediodía", categoria: "principal", precio: 15600, disponible: true, foto: "img/hero-salon.jpg", descripcion: "Plato del día + guarnición + bebida. Martes a viernes, almuerzo." }
  ];
}

function seedMesas() {
  return [
    { id: "mesa1", numero: 1, capacidad: 2, zona: "salón", status: "ocupada", mozo: "Carlos" },
    { id: "mesa2", numero: 2, capacidad: 4, zona: "salón", status: "libre", mozo: null },
    { id: "mesa3", numero: 3, capacidad: 4, zona: "salón", status: "ocupada", mozo: "María" },
    { id: "mesa4", numero: 4, capacidad: 6, zona: "terraza", status: "reservada", mozo: null, reserva: { nombre: "Familia López", hora: "21:00", personas: 5 } },
    { id: "mesa5", numero: 5, capacidad: 2, zona: "salón", status: "cuenta", mozo: "Carlos" },
    { id: "mesa6", numero: 6, capacidad: 8, zona: "terraza", status: "libre", mozo: null },
    { id: "mesa7", numero: 7, capacidad: 4, zona: "salón", status: "ocupada", mozo: "María" },
    { id: "mesa8", numero: 8, capacidad: 2, zona: "salón", status: "libre", mozo: null }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      mesa: "mesa1",
      items: [
        { menu: "m1", cantidad: 1, status: "entregado", nota: "" },
        { menu: "m4", cantidad: 1, status: "preparando", nota: "A punto" },
        { menu: "m11", cantidad: 1, status: "preparando", nota: "" },
        { menu: "m16", cantidad: 2, status: "entregado", nota: "" }
      ],
      horaApertura: "20:15",
      mozo: "Carlos",
      factura: null
    },
    {
      id: "ped2",
      mesa: "mesa3",
      items: [
        { menu: "m2", cantidad: 1, status: "entregado", nota: "" },
        { menu: "m7", cantidad: 2, status: "listo", nota: "Una sin jamón" },
        { menu: "m13", cantidad: 2, status: "listo", nota: "" }
      ],
      horaApertura: "20:30",
      mozo: "María",
      factura: null
    },
    {
      id: "ped3",
      mesa: "mesa5",
      items: [
        { menu: "m20", cantidad: 2, status: "cobrado", nota: "" },
        { menu: "m14", cantidad: 2, status: "cobrado", nota: "" }
      ],
      horaApertura: "13:10",
      mozo: "Carlos",
      factura: { tipo: "TK", numero: "0001-00008845", cae: "74185296301234", vto: "18 sep", total: 42800 }
    },
    {
      id: "ped4",
      mesa: "mesa7",
      items: [
        { menu: "m3", cantidad: 1, status: "pendiente", nota: "" },
        { menu: "m8", cantidad: 2, status: "pendiente", nota: "Sin queso rallado" }
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
  if (menu && menu.length) return menu;
  const raw = localStorage.getItem(MENU_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        menu = parsed;
        return menu;
      }
    } catch (_) { /* carta guardada inválida: se vuelve a sembrar */ }
  }
  menu = seedMenu();
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
  return menu;
}

function loadMesas() {
  if (mesas) return mesas;
  const raw = localStorage.getItem(MESAS_KEY);
  if (!raw) { mesas = seedMesas(); localStorage.setItem(MESAS_KEY, JSON.stringify(mesas)); return mesas; }
  return mesas = JSON.parse(raw);
}

function loadPedidos() {
  if (pedidos) return pedidos;
  const raw = localStorage.getItem(PEDIDOS_KEY);
  if (!raw) { pedidos = seedPedidos(); localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos)); return pedidos; }
  return pedidos = JSON.parse(raw);
}

function saveMenu() { localStorage.setItem(MENU_KEY, JSON.stringify(menu)); }
function saveMesas() { localStorage.setItem(MESAS_KEY, JSON.stringify(mesas)); }
function savePedidos() { localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos)); }

function labelMesa(status) { return STATUSES_MESA.find((s) => s.id === status)?.label || status; }
function labelPedido(status) { return STATUSES_PEDIDO.find((s) => s.id === status)?.label || status; }
function catLabel(cat) { return CATEGORIAS.find((c) => c.id === cat)?.label || cat; }
function compLabel(comp) { return COMPROBANTES.find((c) => c.id === comp)?.label || comp; }

function getMenuItem(id) { return loadMenu().find((m) => m.id === id); }
function getMesa(id) { return loadMesas().find((m) => m.id === id); }
function getPedidoByMesa(mesaId) { return loadPedidos().find((p) => p.mesa === mesaId && !p.factura); }
function getUltimoPedidoMesa(mesaId) {
  const list = loadPedidos().filter((p) => p.mesa === mesaId);
  return list.length ? list[list.length - 1] : null;
}

function fotoPlato(item) {
  return item?.foto || "img/hero-salon.jpg";
}

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

function direccionCompleta(local) {
  const s = local || seedLocal();
  return `${s.direccion}, ${s.barrio}, ${s.ciudad}`;
}
