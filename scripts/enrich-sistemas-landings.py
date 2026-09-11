#!/usr/bin/env python3
"""Enrich new sistemas landings with galleries + richer copy (local images only)."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
HUB = DEMOS / "hub-img"
CSS_V = "c7"

# slug -> (short, span, h1, lead, facts[(k,v)], steps[(t,p)], features[(t,p)], gallery_caps, image_sources)
# image_sources: list of (src_rel_to_demos, dest_name) — first dest hero.jpg preferred
SYSTEMS = {
    "ordenes": {
        "short": "Órdenes",
        "span": "Ingreso · diagnóstico · estados",
        "h1": "Cada trabajo entra como una orden, con estado claro.",
        "lead": "Para talleres y oficios: ingreso, diagnóstico, avance y aviso al cliente. No es la página del taller: es el panel de órdenes.",
        "facts": [("CRUD", "alta, edición y baja"), ("Estados", "ingreso → entregado"), ("WhatsApp", "aviso listo")],
        "steps": [
            ("Ingreso", "Carga el equipo, el cliente y el trabajo pedido."),
            ("Avance", "Pasa de ingreso a en curso, listo y entregado."),
            ("Aviso", "Copia un texto para WhatsApp cuando está listo."),
        ],
        "features": [
            ("Órdenes del día", "Lista con filtro, edición y baja."),
            ("Clientes", "Ficha rápida ligada a cada OT."),
            ("Estados", "Ingreso, en curso, listo, entregado."),
        ],
        "caps": ["Taller", "Oficio", "Reparación", "Detalle"],
        "imgs": [
            ("hub-img/taller.jpg", "hero.jpg"),
            ("carpinteria/img/hero-taller.jpg", "galeria-1.jpg"),
            ("carpinteria/img/restauracion.jpg", "galeria-2.jpg"),
            ("automotores/img/ford-focus.jpg", "galeria-3.jpg"),
        ],
    },
    "stockalertas": {
        "short": "Stock",
        "span": "Mínimos · movimientos · alertas",
        "h1": "El depósito avisa antes de que falte mercadería.",
        "lead": "Para depósitos y góndola: stock mínimo, movimientos y alertas de reposición. Distinto del ejemplo de facturación completa.",
        "facts": [("Alertas", "bajo mínimo"), ("Movimientos", "entrada y salida"), ("CRUD", "ítems editables")],
        "steps": [
            ("Carga", "Define producto, stock y mínimo."),
            ("Movimiento", "Registra entradas y salidas."),
            ("Alerta", "Ve qué hay que reponer hoy."),
        ],
        "features": [
            ("Lista de stock", "Alta, edición y baja de ítems."),
            ("Mínimos", "Marca lo que está por debajo."),
            ("Movimientos", "Historial simple del día."),
        ],
        "caps": ["Depósito", "Góndola", "Cajas", "Estantería"],
        "imgs": [
            ("stockfacturacion/img/hero-deposito.jpg", "hero.jpg"),
            ("stockfacturacion/img/gondola.jpg", "galeria-1.jpg"),
            ("stockfacturacion/img/estanteria.jpg", "galeria-2.jpg"),
            ("stockfacturacion/img/cajas.jpg", "galeria-3.jpg"),
        ],
    },
    "visitas": {
        "short": "Visitas",
        "span": "Campo · técnico · check-in",
        "h1": "La ruta del técnico, sin mezclar con la agenda del salón.",
        "lead": "Para servicios a domicilio: visitas del día, técnico asignado y check-in. Distinto de la agenda de turnos en local.",
        "facts": [("Ruta", "visitas del día"), ("Técnico", "asignación"), ("Check-in", "llegada al lugar")],
        "steps": [
            ("Agenda", "Carga la visita con cliente y dirección."),
            ("Asigna", "Elige técnico y franja."),
            ("Check-in", "Marca llegada y cierre."),
        ],
        "features": [
            ("Visitas", "CRUD con estados del recorrido."),
            ("Técnicos", "Equipo de campo."),
            ("WhatsApp", "Aviso de llegada o demora."),
        ],
        "caps": ["Campo", "Instalación", "Servicio", "Herramientas"],
        "imgs": [
            ("hub-img/taller.jpg", "hero.jpg"),
            ("carpinteria/img/deck.jpg", "galeria-1.jpg"),
            ("steelframe/img/hero.jpg" if (DEMOS / "steelframe/img/hero.jpg").exists() else "hub-img/steelframe.jpg", "galeria-2.jpg"),
            ("arquitectura/img/galeria-obra.jpg", "galeria-3.jpg"),
        ],
    },
    "takeaway": {
        "short": "Takeaway",
        "span": "Cola · listo · entregado",
        "h1": "Pedidos para llevar, en cola y a tiempo.",
        "lead": "Para mostrador y retiro: pedidos en cola, listos y entregados. No es comanda de mesa ni la carta pública de la rotisería.",
        "facts": [("Cola", "pedidos del día"), ("Estados", "recibido → entregado"), ("Mostrador", "ritmo rápido")],
        "steps": [
            ("Pedido", "Entra el pedido con ítems y cliente."),
            ("Cocina", "Pasa a en preparación y listo."),
            ("Entrega", "Marca entregado al retirarlo."),
        ],
        "features": [
            ("Cola del día", "Prioridad y estados."),
            ("Ítems", "Detalle de cada pedido."),
            ("WhatsApp", "Aviso “ya puede retirar”."),
        ],
        "caps": ["Mostrador", "Preparación", "Retiro", "Pedido"],
        "imgs": [
            ("hub-img/rotiseria.jpg", "hero.jpg"),
            ("hub-img/restaurante.jpg", "galeria-1.jpg"),
            ("hub-img/kiosco.jpg", "galeria-2.jpg"),
            ("marketplace/img/caja.jpg", "galeria-3.jpg"),
        ],
    },
    "cuotas": {
        "short": "Cuotas",
        "span": "Plan · vencimientos · mora",
        "h1": "La venta en cuotas, con vencimientos a la vista.",
        "lead": "Para ventas financiadas: plan, cuotas y recordatorio. Distinto de la cuenta corriente abierta (fiado).",
        "facts": [("Plan", "cuotas claras"), ("Vencimientos", "del mes"), ("CRUD", "clientes y planes")],
        "steps": [
            ("Alta", "Carga cliente, monto y cantidad de cuotas."),
            ("Cobro", "Marca cada cuota pagada."),
            ("Aviso", "Recuerda vencimientos por WhatsApp."),
        ],
        "features": [
            ("Planes", "Alta, edición y baja."),
            ("Calendario", "Próximos vencimientos."),
            ("Mora", "Cuotas atrasadas visibles."),
        ],
        "caps": ["Comercio", "Cobro", "Plan", "Mostrador"],
        "imgs": [
            ("hub-img/comercio.jpg", "hero.jpg"),
            ("hub-img/facturacion.jpg", "galeria-1.jpg"),
            ("stockfacturacion/img/monitor.jpg", "galeria-2.jpg"),
            ("marketplace/img/caja.jpg", "galeria-3.jpg"),
        ],
    },
    "obra": {
        "short": "Obra",
        "span": "Etapas · avance · extras",
        "h1": "El presupuesto de obra con avance real.",
        "lead": "Para reformas y construcción: etapas, porcentaje de avance y extras. Más que una cotización simple de un oficio.",
        "facts": [("Etapas", "por fase"), ("Avance", "% visible"), ("Extras", "cambios de obra")],
        "steps": [
            ("Presupuesto", "Define etapas y montos."),
            ("Obra", "Actualiza el avance de cada etapa."),
            ("Extras", "Suma adicionales y avisa al cliente."),
        ],
        "features": [
            ("Obras", "CRUD con etapas."),
            ("Avance", "Porcentaje por fase."),
            ("WhatsApp", "Informe de avance."),
        ],
        "caps": ["Obra", "Reforma", "Planos", "Obra viva"],
        "imgs": [
            ("hub-img/arquitectura.jpg", "hero.jpg"),
            ("arquitectura/img/galeria-obra.jpg", "galeria-1.jpg"),
            ("arquitectura/img/cocina-reforma.jpg", "galeria-2.jpg"),
            ("arquitectura/img/galeria-planos.jpg", "galeria-3.jpg"),
        ],
    },
    "fichas": {
        "short": "Fichas",
        "span": "Historial · próximo control",
        "h1": "La ficha del paciente o la mascota, con historial.",
        "lead": "Para consultorio o veterinaria: ficha, historial y próximo control. La agenda de turnos es otro sistema; acá queda lo clínico de ejemplo.",
        "facts": [("Ficha", "datos clave"), ("Historial", "visitas previas"), ("Control", "próxima fecha")],
        "steps": [
            ("Alta", "Crea la ficha del paciente o mascota."),
            ("Atención", "Registra lo hecho en la visita."),
            ("Seguimiento", "Agenda el próximo control."),
        ],
        "features": [
            ("Fichas", "CRUD con búsqueda."),
            ("Historial", "Notas por fecha."),
            ("Turnos", "Se combina con la agenda si hace falta."),
        ],
        "caps": ["Salón", "Equipo", "Atención", "Detalle"],
        "imgs": [
            ("peluqueria/img/hero-salon.jpg", "hero.jpg"),
            ("peluqueria/img/equipo.jpg", "galeria-1.jpg"),
            ("peluqueria/img/lucia.jpg", "galeria-2.jpg"),
            ("peluqueria/img/diego.jpg", "galeria-3.jpg"),
        ],
    },
    "flota": {
        "short": "Flota",
        "span": "Service · vencimientos · km",
        "h1": "Los vehículos del local, con service al día.",
        "lead": "Para flota propia: service, vencimientos y kilometraje. No es el stock de una automotora a la venta.",
        "facts": [("Flota", "unidades propias"), ("Service", "próximos"), ("Vencimientos", "patente y más")],
        "steps": [
            ("Alta", "Carga patente, modelo y km."),
            ("Service", "Registra el último y el próximo."),
            ("Alerta", "Ve vencimientos del mes."),
        ],
        "features": [
            ("Vehículos", "CRUD de la flota."),
            ("Service", "Historial simple."),
            ("Alertas", "Vencimientos a la vista."),
        ],
        "caps": ["Flota", "Utilitario", "Service", "Ruta"],
        "imgs": [
            ("hub-img/automotores.jpg", "hero.jpg"),
            ("automotores/img/chevrolet-s10.jpg", "galeria-1.jpg"),
            ("automotores/img/ford-ranger.jpg" if (DEMOS / "automotores/img/ford-ranger.jpg").exists() else "automotores/img/chevrolet-tracker.jpg", "galeria-2.jpg"),
            ("automotores/img/fiat-cronos.jpg", "galeria-3.jpg"),
        ],
    },
    "eventos": {
        "short": "Eventos",
        "span": "Fecha · menú · seña · checklist",
        "h1": "El salón de eventos, con seña y checklist.",
        "lead": "Para salones de fiestas: fecha, menú, seña y checklist. Distinto de reservas de hospedaje o cabañas.",
        "facts": [("Fecha", "reserva del salón"), ("Seña", "estado de pago"), ("Checklist", "día del evento")],
        "steps": [
            ("Reserva", "Carga fecha, tipo de evento y menú."),
            ("Seña", "Marca seña y saldo."),
            ("Día", "Sigue el checklist del servicio."),
        ],
        "features": [
            ("Eventos", "CRUD con estados."),
            ("Seña", "Control de cobro."),
            ("Checklist", "Preparación del día."),
        ],
        "caps": ["Salón", "Paisaje", "Servicio", "Espacio"],
        "imgs": [
            ("hub-img/complejo.jpg", "hero.jpg"),
            ("complejo/img/pileta.jpg", "galeria-1.jpg"),
            ("complejo/img/hab.jpg", "galeria-2.jpg"),
            ("complejo/img/cabanas.jpg", "galeria-3.jpg"),
        ],
    },
    "abonos": {
        "short": "Abonos",
        "span": "Mensual · altas · mora",
        "h1": "El abono mensual, con altas y mora a la vista.",
        "lead": "Para gimnasios, clubs o mantenimientos: abono, altas y mora. No es el plan de cuotas de una sola venta.",
        "facts": [("Abono", "mensual"), ("Socios", "altas y bajas"), ("Mora", "impagos")],
        "steps": [
            ("Alta", "Carga el abonado y el plan."),
            ("Cobro", "Marca el mes pagado."),
            ("Mora", "Ve quién debe este mes."),
        ],
        "features": [
            ("Abonados", "CRUD completo."),
            ("Planes", "Mensual o trimestral de ejemplo."),
            ("WhatsApp", "Recordatorio de pago."),
        ],
        "caps": ["Local", "Atención", "Equipo", "Servicio"],
        "imgs": [
            ("peluqueria/img/hero-salon.jpg", "hero.jpg"),
            ("peluqueria/img/brushing.jpg", "galeria-1.jpg"),
            ("peluqueria/img/manicura.jpg", "galeria-2.jpg"),
            ("hub-img/peluqueria.jpg", "galeria-3.jpg"),
        ],
    },
    "mayorista": {
        "short": "Mayorista",
        "span": "Lista · mínimo · despacho",
        "h1": "Pedidos B2B con lista de precio y mínimo.",
        "lead": "Para venta mayorista: lista de precio, pedido mínimo y despacho. Distinto del mostrador minorista del almacén.",
        "facts": [("B2B", "clientes mayoristas"), ("Mínimo", "por pedido"), ("Despacho", "estados")],
        "steps": [
            ("Lista", "El cliente pide sobre su lista de precio."),
            ("Pedido", "Valida mínimo y arma el despacho."),
            ("Entrega", "Marca enviado o entregado."),
        ],
        "features": [
            ("Pedidos", "CRUD con estados."),
            ("Clientes B2B", "Condiciones por cuenta."),
            ("Despacho", "Seguimiento simple."),
        ],
        "caps": ["Depósito", "Cajas", "Lista", "Despacho"],
        "imgs": [
            ("hub-img/comercio.jpg", "hero.jpg"),
            ("stockfacturacion/img/cajas.jpg", "galeria-1.jpg"),
            ("stockfacturacion/img/gondola.jpg", "galeria-2.jpg"),
            ("marketplace/img/caja.jpg", "galeria-3.jpg"),
        ],
    },
    "reparto": {
        "short": "Reparto",
        "span": "Zona · chofer · entrega",
        "h1": "Las entregas a domicilio, con zona y chofer.",
        "lead": "Para flota de entrega: zona, chofer y estados. Complementa takeaway cuando el local lleva a domicilio.",
        "facts": [("Zonas", "reparto"), ("Chofer", "asignado"), ("Estados", "en camino → entregado")],
        "steps": [
            ("Pedido", "Carga dirección y zona."),
            ("Asigna", "Elige chofer y salida."),
            ("Entrega", "Marca entregado o demorado."),
        ],
        "features": [
            ("Rutas", "CRUD de entregas del día."),
            ("Choferes", "Equipo de reparto."),
            ("WhatsApp", "Aviso “va en camino”."),
        ],
        "caps": ["Ruta", "Utilitario", "Entrega", "Ciudad"],
        "imgs": [
            ("hub-img/marketplace.jpg", "hero.jpg"),
            ("automotores/img/chevrolet-s10.jpg", "galeria-1.jpg"),
            ("automotores/img/chevrolet-tracker.jpg", "galeria-2.jpg"),
            ("hub-img/automotores.jpg", "galeria-3.jpg"),
        ],
    },
    "contratos": {
        "short": "Contratos",
        "span": "Vencimientos · renovación",
        "h1": "Contratos y alquileres, con vencimientos claros.",
        "lead": "Para alquileres o servicios: contratos, vencimientos y renovación. No es la vitrina pública inmobiliaria.",
        "facts": [("Contratos", "vigentes"), ("Vencimientos", "del mes"), ("Renovación", "aviso previo")],
        "steps": [
            ("Alta", "Carga partes, fechas y monto."),
            ("Seguimiento", "Ve próximos vencimientos."),
            ("Renovación", "Marca renovado o finalizado."),
        ],
        "features": [
            ("Cartera", "CRUD de contratos."),
            ("Alertas", "Vencen este mes."),
            ("WhatsApp", "Aviso de renovación."),
        ],
        "caps": ["Inmueble", "Interior", "Entorno", "Propiedad"],
        "imgs": [
            ("hub-img/inmobiliaria.jpg", "hero.jpg"),
            ("inmobiliaria/img/casa-lago.jpg", "galeria-1.jpg"),
            ("inmobiliaria/img/casa-interior.jpg", "galeria-2.jpg"),
            ("inmobiliaria/img/cabana-bosque.jpg", "galeria-3.jpg"),
        ],
    },
}


def resolve(src: str) -> Path:
    p = DEMOS / src
    if p.exists():
        return p
    # hub fallback
    name = Path(src).name
    alt = HUB / name
    if alt.exists():
        return alt
    any_jpg = next(HUB.glob("*.jpg"))
    return any_jpg


def copy_images(slug: str, spec: dict) -> list[tuple[str, str]]:
    img_dir = DEMOS / slug / "img"
    img_dir.mkdir(parents=True, exist_ok=True)
    (img_dir / "index.html").write_text("<!doctype html><title></title>\n", encoding="utf-8")
    used = []
    for src, dest in spec["imgs"]:
        shutil.copy2(resolve(src), img_dir / dest)
        used.append((dest, spec["caps"][len(used)] if len(used) < len(spec["caps"]) else "Detalle"))
    return used


def index_html(slug: str, spec: dict, gallery: list[tuple[str, str]]) -> str:
    facts = "".join(
        f"<li><strong>{k}</strong> {v}</li>" for k, v in spec["facts"]
    )
    steps = "".join(
        f'<article class="step"><strong>{t}</strong><p>{p}</p></article>'
        for t, p in spec["steps"]
    )
    feats = "".join(
        f'<article class="feature"><strong>{t}</strong><p>{p}</p></article>'
        for t, p in spec["features"]
    )
    figs = "".join(
        f'<figure><img src="img/{fn}" alt="{cap}"><figcaption>{cap}</figcaption></figure>'
        for fn, cap in gallery
    )
    title = {
        "ordenes": "Órdenes de trabajo",
        "stockalertas": "Stock y alertas",
        "visitas": "Visitas y técnicos",
        "takeaway": "Pedidos para llevar",
        "cuotas": "Cobros y cuotas",
        "obra": "Presupuesto de obra",
        "fichas": "Fichas",
        "flota": "Flota del local",
        "eventos": "Eventos y salón",
        "abonos": "Abonos",
        "mayorista": "Pedidos mayoristas",
        "reparto": "Reparto",
        "contratos": "Contratos",
    }[slug]
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.ico?v=20260911fav" sizes="any">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=20260911fav" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/reeb-mark-16.png?v=20260911fav" type="image/png" sizes="16x16">
  <link rel="icon" href="/brand/reeb-mark.svg?v=20260911fav" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico?v=20260911fav">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=20260911fav" sizes="180x180">
  <title>{title} — ejemplo de sistema</title>
  <meta name="description" content="{spec["lead"]}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://webconreeb.com/demos/{slug}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web con REEB">
  <meta property="og:url" content="https://webconreeb.com/demos/{slug}/">
  <meta property="og:title" content="{title} — ejemplo de sistema">
  <meta property="og:description" content="{spec["lead"]}">
  <meta property="og:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911g">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="es_AR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title} — ejemplo de sistema">
  <meta name="twitter:description" content="{spec["lead"]}">
  <meta name="twitter:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911g">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../sistemas-ui/base.css?v={CSS_V}">
  <link rel="stylesheet" href="styles.css?v={CSS_V}">
</head>
<body>
  <header class="band">
    <div class="band-inner">
      <a class="brand" href="index.html"><strong>{spec["short"]}</strong><span>{spec["span"]}</span></a>
      <nav>
        <a href="#como">Cómo funciona</a>
        <a href="#galeria">Fotos</a>
        <a class="btn" href="panel.html">Abrir panel</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <div>
        <p class="kicker">Sistema de gestión</p>
        <h1>{spec["h1"]}</h1>
        <p class="lead">{spec["lead"]}</p>
        <div class="hero-actions">
          <a class="btn" href="panel.html">Probar el panel</a>
          <a class="btn btn-quiet" href="/demos/#sistemas-gestion">Volver al catálogo</a>
        </div>
        <ul class="hero-facts">{facts}</ul>
      </div>
      <div class="hero-stage">
        <img src="img/hero.jpg" alt="{title}">
        <div class="cap"><strong>{spec["short"]}</strong><span>Página de ejemplo · panel incluido</span></div>
      </div>
    </section>
    <section class="section" id="como">
      <p class="kicker">Uso</p>
      <h2>Cómo funciona en el día a día</h2>
      <p class="section-lead">{spec["lead"]}</p>
      <div class="steps">{steps}</div>
    </section>
    <section class="section" id="galeria">
      <p class="kicker">Referencia visual</p>
      <h2>Ambiente del ejemplo</h2>
      <p class="section-lead">Fotos de referencia del rubro. En un trabajo a medida se usan las suyas.</p>
      <div class="gallery">{figs}</div>
    </section>
    <section class="section">
      <p class="kicker">Panel</p>
      <h2>Qué ve quien administra</h2>
      <div class="grid-3">{feats}</div>
    </section>
    <div class="cta-band">
      <p class="kicker" style="color:#e3c48a">A medida</p>
      <h2>¿Le sirve este sistema a su local?</h2>
      <p>Se adapta a su rubro. No es un software de suscripción: se cotiza y se entrega para usted.</p>
      <a class="btn" href="#contacto">Consultar</a>
    </div>
  </main>
  <div id="contacto"></div>
  <footer class="wrap">{title} · ejemplo de sistema · no es un software de suscripción.</footer>
  <script src="../contacto.js" data-phone="5492915757934" data-text="Hola, quiero consultar por {title}" data-subject="Consulta — {title}" data-title="Consultar" data-place="index"></script>
</body>
</html>
'''


def main() -> None:
    for slug, spec in SYSTEMS.items():
        dest = DEMOS / slug
        if not dest.exists():
            raise SystemExit(f"missing {slug}")
        gallery = copy_images(slug, spec)
        (dest / "index.html").write_text(index_html(slug, spec, gallery), encoding="utf-8")
        print(f"ok {slug}: {len(gallery)} images")


if __name__ == "__main__":
    main()
