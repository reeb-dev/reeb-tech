window.SIS_CFG = {
  "slug": "takeaway",
  "title": "Pedidos para llevar",
  "primary": "cola",
  "tabs": [
    "cola",
    "carta"
  ],
  "tabTitles": {
    "cola": "Cola",
    "carta": "Carta"
  },
  "listKey": "items",
  "columns": [
    [
      "hora",
      "Hora"
    ],
    [
      "cliente",
      "Cliente"
    ],
    [
      "plato",
      "Pedido"
    ],
    [
      "estado",
      "Estado"
    ]
  ],
  "row": [
    "hora",
    "cliente",
    "platoNombre",
    "estadoLabel"
  ],
  "form": [
    [
      "cliente",
      "Cliente / retiro",
      "text"
    ],
    [
      "tel",
      "Teléfono",
      "text"
    ],
    [
      "platoId",
      "Ítem",
      "select:carta"
    ],
    [
      "nota",
      "Nota",
      "text"
    ]
  ],
  "statuses": [
    "nuevo",
    "preparando",
    "listo",
    "entregado"
  ],
  "statusLabels": {
    "nuevo": "Nuevo",
    "preparando": "Preparando",
    "listo": "Listo",
    "entregado": "Entregado"
  },
  "wa": true,
  "payCuota": false,
  "addNota": false
};
