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
