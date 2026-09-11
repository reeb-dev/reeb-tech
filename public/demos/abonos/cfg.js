window.SIS_CFG = {
  "slug": "abonos",
  "title": "Abonos",
  "primary": "abonos",
  "tabs": [
    "abonos",
    "clientes"
  ],
  "tabTitles": {
    "abonos": "Abonos",
    "clientes": "Clientes"
  },
  "listKey": "items",
  "columns": [
    [
      "cliente",
      "Cliente"
    ],
    [
      "plan",
      "Plan"
    ],
    [
      "monto",
      "Monto"
    ],
    [
      "ultimo",
      "Último pago"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "clienteNombre",
    "plan",
    "montoMoney",
    "ultimo",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "plan",
      "Plan",
      "text"
    ],
    [
      "monto",
      "Monto mensual",
      "number"
    ]
  ],
  "statuses": [
    "al_dia",
    "mora",
    "baja"
  ],
  "statusLabels": {
    "al_dia": "Al día",
    "mora": "Mora",
    "baja": "Baja"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
