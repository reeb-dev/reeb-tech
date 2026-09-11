window.SIS_CFG = {
  "slug": "reparto",
  "title": "Reparto",
  "primary": "entregas",
  "tabs": [
    "entregas",
    "choferes"
  ],
  "tabTitles": {
    "entregas": "Entregas",
    "choferes": "Choferes"
  },
  "listKey": "items",
  "columns": [
    [
      "cliente",
      "Cliente"
    ],
    [
      "zona",
      "Zona"
    ],
    [
      "chofer",
      "Chofer"
    ],
    [
      "detalle",
      "Detalle"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "cliente",
    "zona",
    "choferNombre",
    "detalle",
    "estadoLabel"
  ],
  "form": [
    [
      "cliente",
      "Cliente",
      "text"
    ],
    [
      "zona",
      "Zona",
      "text"
    ],
    [
      "choferId",
      "Chofer",
      "select:choferes"
    ],
    [
      "detalle",
      "Detalle",
      "text"
    ]
  ],
  "statuses": [
    "pendiente",
    "en_ruta",
    "entregado"
  ],
  "statusLabels": {
    "pendiente": "Pendiente",
    "en_ruta": "En ruta",
    "entregado": "Entregado"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
