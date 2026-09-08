const ESTADOS = [
  { id: "disponible", label: "Disponible" },
  { id: "reservado", label: "Reservado" },
  { id: "vendido", label: "Vendido" }
];

const TIPOS = [
  { id: "0km", label: "0 Km" },
  { id: "usado", label: "Usado" }
];

const SEGMENTOS = [
  { id: "auto", label: "Auto" },
  { id: "suv", label: "SUV" },
  { id: "pickup", label: "Pickup" },
  { id: "utilitario", label: "Utilitario" }
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
  "Peugeot", "Citroën", "Jeep", "Honda", "Nissan", "Hyundai"
];

// Colores por marca (primario, secundario)
const MARCA_COLORS = {
  "Toyota": { primary: "#EB0A1E", secondary: "#FFFFFF", accent: "#CC0000" },
  "Volkswagen": { primary: "#001E50", secondary: "#FFFFFF", accent: "#00437A" },
  "Ford": { primary: "#003478", secondary: "#FFFFFF", accent: "#0055A5" },
  "Fiat": { primary: "#8B0000", secondary: "#FFFFFF", accent: "#B22222" },
  "Chevrolet": { primary: "#D4AF37", secondary: "#000000", accent: "#B8860B", text: "#8B6914" },
  "Renault": { primary: "#FFCC00", secondary: "#000000", accent: "#FFD700", text: "#1a1a1a" },
  "Peugeot": { primary: "#00205B", secondary: "#FFFFFF", accent: "#003087" },
  "Citroën": { primary: "#AC1E2D", secondary: "#FFFFFF", accent: "#8B0000" },
  "Jeep": { primary: "#3D5C3D", secondary: "#FFFFFF", accent: "#556B2F" },
  "Honda": { primary: "#CC0000", secondary: "#FFFFFF", accent: "#8B0000" },
  "Nissan": { primary: "#C3002F", secondary: "#8C8C8C", accent: "#A30028" },
  "Hyundai": { primary: "#002C5F", secondary: "#FFFFFF", accent: "#00274C" }
};

// Logos SVG locales por marca (Wikimedia Commons)
const MARCA_LOGOS = {
  "Toyota": `<img src="img/logo-toyota.svg" alt="Toyota">`,
  "Volkswagen": `<img src="img/logo-volkswagen.svg" alt="Volkswagen">`,
  "Ford": `<img src="img/logo-ford.svg" alt="Ford">`,
  "Fiat": `<img src="img/logo-fiat.svg" alt="Fiat">`,
  "Chevrolet": `<img src="img/logo-chevrolet.svg" alt="Chevrolet">`,
  "Renault": `<img src="img/logo-renault.svg" alt="Renault">`,
  "Peugeot": `<img src="img/logo-peugeot.svg" alt="Peugeot">`,
  "Citroën": `<img src="img/logo-citroen.svg" alt="Citroën">`,
  "Jeep": `<img src="img/logo-jeep.svg" alt="Jeep">`,
  "Honda": `<img src="img/logo-honda.svg" alt="Honda">`,
  "Nissan": `<img src="img/logo-nissan.svg" alt="Nissan">`,
  "Hyundai": `<img src="img/logo-hyundai.svg" alt="Hyundai">`
};

// Cotización USD simulada
const COTIZACION_USD = 1150;

function seed() {
  return [
    // === TOYOTA ===
    {
      id: "v1",
      codigo: "AUT-001",
      marca: "Toyota",
      modelo: "Corolla",
      version: "XEi 2.0 CVT",
      segmento: "auto",
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
        "img/toyota-corolla.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 456,
      consultas: 23,
      diasPublicado: 10,
      cliente: null,
      history: [{ when: "1 sep", text: "Publicado como destacado." }]
    },
    {
      id: "v2",
      codigo: "AUT-002",
      marca: "Toyota",
      modelo: "Etios",
      version: "XLS 1.5 MT",
      segmento: "auto",
      ano: 2022,
      tipo: "usado",
      precioUSD: 14500,
      km: 42000,
      combustible: "nafta",
      transmision: "manual",
      color: "Gris Plata",
      patente: "AD 234 BC",
      puertas: 4,
      motor: "1.5L 107cv",
      descripcion: "Toyota Etios XLS sedan, único dueño. Service oficial al día. Excelente mecánica, cubiertas nuevas. Ideal primer auto o uso urbano.",
      imagenes: [
        "img/toyota-etios.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 12,
      diasPublicado: 18,
      cliente: null,
      history: [{ when: "22 ago", text: "Ingresado por consignación." }]
    },
    {
      id: "v3",
      codigo: "AUT-003",
      marca: "Toyota",
      modelo: "Yaris",
      version: "XLS 1.5 CVT",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 19500,
      km: 28000,
      combustible: "nafta",
      transmision: "cvt",
      color: "Rojo Mica",
      patente: "AE 567 FG",
      puertas: 5,
      motor: "1.5L 107cv",
      descripcion: "Toyota Yaris XLS hatchback automático. Pantalla táctil, cámara, control crucero. Un solo dueño, service concesionario oficial.",
      imagenes: [
        "img/toyota-yaris.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 189,
      consultas: 9,
      diasPublicado: 14,
      cliente: null,
      history: [{ when: "26 ago", text: "Publicado." }]
    },
    {
      id: "v4",
      codigo: "AUT-004",
      marca: "Toyota",
      modelo: "Hilux",
      version: "SRX 2.8 TD AT 4x4",
      segmento: "pickup",
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
      descripcion: "Toyota Hilux SRX tope de gama. Cuero, pantalla 8\", cámara 360°, control de descenso. Service al día en concesionario oficial.",
      imagenes: [
        "img/toyota-hilux.jpg"
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
      id: "v5",
      codigo: "AUT-005",
      marca: "Toyota",
      modelo: "SW4",
      version: "SRX 2.8 TD AT 4x4",
      segmento: "suv",
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
      descripcion: "Toyota SW4 SRX 7 plazas. Cuero, techo solar, JBL premium, control de descenso. Service oficial Toyota al día.",
      imagenes: [
        "img/toyota-sw4.jpg"
      ],
      financiacion: true,
      permuta: false,
      destacado: true,
      status: "disponible",
      vistas: 923,
      consultas: 52,
      diasPublicado: 8,
      cliente: null,
      history: [{ when: "31 ago", text: "Ingresado de cliente premium." }]
    },
    {
      id: "v6",
      codigo: "AUT-006",
      marca: "Toyota",
      modelo: "RAV4",
      version: "Limited Hybrid AWD",
      segmento: "suv",
      ano: 2024,
      tipo: "0km",
      precioUSD: 58000,
      km: 0,
      combustible: "hibrido",
      transmision: "automatica",
      color: "Gris Oscuro",
      patente: null,
      puertas: 5,
      motor: "2.5L Hybrid 222cv",
      descripcion: "Toyota RAV4 Hybrid Limited 0km. AWD inteligente, consumo 4.7L/100km. Pantalla 10.5\", JBL, techo panorámico. Entrega inmediata.",
      imagenes: [
        "img/toyota-rav4.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 567,
      consultas: 28,
      diasPublicado: 5,
      cliente: null,
      history: [{ when: "3 sep", text: "Nueva unidad en stock." }]
    },

    // === VOLKSWAGEN ===
    {
      id: "v7",
      codigo: "AUT-007",
      marca: "Volkswagen",
      modelo: "Golf",
      version: "1.4 TSI Highline DSG",
      segmento: "auto",
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
      descripcion: "VW Golf Highline impecable. Único dueño, service oficial completo. Techo solar, cuero, navegador, sensores de estacionamiento.",
      imagenes: [
        "img/volkswagen-golf.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 15,
      diasPublicado: 25,
      cliente: null,
      history: [{ when: "20 ago", text: "Ingresado a consignación." }]
    },
    {
      id: "v8",
      codigo: "AUT-008",
      marca: "Volkswagen",
      modelo: "Polo",
      version: "Trendline 1.6 MSI",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 17500,
      km: 22000,
      combustible: "nafta",
      transmision: "manual",
      color: "Blanco Cristal",
      patente: "AF 345 GH",
      puertas: 5,
      motor: "1.6L 110cv",
      descripcion: "VW Polo Trendline con pack eléctrico. Bajo consumo, ideal ciudad. Un dueño, service oficial VW al día.",
      imagenes: [
        "img/volkswagen-polo.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 145,
      consultas: 8,
      diasPublicado: 12,
      cliente: null,
      history: [{ when: "28 ago", text: "Publicado." }]
    },
    {
      id: "v9",
      codigo: "AUT-009",
      marca: "Volkswagen",
      modelo: "Virtus",
      version: "Highline 1.4 TSI AT",
      segmento: "auto",
      ano: 2024,
      tipo: "0km",
      precioUSD: 26000,
      km: 0,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Biscay",
      patente: null,
      puertas: 4,
      motor: "1.4L TSI 150cv",
      descripcion: "VW Virtus Highline 0km. Climatronic, ACC, Lane Assist, techo solar. El sedán más equipado del segmento. Financiación Plan VW.",
      imagenes: [
        "img/volkswagen-virtus.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 312,
      consultas: 18,
      diasPublicado: 7,
      cliente: null,
      history: [{ when: "1 sep", text: "Nueva unidad disponible." }]
    },
    {
      id: "v35",
      codigo: "AUT-035",
      marca: "Volkswagen",
      modelo: "Vento",
      version: "Comfortline 1.4 TSI AT",
      segmento: "auto",
      ano: 2022,
      tipo: "usado",
      precioUSD: 23500,
      km: 34000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Gris Platinum",
      patente: "AE 345 VW",
      puertas: 4,
      motor: "1.4L TSI 150cv",
      descripcion: "VW Vento Comfortline automático. Climatronic, App-Connect, sensores de estacionamiento. Sedán cómodo y confiable, service oficial.",
      imagenes: [
        "img/volkswagen-vento.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 198,
      consultas: 11,
      diasPublicado: 16,
      cliente: null,
      history: [{ when: "24 ago", text: "Ingresado por consignación." }]
    },
    {
      id: "v10",
      codigo: "AUT-010",
      marca: "Volkswagen",
      modelo: "Tiguan",
      version: "Allspace 1.4 TSI DSG",
      segmento: "suv",
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
      descripcion: "VW Tiguan Allspace 7 plazas. Techo panorámico, cuero, ACC, asistente de carril. Un solo dueño, service oficial.",
      imagenes: [
        "img/volkswagen-tiguan.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 567,
      consultas: 32,
      diasPublicado: 12,
      cliente: null,
      history: [{ when: "28 ago", text: "Publicado como destacado." }]
    },
    {
      id: "v11",
      codigo: "AUT-011",
      marca: "Volkswagen",
      modelo: "T-Cross",
      version: "Highline 1.4 TSI AT",
      segmento: "suv",
      ano: 2023,
      tipo: "usado",
      precioUSD: 28000,
      km: 18000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Naranja Magma",
      patente: "AF 678 IJ",
      puertas: 5,
      motor: "1.4L TSI 150cv",
      descripcion: "VW T-Cross Highline turbo. Beats audio, Digital Cockpit, techo bicolor. Como nuevo, garantía de fábrica vigente.",
      imagenes: [
        "img/volkswagen-t-cross.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 289,
      consultas: 16,
      diasPublicado: 10,
      cliente: null,
      history: [{ when: "30 ago", text: "Ingresado como parte de pago." }]
    },
    {
      id: "v39",
      codigo: "AUT-039",
      marca: "Volkswagen",
      modelo: "Taos",
      version: "Highline 1.4 TSI AT",
      segmento: "suv",
      ano: 2024,
      tipo: "0km",
      precioUSD: 36500,
      km: 0,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Cosmos",
      patente: null,
      puertas: 5,
      motor: "1.4L TSI 150cv",
      descripcion: "VW Taos Highline 0km. Digital Cockpit Pro, techo solar, ACC. SUV media con baúl real. Plan de ahorro y financiación.",
      imagenes: [
        "img/volkswagen-taos.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 401,
      consultas: 21,
      diasPublicado: 4,
      cliente: null,
      history: [{ when: "4 sep", text: "Nueva unidad en stock." }]
    },
    {
      id: "v12",
      codigo: "AUT-012",
      marca: "Volkswagen",
      modelo: "Amarok",
      version: "V6 Extreme 3.0 TDI 4x4",
      segmento: "pickup",
      ano: 2023,
      tipo: "usado",
      precioUSD: 62000,
      km: 25000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Negro Deep",
      patente: "AF 012 KL",
      puertas: 4,
      motor: "3.0L V6 TDI 258cv",
      descripcion: "VW Amarok V6 Extreme, la pickup más potente. Cuero, Discover Pro, cámara 360°, diferencial trasero. Impecable estado.",
      imagenes: [
        "img/volkswagen-amarok.jpg"
      ],
      financiacion: true,
      permuta: false,
      destacado: true,
      status: "disponible",
      vistas: 678,
      consultas: 38,
      diasPublicado: 6,
      cliente: null,
      history: [{ when: "2 sep", text: "Publicado como destacado." }]
    },

    // === FORD ===
    {
      id: "v13",
      codigo: "AUT-013",
      marca: "Ford",
      modelo: "Focus",
      version: "SE Plus 2.0 AT",
      segmento: "auto",
      ano: 2019,
      tipo: "usado",
      precioUSD: 16500,
      km: 78000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Mónaco",
      patente: "AB 789 CD",
      puertas: 5,
      motor: "2.0L 170cv",
      descripcion: "Ford Focus SE Plus excelente estado. Control de estabilidad, 6 airbags, SYNC 3. Cubiertas nuevas. Ideal primer auto.",
      imagenes: [
        "img/ford-focus.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 156,
      consultas: 8,
      diasPublicado: 40,
      cliente: null,
      history: [{ when: "30 jul", text: "Publicado." }]
    },
    {
      id: "v36",
      codigo: "AUT-036",
      marca: "Ford",
      modelo: "Fiesta",
      version: "SE 1.6 PowerShift",
      segmento: "auto",
      ano: 2019,
      tipo: "usado",
      precioUSD: 12500,
      km: 62000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Blanco Oxford",
      patente: "AB 456 FT",
      puertas: 5,
      motor: "1.6L 120cv",
      descripcion: "Ford Fiesta SE PowerShift. SYNC, 6 airbags, control de estabilidad. Ágil y económico, cubiertas nuevas. Ideal ciudad.",
      imagenes: [
        "img/ford-fiesta.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 167,
      consultas: 9,
      diasPublicado: 28,
      cliente: null,
      history: [{ when: "12 ago", text: "Publicado." }]
    },
    {
      id: "v14",
      codigo: "AUT-014",
      marca: "Ford",
      modelo: "Ka",
      version: "SEL 1.5 AT",
      segmento: "auto",
      ano: 2021,
      tipo: "usado",
      precioUSD: 13000,
      km: 45000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Rojo Merlot",
      patente: "AD 901 EF",
      puertas: 5,
      motor: "1.5L 123cv",
      descripcion: "Ford Ka SEL automático. SYNC, control crucero, sensor de lluvia. Muy económico, excelente para ciudad.",
      imagenes: [
        "img/ford-ka.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 123,
      consultas: 6,
      diasPublicado: 20,
      cliente: null,
      history: [{ when: "20 ago", text: "Publicado." }]
    },
    {
      id: "v15",
      codigo: "AUT-015",
      marca: "Ford",
      modelo: "Ranger",
      version: "Limited 3.2 AT 4x4",
      segmento: "pickup",
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
      descripcion: "Ford Ranger Limited 2024 0km. Nueva generación: SYNC 4, pantalla 12\", Pro Trailer Backup, 360°. Entrega inmediata.",
      imagenes: [
        "img/ford-ranger.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 678,
      consultas: 38,
      diasPublicado: 5,
      cliente: null,
      history: [{ when: "3 sep", text: "Publicado como novedad." }]
    },
    {
      id: "v16",
      codigo: "AUT-016",
      marca: "Ford",
      modelo: "Territory",
      version: "Titanium 1.5T AT",
      segmento: "suv",
      ano: 2023,
      tipo: "usado",
      precioUSD: 35000,
      km: 22000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Blanco Oxford",
      patente: "AF 234 MN",
      puertas: 5,
      motor: "1.5L Turbo 143cv",
      descripcion: "Ford Territory Titanium. Co-Pilot 360, techo panorámico, cuero. SUV espacioso y equipado. Garantía extendida.",
      imagenes: [
        "img/ford-territory.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 14,
      diasPublicado: 15,
      cliente: null,
      history: [{ when: "25 ago", text: "Ingresado." }]
    },

    // === FIAT ===
    {
      id: "v17",
      codigo: "AUT-017",
      marca: "Fiat",
      modelo: "Cronos",
      version: "Precision 1.8 AT",
      segmento: "auto",
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
      descripcion: "Fiat Cronos Precision automático. Pantalla Uconnect, cámara, sensores, climatizador. Service oficial al día.",
      imagenes: [
        "img/fiat-cronos.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 189,
      consultas: 11,
      diasPublicado: 18,
      cliente: null,
      history: [{ when: "22 ago", text: "Ingresado como parte de pago." }]
    },
    {
      id: "v18",
      codigo: "AUT-018",
      marca: "Fiat",
      modelo: "Argo",
      version: "Trekking 1.3 MT",
      segmento: "auto",
      ano: 2024,
      tipo: "0km",
      precioUSD: 19500,
      km: 0,
      combustible: "nafta",
      transmision: "manual",
      color: "Verde Technogreen",
      patente: null,
      puertas: 5,
      motor: "1.3L Firefly 99cv",
      descripcion: "Fiat Argo Trekking 0km. Estética off-road, suspensión elevada, Uconnect 7\", Start&Stop. Económico y versátil.",
      imagenes: [
        "img/fiat-argo.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 267,
      consultas: 15,
      diasPublicado: 8,
      cliente: null,
      history: [{ when: "31 ago", text: "Nueva unidad en stock." }]
    },
    {
      id: "v19",
      codigo: "AUT-019",
      marca: "Fiat",
      modelo: "Mobi",
      version: "Trekking 1.0 MT",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 11500,
      km: 18000,
      combustible: "nafta",
      transmision: "manual",
      color: "Naranja Sicilia",
      patente: "AF 567 OP",
      puertas: 5,
      motor: "1.0L Firefly 77cv",
      descripcion: "Fiat Mobi Trekking, el city car más económico. Bajo consumo, fácil de estacionar. Ideal primer auto o segundo vehículo.",
      imagenes: [
        "img/fiat-mobi.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 145,
      consultas: 7,
      diasPublicado: 22,
      cliente: null,
      history: [{ when: "18 ago", text: "Publicado." }]
    },

    // === CHEVROLET ===
    {
      id: "v20",
      codigo: "AUT-020",
      marca: "Chevrolet",
      modelo: "Cruze",
      version: "LTZ 1.4T AT",
      segmento: "auto",
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
      descripcion: "Chevrolet Cruze LTZ turbo automático. MyLink, OnStar, alerta de colisión, cámara. Muy buen estado.",
      imagenes: [
        "img/chevrolet-cruze.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 234,
      consultas: 14,
      diasPublicado: 30,
      cliente: null,
      history: [{ when: "10 ago", text: "Publicado." }]
    },
    {
      id: "v21",
      codigo: "AUT-021",
      marca: "Chevrolet",
      modelo: "Onix",
      version: "Premier 1.0T AT",
      segmento: "auto",
      ano: 2024,
      tipo: "0km",
      precioUSD: 22000,
      km: 0,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Seeker",
      patente: null,
      puertas: 5,
      motor: "1.0L Turbo 116cv",
      descripcion: "Chevrolet Onix Premier 0km. WiFi integrado, pantalla 8\", 6 airbags, alerta de colisión frontal. El hatch más vendido.",
      imagenes: [
        "img/chevrolet-onix.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 345,
      consultas: 19,
      diasPublicado: 6,
      cliente: null,
      history: [{ when: "2 sep", text: "Nueva unidad disponible." }]
    },
    {
      id: "v22",
      codigo: "AUT-022",
      marca: "Chevrolet",
      modelo: "Tracker",
      version: "Premier 1.2T AT",
      segmento: "suv",
      ano: 2023,
      tipo: "usado",
      precioUSD: 29000,
      km: 20000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Gris Satin Steel",
      patente: "AF 890 QR",
      puertas: 5,
      motor: "1.2L Turbo 133cv",
      descripcion: "Chevrolet Tracker Premier turbo. Techo solar, cuero, asistentes de conducción. La SUV compacta más equipada.",
      imagenes: [
        "img/chevrolet-tracker.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 312,
      consultas: 17,
      diasPublicado: 11,
      cliente: null,
      history: [{ when: "29 ago", text: "Ingresado." }]
    },
    {
      id: "v40",
      codigo: "AUT-040",
      marca: "Chevrolet",
      modelo: "Equinox",
      version: "Premier 1.5T AT AWD",
      segmento: "suv",
      ano: 2022,
      tipo: "usado",
      precioUSD: 37500,
      km: 36000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Negro Mosaic",
      patente: "AE 678 EQ",
      puertas: 5,
      motor: "1.5L Turbo 170cv",
      descripcion: "Chevrolet Equinox Premier AWD. Techo panorámico, Bose, asientos de cuero, OnStar. SUV media con tracción integral.",
      imagenes: [
        "img/chevrolet-equinox.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 278,
      consultas: 16,
      diasPublicado: 13,
      cliente: null,
      history: [{ when: "27 ago", text: "Ingresado." }]
    },
    {
      id: "v23",
      codigo: "AUT-023",
      marca: "Chevrolet",
      modelo: "S10",
      version: "High Country 2.8 TD AT 4x4",
      segmento: "pickup",
      ano: 2022,
      tipo: "usado",
      precioUSD: 48000,
      km: 38000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Blanco Summit",
      patente: "AE 123 ST",
      puertas: 4,
      motor: "2.8L TD 200cv",
      descripcion: "Chevrolet S10 High Country tope de gama. Cuero, MyLink, cámara trasera. Excelente estado, service oficial.",
      imagenes: [
        "img/chevrolet-s10.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 456,
      consultas: 24,
      diasPublicado: 16,
      cliente: null,
      history: [{ when: "24 ago", text: "Publicado." }]
    },

    // === RENAULT ===
    {
      id: "v24",
      codigo: "AUT-024",
      marca: "Renault",
      modelo: "Sandero",
      version: "Intens 1.6 CVT",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 16000,
      km: 28000,
      combustible: "nafta",
      transmision: "cvt",
      color: "Gris Cassiopée",
      patente: "AF 234 UV",
      puertas: 5,
      motor: "1.6L 115cv",
      descripcion: "Renault Sandero Intens CVT. Easy Link 8\", cámara, climatizador. Espacioso y cómodo para familia.",
      imagenes: [
        "img/renault-sandero.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 178,
      consultas: 10,
      diasPublicado: 14,
      cliente: null,
      history: [{ when: "26 ago", text: "Publicado." }]
    },
    {
      id: "v37",
      codigo: "AUT-037",
      marca: "Renault",
      modelo: "Logan",
      version: "Intens 1.6 CVT",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 15500,
      km: 24000,
      combustible: "nafta",
      transmision: "cvt",
      color: "Gris Estrella",
      patente: "AF 123 LG",
      puertas: 4,
      motor: "1.6L 115cv",
      descripcion: "Renault Logan Intens CVT. Baúl amplio, Easy Link, aire digital. Ideal familia o flota, bajo costo de mantenimiento.",
      imagenes: [
        "img/renault-logan.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 156,
      consultas: 8,
      diasPublicado: 15,
      cliente: null,
      history: [{ when: "25 ago", text: "Publicado." }]
    },
    {
      id: "v25",
      codigo: "AUT-025",
      marca: "Renault",
      modelo: "Duster",
      version: "Iconic 1.3 TCe CVT 4x2",
      segmento: "suv",
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
      descripcion: "Nueva Renault Duster Iconic 2024. Diseño renovado, Multi-Sense, Easy Link 8\", cámara 360°. Financiación hasta 60 cuotas.",
      imagenes: [
        "img/renault-duster.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 345,
      consultas: 19,
      diasPublicado: 7,
      cliente: null,
      history: [{ when: "1 sep", text: "Nueva unidad disponible." }]
    },
    {
      id: "v26",
      codigo: "AUT-026",
      marca: "Renault",
      modelo: "Kwid",
      version: "Outsider 1.0 MT",
      segmento: "auto",
      ano: 2023,
      tipo: "usado",
      precioUSD: 10500,
      km: 22000,
      combustible: "nafta",
      transmision: "manual",
      color: "Blanco Glaciar",
      patente: "AF 567 WX",
      puertas: 5,
      motor: "1.0L 66cv",
      descripcion: "Renault Kwid Outsider, el SUV de entrada. Estética robusta, Media Evolution, aire acondicionado. El más económico.",
      imagenes: [
        "img/renault-kwid.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 134,
      consultas: 8,
      diasPublicado: 19,
      cliente: null,
      history: [{ when: "21 ago", text: "Publicado." }]
    },

    // === PEUGEOT ===
    {
      id: "v27",
      codigo: "AUT-027",
      marca: "Peugeot",
      modelo: "208",
      version: "Allure 1.6 AT",
      segmento: "auto",
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
      descripcion: "Peugeot 208 Allure automático. i-Cockpit 3D, Mirror Screen, control crucero. Único dueño, excelente estado.",
      imagenes: [
        "img/peugeot-208.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 178,
      consultas: 9,
      diasPublicado: 22,
      cliente: null,
      history: [{ when: "18 ago", text: "Ingresado por consignación." }]
    },
    {
      id: "v38",
      codigo: "AUT-038",
      marca: "Peugeot",
      modelo: "308",
      version: "Allure 1.6 THP AT",
      segmento: "auto",
      ano: 2021,
      tipo: "usado",
      precioUSD: 21000,
      km: 41000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Gris Hurricane",
      patente: "AD 890 PG",
      puertas: 5,
      motor: "1.6L THP 165cv",
      descripcion: "Peugeot 308 Allure turbo. i-Cockpit, techo panorámico, Full LED. Hatch premium con muy buen manejo.",
      imagenes: [
        "img/peugeot-308.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 212,
      consultas: 13,
      diasPublicado: 21,
      cliente: null,
      history: [{ when: "19 ago", text: "Ingresado por consignación." }]
    },
    {
      id: "v28",
      codigo: "AUT-028",
      marca: "Peugeot",
      modelo: "2008",
      version: "Allure Pack 1.6 AT",
      segmento: "suv",
      ano: 2022,
      tipo: "usado",
      precioUSD: 26000,
      km: 32000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Gris Artense",
      patente: "AE 901 YZ",
      puertas: 5,
      motor: "1.6L 115cv",
      descripcion: "Peugeot 2008 Allure Pack. i-Cockpit 3D 10\", techo panorámico, cámara 180°. SUV con diseño premium.",
      imagenes: [
        "img/peugeot-2008.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 267,
      consultas: 15,
      diasPublicado: 13,
      cliente: null,
      history: [{ when: "27 ago", text: "Publicado." }]
    },

    // === JEEP ===
    {
      id: "v29",
      codigo: "AUT-029",
      marca: "Jeep",
      modelo: "Compass",
      version: "Limited 2.0 TD AT9 4x4",
      segmento: "suv",
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
      descripcion: "Jeep Compass Limited diésel 4x4. Equipamiento full: cuero, techo, navegador, Beats audio. Service oficial.",
      imagenes: [
        "img/jeep-compass.jpg"
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
      id: "v30",
      codigo: "AUT-030",
      marca: "Jeep",
      modelo: "Renegade",
      version: "Longitude 1.8 AT",
      segmento: "suv",
      ano: 2022,
      tipo: "usado",
      precioUSD: 28000,
      km: 35000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Verde Recon",
      patente: "AE 234 AB",
      puertas: 5,
      motor: "1.8L 130cv",
      descripcion: "Jeep Renegade Longitude. Uconnect 8.4\", techo My Sky removible, cámara trasera. Estilo Jeep auténtico.",
      imagenes: [
        "img/jeep-renegade.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 345,
      consultas: 18,
      diasPublicado: 17,
      cliente: null,
      history: [{ when: "23 ago", text: "Ingresado." }]
    },

    // === NISSAN ===
    {
      id: "v31",
      codigo: "AUT-031",
      marca: "Nissan",
      modelo: "Frontier",
      version: "X-Gear 2.3 TD AT 4x4",
      segmento: "pickup",
      ano: 2023,
      tipo: "usado",
      precioUSD: 49000,
      km: 28000,
      combustible: "diesel",
      transmision: "automatica",
      color: "Gris Gun Metallic",
      patente: "AF 345 CD",
      puertas: 4,
      motor: "2.3L TD 190cv",
      descripcion: "Nissan Frontier X-Gear biturbo. Asistente de frenado, Around View Monitor, diferencial trasero. Pickup robusta y moderna.",
      imagenes: [
        "img/nissan-frontier.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 423,
      consultas: 22,
      diasPublicado: 12,
      cliente: null,
      history: [{ when: "28 ago", text: "Publicado." }]
    },

    // === HYUNDAI ===
    {
      id: "v32",
      codigo: "AUT-032",
      marca: "Hyundai",
      modelo: "Tucson",
      version: "Limited 2.0 AT AWD",
      segmento: "suv",
      ano: 2023,
      tipo: "usado",
      precioUSD: 42000,
      km: 18000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Azul Teal",
      patente: "AF 678 EF",
      puertas: 5,
      motor: "2.0L 156cv",
      descripcion: "Hyundai Tucson Limited AWD. Diseño paramétrico, BlueLink, pantalla 10.25\", asientos ventilados. Como nueva.",
      imagenes: [
        "img/hyundai-tucson.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: true,
      status: "disponible",
      vistas: 534,
      consultas: 29,
      diasPublicado: 9,
      cliente: null,
      history: [{ when: "30 ago", text: "Publicado como destacado." }]
    },

    // === CITROËN ===
    {
      id: "v33",
      codigo: "AUT-033",
      marca: "Citroën",
      modelo: "C4 Cactus",
      version: "Feel Pack 1.6 AT",
      segmento: "suv",
      ano: 2022,
      tipo: "usado",
      precioUSD: 22000,
      km: 32000,
      combustible: "nafta",
      transmision: "automatica",
      color: "Blanco Banquise",
      patente: "AE 456 GH",
      puertas: 5,
      motor: "1.6L 115cv",
      descripcion: "Citroën C4 Cactus Feel Pack. Airbumps, asientos Advanced Comfort, Connect Nav. Diseño único y confortable.",
      imagenes: [
        "img/citroen-c4-cactus.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 198,
      consultas: 11,
      diasPublicado: 20,
      cliente: null,
      history: [{ when: "20 ago", text: "Publicado." }]
    },

    // === HONDA ===
    {
      id: "v34",
      codigo: "AUT-034",
      marca: "Honda",
      modelo: "HR-V",
      version: "EXL 1.8 CVT",
      segmento: "suv",
      ano: 2022,
      tipo: "usado",
      precioUSD: 32000,
      km: 28000,
      combustible: "nafta",
      transmision: "cvt",
      color: "Blanco Taffeta",
      patente: "AE 789 IJ",
      puertas: 5,
      motor: "1.8L i-VTEC 140cv",
      descripcion: "Honda HR-V EXL CVT. Asientos Magic Seat, Honda Sensing, LaneWatch. Confiabilidad Honda con bajo consumo.",
      imagenes: [
        "img/honda-hr-v.jpg"
      ],
      financiacion: true,
      permuta: true,
      destacado: false,
      status: "disponible",
      vistas: 367,
      consultas: 20,
      diasPublicado: 14,
      cliente: null,
      history: [{ when: "26 ago", text: "Ingresado." }]
    }
  ];
}

const CONSULTA_ESTADOS = [
  { id: "pendiente", label: "Pendiente" },
  { id: "contactado", label: "Contactado" },
  { id: "visita", label: "Visita" },
  { id: "cerrada", label: "Cerrada" }
];

const CONSULTAS_KEY = "automotores-consultas-v1";
let consultasCache = null;

function seedConsultas() {
  return [
    {
      id: "c1",
      vehiculoId: "v1",
      nombre: "Laura Gómez",
      tel: "11-5555-1001",
      email: "laura.gomez@mail.com",
      mensaje: "¿Hay financiación en 36 cuotas para el Corolla?",
      fecha: "2026-09-06T14:20:00",
      estado: "pendiente",
      history: [{ when: "6 sep", text: "Consulta recibida desde el catálogo." }]
    },
    {
      id: "c2",
      vehiculoId: "v4",
      nombre: "Martín Pérez",
      tel: "11-4444-8822",
      email: "martin.perez@mail.com",
      mensaje: "Quiero ver la Hilux esta semana. ¿Permuta por una Ranger 2018?",
      fecha: "2026-09-05T11:05:00",
      estado: "visita",
      history: [
        { when: "7 sep", text: "Visita coordinada para el sábado." },
        { when: "5 sep", text: "Consulta recibida." }
      ]
    },
    {
      id: "c3",
      vehiculoId: "v8",
      nombre: "Sofía Álvarez",
      tel: "11-3333-4400",
      email: "sofia.alvarez@mail.com",
      mensaje: "El Golf está reservado? Si se libera avisen.",
      fecha: "2026-09-04T18:40:00",
      estado: "contactado",
      history: [
        { when: "4 sep", text: "Se llamó y quedó en espera." },
        { when: "4 sep", text: "Consulta recibida." }
      ]
    },
    {
      id: "c4",
      vehiculoId: "v12",
      nombre: "Diego Ruiz",
      tel: "11-2222-1199",
      email: "diego.ruiz@mail.com",
      mensaje: "¿Aceptan seña del 10% para el Cronos?",
      fecha: "2026-09-03T09:15:00",
      estado: "cerrada",
      history: [{ when: "3 sep", text: "Consulta cerrada: eligió otro vehículo." }]
    }
  ];
}

function loadConsultas() {
  if (consultasCache) return consultasCache;
  const raw = localStorage.getItem(CONSULTAS_KEY);
  if (!raw) {
    consultasCache = seedConsultas();
    localStorage.setItem(CONSULTAS_KEY, JSON.stringify(consultasCache));
    return consultasCache;
  }
  try {
    const parsed = JSON.parse(raw);
    consultasCache = Array.isArray(parsed) ? parsed : seedConsultas();
  } catch {
    consultasCache = seedConsultas();
  }
  return consultasCache;
}

function saveConsultas(list) {
  if (Array.isArray(list)) consultasCache = list;
  localStorage.setItem(CONSULTAS_KEY, JSON.stringify(consultasCache));
}

function consultaLabel(estado) {
  return CONSULTA_ESTADOS.find((s) => s.id === estado)?.label || estado;
}

function vehiculoLabel(id, items) {
  const v = (items || load()).find((x) => x.id === id);
  return v ? `${v.marca} ${v.modelo} (${v.codigo})` : "Sin vehículo";
}

function formatFechaConsulta(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function load() {
  const raw = localStorage.getItem("automotores-demo-v4");
  if (!raw) {
    const data = seed();
    localStorage.setItem("automotores-demo-v4", JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function save(items) {
  localStorage.setItem("automotores-demo-v4", JSON.stringify(items));
}

function label(status) {
  return ESTADOS.find((s) => s.id === status)?.label || status;
}

function tipoLabel(tipo) {
  return TIPOS.find((t) => t.id === tipo)?.label || tipo;
}

function segmentoLabel(seg) {
  return SEGMENTOS.find((s) => s.id === seg)?.label || seg;
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

function getMarcaColor(marca) {
  const colors = MARCA_COLORS[marca] || { primary: "#0f172a", secondary: "#ffffff", accent: "#1e293b" };
  return { text: colors.primary, ...colors };
}

function getMarcaLogo(marca) {
  return MARCA_LOGOS[marca] || "";
}

function fotoModelo(marca, modelo) {
  const slug = String(marca + "-" + modelo)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const conocidos = [
    "toyota-corolla", "toyota-etios", "toyota-yaris", "toyota-hilux", "toyota-sw4", "toyota-rav4",
    "volkswagen-golf", "volkswagen-polo", "volkswagen-virtus", "volkswagen-vento", "volkswagen-tiguan",
    "volkswagen-t-cross", "volkswagen-taos", "volkswagen-amarok",
    "ford-focus", "ford-fiesta", "ford-ka", "ford-ranger", "ford-territory",
    "fiat-cronos", "fiat-argo", "fiat-mobi",
    "chevrolet-cruze", "chevrolet-onix", "chevrolet-tracker", "chevrolet-equinox", "chevrolet-s10",
    "renault-sandero", "renault-logan", "renault-duster", "renault-kwid",
    "peugeot-208", "peugeot-308", "peugeot-2008",
    "jeep-compass", "jeep-renegade", "nissan-frontier", "hyundai-tucson",
    "citroen-c4-cactus", "honda-hr-v"
  ];
  if (conocidos.includes(slug)) return "img/" + slug + ".jpg";
  return "img/toyota-corolla.jpg";
}
