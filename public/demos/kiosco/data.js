const STORAGE_ITEMS = "kiosco-demo-v2";
const STORAGE_CART = "kiosco-cart-v2";
const STORAGE_VENTAS = "kiosco-ventas-v2";
const STORAGE_FIADOS = "kiosco-fiados-v2";

const LOCAL = {
  nombre: "Kiosco Lo de Pedro",
  slogan: "El kiosco de la esquina",
  direccion: "Av. San Martín 1840",
  barrio: "Villa del Parque, CABA",
  telefono: "011-4555-1840",
  whatsapp: "5491140001234",
  horarios: [
    "Lunes a sábado: 7 a 22",
    "Domingos: 8 a 14"
  ]
};

const STATUSES = [
  { id: "stock", label: "En stock" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" }
];

const FIADO_ESTADOS = [
  { id: "abierto", label: "Abierto" },
  { id: "parcial", label: "Pago parcial" },
  { id: "cobrado", label: "Cobrado" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

const CATEGORIAS = [
  { id: "golosinas", label: "Golosinas", imagen: "img/alfajor.jpg" },
  { id: "bebidas", label: "Bebidas", imagen: "img/coca-cola.jpg" },
  { id: "cigarrillos", label: "Cigarrillos", imagen: "img/marlboro.jpg" },
  { id: "snacks", label: "Snacks", imagen: "img/papas.jpg" }
];

const CATS_PUBLICAS = CATEGORIAS.map((c) => c.id);

function seed() {
  return [
    {
      id: "k-alfajor",
      codigo: "GOL-001",
      nombre: "Alfajor triple de chocolate",
      categoria: "golosinas",
      precio: 850,
      stock: 24,
      minimo: 10,
      proveedor: "Distribuidora Norte",
      imagen: "img/alfajor.jpg",
      descripcion: "Alfajor de dos tapas, dulce de leche y baño de chocolate. El de siempre, al lado de la caja.",
      status: "stock",
      history: [
        { when: "7 sep", text: "Reposición: +48 unidades." },
        { when: "2 sep", text: "Venta: 12 unidades." }
      ]
    },
    {
      id: "k-gomitas",
      codigo: "GOL-008",
      nombre: "Gomitas surtidas",
      categoria: "golosinas",
      precio: 1200,
      stock: 3,
      minimo: 6,
      proveedor: "Distribuidora Norte",
      imagen: "img/gomitas.jpg",
      descripcion: "Bolsa de gomitas de varios sabores. Las piden los chicos a la salida de la escuela.",
      status: "bajo",
      history: [{ when: "7 sep", text: "Quedan las últimas bolsas." }]
    },
    {
      id: "k-mars",
      codigo: "GOL-012",
      nombre: "Chocolate Mars",
      categoria: "golosinas",
      precio: 1800,
      stock: 14,
      minimo: 8,
      proveedor: "Distribuidora Norte",
      imagen: "img/chocolate.jpg",
      descripcion: "Barra de chocolate con caramelo. Heladera de la góndola, al lado de los alfajores.",
      status: "stock",
      history: [{ when: "6 sep", text: "Llegó el pedido de chocolates." }]
    },
    {
      id: "k-chicles",
      codigo: "GOL-015",
      nombre: "Chicles de sandía",
      categoria: "golosinas",
      precio: 700,
      stock: 18,
      minimo: 8,
      proveedor: "Distribuidora Norte",
      imagen: "img/chicles.jpg",
      descripcion: "Paquete de chicles sabor sandía. Al lado de la caja, con los caramelos.",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición de chicles." }]
    },
    {
      id: "k-surtido",
      codigo: "GOL-020",
      nombre: "Surtido de chocolates",
      categoria: "golosinas",
      precio: 6800,
      stock: 4,
      minimo: 3,
      proveedor: "Distribuidora Norte",
      imagen: "img/chocolates.jpg",
      descripcion: "Caja con barras surtidas (Mars, Twix, KitKat y otras). Para llevar de a varias.",
      status: "stock",
      history: [{ when: "4 sep", text: "Caja abierta en góndola." }]
    },
    {
      id: "k-helado",
      codigo: "GOL-022",
      nombre: "Helado cucurucho",
      categoria: "golosinas",
      precio: 1500,
      stock: 10,
      minimo: 6,
      proveedor: "Helados del Sur",
      imagen: "img/helado.jpg",
      descripcion: "Cucurucho de dos bochas, freezer de la vidriera. Según el stock del día.",
      status: "stock",
      history: [{ when: "8 sep", text: "Freezer cargado a la mañana." }]
    },
    {
      id: "k-coca",
      codigo: "BEB-015",
      nombre: "Coca-Cola 500 ml",
      categoria: "bebidas",
      precio: 1200,
      stock: 8,
      minimo: 12,
      proveedor: "Distribuidora Sur",
      imagen: "img/coca-cola.jpg",
      descripcion: "Botella de 500 ml, heladera de la puerta. La más pedida a la tarde.",
      status: "bajo",
      history: [{ when: "8 sep", text: "Stock bajo. Pedir al proveedor." }]
    },
    {
      id: "k-pepsi",
      codigo: "BEB-016",
      nombre: "Pepsi 354 ml",
      categoria: "bebidas",
      precio: 1100,
      stock: 16,
      minimo: 10,
      proveedor: "Distribuidora Sur",
      imagen: "img/gaseosa.jpg",
      descripcion: "Lata fría de la heladera. Al lado de la Coca y el agua.",
      status: "stock",
      history: [{ when: "6 sep", text: "Reposición de latas." }]
    },
    {
      id: "k-agua",
      codigo: "BEB-020",
      nombre: "Agua mineral 1.5 L",
      categoria: "bebidas",
      precio: 900,
      stock: 20,
      minimo: 15,
      proveedor: "Distribuidora Sur",
      imagen: "img/agua.jpg",
      descripcion: "Botella de 1.5 litros. En el piso, al lado de la heladera.",
      status: "stock",
      history: [{ when: "6 sep", text: "Reposición completa." }]
    },
    {
      id: "k-energy",
      codigo: "BEB-028",
      nombre: "Bebida energética",
      categoria: "bebidas",
      precio: 2200,
      stock: 9,
      minimo: 6,
      proveedor: "Distribuidora Sur",
      imagen: "img/energy.jpg",
      descripcion: "Lata o botella de energética, heladera de atrás. Sale mucho de noche y el fin de semana.",
      status: "stock",
      history: [{ when: "7 sep", text: "Pedido de energéticas." }]
    },
    {
      id: "k-quilmes",
      codigo: "BEB-030",
      nombre: "Cerveza Quilmes 355 ml",
      categoria: "bebidas",
      precio: 1800,
      stock: 12,
      minimo: 8,
      proveedor: "Distribuidora Sur",
      imagen: "img/quilmes.jpg",
      descripcion: "Botella de 355 ml, heladera de cervezas. Solo a mayores de 18.",
      status: "stock",
      history: [{ when: "5 sep", text: "Cajón de Quilmes en heladera." }]
    },
    {
      id: "k-marlboro",
      codigo: "CIG-003",
      nombre: "Marlboro Box 20",
      categoria: "cigarrillos",
      precio: 3500,
      stock: 15,
      minimo: 10,
      proveedor: "Tabacalera Central",
      imagen: "img/marlboro.jpg",
      descripcion: "Atado box de 20. Detrás de la caja, con el resto de los cigarrillos.",
      status: "stock",
      history: [{ when: "6 sep", text: "Reposición: +30 atados." }]
    },
    {
      id: "k-atado",
      codigo: "CIG-007",
      nombre: "Cigarrillos atado 20",
      categoria: "cigarrillos",
      precio: 2800,
      stock: 6,
      minimo: 8,
      proveedor: "Tabacalera Central",
      imagen: "img/cigarrillos.jpg",
      descripcion: "Atado de 20. El más económico del mostrador.",
      status: "bajo",
      history: [{ when: "8 sep", text: "Quedan pocos atados." }]
    },
    {
      id: "k-papas",
      codigo: "SNA-010",
      nombre: "Papas fritas",
      categoria: "snacks",
      precio: 1600,
      stock: 11,
      minimo: 8,
      proveedor: "Distribuidora Norte",
      imagen: "img/papas.jpg",
      descripcion: "Bolsa de papas. Colgadas en la góndola de snacks, a la izquierda de la caja.",
      status: "stock",
      history: [{ when: "7 sep", text: "Ganchos recargados." }]
    },
    {
      id: "k-mani",
      codigo: "SNA-014",
      nombre: "Maní saborizado",
      categoria: "snacks",
      precio: 1100,
      stock: 7,
      minimo: 5,
      proveedor: "Distribuidora Norte",
      imagen: "img/mani.jpg",
      descripcion: "Maní crocante saborizado. Al lado de los palitos y las papas.",
      status: "stock",
      history: [{ when: "4 sep", text: "En góndola." }]
    },
    {
      id: "k-oreo",
      codigo: "SNA-018",
      nombre: "Galletitas Oreo",
      categoria: "snacks",
      precio: 2400,
      stock: 0,
      minimo: 5,
      proveedor: "Distribuidora Norte",
      imagen: "img/oreo.jpg",
      descripcion: "Paquete de galletitas. Hoy no hay: queda pedido al mayorista.",
      status: "agotado",
      history: [
        { when: "8 sep", text: "Agotado. Pedido pendiente." },
        { when: "5 sep", text: "Últimos paquetes vendidos." }
      ]
    }
  ];
}

function seedFiados() {
  return [
    {
      id: "f1",
      cliente: "Juan Ramírez",
      fecha: "2026-09-05",
      items: "Cigarrillos, Coca y pan",
      monto: 4500,
      saldo: 4500,
      status: "abierto",
      history: [{ when: "5 sep", text: "Fiado anotado. Dice que paga el viernes." }]
    },
    {
      id: "f2",
      cliente: "Marta López",
      fecha: "2026-09-01",
      items: "Compras de la semana (gaseosas, golosinas, yerba)",
      monto: 8200,
      saldo: 5700,
      status: "parcial",
      history: [
        { when: "7 sep", text: "Pagó $2.500. Queda saldo." },
        { when: "1 sep", text: "Cuenta abierta." }
      ]
    },
    {
      id: "f3",
      cliente: "Carlos Benítez",
      fecha: "2026-08-28",
      items: "Cervezas del sábado",
      monto: 3600,
      saldo: 0,
      status: "cobrado",
      history: [
        { when: "2 sep", text: "Pagó el total." },
        { when: "28 ago", text: "Fiado del finde." }
      ]
    }
  ];
}

function seedVentas() {
  const hoy = new Date().toISOString();
  return [
    {
      id: "v-seed-1",
      fecha: hoy,
      cliente: "Mostrador",
      comprobante: "TK",
      total: 2050,
      items: [
        { productoId: "k-alfajor", nombre: "Alfajor triple de chocolate", imagen: "img/alfajor.jpg", precio: 850, cantidad: 1 },
        { productoId: "k-coca", nombre: "Coca-Cola 500 ml", imagen: "img/coca-cola.jpg", precio: 1200, cantidad: 1 }
      ]
    },
    {
      id: "v-seed-2",
      fecha: hoy,
      cliente: "Mostrador",
      comprobante: "TK",
      total: 3500,
      items: [
        { productoId: "k-marlboro", nombre: "Marlboro Box 20", imagen: "img/marlboro.jpg", precio: 3500, cantidad: 1 }
      ]
    },
    {
      id: "v-seed-3",
      fecha: hoy,
      cliente: "Mostrador / ARCA",
      comprobante: "FB",
      cae: "74185296301234",
      total: 3600,
      items: [
        { productoId: "k-quilmes", nombre: "Cerveza Quilmes 355 ml", imagen: "img/quilmes.jpg", precio: 1800, cantidad: 2 }
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

function load() {
  const items = loadList(STORAGE_ITEMS, seed);
  const seedById = Object.fromEntries(seed().map((p) => [p.id, p]));
  const known = new Set(items.map((item) => item.id));
  items.forEach((item) => {
    const seeded = seedById[item.id];
    if (!seeded) return;
    if (!item.imagen) item.imagen = seeded.imagen;
    if (!item.descripcion) item.descripcion = seeded.descripcion;
  });
  const missing = seed().filter((item) => !known.has(item.id));
  if (missing.length) items.push(...missing);
  localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
  return items.filter((item) => item.status !== "fiado");
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
  return loadList(STORAGE_VENTAS, seedVentas);
}

function saveVentas(ventas) {
  localStorage.setItem(STORAGE_VENTAS, JSON.stringify(ventas));
}

function loadFiados() {
  return loadList(STORAGE_FIADOS, seedFiados);
}

function saveFiados(fiados) {
  localStorage.setItem(STORAGE_FIADOS, JSON.stringify(fiados));
}

function productosPublicos() {
  return load().filter((p) => CATS_PUBLICAS.includes(p.categoria));
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
  if (!product || product.stock < 1) return { ok: false, reason: "sin-stock" };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  const qty = line ? line.cantidad + 1 : 1;
  if (qty > product.stock) return { ok: false, reason: "sin-stock" };
  if (line) line.cantidad = qty;
  else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen || "",
      cantidad: 1
    });
  }
  saveCart(cart);
  return { ok: true, cart };
}

function removeFromCart(productId) {
  saveCart(loadCart().filter((c) => c.id !== productId));
  return loadCart();
}

function setCartQty(productId, cantidad) {
  const qty = Number(cantidad);
  if (!Number.isFinite(qty) || qty < 1) {
    removeFromCart(productId);
    return { ok: true, cart: loadCart() };
  }
  const items = load();
  const product = items.find((p) => p.id === productId);
  if (!product || product.stock < 1) return { ok: false, reason: "sin-stock" };
  if (qty > product.stock) return { ok: false, reason: "sin-stock", stock: product.stock };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  if (!line) {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen || "",
      cantidad: qty
    });
  } else {
    line.cantidad = qty;
  }
  saveCart(cart);
  return { ok: true, cart };
}

function checkoutCart(cliente) {
  const cart = loadCart();
  if (!cart.length) return { ok: false, reason: "vacio" };
  const items = load();
  for (const line of cart) {
    const product = items.find((p) => p.id === line.id);
    const qty = Number(line.cantidad || 1);
    if (!product || product.stock < qty) {
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
  save(items);
  saveVentas([venta, ...loadVentas()]);
  saveCart([]);
  return { ok: true, venta };
}

function registrarVentaPanel(itemId, cantidad, tipo) {
  const items = load();
  const item = items.find((i) => i.id === itemId);
  if (!item) return { ok: false, reason: "no-encontrado" };
  const qty = Number(cantidad || 1);
  if (qty > item.stock) return { ok: false, reason: "sin-stock" };
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
  const total = item.precio * qty;
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);
  const vto = vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  item.stock -= qty;
  item.status = stockStatus(item);
  item.factura = { tipo, numero, cae, vto, total };
  item.history = [
    { when: "hoy", text: `Venta x${qty}. ${compLabel(tipo)}. CAE: ${cae}. Total: ${money(total)}` },
    ...(item.history || [])
  ];
  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    cliente: "Mostrador / ARCA",
    items: [{
      productoId: item.id,
      nombre: item.nombre,
      imagen: item.imagen || "",
      precio: item.precio,
      cantidad: qty
    }],
    total,
    comprobante: tipo || "TK",
    cae,
    numero,
    vto
  };
  save(items);
  saveVentas([venta, ...loadVentas()]);
  return { ok: true, venta, item };
}

function ventasDelDia(ventas) {
  const list = ventas || loadVentas();
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return list.filter((v) => {
    const d = new Date(v.fecha);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === key;
  });
}

function totalVentas(list) {
  return (list || []).reduce((sum, v) => sum + Number(v.total || 0), 0);
}

function fiadoLabel(status) {
  return FIADO_ESTADOS.find((s) => s.id === status)?.label || status;
}

function isSameDay(iso) {
  const d = new Date(iso);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function formatFecha(iso) {
  if (!iso) return "hoy";
  if (iso === "hoy") return "hoy";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  if (isSameDay(iso)) {
    return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
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
