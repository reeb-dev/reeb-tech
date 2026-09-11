window.SIS_SEED = {
  "clientes": [
    {
      "id": "c1",
      "nombre": "Kiosco Centro",
      "tel": "2915559001"
    },
    {
      "id": "c2",
      "nombre": "Almacén Norte",
      "tel": "2915559002"
    }
  ],
  "lista": [
    {
      "id": "l1",
      "nombre": "Caja gaseosa x12",
      "precio": 18000,
      "minimo": 5
    },
    {
      "id": "l2",
      "nombre": "Aceite 1L x6",
      "precio": 22000,
      "minimo": 3
    },
    {
      "id": "l3",
      "nombre": "Harina 25kg",
      "precio": 15000,
      "minimo": 2
    }
  ],
  "items": [
    {
      "id": "p1",
      "clienteId": "c1",
      "lineas": [
        {
          "nombre": "Caja gaseosa x12",
          "cant": 10,
          "monto": 18000
        }
      ],
      "estado": "pendiente",
      "fecha": "2026-09-11"
    },
    {
      "id": "p2",
      "clienteId": "c2",
      "lineas": [
        {
          "nombre": "Harina 25kg",
          "cant": 4,
          "monto": 15000
        }
      ],
      "estado": "despachado",
      "fecha": "2026-09-10"
    },
    {
      "id": "p3",
      "clienteId": "c1",
      "lineas": [
        {
          "nombre": "Aceite 1L x6",
          "cant": 3,
          "monto": 22000
        }
      ],
      "estado": "entregado",
      "fecha": "2026-09-08"
    }
  ]
};
