import PlaceholderApp from "@/public/placeholder-app.svg";
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
	const price = app.price ?? "Free";
	const priceBadge =
		price === "Free"
			? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
			: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700";

	if (mode === "list") {
		return (
			<article
				className="card card--elevated flex flex-col items-center gap-6 p-6 md:flex-row"
				aria-labelledby={`app-${app.slug}`}
			>
				<a href={`/apps/${app.slug}`} className="flex w-full items-center gap-6">
					{app.icon ? (
						<img
							alt={`${app.title} icon`}
							className="h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
							height={64}
							loading="eager"
							src={app.icon}
							width={64}
						/>
					) : (
						<PlaceholderApp class="h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900" />
					)}
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
					<div className="flex items-center gap-3">
						<span
							className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${priceBadge}`}
						>
							{price}
						</span>
						<a
							href={app.playUrl}
							target="_blank"
							rel="noopener noreferrer sponsored"
							className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-800 flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors"
							aria-label={`Download ${app.title} on Google Play`}
						>
							<Download className="h-4 w-4" />
							<span>Download</span>
						</a>
					</div>
				</a>
			</article>
		);
	}

	return (
		<article className="card card--elevated group" aria-labelledby={`app-${app.slug}`}>
			<a href={`/apps/${app.slug}`} className="focus-ring block rounded-2xl">
				<div className="p-6 pb-4">
					<div className="flex items-start gap-4">
						{app.icon ? (
							<img
								alt={`${app.title} icon`}
								className="h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
								height={64}
								loading="eager"
								src={app.icon}
								width={64}
							/>
						) : (
							<PlaceholderApp class="h-16 w-16 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900" />
						)}
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
						<span className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-700 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium">
							<Download className="h-4 w-4" />
							Download
						</span>
					</div>
				</div>
			</a>
		</article>
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
						Clear Filters
					</button>
				</div>
			)}
		</section>
	);
}
