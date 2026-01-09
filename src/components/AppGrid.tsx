import { CardImage } from "@/components/CardImage";
import { Download, Filter, Grid, List, Search, Star } from "lucide-react";
import React, { useMemo, useState } from "react";
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
};

type Props = {
	apps: App[];
	showFilters?: boolean;
};

function useDebounced<T>(value: T, delay = 180) {
	const [v, setV] = useState(value);
	React.useEffect(() => {
		const id = setTimeout(() => setV(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return v;
}

// Download Modal Component
function DownloadModal({ app, onClose }: { app: App; onClose: () => void }) {
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
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
					aria-label="Close"
				>
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* Modal Header */}
				<div className="mb-6">
					<div className="mb-4 flex items-center gap-3">
						<CardImage app={app} className="h-12 w-12" />
						<div>
							<h3
								id="download-modal-title"
								className="text-xl font-bold text-gray-900 dark:text-white"
							>
								{app.title}
							</h3>
						</div>
					</div>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Choose your platform to download
					</p>
				</div>

				{/* Download Options */}
				<div className="space-y-3">
					{/* Google Play Button */}
					<a
						href={app.playUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:border-brand-500 dark:hover:border-brand-400 flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
					>
						<div className="flex-shrink-0">
							<svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
								<path
									d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
									fill="#00D6FF"
								/>
								<path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#FFC107" />
								<path
									d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"
									fill="#FF3E00"
								/>
								<path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#00E081" />
							</svg>
						</div>
						<div className="flex-1 text-left">
							<div className="text-sm font-semibold text-gray-900 dark:text-white">Google Play</div>
							<div className="text-xs text-gray-500 dark:text-gray-400">Download for Android</div>
						</div>
						<Download className="h-5 w-5 text-gray-400" />
					</a>

					{/* App Store Button */}
					{app.appStoreUrl && (
						<a
							href={app.appStoreUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:border-brand-500 dark:hover:border-brand-400 flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						>
							<div className="flex-shrink-0">
								<svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
										className="text-gray-900 dark:text-white"
									/>
								</svg>
							</div>
							<div className="flex-1 text-left">
								<div className="text-sm font-semibold text-gray-900 dark:text-white">App Store</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Download for iOS</div>
							</div>
							<Download className="h-5 w-5 text-gray-400" />
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

const StarRow = ({ rating = 4.5 }: { rating?: number }) => {
	const full = Math.floor(rating);
	return (
		<div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={`h-3 w-3 ${i < full ? "fill-current text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
					aria-hidden="true"
				/>
			))}
			<span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{rating}</span>
		</div>
	);
};

const AppCard = React.memo(function AppCard({ app, mode }: { app: App; mode: "grid" | "list" }) {
	const [showModal, setShowModal] = React.useState(false);
	const price = app.price ?? "Free";
	const priceBadge =
		price === "Free"
			? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
			: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700";

	const handleDownloadClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	React.useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && showModal) {
				closeModal();
			}
		};

		if (showModal) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.body.style.overflow = "";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [showModal]);

	if (mode === "list") {
		return (
			<>
				<article
					className="card card--elevated flex flex-col items-center gap-6 p-6 md:flex-row"
					aria-labelledby={`app-${app.slug}`}
				>
					<a href={`/apps/${app.slug}`} className="flex w-full items-center gap-6">
						<CardImage app={app} />
						<div className="min-w-0 flex-1">
							<h3
								id={`app-${app.slug}`}
								className="truncate text-lg font-bold text-gray-900 dark:text-white"
							>
								{app.title}
							</h3>
							<p className="mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">{app.tagline}</p>
							<div className="mt-3 flex items-center gap-4">
								<StarRow rating={app.rating} />
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{app.downloadsLabel ?? "—"}
								</span>
								<span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
									{app.category}
								</span>
							</div>
						</div>
					</a>
					<div className="flex items-center gap-3">
						<span
							className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${priceBadge}`}
						>
							{price}
						</span>
						<button
							onClick={handleDownloadClick}
							className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-800 flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors"
							aria-label={`Download ${app.title}`}
						>
							<Download className="h-4 w-4" />
							<span>Download</span>
						</button>
					</div>
				</article>

				{showModal && <DownloadModal app={app} onClose={closeModal} />}
			</>
		);
	}

	return (
		<>
			<article className="card card--elevated group" aria-labelledby={`app-${app.slug}`}>
				<a href={`/apps/${app.slug}`} className="focus-ring block rounded-2xl">
					<div className="p-6 pb-4">
						<div className="flex items-start gap-4">
							<CardImage app={app} />
							<div className="min-w-0 flex-1">
								<h3
									id={`app-${app.slug}`}
									className="group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate text-lg font-bold text-gray-900 transition-colors dark:text-white"
								>
									{app.title}
								</h3>
								<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
									{app.tagline}
								</p>
								<div className="mt-3 flex items-center gap-4">
									<StarRow rating={app.rating} />
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{app.downloadsLabel ?? "—"}
									</span>
								</div>
							</div>
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${priceBadge}`}
							>
								{price}
							</span>
						</div>
					</div>

					<div className="px-6 pb-4">
						<p className="line-clamp-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
							{app.description}
						</p>
					</div>

					<div className="px-6 pb-6">
						<div className="flex items-center justify-between">
							<span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
								{app.category}
							</span>
						</div>
					</div>
				</a>

				<div className="-mt-6 px-6 pb-6">
					<div className="flex items-center justify-end">
						<button
							onClick={handleDownloadClick}
							className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-800 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors"
							aria-label={`Download ${app.title}`}
						>
							<Download className="h-4 w-4" />
							Download
						</button>
					</div>
				</div>
			</article>

			{showModal && <DownloadModal app={app} onClose={closeModal} />}
		</>
	);
});

export default function AppGrid({ apps, showFilters = true }: Props) {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All");
	const [mode, setMode] = useState<"grid" | "list">("grid");

	const debounced = useDebounced(search, 180);

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

			{/* Content */}
			{filtered.length ? (
				<ul
					role="list"
					className={`grid gap-6 ${mode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
				>
					{filtered.map((app) => (
						<li key={app.slug}>
							<AppCard app={app} mode={mode} />
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
							<>No apps match your search for “{debounced}”.</>
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
