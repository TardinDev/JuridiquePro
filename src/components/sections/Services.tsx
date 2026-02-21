import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { SERVICES } from "@/lib/constants"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Only show first 3 services in the main expertises section
  const mainServices = SERVICES.slice(0, 3)

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
            Expertises
          </span>
          <div className="mx-auto mt-3 h-px w-12 bg-royal/40" />
        </div>

        {/* 3 cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {mainServices.map((service, i) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-royal/20 hover:shadow-lg"
              >
                {/* Steel blue top line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal/40 to-transparent" />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-royal/20 bg-royal/5 text-royal transition-colors group-hover:bg-royal/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                    {service.title}
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-royal transition-all group-hover:gap-2.5"
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
