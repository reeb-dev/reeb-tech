(function () {
  const asset = (value) => {
    const text = String(value || "");
    if (!text.startsWith("img/")) return text;
    return "/demos/inmobiliaria/" + text.replace(/\.jpg(?=$|[?#])/, ".webp");
  };

  const setLabels = (list, labels) => {
    list.forEach((item) => {
      if (labels[item.id]) item.label = labels[item.id];
    });
  };

  setLabels(STATUSES, {
    disponible: "Available",
    reservada: "Reserved",
    alquilada: "Rented",
    vendida: "Sold"
  });
  setLabels(TIPOS, {
    casa: "House",
    cabana: "Cabin",
    departamento: "Apartment",
    terreno: "Land",
    local: "Commercial space"
  });
  setLabels(OPERACIONES, {
    alquiler: "Long-term rent",
    venta: "For sale"
  });
  setLabels(COMPROBANTES, {
    FA: "Invoice A",
    FB: "Invoice B",
    RC: "Receipt"
  });
  setLabels(AMENITIES, {
    pileta: "Pool",
    parrilla: "Barbecue area",
    cochera: "Garage",
    balcon: "Balcony",
    terraza: "Terrace",
    jardin: "Garden",
    lena: "Wood-burning fireplace",
    quincho: "Covered barbecue area",
    baulera: "Storage room",
    seguridad: "Security",
    ascensor: "Elevator",
    amoblado: "Furnished",
    apto_credito: "Mortgage eligible",
    apto_profesional: "Professional use allowed",
    mascotas: "Pets allowed",
    pileta_climatizada: "Heated pool",
    spa: "Spa",
    gimnasio: "Gym",
    sum: "Community room",
    laundry: "Laundry",
    vista_lago: "Lake view",
    vista_cerro: "Mountain view",
    calefaccion_central: "Central heating",
    gas_natural: "Natural gas",
    agua_corriente: "Mains water",
    cloacas: "Sewer connection",
    fibra_optica: "Fiber internet",
    acceso_nieve: "Winter access"
  });
  setLabels(STAFF_ROLES, {
    titular: "Owner",
    agente: "Agent",
    comercial: "Sales",
    marketing: "Marketing",
    administracion: "Administration",
    agenda: "Scheduling"
  });
  setLabels(COLA_ESTADOS, {
    listo: "Ready",
    programado: "Scheduled",
    publicado: "Published"
  });

  Object.keys(FOTOS).forEach((key) => { FOTOS[key] = asset(FOTOS[key]); });
  ZONAS.forEach((zone) => {
    zone.foto = asset(zone.foto);
  });
  Object.assign(ZONAS[0], { texto: "Waterfront, Civic Center and lake access within walking distance." });
  Object.assign(ZONAS[1], { texto: "Wooded residential streets between downtown and the western shore." });
  Object.assign(ZONAS[2], { texto: "A western peninsula surrounded by lake and forest." });
  Object.assign(ZONAS[3], { texto: "Mountain, shoreline and forest along Bariloche’s western circuit." });
  Object.assign(ZONAS[4], { texto: "A quieter town on the eastern shore of the lake." });
  Object.assign(ZONAS[5], { texto: "Forest and streams along Circuito Chico." });
  Object.assign(ZONAS[6], { texto: "A valley town south of Bariloche, around two hours along Route 40." });

  const originalFotoPorTipo = fotoPorTipo;
  fotoPorTipo = function (type) {
    return asset(originalFotoPorTipo(type));
  };
  const originalZonaFotoDe = zonaFotoDe;
  zonaFotoDe = function (zone) {
    return asset(originalZonaFotoDe(zone));
  };

  function heatingFor(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("sin construir") || value === "—") return "Not built";
    const parts = [];
    if (text.includes("losa")) parts.push("radiant floor heating");
    if (text.includes("radiador")) parts.push("radiators");
    if (text.includes("hogar") || text.includes("salamandra")) parts.push("wood-burning fireplace");
    if (text.includes("gas")) parts.push("gas heating");
    return parts.length ? [...new Set(parts)].join(" and ") : "Heating details available";
  }

  function viewFor(property) {
    const text = String(property.vista || "").toLowerCase();
    if (text.includes("lago")) return "Nahuel Huapi Lake";
    if (text.includes("cerro") && text.includes("bosque")) return "Mountain and forest";
    if (text.includes("cerro")) return "Mountain view";
    if (text.includes("bosque") || text.includes("arbolado")) return "Forest and wooded surroundings";
    if (text.includes("valle")) return "Valley and mountain";
    if (text.includes("costanera")) return "Waterfront and lake";
    if (text.includes("calle")) return "Street view";
    return "Neighborhood surroundings";
  }

  function servicesFor(value) {
    const text = String(value || "").toLowerCase();
    const parts = [];
    if (text.includes("luz")) parts.push("electricity");
    if (text.includes("gas de red")) parts.push("natural gas");
    else if (text.includes("gas envasado")) parts.push("bottled gas");
    if (text.includes("agua")) parts.push("water");
    if (text.includes("cloaca")) parts.push("sewer connection");
    if (text.includes("expensas")) parts.push("building fees");
    return parts.length ? parts.map((part) => part[0].toUpperCase() + part.slice(1)).join(", ") : "Utilities to be confirmed";
  }

  const titleDetails = {
    p1: "Stone and timber home in Circuito Chico",
    p2: "Pine cabin for long-term rent in Melipal",
    p3: "Lake-view land in Llao Llao",
    p4: "Downtown apartment near the Civic Center",
    p5: "Timber home among the trees in Colonia Suiza",
    p6: "Pine cabin with fireplace in Dina Huapi",
    p7: "Lakefront stone home in Llao Llao",
    p8: "Downtown apartment with mountain views",
    p9: "Mountain home for long-term rent in El Bolsón",
    p10: "Commercial space on Mitre Street",
    p11: "Reserved cabin in Melipal",
    p12: "Mountain-view land in Circuito Chico",
    p13: "Low-profile stone home in Melipal",
    p14: "Two-bedroom downtown apartment",
    p15: "Pine cabin for long-term rent in Circuito Chico",
    p16: "Lake-view land in Dina Huapi",
    p17: "Stone and timber home in El Bolsón",
    p18: "Single-story home for long-term rent in Colonia Suiza",
    p19: "Gabled cabin in Llao Llao",
    p20: "Mountain home for long-term rent in Melipal"
  };

  function propertyDescription(property) {
    const type = tipoLabel(property.tipo);
    const offer = property.operacion === "venta" ? "for sale" : "for long-term rent";
    if (property.tipo === "terreno") {
      return `${type} ${offer} in ${property.barrio}, with approximately ${property.superficie} m² and ${viewFor(property).toLowerCase()}. The map shows the general area, not the exact lot.`;
    }
    if (property.tipo === "local") {
      return `${type} ${offer} in ${property.barrio}. It offers approximately ${property.cubierta || property.superficie} m², street access and services suitable for a local business or professional office.`;
    }
    const rooms = property.dormitorios
      ? `${property.dormitorios} bedroom${property.dormitorios === 1 ? "" : "s"}`
      : `${property.ambientes} rooms`;
    return `${type} ${offer} in ${property.barrio}, with ${rooms}, approximately ${property.cubierta || property.superficie} m² covered and ${viewFor(property).toLowerCase()}. Designed for residential use rather than a short hotel stay.`;
  }

  const originalSeed = seed;
  seed = function () {
    return originalSeed().map((property, index) => ({
      ...property,
      titulo: titleDetails[property.id] || `${tipoLabel(property.tipo)} in ${property.barrio} · ${property.codigo}`,
      orientacion: ({
        Norte: "North",
        Sur: "South",
        Este: "East",
        Oeste: "West",
        Noreste: "Northeast"
      })[property.orientacion] || property.orientacion,
      calefaccion: heatingFor(property.calefaccion),
      vista: viewFor(property),
      servicios: servicesFor(property.servicios),
      descripcion: propertyDescription(property),
      imagenes: (property.imagenes || []).map(asset),
      cliente: property.cliente ? { ...property.cliente, desde: "recently" } : property.cliente,
      visitas: (property.visitas || []).map((visit) => ({
        ...visit,
        fecha: "Recently",
        nota: "In-person visit recorded by the agency."
      })),
      history: [{ when: "Recently", text: index % 3 === 0 ? "Listing added to the portfolio." : "Listing information updated." }]
    }));
  };

  const originalDefaultVitrinaPage = defaultVitrinaPage;
  defaultVitrinaPage = function () {
    const page = originalDefaultVitrinaPage();
    page.copy = {
      marca: {
        nombre: "Nahuel Huapi Real Estate",
        tagline: "Homes in Bariloche"
      },
      hero: {
        kicker: "San Carlos de Bariloche · Nahuel Huapi Lake",
        title: "Stone and timber homes by the lake",
        lead: "Homes for sale or long-term rent in Bariloche and nearby areas."
      },
      zonas: {
        kicker: "The region",
        title: "Choose an area",
        lead: "Choose an area to filter properties. Map pins show the neighborhood, not the exact lot.",
        allBtn: "View all areas",
        mapaNote: "Choose a name to filter that area."
      },
      propiedades: { verMas: "View more" },
      lugares: {
        kicker: "Places",
        title: "Get to know the area",
        slides: [
          { title: "Civic Center", text: "The Civic Center opens onto Bariloche’s waterfront and lake. Downtown homes are close to Mitre Street and the shoreline.", cta: "View downtown properties" },
          { title: "Nahuel Huapi Lake", text: "The lake shapes the city’s landscape, with shoreline, mountains and snow-capped peaks. Check each listing for its actual view.", cta: "" },
          { title: "Circuito Chico", text: "A western route through shoreline, forest and mountains. Winter road access is an important detail for every home.", cta: "View Circuito Chico properties" },
          { title: "Llao Llao", text: "A western peninsula between lake and forest, known for homes with water or woodland views.", cta: "View Llao Llao properties" },
          { title: "Cerro Catedral", text: "Bariloche’s winter mountain southwest of downtown. Snow and access conditions are part of daily life nearby.", cta: "" },
          { title: "Colonia Suiza", text: "A wooded area west of the city, quieter than downtown during most of the year.", cta: "View Colonia Suiza properties" },
          { title: "Puerto Pañuelo", text: "A western bay near Llao Llao. Lake views are prominent, while winter access remains an important consideration.", cta: "View Llao Llao properties" },
          { title: "Dina Huapi", text: "A quieter town on the eastern shore, separate from downtown Bariloche.", cta: "View Dina Huapi properties" }
        ]
      },
      mudarse: {
        kicker: "Moving here",
        title: "What living here means",
        lead: "These listings are for permanent homes or second residences. They do not promise investment returns or short-term rental income.",
        cards: [
          { title: "The lake is close", text: "Downtown is within walking distance of the waterfront. In western areas, a lake view may be part of the property; each listing states what is actually visible." },
          { title: "Homes built for winter", text: "Snow and cold are normal. Fireplaces, radiators, radiant floors and covered parking matter during the colder months." },
          { title: "A different pace", text: "Melipal, Colonia Suiza and El Bolsón are quieter than Mitre Street in peak season. Downtown keeps shops and services close by." },
          { title: "Permanent or second home", text: "Most listings are intended for year-round living. A second-home option is stated clearly without promises of guaranteed returns." }
        ]
      },
      estudio: {
        kicker: "For the agency",
        title: "One listing, multiple destinations",
        lead: "The public catalog comes from this panel. Listings can be prepared for the agency website, property portals and social media. Real accounts, subscriptions and paid ads are contracted separately.",
        cta: "View distribution tools in the panel"
      },
      contacto: {
        title: "Ask about a property",
        lead: "Contact us on WhatsApp or leave an inquiry. This example does not submit information to a server."
      },
      pie: {
        line1: "Are you a real estate agent? The panel manages listings, statuses, visits and distribution without exposing operational data publicly.",
        line2: "Nahuel Huapi Real Estate · Bariloche · website example with fictional data. Sales use USD and long-term rent uses ARS."
      }
    };
    return page;
  };

  DESTINOS.forEach((destination) => {
    const isSocial = destination.grupo === "red";
    const isOwnSite = destination.id === "web";
    destination.beneficio = isOwnSite
      ? "The agency website receives listing information from this panel."
      : isSocial
        ? `${destination.nombre} can receive prepared content when a real account and supported integration are available.`
        : `${destination.nombre} may receive listings through an API, feed, approved CRM or manual upload, depending on the provider.`;
    destination.si = isOwnSite
      ? ["Publish and update properties on the public website.", "Keep the public catalog aligned with the portfolio.", "Store example inquiries and reactions in this browser."]
      : ["Prepare listing information for this destination.", "Use the provider’s supported API, feed or manual workflow.", "Respect account permissions and listing requirements."];
    destination.no = [
      "This example does not call an external API or publish content.",
      "A connected marker does not represent a real provider account.",
      "Provider approval, credentials and required fields still apply."
    ];
    destination.costos = isOwnSite
      ? ["A production website may require domain, hosting and maintenance.", "Publishing inside this example has no charge."]
      : ["Subscriptions, listing packages and paid ads are contracted separately.", "Current pricing must be confirmed with the provider."];
  });

  propertyWaUrl = function (property) {
    const text = `Hi, I would like to ask about ${property.codigo}: ${property.titulo}`;
    return "https://wa.me/" + DEMO_WA_PHONE + "?text=" + encodeURIComponent(text);
  };
  money = function (amount, usd) {
    const value = Number(amount || 0).toLocaleString("en-US");
    return usd ? "USD " + value : "ARS " + value;
  };
  ahoraDemo = function () {
    return new Date().toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const exact = new Map(Object.entries({
    "Menú": "Menu",
    "Cerrar": "Close",
    "← Volver al listado": "← Back to listings",
    "Zonas": "Areas",
    "Propiedades": "Properties",
    "Lugares": "Places",
    "Contacto": "Contact",
    "Para agentes": "For agents",
    "Venta": "For sale",
    "Alquiler permanente": "Long-term rent",
    "Destacado": "Featured",
    "Reservada": "Reserved",
    "Bajó de precio": "Price reduced",
    "Nueva publicación": "New listing",
    "Recién publicadas": "Recently listed",
    "Bajaron de precio": "Price reductions",
    "Ver detalle": "View details",
    "No encontramos propiedades": "No properties found",
    "Pruebe otra zona, tipo o rango de precio.": "Try another area, property type or price range.",
    "Cerca de": "Near",
    "Zona aproximada": "Approximate area",
    "El pin marca el barrio, no la parcela.": "The pin shows the neighborhood, not the exact lot.",
    "El pin marca la zona, no la parcela.": "The pin shows the area, not the exact lot.",
    "Dormitorios": "Bedrooms",
    "Baños": "Bathrooms",
    "Piso": "Floor",
    "Vista": "View",
    "Calefacción": "Heating",
    "Servicios": "Utilities",
    "Descripción": "Description",
    "Características": "Features",
    "Amenities y características": "Amenities and features",
    "Consulta": "Inquiry",
    "Consulta por WhatsApp": "WhatsApp inquiry",
    "Minimizar consulta": "Minimize inquiry",
    "Abrir consulta": "Open inquiry",
    "¿Quiere una página para su local?": "Would you like a website for your business?",
    "Escríbanos por WhatsApp. Es el camino más directo.": "Message us on WhatsApp for the quickest response.",
    "Escribir por WhatsApp": "Message on WhatsApp",
    "Ver precios": "View pricing",
    "¿Le interesa esta propiedad?": "Interested in this property?",
    "Escríbanos por WhatsApp. Es el camino más directo.": "Message us on WhatsApp for the quickest response.",
    "Escribir por WhatsApp": "Message on WhatsApp",
    "Volver al listado": "Back to listings",
    "Nombre": "Name",
    "Correo": "Email",
    "Teléfono": "Phone",
    "Mensaje": "Message",
    "Enviar mensaje": "Send message",
    "Enviar consulta": "Send inquiry",
    "Ingrese un correo válido.": "Enter a valid email address.",
    "El mensaje no puede estar vacío.": "The message cannot be empty.",
    "Consulta enviada (ejemplo)": "Inquiry sent (example)",
    "Propiedad no encontrada — Estudio Nahuel Huapi": "Property not found — Nahuel Huapi Real Estate",
    "No encontramos esa propiedad": "Property not found",
    "El enlace no coincide con ninguna ficha de la cartera.": "This link does not match a property in the portfolio.",
    "Resumen": "Dashboard",
    "Cartera": "Listings",
    "Página pública": "Public website",
    "Difusión": "Distribution",
    "Gestor de usuarios": "User manager",
    "Nueva propiedad": "New property",
    "Disponible": "Available",
    "Alquilada": "Rented",
    "Vendida": "Sold",
    "Editar": "Edit",
    "Ver ficha": "View listing",
    "Publicar": "Publish",
    "Ver página": "View website",
    "Guardar": "Save",
    "Cancelar": "Cancel",
    "Eliminar": "Delete",
    "Fotos": "Photos",
    "Portada": "Cover",
    "Quitar": "Remove",
    "Elegir fotos": "Choose photos",
    "Publicación": "Publishing",
    "Sitios y portales": "Websites and portals",
    "Redes sociales": "Social media",
    "Conectar": "Connect",
    "Desconectar": "Disconnect",
    "Conectado": "Connected",
    "Libre": "Not connected",
    "Qué sí": "What it can do",
    "Qué no": "What it cannot do",
    "Costos": "Costs",
    "Aviso": "Listing",
    "Destino": "Destination",
    "Estado": "Status",
    "Cuándo": "When",
    "Agregar": "Add",
    "Texto": "Text",
    "Copiar texto": "Copy text",
    "Texto copiado": "Text copied",
    "Buscar": "Search",
    "Precio": "Price",
    "Precios": "Prices",
    "Código": "Code",
    "Título": "Title",
    "Tipo": "Type",
    "Operación": "Listing type",
    "Ubicación": "Location",
    "Dirección": "Address",
    "Ambientes": "Rooms",
    "Expensas": "Building fees",
    "Historial": "History",
    "Sin movimientos todavía.": "No activity yet.",
    "Inicio del panel": "Panel overview",
    "en la cartera de este navegador": "stored in this browser",
    "listas para la página pública": "ready for the public website",
    "solo se ven en el panel": "visible only in the admin panel",
    "Visitas al anuncio": "Listing views",
    "Avisos en portales": "Listings on portals",
    "marcados en portales o redes de este ejemplo": "marked on sample portals or networks",
    "Cuentas conectadas": "Connected accounts",
    "Actividad reciente": "Recent activity",
    "Historial de fichas, visitas presenciales y cola de difusión. Todo es de ejemplo.": "Listing history, in-person visits and the distribution queue. All data is illustrative.",
    "sin fecha": "no date",
    "Todavía no hay movimientos en este ejemplo.": "There is no activity in this example yet.",
    "Atajos": "Shortcuts",
    "Entre a la sección que necesita. El menú de arriba sigue disponible.": "Open the section you need. The main navigation remains available.",
    "Alta en la cartera. Sale en la página pública de este navegador": "Add it to listings and publish it on this browser's public website",
    "Editar avisos y publicar destinos": "Edit listings and choose publishing destinations",
    "Localidades y zonas relacionadas de la comarca": "Cities and related areas in the region",
    "Textos y bloques de la web pública": "Public website copy and sections",
    "Conectar portales y armar la cola": "Connect portals and prepare the queue",
    "Más vistas en la web": "Most viewed online",
    "Aperturas de cada ficha en este navegador. No se muestran en la página pública.": "Property views recorded in this browser. They are visible only in the admin panel.",
    "Más interacciones": "Most interactions",
    "Consultas + favorito de este navegador + visitas presenciales. Sin números inventados.": "Inquiries, favorites stored in this browser and in-person visits. No invented figures.",
    "Destacadas en la página pública": "Featured on the public website",
    "Recientes": "Recent listings",
    "Sitio propio": "Agency website",
    "Sitio": "Website",
    "Ficha": "Profile",
    "Red": "Social network",
    "Portal": "Portal",
    "Listo": "Ready",
    "Programado": "Scheduled",
    "Publicado": "Published",
    "Titular": "Owner",
    "Agente": "Agent",
    "Comercial": "Sales",
    "Administración": "Administration",
    "Agenda": "Scheduling",
    "Activo": "Active",
    "Pausado": "Paused",
    "Salir": "Sign out"
  }));

  const replacements = [
    [/^Hola,\s*/i, "Hello, "],
    [/^Está adentro como ([^.]+)\. Estas cifras salen de la cartera, las visitas al aviso, las consultas y las cuentas de Difusión en este navegador\. No son métricas de un producto en internet\.$/i, "You are signed in as $1. These figures come from the listings, listing views, inquiries and distribution accounts stored in this browser. They are not live product metrics."],
    [/^de (\d+) destinos de este ejemplo$/i, "$1 sample destinations"],
    [/^(\d+) cuentas activas de (\d+)$/i, "$1 active accounts out of $2"],
    [/^(\d+) visitas web · (\d+) interacc\.$/i, "$1 website views · $2 interactions"],
    [/^(\d+) consultas · (\d+) les gusta · (\d+) presenciales$/i, "$1 inquiries · $2 favorites · $3 in-person visits"],
    [/\bpropiedades\b/gi, "properties"],
    [/\bpropiedad\b/gi, "property"],
    [/\bavisos\b/gi, "listings"],
    [/\baviso\b/gi, "listing"],
    [/\bpágina pública\b/gi, "public website"],
    [/\bZona\b/g, "Area"],
    [/\bzona\b/g, "area"],
    [/\bcerca de\b/gi, "near"],
    [/\busuario\b/gi, "user"],
    [/^Ir a /, "Go to "],
    [/\bcartera\b/gi, "portfolio"],
    [/\bvisitas web\b/gi, "website views"],
    [/\bvisitas presenciales\b/gi, "in-person visits"],
    [/\bconsultas\b/gi, "inquiries"],
    [/\binteracciones\b/gi, "interactions"],
    [/\bdisponibles\b/gi, "available"],
    [/\breservadas\b/gi, "reserved"],
    [/\balquiladas\b/gi, "rented"],
    [/\bvendidas\b/gi, "sold"],
    [/\bconectados\b/gi, "connected"],
    [/\bconectadas\b/gi, "connected"],
    [/\bno conectado\b/gi, "not connected"],
    [/\bsin conectar\b/gi, "not connected"],
    [/\bsin publicar\b/gi, "not published"],
    [/\bpublicado\b/gi, "published"],
    [/\bpublicar\b/gi, "publish"],
    [/\bguardar\b/gi, "save"],
    [/\bcargando\b/gi, "loading"],
    [/\bejemplo\b/gi, "example"],
    [/\bFotos\b/g, "Photos"],
    [/\bfotos\b/g, "photos"],
    [/\bdorm\.\b/g, "bed."],
    [/\bm² cub\.\b/g, "m² covered"]
  ];

  function translate(value) {
    const raw = String(value == null ? "" : value);
    const trimmed = raw.trim();
    if (!trimmed) return raw;
    const direct = exact.get(trimmed);
    if (direct) return raw.replace(trimmed, direct);
    let output = raw;
    replacements.forEach(([pattern, replacement]) => {
      output = output.replace(pattern, replacement);
    });
    return output;
  }

  function translateNode(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const parent = root.parentElement;
      if (!parent || parent.closest("script, style")) return;
      const next = translate(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    const element = root.nodeType === Node.ELEMENT_NODE ? root : null;
    if (element && !element.matches("script, style")) {
      if (element.id === "reeb-mark") {
        element.remove();
        return;
      }
      if (element.matches("#lugarDots button")) element.setAttribute("role", "tab");
      if (element.matches(".wa-hub-link")) element.setAttribute("href", "/en/#pricing");
      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const value = element.getAttribute(attribute);
        const next = translate(value);
        if (next !== value) element.setAttribute(attribute, next);
      });
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateNode(node);
    if (element) {
      element.querySelectorAll("[placeholder], [title], [aria-label]").forEach((child) => {
        ["placeholder", "title", "aria-label"].forEach((attribute) => {
          if (!child.hasAttribute(attribute)) return;
          const value = child.getAttribute(attribute);
          const next = translate(value);
          if (next !== value) child.setAttribute(attribute, next);
        });
      });
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") translateNode(mutation.target);
      mutation.addedNodes.forEach(translateNode);
    });
  });

  const start = () => {
    translateNode(document.body);
    document.querySelectorAll("#lugarDots button").forEach((button) => {
      button.setAttribute("role", "tab");
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
