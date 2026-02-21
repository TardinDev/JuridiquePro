import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { MagneticButton } from "@/components/effects/MagneticButton"
import { CTA } from "@/components/sections/CTA"
import { useSEO } from "@/hooks/useSEO"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ServicesPage() {
  useSEO({
    title: "Services",
    description:
      "Découvrez nos services : création d'entreprise, auto-entrepreneur, conseils juridiques, formalités, gestion administrative et suivi.",
  })

  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-block",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-grid",
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
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            Nos Expertises
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Des services{" "}
            <span className="text-gradient-jade">sur mesure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Chaque entrepreneur est unique. Nos solutions sont adaptées à votre
            situation, vos objectifs et votre budget.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Services détaillés */}
      <section className="section-padding bg-background">
        <div className="container-custom services-grid">
          <div className="space-y-20">
            {SERVICES.map((service, i) => {
              const Icon = service.icon
              const isEven = i % 2 === 0

              return (
                <div
                  key={service.id}
                  className={`service-block flex flex-col items-center gap-12 lg:flex-row ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual */}
                  <div className="flex-1">
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-royal/5 to-jade/5 p-12 text-center">
                      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-royal/10" />
                      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-jade/10" />
                      <div className="relative">
                        <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-royal text-white">
                          <Icon className="h-10 w-10" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-foreground">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-4 font-heading text-2xl font-bold text-foreground lg:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <ul className="mb-8 space-y-3">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm text-foreground"
                        >
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-royal" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <MagneticButton className="inline-block">
                      <Link to="/contact">
                        <Button className="group rounded-full bg-gradient-to-r from-royal to-royal-dark px-6 text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all">
                          Demander un devis
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </MagneticButton>
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
