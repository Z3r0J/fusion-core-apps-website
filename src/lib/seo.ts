/** Longest `<title>` the brand suffix may produce; Google truncates titles at roughly 60 characters. */
export const TITLE_MAX = 60;

/** Brand suffixes tried in order: the full name first, then the short one. */
const DEFAULT_BRANDS = ["FusionCore Apps", "FusionCore"] as const;

/**
 * Appends ` — <brand>` to a page title only when the result still fits in `max`
 * characters. With the default brands it tries "FusionCore Apps", then
 * "FusionCore"; when neither fits, or the title already names the brand, the
 * title is returned unchanged so the keyword part is never cut off in search results.
 */
export function withBrand(
	title: string,
	brand: string | readonly string[] = DEFAULT_BRANDS,
	max = TITLE_MAX,
): string {
	const brands = typeof brand === "string" ? [brand] : brand;
	if (brands.some((name) => title.includes(name))) return title;
	for (const name of brands) {
		const branded = `${title} — ${name}`;
		if (branded.length <= max) return branded;
	}
	return title;
}
