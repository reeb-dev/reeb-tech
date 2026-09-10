export type Lang = 'es' | 'en';

export interface CompanyCopy {
  name: string;
  logo?: string;
  logoExtra?: string;
  logoWell?: 'neutral' | 'indra' | 'siskit';
  initials: string;
  role: string;
  years: string;
  description: string;
  current?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCopy {
  title: string;
  context: string;
  role: string;
  environment: string;
  challenge: string;
  solution: string;
  metrics: string;
  tech: string[];
  url?: string;
  links?: ProjectLink[];
}

export interface CertificateCopy {
  name: string;
  level: string;
  issued: string;
  summary: string;
  url: string;
  note?: string;
}

export interface ServiceCopy {
  title: string;
  problem: string;
  solution: string;
  icon: string;
  features: string[];
}

export interface DemoCopy {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  port: number;
  features: string[];
  hasArca?: boolean;
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    experience: string;
    stack: string;
    certificates: string;
    about: string;
    demos: string;
    services: string;
    themeLight: string;
    themeDark: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    body: string;
    ctaExperience: string;
    ctaContact: string;
  };
  companies: {
    title: string;
    subtitle: string;
    current: string;
    past: string;
    items: CompanyCopy[];
  };
  projects: {
    title: string;
    subtitle: string;
      challenge: string;
    solution: string;
    stack: string;
    items: ProjectCopy[];
  };
  stack: {
    title: string;
    subtitle: string;
    categories: { name: string; icon: string; technologies: string[] }[];
  };
  certificates: {
    title: string;
    subtitle: string;
    issuer: string;
    verify: string;
    items: CertificateCopy[];
  };
  about: {
    title: string;
    p1Before: string;
    p1Highlight: string;
    p2: string;
    p3: string;
    focusLabel: string;
    focusValue: string;
    todayLabel: string;
    todayValue: string;
  };
  demos: {
    title: string;
    subtitle: string;
    whyTitle: string;
    whyBody: string;
    provechoTitle: string;
    provechoBody: string;
    mobileTitle: string;
    mobileBody: string;
    viewDemo: string;
    openPanel: string;
    viewCatalog: string;
    hubUrl: string;
    demosBaseUrl: string;
    port: string;
    withArca: string;
    pricesHubCta: string;
    pricesHubHref: string;
    sistemasTitle: string;
    sistemasLead: string;
    sistemasTableTitle: string;
    sistemasTableLead: string;
    sistemasColCap: string;
    sistemasCols: string[];
    sistemasRows: { cap: string; cells: string[] }[];
    sistemasNote: string;
    sistemasTradesTitle: string;
    sistemasTradesLead: string;
    sistemasTrades: { name: string; blurb: string }[];
    sistemasHubCta: string;
    sistemasHubHref: string;
    items: DemoCopy[];
  };
  services: {
    title: string;
    subtitle: string;
    useCasesTitle: string;
    howTitle: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    items: ServiceCopy[];
    useCases: { problem: string; cta: string }[];
    advantages: { title: string; description: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    whatNeed: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    emailCta: string;
    whatsapp: string;
    whatsappCta: string;
    whatsappPhone: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    orDirect: string;
    viewDemos: string;
    requiredName: string;
    invalidEmail: string;
    requiredMessage: string;
    mailSubject: string;
    mailName: string;
    mailInterest: string;
    mailUnspecified: string;
    mailMessage: string;
    interests: { id: string; label: string }[];
  };
  footer: {
    nav: string;
    contact: string;
    follow: string;
    rights: string;
    built: string;
  };
}

const companiesMeta = {
  bp4: {
    name: 'BP4 · Fiserv',
    logo: '/bp4.png',
    logoExtra: '/fiserv.svg',
    initials: 'BP4',
    current: true as const,
  },
  indra: {
    name: 'Indra',
    logo: '/screenshot-2025-02-05-130401.png',
    initials: 'IN',
    logoWell: 'indra' as const,
  },
  siskit: { name: 'Siskit', logo: '/siskit.png', initials: 'SK', logoWell: 'siskit' as const },
};

export const translations: Record<Lang, Dictionary> = {
  es: {
    meta: {
      title: 'Manuel Reeb · Senior Software Engineer — Android · Angular · Java/Spring',
      description:
        'Senior Software Engineer en BP4. Android nativo (Kotlin/Java), Angular y Java/Spring Boot. Freelance acotado. Antes Indra y Siskit.',
    },
    nav: {
      experience: 'Experiencia',
      stack: 'Stack',
      certificates: 'Certificados',
      about: 'Sobre mí',
      demos: 'Ejemplos de sistemas',
      services: 'Servicios',
      themeLight: 'Cambiar a modo claro',
      themeDark: 'Cambiar a modo oscuro',
    },
    hero: {
      kicker: 'Manuel Reeb · Senior Software Engineer',
      title: 'Android, Angular y Java/Spring.',
      subtitle: 'Programo desde 2017. Hoy en BP4. Antes Indra y Siskit.',
      body: 'Android nativo (Kotlin/Java), Angular y Java/Spring. Código mantenible en producción. Freelance de alcance cerrado.',
      ctaExperience: 'Ver experiencia',
      ctaContact: 'Escribime',
    },
    companies: {
      title: 'Experiencia',
      subtitle: 'Siskit → Indra → BP4. El mismo hilo: Android, Angular y Java/Spring, en producción.',
      current: 'Actualidad',
      past: 'Experiencia',
      items: [
        {
          ...companiesMeta.bp4,
          role: 'Software Engineer',
          years: 'Ene 2026 – actualidad',
          description:
            'Apps a medida para clientes: Android nativo, Angular y backend Java. En Fiserv: mantenimiento de código legacy y pruebas SMTP por terminal en entornos de desarrollo y producción. Code review y entregas incrementales.',
        },
        {
          ...companiesMeta.indra,
          role: 'Ingeniero de software',
          years: 'Ene 2022 – oct 2025',
          description:
            'Evolución de sistemas en producción (web y móvil) para Banco Santander, Telefónica, UGG y GCBA. Android nativo (Java/Kotlin, MVVM/MVP), Angular/TypeScript y backend Java/Spring Boot, con pruebas y pases a entornos.',
        },
        {
          ...companiesMeta.siskit,
          role: 'Desarrollador web y móvil',
          years: 'Nov 2018 – ene 2022',
          description:
            'Sistemas web y móviles para clientes: Angular, Laravel/Node y Android nativo. APIs REST e integración con el frontend. Ciclo completo: análisis, implementación y soporte.',
        },
      ],
    },
    projects: {
      title: 'Qué hice, en concreto',
      subtitle: 'Lo mismo que en LinkedIn: roles reales, sin métricas inventadas.',
      challenge: 'El reto',
      solution: 'Lo que hice',
      stack: 'Stack:',
      items: [
        {
          title: 'Aplicaciones a medida — BP4',
          context:
            'Desarrollo y evolución de productos para clientes: Android nativo, Angular y APIs Java/Spring Boot, en equipo.',
          role: 'Software Engineer',
          environment: 'Consultora · clientes',
          challenge:
            'Cambios de alcance controlado sobre sistemas existentes, alineados con code review, Git y pases de entorno.',
          solution:
            'Features en Android, Angular y Spring Boot. Code review y entregas incrementales, con el mismo criterio que el resto del equipo.',
          metrics: 'Ene 2026 – actualidad',
          tech: ['Android', 'Kotlin', 'Java', 'Angular', 'Spring Boot'],
        },
        {
          title: 'Sistemas en producción — Indra',
          context:
            'Web y móvil ya en producción, para Banco Santander, Telefónica, UGG y GCBA. El trabajo era evolucionar código existente sin degradar lo que ya funcionaba.',
          role: 'Ingeniero de software',
          environment: 'Enterprise',
          challenge:
            'Cambios seguros sobre aplicaciones vivas: Android, Angular y APIs Java, con pruebas y pases a entornos.',
          solution:
            'Android nativo (Java/Kotlin, MVVM/MVP, Material) e integración REST. Angular/TypeScript y Spring Boot según el frente. JUnit/Mockito y Karma/Jasmine. Estimación, revisión y deploys con Docker.',
          metrics: 'Ene 2022 – oct 2025',
          tech: ['Java', 'Kotlin', 'Angular', 'Spring Boot', 'JUnit', 'Docker'],
        },
        {
          title: 'Web y móvil para clientes — Siskit',
          context:
            'Primer rol profesional. Sistemas empresariales combinando web y móvil, de análisis a soporte.',
          role: 'Desarrollador web y móvil',
          environment: 'Software house',
          challenge:
            'Entregar el ciclo completo con stacks distintos según el cliente, sin perder integración entre front y API.',
          solution:
            'Angular, Ionic, Laravel y Node en web. Android nativo (Java/Kotlin) y prototipos Flutter. APIs REST pegadas al frontend. MVVM/MVP para mantener el código ordenado.',
          metrics: 'Nov 2018 – ene 2022',
          tech: ['Angular', 'Laravel', 'Node.js', 'Android', 'Flutter'],
        },
        {
          title: 'daily-reflex-tap',
          context:
            'Juego casual de reflejos para Android. Proyecto propio, el mismo stack nativo que en el trabajo.',
          role: 'Proyecto propio',
          environment: 'Android',
          challenge: 'Una app nativa chica, jugable, sin inflar el alcance.',
          solution: 'Android nativo. El código está en GitHub.',
          metrics: 'GitHub',
          url: 'https://github.com/reeb-dev/daily-reflex-tap',
          links: [{ label: 'Código', href: 'https://github.com/reeb-dev/daily-reflex-tap' }],
          tech: ['Android', 'Kotlin'],
        },
        {
          title: 'cosmos-simulation',
          context: 'Demo web 3D: simulación interactiva de agujeros negros y el horizonte de sucesos.',
          role: 'Proyecto propio',
          environment: 'Web',
          challenge: 'Mostrar algo visual e interactivo, fuera del día a día enterprise.',
          solution: 'Simulación 3D en la web, desplegada en Vercel. La demo y el código son públicos.',
          metrics: 'Demo',
          url: 'https://cosmos-simulation.vercel.app',
          links: [
            { label: 'Demo', href: 'https://cosmos-simulation.vercel.app' },
            { label: 'Código', href: 'https://github.com/reeb-dev/cosmos-simulation' },
          ],
          tech: ['JavaScript', 'Three.js'],
        },
      ],
    },
    stack: {
      title: 'Stack tecnológico',
      subtitle: 'El mismo stack que en LinkedIn: Android primero, después web y API.',
      categories: [
        {
          name: 'Mobile',
          icon: '/tech/android.svg',
          technologies: ['Android nativo', 'Kotlin', 'Java', 'Jetpack Compose', 'MVVM / MVP', 'Material Design'],
        },
        {
          name: 'Frontend',
          icon: '/tech/angular.svg',
          technologies: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Tailwind CSS', 'Ionic'],
        },
        {
          name: 'Backend',
          icon: '/tech/springboot.svg',
          technologies: ['Java', 'Spring Boot', 'APIs REST', 'JWT', 'Node.js', 'Laravel', 'PostgreSQL', 'Oracle'],
        },
        {
          name: 'Calidad e infra',
          icon: '/tech/docker.svg',
          technologies: ['JUnit', 'Mockito', 'Karma / Jasmine', 'Git', 'Docker', 'CI/CD', 'Scrum'],
        },
      ],
    },
    certificates: {
      title: 'Certificados',
      subtitle:
        'Certificaciones oficiales de HackerRank, las mismas que figuran en LinkedIn. Cada enlace abre el certificado verificado.',
      issuer: 'HackerRank',
      verify: 'Ver certificado',
      items: [
        {
          name: 'Software Engineer Intern',
          level: 'Role',
          issued: 'May 2024',
          summary: 'Examen HackerRank. Cubre problem solving y SQL.',
          url: 'https://www.hackerrank.com/certificates/3e819e06a360',
          note: 'Certificación HackerRank (no es un rol laboral)',
        },
        {
          name: 'Angular (Intermediate)',
          level: 'Intermediate',
          issued: 'Dic 2023',
          summary: 'Routing, NgModules, Observables, inyección de dependencias y APIs.',
          url: 'https://www.hackerrank.com/certificates/02f1c21ba380',
        },
        {
          name: 'JavaScript (Intermediate)',
          level: 'Intermediate',
          issued: '',
          summary: 'Patrones de diseño, memoria, modelo de concurrencia y event loop.',
          url: 'https://www.hackerrank.com/certificates/48b6143dab24',
        },
        {
          name: 'Rest API (Intermediate)',
          level: 'Intermediate',
          issued: 'Mar 2023',
          summary: 'Obtener datos de una API y procesarlos con parámetros o paginado.',
          url: 'https://www.hackerrank.com/certificates/6e5f9b2226e7',
        },
      ],
    },
    about: {
      title: 'Sobre',
      p1Before: 'Desarrollo y mantengo software en producción. Trabajo sobre ',
      p1Highlight: 'Android nativo, Angular y Java/Spring Boot',
      p2: 'En Siskit desarrollé sistemas web y móviles para clientes, de análisis a soporte. En Indra (2022–2025) evolucioné aplicaciones web y móviles ya desplegadas, para Banco Santander, Telefónica, UGG y GCBA, con pruebas y pases a entornos. Desde enero de 2026 estoy en BP4, asignado a Fiserv: mantenimiento de código legacy, backend Java, pruebas SMTP y entregas con code review.',
      p3: 'mantiene el mismo criterio fuera de la consultora: un freelance a la vez, alcance cerrado y plan escrito.',
      focusLabel: 'Enfoque actual',
      focusValue: 'Android (Kotlin/Java) · Angular · Java/Spring Boot',
      todayLabel: 'Hoy',
      todayValue: 'Software Engineer en BP4. Fuera de la consultora, un freelance a la vez, con alcance cerrado y plan escrito.',
    },
    demos: {
      title: 'Sistemas a medida para oficios y comercios',
      subtitle: 'Desarrollo a medida: sitios y paneles para kiosco, inmobiliaria, turismo, construcción y otros rubros. Los ejemplos son para clientes, no un producto de suscripción. Si su negocio se parece, contacte para un sistema equivalente.',
      whyTitle: 'Por qué conviene tener una web',
      whyBody: 'Quien busca el oficio puede encontrarlo. La oferta queda a la vista a cualquier hora y las consultas llegan más claras. Usted administra catálogo, turnos o comprobantes en un panel, no en un Excel suelto.',
      provechoTitle: 'Provecho concreto',
      provechoBody: 'Menos respuestas repetidas, un enlace profesional en lugar de fotos por chat, un canal que no depende de una red social, y constancia de pedidos o consultas. El sitio puede crecer con turnos o avisos cuando lo necesite.',
      mobileTitle: 'También aplicaciones móviles',
      mobileBody: 'Android nativo (Kotlin/Java), el mismo frente que en LinkedIn. Una app del negocio — turnos, catálogo, avisos — como complemento del sitio, a medida. No es un producto de tienda ni un recuento de descargas.',
      viewDemo: 'Ver ejemplo',
      openPanel: 'Panel',
      viewCatalog: 'Ver el catálogo de ejemplos',
      hubUrl: '/',
      demosBaseUrl: '/demos/',
      port: 'Puerto',
      withArca: 'ARCA de ejemplo',
      pricesHubCta: 'Ver planes de referencia',
      pricesHubHref: '/#precios',
      sistemasTitle: 'Qué puede hacer una web, según su rubro',
      sistemasLead: 'Un kiosco de barrio, una inmobiliaria, un hospedaje en Sierra de la Ventana y un estudio jurídico no usan la misma web. Esta tabla no es una grilla de “todo incluido”: dice qué suele tener sentido en cada caso. Los ejemplos son de referencia. El trabajo es un desarrollo a medida, no un producto de suscripción.',
      sistemasTableTitle: 'Por función',
      sistemasTableLead: 'Cada fila es una capacidad real de un sitio o un panel. Las columnas son negocios distintos. “Si se cotiza” no significa que venga en el piso de los planes.',
      sistemasColCap: 'Función',
      sistemasCols: ['Kiosco / almacén', 'Inmobiliaria', 'Hospedaje', 'Estudio jurídico', 'Taller / salón'],
      sistemasRows: [
        {
          cap: 'Vitrina',
          cells: [
            'Qué vende, horario y cómo llegar.',
            'Propiedades en venta y alquiler.',
            'Cabañas, el predio y la zona (Villa Ventana, Sierra de la Ventana).',
            'El estudio y cómo consultarlo. Los expedientes no salen a la calle.',
            'El taller o el salón y qué servicios presta.',
          ],
        },
        {
          cap: 'WhatsApp y formulario',
          cells: [
            'Pedido o consulta al local.',
            'Consulta por una ficha.',
            'Consulta o pedido de fechas.',
            'Consulta al estudio.',
            'Pedir turno o presupuesto.',
          ],
        },
        {
          cap: 'Catálogo',
          cells: [
            'Góndola con fotos y precios en pesos.',
            'Fichas con fotos y filtros. No es una góndola de kiosco.',
            'Unidades con foto y tarifa por noche.',
            'No corresponde: no vende mercadería.',
            'Lista de servicios, no stock de alfajores.',
          ],
        },
        {
          cap: 'Turnos / reservas',
          cells: [
            'No es lo habitual.',
            'Visitas: las ve el panel, no el público.',
            'Reserva por fechas y cupos.',
            'No es una agenda de peluquería.',
            'Agenda de turnos u orden de trabajo.',
          ],
        },
        {
          cap: 'Stock',
          cells: [
            'Reposición de góndola y libreta de fiado.',
            'No es mercadería: es el listado de inmuebles.',
            'Disponibilidad de cabañas, no de góndola.',
            'No.',
            'Repuestos o productos del salón, si se usa.',
          ],
        },
        {
          cap: 'Panel',
          cells: [
            'Caja, stock y fiado. El cliente no entra.',
            'Visitas e interesados. El público no los ve.',
            'Reservas, huéspedes y check-in.',
            'Expedientes y plazos, fuera de la web abierta.',
            'Órdenes, agenda y cobro del día.',
          ],
        },
        {
          cap: 'Difusión',
          cells: [
            'Web, Instagram, Facebook o WhatsApp. Mercado Libre si vende en el portal.',
            'Web, Mercado Libre, Zonaprop, Argenprop y redes. Cada portal se contrata aparte.',
            'Web, Instagram, WhatsApp y Google. Booking u otros portales de estadía, aparte.',
            'Web y WhatsApp. Sin Mercado Libre ni portales de inmuebles.',
            'Web, Instagram, Google o WhatsApp. Sin Zonaprop.',
          ],
        },
        {
          cap: 'Cobros en línea',
          cells: [
            'Mostrador. Pasarela (Mercado Pago u otra) solo si se cotiza.',
            'No es un carrito. Seña o comisión se cotiza.',
            'Seña de la estadía, si se cotiza.',
            'Honorarios, no checkout de kiosco.',
            'Al cerrar el trabajo o el turno. Pasarela si se cotiza.',
          ],
        },
        {
          cap: 'Facturación ARCA',
          cells: [
            'Según monotributo o responsable inscripto. A menudo ticket de mostrador.',
            'Si factura comisión, según situación.',
            'Factura de hospedaje, si corresponde.',
            'Comprobante de honorarios, si corresponde.',
            'Si factura el trabajo, según situación.',
          ],
        },
        {
          cap: 'App Android',
          cells: [
            'Poco habitual.',
            'Si hace falta.',
            'Si hace falta (fechas en el teléfono).',
            'Poco habitual.',
            'Si hace falta (turnos).',
          ],
        },
      ],
      sistemasNote: 'Cobros en línea y ARCA se cotizan aparte; no están en el piso de Presencia ni de Negocio. En los ejemplos, un kiosco muestra precios en pesos; un 0km o una propiedad pueden ir en dólares, como en el mercado local. Los paneles piden un usuario de ejemplo (clave demo); no es un acceso real.',
      sistemasTradesTitle: 'Cada demo',
      sistemasTradesLead: 'Una o dos frases por rubro, más dónde se publica. No es un manual del panel.',
      sistemasTrades: [
        { name: 'Kiosco Lo de Pedro', blurb: 'Muestra el kiosco. En el panel usted controla góndola y fiado; el vecino no ve la libreta. Precios de ejemplo en pesos. Una carga: web, Instagram, Facebook o WhatsApp.' },
        { name: 'Almacén del Barrio', blurb: 'Pedidos a proveedores, góndola y cierre de caja. No es una inmobiliaria ni un hotel. Una carga: web, Mercado Libre o redes.' },
        { name: 'Libro (facturación)', blurb: 'Comprobantes A, B y notas de crédito. Pensado para quien ya factura; no reemplaza al contador. Una carga: web o WhatsApp. Sin Mercado Libre.' },
        { name: 'Inmobiliaria Reeb', blurb: 'Vitrina de propiedades, filtros y consulta. Las visitas y los interesados viven en el panel. Una carga: web, Mercado Libre, Zonaprop, Argenprop o redes. El aviso del portal se contrata aparte.' },
        { name: 'Taller mecánico', blurb: 'El cliente pide presupuesto. Usted sigue la orden: diagnóstico, repuestos y mano de obra. Una carga: web, Instagram, Google o WhatsApp.' },
        { name: 'Salón Camelia', blurb: 'Agenda de turnos y servicios. No es un catálogo de kiosco. Una carga: web, Instagram, Google o WhatsApp.' },
        { name: 'El Quebracho', blurb: 'Muebles a medida: presupuesto, seña y fecha de entrega. Una carga: web, Instagram o WhatsApp.' },
        { name: 'Librería Rivadavia', blurb: 'Catálogo de mostrador y pedidos especiales con seña, en pesos. Una carga: web, Mercado Libre o redes.' },
        { name: 'Biblioteca Pública Almagro', blurb: 'Préstamos a socios. No vende ni factura como un comercio. Una carga: web, Instagram o WhatsApp.' },
        { name: 'Parrilla Don Ernesto', blurb: 'Carta, mesas y comandas. La cocina y el cierre de cuenta están en el panel. Una carga: web, Instagram, Google o WhatsApp.' },
        { name: 'Rotisería', blurb: 'Producción del día, mostrador y delivery. No es una reserva de cabaña. Una carga: web, Instagram, Google o WhatsApp.' },
        { name: 'Feria', blurb: 'Publicaciones de varios vendedores. En la demo los pagos son de ejemplo; un cobro real se cotiza. Una carga: web, Mercado Libre o redes.' },
        { name: 'Stock y facturación', blurb: 'Inventario y facturación juntos. ARCA de ejemplo; en un trabajo real se cotiza según el caso. Una carga: web, Mercado Libre o WhatsApp.' },
        { name: 'Automotores Reeb', blurb: '0km y usados: en Argentina el precio de lista suele ir en dólares. Consulta y permuta de ejemplo. Una carga: web, Mercado Libre o redes.' },
        { name: 'Estudio Norte', blurb: 'El público ve el estudio. Expedientes y plazos no están en la web abierta. Una carga: web o WhatsApp. Sin portales de inmuebles.' },
        { name: 'Cabañas del Sauce', blurb: 'Cabañas en Villa Ventana: fechas y cupos. No es un almacén. Una carga: web, Instagram o WhatsApp. Booking u otros, aparte.' },
        { name: 'Senderos Tornquist', blurb: 'Excursiones con duración, dificultad y cupo por salida. Una carga: web, Instagram, Google o WhatsApp.' },
        { name: 'Complejo El Palomar', blurb: 'Paquetes, spa y actividades del predio. No es una góndola. Una carga: web, Instagram o WhatsApp. Portales de estadía, aparte.' },
        { name: 'Estudio Loma', blurb: 'Obras y consulta de presupuesto. El panel guarda proyectos, no la caja del kiosco. Una carga: web, Instagram o WhatsApp.' },
        { name: 'Corralón El Árido', blurb: 'Cemento, ladrillo, hierro: catálogo con stock y pedido a obra, en pesos. Una carga: web, Mercado Libre o WhatsApp.' },
        { name: 'Framehaus', blurb: 'Modelos de vivienda steel frame y consulta. Las obras en taller están en el panel. Una carga: web, Instagram o WhatsApp.' },
      ],
      sistemasHubCta: 'Ver la tabla en el catálogo',
      sistemasHubHref: '/#sistemas',
      items: [
        {
          id: 'estudio',
          name: 'Estudio Norte',
          description: 'Mesa de entradas: expedientes, plazos y escritos en la misma ficha.',
          category: 'Legal',
          icon: '⚖️',
          color: '#1b2a4a',
          port: 4203,
          features: ['Expedientes por fuero', 'Plazos y audiencias', 'Estados procesales', 'Historial de la mesa'],
          hasArca: false
        },
        {
          id: 'comercio',
          name: 'Almacén del Barrio',
          description: 'Pedidos a proveedores, control de góndola y cierre de caja del día.',
          category: 'Comercio',
          icon: '🏪',
          color: '#0891b2',
          port: 4204,
          features: ['Pedidos a proveedores', 'Control de góndola', 'Arqueo de caja', 'Tickets de turno'],
          hasArca: false
        },
        {
          id: 'facturacion',
          name: 'Libro',
          description: 'Comprobantes A, B y notas de crédito, con vencimientos y cobro.',
          category: 'Comercio',
          icon: '📒',
          color: '#4338ca',
          port: 4205,
          features: ['Facturas y notas de crédito', 'Estados de comprobante', 'Vencimientos', 'Totales por estado'],
          hasArca: false
        },
        {
          id: 'kiosco',
          name: 'Kiosco Lo de Pedro',
          description: 'Stock de góndola, alertas de reposición y libreta de fiado del barrio.',
          category: 'Comercio',
          icon: '🍬',
          color: '#1d6f42',
          port: 4206,
          features: ['Stock por categoría', 'Alertas de reposición', 'Libreta de fiado', 'Historial de movimientos'],
          hasArca: true
        },
        {
          id: 'inmobiliaria',
          name: 'Inmobiliaria Reeb',
          description: 'Venta y alquiler con fichas de propiedad, visitas y clientes interesados.',
          category: 'Inmuebles',
          icon: '🏠',
          color: '#1e3a5f',
          port: 4207,
          features: ['Propiedades con fotos', 'Clientes interesados', 'Registro de visitas', 'Estados de operación'],
          hasArca: true
        },
        {
          id: 'taller',
          name: 'Taller Mecánico',
          description: 'Órdenes de trabajo con diagnóstico, presupuesto, repuestos y mano de obra.',
          category: 'Automotriz',
          icon: '🔧',
          color: '#c41e3a',
          port: 4208,
          features: ['Órdenes de trabajo', 'Presupuestos con repuestos', 'Estados de reparación', 'Historial de vehículos'],
          hasArca: true
        },
        {
          id: 'peluqueria',
          name: 'Salón Camelia',
          description: 'Agenda de turnos, servicios, profesionales y cobro en el salón.',
          category: 'Servicios',
          icon: '✂️',
          color: '#be185d',
          port: 4209,
          features: ['Agenda de turnos', 'Catálogo de servicios', 'Asignación de profesional', 'Cobro con ticket'],
          hasArca: true
        },
        {
          id: 'carpinteria',
          name: 'El Quebracho',
          description: 'Muebles a medida: materiales, presupuesto, seña y fecha de entrega.',
          category: 'Servicios',
          icon: '🪵',
          color: '#78350f',
          port: 4210,
          features: ['Pedidos de muebles', 'Presupuestos con materiales', 'Seña y saldo', 'Estados de producción'],
          hasArca: true
        },
        {
          id: 'stockfacturacion',
          name: 'Stock y Facturación',
          description: 'Inventario con movimientos y facturación electrónica de ejemplo (ARCA).',
          category: 'Comercio',
          icon: '📦',
          color: '#0369a1',
          port: 4211,
          features: ['Inventario con movimientos', 'Alertas de stock', 'Facturas A/B/C', 'Notas de crédito'],
          hasArca: true
        },
        {
          id: 'libreria',
          name: 'Librería Rivadavia',
          description: 'Catálogo de mostrador, pedidos especiales con seña y control de stock.',
          category: 'Comercio',
          icon: '📚',
          color: '#166534',
          port: 4212,
          features: ['Catálogo con ISBN', 'Pedidos especiales', 'Control de stock', 'Ventas con ticket'],
          hasArca: true
        },
        {
          id: 'biblioteca',
          name: 'Biblioteca Pública Almagro',
          description: 'Préstamos a socios, devoluciones, renovaciones y control de multas.',
          category: 'Cultura',
          icon: '🏛️',
          color: '#1e3a8a',
          port: 4213,
          features: ['Catálogo con ubicación', 'Alta de socios', 'Préstamos y renovaciones', 'Control de multas'],
          hasArca: false
        },
        {
          id: 'restaurante',
          name: 'Parrilla Don Ernesto',
          description: 'Mesas, comandas, vista de cocina y cierre de cuenta con factura.',
          category: 'Gastronomía',
          icon: '🍽️',
          color: '#991b1b',
          port: 4214,
          features: ['Estado de mesas', 'Comandas por mesa', 'Vista de cocina', 'Cierre con ticket'],
          hasArca: true
        },
        {
          id: 'rotiseria',
          name: 'Rotisería',
          description: 'Producción del día, pedidos de mostrador y delivery con seguimiento.',
          category: 'Gastronomía',
          icon: '🍗',
          color: '#ea580c',
          port: 4215,
          features: ['Producción diaria', 'Pedidos mostrador/delivery', 'Stock de ingredientes', 'Ventas con ticket'],
          hasArca: true
        },
        {
          id: 'marketplace',
          name: 'Feria',
          description: 'Publicaciones, ventas, preguntas y envíos en un marketplace de ejemplo.',
          category: 'Comercio',
          icon: '🛒',
          color: '#2563eb',
          port: 4216,
          features: ['Publicaciones', 'Ventas y preguntas', 'Envíos de ejemplo', 'Pagos simulados'],
          hasArca: true
        },
        {
          id: 'automotores',
          name: 'Automotores Reeb',
          description: 'Stock de 0km y usados, con financiación y permuta de ejemplo.',
          category: 'Automotriz',
          icon: '🚗',
          color: '#0f172a',
          port: 4217,
          features: ['Catálogo 0km y usados', 'Financiación de ejemplo', 'Permuta', 'Ficha del vehículo'],
          hasArca: true
        },
        {
          id: 'hospedaje',
          name: 'Cabañas del Sauce',
          description: 'Hospedaje de ejemplo en Villa Ventana: cabañas, fechas y factura de hospedaje.',
          category: 'Turismo',
          icon: '🏔️',
          color: '#1a4a3c',
          port: 4218,
          features: ['Cabañas con foto y precio', 'Reserva por fechas', 'Check-in y check-out', 'Factura de hospedaje ARCA'],
          hasArca: true
        },
        {
          id: 'excursiones',
          name: 'Senderos Tornquist',
          description: 'Excursiones en Sierra de la Ventana: Cerro Ventana, Garganta del Diablo y Cueva del Toro.',
          category: 'Turismo',
          icon: '🥾',
          color: '#7a1f2b',
          port: 4219,
          features: ['Ficha con duración y cupo', 'Reserva de plaza', 'Salidas y guías', 'Cupos por salida'],
          hasArca: false
        },
        {
          id: 'complejo',
          name: 'Complejo El Palomar',
          description: 'Predio de ejemplo en Sierra de la Ventana: paquetes, spa, golf y actividades del día.',
          category: 'Turismo',
          icon: '⛳',
          color: '#0e7490',
          port: 4220,
          features: ['Paquetes de estadía y spa', 'Actividades del día', 'Huéspedes', 'Turnos de spa'],
          hasArca: true
        },
        {
          id: 'arquitectura',
          name: 'Estudio Loma',
          description: 'Casa, reforma o PH: proyectos, dirección de obra y consulta de presupuesto.',
          category: 'Construcción',
          icon: '📐',
          color: '#44403c',
          port: 4221,
          features: ['Proyectos de obra', 'Dirección de obra', 'Consulta de presupuesto', 'Ficha del cliente'],
          hasArca: false
        },
        {
          id: 'materiales',
          name: 'Corralón El Árido',
          description: 'Cemento, ladrillo, hierro y arena: catálogo con stock y pedido a obra.',
          category: 'Construcción',
          icon: '🧱',
          color: '#9a3412',
          port: 4222,
          features: ['Catálogo de materiales', 'Stock por rubro', 'Pedido a obra', 'Proveedores'],
          hasArca: true
        },
        {
          id: 'steelframe',
          name: 'Framehaus',
          description: 'Modelos de vivienda steel frame: casa, dúplex, PH y ampliación, con obras en taller.',
          category: 'Construcción',
          icon: '🏠',
          color: '#334155',
          port: 4223,
          features: ['Modelos de vivienda', 'Casa, dúplex y PH', 'Obras en taller', 'Ampliación'],
          hasArca: false
        }
      ]
    },
    services: {
      title: 'En qué puedo ayudarte',
      subtitle:
        'El mismo stack que en BP4 e Indra: Android nativo, Angular y Java/Spring. Un cliente freelance a la vez, alcance cerrado, plan escrito.',
      useCasesTitle: 'Si se parece a esto',
      howTitle: 'Cómo trabajo',
      ctaTitle: '¿Tenés un slice de Android, Angular o Spring?',
      ctaBody:
        'Trabajo en BP4. Para afuera tomo un solo freelance a la vez, con alcance cerrado y plan escrito antes de tocar el repo.',
      ctaButton: 'Escribime',
      items: [
        {
          title: 'Android nativo',
          problem: '¿Necesitás una app o un feature en Kotlin/Java, no un wrapper?',
          solution:
            'Android nativo con Material, MVVM/MVP e integración a APIs REST. El mismo frente que laburo en BP4 e Indra.',
          icon: '📱',
          features: [
            'Kotlin / Java, Material Design',
            'MVVM o MVP según el proyecto',
            'Integración con APIs REST',
            'Features acotados sobre una app existente',
          ],
        },
        {
          title: 'Angular + Java/Spring',
          problem: '¿El producto es un panel, una API, o las dos cosas?',
          solution:
            'Interfaces en Angular/TypeScript y backends Java/Spring Boot (REST, JWT). Código que otro del equipo puede seguir.',
          icon: '🧩',
          features: [
            'Angular y TypeScript',
            'APIs REST con Spring Boot',
            'Autenticación JWT cuando hace falta',
            'Pruebas: Karma/Jasmine y JUnit/Mockito',
          ],
        },
        {
          title: 'Sistemas en producción',
          problem: '¿Hay que tocar código que ya está vivo, sin una reescritura?',
          solution: 'Evolución segura: bugs, deuda y features sobre repos existentes. Plan escrito antes de codear.',
          icon: '🔧',
          features: [
            'Cambios seguros sobre código existente',
            'Code review y entregas incrementales',
            'Pases a entornos (Git, Docker)',
            'Documentación justa, no un wiki eterno',
          ],
        },
      ],
      useCases: [
        { problem: 'Una app Android nativa o un slice (login, pantallas, API)', cta: 'Hablemos' },
        { problem: 'Un panel Angular pegado a una API Java/Spring Boot', cta: 'Hablemos' },
        { problem: 'Un sistema en producción que hay que evolucionar sin romperlo', cta: 'Hablemos' },
        { problem: 'Refuerzo freelance temporal en Android, Angular o Spring', cta: 'Hablemos' },
      ],
      advantages: [
        {
          title: 'Comunicación directa',
          description: 'Hablo en humano. Te digo qué vamos a tocar, por qué, y qué queda afuera del alcance.',
        },
        {
          title: 'Cambios seguros',
          description:
            'Casi cuatro años en Indra evolucionando producción. El valor está en no romper lo que ya anda.',
        },
        {
          title: 'Código que se puede seguir',
          description: 'Lo que entrego queda en tu repo, con el criterio del equipo: revisiones, Git, entregas chicas.',
        },
      ],
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Un mail o un WhatsApp alcanzan. Contame el frente (Android, Angular o Spring) y el alcance.',
      whatNeed: '¿Qué necesitas?',
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      email: 'Email',
      emailPlaceholder: 'tu@email.com',
      emailCta: 'Escribir un mail',
      whatsapp: 'WhatsApp',
      whatsappCta: 'Escribir por WhatsApp',
      whatsappPhone: '+54 9 2915 75-7934',
      message: 'Mensaje',
      messagePlaceholder: 'Describe brevemente tu situación o necesidad técnica...',
      send: 'Enviar mail',
      orDirect: 'También por WhatsApp o correo',
      viewDemos: 'Ver ejemplos de sistemas',
      requiredName: 'El nombre es obligatorio.',
      invalidEmail: 'Indicá un email válido.',
      requiredMessage: 'El mensaje es obligatorio.',
      mailSubject: 'Consulta freelance desde REEB',
      mailName: 'Nombre',
      mailInterest: 'Interés',
      mailUnspecified: 'No especificado',
      mailMessage: 'Mensaje',
      interests: [
        { id: 'android', label: 'Android nativo (Kotlin / Java)' },
        { id: 'webapi', label: 'Angular + API Java/Spring Boot' },
        { id: 'prod', label: 'Evolucionar un sistema en producción' },
      ],
    },
    footer: {
      nav: 'Navegación',
      contact: 'Contacto',
      follow: 'Sígueme',
      rights: 'Todos los derechos reservados.',
      built: 'Construido con Angular y Tailwind CSS',
    },
  },
  en: {
    meta: {
      title: 'Manuel Reeb · Senior Software Engineer — Android · Angular · Java/Spring',
      description:
        'Senior Software Engineer at BP4. Native Android (Kotlin/Java), Angular, and Java/Spring Boot. Open for scoped freelance. Previously Indra and Siskit.',
    },
    nav: {
      experience: 'Experience',
      stack: 'Stack',
      certificates: 'Certificates',
      about: 'About',
      demos: 'System examples',
      services: 'Services',
      themeLight: 'Switch to light mode',
      themeDark: 'Switch to dark mode',
    },
    hero: {
      kicker: 'Manuel Reeb · Senior Software Engineer',
      title: 'Android, Angular, and Java/Spring.',
      subtitle: 'Coding since 2017. Currently at BP4. Previously Indra and Siskit.',
      body: 'Native Android (Kotlin/Java), Angular, and Java/Spring. Maintainable production code. Closed-scope freelance.',
      ctaExperience: 'View experience',
      ctaContact: 'Get in touch',
    },
    companies: {
      title: 'Experience',
      subtitle: 'Siskit → Indra → BP4. Same thread: Android, Angular, and Java/Spring, in production.',
      current: 'Current',
      past: 'Experience',
      items: [
        {
          ...companiesMeta.bp4,
          role: 'Software Engineer',
          years: 'Jan 2026 – present',
          description:
            'Custom client apps: native Android, Angular, and Java backends. At Fiserv: legacy code maintenance and SMTP tests from the terminal in development and production. Code review and incremental delivery.',
        },
        {
          ...companiesMeta.indra,
          role: 'Software Engineer',
          years: 'Jan 2022 – Oct 2025',
          description:
            'Evolved production systems (web and mobile) for Banco Santander, Telefónica, UGG, and GCBA. Native Android (Java/Kotlin, MVVM/MVP), Angular/TypeScript, and Java/Spring Boot backends, with tests and environment promotions.',
        },
        {
          ...companiesMeta.siskit,
          role: 'Web & mobile developer',
          years: 'Nov 2018 – Jan 2022',
          description:
            'Web and mobile systems for clients: Angular, Laravel/Node, and native Android. REST APIs integrated with the frontend. Full cycle: analysis, implementation, and support.',
        },
      ],
    },
    projects: {
      title: 'What I actually shipped',
      subtitle: 'Same as LinkedIn: real roles, no invented metrics.',
      challenge: 'The problem',
      solution: 'What I did',
      stack: 'Stack:',
      items: [
        {
          title: 'Custom apps — BP4',
          context:
            'Building and evolving client products: native Android, Angular, and Java/Spring Boot APIs, in a team.',
          role: 'Software Engineer',
          environment: 'Consultancy · clients',
          challenge:
            'Scoped changes on existing systems, aligned with code review, Git, and environment promotions.',
          solution:
            'Features in Android, Angular, and Spring Boot. Code review and incremental delivery, matching the rest of the team.',
          metrics: 'Jan 2026 – present',
          tech: ['Android', 'Kotlin', 'Java', 'Angular', 'Spring Boot'],
        },
        {
          title: 'Production systems — Indra',
          context:
            'Web and mobile already in production, for Banco Santander, Telefónica, UGG, and GCBA. The job was evolving existing code without degrading what already worked.',
          role: 'Software Engineer',
          environment: 'Enterprise',
          challenge:
            'Safe changes on live apps: Android, Angular, and Java APIs, with tests and environment promotions.',
          solution:
            'Native Android (Java/Kotlin, MVVM/MVP, Material) and REST integration. Angular/TypeScript and Spring Boot depending on the track. JUnit/Mockito and Karma/Jasmine. Estimation, review, and Docker deploys.',
          metrics: 'Jan 2022 – Oct 2025',
          tech: ['Java', 'Kotlin', 'Angular', 'Spring Boot', 'JUnit', 'Docker'],
        },
        {
          title: 'Web & mobile for clients — Siskit',
          context: 'First professional role. Business systems combining web and mobile, from analysis to support.',
          role: 'Web & mobile developer',
          environment: 'Software house',
          challenge:
            'Deliver the full cycle with different stacks per client, without losing frontend–API integration.',
          solution:
            'Angular, Ionic, Laravel, and Node on the web. Native Android (Java/Kotlin) and Flutter prototypes. REST APIs wired to the frontend. MVVM/MVP to keep the code ordered.',
          metrics: 'Nov 2018 – Jan 2022',
          tech: ['Angular', 'Laravel', 'Node.js', 'Android', 'Flutter'],
        },
        {
          title: 'daily-reflex-tap',
          context: 'Casual reflex game for Android. Side project, same native stack as at work.',
          role: 'Side project',
          environment: 'Android',
          challenge: 'A small, playable native app without inflating scope.',
          solution: 'Native Android. The code is on GitHub.',
          metrics: 'GitHub',
          url: 'https://github.com/reeb-dev/daily-reflex-tap',
          links: [{ label: 'Code', href: 'https://github.com/reeb-dev/daily-reflex-tap' }],
          tech: ['Android', 'Kotlin'],
        },
        {
          title: 'cosmos-simulation',
          context: '3D web demo: interactive black-hole simulation and event horizon.',
          role: 'Side project',
          environment: 'Web',
          challenge: 'Something visual and interactive, outside day-to-day enterprise work.',
          solution: '3D simulation on the web, deployed on Vercel. The demo and the code are public.',
          metrics: 'Demo',
          url: 'https://cosmos-simulation.vercel.app',
          links: [
            { label: 'Demo', href: 'https://cosmos-simulation.vercel.app' },
            { label: 'Code', href: 'https://github.com/reeb-dev/cosmos-simulation' },
          ],
          tech: ['JavaScript', 'Three.js'],
        },
      ],
    },
    stack: {
      title: 'Tech stack',
      subtitle: 'Same stack as on LinkedIn: Android first, then web and API.',
      categories: [
        {
          name: 'Mobile',
          icon: '/tech/android.svg',
          technologies: ['Native Android', 'Kotlin', 'Java', 'Jetpack Compose', 'MVVM / MVP', 'Material Design'],
        },
        {
          name: 'Frontend',
          icon: '/tech/angular.svg',
          technologies: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Tailwind CSS', 'Ionic'],
        },
        {
          name: 'Backend',
          icon: '/tech/springboot.svg',
          technologies: ['Java', 'Spring Boot', 'REST APIs', 'JWT', 'Node.js', 'Laravel', 'PostgreSQL', 'Oracle'],
        },
        {
          name: 'Quality & infra',
          icon: '/tech/docker.svg',
          technologies: ['JUnit', 'Mockito', 'Karma / Jasmine', 'Git', 'Docker', 'CI/CD', 'Scrum'],
        },
      ],
    },
    certificates: {
      title: 'Certificates',
      subtitle:
        'Official HackerRank certifications, the same ones listed on LinkedIn. Each link opens the verified certificate.',
      issuer: 'HackerRank',
      verify: 'View certificate',
      items: [
        {
          name: 'Software Engineer Intern',
          level: 'Role',
          issued: 'May 2024',
          summary: 'HackerRank exam covering problem solving and SQL.',
          url: 'https://www.hackerrank.com/certificates/3e819e06a360',
          note: 'HackerRank certification (not a job title)',
        },
        {
          name: 'Angular (Intermediate)',
          level: 'Intermediate',
          issued: 'Dec 2023',
          summary: 'Routing, NgModules, Observables, dependency injection, and APIs.',
          url: 'https://www.hackerrank.com/certificates/02f1c21ba380',
        },
        {
          name: 'JavaScript (Intermediate)',
          level: 'Intermediate',
          issued: '',
          summary: 'Design patterns, memory management, concurrency model, and the event loop.',
          url: 'https://www.hackerrank.com/certificates/48b6143dab24',
        },
        {
          name: 'Rest API (Intermediate)',
          level: 'Intermediate',
          issued: 'Mar 2023',
          summary: 'Fetching API data and processing it with parameters or paging.',
          url: 'https://www.hackerrank.com/certificates/6e5f9b2226e7',
        },
      ],
    },
    about: {
      title: 'About',
      p1Before: 'I build and maintain production software. I work on ',
      p1Highlight: 'native Android, Angular, and Java/Spring Boot',
      p2: 'At Siskit I built web and mobile systems for clients, from analysis through support. At Indra (2022–2025) I evolved live web and mobile apps for Banco Santander, Telefónica, UGG, and GCBA, with tests and environment promotions. Since January 2026 I have been at BP4, assigned to Fiserv: legacy maintenance, Java backends, SMTP tests, and delivery with code review.',
      p3: 'keeps the same standard outside consulting: one freelance engagement at a time, closed scope, written plan.',
      focusLabel: 'Focus',
      focusValue: 'Android (Kotlin/Java) · Angular · Java/Spring Boot',
      todayLabel: 'Now',
      todayValue: 'Software Engineer at BP4. Outside consulting, one freelance engagement at a time, closed scope, written plan.',
    },
    demos: {
      title: 'Custom systems for shops and trades',
      subtitle: 'Custom development: websites and admin panels for kiosks, real estate, tourism, construction, and other trades. The examples are for clients, not a subscription product. If your business looks similar, get in touch for an equivalent system.',
      whyTitle: 'Why a website is worth it',
      whyBody: 'People looking for your trade can find you. Your offer stays visible at any hour, and inquiries arrive clearer. You manage catalog, appointments, or receipts in one panel — not a loose spreadsheet.',
      provechoTitle: 'Concrete payoff',
      provechoBody: 'Fewer repeated answers, a professional link instead of photos in chat, a channel that does not depend on a social network, and a record of orders or inquiries. The site can later add appointments or notices when you need them.',
      mobileTitle: 'Mobile apps as well',
      mobileBody: 'Native Android (Kotlin/Java), the same track as on LinkedIn. A business app — appointments, catalog, notices — as a complement to the website, built to order. Not a store product and not a download count.',
      viewDemo: 'View example',
      openPanel: 'Panel',
      viewCatalog: 'View the examples catalog',
      hubUrl: '/',
      demosBaseUrl: '/demos/',
      port: 'Port',
      withArca: 'Sample ARCA billing',
      pricesHubCta: 'See reference plans',
      pricesHubHref: '/#precios',
      sistemasTitle: 'What a website can do, by trade',
      sistemasLead: 'A neighborhood kiosk, a real-estate office, lodging in Sierra de la Ventana, and a law firm do not use the same website. This table is not an “everything included” grid: it states what usually makes sense in each case. The examples are for reference. The work is custom development, not a subscription product.',
      sistemasTableTitle: 'By capability',
      sistemasTableLead: 'Each row is a real capability of a site or a panel. The columns are different kinds of business. “If quoted” does not mean it is in the floor price of the plans.',
      sistemasColCap: 'Capability',
      sistemasCols: ['Kiosk / grocer', 'Real estate', 'Lodging', 'Law firm', 'Workshop / salon'],
      sistemasRows: [
        {
          cap: 'Showcase',
          cells: [
            'What you sell, hours, and how to get there.',
            'Properties for sale and rent.',
            'Cabins, the grounds, and the area (Villa Ventana, Sierra de la Ventana).',
            'The firm and how to enquire. Case files do not go on the public site.',
            'The workshop or salon and the services you offer.',
          ],
        },
        {
          cap: 'WhatsApp and form',
          cells: [
            'An order or a question to the shop.',
            'An enquiry about a listing.',
            'An enquiry or a request for dates.',
            'An enquiry to the firm.',
            'Request an appointment or a quote.',
          ],
        },
        {
          cap: 'Catalog',
          cells: [
            'Shelf with photos and prices in Argentine pesos.',
            'Listings with photos and filters. Not a kiosk shelf.',
            'Units with a photo and a nightly rate.',
            'Does not apply: the firm does not sell goods.',
            'A list of services, not a shelf of candy.',
          ],
        },
        {
          cap: 'Appointments / bookings',
          cells: [
            'Not the usual need.',
            'Viewings: the panel sees them; the public does not.',
            'Booking by dates and capacity.',
            'Not a salon appointment book.',
            'Appointment book or a work order.',
          ],
        },
        {
          cap: 'Stock',
          cells: [
            'Shelf restock and the neighborhood credit book.',
            'Not merchandise: it is the property list.',
            'Cabin availability, not a grocery shelf.',
            'No.',
            'Parts or salon products, if you use them.',
          ],
        },
        {
          cap: 'Admin panel',
          cells: [
            'Cash, stock, and credit. The customer does not go in.',
            'Viewings and interested clients. The public does not see them.',
            'Bookings, guests, and check-in.',
            'Case files and deadlines, off the public site.',
            'Work orders, the schedule, and the day’s takings.',
          ],
        },
        {
          cap: 'Distribution',
          cells: [
            'Website, Instagram, Facebook, or WhatsApp. Mercado Libre if you sell on the portal.',
            'Website, Mercado Libre, Zonaprop, Argenprop, and social posts. Each portal is contracted separately.',
            'Website, Instagram, WhatsApp, and Google. Booking or other stay portals, separately.',
            'Website and WhatsApp. No Mercado Libre and no property portals.',
            'Website, Instagram, Google, or WhatsApp. No Zonaprop.',
          ],
        },
        {
          cap: 'Online collections',
          cells: [
            'Over the counter. A gateway (Mercado Pago or another) only if quoted.',
            'Not a shopping cart. A deposit or commission is quoted.',
            'A stay deposit, if quoted.',
            'Fees, not a kiosk checkout.',
            'When the job or the appointment closes. A gateway if quoted.',
          ],
        },
        {
          cap: 'ARCA invoicing',
          cells: [
            'Depends on simplified taxpayer or registered VAT payer status. Often a counter ticket.',
            'If you invoice a commission, according to the situation.',
            'A lodging invoice, if it applies.',
            'A fee receipt, if it applies.',
            'If you invoice the work, according to the situation.',
          ],
        },
        {
          cap: 'Android app',
          cells: [
            'Uncommon.',
            'If needed.',
            'If needed (dates on the phone).',
            'Uncommon.',
            'If needed (appointments).',
          ],
        },
      ],
      sistemasNote: 'Online collections and ARCA are quoted separately; they are not in the Presence or Business floor price. In the examples, a kiosk shows prices in pesos; a new car or a property may be listed in dollars, as in the local market. Panels ask for a sample user (password demo); it is not a real login.',
      sistemasTradesTitle: 'Each demo',
      sistemasTradesLead: 'One or two sentences per trade, plus where it is published. This is not a panel manual.',
      sistemasTrades: [
        { name: 'Kiosco Lo de Pedro', blurb: 'It shows the kiosk. In the panel you control the shelf and the credit book; the neighbor does not see that book. Sample prices in pesos. One load: website, Instagram, Facebook, or WhatsApp.' },
        { name: 'Almacén del Barrio', blurb: 'Supplier orders, the shelf, and end-of-day cash. It is not a real-estate office or a hotel. One load: website, Mercado Libre, or social posts.' },
        { name: 'Libro (invoicing)', blurb: 'A and B invoices and credit notes. For someone who already invoices; it does not replace an accountant. One load: website or WhatsApp. No Mercado Libre.' },
        { name: 'Inmobiliaria Reeb', blurb: 'A property showcase, filters, and an enquiry. Viewings and interested clients live in the panel. One load: website, Mercado Libre, Zonaprop, Argenprop, or social posts. The portal listing is contracted separately.' },
        { name: 'Taller mecánico', blurb: 'The customer asks for a quote. You follow the work order: diagnosis, parts, and labor. One load: website, Instagram, Google, or WhatsApp.' },
        { name: 'Salón Camelia', blurb: 'An appointment book and services. Not a kiosk catalog. One load: website, Instagram, Google, or WhatsApp.' },
        { name: 'El Quebracho', blurb: 'Custom furniture: quote, deposit, and delivery date. One load: website, Instagram, or WhatsApp.' },
        { name: 'Librería Rivadavia', blurb: 'A counter catalog and special orders with a deposit, in pesos. One load: website, Mercado Libre, or social posts.' },
        { name: 'Biblioteca Pública Almagro', blurb: 'Loans to members. It does not sell or invoice like a shop. One load: website, Instagram, or WhatsApp.' },
        { name: 'Parrilla Don Ernesto', blurb: 'Menu, tables, and kitchen tickets. The kitchen view and checkout live in the panel. One load: website, Instagram, Google, or WhatsApp.' },
        { name: 'Rotisería', blurb: 'The day’s production, the counter, and delivery. Not a cabin booking. One load: website, Instagram, Google, or WhatsApp.' },
        { name: 'Feria', blurb: 'Listings from several sellers. Payments in the demo are samples; live charging is quoted. One load: website, Mercado Libre, or social posts.' },
        { name: 'Stock y facturación', blurb: 'Inventory and invoicing together. Sample ARCA; real work is quoted for the case. One load: website, Mercado Libre, or WhatsApp.' },
        { name: 'Automotores Reeb', blurb: 'New and used cars: in Argentina the list price is often in dollars. Sample enquiry and trade-in. One load: website, Mercado Libre, or social posts.' },
        { name: 'Estudio Norte', blurb: 'The public sees the firm. Case files and deadlines are not on the open website. One load: website or WhatsApp. No property portals.' },
        { name: 'Cabañas del Sauce', blurb: 'Cabins in Villa Ventana: dates and capacity. Not a grocery store. One load: website, Instagram, or WhatsApp. Booking or others, separately.' },
        { name: 'Senderos Tornquist', blurb: 'Tours with duration, difficulty, and quota per departure. One load: website, Instagram, Google, or WhatsApp.' },
        { name: 'Complejo El Palomar', blurb: 'Packages, spa, and grounds activities. Not a shop shelf. One load: website, Instagram, or WhatsApp. Stay portals, separately.' },
        { name: 'Estudio Loma', blurb: 'Works and a quote enquiry. The panel holds projects, not a kiosk till. One load: website, Instagram, or WhatsApp.' },
        { name: 'Corralón El Árido', blurb: 'Cement, brick, steel: a catalog with stock and a site order, in pesos. One load: website, Mercado Libre, or WhatsApp.' },
        { name: 'Framehaus', blurb: 'Steel-frame housing models and an enquiry. Workshop jobs live in the panel. One load: website, Instagram, or WhatsApp.' },
      ],
      sistemasHubCta: 'See the table in the catalog',
      sistemasHubHref: '/#sistemas',
      items: [
        {
          id: 'estudio',
          name: 'Estudio Norte',
          description: 'Law-firm intake desk: case files, deadlines, and briefs on the same record.',
          category: 'Legal',
          icon: '⚖️',
          color: '#1b2a4a',
          port: 4203,
          features: ['Files by jurisdiction', 'Deadlines and hearings', 'Procedural statuses', 'Desk history'],
          hasArca: false
        },
        {
          id: 'comercio',
          name: 'Almacén del Barrio',
          description: 'Supplier orders, shelf control, and end-of-day cash closing.',
          category: 'Retail',
          icon: '🏪',
          color: '#0891b2',
          port: 4204,
          features: ['Supplier orders', 'Shelf control', 'Cash reconciliation', 'Shift tickets'],
          hasArca: false
        },
        {
          id: 'facturacion',
          name: 'Libro',
          description: 'A, B, and credit-note receipts, with due dates and collections.',
          category: 'Retail',
          icon: '📒',
          color: '#4338ca',
          port: 4205,
          features: ['Invoices and credit notes', 'Receipt statuses', 'Due dates', 'Totals by status'],
          hasArca: false
        },
        {
          id: 'kiosco',
          name: 'Kiosco Lo de Pedro',
          description: 'Shelf stock, restock alerts, and the neighborhood credit book.',
          category: 'Retail',
          icon: '🍬',
          color: '#1d6f42',
          port: 4206,
          features: ['Stock by category', 'Restock alerts', 'Credit book', 'Movement history'],
          hasArca: true
        },
        {
          id: 'inmobiliaria',
          name: 'Inmobiliaria Reeb',
          description: 'Sales and rentals with property files, visits, and interested clients.',
          category: 'Real estate',
          icon: '🏠',
          color: '#1e3a5f',
          port: 4207,
          features: ['Properties with photos', 'Interested clients', 'Visit records', 'Operation statuses'],
          hasArca: true
        },
        {
          id: 'taller',
          name: 'Taller Mecánico',
          description: 'Work orders with diagnosis, quote, parts, and labor.',
          category: 'Automotive',
          icon: '🔧',
          color: '#c41e3a',
          port: 4208,
          features: ['Work orders', 'Quotes with parts', 'Repair statuses', 'Vehicle history'],
          hasArca: true
        },
        {
          id: 'peluqueria',
          name: 'Salón Camelia',
          description: 'Appointment book, services, staff, and salon checkout.',
          category: 'Services',
          icon: '✂️',
          color: '#be185d',
          port: 4209,
          features: ['Appointment schedule', 'Service catalog', 'Professional assignment', 'Ticket checkout'],
          hasArca: true
        },
        {
          id: 'carpinteria',
          name: 'El Quebracho',
          description: 'Custom furniture: materials, quote, deposit, and delivery date.',
          category: 'Services',
          icon: '🪵',
          color: '#78350f',
          port: 4210,
          features: ['Furniture orders', 'Quotes with materials', 'Deposit and balance', 'Production statuses'],
          hasArca: true
        },
        {
          id: 'stockfacturacion',
          name: 'Stock y Facturación',
          description: 'Inventory movements and sample electronic billing (ARCA).',
          category: 'Retail',
          icon: '📦',
          color: '#0369a1',
          port: 4211,
          features: ['Inventory with movements', 'Stock alerts', 'Invoices A/B/C', 'Credit notes'],
          hasArca: true
        },
        {
          id: 'libreria',
          name: 'Librería Rivadavia',
          description: 'Counter catalog, special orders with a deposit, and stock control.',
          category: 'Retail',
          icon: '📚',
          color: '#166534',
          port: 4212,
          features: ['Catalog with ISBN', 'Special orders', 'Stock control', 'Sales with ticket'],
          hasArca: true
        },
        {
          id: 'biblioteca',
          name: 'Biblioteca Pública Almagro',
          description: 'Member loans, returns, renewals, and fine tracking.',
          category: 'Culture',
          icon: '🏛️',
          color: '#1e3a8a',
          port: 4213,
          features: ['Catalog with location', 'Member registration', 'Loans and renewals', 'Fine control'],
          hasArca: false
        },
        {
          id: 'restaurante',
          name: 'Parrilla Don Ernesto',
          description: 'Tables, orders, kitchen view, and checkout with an invoice.',
          category: 'Food service',
          icon: '🍽️',
          color: '#991b1b',
          port: 4214,
          features: ['Table status', 'Orders by table', 'Kitchen view', 'Ticket checkout'],
          hasArca: true
        },
        {
          id: 'rotiseria',
          name: 'Rotisería',
          description: 'Daily production, counter orders, and delivery tracking.',
          category: 'Food service',
          icon: '🍗',
          color: '#ea580c',
          port: 4215,
          features: ['Daily production', 'Counter/delivery orders', 'Ingredient stock', 'Sales with ticket'],
          hasArca: true
        },
        {
          id: 'marketplace',
          name: 'Feria',
          description: 'Listings, sales, questions, and shipping in a sample marketplace.',
          category: 'Retail',
          icon: '🛒',
          color: '#2563eb',
          port: 4216,
          features: ['Listings', 'Sales and questions', 'Sample shipping', 'Simulated payments'],
          hasArca: true
        },
        {
          id: 'automotores',
          name: 'Automotores Reeb',
          description: 'New and used stock, with sample financing and trade-in.',
          category: 'Automotive',
          icon: '🚗',
          color: '#0f172a',
          port: 4217,
          features: ['New and used catalog', 'Sample financing', 'Trade-in', 'Vehicle file'],
          hasArca: true
        },
        {
          id: 'hospedaje',
          name: 'Cabañas del Sauce',
          description: 'Sample lodging in Villa Ventana: cabins, dates, and a lodging invoice.',
          category: 'Tourism',
          icon: '🏔️',
          color: '#1a4a3c',
          port: 4218,
          features: ['Cabins with photo and price', 'Date booking', 'Check-in and check-out', 'ARCA lodging invoice'],
          hasArca: true
        },
        {
          id: 'excursiones',
          name: 'Senderos Tornquist',
          description: 'Tours in Sierra de la Ventana: Cerro Ventana, Garganta del Diablo, and Cueva del Toro.',
          category: 'Tourism',
          icon: '🥾',
          color: '#7a1f2b',
          port: 4219,
          features: ['Duration and quota on each tour', 'Seat booking', 'Departures and guides', 'Quota per departure'],
          hasArca: false
        },
        {
          id: 'complejo',
          name: 'Complejo El Palomar',
          description: 'Sample resort in Sierra de la Ventana: packages, spa, golf, and the day’s activities.',
          category: 'Tourism',
          icon: '⛳',
          color: '#0e7490',
          port: 4220,
          features: ['Stay and spa packages', 'Day activities', 'Guests', 'Spa slots'],
          hasArca: true
        },
        {
          id: 'arquitectura',
          name: 'Estudio Loma',
          description: 'House, renovation, or PH: projects, site direction, and a quote request.',
          category: 'Construction',
          icon: '📐',
          color: '#44403c',
          port: 4221,
          features: ['Building projects', 'Site direction', 'Quote request', 'Client file'],
          hasArca: false
        },
        {
          id: 'materiales',
          name: 'Corralón El Árido',
          description: 'Cement, brick, steel, and sand: catalog with stock and job-site orders.',
          category: 'Construction',
          icon: '🧱',
          color: '#9a3412',
          port: 4222,
          features: ['Materials catalog', 'Stock by type', 'Job-site orders', 'Suppliers'],
          hasArca: true
        },
        {
          id: 'steelframe',
          name: 'Framehaus',
          description: 'Steel-frame home models: house, duplex, PH, and extension, with shop-floor builds.',
          category: 'Construction',
          icon: '🏠',
          color: '#334155',
          port: 4223,
          features: ['Home models', 'House, duplex, and PH', 'Shop-floor builds', 'Extensions'],
          hasArca: false
        }
      ]
    },
    services: {
      title: 'How I can help',
      subtitle:
        'The same stack I use at BP4 and Indra: native Android, Angular, and Java/Spring. One freelance client at a time, closed scope, written plan.',
      useCasesTitle: 'If this sounds like you',
      howTitle: 'How I work',
      ctaTitle: 'Need a scoped Android, Angular, or Spring slice?',
      ctaBody:
        'I work at BP4. Outside of that I take one freelance engagement at a time, closed scope, written plan before I touch the repo.',
      ctaButton: 'Email me',
      items: [
        {
          title: 'Native Android',
          problem: 'Need an app or a feature in Kotlin/Java — not a wrapper?',
          solution:
            'Native Android with Material, MVVM/MVP, and REST APIs. The same track I work on at BP4 and Indra.',
          icon: '📱',
          features: [
            'Kotlin / Java, Material Design',
            'MVVM or MVP depending on the project',
            'REST API integration',
            'Scoped features on an existing app',
          ],
        },
        {
          title: 'Angular + Java/Spring',
          problem: 'Is the product a dashboard, an API, or both?',
          solution:
            'Angular/TypeScript UIs and Java/Spring Boot backends (REST, JWT). Code another teammate can pick up.',
          icon: '🧩',
          features: [
            'Angular and TypeScript',
            'REST APIs with Spring Boot',
            'JWT auth when you actually need it',
            'Tests: Karma/Jasmine and JUnit/Mockito',
          ],
        },
        {
          title: 'Production systems',
          problem: 'Need to change live code without a rewrite?',
          solution: 'Safe evolution: bugs, debt, and features on existing repos. Written plan before coding.',
          icon: '🔧',
          features: [
            'Safe changes on existing code',
            'Code review and incremental delivery',
            'Environment promotions (Git, Docker)',
            'Just enough docs — not an endless wiki',
          ],
        },
      ],
      useCases: [
        { problem: 'A native Android app or a slice (login, screens, API)', cta: "Let's talk" },
        { problem: 'An Angular dashboard wired to a Java/Spring Boot API', cta: "Let's talk" },
        { problem: 'A production system that needs to evolve without breaking', cta: "Let's talk" },
        { problem: 'Short freelance help on Android, Angular, or Spring', cta: "Let's talk" },
      ],
      advantages: [
        {
          title: 'Direct communication',
          description: 'I talk like a person. I tell you what we will touch, why, and what is out of scope.',
        },
        {
          title: 'Safe changes',
          description: 'Almost four years at Indra evolving production. The value is not breaking what already works.',
        },
        {
          title: 'Code someone else can follow',
          description: 'What I ship stays in your repo, with team habits: reviews, Git, small deliveries.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: 'An email or a WhatsApp message is enough. Tell me the track (Android, Angular, or Spring) and the scope.',
      whatNeed: 'What do you need?',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      emailCta: 'Write an email',
      whatsapp: 'WhatsApp',
      whatsappCta: 'Write on WhatsApp',
      whatsappPhone: '+54 9 2915 75-7934',
      message: 'Message',
      messagePlaceholder: 'Short note on the situation or the technical need...',
      send: 'Send email',
      orDirect: 'Also on WhatsApp or email',
      viewDemos: 'See system examples',
      requiredName: 'Name is required.',
      invalidEmail: 'Enter a valid email.',
      requiredMessage: 'Message is required.',
      mailSubject: 'Freelance inquiry from REEB',
      mailName: 'Name',
      mailInterest: 'Interest',
      mailUnspecified: 'Not specified',
      mailMessage: 'Message',
      interests: [
        { id: 'android', label: 'Native Android (Kotlin / Java)' },
        { id: 'webapi', label: 'Angular + Java/Spring Boot API' },
        { id: 'prod', label: 'Evolve a production system' },
      ],
    },
    footer: {
      nav: 'Navigation',
      contact: 'Contact',
      follow: 'Follow',
      rights: 'All rights reserved.',
      built: 'Built with Angular and Tailwind CSS',
    },
  },
};
