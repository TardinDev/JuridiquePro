import { useRef, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PRICING_CATEGORIES,
  COMPLEMENTARY_SERVICES,
  type PricingCategory,
} from "@/lib/constants"
import { CTA } from "@/components/sections/CTA"
import { useSEO } from "@/hooks/useSEO"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function PricingSection({ category }: { category: PricingCategory }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-card-" + category.id,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [category.id])

  const Icon = category.icon

  return (
    <div ref={sectionRef} className="py-16 first:pt-0">
      {/* Section header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-royal/20 bg-royal/5 text-royal">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {category.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{category.subtitle}</p>
        {category.adminFees && (
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <Info className="h-4 w-4 shrink-0" />
            {category.adminFees}
          </div>
        )}
      </div>

      {/* Pricing cards */}
      <div
        className={`mx-auto grid gap-6 ${
          category.plans.length === 3
            ? "max-w-5xl md:grid-cols-3"
            : category.plans.length === 2
            ? "max-w-3xl md:grid-cols-2"
            : "max-w-md"
        }`}
      >
        {category.plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card-${category.id} relative flex flex-col overflow-hidden rounded-2xl border ${
              plan.highlighted
                ? "border-royal shadow-lg shadow-royal/10 ring-1 ring-royal/20"
                : "border-border"
            } bg-card p-6 transition-all duration-300 hover:shadow-lg`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -right-8 top-5 rotate-45 bg-gradient-to-r from-royal to-royal-dark px-10 py-1 text-xs font-semibold text-white shadow-sm">
                {plan.badge}
              </div>
            )}

            {/* Top gradient line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                plan.highlighted
                  ? "bg-gradient-to-r from-royal to-royal-dark"
                  : "bg-gradient-to-r from-transparent via-royal/30 to-transparent"
              }`}
            />

            {/* Plan name */}
            <h3 className="font-heading text-lg font-bold text-foreground">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.description}
            </p>

            {/* Price */}
            <div className="mt-5 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-lg font-semibold text-foreground">€</span>
                {plan.suffix && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    {plan.suffix}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px bg-border" />

            {/* Features */}
            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link to="/contact" className="mt-auto">
              <Button
                className={`w-full rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-royal to-royal-dark text-white shadow-md shadow-royal/20 hover:shadow-lg hover:shadow-royal/30"
                    : "border border-royal/30 bg-royal/5 text-royal hover:bg-royal/10"
                }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TarifsPage() {
  useSEO({
    title: "Tarifs — Création d'entreprise dès 0€ HT",
    description:
      "Tarifs Juridique Pro : création société dès 0€ HT, micro-entreprise 59€ HT, changement dirigeant 59€ HT, domiciliation 19€/mois, comptabilité 39€/mois. Forfaits transparents sans frais cachés.",
    canonical: "/tarifs",
  })

  const [activeTab, setActiveTab] = useState(PRICING_CATEGORIES[0].id)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".complementary-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".complementary-grid",
            start: "top 80%",
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-32 pb-20"
      >
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge
            variant="secondary"
            className="mb-6 border-border bg-card text-muted-foreground"
          >
            Tarifs transparents
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Des forfaits{" "}
            <span className="text-gradient-jade">clairs et accessibles</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Choisissez la formule adaptée à vos besoins. Tous nos prix sont
            transparents, sans surprise ni frais cachés.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Tabs */}
      <section className="bg-background">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-4">
            {PRICING_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === cat.id
                      ? "bg-royal text-white shadow-md shadow-royal/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <CatIcon className="h-4 w-4" />
                  {cat.title}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Active pricing section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {PRICING_CATEGORIES.filter((cat) => cat.id === activeTab).map(
            (cat) => (
              <PricingSection key={cat.id} category={cat} />
            )
          )}
        </div>
      </section>

      {/* Comparaison avocat */}
      <section className="bg-surface py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Pourquoi choisir Juridique Pro ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Comparez nos tarifs avec les alternatives traditionnelles
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Service
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-royal">
                    Juridique Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                    Avocat
                  </th>
                  <th className="hidden px-6 py-4 text-center text-sm font-semibold text-muted-foreground sm:table-cell">
                    Expert-comptable
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    service: "Création de société",
                    us: "Dès 0 € HT",
                    avocat: "> 1 200 €",
                    expert: "> 800 €",
                  },
                  {
                    service: "Micro-entreprise",
                    us: "Dès 59 € HT",
                    avocat: "> 500 €",
                    expert: "> 300 €",
                  },
                  {
                    service: "Modification de statuts",
                    us: "Dès 59 € HT",
                    avocat: "> 600 €",
                    expert: "> 400 €",
                  },
                  {
                    service: "Domiciliation",
                    us: "Dès 19 € HT/mois",
                    avocat: "Non proposé",
                    expert: "Non proposé",
                  },
                  {
                    service: "Comptabilité",
                    us: "Dès 39 € HT/mois",
                    avocat: "Non proposé",
                    expert: "> 150 €/mois",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.service}
                    className={i % 2 === 0 ? "" : "bg-muted/20"}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {row.service}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-royal">
                      {row.us}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {row.avocat}
                    </td>
                    <td className="hidden px-6 py-4 text-center text-sm text-muted-foreground sm:table-cell">
                      {row.expert}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Services complémentaires */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Services complémentaires
            </h2>
            <p className="mt-4 text-muted-foreground">
              Des prestations à la carte pour compléter vos démarches
            </p>
          </div>

          <div className="complementary-grid mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLEMENTARY_SERVICES.map((service) => {
              const SIcon = service.icon
              return (
                <div
                  key={service.title}
                  className="complementary-card flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-royal/20 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-royal/20 bg-royal/5 text-royal">
                    <SIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {service.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dès{" "}
                      <span className="font-semibold text-royal">
                        {service.price} €
                      </span>{" "}
                      {service.suffix}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
