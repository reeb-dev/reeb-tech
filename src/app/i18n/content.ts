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

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    experience: string;
    stack: string;
    certificates: string;
    about: string;
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
    message: string;
    messagePlaceholder: string;
    send: string;
    orDirect: string;
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
    logo: 'bp4.png',
    logoExtra: 'fiserv.svg',
    initials: 'BP4',
    current: true as const,
  },
  indra: {
    name: 'Indra',
    logo: 'screenshot-2025-02-05-130401.png',
    initials: 'IN',
    logoWell: 'indra' as const,
  },
  siskit: { name: 'Siskit', logo: 'siskit.png', initials: 'SK', logoWell: 'siskit' as const },
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
          solution: 'Android nativo. Publicada como proyecto en LinkedIn y el código en GitHub.',
          metrics: 'GitHub',
          url: 'https://github.com/reeb-dev/daily-reflex-tap',
          tech: ['Android', 'Kotlin'],
        },
        {
          title: 'cosmos-simulation',
          context: 'Demo web 3D: simulación interactiva de agujeros negros y el horizonte de sucesos.',
          role: 'Proyecto propio',
          environment: 'Web',
          challenge: 'Mostrar algo visual e interactivo, fuera del día a día enterprise.',
          solution: 'Simulación 3D en la web, desplegada en Vercel.',
          metrics: 'Demo',
          url: 'https://cosmos-simulation.vercel.app',
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
          icon: 'tech/android.svg',
          technologies: ['Android nativo', 'Kotlin', 'Java', 'Jetpack Compose', 'MVVM / MVP', 'Material Design'],
        },
        {
          name: 'Frontend',
          icon: 'tech/angular.svg',
          technologies: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Tailwind CSS', 'Ionic'],
        },
        {
          name: 'Backend',
          icon: 'tech/springboot.svg',
          technologies: ['Java', 'Spring Boot', 'APIs REST', 'JWT', 'Node.js', 'Laravel', 'PostgreSQL', 'Oracle'],
        },
        {
          name: 'Calidad e infra',
          icon: 'tech/docker.svg',
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
      subtitle: 'Un mail alcanza. Contame el frente (Android, Angular o Spring) y el alcance.',
      whatNeed: '¿Qué necesitas?',
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      email: 'Email',
      message: 'Mensaje',
      messagePlaceholder: 'Describe brevemente tu situación o necesidad técnica...',
      send: 'Enviar mail',
      orDirect: 'O contactá directo:',
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
          solution: 'Native Android. Listed as a project on LinkedIn; code on GitHub.',
          metrics: 'GitHub',
          url: 'https://github.com/reeb-dev/daily-reflex-tap',
          tech: ['Android', 'Kotlin'],
        },
        {
          title: 'cosmos-simulation',
          context: '3D web demo: interactive black-hole simulation and event horizon.',
          role: 'Side project',
          environment: 'Web',
          challenge: 'Something visual and interactive, outside day-to-day enterprise work.',
          solution: '3D simulation on the web, deployed on Vercel.',
          metrics: 'Demo',
          url: 'https://cosmos-simulation.vercel.app',
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
          icon: 'tech/android.svg',
          technologies: ['Native Android', 'Kotlin', 'Java', 'Jetpack Compose', 'MVVM / MVP', 'Material Design'],
        },
        {
          name: 'Frontend',
          icon: 'tech/angular.svg',
          technologies: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'Tailwind CSS', 'Ionic'],
        },
        {
          name: 'Backend',
          icon: 'tech/springboot.svg',
          technologies: ['Java', 'Spring Boot', 'REST APIs', 'JWT', 'Node.js', 'Laravel', 'PostgreSQL', 'Oracle'],
        },
        {
          name: 'Quality & infra',
          icon: 'tech/docker.svg',
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
      subtitle: 'An email is enough. Tell me the track (Android, Angular, or Spring) and the scope.',
      whatNeed: 'What do you need?',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      message: 'Message',
      messagePlaceholder: 'Short note on the situation or the technical need...',
      send: 'Send email',
      orDirect: 'Or reach me directly:',
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
