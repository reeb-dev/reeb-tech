#!/usr/bin/env python3
"""Mark hub badges by tone + enrich sistemas cards with concrete capability lists."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "public" / "demos" / "index.html"

TONE = {
    "Destacados": "gold",
    "Sistemas": "gold",
    "Catálogo": "gold",
    "Oferta": "gold",
    "Precios": "gold",
    "Aparte del piso": "gold",
    "Gastronomía": "ember",
    "Inmuebles": "teal",
    "Legal": "slate",
    "Comercio": "amber",
    "Automotriz": "steel",
    "Servicios": "sage",
    "Cultura": "plum",
    "Turismo": "sky",
    "Construcción": "sand",
    "En el local": "mint",
    "Oficio": "orange",
    "Fiado": "brown",
    "Salón": "rose",
    "Hospedaje": "cyan",
    "Taller": "steel",
    "Mostrador": "amber",
    "Código / planilla": "violet",
    "Depósito": "olive",
    "A domicilio": "lime",
    "Cuotas": "gold",
    "Obra": "sand",
    "Historial": "slate",
    "Vehículos": "steel",
    "Fiestas": "magenta",
    "Mensual": "cyan",
    "B2B": "navy",
    "Entrega": "lime",
    "Alquileres": "teal",
}

# title -> (lead, cans[], note)
DETAIL = {
    "Agenda de turnos": (
        "Para peluquería, consultorio o salón: la gente pide turno y usted lo ve en la agenda.",
        [
            "Alta de profesionales y horarios de atención",
            "Turnos por día con estado (pedido, confirmado, atendido, ausente)",
            "Duración del servicio y huecos libres a la vista",
            "Datos del cliente: nombre, teléfono y nota",
            "Lista del día para el mostrador o el profesional",
            "Recordatorio listo para copiar a WhatsApp",
        ],
        "No es visita a domicilio: el cliente va al local.",
    ),
    "Cotizaciones": (
        "Para oficios y servicios: armar un presupuesto, mandarlo y saber si lo aceptaron.",
        [
            "Ítems con cantidad, precio y total",
            "Envío del presupuesto (texto listo para WhatsApp o correo)",
            "Estados: borrador, enviado, aceptado, rechazado",
            "Seña o anticipo anotado",
            "Validez del presupuesto (días)",
            "Historial por cliente para no reescribir de cero",
        ],
        "No es obra por etapas: es un presupuesto puntual.",
    ),
    "Cuenta corriente": (
        "Para el fiado del barrio: cada cliente tiene saldo, cargos y pagos.",
        [
            "Ficha de cliente con límite orientativo",
            "Cargos del día (qué se llevó)",
            "Pagos parciales o totales",
            "Saldo actual siempre visible",
            "Quién debe y hace cuánto",
            "Movimientos del mes para revisar juntos",
        ],
        "No es un plan de cuotas fijas de una sola venta.",
    ),
    "Comandas": (
        "Para restaurante o bar: mesas abiertas, cocina y cierre de cuenta.",
        [
            "Mesas libres / ocupadas",
            "Comanda por mesa con platos y notas",
            "Vista de cocina (qué falta salir)",
            "Agregar ítems sin cerrar la mesa",
            "Cierre de cuenta y forma de pago",
            "Resumen del turno (mesas atendidas)",
        ],
        "No es pedido para llevar: acá hay mesa.",
    ),
    "Reservas": (
        "Para cabañas, habitaciones o complejos: fechas, seña y estadía.",
        [
            "Calendario por unidad (ocupado / libre)",
            "Check-in y check-out",
            "Seña y saldo a pagar",
            "Datos del huésped y cantidad de personas",
            "Notas (cuna, late check-out, etc.)",
            "Lista de llegadas y salidas del día",
        ],
        "No es salón de eventos ni fiesta puntual.",
    ),
    "Órdenes de trabajo": (
        "Para taller mecánico o de equipos: el trabajo entra, avanza y se entrega.",
        [
            "Alta con patente o equipo, cliente y falla",
            "Estados: ingreso, en curso, esperando repuesto, listo, entregado",
            "Repuestos y mano de obra anotados",
            "Prioridad y fecha prometida",
            "Aviso al cliente cuando puede retirar",
            "Historial por vehículo",
        ],
        "No es técnico a domicilio: el trabajo se hace en el local.",
    ),
    "Pedidos para llevar": (
        "Para rotisería, café o mostrador: cola de retiro sin mesa.",
        [
            "Pedido con nombre y detalle",
            "Estados: recibido, en preparación, listo, entregado",
            "Número de orden visible",
            "Horario de retiro",
            "Cola del mediodía ordenada",
            "Cierre del pedido al entregar",
        ],
        "No es comanda de mesa: el cliente retira y se va.",
    ),
    "Inventario": (
        "Para depósito que escanea y carga mercadería desde la planilla del proveedor.",
        [
            "Alta de productos con código de barras o QR",
            "Escaneo para sumar o restar stock",
            "Importar lista del proveedor (Excel o CSV)",
            "Stock actual y movimientos del día",
            "Proveedores y última compra",
            "Búsqueda rápida por código o nombre",
        ],
        "No es solo alerta de mínimo: acá se escanea y se carga la lista del proveedor.",
    ),
    "Stock y alertas": (
        "Para depósito o góndola: saber qué se está por acabar antes de que falte.",
        [
            "Stock por producto con mínimo",
            "Entradas y salidas del día",
            "Alertas de lo que hay que pedir",
            "Lista de reposición lista para el proveedor",
            "Búsqueda por nombre",
            "Resumen: cuántos ítems en alerta",
        ],
        "No es el sistema de facturas completas del depósito.",
    ),
    "Visitas y técnicos": (
        "Para servicio a domicilio: ruta del día, técnico y llegada.",
        [
            "Agenda de visitas con dirección y franja",
            "Asignación de técnico",
            "Orden de la ruta del día",
            "Check-in al llegar",
            "Nota de lo realizado en el lugar",
            "Aviso al cliente (texto listo)",
        ],
        "No es agenda de salón ni orden de taller en el local.",
    ),
    "Cobros y cuotas": (
        "Para una venta grande en cuotas: plan, vencimientos y mora.",
        [
            "Alta del plan (monto, cantidad de cuotas)",
            "Calendario de vencimientos",
            "Marcar cuota pagada",
            "Ver quién vence este mes",
            "Ver quién está atrasado",
            "Saldo restante del plan",
        ],
        "No es fiado abierto de cuenta corriente.",
    ),
    "Presupuesto de obra": (
        "Para reforma o construcción: etapas, avance y extras por escrito.",
        [
            "Presupuesto partido en etapas",
            "Porcentaje de avance por etapa",
            "Extras y adicionales",
            "Montos parciales y total",
            "Estado de la obra (activa / pausada / cerrada)",
            "Resumen para mostrar al cliente",
        ],
        "No es una cotización corta de un solo trabajo.",
    ),
    "Fichas": (
        "Para consultorio o veterinaria: historial y próximo control en una ficha.",
        [
            "Ficha con datos básicos",
            "Registro de cada visita (qué se hizo)",
            "Próximo control con fecha",
            "Alertas de controles cercanos",
            "Búsqueda por nombre",
            "Notas internas del profesional",
        ],
        "No reemplaza la agenda: los turnos van aparte.",
    ),
    "Flota del local": (
        "Para vehículos propios del negocio: service, km y papeles.",
        [
            "Alta de unidades (patente, modelo, km)",
            "Último y próximo service",
            "Vencimientos (patente, VTV u otros)",
            "Alertas del mes",
            "Historial de km",
            "Quién usa cada vehículo (opcional)",
        ],
        "No es venta de 0km: son vehículos propios.",
    ),
    "Eventos y salón": (
        "Para salón de fiestas: fecha, menú, seña y checklist del día.",
        [
            "Reserva de fecha y tipo de evento",
            "Cantidad de invitados y menú",
            "Seña y saldo",
            "Checklist (sonido, decoración, cocina…)",
            "Contacto del organizador",
            "Agenda del mes a la vista",
        ],
        "No es reserva de cabaña para dormir.",
    ),
    "Abonos": (
        "Para club, gimnasio o mantenimiento: cuota mensual, altas y mora.",
        [
            "Alta de socio o abonado",
            "Planes (mensual, trimestral, empresa)",
            "Cobro del mes marcado",
            "Lista de mora",
            "Bajas o pausas",
            "Resumen: al día vs. debe",
        ],
        "No es cuotas de una sola venta grande.",
    ),
    "Pedidos mayoristas": (
        "Para venta a comercios: lista de precio, mínimo y despacho.",
        [
            "Clientes mayoristas con lista propia",
            "Pedido por ítems y cantidades",
            "Control de compra mínima",
            "Armado y despacho",
            "Estados del pedido",
            "Historial por comercio",
        ],
        "No es la góndola del mostrador minorista.",
    ),
    "Reparto": (
        "Para llevar pedidos a domicilio: zona, chofer y estado del envío.",
        [
            "Alta de entrega con dirección y zona",
            "Asignación de chofer",
            "Estados: pendiente, salió, en camino, entregado",
            "Lista de la tarde ordenada",
            "Demoras o reintentos anotados",
            "Resumen del día por chofer",
        ],
        "No es retiro en mostrador: sale el vehículo.",
    ),
    "Contratos": (
        "Para alquileres o servicios con plazo: vigencia, vencimiento y renovación.",
        [
            "Alta de contrato (partes, fechas, monto)",
            "Vigentes vs. por vencer",
            "Aviso de renovación",
            "Renovación o cierre",
            "Notas y adjuntos de referencia",
            "Calendario del mes de vencimientos",
        ],
        "No es la web pública de propiedades en venta.",
    ),
}


def tone_badges(html: str) -> str:
    def repl(m: re.Match[str]) -> str:
        tag, attrs, text = m.group(1), m.group(2), m.group(3)
        tone = TONE.get(text.strip())
        if not tone:
            return m.group(0)
        attrs2 = re.sub(r'\sdata-tone="[^"]*"', "", attrs)
        return f'<{tag}{attrs2} data-tone="{tone}">{text}</{tag}>'

    return re.sub(
        r"<(span|p)(\s+class=\"badge\"[^>]*)>([^<]+)</\1>",
        repl,
        html,
    )


def enrich_cards(html: str) -> str:
    for title, (lead, cans, note) in DETAIL.items():
        cans_html = "".join(f"<li>{c}</li>" for c in cans)
        block = (
            f"<h3>{title}</h3>\n"
            f"          <p>{lead}</p>\n"
            f'          <ul class="row-can" aria-label="Qué incluye este ejemplo">\n'
            f"            {cans_html}\n"
            f"          </ul>\n"
            f'          <p class="row-note">{note}</p>'
        )
        pattern = (
            rf"<h3>{re.escape(title)}</h3>\s*"
            rf"<p>.*?</p>\s*"
            rf'(?:<ul class="row-can"[^>]*>.*?</ul>\s*)?'
            rf'(?:<p class="row-note">.*?</p>)?'
        )
        html2, n = re.subn(pattern, block, html, count=1, flags=re.S)
        if n != 1:
            raise SystemExit(f"no match for card: {title}")
        html = html2
    return html


def bump_css(html: str) -> str:
    return re.sub(r"hub\.css\?v=hub\d+", "hub.css?v=hub44", html)


def mark_summary(html: str) -> str:
    old = "<summary>Más sistemas, si su caso lo pide</summary>"
    new = (
        "<summary>"
        '<span class="sistemas-more-kicker" data-tone="gold">Más opciones</span>'
        '<span class="sistemas-more-title">Más sistemas, si su caso lo pide</span>'
        "</summary>"
    )
    if old not in html:
        if "sistemas-more-kicker" in html:
            return html
        raise SystemExit("summary not found")
    return html.replace(old, new, 1)


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    html = tone_badges(html)
    html = enrich_cards(html)
    html = mark_summary(html)
    html = bump_css(html)
    INDEX.write_text(html, encoding="utf-8")
    print("ok index.html hub44 + badges + detalle sistemas")


if __name__ == "__main__":
    main()
