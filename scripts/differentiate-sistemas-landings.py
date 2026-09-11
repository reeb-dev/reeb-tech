#!/usr/bin/env python3
"""Regenerate extra sistemas landings with distinct layout + caso UI per slug."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
CSS_V = "c10"

FAV = """  <link rel="icon" href="/favicon.ico?v=20260911fav" sizes="any">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=20260911fav" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/reeb-mark-16.png?v=20260911fav" type="image/png" sizes="16x16">
  <link rel="icon" href="/brand/reeb-mark.svg?v=20260911fav" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico?v=20260911fav">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=20260911fav" sizes="180x180">"""

# layout: split | fullbleed | board-first | timeline
# Each page gets unique theme + unique caso HTML
PAGES = {
    "ordenes": {
        "title": "Órdenes de trabajo",
        "short": "Órdenes",
        "span": "Taller · estados · aviso",
        "kicker": "Para su taller",
        "h1": "Sepa en qué auto están trabajando y qué falta entregar.",
        "lead": "Cuando entra un vehículo, queda anotado: qué le pasa, en qué paso está y cuándo avisar al dueño.",
        "layout": "board-first",
        "theme": {"ink": "#1a1814", "muted": "#6a5e52", "paper": "#f4efe6", "brand": "#7a4e2d", "accent": "#ead7c0"},
        "facts": [("Hoy", "4 órdenes"), ("Listos", "1"), ("En curso", "2")],
        "caso_titulo": "Tablero del taller (ejemplo)",
        "caso_lead": "Como un pizarrón: ingreso, en curso y listos.",
        "caso_html": """
<div class="kanban" aria-label="Tablero de órdenes">
  <div class="kanban-col"><h3>Ingreso</h3>
    <article><strong>OT-105</strong><span>Juan · Cronos · service</span></article>
    <article><strong>OT-107</strong><span>Pedro · Hilux · diagnóstico</span></article>
  </div>
  <div class="kanban-col is-mid"><h3>En curso</h3>
    <article><strong>OT-104</strong><span>María · Focus · frenos</span></article>
    <article><strong>OT-108</strong><span>Lucía · Gol · batería</span></article>
  </div>
  <div class="kanban-col is-ok"><h3>Listo</h3>
    <article><strong>OT-106</strong><span>Ana · Gol · listo para retirar</span></article>
  </div>
</div>""",
        "puede": [
            "Alta con patente, cliente y falla",
            "Estados: ingreso, en curso, listo, entregado",
            "Repuestos y mano de obra",
            "Fecha prometida",
            "Aviso al cliente",
            "Historial por vehículo",
        ],
        "steps": [
            ("Entra el trabajo", "Patente, cliente y qué pidió."),
            ("Avanza", "Lo marca en curso o listo."),
            ("Avisa", "Mensaje cuando puede retirar."),
        ],
        "caps": ["Taller", "Reparación", "Entrega", "Detalle"],
    },
    "stockalertas": {
        "title": "Stock y alertas",
        "short": "Stock",
        "span": "Depósito · mínimos · reposición",
        "kicker": "Para su depósito",
        "h1": "Sepa qué se está por acabar antes de que falte en góndola.",
        "lead": "Cada producto tiene un mínimo. Cuando baja, lo ve marcado para pedir reposición.",
        "layout": "split",
        "theme": {"ink": "#1a2218", "muted": "#5a6a52", "paper": "#eef3ea", "brand": "#4a6b2f", "accent": "#d8e6c8"},
        "facts": [("Alertas", "3 hoy"), ("Ítems", "48"), ("Ok", "45")],
        "caso_titulo": "Hoy en el depósito",
        "caso_lead": "Rojo = pedir. Verde = alcanza.",
        "caso_html": """
<ul class="alert-board">
  <li class="is-bad"><strong>Aceite 900 ml</strong><span>6 en stock · mínimo 10</span><b>Pedir</b></li>
  <li class="is-bad"><strong>Detergente</strong><span>4 en stock · mínimo 8</span><b>Pedir</b></li>
  <li class="is-bad"><strong>Yerba 500 g</strong><span>3 en stock · mínimo 12</span><b>Pedir</b></li>
  <li class="is-ok"><strong>Arroz 1 kg</strong><span>22 en stock · mínimo 15</span><b>Ok</b></li>
  <li class="is-ok"><strong>Fideos 500 g</strong><span>40 en stock · mínimo 20</span><b>Ok</b></li>
</ul>""",
        "puede": [
            "Stock con mínimo",
            "Entradas y salidas",
            "Alertas de reposición",
            "Lista para el proveedor",
            "Búsqueda por nombre",
            "Resumen del día",
        ],
        "steps": [
            ("Carga el producto", "Nombre, cantidad y mínimo."),
            ("Suma o resta", "Cuando entra o se vende."),
            ("Revisa alertas", "Lo que hay que pedir."),
        ],
        "caps": ["Depósito", "Góndola", "Cajas", "Estantería"],
    },
    "visitas": {
        "title": "Visitas y técnicos",
        "short": "Visitas",
        "span": "A domicilio · ruta · llegada",
        "kicker": "Para servicio a domicilio",
        "h1": "Sepa a qué casa va cada técnico y si ya llegó.",
        "lead": "La visita queda con dirección, horario y técnico. Cuando llega, se marca.",
        "layout": "timeline",
        "theme": {"ink": "#142018", "muted": "#4e6556", "paper": "#eaf3ec", "brand": "#1f6b45", "accent": "#cfe8d6"},
        "facts": [("Ruta", "5"), ("En camino", "2"), ("Hechas", "1")],
        "caso_titulo": "Ruta de Diego · hoy",
        "caso_lead": "Línea del día: hecha, en camino o pendiente.",
        "caso_html": """
<ol class="route-line">
  <li class="is-ok"><time>09:00</time><div><strong>Lo de Rosa</strong><span>Centro · hecha</span></div></li>
  <li class="is-warn"><time>11:00</time><div><strong>Ferretería Sol</strong><span>Norte · en camino</span></div></li>
  <li><time>14:30</time><div><strong>Sra. Gómez</strong><span>Sur · pendiente</span></div></li>
  <li><time>16:00</time><div><strong>Café Mayo</strong><span>Centro · pendiente</span></div></li>
  <li><time>17:30</time><div><strong>Taller Sur</strong><span>Oeste · pendiente</span></div></li>
</ol>""",
        "puede": [
            "Agenda con dirección y franja",
            "Asignación de técnico",
            "Orden de la ruta",
            "Check-in al llegar",
            "Nota de lo hecho",
            "Aviso al cliente",
        ],
        "steps": [
            ("Anota la visita", "Cliente, dirección y franja."),
            ("Asigna técnico", "Quién sale."),
            ("Marca llegada", "Queda el check-in."),
        ],
        "caps": ["Campo", "Instalación", "Servicio", "Herramientas"],
    },
    "takeaway": {
        "title": "Pedidos para llevar",
        "short": "Para llevar",
        "span": "Mostrador · cola · listo",
        "kicker": "Para mostrador",
        "h1": "La cola de pedidos listos para retirar, en orden.",
        "lead": "El pedido entra, se prepara y pasa a listo. El cliente retira; no es una mesa del salón.",
        "layout": "board-first",
        "theme": {"ink": "#221810", "muted": "#6b5848", "paper": "#f7f0e8", "brand": "#b45a1e", "accent": "#f0d8c0"},
        "facts": [("En cola", "3"), ("Listos", "2"), ("Hoy", "8")],
        "caso_titulo": "Cola del mediodía",
        "caso_lead": "Números grandes: lo que el mostrador ve.",
        "caso_html": """
<div class="ticket-rail">
  <article class="is-ready"><em>#41</em><strong>Carla</strong><span>2 milanesas + papas</span><b>Listo</b></article>
  <article class="is-ready"><em>#44</em><strong>Luis</strong><span>Tarta jamón y queso</span><b>Listo</b></article>
  <article class="is-prep"><em>#42</em><strong>Martín</strong><span>Empanadas x12</span><b>En prep.</b></article>
  <article><em>#43</em><strong>Sofía</strong><span>Pollo + ensalada</span><b>Recibido</b></article>
</div>""",
        "puede": [
            "Pedido con nombre y detalle",
            "Estados de la cola",
            "Número de orden",
            "Horario de retiro",
            "Cola del mediodía",
            "Cierre al entregar",
        ],
        "steps": [
            ("Entra el pedido", "Nombre y qué lleva."),
            ("Se prepara", "En preparación o listo."),
            ("Se entrega", "Al retirar, queda cerrado."),
        ],
        "caps": ["Mostrador", "Preparación", "Retiro", "Pedido"],
    },
    "cuotas": {
        "title": "Cobros y cuotas",
        "short": "Cuotas",
        "span": "Planes · vencimientos · mora",
        "kicker": "Para ventas en cuotas",
        "h1": "Sepa quién paga este mes y quién está atrasado.",
        "lead": "Cada venta tiene un plan de cuotas. Ve vencimientos y marca lo cobrado.",
        "layout": "split",
        "theme": {"ink": "#1c1a14", "muted": "#6a6254", "paper": "#f6f1e4", "brand": "#8a6a20", "accent": "#ebe0c0"},
        "facts": [("Planes", "12"), ("Vencen", "4"), ("Mora", "2")],
        "caso_titulo": "Cuotas de marzo",
        "caso_lead": "Barras: cuánto lleva pagado cada plan.",
        "caso_html": """
<div class="bars-board">
  <div class="bar-row"><span>Familia Ríos · heladera 3/6</span><div class="bar"><i style="--p:50%"></i></div><b class="is-ok">Pagada</b></div>
  <div class="bar-row"><span>Sr. Acosta · TV 5/12</span><div class="bar is-warn"><i style="--p:42%"></i></div><b class="is-warn">Vence</b></div>
  <div class="bar-row"><span>Sra. Méndez · lavarropas 2/10</span><div class="bar is-bad"><i style="--p:20%"></i></div><b class="is-bad">Atrasada</b></div>
  <div class="bar-row"><span>Comercio Luz · notebook 1/8</span><div class="bar"><i style="--p:12%"></i></div><b class="is-ok">Pagada</b></div>
</div>""",
        "puede": [
            "Alta del plan",
            "Calendario de vencimientos",
            "Marcar cuota pagada",
            "Quién vence este mes",
            "Quién está atrasado",
            "Saldo restante",
        ],
        "steps": [
            ("Arma el plan", "Monto, cuotas y cliente."),
            ("Cobra", "Marca cada cuota."),
            ("Recuerda", "Quién vence o debe."),
        ],
        "caps": ["Comercio", "Cobro", "Plan", "Mostrador"],
    },
    "obra": {
        "title": "Presupuesto de obra",
        "short": "Obra",
        "span": "Etapas · avance · extras",
        "kicker": "Para reformas",
        "h1": "La obra por etapas, con el porcentaje a la vista.",
        "lead": "Cada reforma se parte en etapas. Usted marca el avance y los extras quedan anotados.",
        "layout": "fullbleed",
        "theme": {"ink": "#1c1812", "muted": "#6a5e4e", "paper": "#f3ebe0", "brand": "#8a6230", "accent": "#e6d4b8"},
        "facts": [("Activas", "3"), ("Avance", "55%"), ("Extras", "2")],
        "caso_titulo": "Obras en curso",
        "caso_lead": "Cada reforma con su avance.",
        "caso_html": """
<div class="obra-board">
  <article><header><strong>Cocina Belgrano</strong><span>Familia Ortiz</span></header><div class="meter"><i style="--p:70%"></i></div><p>Revestimientos · 70%</p></article>
  <article><header><strong>Baño Palermo</strong><span>Sra. Vega</span></header><div class="meter"><i style="--p:25%"></i></div><p>Demolición · 25%</p></article>
  <article><header><strong>Local Centro</strong><span>Comercial Sur</span></header><div class="meter"><i style="--p:40%"></i></div><p>Instalaciones · 40%</p></article>
</div>""",
        "puede": [
            "Presupuesto por etapas",
            "Porcentaje de avance",
            "Extras",
            "Montos parciales",
            "Estado de la obra",
            "Resumen para el cliente",
        ],
        "steps": [
            ("Arma el presupuesto", "Etapas y montos."),
            ("Actualiza avance", "Porcentaje por etapa."),
            ("Suma extras", "Quedan por escrito."),
        ],
        "caps": ["Obra", "Reforma", "Planos", "Obra viva"],
    },
    "fichas": {
        "title": "Fichas",
        "short": "Fichas",
        "span": "Historial · próximo control",
        "kicker": "Para consultorio o veterinaria",
        "h1": "La historia del paciente o la mascota, en una sola ficha.",
        "lead": "Guarda qué se hizo y cuándo vuelve. Los turnos del día pueden ir en otro sistema.",
        "layout": "split",
        "theme": {"ink": "#161c24", "muted": "#556070", "paper": "#eef1f6", "brand": "#3d5578", "accent": "#d4dce8"},
        "facts": [("Fichas", "26"), ("Esta semana", "5"), ("Hoy", "2")],
        "caso_titulo": "Próximos controles",
        "caso_lead": "Tarjetas de ficha, no una planilla larga.",
        "caso_html": """
<div class="ficha-grid">
  <article><strong>Luna</strong><span>Mascota · caniche</span><p>Última 02/09 · <b>Vacunas 16/09</b></p></article>
  <article><strong>Sr. Molina</strong><span>Paciente</span><p>Última 28/08 · <b>Control 11/09</b></p></article>
  <article><strong>Michi</strong><span>Mascota · gato</span><p>Última 01/09 · <b>Control 22/09</b></p></article>
  <article><strong>Sra. Paredes</strong><span>Paciente</span><p>Última 05/09 · <b>Seguimiento 19/09</b></p></article>
</div>""",
        "puede": [
            "Ficha con datos básicos",
            "Registro de cada visita",
            "Próximo control",
            "Alertas cercanas",
            "Búsqueda por nombre",
            "Notas del profesional",
        ],
        "steps": [
            ("Abre la ficha", "Datos básicos."),
            ("Anota la visita", "Qué se hizo."),
            ("Programa el control", "Próxima fecha."),
        ],
        "caps": ["Atención", "Equipo", "Consulta", "Detalle"],
    },
    "flota": {
        "title": "Flota del local",
        "short": "Flota",
        "span": "Service · vencimientos · km",
        "kicker": "Para vehículos del negocio",
        "h1": "Los utilitarios del local, con service y papeles al día.",
        "lead": "Patente, kilómetros, próximo service y vencimientos. Son vehículos suyos.",
        "layout": "split",
        "theme": {"ink": "#151c22", "muted": "#55616c", "paper": "#eef1f4", "brand": "#2a3540", "accent": "#d0d8e0"},
        "facts": [("Unidades", "5"), ("Service", "2 cerca"), ("Vence", "1")],
        "caso_titulo": "Unidades propias",
        "caso_lead": "Qué hay que atender este mes.",
        "caso_html": """
<table class="fleet-table">
  <thead><tr><th>Patente</th><th>Vehículo</th><th>Km</th><th>Atención</th></tr></thead>
  <tbody>
    <tr><td>AB 123 CD</td><td>S10 blanca</td><td>86.400</td><td class="is-warn">Service 90.000</td></tr>
    <tr><td>AF 450 JK</td><td>Partner</td><td>112.200</td><td class="is-bad">Patente oct.</td></tr>
    <tr><td>AE 778 MN</td><td>Cronos</td><td>54.100</td><td class="is-ok">Al día</td></tr>
    <tr><td>AD 901 PQ</td><td>Kangoo</td><td>98.050</td><td class="is-warn">VTV nov.</td></tr>
  </tbody>
</table>""",
        "puede": [
            "Alta de unidades",
            "Último y próximo service",
            "Vencimientos",
            "Alertas del mes",
            "Historial de km",
            "Quién usa cada vehículo",
        ],
        "steps": [
            ("Carga la unidad", "Patente, modelo y km."),
            ("Anota el service", "Último y próximo."),
            ("Mira vencimientos", "Patente, VTV y similares."),
        ],
        "caps": ["Flota", "Utilitario", "Service", "Ruta"],
    },
    "eventos": {
        "title": "Eventos y salón",
        "short": "Eventos",
        "span": "Fecha · seña · checklist",
        "kicker": "Para salón de fiestas",
        "h1": "Cada evento con fecha, seña y lista de lo que falta.",
        "lead": "Casamiento, quince o corporativo: fecha, menú, seña y checklist del día.",
        "layout": "fullbleed",
        "theme": {"ink": "#221018", "muted": "#6b4e5a", "paper": "#f7eef2", "brand": "#8a3a62", "accent": "#edd0dc"},
        "facts": [("Este mes", "4"), ("Seña ok", "3"), ("Pendiente", "1")],
        "caso_titulo": "Agenda del salón",
        "caso_lead": "Calendario del mes, no una tabla fría.",
        "caso_html": """
<ul class="agenda-month">
  <li><time>20/09</time><div><strong>Quince Sofía</strong><span>Seña 50% · confirmado</span></div></li>
  <li><time>27/09</time><div><strong>Casamiento Ríos</strong><span>Seña 30% · parcial</span></div></li>
  <li><time>04/10</time><div><strong>Cumpleaños 50</strong><span>Checklist listo</span></div></li>
  <li><time>11/10</time><div><strong>Cena empresa</strong><span>Consulta · sin seña</span></div></li>
</ul>""",
        "puede": [
            "Reserva de fecha",
            "Invitados y menú",
            "Seña y saldo",
            "Checklist del día",
            "Contacto del organizador",
            "Agenda del mes",
        ],
        "steps": [
            ("Reserva la fecha", "Tipo de evento y menú."),
            ("Cobra la seña", "Estado de pago."),
            ("Arma el día", "Checklist de salón."),
        ],
        "caps": ["Salón", "Fiesta", "Servicio", "Espacio"],
    },
    "abonos": {
        "title": "Abonos",
        "short": "Abonos",
        "span": "Mensual · altas · mora",
        "kicker": "Para cuota mensual",
        "h1": "Quién está al día con el abono y quién debe el mes.",
        "lead": "Gimnasio, club o mantenimiento: altas, cobro del mes y mora a la vista.",
        "layout": "board-first",
        "theme": {"ink": "#102028", "muted": "#4e6570", "paper": "#e8f2f4", "brand": "#1a7080", "accent": "#c5e4ea"},
        "facts": [("Abonados", "84"), ("Al día", "71"), ("Mora", "13")],
        "caso_titulo": "Septiembre en números",
        "caso_lead": "Dos números grandes: al día vs. mora.",
        "caso_html": """
<div class="stat-split">
  <div class="is-ok"><strong>71</strong><span>Al día</span></div>
  <div class="is-bad"><strong>13</strong><span>Deben el mes</span></div>
</div>
<ul class="mora-list">
  <li>Ana Pérez · mensual · <b>Debe</b></li>
  <li>Club Norte · empresa · <b>Pagado</b></li>
  <li>Diego Sosa · trimestral · <b>Pagado</b></li>
</ul>""",
        "puede": [
            "Alta de socio",
            "Planes (mensual, trimestral, empresa)",
            "Cobro del mes",
            "Lista de mora",
            "Bajas o pausas",
            "Resumen al día vs. debe",
        ],
        "steps": [
            ("Da el alta", "Persona y plan."),
            ("Cobra el mes", "Queda marcado."),
            ("Revisa mora", "Quién no pagó."),
        ],
        "caps": ["Local", "Atención", "Equipo", "Servicio"],
    },
    "mayorista": {
        "title": "Pedidos mayoristas",
        "short": "Mayorista",
        "span": "B2B · mínimo · despacho",
        "kicker": "Para venta mayorista",
        "h1": "Pedidos de comercios con lista de precio y mínimo.",
        "lead": "El cliente mayorista pide por lista. Usted controla mínimo, arma el despacho y sigue el estado.",
        "layout": "split",
        "theme": {"ink": "#121826", "muted": "#566078", "paper": "#eef0f7", "brand": "#2f4580", "accent": "#d0d6ea"},
        "facts": [("Abiertos", "6"), ("Despacho", "2"), ("Hoy", "1")],
        "caso_titulo": "Pedidos B2B abiertos",
        "caso_lead": "Tickets de pedido, como en el depósito.",
        "caso_html": """
<div class="ticket-stack">
  <article><strong>Kiosco Lo de Ana</strong><span>Yerba x20 · $98.000</span><b class="is-warn">Despacho</b></article>
  <article><strong>Almacén Sur</strong><span>Aceite x40 · $74.000</span><b>Armando</b></article>
  <article><strong>Rotisería Sol</strong><span>Harina x30 · $22.500</span><b class="is-ok">Nuevo</b></article>
  <article><strong>Café Centro</strong><span>Vasos x10 · $18.000</span><b class="is-ok">Entregado</b></article>
</div>""",
        "puede": [
            "Clientes con lista propia",
            "Pedido por ítems",
            "Compra mínima",
            "Armado y despacho",
            "Estados del pedido",
            "Historial por comercio",
        ],
        "steps": [
            ("Recibe el pedido", "Sobre la lista del cliente."),
            ("Controla mínimo", "Si no llega, lo ve."),
            ("Despacha", "Enviado o entregado."),
        ],
        "caps": ["Depósito", "Cajas", "Lista", "Despacho"],
    },
    "reparto": {
        "title": "Reparto",
        "short": "Reparto",
        "span": "Zona · chofer · entrega",
        "kicker": "Para entregas a domicilio",
        "h1": "Quién lleva cada pedido y en qué zona está.",
        "lead": "Dirección, zona, chofer y estado: salió, en camino o entregado.",
        "layout": "timeline",
        "theme": {"ink": "#142016", "muted": "#526056", "paper": "#eaf2ea", "brand": "#3a7a3a", "accent": "#d0e6d0"},
        "facts": [("Hoy", "9"), ("En camino", "3"), ("Entregados", "5")],
        "caso_titulo": "Tarde de reparto",
        "caso_lead": "Estado en vivo de cada envío.",
        "caso_html": """
<ul class="ship-board">
  <li class="is-ok"><span class="dot"></span><div><strong>16:10 · Centro</strong><span>Pablo · entregado</span></div></li>
  <li class="is-warn"><span class="dot"></span><div><strong>16:40 · Norte</strong><span>Pablo · en camino</span></div></li>
  <li><span class="dot"></span><div><strong>17:00 · Sur</strong><span>María · salió</span></div></li>
  <li><span class="dot"></span><div><strong>17:30 · Oeste</strong><span>María · pendiente</span></div></li>
</ul>""",
        "puede": [
            "Alta con dirección y zona",
            "Asignación de chofer",
            "Estados del envío",
            "Lista de la tarde",
            "Demoras o reintentos",
            "Resumen por chofer",
        ],
        "steps": [
            ("Carga la entrega", "Dirección y zona."),
            ("Asigna chofer", "Quién sale."),
            ("Cierra el envío", "Entregado o demorado."),
        ],
        "caps": ["Ruta", "Utilitario", "Entrega", "Ciudad"],
    },
    "contratos": {
        "title": "Contratos",
        "short": "Contratos",
        "span": "Vencimientos · renovación",
        "kicker": "Para alquileres o servicios",
        "h1": "Contratos vigentes y cuáles vencen pronto.",
        "lead": "Fecha de inicio, fin y renovación. No reemplaza la web de propiedades.",
        "layout": "split",
        "theme": {"ink": "#12201e", "muted": "#4e6662", "paper": "#e8f2f0", "brand": "#1f6b62", "accent": "#c8e4de"},
        "facts": [("Vigentes", "18"), ("Vencen", "3"), ("Renovados", "2")],
        "caso_titulo": "Vencen este mes",
        "caso_lead": "Calendario de renovaciones.",
        "caso_html": """
<ul class="date-board">
  <li class="is-bad"><strong>30/09</strong><div><em>Alq. Mitre 120</em><span>Sra. López · a renovar</span></div></li>
  <li class="is-warn"><strong>01/10</strong><div><em>Mantenimiento red</em><span>Estudio Norte · a renovar</span></div></li>
  <li class="is-ok"><strong>15/10</strong><div><em>Alq. local Sur</em><span>Comercio Paz · vigente</span></div></li>
  <li class="is-ok"><strong>28/11</strong><div><em>Cochera 4</em><span>Sr. Gómez · vigente</span></div></li>
</ul>""",
        "puede": [
            "Alta de contrato",
            "Vigentes vs. por vencer",
            "Aviso de renovación",
            "Renovación o cierre",
            "Notas de referencia",
            "Calendario del mes",
        ],
        "steps": [
            ("Carga el contrato", "Partes, fechas y monto."),
            ("Sigue vencimientos", "Los del mes arriba."),
            ("Renueva o cierra", "Estado actualizado."),
        ],
        "caps": ["Inmueble", "Interior", "Entorno", "Propiedad"],
    },
    "inventario": {
        "title": "Inventario",
        "short": "Inventario",
        "span": "Código · planillas · stock",
        "kicker": "Para depósito con código",
        "h1": "Stock con código de barras o QR y la planilla del proveedor.",
        "lead": "Cada producto tiene código. Puede escanearlo e importar la lista del proveedor.",
        "layout": "board-first",
        "theme": {"ink": "#1a1620", "muted": "#5e5670", "paper": "#f0eef6", "brand": "#5a3d8a", "accent": "#ddd0f0"},
        "facts": [("Ítems", "5+"), ("Códigos", "barras/QR"), ("Planilla", "Excel/CSV")],
        "caso_titulo": "Productos con código",
        "caso_lead": "Código + stock + alerta.",
        "caso_html": """
<div class="scan-board">
  <article><code>779…1001</code><strong>Aceite 900 ml</strong><span>24 u.</span><b class="is-ok">Ok</b></article>
  <article class="is-bad"><code>779…2008</code><strong>Arroz 1 kg</strong><span>8 u.</span><b>Pedir</b></article>
  <article><code>779…3005</code><strong>Fideos 500 g</strong><span>40 u.</span><b class="is-ok">Ok</b></article>
  <article><code>QR-77821</code><strong>Resma A4</strong><span>18 u.</span><b class="is-ok">Ok</b></article>
</div>
<p class="scan-hint">En el panel se importa la planilla del proveedor (Excel o CSV) y se escanea con lector o cámara.</p>""",
        "puede": [
            "Alta con código de barras o QR",
            "Escaneo para sumar o restar",
            "Importar Excel/CSV del proveedor",
            "Stock y movimientos",
            "Proveedores",
            "Búsqueda por código",
        ],
        "steps": [
            ("Carga o importa", "A mano o con la planilla."),
            ("Escanea", "Lector, cámara o tipeo."),
            ("Controla", "Entradas, salidas y mínimos."),
        ],
        "caps": ["Depósito", "Cajas", "Estantería", "Logística"],
    },
}


SHARED_LAYOUT_CSS = """
/* Layout variants for distinct landings */
body.layout-fullbleed .hero {
  display: block;
  padding: 0;
  margin: 0 0 1.5rem;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line);
  min-height: 420px;
  position: relative;
  background: #111;
  color: #f7f4ef;
}
body.layout-fullbleed .hero > div:first-child {
  position: relative;
  z-index: 2;
  padding: 2.2rem 1.6rem 2rem;
  max-width: 40rem;
}
body.layout-fullbleed .hero .hero-stage {
  position: absolute;
  inset: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
}
body.layout-fullbleed .hero .hero-stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
}
body.layout-fullbleed .hero .cap { display: none; }
body.layout-fullbleed .hero .kicker { color: color-mix(in srgb, var(--accent) 70%, #fff); }
body.layout-fullbleed .hero .lead { color: rgba(247,244,239,0.86); }
body.layout-fullbleed .hero .hero-facts { color: rgba(247,244,239,0.8); }
body.layout-fullbleed .hero .hero-facts strong { color: #fff; }
body.layout-fullbleed .hero .btn-quiet {
  border-color: rgba(255,255,255,0.35);
  color: #fff;
}

body.layout-board-first .hero { margin-bottom: 0.5rem; }
body.layout-board-first .caso-dia {
  margin-top: 0;
  border-radius: 0 0 18px 18px;
}

body.layout-timeline .route-line,
body.layout-timeline .ship-board {
  max-width: 36rem;
}

/* Shared caso widgets */
.kanban {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}
.kanban-col {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.75rem;
  min-height: 12rem;
}
.kanban-col h3 {
  margin: 0 0 0.65rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.kanban-col article {
  background: color-mix(in srgb, var(--accent) 45%, #fff);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.65rem 0.7rem;
  margin-bottom: 0.5rem;
}
.kanban-col article strong { display: block; font-size: 0.95rem; }
.kanban-col article span { color: var(--muted); font-size: 0.85rem; }
.kanban-col.is-mid { border-top: 3px solid var(--brand); }
.kanban-col.is-ok { border-top: 3px solid #2f8a55; }

.alert-board { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.alert-board li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.15rem 0.75rem;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
}
.alert-board li span { grid-column: 1; color: var(--muted); font-size: 0.88rem; }
.alert-board li b { grid-row: 1 / span 2; align-self: center; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase; }
.alert-board .is-bad { border-color: #e2b4b4; background: #fff5f5; }
.alert-board .is-bad b { color: #9b2c2c; }
.alert-board .is-ok b { color: #1b5c3d; }

.route-line { list-style: none; margin: 0; padding: 0 0 0 0.4rem; border-left: 3px solid var(--brand); }
.route-line li {
  position: relative;
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.75rem;
  padding: 0 0 1.1rem 1.1rem;
}
.route-line li::before {
  content: "";
  position: absolute;
  left: -0.55rem;
  top: 0.25rem;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--brand);
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px var(--brand);
}
.route-line .is-ok::before { background: #2f8a55; box-shadow: 0 0 0 2px #2f8a55; }
.route-line .is-warn::before { background: #c48a20; box-shadow: 0 0 0 2px #c48a20; }
.route-line time { font-weight: 750; color: var(--muted); }
.route-line strong { display: block; }
.route-line span { color: var(--muted); font-size: 0.9rem; }

.ticket-rail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}
.ticket-rail article {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 0.9rem;
  display: grid;
  gap: 0.2rem;
}
.ticket-rail em {
  font-style: normal;
  font-size: 1.6rem;
  font-family: Fraunces, Georgia, serif;
  font-weight: 600;
  color: var(--brand);
}
.ticket-rail.is-ready,
.ticket-rail article.is-ready { border-color: #2f8a55; background: #f0faf4; }
.ticket-rail article.is-prep { border-color: #c48a20; background: #fff8ea; }
.ticket-rail b {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.bars-board { display: grid; gap: 0.85rem; }
.bar-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.35rem 0.75rem;
  align-items: center;
}
.bar-row .bar {
  grid-column: 1 / -1;
  height: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 50%, #fff);
  overflow: hidden;
}
.bar-row .bar i {
  display: block;
  height: 100%;
  width: var(--p, 40%);
  background: var(--brand);
  border-radius: inherit;
}
.bar-row .bar.is-warn i { background: #c48a20; }
.bar-row .bar.is-bad i { background: #b04040; }
.is-ok { color: #1b5c3d; }
.is-warn { color: #8a5a10; }
.is-bad { color: #9b2c2c; }

.obra-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}
.obra-board article {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 0.9rem;
}
.obra-board header { margin-bottom: 0.65rem; }
.obra-board header strong { display: block; }
.obra-board header span { color: var(--muted); font-size: 0.88rem; }
.obra-board .meter {
  height: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 55%, #fff);
  overflow: hidden;
  margin-bottom: 0.45rem;
}
.obra-board .meter i {
  display: block;
  height: 100%;
  width: var(--p, 40%);
  background: var(--brand);
}
.obra-board p { margin: 0; color: var(--muted); font-size: 0.9rem; }

.ficha-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}
.ficha-grid article {
  background: #fff;
  border: 1px solid var(--line);
  border-left: 4px solid var(--brand);
  border-radius: 12px;
  padding: 0.85rem 0.9rem;
}
.ficha-grid strong { display: block; font-size: 1.05rem; }
.ficha-grid span { color: var(--muted); font-size: 0.85rem; }
.ficha-grid p { margin: 0.45rem 0 0; font-size: 0.9rem; }

.fleet-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line);
}
.fleet-table th, .fleet-table td {
  padding: 0.75rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid var(--line);
  font-size: 0.95rem;
}
.fleet-table th {
  background: var(--brand);
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.fleet-table tr:last-child td { border-bottom: 0; }

.agenda-month { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.agenda-month li {
  display: grid;
  grid-template-columns: 4.2rem 1fr;
  gap: 0.85rem;
  padding: 0.85rem 0.9rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.agenda-month time {
  font-family: Fraunces, Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--brand);
}
.agenda-month strong { display: block; }
.agenda-month span { color: var(--muted); font-size: 0.9rem; }

.stat-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.stat-split > div {
  text-align: center;
  padding: 1.2rem 0.8rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: #fff;
}
.stat-split strong {
  display: block;
  font-family: Fraunces, Georgia, serif;
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 0.35rem;
}
.stat-split .is-ok { background: #eef8f1; border-color: #b7dfc4; }
.stat-split .is-bad { background: #fff1f1; border-color: #e8bcbc; }
.mora-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
.mora-list li {
  padding: 0.65rem 0.8rem;
  background: #fff;
  border-radius: 10px;
  border: 1px solid var(--line);
  font-size: 0.95rem;
}

.ticket-stack { display: grid; gap: 0.55rem; }
.ticket-stack article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.15rem 0.75rem;
  padding: 0.85rem 0.95rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.ticket-stack span { grid-column: 1; color: var(--muted); font-size: 0.88rem; }
.ticket-stack b {
  grid-row: 1 / span 2;
  align-self: center;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ship-board { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.ship-board li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.8rem 0.9rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--line);
}
.ship-board .dot {
  width: 0.7rem;
  height: 0.7rem;
  margin-top: 0.35rem;
  border-radius: 50%;
  background: #8aa0a8;
  flex: 0 0 auto;
}
.ship-board .is-ok .dot { background: #2f8a55; }
.ship-board .is-warn .dot { background: #c48a20; }
.ship-board strong { display: block; }
.ship-board span { color: var(--muted); font-size: 0.9rem; }

.date-board { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
.date-board li {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.85rem;
  padding: 0.85rem 0.95rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left-width: 5px;
}
.date-board .is-bad { border-left-color: #b04040; }
.date-board .is-warn { border-left-color: #c48a20; }
.date-board .is-ok { border-left-color: #2f8a55; }
.date-board strong {
  font-family: Fraunces, Georgia, serif;
  font-size: 1.05rem;
}
.date-board em { font-style: normal; font-weight: 700; display: block; }
.date-board span { color: var(--muted); font-size: 0.88rem; }

.scan-board { display: grid; gap: 0.5rem; }
.scan-board article {
  display: grid;
  grid-template-columns: 7rem 1fr auto auto;
  gap: 0.5rem 0.75rem;
  align-items: center;
  padding: 0.75rem 0.85rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.scan-board code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  color: var(--brand);
  background: color-mix(in srgb, var(--accent) 55%, #fff);
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
}
.scan-board.is-bad,
.scan-board article.is-bad { background: #fff5f5; border-color: #e2b4b4; }
.scan-board b { font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; }
.scan-hint { margin: 0.75rem 0 0; color: var(--muted); font-size: 0.9rem; }

@media (max-width: 800px) {
  .kanban, .obra-board, .ficha-grid, .ticket-rail { grid-template-columns: 1fr; }
  .scan-board article { grid-template-columns: 1fr 1fr; }
  .scan-board code { grid-column: 1 / -1; }
}
"""


def theme_css(t: dict) -> str:
    return (
        ":root {\n"
        f"  --ink: {t['ink']}; --muted: {t['muted']}; --paper: {t['paper']}; --card: #fff;\n"
        f"  --line: color-mix(in srgb, {t['brand']} 22%, #c8d0d0); --brand: {t['brand']}; --accent: {t['accent']};\n"
        "}\n"
    )


def render(slug: str, s: dict) -> str:
    facts = "".join(f"<li><strong>{a}</strong>{b}</li>" for a, b in s["facts"])
    steps = "".join(
        f'<article class="step"><strong>{t}</strong><p>{p}</p></article>' for t, p in s["steps"]
    )
    puede = "".join(f"<li>{item}</li>" for item in s["puede"])
    img_dir = DEMOS / slug / "img"
    figs = []
    caps = s["caps"]
    for i, fn in enumerate(["hero.jpg", "galeria-1.jpg", "galeria-2.jpg", "galeria-3.jpg"]):
        if (img_dir / fn).exists():
            cap = caps[i] if i < len(caps) else "Detalle"
            figs.append(
                f'<figure><img src="img/{fn}" alt="{cap}"><figcaption>{cap}</figcaption></figure>'
            )
    gallery = "".join(figs)
    layout = s["layout"]
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{FAV}
  <title>{s["title"]} — ejemplo de sistema</title>
  <meta name="description" content="{s["lead"]}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://webconreeb.com/demos/{slug}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web con REEB">
  <meta property="og:url" content="https://webconreeb.com/demos/{slug}/">
  <meta property="og:title" content="{s["title"]} — ejemplo de sistema">
  <meta property="og:description" content="{s["lead"]}">
  <meta property="og:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911h">
  <meta property="og:locale" content="es_AR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{s["title"]} — ejemplo de sistema">
  <meta name="twitter:description" content="{s["lead"]}">
  <meta name="twitter:image" content="https://webconreeb.com/demos/{slug}/og.jpg?v=20260911h">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../sistemas-ui/base.css?v={CSS_V}">
  <link rel="stylesheet" href="../sistemas-ui/layouts.css?v={CSS_V}">
  <link rel="stylesheet" href="styles.css?v={CSS_V}">
</head>
<body class="sys-{slug} layout-{layout}">
  <header class="band">
    <div class="band-inner">
      <a class="brand" href="index.html"><strong>{s["short"]}</strong><span>{s["span"]}</span></a>
      <nav>
        <a href="#caso">Ejemplo de hoy</a>
        <a href="#puede">Qué puede hacer</a>
        <a href="#como">Cómo funciona</a>
        <a href="#galeria">Fotos</a>
        <a class="btn" href="#caso">Ver el ejemplo</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <div>
        <p class="kicker">{s["kicker"]}</p>
        <h1>{s["h1"]}</h1>
        <p class="lead">{s["lead"]}</p>
        <div class="hero-actions">
          <a class="btn" href="#caso">Ver el ejemplo de hoy</a>
          <a class="btn btn-quiet" href="/demos/#sistemas-gestion">Volver al catálogo</a>
        </div>
        <ul class="hero-facts">{facts}</ul>
      </div>
      <div class="hero-stage">
        <img src="img/hero.jpg" alt="{s["title"]}">
        <div class="cap"><strong>{s["short"]}</strong><span>Ejemplo · datos inventados</span></div>
      </div>
    </section>

    <section class="section caso-dia" id="caso">
      <p class="kicker">Caso real (simulado)</p>
      <h2>{s["caso_titulo"]}</h2>
      <p class="section-lead">{s["caso_lead"]}</p>
      {s["caso_html"].strip()}
      <p class="caso-note">Los nombres y números son de muestra. En un trabajo a medida se cargan los suyos.</p>
      <div class="hero-actions" style="margin-top:1rem">
        <a class="btn" href="panel.html">Abrir el panel de ejemplo</a>
      </div>
    </section>

    <section class="section" id="puede">
      <p class="kicker">En este ejemplo</p>
      <h2>Qué puede hacer</h2>
      <p class="section-lead">Lista concreta del día a día de este rubro.</p>
      <ul class="puede-list">{puede}</ul>
    </section>

    <section class="section" id="como">
      <p class="kicker">En pasos</p>
      <h2>Cómo se usa</h2>
      <p class="section-lead">Sin términos técnicos.</p>
      <div class="steps">{steps}</div>
    </section>

    <section class="section" id="galeria">
      <p class="kicker">Fotos</p>
      <h2>Ambiente de referencia</h2>
      <p class="section-lead">Imágenes de referencia. En su sistema se usan las suyas.</p>
      <div class="gallery">{gallery}</div>
    </section>

    <div class="cta-band">
      <p class="kicker" style="color:#e3c48a">A medida</p>
      <h2>¿Le sirve esto a su local?</h2>
      <p>Se cotiza y se entrega para usted. No es un software de suscripción genérico.</p>
      <a class="btn" href="#contacto">Consultar</a>
    </div>
  </main>
  <script src="../contacto.js"></script>
  <script src="../wa-float.js"></script>
</body>
</html>
'''


def main() -> None:
    layouts = DEMOS / "sistemas-ui" / "layouts.css"
    layouts.write_text(SHARED_LAYOUT_CSS, encoding="utf-8")
    for slug, spec in PAGES.items():
        dest = DEMOS / slug
        if not dest.exists():
            print("skip", slug)
            continue
        (dest / "index.html").write_text(render(slug, spec), encoding="utf-8")
        (dest / "styles.css").write_text(theme_css(spec["theme"]), encoding="utf-8")
        print("ok", slug, spec["layout"])


if __name__ == "__main__":
    main()
