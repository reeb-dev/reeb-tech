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

const FOTOS_LOCALES = [
  { id: "img/caja.jpg", label: "Caja / genérico" },
  { id: "img/celular.jpg", label: "Celular" },
  { id: "img/notebook.jpg", label: "Notebook" },
  { id: "img/auriculares.jpg", label: "Auriculares" },
  { id: "img/reloj.jpg", label: "Reloj" },
  { id: "img/monitor.jpg", label: "Monitor" },
  { id: "img/consola.jpg", label: "Consola" },
  { id: "img/camara.jpg", label: "Cámara" },
  { id: "img/parlante.jpg", label: "Parlante" },
  { id: "img/silla.jpg", label: "Silla" },
  { id: "img/heladera.jpg", label: "Heladera" },
  { id: "img/zapatillas.jpg", label: "Zapatillas" },
  { id: "img/bici.jpg", label: "Bicicleta" }
];

const PRODUCTOS_KEY = "marketplace-productos-v2";
const FAVORITOS_KEY = "marketplace-favoritos-v1";

function resetCaches() {
  productos = null;
  ventas = null;
  preguntas = null;
  billetera = null;
  notificaciones = null;
}

function formatFecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function generarTracking() {
  return "FER-" + Date.now().toString(36).toUpperCase();
}

function normalizeProducto(p) {
  const imagen = p.imagen || "img/caja.jpg";
  const imagenes = Array.isArray(p.imagenes) && p.imagenes.length ? p.imagenes : [imagen];
  return {
    ...p,
    mla: p.mla || `FER-${String(p.id).replace(/\W/g, "").slice(-10).toUpperCase()}`,
    visitas: p.visitas || 0,
    preguntas: p.preguntas ?? 0,
    vendidos: p.vendidos || 0,
    rating: p.rating ?? null,
    opiniones: p.opiniones || 0,
    history: p.history || [],
    cuotas: p.cuotas || "Sin cuotas",
    envioGratis: Boolean(p.envioGratis),
    stock: Number(p.stock || 0),
    imagen,
    imagenes,
    descripcion: p.descripcion || "",
    vendedor: p.vendedor || {
      nombre: "Feria",
      ciudad: p.ubicacion || "Argentina",
      ventas: p.vendidos || 0,
      reputacion: p.rating || null
    }
  };
}

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
    pagado: true,
    medioPago: "billetera"
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

let billetera = null;

function loadBilletera() {
  if (billetera) return billetera;
  const raw = localStorage.getItem("marketplace-mp-v1");
  if (!raw) {
    billetera = {
      saldoDisponible: 0,
      saldoPendiente: 0,
      movimientos: [],
      retiros: []
    };
    return billetera;
  }
  return billetera = JSON.parse(raw);
}

function saveBilletera() {
  localStorage.setItem("marketplace-mp-v1", JSON.stringify(billetera));
}

function acreditarVenta(monto, ventaId) {
  loadBilletera();
  const comision = monto * 0.05;
  const neto = monto - comision;

  billetera.saldoDisponible += neto;
  billetera.movimientos.unshift({
    id: crypto.randomUUID(),
    tipo: "venta",
    monto: neto,
    comision,
    fecha: new Date().toISOString(),
    descripcion: `Venta #${ventaId.slice(0, 8)}`,
    ventaId
  });

  saveBilletera();
  return billetera;
}

function retirarDinero(monto, cbu) {
  loadBilletera();
  if (monto <= 0 || monto > billetera.saldoDisponible) return null;

  billetera.saldoDisponible -= monto;
  billetera.retiros.unshift({
    id: crypto.randomUUID(),
    monto,
    cbu,
    fecha: new Date().toISOString(),
    estado: "procesando"
  });
  billetera.movimientos.unshift({
    id: crypto.randomUUID(),
    tipo: "retiro",
    monto: -monto,
    fecha: new Date().toISOString(),
    descripcion: `Retiro a CBU ***${String(cbu).slice(-4)}`
  });

  saveBilletera();
  return billetera;
}

function loadFavoritos() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITOS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveFavoritos(ids) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(ids));
}

function esFavorito(id) {
  return loadFavoritos().includes(id);
}

function toggleFavorito(id) {
  const ids = loadFavoritos();
  const i = ids.indexOf(id);
  if (i >= 0) ids.splice(i, 1);
  else ids.push(id);
  saveFavoritos(ids);
  return ids;
}

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
      imagen: "img/celular.jpg",
      imagenes: ["img/celular.jpg", "img/celular-b.jpg"],
      descripcion: "Pantalla 6.8\", 256 GB, cámara de 200 MP. Equipo sellado, factura B incluida. Retiro en Palermo o envío a todo el país.",
      vendedor: { nombre: "TecnoSur", ciudad: "Palermo, CABA", ventas: 1280, reputacion: 4.9 },
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
      imagen: "img/notebook.jpg",
      imagenes: ["img/notebook.jpg", "img/notebook-b.jpg"],
      descripcion: "Chip M3, 15 pulgadas, 512 GB. Color medianoche. Caja original y 12 meses de garantía del vendedor.",
      vendedor: { nombre: "Notebooks del Bajo", ciudad: "San Isidro", ventas: 640, reputacion: 4.8 },
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
      imagen: "img/auriculares.jpg",
      imagenes: ["img/auriculares.jpg", "img/auriculares-b.jpg"],
      descripcion: "Cancelación activa de ruido, estuche USB-C. Sellados. Envío desde Nueva Córdoba.",
      vendedor: { nombre: "Audio Centro", ciudad: "Córdoba", ventas: 2104, reputacion: 4.7 },
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
      imagen: "img/reloj.jpg",
      imagenes: ["img/reloj.jpg", "img/reloj-b.jpg"],
      descripcion: "Caja de titanio 49 mm, GPS + celular. Correa ocean incluida. Ideal para trekking y natación.",
      vendedor: { nombre: "Relojería Pampa", ciudad: "Rosario", ventas: 412, reputacion: 4.8 },
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
      imagen: "img/monitor.jpg",
      imagenes: ["img/monitor.jpg", "img/monitor-b.jpg"],
      descripcion: "27 pulgadas, 4K IPS, USB-C 65 W. Para diseño o edición. Envío con seguro desde Almagro.",
      vendedor: { nombre: "Pantallas Norte", ciudad: "Almagro, CABA", ventas: 318, reputacion: 4.6 },
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
      envioGratis: false,
      ubicacion: "Buenos Aires",
      imagen: "img/consola.jpg",
      imagenes: ["img/consola.jpg", "img/consola-b.jpg"],
      descripcion: "PS5 Slim Digital, un control DualSense. Sin lectora de discos. Envío a cargo del comprador.",
      vendedor: { nombre: "Arcade Sur", ciudad: "Lanús", ventas: 890, reputacion: 4.7 },
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
      imagen: "img/camara.jpg",
      imagenes: ["img/camara.jpg", "img/camara-b.jpg"],
      descripcion: "Body full frame 33 MP. Shutter 12.000 actuaciones. Incluye batería extra y correa.",
      vendedor: { nombre: "Foto Plaza", ciudad: "Once, CABA", ventas: 156, reputacion: 5.0 },
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
      imagen: "img/parlante.jpg",
      imagenes: ["img/parlante.jpg", "img/parlante-b.jpg"],
      descripcion: "160 W, luces, batería de 12 h. Para patio o evento chico. Envío gratis a Cuyo.",
      vendedor: { nombre: "Sonido Andes", ciudad: "Mendoza", ventas: 274, reputacion: 4.5 },
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
      envioGratis: false,
      ubicacion: "Buenos Aires",
      imagen: "img/silla.jpg",
      imagenes: ["img/silla.jpg", "img/silla-b.jpg"],
      descripcion: "Tela transpirable, lumbar y recline. Armado en el día en CABA. Envío al interior con cargo.",
      vendedor: { nombre: "Muebles Taller", ciudad: "Avellaneda", ventas: 201, reputacion: 4.4 },
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
      imagen: "img/heladera.jpg",
      imagenes: ["img/heladera.jpg", "img/heladera-b.jpg"],
      descripcion: "No Frost 394 litros, inverter. Entrega e instalación en CABA y GBA norte.",
      vendedor: { nombre: "Línea Blanca Sur", ciudad: "Villa Crespo", ventas: 98, reputacion: 4.6 },
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
      imagen: "img/zapatillas.jpg",
      imagenes: ["img/zapatillas.jpg", "img/zapatillas-b.jpg"],
      descripcion: "Air Max 90, talle 40 a 44. Originales. Cambio de talle en el local de Flores.",
      vendedor: { nombre: "Calle 8 Store", ciudad: "Flores, CABA", ventas: 1560, reputacion: 4.8 },
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
      envioGratis: false,
      ubicacion: "Córdoba",
      imagen: "img/bici.jpg",
      imagenes: ["img/bici.jpg", "img/bici-b.jpg"],
      descripcion: "R29, 21 velocidades, frenos a disco. Armada y regulada. Retiro en taller o flete a cargo.",
      vendedor: { nombre: "Ciclos Sierras", ciudad: "Villa Carlos Paz", ventas: 88, reputacion: 4.9 },
      status: "activo"
    }
  ];
}

let productos = null;

function loadProductos() {
  if (productos) return productos;
  const raw = localStorage.getItem(PRODUCTOS_KEY);
  if (!raw) {
    productos = seedProductos().map(normalizeProducto);
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
    return productos;
  }
  productos = JSON.parse(raw).map(normalizeProducto);
  return productos;
}

function saveProductos(list) {
  if (Array.isArray(list)) productos = list;
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos || []));
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
