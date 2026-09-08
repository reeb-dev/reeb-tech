const ESTADOS = [
  { id: "disponible", label: "Disponible" },
  { id: "reservado", label: "Reservado" },
  { id: "vendido", label: "Vendido" }
];

const TIPOS = [
  { id: "0km", label: "0 Km" },
  { id: "usado", label: "Usado" }
];

const COMBUSTIBLES = [
  { id: "nafta", label: "Nafta" },
  { id: "diesel", label: "Diésel" },
  { id: "gnc", label: "GNC" },
  { id: "hibrido", label: "Híbrido" },
  { id: "electrico", label: "Eléctrico" }
];

const TRANSMISIONES = [
  { id: "manual", label: "Manual" },
  { id: "automatica", label: "Automática" },
  { id: "cvt", label: "CVT" }
];

const COMPROBANTES = [
  { id: "FA", label: "Factura A" },
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" }
];

const MARCAS = [
  "Toyota", "Volkswagen", "Ford", "Fiat", "Chevrolet", "Renault", 
  "Peugeot", "Jeep", "Honda", "Nissan", "Hyundai", "Kia"
];

// Cotización USD simulada
const COTIZACION_USD = 1150;

function seed() {
  return [
    {
      id: "v1",
      codigo: "AUT-001",
      marca: "Toyota",
      modelo: "Corolla XEi",
      version: "2.0 CVT",
      ano: 2024,
      tipo: "0km",
      precioUSD: 32000,
      km: 0,
      combustible: "nafta",
      transmision: "cvt",
      color: "Blanco Perlado",
      patente: null,
      puertas: 4,
      motor: "2.0L 170cv",
      descripcion: "Toyota Corolla XEi 2024 0km. Equipamiento completo: pantalla táctil 9\", Android Auto/Apple CarPlay, control crucero adaptativo, 7 airbags, cámara de retroceso. Financiación disponible.",
      imagenes: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 456,
      consultas: 23,
      diasPublicado: 10,
      cliente: null,
      history: [
        { when: "1 sep", text: "Publicado como destacado." }
      ]
    },
    {
      id: "v2",
      codigo: "AUT-002",
      marca: "Volkswagen",
      modelo: "Golf",
      version: "1.4 TSI Highline",
      ano: 2022,
      tipo: "usado",
      precioUSD: 28500,
      km: 32000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Gris Platino",
      patente: "AD 123 BC",
      puertas: 5,
      motor: "1.4L TSI 150cv",
      descripcion: "VW Golf Highline impecable. Único dueño, service oficial completo. Techo solar, cuero, navegador, sensores de estacionamiento. Permuto por menor valor.",
      imagenes: [
        "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 15,
      diasPublicado: 25,
      cliente: null,
      history: [
        { when: "20 ago", text: "Ingresado a consignación." }
      ]
    },
    {
      id: "v3",
      codigo: "AUT-003",
      marca: "Toyota",
      modelo: "Hilux",
      version: "SRX 4x4 AT",
      ano: 2023,
      tipo: "usado",
      precioUSD: 52000,
      km: 18000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Negro",
      patente: "AE 456 DE",
      puertas: 4,
      motor: "2.8L TD 204cv",
      descripcion: "Toyota Hilux SRX tope de gama. Cuero, pantalla 8\", cámara 360°, control de descenso. Service al día en concesionario oficial. Lista para transferir.",
      imagenes: [
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1558383409-27c7f2e1e4b5?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: false,
      destacado: true,
      status: "reservado",
      vistas: 892,
      consultas: 45,
      diasPublicado: 15,
      cliente: { nombre: "Martín Rodríguez", tel: "11-4567-8901", desde: "5 sep" },
      history: [
        { when: "5 sep", text: "Seña recibida. Reservada." },
        { when: "1 sep", text: "Primera visita y prueba de manejo." }
      ]
    },
    {
      id: "v4",
      codigo: "AUT-004",
      marca: "Ford",
      modelo: "Focus",
      version: "SE Plus 2.0",
      ano: 2019,
      tipo: "usado",
      precioUSD: 16500,
      km: 78000,
      combustible: "nafta",
      transmision: "manual",
      color: "Azul Mónaco",
      patente: "AB 789 CD",
      puertas: 5,
      motor: "2.0L 170cv",
      descripcion: "Ford Focus SE Plus excelente estado. Control de estabilidad, 6 airbags, SYNC 3. Cubiertas nuevas. Ideal primer auto o uso familiar.",
      imagenes: [
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 156,
      consultas: 8,
      diasPublicado: 40,
      cliente: null,
      history: [
        { when: "30 jul", text: "Publicado." }
      ]
    },
    {
      id: "v5",
      codigo: "AUT-005",
      marca: "Fiat",
      modelo: "Cronos",
      version: "Precision 1.8 AT",
      ano: 2023,
      tipo: "usado",
      precioUSD: 18000,
      km: 25000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Rojo Montecarlo",
      patente: "AF 012 GH",
      puertas: 4,
      motor: "1.8L 130cv",
      descripcion: "Fiat Cronos Precision automático. Pantalla Uconnect, cámara, sensores, climatizador. Service oficial al día. Financiación bancaria disponible.",
      imagenes: [
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 189,
      consultas: 11,
      diasPublicado: 18,
      cliente: null,
      history: [
        { when: "22 ago", text: "Ingresado como parte de pago." }
      ]
    },
    {
      id: "v6",
      codigo: "AUT-006",
      marca: "Volkswagen",
      modelo: "Tiguan",
      version: "Allspace 1.4 TSI",
      ano: 2022,
      tipo: "usado",
      precioUSD: 42000,
      km: 35000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Blanco Puro",
      patente: "AE 234 FG",
      puertas: 5,
      motor: "1.4L TSI 150cv",
      descripcion: "VW Tiguan Allspace 7 plazas. Techo panorámico, cuero, ACC, asistente de carril. Un solo dueño, service oficial. Excelente estado general.",
      imagenes: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 567,
      consultas: 32,
      diasPublicado: 12,
      cliente: null,
      history: [
        { when: "28 ago", text: "Publicado como destacado." }
      ]
    },
    {
      id: "v7",
      codigo: "AUT-007",
      marca: "Jeep",
      modelo: "Compass",
      version: "Limited 2.0 TD AT9 4x4",
      ano: 2021,
      tipo: "usado",
      precioUSD: 38000,
      km: 48000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Gris Grafito",
      patente: "AD 567 IJ",
      puertas: 5,
      motor: "2.0L TD 170cv",
      descripcion: "Jeep Compass Limited diésel 4x4. Equipamiento full: cuero, techo, navegador, Beats audio. Service concesionario oficial. Ideal para ruta y ciudad.",
      imagenes: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1568844293986-8c4a5b3c9c85?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "vendido",
      vistas: 789,
      consultas: 41,
      diasPublicado: 60,
      cliente: { nombre: "Laura Méndez", tel: "11-2345-6789", desde: "1 sep" },
      history: [
        { when: "7 sep", text: "Transferencia realizada." },
        { when: "1 sep", text: "Venta concretada." }
      ]
    },
    {
      id: "v8",
      codigo: "AUT-008",
      marca: "Ford",
      modelo: "Ranger",
      version: "Limited 3.2 AT 4x4",
      ano: 2024,
      tipo: "0km",
      precioUSD: 58000,
      km: 0,
      combustible: "diesel",
      transmision: "automatica",
      color: "Gris Selenita",
      patente: null,
      puertas: 4,
      motor: "3.2L TD 200cv",
      descripcion: "Ford Ranger Limited 2024 0km. Nueva generación: SYNC 4, pantalla 12\", Pro Trailer Backup, 360°. Entrega inmediata. Financiación Ford Plan.",
      imagenes: [
        "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1558383409-27c7f2e1e4b5?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 678,
      consultas: 38,
      diasPublicado: 5,
      cliente: null,
      history: [
        { when: "3 sep", text: "Publicado como novedad." }
      ]
    },
    {
      id: "v9",
      codigo: "AUT-009",
      marca: "Toyota",
      modelo: "SW4",
      version: "SRX 2.8 TD AT 4x4",
      ano: 2022,
      tipo: "usado",
      precioUSD: 65000,
      km: 42000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Blanco Perlado",
      patente: "AE 890 KL",
      puertas: 5,
      motor: "2.8L TD 204cv",
      descripcion: "Toyota SW4 SRX 7 plazas. Cuero, techo solar, JBL premium, control de descenso. Service oficial Toyota al día. Papeles al día, lista para transferir.",
      imagenes: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: false,
      destacado: true,
      status: "disponible",
      vistas: 923,
      consultas: 52,
      diasPublicado: 8,
      cliente: null,
      history: [
        { when: "31 ago", text: "Ingresado de cliente premium." }
      ]
    },
    {
      id: "v10",
      codigo: "AUT-010",
      marca: "Chevrolet",
      modelo: "Cruze",
      version: "LTZ 1.4T AT",
      ano: 2020,
      tipo: "usado",
      precioUSD: 19500,
      km: 55000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Negro",
      patente: "AC 345 MN",
      puertas: 4,
      motor: "1.4L Turbo 153cv",
      descripcion: "Chevrolet Cruze LTZ turbo automático. MyLink, OnStar, alerta de colisión, cámara. Muy buen estado. Acepto auto o moto en parte de pago.",
      imagenes: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 14,
      diasPublicado: 30,
      cliente: null,
      history: [
        { when: "10 ago", text: "Publicado." }
      ]
    },
    {
      id: "v11",
      codigo: "AUT-011",
      marca: "Renault",
      modelo: "Duster",
      version: "Iconic 1.3 TCe CVT 4x2",
      ano: 2024,
      tipo: "0km",
      precioUSD: 28000,
      km: 0,
      combustible: "nafta",
      transmision: "cvt",
      color: "Verde Amazonia",
      patente: null,
      puertas: 5,
      motor: "1.3L TCe 163cv",
      descripcion: "Nueva Renault Duster Iconic 2024. Diseño renovado, Multi-Sense, Easy Link 8\", cámara 360°. Financiación Renault hasta 60 cuotas.",
      imagenes: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1568844293986-8c4a5b3c9c85?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 345,
      consultas: 19,
      diasPublicado: 7,
      cliente: null,
      history: [
        { when: "1 sep", text: "Nueva unidad disponible." }
      ]
    },
    {
      id: "v12",
      codigo: "AUT-012",
      marca: "Peugeot",
      modelo: "208",
      version: "Allure 1.6 AT",
      ano: 2021,
      tipo: "usado",
      precioUSD: 17000,
      km: 38000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Vertigo",
      patente: "AD 678 OP",
      puertas: 5,
      motor: "1.6L 115cv",
      descripcion: "Peugeot 208 Allure automático. i-Cockpit 3D, Mirror Screen, control crucero. Único dueño, excelente estado. Ideal ciudad.",
      imagenes: [
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=500&fit=crop"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 178,
      consultas: 9,
      diasPublicado: 22,
      cliente: null,
      history: [
        { when: "18 ago", text: "Ingresado por consignación." }
      ]
    }
  ];
}

function load() {
  const raw = localStorage.getItem("automotores-demo-v1");
  if (!raw) {
    const data = seed();
    localStorage.setItem("automotores-demo-v1", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("automotores-demo-v1", JSON.stringify(items));
}

function label(status) {
  return ESTADOS.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS.find((t) => t.id === tipo)?.label || tipo;
}

function combustibleLabel(comb) {
  return COMBUSTIBLES.find((c) => c.id === comb)?.label || comb;
}

function transmisionLabel(trans) {
  return TRANSMISIONES.find((t) => t.id === trans)?.label || trans;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function formatPrecioUSD(precio) {
  return "USD " + Number(precio).toLocaleString("es-AR");
}

function formatPrecioARS(precioUSD) {
  return "$ " + Number(precioUSD * COTIZACION_USD).toLocaleString("es-AR");
}

function formatKm(km) {
  if (km === 0) return "0 km";
  return Number(km).toLocaleString("es-AR") + " km";
}

function money(amount) {
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
