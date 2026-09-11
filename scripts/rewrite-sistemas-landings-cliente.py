#!/usr/bin/env python3
"""Rewrite extra sistemas landings: plain owner copy + fake case data on the page."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
CSS_V = "c9"

# Each system: human copy + fake case rows for the public page
SYSTEMS = {
    "ordenes": {
        "title": "Órdenes de trabajo",
        "short": "Órdenes",
        "span": "Taller · estados · aviso",
        "kicker": "Para su taller",
        "h1": "Sepa en qué auto están trabajando y qué falta entregar.",
        "lead": "Cuando entra un vehículo, queda anotado: qué le pasa, en qué paso está y cuándo avisar al dueño.",
        "facts": [("Hoy", "4 órdenes"), ("Listos", "1 para retirar"), ("Aviso", "por WhatsApp")],
        "caso_titulo": "Hoy en el taller (ejemplo)",
        "caso_lead": "Datos inventados para que vea cómo se lee el día, sin entrar al panel.",
        "headers": ["Orden", "Cliente", "Vehículo", "Estado"],
        "rows": [
            ["OT-104", "María López", "Focus 2016 · frenos", "En curso"],
            ["OT-105", "Juan Pérez", "Cronos 2020 · service", "Ingreso"],
            ["OT-106", "Ana Ruiz", "Gol 2014 · batería", "Listo"],
            ["OT-107", "Pedro Díaz", "Hilux 2018 · diagnóstico", "Ingreso"],
        ],
        "steps": [
            ("Entra el trabajo", "Anota patente, cliente y qué pidió."),
            ("Va avanzando", "Lo marca en curso, listo o entregado."),
            ("Avisa", "Manda o copia un mensaje cuando puede retirarlo."),
        ],
        "caps": ["Taller", "Reparación", "Entrega", "Detalle"],
        "puede": [
            "Alta con patente o equipo, cliente y falla",
            "Estados: ingreso, en curso, esperando repuesto, listo, entregado",
            "Repuestos y mano de obra anotados",
            "Prioridad y fecha prometida",
            "Aviso al cliente cuando puede retirar",
            "Historial por vehículo",
        ],
    },
    "stockalertas": {
        "title": "Stock y alertas",
        "short": "Stock",
        "span": "Depósito · mínimos · reposición",
        "kicker": "Para su depósito",
        "h1": "Sepa qué se está por acabar antes de que falte en góndola.",
        "lead": "Cada producto tiene un mínimo. Cuando baja, lo ve marcado para pedir reposición.",
        "facts": [("Alertas", "3 hoy"), ("Ítems", "48"), ("Movimientos", "del día")],
        "caso_titulo": "Hoy en el depósito (ejemplo)",
        "caso_lead": "Lista de ejemplo: lo que está bajo el mínimo aparece claro.",
        "headers": ["Producto", "Stock", "Mínimo", "Alerta"],
        "rows": [
            ["Aceite 900 ml", "6", "10", "Pedir"],
            ["Arroz 1 kg", "22", "15", "Ok"],
            ["Detergente", "4", "8", "Pedir"],
            ["Yerba 1 kg", "18", "10", "Ok"],
        ],
        "steps": [
            ("Carga el producto", "Nombre, cantidad y mínimo."),
            ("Suma o resta", "Cuando entra mercadería o se vende."),
            ("Revisa alertas", "Lo que hay que pedir queda a la vista."),
        ],
        "caps": ["Depósito", "Góndola", "Cajas", "Estantería"],
        "puede": [
            "Stock por producto con mínimo",
            "Entradas y salidas del día",
            "Alertas de lo que hay que pedir",
            "Lista de reposición para el proveedor",
            "Búsqueda por nombre",
            "Resumen: cuántos ítems en alerta",
        ],
    },
    "visitas": {
        "title": "Visitas y técnicos",
        "short": "Visitas",
        "span": "A domicilio · ruta · llegada",
        "kicker": "Para servicio a domicilio",
        "h1": "Sepa a qué casa va cada técnico y si ya llegó.",
        "lead": "La visita queda con dirección, horario y técnico. Cuando llega, se marca. El cliente puede recibir un aviso.",
        "facts": [("Ruta", "5 visitas"), ("En camino", "2"), ("Hechas", "1")],
        "caso_titulo": "Ruta de hoy (ejemplo)",
        "caso_lead": "Así se ve un día de campo, con datos inventados.",
        "headers": ["Hora", "Cliente", "Barrio", "Técnico", "Estado"],
        "rows": [
            ["09:00", "Lo de Rosa", "Centro", "Diego", "Hecha"],
            ["11:00", "Ferretería Sol", "Norte", "Diego", "En camino"],
            ["14:30", "Sra. Gómez", "Sur", "Lucía", "Pendiente"],
            ["16:00", "Café Mayo", "Centro", "Lucía", "Pendiente"],
        ],
        "steps": [
            ("Anota la visita", "Cliente, dirección y franja."),
            ("Asigna técnico", "Quién sale esa mañana."),
            ("Marca llegada", "Queda registrado el check-in."),
        ],
        "caps": ["Campo", "Instalación", "Servicio", "Herramientas"],
        "puede": [
            "Agenda de visitas con dirección y franja",
            "Asignación de técnico",
            "Orden de la ruta del día",
            "Check-in al llegar",
            "Nota de lo realizado en el lugar",
            "Aviso al cliente (texto listo)",
        ],
    },
    "takeaway": {
        "title": "Pedidos para llevar",
        "short": "Para llevar",
        "span": "Mostrador · cola · listo",
        "kicker": "Para mostrador",
        "h1": "La cola de pedidos listos para retirar, en orden.",
        "lead": "El pedido entra, se prepara y pasa a listo. El cliente retira; no es una mesa del salón.",
        "facts": [("En cola", "3"), ("Listos", "2"), ("Entregados", "8 hoy")],
        "caso_titulo": "Cola del mediodía (ejemplo)",
        "caso_lead": "Pedidos inventados como en un mostrador real.",
        "headers": ["Nº", "Cliente", "Pedido", "Estado"],
        "rows": [
            ["#41", "Carla", "2 milanesas + papas", "Listo"],
            ["#42", "Martín", "Empanadas x12", "En prep."],
            ["#43", "Sofía", "Pollo + ensalada", "Recibido"],
            ["#44", "Luis", "Tarta jamón y queso", "Listo"],
        ],
        "steps": [
            ("Entra el pedido", "Nombre y qué lleva."),
            ("Se prepara", "Pasa a en preparación o listo."),
            ("Se entrega", "Al retirar, queda cerrado."),
        ],
        "caps": ["Mostrador", "Preparación", "Retiro", "Pedido"],
        "puede": [
            "Pedido con nombre y detalle",
            "Estados: recibido, en preparación, listo, entregado",
            "Número de orden visible",
            "Horario de retiro",
            "Cola del mediodía ordenada",
            "Cierre del pedido al entregar",
        ],
    },
    "cuotas": {
        "title": "Cobros y cuotas",
        "short": "Cuotas",
        "span": "Planes · vencimientos · mora",
        "kicker": "Para ventas en cuotas",
        "h1": "Sepa quién paga este mes y quién está atrasado.",
        "lead": "Cada venta tiene un plan de cuotas. Ve vencimientos y marca lo cobrado.",
        "facts": [("Planes", "12"), ("Vencen", "4 este mes"), ("Mora", "2")],
        "caso_titulo": "Cuotas de marzo (ejemplo)",
        "caso_lead": "Nombres y montos inventados para mostrar el control.",
        "headers": ["Cliente", "Plan", "Cuota", "Estado"],
        "rows": [
            ["Familia Ríos", "Heladera 6 cuotas", "3/6 · $85.000", "Pagada"],
            ["Sr. Acosta", "TV 12 cuotas", "5/12 · $42.000", "Vence"],
            ["Sra. Méndez", "Lavarropas 10", "2/10 · $55.000", "Atrasada"],
            ["Comercio Luz", "Notebook 8", "1/8 · $95.000", "Pagada"],
        ],
        "steps": [
            ("Arma el plan", "Monto, cuotas y cliente."),
            ("Cobra", "Marca cada cuota pagada."),
            ("Recuerda", "Ve quién vence o debe."),
        ],
        "caps": ["Comercio", "Cobro", "Plan", "Mostrador"],
        "puede": [
            "Alta del plan (monto y cantidad de cuotas)",
            "Calendario de vencimientos",
            "Marcar cuota pagada",
            "Quién vence este mes",
            "Quién está atrasado",
            "Saldo restante del plan",
        ],
    },
    "obra": {
        "title": "Presupuesto de obra",
        "short": "Obra",
        "span": "Etapas · avance · extras",
        "kicker": "Para reformas",
        "h1": "La obra por etapas, con el porcentaje a la vista.",
        "lead": "Cada reforma se parte en etapas. Usted marca el avance y los extras quedan anotados.",
        "facts": [("Obras", "3 activas"), ("Avance", "promedio 55%"), ("Extras", "2 abiertos")],
        "caso_titulo": "Obras en curso (ejemplo)",
        "caso_lead": "Casos inventados de reforma para ver el tablero de un vistazo.",
        "headers": ["Obra", "Cliente", "Etapa", "Avance"],
        "rows": [
            ["Cocina Belgrano", "Familia Ortiz", "Revestimientos", "70%"],
            ["Baño Palermo", "Sra. Vega", "Demolición", "25%"],
            ["Local Centro", "Comercial Sur", "Instalaciones", "40%"],
            ["Deck Quilmes", "Sr. Blanco", "Estructura", "90%"],
        ],
        "steps": [
            ("Arma el presupuesto", "Etapas y montos."),
            ("Actualiza avance", "Porcentaje por etapa."),
            ("Suma extras", "Quedan por escrito."),
        ],
        "caps": ["Obra", "Reforma", "Planos", "Obra viva"],
        "puede": [
            "Presupuesto partido en etapas",
            "Porcentaje de avance por etapa",
            "Extras y adicionales",
            "Montos parciales y total",
            "Estado de la obra",
            "Resumen para mostrar al cliente",
        ],
    },
    "fichas": {
        "title": "Fichas",
        "short": "Fichas",
        "span": "Historial · próximo control",
        "kicker": "Para consultorio o veterinaria",
        "h1": "La historia del paciente o la mascota, en una sola ficha.",
        "lead": "Guarda qué se hizo y cuándo vuelve. Los turnos del día pueden ir en otro sistema; acá queda el historial.",
        "facts": [("Fichas", "26"), ("Controles", "5 esta semana"), ("Última", "hoy 10:30")],
        "caso_titulo": "Próximos controles (ejemplo)",
        "caso_lead": "Fichas inventadas: se entiende sin abrir el panel.",
        "headers": ["Nombre", "Tipo", "Última visita", "Próximo"],
        "rows": [
            ["Luna", "Mascota · caniche", "02/09", "16/09 vacunas"],
            ["Sr. Molina", "Paciente", "28/08", "11/09 control"],
            ["Michi", "Mascota · gato", "01/09", "22/09 control"],
            ["Sra. Paredes", "Paciente", "05/09", "19/09 seguimiento"],
        ],
        "steps": [
            ("Abre la ficha", "Datos básicos."),
            ("Anota la visita", "Qué se hizo ese día."),
            ("Programa el control", "Queda la próxima fecha."),
        ],
        "caps": ["Atención", "Equipo", "Consulta", "Detalle"],
        "puede": [
            "Ficha con datos básicos",
            "Registro de cada visita",
            "Próximo control con fecha",
            "Alertas de controles cercanos",
            "Búsqueda por nombre",
            "Notas del profesional",
        ],
    },
    "flota": {
        "title": "Flota del local",
        "short": "Flota",
        "span": "Service · vencimientos · km",
        "kicker": "Para vehículos del negocio",
        "h1": "Los utilitarios del local, con service y papeles al día.",
        "lead": "Patente, kilómetros, próximo service y vencimientos. Son vehículos suyos, no un catálogo de venta.",
        "facts": [("Unidades", "5"), ("Service", "2 cerca"), ("Vence", "1 patente")],
        "caso_titulo": "Flota de ejemplo",
        "caso_lead": "Unidades inventadas: se ve qué hay que atender este mes.",
        "headers": ["Patente", "Vehículo", "Km", "Próximo"],
        "rows": [
            ["AB 123 CD", "S10 blanca", "86.400", "Service 90.000"],
            ["AF 450 JK", "Partner", "112.200", "Patente oct."],
            ["AE 778 MN", "Cronos", "54.100", "Service ok"],
            ["AD 901 PQ", "Kangoo", "98.050", "VTV nov."],
        ],
        "steps": [
            ("Carga la unidad", "Patente, modelo y km."),
            ("Anota el service", "Último y próximo."),
            ("Mira vencimientos", "Patente, VTV y similares."),
        ],
        "caps": ["Flota", "Utilitario", "Service", "Ruta"],
        "puede": [
            "Alta de unidades (patente, modelo, km)",
            "Último y próximo service",
            "Vencimientos (patente, VTV u otros)",
            "Alertas del mes",
            "Historial de km",
            "Quién usa cada vehículo (opcional)",
        ],
    },
    "eventos": {
        "title": "Eventos y salón",
        "short": "Eventos",
        "span": "Fecha · seña · checklist",
        "kicker": "Para salón de fiestas",
        "h1": "Cada evento con fecha, seña y lista de lo que falta.",
        "lead": "Casamiento, quince o corporativo: queda la fecha, el menú, la seña y el checklist del día.",
        "facts": [("Este mes", "4 eventos"), ("Seña ok", "3"), ("Pendiente", "1 checklist")],
        "caso_titulo": "Agenda del salón (ejemplo)",
        "caso_lead": "Eventos inventados para ver cómo se organiza el mes.",
        "headers": ["Fecha", "Evento", "Seña", "Estado"],
        "rows": [
            ["20/09", "Quince Sofía", "50%", "Confirmado"],
            ["27/09", "Casamiento Ríos", "30%", "Seña parcial"],
            ["04/10", "Cumpleaños 50", "100%", "Checklist listo"],
            ["11/10", "Cena empresa", "0%", "Consulta"],
        ],
        "steps": [
            ("Reserva la fecha", "Tipo de evento y menú."),
            ("Cobra la seña", "Queda el estado de pago."),
            ("Arma el día", "Checklist de salón y servicio."),
        ],
        "caps": ["Salón", "Fiesta", "Servicio", "Espacio"],
        "puede": [
            "Reserva de fecha y tipo de evento",
            "Cantidad de invitados y menú",
            "Seña y saldo",
            "Checklist del día",
            "Contacto del organizador",
            "Agenda del mes",
        ],
    },
    "abonos": {
        "title": "Abonos",
        "short": "Abonos",
        "span": "Mensual · altas · mora",
        "kicker": "Para cuota mensual",
        "h1": "Quién está al día con el abono y quién debe el mes.",
        "lead": "Gimnasio, club o mantenimiento: altas, cobro del mes y mora a la vista.",
        "facts": [("Abonados", "84"), ("Al día", "71"), ("Mora", "13")],
        "caso_titulo": "Abonos del mes (ejemplo)",
        "caso_lead": "Socios inventados: se entiende el tablero al toque.",
        "headers": ["Nombre", "Plan", "Mes", "Estado"],
        "rows": [
            ["Lucía Ferraro", "Mensual", "Septiembre", "Pagado"],
            ["Diego Sosa", "Trimestral", "Septiembre", "Pagado"],
            ["Ana Pérez", "Mensual", "Septiembre", "Debe"],
            ["Club Norte · 4 pases", "Empresa", "Septiembre", "Pagado"],
        ],
        "steps": [
            ("Da el alta", "Persona y plan."),
            ("Cobra el mes", "Queda marcado."),
            ("Revisa mora", "Quién no pagó."),
        ],
        "caps": ["Local", "Atención", "Equipo", "Servicio"],
        "puede": [
            "Alta de socio o abonado",
            "Planes (mensual, trimestral, empresa)",
            "Cobro del mes marcado",
            "Lista de mora",
            "Bajas o pausas",
            "Resumen: al día vs. debe",
        ],
    },
    "mayorista": {
        "title": "Pedidos mayoristas",
        "short": "Mayorista",
        "span": "B2B · mínimo · despacho",
        "kicker": "Para venta mayorista",
        "h1": "Pedidos de comercios con lista de precio y mínimo.",
        "lead": "El cliente mayorista pide por lista. Usted controla mínimo, arma el despacho y sigue el estado.",
        "facts": [("Pedidos", "6 abiertos"), ("Despacho", "2 hoy"), ("Mínimo", "respetado")],
        "caso_titulo": "Pedidos B2B (ejemplo)",
        "caso_lead": "Comercios inventados: pedido, mínimo y estado.",
        "headers": ["Cliente", "Pedido", "Total", "Estado"],
        "rows": [
            ["Kiosco Lo de Ana", "Caja yerba x20", "$98.000", "Despacho"],
            ["Almacén Sur", "Aceite x40", "$74.000", "Armando"],
            ["Rotisería Sol", "Harina x30", "$22.500", "Nuevo"],
            ["Café Centro", "Vasos x10", "$18.000", "Entregado"],
        ],
        "steps": [
            ("Recibe el pedido", "Sobre la lista de ese cliente."),
            ("Controla mínimo", "Si no llega, lo ve."),
            ("Despacha", "Marca enviado o entregado."),
        ],
        "caps": ["Depósito", "Cajas", "Lista", "Despacho"],
        "puede": [
            "Clientes mayoristas con lista propia",
            "Pedido por ítems y cantidades",
            "Control de compra mínima",
            "Armado y despacho",
            "Estados del pedido",
            "Historial por comercio",
        ],
    },
    "reparto": {
        "title": "Reparto",
        "short": "Reparto",
        "span": "Zona · chofer · entrega",
        "kicker": "Para entregas a domicilio",
        "h1": "Quién lleva cada pedido y en qué zona está.",
        "lead": "Dirección, zona, chofer y estado: salió, en camino o entregado.",
        "facts": [("Hoy", "9 envíos"), ("En camino", "3"), ("Entregados", "5")],
        "caso_titulo": "Repartos de la tarde (ejemplo)",
        "caso_lead": "Envíos inventados para ver la operación.",
        "headers": ["Hora", "Zona", "Chofer", "Estado"],
        "rows": [
            ["16:10", "Centro", "Pablo", "Entregado"],
            ["16:40", "Norte", "Pablo", "En camino"],
            ["17:00", "Sur", "María", "Salió"],
            ["17:30", "Oeste", "María", "Pendiente"],
        ],
        "steps": [
            ("Carga la entrega", "Dirección y zona."),
            ("Asigna chofer", "Quién sale."),
            ("Cierra el envío", "Entregado o demorado."),
        ],
        "caps": ["Ruta", "Utilitario", "Entrega", "Ciudad"],
        "puede": [
            "Alta de entrega con dirección y zona",
            "Asignación de chofer",
            "Estados: pendiente, salió, en camino, entregado",
            "Lista de la tarde ordenada",
            "Demoras o reintentos",
            "Resumen del día por chofer",
        ],
    },
    "contratos": {
        "title": "Contratos",
        "short": "Contratos",
        "span": "Vencimientos · renovación",
        "kicker": "Para alquileres o servicios",
        "h1": "Contratos vigentes y cuáles vencen pronto.",
        "lead": "Fecha de inicio, fin y renovación. Sirve para alquileres o servicios con plazo; no reemplaza la web de propiedades.",
        "facts": [("Vigentes", "18"), ("Vencen", "3 este mes"), ("Renovados", "2")],
        "caso_titulo": "Vencimientos (ejemplo)",
        "caso_lead": "Contratos inventados: se ve el calendario de un vistazo.",
        "headers": ["Contrato", "Parte", "Vence", "Estado"],
        "rows": [
            ["Alq. Mitre 120", "Sra. López", "30/09", "A renovar"],
            ["Alq. local Sur", "Comercio Paz", "15/10", "Vigente"],
            ["Mantenimiento red", "Estudio Norte", "01/10", "A renovar"],
            ["Cochera 4", "Sr. Gómez", "28/11", "Vigente"],
        ],
        "steps": [
            ("Carga el contrato", "Partes, fechas y monto."),
            ("Sigue vencimientos", "Los del mes quedan arriba."),
            ("Renueva o cierra", "Queda el estado actualizado."),
        ],
        "caps": ["Inmueble", "Interior", "Entorno", "Propiedad"],
        "puede": [
            "Alta de contrato (partes, fechas, monto)",
            "Vigentes vs. por vencer",
            "Aviso de renovación",
            "Renovación o cierre",
            "Notas de referencia",
            "Calendario de vencimientos del mes",
        ],
    },
    "inventario": {
        "title": "Inventario",
        "short": "Inventario",
        "span": "Código · planillas · stock",
        "kicker": "Para depósito con código",
        "h1": "Stock con código de barras o QR y la planilla del proveedor.",
        "lead": "Cada producto tiene código. Puede escanearlo, cargar la lista del proveedor desde Excel o CSV y ver qué hay que reponer.",
        "facts": [("Ítems", "5+"), ("Códigos", "barras / QR"), ("Planilla", "Excel o CSV")],
        "caso_titulo": "Productos de ejemplo",
        "caso_lead": "Así se ve el stock con código, sin entrar al panel.",
        "headers": ["Código", "Producto", "Stock", "Alerta"],
        "rows": [
            ["779…1001", "Aceite 900 ml", "24", "Ok"],
            ["779…2008", "Arroz 1 kg", "8", "Pedir"],
            ["779…3005", "Fideos 500 g", "40", "Ok"],
            ["QR-77821", "Resma A4", "18", "Ok"],
        ],
        "steps": [
            ("Carga o importa", "A mano o con la planilla del proveedor."),
            ("Escanea", "Lector, cámara o tipeo del código."),
            ("Controla", "Entradas, salidas y mínimos."),
        ],
        "caps": ["Depósito", "Cajas", "Estantería", "Logística"],
        "puede": [
            "Alta con código de barras o QR",
            "Escaneo para sumar o restar stock",
            "Importar lista del proveedor (Excel o CSV)",
            "Stock actual y movimientos del día",
            "Proveedores y última compra",
            "Búsqueda por código o nombre",
        ],
    },
}


FAV = """  <link rel="icon" href="/favicon.ico?v=20260911fav" sizes="any">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=20260911fav" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/reeb-mark-16.png?v=20260911fav" type="image/png" sizes="16x16">
  <link rel="icon" href="/brand/reeb-mark.svg?v=20260911fav" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico?v=20260911fav">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=20260911fav" sizes="180x180">"""


def render(slug: str, s: dict) -> str:
    facts = "".join(f"<li><strong>{a}</strong>{b}</li>" for a, b in s["facts"])
    steps = "".join(
        f'<article class="step"><strong>{t}</strong><p>{p}</p></article>' for t, p in s["steps"]
    )
    th = "".join(f"<th>{h}</th>" for h in s["headers"])
    trs = "".join(
        "<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in s["rows"]
    )
    # gallery files if present
    img_dir = DEMOS / slug / "img"
    figs = []
    caps = s["caps"]
    files = ["hero.jpg", "galeria-1.jpg", "galeria-2.jpg", "galeria-3.jpg"]
    for i, fn in enumerate(files):
        if (img_dir / fn).exists():
            figs.append(
                f'<figure><img src="img/{fn}" alt="{caps[i] if i < len(caps) else "Detalle"}">'
                f"<figcaption>{caps[i] if i < len(caps) else 'Detalle'}</figcaption></figure>"
            )
    gallery = "".join(figs)
    puede = "".join(f"<li>{item}</li>" for item in s.get("puede", []))
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
  <link rel="stylesheet" href="styles.css?v={CSS_V}">
</head>
<body>
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
      <div class="caso-table-wrap">
        <table class="caso-table">
          <thead><tr>{th}</tr></thead>
          <tbody>{trs}</tbody>
        </table>
      </div>
      <p class="caso-note">Los nombres y números son de muestra. En un trabajo a medida se cargan los suyos.</p>
      <div class="hero-actions" style="margin-top:1rem">
        <a class="btn" href="panel.html">Abrir el panel de ejemplo</a>
      </div>
    </section>

    <section class="section" id="puede">
      <p class="kicker">En este ejemplo</p>
      <h2>Qué puede hacer</h2>
      <p class="section-lead">Lista concreta del día a día. No es una planilla vacía: son las tareas del rubro.</p>
      <ul class="puede-list">{puede}</ul>
    </section>

    <section class="section" id="como">
      <p class="kicker">En pasos</p>
      <h2>Cómo se usa</h2>
      <p class="section-lead">Sin términos técnicos: lo que hace en el día.</p>
      <div class="steps">{steps}</div>
    </section>

    <section class="section" id="galeria">
      <p class="kicker">Fotos</p>
      <h2>Ambiente de referencia</h2>
      <p class="section-lead">Imágenes de referencia del rubro. En su sistema se usan las suyas.</p>
      <div class="gallery">{gallery}</div>
    </section>

    <div class="cta-band">
      <p class="kicker" style="color:#e3c48a">A medida</p>
      <h2>¿Le sirve esto a su local?</h2>
      <p>Se cotiza y se entrega para usted. No es un software de suscripción genérico.</p>
      <a class="btn" href="#contacto">Consultar</a>
    </div>
  </main>
  <div id="contacto"></div>
  <footer class="wrap">{s["title"]} · ejemplo · datos inventados · no es suscripción.</footer>
  <script src="../contacto.js" data-phone="5492915757934" data-text="Hola, quiero consultar por {s["title"]}" data-subject="Consulta — {s["title"]}" data-title="Consultar" data-place="index"></script>
</body>
</html>
'''


def main() -> None:
    for slug, spec in SYSTEMS.items():
        dest = DEMOS / slug
        if not dest.exists():
            print("skip missing", slug)
            continue
        (dest / "index.html").write_text(render(slug, spec), encoding="utf-8")
        print("ok", slug)


if __name__ == "__main__":
    main()
