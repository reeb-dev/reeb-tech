const STATUSES = [
  { id: "ingreso", label: "Ingreso" },
  { id: "taller", label: "En taller" },
  { id: "listo", label: "Listo" },
  { id: "entregado", label: "Entregado" }
];

const TIPOS_TRABAJO = [
  { id: "service", label: "Service" },
  { id: "mecanica", label: "Mecánica general" },
  { id: "electricidad", label: "Electricidad" },
  { id: "frenos", label: "Frenos" },
  { id: "suspension", label: "Suspensión" },
  { id: "tren", label: "Tren delantero" },
  { id: "chapa", label: "Chapa y pintura" },
  { id: "otro", label: "Otro" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "RC", label: "Recibo" },
  { id: "PR", label: "Presupuesto" }
];

function seed() {
  return [
    {
      id: "t1",
      orden: "OT-2024-0089",
      vehiculo: { marca: "Volkswagen", modelo: "Gol Trend", año: 2018, patente: "AC 123 BD", km: 85000 },
      cliente: { nombre: "Roberto Fernández", tel: "11-5555-1111", email: "roberto.f@email.com" },
      tipo: "service",
      descripcion: "Service 80.000 km completo",
      diagnostico: "Cambio de aceite, filtros, revisión general. Detectado desgaste en pastillas de freno.",
      presupuesto: 125000,
      aprobado: true,
      repuestos: [
        { nombre: "Aceite sintético 4L", precio: 45000, cantidad: 1 },
        { nombre: "Filtro de aceite", precio: 8500, cantidad: 1 },
        { nombre: "Filtro de aire", precio: 12000, cantidad: 1 },
        { nombre: "Pastillas de freno del.", precio: 28000, cantidad: 1 }
      ],
      manoObra: 35000,
      status: "taller",
      factura: null,
      fechaIngreso: "5 sep",
      fechaEstimada: "9 sep",
      history: [
        { when: "7 sep", text: "Repuestos recibidos. Comienza reparación." },
        { when: "6 sep", text: "Presupuesto aprobado por cliente." },
        { when: "5 sep", text: "Vehículo ingresado. Service 80.000 km." }
      ]
    },
    {
      id: "t2",
      orden: "OT-2024-0090",
      vehiculo: { marca: "Fiat", modelo: "Cronos", año: 2021, patente: "AE 456 GH", km: 42000 },
      cliente: { nombre: "María Soledad García", tel: "11-4444-2222", email: "msgarcia@email.com" },
      tipo: "electricidad",
      descripcion: "No arranca, posible problema de arranque o batería",
      diagnostico: "Batería agotada. Motor de arranque en buen estado.",
      presupuesto: 95000,
      aprobado: true,
      repuestos: [
        { nombre: "Batería 12V 65Ah", precio: 85000, cantidad: 1 }
      ],
      manoObra: 10000,
      status: "listo",
      factura: { tipo: "FB", numero: "0001-00000445", cae: "74185296301234", vto: "18 sep", total: 95000 },
      fechaIngreso: "6 sep",
      fechaEstimada: "7 sep",
      history: [
        { when: "7 sep", text: "Reparación completada. Listo para retirar." },
        { when: "7 sep", text: "Batería instalada." },
        { when: "6 sep", text: "Diagnóstico: batería agotada." }
      ]
    },
    {
      id: "t3",
      orden: "OT-2024-0091",
      vehiculo: { marca: "Ford", modelo: "EcoSport", año: 2019, patente: "AD 789 KL", km: 68000 },
      cliente: { nombre: "Carlos Rodríguez", tel: "11-3333-4444", email: "crodriguez@email.com" },
      tipo: "suspension",
      descripcion: "Ruidos en suspensión delantera al pasar pozos",
      diagnostico: "Amortiguadores delanteros vencidos. Bujes de barra estabilizadora desgastados.",
      presupuesto: 280000,
      aprobado: false,
      repuestos: [
        { nombre: "Amortiguador del. izq.", precio: 75000, cantidad: 1 },
        { nombre: "Amortiguador del. der.", precio: 75000, cantidad: 1 },
        { nombre: "Kit bujes barra estab.", precio: 18000, cantidad: 1 }
      ],
      manoObra: 55000,
      status: "taller",
      factura: null,
      fechaIngreso: "7 sep",
      fechaEstimada: "Pendiente aprobación",
      history: [
        { when: "8 sep", text: "Presupuesto enviado por WhatsApp. Esperando aprobación." },
        { when: "7 sep", text: "Diagnóstico completo. Amortiguadores vencidos." }
      ]
    },
    {
      id: "t4",
      orden: "OT-2024-0088",
      vehiculo: { marca: "Chevrolet", modelo: "Cruze", año: 2017, patente: "NMO 456", km: 112000 },
      cliente: { nombre: "Patricia Álvarez", tel: "11-2222-5555", email: "palvarez@email.com" },
      tipo: "frenos",
      descripcion: "Vibración al frenar a alta velocidad",
      diagnostico: "Discos de freno alabeados. Pastillas con desgaste irregular.",
      presupuesto: 165000,
      aprobado: true,
      repuestos: [
        { nombre: "Disco de freno del. x2", precio: 85000, cantidad: 1 },
        { nombre: "Pastillas de freno del.", precio: 32000, cantidad: 1 }
      ],
      manoObra: 48000,
      status: "taller",
      factura: null,
      fechaIngreso: "4 sep",
      fechaEstimada: "10 sep",
      history: [
        { when: "6 sep", text: "Repuestos pedidos. Llegan el 9 sep." },
        { when: "5 sep", text: "Presupuesto aprobado." },
        { when: "4 sep", text: "Ingreso. Vibración al frenar." }
      ]
    },
    {
      id: "t5",
      orden: "OT-2024-0085",
      vehiculo: { marca: "Renault", modelo: "Sandero", año: 2020, patente: "AF 111 CD", km: 55000 },
      cliente: { nombre: "Luciano Moreno", tel: "11-6666-7777", email: "lmoreno@email.com" },
      tipo: "tren",
      descripcion: "Auto tira para la derecha",
      diagnostico: "Tren delantero desalineado. Extremos de dirección con juego.",
      presupuesto: 95000,
      aprobado: true,
      repuestos: [
        { nombre: "Extremo dirección izq.", precio: 22000, cantidad: 1 },
        { nombre: "Extremo dirección der.", precio: 22000, cantidad: 1 },
        { nombre: "Alineación y balanceo", precio: 15000, cantidad: 1 }
      ],
      manoObra: 36000,
      status: "entregado",
      factura: { tipo: "FB", numero: "0001-00000442", cae: "74185296301231", vto: "12 sep", total: 95000 },
      fechaIngreso: "1 sep",
      fechaEstimada: "3 sep",
      history: [
        { when: "3 sep", text: "Entregado al cliente." },
        { when: "3 sep", text: "Factura emitida. CAE obtenido." },
        { when: "2 sep", text: "Reparación completada. Alineación OK." }
      ]
    },
    {
      id: "t6",
      orden: "OT-2024-0092",
      vehiculo: { marca: "Toyota", modelo: "Hilux", año: 2022, patente: "AG 222 EF", km: 35000 },
      cliente: { nombre: "Agustín Pereyra", tel: "11-8888-9999", email: "apereyra@email.com" },
      tipo: "service",
      descripcion: "Service 30.000 km",
      diagnostico: "Pendiente de diagnóstico",
      presupuesto: 0,
      aprobado: false,
      repuestos: [],
      manoObra: 0,
      status: "ingreso",
      factura: null,
      fechaIngreso: "8 sep",
      fechaEstimada: "Pendiente",
      history: [
        { when: "8 sep", text: "Vehículo ingresado. Turno para service." }
      ]
    }
  ];
}

function normalizeStatus(status) {
  if (status === "ingresado") return "ingreso";
  if (["diagnostico", "esperando", "reparacion"].includes(status)) return "taller";
  return status;
}

function load() {
  const raw = localStorage.getItem("taller-demo-v2");
  if (!raw) {
    const data = seed();
    localStorage.setItem("taller-demo-v2", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw).map((item) => {
    item.status = normalizeStatus(item.status);
    return item;
  });
}

function save(items) {
  localStorage.setItem("taller-demo-v2", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS_TRABAJO.find((t) => t.id === tipo)?.label || tipo;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function calcTotal(item) {
  const repuestos = (item.repuestos || []).reduce((sum, r) => sum + (r.precio * r.cantidad), 0);
  return repuestos + (item.manoObra || 0);
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
