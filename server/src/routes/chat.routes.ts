import { Router } from "express"
import { streamText, convertToModelMessages, createUIMessageStream, pipeUIMessageStreamToResponse } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const router = Router()

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Juridique Pro, un cabinet expert en formalités juridiques et création d'entreprises en France, fondé par Oyane Nze Clodia. Tu réponds UNIQUEMENT en français, de manière professionnelle, chaleureuse et concise.

## Informations sur Juridique Pro

### Services et tarifs
- **Création de société** (SARL, SAS, SASU, SA, SCI, EURL) : dès 0 € HT (forfait Basique), 99 € HT (Standard), 199 € HT (Express). Frais administratifs (greffe + annonce légale) ~190 € en sus.
- **Création micro-entreprise** (auto-entrepreneur) : 59 € HT (Standard), 99 € HT (Express avec ACRE)
- **Modification de statuts** : Changement de dirigeant 59 € HT, Transfert de siège 79 € HT, Cession de parts 99 € HT
- **Domiciliation commerciale** à Lyon et Nice : 19 € HT/mois (micro-entreprise), 29 € HT/mois (société)
- **Comptabilité** : 39 € HT/mois (Essentiel), 69 € HT/mois (Premium avec expert dédié)
- **Dissolution** : 59 € HT, Dissolution + Liquidation : 149 € HT
- **Formalités juridiques** : approbation des comptes, publication légale, déclaration bénéficiaires effectifs
- **Gestion administrative** : à partir de 29 € HT/mois
- **Suivi & Accompagnement** post-création inclus

### Données clés
- 15 ans d'expérience
- Plus de 500 entreprises créées
- 98 % de satisfaction client
- Garantie anti-rejet du greffe
- Première consultation gratuite et sans engagement

### Bureaux
- **Lyon - Vénissieux** (siège social) : 37 Avenue Jean Cagne, 69200 Vénissieux
- **Nice** : 13 Avenue Cagnoli, 06100 Nice

### Contact
- Email : nze.claudia@yahoo.fr
- Téléphone : +33 7 58 74 56 23
- Site : projuridique.com
- Horaires : Lun-Ven 9h-18h, Sam sur RDV

### Identification
- Dirigeante : Oyane Nze Clodia, experte en droit des sociétés
- SIREN : 999 885 171
- Code APE : 8211Z

### FAQ fréquentes
- Délai micro-entreprise : 24-48h | société : 1-2 semaines
- Différence entreprise/société : l'entreprise individuelle est en nom propre, la société est une personne morale distincte
- Formes de sociétés créées : SARL, SAS, SASU, SA, SCI, EURL, SNC...
- Intervention : toute la France via outils digitaux et guichet unique INPI

## Règles
1. Réponds TOUJOURS en français
2. Sois concis (3-5 phrases max par réponse)
3. Si la question concerne un sujet hors de tes connaissances sur Juridique Pro, propose de contacter l'équipe par téléphone (+33 7 58 74 56 23) ou email (nze.claudia@yahoo.fr)
4. Pour les demandes de devis ou rendez-vous, oriente vers la page contact : projuridique.com/contact
5. Ne donne JAMAIS de conseil juridique personnalisé — propose toujours une consultation gratuite
6. Mentionne la consultation gratuite quand c'est pertinent
7. Sois chaleureux et professionnel, tutoie le visiteur si il te tutoie, sinon vouvoie`

// ── Fallback responses (when no API key) ──────────────────────
function getFallbackResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase()

    if (msg.includes("tarif") || msg.includes("prix") || msg.includes("cout") || msg.includes("coût") || msg.includes("combien")) {
        return "Nos tarifs sont transparents : création de société dès 0 € HT, micro-entreprise dès 59 € HT, domiciliation dès 19 € HT/mois. Consultez tous nos tarifs sur projuridique.com/tarifs ou contactez-nous pour un devis personnalisé au +33 7 58 74 56 23."
    }

    if (msg.includes("créer") || msg.includes("creation") || msg.includes("création") || msg.includes("creer")) {
        return "Nous créons toutes les formes de sociétés : SARL, SAS, SASU, SA, SCI, EURL... La création commence dès 0 € HT avec notre forfait Basique. Le délai est de 1 à 2 semaines pour une société, 24-48h pour une micro-entreprise. Souhaitez-vous une consultation gratuite pour en discuter ?"
    }

    if (msg.includes("micro") || msg.includes("auto-entrepreneur") || msg.includes("autoentrepreneur")) {
        return "Nous prenons en charge la création de micro-entreprise dès 59 € HT : déclaration d'activité, immatriculation INPI, obtention Kbis et SIRET. Le délai est de 24 à 48h. Notre forfait Express à 99 € HT inclut l'obtention de l'ACRE. Voulez-vous en savoir plus ?"
    }

    if (msg.includes("domiciliation") || msg.includes("adresse") || msg.includes("siège")) {
        return "Nous proposons la domiciliation commerciale à Lyon et Nice : 19 € HT/mois pour les micro-entreprises, 29 € HT/mois pour les sociétés. Cela inclut l'adresse de siège social, la réexpédition du courrier et la numérisation des documents."
    }

    if (msg.includes("contact") || msg.includes("téléphone") || msg.includes("email") || msg.includes("appeler") || msg.includes("joindre")) {
        return "Vous pouvez nous contacter par téléphone au +33 7 58 74 56 23, par email à nze.claudia@yahoo.fr, ou via notre formulaire sur projuridique.com/contact. Nos bureaux sont à Lyon-Vénissieux (37 av. Jean Cagne) et Nice (13 av. Cagnoli). Horaires : Lun-Ven 9h-18h."
    }

    if (msg.includes("comptab") || msg.includes("fiscal") || msg.includes("bilan")) {
        return "Notre service comptabilité démarre à 39 € HT/mois (Essentiel) ou 69 € HT/mois (Premium avec expert dédié). Il inclut la tenue des comptes, les déclarations fiscales, le bilan annuel et un logiciel de facturation. Souhaitez-vous une consultation gratuite ?"
    }

    if (msg.includes("modification") || msg.includes("statut") || msg.includes("dirigeant") || msg.includes("cession") || msg.includes("transfert")) {
        return "Nous gérons toutes les modifications statutaires : changement de dirigeant (59 € HT), transfert de siège (79 € HT), cession de parts (99 € HT). Chaque prestation inclut la rédaction du PV, la mise à jour des statuts, la publication légale et le dépôt au greffe."
    }

    if (msg.includes("dissolution") || msg.includes("fermer") || msg.includes("fermeture") || msg.includes("liquidation")) {
        return "Nous accompagnons la fermeture de société : dissolution à 59 € HT, dissolution + liquidation complète à 149 € HT. Cela inclut la rédaction des PV, les publications légales et la radiation au greffe. Contactez-nous pour une consultation gratuite."
    }

    if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("bonsoir")) {
        return "Bonjour ! Bienvenue sur Juridique Pro. Je suis votre assistant virtuel. Comment puis-je vous aider ? Création d'entreprise, formalités juridiques, domiciliation, comptabilité... je suis là pour répondre à vos questions !"
    }

    if (msg.includes("merci")) {
        return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Pour un accompagnement personnalisé, notre première consultation est gratuite. Contactez-nous au +33 7 58 74 56 23 ou sur projuridique.com/contact."
    }

    return "Merci pour votre question ! Pour vous répondre au mieux, je vous invite à contacter notre équipe directement. La première consultation est gratuite et sans engagement. Appelez-nous au +33 7 58 74 56 23 ou écrivez-nous sur projuridique.com/contact."
}

// Extract last user text from UIMessage parts
function getLastUserText(messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }> }>): string {
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i]
        if (msg.role === "user" && msg.parts) {
            const textPart = msg.parts.find((p) => p.type === "text" && p.text)
            if (textPart && textPart.text) return textPart.text
        }
    }
    return ""
}

// ── POST /api/chat ────────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        const { messages } = req.body

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: "Messages invalides" })
            return
        }

        const lastUserText = getLastUserText(messages)

        // If no Google API key, use fallback via UIMessage stream
        if (!GOOGLE_API_KEY) {
            const fallbackText = getFallbackResponse(lastUserText)
            const stream = createUIMessageStream({
                execute: ({ writer }) => {
                    writer.write({ type: "text-start", id: "fallback-text" })
                    writer.write({ type: "text-delta", id: "fallback-text", delta: fallbackText })
                    writer.write({ type: "text-end", id: "fallback-text" })
                },
            })
            pipeUIMessageStreamToResponse({ response: res, stream })
            return
        }

        // Use AI SDK with Google Gemini, with fallback on error
        const google = createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY })

        const modelMessages = await convertToModelMessages(messages)

        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                try {
                    const result = streamText({
                        model: google("gemini-2.0-flash"),
                        system: SYSTEM_PROMPT,
                        messages: modelMessages,
                        maxOutputTokens: 500,
                    })

                    // Consume textStream manually to catch errors
                    let started = false
                    const textId = "gemini-text"

                    for await (const delta of result.textStream) {
                        if (!started) {
                            writer.write({ type: "text-start", id: textId })
                            started = true
                        }
                        writer.write({ type: "text-delta", id: textId, delta })
                    }

                    if (started) {
                        writer.write({ type: "text-end", id: textId })
                    } else {
                        throw new Error("Empty response from Gemini")
                    }
                } catch (err) {
                    console.error("Gemini error, using fallback:", err)
                    const fallbackText = getFallbackResponse(lastUserText)
                    writer.write({ type: "text-start", id: "fallback-text" })
                    writer.write({ type: "text-delta", id: "fallback-text", delta: fallbackText })
                    writer.write({ type: "text-end", id: "fallback-text" })
                }
            },
        })

        pipeUIMessageStreamToResponse({ response: res, stream })
    } catch (error) {
        console.error("Chat error:", error)
        if (!res.headersSent) {
            const fallbackText = getFallbackResponse(getLastUserText(req.body?.messages || []))
            const stream = createUIMessageStream({
                execute: ({ writer }) => {
                    writer.write({ type: "text-start", id: "fallback-text" })
                    writer.write({ type: "text-delta", id: "fallback-text", delta: fallbackText })
                    writer.write({ type: "text-end", id: "fallback-text" })
                },
            })
            pipeUIMessageStreamToResponse({ response: res, stream })
        }
    }
})

export default router
