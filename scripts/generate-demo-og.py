#!/usr/bin/env python3
"""Generate 1200x630 OG images and inject Open Graph meta into each demo index.html."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ROOT / "public" / "demos"
W, H = 1200, 630
BASE = "https://webconreeb.com"
VERSION = "20260911e"

# Prefer these filenames when picking a cover photo
PREFERRED = (
    "hero.jpg",
    "hero.jpeg",
    "hero.png",
    "cover.jpg",
    "hero-deposito.jpg",
    "lugar-lago.jpg",
    "zona-centro.jpg",
    "mirador.jpg",
)

# Client-facing blurbs (usted) when no meta description exists
BLURBS: dict[str, str] = {
    "arquitectura": "Ejemplo de página web para estudio de arquitectura: obras, contacto y WhatsApp.",
    "automotores": "Ejemplo de página web para automotora: stock de vehículos y consulta por WhatsApp.",
    "biblioteca": "Ejemplo de catálogo web para biblioteca: préstamos y consulta.",
    "carpinteria": "Ejemplo de página web para carpintería: trabajos, presupuesto y WhatsApp.",
    "comandas": "Ejemplo de sistema de comandas: salón, cocina, carta y cobro.",
    "comercio": "Ejemplo de página web para almacén: productos del día y WhatsApp.",
    "complejo": "Ejemplo de página web para complejo turístico: paquetes, predio y WhatsApp.",
    "cotizaciones": "Ejemplo de sistema de cotizaciones: presupuesto, seña y WhatsApp.",
    "cuentacorriente": "Ejemplo de cuenta corriente: saldos, extracto y recordatorios.",
    "estudio": "Ejemplo de página web para estudio jurídico o profesional: mesa de entradas y contacto.",
    "excursiones": "Ejemplo de página web para agencia de excursiones: tours y WhatsApp.",
    "facturacion": "Ejemplo de sistema de comprobantes A, B y NC.",
    "hospedaje": "Ejemplo de página web para cabañas: disponibilidad y WhatsApp.",
    "inmobiliaria": "Ejemplo de inmobiliaria en Bariloche: casas, zonas y WhatsApp.",
    "kiosco": "Ejemplo de página web para kiosco: stock, fiado y WhatsApp.",
    "libreria": "Ejemplo de página web para librería: catálogo y WhatsApp.",
    "marketplace": "Ejemplo de feria barrial online: compra y venta entre vecinos.",
    "materiales": "Ejemplo de página web para corralón: materiales de obra y WhatsApp.",
    "peluqueria": "Ejemplo de página web para salón: servicios, turnos y WhatsApp.",
    "reservas": "Ejemplo de sistema de reservas: unidades, calendario y seña.",
    "restaurante": "Ejemplo de página web para parrilla: carta y WhatsApp.",
    "rotiseria": "Ejemplo de página web para rotisería: carta, pedidos y WhatsApp.",
    "steelframe": "Ejemplo de página web para vivienda steel frame: obras y consulta.",
    "stockfacturacion": "Ejemplo de depósito: stock, facturación y panel.",
    "taller": "Ejemplo de página web para taller mecánico: servicios y WhatsApp.",
    "turnos": "Ejemplo de agenda de turnos: panel, estados y pedidos por WhatsApp.",
}


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def pick_cover(demo_dir: Path) -> Path | None:
    img_dir = demo_dir / "img"
    files: dict[str, Path] = {}
    if img_dir.is_dir():
        files = {p.name.lower(): p for p in img_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}}
    for name in PREFERRED:
        if name in files:
            return files[name]
    # Prefer wider landscape-looking names
    for key in sorted(files):
        if "hero" in key or "lugar" in key or "zona" in key or "mirador" in key or "cover" in key:
            return files[key]
    if files:
        return next(iter(files.values()))
    # Fallback: hub catalog photo for this rubro
    hub = DEMOS / "hub-img" / f"{demo_dir.name}.jpg"
    if hub.is_file():
        return hub
    return None


def cover_canvas(src: Path | None) -> Image.Image:
    canvas = Image.new("RGB", (W, H), (12, 10, 9))
    if src is None:
        return canvas
    try:
        im = Image.open(src).convert("RGB")
    except OSError:
        return canvas
    # Cover crop
    scale = max(W / im.width, H / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - W) // 2
    top = (nh - H) // 2
    im = im.crop((left, top, left + W, top + H))
    canvas.paste(im, (0, 0))
    return canvas


def draw_overlay(canvas: Image.Image, title: str, blurb: str) -> Image.Image:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Bottom-heavy dark gradient for readable text
    for y in range(H):
        t = y / (H - 1)
        alpha = int(40 + 170 * (t ** 1.4))
        draw.line([(0, y), (W, y)], fill=(8, 6, 5, alpha))
    # Accent bar
    draw.rectangle([0, 0, 14, H], fill=(232, 184, 109, 230))

    title_font = load_font(54, bold=True)
    blurb_font = load_font(28, bold=False)
    brand_font = load_font(26, bold=True)
    url_font = load_font(24, bold=False)

    margin = 56
    draw.text((margin, 48), "REEB.", font=brand_font, fill=(232, 184, 109, 255))

    # Wrap title
    max_w = W - margin * 2
    words = title.replace("—", "— ").split()
    lines: list[str] = []
    cur = ""
    for word in words:
        test = f"{cur} {word}".strip()
        if draw.textlength(test, font=title_font) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    lines = lines[:3]

    y = 210
    for line in lines:
        draw.text((margin, y), line, font=title_font, fill=(255, 252, 245, 255))
        y += 64

    # Blurb one line truncated
    short = blurb
    while draw.textlength(short, font=blurb_font) > max_w and len(short) > 20:
        short = short[:-2]
    if short != blurb:
        short = short.rstrip(" .,;:") + "…"
    draw.text((margin, min(y + 12, 480)), short, font=blurb_font, fill=(230, 210, 170, 255))
    draw.text((margin, 560), "webconreeb.com · ejemplo", font=url_font, fill=(200, 180, 140, 255))

    return Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")


def extract_title(html: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", html, re.I)
    return (m.group(1).strip() if m else "Ejemplo Web con REEB")


def extract_description(html: str, slug: str) -> str:
    m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.I)
    if m and m.group(1).strip():
        return m.group(1).strip()
    return BLURBS.get(slug, "Ejemplo de página web a medida para su local. Web con REEB.")


OG_BLOCK = """  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Web con REEB">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{alt}">
  <meta property="og:locale" content="es_AR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{image}">
"""


def inject_meta(html: str, *, title: str, desc: str, url: str, image: str) -> str:
    # Remove previous OG/twitter/canonical robots we may have injected
    patterns = [
        r'\s*<meta\s+name="robots"[^>]*>\s*',
        r'\s*<link\s+rel="canonical"[^>]*>\s*',
        r'\s*<meta\s+property="og:[^"]+"[^>]*>\s*',
        r'\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*',
    ]
    cleaned = html
    for pat in patterns:
        cleaned = re.sub(pat, "\n", cleaned, flags=re.I)

    block = OG_BLOCK.format(
        url=url,
        title=title.replace('"', "&quot;"),
        desc=desc.replace('"', "&quot;"),
        image=image,
        alt=title.replace('"', "&quot;"),
    )

    # Insert after <title>...</title> or after description meta
    if re.search(r'<meta\s+name="description"', cleaned, re.I):
        cleaned = re.sub(
            r'(<meta\s+name="description"\s+content="[^"]*"\s*/?>)',
            r"\1\n" + block,
            cleaned,
            count=1,
            flags=re.I,
        )
    else:
        desc_tag = f'  <meta name="description" content="{desc.replace(chr(34), "&quot;")}">\n'
        cleaned = re.sub(
            r"(</title>)",
            r"\1\n" + desc_tag + block,
            cleaned,
            count=1,
            flags=re.I,
        )
    # Collapse excessive blank lines
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned


def write_page_meta(
    path: Path,
    *,
    slug: str,
    url: str,
    image: str,
    force_desc: str | None = None,
) -> str:
    html = path.read_text(encoding="utf-8")
    title = extract_title(html)
    desc = force_desc if force_desc else extract_description(html, slug)
    new_html = inject_meta(html, title=title, desc=desc, url=url, image=image)
    path.write_text(new_html, encoding="utf-8")
    return title


def main() -> None:
    skip = {"hub-img", "sistemas-ui"}
    for demo_dir in sorted(DEMOS.iterdir()):
        if not demo_dir.is_dir() or demo_dir.name in skip:
            continue
        index = demo_dir / "index.html"
        if not index.is_file():
            continue
        slug = demo_dir.name
        html = index.read_text(encoding="utf-8")
        title = extract_title(html)
        desc = extract_description(html, slug)
        cover = pick_cover(demo_dir)
        canvas = cover_canvas(cover)
        og = draw_overlay(canvas, title, desc)
        out = demo_dir / "og.jpg"
        og.save(out, "JPEG", quality=86, optimize=True)

        image = f"{BASE}/demos/{slug}/og.jpg?v={VERSION}"
        write_page_meta(index, slug=slug, url=f"{BASE}/demos/{slug}/", image=image)

        panel = demo_dir / "panel.html"
        if panel.is_file():
            panel_title = extract_title(panel.read_text(encoding="utf-8"))
            write_page_meta(
                panel,
                slug=slug,
                url=f"{BASE}/demos/{slug}/panel.html",
                image=image,
                force_desc=f"{panel_title}. Ejemplo a medida: gestione datos de ejemplo en el panel.",
            )

        prop = demo_dir / "propiedad.html"
        if prop.is_file():
            write_page_meta(
                prop,
                slug=slug,
                url=f"{BASE}/demos/{slug}/propiedad.html",
                image=image,
                force_desc=desc,
            )

        extras = []
        if panel.is_file():
            extras.append("panel")
        if prop.is_file():
            extras.append("propiedad")
        extra = f" + {', '.join(extras)}" if extras else ""
        print(f"OK {slug}: og.jpg ← {cover.name if cover else 'solid'}{extra}")


if __name__ == "__main__":
    main()
