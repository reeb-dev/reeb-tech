const STORAGE_ITEMS = "materiales-stock-v2";
const STORAGE_CART = "materiales-cart-v2";
const STORAGE_PEDIDOS = "materiales-pedidos-v2";
const STORAGE_PROVEEDORES = "materiales-proveedores-v1";

const LOCAL = {
  nombre: "Corralón El Árido",
  slogan: "Materiales de obra · Villa Devoto",
  direccion: "Av. San Martín 4520",
  barrio: "Villa Devoto, CABA",
  telefono: "011-4555-4520",
  whatsapp: "5492915757934",
  horarios: [
    "Lunes a viernes: 7 a 17",
    "Sábados: 7 a 13"
  ]
};

const CATEGORIAS = [
  { id: "cemento", label: "Cemento", imagen: "img/cemento.jpg" },
  { id: "ladrillo", label: "Ladrillo", imagen: "img/ladrillo.jpg" },
  { id: "hierro", label: "Hierro", imagen: "img/hierro.jpg" },
  { id: "arena", label: "Arena y áridos", imagen: "img/arena.jpg" },
  { id: "cal", label: "Cal y yeso", imagen: "img/cal.jpg" },
  { id: "pinturas", label: "Pinturas", imagen: "img/pintura.jpg" },
  { id: "canos", label: "Caños", imagen: "img/cano.jpg" },
  { id: "madera", label: "Madera", imagen: "img/madera.jpg" },
  { id: "pisos", label: "Pisos", imagen: "img/ceramica.jpg" }
];

const PEDIDO_ESTADOS = [
  { id: "consulta", label: "Consulta" },
  { id: "preparacion", label: "En preparación" },
  { id: "entregado", label: "Entregado a obra" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "RE", label: "Remito" }
];

function seedProveedores() {
  return [
    {
      id: "pv-cementos",
      nombre: "Cementos del Oeste",
      rubro: "Cemento, cal y yeso",
      tel: "11-4555-1100",
      cuit: "30-71234567-1",
      contacto: "Marta López",
      nota: "Pallet cubierto. Entrega martes y viernes."
    },
    {
      id: "pv-ladrillera",
      nombre: "Ladrillera Devoto",
      rubro: "Ladrillo y bloque",
      tel: "11-4555-2210",
      cuit: "30-69881220-6",
      contacto: "Hugo Paredes",
      nota: "Camión a obra con 48 hs."
    },
    {
      id: "pv-aceros",
      nombre: "Aceros San Martín",
      rubro: "Hierro y caños",
      tel: "11-4555-3300",
      cuit: "30-70441211-8",
      contacto: "Silvia Rivas",
      nota: "Barras de 12 m. Corte en planta."
    },
    {
      id: "pv-aridos",
      nombre: "Áridos del Paraná",
      rubro: "Arena, piedra y cascote",
      tel: "11-4555-4400",
      cuit: "30-55667788-3",
      contacto: "Diego Funes",
      nota: "Volquete o pala. Pedir antes de las 10."
    },
    {
      id: "pv-pinturas",
      nombre: "Colorín Mayorista",
      rubro: "Pinturas y enduido",
      tel: "11-4555-5500",
      cuit: "30-61122334-9",
      contacto: "Paula Méndez",
      nota: "Látex y esmalte. Pedido mínimo 4 baldes."
    },
    {
      id: "pv-maderas",
      nombre: "Maderas del Norte",
      rubro: "Pino, tirante y OSB",
      tel: "11-4555-6600",
      cuit: "30-77889900-2",
      contacto: "Leo Acosta",
      nota: "Cepillado. Estiba bajo techo."
    },
    {
      id: "pv-ceramicos",
      nombre: "Cerámicos Sur",
      rubro: "Pisos y cerámica",
      tel: "11-4555-7700",
      cuit: "30-80112233-4",
      contacto: "Ana Varela",
      nota: "Cajas de 45 y 60. Pallet entero con descuento."
    }
  ];
}

function seedProductos() {
  return [
    {
      id: "m-cemento",
      codigo: "CEM-050",
      nombre: "Cemento Portland bolsa 50 kg",
      categoria: "cemento",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 12800,
      stock: 86,
      minimo: 40,
      destacado: true,
      imagen: "img/cemento.jpg",
      descripcion: "Bolsa de 50 kg. Para hormigón, revoque y carpetas. Pallet en el depósito cubierto.",
      history: [{ when: "4 sep", text: "Ingreso de 100 bolsas." }]
    },
    {
      id: "m-alba",
      codigo: "CEM-ALB",
      nombre: "Cemento de albañilería 50 kg",
      categoria: "cemento",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 9800,
      stock: 22,
      minimo: 20,
      imagen: "img/cemento.jpg",
      descripcion: "Bolsa de 50 kg para revoque y mampostería. Misma estiba que el Portland.",
      history: [{ when: "2 sep", text: "Quedan dos pallets." }]
    },
    {
      id: "m-rapido",
      codigo: "CEM-RAP",
      nombre: "Cemento rápido 25 kg",
      categoria: "cemento",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 15600,
      stock: 4,
      minimo: 12,
      imagen: "img/cemento.jpg",
      descripcion: "Fraguado rápido. Para anclajes y reparaciones. Pedir reposición.",
      history: [{ when: "8 sep", text: "Stock bajo. Avisar a Cementos del Oeste." }]
    },
    {
      id: "m-ladrillo",
      codigo: "LAD-COM",
      nombre: "Ladrillo común",
      categoria: "ladrillo",
      proveedorId: "pv-ladrillera",
      unidad: "unidad",
      precio: 280,
      stock: 4200,
      minimo: 1500,
      destacado: true,
      imagen: "img/ladrillo.jpg",
      descripcion: "Ladrillo de arcilla cocida. Pallet a cielo abierto, al fondo del predio.",
      history: [{ when: "6 sep", text: "Llegó un camión de ladrillo común." }]
    },
    {
      id: "m-hueco",
      codigo: "LAD-H12",
      nombre: "Ladrillo hueco 12×18×33",
      categoria: "ladrillo",
      proveedorId: "pv-ladrillera",
      unidad: "unidad",
      precio: 410,
      stock: 1800,
      minimo: 800,
      imagen: "img/ladrillo.jpg",
      descripcion: "Cerámico hueco para muros. Mismo predio que el común.",
      history: [{ when: "5 sep", text: "Stock de hueco 12." }]
    },
    {
      id: "m-hueco18",
      codigo: "LAD-H18",
      nombre: "Ladrillo hueco 18×18×33",
      categoria: "ladrillo",
      proveedorId: "pv-ladrillera",
      unidad: "unidad",
      precio: 520,
      stock: 640,
      minimo: 800,
      imagen: "img/ladrillo.jpg",
      descripcion: "Hueco 18 para tabiques. Queda menos de un camión.",
      history: [{ when: "7 sep", text: "Bajó el hueco 18. Pedir a Ladrillera Devoto." }]
    },
    {
      id: "m-bloque",
      codigo: "BLO-1939",
      nombre: "Bloque de hormigón 19×19×39",
      categoria: "ladrillo",
      proveedorId: "pv-ladrillera",
      unidad: "unidad",
      precio: 890,
      stock: 340,
      minimo: 200,
      imagen: "img/bloque.jpg",
      descripcion: "Bloque hueco de hormigón. Playón de mampostería, junto a los pallets.",
      history: [{ when: "3 sep", text: "Ingreso de bloques." }]
    },
    {
      id: "m-hierro8",
      codigo: "HIE-008",
      nombre: "Hierro del 8 (barra 12 m)",
      categoria: "hierro",
      proveedorId: "pv-aceros",
      unidad: "barra",
      precio: 18500,
      stock: 64,
      minimo: 30,
      destacado: true,
      imagen: "img/hierro.jpg",
      descripcion: "Barra nervurada de 12 metros. Playón de hierros.",
      history: [{ when: "3 sep", text: "Corte y despacho a obra." }]
    },
    {
      id: "m-hierro10",
      codigo: "HIE-010",
      nombre: "Hierro del 10 (barra 12 m)",
      categoria: "hierro",
      proveedorId: "pv-aceros",
      unidad: "barra",
      precio: 26800,
      stock: 18,
      minimo: 20,
      imagen: "img/hierro.jpg",
      descripcion: "Barra de 12 m. Para vigas y losas.",
      history: [{ when: "8 sep", text: "Quedan 18 barras. Pedir reposición." }]
    },
    {
      id: "m-hierro12",
      codigo: "HIE-012",
      nombre: "Hierro del 12 (barra 12 m)",
      categoria: "hierro",
      proveedorId: "pv-aceros",
      unidad: "barra",
      precio: 41200,
      stock: 28,
      minimo: 20,
      imagen: "img/hierro.jpg",
      descripcion: "Barra de 12 metros. Para columnas y vigas.",
      history: [{ when: "3 sep", text: "Stock de Ø12." }]
    },
    {
      id: "m-malla",
      codigo: "HIE-MAL",
      nombre: "Malla electrosoldada 15×15",
      categoria: "hierro",
      proveedorId: "pv-aceros",
      unidad: "panel",
      precio: 22400,
      stock: 9,
      minimo: 10,
      imagen: "img/hierro.jpg",
      descripcion: "Panel para carpetas y losas. Apilada junto a las barras.",
      history: [{ when: "6 sep", text: "Queda un paquete." }]
    },
    {
      id: "m-alambre",
      codigo: "HIE-ATA",
      nombre: "Alambre de atar (kg)",
      categoria: "hierro",
      proveedorId: "pv-aceros",
      unidad: "kg",
      precio: 2100,
      stock: 0,
      minimo: 15,
      imagen: "img/hierro.jpg",
      descripcion: "Alambre recocido para atar hierros. Sin stock: pedir a Aceros San Martín.",
      history: [{ when: "8 sep", text: "Agotado en mostrador." }]
    },
    {
      id: "m-arena",
      codigo: "ARI-ARE",
      nombre: "Arena gruesa (m³)",
      categoria: "arena",
      proveedorId: "pv-aridos",
      unidad: "m³",
      precio: 28000,
      stock: 18,
      minimo: 8,
      destacado: true,
      imagen: "img/arena.jpg",
      descripcion: "Arena para hormigón y revoque. Se carga con pala o volquete.",
      history: [{ when: "7 sep", text: "Montículo repuesto." }]
    },
    {
      id: "m-arena-fina",
      codigo: "ARI-FIN",
      nombre: "Arena fina (m³)",
      categoria: "arena",
      proveedorId: "pv-aridos",
      unidad: "m³",
      precio: 24500,
      stock: 6,
      minimo: 8,
      imagen: "img/arena.jpg",
      descripcion: "Arena fina para revoque fino y carpetas. Queda poco en el predio.",
      history: [{ when: "8 sep", text: "Pedir volquete a Áridos del Paraná." }]
    },
    {
      id: "m-piedra",
      codigo: "ARI-PIE",
      nombre: "Piedra partida 6-20 (m³)",
      categoria: "arena",
      proveedorId: "pv-aridos",
      unidad: "m³",
      precio: 32000,
      stock: 11,
      minimo: 6,
      imagen: "img/piedra.jpg",
      descripcion: "Piedra para hormigón. Montículo junto a la pala cargadora.",
      history: [{ when: "5 sep", text: "Ingreso de piedra 6-20." }]
    },
    {
      id: "m-cascote",
      codigo: "ARI-CAS",
      nombre: "Cascote (m³)",
      categoria: "arena",
      proveedorId: "pv-aridos",
      unidad: "m³",
      precio: 19000,
      stock: 3,
      minimo: 6,
      imagen: "img/piedra.jpg",
      descripcion: "Cascote para contrapiso. Queda un resto: reponer.",
      history: [{ when: "7 sep", text: "Stock bajo de cascote." }]
    },
    {
      id: "m-cal",
      codigo: "CAL-025",
      nombre: "Cal hidratada bolsa 25 kg",
      categoria: "cal",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 6200,
      stock: 40,
      minimo: 20,
      imagen: "img/cal.jpg",
      descripcion: "Cal para revoque y pintura a la cal. Apilada junto al cemento.",
      history: [{ when: "1 sep", text: "Reposición de cal." }]
    },
    {
      id: "m-cal-aerea",
      codigo: "CAL-AER",
      nombre: "Cal aérea bolsa 25 kg",
      categoria: "cal",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 5800,
      stock: 7,
      minimo: 20,
      imagen: "img/cal.jpg",
      descripcion: "Cal aérea para revoques. Pedir pallet al proveedor.",
      history: [{ when: "8 sep", text: "Quedan 7 bolsas." }]
    },
    {
      id: "m-yeso",
      codigo: "CAL-YES",
      nombre: "Yeso en bolsa 30 kg",
      categoria: "cal",
      proveedorId: "pv-cementos",
      unidad: "bolsa",
      precio: 7400,
      stock: 5,
      minimo: 15,
      imagen: "img/cal.jpg",
      descripcion: "Yeso para cielorraso y terminación. Estiba bajo techo.",
      history: [{ when: "6 sep", text: "Alerta de reposición." }]
    },
    {
      id: "m-pintura",
      codigo: "PIN-LAT",
      nombre: "Látex interior 20 L",
      categoria: "pinturas",
      proveedorId: "pv-pinturas",
      unidad: "balde",
      precio: 45600,
      stock: 12,
      minimo: 6,
      imagen: "img/pintura.jpg",
      descripcion: "Látex lavable blanco. Pasillo de pinturas, con rodillos y pinceles.",
      history: [{ when: "2 sep", text: "Pedido al mayorista de pinturas." }]
    },
    {
      id: "m-latex-ext",
      codigo: "PIN-EXT",
      nombre: "Látex exterior 20 L",
      categoria: "pinturas",
      proveedorId: "pv-pinturas",
      unidad: "balde",
      precio: 51200,
      stock: 8,
      minimo: 6,
      imagen: "img/pintura.jpg",
      descripcion: "Látex para fachada. Mismo pasillo que el interior.",
      history: [{ when: "4 sep", text: "Ingreso de exterior." }]
    },
    {
      id: "m-esmalte",
      codigo: "PIN-ESM",
      nombre: "Esmalte sintético 4 L",
      categoria: "pinturas",
      proveedorId: "pv-pinturas",
      unidad: "lata",
      precio: 18900,
      stock: 2,
      minimo: 8,
      imagen: "img/latas.jpg",
      descripcion: "Esmalte para metal y madera. Quedan dos latas: reponer.",
      history: [{ when: "8 sep", text: "Stock crítico de esmalte." }]
    },
    {
      id: "m-enduido",
      codigo: "PIN-END",
      nombre: "Enduido interior 20 kg",
      categoria: "pinturas",
      proveedorId: "pv-pinturas",
      unidad: "balde",
      precio: 9800,
      stock: 14,
      minimo: 8,
      imagen: "img/cal.jpg",
      descripcion: "Enduido para emparejar paredes antes de pintar.",
      history: [{ when: "1 sep", text: "Llegaron 20 baldes." }]
    },
    {
      id: "m-cano",
      codigo: "CAN-040",
      nombre: "Caño estructural 40×40",
      categoria: "canos",
      proveedorId: "pv-aceros",
      unidad: "barra",
      precio: 22100,
      stock: 22,
      minimo: 10,
      imagen: "img/cano.jpg",
      descripcion: "Perfil estructural 40×40. Playón de hierros y caños, barras de 6 m.",
      history: [{ when: "4 sep", text: "Barras de 6 m en stock." }]
    },
    {
      id: "m-cano80",
      codigo: "CAN-080",
      nombre: "Caño estructural 80×40",
      categoria: "canos",
      proveedorId: "pv-aceros",
      unidad: "barra",
      precio: 31200,
      stock: 9,
      minimo: 10,
      imagen: "img/cano.jpg",
      descripcion: "Perfil 80×40 para estructuras livianas. Pedir reposición.",
      history: [{ when: "7 sep", text: "Quedan 9 barras." }]
    },
    {
      id: "m-pvc110",
      codigo: "CAN-PVC",
      nombre: "Caño PVC cloacal 110 mm",
      categoria: "canos",
      proveedorId: "pv-aceros",
      unidad: "tramo",
      precio: 8600,
      stock: 48,
      minimo: 20,
      imagen: "img/pvc.jpg",
      descripcion: "PVC 110 mm, tramo de 6 m. Estantería de caños plásticos.",
      history: [{ when: "2 sep", text: "Ingreso de cloacal 110." }]
    },
    {
      id: "m-agua20",
      codigo: "CAN-AGU",
      nombre: "Caño agua termofusión 20 mm",
      categoria: "canos",
      proveedorId: "pv-aceros",
      unidad: "tramo",
      precio: 2100,
      stock: 0,
      minimo: 40,
      imagen: "img/pvc.jpg",
      descripcion: "Caño de agua 20 mm. Agotado: pedir a Aceros San Martín.",
      history: [{ when: "8 sep", text: "Sin stock de termofusión 20." }]
    },
    {
      id: "m-madera",
      codigo: "MAD-PIN",
      nombre: "Tabla de pino 1×4",
      categoria: "madera",
      proveedorId: "pv-maderas",
      unidad: "unidad",
      precio: 4200,
      stock: 90,
      minimo: 40,
      imagen: "img/madera.jpg",
      descripcion: "Pino cepillado. Estantería de maderas, al lado de los perfiles.",
      history: [{ when: "1 sep", text: "Ingreso de tablas." }]
    },
    {
      id: "m-tirante",
      codigo: "MAD-TIR",
      nombre: "Tirante de pino 2×4",
      categoria: "madera",
      proveedorId: "pv-maderas",
      unidad: "unidad",
      precio: 7800,
      stock: 36,
      minimo: 20,
      imagen: "img/tablas.jpg",
      descripcion: "Tirante para encofrado y estructura liviana. Bajo techo.",
      history: [{ when: "3 sep", text: "Llegaron tirantes." }]
    },
    {
      id: "m-machimbre",
      codigo: "MAD-MAC",
      nombre: "Machimbre de pino",
      categoria: "madera",
      proveedorId: "pv-maderas",
      unidad: "unidad",
      precio: 6400,
      stock: 4,
      minimo: 20,
      imagen: "img/madera.jpg",
      descripcion: "Machimbre para cielorraso. Quedan cuatro tablas.",
      history: [{ when: "8 sep", text: "Alerta: pedir a Maderas del Norte." }]
    },
    {
      id: "m-osb",
      codigo: "MAD-OSB",
      nombre: "Placa OSB 15 mm",
      categoria: "madera",
      proveedorId: "pv-maderas",
      unidad: "placa",
      precio: 18900,
      stock: 3,
      minimo: 8,
      imagen: "img/tablas.jpg",
      descripcion: "OSB 15 mm para encofrado y tabiques. Stock crítico.",
      history: [{ when: "7 sep", text: "Quedan 3 placas." }]
    },
    {
      id: "m-ceramica",
      codigo: "PIS-45",
      nombre: "Cerámica piso 45×45",
      categoria: "pisos",
      proveedorId: "pv-ceramicos",
      unidad: "caja",
      precio: 18900,
      stock: 36,
      minimo: 15,
      imagen: "img/ceramica.jpg",
      descripcion: "Caja de 1,62 m². Porcelanato mate gris, para baño o living.",
      history: [{ when: "8 sep", text: "Nuevo lote de 45×45." }]
    },
    {
      id: "m-porcelanato",
      codigo: "PIS-60",
      nombre: "Porcelanato 60×60",
      categoria: "pisos",
      proveedorId: "pv-ceramicos",
      unidad: "caja",
      precio: 28600,
      stock: 10,
      minimo: 12,
      imagen: "img/ceramica.jpg",
      descripcion: "Caja de 1,44 m². Rectificado. Pedir un pallet más.",
      history: [{ when: "6 sep", text: "Stock bajo de 60×60." }]
    }
  ];
}

function seedPedidos() {
  return [
    {
      id: "ped1",
      codigo: "PED-2026-041",
      cliente: "Constructora Norte",
      obra: "Casa en Villa Devoto · San Martín 4100",
      tel: "11-5555-4100",
      status: "preparacion",
      items: [
        { id: "m-cemento", nombre: "Cemento Portland bolsa 50 kg", cantidad: 40, precio: 12800, imagen: "img/cemento.jpg" },
        { id: "m-arena", nombre: "Arena gruesa (m³)", cantidad: 4, precio: 28000, imagen: "img/arena.jpg" },
        { id: "m-hierro8", nombre: "Hierro del 8 (barra 12 m)", cantidad: 8, precio: 18500, imagen: "img/hierro.jpg" }
      ],
      factura: null,
      history: [{ when: "7 sep", text: "Pedido a obra. Preparando despacho." }]
    },
    {
      id: "ped2",
      codigo: "PED-2026-038",
      cliente: "Obra Álvarez",
      obra: "PH en Colegiales",
      tel: "11-4444-8810",
      status: "entregado",
      items: [
        { id: "m-ladrillo", nombre: "Ladrillo común", cantidad: 800, precio: 280, imagen: "img/ladrillo.jpg" },
        { id: "m-cal", nombre: "Cal hidratada bolsa 25 kg", cantidad: 20, precio: 6200, imagen: "img/cal.jpg" }
      ],
      factura: { tipo: "FA", numero: "0001-00000102", cae: "74185296301440", vto: "16 sep", total: 348000, cuit: "30-69881220-6" },
      history: [
        { when: "5 sep", text: "Entregado en obra." },
        { when: "4 sep", text: "Factura A emitida." }
      ]
    },
    {
      id: "ped3",
      codigo: "PED-2026-044",
      cliente: "Pinturería de la obra",
      obra: "Reforma Villa Crespo",
      tel: "11-6666-4410",
      status: "consulta",
      items: [
        { id: "m-pintura", nombre: "Látex interior 20 L", cantidad: 3, precio: 45600, imagen: "img/pintura.jpg" },
        { id: "m-esmalte", nombre: "Esmalte sintético 4 L", cantidad: 2, precio: 18900, imagen: "img/latas.jpg" }
      ],
      factura: null,
      history: [{ when: "8 sep", text: "Consulta por WhatsApp. Confirmar color." }]
    },
    {
      id: "ped4",
      codigo: "PED-2026-046",
      cliente: "Herrería López",
      obra: "Tinglado en Villa del Parque",
      tel: "11-4777-2200",
      status: "preparacion",
      items: [
        { id: "m-cano", nombre: "Caño estructural 40×40", cantidad: 12, precio: 22100, imagen: "img/cano.jpg" },
        { id: "m-tirante", nombre: "Tirante de pino 2×4", cantidad: 10, precio: 7800, imagen: "img/tablas.jpg" }
      ],
      factura: null,
      history: [{ when: "8 sep", text: "Pedido a obra. Cortar caños a 6 m." }]
    }
  ];
}

function loadList(key, seedFn) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    const data = seedFn();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedFn();
  } catch {
    return seedFn();
  }
}

function load() {
  return loadList(STORAGE_ITEMS, seedProductos);
}

function save(items) {
  localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_CART);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function loadPedidos() {
  return loadList(STORAGE_PEDIDOS, seedPedidos);
}

function savePedidos(items) {
  localStorage.setItem(STORAGE_PEDIDOS, JSON.stringify(items));
}

function loadProveedores() {
  return loadList(STORAGE_PROVEEDORES, seedProveedores);
}

function saveProveedores(items) {
  localStorage.setItem(STORAGE_PROVEEDORES, JSON.stringify(items));
}

function stockStatus(item) {
  if (item.stock === 0) return "agotado";
  if (item.stock < item.minimo) return "bajo";
  return "stock";
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function catImagen(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.imagen || "img/hero.jpg";
}

function pedidoLabel(status) {
  return PEDIDO_ESTADOS.find((s) => s.id === status)?.label || status;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function proveedorById(id) {
  return loadProveedores().find((p) => p.id === id) || null;
}

function proveedorNombre(id) {
  return proveedorById(id)?.nombre || "Sin proveedor";
}

function alertsList(items) {
  return (items || load()).filter((i) => stockStatus(i) !== "stock");
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function cartCount(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.cantidad || 1), 0);
}

function cartTotal(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.precio || 0) * Number(line.cantidad || 1), 0);
}

function addToCart(productId, cantidad) {
  const qtyAdd = Math.max(1, Number(cantidad) || 1);
  const items = load();
  const product = items.find((p) => p.id === productId);
  if (!product || product.stock < 1) return { ok: false, reason: "sin-stock" };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  const qty = (line ? line.cantidad : 0) + qtyAdd;
  if (qty > product.stock) return { ok: false, reason: "sin-stock", stock: product.stock };
  if (line) line.cantidad = qty;
  else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen || "",
      unidad: product.unidad || "",
      cantidad: qtyAdd
    });
  }
  saveCart(cart);
  return { ok: true, cart };
}

function removeFromCart(productId) {
  saveCart(loadCart().filter((c) => c.id !== productId));
  return loadCart();
}

function setCartQty(productId, cantidad) {
  const qty = Number(cantidad);
  if (!Number.isFinite(qty) || qty < 1) {
    removeFromCart(productId);
    return { ok: true, cart: loadCart() };
  }
  const items = load();
  const product = items.find((p) => p.id === productId);
  if (!product || product.stock < 1) return { ok: false, reason: "sin-stock" };
  if (qty > product.stock) return { ok: false, reason: "sin-stock", stock: product.stock };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  if (!line) {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen || "",
      unidad: product.unidad || "",
      cantidad: qty
    });
  } else line.cantidad = qty;
  saveCart(cart);
  return { ok: true, cart };
}

function checkoutCart(cliente, obra, tel) {
  const cart = loadCart();
  if (!cart.length) return { ok: false, reason: "vacio" };
  const items = load();
  for (const line of cart) {
    const product = items.find((p) => p.id === line.id);
    const qty = Number(line.cantidad || 1);
    if (!product || product.stock < qty) {
      return { ok: false, reason: "sin-stock", nombre: line.nombre };
    }
  }
  const pedidoItems = cart.map((line) => {
    const qty = Number(line.cantidad || 1);
    const product = items.find((p) => p.id === line.id);
    product.stock -= qty;
    product.history = [
      { when: "hoy", text: `Pedido a obra x${qty}.` },
      ...(product.history || [])
    ];
    return {
      id: product.id,
      nombre: product.nombre,
      imagen: product.imagen || "",
      precio: product.precio,
      cantidad: qty
    };
  });
  const n = loadPedidos().length + 47;
  const pedido = {
    id: crypto.randomUUID(),
    codigo: `PED-2026-${String(n).padStart(3, "0")}`,
    cliente: cliente || "Cliente mostrador",
    obra: obra || "Pedido desde el catálogo",
    tel: tel || "",
    status: "consulta",
    items: pedidoItems,
    factura: null,
    history: [{ when: "hoy", text: "Pedido cargado desde el catálogo." }]
  };
  save(items);
  savePedidos([pedido, ...loadPedidos()]);
  saveCart([]);
  return { ok: true, pedido };
}

function reponerItem(productId) {
  const items = load();
  const item = items.find((p) => p.id === productId);
  if (!item) return { ok: false };
  const qty = Math.max(item.minimo - item.stock, item.minimo);
  item.stock += qty;
  const prov = proveedorNombre(item.proveedorId);
  item.history = [
    { when: "hoy", text: `Reposición x${qty} · pedido a ${prov}.` },
    ...(item.history || [])
  ];
  save(items);
  return { ok: true, item, qty, proveedor: prov };
}

function pedidoTotal(pedido) {
  return (pedido.items || []).reduce((sum, i) => sum + i.precio * i.cantidad, 0);
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
