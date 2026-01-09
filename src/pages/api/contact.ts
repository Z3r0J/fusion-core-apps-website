export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const { name, email, subject, app, message } = body;

		// Validación básica
		if (!name || !email || !subject || !message) {
			return new Response(
				JSON.stringify({ error: "Todos los campos obligatorios deben ser completados" }),
				{ status: 400 },
			);
		}

		// Email usando Resend API
		const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
		const CONTACT_EMAIL_TO = import.meta.env.CONTACT_EMAIL_TO || "jeanrey.ese@gmail.com";

		if (!RESEND_API_KEY) {
			console.error("RESEND_API_KEY no está configurada");
			// Fallback: log en consola
			console.log("📧 Nuevo mensaje de contacto:");
			console.log({ name, email, subject, app, message });

			return new Response(
				JSON.stringify({
					success: true,
					message: "Mensaje recibido (modo desarrollo)",
				}),
				{ status: 200 },
			);
		}

		const subjectLabels: Record<string, string> = {
			"app-support": "📱 App Support",
			"bug-report": "🐛 Bug Report",
			"feature-request": "💡 Feature Request",
			"business-inquiry": "💼 Business Inquiry",
			"partnership": "🤝 Partnership",
			"general": "💬 General Question",
			"other": "📝 Other",
		};

		const emailSubject = `${subjectLabels[subject] || subject} - Contact from ${name}`;

		const htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Contact Form Submission</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff;">
				<table role="presentation" style="width: 100%; border-collapse: collapse;">
					<tr>
						<td style="padding: 40px 20px;">
							<table role="presentation" style="max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0;">
								
								<!-- Header -->
								<tr>
									<td style="background-color: #ffffff; padding: 32px 40px; border-bottom: 3px solid #2563eb;">
										<h1 style="margin: 0 0 8px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
											New Contact Form Submission
										</h1>
										<p style="margin: 0; color: #6b7280; font-size: 14px;">
											Received on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
										</p>
									</td>
								</tr>

								<!-- Content -->
								<tr>
									<td style="padding: 0;">
										<table role="presentation" style="width: 100%; border-collapse: collapse;">
											
											<!-- Subject -->
											<tr>
												<td style="padding: 24px 40px; border-bottom: 1px solid #e5e7eb;">
													<table role="presentation" style="width: 100%;">
														<tr>
															<td style="width: 140px; vertical-align: top;">
																<p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 600;">
																	SUBJECT
																</p>
															</td>
															<td style="vertical-align: top;">
																<p style="margin: 0; color: #111827; font-size: 14px; font-weight: 500;">
																	${subjectLabels[subject] || subject}
																</p>
															</td>
														</tr>
													</table>
												</td>
											</tr>

											<!-- From -->
											<tr>
												<td style="padding: 24px 40px; border-bottom: 1px solid #e5e7eb;">
													<table role="presentation" style="width: 100%;">
														<tr>
															<td style="width: 140px; vertical-align: top;">
																<p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 600;">
																	FROM
																</p>
															</td>
															<td style="vertical-align: top;">
																<p style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 500;">
																	${name}
																</p>
																<p style="margin: 0; color: #2563eb; font-size: 14px;">
																	<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">
																		${email}
																	</a>
																</p>
															</td>
														</tr>
													</table>
												</td>
											</tr>

											${
												app
													? `
											<!-- Related App -->
											<tr>
												<td style="padding: 24px 40px; border-bottom: 1px solid #e5e7eb; background-color: #fafafa;">
													<table role="presentation" style="width: 100%;">
														<tr>
															<td style="width: 140px; vertical-align: top;">
																<p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 600;">
																	RELATED APP
																</p>
															</td>
															<td style="vertical-align: top;">
																<p style="margin: 0; color: #111827; font-size: 14px; font-weight: 500;">
																	${app}
																</p>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											`
													: ""
											}

											<!-- Message -->
											<tr>
												<td style="padding: 32px 40px;">
													<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; font-weight: 600;">
														MESSAGE
													</p>
													<div style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
													</div>
												</td>
											</tr>

										</table>
									</td>
								</tr>

								<!-- Action -->
								<tr>
									<td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
										<table role="presentation" style="width: 100%;">
											<tr>
												<td>
													<a href="mailto:${email}?subject=Re: ${emailSubject.replace(/&/g, "%26")}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 500; border-radius: 4px;">
														Reply to this message
													</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>

								<!-- Footer -->
								<tr>
									<td style="padding: 24px 40px; background-color: #ffffff; border-top: 1px solid #e5e7eb;">
										<p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
											This message was automatically forwarded from the FusionCore Apps website contact form. 
											Please reply directly to the sender's email address above.
										</p>
										<p style="margin: 0; color: #d1d5db; font-size: 11px;">
											© ${new Date().getFullYear()} FusionCore Apps. All rights reserved.
										</p>
									</td>
								</tr>

							</table>
						</td>
					</tr>
				</table>
			</body>
			</html>
		`;

		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: "FusionCore Apps <onboarding@resend.dev>", // Cambiar cuando tengas dominio verificado
				to: [CONTACT_EMAIL_TO],
				reply_to: email,
				subject: emailSubject,
				html: htmlContent,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Resend API error:", error);
			throw new Error("Failed to send email");
		}

		const data = await response.json();
		console.log("Email sent successfully:", data);

		return new Response(
			JSON.stringify({
				success: true,
				message: "Mensaje enviado correctamente",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return new Response(
			JSON.stringify({
				error: "Error al enviar el mensaje. Por favor, intenta de nuevo.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};
