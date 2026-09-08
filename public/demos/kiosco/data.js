const STATUSES = [
  { id: "stock", label: "En stock" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" },
  { id: "fiado", label: "Fiado" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" }
];

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

const CATEGORIAS = [
  { id: "golosinas", label: "Golosinas" },
  { id: "bebidas", label: "Bebidas" },
  { id: "cigarrillos", label: "Cigarrillos" },
  { id: "almacen", label: "Almacén" },
  { id: "limpieza", label: "Limpieza" },
  { id: "varios", label: "Varios" }
];

function seed() {
  return [
    {
      id: "k1",
      codigo: "GOL-001",
      nombre: "Alfajor triple chocolate",
      categoria: "golosinas",
      precio: 850,
      stock: 24,
      minimo: 10,
      proveedor: "Distribuidora Norte",
      status: "stock",
      fiado: null,
      history: [
        { when: "7 sep", text: "Reposición: +48 unidades." },
        { when: "2 sep", text: "Venta: 12 unidades." }
      ]
    },
    {
      id: "k2",
      codigo: "BEB-015",
      nombre: "Coca-Cola 500ml",
      categoria: "bebidas",
      precio: 1200,
      stock: 8,
      minimo: 12,
      proveedor: "Distribuidora Sur",
      status: "bajo",
      fiado: null,
      history: [
        { when: "8 sep", text: "Stock bajo. Pedir al proveedor." }
      ]
    },
    {
      id: "k3",
      codigo: "CIG-003",
      nombre: "Marlboro Box 20",
      categoria: "cigarrillos",
      precio: 3500,
      stock: 15,
      minimo: 10,
      proveedor: "Tabacalera Central",
      status: "stock",
      fiado: null,
      history: [
        { when: "6 sep", text: "Reposición: +30 atados." }
      ]
    },
    {
      id: "k4",
      codigo: "ALM-022",
      nombre: "Yerba 1kg",
      categoria: "almacen",
      precio: 4200,
      stock: 0,
      minimo: 5,
      proveedor: "Mayorista Centro",
      status: "agotado",
      fiado: null,
      history: [
        { when: "8 sep", text: "Agotado. Pedido pendiente." },
        { when: "5 sep", text: "Últimas 2 unidades vendidas." }
      ]
    },
    {
      id: "k5",
      codigo: "GOL-008",
      nombre: "Caramelos surtidos x100",
      categoria: "golosinas",
      precio: 2800,
      stock: 3,
      minimo: 5,
      proveedor: "Distribuidora Norte",
      status: "bajo",
      fiado: null,
      history: [
        { when: "7 sep", text: "Venta: bolsa completa al almacén de la esquina." }
      ]
    },
    {
      id: "k6",
      codigo: "BEB-020",
      nombre: "Agua mineral 1.5L",
      categoria: "bebidas",
      precio: 900,
      stock: 20,
      minimo: 15,
      proveedor: "Distribuidora Sur",
      status: "stock",
      fiado: null,
      history: [
        { when: "6 sep", text: "Reposición completa." }
      ]
    },
    {
      id: "k7",
      codigo: "FIADO-001",
      nombre: "Compra de Ramírez",
      categoria: "varios",
      precio: 4500,
      stock: 0,
      minimo: 0,
      proveedor: "",
      status: "fiado",
      fiado: { cliente: "Juan Ramírez", fecha: "5 sep", items: "Cigarrillos, bebidas, pan" },
      history: [
        { when: "5 sep", text: "Fiado anotado. Dice que paga el viernes." }
      ]
    },
    {
      id: "k8",
      codigo: "LIM-005",
      nombre: "Lavandina 1L",
      categoria: "limpieza",
      precio: 1100,
      stock: 12,
      minimo: 8,
      proveedor: "Mayorista Centro",
      status: "stock",
      fiado: null,
      history: [
        { when: "4 sep", text: "En góndola." }
      ]
    },
    {
      id: "k9",
      codigo: "FIADO-002",
      nombre: "Cuenta de Doña Marta",
      categoria: "varios",
      precio: 8200,
      stock: 0,
      minimo: 0,
      proveedor: "",
      status: "fiado",
      fiado: { cliente: "Marta López", fecha: "1 sep", items: "Varias compras de la semana" },
      history: [
        { when: "7 sep", text: "Agregó $2.500 más a la cuenta." },
        { when: "1 sep", text: "Cuenta abierta." }
      ]
    },
    {
      id: "k10",
      codigo: "ALM-030",
      nombre: "Aceite girasol 1.5L",
      categoria: "almacen",
      precio: 3800,
      stock: 6,
      minimo: 4,
      proveedor: "Mayorista Centro",
      status: "stock",
      fiado: null,
      history: [
        { when: "3 sep", text: "Precio actualizado." }
      ]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("kiosco-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("kiosco-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("kiosco-demo-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
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

function stockStatus(item) {
  if (item.status === "fiado") return "fiado";
  if (item.stock === 0) return "agotado";
  if (item.stock < item.minimo) return "bajo";
  return "stock";
}
