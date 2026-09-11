window.SIS_CFG = {
  "slug": "cuotas",
  "title": "Cobros y cuotas",
  "primary": "planes",
  "tabs": [
    "planes",
    "clientes"
  ],
  "tabTitles": {
    "planes": "Planes",
    "clientes": "Clientes"
  },
  "listKey": "items",
  "columns": [
    [
      "cliente",
      "Cliente"
    ],
    [
      "concepto",
      "Concepto"
    ],
    [
      "total",
      "Total"
    ],
    [
      "progreso",
      "Cuotas"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "clienteNombre",
    "concepto",
    "totalMoney",
    "progreso",
    "planEstado"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "concepto",
      "Concepto",
      "text"
    ],
    [
      "total",
      "Total",
      "number"
    ],
    [
      "cuotas",
      "Nº cuotas",
      "number"
    ]
  ],
  "statuses": [],
  "statusLabels": {},
  "wa": true,
  "payCuota": true,
  "addNota": false
};
