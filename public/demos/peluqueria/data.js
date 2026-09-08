const STATUSES = [
  { id: "reservado", label: "Reservado" },
  { id: "en_atencion", label: "En atención" },
  { id: "terminado", label: "Terminado" },
  { id: "cancelado", label: "Cancelado" },
  { id: "no_show", label: "No se presentó" }
];

const SERVICIOS = [
  { id: "corte_m", label: "Corte caballero", precio: 8500, duracion: 30 },
  { id: "corte_f", label: "Corte dama", precio: 12000, duracion: 45 },
  { id: "barba", label: "Barba", precio: 5000, duracion: 20 },
  { id: "tintura", label: "Tintura", precio: 25000, duracion: 90 },
  { id: "mechas", label: "Mechas/Reflejos", precio: 35000, duracion: 120 },
  { id: "brushing", label: "Brushing", precio: 8000, duracion: 30 },
  { id: "alisado", label: "Alisado", precio: 45000, duracion: 180 },
  { id: "tratamiento", label: "Tratamiento capilar", precio: 15000, duracion: 45 },
  { id: "peinado", label: "Peinado evento", precio: 18000, duracion: 60 },
  { id: "manicura", label: "Manicura", precio: 9000, duracion: 45 },
  { id: "pedicura", label: "Pedicura", precio: 11000, duracion: 60 }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "RC", label: "Recibo" },
  { id: "TK", label: "Ticket" }
];

function seed() {
  return [
    {
      id: "p1",
      turno: "T-001",
      fecha: "8 sep",
      hora: "10:00",
      cliente: { nombre: "Carolina Méndez", tel: "11-5555-1234", email: "carolina.m@email.com" },
      servicios: ["corte_f", "brushing"],
      profesional: "Lucía",
      notas: "Prefiere largo hasta los hombros",
      status: "en_atencion",
      factura: null,
      history: [
        { when: "10:05", text: "Cliente en atención con Lucía." },
        { when: "9:55", text: "Cliente llegó." }
      ]
    },
    {
      id: "p2",
      turno: "T-002",
      fecha: "8 sep",
      hora: "10:30",
      cliente: { nombre: "Martín Gómez", tel: "11-4444-5678", email: "" },
      servicios: ["corte_m", "barba"],
      profesional: "Diego",
      notas: "",
      status: "reservado",
      factura: null,
      history: [
        { when: "7 sep", text: "Turno reservado por WhatsApp." }
      ]
    },
    {
      id: "p3",
      turno: "T-003",
      fecha: "8 sep",
      hora: "11:00",
      cliente: { nombre: "Sofía Ruiz", tel: "11-3333-9999", email: "sofi.ruiz@email.com" },
      servicios: ["tintura", "corte_f"],
      profesional: "Lucía",
      notas: "Tintura castaño oscuro. Alérgica a amoníaco.",
      status: "reservado",
      factura: null,
      history: [
        { when: "5 sep", text: "Turno reservado. Se anotó alergia." }
      ]
    },
    {
      id: "p4",
      turno: "T-004",
      fecha: "8 sep",
      hora: "09:00",
      cliente: { nombre: "Roberto Fernández", tel: "11-2222-7777", email: "" },
      servicios: ["corte_m"],
      profesional: "Diego",
      notas: "",
      status: "terminado",
      factura: { tipo: "TK", numero: "0001-00008842", cae: "74185296301234", vto: "18 sep", total: 8500 },
      history: [
        { when: "09:28", text: "Servicio terminado. Pagó en efectivo." },
        { when: "09:00", text: "Comenzó atención." }
      ]
    },
    {
      id: "p5",
      turno: "T-005",
      fecha: "8 sep",
      hora: "14:00",
      cliente: { nombre: "Ana Belén Torres", tel: "11-6666-3333", email: "anabelen@email.com" },
      servicios: ["mechas", "tratamiento"],
      profesional: "Lucía",
      notas: "Mechas balayage. Traer foto de referencia.",
      status: "reservado",
      factura: null,
      history: [
        { when: "6 sep", text: "Turno confirmado." }
      ]
    },
    {
      id: "p6",
      turno: "T-006",
      fecha: "7 sep",
      hora: "16:00",
      cliente: { nombre: "Claudia Pereyra", tel: "11-8888-4444", email: "" },
      servicios: ["manicura", "pedicura"],
      profesional: "Yamila",
      notas: "",
      status: "terminado",
      factura: { tipo: "FB", numero: "0001-00000223", cae: "74185296301230", vto: "17 sep", total: 20000 },
      history: [
        { when: "17:45", text: "Servicios completados." },
        { when: "16:00", text: "Comenzó manicura." }
      ]
    },
    {
      id: "p7",
      turno: "T-007",
      fecha: "7 sep",
      hora: "11:00",
      cliente: { nombre: "Pedro Sánchez", tel: "11-7777-2222", email: "" },
      servicios: ["corte_m"],
      profesional: "Diego",
      notas: "",
      status: "no_show",
      factura: null,
      history: [
        { when: "11:15", text: "No se presentó. Sin aviso." }
      ]
    },
    {
      id: "p8",
      turno: "T-008",
      fecha: "9 sep",
      hora: "10:00",
      cliente: { nombre: "Valentina López", tel: "11-1111-8888", email: "vale.lopez@email.com" },
      servicios: ["alisado"],
      profesional: "Lucía",
      notas: "Primer alisado. Hacer prueba de sensibilidad.",
      status: "reservado",
      factura: null,
      history: [
        { when: "8 sep", text: "Turno reservado para mañana." }
      ]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("peluqueria-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("peluqueria-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("peluqueria-demo-v1", JSON.stringify(items));
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function getServicio(id) {
  return SERVICIOS.find((s) => s.id === id);
}

function servicioLabel(id) {
  return getServicio(id)?.label || id;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function calcTotal(item) {
  return (item.servicios || []).reduce((sum, id) => {
    const srv = getServicio(id);
    return sum + (srv?.precio || 0);
  }, 0);
}

function calcDuracion(item) {
  return (item.servicios || []).reduce((sum, id) => {
    const srv = getServicio(id);
    return sum + (srv?.duracion || 0);
  }, 0);
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
