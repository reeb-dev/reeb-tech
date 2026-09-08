const STORAGE_ITEMS = "libreria-demo-v2";
const STORAGE_CART = "libreria-cart-v1";
const STORAGE_VENTAS = "libreria-ventas-v1";

const STATUSES = [
  { id: "stock", label: "En stock" },
  { id: "bajo", label: "Stock bajo" },
  { id: "agotado", label: "Agotado" },
  { id: "pedido", label: "Pedido especial" }
];

const CATEGORIAS = [
  { id: "ficcion", label: "Ficción" },
  { id: "ensayo", label: "Ensayo" },
  { id: "infantil", label: "Infantil" },
  { id: "historieta", label: "Historieta" },
  { id: "clasico", label: "Clásico" },
  { id: "utiles", label: "Útiles escolares" },
  { id: "papeleria", label: "Papelería" }
];

const COMPROBANTES = [
  { id: "FB", label: "Factura B" },
  { id: "FC", label: "Factura C" },
  { id: "TK", label: "Ticket" },
  { id: "RE", label: "Remito" }
];

function seed() {
  return [
    {
      id: "lib-aleph",
      codigo: "LIB-001",
      nombre: "El Aleph",
      categoria: "ficcion",
      autor: "Jorge Luis Borges",
      editorial: "Emecé / Alianza",
      descripcion: "Cuentos en los que Borges cruza el infinito, la memoria y los laberintos. El relato que da título imagina un punto del espacio que contiene, a la vez, todo el universo.",
      isbn: "978-950-04-2309-0",
      precio: 16800,
      costo: 11000,
      stock: 7,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/el-aleph.jpg",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición: +8 unidades" }]
    },
    {
      id: "lib-ficciones",
      codigo: "LIB-002",
      nombre: "Ficciones",
      categoria: "ficcion",
      autor: "Jorge Luis Borges",
      editorial: "Sur",
      descripcion: "La otra cumbre de los cuentos de Borges: bibliotecas que no terminan, dobles y mundos que se sostienen en una idea. Edición de Sur, la que suele pedirse en el mostrador.",
      isbn: "978-950-04-0001-3",
      precio: 17200,
      costo: 11200,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/ficciones.jpg",
      status: "stock",
      history: [{ when: "4 sep", text: "Edición Sur en góndola" }]
    },
    {
      id: "lib-rayuela",
      codigo: "LIB-003",
      nombre: "Rayuela",
      categoria: "ficcion",
      autor: "Julio Cortázar",
      editorial: "Sudamericana",
      descripcion: "La novela que se puede leer de corrido o saltando de capítulo. Oliveira y la Maga en París; después, Buenos Aires y el lado de acá. Un clásico que se vende todo el año.",
      isbn: "978-950-07-1234-5",
      precio: 19500,
      costo: 12800,
      stock: 6,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/rayuela.png",
      status: "stock",
      history: [{ when: "2 sep", text: "Pedido Alfaguara/Sudamericana" }]
    },
    {
      id: "lib-fierro",
      codigo: "LIB-004",
      nombre: "Martín Fierro",
      categoria: "clasico",
      autor: "José Hernández",
      editorial: "Librería Martín Fierro",
      descripcion: "El poema gauchesco de José Hernández: la ida y la vuelta de un gaucho que pelea, huye y vuelve a la frontera. Edición de referencia para leer en voz alta o para la escuela.",
      isbn: "978-950-03-0100-8",
      precio: 9800,
      costo: 6200,
      stock: 12,
      minimo: 4,
      proveedor: "Clásicos Argentinos",
      imagen: "img/martin-fierro.jpg",
      status: "stock",
      history: [{ when: "1 sep", text: "Edición de referencia gauchesca" }]
    },
    {
      id: "lib-eternauta",
      codigo: "LIB-005",
      nombre: "El Eternauta",
      categoria: "historieta",
      autor: "H. G. Oesterheld / Solano López",
      editorial: "Doedytores",
      descripcion: "Juan Salvo cuenta la nevada mortal que cayó sobre Buenos Aires y el grupo que intentó sobrevivir en la casa. Historieta de Oesterheld y Solano López, de las más leídas del Río de la Plata.",
      isbn: "978-987-1788-61-3",
      precio: 24500,
      costo: 16200,
      stock: 4,
      minimo: 3,
      proveedor: "Historietas del Sur",
      imagen: "img/el-eternauta.jpg",
      status: "stock",
      history: [{ when: "6 sep", text: "Edición color · nevada mortal" }]
    },
    {
      id: "lib-cien",
      codigo: "LIB-006",
      nombre: "Cien años de soledad",
      categoria: "ficcion",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      descripcion: "La saga de los Buendía en Macondo, contada de una vez y para siempre. Memoria familiar, guerras absurdas y un pueblo que se inventa y se olvida. El título que más se pide de García Márquez.",
      isbn: "978-950-07-0001-0",
      precio: 18500,
      costo: 12000,
      stock: 8,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/cien-anos-de-soledad.png",
      status: "stock",
      history: [{ when: "5 sep", text: "Reposición: +10 unidades" }]
    },
    {
      id: "lib-colera",
      codigo: "LIB-007",
      nombre: "El amor en los tiempos del cólera",
      categoria: "ficcion",
      autor: "Gabriel García Márquez",
      editorial: "Editorial Oveja Negra",
      descripcion: "Florentino Ariza espera más de cincuenta años para volver a declararse a Fermina Daza. Una historia de amor largo, ridículo y obstinado, en el Caribe de fines del siglo XIX.",
      isbn: "978-958-06-0007-4",
      precio: 17800,
      costo: 11600,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/amor-tiempos-colera.png",
      status: "stock",
      history: [{ when: "3 sep", text: "Llegó edición Oveja Negra" }]
    },
    {
      id: "lib-paramo",
      codigo: "LIB-008",
      nombre: "Pedro Páramo",
      categoria: "ficcion",
      autor: "Juan Rulfo",
      editorial: "Editorial RM",
      descripcion: "Juan Preciado baja a Comala a buscar a su padre y encuentra un pueblo de murmullos. La novela corta de Rulfo que cambió el modo de contar en América Latina.",
      isbn: "978-84-16282-90-6",
      precio: 16200,
      costo: 10500,
      stock: 6,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/pedro-paramo.jpg",
      status: "stock",
      history: [{ when: "28 ago", text: "Nueva edición RM" }]
    },
    {
      id: "lib-tunel",
      codigo: "LIB-009",
      nombre: "El túnel",
      categoria: "ficcion",
      autor: "Ernesto Sabato",
      editorial: "Seix Barral",
      descripcion: "Juan Pablo Castel, pintor, escribe la confesión del crimen que cometió por celos. Una novela corta, fría y porteña, que se lee de un tirón y se discute en el aula.",
      isbn: "978-84-322-1162-1",
      precio: 14500,
      costo: 9400,
      stock: 2,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/el-tunel.jpg",
      status: "bajo",
      history: [{ when: "6 sep", text: "Stock bajo. Pedir reposición." }]
    },
    {
      id: "lib-heroes",
      codigo: "LIB-010",
      nombre: "Sobre héroes y tumbas",
      categoria: "ficcion",
      autor: "Ernesto Sabato",
      editorial: "Compañía General Fabril Editora",
      descripcion: "Buenos Aires, una familia que se deshace y el Informe sobre ciegos. La novela larga de Sabato: oscura, política y de esas que el lector vuelve a abrir por un capítulo.",
      isbn: "978-84-322-1163-8",
      precio: 18900,
      costo: 12400,
      stock: 4,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/sobre-heroes-y-tumbas.jpg",
      status: "stock",
      history: [{ when: "30 ago", text: "Edición Fabril en exhibición" }]
    },
    {
      id: "lib-espiritus",
      codigo: "LIB-011",
      nombre: "La casa de los espíritus",
      categoria: "ficcion",
      autor: "Isabel Allende",
      editorial: "Plaza & Janés",
      descripcion: "Tres generaciones de la familia Trueba, entre la casa grande, la política y los que vuelven después de muertos. La primera novela de Isabel Allende, muy pedida en regalo.",
      isbn: "978-84-01-38120-5",
      precio: 19200,
      costo: 12600,
      stock: 7,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/casa-espiritus.jpg",
      status: "stock",
      history: [{ when: "1 sep", text: "Plaza & Janés · novela" }]
    },
    {
      id: "lib-tregua",
      codigo: "LIB-012",
      nombre: "La tregua",
      categoria: "ficcion",
      autor: "Mario Benedetti",
      editorial: "Nueva Imagen",
      descripcion: "El diario de Martín Santomé, oficinista viudo, que cuenta los días que le faltan para jubilarse. Montevideo, mesas de trabajo y un amor que llega tarde, escrito con una voz cercana.",
      isbn: "978-84-204-7183-9",
      precio: 13800,
      costo: 8900,
      stock: 9,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/la-tregua.jpg",
      status: "stock",
      history: [{ when: "29 ago", text: "Muy pedido en mostrador" }]
    },
    {
      id: "lib-sombra",
      codigo: "LIB-013",
      nombre: "Don Segundo Sombra",
      categoria: "clasico",
      autor: "Ricardo Güiraldes",
      editorial: "Editorial Proa",
      descripcion: "Un muchacho aprende el oficio del campo siguiendo a un resero. El clásico de Güiraldes sobre la pampa, el aprendizaje y la figura del paisano, en edición que evoca la de Proa.",
      isbn: "978-950-07-2669-2",
      precio: 11200,
      costo: 7300,
      stock: 8,
      minimo: 3,
      proveedor: "Clásicos Argentinos",
      imagen: "img/don-segundo-sombra.jpg",
      status: "stock",
      history: [{ when: "27 ago", text: "Edición Proa 1926 (facsímil)" }]
    },
    {
      id: "lib-masacre",
      codigo: "LIB-014",
      nombre: "Operación Masacre",
      categoria: "ensayo",
      autor: "Rodolfo Walsh",
      editorial: "Ediciones de la Flor",
      descripcion: "Walsh reconstruye los fusilamientos de José León Suárez en 1956. Testimonio, investigación y denuncia, escrito casi en caliente. Un libro que se vende y se recomienda con nombre y apellido.",
      isbn: "978-987-580-199-8",
      precio: 15600,
      costo: 10200,
      stock: 2,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/operacion-masacre.jpg",
      status: "bajo",
      history: [{ when: "7 sep", text: "Quedan 2. Pedir a De la Flor." }]
    },
    {
      id: "lib-papelucho",
      codigo: "LIB-015",
      nombre: "Papelucho",
      categoria: "infantil",
      autor: "Marcela Paz",
      editorial: "Editorial Universitaria",
      descripcion: "Las ocurrencias de un niño chileno que escribe lo que ve en su casa, con sus hermanos y su perro. Un clásico infantil de Marcela Paz, liviano y con mucha voz propia.",
      isbn: "978-956-11-0001-2",
      precio: 8900,
      costo: 5600,
      stock: 14,
      minimo: 5,
      proveedor: "Infantil Latam",
      imagen: "img/papelucho.jpg",
      status: "stock",
      history: [{ when: "2 sep", text: "Stock para el receso escolar" }]
    },
    {
      id: "lib-mafalda",
      codigo: "LIB-016",
      nombre: "Mafalda: Todas las tiras",
      categoria: "historieta",
      autor: "Quino",
      editorial: "Tusquets Editores",
      descripcion: "Las tiras de Quino reunidas: Mafalda, la sopa, la televisión y el mundo de los grandes. Humor porteño que se regala y se vuelve a leer. Integral de Tusquets, en góndola.",
      isbn: "978-987-580-089-2",
      precio: 22000,
      costo: 14500,
      stock: 10,
      minimo: 4,
      proveedor: "Historietas del Sur",
      imagen: "img/mafalda.jpg",
      status: "stock",
      history: [{ when: "4 sep", text: "Integral Tusquets" }]
    },
    {
      id: "lib-bestiario",
      codigo: "LIB-017",
      nombre: "Bestiario",
      categoria: "ficcion",
      autor: "Julio Cortázar",
      editorial: "Sudamericana",
      descripcion: "El primer libro de cuentos de Cortázar: casas que se mueven, conejos que no se pueden soltar y animales que ocupan el living. Relatos cortos para quien ya leyó Rayuela y quiere el otro Cortázar.",
      isbn: "978-950-07-0120-8",
      precio: 15400,
      costo: 10000,
      stock: 6,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/bestiario.jpg",
      status: "stock",
      history: [{ when: "6 sep", text: "Edición Sudamericana en góndola" }]
    },
    {
      id: "lib-morel",
      codigo: "LIB-018",
      nombre: "La invención de Morel",
      categoria: "ficcion",
      autor: "Adolfo Bioy Casares",
      editorial: "Losada",
      descripcion: "Un fugitivo llega a una isla donde se repiten las mismas fiestas y los mismos gestos. Novela breve de Bioy, con prólogo de Borges, entre la fantasía y la máquina de imágenes.",
      isbn: "978-950-03-0214-2",
      precio: 14900,
      costo: 9700,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/invencion-de-morel.jpg",
      status: "stock",
      history: [{ when: "5 sep", text: "Clásico de Losada" }]
    },
    {
      id: "lib-boquitas",
      codigo: "LIB-019",
      nombre: "Boquitas pintadas",
      categoria: "ficcion",
      autor: "Manuel Puig",
      editorial: "Sudamericana",
      descripcion: "El folletín de Juan Carlos Etchepare, escrito con cartas, diarios y chismes de un pueblo de la provincia de Buenos Aires. Puig arma la novela con las voces de la radio y del barrio.",
      isbn: "978-950-07-0456-8",
      precio: 16800,
      costo: 10900,
      stock: 4,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/boquitas-pintadas.jpg",
      status: "stock",
      history: [{ when: "3 sep", text: "Reposición Puig" }]
    },
    {
      id: "lib-santa",
      codigo: "LIB-020",
      nombre: "Santa Evita",
      categoria: "ficcion",
      autor: "Tomás Eloy Martínez",
      editorial: "Planeta",
      descripcion: "La novela sobre el cuerpo de Eva Perón después de 1952: el velorio, el traslado y las versiones que se cuentan. Martínez mezcla crónica y ficción, y es un título que se pregunta seguido en Caballito.",
      isbn: "978-950-742-656-1",
      precio: 19800,
      costo: 12900,
      stock: 7,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/santa-evita.jpg",
      status: "stock",
      history: [{ when: "2 sep", text: "Edición Planeta" }]
    },
    {
      id: "lib-facundo",
      codigo: "LIB-021",
      nombre: "Facundo",
      categoria: "clasico",
      autor: "Domingo Faustino Sarmiento",
      editorial: "Imprenta del Progreso",
      descripcion: "Civilización y barbarie, escrito en el exilio de 1845. El retrato de Facundo Quiroga y de las montoneras, leído todavía en la escuela y en la facultad. Edición que reproduce la portada histórica.",
      isbn: "978-950-03-0401-6",
      precio: 12400,
      costo: 8000,
      stock: 8,
      minimo: 3,
      proveedor: "Clásicos Argentinos",
      imagen: "img/facundo.jpg",
      status: "stock",
      history: [{ when: "1 sep", text: "Clásico escolar de temporada" }]
    },
    {
      id: "lib-detectives",
      codigo: "LIB-022",
      nombre: "Los detectives salvajes",
      categoria: "ficcion",
      autor: "Roberto Bolaño",
      editorial: "Anagrama",
      descripcion: "Arturo Belano y Ulises Lima recorren México y el mundo buscando a una poeta desaparecida. Una novela larga, de voces y de viajes, para quien quiere un Bolaño de estantería.",
      isbn: "978-84-339-2469-4",
      precio: 22900,
      costo: 14900,
      stock: 3,
      minimo: 4,
      proveedor: "Distribuidora del Libro",
      imagen: "img/detectives-salvajes.jpg",
      status: "bajo",
      history: [{ when: "7 sep", text: "Quedan 3. Pedir a Anagrama." }]
    },
    {
      id: "lib-reino",
      codigo: "LIB-023",
      nombre: "El reino de este mundo",
      categoria: "ficcion",
      autor: "Alejo Carpentier",
      editorial: "Alianza",
      descripcion: "Haití a fines del siglo XVIII, contada desde Ti Noel: la revuelta, Mackandal y un mundo donde lo extraordinario entra en la historia. El libro breve con el que se suele presentar a Carpentier.",
      isbn: "978-84-206-3541-8",
      precio: 14200,
      costo: 9200,
      stock: 5,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/reino-de-este-mundo.jpg",
      status: "stock",
      history: [{ when: "28 ago", text: "Alianza en góndola" }]
    },
    {
      id: "lib-fervor",
      codigo: "LIB-024",
      nombre: "Fervor de Buenos Aires",
      categoria: "clasico",
      autor: "Jorge Luis Borges",
      editorial: "Emecé",
      descripcion: "El primer libro de poemas de Borges, de 1923: calles, patios y atardeceres de una ciudad que todavía se está haciendo. Tapa de la edición original, para quien busca el Borges de poesía.",
      isbn: "978-950-04-0102-7",
      precio: 13500,
      costo: 8800,
      stock: 4,
      minimo: 2,
      proveedor: "Distribuidora del Libro",
      imagen: "img/fervor-buenos-aires.jpg",
      status: "stock",
      history: [{ when: "4 sep", text: "Tapa 1923 en exhibición" }]
    },
    {
      id: "lib-venas",
      codigo: "LIB-025",
      nombre: "Las venas abiertas de América Latina",
      categoria: "ensayo",
      autor: "Eduardo Galeano",
      editorial: "Siglo XXI",
      descripcion: "El ensayo de Galeano sobre el oro, el azúcar y las empresas que se llevaron la riqueza del continente. Un clásico de mostrador, de esos que se piden por el título aunque no se recuerde el año.",
      isbn: "978-968-23-1557-1",
      precio: 17600,
      costo: 11400,
      stock: 9,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/venas-abiertas.jpg",
      status: "stock",
      history: [{ when: "6 sep", text: "Siglo XXI · ensayo" }]
    },
    {
      id: "lib-cronica",
      codigo: "LIB-026",
      nombre: "Crónica de una muerte anunciada",
      categoria: "ficcion",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      descripcion: "Todo el pueblo sabe que van a matar a Santiago Nasar, y nadie logra evitarlo. Una crónica breve, precisa y muy vendida, para quien quiere García Márquez en pocas páginas.",
      isbn: "978-950-07-0088-1",
      precio: 15100,
      costo: 9800,
      stock: 8,
      minimo: 3,
      proveedor: "Distribuidora del Libro",
      imagen: "img/cronica-muerte-anunciada.jpg",
      status: "stock",
      history: [{ when: "5 sep", text: "Llegó reposición" }]
    },
    {
      id: "uti-cuaderno",
      codigo: "UTI-015",
      nombre: "Cuaderno A4 rayado 84 hojas",
      categoria: "utiles",
      autor: "",
      editorial: "Rivadavia",
      isbn: "",
      precio: 3200,
      costo: 2100,
      stock: 45,
      minimo: 20,
      proveedor: "Papelera Central",
      imagen: "",
      status: "stock",
      history: [{ when: "1 sep", text: "Stock para temporada escolar" }]
    },
    {
      id: "pap-resma",
      codigo: "PAP-008",
      nombre: "Resma A4 80g 500 hojas",
      categoria: "papeleria",
      autor: "",
      editorial: "Ledesma",
      isbn: "",
      precio: 8200,
      costo: 5500,
      stock: 30,
      minimo: 15,
      proveedor: "Papelera Central",
      imagen: "",
      status: "stock",
      history: [{ when: "3 sep", text: "Stock actualizado" }]
    }
  ];
}

function load() {
  const seedItems = seed();
  const raw = localStorage.getItem(STORAGE_ITEMS);
  if (!raw) {
    localStorage.setItem(STORAGE_ITEMS, JSON.stringify(seedItems));
    return seedItems;
  }
  const items = JSON.parse(raw);
  const seedById = Object.fromEntries(seedItems.map((p) => [p.id, p]));
  const known = new Set(items.map((item) => item.id));
  items.forEach((item) => {
    const seeded = seedById[item.id];
    if (!seeded) return;
    if (!item.imagen && seeded.imagen) item.imagen = seeded.imagen;
    if (!item.descripcion && seeded.descripcion) item.descripcion = seeded.descripcion;
    if (!item.editorial && seeded.editorial) item.editorial = seeded.editorial;
  });
  const missing = seedItems.filter((item) => !known.has(item.id));
  if (missing.length) items.push(...missing);
  localStorage.setItem(STORAGE_ITEMS, JSON.stringify(items));
  return items;
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

function loadVentas() {
  const raw = localStorage.getItem(STORAGE_VENTAS);
  return raw ? JSON.parse(raw) : [];
}

function saveVentas(ventas) {
  localStorage.setItem(STORAGE_VENTAS, JSON.stringify(ventas));
}

function cartCount(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.cantidad || 1), 0);
}

function cartTotal(cart) {
  return (cart || loadCart()).reduce((sum, line) => sum + Number(line.precio || 0) * Number(line.cantidad || 1), 0);
}

function addToCart(productId) {
  const items = load();
  const product = items.find((p) => p.id === productId);
  if (!product || product.status === "pedido" || product.stock < 1) return { ok: false, reason: "sin-stock" };
  const cart = loadCart();
  const line = cart.find((c) => c.id === productId);
  const qty = line ? line.cantidad + 1 : 1;
  if (qty > product.stock) return { ok: false, reason: "sin-stock" };
  if (line) line.cantidad = qty;
  else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      autor: product.autor || "",
      precio: product.precio,
      imagen: product.imagen || "",
      cantidad: 1
    });
  }
  saveCart(cart);
  return { ok: true, cart };
}

function removeFromCart(productId) {
  const cart = loadCart().filter((c) => c.id !== productId);
  saveCart(cart);
  return cart;
}

function checkoutCart(cliente) {
  const cart = loadCart();
  if (!cart.length) return { ok: false, reason: "vacio" };
  const items = load();
  for (const line of cart) {
    const product = items.find((p) => p.id === line.id);
    const qty = Number(line.cantidad || 1);
    if (!product || product.status === "pedido" || product.stock < qty) {
      return { ok: false, reason: "sin-stock", nombre: line.nombre };
    }
  }
  const ventaItems = cart.map((line) => {
    const qty = Number(line.cantidad || 1);
    const product = items.find((p) => p.id === line.id);
    product.stock -= qty;
    product.status = stockStatus(product);
    product.history = [
      { when: "hoy", text: `Venta mostrador x${qty}. Total: ${money(product.precio * qty)}` },
      ...(product.history || [])
    ];
    return {
      productoId: product.id,
      nombre: product.nombre,
      autor: product.autor || "",
      imagen: product.imagen || "",
      precio: product.precio,
      cantidad: qty
    };
  });
  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    cliente: cliente || "Cliente mostrador",
    items: ventaItems,
    total: ventaItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    comprobante: "TK"
  };
  const ventas = [venta, ...loadVentas()];
  save(items);
  saveVentas(ventas);
  saveCart([]);
  return { ok: true, venta };
}

function registrarVentaPanel(itemId, cantidad, tipo) {
  const items = load();
  const item = items.find((i) => i.id === itemId);
  if (!item) return { ok: false, reason: "no-encontrado" };
  const qty = Number(cantidad || 1);
  const isPedido = item.status === "pedido";
  if (!isPedido && qty > item.stock) return { ok: false, reason: "sin-stock" };
  const cae = String(Math.floor(Math.random() * 99999999999999));
  const total = item.precio * qty;
  if (!isPedido) item.stock -= qty;
  item.status = stockStatus(item);
  item.history = [
    { when: "hoy", text: `Venta x${qty}. ${compLabel(tipo)}. CAE: ${cae}. Total: ${money(total)}` },
    ...(item.history || [])
  ];
  if (isPedido) {
    item.status = "agotado";
    item.pedidoEspecial = null;
  }
  const venta = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    cliente: "Mostrador / ARCA",
    items: [{
      productoId: item.id,
      nombre: item.nombre,
      autor: item.autor || "",
      imagen: item.imagen || "",
      precio: item.precio,
      cantidad: qty
    }],
    total,
    comprobante: tipo || "TK",
    cae
  };
  save(items);
  saveVentas([venta, ...loadVentas()]);
  return { ok: true, venta, item };
}

function label(status) {
  return STATUSES.find((s) => s.id === status)?.label || status;
}

function catLabel(cat) {
  return CATEGORIAS.find((c) => c.id === cat)?.label || cat;
}

function compLabel(comp) {
  return COMPROBANTES.find((c) => c.id === comp)?.label || comp;
}

function stockStatus(item) {
  if (item.status === "pedido") return "pedido";
  if (item.stock === 0) return "agotado";
  if (item.stock < item.minimo) return "bajo";
  return "stock";
}

function money(amount) {
  return "$ " + Number(amount || 0).toLocaleString("es-AR");
}

function formatFecha(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
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

function coverSrc(item) {
  return item?.imagen || "";
}
