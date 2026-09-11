window.SIS_CFG = {
  "slug": "eventos",
  "title": "Eventos y salón",
  "primary": "eventos",
  "tabs": [
    "eventos",
    "clientes"
  ],
  "tabTitles": {
    "eventos": "Eventos",
    "clientes": "Clientes"
  },
  "listKey": "items",
  "columns": [
    [
      "fecha",
      "Fecha"
    ],
    [
      "cliente",
      "Cliente"
    ],
    [
      "personas",
      "Personas"
    ],
    [
      "sena",
      "Seña"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "fecha",
    "clienteNombre",
    "personas",
    "senaMoney",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "fecha",
      "Fecha",
      "date"
    ],
    [
      "personas",
      "Personas",
      "number"
    ],
    [
      "menu",
      "Menú",
      "text"
    ],
    [
      "sena",
      "Seña",
      "number"
    ]
  ],
  "statuses": [
    "consulta",
    "reservado",
    "cerrado"
  ],
  "statusLabels": {
    "consulta": "Consulta",
    "reservado": "Reservado",
    "cerrado": "Cerrado"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
