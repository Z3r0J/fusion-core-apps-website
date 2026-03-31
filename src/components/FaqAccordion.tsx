import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqItem {
	question: string;
	answer: string;
}

interface Props {
	faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggle = (index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	};

	return (
		<div className="mx-auto max-w-3xl space-y-3">
			{faqs.map((faq, index) => {
				const isOpen = openIndex === index;
				return (
					<div
						key={index}
						className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
					>
						<button
							type="button"
							onClick={() => toggle(index)}
							className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
							aria-expanded={isOpen}
						>
							<span className="text-lg font-semibold text-gray-900 dark:text-white">
								{faq.question}
							</span>
							<motion.span
								animate={{ rotate: isOpen ? 180 : 0 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								className="flex-shrink-0"
							>
								<ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
							</motion.span>
						</button>

						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									key="content"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.25, ease: "easeInOut" }}
									className="overflow-hidden"
								>
									<div className="border-t border-gray-200 px-6 py-5 dark:border-gray-700">
										<p className="leading-relaxed text-gray-600 dark:text-gray-400">
											{faq.answer}
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
