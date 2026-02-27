import { Badge } from "@/components/ui/badge"
import { useSEO } from "@/hooks/useSEO"
import { COMPANY } from "@/lib/constants"

export default function PolitiqueConfidentialite() {
  useSEO({
    title: "Politique de confidentialité",
    description:
      "Politique de confidentialité et protection des données personnelles — Juridique Pro",
  })

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            RGPD
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Politique de confidentialité
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-foreground [&_a]:text-royal [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">

            <p>
              Dernière mise à jour : Février 2026
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est :<br />
              <strong>{COMPANY.fullName}</strong><br />
              Email : <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />
              Téléphone : {COMPANY.phone}
            </p>

            <h2>2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul>
              <li><strong>Formulaire de contact :</strong> nom, email, téléphone (optionnel), sujet et message</li>
              <li><strong>Création de compte :</strong> nom complet, adresse email, mot de passe (stocké de manière chiffrée)</li>
              <li><strong>Témoignages :</strong> nom, rôle/entreprise, contenu du témoignage, note</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (via cookies analytiques, si activés)</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>Vos données personnelles sont collectées pour les finalités suivantes :</p>
            <ul>
              <li>Répondre à vos demandes de contact et de consultation</li>
              <li>Gérer votre compte utilisateur</li>
              <li>Publier vos témoignages (après modération et avec votre consentement)</li>
              <li>Améliorer nos services et l'expérience utilisateur</li>
              <li>Vous envoyer des communications relatives à nos services (avec votre accord)</li>
            </ul>

            <h2>4. Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>Votre consentement</strong> (formulaire de contact, création de compte, témoignages)</li>
              <li><strong>L'intérêt légitime</strong> de {COMPANY.fullName} (amélioration des services, sécurité du site)</li>
              <li><strong>L'exécution d'un contrat</strong> (prestation de services juridiques)</li>
            </ul>

            <h2>5. Durée de conservation</h2>
            <ul>
              <li><strong>Données de contact :</strong> 3 ans à compter du dernier échange</li>
              <li><strong>Comptes utilisateurs :</strong> durée de vie du compte + 3 ans après suppression</li>
              <li><strong>Témoignages :</strong> durée de publication + 1 an après retrait</li>
              <li><strong>Données de navigation :</strong> 13 mois maximum</li>
            </ul>

            <h2>6. Destinataires des données</h2>
            <p>
              Vos données personnelles sont traitées uniquement par {COMPANY.fullName}
              et ne sont transmises à aucun tiers à des fins commerciales.
              Elles peuvent être communiquées aux prestataires techniques suivants,
              strictement dans le cadre de l'hébergement et du fonctionnement du site :
            </p>
            <ul>
              <li><strong>Vercel Inc.</strong> — hébergement du site web</li>
              <li><strong>Render</strong> — hébergement du serveur applicatif</li>
              <li><strong>Resend</strong> — envoi d'emails transactionnels</li>
            </ul>

            <h2>7. Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD)
              et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la
              CNIL (Commission Nationale de l'Informatique et des Libertés) :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>

            <h2>8. Cookies</h2>
            <p>
              Le site utilise des cookies strictement nécessaires au fonctionnement du site
              (authentification, préférences). Des cookies analytiques peuvent être utilisés
              pour mesurer l'audience du site, sous réserve de votre consentement.
            </p>

            <h2>9. Sécurité</h2>
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles appropriées
              pour protéger vos données personnelles contre tout accès non autorisé,
              altération, divulgation ou destruction. Les mots de passe sont stockés
              de manière chiffrée (bcrypt) et les communications sont sécurisées par HTTPS.
            </p>

            <h2>10. Modification de la politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité
              à tout moment. Toute modification sera publiée sur cette page avec une
              date de mise à jour révisée.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
