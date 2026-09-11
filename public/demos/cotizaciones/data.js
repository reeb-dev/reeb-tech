window.COTIZ_SEED = {
  clientes: [
    { id: "cl1", nombre: "Familia Gómez", tel: "2915553001", email: "gomez@ejemplo.com" },
    { id: "cl2", nombre: "Obra Sur", tel: "2915553002", email: "obrasur@ejemplo.com" },
    { id: "cl3", nombre: "Ana Pérez", tel: "2915553003", email: "" },
    { id: "cl4", nombre: "Corralón interno", tel: "2915553004", email: "" }
  ],
  catalogo: [
    { id: "cat1", nombre: "Placard 3 puertas", precio: 420000, foto: "img/trabajo-1.jpg" },
    { id: "cat2", nombre: "Mesa ratona 1.20", precio: 95000, foto: "img/trabajo-2.jpg" },
    { id: "cat3", nombre: "Deck m2", precio: 45000, foto: "img/trabajo-3.jpg" },
    { id: "cat4", nombre: "Hierro 12 mm × 40", precio: 185000, foto: "img/hero.jpg" }
  ],
  cotizaciones: [
    { id: "c1", numero: "COT-1001", clienteId: "cl1", items: [{ nombre: "Placard 3 puertas melamina", monto: 420000, cant: 1 }], senaPct: 30, valida: "2026-09-20", notas: "Color roble", estado: "enviada", foto: "img/trabajo-1.jpg" },
    { id: "c2", numero: "COT-1002", clienteId: "cl2", items: [{ nombre: "Hierro 12 mm × 40", monto: 185000, cant: 1 }, { nombre: "Flete", monto: 25000, cant: 1 }], senaPct: 40, valida: "2026-09-15", notas: "", estado: "aceptada", foto: "img/hero.jpg" },
    { id: "c3", numero: "COT-1003", clienteId: "cl3", items: [{ nombre: "Mesa ratona 1.20", monto: 95000, cant: 1 }], senaPct: 30, valida: "2026-09-25", notas: "Entrega Barrio Norte", estado: "borrador", foto: "img/trabajo-2.jpg" },
    { id: "c4", numero: "COT-1004", clienteId: "cl4", items: [{ nombre: "Deck 12 m2", monto: 540000, cant: 1 }], senaPct: 50, valida: "2026-09-18", notas: "Seña cobrada", estado: "pedido", foto: "img/trabajo-3.jpg" }
  ]
};
