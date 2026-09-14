const STATUSES = [
  { id: "pedido", label: "Order" },
  { id: "faltante", label: "Shortage" },
  { id: "caja", label: "Cash" }
];

const COMPROBANTES = [
  { id: "FA", label: "Invoice A" },
  { id: "FB", label: "Invoice B" },
  { id: "FC", label: "Invoice C" }
];

const CATEGORIAS_PROD = [
  { id: "almacen", label: "Groceries" },
  { id: "verduleria", label: "Produce" },
  { id: "panaderia", label: "Bakery" },
  { id: "limpieza", label: "Cleaning" },
  { id: "bebidas", label: "Drinks" }
];

function seedProductos() {
  return [
    { id: "p1", nombre: "Long-grain rice", categoria: "almacen", precio: 1890, stock: 25, imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p2", nombre: "Fusilli pasta", categoria: "almacen", precio: 1250, stock: 40, imagen: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=180&h=120&fit=crop", unidad: "500g" },
    { id: "p3", nombre: "Sunflower oil", categoria: "almacen", precio: 2890, stock: 18, imagen: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=180&h=120&fit=crop", unidad: "1.5L" },
    { id: "p4", nombre: "Sugar", categoria: "almacen", precio: 1450, stock: 30, imagen: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p5", nombre: "Yerba mate", categoria: "almacen", precio: 4200, stock: 22, imagen: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p6", nombre: "All-purpose flour", categoria: "almacen", precio: 980, stock: 35, imagen: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p7", nombre: "Round tomatoes", categoria: "verduleria", precio: 1800, stock: 15, imagen: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p8", nombre: "Potatoes", categoria: "verduleria", precio: 950, stock: 50, imagen: "https://images.unsplash.com/photo-1518977676601-b53f82ber7da?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p9", nombre: "Onions", categoria: "verduleria", precio: 890, stock: 40, imagen: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p10", nombre: "Lettuce", categoria: "verduleria", precio: 650, stock: 12, imagen: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=180&h=120&fit=crop", unidad: "unit" },
    { id: "p11", nombre: "Fresh bread", categoria: "panaderia", precio: 1200, stock: 30, imagen: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=180&h=120&fit=crop", unidad: "kg" },
    { id: "p12", nombre: "Assorted pastries", categoria: "panaderia", precio: 350, stock: 48, imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=180&h=120&fit=crop", unidad: "unit" },
    { id: "p13", nombre: "Bleach", categoria: "limpieza", precio: 890, stock: 20, imagen: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=180&h=120&fit=crop", unidad: "1L" },
    { id: "p14", nombre: "Dish soap", categoria: "limpieza", precio: 1100, stock: 25, imagen: "https://images.unsplash.com/photo-1622560480654-f296c7f36f25?w=180&h=120&fit=crop", unidad: "750ml" },
    { id: "p15", nombre: "Cola", categoria: "bebidas", precio: 2500, stock: 36, imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=180&h=120&fit=crop", unidad: "2.25L" },
    { id: "p16", nombre: "Mineral water", categoria: "bebidas", precio: 980, stock: 48, imagen: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=180&h=120&fit=crop", unidad: "2L" },
    { id: "p17", nombre: "Juice carton", categoria: "bebidas", precio: 1350, stock: 24, imagen: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=180&h=120&fit=crop", unidad: "1L" }
  ];
}

function catLabelProd(cat) {
  return CATEGORIAS_PROD.find((c) => c.id === cat)?.label || cat;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function money(amount) {
  return "ARS " + Number(amount || 0).toLocaleString("en-US");
}

function seed() {
  return [
    {
      id: "c1",
      ticket: "PED-441",
      kind: "Supplier order",
      origin: "North Wholesale",
      due: "Today",
      status: "pedido",
      items: [
        { name: "Yerba 1 kg", qty: 12, missing: 0 },
        { name: "Sugar 1 kg", qty: 8, missing: 3 },
        { name: "Sunflower oil 900 ml", qty: 6, missing: 0 }
      ],
      note: "The delivery was incomplete. The missing sugar was not listed.",
      history: [{ when: "yesterday", text: "Partial delivery received. Three bags of sugar are missing." }]
    },
    {
      id: "c2",
      ticket: "GON-18",
      kind: "Shelf shortage",
      origin: "Dry goods aisle",
      due: "Today",
      status: "faltante",
      items: [
        { name: "Fusilli pasta", qty: 10, missing: 4 },
        { name: "Long-grain rice", qty: 8, missing: 0 },
        { name: "All-purpose flour", qty: 6, missing: 2 }
      ],
      note: "Three items from Tuesday’s order are still missing from the shelf.",
      history: [{ when: "today", text: "Shelf count completed. Two items are short." }]
    },
    {
      id: "c3",
      ticket: "CAJA-SAB",
      kind: "Cash closing",
      origin: "Register 1",
      due: "Saturday",
      status: "caja",
      items: [
        { name: "Declared cash", qty: 1, missing: 0 },
        { name: "Difference", qty: 1, missing: 1 }
      ],
      caja: { efectivo: 148200, tarjetas: 91200, declarado: 239400, contado: 238600 },
      note: "Saturday was not closed correctly. The difference still needs review.",
      history: [{ when: "Saturday", text: "Shift closed at the store without reconciliation." }]
    },
    {
      id: "c4",
      ticket: "PED-450",
      kind: "Supplier order",
      origin: "West Produce Farm",
      due: "Tomorrow",
      status: "pedido",
      items: [
        { name: "Tomatoes", qty: 2, missing: 2 },
        { name: "Lettuce", qty: 1, missing: 1 },
        { name: "Onions", qty: 3, missing: 0 }
      ],
      note: "The supplier has not confirmed the seasonal produce crates.",
      history: [{ when: "today", text: "Order added. Delivery is not confirmed yet." }]
    },
    {
      id: "c5",
      ticket: "GON-21",
      kind: "Shelf shortage",
      origin: "Front counter",
      due: "Today",
      status: "faltante",
      items: [
        { name: "Ibuprofen 400", qty: 4, missing: 0 },
        { name: "Rubbing alcohol 500 ml", qty: 6, missing: 1 }
      ],
      note: "The counter is stocked. Rubbing alcohol still needs to be counted.",
      history: [{ when: "today", text: "Counter restocking is partially complete." }]
    },
    {
      id: "c6",
      ticket: "CAJA-VIE",
      kind: "Cash closing",
      origin: "Register 1",
      due: "Friday",
      status: "caja",
      items: [
        { name: "Shift sales", qty: 1, missing: 0 },
        { name: "Difference", qty: 1, missing: 1 }
      ],
      caja: { efectivo: 121000, tarjetas: 76400, declarado: 197400, contado: 196850 },
      note: "Small Friday difference; the reason is still pending.",
      history: [{ when: "Friday", text: "Reconciliation has a difference. Reason pending." }]
    },
    {
      id: "c7",
      ticket: "PED-452",
      kind: "Supplier order",
      origin: "Neighborhood Bakery",
      due: "Today · 7:00 AM",
      status: "pedido",
      items: [
        { name: "Fresh bread", qty: 20, missing: 0 },
        { name: "Pastries", qty: 4, missing: 0 }
      ],
      note: "Early order. Confirm the trays on delivery.",
      history: [{ when: "last night", text: "Order placed for the first delivery." }]
    },
    {
      id: "c8",
      ticket: "GON-09",
      kind: "Shelf shortage",
      origin: "Cleaning",
      due: "Today",
      status: "faltante",
      items: [
        { name: "Bleach 1 L", qty: 8, missing: 3 },
        { name: "Dish soap", qty: 6, missing: 0 }
      ],
      note: "The shelf is empty. The case is in storage, not on the shop floor.",
      history: [{ when: "today", text: "Stock is in storage and has not reached the shelf." }]
    },
    {
      id: "c9",
      ticket: "CAJA-HOY",
      kind: "Shift reconciliation",
      origin: "Register 1",
      due: "Today",
      status: "caja",
      items: [],
      caja: { efectivo: 86400, tarjetas: 51200, declarado: 137600, contado: 137600 },
      note: "Morning shift. Register reconciled.",
      history: [{ when: "today", text: "Reconciliation closed with no difference." }]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("retail-demo-en-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("retail-demo-en-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw).map((item) => {
    if (item.status === "local") item.status = "faltante";
    return item;
  });
}

function save(items) {
  localStorage.setItem("retail-demo-en-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((item) => item.id === status)?.label || status;
}

function missingCount(item) {
  return (item.items || []).reduce((sum, line) => sum + Number(line.missing || 0), 0);
}

function cajaDiff(item) {
  const caja = item.caja || { declarado: 0, contado: 0 };
  return Number(caja.declarado || 0) - Number(caja.contado || 0);
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
