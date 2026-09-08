const STORAGE_KEY = "facturacion-demo-v3";

const EMISOR = {
  razon: "Libro Sur SRL",
  cuit: "30-71582391-4",
  iva: "IVA Responsable Inscripto",
  domicilio: "Av. Callao 1240, Recoleta, CABA",
  iibb: "901-715823-7",
  inicio: "12/03/2019",
  ptoVta: "0001"
};

const STATUSES = [
  { id: "borrador", label: "Borrador" },
  { id: "emitido", label: "Emitido" },
  { id: "cobrar", label: "A cobrar" },
  { id: "cobrado", label: "Cobrado" }
];

const TYPES = [
  { id: "FA", label: "Factura A", letra: "A", codigo: "01", pto: "0001" },
  { id: "FB", label: "Factura B", letra: "B", codigo: "06", pto: "0002" },
  { id: "NC", label: "Nota de crédito", letra: "NC", codigo: "03", pto: "0003" }
];

function typeMeta(label) {
  return TYPES.find((item) => item.label === label || item.id === label) || TYPES[1];
}

function seed() {
  return [
    {
      id: "f1",
      type: "Factura A",
      number: "0001-00001044",
      receptor: "Taller Sur S.A.",
      cuit: "30-68741230-1",
      ivaCond: "IVA Responsable Inscripto",
      amount: 186000,
      due: "2026-09-12",
      status: "cobrar",
      cae: "74182936501247",
      caeVto: "2026-09-21",
      emitted: "2026-09-01",
      aviso: "Vence esta semana. Todavía no hay aviso de cobro.",
      lines: [
        { desc: "Mantenimiento de red · 40 h", qty: 1, pu: 153719 }
      ],
      history: [
        { when: "1 sep", text: "Emitida con CAE 74182936501247." },
        { when: "8 sep", text: "Pasó a a cobrar. Sin aviso enviado." }
      ]
    },
    {
      id: "f2",
      type: "Factura B",
      number: "0002-00000220",
      receptor: "Oficina del Parque",
      cuit: "27-39451208-2",
      ivaCond: "Consumidor Final",
      amount: 42500,
      due: "2026-09-18",
      status: "emitido",
      cae: "74182936501881",
      caeVto: "2026-09-24",
      emitted: "2026-09-04",
      aviso: "Falta enviar el PDF al receptor.",
      lines: [
        { desc: "Honorarios mensuales septiembre", qty: 1, pu: 42500 }
      ],
      history: [{ when: "4 sep", text: "Emitida. Pendiente de envío." }]
    },
    {
      id: "f3",
      type: "Nota de crédito",
      number: "0003-00000018",
      receptor: "Estudio Loma",
      cuit: "30-70124588-3",
      ivaCond: "IVA Responsable Inscripto",
      amount: 9000,
      due: "",
      status: "borrador",
      cae: "",
      caeVto: "",
      emitted: "",
      aviso: "Hay que anular un ítem duplicado. El motivo no está cerrado.",
      lines: [
        { desc: "Anulación ítem duplicado FA 0001-00000990", qty: 1, pu: 9000 }
      ],
      history: [{ when: "5 sep", text: "Borrador abierto. Motivo pendiente." }]
    },
    {
      id: "f4",
      type: "Factura A",
      number: "0001-00001102",
      receptor: "Local Belgrano S.R.L.",
      cuit: "30-71200944-4",
      ivaCond: "IVA Responsable Inscripto",
      amount: 73000,
      due: "2026-09-20",
      status: "emitido",
      cae: "74182936502014",
      caeVto: "2026-09-23",
      emitted: "2026-09-03",
      aviso: "Emitida. El receptor no acusó recibo.",
      lines: [
        { desc: "Desarrollo de informe de stock", qty: 1, pu: 60331 }
      ],
      history: [{ when: "3 sep", text: "Emitida y numerada." }]
    },
    {
      id: "f5",
      type: "Factura B",
      number: "0002-00000088",
      receptor: "Consultorio Norte",
      cuit: "27-32881109-5",
      ivaCond: "Monotributo",
      amount: 15000,
      due: "2026-09-06",
      status: "cobrar",
      cae: "74182936500902",
      caeVto: "2026-09-16",
      emitted: "2026-08-27",
      aviso: "Pasó el vencimiento. Falta el aviso de cobro.",
      lines: [
        { desc: "Soporte de facturación · agosto", qty: 1, pu: 15000 }
      ],
      history: [{ when: "6 sep", text: "Vencida. Aviso no enviado." }]
    },
    {
      id: "f6",
      type: "Factura A",
      number: "0001-00000990",
      receptor: "Depósito Central S.A.",
      cuit: "30-69881220-6",
      ivaCond: "IVA Responsable Inscripto",
      amount: 210000,
      due: "2026-09-28",
      status: "borrador",
      cae: "",
      caeVto: "",
      emitted: "",
      aviso: "Falta el detalle del ítem antes de emitir.",
      lines: [
        { desc: "Implementación de libro de ventas", qty: 1, pu: 173554 }
      ],
      history: [{ when: "7 sep", text: "Borrador. Ítem sin cerrar." }]
    },
    {
      id: "f7",
      type: "Factura B",
      number: "0002-00000301",
      receptor: "Librería Plaza",
      cuit: "27-40112233-7",
      ivaCond: "Consumidor Final",
      amount: 28400,
      due: "2026-09-15",
      status: "emitido",
      cae: "74182936501660",
      caeVto: "2026-09-22",
      emitted: "2026-09-02",
      aviso: "Enviada. Sin novedad de cobro.",
      lines: [
        { desc: "Alta de punto de venta y tickets", qty: 1, pu: 28400 }
      ],
      history: [{ when: "2 sep", text: "Emitida y enviada." }]
    },
    {
      id: "f8",
      type: "Factura A",
      number: "0001-00001088",
      receptor: "Taller Oeste S.A.",
      cuit: "30-70553311-8",
      ivaCond: "IVA Responsable Inscripto",
      amount: 54000,
      due: "2026-09-08",
      status: "cobrar",
      cae: "74182936501440",
      caeVto: "2026-09-18",
      emitted: "2026-08-29",
      aviso: "Vencimiento de hoy. Preparar aviso.",
      lines: [
        { desc: "Ajuste de comprobantes y NC", qty: 1, pu: 44628 }
      ],
      history: [{ when: "8 sep", text: "Pasa a cobro. Aviso sin redactar." }]
    },
    {
      id: "f9",
      type: "Factura B",
      number: "0002-00000155",
      receptor: "Consultorio del Bajo",
      cuit: "27-35667788-9",
      ivaCond: "Monotributo",
      amount: 19800,
      due: "2026-08-30",
      status: "cobrado",
      cae: "74182936500771",
      caeVto: "2026-09-09",
      emitted: "2026-08-20",
      aviso: "Cobrado el 2 de septiembre por transferencia.",
      lines: [
        { desc: "Honorarios agosto", qty: 1, pu: 19800 }
      ],
      history: [
        { when: "20 ago", text: "Emitida con CAE 74182936500771." },
        { when: "2 sep", text: "Marcada como cobrada." }
      ]
    },
    {
      id: "f10",
      type: "Nota de crédito",
      number: "0003-00000012",
      receptor: "Oficina del Parque",
      cuit: "27-39451208-2",
      ivaCond: "Consumidor Final",
      amount: 4500,
      due: "",
      status: "emitido",
      cae: "74182936501705",
      caeVto: "2026-09-20",
      emitted: "2026-09-05",
      aviso: "NC por descuento de honorarios. Ya enviada.",
      lines: [
        { desc: "Descuento sobre FB 0002-00000220", qty: 1, pu: 4500 }
      ],
      history: [{ when: "5 sep", text: "NC emitida y asociada a la FB 220." }]
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

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function isOverdue(item) {
  if (!item?.due || item.status === "cobrado" || item.status === "borrador") return false;
  return item.due < todayISO();
}

function breakdown(item) {
  const total = Number(item?.amount) || 0;
  if (item?.type === "Factura A") {
    const neto = Math.round(total / 1.21);
    return { neto, iva: total - neto, total };
  }
  return { neto: total, iva: 0, total };
}

function generateCae() {
  let digits = "74";
  while (digits.length < 14) digits += String(Math.floor(Math.random() * 10));
  return digits;
}

function caeVtoFrom(emitted) {
  const base = emitted ? new Date(`${emitted}T00:00:00`) : new Date();
  if (Number.isNaN(base.getTime())) base.setTime(Date.now());
  base.setDate(base.getDate() + 10);
  const month = String(base.getMonth() + 1).padStart(2, "0");
  const day = String(base.getDate()).padStart(2, "0");
  return `${base.getFullYear()}-${month}-${day}`;
}

function nextNumber(items, type) {
  const meta = typeMeta(type);
  const used = (items || [])
    .filter((item) => item.type === meta.label)
    .map((item) => Number(String(item.number || "").split("-")[1] || 0));
  const next = Math.max(0, ...used) + 1;
  return `${meta.pto}-${String(next).padStart(8, "0")}`;
}

function normalize(item) {
  const meta = typeMeta(item.type);
  return {
    id: item.id || crypto.randomUUID(),
    type: meta.label,
    number: item.number || "",
    receptor: item.receptor || "",
    cuit: item.cuit || "",
    ivaCond: item.ivaCond || (meta.id === "FA" ? "IVA Responsable Inscripto" : "Consumidor Final"),
    amount: Number(item.amount) || 0,
    due: item.due || "",
    status: STATUSES.some((s) => s.id === item.status) ? item.status : "borrador",
    cae: item.cae || "",
    caeVto: item.caeVto || "",
    emitted: item.emitted || "",
    aviso: item.aviso || "",
    lines: Array.isArray(item.lines) && item.lines.length
      ? item.lines
      : [{ desc: item.aviso || meta.label, qty: 1, pu: Number(item.amount) || 0 }],
    history: Array.isArray(item.history) ? item.history : []
  };
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      const data = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    return parsed.map(normalize);
  } catch {
    const data = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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

function renderComprobante(item, opts) {
  const compact = opts?.compact;
  const meta = typeMeta(item.type);
  const moneyParts = breakdown(item);
  const overdue = isOverdue(item);
  const lines = (item.lines || []).map((line) => `
    <tr>
      <td>${esc(line.desc)}</td>
      <td class="num">${esc(line.qty)}</td>
      <td class="num">${esc(money(line.pu))}</td>
    </tr>`).join("");

  return `
    <article class="voucher letra-${esc(meta.letra.toLowerCase())} ${compact ? "compact" : ""} ${overdue ? "overdue" : ""}">
      <header class="voucher-head">
        <div class="voucher-emisor">
          <strong>${esc(EMISOR.razon)}</strong>
          <span>${esc(EMISOR.domicilio)}</span>
          <span>CUIT ${esc(EMISOR.cuit)} · ${esc(EMISOR.iva)}</span>
        </div>
        <div class="voucher-letra">
          <b>${esc(meta.letra)}</b>
          <span>COD ${esc(meta.codigo)}</span>
          <small>ORIGINAL</small>
        </div>
        <div class="voucher-num">
          <span>${esc(item.type)}</span>
          <strong>${esc(item.number)}</strong>
          <span>Fecha ${esc(formatDate(item.emitted || todayISO()))}</span>
        </div>
      </header>
      <div class="voucher-party">
        <div>
          <span>Receptor</span>
          <strong>${esc(item.receptor)}</strong>
          <em>CUIT ${esc(item.cuit || "—")} · ${esc(item.ivaCond || "—")}</em>
        </div>
        <div>
          <span>Vencimiento</span>
          <strong class="${overdue ? "due-late" : ""}">${esc(formatDue(item.due))}</strong>
          <em>${esc(label(item.status))}</em>
        </div>
      </div>
      <table class="voucher-lines">
        <thead><tr><th>Detalle</th><th>Cant.</th><th>Importe</th></tr></thead>
        <tbody>${lines}</tbody>
      </table>
      <div class="voucher-foot">
        <div class="voucher-arca">
          <span>ARCA simulado</span>
          <strong>CAE ${esc(item.cae || "pendiente de emisión")}</strong>
          <em>Vto. CAE ${esc(item.cae ? formatDue(item.caeVto) : "—")}</em>
        </div>
        <div class="voucher-tot">
          ${item.type === "Factura A" ? `<p>Neto ${esc(money(moneyParts.neto))}<br>IVA 21% ${esc(money(moneyParts.iva))}</p>` : "<p>IVA incluido</p>"}
          <strong>${esc(money(moneyParts.total))}</strong>
        </div>
      </div>
    </article>`;
}
