const STATUSES = [
  { id: "disponible", label: "Disponible" },
  { id: "reservada", label: "Reservada" },
  { id: "alquilada", label: "Alquilada" },
  { id: "vendida", label: "Vendida" }
];

const TIPOS = [
  { id: "casa", label: "Casa" },
  { id: "cabana", label: "Cabaña" },
  { id: "departamento", label: "Departamento" },
  { id: "terreno", label: "Lote" },
  { id: "local", label: "Local" }
];

const OPERACIONES = [
  { id: "alquiler", label: "Alquiler permanente" },
  { id: "venta", label: "Venta" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "RC", label: "Recibo" }
];

const AMENITIES = [
  { id: "pileta", label: "Pileta", icon: "·" },
  { id: "parrilla", label: "Parrilla", icon: "·" },
  { id: "cochera", label: "Cochera", icon: "·" },
  { id: "balcon", label: "Balcón", icon: "·" },
  { id: "terraza", label: "Terraza", icon: "·" },
  { id: "jardin", label: "Jardín", icon: "·" },
  { id: "lena", label: "Hogar a leña", icon: "·" },
  { id: "quincho", label: "Quincho", icon: "·" },
  { id: "baulera", label: "Baulera", icon: "·" }
];

const FOTOS = {
  casaLago: "img/casa-lago.jpg",
  casaPiedra: "img/casa-piedra.jpg",
  casaPinos: "img/casa-pinos.jpg",
  casaMadera: "img/casa-madera.jpg",
  casaInterior: "img/casa-interior.jpg",
  cabanaBosque: "img/cabana-bosque.jpg",
  cabanaTecho: "img/cabana-techo.jpg",
  cabanaHogar: "img/cabana-hogar.jpg",
  cabanaDeck: "img/cabana-deck.jpg",
  cabanaDormi: "img/cabana-dormi.jpg",
  deptoLiving: "img/depto-living.jpg",
  deptoCocina: "img/depto-cocina.jpg",
  deptoBalcon: "img/depto-balcon.jpg",
  lago: "img/lago.jpg",
  cerro: "img/cerro.jpg",
  bosque: "img/bosque.jpg",
  valle: "img/valle.jpg",
  local: "img/local.jpg",
  nieve: "img/nieve.jpg",
  verano: "img/verano.jpg",
  bosque2: "img/bosque2.jpg",
  cerro2: "img/cerro2.jpg",
  lago2: "img/lago2.jpg",
  casaLago2: "img/casa-lago2.jpg",
  cabanaAframe: "img/cabana-aframe.jpg"
};

const ZONAS = [
  { id: "Centro", nombre: "Centro", foto: "img/zona-centro.jpg", texto: "Costanera, Centro Cívico y el lago a pocos pasos.", lat: -41.1335, lng: -71.3103 },
  { id: "Melipal", nombre: "Melipal", foto: "img/zona-melipal.jpg", texto: "Bosque y casas entre el centro y el oeste.", lat: -41.121, lng: -71.352 },
  { id: "Llao Llao", nombre: "Llao Llao", foto: "img/zona-llao.jpg", texto: "Oeste, lago y península.", lat: -41.056, lng: -71.416 },
  { id: "Circuito Chico", nombre: "Circuito Chico", foto: "img/zona-circuito.jpg", texto: "Cerro, costa y bosque hacia el oeste.", lat: -41.09, lng: -71.40 },
  { id: "Dina Huapi", nombre: "Dina Huapi", foto: "img/zona-dina.jpg", texto: "Pueblo al este del lago, más quieto.", lat: -41.07, lng: -71.166 },
  { id: "Colonia Suiza", nombre: "Colonia Suiza", foto: "img/zona-colonia.jpg", texto: "Bosque y arroyo, sobre el Circuito Chico.", lat: -41.096, lng: -71.508 },
  { id: "El Bolsón", nombre: "El Bolsón", foto: "img/zona-bolson.jpg", texto: "Valle al sur. Unas dos horas por la ruta 40.", lat: -41.966, lng: -71.533 }
];

function fotoPorTipo(tipo) {
  if (tipo === "casa") return FOTOS.casaPiedra;
  if (tipo === "cabana") return FOTOS.cabanaBosque;
  if (tipo === "terreno") return FOTOS.lago;
  if (tipo === "local") return FOTOS.local;
  return FOTOS.deptoLiving;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function amenityLabel(id) {
  return AMENITIES.find((a) => a.id === id)?.label || id;
}

function amenityIcon(id) {
  return AMENITIES.find((a) => a.id === id)?.icon || "·";
}

function ficha(extra) {
  return {
    zona: "Bariloche",
    status: "disponible",
    destacado: false,
    nuevo: false,
    vistas: 0,
    consultas: 0,
    cliente: null,
    visitas: [],
    history: [],
    expensas: 0,
    cochera: false,
    piso: "PB",
    ...extra
  };
}

function seed() {
  return [
    ficha({
      id: "p1",
      codigo: "VTA-101",
      titulo: "Casa de piedra y techo a dos aguas, Circuito Chico",
      tipo: "casa",
      operacion: "venta",
      direccion: "Circuito Chico km 18, Bariloche",
      barrio: "Circuito Chico",
      ambientes: 5,
      dormitorios: 3,
      banos: 2,
      superficie: 1400,
      cubierta: 168,
      precio: 420000,
      antiguedad: 18,
      orientacion: "Oeste",
      cochera: true,
      calefaccion: "Hogar a leña y radiadores a gas",
      vista: "Lago Nahuel Huapi",
      servicios: "Luz, gas de red, agua corriente, cloacas",
      amenities: ["lena", "parrilla", "jardin", "cochera"],
      descripcion: "Casa de piedra y madera sobre el Circuito Chico, techo a dos aguas. Living con hogar, tres dormitorios y jardín hacia el lago Nahuel Huapi. Cochera cubierta. Venta de vivienda, no estadía.",
      imagenes: ["img/zona-circuito.jpg", "img/hero-lago.jpg"],
      destacado: true,
      vistas: 16,
      consultas: 3,
      diasPublicada: 18,
      precioM2Zona: 2800,
      visitas: [
        { fecha: "6 sep", cliente: "Ana Ruiz", nota: "Pidió ver el hogar y el acceso en invierno." }
      ],
      history: [
        { when: "5 sep", text: "Publicada en cartera." }
      ]
    }),
    ficha({
      id: "p2",
      codigo: "ALQ-014",
      titulo: "Cabaña de pino en Melipal, alquiler permanente",
      tipo: "cabana",
      operacion: "alquiler",
      direccion: "Av. de los Pioneros 2400, Melipal",
      barrio: "Melipal",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 480,
      cubierta: 72,
      precio: 650000,
      antiguedad: 9,
      orientacion: "Norte",
      calefaccion: "Salamandra a leña y calefactores a gas",
      vista: "Bosque de pinos",
      servicios: "Luz, gas envasado, agua de red",
      amenities: ["lena", "parrilla", "jardin"],
      descripcion: "Cabaña de pino en Melipal, para vivir todo el año. Dos dormitorios, cocina-comedor y deck. El contrato es de alquiler permanente, no por noche. A minutos del centro en colectivo o auto.",
      imagenes: ["img/cabana-bosque.jpg", "img/zona-melipal.jpg"],
      destacado: true,
      vistas: 11,
      consultas: 2,
      diasPublicada: 12,
      precioM2Zona: 9000,
      history: [{ when: "1 sep", text: "Fotos del deck actualizadas." }]
    }),
    ficha({
      id: "p3",
      codigo: "VTA-118",
      titulo: "Lote con vista al lago, Llao Llao",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Camino a Llao Llao, Bariloche",
      barrio: "Llao Llao",
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 1800,
      cubierta: 0,
      precio: 265000,
      antiguedad: null,
      orientacion: "Oeste",
      piso: "—",
      calefaccion: "Sin construir",
      vista: "Lago Nahuel Huapi",
      servicios: "Luz en la calle. Agua y cloaca a consultar en la mensura",
      amenities: [],
      descripcion: "Lote en Llao Llao, sin edificación, frente abierto al lago Nahuel Huapi. Pendiente suave, bosque en el fondo. La ficha no incluye proyecto de obra ni aprobación municipal.",
      imagenes: ["img/zona-llao.jpg", "img/hero-lago.jpg"],
      nuevo: true,
      vistas: 9,
      consultas: 1,
      diasPublicada: 6,
      precioM2Zona: 180,
      history: [{ when: "4 sep", text: "Mensura de ejemplo cargada." }]
    }),
    ficha({
      id: "p4",
      codigo: "ALQ-022",
      titulo: "Departamento en el Centro, cerca del cívico",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Mitre 430, Centro",
      barrio: "Centro",
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie: 48,
      cubierta: 48,
      precio: 520000,
      expensas: 85000,
      antiguedad: 22,
      orientacion: "Norte",
      piso: "3°",
      calefaccion: "Radiadores a gas",
      vista: "Cerro Otto a lo lejos",
      servicios: "Luz, gas de red, agua, cloacas, expensas del edificio",
      amenities: ["balcon"],
      descripcion: "Departamento de un dormitorio en el Centro, a cuadras del Centro Cívico y del lago. Living con balcón, cocina separada y calefacción por radiadores. Alquiler permanente. Hay expensas.",
      imagenes: ["img/zona-centro.jpg", "img/depto-living.jpg"],
      vistas: 8,
      consultas: 1,
      diasPublicada: 20,
      precioM2Zona: 11000,
      history: [{ when: "20 ago", text: "Publicado." }]
    }),
    ficha({
      id: "p5",
      codigo: "VTA-130",
      titulo: "Casa de madera entre árboles, Colonia Suiza",
      tipo: "casa",
      operacion: "venta",
      direccion: "Calle principal, Colonia Suiza",
      barrio: "Colonia Suiza",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 980,
      cubierta: 142,
      precio: 310000,
      antiguedad: 14,
      orientacion: "Noreste",
      cochera: true,
      calefaccion: "Hogar a leña y losa radiante en planta baja",
      vista: "Bosque y cerro",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "quincho", "jardin", "cochera"],
      descripcion: "Casa de madera y techo a dos aguas en Colonia Suiza, sobre el Circuito Chico. Tres dormitorios, quincho y cochera. Entorno de bosque, más quieto que el centro. Venta.",
      imagenes: ["img/zona-colonia.jpg", "img/cabana-bosque.jpg"],
      destacado: true,
      vistas: 14,
      consultas: 2,
      diasPublicada: 28,
      precioM2Zona: 2400,
      visitas: [
        { fecha: "2 sep", cliente: "Luis Pereyra", nota: "Quiere medir el lote con el escribano." }
      ],
      history: [{ when: "12 ago", text: "Captada." }]
    }),
    ficha({
      id: "p6",
      codigo: "VTA-141",
      titulo: "Cabaña de pino con hogar, Dina Huapi",
      tipo: "cabana",
      operacion: "venta",
      direccion: "Los Arrayanes 80, Dina Huapi",
      barrio: "Dina Huapi",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 620,
      cubierta: 78,
      precio: 185000,
      antiguedad: 11,
      orientacion: "Oeste",
      calefaccion: "Salamandra a leña",
      vista: "Lago Nahuel Huapi",
      servicios: "Luz, agua corriente, gas envasado",
      amenities: ["lena", "parrilla", "jardin"],
      descripcion: "Cabaña de pino en Dina Huapi, pueblo al este del lago. Dos dormitorios, hogar y jardín hacia el agua. Se llega por la ruta de la costa este, fuera del casco de Bariloche. Venta.",
      imagenes: ["img/zona-dina.jpg", "img/hero-lago.jpg"],
      vistas: 7,
      consultas: 1,
      diasPublicada: 15,
      precioM2Zona: 2200,
      history: [{ when: "25 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p7",
      codigo: "VTA-155",
      titulo: "Casa de piedra frente al lago, Llao Llao",
      tipo: "casa",
      operacion: "venta",
      direccion: "Av. Bustillo km 24, Llao Llao",
      barrio: "Llao Llao",
      ambientes: 6,
      dormitorios: 4,
      banos: 3,
      superficie: 2100,
      cubierta: 240,
      precio: 780000,
      antiguedad: 7,
      orientacion: "Oeste",
      cochera: true,
      calefaccion: "Losa radiante y hogar a leña",
      vista: "Lago Nahuel Huapi y cerros",
      servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "parrilla", "jardin", "cochera", "terraza"],
      descripcion: "Casa de piedra y madera en Llao Llao, techos a dos aguas. Cuatro dormitorios, living con vista al Nahuel Huapi y terreno con pinos. Cochera para dos autos. Venta. No es una habitación de hotel.",
      imagenes: ["img/hero-lago.jpg", "img/zona-llao.jpg"],
      destacado: true,
      nuevo: true,
      vistas: 21,
      consultas: 4,
      diasPublicada: 8,
      precioM2Zona: 3200,
      history: [{ when: "2 sep", text: "Publicada como destacada." }]
    }),
    ficha({
      id: "p8",
      codigo: "VTA-162",
      titulo: "Departamento con vista al cerro, Centro",
      tipo: "departamento",
      operacion: "venta",
      direccion: "Elflein 90, Centro",
      barrio: "Centro",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 74,
      cubierta: 74,
      precio: 168000,
      expensas: 92000,
      antiguedad: 16,
      orientacion: "Sur",
      piso: "5°",
      calefaccion: "Radiadores a gas",
      vista: "Cerro Otto",
      servicios: "Luz, gas de red, agua, cloacas, expensas",
      amenities: ["balcon", "baulera"],
      descripcion: "Departamento de dos dormitorios en el Centro, piso alto, ventana al Cerro Otto. Cocina separada y balcón. Hay baulera. Venta. Las expensas las paga quien vive.",
      imagenes: ["img/depto-living.jpg", "img/zona-circuito.jpg"],
      vistas: 6,
      consultas: 1,
      diasPublicada: 11,
      precioM2Zona: 2300,
      history: [{ when: "29 ago", text: "Publicado." }]
    }),
    ficha({
      id: "p9",
      codigo: "ALQ-031",
      titulo: "Casa de montaña en El Bolsón, alquiler permanente",
      tipo: "casa",
      operacion: "alquiler",
      direccion: "Av. San Martín 1100, El Bolsón",
      barrio: "El Bolsón",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 760,
      cubierta: 120,
      precio: 480000,
      antiguedad: 20,
      orientacion: "Norte",
      cochera: true,
      calefaccion: "Hogar a leña y estufas a gas",
      vista: "Cerro Piltriquitrón",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"],
      descripcion: "Casa de montaña en El Bolsón, sur del Nahuel Huapi, a unas dos horas de Bariloche por la ruta 40. Tres dormitorios, hogar y patio. Alquiler permanente en el pueblo, no cabaña de temporada.",
      imagenes: ["img/zona-bolson.jpg", "img/cabana-hogar.jpg"],
      vistas: 5,
      consultas: 1,
      diasPublicada: 14,
      precioM2Zona: 4000,
      history: [{ when: "26 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p10",
      codigo: "ALQ-040",
      titulo: "Local sobre Mitre",
      tipo: "local",
      operacion: "alquiler",
      direccion: "Mitre 780, Centro",
      barrio: "Centro",
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie: 55,
      cubierta: 55,
      precio: 900000,
      expensas: 40000,
      antiguedad: 30,
      orientacion: "Este",
      calefaccion: "Calefactor a gas",
      vista: "Calle Mitre",
      servicios: "Luz, gas de red, agua, cloacas",
      amenities: [],
      descripcion: "Local a la calle en el Centro, vidriera a Mitre, salón y baño. Sirve para comercio o estudio. Alquiler permanente, no puesto de temporada.",
      imagenes: ["img/local.jpg", "img/zona-centro.jpg"],
      vistas: 4,
      consultas: 0,
      diasPublicada: 40,
      precioM2Zona: 16000,
      history: [{ when: "1 ago", text: "Disponible para mostrar." }]
    }),
    ficha({
      id: "p11",
      codigo: "ALQ-018",
      titulo: "Cabaña reservada en Melipal",
      tipo: "cabana",
      operacion: "alquiler",
      direccion: "Beschtedt 1500, Melipal",
      barrio: "Melipal",
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie: 360,
      cubierta: 52,
      precio: 430000,
      antiguedad: 6,
      orientacion: "Este",
      calefaccion: "Salamandra a leña",
      vista: "Bosque",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "parrilla"],
      descripcion: "Cabaña de un dormitorio en Melipal, reservada. Living con salamandra y parrilla. El alquiler permanente está en trámite de contrato.",
      imagenes: ["img/casa-madera.jpg", "img/zona-melipal.jpg"],
      status: "reservada",
      vistas: 10,
      consultas: 2,
      diasPublicada: 22,
      precioM2Zona: 8500,
      cliente: { nombre: "Familia Soto", tel: "294-400-2211", desde: "7 sep" },
      visitas: [
        { fecha: "7 sep", cliente: "Familia Soto", nota: "Reservaron. Falta garantía." }
      ],
      history: [{ when: "7 sep", text: "Reserva anotada." }]
    }),
    ficha({
      id: "p12",
      codigo: "VTA-170",
      titulo: "Lote con vista al cerro, Circuito Chico",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Circuito Chico, altura km 12",
      barrio: "Circuito Chico",
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 1500,
      cubierta: 0,
      precio: 198000,
      antiguedad: null,
      orientacion: "Norte",
      piso: "—",
      calefaccion: "Sin construir",
      vista: "Cerro López y bosque",
      servicios: "Luz en la calle. El resto se confirma en la escritura de ejemplo",
      amenities: [],
      descripcion: "Lote sobre el Circuito Chico, sin casa. Vista al cerro y al bosque de lengas y pinos. Acceso por camino consolidado. Venta del terreno solamente.",
      imagenes: ["img/paisaje-lago.jpg", "img/zona-circuito.jpg"],
      nuevo: true,
      vistas: 8,
      consultas: 1,
      diasPublicada: 5,
      precioM2Zona: 150,
      history: [{ when: "5 sep", text: "Alta en cartera." }]
    }),
    ficha({
      id: "p13",
      codigo: "VTA-181",
      titulo: "Casa de piedra baja en Melipal",
      tipo: "casa",
      operacion: "venta",
      direccion: "Rolando 900, Melipal",
      barrio: "Melipal",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 700,
      cubierta: 132,
      precio: 275000,
      antiguedad: 16,
      orientacion: "Norte",
      cochera: true,
      calefaccion: "Radiadores a gas y hogar a leña",
      vista: "Bosque y cerro",
      servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "jardin", "cochera", "parrilla"],
      descripcion: "Casa de piedra y madera en Melipal, techo a dos aguas. Tres dormitorios, jardín con parrilla y cochera. Para vivir todo el año, a pocos minutos del centro. Venta.",
      imagenes: ["img/cabana-hogar.jpg", "img/zona-melipal.jpg"],
      vistas: 6,
      consultas: 1,
      diasPublicada: 9,
      precioM2Zona: 2100,
      history: [{ when: "28 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p14",
      codigo: "ALQ-044",
      titulo: "Departamento 3 ambientes en el Centro",
      tipo: "departamento",
      operacion: "alquiler",
      direccion: "Quaglia 250, Centro",
      barrio: "Centro",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 68,
      cubierta: 68,
      precio: 610000,
      expensas: 78000,
      antiguedad: 28,
      orientacion: "Este",
      piso: "2°",
      calefaccion: "Radiadores a gas",
      vista: "Calle arbolada, cerro a lo lejos",
      servicios: "Luz, gas de red, agua, cloacas, expensas",
      amenities: ["balcon"],
      descripcion: "Departamento de dos dormitorios en el Centro, cerca de Mitre y del lago. Calefacción por radiadores, útil en invierno. Alquiler permanente. Hay expensas del edificio.",
      imagenes: ["img/depto-balcon.jpg", "img/zona-centro.jpg"],
      vistas: 5,
      consultas: 1,
      diasPublicada: 7,
      precioM2Zona: 10000,
      history: [{ when: "3 sep", text: "Publicado." }]
    }),
    ficha({
      id: "p15",
      codigo: "ALQ-051",
      titulo: "Cabaña de pino en el Circuito Chico, alquiler permanente",
      tipo: "cabana",
      operacion: "alquiler",
      direccion: "Circuito Chico km 8, Bariloche",
      barrio: "Circuito Chico",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 540,
      cubierta: 70,
      precio: 720000,
      antiguedad: 8,
      orientacion: "Oeste",
      calefaccion: "Salamandra a leña y calefactor a gas",
      vista: "Bosque y tramo del lago",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "parrilla", "jardin"],
      descripcion: "Cabaña de pino sobre el Circuito Chico. Dos dormitorios, deck y parrilla. El contrato es anual, para vivir, no por fin de semana. En invierno el camino se transita con precaución.",
      imagenes: ["img/interior-hogar.jpg", "img/zona-circuito.jpg"],
      vistas: 8,
      consultas: 2,
      diasPublicada: 10,
      precioM2Zona: 9500,
      history: [{ when: "30 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p16",
      codigo: "VTA-188",
      titulo: "Lote con vista al lago, Dina Huapi",
      tipo: "terreno",
      operacion: "venta",
      direccion: "Costa este, Dina Huapi",
      barrio: "Dina Huapi",
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie: 1100,
      cubierta: 0,
      precio: 145000,
      antiguedad: null,
      orientacion: "Oeste",
      piso: "—",
      calefaccion: "Sin construir",
      vista: "Lago Nahuel Huapi",
      servicios: "Luz en la calle. Agua a consultar",
      amenities: [],
      descripcion: "Lote en Dina Huapi, al este del Nahuel Huapi, sin construcción. Vista abierta al lago. El pueblo queda a una distancia corta en auto. Venta del terreno, sin proyecto de obra.",
      imagenes: ["img/zona-todas.jpg", "img/zona-dina.jpg"],
      vistas: 4,
      consultas: 0,
      diasPublicada: 4,
      precioM2Zona: 140,
      history: [{ when: "6 sep", text: "Alta en cartera." }]
    }),
    ficha({
      id: "p17",
      codigo: "VTA-192",
      titulo: "Casa de madera y piedra en El Bolsón",
      tipo: "casa",
      operacion: "venta",
      direccion: "Azcuénaga 420, El Bolsón",
      barrio: "El Bolsón",
      ambientes: 5,
      dormitorios: 3,
      banos: 2,
      superficie: 900,
      cubierta: 155,
      precio: 240000,
      antiguedad: 12,
      orientacion: "Norte",
      cochera: true,
      calefaccion: "Hogar a leña y estufas a gas",
      vista: "Cerro Piltriquitrón y valle",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera", "quincho"],
      descripcion: "Casa de madera y piedra en El Bolsón, sur de Bariloche por la ruta 40. Tres dormitorios, quincho y cochera. Uso permanente. El valle es más tranquilo que el casco de Bariloche.",
      imagenes: ["img/interior-hogar.jpg", "img/zona-bolson.jpg"],
      vistas: 7,
      consultas: 1,
      diasPublicada: 13,
      precioM2Zona: 1600,
      history: [{ when: "27 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p18",
      codigo: "ALQ-058",
      titulo: "Casa baja en Colonia Suiza, alquiler permanente",
      tipo: "casa",
      operacion: "alquiler",
      direccion: "Camino a Colonia Suiza, Bariloche",
      barrio: "Colonia Suiza",
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie: 640,
      cubierta: 118,
      precio: 690000,
      antiguedad: 19,
      orientacion: "Noreste",
      cochera: true,
      calefaccion: "Losa radiante en living y hogar a leña",
      vista: "Bosque y cerro",
      servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"],
      descripcion: "Casa baja de madera en Colonia Suiza, sobre el oeste del Circuito Chico. Tres dormitorios y jardín entre árboles. Alquiler permanente. En verano hay más movimiento de visitantes en la zona; en invierno es más quieto.",
      imagenes: ["img/bosque2.jpg", "img/zona-colonia.jpg"],
      vistas: 5,
      consultas: 1,
      diasPublicada: 16,
      precioM2Zona: 7000,
      history: [{ when: "24 ago", text: "Publicada." }]
    }),
    ficha({
      id: "p19",
      codigo: "VTA-201",
      titulo: "Cabaña con techo a dos aguas, Llao Llao",
      tipo: "cabana",
      operacion: "venta",
      direccion: "Av. Bustillo km 22, Llao Llao",
      barrio: "Llao Llao",
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie: 860,
      cubierta: 84,
      precio: 355000,
      antiguedad: 5,
      orientacion: "Oeste",
      calefaccion: "Hogar a leña y radiadores",
      vista: "Lago Nahuel Huapi",
      servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "terraza", "jardin"],
      descripcion: "Cabaña de pino y piedra en Llao Llao, techo a dos aguas. Dos dormitorios y terraza hacia el lago. Puede usarse como vivienda permanente o segunda casa: la ficha no promete alquiler turístico.",
      imagenes: ["img/cabana-dormi.jpg", "img/zona-llao.jpg"],
      destacado: true,
      vistas: 12,
      consultas: 2,
      diasPublicada: 6,
      precioM2Zona: 3000,
      history: [{ when: "4 sep", text: "Publicada." }]
    }),
    ficha({
      id: "p20",
      codigo: "ALQ-063",
      titulo: "Casa de montaña en Melipal, alquiler permanente",
      tipo: "casa",
      operacion: "alquiler",
      direccion: "Onelli 1800, Melipal",
      barrio: "Melipal",
      ambientes: 5,
      dormitorios: 3,
      banos: 2,
      superficie: 520,
      cubierta: 128,
      precio: 780000,
      antiguedad: 10,
      orientacion: "Norte",
      cochera: true,
      calefaccion: "Radiadores a gas y salamandra",
      vista: "Cerro y barrio arbolado",
      servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "cochera", "jardin", "parrilla"],
      descripcion: "Casa de montaña en Melipal para una familia. Tres dormitorios, cochera y calefacción para el invierno barilochense. Cerca de la avenida de los Pioneros y del centro. Alquiler permanente.",
      imagenes: ["img/zona-melipal.jpg", "img/cabana-bosque.jpg"],
      vistas: 9,
      consultas: 2,
      diasPublicada: 11,
      precioM2Zona: 7500,
      history: [{ when: "29 ago", text: "Publicada." }]
    })
  ];
}

const STORAGE_KEY = "inmobiliaria-demo-v8";
const DEMO_WA_PHONE = "5492915757934";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function recordListingView(list, id) {
  const item = list.find((p) => p.id === id);
  if (!item) return null;
  item.vistas = Number(item.vistas || 0) + 1;
  save(list);
  return item;
}

function recordListingConsulta(list, id) {
  const item = list.find((p) => p.id === id);
  if (!item) return null;
  item.consultas = Number(item.consultas || 0) + 1;
  save(list);
  return item;
}

function propertyWaUrl(p) {
  const text = `Hola, quiero consultar por ${p.codigo}: ${p.titulo}`;
  return "https://wa.me/" + DEMO_WA_PHONE + "?text=" + encodeURIComponent(text);
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS.find((t) => t.id === tipo)?.label || tipo;
}

function opLabel(op) {
  return OPERACIONES.find((o) => o.id === op)?.label || op;
}

function money(amount, usd = false) {
  if (usd) return "USD " + Number(amount || 0).toLocaleString("es-AR");
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}
