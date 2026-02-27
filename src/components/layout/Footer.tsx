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
              <span className="font-accent text-2xl font-bold text-white">
                Juridique <span className="text-royal">Pro</span>
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

            {/* Réseaux sociaux */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-all hover:bg-royal/20 hover:text-royal"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-all hover:bg-royal/20 hover:text-royal"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
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
            <Link to="/mentions-legales" className="transition-colors hover:text-white/60">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="transition-colors hover:text-white/60">Politique de confidentialité</Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-white/20">
            Développé par{" "}
            <a href="https://evoubap.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-royal transition-colors">
              evoubap.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
