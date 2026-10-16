import type { Locale } from "@/i18n/utils";

/**
 * Our apps that have head-to-head comparison pages (`src/content/comparisons`).
 * Each comparison entry names its app in the `app` frontmatter field
 * (default "cartwise"); everything app-specific on the comparison pages
 * (URL prefix, name, icon, Play link, OG image, copy) is resolved from here.
 */
export const COMPARE_APPS = ["cartwise", "claimly"] as const;
export type CompareApp = (typeof COMPARE_APPS)[number];

interface CompareAppMeta {
	/** Display name used in "<name> vs <competitor>". */
	name: string;
	playUrl: string;
	/** Square app icon shown in the hero and pro/con card. */
	icon: string;
	/** Shown if the icon fails to load. */
	iconEmoji: string;
	/** og:image for the comparison pages (the app icon, 512×512). */
	ogImage: { src: string; width: number; height: number };
	/** schema.org SoftwareApplication applicationCategory. */
	applicationCategory: string;
	/**
	 * Namespace in src/i18n/<locale>.json holding this app's comparison copy.
	 * Keys missing there fall back to `cartwiseCompare.*`, which doubles as the
	 * shared copy (breadcrumbs, table labels, footnotes).
	 */
	i18nNamespace: string;
}

export const COMPARE_APP_META: Record<CompareApp, CompareAppMeta> = {
	cartwise: {
		name: "CartWise",
		playUrl: "https://play.google.com/store/apps/details?id=com.fusionapps.cartwise",
		icon: "/images/apps/cartwise-grocery-shopping-list/icon.png",
		iconEmoji: "🛒",
		ogImage: { src: "/images/apps/cartwise-grocery-shopping-list/icon.png", width: 512, height: 512 },
		applicationCategory: "ShoppingApplication",
		i18nNamespace: "cartwiseCompare",
	},
	claimly: {
		name: "Claimly",
		playUrl: "https://play.google.com/store/apps/details?id=com.fusioncoreapps.claimly",
		icon: "/images/apps/claimly/icon.png",
		iconEmoji: "🧾",
		ogImage: { src: "/images/apps/claimly/icon.png", width: 512, height: 512 },
		applicationCategory: "UtilitiesApplication",
		i18nNamespace: "claimlyCompare",
	},
};

/** Page slug for a comparison, e.g. "cartwise-vs-anylist". */
export function comparisonSlug(app: CompareApp, competitorSlug: string): string {
	return `${app}-vs-${competitorSlug}`;
}

/** Locale-aware path to a comparison page (en is unprefixed, no trailing slash). */
export function comparisonPath(locale: Locale, app: CompareApp, competitorSlug: string): string {
	const base = locale === "en" ? "/compare-apps" : `/${locale}/compare-apps`;
	return `${base}/${comparisonSlug(app, competitorSlug)}`;
}

/**
 * Splits comparison entries into one group per app, in COMPARE_APPS order,
 * keeping each group's original entry order and skipping apps with no entries.
 */
export function groupByApp<T extends { data: { app: CompareApp } }>(
	entries: T[],
): Array<{ app: CompareApp; entries: T[] }> {
	return COMPARE_APPS.map((app) => ({ app, entries: entries.filter((e) => e.data.app === app) })).filter(
		(group) => group.entries.length > 0,
	);
}

/**
 * Translator for an app's comparison copy: looks up `<namespace>.<key>` and
 * falls back to the shared `cartwiseCompare.<key>`.
 */
export function compareCopy(t: (key: string) => string, app: CompareApp): (key: string) => string {
	const ns = COMPARE_APP_META[app].i18nNamespace;
	return (key: string) => {
		const own = t(`${ns}.${key}`);
		return own === `${ns}.${key}` ? t(`cartwiseCompare.${key}`) : own;
	};
}
