#!/usr/bin/env python3
"""Each sistema landing is a unique 'app screen', not a shared marketing template."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
V = "c11"

FAV = """  <link rel="icon" href="/favicon.ico?v=20260911fav" sizes="any">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=20260911fav" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/reeb-mark-16.png?v=20260911fav" type="image/png" sizes="16x16">
  <link rel="icon" href="/brand/reeb-mark.svg?v=20260911fav" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico?v=20260911fav">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=20260911fav" sizes="180x180">"""

# Unique page: title, meta, theme, body class, full main HTML (unique shell)
PAGES: dict[str, dict] = {}


def page(slug, **kw):
    PAGES[slug] = kw


page(
    "stockalertas",
    title="Stock y alertas",
    short="Stock",
    meta="Depósito con mínimos: ve qué pedir antes de que falte.",
    theme={"ink": "#142016", "muted": "#4d6252", "paper": "#e6efe4", "brand": "#2f6b32", "accent": "#c8e0c4", "band": "#1a3d1e"},
    shell="""
<header class="app-top is-stock">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Depósito · Hoy</strong><span>Miércoles 11 · 48 productos</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-stock">
  <aside class="app-side">
    <p class="side-kicker">Vista</p>
    <button type="button" class="on">Alertas (3)</button>
    <button type="button">Todo el stock</button>
    <button type="button">Entradas</button>
    <button type="button">Salidas</button>
    <p class="side-note">Ejemplo inventado. En su local van sus productos.</p>
  </aside>
  <section class="app-main">
    <div class="app-head">
      <h1>Hay que pedir hoy</h1>
      <p>Rojo = bajo el mínimo. Verde = alcanza.</p>
    </div>
    <div class="stock-meter">
      <div><strong>3</strong><span>Pedir</span></div>
      <div><strong>45</strong><span>Ok</span></div>
      <div><strong>48</strong><span>Total</span></div>
    </div>
    <ul class="stock-rows">
      <li class="ask"><b>PEDIR</b><div><strong>Aceite 900 ml</strong><span>Quedan 6 · mínimo 10 · proveedor Aceites Sur</span></div><em>−4</em></li>
      <li class="ask"><b>PEDIR</b><div><strong>Detergente limón</strong><span>Quedan 4 · mínimo 8 · proveedor LimpiaYa</span></div><em>−4</em></li>
      <li class="ask"><b>PEDIR</b><div><strong>Yerba 500 g</strong><span>Quedan 3 · mínimo 12 · proveedor Norte</span></div><em>−9</em></li>
      <li class="ok"><b>OK</b><div><strong>Arroz 1 kg</strong><span>22 en stock · mínimo 15</span></div><em>+7</em></li>
      <li class="ok"><b>OK</b><div><strong>Fideos 500 g</strong><span>40 en stock · mínimo 20</span></div><em>+20</em></li>
      <li class="ok"><b>OK</b><div><strong>Harina 000</strong><span>18 en stock · mínimo 10</span></div><em>+8</em></li>
    </ul>
    <div class="app-cta">
      <p>Esto es lo que ve el encargado al abrir el sistema. No es una página genérica: es el depósito del día.</p>
      <a class="btn" href="panel.html">Probar el panel con estos datos</a>
    </div>
  </section>
</main>
""",
)

page(
    "visitas",
    title="Visitas y técnicos",
    short="Visitas",
    meta="Ruta del técnico: a qué casa va y si ya llegó.",
    theme={"ink": "#0f1c28", "muted": "#4d6270", "paper": "#e4eef4", "brand": "#1d5f8a", "accent": "#c4dceb", "band": "#12364d"},
    shell="""
<header class="app-top is-visitas">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Ruta · Diego</strong><span>Hoy · 5 visitas</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-visitas">
  <section class="map-fake" aria-hidden="true">
    <div class="pin p1">1</div><div class="pin p2 on">2</div><div class="pin p3">3</div><div class="pin p4">4</div><div class="pin p5">5</div>
    <p>Zona norte · ejemplo</p>
  </section>
  <section class="route-panel">
    <h1>Ruta de Diego</h1>
    <p class="lead-mini">Cuando llega, marca el check-in. El cliente puede recibir aviso.</p>
    <ol class="route-big">
      <li class="done"><time>09:00</time><div><strong>Lo de Rosa</strong><span>Mitre 420 · Centro</span></div><b>Hecha</b></li>
      <li class="now"><time>11:00</time><div><strong>Ferretería Sol</strong><span>Belgrano 88 · Norte</span></div><b>En camino</b></li>
      <li><time>14:30</time><div><strong>Sra. Gómez</strong><span>San Martín 15 · Sur</span></div><b>Pendiente</b></li>
      <li><time>16:00</time><div><strong>Café Mayo</strong><span>Mayo 210 · Centro</span></div><b>Pendiente</b></li>
      <li><time>17:30</time><div><strong>Taller Sur</strong><span>Ruta 3 km 2 · Oeste</span></div><b>Pendiente</b></li>
    </ol>
    <a class="btn" href="panel.html">Ver panel de visitas</a>
  </section>
</main>
""",
)

page(
    "ordenes",
    title="Órdenes de trabajo",
    short="Órdenes",
    meta="Tablero del taller: ingreso, en curso y listos para retirar.",
    theme={"ink": "#1c1610", "muted": "#6a5a48", "paper": "#f0e6d8", "brand": "#6b3f1f", "accent": "#e4d0b4", "band": "#3d2414"},
    shell="""
<header class="app-top is-ordenes">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Taller · Tablero</strong><span>4 órdenes abiertas</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-ordenes">
  <h1 class="board-title">Pizarrón del taller</h1>
  <div class="kanban big">
    <div class="col"><h2>Ingreso</h2>
      <article><strong>OT-105</strong><span>Juan · Cronos 2020</span><em>Service 10.000</em></article>
      <article><strong>OT-107</strong><span>Pedro · Hilux</span><em>Diagnóstico ruido</em></article>
    </div>
    <div class="col mid"><h2>En curso</h2>
      <article><strong>OT-104</strong><span>María · Focus</span><em>Frenos · espera pastillas</em></article>
      <article><strong>OT-108</strong><span>Lucía · Gol</span><em>Cambio de batería</em></article>
    </div>
    <div class="col ok"><h2>Listo / retirar</h2>
      <article><strong>OT-106</strong><span>Ana · Gol 2014</span><em>Avisar por WhatsApp</em><a class="mini" href="panel.html">Aviso listo</a></article>
    </div>
  </div>
  <p class="foot-help">Así se ve el día en el taller. Cada tarjeta es un auto real (datos de muestra).</p>
</main>
""",
)

page(
    "takeaway",
    title="Pedidos para llevar",
    short="Para llevar",
    meta="Cola del mostrador: números grandes, listo para retirar.",
    theme={"ink": "#22140c", "muted": "#6b5340", "paper": "#f6ebe0", "brand": "#c45a12", "accent": "#f0d2b4", "band": "#5a2a0c"},
    shell="""
<header class="app-top is-take">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Mostrador · Mediodía</strong><span>Cola en vivo</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-take">
  <div class="kds">
    <article class="ready"><span class="num">41</span><strong>Carla</strong><p>2 milanesas + papas</p><b>LISTO</b></article>
    <article class="ready"><span class="num">44</span><strong>Luis</strong><p>Tarta jamón y queso</p><b>LISTO</b></article>
    <article class="prep"><span class="num">42</span><strong>Martín</strong><p>Empanadas x12</p><b>EN PREP.</b></article>
    <article><span class="num">43</span><strong>Sofía</strong><p>Pollo + ensalada</p><b>RECIBIDO</b></article>
    <article><span class="num">45</span><strong>Nora</strong><p>Sándwich completo</p><b>RECIBIDO</b></article>
    <article class="prep"><span class="num">46</span><strong>Pablo</strong><p>Milanesa sola</p><b>EN PREP.</b></article>
  </div>
  <p class="foot-help">Pantalla de mostrador: el número grande es lo que grita la cocina. No es comanda de mesa.</p>
  <a class="btn" href="panel.html">Probar el panel</a>
</main>
""",
)

page(
    "cuotas",
    title="Cobros y cuotas",
    short="Cuotas",
    meta="Planes en cuotas: quién pagó, quién vence, quién debe.",
    theme={"ink": "#1a1810", "muted": "#655c48", "paper": "#f4efdf", "brand": "#8a6a18", "accent": "#e8dcb8", "band": "#3d3410"},
    shell="""
<header class="app-top is-cuotas">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Cobros · Marzo</strong><span>12 planes activos</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-cuotas">
  <div class="ledger-top">
    <div><strong>4</strong><span>Vencen este mes</span></div>
    <div class="warn"><strong>2</strong><span>En mora</span></div>
    <div><strong>$412.000</strong><span>A cobrar en marzo</span></div>
  </div>
  <table class="ledger">
    <thead><tr><th>Cliente</th><th>Plan</th><th>Avance</th><th>Estado</th></tr></thead>
    <tbody>
      <tr><td>Familia Ríos</td><td>Heladera · 6 cuotas</td><td><i style="--p:50%"></i> 3/6</td><td class="ok">Pagada</td></tr>
      <tr><td>Sr. Acosta</td><td>TV · 12 cuotas</td><td><i style="--p:42%"></i> 5/12</td><td class="warn">Vence hoy</td></tr>
      <tr><td>Sra. Méndez</td><td>Lavarropas · 10</td><td><i style="--p:20%"></i> 2/10</td><td class="bad">Atrasada</td></tr>
      <tr><td>Comercio Luz</td><td>Notebook · 8</td><td><i style="--p:12%"></i> 1/8</td><td class="ok">Pagada</td></tr>
      <tr><td>Sra. Vidal</td><td>Heladera · 12</td><td><i style="--p:8%"></i> 1/12</td><td class="bad">Atrasada</td></tr>
    </tbody>
  </table>
  <a class="btn" href="panel.html">Ver panel de cuotas</a>
</main>
""",
)

page(
    "obra",
    title="Presupuesto de obra",
    short="Obra",
    meta="Reformas por etapas con porcentaje de avance.",
    theme={"ink": "#1c1610", "muted": "#6a5a48", "paper": "#efe6d8", "brand": "#8a5520", "accent": "#e2d0b0", "band": "#3d2810"},
    shell="""
<header class="app-top is-obra">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Obras activas</strong><span>3 reformas</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-obra">
  <div class="obra-hero" style="background-image:url(img/hero.jpg)">
    <div>
      <p class="kicker">En obra ahora</p>
      <h1>Cocina Belgrano · 70%</h1>
      <p>Familia Ortiz · etapa revestimientos · extras: mesada piedra</p>
      <div class="big-meter"><i style="--p:70%"></i></div>
    </div>
  </div>
  <div class="obra-cards">
    <article><strong>Baño Palermo</strong><span>Sra. Vega</span><div class="big-meter"><i style="--p:25%"></i></div><p>25% · demolición</p></article>
    <article><strong>Local Centro</strong><span>Comercial Sur</span><div class="big-meter"><i style="--p:40%"></i></div><p>40% · instalaciones</p></article>
    <article><strong>Deck Quilmes</strong><span>Sr. Blanco</span><div class="big-meter"><i style="--p:90%"></i></div><p>90% · estructura</p></article>
  </div>
  <a class="btn" href="panel.html">Ver panel de obra</a>
</main>
""",
)

page(
    "fichas",
    title="Fichas",
    short="Fichas",
    meta="Historial del paciente o mascota y próximo control.",
    theme={"ink": "#141c28", "muted": "#556274", "paper": "#e8eef6", "brand": "#3a5580", "accent": "#d0dae8", "band": "#1c2c44"},
    shell="""
<header class="app-top is-fichas">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Archivo · Controles</strong><span>26 fichas</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-fichas">
  <div class="search-fake">Buscar ficha… <span>Luna</span></div>
  <div class="ficha-spread">
    <article class="open">
      <header><strong>Luna</strong><span>Caniche · 4 años</span></header>
      <p><b>Última visita</b> 02/09 — vacunas anuales</p>
      <p><b>Próximo</b> 16/09 — refuerzo</p>
      <p><b>Nota</b> Dueña: Carla · alergia a antiparasitario X</p>
    </article>
    <div class="ficha-stack">
      <article><strong>Sr. Molina</strong><span>Control 11/09</span></article>
      <article><strong>Michi</strong><span>Gato · 22/09</span></article>
      <article><strong>Sra. Paredes</strong><span>Seguimiento 19/09</span></article>
      <article><strong>Rocky</strong><span>Vacunas 25/09</span></article>
    </div>
  </div>
  <a class="btn" href="panel.html">Ver panel de fichas</a>
</main>
""",
)

page(
    "flota",
    title="Flota del local",
    short="Flota",
    meta="Utilitarios propios: service, km y papeles.",
    theme={"ink": "#121820", "muted": "#55606c", "paper": "#e8ecf0", "brand": "#2a3848", "accent": "#ccd6e0", "band": "#15202c"},
    shell="""
<header class="app-top is-flota">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Flota propia</strong><span>5 unidades</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-flota">
  <div class="fleet-alerts">
    <div class="bad"><strong>1</strong><span>Patente por vencer</span></div>
    <div class="warn"><strong>2</strong><span>Service cerca</span></div>
    <div><strong>2</strong><span>Al día</span></div>
  </div>
  <div class="fleet-grid">
    <article class="warn"><img src="img/hero.jpg" alt=""><div><strong>AB 123 CD</strong><span>S10 blanca · 86.400 km</span><b>Service a los 90.000</b></div></article>
    <article class="bad"><div class="ph"></div><div><strong>AF 450 JK</strong><span>Partner · 112.200 km</span><b>Patente vence en octubre</b></div></article>
    <article class="ok"><div class="ph"></div><div><strong>AE 778 MN</strong><span>Cronos · 54.100 km</span><b>Al día</b></div></article>
    <article class="warn"><div class="ph"></div><div><strong>AD 901 PQ</strong><span>Kangoo · 98.050 km</span><b>VTV noviembre</b></div></article>
  </div>
  <a class="btn" href="panel.html">Ver panel de flota</a>
</main>
""",
)

page(
    "eventos",
    title="Eventos y salón",
    short="Eventos",
    meta="Agenda del salón: fecha, seña y checklist.",
    theme={"ink": "#221018", "muted": "#6b4e58", "paper": "#f6e8ee", "brand": "#8a2f5a", "accent": "#ecc8d8", "band": "#3d1428"},
    shell="""
<header class="app-top is-eventos">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Salón · Septiembre</strong><span>4 eventos</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-eventos">
  <div class="cal-grid" aria-label="Septiembre">
    <span class="d muted">1</span><span class="d muted">2</span><span class="d">3</span><span class="d">4</span><span class="d">5</span><span class="d">6</span><span class="d">7</span>
    <span class="d">8</span><span class="d">9</span><span class="d">10</span><span class="d">11</span><span class="d">12</span><span class="d">13</span><span class="d">14</span>
    <span class="d">15</span><span class="d">16</span><span class="d">17</span><span class="d">18</span><span class="d">19</span><span class="d hit">20<div>Quince Sofía</div></span><span class="d">21</span>
    <span class="d">22</span><span class="d">23</span><span class="d">24</span><span class="d">25</span><span class="d">26</span><span class="d hit soft">27<div>Casamiento</div></span><span class="d">28</span>
    <span class="d">29</span><span class="d">30</span>
  </div>
  <aside class="event-detail">
    <p class="kicker">Próximo</p>
    <h1>Quince Sofía</h1>
    <ul>
      <li>20/09 · 80 invitados</li>
      <li>Seña 50% cobrada</li>
      <li>Menú: entrada + plato + torta</li>
      <li>Checklist: sonido ✓ · luces ✓ · cocina pendiente</li>
    </ul>
    <a class="btn" href="panel.html">Abrir ficha del evento</a>
  </aside>
</main>
""",
)

page(
    "abonos",
    title="Abonos",
    short="Abonos",
    meta="Cuota mensual: al día versus mora.",
    theme={"ink": "#0e1e24", "muted": "#4a646c", "paper": "#e4f0f2", "brand": "#157080", "accent": "#bfe0e6", "band": "#0c3a44"},
    shell="""
<header class="app-top is-abonos">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Abonos · Septiembre</strong><span>84 socios</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-abonos">
  <div class="mega-split">
    <div class="ok"><strong>71</strong><span>Al día</span><p>Ya pagaron septiembre</p></div>
    <div class="bad"><strong>13</strong><span>Deben</span><p>Lista de mora abajo</p></div>
  </div>
  <h2>Mora de este mes</h2>
  <ul class="mora-big">
    <li><strong>Ana Pérez</strong><span>Mensual · $18.000</span><b>Debe</b></li>
    <li><strong>Tomás Ruiz</strong><span>Mensual · $18.000</span><b>Debe</b></li>
    <li><strong>Gimnasio Norte · 2 pases</strong><span>Empresa · $40.000</span><b>Debe</b></li>
  </ul>
  <a class="btn" href="panel.html">Ver panel de abonos</a>
</main>
""",
)

page(
    "mayorista",
    title="Pedidos mayoristas",
    short="Mayorista",
    meta="Pedidos B2B: mínimo, armado y despacho.",
    theme={"ink": "#101428", "muted": "#556078", "paper": "#e8ecf6", "brand": "#2a4080", "accent": "#ccd4ea", "band": "#141e44"},
    shell="""
<header class="app-top is-b2b">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Despacho B2B</strong><span>6 pedidos abiertos</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-b2b">
  <div class="pack-rail">
    <article class="ship"><header>DESPACHO</header><strong>Kiosco Lo de Ana</strong><p>Yerba x20 · Aceite x6</p><span>$98.000 · mínimo ok</span></article>
    <article class="build"><header>ARMANDO</header><strong>Almacén Sur</strong><p>Aceite x40 · Fideos x30</p><span>$74.000 · mínimo ok</span></article>
    <article class="new"><header>NUEVO</header><strong>Rotisería Sol</strong><p>Harina x30</p><span>$22.500 · mínimo ok</span></article>
    <article class="done"><header>ENTREGADO</header><strong>Café Centro</strong><p>Vasos x10</p><span>$18.000</span></article>
  </div>
  <p class="foot-help">Cada tarjeta es un pedido de un comercio. No es la góndola del mostrador.</p>
  <a class="btn" href="panel.html">Ver panel mayorista</a>
</main>
""",
)

page(
    "reparto",
    title="Reparto",
    short="Reparto",
    meta="Entregas: zona, chofer y estado del envío.",
    theme={"ink": "#122016", "muted": "#4e6454", "paper": "#e6f0e6", "brand": "#2f7a3a", "accent": "#c8e4c8", "band": "#143820"},
    shell="""
<header class="app-top is-reparto">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Despacho · Tarde</strong><span>9 envíos · 2 choferes</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-reparto">
  <div class="dispatch">
    <section>
      <h2>Pablo · Centro / Norte</h2>
      <ul>
        <li class="done"><time>16:10</time> Mitre 100 · Entregado</li>
        <li class="now"><time>16:40</time> Belgrano 55 · En camino</li>
        <li><time>17:15</time> Rivadavia 800 · Pendiente</li>
      </ul>
    </section>
    <section>
      <h2>María · Sur / Oeste</h2>
      <ul>
        <li class="now"><time>17:00</time> San Martín 12 · Salió</li>
        <li><time>17:30</time> Ruta 3 km 1 · Pendiente</li>
        <li><time>18:00</time> Alsina 40 · Pendiente</li>
      </ul>
    </section>
  </div>
  <a class="btn" href="panel.html">Ver panel de reparto</a>
</main>
""",
)

page(
    "contratos",
    title="Contratos",
    short="Contratos",
    meta="Vigencias y renovaciones del mes.",
    theme={"ink": "#10201c", "muted": "#4e6660", "paper": "#e4f0ec", "brand": "#1a6b5c", "accent": "#c4e4da", "band": "#0e3a32"},
    shell="""
<header class="app-top is-contratos">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Contratos</strong><span>18 vigentes · 3 por vencer</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-contratos">
  <div class="renew-board">
    <article class="hot"><time>30/09</time><div><strong>Alquiler Mitre 120</strong><span>Sra. López · $280.000</span></div><b>A renovar</b></article>
    <article class="hot"><time>01/10</time><div><strong>Mantenimiento red</strong><span>Estudio Norte · $95.000</span></div><b>A renovar</b></article>
    <article class="hot"><time>08/10</time><div><strong>Cochera 2</strong><span>Sr. Díaz · $45.000</span></div><b>A renovar</b></article>
    <article><time>15/10</time><div><strong>Local Sur</strong><span>Comercio Paz · $420.000</span></div><b>Vigente</b></article>
    <article><time>28/11</time><div><strong>Cochera 4</strong><span>Sr. Gómez · $45.000</span></div><b>Vigente</b></article>
  </div>
  <a class="btn" href="panel.html">Ver panel de contratos</a>
</main>
""",
)

page(
    "inventario",
    title="Inventario",
    short="Inventario",
    meta="Stock con código de barras/QR e importación de planilla.",
    theme={"ink": "#181422", "muted": "#5c546e", "paper": "#eee8f6", "brand": "#5a3488", "accent": "#ddd0f0", "band": "#2a1844"},
    shell="""
<header class="app-top is-inv">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Inventario · Escáner</strong><span>Códigos + planilla</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-inv">
  <div class="scan-stage">
    <div class="scan-box">
      <p>Pase el código</p>
      <div class="barcode" aria-hidden="true"></div>
      <strong>7791234561001</strong>
      <span>Aceite 900 ml · stock 24</span>
    </div>
    <div class="scan-list">
      <h2>Últimos escaneos</h2>
      <ul>
        <li><code>779…1001</code> Aceite · +1</li>
        <li class="ask"><code>779…2008</code> Arroz · stock 8 · <b>Pedir</b></li>
        <li><code>QR-77821</code> Resma A4 · +2</li>
        <li><code>779…3005</code> Fideos · ok</li>
      </ul>
      <p class="hint">También se importa la planilla del proveedor (Excel o CSV).</p>
    </div>
  </div>
  <a class="btn" href="panel.html">Probar escaneo e importación</a>
</main>
""",
)

# Featured sistemas that still look like the old template
page(
    "turnos",
    title="Agenda de turnos",
    short="Agenda",
    meta="Turnos del día por profesional, en una sola agenda.",
    theme={"ink": "#14241e", "muted": "#4e655c", "paper": "#e6f0ea", "brand": "#2f5d56", "accent": "#d4ebe4", "band": "#1a3530"},
    shell="""
<header class="app-top is-turnos">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Agenda · Hoy</strong><span>Laura · Martín</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-turnos">
  <div class="day-cols">
    <section>
      <h2>Laura</h2>
      <article class="done"><time>09:00</time><strong>Ana Pérez</strong><span>Corte</span></article>
      <article class="now"><time>10:00</time><strong>Sofía Ríos</strong><span>Color</span></article>
      <article><time>11:30</time><strong>María López</strong><span>Brushing</span></article>
      <article class="free"><time>13:00</time><strong>Libre</strong></article>
    </section>
    <section>
      <h2>Martín</h2>
      <article class="done"><time>09:30</time><strong>Juan Díaz</strong><span>Corte caballero</span></article>
      <article><time>10:30</time><strong>Pedro Sosa</strong><span>Barba</span></article>
      <article class="now"><time>11:00</time><strong>Luis Acosta</strong><span>Corte + barba</span></article>
      <article><time>12:00</time><strong>Tomás Vega</strong><span>Corte</span></article>
    </section>
  </div>
  <p class="foot-help">Agenda del salón: el cliente va al local. No es visita a domicilio.</p>
  <a class="btn" href="panel.html">Probar el panel</a>
</main>
""",
)

page(
    "cotizaciones",
    title="Cotizaciones",
    short="Cotizaciones",
    meta="Presupuesto de un trabajo: ítems, envío y aceptación.",
    theme={"ink": "#1c1810", "muted": "#655848", "paper": "#f2eae0", "brand": "#8a5a20", "accent": "#e6d4b8", "band": "#3d2a10"},
    shell="""
<header class="app-top is-cotiz">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Presupuesto #184</strong><span>Enviado · espera respuesta</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-cotiz">
  <article class="quote-sheet">
    <header>
      <div><strong>Carpintería Norte</strong><span>Para: Familia Ortiz</span></div>
      <b>Válido 10 días</b>
    </header>
    <table>
      <tr><td>Placard 2 m</td><td>1</td><td>$420.000</td></tr>
      <tr><td>Herrajes</td><td>1</td><td>$48.000</td></tr>
      <tr><td>Instalación</td><td>1</td><td>$90.000</td></tr>
      <tr class="total"><td colspan="2">Total</td><td>$558.000</td></tr>
    </table>
    <p>Seña sugerida: 30% · Estado: <em>Enviado por WhatsApp</em></p>
  </article>
  <a class="btn" href="panel.html">Ver panel de cotizaciones</a>
</main>
""",
)

page(
    "cuentacorriente",
    title="Cuenta corriente",
    short="Fiado",
    meta="Fiado del barrio: cargos, pagos y saldo por cliente.",
    theme={"ink": "#1c1610", "muted": "#655848", "paper": "#f3ebe2", "brand": "#6b4820", "accent": "#e6d4c0", "band": "#3a2814"},
    shell="""
<header class="app-top is-fiado">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Fiado · Lo de Rosa</strong><span>Saldo actual</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-fiado">
  <div class="saldo-hero">
    <span>Debe hoy</span>
    <strong>$47.800</strong>
    <p>Límite orientativo $80.000</p>
  </div>
  <ul class="movs">
    <li><span>Hoy 10:12</span><strong>Cargo · fiambre + pan</strong><b>+$6.400</b></li>
    <li><span>Ayer</span><strong>Pago efectivo</strong><b class="ok">−$20.000</b></li>
    <li><span>Lunes</span><strong>Cargo · bebidas</strong><b>+$9.200</b></li>
    <li><span>Sábado</span><strong>Cargo · almacén</strong><b>+$12.500</b></li>
  </ul>
  <a class="btn" href="panel.html">Ver panel de cuenta corriente</a>
</main>
""",
)

page(
    "comandas",
    title="Comandas",
    short="Comandas",
    meta="Mesas del salón, cocina y cierre de cuenta.",
    theme={"ink": "#1c1210", "muted": "#6b5048", "paper": "#f6ebe6", "brand": "#8a3a28", "accent": "#efd0c4", "band": "#3d1c14"},
    shell="""
<header class="app-top is-comandas">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Salón · Servicio</strong><span>8 mesas · 5 ocupadas</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-comandas">
  <div class="floor">
    <button type="button" class="table free">1<span>Libre</span></button>
    <button type="button" class="table busy">2<span>4 pers. · $28.400</span></button>
    <button type="button" class="table busy hot">3<span>Cocina · 2 platos</span></button>
    <button type="button" class="table free">4<span>Libre</span></button>
    <button type="button" class="table busy">5<span>2 pers. · $11.200</span></button>
    <button type="button" class="table pay">6<span>Pidiendo cuenta</span></button>
    <button type="button" class="table free">7<span>Libre</span></button>
    <button type="button" class="table busy">8<span>6 pers. · $54.000</span></button>
  </div>
  <aside class="kitchen">
    <h2>Cocina ahora</h2>
    <ul>
      <li><b>Mesa 3</b> 2× bife · 1× ensalada</li>
      <li><b>Mesa 5</b> 1× pasta</li>
      <li><b>Mesa 2</b> 1× postre</li>
    </ul>
  </aside>
  <a class="btn" href="panel.html">Ver panel de comandas</a>
</main>
""",
)

page(
    "reservas",
    title="Reservas",
    short="Reservas",
    meta="Cabañas o habitaciones: fechas, seña y estadía.",
    theme={"ink": "#102028", "muted": "#4e6570", "paper": "#e4eef2", "brand": "#1a6880", "accent": "#c4dde8", "band": "#0e3848"},
    shell="""
<header class="app-top is-reservas">
  <a class="back" href="/demos/#sistemas-gestion">← Catálogo</a>
  <div><strong>Ocupación · Semana</strong><span>Cabañas 1–4</span></div>
  <a class="btn" href="panel.html">Abrir panel</a>
</header>
<main class="app-shell is-reservas">
  <table class="occ">
    <thead><tr><th></th><th>Vie</th><th>Sáb</th><th>Dom</th><th>Lun</th><th>Mar</th></tr></thead>
    <tbody>
      <tr><th>Cabaña 1</th><td class="on">Ríos</td><td class="on">Ríos</td><td class="on">Ríos</td><td></td><td></td></tr>
      <tr><th>Cabaña 2</th><td></td><td class="on">López</td><td class="on">López</td><td class="on">López</td><td></td></tr>
      <tr><th>Cabaña 3</th><td class="on">Sosa</td><td class="on">Sosa</td><td></td><td></td><td class="hold">Consulta</td></tr>
      <tr><th>Cabaña 4</th><td></td><td></td><td class="on">Vega</td><td class="on">Vega</td><td class="on">Vega</td></tr>
    </tbody>
  </table>
  <p class="foot-help">Calendario de estadías. No es salón de fiestas.</p>
  <a class="btn" href="panel.html">Ver panel de reservas</a>
</main>
""",
)


APP_CSS = r"""
/* Unique app-shell landings (not shared marketing template) */
body {
  margin: 0;
  font-family: "Source Sans 3", system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
}
a { color: inherit; }
.app-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  background: var(--band, var(--brand));
  color: #f7f4ef;
  position: sticky;
  top: 0;
  z-index: 20;
}
.app-top .back { color: rgba(247,244,239,0.8); text-decoration: none; font-weight: 650; font-size: 0.9rem; }
.app-top strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 1.15rem; }
.app-top span { font-size: 0.82rem; opacity: 0.8; }
.app-top .btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 40px; padding: 0 14px; border-radius: 999px;
  background: #fff; color: var(--ink); font-weight: 700; text-decoration: none; font-size: 0.9rem;
}
.app-shell { max-width: 1100px; margin: 0 auto; padding: 1.1rem 1rem 3rem; }
.app-shell .btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 46px; padding: 0 18px; border-radius: 999px;
  background: var(--brand); color: #fff; font-weight: 700; text-decoration: none; margin-top: 1rem;
}
.foot-help, .app-cta p, .hint, .lead-mini { color: var(--muted); max-width: 48ch; }
.kicker { letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.72rem; font-weight: 750; color: var(--brand); margin: 0 0 0.35rem; }

/* Stock dashboard */
.is-stock.app-shell { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; max-width: 1200px; }
.app-side { background: #fff; border: 1px solid color-mix(in srgb, var(--brand) 20%, #ccc); border-radius: 14px; padding: 0.9rem; height: fit-content; }
.app-side .side-kicker { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0 0 0.5rem; }
.app-side button { display: block; width: 100%; text-align: left; border: 0; background: transparent; padding: 0.55rem 0.5rem; border-radius: 8px; font: inherit; font-weight: 650; cursor: default; color: var(--ink); }
.app-side button.on { background: color-mix(in srgb, var(--accent) 70%, #fff); color: var(--brand); }
.side-note { font-size: 0.8rem; color: var(--muted); margin: 0.8rem 0 0; }
.stock-meter { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin: 0.8rem 0 1rem; }
.stock-meter > div { background: #fff; border-radius: 12px; padding: 0.8rem; text-align: center; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.stock-meter strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 1.8rem; }
.stock-rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.stock-rows li { display: grid; grid-template-columns: 4.2rem 1fr auto; gap: 0.75rem; align-items: center; background: #fff; border-radius: 12px; padding: 0.75rem 0.85rem; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.stock-rows .ask { background: #fff1f0; border-color: #e8b0b0; }
.stock-rows b { font-size: 0.68rem; letter-spacing: 0.06em; }
.stock-rows .ask b { color: #9b2c2c; }
.stock-rows .ok b { color: #1b5c3d; }
.stock-rows strong { display: block; }
.stock-rows span { color: var(--muted); font-size: 0.88rem; }
.stock-rows em { font-style: normal; font-weight: 750; color: var(--muted); }

/* Visitas map + route */
.is-visitas.app-shell { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; max-width: 1200px; }
.map-fake { min-height: 520px; border-radius: 18px; background:
  radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--brand) 25%, #fff), transparent 40%),
  linear-gradient(160deg, #b8cfdc, #dfeaf0 40%, #c5d6c8); position: relative; overflow: hidden; border: 1px solid color-mix(in srgb, var(--brand) 20%, #ccc); }
.map-fake p { position: absolute; left: 1rem; bottom: 1rem; margin: 0; background: rgba(255,255,255,0.85); padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 0.85rem; font-weight: 650; }
.pin { position: absolute; width: 2rem; height: 2rem; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: var(--brand); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 0.85rem; }
.pin > * , .pin { line-height: 1; }
.pin { color: #fff; }
.pin::after { content: attr(data-n); }
.pin { font-size: 0.9rem; }
.pin { display: flex; align-items: center; justify-content: center; }
.pin { transform: rotate(-45deg); }
.pin { color: transparent; }
.pin { text-indent: 0; color: #fff; }
/* numbers visible despite rotate */
.pin { color: #fff; }
.p1 { top: 22%; left: 28%; } .p2 { top: 35%; left: 58%; } .p3 { top: 58%; left: 40%; } .p4 { top: 48%; left: 22%; } .p5 { top: 70%; left: 62%; }
.pin.on { background: #c48a20; box-shadow: 0 0 0 6px rgba(196,138,32,0.25); }
.route-panel { background: #fff; border-radius: 18px; padding: 1.1rem 1.15rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.route-panel h1 { font-family: Fraunces, Georgia, serif; margin: 0 0 0.35rem; font-size: 1.6rem; }
.route-big { list-style: none; margin: 1rem 0; padding: 0; display: grid; gap: 0.55rem; }
.route-big li { display: grid; grid-template-columns: 3.4rem 1fr auto; gap: 0.6rem; align-items: start; padding: 0.7rem 0.75rem; border-radius: 12px; background: color-mix(in srgb, var(--accent) 35%, #fff); }
.route-big .done { opacity: 0.7; }
.route-big .now { outline: 2px solid var(--brand); background: #fff; }
.route-big time { font-weight: 750; color: var(--muted); }
.route-big strong { display: block; }
.route-big span { color: var(--muted); font-size: 0.88rem; }
.route-big b { font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--brand); }

/* Ordenes kanban full */
.board-title { font-family: Fraunces, Georgia, serif; font-size: 1.8rem; margin: 0 0 1rem; }
.kanban.big { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.kanban .col { background: #fff; border-radius: 14px; padding: 0.8rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); min-height: 360px; }
.kanban .col.mid { border-top: 4px solid var(--brand); }
.kanban .col.ok { border-top: 4px solid #2f8a55; }
.kanban h2 { margin: 0 0 0.7rem; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.kanban article { background: color-mix(in srgb, var(--accent) 50%, #fff); border-radius: 12px; padding: 0.75rem; margin-bottom: 0.55rem; border: 1px solid color-mix(in srgb, var(--brand) 12%, #ccc); }
.kanban strong { display: block; }
.kanban span, .kanban em { display: block; color: var(--muted); font-size: 0.88rem; font-style: normal; }
.mini { display: inline-block; margin-top: 0.45rem; font-size: 0.8rem; font-weight: 700; color: var(--brand); }

/* Takeaway KDS */
.kds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.kds article { background: #fff; border-radius: 18px; padding: 1rem; border: 2px solid color-mix(in srgb, var(--brand) 25%, #ccc); min-height: 160px; }
.kds .num { font-family: Fraunces, Georgia, serif; font-size: 3rem; font-weight: 600; color: var(--brand); display: block; line-height: 1; }
.kds .ready { background: #e8f7ee; border-color: #2f8a55; }
.kds .prep { background: #fff6e4; border-color: #c48a20; }
.kds b { display: inline-block; margin-top: 0.5rem; font-size: 0.72rem; letter-spacing: 0.08em; }

/* Cuotas ledger */
.ledger-top { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1rem; }
.ledger-top > div { background: #fff; border-radius: 14px; padding: 1rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.ledger-top strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 1.7rem; }
.ledger-top .warn { background: #fff6e4; }
.ledger { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.ledger th, .ledger td { padding: 0.75rem 0.85rem; text-align: left; border-bottom: 1px solid color-mix(in srgb, var(--brand) 12%, #ddd); }
.ledger th { background: var(--band, var(--brand)); color: #fff; font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; }
.ledger td i { display: inline-block; width: 5rem; height: 8px; border-radius: 999px; background: #eee; vertical-align: middle; margin-right: 0.4rem; position: relative; overflow: hidden; }
.ledger td i::after { content: ""; position: absolute; inset: 0 auto 0 0; width: var(--p); background: var(--brand); }
.ledger .ok { color: #1b5c3d; font-weight: 700; }
.ledger .warn { color: #8a5a10; font-weight: 700; }
.ledger .bad { color: #9b2c2c; font-weight: 700; }

/* Obra */
.obra-hero { min-height: 280px; border-radius: 18px; background-size: cover; background-position: center; position: relative; overflow: hidden; margin-bottom: 0.85rem; }
.obra-hero > div { position: absolute; inset: auto 0 0 0; padding: 1.2rem 1.3rem; background: linear-gradient(transparent, rgba(20,12,6,0.88)); color: #f7f4ef; }
.obra-hero h1 { margin: 0.2rem 0 0.35rem; font-family: Fraunces, Georgia, serif; font-size: 1.8rem; }
.obra-hero .kicker { color: #f0d0a8; }
.big-meter { height: 10px; border-radius: 999px; background: rgba(255,255,255,0.25); overflow: hidden; margin-top: 0.6rem; }
.big-meter i { display: block; height: 100%; width: var(--p); background: #e3c48a; }
.obra-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
.obra-cards article { background: #fff; border-radius: 14px; padding: 0.9rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.obra-cards .big-meter { background: color-mix(in srgb, var(--accent) 50%, #fff); }
.obra-cards .big-meter i { background: var(--brand); }
.obra-cards p { margin: 0.4rem 0 0; color: var(--muted); font-size: 0.9rem; }
.obra-cards span { color: var(--muted); font-size: 0.88rem; }

/* Fichas */
.search-fake { background: #fff; border-radius: 999px; padding: 0.7rem 1rem; border: 1px solid color-mix(in srgb, var(--brand) 20%, #ccc); margin-bottom: 0.9rem; color: var(--muted); }
.search-fake span { color: var(--ink); font-weight: 700; }
.ficha-spread { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.75rem; }
.ficha-spread .open { background: #fff; border-radius: 16px; padding: 1.1rem; border-left: 6px solid var(--brand); border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); border-left-width: 6px; }
.ficha-spread .open header strong { font-family: Fraunces, Georgia, serif; font-size: 1.6rem; display: block; }
.ficha-stack { display: grid; gap: 0.5rem; }
.ficha-stack article { background: #fff; border-radius: 12px; padding: 0.8rem; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.ficha-stack strong { display: block; }

/* Flota */
.fleet-alerts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.55rem; margin-bottom: 0.85rem; }
.fleet-alerts > div { background: #fff; border-radius: 12px; padding: 0.85rem; text-align: center; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.fleet-alerts strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 1.8rem; }
.fleet-alerts .bad { background: #fff1f0; }
.fleet-alerts .warn { background: #fff6e4; }
.fleet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
.fleet-grid article { display: grid; grid-template-columns: 7rem 1fr; gap: 0.75rem; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.fleet-grid img, .fleet-grid .ph { width: 7rem; height: 100%; min-height: 90px; object-fit: cover; background: #c5ced6; }
.fleet-grid article > div { padding: 0.75rem 0.75rem 0.75rem 0; }
.fleet-grid strong { display: block; font-family: ui-monospace, Menlo, monospace; }
.fleet-grid .warn { border-color: #c48a20; }
.fleet-grid .bad { border-color: #b04040; }
.fleet-grid .ok { border-color: #2f8a55; }
.fleet-grid b { display: block; margin-top: 0.35rem; font-size: 0.88rem; color: var(--brand); }

/* Eventos calendar */
.is-eventos.app-shell { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1rem; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.35rem; background: #fff; padding: 0.75rem; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.cal-grid .d { min-height: 3.4rem; border-radius: 10px; background: color-mix(in srgb, var(--accent) 30%, #fff); padding: 0.35rem; font-size: 0.85rem; font-weight: 700; }
.cal-grid .muted { opacity: 0.35; }
.cal-grid .hit { background: var(--brand); color: #fff; }
.cal-grid .hit div { font-size: 0.65rem; font-weight: 650; margin-top: 0.2rem; line-height: 1.2; }
.cal-grid .soft { background: color-mix(in srgb, var(--brand) 55%, #fff); }
.event-detail { background: #fff; border-radius: 16px; padding: 1.1rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.event-detail h1 { font-family: Fraunces, Georgia, serif; margin: 0.2rem 0 0.7rem; }
.event-detail ul { margin: 0; padding-left: 1.1rem; color: var(--muted); }

/* Abonos mega */
.mega-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.2rem; }
.mega-split > div { border-radius: 20px; padding: 1.6rem 1rem; text-align: center; background: #fff; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.mega-split strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 4.5rem; line-height: 1; }
.mega-split .ok { background: #e8f7ee; }
.mega-split .bad { background: #fff1f0; }
.mega-split span { font-size: 1.1rem; font-weight: 750; }
.mora-big { list-style: none; margin: 0.5rem 0 0; padding: 0; display: grid; gap: 0.45rem; }
.mora-big li { display: grid; grid-template-columns: 1fr auto; gap: 0.2rem 0.75rem; background: #fff; padding: 0.8rem 0.9rem; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.mora-big span { grid-column: 1; color: var(--muted); font-size: 0.9rem; }
.mora-big b { grid-row: 1 / span 2; align-self: center; color: #9b2c2c; }

/* Mayorista packs */
.pack-rail { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.7rem; }
.pack-rail article { background: #fff; border-radius: 14px; padding: 1rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.pack-rail header { font-size: 0.7rem; letter-spacing: 0.08em; font-weight: 750; margin-bottom: 0.4rem; color: var(--muted); }
.pack-rail .ship { border-color: #c48a20; background: #fff8ea; }
.pack-rail .build { border-color: var(--brand); }
.pack-rail .new { border-color: #2f8a55; background: #eef8f1; }
.pack-rail .done { opacity: 0.65; }
.pack-rail span { color: var(--muted); font-size: 0.88rem; }

/* Reparto dispatch */
.dispatch { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.dispatch section { background: #fff; border-radius: 16px; padding: 1rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.dispatch h2 { margin: 0 0 0.7rem; font-size: 1.05rem; font-family: Fraunces, Georgia, serif; }
.dispatch ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.dispatch li { padding: 0.65rem 0.7rem; border-radius: 10px; background: color-mix(in srgb, var(--accent) 40%, #fff); }
.dispatch .done { opacity: 0.65; text-decoration: line-through; }
.dispatch .now { outline: 2px solid var(--brand); background: #fff; }
.dispatch time { font-weight: 750; margin-right: 0.4rem; color: var(--muted); }

/* Contratos */
.renew-board { display: grid; gap: 0.5rem; }
.renew-board article { display: grid; grid-template-columns: 4rem 1fr auto; gap: 0.75rem; align-items: center; background: #fff; padding: 0.85rem 0.95rem; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--brand) 15%, #ccc); }
.renew-board .hot { border-left: 5px solid #b04040; background: #fff7f6; }
.renew-board time { font-family: Fraunces, Georgia, serif; font-weight: 600; color: var(--brand); }
.renew-board strong { display: block; }
.renew-board span { color: var(--muted); font-size: 0.88rem; }
.renew-board b { font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; }

/* Inventario scan */
.scan-stage { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 0.85rem; }
.scan-box { background: #1a1028; color: #f0e8ff; border-radius: 18px; padding: 1.4rem; text-align: center; }
.barcode { height: 64px; margin: 0.8rem auto; width: 80%; background: repeating-linear-gradient(90deg, #f0e8ff 0 2px, transparent 2px 5px, #f0e8ff 5px 7px, transparent 7px 9px); border-radius: 4px; }
.scan-box strong { display: block; font-family: ui-monospace, Menlo, monospace; font-size: 1.1rem; margin-top: 0.5rem; }
.scan-list { background: #fff; border-radius: 16px; padding: 1rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.scan-list ul { list-style: none; margin: 0.5rem 0; padding: 0; display: grid; gap: 0.4rem; }
.scan-list li { padding: 0.55rem 0.65rem; border-radius: 8px; background: color-mix(in srgb, var(--accent) 40%, #fff); }
.scan-list .ask { background: #fff1f0; }
.scan-list code { font-family: ui-monospace, Menlo, monospace; margin-right: 0.4rem; color: var(--brand); }

/* Turnos day cols */
.day-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.day-cols section { background: #fff; border-radius: 16px; padding: 0.9rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.day-cols h2 { margin: 0 0 0.65rem; font-family: Fraunces, Georgia, serif; }
.day-cols article { display: grid; grid-template-columns: 3.2rem 1fr; gap: 0.35rem 0.6rem; padding: 0.55rem 0.6rem; border-radius: 10px; margin-bottom: 0.4rem; background: color-mix(in srgb, var(--accent) 40%, #fff); }
.day-cols .now { outline: 2px solid var(--brand); background: #fff; }
.day-cols .done { opacity: 0.6; }
.day-cols .free { background: transparent; border: 1px dashed color-mix(in srgb, var(--brand) 30%, #ccc); color: var(--muted); }
.day-cols time { font-weight: 750; color: var(--muted); }
.day-cols span { grid-column: 2; color: var(--muted); font-size: 0.88rem; }

/* Cotizacion sheet */
.quote-sheet { background: #fff; border-radius: 16px; padding: 1.2rem; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); max-width: 40rem; }
.quote-sheet header { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.quote-sheet table { width: 100%; border-collapse: collapse; }
.quote-sheet td { padding: 0.55rem 0; border-bottom: 1px solid #eee; }
.quote-sheet .total td { font-weight: 800; border-bottom: 0; padding-top: 0.8rem; }

/* Fiado */
.saldo-hero { background: #fff; border-radius: 18px; padding: 1.4rem; text-align: center; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); margin-bottom: 0.85rem; }
.saldo-hero strong { display: block; font-family: Fraunces, Georgia, serif; font-size: 3.2rem; color: #9b2c2c; }
.movs { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
.movs li { display: grid; grid-template-columns: 5.5rem 1fr auto; gap: 0.5rem; background: #fff; padding: 0.7rem 0.8rem; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--brand) 12%, #ccc); }
.movs .ok { color: #1b5c3d; }

/* Comandas floor */
.is-comandas.app-shell { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 0.85rem; }
.floor { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.55rem; }
.table { appearance: none; border: 2px solid color-mix(in srgb, var(--brand) 25%, #ccc); background: #fff; border-radius: 16px; min-height: 90px; font: inherit; font-weight: 800; font-size: 1.3rem; cursor: default; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; }
.table span { font-size: 0.72rem; font-weight: 650; color: var(--muted); }
.table.free { opacity: 0.55; }
.table.busy { border-color: var(--brand); background: color-mix(in srgb, var(--accent) 45%, #fff); }
.table.hot { border-color: #c48a20; background: #fff6e4; }
.table.pay { border-color: #2f8a55; background: #e8f7ee; }
.kitchen { background: #1c1210; color: #f7f4ef; border-radius: 16px; padding: 1rem; }
.kitchen h2 { margin: 0 0 0.6rem; font-family: Fraunces, Georgia, serif; font-size: 1.1rem; }
.kitchen ul { margin: 0; padding-left: 0; list-style: none; display: grid; gap: 0.45rem; }
.kitchen li { padding: 0.55rem 0.6rem; background: rgba(255,255,255,0.08); border-radius: 8px; font-size: 0.92rem; }

/* Reservas occupancy */
.occ { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--brand) 18%, #ccc); }
.occ th, .occ td { border: 1px solid color-mix(in srgb, var(--brand) 12%, #ddd); padding: 0.65rem 0.4rem; text-align: center; font-size: 0.85rem; }
.occ tbody th { text-align: left; padding-left: 0.7rem; background: color-mix(in srgb, var(--accent) 40%, #fff); }
.occ .on { background: var(--brand); color: #fff; font-weight: 700; }
.occ .hold { background: #fff6e4; color: #8a5a10; font-weight: 700; }

@media (max-width: 860px) {
  .is-stock.app-shell, .is-visitas.app-shell, .is-eventos.app-shell, .is-comandas.app-shell, .scan-stage, .ficha-spread, .day-cols, .dispatch, .fleet-grid, .obra-cards, .kds, .pack-rail, .kanban.big, .mega-split { grid-template-columns: 1fr; }
  .floor { grid-template-columns: repeat(2, 1fr); }
  .map-fake { min-height: 240px; }
  .app-side { display: none; }
  .is-stock.app-shell { grid-template-columns: 1fr; }
}
"""


def theme_css(t: dict) -> str:
    return (
        ":root {\n"
        f"  --ink: {t['ink']}; --muted: {t['muted']}; --paper: {t['paper']}; --card: #fff;\n"
        f"  --brand: {t['brand']}; --accent: {t['accent']}; --band: {t['band']};\n"
        "}\n"
    )


def render(slug: str, s: dict) -> str:
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{FAV}
  <title>{s["title"]} — ejemplo de sistema</title>
  <meta name="description" content="{s["meta"]}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://webconreeb.com/demos/{slug}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web con REEB">
  <meta property="og:url" content="https://webconreeb.com/demos/{slug}/">
  <meta property="og:title" content="{s["title"]} — ejemplo de sistema">
  <meta property="og:description" content="{s["meta"]}">
  <meta property="og:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911h">
  <meta property="og:locale" content="es_AR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{s["title"]} — ejemplo de sistema">
  <meta name="twitter:description" content="{s["meta"]}">
  <meta name="twitter:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911h">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../sistemas-ui/app-shells.css?v={V}">
  <link rel="stylesheet" href="styles.css?v={V}">
</head>
<body class="sys-{slug}">
{s["shell"].strip()}
  <script src="../wa-float.js"></script>
</body>
</html>
'''


def main() -> None:
    (DEMOS / "sistemas-ui" / "app-shells.css").write_text(APP_CSS, encoding="utf-8")
    for slug, spec in PAGES.items():
        dest = DEMOS / slug
        if not dest.exists():
            print("skip", slug)
            continue
        # Preserve existing panel/styles extras: only overwrite index + theme vars
        (dest / "index.html").write_text(render(slug, spec), encoding="utf-8")
        (dest / "styles.css").write_text(theme_css(spec["theme"]), encoding="utf-8")
        print("ok", slug)


if __name__ == "__main__":
    main()
