window.SIS_CFG = {
  "slug": "visitas",
  "title": "Visitas y técnicos",
  "primary": "visitas",
  "tabs": [
    "visitas",
    "tecnicos",
    "clientes"
  ],
  "tabTitles": {
    "visitas": "Visitas",
    "tecnicos": "Técnicos",
    "clientes": "Clientes"
  },
  "listKey": "items",
  "columns": [
    [
      "fecha",
      "Fecha"
    ],
    [
      "hora",
      "Hora"
    ],
    [
      "cliente",
      "Cliente"
    ],
    [
      "tecnico",
      "Técnico"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "fecha",
    "hora",
    "clienteNombre",
    "tecnicoNombre",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "tecnicoId",
      "Técnico",
      "select:tecnicos"
    ],
    [
      "fecha",
      "Fecha",
      "date"
    ],
    [
      "hora",
      "Hora",
      "time"
    ],
    [
      "motivo",
      "Motivo",
      "text"
    ]
  ],
  "statuses": [
    "pendiente",
    "en_camino",
    "hecha",
    "cancelada"
  ],
  "statusLabels": {
    "pendiente": "Pendiente",
    "en_camino": "En camino",
    "hecha": "Hecha",
    "cancelada": "Cancelada"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
