window.SIS_CFG = {
  "slug": "contratos",
  "title": "Contratos",
  "primary": "contratos",
  "tabs": [
    "contratos",
    "partes"
  ],
  "tabTitles": {
    "contratos": "Contratos",
    "partes": "Partes"
  },
  "listKey": "items",
  "columns": [
    [
      "titulo",
      "Contrato"
    ],
    [
      "parte",
      "Parte"
    ],
    [
      "vence",
      "Vence"
    ],
    [
      "monto",
      "Monto"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "titulo",
    "parteNombre",
    "vence",
    "montoMoney",
    "estadoLabel"
  ],
  "form": [
    [
      "titulo",
      "Título",
      "text"
    ],
    [
      "parteId",
      "Parte",
      "select:partes"
    ],
    [
      "vence",
      "Vence",
      "date"
    ],
    [
      "monto",
      "Monto",
      "number"
    ]
  ],
  "statuses": [
    "vigente",
    "por_renovar",
    "finalizado"
  ],
  "statusLabels": {
    "vigente": "Vigente",
    "por_renovar": "Por renovar",
    "finalizado": "Finalizado"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
