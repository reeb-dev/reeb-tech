const STATUSES_MESA = [
  { id: "libre", label: "Available" },
  { id: "ocupada", label: "Occupied" },
  { id: "reservada", label: "Reserved" },
  { id: "cuenta", label: "Paid" }
];

const STATUSES_PEDIDO = [
  { id: "pendiente", label: "Ordered" },
  { id: "preparando", label: "In kitchen" },
  { id: "listo", label: "Ready" },
  { id: "entregado", label: "Ready" },
  { id: "cobrado", label: "Paid" }
];

const CATEGORIAS = [
  { id: "entrada", label: "Starters" },
  { id: "principal", label: "Main courses" },
  { id: "guarnicion", label: "Sides" },
  { id: "postre", label: "Desserts" },
  { id: "bebida", label: "Wine and drinks" }
];

const COMPROBANTES = [
  { id: "FB", label: "Invoice B" },
  { id: "FC", label: "Invoice C" },
  { id: "TK", label: "Receipt" }
];

const MENU_KEY = "en-food-service-menu-v1";
const MESAS_KEY = "en-food-service-tables-v1";
const PEDIDOS_KEY = "en-food-service-orders-v1";

function seedLocal() {
  return {
    nombre: "Don Ernesto Grill",
    direccion: "Honduras 4827",
    barrio: "Palermo",
    ciudad: "Buenos Aires",
    telefono: "011-4774-1820",
    lat: -34.5889,
    lng: -58.4307,
    capacidadSalon: 32,
    capacidadTerraza: 16,
    horarios: "Tue–Thu 12–3:30 PM and 8 PM–midnight · Fri–Sun 12–4 PM and 8 PM–1 AM · Closed Mondays"
  };
}

function seedMenu() {
  return [
    { id: "m1", codigo: "ENT-01", nombre: "Provoleta", categoria: "entrada", precio: 7800, disponible: true, foto: "/demos/restaurante/img/provoleta.jpg", descripcion: "Grilled provolone with oregano and olive oil." },
    { id: "m2", codigo: "ENT-02", nombre: "Beef empanadas", categoria: "entrada", precio: 5200, disponible: true, foto: "/demos/restaurante/img/empanadas.jpg", descripcion: "Three fried empanadas filled with hand-cut beef." },
    { id: "m3", codigo: "ENT-03", nombre: "Cold cuts board", categoria: "entrada", precio: 14800, disponible: true, foto: "/demos/restaurante/img/tabla.jpg", descripcion: "Ham, salami, cheeses and olives to share." },
    { id: "m4", codigo: "PRI-01", nombre: "New York strip steak", categoria: "principal", precio: 19800, disponible: true, foto: "/demos/restaurante/img/bife-chorizo.jpg", descripcion: "Juicy grilled steak, cooked to your preference." },
    { id: "m5", codigo: "PRI-02", nombre: "Rib-eye steak", categoria: "principal", precio: 22400, disponible: true, foto: "/demos/restaurante/img/ojo-bife.jpg", descripcion: "Bone-in rib-eye cooked over the grill." },
    { id: "m6", codigo: "PRI-03", nombre: "Argentine mixed grill", categoria: "principal", precio: 18600, disponible: true, foto: "/demos/restaurante/img/asado.jpg", descripcion: "Beef cuts, chorizo and offal served with chimichurri." },
    { id: "m7", codigo: "PRI-04", nombre: "Milanesa Napolitana", categoria: "principal", precio: 16200, disponible: true, foto: "/demos/restaurante/img/milanesa.jpg", descripcion: "Breaded beef with ham, tomato sauce and mozzarella." },
    { id: "m8", codigo: "PRI-05", nombre: "Penne Bolognese", categoria: "principal", precio: 12400, disponible: true, foto: "/demos/restaurante/img/pastas.jpg", descripcion: "Al dente pasta with meat sauce and grated cheese." },
    { id: "m9", codigo: "PRI-06", nombre: "Mushroom risotto", categoria: "principal", precio: 13600, disponible: true, foto: "/demos/restaurante/img/risotto.jpg", descripcion: "Creamy rice with mushrooms and cheese." },
    { id: "m10", codigo: "PRI-07", nombre: "Grilled salmon", categoria: "principal", precio: 21800, disponible: false, foto: "/demos/restaurante/img/pescado.jpg", descripcion: "Grilled salmon with vegetables. Unavailable today." },
    { id: "m11", codigo: "GUA-01", nombre: "French fries", categoria: "guarnicion", precio: 4800, disponible: true, foto: "/demos/restaurante/img/papas.jpg", descripcion: "A serving of crispy French fries." },
    { id: "m12", codigo: "GUA-02", nombre: "Mashed potatoes", categoria: "guarnicion", precio: 4200, disponible: true, foto: "/demos/restaurante/img/pure.jpg", descripcion: "Homemade mashed potatoes with butter and nutmeg." },
    { id: "m13", codigo: "GUA-03", nombre: "Mixed salad", categoria: "guarnicion", precio: 4500, disponible: true, foto: "/demos/restaurante/img/ensalada.jpg", descripcion: "Lettuce, tomato and onion with oil and vinegar." },
    { id: "m14", codigo: "POS-01", nombre: "Flan with dulce de leche", categoria: "postre", precio: 5800, disponible: true, foto: "/demos/restaurante/img/flan.jpg", descripcion: "Homemade caramel flan with dulce de leche." },
    { id: "m15", codigo: "POS-02", nombre: "Dulce de leche pancake", categoria: "postre", precio: 6200, disponible: true, foto: "/demos/restaurante/img/panqueque.jpg", descripcion: "Warm pancake filled with dulce de leche." },
    { id: "m16", codigo: "BEB-01", nombre: "Glass of Malbec", categoria: "bebida", precio: 4900, disponible: true, foto: "/demos/restaurante/img/malbec.jpg", descripcion: "A glass of house Malbec." },
    { id: "m17", codigo: "BEB-02", nombre: "Bottle of Malbec", categoria: "bebida", precio: 16800, disponible: true, foto: "/demos/restaurante/img/malbec-botella.jpg", descripcion: "A bottle of Malbec for the table." },
    { id: "m18", codigo: "BEB-03", nombre: "Still water 500 ml", categoria: "bebida", precio: 2200, disponible: true, foto: "/demos/restaurante/img/agua.jpg", descripcion: "Still mineral water." },
    { id: "m19", codigo: "BEB-04", nombre: "Soft drink", categoria: "bebida", precio: 2800, disponible: true, foto: "/demos/restaurante/img/gaseosa.jpg", descripcion: "A glass of house soft drink." },
    { id: "m20", codigo: "PRI-08", nombre: "Lunch menu", categoria: "principal", precio: 15600, disponible: true, foto: "/demos/restaurante/img/hero-salon.jpg", descripcion: "Daily main, side and drink. Tuesday through Friday at lunch." }
  ];
}

function seedMesas() {
  return [
    { id: "mesa1", numero: 1, capacidad: 2, zona: "dining room", status: "ocupada", mozo: "Carlos" },
    { id: "mesa2", numero: 2, capacidad: 4, zona: "dining room", status: "libre", mozo: null },
    { id: "mesa3", numero: 3, capacidad: 4, zona: "dining room", status: "ocupada", mozo: "María" },
    { id: "mesa4", numero: 4, capacidad: 6, zona: "terrace", status: "reservada", mozo: null, reserva: { nombre: "Taylor family", hora: "21:00", personas: 5 } },
    { id: "mesa5", numero: 5, capacidad: 2, zona: "dining room", status: "cuenta", mozo: "Carlos" },
    { id: "mesa6", numero: 6, capacidad: 8, zona: "terrace", status: "libre", mozo: null },
    { id: "mesa7", numero: 7, capacidad: 4, zona: "dining room", status: "ocupada", mozo: "María" },
    { id: "mesa8", numero: 8, capacidad: 2, zona: "dining room", status: "libre", mozo: null }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      mesa: "mesa1",
      items: [
        { menu: "m1", cantidad: 1, status: "entregado", nota: "" },
        { menu: "m4", cantidad: 1, status: "preparando", nota: "Medium" },
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
        { menu: "m7", cantidad: 2, status: "listo", nota: "One without ham" },
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
      factura: { tipo: "TK", numero: "0001-00008845", cae: "74185296301234", vto: "Sep 18", total: 42800 }
    },
    {
      id: "ped4",
      mesa: "mesa7",
      items: [
        { menu: "m3", cantidad: 1, status: "pendiente", nota: "" },
        { menu: "m8", cantidad: 2, status: "pendiente", nota: "No grated cheese" }
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

function saveMenu(list) {
  if (Array.isArray(list)) menu = list;
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}
function saveMesas(list) {
  if (Array.isArray(list)) mesas = list;
  localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
}
function savePedidos(list) {
  if (Array.isArray(list)) pedidos = list;
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

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
  return item?.foto || "/demos/restaurante/img/hero-salon.jpg";
}

function calcTotalPedido(pedido) {
  return (pedido.items || []).reduce((sum, item) => {
    const menuItem = getMenuItem(item.menu);
    return sum + ((menuItem?.precio || 0) * item.cantidad);
  }, 0);
}

function money(amount) { return "ARS " + Number(amount || 0).toLocaleString("en-US"); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function direccionCompleta(local) {
  const s = local || seedLocal();
  return `${s.direccion}, ${s.barrio}, ${s.ciudad}`;
}
