import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"
import { COMPANY, NAV_LINKS, LOCATIONS } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] text-white/80">
      <div className="container-custom section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="mb-6 inline-block">
              <span className="font-accent text-3xl font-bold text-white">
                L<span className="text-royal">C</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {COMPANY.description}
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-royal"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Nos Bureaux
            </h4>
            <ul className="space-y-4">
              {LOCATIONS.map((loc) => (
                <li key={loc.city} className="flex items-start gap-2 text-sm text-white/50">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                  <div>
                    <p className="font-medium text-white/70">{loc.city}</p>
                    <p>{loc.address}</p>
                    <p>{loc.postalCode}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-royal"
                >
                  <Mail className="h-4 w-4" />
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-royal"
                >
                  <Phone className="h-4 w-4" />
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/30 md:flex-row">
          <p>&copy; {currentYear} {COMPANY.name}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <span>SIREN : {COMPANY.siren}</span>
            <span>APE : {COMPANY.ape}</span>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="transition-colors hover:text-white/60">Mentions légales</Link>
            <Link to="#" className="transition-colors hover:text-white/60">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
