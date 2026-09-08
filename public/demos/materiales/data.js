const STORAGE_ITEMS = "materiales-stock-v1";
const STORAGE_CART = "materiales-cart-v1";
const STORAGE_PEDIDOS = "materiales-pedidos-v1";

const LOCAL = {
  nombre: "Corralón El Árido",
  slogan: "Materiales de obra · Villa Devoto",
  direccion: "Av. San Martín 4520",
  barrio: "Villa Devoto, CABA",
  telefono: "011-4555-4520",
  whatsapp: "5492915757934",
  horarios: [
    "Lunes a viernes: 7 a 17",
    "Sábados: 7 a 13"
  ]
};

const CATEGORIAS = [
  { id: "cemento", label: "Cemento y cal", imagen: "img/cemento.jpg" },
  { id: "mamposteria", label: "Ladrillos", imagen: "img/ladrillo.jpg" },
  { id: "hierro", label: "Hierros", imagen: "img/hierro.jpg" },
  { id: "aridos", label: "Áridos", imagen: "img/arena.jpg" },
  { id: "pinturas", label: "Pinturas", imagen: "img/pintura.jpg" },
  { id: "terminaciones", label: "Terminaciones", imagen: "img/ceramica.jpg" }
];

const PEDIDO_ESTADOS = [
  { id: "consulta", label: "Consulta" },
  { id: "preparacion", label: "En preparación" },
  { id: "entregado", label: "Entregado a obra" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "RE", label: "Remito" }
];

function seedProductos() {
  return [
    {
      id: "m-cemento",
      codigo: "CEM-050",
      nombre: "Cemento Portland bolsa 50 kg",
      categoria: "cemento",
      unidad: "bolsa",
      precio: 12800,
      stock: 86,
      minimo: 40,
      imagen: "img/cemento.jpg",
      descripcion: "Bolsa de 50 kg. Para hormigón, revoque y carpetas. Pallet en el depósito cubierto.",
      history: [{ when: "4 sep", text: "Ingreso de 100 bolsas." }]
    },
    {
      id: "m-cal",
      codigo: "CAL-025",
      nombre: "Cal hidratada bolsa 25 kg",
      categoria: "cemento",
      unidad: "bolsa",
      precio: 6200,
      stock: 40,
      minimo: 20,
      imagen: "img/cal.jpg",
      descripcion: "Cal para revoque y pintura a la cal. Apilada junto al cemento.",
      history: [{ when: "1 sep", text: "Reposición de cal." }]
    },
    {
      id: "m-ladrillo",
      codigo: "LAD-COM",
      nombre: "Ladrillo común",
      categoria: "mamposteria",
      unidad: "unidad",
      precio: 280,
      stock: 4200,
      minimo: 1500,
      imagen: "img/ladrillo.jpg",
      descripcion: "Ladrillo de arcilla cocida. Pallet a cielo abierto, al fondo del predio.",
      history: [{ when: "6 sep", text: "Llegó un camión de ladrillo común." }]
    },
    {
      id: "m-hueco",
      codigo: "LAD-H12",
      nombre: "Ladrillo hueco 12×18×33",
      categoria: "mamposteria",
      unidad: "unidad",
      precio: 410,
      stock: 1800,
      minimo: 800,
      imagen: "img/ladrillo.jpg",
      descripcion: "Ladrillo cerámico hueco para muros. Mismo predio que el común.",
      history: [{ when: "5 sep", text: "Stock de hueco 12." }]
    },
    {
      id: "m-hierro8",
      codigo: "HIE-008",
      nombre: "Hierro del 8 (barra 12 m)",
      categoria: "hierro",
      unidad: "barra",
      precio: 18500,
      stock: 64,
      minimo: 30,
      imagen: "img/hierro.jpg",
      descripcion: "Barra de 12 metros, nervurada. En el playón de hierros.",
      history: [{ when: "3 sep", text: "Corte y despacho a obra." }]
    },
    {
      id: "m-hierro12",
      codigo: "HIE-012",
      nombre: "Hierro del 12 (barra 12 m)",
      categoria: "hierro",
      unidad: "barra",
      precio: 41200,
      stock: 28,
      minimo: 20,
      imagen: "img/hierro.jpg",
      descripcion: "Barra de 12 metros. Para columnas y vigas.",
      history: [{ when: "3 sep", text: "Stock de Ø12." }]
    },
    {
      id: "m-arena",
      codigo: "ARI-ARE",
      nombre: "Arena gruesa (m³)",
      categoria: "aridos",
      unidad: "m³",
      precio: 28000,
      stock: 18,
      minimo: 8,
      imagen: "img/arena.jpg",
      descripcion: "Arena para hormigón y revoque. Se carga con pala o volquete.",
      history: [{ when: "7 sep", text: "Montículo repuesto." }]
    },
    {
      id: "m-pintura",
      codigo: "PIN-LAT",
      nombre: "Látex interior 20 L",
      categoria: "pinturas",
      unidad: "balde",
      precio: 45600,
      stock: 12,
      minimo: 6,
      imagen: "img/pintura.jpg",
      descripcion: "Látex lavable blanco. En el pasillo de pinturas, con rodillos y pinceles.",
      history: [{ when: "2 sep", text: "Pedido al mayorista de pinturas." }]
    },
    {
      id: "m-ceramica",
      codigo: "CER-45",
      nombre: "Cerámica piso 45×45",
      categoria: "terminaciones",
      unidad: "caja",
      precio: 18900,
      stock: 36,
      minimo: 15,
      imagen: "img/ceramica.jpg",
      descripcion: "Caja de 1,62 m². Porcelanato mate gris, para baño o living.",
      history: [{ when: "8 sep", text: "Nuevo lote de 45×45." }]
    },
    {
      id: "m-madera",
      codigo: "MAD-PIN",
      nombre: "Tabla de pino 1×4",
      categoria: "terminaciones",
      unidad: "unidad",
      precio: 4200,
      stock: 90,
      minimo: 40,
      imagen: "img/madera.jpg",
      descripcion: "Pino cepillado. Estantería de maderas, al lado de los perfiles.",
      history: [{ when: "1 sep", text: "Ingreso de tablas." }]
    },
    {
      id: "m-cano",
      codigo: "PER-040",
      nombre: "Caño estructural 40×40",
      categoria: "hierro",
      unidad: "barra",
      precio: 22100,
      stock: 22,
      minimo: 10,
      imagen: "img/cano.jpg",
      descripcion: "Perfil estructural 40×40. Playón de hierros y caños.",
      history: [{ when: "4 sep", text: "Barras de 6 m en stock." }]
    }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      codigo: "PED-2026-041",
      cliente: "Constructora Norte",
      obra: "Casa en Villa Devoto · San Martín 4100",
      tel: "11-5555-4100",
      status: "preparacion",
      items: [
        { id: "m-cemento", nombre: "Cemento Portland bolsa 50 kg", cantidad: 40, precio: 12800, imagen: "img/cemento.jpg" },
        { id: "m-arena", nombre: "Arena gruesa (m³)", cantidad: 4, precio: 28000, imagen: "img/arena.jpg" }
      ],
      factura: null,
      history: [{ when: "7 sep", text: "Pedido a obra. Preparando despacho." }]
    },
    {
      id: "ped2",
      codigo: "PED-2026-038",
      cliente: "Obra Álvarez",
      obra: "PH en Colegiales",
      tel: "11-4444-8810",
      status: "entregado",
      items: [
        { id: "m-ladrillo", nombre: "Ladrillo común", cantidad: 800, precio: 280, imagen: "img/ladrillo.jpg" },
        { id: "m-hierro8", nombre: "Hierro del 8 (barra 12 m)", cantidad: 12, precio: 18500, imagen: "img/hierro.jpg" }
      ],
      factura: { tipo: "FA", numero: "0001-00000102", cae: "74185296301440", vto: "16 sep", total: 446000, cuit: "30-69881220-6" },
      history: [
        { when: "5 sep", text: "Entregado en obra." },
        { when: "4 sep", text: "Factura A emitida." }
      ]
    },
    {
      id: "ped3",
      codigo: "PED-2026-044",
      cliente: "Pinturería de la obra",
      obra: "Reforma Villa Crespo",
      tel: "11-6666-4410",
      status: "consulta",
      items: [
        { id: "m-pintura", nombre: "Látex interior 20 L", cantidad: 3, precio: 45600, imagen: "img/pintura.jpg" }
      ],
      factura: null,
      history: [{ when: "8 sep", text: "Consulta por WhatsApp. Confirmar color." }]
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
  return loadList(STORAGE_ITEMS, seedProductos);
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

function loadPedidos() {
  return loadList(STORAGE_PEDIDOS, seedPedidos);
}

function savePedidos(items) {
  localStorage.setItem(STORAGE_PEDIDOS, JSON.stringify(items));
}

function stockStatus(item) {
  if (item.stock === 0) return "agotado";
  if (item.stock < item.minimo) return "bajo";
  return "stock";
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function pedidoLabel(status) {
  return PEDIDO_ESTADOS.find((s) => s.id === status)?.label || status;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
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
  } else line.cantidad = qty;
  saveCart(cart);
  return { ok: true, cart };
}

function checkoutCart(cliente, obra) {
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
  const pedidoItems = cart.map((line) => {
    const qty = Number(line.cantidad || 1);
    const product = items.find((p) => p.id === line.id);
    product.stock -= qty;
    product.history = [
      { when: "hoy", text: `Pedido a obra x${qty}.` },
      ...(product.history || [])
    ];
    return {
      id: product.id,
      nombre: product.nombre,
      imagen: product.imagen || "",
      precio: product.precio,
      cantidad: qty
    };
  });
  const n = loadPedidos().length + 45;
  const pedido = {
    id: crypto.randomUUID(),
    codigo: `PED-2026-${String(n).padStart(3, "0")}`,
    cliente: cliente || "Cliente mostrador",
    obra: obra || "Pedido desde el catálogo",
    tel: "",
    status: "consulta",
    items: pedidoItems,
    factura: null,
    history: [{ when: "hoy", text: "Pedido cargado desde el catálogo." }]
  };
  save(items);
  savePedidos([pedido, ...loadPedidos()]);
  saveCart([]);
  return { ok: true, pedido };
}

function pedidoTotal(pedido) {
  return (pedido.items || []).reduce((sum, i) => sum + i.precio * i.cantidad, 0);
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
