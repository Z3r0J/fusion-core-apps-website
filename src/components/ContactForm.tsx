import { Loader2, Mail, MessageSquare, RefreshCcw, Send, Smartphone, User } from "lucide-react";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

type Locale = "en" | "es" | "pt";

const cfI18n: Record<Locale, {
	formTitle: string;
	nameLabel: string;
	emailLabel: string;
	subjectLabel: string;
	subjectPlaceholder: string;
	subjects: Array<{ value: string; label: string }>;
	appLabel: string;
	appOptional: string;
	appHint: string;
	messageLabel: string;
	messagePlaceholder: string;
	privacyStrong: string;
	privacyBody: string;
	privacyLink: string;
	clearBtn: string;
	sendBtn: string;
	sendingBtn: string;
	successTitle: string;
	successBody: string;
	sendAnotherBtn: string;
	errorFallback: string;
}> = {
	en: {
		formTitle: "Send us a message",
		nameLabel: "Full name",
		emailLabel: "Email address",
		subjectLabel: "Subject",
		subjectPlaceholder: "Select a subject",
		subjects: [
			{ value: "app-support", label: "App support" },
			{ value: "bug-report", label: "Bug report" },
			{ value: "feature-request", label: "Feature request" },
			{ value: "business-inquiry", label: "Business inquiry" },
			{ value: "partnership", label: "Partnership" },
			{ value: "general", label: "General question" },
			{ value: "other", label: "Other" },
		],
		appLabel: "Related app",
		appOptional: "(optional)",
		appHint: "Let us know which app this is about.",
		messageLabel: "Message",
		messagePlaceholder: "Tell us how we can help…",
		privacyStrong: "Privacy protected.",
		privacyBody: "We only use your info to respond to your inquiry. See our",
		privacyLink: "Privacy Policy",
		clearBtn: "Clear",
		sendBtn: "Send message",
		sendingBtn: "Sending…",
		successTitle: "Message sent!",
		successBody: "Thank you for reaching out. We will get back to you within 24 hours.",
		sendAnotherBtn: "Send another message",
		errorFallback: "Failed to send message. Please try again or email us directly.",
	},
	es: {
		formTitle: "Envíanos un mensaje",
		nameLabel: "Nombre completo",
		emailLabel: "Correo electrónico",
		subjectLabel: "Asunto",
		subjectPlaceholder: "Selecciona un asunto",
		subjects: [
			{ value: "app-support", label: "Soporte de app" },
			{ value: "bug-report", label: "Reporte de error" },
			{ value: "feature-request", label: "Solicitud de función" },
			{ value: "business-inquiry", label: "Consulta de negocios" },
			{ value: "partnership", label: "Alianza" },
			{ value: "general", label: "Pregunta general" },
			{ value: "other", label: "Otro" },
		],
		appLabel: "App relacionada",
		appOptional: "(opcional)",
		appHint: "Cuéntanos sobre qué app es.",
		messageLabel: "Mensaje",
		messagePlaceholder: "Cuéntanos cómo podemos ayudarte…",
		privacyStrong: "Privacidad protegida.",
		privacyBody: "Solo usamos tu información para responder tu consulta. Lee nuestra",
		privacyLink: "Política de Privacidad",
		clearBtn: "Limpiar",
		sendBtn: "Enviar mensaje",
		sendingBtn: "Enviando…",
		successTitle: "¡Mensaje enviado!",
		successBody: "Gracias por escribirnos. Te responderemos en un plazo de 24 horas.",
		sendAnotherBtn: "Enviar otro mensaje",
		errorFallback: "Error al enviar el mensaje. Intenta de nuevo o escríbenos directamente.",
	},
	pt: {
		formTitle: "Envie-nos uma mensagem",
		nameLabel: "Nome completo",
		emailLabel: "E-mail",
		subjectLabel: "Assunto",
		subjectPlaceholder: "Selecione um assunto",
		subjects: [
			{ value: "app-support", label: "Suporte de app" },
			{ value: "bug-report", label: "Relatório de bug" },
			{ value: "feature-request", label: "Solicitação de recurso" },
			{ value: "business-inquiry", label: "Consulta comercial" },
			{ value: "partnership", label: "Parceria" },
			{ value: "general", label: "Pergunta geral" },
			{ value: "other", label: "Outro" },
		],
		appLabel: "App relacionado",
		appOptional: "(opcional)",
		appHint: "Nos diga sobre qual app é.",
		messageLabel: "Mensagem",
		messagePlaceholder: "Conte-nos como podemos ajudar…",
		privacyStrong: "Privacidade protegida.",
		privacyBody: "Usamos suas informações apenas para responder sua consulta. Veja nossa",
		privacyLink: "Política de Privacidade",
		clearBtn: "Limpar",
		sendBtn: "Enviar mensagem",
		sendingBtn: "Enviando…",
		successTitle: "Mensagem enviada!",
		successBody: "Obrigado por entrar em contato. Responderemos em até 24 horas.",
		sendAnotherBtn: "Enviar outra mensagem",
		errorFallback: "Erro ao enviar mensagem. Tente novamente ou nos escreva diretamente.",
	},
};

type Props = {
	locale?: Locale;
	privacyHref?: string;
};

export default function ContactForm({ locale = "en", privacyHref = "/privacy" }: Props) {
	const i18n = cfI18n[locale];
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
				err instanceof Error ? err.message : i18n.errorFallback,
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
						{i18n.successTitle}
					</h3>
					<p
						style={{ fontSize: 14.5, lineHeight: 1.7, maxWidth: 340, marginBottom: 28 }}
						className="text-gray-500 dark:text-[rgba(255,255,255,0.40)]"
					>
						{i18n.successBody}
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
						{i18n.sendAnotherBtn}
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
				{i18n.formTitle}
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
							{i18n.nameLabel} *
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
							{i18n.emailLabel} *
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
						{i18n.subjectLabel} *
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
							<option value="">{i18n.subjectPlaceholder}</option>
							{i18n.subjects.map((s) => (
								<option key={s.value} value={s.value}>{s.label}</option>
							))}
						</select>
					</div>
				</div>

				{/* App */}
				<div>
					<label className="cf-label" htmlFor="contact-app">
						{i18n.appLabel}{" "}
						<span style={{ textTransform: "none", fontWeight: 500, opacity: 0.6 }}>
							{i18n.appOptional}
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
					<p className="cf-hint">{i18n.appHint}</p>
				</div>

				{/* Message */}
				<div>
					<label className="cf-label" htmlFor="contact-message">
						{i18n.messageLabel} *
					</label>
					<textarea
						className="cf-input"
						id="contact-message"
						name="message"
						placeholder={i18n.messagePlaceholder}
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
							{i18n.privacyStrong}{" "}
						</span>
						{i18n.privacyBody}{" "}
						<a
							className="font-semibold underline underline-offset-2 hover:no-underline"
							href={privacyHref}
							style={{ color: "var(--color-brand-600)" }}
						>
							{i18n.privacyLink}
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
						{i18n.clearBtn}
					</button>
					<button
						className="button button--primary px-7"
						disabled={formState === "loading"}
						type="submit"
					>
						{formState === "loading" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{i18n.sendingBtn}
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								{i18n.sendBtn}
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
