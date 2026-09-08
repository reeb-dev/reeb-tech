const STATUSES = [
  { id: "pedido", label: "Pedido" },
  { id: "local", label: "En local" },
  { id: "caja", label: "Caja" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

const CATEGORIAS_PROD = [
  { id: "almacen", label: "Almacén" },
  { id: "verduleria", label: "Verdulería" },
  { id: "panaderia", label: "Panadería" },
  { id: "limpieza", label: "Limpieza" },
  { id: "bebidas", label: "Bebidas" }
];

function seedProductos() {
  return [
    // Almacén
    { id: "p1", nombre: "Arroz largo fino", categoria: "almacen", precio: 1890, stock: 25, imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p2", nombre: "Fideos tirabuzón", categoria: "almacen", precio: 1250, stock: 40, imagen: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=180&h=120&fit=crop", unidad: "500g" },
    { id: "p3", nombre: "Aceite girasol", categoria: "almacen", precio: 2890, stock: 18, imagen: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=180&h=120&fit=crop", unidad: "1.5L" },
    { id: "p4", nombre: "Azúcar", categoria: "almacen", precio: 1450, stock: 30, imagen: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p5", nombre: "Yerba mate", categoria: "almacen", precio: 4200, stock: 22, imagen: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p6", nombre: "Harina 000", categoria: "almacen", precio: 980, stock: 35, imagen: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=180&h=120&fit=crop", unidad: "kg" },
    // Verdulería
    { id: "p7", nombre: "Tomate redondo", categoria: "verduleria", precio: 1800, stock: 15, imagen: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p8", nombre: "Papa", categoria: "verduleria", precio: 950, stock: 50, imagen: "https://images.unsplash.com/photo-1518977676601-b53f82ber7da?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p9", nombre: "Cebolla", categoria: "verduleria", precio: 890, stock: 40, imagen: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p10", nombre: "Lechuga", categoria: "verduleria", precio: 650, stock: 12, imagen: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=180&h=120&fit=crop", unidad: "unidad" },
    // Panadería
    { id: "p11", nombre: "Pan francés", categoria: "panaderia", precio: 1200, stock: 30, imagen: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p12", nombre: "Facturas surtidas", categoria: "panaderia", precio: 350, stock: 48, imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=180&h=120&fit=crop", unidad: "unidad" },
    // Limpieza
    { id: "p13", nombre: "Lavandina", categoria: "limpieza", precio: 890, stock: 20, imagen: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=180&h=120&fit=crop", unidad: "1L" },
    { id: "p14", nombre: "Detergente", categoria: "limpieza", precio: 1100, stock: 25, imagen: "https://images.unsplash.com/photo-1622560480654-f296c7f36f25?w=180&h=120&fit=crop", unidad: "750ml" },
    // Bebidas
    { id: "p15", nombre: "Gaseosa cola", categoria: "bebidas", precio: 2500, stock: 36, imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=180&h=120&fit=crop", unidad: "2.25L" },
    { id: "p16", nombre: "Agua mineral", categoria: "bebidas", precio: 980, stock: 48, imagen: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=180&h=120&fit=crop", unidad: "2L" },
    { id: "p17", nombre: "Jugo en caja", categoria: "bebidas", precio: 1350, stock: 24, imagen: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=180&h=120&fit=crop", unidad: "1L" }
  ];
}

function catLabelProd(cat) {
  return CATEGORIAS_PROD.find((c) => c.id === cat)?.label || cat;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function seed() {
  return [
    {
      id: "c1",
      ticket: "PED-441",
      kind: "Pedido a proveedor",
      origin: "Mayorista Norte",
      due: "Hoy",
      status: "pedido",
      items: [
        { name: "Yerba 1 kg", qty: 12, missing: 0 },
        { name: "Azúcar 1 kg", qty: 8, missing: 3 },
        { name: "Aceite 900 ml", qty: 6, missing: 0 }
      ],
      note: "Llegó incompleto. El faltante de azúcar no estaba anotado.",
      history: [{ when: "ayer", text: "Recepción parcial. Faltan 3 azúcar." }]
    },
    {
      id: "c2",
      ticket: "GON-18",
      kind: "Faltante de góndola",
      origin: "Pasillo seco",
      due: "Hoy",
      status: "local",
      items: [
        { name: "Fideos tirabuzón", qty: 10, missing: 4 },
        { name: "Arroz largo", qty: 8, missing: 0 },
        { name: "Harina 000", qty: 6, missing: 2 }
      ],
      note: "Tres artículos del pedido del martes siguen fuera de góndola.",
      history: [{ when: "hoy", text: "Conteo de góndola. Dos ítems en faltante." }]
    },
    {
      id: "c3",
      ticket: "CAJA-SAB",
      kind: "Cierre de caja",
      origin: "Caja 1",
      due: "Sábado",
      status: "caja",
      items: [
        { name: "Efectivo declarado", qty: 1, missing: 0 },
        { name: "Diferencia", qty: 1, missing: 1 }
      ],
      note: "El sábado no se cerró. La diferencia quedó sin anotar.",
      history: [{ when: "sábado", text: "Turno cerrado en el local. Caja sin arqueo." }]
    },
    {
      id: "c4",
      ticket: "PED-450",
      kind: "Pedido a proveedor",
      origin: "Quinta del Oeste",
      due: "Mañana",
      status: "pedido",
      items: [
        { name: "Tomate", qty: 2, missing: 2 },
        { name: "Lechuga", qty: 1, missing: 1 },
        { name: "Cebolla", qty: 3, missing: 0 }
      ],
      note: "El proveedor no confirmó los cajones de estación.",
      history: [{ when: "hoy", text: "Pedido cargado. Sin confirmación de entrega." }]
    },
    {
      id: "c5",
      ticket: "GON-21",
      kind: "Faltante de góndola",
      origin: "Mostrador",
      due: "Hoy",
      status: "local",
      items: [
        { name: "Ibuprofeno 400", qty: 4, missing: 0 },
        { name: "Alcohol 500 ml", qty: 6, missing: 1 }
      ],
      note: "El mostrador está cubierto. Falta el conteo del alcohol.",
      history: [{ when: "hoy", text: "Reposición de mostrador a medias." }]
    },
    {
      id: "c6",
      ticket: "CAJA-VIE",
      kind: "Cierre de caja",
      origin: "Caja 1",
      due: "Viernes",
      status: "caja",
      items: [
        { name: "Ventas del turno", qty: 1, missing: 0 },
        { name: "Diferencia", qty: 1, missing: 1 }
      ],
      note: "Diferencia chica del viernes, todavía sin motivo.",
      history: [{ when: "viernes", text: "Arqueo con diferencia. Motivo pendiente." }]
    },
    {
      id: "c7",
      ticket: "PED-452",
      kind: "Pedido a proveedor",
      origin: "Panadería del barrio",
      due: "Hoy · 7:00",
      status: "pedido",
      items: [
        { name: "Pan francés", qty: 20, missing: 0 },
        { name: "Facturas", qty: 4, missing: 0 }
      ],
      note: "Pedido de madrugada. Confirmar bandejas al recibir.",
      history: [{ when: "anoche", text: "Pedido dejado para la primera entrega." }]
    },
    {
      id: "c8",
      ticket: "GON-09",
      kind: "Faltante de góndola",
      origin: "Limpieza",
      due: "Hoy",
      status: "local",
      items: [
        { name: "Lavandina 1 L", qty: 8, missing: 3 },
        { name: "Detergente", qty: 6, missing: 0 }
      ],
      note: "Hay hueco en la góndola. El bulto está en depósito, no en sala.",
      history: [{ when: "hoy", text: "Stock en depósito, no repuesto en sala." }]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("comercio-demo-v2");
  if (!raw) {
    const data = seed();
    localStorage.setItem("comercio-demo-v2", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("comercio-demo-v2", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((item) => item.id === status)?.label || status;
}

function missingCount(item) {
  return (item.items || []).reduce((sum, line) => sum + Number(line.missing || 0), 0);
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
