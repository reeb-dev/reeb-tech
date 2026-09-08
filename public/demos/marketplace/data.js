const CATEGORIAS = [
  { id: "celulares", label: "Celulares" },
  { id: "computacion", label: "Computación" },
  { id: "electronica", label: "Electrónica" },
  { id: "electrodomesticos", label: "Electrodomésticos" },
  { id: "hogar", label: "Hogar" },
  { id: "deportes", label: "Deportes" },
  { id: "moda", label: "Moda" }
];

const STATUSES = [
  { id: "activo", label: "Activo" },
  { id: "pausado", label: "Pausado" },
  { id: "agotado", label: "Sin stock" }
];

const ENVIO_ESTADOS = [
  { id: "pendiente", label: "Pendiente", color: "#cce5ff" },
  { id: "preparando", label: "Preparando", color: "#fff3cd" },
  { id: "despachado", label: "Despachado", color: "#d1ecf1" },
  { id: "en_camino", label: "En camino", color: "#e2d5f1" },
  { id: "entregado", label: "Entregado", color: "#d4edda" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

function resetCaches() {
  productos = null;
  ventas = null;
  preguntas = null;
  mpData = null;
  notificaciones = null;
}

function formatFecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function generarTracking() {
  return "MD-" + Date.now().toString(36).toUpperCase();
}

function normalizeProducto(p) {
  return {
    ...p,
    mla: p.mla || `MLA-${String(p.id).replace(/\W/g, "").slice(-10).toUpperCase()}`,
    visitas: p.visitas || 0,
    preguntas: p.preguntas ?? 0,
    vendidos: p.vendidos || 0,
    rating: p.rating ?? null,
    opiniones: p.opiniones || 0,
    history: p.history || [],
    cuotas: p.cuotas || "Sin cuotas",
    envioGratis: Boolean(p.envioGratis),
    stock: Number(p.stock || 0)
  };
}

// ========== VENTAS ==========
let ventas = null;

function loadVentas() {
  if (ventas) return ventas;
  const raw = localStorage.getItem("marketplace-ventas-v1");
  if (!raw) {
    ventas = [];
    return ventas;
  }
  return ventas = JSON.parse(raw);
}

function saveVentas() {
  localStorage.setItem("marketplace-ventas-v1", JSON.stringify(ventas));
}

function crearVenta(cartItems, compradorNombre, compradorEmail, direccion) {
  loadVentas();
  loadProductos();

  for (const item of cartItems) {
    const producto = productos.find((p) => p.id === item.id);
    const qty = Number(item.cantidad || 1);
    if (!producto || producto.status !== "activo" || producto.stock < qty) {
      return null;
    }
  }

  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    comprador: { nombre: compradorNombre, email: compradorEmail },
    direccion: direccion || "",
    items: cartItems.map((item) => ({
      productoId: item.id,
      titulo: item.titulo,
      precio: item.precio,
      cantidad: Number(item.cantidad || 1),
      imagen: item.imagen
    })),
    total: cartItems.reduce((sum, i) => sum + i.precio * Number(i.cantidad || 1), 0),
    envio: {
      estado: "pendiente",
      tracking: null,
      historial: [{ fecha: new Date().toISOString(), estado: "pendiente", nota: "Venta confirmada" }]
    },
    calificacion: null,
    factura: null,
    pagado: true
  };

  cartItems.forEach((item) => {
    const qty = Number(item.cantidad || 1);
    const producto = productos.find((p) => p.id === item.id);
    if (!producto) return;
    producto.stock = Math.max(0, producto.stock - qty);
    producto.vendidos = (producto.vendidos || 0) + qty;
    if (producto.stock === 0) {
      producto.status = "agotado";
    }
  });

  ventas.unshift(venta);
  saveVentas();
  saveProductos();
  acreditarVenta(venta.total, venta.id);
  guardarNotificacion("venta", `Nueva venta: ${venta.items.map((i) => i.titulo).join(", ")}`, venta.id);
  return venta;
}

function actualizarEnvio(ventaId, nuevoEstado, tracking = null) {
  loadVentas();
  const venta = ventas.find((v) => v.id === ventaId);
  if (!venta) return null;

  venta.envio.estado = nuevoEstado;
  if (tracking) venta.envio.tracking = tracking;
  if ((nuevoEstado === "despachado" || nuevoEstado === "en_camino") && !venta.envio.tracking) {
    venta.envio.tracking = generarTracking();
  }
  venta.envio.historial.push({
    fecha: new Date().toISOString(),
    estado: nuevoEstado,
    nota: ENVIO_ESTADOS.find((e) => e.id === nuevoEstado)?.label || nuevoEstado
  });

  saveVentas();
  if (nuevoEstado === "entregado") {
    guardarNotificacion("envio", `Pedido entregado a ${venta.comprador.nombre}`, venta.id);
  }
  return venta;
}

function emitirFacturaVenta(ventaId, tipo, cuit) {
  loadVentas();
  const venta = ventas.find((v) => v.id === ventaId);
  if (!venta || venta.factura) return null;

  const numero = `0001-${String(Math.floor(Math.random() * 99999) + 1).padStart(8, "0")}`;
  const cae = String(Math.floor(Math.random() * 1e14)).padStart(14, "0");
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);

  venta.factura = {
    tipo,
    numero,
    cae,
    vto: vtoDate.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
    total: venta.total,
    cuit: cuit || ""
  };

  saveVentas();
  guardarNotificacion("factura", `Factura ${numero} emitida`, venta.id);
  return venta;
}

// ========== PREGUNTAS ==========
let preguntas = null;

function loadPreguntas() {
  if (preguntas) return preguntas;
  const raw = localStorage.getItem("marketplace-preguntas-v1");
  if (!raw) {
    preguntas = [];
    return preguntas;
  }
  return preguntas = JSON.parse(raw);
}

function savePreguntas() {
  localStorage.setItem("marketplace-preguntas-v1", JSON.stringify(preguntas));
}

function crearPregunta(productoId, texto, nombreUsuario) {
  loadPreguntas();
  loadProductos();

  const producto = productos.find((p) => p.id === productoId);
  if (!producto) return null;

  const pregunta = {
    id: crypto.randomUUID(),
    productoId,
    productoTitulo: producto.titulo,
    texto,
    nombreUsuario,
    fecha: new Date().toISOString(),
    respuesta: null,
    fechaRespuesta: null
  };

  preguntas.unshift(pregunta);
  producto.preguntas = (producto.preguntas || 0) + 1;

  savePreguntas();
  saveProductos();
  guardarNotificacion("pregunta", `Nueva pregunta en "${producto.titulo}"`, pregunta.id);
  return pregunta;
}

function responderPregunta(preguntaId, respuesta) {
  loadPreguntas();
  const pregunta = preguntas.find((p) => p.id === preguntaId);
  if (!pregunta) return null;

  pregunta.respuesta = respuesta;
  pregunta.fechaRespuesta = new Date().toISOString();

  savePreguntas();
  return pregunta;
}

function preguntasDeProducto(productoId) {
  return loadPreguntas().filter((p) => p.productoId === productoId);
}

// ========== CALIFICACIONES ==========
function calificarVenta(ventaId, rating, comentario) {
  loadVentas();
  loadProductos();

  const venta = ventas.find((v) => v.id === ventaId);
  if (!venta || venta.calificacion) return null;

  venta.calificacion = {
    rating: Number(rating),
    comentario,
    fecha: new Date().toISOString()
  };

  venta.items.forEach((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (producto) {
      const ventasProducto = ventas.filter((v) =>
        v.calificacion && v.items.some((i) => i.productoId === producto.id)
      );
      const totalRatings = ventasProducto.reduce((sum, v) => sum + v.calificacion.rating, 0);
      producto.rating = (totalRatings / ventasProducto.length).toFixed(1);
      producto.opiniones = ventasProducto.length;
    }
  });

  saveVentas();
  saveProductos();
  guardarNotificacion("calificacion", `${venta.comprador.nombre} calificó con ${rating} estrellas`, venta.id);
  return venta;
}

// ========== MERCADO PAGO SIMULADO ==========
let mpData = null;

function loadMercadoPago() {
  if (mpData) return mpData;
  const raw = localStorage.getItem("marketplace-mp-v1");
  if (!raw) {
    mpData = {
      saldoDisponible: 0,
      saldoPendiente: 0,
      movimientos: [],
      retiros: []
    };
    return mpData;
  }
  return mpData = JSON.parse(raw);
}

function saveMercadoPago() {
  localStorage.setItem("marketplace-mp-v1", JSON.stringify(mpData));
}

function acreditarVenta(monto, ventaId) {
  loadMercadoPago();
  const comision = monto * 0.05;
  const neto = monto - comision;

  mpData.saldoDisponible += neto;
  mpData.movimientos.unshift({
    id: crypto.randomUUID(),
    tipo: "venta",
    monto: neto,
    comision,
    fecha: new Date().toISOString(),
    descripcion: `Venta #${ventaId.slice(0, 8)}`,
    ventaId
  });

  saveMercadoPago();
  return mpData;
}

function retirarDinero(monto, cbu) {
  loadMercadoPago();
  if (monto <= 0 || monto > mpData.saldoDisponible) return null;

  mpData.saldoDisponible -= monto;
  mpData.retiros.unshift({
    id: crypto.randomUUID(),
    monto,
    cbu,
    fecha: new Date().toISOString(),
    estado: "procesando"
  });
  mpData.movimientos.unshift({
    id: crypto.randomUUID(),
    tipo: "retiro",
    monto: -monto,
    fecha: new Date().toISOString(),
    descripcion: `Retiro a CBU ***${String(cbu).slice(-4)}`
  });

  saveMercadoPago();
  return mpData;
}

// ========== NOTIFICACIONES ==========
let notificaciones = null;

function loadNotificaciones() {
  if (notificaciones) return notificaciones;
  const raw = localStorage.getItem("marketplace-notif-v1");
  if (!raw) {
    notificaciones = [];
    return notificaciones;
  }
  return notificaciones = JSON.parse(raw);
}

function saveNotificaciones() {
  localStorage.setItem("marketplace-notif-v1", JSON.stringify(notificaciones));
}

function guardarNotificacion(tipo, mensaje, refId) {
  loadNotificaciones();
  notificaciones.unshift({
    id: crypto.randomUUID(),
    tipo,
    mensaje,
    refId,
    fecha: new Date().toISOString(),
    leida: false
  });
  if (notificaciones.length > 50) notificaciones = notificaciones.slice(0, 50);
  saveNotificaciones();
}

function marcarNotificacionLeida(notifId) {
  loadNotificaciones();
  const notif = notificaciones.find((n) => n.id === notifId);
  if (notif) notif.leida = true;
  saveNotificaciones();
}

function marcarTodasLeidas() {
  loadNotificaciones();
  notificaciones.forEach((n) => { n.leida = true; });
  saveNotificaciones();
}

function contarNotificacionesNoLeidas() {
  loadNotificaciones();
  return notificaciones.filter((n) => !n.leida).length;
}

function seedProductos() {
  return [
    {
      id: "mp1",
      titulo: "Samsung Galaxy S24 Ultra 256GB",
      categoria: "celulares",
      precio: 549999,
      cuotas: "12 cuotas sin interés",
      stock: 15,
      vendidos: 234,
      envioGratis: true,
      ubicacion: "Capital Federal",
      imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp2",
      titulo: "MacBook Air M3 15\" 512GB SSD",
      categoria: "computacion",
      precio: 1299000,
      cuotas: "6 cuotas sin interés",
      stock: 8,
      vendidos: 89,
      envioGratis: true,
      ubicacion: "Buenos Aires",
      imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp3",
      titulo: "AirPods Pro 2da Generación",
      categoria: "electronica",
      precio: 89999,
      cuotas: "3 cuotas sin interés",
      stock: 45,
      vendidos: 567,
      envioGratis: true,
      ubicacion: "Córdoba",
      imagen: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp4",
      titulo: "Apple Watch Ultra 2 49mm GPS",
      categoria: "electronica",
      precio: 349999,
      cuotas: "6 cuotas sin interés",
      stock: 12,
      vendidos: 156,
      envioGratis: true,
      ubicacion: "Rosario",
      imagen: "https://images.unsplash.com/photo-1434493789847-2a75b0eb9a9f?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp5",
      titulo: "Monitor LG 27\" 4K UHD IPS",
      categoria: "computacion",
      precio: 799000,
      cuotas: "12 cuotas sin interés",
      stock: 6,
      vendidos: 78,
      envioGratis: true,
      ubicacion: "Capital Federal",
      imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp6",
      titulo: "PlayStation 5 Slim Digital",
      categoria: "electronica",
      precio: 649999,
      cuotas: "18 cuotas",
      stock: 3,
      vendidos: 445,
      envioGratis: true,
      ubicacion: "Buenos Aires",
      imagen: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp7",
      titulo: "Sony Alpha A7 IV Body",
      categoria: "electronica",
      precio: 1450000,
      cuotas: "12 cuotas sin interés",
      stock: 2,
      vendidos: 34,
      envioGratis: true,
      ubicacion: "Capital Federal",
      imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp8",
      titulo: "JBL Partybox 110 Bluetooth",
      categoria: "electronica",
      precio: 189999,
      cuotas: "6 cuotas sin interés",
      stock: 18,
      vendidos: 123,
      envioGratis: true,
      ubicacion: "Mendoza",
      imagen: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp9",
      titulo: "Silla Gamer Corsair T3 Rush",
      categoria: "hogar",
      precio: 249999,
      cuotas: "12 cuotas",
      stock: 7,
      vendidos: 89,
      envioGratis: true,
      ubicacion: "Buenos Aires",
      imagen: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp10",
      titulo: "Heladera Samsung No Frost 394L",
      categoria: "electrodomesticos",
      precio: 899000,
      cuotas: "18 cuotas sin interés",
      stock: 4,
      vendidos: 67,
      envioGratis: true,
      ubicacion: "Capital Federal",
      imagen: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp11",
      titulo: "Zapatillas Nike Air Max 90",
      categoria: "moda",
      precio: 129999,
      cuotas: "6 cuotas sin interés",
      stock: 25,
      vendidos: 345,
      envioGratis: true,
      ubicacion: "Buenos Aires",
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      status: "activo"
    },
    {
      id: "mp12",
      titulo: "Bicicleta Mountain Bike R29",
      categoria: "deportes",
      precio: 385000,
      cuotas: "12 cuotas sin interés",
      stock: 5,
      vendidos: 56,
      envioGratis: true,
      ubicacion: "Córdoba",
      imagen: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop",
      status: "activo"
    }
  ];
}

let productos = null;

function loadProductos() {
  if (productos) return productos;
  const raw = localStorage.getItem("marketplace-productos-v1");
  if (!raw) {
    productos = seedProductos().map(normalizeProducto);
    localStorage.setItem("marketplace-productos-v1", JSON.stringify(productos));
    return productos;
  }
  productos = JSON.parse(raw).map(normalizeProducto);
  return productos;
}

function saveProductos(list) {
  if (Array.isArray(list)) productos = list;
  localStorage.setItem("marketplace-productos-v1", JSON.stringify(productos || []));
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function envioLabel(estado) {
  return ENVIO_ESTADOS.find((e) => e.id === estado)?.label || estado;
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
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
