window.SIS_CFG = {
  "slug": "obra",
  "title": "Presupuesto de obra",
  "primary": "obras",
  "tabs": [
    "obras",
    "clientes"
  ],
  "tabTitles": {
    "obras": "Obras",
    "clientes": "Clientes"
  },
  "listKey": "items",
  "columns": [
    [
      "nombre",
      "Obra"
    ],
    [
      "cliente",
      "Cliente"
    ],
    [
      "avance",
      "Avance"
    ],
    [
      "presupuesto",
      "Presupuesto"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "nombre",
    "clienteNombre",
    "avancePct",
    "presupuestoMoney",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "nombre",
      "Obra",
      "text"
    ],
    [
      "presupuesto",
      "Presupuesto",
      "number"
    ],
    [
      "avance",
      "Avance %",
      "number"
    ],
    [
      "extras",
      "Extras",
      "text"
    ]
  ],
  "statuses": [
    "aprobada",
    "en_obra",
    "cerrada"
  ],
  "statusLabels": {
    "aprobada": "Aprobada",
    "en_obra": "En obra",
    "cerrada": "Cerrada"
  },
  "wa": false,
  "payCuota": false,
  "addNota": false
};
