#!/usr/bin/env python3
"""Make 'Más sistemas' cards visually distinct with unique fake-data previews."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "public" / "demos" / "index.html"

# Unique mini-UI per system (owner-facing, fake data)
PREVIEWS: dict[str, tuple[str, str, str]] = {
    # title -> (tone, lead_short, preview_html)
    "Stock y alertas": (
        "olive",
        "En el depósito: qué está bajo el mínimo, hoy.",
        """
<div class="row-preview is-alerts" aria-label="Ejemplo de alertas">
  <p class="row-preview-label">Hoy en depósito</p>
  <ul>
    <li><span>Aceite 900 ml</span><strong class="is-bad">6 / mín. 10 · Pedir</strong></li>
    <li><span>Detergente</span><strong class="is-bad">4 / mín. 8 · Pedir</strong></li>
    <li><span>Arroz 1 kg</span><strong class="is-ok">22 · Ok</strong></li>
  </ul>
</div>""",
    ),
    "Visitas y técnicos": (
        "lime",
        "Ruta de campo: a qué casa va cada técnico.",
        """
<div class="row-preview is-route" aria-label="Ejemplo de ruta">
  <p class="row-preview-label">Ruta de Diego · hoy</p>
  <ol>
    <li><em>09:00</em> Lo de Rosa · Centro <b class="is-ok">Hecha</b></li>
    <li><em>11:00</em> Ferretería Sol · Norte <b class="is-warn">En camino</b></li>
    <li><em>14:30</em> Sra. Gómez · Sur <b>Pendiente</b></li>
  </ol>
</div>""",
    ),
    "Cobros y cuotas": (
        "gold",
        "Planes en cuotas: quién pagó y quién debe.",
        """
<div class="row-preview is-cuotas" aria-label="Ejemplo de cuotas">
  <p class="row-preview-label">Cuotas de marzo</p>
  <div class="preview-bar"><span>Familia Ríos · 3/6</span><i style="--p:50%"></i></div>
  <div class="preview-bar is-warn"><span>Sr. Acosta · 5/12 vence</span><i style="--p:42%"></i></div>
  <div class="preview-bar is-bad"><span>Sra. Méndez · atrasada</span><i style="--p:20%"></i></div>
</div>""",
    ),
    "Presupuesto de obra": (
        "sand",
        "Reformas por etapas, con el % a la vista.",
        """
<div class="row-preview is-obra" aria-label="Ejemplo de obras">
  <p class="row-preview-label">Obras en curso</p>
  <div class="preview-obra"><span>Cocina Belgrano</span><strong>70%</strong><i style="--p:70%"></i></div>
  <div class="preview-obra"><span>Baño Palermo</span><strong>25%</strong><i style="--p:25%"></i></div>
  <div class="preview-obra"><span>Local Centro</span><strong>40%</strong><i style="--p:40%"></i></div>
</div>""",
    ),
    "Fichas": (
        "slate",
        "Historial y próximo control, en fichas.",
        """
<div class="row-preview is-fichas" aria-label="Ejemplo de fichas">
  <p class="row-preview-label">Próximos controles</p>
  <div class="preview-chips">
    <article><strong>Luna</strong><span>caniche · vacunas 16/09</span></article>
    <article><strong>Sr. Molina</strong><span>control 11/09</span></article>
    <article><strong>Michi</strong><span>gato · 22/09</span></article>
  </div>
</div>""",
    ),
    "Flota del local": (
        "steel",
        "Utilitarios del negocio: service y papeles.",
        """
<div class="row-preview is-flota" aria-label="Ejemplo de flota">
  <p class="row-preview-label">Unidades propias</p>
  <table>
    <tr><td>AB 123 CD</td><td>S10</td><td class="is-warn">Service 90.000</td></tr>
    <tr><td>AF 450 JK</td><td>Partner</td><td class="is-bad">Patente oct.</td></tr>
    <tr><td>AE 778 MN</td><td>Cronos</td><td class="is-ok">Al día</td></tr>
  </table>
</div>""",
    ),
    "Eventos y salón": (
        "magenta",
        "Agenda del salón: fecha, seña y checklist.",
        """
<div class="row-preview is-eventos" aria-label="Ejemplo de eventos">
  <p class="row-preview-label">Este mes en el salón</p>
  <ul class="preview-agenda">
    <li><time>20/09</time><div><strong>Quince Sofía</strong><span>Seña 50% · confirmado</span></div></li>
    <li><time>27/09</time><div><strong>Casamiento Ríos</strong><span>Seña 30% · parcial</span></div></li>
    <li><time>04/10</time><div><strong>Cumpleaños 50</strong><span>Checklist listo</span></div></li>
  </ul>
</div>""",
    ),
    "Abonos": (
        "cyan",
        "Cuota mensual: al día vs. mora.",
        """
<div class="row-preview is-abonos" aria-label="Ejemplo de abonos">
  <p class="row-preview-label">Septiembre · 84 abonados</p>
  <div class="preview-split">
    <div class="is-ok"><strong>71</strong><span>Al día</span></div>
    <div class="is-bad"><strong>13</strong><span>Deben el mes</span></div>
  </div>
  <p class="preview-foot">Ana Pérez · mensual · Debe</p>
</div>""",
    ),
    "Pedidos mayoristas": (
        "navy",
        "Pedidos B2B: mínimo, armado y despacho.",
        """
<div class="row-preview is-b2b" aria-label="Ejemplo mayorista">
  <p class="row-preview-label">Pedidos abiertos</p>
  <ul class="preview-tickets">
    <li><strong>Kiosco Lo de Ana</strong><span>Yerba x20</span><b class="is-warn">Despacho</b></li>
    <li><strong>Almacén Sur</strong><span>Aceite x40</span><b>Armando</b></li>
    <li><strong>Rotisería Sol</strong><span>Harina x30</span><b class="is-ok">Nuevo</b></li>
  </ul>
</div>""",
    ),
    "Reparto": (
        "lime",
        "Entregas de la tarde: zona, chofer y estado.",
        """
<div class="row-preview is-reparto" aria-label="Ejemplo de reparto">
  <p class="row-preview-label">Tarde · 9 envíos</p>
  <ul class="preview-ship">
    <li><span class="dot is-ok"></span>16:10 Centro · Pablo · Entregado</li>
    <li><span class="dot is-warn"></span>16:40 Norte · Pablo · En camino</li>
    <li><span class="dot"></span>17:00 Sur · María · Salió</li>
  </ul>
</div>""",
    ),
    "Contratos": (
        "teal",
        "Vigencias y renovaciones del mes.",
        """
<div class="row-preview is-contratos" aria-label="Ejemplo de contratos">
  <p class="row-preview-label">Vencen pronto</p>
  <ul class="preview-dates">
    <li><strong>30/09</strong> Alq. Mitre 120 · <em>A renovar</em></li>
    <li><strong>01/10</strong> Mantenimiento red · <em>A renovar</em></li>
    <li><strong>15/10</strong> Local Sur · <em>Vigente</em></li>
  </ul>
</div>""",
    ),
}


def transform_more_section(html: str) -> str:
    m = re.search(
        r'(<details class="sistemas-more">.*?<div class="catalog sistemas-gestion-list sistemas-gestion-more">)(.*?)(</div>\s*</details>)',
        html,
        flags=re.S,
    )
    if not m:
        raise SystemExit("sistemas-more block not found")

    block = m.group(2)

    def repl_article(am: re.Match[str]) -> str:
        article = am.group(0)
        title_m = re.search(r"<h3>([^<]+)</h3>", article)
        if not title_m:
            return article
        title = title_m.group(1).strip()
        if title not in PREVIEWS:
            return article
        tone, lead, preview = PREVIEWS[title]
        note_m = re.search(r'<p class="row-note">([^<]*)</p>', article)
        note = note_m.group(1) if note_m else ""
        ctas_m = re.search(r'<div class="ctas">.*?</div>', article, flags=re.S)
        ctas = ctas_m.group(0) if ctas_m else ""
        media_m = re.search(r'<div class="row-media">.*?</div>', article, flags=re.S)
        media = media_m.group(0) if media_m else ""
        badge_m = re.search(r"<span class=\"badge\"[^>]*>[^<]+</span>", article)
        badge = badge_m.group(0) if badge_m else ""
        flip = " is-flip" if "is-flip" in article else ""
        search = re.search(r'data-search="([^"]*)"', article)
        search_attr = search.group(1) if search else ""
        preview_clean = "\n".join(line for line in preview.strip().splitlines())
        return f'''<article class="row sys-card{flip}" data-cat="sistemas" data-tone="{tone}" data-search="{search_attr}">
        {media}
        <div class="row-copy">
          {badge}
          <h3>{title}</h3>
          <p>{lead}</p>
          {preview_clean}
          <p class="row-note">{note}</p>
          {ctas}
        </div>
      </article>'''

    new_block = re.sub(
        r"<article class=\"row[^\"]*\" data-cat=\"sistemas\"[\s\S]*?</article>",
        repl_article,
        block,
    )
    return html[: m.start()] + m.group(1) + new_block + m.group(3) + html[m.end() :]


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    html = transform_more_section(html)
    html = re.sub(r"hub\.css\?v=hub\d+", "hub.css?v=hub45", html)
    INDEX.write_text(html, encoding="utf-8")
    print("ok: Más sistemas con previews distintas")


if __name__ == "__main__":
    main()
