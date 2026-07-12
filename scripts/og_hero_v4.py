#!/usr/bin/env python3
"""
og_hero_v4.py — FusionCore Apps: generador final de hero/OG images para el blog.

Determinístico, reproducible en CI, cero costo, cero riesgo de licencias.
Mismo input -> misma imagen. La variación entre posts sale del hash del slug.

Composición (research v1-v3 aplicado)
-------------------------------------
  fondo      : off-black/off-white + 2 luces radiales del hue de marca
               (nada de mesh multiblob), o foto LICENCIADA en duotono de marca
  profundidad: viñeta fotográfica + grano fino. Sin glass panels, sin light
               sweep, sin bloom: esos tres eran los tells de "AI-generated"
  motivo     : glifo vectorial por tema (cart/book/receipt/shield/spark) en
               trazo fino con gradiente, GIGANTE y recortado sangrando por el
               borde derecho a baja opacidad — watermark estructural, no sticker
               ... o el ICONO REAL de la app montado en tile estilo app-icon
  tipografía : Space Grotesk display (fallback Inter), kicker mono, título
               dos-tonos con auto-fit + highlight de keywords en accent
  marca      : logo real (logo.png) + wordmark; tile app-icon en fondos oscuros
  variación  : hash(slug) -> posición de luz, radio de anillos, offset del
               motivo, dentro de rangos controlados
  guard      : chequeo de contraste título/fondo (falla el build si < 4.5:1
               con --strict)

Uso
---
python3 og_hero_v4.py --template dark \
  --title "AI Grocery List Generator: Build a Full List in Seconds" \
  --kicker Engineering --app CartWise --motif cart \
  --highlight "Seconds" --slug ai-grocery-list-generator \
  --meta "Jul 2026 · 6 min" --out public/images/blog/en/ai-grocery-list.png

# icono real de la app en vez de motif:
python3 og_hero_v4.py --template dark --title "..." --app Claimly \
  --icon public/images/apps/claimly/icon.png --slug claimly-launch --out out.png

# foto propia en duotono:
python3 og_hero_v4.py --template dark --title "..." --photo assets/bg.jpg --out out.png

# batch desde frontmatter de los .md de Astro:
# NO usar public/blog/: colisiona con la ruta /blog/[slug] y el asset no se sirve.
python3 og_hero_v4.py --batch src/content/blog/es --outdir public/images/blog/es \
  --fontdir scripts/fonts --logo public/logo.png
"""

import argparse
import hashlib
import math
import os
import random
import re
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---------------- configuración ----------------

SIZES = {"og": (1200, 630), "site": (1536, 1024)}

BRAND_CYAN = (50, 198, 255)  # muestreado de logo.png del sitio

# (accent, second, third) por app — second alimenta la 2da luz radial
PALETTES = {
    "cartwise":   ((52, 211, 153), (14, 116, 144), (23, 58, 92)),
    "claimly":    ((96, 165, 250), (67, 96, 205), (28, 52, 100)),
    "expiroo":    ((134, 214, 148), (46, 140, 110), (24, 66, 52)),
    "bible tpt":  ((247, 186, 98), (204, 108, 74), (62, 46, 82)),
    "biblia tla": ((246, 132, 114), (181, 74, 110), (46, 42, 92)),
    "default":    (BRAND_CYAN, (24, 92, 140), (16, 44, 70)),
}
MOTIF_BY_APP = {"cartwise": "cart", "claimly": "receipt",
                "expiroo": "shield", "bible tpt": "book", "biblia tla": "book"}

DARK_BG = (7, 10, 16)
LIGHT_BG = (246, 244, 239)


# ---------------- fuentes ----------------

def find_fonts(fontdir=None):
    """Space Grotesk (display) + Inter (ui) + JetBrains Mono (meta).
    Busca en fontdir, ./fonts, node_modules de expo-google-fonts; degrada a
    Inter para display y a DejaVu como último recurso."""
    roots = [r for r in [fontdir, "fonts", "scripts/fonts", "assets/fonts",
                         "node_modules/@expo-google-fonts/inter",
                         "node_modules/@expo-google-fonts/space-grotesk",
                         "node_modules/@expo-google-fonts/jetbrains-mono"] if r]
    hits = {}
    for r in roots:
        if not os.path.isdir(r):
            continue
        for dp, _, fs in os.walk(r):
            if "__MACOSX" in dp:
                continue
            for fn in fs:
                if (fn.lower().endswith(".ttf") and "italic" not in fn.lower()
                        and not fn.startswith("._")):
                    hits.setdefault(fn, os.path.join(dp, fn))

    def pick(*names):
        for n in names:
            for k, v in hits.items():
                if n.lower() in k.lower():
                    return v
        return None

    display = pick("SpaceGrotesk-Bold", "SpaceGrotesk_700",
                   "Inter_800ExtraBold", "Inter-Bold")
    semi = pick("Inter_600SemiBold", "Inter-SemiBold", "Inter_500Medium")
    mono = pick("JetBrainsMono-Regular", "JetBrainsMono_400")
    mono_med = pick("JetBrainsMono-Medium", "JetBrainsMono_500") or mono
    dj = "/usr/share/fonts/truetype/dejavu/"
    return {
        "display": display or dj + "DejaVuSans-Bold.ttf",
        "semi": semi or dj + "DejaVuSans-Bold.ttf",
        "mono": mono or dj + "DejaVuSansMono.ttf",
        "mono_med": mono_med or dj + "DejaVuSansMono-Bold.ttf",
    }


# ---------------- atmósfera ----------------

def _mesh(W, H):
    return np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))


def radial_light(img, cx, cy, radius, color, strength=0.5):
    W, H = img.size
    XX, YY = _mesh(W, H)
    d = np.sqrt((XX - cx) ** 2 + (YY - cy) ** 2)
    mask = np.clip(1.0 - d / radius, 0, 1) ** 2 * strength
    base = np.asarray(img.convert("RGB"), dtype=np.float32)
    col = np.array(color, dtype=np.float32)
    out = base + (col - base) * mask[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def vignette(img, strength=0.32):
    W, H = img.size
    XX, YY = _mesh(W, H)
    dx, dy = (XX - W / 2) / (W / 2), (YY - H / 2) / (H / 2)
    d = np.sqrt(dx ** 2 + dy ** 2)
    mask = 1.0 - np.clip(d - 0.55, 0, 1) ** 1.6 * strength
    base = np.asarray(img.convert("RGB"), dtype=np.float32) * mask[..., None]
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))


def grain(img, opacity=0.032, sigma=40, seed=3):
    W, H = img.size
    rng = np.random.default_rng(seed)
    n = rng.normal(0, sigma, (H, W, 1)).astype(np.float32) / 128.0 * opacity * 255.0
    base = np.asarray(img.convert("RGB"), dtype=np.float32)
    return Image.fromarray(np.clip(base + n, 0, 255).astype(np.uint8))


def gradient_ring(size, color, width=4, fade_from=0.05, fade_to=1.0):
    """Anillo cuyo trazo se desvanece verticalmente."""
    s = size
    ring = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(ring)
    d.ellipse([width, width, s - width, s - width],
              outline=(255, 255, 255, 255), width=width)
    alpha = np.asarray(ring.split()[3], dtype=np.float32)
    grad = np.linspace(fade_from, fade_to, s, dtype=np.float32)[:, None]
    out = Image.new("RGBA", (s, s), tuple(color) + (0,))
    out.putalpha(Image.fromarray((alpha * grad).astype(np.uint8)))
    return out


def duotone_photo(path, W, H, accent):
    """Foto LICENCIADA -> duotono de marca + scrim izquierdo para el texto."""
    im = Image.open(path).convert("RGB")
    ar_t = W / H
    if im.width / im.height > ar_t:
        nw = int(im.height * ar_t)
        im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    else:
        nh = int(im.width / ar_t)
        im = im.crop((0, 0, im.width, nh))
    im = im.resize((W, H), Image.LANCZOS)
    g = np.asarray(im.convert("L"), dtype=np.float32) / 255.0
    lo = np.array((6, 10, 18), dtype=np.float32)
    hi = np.array(accent, dtype=np.float32) * 0.85 + 40
    arr = lo + (hi - lo) * (g ** 1.15)[..., None]
    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    scrim = Image.new("L", (W, H), 0)
    ImageDraw.Draw(scrim).rectangle([0, 0, int(W * 0.62), H], fill=225)
    scrim = scrim.filter(ImageFilter.GaussianBlur(W / 7))
    return Image.composite(Image.new("RGB", (W, H), (4, 8, 14)), out, scrim)


# ---------------- motivos (trazo fino, sin bloom) ----------------

def _cart(d, S, col, w):
    d.line([(0.10 * S, 0.20 * S), (0.24 * S, 0.20 * S), (0.36 * S, 0.62 * S),
            (0.80 * S, 0.62 * S)], fill=col, width=w, joint="curve")
    d.line([(0.27 * S, 0.30 * S), (0.90 * S, 0.30 * S), (0.80 * S, 0.62 * S)],
           fill=col, width=w, joint="curve")
    d.line([(0.45 * S, 0.30 * S), (0.50 * S, 0.62 * S)], fill=col, width=int(w * 0.6))
    d.line([(0.62 * S, 0.30 * S), (0.64 * S, 0.62 * S)], fill=col, width=int(w * 0.6))
    for cx in (0.44, 0.76):
        r = 0.055 * S
        d.ellipse([cx * S - r, 0.78 * S - r, cx * S + r, 0.78 * S + r],
                  outline=col, width=w)


def _book(d, S, col, w):
    d.line([(0.50 * S, 0.24 * S), (0.50 * S, 0.86 * S)], fill=col, width=w)
    d.line([(0.50 * S, 0.26 * S), (0.16 * S, 0.16 * S), (0.16 * S, 0.76 * S),
            (0.50 * S, 0.86 * S)], fill=col, width=w, joint="curve")
    d.line([(0.50 * S, 0.26 * S), (0.84 * S, 0.16 * S), (0.84 * S, 0.76 * S),
            (0.50 * S, 0.86 * S)], fill=col, width=w, joint="curve")
    for i, ty in enumerate((0.38, 0.50, 0.62)):
        d.line([(0.24 * S, ty * S - i * 0.004 * S), (0.43 * S, ty * S + 0.02 * S)],
               fill=col, width=int(w * 0.55))
        d.line([(0.57 * S, ty * S + 0.02 * S), (0.76 * S, ty * S - i * 0.004 * S)],
               fill=col, width=int(w * 0.55))


def _receipt(d, S, col, w):
    x0, x1, y0 = 0.26 * S, 0.74 * S, 0.14 * S
    zig = [(x0, 0.84 * S)]
    for i in range(7):
        zig.append((x0 + (x1 - x0) * (i + 0.5) / 7,
                    0.84 * S + (0.035 * S if i % 2 else -0.035 * S)))
    zig.append((x1, 0.84 * S))
    d.line([(x0, y0), (x1, y0), (x1, 0.84 * S)], fill=col, width=w, joint="curve")
    d.line(zig, fill=col, width=w, joint="curve")
    d.line([(x0, y0), (x0, 0.84 * S)], fill=col, width=w)
    for ty, tw in ((0.30, 0.72), (0.42, 0.48), (0.54, 0.62)):
        d.line([(x0 + 0.06 * S, ty * S),
                (x0 + 0.06 * S + (x1 - x0 - 0.12 * S) * tw, ty * S)],
               fill=col, width=int(w * 0.6))
    d.line([(x0 + 0.06 * S, 0.68 * S), (x1 - 0.06 * S, 0.68 * S)],
           fill=col, width=int(w * 0.6))


def _shield(d, S, col, w):
    d.line([(0.50 * S, 0.12 * S), (0.84 * S, 0.26 * S), (0.84 * S, 0.54 * S),
            (0.50 * S, 0.88 * S), (0.16 * S, 0.54 * S), (0.16 * S, 0.26 * S),
            (0.50 * S, 0.12 * S)], fill=col, width=w, joint="curve")
    d.line([(0.34 * S, 0.50 * S), (0.46 * S, 0.62 * S), (0.68 * S, 0.38 * S)],
           fill=col, width=int(w * 1.15), joint="curve")


def _spark(d, S, col, w):
    for ang in range(0, 360, 45):
        a = math.radians(ang)
        ln = 0.36 * S if ang % 90 == 0 else 0.24 * S
        d.line([(0.5 * S, 0.5 * S),
                (0.5 * S + ln * math.cos(a), 0.5 * S + ln * math.sin(a))],
               fill=col, width=w if ang % 90 == 0 else int(w * 0.6))
    r = 0.14 * S
    d.ellipse([0.5 * S - r, 0.5 * S - r, 0.5 * S + r, 0.5 * S + r],
              outline=col, width=w)


MOTIFS = {"cart": _cart, "book": _book, "receipt": _receipt,
          "shield": _shield, "spark": _spark}


def motif_layer(name, size, accent, max_alpha=95, scale=2):
    """Glifo en trazo fino con gradiente vertical en el ALPHA (se desvanece
    hacia abajo) y color plano del accent. Sin bloom, sin glow."""
    S = size * scale
    stroke = Image.new("L", (S, S), 0)
    MOTIFS.get(name, _spark)(ImageDraw.Draw(stroke), S, 255, max(3, int(S * 0.014)))
    alpha = np.asarray(stroke, dtype=np.float32)
    fade = np.linspace(1.0, 0.25, S, dtype=np.float32)[:, None]
    alpha = (alpha / 255.0 * fade * max_alpha).astype(np.uint8)
    layer = Image.new("RGBA", (S, S), tuple(accent) + (0,))
    layer.putalpha(Image.fromarray(alpha))
    return layer.resize((size, size), Image.LANCZOS)


# ---------------- tipografía ----------------

def tracked(draw, xy, text, font, fill, tr=0.0):
    x, y = xy
    px = tr * font.size
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + px
    return x


def t_width(draw, text, font, tr=0.0):
    px = tr * font.size
    return sum(draw.textlength(c, font=font) for c in text) + px * max(len(text) - 1, 0)


def wrap_tr(draw, text, font, max_w, tr=0.0):
    words, lines, cur = text.split(), [], ""
    for w in words:
        probe = f"{cur} {w}".strip()
        if t_width(draw, probe, font, tr) <= max_w:
            cur = probe
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_title(draw, text, path, max_w, max_h, start, floor, tr=-0.03, leading=1.08):
    size = start
    while size > floor:
        font = ImageFont.truetype(path, size)
        lines = wrap_tr(draw, text, font, max_w, tr)
        if len(lines) * font.size * leading <= max_h and len(lines) <= 4:
            return font, lines
        size -= 2
    font = ImageFont.truetype(path, floor)
    return font, wrap_tr(draw, text, font, max_w, tr)


def _norm(w):
    return re.sub(r"[^\wáéíóúüñ]+", "", w.lower())


def title_block(draw, xy, lines, font, bright, dim, accent, lead_words,
                highlights, tr=-0.03, leading=1.08):
    """Dos tonos (patrón Linear) + keywords en accent (patrón Stripe/Figma).
    Prioridad de color: highlight > bright/dim por posición."""
    hset = {_norm(h) for h in highlights}
    x0, y = xy
    count = 0
    px = tr * font.size
    for line in lines:
        x = x0
        for wd in line.split(" "):
            if _norm(wd) in hset:
                color = accent
            else:
                color = bright if count < lead_words else dim
            x = tracked(draw, (x, y), wd, font, color, tr)
            x += draw.textlength(" ", font=font) + px
            count += 1
        y += int(font.size * leading)
    return y


# ---------------- marca ----------------

def rounded_tile(content, tile_size, radius, fill, outline=None):
    tile = Image.new("RGBA", (tile_size, tile_size), (0, 0, 0, 0))
    td = ImageDraw.Draw(tile)
    td.rounded_rectangle([0, 0, tile_size - 1, tile_size - 1], radius=radius,
                         fill=fill, outline=outline, width=1)
    if content is not None:
        content.thumbnail((tile_size - 2 * (tile_size // 8),) * 2, Image.LANCZOS)
        tile.paste(content, ((tile_size - content.width) // 2,
                             (tile_size - content.height) // 2), content)
    return tile


def brand_lockup(img, draw, F, logo_path, x, y, text_color, s,
                 wordmark="FusionCore Apps", dark_bg=True):
    """Logo real + wordmark. En fondo oscuro, el logo (mayormente oscuro) va
    sobre tile claro estilo app-icon."""
    logo_h = int(46 * s)
    lx = x
    if logo_path and os.path.exists(logo_path):
        lg = Image.open(logo_path).convert("RGBA")
        if dark_bg:
            ts = logo_h + int(18 * s)
            tile = rounded_tile(lg, ts, int(13 * s),
                                (243, 245, 250, 255), (255, 255, 255, 60))
            img.paste(tile, (lx, y - int(9 * s)), tile)
            lx += ts + int(16 * s)
        else:
            r = logo_h / lg.height
            lg = lg.resize((int(lg.width * r), logo_h), Image.LANCZOS)
            img.paste(lg, (lx, y), lg)
            lx += lg.width + int(16 * s)
    bf = ImageFont.truetype(F["semi"], int(26 * s))
    draw.text((lx, y + (logo_h - int(32 * s)) // 2), wordmark, font=bf, fill=text_color)


def app_icon_feature(img, icon_path, cx, cy, size, s, dark_bg=True):
    """Icono REAL de la app en tile grande estilo app-icon: asset auténtico
    que ningún generador produce."""
    icon = Image.open(icon_path).convert("RGBA")
    fill = (16, 20, 30, 255) if dark_bg else (255, 255, 255, 255)
    outline = (255, 255, 255, 46) if dark_bg else (210, 205, 196, 255)
    tile = rounded_tile(icon, size, int(size * 0.22), fill, outline)
    # sombra suave y corta (design system real, no glow)
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(
        [cx - size // 2 + 6, cy - size // 2 + 10,
         cx + size // 2 + 6, cy + size // 2 + 10],
        radius=int(size * 0.22), fill=(0, 0, 0, 70))
    sh = sh.filter(ImageFilter.GaussianBlur(10 * s))
    img.alpha_composite(sh)
    img.alpha_composite(tile, (cx - size // 2, cy - size // 2))


# ---------------- guard de contraste ----------------

def _rel_lum(rgb):
    c = [v / 255.0 for v in rgb]
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast_guard(img, region, text_rgb, min_ratio=4.5, strict=False):
    """Contraste WCAG entre el color del título y el fondo medio de su región."""
    x0, y0, x1, y1 = region
    arr = np.asarray(img.convert("RGB"))[y0:y1, x0:x1].reshape(-1, 3)
    bg = tuple(arr.mean(axis=0))
    l1, l2 = sorted([_rel_lum(text_rgb), _rel_lum(bg)], reverse=True)
    ratio = (l1 + 0.05) / (l2 + 0.05)
    ok = ratio >= min_ratio
    tag = "OK" if ok else "BAJO"
    print(f"  contraste titulo/fondo: {ratio:.2f}:1 [{tag}]")
    if not ok and strict:
        sys.exit(f"FALLO contraste ({ratio:.2f} < {min_ratio}). "
                 f"Ajusta paleta/scrim o quita --strict.")
    return ratio


# ---------------- variación determinística por slug ----------------

def slug_rng(slug):
    h = int(hashlib.md5((slug or "default").encode()).hexdigest()[:8], 16)
    return random.Random(h)


# ---------------- templates ----------------

def tpl_dark(cfg):
    W, H = SIZES[cfg["size"]]
    s = H / 630.0
    M = int(80 * s)
    pal = cfg["palette"]
    accent, second = pal[0], pal[1]
    rng = slug_rng(cfg["slug"])
    F = cfg["fonts"]

    if cfg["photo"] and os.path.exists(cfg["photo"]):
        img = duotone_photo(cfg["photo"], W, H, accent)
    else:
        img = Image.new("RGB", (W, H), DARK_BG)
        lx = W * rng.uniform(0.84, 0.98)
        img = radial_light(img, lx, -40 * s, rng.uniform(760, 880) * s,
                           (accent[0] // 4, accent[1] // 3, accent[2] // 3 + 14), 0.9)
        img = radial_light(img, -120 * s, H + 80 * s, 720 * s,
                           tuple(int(c * 0.28) for c in second), 0.9)

    # anillos degradados sangrando arriba-derecha (radio y posición por slug)
    r1 = int(rng.uniform(500, 620) * s)
    ox = int(rng.uniform(-40, 30) * s)
    ring = gradient_ring(r1, accent, width=max(2, int(3 * s)),
                         fade_from=0.0, fade_to=0.9)
    img = img.convert("RGBA")
    img.alpha_composite(ring, (W - int(r1 * 0.62) + ox, -int(r1 * 0.42)))
    ring2 = gradient_ring(r1, accent, width=max(1, int(2 * s)),
                          fade_from=0.0, fade_to=0.4)
    img.alpha_composite(ring2, (W - int(r1 * 0.52) + ox, -int(r1 * 0.35)))

    # motivo gigante recortado a la derecha, o icono real de la app
    if cfg["icon"] and os.path.exists(cfg["icon"]):
        app_icon_feature(img, cfg["icon"], int(W * 0.855), int(H * 0.44),
                         int(200 * s), s, dark_bg=True)
    elif cfg["motif"]:
        ms = int(H * rng.uniform(1.05, 1.25))
        ml = motif_layer(cfg["motif"], ms, accent, max_alpha=60)
        mx = W - int(ms * rng.uniform(0.42, 0.55))
        my = int(H * rng.uniform(0.12, 0.28))
        img.alpha_composite(ml, (mx, my))

    d = ImageDraw.Draw(img)
    brand_lockup(img, d, F, cfg["logo"], M, int(58 * s), (238, 240, 246), s,
                 dark_bg=True)

    kf = ImageFont.truetype(F["mono_med"], int(21 * s))
    ky = int(208 * s)
    kcolor = tuple(min(c + 50, 255) for c in accent)
    tracked(d, (M, ky), cfg["kicker"].upper(), kf, kcolor, tr=0.16)

    col_w = W - M * 2 - int((240 if (cfg["icon"] or cfg["motif"]) else 100) * s)
    font, lines = fit_title(d, cfg["title"], F["display"], col_w,
                            int(260 * s), int(76 * s), int(44 * s))
    ty = ky + int(52 * s)
    title_block(d, (M - 3, ty), lines, font,
                bright=(242, 243, 248), dim=(122, 130, 152), accent=kcolor,
                lead_words=max(2, len(cfg["title"].split()) // 2),
                highlights=cfg["highlight"])

    # subtitle solo en tamaño site (en og es ilegible a tamaño feed)
    if cfg["size"] == "site" and cfg["subtitle"]:
        sf = ImageFont.truetype(F["semi"], int(27 * s))
        yy = ty + len(lines) * int(font.size * 1.08) + int(18 * s)
        for ln in wrap_tr(d, cfg["subtitle"], sf, col_w)[:2]:
            d.text((M, yy), ln, font=sf, fill=(150, 158, 178))
            yy += int(sf.size * 1.45)

    d.line([(M, H - int(92 * s)), (W - M, H - int(92 * s))],
           fill=(36, 42, 58), width=1)
    mf = ImageFont.truetype(F["mono"], int(20 * s))
    tracked(d, (M, H - int(66 * s)), cfg["url"], mf, (128, 136, 158), tr=0.02)
    if cfg["meta"]:
        mt = cfg["meta"].upper()
        tracked(d, (W - M - t_width(d, mt, mf, 0.08), H - int(66 * s)),
                mt, mf, (128, 136, 158), tr=0.08)

    img = vignette(img.convert("RGB"), 0.34)
    img = grain(img, 0.035, seed=slug_rng(cfg["slug"]).randint(0, 9999))
    contrast_guard(img, (M, ty, M + col_w, ty + int(200 * s)), (242, 243, 248),
                   strict=cfg["strict"])
    return img


def tpl_light(cfg):
    W, H = SIZES[cfg["size"]]
    s = H / 630.0
    M = int(80 * s)
    accent = cfg["palette"][0]
    rng = slug_rng(cfg["slug"])
    F = cfg["fonts"]

    img = Image.new("RGB", (W, H), LIGHT_BG)
    img = radial_light(img, W * 0.95, -60 * s, 900 * s, (252, 242, 228), 0.7)
    img = radial_light(img, -80 * s, H, 760 * s, (238, 235, 228), 0.6)
    d = ImageDraw.Draw(img)

    # hairlines verticales derecha
    for x in range(W - int(300 * s), W, int(30 * s)):
        d.line([(x, 0), (x, H)], fill=(224, 219, 209), width=1)

    # esfera accent recortada abajo-derecha con luz propia (posición por slug)
    cx = W - int(rng.uniform(100, 170) * s)
    cy = H - int(rng.uniform(30, 90) * s)
    r = int(rng.uniform(170, 210) * s)
    sph = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sph).ellipse([cx - r, cy - r, cx + r, cy + r],
                                fill=tuple(accent) + (255,))
    img.paste(sph, (0, 0), sph)
    hi = tuple(min(255, int(c * 1.25 + 30)) for c in accent)
    img = radial_light(img, cx - 70 * s, cy - 90 * s, r, hi, 0.5)

    img = img.convert("RGBA")
    if cfg["icon"] and os.path.exists(cfg["icon"]):
        app_icon_feature(img, cfg["icon"], int(W * 0.85), int(H * 0.38),
                         int(190 * s), s, dark_bg=False)
    elif cfg["motif"]:
        ms = int(H * rng.uniform(0.95, 1.1))
        dark_accent = tuple(int(c * 0.55) for c in accent)
        ml = motif_layer(cfg["motif"], ms, dark_accent, max_alpha=42)
        img.alpha_composite(ml, (W - int(ms * 0.5), int(H * 0.10)))

    d = ImageDraw.Draw(img)
    brand_lockup(img, d, F, cfg["logo"], M, int(56 * s), (28, 27, 26), s,
                 dark_bg=False)

    kf = ImageFont.truetype(F["mono_med"], int(20 * s))
    chip = cfg["kicker"].upper()
    cw = t_width(d, chip, kf, 0.12) + int(40 * s)
    d.rounded_rectangle([M, int(196 * s), M + cw, int(238 * s)],
                        radius=int(21 * s), outline=tuple(accent), width=2)
    tracked(d, (M + int(20 * s), int(206 * s)), chip, kf, tuple(accent), tr=0.12)

    col_w = W - M * 2 - int(220 * s)
    font, lines = fit_title(d, cfg["title"], F["display"], col_w,
                            int(240 * s), int(72 * s), int(42 * s))
    ty = int(286 * s)
    title_block(d, (M - 3, ty), lines, font,
                bright=(26, 25, 24), dim=(150, 144, 132),
                accent=tuple(int(c * 0.72) for c in accent),
                lead_words=max(2, len(cfg["title"].split()) * 2 // 3),
                highlights=cfg["highlight"])

    if cfg["size"] == "site" and cfg["subtitle"]:
        sf = ImageFont.truetype(F["semi"], int(27 * s))
        yy = ty + len(lines) * int(font.size * 1.08) + int(18 * s)
        for ln in wrap_tr(d, cfg["subtitle"], sf, col_w)[:2]:
            d.text((M, yy), ln, font=sf, fill=(120, 114, 104))
            yy += int(sf.size * 1.45)

    d.line([(M, H - int(92 * s)), (W - int(360 * s), H - int(92 * s))],
           fill=(214, 209, 199), width=1)
    mf = ImageFont.truetype(F["mono"], int(20 * s))
    tracked(d, (M, H - int(66 * s)), cfg["url"], mf, (138, 132, 121), tr=0.02)
    if cfg["meta"]:
        tracked(d, (M + int(420 * s), H - int(66 * s)), cfg["meta"].upper(),
                mf, (168, 162, 150), tr=0.08)

    img = vignette(img.convert("RGB"), 0.16)
    img = grain(img, 0.026, seed=slug_rng(cfg["slug"]).randint(0, 9999))
    contrast_guard(img, (M, ty, M + col_w, ty + int(200 * s)), (26, 25, 24),
                   strict=cfg["strict"])
    return img


# ---------------- render + salida ----------------

def render(cfg):
    key = (cfg["app"] or "").strip().lower()
    cfg["palette"] = PALETTES.get(key, PALETTES["default"])
    if cfg["motif"] is None and not cfg["icon"]:
        cfg["motif"] = MOTIF_BY_APP.get(key)  # puede quedar None: fondo limpio
    cfg["fonts"] = find_fonts(cfg["fontdir"])

    img = (tpl_dark if cfg["template"] == "dark" else tpl_light)(cfg)

    out = cfg["out"]
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    img.save(out, "PNG", optimize=True)
    kb = os.path.getsize(out) / 1024
    msg = f"{out}  {img.width}x{img.height}  {kb:.0f} KB"
    if kb > 900:
        jpg = os.path.splitext(out)[0] + ".jpg"
        img.save(jpg, "JPEG", quality=88, optimize=True, progressive=True)
        msg += f"  -> tambien {jpg} ({os.path.getsize(jpg)/1024:.0f} KB); usa el .jpg"
    print(msg)


# ---------------- batch desde frontmatter ----------------

FM_RE = re.compile(r"^---\s*$(.*?)^---\s*$", re.M | re.S)


def parse_frontmatter(path):
    with open(path, encoding="utf-8") as f:
        m = FM_RE.search(f.read())
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^(\w+):\s*[\"']?(.*?)[\"']?\s*$", line.strip())
        if kv:
            fm[kv.group(1).lower()] = kv.group(2)
    return fm


def run_batch(indir, outdir, base_cfg):
    for fn in sorted(os.listdir(indir)):
        if not fn.endswith((".md", ".mdx")):
            continue
        fm = parse_frontmatter(os.path.join(indir, fn))
        if not fm.get("title"):
            print(f"SKIP {fn}: sin title en frontmatter")
            continue
        slug = fm.get("slug") or os.path.splitext(fn)[0]
        cfg = dict(base_cfg)
        cfg.update(title=fm["title"], subtitle=fm.get("description", ""),
                   app=fm.get("app", base_cfg["app"]),
                   kicker=fm.get("category", base_cfg["kicker"]),
                   slug=slug, out=os.path.join(outdir, f"{slug}.png"))
        render(cfg)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--template", default="dark", choices=["dark", "light"])
    p.add_argument("--title")
    p.add_argument("--subtitle", default="", help="solo se dibuja en --size site")
    p.add_argument("--kicker", default="Blog")
    p.add_argument("--app", default="")
    p.add_argument("--motif", default=None, choices=list(MOTIFS))
    p.add_argument("--icon", default=None, help="icono real de la app (png)")
    p.add_argument("--photo", default=None, help="foto LICENCIADA -> duotono")
    p.add_argument("--logo", default="logo.png")
    p.add_argument("--highlight", default="", help="palabras del titulo en accent, coma-sep")
    p.add_argument("--slug", default="", help="controla la variacion deterministica")
    p.add_argument("--url", default="fusioncoreapps.com/blog")
    p.add_argument("--meta", default="", help="ej: 'Jul 2026 · 6 min'")
    p.add_argument("--size", default="og", choices=list(SIZES))
    p.add_argument("--strict", action="store_true", help="falla si contraste < 4.5")
    p.add_argument("--fontdir", default=None)
    p.add_argument("--batch", default=None, help="dir con .md de Astro")
    p.add_argument("--outdir", default="out", help="salida en modo batch")
    p.add_argument("--out")
    a = p.parse_args()

    base = dict(template=a.template, title=a.title, subtitle=a.subtitle,
                kicker=a.kicker, app=a.app, motif=a.motif, icon=a.icon,
                photo=a.photo, logo=a.logo,
                highlight=[h.strip() for h in a.highlight.split(",") if h.strip()],
                slug=a.slug, url=a.url, meta=a.meta, size=a.size,
                strict=a.strict, fontdir=a.fontdir, out=a.out)

    if a.batch:
        run_batch(a.batch, a.outdir, base)
    elif a.title and a.out:
        render(base)
    else:
        p.error("se requiere --title y --out, o --batch")
