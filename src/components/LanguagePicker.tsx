import { useEffect, useRef, useState } from "react";

type LocaleLinks = { en: string; es: string; pt: string };
type Props = { currentLocale: string; links: LocaleLinks };

const labels: Record<string, string> = { en: "EN", es: "ES", pt: "PT" };
const names: Record<string, string> = { en: "English", es: "Español", pt: "Português" };

const GlobeIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[14px] w-[14px] flex-shrink-0" aria-hidden="true">
		<circle cx="12" cy="12" r="10" />
		<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
		<path d="M2 12h20" />
	</svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-2.5 w-2.5 flex-shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true">
		<path d="M6 9l6 6 6-6" />
	</svg>
);

const CheckIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 flex-shrink-0" aria-hidden="true">
		<path d="M20 6L9 17l-5-5" />
	</svg>
);

export function LanguagePicker({ currentLocale, links }: Props) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
		document.addEventListener("mousedown", onOutside);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onOutside);
			document.removeEventListener("keydown", onKey);
		};
	}, []);

	const otherLocales = (Object.keys(links) as (keyof LocaleLinks)[]).filter(l => l !== currentLocale);

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen(o => !o)}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label={`Language: ${names[currentLocale] ?? currentLocale}`}
				className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold tracking-wide text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-800 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
			>
				<GlobeIcon />
				<span>{labels[currentLocale]}</span>
				<ChevronIcon open={open} />
			</button>

			{open && (
				<div
					role="listbox"
					aria-label="Select language"
					className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl shadow-black/5 dark:border-gray-700/80 dark:bg-gray-900"
				>
					{(Object.keys(links) as (keyof LocaleLinks)[]).map(locale => {
						const isActive = locale === currentLocale;
						return isActive ? (
							<div
								key={locale}
								role="option"
								aria-selected={true}
								className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400"
							>
								<span>{names[locale]}</span>
								<CheckIcon />
							</div>
						) : (
							<a
								key={locale}
								href={links[locale]}
								role="option"
								aria-selected={false}
								className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
								onClick={() => setOpen(false)}
							>
								{names[locale]}
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}
