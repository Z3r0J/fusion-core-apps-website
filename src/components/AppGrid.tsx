import { Filter, Grid, List, Search, Star } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, type Locale } from "@/i18n/utils";

export type App = {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	category: string;
	icon?: string;
	playUrl: string;
	appStoreUrl?: string;
	price?: string; // "Free" | "$1.99" | ...
	tags?: string[];
	rating?: number; // e.g., 4.6
	downloadsLabel?: string; // e.g., "1K+"
	version?: string;
	lastUpdated?: string;
	beta?: boolean;
	betaGroupUrl?: string;
};

type Props = {
	apps: App[];
	showFilters?: boolean;
	locale?: Locale;
};

function useDebounced<T>(value: T, delay = 180) {
	const [v, setV] = useState(value);
	React.useEffect(() => {
		const id = setTimeout(() => setV(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return v;
}

// Skeleton Card for loading state
function SkeletonCard() {
	return (
		<div className="overflow-hidden rounded-[22px] bg-white dark:bg-gray-900 animate-pulse" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
			<div className="h-[152px] bg-gray-200 dark:bg-gray-800" />
			<div className="px-5 pt-4 pb-3 space-y-2">
				<div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
				<div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
				<div className="h-3 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700" />
			</div>
			<div className="px-5 pb-5 pt-2">
				<div className="border-t border-gray-100 dark:border-gray-800 pt-3.5">
					<div className="h-10 w-full rounded-[12px] bg-gray-200 dark:bg-gray-700" />
				</div>
			</div>
		</div>
	);
}

// Category-to-accent-stage mapping
const CATEGORY_ACCENTS: Record<string, { bg: string; glow: string }> = {
	"Books & Reference": { bg: "linear-gradient(150deg, #160e30 0%, #2b1660 55%, #160e30 100%)", glow: "rgba(139,92,246,0.60)" },
	"Shopping":          { bg: "linear-gradient(150deg, #1a0c04 0%, #3d1f06 55%, #1a0c04 100%)", glow: "rgba(251,146,60,0.60)" },
	"Productivity":      { bg: "linear-gradient(150deg, #031018 0%, #072436 55%, #031018 100%)", glow: "rgba(46,207,255,0.60)" },
	"Utilities":         { bg: "linear-gradient(150deg, #031018 0%, #072436 55%, #031018 100%)", glow: "rgba(46,207,255,0.60)" },
};
const DEFAULT_ACCENT = { bg: "linear-gradient(150deg, #0b1c2d 0%, #0e2a42 55%, #0b1c2d 100%)", glow: "rgba(46,207,255,0.45)" };

// Download Modal Component
function DownloadModal({ app, onClose, t }: { app: App; onClose: () => void; t: ReturnType<typeof useTranslations> }) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={onClose}
			aria-hidden="false"
		>
			<div
				className="relative m-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="download-modal-title"
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
					aria-label={t("app.close")}
				>
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<div className="mb-6">
					<div className="mb-4 flex items-center gap-3">
						{app.icon ? (
							<img src={app.icon} alt={`${app.title} icon`} className="h-12 w-12 rounded-xl" />
						) : (
							<div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
						)}
						<div>
							<h3 id="download-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
								{app.title}
							</h3>
						</div>
					</div>
					<p className="text-sm text-gray-600 dark:text-gray-400">{t("app.choosePlatform")}</p>
				</div>

				<div className="space-y-3">
					<a
						href={app.playUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:border-brand-500 dark:hover:border-brand-400 flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
					>
						<svg className="h-10 w-10 flex-shrink-0" viewBox="0 0 24 24" fill="none">
							<path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" fill="#00D6FF" />
							<path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#FFC107" />
							<path d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z" fill="#FF3E00" />
							<path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#00E081" />
						</svg>
						<div className="flex-1 text-left">
							<div className="text-sm font-semibold text-gray-900 dark:text-white">Google Play</div>
							<div className="text-xs text-gray-500 dark:text-gray-400">{t("app.downloadForAndroid")}</div>
						</div>
						<svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
					</a>

					{app.appStoreUrl && (
						<a
							href={app.appStoreUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:border-brand-500 dark:hover:border-brand-400 flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						>
							<svg className="h-10 w-10 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" className="text-gray-900 dark:text-white" />
							</svg>
							<div className="flex-1 text-left">
								<div className="text-sm font-semibold text-gray-900 dark:text-white">App Store</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Download for iOS</div>
							</div>
							<svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

// Inline Google Play icon
const GPIcon = () => (
	<svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
		<path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" opacity="0.8"/>
		<path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" opacity="0.65"/>
		<path d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"/>
		<path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" opacity="0.65"/>
	</svg>
);

// Beta checkmark icon
const BetaIcon = () => (
	<svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

const AppCard = React.memo(function AppCard({ app, mode, locale, t }: { app: App; mode: "grid" | "list"; locale: Locale; t: ReturnType<typeof useTranslations> }) {
	const [showModal, setShowModal] = React.useState(false);
	const price = app.price ?? "Free";
	const rating = app.rating ?? 4.5;
	const isTopRated = rating >= 4.5;
	const isBeta = app.beta ?? false;
	const betaUrl = app.betaGroupUrl ?? app.playUrl;
	const accent = CATEGORY_ACCENTS[app.category] ?? DEFAULT_ACCENT;
	const appHref = locale === "en" ? `/apps/${app.slug}` : `/${locale}/apps/${app.slug}`;

	const handleDownloadClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowModal(true);
	};
	const closeModal = () => setShowModal(false);

	React.useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape" && showModal) closeModal(); };
		if (showModal) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", handleEscape);
		}
		return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handleEscape); };
	}, [showModal]);

	// ── Star row helper ──
	const full = Math.floor(rating);
	const hasHalf = rating - full >= 0.5;
	const stars = Array.from({ length: 5 }).map((_, i) => (
		<Star
			key={i}
			className={`h-3 w-3 ${i < full ? "fill-current text-yellow-400" : i === full && hasHalf ? "fill-current text-yellow-300" : "text-gray-200 dark:text-gray-700"}`}
			aria-hidden="true"
		/>
	));

	// ── List mode ──
	if (mode === "list") {
		return (
			<>
				<article
					className="app-store-card group transition-transform duration-300 hover:-translate-y-0.5"
					aria-labelledby={`app-${app.slug}`}
				>
					<div
						className="app-store-card__inner overflow-hidden rounded-[18px] bg-white dark:bg-gray-900"
					>
						<div className="flex items-stretch">
							{/* Left accent thumbnail */}
							<a
								href={appHref}
								className="app-store-card__stage relative flex w-[88px] flex-shrink-0 items-center justify-center overflow-hidden select-none"
								style={{ background: accent.bg }}
								tabIndex={-1}
								aria-hidden="true"
							>
								<div
									className="pointer-events-none absolute inset-0 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125"
									style={{ background: accent.glow, margin: "auto", width: 56, height: 56 }}
								/>
								{app.icon ? (
									<img
										src={app.icon}
										alt={`${app.title} icon`}
										className="relative h-12 w-12 rounded-[14px] shadow-[0_6px_20px_rgba(0,0,0,0.45)] ring-1 ring-white/15 transition-transform duration-400 group-hover:scale-110"
									/>
								) : (
									<div className="relative h-12 w-12 rounded-[14px] bg-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.4)]" />
								)}
							</a>

							{/* Right content */}
							<a
								href={appHref}
								id={`app-${app.slug}`}
								className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4"
							>
								<div className="flex items-center gap-2 min-w-0">
									<h3 className="truncate font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
										style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "-0.02em" }}>
										{app.title}
									</h3>
									{isBeta && (
										<span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white flex-shrink-0"
											style={{ background: "rgba(234,88,12,0.92)" }}>Beta</span>
									)}
									{!isBeta && isTopRated && (
										<span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-yellow-500 flex-shrink-0"
											style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}>★ Top</span>
									)}
								</div>
								<span className="mt-0.5 text-[11px] font-medium text-brand-500 dark:text-brand-400">{app.category}</span>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1 leading-snug">{app.tagline}</p>
								<div className="mt-2 flex items-center gap-2">
									<div className="flex items-center gap-0.5">{stars}</div>
									<span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{rating}</span>
									{app.downloadsLabel && <span className="text-[11px] text-gray-400 dark:text-gray-500">&middot; {app.downloadsLabel}</span>}
								</div>
							</a>

							{/* Right CTA */}
							<div className="flex flex-shrink-0 items-center pr-4">
								{isBeta ? (
									<a
										href={betaUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="app-store-card__btn app-store-card__btn--beta flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12px] font-semibold text-white whitespace-nowrap"
										aria-label={`Join beta for ${app.title}`}
									>
										<BetaIcon />
										{t("app.joinBeta")}
									</a>
								) : (
									<button
										onClick={handleDownloadClick}
										className="app-store-card__btn app-store-card__btn--play flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12px] font-semibold text-white whitespace-nowrap"
										aria-label={`Download ${app.title}`}
									>
										<GPIcon />
										{t("app.getOnGooglePlay")}
									</button>
								)}
							</div>
						</div>
					</div>
				</article>
				{showModal && <DownloadModal app={app} onClose={closeModal} t={t} />}
			</>
		);
	}

	// ── Grid mode ──
	return (
		<>
			<article
				className="app-store-card group relative transition-transform duration-300 hover:-translate-y-1.5"
				aria-labelledby={`app-${app.slug}`}
			>
				<div className="app-store-card__inner overflow-hidden rounded-[22px] bg-white dark:bg-gray-900">

					{/* Stage */}
					<a
						href={appHref}
						className="app-store-card__stage relative block h-[152px] overflow-hidden select-none"
						style={{ background: accent.bg }}
						tabIndex={-1}
						aria-hidden="true"
					>
						{/* Glow blob */}
						<div
							className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[90px] w-[90px] rounded-full blur-2xl transition-all duration-500 group-hover:h-28 group-hover:w-28"
							style={{ background: accent.glow }}
						/>

						{/* Icon */}
						<div className="absolute inset-0 flex items-center justify-center">
							{app.icon ? (
								<img
									src={app.icon}
									alt={`${app.title} icon`}
									className="h-[76px] w-[76px] rounded-[18px] shadow-[0_10px_36px_rgba(0,0,0,0.50)] ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-[1.12]"
								/>
							) : (
								<div className="h-[76px] w-[76px] rounded-[18px] bg-white/15 shadow-[0_10px_36px_rgba(0,0,0,0.4)] ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-[1.12]" />
							)}
						</div>

						{/* Bottom veil */}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
							style={{ background: "linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 100%)" }} />

						{/* Category bottom-left */}
						<div className="absolute bottom-2.5 left-4">
							<span className="text-[10px] font-bold tracking-[0.12em] uppercase"
								style={{ color: "rgba(255,255,255,0.48)" }}>{app.category}</span>
						</div>

						{/* Price top-right */}
						<div className="absolute top-3 right-3">
							<span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
								style={{ background: "rgba(0,0,0,0.38)", color: "rgba(255,255,255,0.90)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}>
								{price}
							</span>
						</div>

						{/* Status badges top-left */}
						<div className="absolute top-3 left-3 flex items-center gap-1.5">
							{isBeta && (
								<span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
									style={{ background: "rgba(234,88,12,0.92)", color: "#fff", backdropFilter: "blur(8px)" }}>
									Beta
								</span>
							)}
							{!isBeta && isTopRated && (
								<span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
									style={{ background: "rgba(0,0,0,0.40)", color: "#fbbf24", backdropFilter: "blur(8px)", border: "1px solid rgba(251,191,36,0.22)" }}>
									{t("app.topRated")}
								</span>
							)}
						</div>
					</a>

					{/* Card body */}
					<a
						href={appHref}
						id={`app-${app.slug}`}
						className="block px-5 pt-4 pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset"
					>
						<h3
							className="truncate font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200"
							style={{ fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: "-0.025em" }}
						>
							{app.title}
						</h3>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
							{app.tagline}
						</p>
						<div className="mt-3 flex items-center gap-2.5" aria-label={`Rating ${rating} out of 5`}>
							<div className="flex items-center gap-0.5">{stars}</div>
							<span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{rating}</span>
							{app.downloadsLabel && <span className="text-[11px] text-gray-400 dark:text-gray-500">&middot; {app.downloadsLabel}</span>}
						</div>
					</a>

					{/* CTA footer */}
					<div className="px-5 pb-5 pt-2">
						<div className="border-t border-gray-100 dark:border-gray-800 pt-3.5">
							{isBeta ? (
								<a
									href={betaUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="app-store-card__btn app-store-card__btn--beta flex w-full items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-white"
									aria-label={`Join beta for ${app.title}`}
								>
									<BetaIcon />
									<span>{t("app.joinBeta")}</span>
								</a>
							) : (
								<button
									onClick={handleDownloadClick}
									className="app-store-card__btn app-store-card__btn--play flex w-full items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-white"
									aria-label={`Download ${app.title}`}
								>
									<GPIcon />
									<span>{t("app.getOnGooglePlay")}</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</article>
			{showModal && <DownloadModal app={app} onClose={closeModal} t={t} />}
		</>
	);
});

export default function AppGrid({ apps, showFilters = true, locale = "en" }: Props) {
	const t = useTranslations(locale);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");
	const [mode, setMode] = useState<"grid" | "list">("grid");
	const [isLoading, setIsLoading] = useState(true);

	const debounced = useDebounced(search, 180);

	// Skeleton loading on initial mount
	useEffect(() => {
		setIsLoading(false);
	}, []);

	const categories = useMemo(() => {
		const set = new Set<string>(["All"]);
		apps.forEach((a) => a.category && set.add(a.category));
		return Array.from(set);
	}, [apps]);

	const filtered = useMemo(() => {
		const q = debounced.trim().toLowerCase();
		return apps.filter((a) => {
			const inCategory = category === "All" || a.category === category;
			if (!q) return inCategory;
			const haystack =
				`${a.title} ${a.tagline} ${a.description} ${a.category} ${(a.tags ?? []).join(" ")}`.toLowerCase();
			return inCategory && haystack.includes(q);
		});
	}, [apps, debounced, category]);

	return (
		<section className="space-y-6" aria-labelledby="apps-heading">
			{showFilters && (
				<div className="app-grid__filters mb-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
					<div className="flex flex-col gap-6 lg:flex-row">
						{/* Search */}
						<div className="flex-1">
							<label htmlFor="app-search" className="sr-only">
								Search apps
							</label>
							<div className="relative">
								<Search
									className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
									aria-hidden="true"
								/>
								<input
									id="app-search"
									type="text"
									placeholder="Search apps..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="focus:ring-brand-500 w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
								/>
							</div>
						</div>

						{/* Category */}
						<div className="lg:w-64">
							<label htmlFor="app-category" className="sr-only">
								Filter by category
							</label>
							<div className="relative">
								<Filter
									className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
									aria-hidden="true"
								/>
								<select
									id="app-category"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="focus:ring-brand-500 w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pr-8 pl-10 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
								>
									{categories.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* View toggle */}
						<div className="inline-flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
							<button
								onClick={() => setMode("grid")}
								className={`px-4 py-2 ${mode === "grid" ? "bg-brand-500 text-white" : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
								aria-pressed={mode === "grid"}
								aria-label="Grid view"
							>
								<Grid className="h-5 w-5" />
							</button>
							<button
								onClick={() => setMode("list")}
								className={`px-4 py-2 ${mode === "list" ? "bg-brand-500 text-white" : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
								aria-pressed={mode === "list"}
								aria-label="List view"
							>
								<List className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Results */}
					<div className="mt-4 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
						{filtered.length} app{filtered.length !== 1 ? "s" : ""} found
						{category !== "All" ? ` in ${category}` : ""}
						{debounced ? ` for "${debounced}"` : ""}
					</div>
				</div>
			)}

			{/* Skeleton Loading State */}
			{isLoading ? (
				<ul
					role="list"
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{Array.from({ length: 6 }).map((_, i) => (
						<li key={i}>
							<SkeletonCard />
						</li>
					))}
				</ul>
			) : filtered.length ? (
				<ul
					role="list"
					className={`grid gap-6 ${mode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
				>
					{filtered.map((app) => (
						<li key={app.slug}>
							<AppCard app={app} mode={mode} locale={locale} t={t} />
						</li>
					))}
				</ul>
			) : (
				<div className="app-grid__empty py-16 text-center">
					<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
						<Search className="h-12 w-12 text-gray-400" aria-hidden="true" />
					</div>
					<h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						No apps found
					</h3>
					<p className="mb-6 text-gray-600 dark:text-gray-400">
						{debounced ? (
							<>No apps match your search for &ldquo;{debounced}&rdquo;.</>
						) : (
							<>Try a different category or keyword.</>
						)}
					</p>
					<button
						onClick={() => {
							setSearch("");
							setCategory("All");
						}}
						className="button button--primary"
					>
						Clear filters
					</button>
				</div>
			)}
		</section>
	);
}
