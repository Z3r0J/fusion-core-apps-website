import { Loader2, Mail, MessageSquare, RefreshCcw, Send, Smartphone, User } from "lucide-react";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
	const [formState, setFormState] = useState<FormState>("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		app: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormState("loading");
		setErrorMessage("");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name.trim(),
					email: formData.email.trim(),
					subject: formData.subject.trim(),
					app: formData.app.trim(),
					message: formData.message.trim(),
				}),
			});

			const data = await response.json();

			if (!response.ok) throw new Error(data.error || "Failed to send message");

			setFormState("success");
		} catch (err) {
			setFormState("error");
			setErrorMessage(
				err instanceof Error
					? err.message
					: "Failed to send message. Please try again or email us directly.",
			);
		}
	};

	const handleReset = () => {
		setFormData({ name: "", email: "", subject: "", app: "", message: "" });
		setFormState("idle");
		setErrorMessage("");
	};

	if (formState === "success") {
		return (
			<div className="cf-card">
				<div className="cf-success">
					<div className="cf-success__icon">
						<svg
							fill="none"
							height="28"
							stroke="rgba(46,207,255,0.8)"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="28"
						>
							<path
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<h3
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
							fontWeight: 900,
							letterSpacing: "-0.035em",
							lineHeight: 1.1,
							marginBottom: 10,
						}}
						className="text-gray-900 dark:text-white"
					>
						Message sent!
					</h3>
					<p
						style={{ fontSize: 14.5, lineHeight: 1.7, maxWidth: 340, marginBottom: 28 }}
						className="text-gray-500 dark:text-[rgba(255,255,255,0.40)]"
					>
						Thank you for reaching out. We will get back to you within 24 hours.
					</p>
					<button
						type="button"
						onClick={handleReset}
						className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-80"
						style={{
							borderColor: "rgba(46,207,255,0.22)",
							color: "var(--color-brand-600)",
							background: "rgba(46,207,255,0.06)",
						}}
					>
						<RefreshCcw className="h-3.5 w-3.5" />
						Send another message
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="cf-card">
			<h2
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
					fontWeight: 800,
					letterSpacing: "-0.035em",
					marginBottom: 24,
				}}
				className="text-gray-900 dark:text-white"
			>
				Send us a message
			</h2>

			{/* Error */}
			{formState === "error" && errorMessage && (
				<div className="cf-error">
					<svg
						className="mt-0.5 flex-shrink-0"
						fill="none"
						height="16"
						stroke="rgb(239,68,68)"
						strokeWidth="2"
						viewBox="0 0 24 24"
						width="16"
					>
						<path
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<p style={{ fontSize: 13.5 }} className="text-red-700 dark:text-red-400">
						{errorMessage}
					</p>
				</div>
			)}

			<form className="space-y-5" onSubmit={handleSubmit}>
				{/* Name + Email */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="cf-label" htmlFor="contact-name">
							Full name *
						</label>
						<div className="cf-input-wrap">
							<User className="cf-input-icon h-4 w-4" />
							<input
								autoComplete="name"
								className="cf-input"
								id="contact-name"
								name="name"
								placeholder="Jean Reyes"
								required
								type="text"
								value={formData.name}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<label className="cf-label" htmlFor="contact-email">
							Email address *
						</label>
						<div className="cf-input-wrap">
							<Mail className="cf-input-icon h-4 w-4" />
							<input
								autoComplete="email"
								className="cf-input"
								id="contact-email"
								name="email"
								placeholder="you@example.com"
								required
								type="email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>

				{/* Subject */}
				<div>
					<label className="cf-label" htmlFor="contact-subject">
						Subject *
					</label>
					<div className="cf-input-wrap">
						<MessageSquare className="cf-input-icon h-4 w-4" />
						<select
							className="cf-input"
							id="contact-subject"
							name="subject"
							required
							value={formData.subject}
							onChange={handleChange}
						>
							<option value="">Select a subject</option>
							<option value="app-support">App support</option>
							<option value="bug-report">Bug report</option>
							<option value="feature-request">Feature request</option>
							<option value="business-inquiry">Business inquiry</option>
							<option value="partnership">Partnership</option>
							<option value="general">General question</option>
							<option value="other">Other</option>
						</select>
					</div>
				</div>

				{/* App */}
				<div>
					<label className="cf-label" htmlFor="contact-app">
						Related app{" "}
						<span style={{ textTransform: "none", fontWeight: 500, opacity: 0.6 }}>
							(optional)
						</span>
					</label>
					<div className="cf-input-wrap">
						<Smartphone className="cf-input-icon h-4 w-4" />
						<input
							className="cf-input"
							id="contact-app"
							name="app"
							placeholder="e.g., Bible TPT, Biblia TLA, Claimly"
							type="text"
							value={formData.app}
							onChange={handleChange}
						/>
					</div>
					<p className="cf-hint">Let us know which app this is about.</p>
				</div>

				{/* Message */}
				<div>
					<label className="cf-label" htmlFor="contact-message">
						Message *
					</label>
					<textarea
						className="cf-input"
						id="contact-message"
						name="message"
						placeholder="Tell us how we can help…"
						required
						rows={6}
						value={formData.message}
						onChange={handleChange}
					/>
				</div>

				{/* Privacy notice */}
				<div className="cf-privacy">
					<svg
						className="mt-0.5 flex-shrink-0"
						fill="none"
						height="14"
						stroke="rgba(46,207,255,0.70)"
						strokeWidth="2"
						viewBox="0 0 24 24"
						width="14"
					>
						<path
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<p style={{ fontSize: 12.5, lineHeight: 1.65 }} className="text-gray-600 dark:text-[rgba(255,255,255,0.42)]">
						<span className="font-semibold text-gray-800 dark:text-[rgba(255,255,255,0.70)]">
							Privacy protected.{" "}
						</span>
						We only use your info to respond to your inquiry. See our{" "}
						<a
							className="font-semibold underline underline-offset-2 hover:no-underline"
							href="/privacy"
							style={{ color: "var(--color-brand-600)" }}
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col-reverse items-stretch justify-end gap-3 pt-2 sm:flex-row sm:items-center">
					<button
						className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-40"
						disabled={formState === "loading"}
						style={{
							borderColor: "rgba(0,0,0,0.10)",
							color: "var(--color-gray-600)",
						}}
						type="button"
						onClick={handleReset}
					>
						<RefreshCcw className="h-3.5 w-3.5" />
						Clear
					</button>
					<button
						className="button button--primary px-7"
						disabled={formState === "loading"}
						type="submit"
					>
						{formState === "loading" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending…
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Send message
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
