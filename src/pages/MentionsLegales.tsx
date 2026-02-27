import { Badge } from "@/components/ui/badge"
import { useSEO } from "@/hooks/useSEO"
import { COMPANY, LOCATIONS } from "@/lib/constants"

export default function MentionsLegales() {
  useSEO({
    title: "Mentions légales",
    description: "Mentions légales du site Juridique Pro — projuridique.com",
  })

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            Informations légales
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Mentions légales
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none space-y-8 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-foreground [&_a]:text-royal [&_a:hover]:underline">

            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>projuridique.com</strong> est édité par :<br />
              <strong>{COMPANY.fullName}</strong><br />
              Entreprise individuelle<br />
              SIREN : {COMPANY.siren}<br />
              SIRET : {COMPANY.siret}<br />
              Code APE : {COMPANY.ape}<br />
              Siège social : {LOCATIONS[0].address}, {LOCATIONS[0].postalCode}
            </p>
            <p>
              Email : <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />
              Téléphone : <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>
            </p>

            <h2>2. Directeur de la publication</h2>
            <p>
              La directrice de la publication est <strong>{COMPANY.fullName}</strong>.
            </p>

            <h2>3. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, etc.)
              est la propriété exclusive de {COMPANY.fullName}, sauf mentions contraires.
              Toute reproduction, représentation, modification, publication ou adaptation de
              tout ou partie des éléments du site est interdite sans autorisation écrite préalable.
            </p>

            <h2>5. Limitation de responsabilité</h2>
            <p>
              Les informations fournies sur ce site le sont à titre indicatif et ne sauraient
              constituer un conseil juridique personnalisé. {COMPANY.fullName} ne saurait être
              tenue responsable de l'utilisation qui pourrait être faite de ces informations
              ni des dommages directs ou indirects qui pourraient en résulter.
            </p>

            <h2>6. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers d'autres sites internet.
              {COMPANY.fullName} n'exerce aucun contrôle sur ces sites et décline
              toute responsabilité quant à leur contenu.
            </p>

            <h2>7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez
              nous contacter à l'adresse : <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
