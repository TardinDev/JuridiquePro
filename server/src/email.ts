// ── Email Service (Resend) ────────────────────────────────────────
// Sends transactional emails. If RESEND_API_KEY is not set, logs to console instead.

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "Juridique Pro <noreply@projuridique.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nze.claudia@yahoo.fr"

interface EmailPayload {
    to: string
    subject: string
    html: string
}

async function sendEmail(payload: EmailPayload): Promise<void> {
    if (!RESEND_API_KEY) {
        console.log(`[EMAIL-DEV] To: ${payload.to} | Subject: ${payload.subject}`)
        return
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        }),
    })

    if (!res.ok) {
        const body = await res.text()
        console.error(`[EMAIL] Failed to send: ${res.status} ${body}`)
    }
}

// ── Contact form notification (to admin) ──────────────────────────
export async function sendContactNotification(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}): Promise<void> {
    await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Contact] ${data.subject} — ${data.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #627A93;">Nouveau message de contact</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Nom</td><td style="padding: 8px 0;">${data.name}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
                    ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Téléphone</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Sujet</td><td style="padding: 8px 0;">${data.subject}</td></tr>
                </table>
                <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
                    <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
                </div>
            </div>
        `,
    })
}

// ── Contact confirmation (to user) ────────────────────────────────
export async function sendContactConfirmation(data: {
    name: string
    email: string
    subject: string
}): Promise<void> {
    await sendEmail({
        to: data.email,
        subject: `Juridique Pro — Nous avons bien reçu votre message`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #627A93;">Merci pour votre message, ${data.name} !</h2>
                <p>Nous avons bien reçu votre demande concernant "<strong>${data.subject}</strong>".</p>
                <p>Notre équipe vous répondra dans les <strong>24 heures ouvrées</strong>.</p>
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
                <p style="color: #888; font-size: 13px;">
                    Juridique Pro — Expert en formalités juridiques & création d'entreprises<br />
                    <a href="https://projuridique.com" style="color: #627A93;">projuridique.com</a>
                </p>
            </div>
        `,
    })
}

// ── Welcome email (on registration) ──────────────────────────────
export async function sendWelcomeEmail(data: {
    name: string
    email: string
}): Promise<void> {
    await sendEmail({
        to: data.email,
        subject: `Bienvenue sur Juridique Pro, ${data.name} !`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #627A93;">Bienvenue, ${data.name} !</h2>
                <p>Votre compte Juridique Pro a été créé avec succès.</p>
                <p>Vous pouvez désormais :</p>
                <ul>
                    <li>Partager votre témoignage sur nos services</li>
                    <li>Suivre l'actualité juridique sur notre blog</li>
                </ul>
                <p>
                    <a href="https://projuridique.com/temoignages" style="display: inline-block; padding: 12px 24px; background: #627A93; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Laisser un témoignage
                    </a>
                </p>
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
                <p style="color: #888; font-size: 13px;">
                    Juridique Pro — Expert en formalités juridiques & création d'entreprises<br />
                    <a href="https://projuridique.com" style="color: #627A93;">projuridique.com</a>
                </p>
            </div>
        `,
    })
}

// ── Testimonial notification (to admin) ──────────────────────────
export async function sendTestimonialNotification(data: {
    name: string
    content: string
    rating: number
}): Promise<void> {
    await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Témoignage] Nouveau témoignage de ${data.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #627A93;">Nouveau témoignage à modérer</h2>
                <p><strong>${data.name}</strong> a laissé un témoignage (${data.rating}/5 étoiles) :</p>
                <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 0; font-style: italic;">"${data.content}"</p>
                </div>
                <p>
                    <a href="https://projuridique.com/admin" style="display: inline-block; padding: 12px 24px; background: #627A93; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Modérer sur le dashboard
                    </a>
                </p>
            </div>
        `,
    })
}
