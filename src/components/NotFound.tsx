import { motion } from "framer-motion";
import { Grid, Home, Mail, Search } from "lucide-react";
import { useState } from "react";

const navCards = [
	{
		href: "/",
		icon: Home,
		label: "Home",
		description: "Back to the main page",
	},
	{
		href: "/apps",
		icon: Grid,
		label: "Apps",
		description: "Browse all our apps",
	},
	{
		href: "/contact",
		icon: Mail,
		label: "Contact",
		description: "Get in touch with us",
	},
];

export default function NotFound() {
	const [query, setQuery] = useState("");

	return (
		<section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-16">
			{/* Background decoration blobs */}
			<div
				className="pointer-events-none absolute top-1/4 -left-32 h-72 w-72 rounded-full opacity-20 blur-3xl dark:opacity-10"
				style={{ background: "linear-gradient(135deg, #ff8a2a, #e8455b)" }}
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl dark:opacity-10"
				style={{ background: "linear-gradient(135deg, #4fb3ff, #2ecfff)" }}
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute top-10 right-1/4 h-48 w-48 rounded-full opacity-15 blur-3xl dark:opacity-5"
				style={{ background: "linear-gradient(135deg, #e8455b, #4fb3ff)" }}
				aria-hidden="true"
			/>

			{/* Floating 404 number */}
			<motion.div
				animate={{ y: [0, -15, 0] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
			>
				<p
					aria-hidden="true"
					className="select-none text-[120px] font-black leading-none sm:text-[150px] lg:text-[180px]"
					style={{
						background: "linear-gradient(135deg, #ff8a2a, #e8455b, #4fb3ff, #2ecfff)",
						backgroundClip: "text",
						WebkitBackgroundClip: "text",
						color: "transparent",
					}}
				>
					404
				</p>
			</motion.div>

			{/* Heading and subtitle */}
			<motion.div
				className="mt-4 space-y-3 text-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.5 }}
			>
				<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
					Page Not Found
				</h1>
				<p className="mx-auto max-w-md text-lg text-gray-600 dark:text-gray-400">
					Looks like this page wandered off. Let&apos;s get you back on track.
				</p>
			</motion.div>

			{/* Quick navigation cards */}
			<motion.div
				className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
			>
				{navCards.map((card) => {
					const Icon = card.icon;
					return (
						<a
							key={card.href}
							href={card.href}
							className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-brand-400/10"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-brand-50 dark:bg-gray-700 dark:group-hover:bg-brand-950">
								<Icon className="h-6 w-6 text-gray-600 transition-colors group-hover:text-brand-500 dark:text-gray-400 dark:group-hover:text-brand-400" />
							</div>
							<div>
								<p className="font-semibold text-gray-900 dark:text-white">{card.label}</p>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{card.description}
								</p>
							</div>
						</a>
					);
				})}
			</motion.div>

			{/* Search suggestion */}
			<motion.div
				className="mt-10 w-full max-w-md text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
			>
				<p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
					Looking for something specific?
				</p>
				<form
					className="flex items-center gap-2"
					onSubmit={(e) => {
						e.preventDefault();
						if (query.trim()) {
							window.location.href = `/apps?q=${encodeURIComponent(query.trim())}`;
						} else {
							window.location.href = "/apps";
						}
					}}
				>
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search our apps..."
							className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
						/>
					</div>
					<button
						type="submit"
						className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:shadow-lg"
					>
						Search
					</button>
				</form>
			</motion.div>
		</section>
	);
}
