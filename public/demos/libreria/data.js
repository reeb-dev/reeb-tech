const STORAGE_ITEMS = "libreria-demo-v2";
const STORAGE_CART = "libreria-cart-v1";
const STORAGE_VENTAS = "libreria-ventas-v1";

const STATUSES = [
  { id: "stock", label: "En stock" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" },
  { id: "pedido", label: "Pedido especial" }
];

const CATEGORIAS = [
  { id: "ficcion", label: "Ficción" },
  { id: "ensayo", label: "Ensayo" },
  { id: "infantil", label: "Infantil" },
  { id: "historieta", label: "Historieta" },
  { id: "clasico", label: "Clásico" },
  { id: "utiles", label: "Útiles escolares" },
  { id: "papeleria", label: "Papelería" }
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
      id: "lib-aleph",
      codigo: "LIB-001",
      nombre: "El Aleph",
      categoria: "ficcion",
      autor: "Jorge Luis Borges",
      editorial: "Emecé / Alianza",
      isbn: "978-950-04-2309-0",
      precio: 16800,
      costo: 11000,
      stock: 7,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/el-aleph.jpg",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición: +8 unidades" }]
    },
    {
      id: "lib-ficciones",
      codigo: "LIB-002",
      nombre: "Ficciones",
      categoria: "ficcion",
      autor: "Jorge Luis Borges",
      editorial: "Sur",
      isbn: "978-950-04-0001-3",
      precio: 17200,
      costo: 11200,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/ficciones.jpg",
      status: "stock",
      history: [{ when: "4 sep", text: "Edición Sur en góndola" }]
    },
    {
      id: "lib-rayuela",
      codigo: "LIB-003",
      nombre: "Rayuela",
      categoria: "ficcion",
      autor: "Julio Cortázar",
      editorial: "Sudamericana",
      isbn: "978-950-07-1234-5",
      precio: 19500,
      costo: 12800,
      stock: 6,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/rayuela.png",
      status: "stock",
      history: [{ when: "2 sep", text: "Pedido Alfaguara/Sudamericana" }]
    },
    {
      id: "lib-fierro",
      codigo: "LIB-004",
      nombre: "Martín Fierro",
      categoria: "clasico",
      autor: "José Hernández",
      editorial: "Librería Martín Fierro",
      isbn: "978-950-03-0100-8",
      precio: 9800,
      costo: 6200,
      stock: 12,
      minimo: 4,
      proveedor: "Clásicos Argentinos",
      imagen: "img/martin-fierro.jpg",
      status: "stock",
      history: [{ when: "1 sep", text: "Edición de referencia gauchesca" }]
    },
    {
      id: "lib-eternauta",
      codigo: "LIB-005",
      nombre: "El Eternauta",
      categoria: "historieta",
      autor: "H. G. Oesterheld / Solano López",
      editorial: "Doedytores",
      isbn: "978-987-1788-61-3",
      precio: 24500,
      costo: 16200,
      stock: 4,
      minimo: 3,
      proveedor: "Historietas del Sur",
      imagen: "img/el-eternauta.jpg",
      status: "stock",
      history: [{ when: "6 sep", text: "Edición color · nevada mortal" }]
    },
    {
      id: "lib-cien",
      codigo: "LIB-006",
      nombre: "Cien años de soledad",
      categoria: "ficcion",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      isbn: "978-950-07-0001-0",
      precio: 18500,
      costo: 12000,
      stock: 8,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/cien-anos-de-soledad.png",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición: +10 unidades" }]
    },
    {
      id: "lib-colera",
      codigo: "LIB-007",
      nombre: "El amor en los tiempos del cólera",
      categoria: "ficcion",
      autor: "Gabriel García Márquez",
      editorial: "Editorial Oveja Negra",
      isbn: "978-958-06-0007-4",
      precio: 17800,
      costo: 11600,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/amor-tiempos-colera.png",
      status: "stock",
      history: [{ when: "3 sep", text: "Llegó edición Oveja Negra" }]
    },
    {
      id: "lib-paramo",
      codigo: "LIB-008",
      nombre: "Pedro Páramo",
      categoria: "ficcion",
      autor: "Juan Rulfo",
      editorial: "Editorial RM",
      isbn: "978-84-16282-90-6",
      precio: 16200,
      costo: 10500,
      stock: 6,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/pedro-paramo.jpg",
      status: "stock",
      history: [{ when: "28 ago", text: "Nueva edición RM" }]
    },
    {
      id: "lib-tunel",
      codigo: "LIB-009",
      nombre: "El túnel",
      categoria: "ficcion",
      autor: "Ernesto Sabato",
      editorial: "Seix Barral",
      isbn: "978-84-322-1162-1",
      precio: 14500,
      costo: 9400,
      stock: 2,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/el-tunel.jpg",
      status: "bajo",
      history: [{ when: "6 sep", text: "Stock bajo. Pedir reposición." }]
    },
    {
      id: "lib-heroes",
      codigo: "LIB-010",
      nombre: "Sobre héroes y tumbas",
      categoria: "ficcion",
      autor: "Ernesto Sabato",
      editorial: "Compañía General Fabril Editora",
      isbn: "978-84-322-1163-8",
      precio: 18900,
      costo: 12400,
      stock: 4,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/sobre-heroes-y-tumbas.jpg",
      status: "stock",
      history: [{ when: "30 ago", text: "Edición Fabril en exhibición" }]
    },
    {
      id: "lib-espiritus",
      codigo: "LIB-011",
      nombre: "La casa de los espíritus",
      categoria: "ficcion",
      autor: "Isabel Allende",
      editorial: "Plaza & Janés",
      isbn: "978-84-01-38120-5",
      precio: 19200,
      costo: 12600,
      stock: 7,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/casa-espiritus.jpg",
      status: "stock",
      history: [{ when: "1 sep", text: "Plaza & Janés · novela" }]
    },
    {
      id: "lib-tregua",
      codigo: "LIB-012",
      nombre: "La tregua",
      categoria: "ficcion",
      autor: "Mario Benedetti",
      editorial: "Nueva Imagen",
      isbn: "978-84-204-7183-9",
      precio: 13800,
      costo: 8900,
      stock: 9,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/la-tregua.jpg",
      status: "stock",
      history: [{ when: "29 ago", text: "Muy pedido en mostrador" }]
    },
    {
      id: "lib-sombra",
      codigo: "LIB-013",
      nombre: "Don Segundo Sombra",
      categoria: "clasico",
      autor: "Ricardo Güiraldes",
      editorial: "Editorial Proa",
      isbn: "978-950-07-2669-2",
      precio: 11200,
      costo: 7300,
      stock: 8,
      minimo: 3,
      proveedor: "Clásicos Argentinos",
      imagen: "img/don-segundo-sombra.jpg",
      status: "stock",
      history: [{ when: "27 ago", text: "Edición Proa 1926 (facsímil)" }]
    },
    {
      id: "lib-masacre",
      codigo: "LIB-014",
      nombre: "Operación Masacre",
      categoria: "ensayo",
      autor: "Rodolfo Walsh",
      editorial: "Ediciones de la Flor",
      isbn: "978-987-580-199-8",
      precio: 15600,
      costo: 10200,
      stock: 2,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/operacion-masacre.jpg",
      status: "bajo",
      history: [{ when: "7 sep", text: "Quedan 2. Pedir a De la Flor." }]
    },
    {
      id: "lib-papelucho",
      codigo: "LIB-015",
      nombre: "Papelucho",
      categoria: "infantil",
      autor: "Marcela Paz",
      editorial: "Editorial Universitaria",
      isbn: "978-956-11-0001-2",
      precio: 8900,
      costo: 5600,
      stock: 14,
      minimo: 5,
      proveedor: "Infantil Latam",
      imagen: "img/papelucho.jpg",
      status: "stock",
      history: [{ when: "2 sep", text: "Stock para el receso escolar" }]
    },
    {
      id: "lib-mafalda",
      codigo: "LIB-016",
      nombre: "Mafalda: Todas las tiras",
      categoria: "historieta",
      autor: "Quino",
      editorial: "Tusquets Editores",
      isbn: "978-987-580-089-2",
      precio: 22000,
      costo: 14500,
      stock: 10,
      minimo: 4,
      proveedor: "Historietas del Sur",
      imagen: "img/mafalda.jpg",
      status: "stock",
      history: [{ when: "4 sep", text: "Integral Tusquets" }]
    },
    {
      id: "uti-cuaderno",
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
      imagen: "",
      status: "stock",
      history: [{ when: "1 sep", text: "Stock para temporada escolar" }]
    },
    {
      id: "pap-resma",
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
      imagen: "",
      status: "stock",
      history: [{ when: "3 sep", text: "Stock actualizado" }]
    }
  ];
}

function load() {
  const raw = localStorage.getItem(STORAGE_ITEMS);
  if (!raw) {
    const data = seed();
    localStorage.setItem(STORAGE_ITEMS, JSON.stringify(data));
    return data;
  }
  const items = JSON.parse(raw);
  const seedById = Object.fromEntries(seed().map((p) => [p.id, p]));
  items.forEach((item) => {
    if (!item.imagen && seedById[item.id]?.imagen) {
      item.imagen = seedById[item.id].imagen;
    }
  });
  return items;
}

function save(items) {
  localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_CART);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function loadVentas() {
  const raw = localStorage.getItem(STORAGE_VENTAS);
  return raw ? JSON.parse(raw) : [];
}

function saveVentas(ventas) {
  localStorage.setItem(STORAGE_VENTAS, JSON.stringify(ventas));
}

function cartCount(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.cantidad || 1), 0);
}

function cartTotal(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.precio || 0) * Number(line.cantidad || 1), 0);
}

function addToCart(productId) {
  const items = load();
  const product = items.find((p) => p.id === productId);
  if (!product || product.status === "pedido" || product.stock < 1) return { ok: false, reason: "sin-stock" };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  const qty = line ? line.cantidad + 1 : 1;
  if (qty > product.stock) return { ok: false, reason: "sin-stock" };
  if (line) line.cantidad = qty;
  else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      autor: product.autor || "",
      precio: product.precio,
      imagen: product.imagen || "",
      cantidad: 1
    });
  }
  saveCart(cart);
  return { ok: true, cart };
}

function removeFromCart(productId) {
  const cart = loadCart().filter((c) => c.id !== productId);
  saveCart(cart);
  return cart;
}

function checkoutCart(cliente) {
  const cart = loadCart();
  if (!cart.length) return { ok: false, reason: "vacio" };
  const items = load();
  for (const line of cart) {
    const product = items.find((p) => p.id === line.id);
    const qty = Number(line.cantidad || 1);
    if (!product || product.status === "pedido" || product.stock < qty) {
      return { ok: false, reason: "sin-stock", nombre: line.nombre };
    }
  }
  const ventaItems = cart.map((line) => {
    const qty = Number(line.cantidad || 1);
    const product = items.find((p) => p.id === line.id);
    product.stock -= qty;
    product.status = stockStatus(product);
    product.history = [
      { when: "hoy", text: `Venta mostrador x${qty}. Total: ${money(product.precio * qty)}` },
      ...(product.history || [])
    ];
    return {
      productoId: product.id,
      nombre: product.nombre,
      autor: product.autor || "",
      imagen: product.imagen || "",
      precio: product.precio,
      cantidad: qty
    };
  });
  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    cliente: cliente || "Cliente mostrador",
    items: ventaItems,
    total: ventaItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    comprobante: "TK"
  };
  const ventas = [venta, ...loadVentas()];
  save(items);
  saveVentas(ventas);
  saveCart([]);
  return { ok: true, venta };
}

function registrarVentaPanel(itemId, cantidad, tipo) {
  const items = load();
  const item = items.find((i) => i.id === itemId);
  if (!item) return { ok: false, reason: "no-encontrado" };
  const qty = Number(cantidad || 1);
  const isPedido = item.status === "pedido";
  if (!isPedido && qty > item.stock) return { ok: false, reason: "sin-stock" };
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const total = item.precio * qty;
  if (!isPedido) item.stock -= qty;
  item.status = stockStatus(item);
  item.history = [
    { when: "hoy", text: `Venta x${qty}. ${compLabel(tipo)}. CAE: ${cae}. Total: ${money(total)}` },
    ...(item.history || [])
  ];
  if (isPedido) {
    item.status = "agotado";
    item.pedidoEspecial = null;
  }
  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    cliente: "Mostrador / ARCA",
    items: [{
      productoId: item.id,
      nombre: item.nombre,
      autor: item.autor || "",
      imagen: item.imagen || "",
      precio: item.precio,
      cantidad: qty
    }],
    total,
    comprobante: tipo || "TK",
    cae
  };
  save(items);
  saveVentas([venta, ...loadVentas()]);
  return { ok: true, venta, item };
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

function formatFecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
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

function coverSrc(item) {
  return item?.imagen || "";
}
