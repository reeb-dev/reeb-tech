const STATUSES = [
  { id: "consulta", label: "Consulta" },
  { id: "tramite", label: "En trámite" },
  { id: "escrito", label: "Escrito / presentación" }
];

function seed() {
  return [
    {
      id: "e1",
      number: "1842/2024",
      caratula: "Ferreyra, Lucía s/ sucesión ab intestato",
      fuero: "Civil",
      juzgado: "Juzgado Civil n.º 12",
      party: "Ferreyra, Lucía",
      role: "Parte",
      due: "18 sep · audiencia",
      status: "tramite",
      escrito: "Inventario de bienes, antes de la audiencia.",
      history: [
        { when: "2 sep", text: "Se pidió el inventario. Todavía no está en el expediente." },
        { when: "28 ago", text: "Audiencia fijada para el 18 de septiembre." }
      ]
    },
    {
      id: "e2",
      number: "Sin número",
      caratula: "Costa, Martín s/ locación comercial",
      fuero: "Comercial",
      juzgado: "Sin radicar",
      party: "Costa, Martín",
      role: "Consultante",
      due: "Sin fecha",
      status: "consulta",
      escrito: "Todavía no hay escrito. Falta el contrato.",
      history: [{ when: "5 sep", text: "Primera consulta. Se pidió copia del contrato." }]
    },
    {
      id: "e3",
      number: "551/2025",
      caratula: "Iglesias, Paula c/ Textil Sur s/ revisión de demanda",
      fuero: "Civil",
      juzgado: "Juzgado Civil n.º 4",
      party: "Iglesias, Paula",
      role: "Actora",
      due: "20 sep · presentación",
      status: "escrito",
      escrito: "Texto en limpio de la presentación. No alcanza un resumen oral.",
      history: [{ when: "4 sep", text: "Se encargó el escrito en limpio para el 20 de septiembre." }]
    },
    {
      id: "e4",
      number: "902/2023",
      caratula: "Molina, Andrés s/ desalojo",
      fuero: "Civil",
      juzgado: "Juzgado Civil n.º 7",
      party: "Molina, Andrés",
      role: "Actor",
      due: "25 sep · notificación",
      status: "tramite",
      escrito: "Cédula de notificación a la otra parte.",
      history: [
        { when: "1 sep", text: "Falta diligenciar la notificación." },
        { when: "12 ago", text: "Proveído de traslado." }
      ]
    },
    {
      id: "e5",
      number: "Sin número",
      caratula: "Benítez, Clara s/ alimentos",
      fuero: "Familia",
      juzgado: "Juzgado de Familia n.º 2",
      party: "Benítez, Clara",
      role: "Consultante",
      due: "12 sep · documentación",
      status: "consulta",
      escrito: "Pedir recibos de haberes antes de redactar.",
      history: [{ when: "6 sep", text: "Primera consulta. Se listó la documentación faltante." }]
    },
    {
      id: "e6",
      number: "77/2025",
      caratula: "Ledesma, Héctor c/ Constructora Norte s/ contrato de obra",
      fuero: "Civil",
      juzgado: "Juzgado Civil n.º 9",
      party: "Ledesma, Héctor",
      role: "Actor",
      due: "30 sep · revisión",
      status: "escrito",
      escrito: "Escrito listo para revisión interna.",
      history: [{ when: "3 sep", text: "Borrador cerrado. Pasa a revisión." }]
    },
    {
      id: "e7",
      number: "1204/2024",
      caratula: "Sosa, Elena s/ divorcio",
      fuero: "Familia",
      juzgado: "Juzgado de Familia n.º 1",
      party: "Sosa, Elena",
      role: "Parte",
      due: "22 sep · convenio",
      status: "tramite",
      escrito: "Convenio regulador, cláusula de vivienda pendiente.",
      history: [{ when: "30 ago", text: "Se acordó el esquema. Falta la cláusula de la vivienda." }]
    },
    {
      id: "e8",
      number: "88/2025",
      caratula: "Quinteros, Pablo s/ daños y perjuicios",
      fuero: "Civil",
      juzgado: "Juzgado Civil n.º 3",
      party: "Quinteros, Pablo",
      role: "Consultante",
      due: "5 oct · relato",
      status: "consulta",
      escrito: "Relato de hechos incompleto. No iniciar sin fechas.",
      history: [{ when: "7 sep", text: "Consulta inicial. Faltan fechas del hecho." }]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("estudio-norte-v2");
  if (!raw) {
    const data = seed();
    localStorage.setItem("estudio-norte-v2", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("estudio-norte-v2", JSON.stringify(items));
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
