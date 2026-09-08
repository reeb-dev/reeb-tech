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
    productos = seedProductos();
    localStorage.setItem("marketplace-productos-v1", JSON.stringify(productos));
    return productos;
  }
  return productos = JSON.parse(raw);
}

function saveProductos() {
  localStorage.setItem("marketplace-productos-v1", JSON.stringify(productos));
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
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
