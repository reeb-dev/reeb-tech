window.RESERVAS_SEED = {
  unidades: [
    { id: "u1", nombre: "Cabaña Arrayán", cupo: 4, precioNoche: 85000, foto: "img/unidad-1.jpg", notas: "Vista al arroyo" },
    { id: "u2", nombre: "Cabaña Ciprés", cupo: 5, precioNoche: 95000, foto: "img/unidad-2.jpg", notas: "Quincho" },
    { id: "u3", nombre: "Habitación 1", cupo: 2, precioNoche: 45000, foto: "img/unidad-3.jpg", notas: "Planta baja" },
    { id: "u4", nombre: "Habitación 2", cupo: 2, precioNoche: 48000, foto: "img/hero.jpg", notas: "Balcón" }
  ],
  reservas: [
    { id: "r1", unidadId: "u1", huesped: "Familia Torres", tel: "2915554001", desde: "2026-09-12", hasta: "2026-09-15", sena: 80000, notas: "Cuna", estado: "reservada" },
    { id: "r2", unidadId: "u3", huesped: "Lucía Vega", tel: "2915554002", desde: "2026-09-11", hasta: "2026-09-13", sena: 40000, notas: "", estado: "ocupada" },
    { id: "r3", unidadId: "u2", huesped: "Grupo Sur", tel: "2915554003", desde: "2026-09-18", hasta: "2026-09-22", sena: 0, notas: "Pendiente seña", estado: "consulta" },
    { id: "r4", unidadId: "u4", huesped: "Marcos Díaz", tel: "2915554004", desde: "2026-09-01", hasta: "2026-09-03", sena: 35000, notas: "", estado: "cerrada" },
    { id: "r5", unidadId: "u1", huesped: "Ana Gómez", tel: "2915554005", desde: "2026-09-20", hasta: "2026-09-23", sena: 50000, notas: "", estado: "reservada" }
  ]
};
