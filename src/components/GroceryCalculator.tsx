import { cn } from "@/lib/utils";
import { Minus, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

// Free grocery bill calculator (/tools/grocery-calculator). Everything runs in
// the browser: no network calls, the list persists in localStorage (wrapped in
// try/catch so private mode or blocked storage only loses persistence). Copy
// arrives as `labels` from the page's i18n keys (tools.groceryCalculator.ui.*).

type Locale = "en" | "es" | "pt";

export interface GroceryCalculatorLabels {
	listTitle: string;
	summaryTitle: string;
	colItem: string;
	colPrice: string;
	colQty: string;
	colTotal: string;
	nameLabel: string;
	priceLabel: string;
	qtyLabel: string;
	lineTotalLabel: string;
	decrease: string;
	increase: string;
	remove: string;
	itemFallback: string;
	placeholders: string;
	addItem: string;
	clearAll: string;
	cleared: string;
	undo: string;
	currency: string;
	budget: string;
	tax: string;
	optional: string;
	subtotal: string;
	taxLine: string;
	total: string;
	itemsOne: string;
	itemsOther: string;
	remaining: string;
	overBudget: string;
	onBudget: string;
	budgetUsed: string;
	saved: string;
}

interface Props {
	locale: Locale;
	labels: GroceryCalculatorLabels;
}

interface Row {
	id: string;
	name: string;
	price: string;
	qty: string;
}

interface SavedState {
	v: 1;
	rows: Row[];
	budget: string;
	tax: string;
	currency: string;
}

const STORAGE_KEY = "fca.groceryCalculator.v1";
const MAX_ROWS = 200;

// Region picks the number format (decimal/grouping separators) for that
// currency in the page language, e.g. ARS on /es -> es-AR "$ 1.234,50".
// Symbols are hardcoded (not Intl-derived) so SSR and client markup match.
const CURRENCIES: Array<{ code: string; symbol: string; region?: string }> = [
	{ code: "USD", symbol: "$", region: "US" },
	{ code: "EUR", symbol: "€" },
	{ code: "GBP", symbol: "£", region: "GB" },
	{ code: "CAD", symbol: "$", region: "CA" },
	{ code: "MXN", symbol: "$", region: "MX" },
	{ code: "DOP", symbol: "RD$", region: "DO" },
	{ code: "COP", symbol: "$", region: "CO" },
	{ code: "ARS", symbol: "$", region: "AR" },
	{ code: "CLP", symbol: "$", region: "CL" },
	{ code: "PEN", symbol: "S/", region: "PE" },
	{ code: "BRL", symbol: "R$", region: "BR" },
];

const LOCALE_DEFAULTS: Record<Locale, { currency: string; euroTag: string }> = {
	en: { currency: "USD", euroTag: "en-IE" },
	es: { currency: "MXN", euroTag: "es-ES" },
	pt: { currency: "BRL", euroTag: "pt-PT" },
};

const fill = (template: string, values: Record<string, string | number>) =>
	template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

function formatTag(locale: Locale, currency: string): string {
	const entry = CURRENCIES.find((c) => c.code === currency);
	if (!entry?.region) return LOCALE_DEFAULTS[locale].euroTag;
	return `${locale}-${entry.region}`;
}

// Accepts "6.49", "6,49", "1,234.50", "1.234,50", "$ 12" and similar. A lone
// separator followed by exactly three digits is read as a thousands separator
// unless it is the current locale's decimal mark ("1,500" is 1500 in en-US).
function parseAmount(raw: string, decimalSep: "." | ","): number {
	let s = raw.replace(/[^\d.,]/g, "");
	if (!s) return 0;
	const lastDot = s.lastIndexOf(".");
	const lastComma = s.lastIndexOf(",");
	let dec: "." | "," | null = null;
	if (lastDot >= 0 && lastComma >= 0) {
		dec = lastDot > lastComma ? "." : ",";
	} else if (lastDot >= 0 || lastComma >= 0) {
		const sep = lastDot >= 0 ? "." : ",";
		const count = s.split(sep).length - 1;
		const digitsAfter = s.length - s.lastIndexOf(sep) - 1;
		if (count === 1 && (digitsAfter !== 3 || sep === decimalSep)) dec = sep;
	}
	if (dec) {
		const other = dec === "." ? "," : ".";
		s = s.split(other).join("");
		const i = s.lastIndexOf(dec);
		s = s.slice(0, i).split(dec).join("") + "." + s.slice(i + 1);
	} else {
		s = s.replace(/[.,]/g, "");
	}
	const n = Number.parseFloat(s);
	return Number.isFinite(n) && n > 0 ? n : 0;
}

const roundQty = (n: number) => Math.round(n * 1000) / 1000;

function makeId(): string {
	return `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const blankRow = (id: string): Row => ({ id, name: "", price: "", qty: "1" });

// Deterministic ids for the server-rendered starter rows (hydration-safe).
const STARTER_ROWS: Row[] = [blankRow("r1"), blankRow("r2"), blankRow("r3")];

function isRow(value: unknown): value is Row {
	if (!value || typeof value !== "object") return false;
	const r = value as Record<string, unknown>;
	return (
		typeof r.id === "string" &&
		typeof r.name === "string" &&
		typeof r.price === "string" &&
		typeof r.qty === "string"
	);
}

function readSaved(): SavedState | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw) as Partial<SavedState>;
		if (data.v !== 1 || !Array.isArray(data.rows)) return null;
		const rows = data.rows.filter(isRow).slice(0, MAX_ROWS);
		return {
			v: 1,
			rows: rows.length > 0 ? rows : [blankRow(makeId())],
			budget: typeof data.budget === "string" ? data.budget : "",
			tax: typeof data.tax === "string" ? data.tax : "",
			currency: CURRENCIES.some((c) => c.code === data.currency) ? (data.currency as string) : "",
		};
	} catch {
		return null;
	}
}

function writeSaved(state: SavedState) {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Storage full, disabled or private mode: the calculator still works.
	}
}

const inputClass =
	"w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-400/40 focus:outline-none dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-400";

const iconButtonClass =
	"inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent md:h-10 md:w-10 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white";

export default function GroceryCalculator({ locale, labels }: Props) {
	const uid = useId();
	const [rows, setRows] = useState<Row[]>(STARTER_ROWS);
	const [budget, setBudget] = useState("");
	const [tax, setTax] = useState("");
	const [currency, setCurrency] = useState(LOCALE_DEFAULTS[locale].currency);
	const [undoRows, setUndoRows] = useState<Row[] | null>(null);
	const [announcement, setAnnouncement] = useState("");
	const [ready, setReady] = useState(false);
	const nameRefs = useRef(new Map<string, HTMLInputElement>());
	const pendingFocus = useRef<string | null>(null);
	const addButtonRef = useRef<HTMLButtonElement>(null);
	const wasOver = useRef(false);
	const listRef = useRef<HTMLElement>(null);
	const totalsRef = useRef<HTMLDListElement>(null);
	const [showPill, setShowPill] = useState(false);

	// Restore after hydration so server and first client render match.
	useEffect(() => {
		const saved = readSaved();
		if (saved) {
			setRows(saved.rows);
			setBudget(saved.budget);
			setTax(saved.tax);
			if (saved.currency) setCurrency(saved.currency);
		}
		setReady(true);
	}, []);

	// Persist only after the restore above has been applied, so the starter rows
	// never overwrite a saved list.
	useEffect(() => {
		if (!ready) return;
		writeSaved({ v: 1, rows, budget, tax, currency });
	}, [ready, rows, budget, tax, currency]);

	// Phones: float the running total while the list is on screen but the
	// totals block is not (it sits below the list in the one-column layout).
	useEffect(() => {
		const list = listRef.current;
		const totals = totalsRef.current;
		if (!list || !totals || typeof IntersectionObserver === "undefined") return;
		let listInView = false;
		let totalsInView = false;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === list) listInView = entry.isIntersecting;
				if (entry.target === totals) totalsInView = entry.isIntersecting;
			}
			setShowPill(listInView && !totalsInView);
		});
		observer.observe(list);
		observer.observe(totals);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const id = pendingFocus.current;
		if (!id) return;
		pendingFocus.current = null;
		if (id === "__add") addButtonRef.current?.focus();
		else nameRefs.current.get(id)?.focus();
	}, [rows]);

	const tag = formatTag(locale, currency);
	const money = useMemo(() => new Intl.NumberFormat(tag, { style: "currency", currency }), [tag, currency]);
	const decimalSep: "." | "," = useMemo(
		() => (new Intl.NumberFormat(tag).formatToParts(1.5).find((p) => p.type === "decimal")?.value === "," ? "," : "."),
		[tag],
	);
	const fractionDigits = money.resolvedOptions().maximumFractionDigits ?? 2;
	const pricePlaceholder = fractionDigits > 0 ? `0${decimalSep}${"0".repeat(fractionDigits)}` : "0";
	const placeholders = labels.placeholders.split(",").map((p) => p.trim());

	const qtyValue = (raw: string) => (raw.trim() === "" ? 1 : parseAmount(raw, decimalSep));
	const formatQty = (n: number) => String(roundQty(n)).replace(".", decimalSep);

	const lines = rows.map((row) => parseAmount(row.price, decimalSep) * qtyValue(row.qty));
	const subtotal = lines.reduce((sum, n) => sum + n, 0);
	const taxRate = Math.min(parseAmount(tax, decimalSep), 100);
	const taxAmount = subtotal * (taxRate / 100);
	const total = subtotal + taxAmount;
	const budgetValue = parseAmount(budget, decimalSep);
	const hasBudget = budgetValue > 0;
	const scale = 10 ** fractionDigits;
	const totalUnits = Math.round(total * scale);
	const budgetUnits = Math.round(budgetValue * scale);
	const isOver = hasBudget && totalUnits > budgetUnits;
	const usedPercent = hasBudget ? Math.min(100, Math.round((total / budgetValue) * 100)) : 0;
	const filledCount = rows.filter((r) => r.name.trim() !== "" || parseAmount(r.price, decimalSep) > 0).length;
	const countLabel = filledCount === 1 ? labels.itemsOne : fill(labels.itemsOther, { n: filledCount });

	const budgetMessage = !hasBudget
		? ""
		: isOver
			? fill(labels.overBudget, { amount: money.format((totalUnits - budgetUnits) / scale) })
			: totalUnits === budgetUnits
				? labels.onBudget
				: fill(labels.remaining, { amount: money.format((budgetUnits - totalUnits) / scale) });

	// Announce only when the cart crosses the budget line, not on every keystroke.
	useEffect(() => {
		if (isOver !== wasOver.current) {
			wasOver.current = isOver;
			setAnnouncement(budgetMessage);
		}
	}, [isOver, budgetMessage]);

	const itemName = (row: Row, index: number) =>
		row.name.trim() || fill(labels.itemFallback, { n: index + 1 });

	const updateRow = (id: string, patch: Partial<Row>) => {
		setUndoRows(null);
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	};

	const addRow = () => {
		if (rows.length >= MAX_ROWS) return;
		const id = makeId();
		pendingFocus.current = id;
		setUndoRows(null);
		setRows((prev) => [...prev, blankRow(id)]);
	};

	const removeRow = (index: number) => {
		const next = rows[index + 1] ?? rows[index - 1];
		setUndoRows(null);
		if (rows.length === 1) {
			const id = makeId();
			pendingFocus.current = id;
			setRows([blankRow(id)]);
			return;
		}
		pendingFocus.current = next ? next.id : "__add";
		setRows((prev) => prev.filter((_, i) => i !== index));
	};

	const stepQty = (row: Row, delta: number) => {
		const next = Math.max(1, roundQty(qtyValue(row.qty) + delta));
		updateRow(row.id, { qty: formatQty(next) });
	};

	const clearAll = () => {
		const id = makeId();
		setUndoRows(rows);
		pendingFocus.current = id;
		setRows([blankRow(id)]);
	};

	const undoClear = () => {
		if (!undoRows) return;
		setRows(undoRows);
		setUndoRows(null);
		pendingFocus.current = undoRows[0]?.id ?? null;
	};

	// Enter moves to the next row's name field, adding a row at the end of the list.
	const onFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
		if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
		event.preventDefault();
		const next = rows[index + 1];
		if (next) nameRefs.current.get(next.id)?.focus();
		else addRow();
	};

	const normalizeQty = (row: Row) => {
		const n = parseAmount(row.qty, decimalSep);
		if (n <= 0) updateRow(row.id, { qty: "1" });
	};

	const fieldId = (rowId: string, field: string) => `${uid}-${field}-${rowId}`;
	const listTitleId = `${uid}-list-title`;
	const summaryTitleId = `${uid}-summary-title`;

	return (
		<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
			{/* ── Item list ── */}
			<section
				ref={listRef}
				aria-labelledby={listTitleId}
				className="rounded-[22px] border border-gray-200/90 bg-white p-3 sm:p-5 md:p-6 dark:border-white/[0.07] dark:bg-white/[0.025]"
			>
				<div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 sm:mb-4 sm:px-0">
					<div className="flex items-baseline gap-3">
						<h2 id={listTitleId} className="subsection-title">
							{labels.listTitle}
						</h2>
						<span className="text-sm text-gray-500 tabular-nums dark:text-white/50">{countLabel}</span>
					</div>
					<button
						type="button"
						onClick={clearAll}
						className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none sm:min-h-10 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
					>
						<X aria-hidden="true" className="h-4 w-4" />
						{labels.clearAll}
					</button>
				</div>

				<div role="status" className={cn("px-1 sm:px-0", !undoRows && "sr-only")}>
					{undoRows && (
						<p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-white/[0.06] dark:text-white/75">
							{labels.cleared}
							<button
								type="button"
								onClick={undoClear}
								className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 font-semibold text-brand-700 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-brand-400"
							>
								<RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
								{labels.undo}
							</button>
						</p>
					)}
				</div>

				{/* Column headers (visual only; every field has its own label) */}
				<div
					aria-hidden="true"
					className="hidden border-b border-gray-200 pb-2 text-[11px] font-bold tracking-[0.08em] text-gray-400 uppercase md:grid md:grid-cols-[minmax(0,1fr)_6.5rem_7.5rem_6rem_2.5rem] md:gap-2.5 dark:border-white/10 dark:text-white/35"
				>
					<span>{labels.colItem}</span>
					<span>{labels.colPrice}</span>
					<span className="text-center">{labels.colQty}</span>
					<span className="text-right">{labels.colTotal}</span>
					<span />
				</div>

				<ol className="divide-y divide-gray-200 dark:divide-white/[0.08]">
					{rows.map((row, index) => {
						const n = index + 1;
						const name = itemName(row, index);
						const qty = qtyValue(row.qty);
						const line = lines[index] ?? 0;
						// Phones: two flex rows (name + line total / price + qty + remove).
						// md+: the wrappers become `contents` and one grid row, ordered.
						return (
							<li
								key={row.id}
								className="py-3 md:grid md:grid-cols-[minmax(0,1fr)_6.5rem_7.5rem_6rem_2.5rem] md:items-center md:gap-2.5 md:py-2.5"
							>
								<div className="flex items-center gap-2 md:contents">
									<div className="min-w-0 flex-1 md:order-1">
										<label className="sr-only" htmlFor={fieldId(row.id, "name")}>
											{fill(labels.nameLabel, { n })}
										</label>
										<input
											ref={(el) => {
												if (el) nameRefs.current.set(row.id, el);
												else nameRefs.current.delete(row.id);
											}}
											id={fieldId(row.id, "name")}
											type="text"
											autoComplete="off"
											enterKeyHint="next"
											maxLength={80}
											placeholder={placeholders[index % placeholders.length]}
											value={row.name}
											onChange={(e) => updateRow(row.id, { name: e.target.value })}
											onKeyDown={(e) => onFieldKeyDown(e, index)}
											className={inputClass}
										/>
									</div>
									<p
										className={cn(
											"min-w-[5rem] flex-shrink-0 text-right font-mono text-[15px] font-semibold tabular-nums md:order-4",
											line > 0 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/30",
										)}
									>
										<span className="sr-only">{fill(labels.lineTotalLabel, { n })}: </span>
										{money.format(line)}
									</p>
								</div>

								<div className="mt-2 flex items-center gap-2 md:mt-0 md:contents">
									<div className="min-w-0 flex-1 md:order-2">
										<label className="sr-only" htmlFor={fieldId(row.id, "price")}>
											{fill(labels.priceLabel, { n })}
										</label>
										<input
											id={fieldId(row.id, "price")}
											type="text"
											inputMode="decimal"
											autoComplete="off"
											enterKeyHint="next"
											maxLength={14}
											placeholder={pricePlaceholder}
											value={row.price}
											onChange={(e) => updateRow(row.id, { price: e.target.value })}
											onKeyDown={(e) => onFieldKeyDown(e, index)}
											className={cn(inputClass, "tabular-nums")}
										/>
									</div>

									<div className="flex flex-shrink-0 items-center gap-1 md:order-3 md:justify-center">
										<button
											type="button"
											aria-label={fill(labels.decrease, { item: name })}
											disabled={qty <= 1}
											onClick={() => stepQty(row, -1)}
											className={cn(iconButtonClass, "w-10 md:w-8")}
										>
											<Minus aria-hidden="true" className="h-4 w-4" />
										</button>
										<label className="sr-only" htmlFor={fieldId(row.id, "qty")}>
											{fill(labels.qtyLabel, { n })}
										</label>
										<input
											id={fieldId(row.id, "qty")}
											type="text"
											inputMode="decimal"
											autoComplete="off"
											maxLength={6}
											value={row.qty}
											onChange={(e) => updateRow(row.id, { qty: e.target.value })}
											onBlur={() => normalizeQty(row)}
											className={cn(inputClass, "w-11 px-1 text-center tabular-nums md:w-10")}
										/>
										<button
											type="button"
											aria-label={fill(labels.increase, { item: name })}
											onClick={() => stepQty(row, 1)}
											className={cn(iconButtonClass, "w-10 md:w-8")}
										>
											<Plus aria-hidden="true" className="h-4 w-4" />
										</button>
									</div>

									<div className="flex flex-shrink-0 justify-end md:order-5">
										<button
											type="button"
											aria-label={fill(labels.remove, { item: name })}
											onClick={() => removeRow(index)}
											className={cn(
												iconButtonClass,
												"hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400",
											)}
										>
											<Trash2 aria-hidden="true" className="h-4 w-4" />
										</button>
									</div>
								</div>
							</li>
						);
					})}
				</ol>

				<button
					ref={addButtonRef}
					type="button"
					onClick={addRow}
					disabled={rows.length >= MAX_ROWS}
					className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-gray-300 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:opacity-40 dark:border-white/15 dark:text-brand-400 dark:hover:border-brand-400/60 dark:hover:bg-white/[0.04]"
				>
					<Plus aria-hidden="true" className="h-4 w-4" />
					{labels.addItem}
				</button>

				<p className="mt-3 px-1 text-xs text-gray-500 sm:px-0 dark:text-white/40">{labels.saved}</p>
			</section>

			{/* ── Settings + total ── */}
			<section
				aria-labelledby={summaryTitleId}
				className="rounded-[22px] border border-gray-200/90 bg-white p-4 sm:p-6 lg:sticky lg:top-24 dark:border-white/[0.07] dark:bg-white/[0.025]"
			>
				<h2 id={summaryTitleId} className="subsection-title mb-4">
					{labels.summaryTitle}
				</h2>

				<div className="grid grid-cols-2 gap-3">
					<div className="col-span-2">
						<label className="cf-label" htmlFor={`${uid}-currency`}>
							{labels.currency}
						</label>
						<select
							id={`${uid}-currency`}
							value={currency}
							onChange={(e) => setCurrency(e.target.value)}
							className={cn(inputClass, "cursor-pointer")}
						>
							{CURRENCIES.map((c) => (
								<option key={c.code} value={c.code}>
									{`${c.code} (${c.symbol})`}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="cf-label" htmlFor={`${uid}-budget`}>
							{labels.budget} <span className="font-medium tracking-normal normal-case">({labels.optional})</span>
						</label>
						<input
							id={`${uid}-budget`}
							type="text"
							inputMode="decimal"
							autoComplete="off"
							maxLength={14}
							value={budget}
							onChange={(e) => setBudget(e.target.value)}
							className={cn(inputClass, "tabular-nums")}
						/>
					</div>
					<div>
						<label className="cf-label" htmlFor={`${uid}-tax`}>
							{labels.tax} <span className="font-medium tracking-normal normal-case">({labels.optional})</span>
						</label>
						<input
							id={`${uid}-tax`}
							type="text"
							inputMode="decimal"
							autoComplete="off"
							maxLength={6}
							placeholder="0"
							value={tax}
							onChange={(e) => setTax(e.target.value)}
							className={cn(inputClass, "tabular-nums")}
						/>
					</div>
				</div>

				<dl ref={totalsRef} className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-[15px] dark:border-white/10">
					<div className="flex items-center justify-between gap-3">
						<dt className="text-gray-500 dark:text-white/55">{labels.subtotal}</dt>
						<dd className="font-mono font-semibold text-gray-900 tabular-nums dark:text-white">{money.format(subtotal)}</dd>
					</div>
					{taxRate > 0 && (
						<div className="flex items-center justify-between gap-3">
							<dt className="text-gray-500 dark:text-white/55">
								{fill(labels.taxLine, { rate: String(roundQty(taxRate)).replace(".", decimalSep) })}
							</dt>
							<dd className="font-mono font-semibold text-gray-900 tabular-nums dark:text-white">{money.format(taxAmount)}</dd>
						</div>
					)}
					<div className="flex items-end justify-between gap-3 border-t border-gray-200 pt-3 dark:border-white/10">
						<dt className="pb-1 font-semibold text-gray-900 dark:text-white">{labels.total}</dt>
						<dd
							className={cn(
								"font-mono text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] leading-none font-bold tracking-tight tabular-nums",
								isOver ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white",
							)}
						>
							{money.format(total)}
						</dd>
					</div>
				</dl>

				{hasBudget && (
					<div className="mt-4">
						<div
							role="progressbar"
							aria-label={labels.budgetUsed}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={usedPercent}
							className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"
						>
							<div
								className={cn("h-full rounded-full transition-[width] duration-300", isOver ? "bg-red-500" : "bg-brand-500")}
								style={{ width: `${usedPercent}%` }}
							/>
						</div>
						<p
							className={cn(
								"mt-2.5 rounded-xl px-3 py-2 text-sm font-semibold",
								isOver
									? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
									: "bg-brand-50 text-brand-800 dark:bg-brand-400/10 dark:text-brand-300",
							)}
						>
							{budgetMessage}
						</p>
					</div>
				)}

				<p aria-live="polite" className="sr-only">
					{announcement}
				</p>
			</section>

			{/* Compact running total for phones (duplicate of the totals block, so hidden from AT) */}
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center transition-all duration-200 lg:hidden",
					showPill ? "translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0",
				)}
			>
				<div
					className={cn(
						"flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold shadow-lg ring-1",
						isOver
							? "bg-red-600 text-white ring-red-700/30"
							: "bg-gray-900 text-white ring-black/10 dark:bg-white dark:text-gray-900",
					)}
				>
					<span className="opacity-75">{labels.total}</span>
					<span className="font-mono tabular-nums">{money.format(total)}</span>
				</div>
			</div>
		</div>
	);
}
