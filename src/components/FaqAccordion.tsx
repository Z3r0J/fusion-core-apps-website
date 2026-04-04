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
					<div key={index} className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
						<button
							aria-expanded={isOpen}
							className="faq-btn"
							type="button"
							onClick={() => toggle(index)}
						>
							<span className="faq-question">{faq.question}</span>
							<motion.span
								animate={{ rotate: isOpen ? 180 : 0 }}
								className="flex-shrink-0"
								transition={{ duration: 0.22, ease: "easeInOut" }}
								style={{ color: isOpen ? "var(--color-brand-500)" : undefined }}
							>
								<ChevronDown
									className="h-5 w-5 text-gray-400 dark:text-[rgba(255,255,255,0.25)]"
									style={{ color: isOpen ? "var(--color-brand-500)" : undefined }}
								/>
							</motion.span>
						</button>

						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									key="content"
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									initial={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.24, ease: "easeInOut" }}
									className="overflow-hidden"
								>
									<div className="faq-divider" />
									<p className="faq-answer">{faq.answer}</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
