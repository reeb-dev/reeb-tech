window.SIS_CFG = {
  "slug": "mayorista",
  "title": "Pedidos mayoristas",
  "primary": "pedidos",
  "tabs": [
    "pedidos",
    "lista",
    "clientes"
  ],
  "tabTitles": {
    "pedidos": "Pedidos",
    "lista": "Lista de precio",
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
    "detalleLineas",
    "estadoLabel"
  ],
  "form": [
    [
      "clienteId",
      "Cliente",
      "select:clientes"
    ],
    [
      "listaId",
      "Ítem lista",
      "select:lista"
    ],
    [
      "cant",
      "Cantidad",
      "number"
    ]
  ],
  "statuses": [
    "pendiente",
    "despachado",
    "entregado"
  ],
  "statusLabels": {
    "pendiente": "Pendiente",
    "despachado": "Despachado",
    "entregado": "Entregado"
  },
  "wa": false,
  "payCuota": false,
  "addNota": false
};
