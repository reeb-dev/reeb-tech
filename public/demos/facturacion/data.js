const STATUSES = [
  { id: "borrador", label: "Borrador" },
  { id: "emitido", label: "Emitido" },
  { id: "cobrar", label: "A cobrar" }
];

const TYPES = ["Factura A", "Factura B", "Nota de crédito"];

function seed() {
  return [
    {
      id: "f1",
      type: "Factura A",
      number: "0001-00001044",
      receptor: "Taller Sur",
      cuit: "30-00000001-1",
      amount: 186000,
      due: "2026-09-12",
      status: "cobrar",
      aviso: "Vence esta semana. No hay aviso de cobro.",
      history: [{ when: "1 sep", text: "Emitida. Sin aviso de vencimiento." }]
    },
    {
      id: "f2",
      type: "Factura B",
      number: "0002-00000220",
      receptor: "Oficina del Parque",
      cuit: "27-00000002-2",
      amount: 42500,
      due: "2026-09-18",
      status: "emitido",
      aviso: "Falta enviar el comprobante al receptor.",
      history: [{ when: "4 sep", text: "Emitida. Pendiente de envío." }]
    },
    {
      id: "f3",
      type: "Nota de crédito",
      number: "0003-00000018",
      receptor: "Estudio Loma",
      cuit: "30-00000003-3",
      amount: 9000,
      due: "",
      status: "borrador",
      aviso: "Hay que anular un ítem. El motivo no está escrito.",
      history: [{ when: "5 sep", text: "Borrador abierto. Motivo pendiente." }]
    },
    {
      id: "f4",
      type: "Factura A",
      number: "0001-00001102",
      receptor: "Local Belgrano",
      cuit: "30-00000004-4",
      amount: 73000,
      due: "2026-09-10",
      status: "emitido",
      aviso: "Emitida. El receptor no acusó recibo.",
      history: [{ when: "3 sep", text: "Emitida y numerada." }]
    },
    {
      id: "f5",
      type: "Factura B",
      number: "0002-00000088",
      receptor: "Consultorio Norte",
      cuit: "27-00000005-5",
      amount: 15000,
      due: "2026-09-06",
      status: "cobrar",
      aviso: "Pasó el vencimiento. Falta el aviso de cobro.",
      history: [{ when: "6 sep", text: "Vencida. Aviso no enviado." }]
    },
    {
      id: "f6",
      type: "Factura A",
      number: "0001-00000990",
      receptor: "Depósito Central",
      cuit: "30-00000006-6",
      amount: 210000,
      due: "2026-09-28",
      status: "borrador",
      aviso: "Falta el detalle del ítem antes de emitir.",
      history: [{ when: "7 sep", text: "Borrador. Ítem sin descripción." }]
    },
    {
      id: "f7",
      type: "Factura B",
      number: "0002-00000301",
      receptor: "Librería Plaza",
      cuit: "27-00000007-7",
      amount: 28400,
      due: "2026-09-15",
      status: "emitido",
      aviso: "Enviada. Sin novedad de cobro.",
      history: [{ when: "2 sep", text: "Emitida y enviada." }]
    },
    {
      id: "f8",
      type: "Factura A",
      number: "0001-00001088",
      receptor: "Taller Oeste",
      cuit: "30-00000008-8",
      amount: 54000,
      due: "2026-09-08",
      status: "cobrar",
      aviso: "Vencimiento de hoy. Preparar aviso.",
      history: [{ when: "8 sep", text: "Pasa a cobro. Aviso sin redactar." }]
    }
  ];
}

function money(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatDue(value) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" }).format(date);
}

function load() {
  const raw = localStorage.getItem("facturacion-demo-v2");
  if (!raw) {
    const data = seed();
    localStorage.setItem("facturacion-demo-v2", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("facturacion-demo-v2", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((item) => item.id === status)?.label || status;
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
