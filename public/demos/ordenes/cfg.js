window.SIS_CFG = {
  "slug": "ordenes",
  "title": "Órdenes de trabajo",
  "primary": "ordenes",
  "tabs": [
    "ordenes",
    "clientes"
  ],
  "tabTitles": {
    "ordenes": "Órdenes",
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
      "equipo",
      "Equipo"
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
    "fecha",
    "clienteNombre",
    "equipo",
    "detalle",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "equipo",
      "Equipo / unidad",
      "text"
    ],
    [
      "detalle",
      "Trabajo",
      "text"
    ]
  ],
  "statuses": [
    "ingreso",
    "en_curso",
    "listo",
    "entregado"
  ],
  "statusLabels": {
    "ingreso": "Ingreso",
    "en_curso": "En curso",
    "listo": "Listo",
    "entregado": "Entregado"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
