const STATUSES = [
  { id: "activo", label: "Activo" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" },
  { id: "discontinuado", label: "Discontinuado" }
];

const CATEGORIAS = [
  { id: "electronica", label: "Electrónica" },
  { id: "indumentaria", label: "Indumentaria" },
  { id: "alimentos", label: "Alimentos" },
  { id: "limpieza", label: "Limpieza" },
  { id: "oficina", label: "Oficina" },
  { id: "herramientas", label: "Herramientas" },
  { id: "otros", label: "Otros" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "NC", label: "Nota de Crédito" },
  { id: "ND", label: "Nota de Débito" },
  { id: "RE", label: "Remito" }
];

const MOVIMIENTOS = [
  { id: "ingreso", label: "Ingreso" },
  { id: "egreso", label: "Egreso" },
  { id: "ajuste", label: "Ajuste" },
  { id: "devolucion", label: "Devolución" }
];

function seedProductos() {
  return [
    {
      id: "prod1",
      codigo: "ELEC-001",
      nombre: "Monitor LED 24\"",
      categoria: "electronica",
      detalle: "Pantalla LED 24 pulgadas Full HD, entrada HDMI y VGA. Ideal para oficina o punto de venta.",
      img: "img/monitor.jpg",
      precioCompra: 185000,
      precioVenta: 245000,
      stock: 8,
      minimo: 5,
      ubicacion: "Depósito A - Estante 3",
      proveedor: "Tech Distribuidora",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 10, fecha: "1 sep", nota: "Compra inicial" },
        { tipo: "egreso", cantidad: 2, fecha: "5 sep", nota: "Venta FA-0001-00000123" }
      ]
    },
    {
      id: "prod2",
      codigo: "ELEC-002",
      nombre: "Teclado mecánico RGB",
      categoria: "electronica",
      detalle: "Teclado mecánico con switches lineales e iluminación RGB. Cable USB.",
      img: "img/teclado.jpg",
      precioCompra: 45000,
      precioVenta: 68000,
      stock: 3,
      minimo: 5,
      ubicacion: "Depósito A - Estante 2",
      proveedor: "Tech Distribuidora",
      status: "bajo",
      movimientos: [
        { tipo: "ingreso", cantidad: 10, fecha: "15 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 7, fecha: "3 sep", nota: "Ventas varias" }
      ]
    },
    {
      id: "prod3",
      codigo: "IND-015",
      nombre: "Remera algodón M",
      categoria: "indumentaria",
      detalle: "Remera de algodón peinado, talle M, cuello redondo. Pack de venta unitaria.",
      img: "img/remera.jpg",
      precioCompra: 8500,
      precioVenta: 15000,
      stock: 25,
      minimo: 10,
      ubicacion: "Depósito B - Percha 1",
      proveedor: "Textil Sur",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 50, fecha: "20 ago", nota: "Temporada nueva" },
        { tipo: "egreso", cantidad: 25, fecha: "7 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod4",
      codigo: "LIM-008",
      nombre: "Detergente 5L",
      categoria: "limpieza",
      detalle: "Detergente líquido concentrado en bidón de 5 litros. Uso doméstico y comercial.",
      img: "img/detergente.jpg",
      precioCompra: 4200,
      precioVenta: 6800,
      stock: 0,
      minimo: 8,
      ubicacion: "Depósito C",
      proveedor: "Limpieza Total",
      status: "agotado",
      movimientos: [
        { tipo: "ingreso", cantidad: 20, fecha: "1 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 20, fecha: "6 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod5",
      codigo: "OFI-022",
      nombre: "Resma A4 500 hojas",
      categoria: "oficina",
      detalle: "Resma de papel A4 75 g, 500 hojas. Apta para impresora láser e inkjet.",
      img: "img/resma.jpg",
      precioCompra: 5800,
      precioVenta: 8500,
      stock: 45,
      minimo: 20,
      ubicacion: "Depósito A - Estante 5",
      proveedor: "Papelera Centro",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 100, fecha: "25 ago", nota: "Compra mayorista" },
        { tipo: "egreso", cantidad: 55, fecha: "7 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod6",
      codigo: "HER-005",
      nombre: "Taladro percutor 750W",
      categoria: "herramientas",
      detalle: "Taladro percutor 750 W con mandril de 13 mm. Uso profesional en obra y taller.",
      img: "img/taladro.jpg",
      precioCompra: 125000,
      precioVenta: 185000,
      stock: 4,
      minimo: 3,
      ubicacion: "Depósito D - Caja 2",
      proveedor: "Ferretería Norte",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 5, fecha: "10 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 1, fecha: "4 sep", nota: "Venta" }
      ]
    },
    {
      id: "prod7",
      codigo: "ALI-011",
      nombre: "Café en grano 1 kg",
      categoria: "alimentos",
      detalle: "Café en grano tostado, bolsa de 1 kg. Blend de cafetería, molienda a pedido.",
      img: "img/cafe.jpg",
      precioCompra: 9800,
      precioVenta: 14500,
      stock: 2,
      minimo: 6,
      ubicacion: "Depósito C - Estante 1",
      proveedor: "Mayorista del Centro",
      status: "bajo",
      movimientos: [
        { tipo: "ingreso", cantidad: 12, fecha: "20 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 10, fecha: "6 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod8",
      codigo: "OFI-030",
      nombre: "Toner láser negro",
      categoria: "oficina",
      detalle: "Cartucho de tóner láser negro compatible. Rendimiento estimado 2000 páginas.",
      img: "img/toner.jpg",
      precioCompra: 32000,
      precioVenta: 48000,
      stock: 1,
      minimo: 4,
      ubicacion: "Depósito A - Cajón 8",
      proveedor: "Papelera Centro",
      status: "bajo",
      movimientos: [
        { tipo: "ingreso", cantidad: 6, fecha: "12 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 5, fecha: "5 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod9",
      codigo: "ALI-020",
      nombre: "Aceite de girasol 1,5 L",
      categoria: "alimentos",
      detalle: "Aceite de girasol en botella de 1,5 litros. Venta unitaria y por bulto de 12.",
      img: "img/aceite.jpg",
      precioCompra: 2100,
      precioVenta: 3400,
      stock: 48,
      minimo: 12,
      ubicacion: "Depósito C - Góndola 2",
      proveedor: "Mayorista del Centro",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 60, fecha: "28 ago", nota: "Compra mayorista" },
        { tipo: "egreso", cantidad: 12, fecha: "6 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod10",
      codigo: "ALI-021",
      nombre: "Harina 000 25 kg",
      categoria: "alimentos",
      detalle: "Harina de trigo 000 en bolsa de 25 kg. Pensada para panadería y reventa.",
      img: "img/harina.jpg",
      precioCompra: 18500,
      precioVenta: 24800,
      stock: 16,
      minimo: 6,
      ubicacion: "Depósito C - Pallet 1",
      proveedor: "Molinos del Sur",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 20, fecha: "22 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 4, fecha: "5 sep", nota: "Ventas" }
      ]
    },
    {
      id: "prod11",
      codigo: "OTR-004",
      nombre: "Cajas de cartón 40×30×25",
      categoria: "otros",
      detalle: "Cajas de cartón corrugado 40 × 30 × 25 cm. Pack de 10 unidades, listas para despacho.",
      img: "img/cajas.jpg",
      precioCompra: 4200,
      precioVenta: 6900,
      stock: 80,
      minimo: 20,
      ubicacion: "Depósito D - Zona packing",
      proveedor: "Envases del Plata",
      status: "activo",
      movimientos: [
        { tipo: "ingreso", cantidad: 100, fecha: "18 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 20, fecha: "7 sep", nota: "Despachos" }
      ]
    },
    {
      id: "prod12",
      codigo: "ALI-022",
      nombre: "Arroz largo fino 1 kg",
      categoria: "alimentos",
      detalle: "Arroz largo fino en bolsa de 1 kg. Paquete para góndola o reventa kiosco.",
      img: "img/arroz.jpg",
      precioCompra: 1450,
      precioVenta: 2300,
      stock: 5,
      minimo: 10,
      ubicacion: "Depósito C - Estante 4",
      proveedor: "Mayorista del Centro",
      status: "bajo",
      movimientos: [
        { tipo: "ingreso", cantidad: 24, fecha: "25 ago", nota: "Compra" },
        { tipo: "egreso", cantidad: 19, fecha: "7 sep", nota: "Ventas" }
      ]
    }
  ];
}

function seedFacturas() {
  return [
    {
      id: "fac1",
      tipo: "FA",
      numero: "0001-00000156",
      fecha: "7 sep",
      cliente: { nombre: "Sistemas del Sur SRL", cuit: "30-71234567-8", direccion: "Av. Mitre 1200, Avellaneda" },
      items: [
        { codigo: "ELEC-001", nombre: "Monitor LED 24\"", cantidad: 2, precio: 245000 },
        { codigo: "ELEC-002", nombre: "Teclado mecánico RGB", cantidad: 3, precio: 68000 }
      ],
      subtotal: 694000,
      iva: 145740,
      total: 839740,
      cae: "74185296301234",
      vencimientoCae: "17 sep",
      status: "emitida",
      pagada: false
    },
    {
      id: "fac2",
      tipo: "FB",
      numero: "0002-00000089",
      fecha: "6 sep",
      cliente: { nombre: "Juan Pérez", cuit: "", direccion: "Consumidor Final" },
      items: [
        { codigo: "IND-015", nombre: "Remera algodón M", cantidad: 5, precio: 15000 },
        { codigo: "OFI-022", nombre: "Resma A4 500 hojas", cantidad: 2, precio: 8500 }
      ],
      subtotal: 92000,
      iva: 0,
      total: 92000,
      cae: "74185296301235",
      vencimientoCae: "16 sep",
      status: "emitida",
      pagada: true
    },
    {
      id: "fac3",
      tipo: "FA",
      numero: "0001-00000155",
      fecha: "4 sep",
      cliente: { nombre: "Constructora Norte SA", cuit: "30-65432198-1", direccion: "Ruta 8 km 32, Pilar" },
      items: [
        { codigo: "HER-005", nombre: "Taladro percutor 750W", cantidad: 1, precio: 185000 }
      ],
      subtotal: 185000,
      iva: 38850,
      total: 223850,
      cae: "74185296301233",
      vencimientoCae: "14 sep",
      status: "emitida",
      pagada: true
    },
    {
      id: "fac4",
      tipo: "NC",
      numero: "0001-00000012",
      fecha: "5 sep",
      cliente: { nombre: "Sistemas del Sur SRL", cuit: "30-71234567-8", direccion: "Av. Mitre 1200, Avellaneda" },
      items: [
        { codigo: "ELEC-002", nombre: "Teclado mecánico RGB", cantidad: 1, precio: 68000, nota: "Devuelto por defecto" }
      ],
      subtotal: -68000,
      iva: -14280,
      total: -82280,
      cae: "74185296301236",
      vencimientoCae: "15 sep",
      status: "emitida",
      pagada: false,
      relacionada: "FA 0001-00000154"
    }
  ];
}

let productos = null;
let facturas = null;

function hydrateProductos(list) {
  const seeded = seedProductos();
  const byId = Object.fromEntries(seeded.map((p) => [p.id, p]));
  const ids = new Set((list || []).map((p) => p.id));
  const merged = (list || []).map((p) => {
    const seed = byId[p.id];
    if (!seed) return p;
    return {
      ...p,
      img: p.img || seed.img,
      detalle: p.detalle || seed.detalle
    };
  });
  seeded.forEach((p) => {
    if (!ids.has(p.id)) merged.push(p);
  });
  return merged;
}

function loadProductos() {
  if (productos) return productos;
  const raw = localStorage.getItem("stockfac-productos-v2");
  if (!raw) {
    productos = seedProductos();
    localStorage.setItem("stockfac-productos-v2", JSON.stringify(productos));
    return productos;
  }
  productos = hydrateProductos(JSON.parse(raw));
  localStorage.setItem("stockfac-productos-v2", JSON.stringify(productos));
  return productos;
}

function saveProductos(list) {
  productos = list || productos;
  localStorage.setItem("stockfac-productos-v2", JSON.stringify(productos));
}

function loadFacturas() {
  if (facturas) return facturas;
  const raw = localStorage.getItem("stockfac-facturas-v2");
  if (!raw) {
    facturas = seedFacturas();
    localStorage.setItem("stockfac-facturas-v2", JSON.stringify(facturas));
    return facturas;
  }
  facturas = JSON.parse(raw);
  return facturas;
}

function saveFacturas(list) {
  facturas = list || facturas;
  localStorage.setItem("stockfac-facturas-v2", JSON.stringify(facturas));
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

function movLabel(mov) {
  return MOVIMIENTOS.find((m) => m.id === mov)?.label || mov;
}

function stockStatus(prod) {
  if (prod.status === "discontinuado") return "discontinuado";
  if (prod.stock === 0) return "agotado";
  if (prod.stock < prod.minimo) return "bajo";
  return "activo";
}

function restockAlerts(list) {
  return (list || []).filter((prod) => {
    const status = stockStatus(prod);
    return status === "bajo" || status === "agotado";
  });
}

function allMovimientos(list) {
  return (list || []).flatMap((prod) => (prod.movimientos || []).map((mov) => ({
    ...mov,
    codigo: prod.codigo,
    nombre: prod.nombre,
    prodId: prod.id
  })));
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
