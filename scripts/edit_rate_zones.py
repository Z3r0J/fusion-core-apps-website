#!/usr/bin/env python3
"""Genera el chart de zonas de decisión del edit rate para el post
ai-autofill-confirmation-step (en/es/pt).

Uso:  python scripts/edit_rate_zones.py

Salida: public/images/blog/<locale>/ai-autofill-edit-rate-zones.png (2000x1040)

Los umbrales (5% / 40%) son heurísticos de diseño, no benchmarks medidos;
el chart lo declara en su nota al pie. Colores = tokens de global.css en el
paso -600 (AA sobre blanco); el gris de la zona izquierda es deliberado
(zona "inerte": no está pasando nada).
"""

import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.patches import FancyBboxPatch, Rectangle

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "scripts" / "fonts"

DISPLAY = FontProperties(fname=str(FONTS / "SpaceGrotesk_700Bold.ttf"))
BODY_BOLD = FontProperties(fname=str(FONTS / "Inter_800ExtraBold.ttf"))
BODY = FontProperties(fname=str(FONTS / "Inter_600SemiBold.ttf"))
MONO = FontProperties(fname=str(FONTS / "JetBrainsMono_500Medium.ttf"))

INK = "#101828"
MUTED = "#667085"
FAINT = "#98a2b3"
SURFACE = "#ffffff"

# slate (zona inerte) · brand-600 · accent-600  — validados sobre blanco
ZONE_COLORS = ["#64748b", "#0091cc", "#db681a"]
ZONE_BOUNDS = [(0, 5), (5, 40), (40, 100)]

LOCALES = {
	"en": {
		"title": "How to read your edit rate",
		"subtitle": "Share of scans where the user edits at least one field on the review screen",
		"zones": [
			("0–5%", "Gate over-engineered", "Shrink it to a micro-confirmation."),
			("5–40%", "Healthy zone", "The review step is earning its keep."),
			("40%+", "Extraction struggling", "Fix the model, not the gate."),
		],
		"axis": "edit rate — % of scans with at least one edited field",
		"note": "Guide thresholds, not a measured benchmark — instrument the review screen and see where you land.",
	},
	"es": {
		"title": "Cómo leer tu edit rate",
		"subtitle": "Porcentaje de escaneos donde el usuario edita al menos un campo en la pantalla de revisión",
		"zones": [
			("0–5%", "Barrera sobredimensionada", "Redúcela a una microconfirmación."),
			("5–40%", "Zona sana", "La revisión se gana su lugar."),
			("40%+", "La extracción falla", "Arregla el modelo, no la barrera."),
		],
		"axis": "edit rate — % de escaneos con al menos un campo editado",
		"note": "Umbrales de guía, no un benchmark medido — instrumenta la pantalla de revisión y mide dónde caes.",
	},
	"pt": {
		"title": "Como ler seu edit rate",
		"subtitle": "Percentual de escaneamentos em que o usuário edita pelo menos um campo na tela de revisão",
		"zones": [
			("0–5%", "Barreira superdimensionada", "Reduza a uma microconfirmação."),
			("5–40%", "Zona saudável", "A etapa de revisão se paga."),
			("40%+", "A extração está falhando", "Corrija o modelo, não a barreira."),
		],
		"axis": "edit rate — % de escaneamentos com pelo menos um campo editado",
		"note": "Limiares de guia, não um benchmark medido — instrumente a tela de revisão e meça onde você cai.",
	},
}


def render(locale: str, cfg: dict, out: Path) -> None:
	fig = plt.figure(figsize=(10.0, 5.2), dpi=200)
	fig.patch.set_facecolor(SURFACE)
	ax = fig.add_axes([0, 0, 1, 1])
	ax.set_xlim(0, 1000)
	ax.set_ylim(0, 520)
	ax.axis("off")

	pad = 64

	# ── Título y subtítulo ──
	ax.text(pad, 470, cfg["title"], fontproperties=DISPLAY, fontsize=23, color=INK)
	sub = textwrap.fill(cfg["subtitle"], 78)
	ax.text(pad, 436, sub, fontproperties=BODY, fontsize=11.5, color=MUTED, va="top")

	# ── Tres columnas de zona (chip + nombre + acción) ──
	col_w = (1000 - 2 * pad) / 3
	for i, (rng, name, action) in enumerate(cfg["zones"]):
		x = pad + i * col_w
		y = 360
		ax.add_patch(Rectangle((x, y - 3), 13, 13, color=ZONE_COLORS[i], ec="none"))
		ax.text(x + 22, y, rng, fontproperties=MONO, fontsize=11, color=INK, va="baseline")
		ax.text(x, y - 28, textwrap.fill(name, 24), fontproperties=BODY_BOLD, fontsize=12,
			color=INK, va="top", linespacing=1.25)
		ax.text(x, y - 78, textwrap.fill(action, 30), fontproperties=BODY, fontsize=10.5,
			color=MUTED, va="top", linespacing=1.3)

	# ── Banda de zonas ──
	band_y, band_h = 160, 56
	band_x, band_w = pad, 1000 - 2 * pad
	gap = 3  # separación entre rellenos adyacentes

	clip = FancyBboxPatch((band_x, band_y), band_w, band_h,
		boxstyle="round,pad=0,rounding_size=10", transform=ax.transData,
		facecolor="none", edgecolor="none")
	ax.add_patch(clip)
	for i, (lo, hi) in enumerate(ZONE_BOUNDS):
		x0 = band_x + band_w * lo / 100 + (gap / 2 if lo > 0 else 0)
		x1 = band_x + band_w * hi / 100 - (gap / 2 if hi < 100 else 0)
		seg = Rectangle((x0, band_y), x1 - x0, band_h, color=ZONE_COLORS[i], ec="none")
		seg.set_clip_path(clip)
		ax.add_patch(seg)

	# ── Ticks y números (mono) ──
	for pct in (0, 5, 40, 100):
		tx = band_x + band_w * pct / 100
		if pct in (5, 40):
			ax.plot([tx, tx], [band_y - 14, band_y - 4], color=FAINT, lw=1.2,
				solid_capstyle="round")
		align = "left" if pct == 0 else ("right" if pct == 100 else "center")
		ax.text(tx, band_y - 24, f"{pct}%", fontproperties=MONO, fontsize=10.5,
			color=MUTED, ha=align, va="top")

	# ── Eje y nota al pie ──
	ax.text(pad, 92, cfg["axis"], fontproperties=BODY, fontsize=10.5, color=FAINT, va="top")
	ax.text(pad, 52, textwrap.fill(cfg["note"], 105), fontproperties=BODY, fontsize=9.5,
		color=FAINT, va="top", style="italic", linespacing=1.35)

	out.parent.mkdir(parents=True, exist_ok=True)
	fig.savefig(out, facecolor=SURFACE)
	plt.close(fig)
	print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
	for locale, cfg in LOCALES.items():
		render(locale, cfg, ROOT / "public" / "images" / "blog" / locale /
			"ai-autofill-edit-rate-zones.png")
