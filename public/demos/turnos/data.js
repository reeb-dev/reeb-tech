window.TURNOS_SEED = {
  profesionales: [
    { id: "lucia", nombre: "Lucía", rol: "Color y corte", foto: "img/servicio-1.jpg" },
    { id: "marco", nombre: "Marco", rol: "Barba y caballero", foto: "img/equipo.jpg" },
    { id: "ana", nombre: "Ana", rol: "Manicura", foto: "img/servicio-2.jpg" }
  ],
  servicios: [
    { id: "s1", nombre: "Corte dama", minutos: 45, precio: 12000, foto: "img/servicio-1.jpg" },
    { id: "s2", nombre: "Color", minutos: 90, precio: 28000, foto: "img/servicio-1.jpg" },
    { id: "s3", nombre: "Manicura", minutos: 40, precio: 9000, foto: "img/servicio-2.jpg" },
    { id: "s4", nombre: "Corte caballero", minutos: 30, precio: 8000, foto: "img/equipo.jpg" },
    { id: "s5", nombre: "Brushing", minutos: 35, precio: 10000, foto: "img/hero.jpg" }
  ],
  clientes: [
    { id: "c1", nombre: "María López", tel: "2915551001", email: "maria@ejemplo.com", notas: "Prefiere Lucía", foto: "img/servicio-1.jpg" },
    { id: "c2", nombre: "Jorge Ruiz", tel: "2915551002", email: "", notas: "Trae estudios", foto: "img/equipo.jpg" },
    { id: "c3", nombre: "Sofía Díaz", tel: "2915551003", email: "sofia@ejemplo.com", notas: "", foto: "img/servicio-2.jpg" },
    { id: "c4", nombre: "Pedro Sosa", tel: "2915551004", email: "", notas: "Llega tarde a veces", foto: "img/equipo.jpg" },
    { id: "c5", nombre: "Elena Paz", tel: "2915551005", email: "", notas: "", foto: "img/servicio-2.jpg" }
  ],
  turnos: [
    { id: "t1", fecha: "2026-09-11", hora: "09:30", clienteId: "c1", profesionalId: "lucia", servicioId: "s1", notas: "", estado: "pendiente", origen: "panel" },
    { id: "t2", fecha: "2026-09-11", hora: "10:00", clienteId: "c2", profesionalId: "marco", servicioId: "s4", notas: "Control mensual", estado: "en_curso", origen: "panel" },
    { id: "t3", fecha: "2026-09-11", hora: "11:15", clienteId: "c3", profesionalId: "ana", servicioId: "s3", notas: "", estado: "pendiente", origen: "whatsapp" },
    { id: "t4", fecha: "2026-09-11", hora: "12:00", clienteId: "c4", profesionalId: "marco", servicioId: "s4", notas: "", estado: "atendido", origen: "panel" },
    { id: "t5", fecha: "2026-09-11", hora: "16:30", clienteId: "c5", profesionalId: "lucia", servicioId: "s2", notas: "Mechas", estado: "pendiente", origen: "panel" },
    { id: "t6", fecha: "2026-09-12", hora: "10:30", clienteId: "c1", profesionalId: "lucia", servicioId: "s5", notas: "", estado: "pendiente", origen: "panel" },
    { id: "t7", fecha: "2026-09-11", hora: "17:00", clienteId: "c3", profesionalId: "ana", servicioId: "s3", notas: "Canceló ayer y reprogramó", estado: "cancelado", origen: "panel" }
  ],
  waInbox: [
    {
      id: "w1",
      from: "Carla Méndez",
      tel: "2915552001",
      mensaje: "Hola! Quiero un turno de color para el viernes a la tarde, ¿tienen lugar?",
      servicioId: "s2",
      fechaSugerida: "2026-09-12",
      horaSugerida: "16:00",
      profesionalId: "lucia",
      estado: "nuevo",
      recibido: "2026-09-11T08:12:00"
    },
    {
      id: "w2",
      from: "Tomás Vidal",
      tel: "2915552002",
      mensaje: "Buen día, corte caballero mañana a la mañana si se puede",
      servicioId: "s4",
      fechaSugerida: "2026-09-12",
      horaSugerida: "09:30",
      profesionalId: "marco",
      estado: "nuevo",
      recibido: "2026-09-11T08:40:00"
    },
    {
      id: "w3",
      from: "Sofía Díaz",
      tel: "2915551003",
      mensaje: "Hola Ana, ¿me agendás manicura el jueves 15 hs?",
      servicioId: "s3",
      fechaSugerida: "2026-09-11",
      horaSugerida: "15:00",
      profesionalId: "ana",
      estado: "nuevo",
      recibido: "2026-09-11T09:05:00"
    },
    {
      id: "w4",
      from: "Laura Ríos",
      tel: "2915552004",
      mensaje: "Quería brushing el sábado pero no me contestaron",
      servicioId: "s5",
      fechaSugerida: "2026-09-13",
      horaSugerida: "11:00",
      profesionalId: "lucia",
      estado: "rechazado",
      recibido: "2026-09-10T18:20:00"
    },
    {
      id: "w5",
      from: "María López",
      tel: "2915551001",
      mensaje: "Confirmo el brushing de mañana 10:30, gracias!",
      servicioId: "s5",
      fechaSugerida: "2026-09-12",
      horaSugerida: "10:30",
      profesionalId: "lucia",
      estado: "confirmado",
      recibido: "2026-09-10T20:10:00",
      turnoId: "t6"
    }
  ]
};
