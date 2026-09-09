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
    }),
    ficha({
      id: "p21", codigo: "VTA-121", titulo: "Departamento de dos dormitorios en el Centro, venta",
      tipo: "departamento", operacion: "venta", direccion: "Zona Centro, Bariloche", barrio: "Centro",
      ambientes: 3, dormitorios: 2, banos: 1, superficie: 78, cubierta: 72, precio: 168000,
      antiguedad: 22, orientacion: "Norte", piso: "2°", calefaccion: "Radiadores a gas",
      vista: "Calle arbolada y cerro a lo lejos", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["balcon"], descripcion: "Departamento en venta en el Centro, a pocas cuadras del Centro Cívico. Dos dormitorios, balcón y radiadores. No publicamos la parcela exacta.",
      imagenes: ["img/depto-cocina.jpg", "img/zona-centro.jpg"]
    }),
    ficha({
      id: "p22", codigo: "VTA-122", titulo: "Departamento con vista al lago, Centro",
      tipo: "departamento", operacion: "venta", direccion: "Zona Centro, Bariloche", barrio: "Centro",
      ambientes: 2, dormitorios: 1, banos: 1, superficie: 54, cubierta: 48, precio: 142000,
      antiguedad: 16, orientacion: "Oeste", piso: "4°", calefaccion: "Radiadores a gas",
      vista: "Lago Nahuel Huapi", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["balcon"], descripcion: "Venta de un ambiente amplio con dormitorio, balcón hacia el lago y calefacción por radiadores. El pin de la ficha es la zona, no el edificio.",
      imagenes: ["img/lugar-lago.jpg", "img/depto-living.jpg"]
    }),
    ficha({
      id: "p23", codigo: "VTA-123", titulo: "Casa de madera entre pinos, Melipal",
      tipo: "casa", operacion: "venta", direccion: "Zona Melipal, Bariloche", barrio: "Melipal",
      ambientes: 4, dormitorios: 2, banos: 2, superficie: 480, cubierta: 96, precio: 245000,
      antiguedad: 14, orientacion: "Norte", cochera: true, calefaccion: "Hogar a leña y radiadores a gas",
      vista: "Bosque y barrio", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "jardin", "cochera"], descripcion: "Casa de madera en venta en Melipal, entre pinos, con hogar y cochera. Para vivir el año, no estadía.",
      imagenes: ["img/cabana-aframe.jpg", "img/zona-melipal.jpg"]
    }),
    ficha({
      id: "p24", codigo: "VTA-124", titulo: "Lote arbolado en Melipal",
      tipo: "terreno", operacion: "venta", direccion: "Zona Melipal, Bariloche", barrio: "Melipal",
      ambientes: 0, dormitorios: 0, banos: 0, superficie: 720, cubierta: 0, precio: 98000,
      antiguedad: null, orientacion: "Noreste", calefaccion: "—",
      vista: "Bosque", servicios: "Luz y agua en la calle",
      amenities: [], descripcion: "Lote en venta en Melipal, entre árboles, para construir casa permanente. No incluye proyecto ni promesa de plusvalía.",
      imagenes: ["img/bosque2.jpg", "img/zona-melipal.jpg"]
    }),
    ficha({
      id: "p25", codigo: "VTA-125", titulo: "Casa de piedra y madera en Llao Llao",
      tipo: "casa", operacion: "venta", direccion: "Zona Llao Llao, Bariloche", barrio: "Llao Llao",
      ambientes: 6, dormitorios: 4, banos: 3, superficie: 1600, cubierta: 210, precio: 620000,
      antiguedad: 11, orientacion: "Oeste", cochera: true, calefaccion: "Losa radiante y hogar a leña",
      vista: "Lago Nahuel Huapi", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "jardin", "cochera", "parrilla"], descripcion: "Casa en venta en Llao Llao, piedra y madera, techo a dos aguas y vista al lago. Cochera cubierta para el invierno.",
      imagenes: ["img/lugar-panuelo.jpg", "img/zona-llao.jpg"]
    }),
    ficha({
      id: "p26", codigo: "VTA-126", titulo: "Lote con costa de lago, Llao Llao",
      tipo: "terreno", operacion: "venta", direccion: "Zona Llao Llao, Bariloche", barrio: "Llao Llao",
      ambientes: 0, dormitorios: 0, banos: 0, superficie: 2100, cubierta: 0, precio: 410000,
      antiguedad: null, orientacion: "Oeste", calefaccion: "—",
      vista: "Lago Nahuel Huapi", servicios: "Luz en el camino; agua a consultar",
      amenities: [], descripcion: "Lote en venta en Llao Llao, con frente hacia el lago. El pin es de la zona, no de la parcela.",
      imagenes: ["img/zona-llao.jpg", "img/lugar-lago.jpg"]
    }),
    ficha({
      id: "p27", codigo: "VTA-127", titulo: "Casa de madera camino al cerro, Circuito Chico",
      tipo: "casa", operacion: "venta", direccion: "Zona Circuito Chico, Bariloche", barrio: "Circuito Chico",
      ambientes: 5, dormitorios: 3, banos: 2, superficie: 1100, cubierta: 142, precio: 390000,
      antiguedad: 9, orientacion: "Sur", cochera: true, calefaccion: "Hogar a leña y salamandra",
      vista: "Cerro nevado y bosque", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"], descripcion: "Casa de madera en venta sobre el Circuito Chico. En invierno el cerro se pone blanco y la casa se vive adentro: tiene hogar y cochera.",
      imagenes: ["img/lugar-catedral.jpg", "img/zona-circuito.jpg"]
    }),
    ficha({
      id: "p28", codigo: "VTA-128", titulo: "Cabaña de pino en el Circuito Chico, venta",
      tipo: "cabana", operacion: "venta", direccion: "Zona Circuito Chico, Bariloche", barrio: "Circuito Chico",
      ambientes: 3, dormitorios: 2, banos: 1, superficie: 640, cubierta: 68, precio: 215000,
      antiguedad: 7, orientacion: "Oeste", calefaccion: "Salamandra a leña y calefactor a gas",
      vista: "Bosque y tramo de lago", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "parrilla", "jardin"], descripcion: "Cabaña de pino en venta en el Circuito Chico. Dos dormitorios, deck y calefacción para el invierno. Vivienda, no estadía de fin de semana.",
      imagenes: ["img/cabana-techo.jpg", "img/zona-circuito.jpg"]
    }),
    ficha({
      id: "p29", codigo: "VTA-129", titulo: "Casa baja de piedra en Dina Huapi",
      tipo: "casa", operacion: "venta", direccion: "Zona Dina Huapi, Bariloche", barrio: "Dina Huapi",
      ambientes: 4, dormitorios: 2, banos: 1, superficie: 560, cubierta: 88, precio: 198000,
      antiguedad: 20, orientacion: "Este", cochera: true, calefaccion: "Hogar a leña y radiadores",
      vista: "Pueblo y lago a lo lejos", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"], descripcion: "Casa baja en venta en Dina Huapi, pueblo al este del lago. Más quieto que el Centro. Hogar y cochera para el invierno.",
      imagenes: ["img/zona-dina.jpg", "img/cabana-bosque.jpg"]
    }),
    ficha({
      id: "p30", codigo: "VTA-130", titulo: "Lote con vista al lago, Dina Huapi",
      tipo: "terreno", operacion: "venta", direccion: "Zona Dina Huapi, Bariloche", barrio: "Dina Huapi",
      ambientes: 0, dormitorios: 0, banos: 0, superficie: 900, cubierta: 0, precio: 125000,
      antiguedad: null, orientacion: "Oeste", calefaccion: "—",
      vista: "Lago Nahuel Huapi", servicios: "Luz en la calle",
      amenities: [], descripcion: "Lote en venta en Dina Huapi, hacia el lago. Pueblo aparte del centro. El pin es aproximado de la zona, no de la parcela.",
      imagenes: ["img/paisaje-lago.jpg", "img/zona-dina.jpg"]
    }),
    ficha({
      id: "p31", codigo: "VTA-131", titulo: "Casa de madera entre árboles, Colonia Suiza",
      tipo: "casa", operacion: "venta", direccion: "Zona Colonia Suiza, Bariloche", barrio: "Colonia Suiza",
      ambientes: 5, dormitorios: 3, banos: 2, superficie: 980, cubierta: 134, precio: 275000,
      antiguedad: 12, orientacion: "Norte", cochera: true, calefaccion: "Losa radiante y hogar a leña",
      vista: "Bosque y cerro", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"], descripcion: "Casa de madera en venta en Colonia Suiza, entre árboles, sobre el oeste. Para vivir el año. En temporada hay más visitantes en la zona.",
      imagenes: ["img/cabana-hogar.jpg", "img/zona-colonia.jpg"]
    }),
    ficha({
      id: "p32", codigo: "VTA-132", titulo: "Cabaña de pino en Colonia Suiza, venta",
      tipo: "cabana", operacion: "venta", direccion: "Zona Colonia Suiza, Bariloche", barrio: "Colonia Suiza",
      ambientes: 3, dormitorios: 2, banos: 1, superficie: 700, cubierta: 74, precio: 189000,
      antiguedad: 6, orientacion: "Este", calefaccion: "Salamandra a leña",
      vista: "Bosque", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "parrilla"], descripcion: "Cabaña de pino en venta en Colonia Suiza. Dos dormitorios, jardín y salamandra. El contrato de uso previsto es vivienda permanente o segunda casa, no alquiler turístico.",
      imagenes: ["img/cabana-dormi.jpg", "img/zona-colonia.jpg"]
    }),
    ficha({
      id: "p33", codigo: "VTA-133", titulo: "Casa de montaña en El Bolsón, venta",
      tipo: "casa", operacion: "venta", direccion: "Zona El Bolsón", barrio: "El Bolsón",
      ambientes: 5, dormitorios: 3, banos: 2, superficie: 1300, cubierta: 156, precio: 230000,
      antiguedad: 15, orientacion: "Norte", cochera: true, calefaccion: "Hogar a leña y radiadores",
      vista: "Valle y cerro", servicios: "Luz, agua de red, gas envasado",
      amenities: ["lena", "jardin", "cochera"], descripcion: "Casa de montaña en venta en El Bolsón, al sur de Bariloche. Se llega por la ruta 40, unas dos horas. Valle y cerro, no el lago Nahuel Huapi en la puerta.",
      imagenes: ["img/zona-bolson.jpg", "img/cabana-hogar.jpg"]
    }),
    ficha({
      id: "p34", codigo: "VTA-134", titulo: "Lote con cerro en El Bolsón",
      tipo: "terreno", operacion: "venta", direccion: "Zona El Bolsón", barrio: "El Bolsón",
      ambientes: 0, dormitorios: 0, banos: 0, superficie: 1800, cubierta: 0, precio: 72000,
      antiguedad: null, orientacion: "Oeste", calefaccion: "—",
      vista: "Valle y cerro", servicios: "Luz en el camino",
      amenities: [], descripcion: "Lote en venta en el valle de El Bolsón, con vista al cerro. No es el mismo municipio que Bariloche.",
      imagenes: ["img/valle.jpg", "img/zona-bolson.jpg"]
    }),
    ficha({
      id: "p35", codigo: "VTA-135", titulo: "Casa baja en el Centro, venta",
      tipo: "casa", operacion: "venta", direccion: "Zona Centro, Bariloche", barrio: "Centro",
      ambientes: 4, dormitorios: 2, banos: 1, superficie: 220, cubierta: 92, precio: 260000,
      antiguedad: 40, orientacion: "Sur", cochera: false, calefaccion: "Hogar a leña y radiadores a gas",
      vista: "Calle del centro", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena"], descripcion: "Casa baja en venta en el Centro, cerca de la costanera. Dos dormitorios y hogar. En invierno hay nieve en la calle; la ficha indica la calefacción.",
      imagenes: ["img/zona-centro.jpg", "img/interior-hogar.jpg"]
    }),
    ficha({
      id: "p36", codigo: "VTA-136", titulo: "Casa con jardín en Melipal, venta",
      tipo: "casa", operacion: "venta", direccion: "Zona Melipal, Bariloche", barrio: "Melipal",
      ambientes: 5, dormitorios: 3, banos: 2, superficie: 610, cubierta: 140, precio: 310000,
      antiguedad: 8, orientacion: "Norte", cochera: true, calefaccion: "Radiadores a gas y hogar a leña",
      vista: "Barrio arbolado", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "jardin", "cochera", "parrilla"], descripcion: "Casa familiar en venta en Melipal, entre el centro y el oeste. Tres dormitorios, jardín y cochera. Alquiler permanente no: es venta.",
      imagenes: ["img/casa-madera.jpg", "img/zona-melipal.jpg"]
    }),
    ficha({
      id: "p37", codigo: "VTA-137", titulo: "Cabaña con techo a dos aguas, Llao Llao, venta",
      tipo: "cabana", operacion: "venta", direccion: "Zona Llao Llao, Bariloche", barrio: "Llao Llao",
      ambientes: 4, dormitorios: 2, banos: 1, superficie: 800, cubierta: 82, precio: 340000,
      antiguedad: 4, orientacion: "Oeste", calefaccion: "Hogar a leña y losa radiante",
      vista: "Lago y bosque", servicios: "Luz, gas de red, agua, cloacas",
      amenities: ["lena", "terraza", "jardin"], descripcion: "Cabaña en venta en Llao Llao, techo a dos aguas y terraza hacia el lago. Puede usarse de vivienda permanente o segunda casa. No prometemos alquiler turístico.",
      imagenes: ["img/hero-lago.jpg", "img/cabana-dormi.jpg"]
    }),
    ficha({
      id: "p38", codigo: "VTA-138", titulo: "Local sobre la costanera, Centro, venta",
      tipo: "local", operacion: "venta", direccion: "Zona Centro, Bariloche", barrio: "Centro",
      ambientes: 1, dormitorios: 0, banos: 1, superficie: 64, cubierta: 64, precio: 210000,
      antiguedad: 30, orientacion: "Oeste", piso: "PB", calefaccion: "Calefactor a gas",
      vista: "Costanera y lago", servicios: "Luz, gas de red, agua, cloacas",
      amenities: [], descripcion: "Local en venta sobre la costanera del Centro, con vista al lago. Vidriera a la calle. No es vivienda.",
      imagenes: ["img/local.jpg", "img/zona-centro.jpg"]
    })
  ];
}

const STORAGE_KEY = "inmobiliaria-demo-v9";
const CUENTAS_KEY = "inmobiliaria-demo-cuentas-v1";
const COLA_KEY = "inmobiliaria-demo-cola-v1";
const USERS_KEY = "inmobiliaria-demo-usuarios-v1";
const SESSION_KEY = "inmobiliaria-demo-sesion-v1";
const VITRINA_KEY = "inmobiliaria-demo-vitrina-v1";
const DEMO_WA_PHONE = "5492915757934";

const STAFF_ROLES = [
  { id: "titular", label: "Titular" },
  { id: "agente", label: "Agente" },
  { id: "agenda", label: "Agenda" }
];

function defaultUsers() {
  return [
    { id: "u-titular", user: "milena", pass: "demo", nombre: "Milena Huapi", rol: "titular", activo: true },
    { id: "u-agente", user: "nahuel", pass: "demo", nombre: "Nahuel Lagos", rol: "agente", activo: true },
    { id: "u-agenda", user: "agenda", pass: "demo", nombre: "Laura Visitas", rol: "agenda", activo: true }
  ];
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const data = defaultUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(data));
      return data;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      const data = defaultUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(data));
      return data;
    }
    return parsed;
  } catch (e) {
    return defaultUsers();
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadStaffSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.user) return null;
    const user = loadUsers().find((u) => u.user === data.user && u.activo !== false);
    return user || null;
  } catch (e) {
    return null;
  }
}

function saveStaffSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user: user.user, nombre: user.nombre, rol: user.rol }));
}

function clearStaffSession() {
  localStorage.removeItem(SESSION_KEY);
}

function roleLabel(rol) {
  return STAFF_ROLES.find((r) => r.id === rol)?.label || rol;
}

function defaultVitrinaPage() {
  return {
    visible: {
      hero: true,
      zonas: true,
      propiedades: true,
      lugares: true,
      mudarse: true,
      estudio: true,
      contacto: true,
      pie: true,
      agentes: true
    },
    copy: {
      marca: {
        nombre: "Estudio Nahuel Huapi",
        tagline: "Casas en Bariloche"
      },
      hero: {
        kicker: "San Carlos de Bariloche · lago Nahuel Huapi",
        title: "Casas de piedra y madera frente al lago",
        lead: "Venta o alquiler permanente en Bariloche y el sur cercano. No es estadía de hotel. El paisaje es el lago, los cerros y el bosque."
      },
      zonas: {
        kicker: "La comarca",
        title: "Elija una zona",
        lead: "Toque un recuadro para ver solo esas propiedades. El pin marca el barrio, no la parcela.",
        allBtn: "Ver todas las zonas",
        mapaNote: "Toque un nombre para filtrar esa zona."
      },
      propiedades: {
        verMas: "Ver más"
      },
      lugares: {
        kicker: "Lugares",
        title: "Una tira para ubicarse",
        slides: [
          { title: "Centro Cívico", text: "El Centro Cívico abre la costanera y el lago. Si se muda al Centro, camina hasta Mitre y al agua.", cta: "Ver propiedades del Centro" },
          { title: "Lago Nahuel Huapi", text: "El lago es el paisaje de la ciudad: costa, cerros y nieve en las cumbres. No todas las casas dan al agua; mire la ficha.", cta: "" },
          { title: "Circuito Chico", text: "Recorre costa, bosque y cerro hacia el oeste. En invierno conviene auto y mirar cómo se llega a la casa.", cta: "Ver propiedades del Circuito Chico" },
          { title: "Llao Llao", text: "Queda al oeste, entre el lago y la península. Las casas de esa zona suelen mirar al agua o al bosque.", cta: "Ver propiedades de Llao Llao" },
          { title: "Cerro Catedral", text: "Es el cerro de invierno, al suroeste del centro. Si vive cerca, la nieve es parte del año, no una visita.", cta: "" },
          { title: "Colonia Suiza", text: "Está entre árboles, sobre el oeste. Es más quieto que Mitre en temporada.", cta: "Ver propiedades de Colonia Suiza" },
          { title: "Puerto Pañuelo", text: "Es la bahía del oeste, cerca de Llao Llao. Desde ahí se mira el lago; para vivir, fíjese el acceso en invierno.", cta: "Ver propiedades de Llao Llao" },
          { title: "Dina Huapi", text: "Es un pueblo al este del lago, aparte del centro. El ritmo es más tranquilo.", cta: "Ver propiedades de Dina Huapi" }
        ]
      },
      mudarse: {
        kicker: "Mudarse",
        title: "Qué implica vivir acá",
        lead: "No hay una promesa de plusvalía ni de alquiler turístico. Estas fichas son para quien busca casa, cabaña o lote para vivir de forma permanente, o como segunda vivienda.",
        cards: [
          { title: "El lago queda cerca", text: "En el Centro se camina hasta la costanera. En Llao Llao, Circuito Chico o Dina Huapi la vista al agua puede ser parte del lote. Mire la ficha: no todas dan al lago." },
          { title: "El invierno se vive adentro", text: "Nieve y frío son normales. Conviene hogar a leña, radiadores o losa radiante, y cochera si no quiere dejar el auto a la intemperie." },
          { title: "El ritmo es otro", text: "Melipal, Colonia Suiza y El Bolsón son más quietos que Mitre en temporada. El Centro tiene comercios a la vuelta. El Bolsón está a unas dos horas por la ruta 40." },
          { title: "Permanente o segunda casa", text: "La mayoría de estas fichas son para vivir el año. Si la casa sirve también de segunda vivienda, lo dice el texto. No ofrecemos rentabilidad ni inversión segura." }
        ]
      },
      estudio: {
        kicker: "Para el estudio",
        title: "Una carga, varios destinos",
        lead: "El catálogo de esta web sale del panel. Desde ahí se puede conectar Mercado Libre y armar el aviso para Instagram, Facebook o WhatsApp. Zonaprop y Argenprop se suman si hay cuenta. Los avisos pagos de cada portal se contratan aparte.",
        cta: "Ver difusión en el panel"
      },
      contacto: {
        title: "Consultar una propiedad",
        lead: "Escríbanos por WhatsApp o deje su consulta. El mensaje no sale a un servidor."
      },
      pie: {
        line1: "¿Es agente inmobiliario? El panel lista la cartera, cambia estados, registra visitas y elige si el aviso va a la web, a Mercado Libre o a redes. Esos datos no se muestran acá.",
        line2: "Estudio Nahuel Huapi · Bariloche · demo de producto · datos ficticios con fines ilustrativos. La venta se muestra en dólares y el alquiler permanente en pesos."
      }
    }
  };
}

const VITRINA_SECTIONS = [
  {
    id: "marca",
    label: "Encabezado",
    hint: "Nombre del estudio en la barra. Esta barra no se oculta: el visitante necesita el menú.",
    alwaysOn: true,
    fields: [
      { path: "marca.nombre", label: "Nombre", kind: "text" },
      { path: "marca.tagline", label: "Línea chica", kind: "text" }
    ]
  },
  {
    id: "hero",
    label: "Portada y búsqueda",
    hint: "El título de entrada y los filtros. Si la oculta, el visitante no ve esa portada.",
    fields: [
      { path: "hero.kicker", label: "Antetítulo", kind: "text" },
      { path: "hero.title", label: "Título", kind: "text" },
      { path: "hero.lead", label: "Texto", kind: "area" }
    ]
  },
  {
    id: "zonas",
    label: "Zonas",
    hint: "La comarca, el mapa y los recuadros. Los nombres de barrio salen de la cartera, no de este texto.",
    nav: "zonas",
    fields: [
      { path: "zonas.kicker", label: "Antetítulo", kind: "text" },
      { path: "zonas.title", label: "Título", kind: "text" },
      { path: "zonas.lead", label: "Texto", kind: "area" },
      { path: "zonas.allBtn", label: "Botón de todas las zonas", kind: "text" },
      { path: "zonas.mapaNote", label: "Nota del mapa", kind: "text" }
    ]
  },
  {
    id: "propiedades",
    label: "Listado de propiedades",
    hint: "El catálogo público. Las fichas se editan en Cartera.",
    nav: "propiedades",
    fields: [
      { path: "propiedades.verMas", label: "Botón Ver más", kind: "text" }
    ]
  },
  {
    id: "lugares",
    label: "Lugares",
    hint: "La tira de fotos para ubicarse. Cada lámina ya está en la vitrina.",
    nav: "lugares",
    fields: [
      { path: "lugares.kicker", label: "Antetítulo", kind: "text" },
      { path: "lugares.title", label: "Título", kind: "text" },
      { path: "lugares.slides.0.title", label: "Lámina 1 · título", kind: "text" },
      { path: "lugares.slides.0.text", label: "Lámina 1 · texto", kind: "area" },
      { path: "lugares.slides.0.cta", label: "Lámina 1 · botón", kind: "text" },
      { path: "lugares.slides.1.title", label: "Lámina 2 · título", kind: "text" },
      { path: "lugares.slides.1.text", label: "Lámina 2 · texto", kind: "area" },
      { path: "lugares.slides.2.title", label: "Lámina 3 · título", kind: "text" },
      { path: "lugares.slides.2.text", label: "Lámina 3 · texto", kind: "area" },
      { path: "lugares.slides.2.cta", label: "Lámina 3 · botón", kind: "text" },
      { path: "lugares.slides.3.title", label: "Lámina 4 · título", kind: "text" },
      { path: "lugares.slides.3.text", label: "Lámina 4 · texto", kind: "area" },
      { path: "lugares.slides.3.cta", label: "Lámina 4 · botón", kind: "text" },
      { path: "lugares.slides.4.title", label: "Lámina 5 · título", kind: "text" },
      { path: "lugares.slides.4.text", label: "Lámina 5 · texto", kind: "area" },
      { path: "lugares.slides.5.title", label: "Lámina 6 · título", kind: "text" },
      { path: "lugares.slides.5.text", label: "Lámina 6 · texto", kind: "area" },
      { path: "lugares.slides.5.cta", label: "Lámina 6 · botón", kind: "text" },
      { path: "lugares.slides.6.title", label: "Lámina 7 · título", kind: "text" },
      { path: "lugares.slides.6.text", label: "Lámina 7 · texto", kind: "area" },
      { path: "lugares.slides.6.cta", label: "Lámina 7 · botón", kind: "text" },
      { path: "lugares.slides.7.title", label: "Lámina 8 · título", kind: "text" },
      { path: "lugares.slides.7.text", label: "Lámina 8 · texto", kind: "area" },
      { path: "lugares.slides.7.cta", label: "Lámina 8 · botón", kind: "text" }
    ]
  },
  {
    id: "mudarse",
    label: "Mudarse",
    hint: "Qué implica vivir en Bariloche. Cuatro recuadros que ya están en la página.",
    fields: [
      { path: "mudarse.kicker", label: "Antetítulo", kind: "text" },
      { path: "mudarse.title", label: "Título", kind: "text" },
      { path: "mudarse.lead", label: "Texto", kind: "area" },
      { path: "mudarse.cards.0.title", label: "Recuadro 1 · título", kind: "text" },
      { path: "mudarse.cards.0.text", label: "Recuadro 1 · texto", kind: "area" },
      { path: "mudarse.cards.1.title", label: "Recuadro 2 · título", kind: "text" },
      { path: "mudarse.cards.1.text", label: "Recuadro 2 · texto", kind: "area" },
      { path: "mudarse.cards.2.title", label: "Recuadro 3 · título", kind: "text" },
      { path: "mudarse.cards.2.text", label: "Recuadro 3 · texto", kind: "area" },
      { path: "mudarse.cards.3.title", label: "Recuadro 4 · título", kind: "text" },
      { path: "mudarse.cards.3.text", label: "Recuadro 4 · texto", kind: "area" }
    ]
  },
  {
    id: "estudio",
    label: "Para el estudio",
    hint: "El recuadro que explica la carga única y la difusión.",
    fields: [
      { path: "estudio.kicker", label: "Antetítulo", kind: "text" },
      { path: "estudio.title", label: "Título", kind: "text" },
      { path: "estudio.lead", label: "Texto", kind: "area" },
      { path: "estudio.cta", label: "Botón al panel", kind: "text" }
    ]
  },
  {
    id: "contacto",
    label: "Contacto",
    hint: "Formulario y WhatsApp de la vitrina. No es un servidor real.",
    nav: "contacto",
    fields: [
      { path: "contacto.title", label: "Título", kind: "text" },
      { path: "contacto.lead", label: "Texto", kind: "area" }
    ]
  },
  {
    id: "pie",
    label: "Pie de página",
    hint: "Las dos líneas del final de la vitrina.",
    fields: [
      { path: "pie.line1", label: "Primera línea", kind: "area" },
      { path: "pie.line2", label: "Segunda línea", kind: "area" }
    ]
  },
  {
    id: "agentes",
    label: "Acceso para agentes",
    hint: "El enlace «Para agentes» del menú público. El panel sigue existiendo; solo deja de verse en la vitrina.",
    fields: []
  }
];

function mergeVitrinaCopy(base, extra) {
  if (Array.isArray(base)) {
    return base.map((item, i) => (extra && extra[i] != null ? mergeVitrinaCopy(item, extra[i]) : item));
  }
  if (base && typeof base === "object") {
    const out = { ...base };
    Object.keys(base).forEach((key) => {
      if (!extra || extra[key] === undefined) return;
      out[key] = typeof base[key] === "object" && base[key] !== null
        ? mergeVitrinaCopy(base[key], extra[key])
        : extra[key];
    });
    return out;
  }
  return extra === undefined ? base : extra;
}

function loadVitrinaPage() {
  const base = defaultVitrinaPage();
  try {
    const raw = localStorage.getItem(VITRINA_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return base;
    return {
      visible: { ...base.visible, ...(parsed.visible || {}) },
      copy: mergeVitrinaCopy(base.copy, parsed.copy || {})
    };
  } catch (e) {
    return base;
  }
}

function saveVitrinaPage(page) {
  localStorage.setItem(VITRINA_KEY, JSON.stringify(page));
}

function vitrinaCopyAt(copy, path) {
  return String(path || "").split(".").reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, copy);
}

function setVitrinaCopyAt(copy, path, value) {
  const keys = String(path || "").split(".");
  let cur = copy;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    const next = keys[i + 1];
    const nextIsIndex = String(Number(next)) === next;
    if (cur[key] == null || typeof cur[key] !== "object") {
      cur[key] = nextIsIndex ? [] : {};
    }
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
}

function applyVitrinaPage() {
  if (typeof document === "undefined") return loadVitrinaPage();
  const page = loadVitrinaPage();
  document.querySelectorAll("[data-nh-section]").forEach((el) => {
    const id = el.getAttribute("data-nh-section");
    const on = page.visible[id] !== false;
    el.hidden = !on;
  });
  document.querySelectorAll("[data-nh-nav]").forEach((el) => {
    const id = el.getAttribute("data-nh-nav");
    const on = page.visible[id] !== false;
    el.hidden = !on;
  });
  document.querySelectorAll("[data-nh-copy]").forEach((el) => {
    const path = el.getAttribute("data-nh-copy");
    const val = vitrinaCopyAt(page.copy, path);
    if (val == null) return;
    const text = String(val);
    if (el.id === "btnVerMas") {
      el.textContent = text || "Ver más";
      return;
    }
    if (el.matches("a, button") && !text.trim()) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = text;
  });
  const contactTitle = vitrinaCopyAt(page.copy, "contacto.title");
  const contactLead = vitrinaCopyAt(page.copy, "contacto.lead");
  const contactH2 = document.querySelector("#contacto h2, #demo-contacto h2");
  if (contactH2 && contactTitle) contactH2.textContent = contactTitle;
  const contactP = document.querySelector("#contacto .demo-contacto-lead");
  if (contactP && contactLead) contactP.textContent = contactLead;
  const wa = document.getElementById("wa-float");
  if (wa) wa.hidden = page.visible.contacto === false;
  return page;
}

const DESTINOS = [
  {
    id: "web",
    nombre: "Sitio propio",
    tipo: "api",
    grupo: "sitio",
    fijo: true,
    marca: "SP",
    beneficio: "La vitrina toma el catálogo de este panel. No hay aviso pago."
  },
  {
    id: "ml",
    nombre: "Mercado Libre",
    tipo: "api",
    grupo: "sitio",
    marca: "ML",
    beneficio: "Se envía por la API de inmuebles. Hace falta el paquete de ML. Demo: no se envía nada."
  },
  {
    id: "zonaprop",
    nombre: "Zonaprop",
    tipo: "api",
    grupo: "sitio",
    marca: "ZP",
    beneficio: "Conexión tipo OpenNavent. El abono del portal es aparte. Demo: no se envía nada."
  },
  {
    id: "argenprop",
    nombre: "Argenprop",
    tipo: "api",
    grupo: "sitio",
    marca: "AP",
    beneficio: "En un sistema real suele ir por un CRM homologado o un acuerdo con el portal. Demo: no se envía nada."
  },
  {
    id: "properati",
    nombre: "Properati",
    tipo: "api",
    grupo: "sitio",
    marca: "PR",
    beneficio: "Portal de avisos usado en Argentina. En esta demo solo se marca el destino; no hay envío real."
  },
  {
    id: "buscainmueble",
    nombre: "BuscaInmueble",
    tipo: "api",
    grupo: "sitio",
    marca: "BI",
    beneficio: "Portal argentino de inmuebles. Demo: conectar no publica el aviso afuera."
  },
  {
    id: "icasas",
    nombre: "Icasas",
    tipo: "api",
    grupo: "sitio",
    marca: "IC",
    beneficio: "Portal de inmuebles con presencia en Argentina. Demo: no se publica nada afuera."
  },
  {
    id: "google",
    nombre: "Google (ficha de negocio)",
    tipo: "api",
    grupo: "sitio",
    marca: "G",
    beneficio: "Texto para la ficha de Google. No hay API de avisos; usted lo carga a mano."
  },
  {
    id: "instagram",
    nombre: "Instagram",
    tipo: "red",
    grupo: "red",
    marca: "IG",
    beneficio: "Arma el texto y el enlace a la ficha. No hay API de avisos como en Mercado Libre."
  },
  {
    id: "facebook",
    nombre: "Facebook (página)",
    tipo: "red",
    grupo: "red",
    marca: "FB",
    beneficio: "Texto para la página del estudio. Demo: no se publica solo."
  },
  {
    id: "fbmarket",
    nombre: "Facebook Marketplace",
    tipo: "red",
    grupo: "red",
    marca: "MK",
    beneficio: "Destino aparte de la página. En vivienda, Meta suele pedir perfil personal. Demo: solo se marca el aviso."
  },
  {
    id: "whatsapp",
    nombre: "WhatsApp",
    tipo: "red",
    grupo: "red",
    marca: "WA",
    beneficio: "Comparte la ficha con el mensaje ya armado."
  },
  {
    id: "tiktok",
    nombre: "TikTok",
    tipo: "red",
    grupo: "red",
    marca: "TT",
    beneficio: "Arma el texto y el enlace a la ficha. No hay publicación automática."
  }
];

const COLA_ESTADOS = [
  { id: "listo", label: "Listo" },
  { id: "programado", label: "Programado" },
  { id: "publicado", label: "Publicado" }
];

function destinosPorGrupo(grupo) {
  return DESTINOS.filter((d) => (d.grupo || (d.tipo === "red" ? "red" : "sitio")) === grupo);
}

function destTipoLabel(dest) {
  if (dest.fijo || dest.id === "web") return "Sitio";
  if (dest.id === "google") return "Ficha";
  if (dest.tipo === "red") return "Red";
  return "Portal";
}

function destMarca(dest) {
  return dest.marca || String(dest.nombre || "?").slice(0, 2).toUpperCase();
}

function destChipNombre(dest) {
  if (dest.id === "web") return "Vitrina";
  if (dest.id === "ml") return "ML";
  if (dest.id === "fbmarket") return "Marketplace";
  if (dest.id === "google") return "Google";
  return dest.nombre;
}

function colaEstadoLabel(id) {
  return COLA_ESTADOS.find((e) => e.id === id)?.label || id;
}

function ahoraDemo() {
  return new Date().toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function defaultCuentas() {
  const out = {};
  DESTINOS.forEach((d) => {
    if (d.fijo) {
      out[d.id] = { connected: true, lastAction: "La vitrina toma el catálogo.", lastAt: "siempre" };
    } else if (d.id === "whatsapp") {
      out[d.id] = { connected: true, lastAction: "Cuenta de muestra conectada.", lastAt: "demo" };
    } else {
      out[d.id] = { connected: false, lastAction: "Sin conectar", lastAt: "" };
    }
  });
  return out;
}

function loadCuentas() {
  const base = defaultCuentas();
  const raw = localStorage.getItem(CUENTAS_KEY);
  if (!raw) {
    localStorage.setItem(CUENTAS_KEY, JSON.stringify(base));
    return base;
  }
  try {
    const parsed = JSON.parse(raw) || {};
    const out = {};
    Object.keys(base).forEach((id) => {
      out[id] = { ...base[id], ...(parsed[id] || {}) };
    });
    return out;
  } catch (e) {
    return base;
  }
}

function saveCuentas(cuentas) {
  localStorage.setItem(CUENTAS_KEY, JSON.stringify(cuentas));
}

function loadCola() {
  try {
    const raw = localStorage.getItem(COLA_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveCola(cola) {
  localStorage.setItem(COLA_KEY, JSON.stringify(cola));
}

function colaClave(itemId, destId) {
  return String(itemId) + ":" + String(destId);
}

function portalesBase() {
  const out = {};
  DESTINOS.forEach((d) => {
    out[d.id] = Boolean(d.fijo);
  });
  return out;
}

function portalesDe(item) {
  return {
    ...portalesBase(),
    ...(item.portales || {})
  };
}

const FAVS_KEY = "inmobiliaria-demo-favs-v1";

function loadFavoritoIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

function saveFavoritoIds(ids) {
  localStorage.setItem(FAVS_KEY, JSON.stringify(ids.map(String)));
}

function esFavorito(id) {
  return loadFavoritoIds().includes(String(id));
}

function favoritosDe(item) {
  return esFavorito(item?.id) ? 1 : 0;
}

function visitasPresencialesDe(item) {
  return (item?.visitas || []).length;
}

function interaccionesDe(item) {
  return Number(item?.consultas || 0) + favoritosDe(item) + visitasPresencialesDe(item);
}

function aplicarBajaPrecio(item, nextPrecio) {
  const prev = Number(item.precio || 0);
  const next = Number(nextPrecio || 0);
  if (prev > 0 && next > 0 && next < prev) {
    item.bajoPrecio = true;
    item.precioAnterior = prev;
  } else if (prev > 0 && next > prev) {
    item.bajoPrecio = false;
    item.precioAnterior = 0;
  }
}

function recientesDe(list, n) {
  const pool = (list || []).filter((p) => p.nuevo);
  return [...pool].sort((a, b) => {
    const tb = Number(b.ingresada || 0);
    const ta = Number(a.ingresada || 0);
    if (tb !== ta) return tb - ta;
    return 0;
  }).slice(0, n || 4);
}

function htmlPublicBadges(p) {
  const bits = [
    `<span class="badge ${esc(p.operacion)}">${esc(opLabel(p.operacion))}</span>`
  ];
  if (p.destacado) bits.push('<span class="badge destacado">Destacado</span>');
  if (p.nuevo) bits.push('<span class="badge nuevo">Nuevo</span>');
  if (p.bajoPrecio) bits.push('<span class="badge bajo-precio">Bajó de precio</span>');
  if (p.status === "reservada") bits.push('<span class="badge reservada">Reservada</span>');
  return bits.join("");
}

function textoRed(item) {
  const precio = item.operacion === "venta" ? money(item.precio, true) : money(item.precio) + " /mes";
  const ficha = "propiedad.html?id=" + item.id;
  return item.titulo + "\n" + opLabel(item.operacion) + " · " + item.barrio + "\n" + precio + "\n" + ficha;
}

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
