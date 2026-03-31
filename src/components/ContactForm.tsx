import {
	CheckCircle,
	CircleAlert,
	Loader2,
	Mail,
	MessageSquare,
	RefreshCcw,
	Send,
	Smartphone,
	User,
} from "lucide-react";
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

			if (!response.ok) {
				throw new Error(data.error || "Failed to send message");
			}

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

	const handleSendAnother = () => {
		handleReset();
	};

	if (formState === "success") {
		return (
			<div className="card p-8">
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
						<CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
					</div>
					<h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
						Message sent!
					</h3>
					<p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
						Thank you for reaching out. We will get back to you within 24 hours.
					</p>
					<button
						type="button"
						onClick={handleSendAnother}
						className="button button--secondary"
					>
						<RefreshCcw className="mr-2 h-4 w-4" />
						Send another message
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="card p-8">
			<h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
				Send us a message
			</h2>

			{/* Error message */}
			{formState === "error" && errorMessage && (
				<div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
					<CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
					<p className="text-sm text-red-800 dark:text-red-400">{errorMessage}</p>
				</div>
			)}

			<form className="space-y-6" onSubmit={handleSubmit}>
				{/* Name and Email */}
				<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
					<div>
						<label className="label" htmlFor="contact-name">
							Full name *
						</label>
						<div className="relative">
							<User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<input
								autoComplete="name"
								className="input pl-10"
								id="contact-name"
								name="name"
								placeholder="John Doe"
								required
								type="text"
								value={formData.name}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<label className="label" htmlFor="contact-email">
							Email address *
						</label>
						<div className="relative">
							<Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<input
								autoComplete="email"
								className="input pl-10"
								id="contact-email"
								name="email"
								placeholder="john@example.com"
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
					<label className="label" htmlFor="contact-subject">
						Subject *
					</label>
					<div className="relative">
						<MessageSquare className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
						<select
							className="input pl-10"
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

				{/* App (if applicable) */}
				<div>
					<label className="label" htmlFor="contact-app">
						Related app (optional)
					</label>
					<div className="relative">
						<Smartphone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
						<input
							className="input pl-10"
							id="contact-app"
							name="app"
							placeholder="e.g., Bible TPT, Biblia TLA"
							type="text"
							value={formData.app}
							onChange={handleChange}
						/>
					</div>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						If your message is about a specific app, please let us know which one.
					</p>
				</div>

				{/* Message */}
				<div>
					<label className="label" htmlFor="contact-message">
						Message *
					</label>
					<textarea
						className="input resize-y"
						id="contact-message"
						name="message"
						placeholder="Tell us how we can help you..."
						required
						rows={6}
						value={formData.message}
						onChange={handleChange}
					/>
				</div>

				{/* Privacy Notice */}
				<div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
					<div className="flex items-start gap-3">
						<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
						<div className="text-sm text-blue-800 dark:text-blue-200">
							<p className="mb-1 font-medium">Privacy &amp; data protection</p>
							<p>
								By submitting this form, you agree to our{" "}
								<a className="font-medium underline hover:no-underline" href="/privacy">
									Privacy policy
								</a>
								. We will only use your information to respond to your inquiry and will never share
								it with third parties.
							</p>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex flex-col-reverse items-stretch justify-end gap-3 pt-4 sm:flex-row sm:items-center sm:gap-4">
					<button
						className="button button--secondary"
						type="button"
						onClick={handleReset}
						disabled={formState === "loading"}
					>
						<RefreshCcw className="mr-2 h-4 w-4" />
						Clear form
					</button>
					<button
						className="button button--primary"
						type="submit"
						disabled={formState === "loading"}
					>
						{formState === "loading" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending...
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
