import { useRef, useEffect } from "react"
import { Check } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const APPROACH_POINTS = [
  "Une relation de confiance absolue, basée sur l'écoute et la transparence.",
  "Un suivi sécurisé et réactif de chacun de vos dossiers.",
  "Expertise exclusive en droit des affaires et création d'entreprise.",
]

export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -8, scale: 1.15 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        )
      }

      // Content reveal
      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-surface">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="aspect-[3/4]">
              <img
                ref={imgRef}
                src="/images/juridique.jpeg"
                alt="Juriste examinant des documents avec vue sur la ville"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Right: Text Content */}
          <div ref={contentRef}>
            <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
              Notre Approche
            </span>
            <div className="mb-8 h-px w-12 bg-royal/40" />

            <h2 className="font-accent text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Une relation de confiance{" "}
              <span className="text-royal">absolue.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Nous croyons que chaque entrepreneur mérite un accompagnement
              sur mesure, fondé sur la confiance et l'expertise. Notre approche
              privilégie la proximité et la réactivité pour garantir votre sérénité.
            </p>

            <div className="mt-8 space-y-4">
              {APPROACH_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="h-3 w-3 text-royal" />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
