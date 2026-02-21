import { useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Target, Eye, Handshake } from "lucide-react"
import { Stats } from "@/components/sections/Stats"
import { CTA } from "@/components/sections/CTA"
import { useSEO } from "@/hooks/useSEO"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    icon: Target,
    title: "Mission",
    description:
      "Rendre accessible à tous les entrepreneurs les formalités juridiques et administratives, en offrant un service expert, humain et personnalisé.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "Devenir la référence de l'accompagnement juridique pour les créateurs d'entreprise en France, reconnue pour son excellence et son accessibilité.",
  },
  {
    icon: Handshake,
    title: "Valeurs",
    description:
      "Intégrité, transparence et engagement. Chaque client est un partenaire que nous accompagnons avec la même exigence et le même dévouement.",
  },
]

export default function About() {
  useSEO({
    title: "À propos",
    description:
      "Découvrez Clodia Oyane Nze, fondatrice de Juridique Pro, experte en formalités juridiques et création d'entreprises.",
  })

  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-story",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )

      gsap.fromTo(
        valuesRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".values-grid",
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
            Notre Histoire
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            L'expertise au service{" "}
            <span className="text-gradient-jade">de votre réussite</span>
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Story */}
      <section ref={storyRef} className="section-padding bg-background">
        <div className="container-custom">
          <div className="about-story mx-auto max-w-3xl">
            <div className="grid gap-12 md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-royal/10 to-jade/10 p-8">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-royal/20" />
                  <div className="relative text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-royal/10 text-4xl font-bold text-royal font-accent">
                      C
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Clodia Oyane Nze
                    </h3>
                    <p className="text-sm text-royal font-medium">
                      Fondatrice & Experte
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground lg:text-3xl">
                  Une passion pour l'accompagnement entrepreneurial
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Forte d'une expertise approfondie en formalités juridiques et en
                    création d'entreprises, <strong className="text-foreground">Clodia Oyane Nze</strong> a
                    fondé Juridique Pro avec une conviction : chaque entrepreneur
                    mérite un accompagnement de qualité, accessible et humain.
                  </p>
                  <p>
                    Basée à Lyon et Nice, Juridique Pro intervient sur tout le
                    territoire français pour accompagner les porteurs de projets
                    dans toutes les étapes de la vie de leur entreprise.
                  </p>
                  <p>
                    De l'immatriculation d'auto-entrepreneurs aux conseils
                    juridiques avancés, chaque dossier est traité avec la même
                    rigueur et le même engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-3xl" />

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-wider text-royal">
              Ce qui nous anime
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Mission, Vision, Valeurs
            </h2>
          </div>

          <div className="values-grid mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  ref={(el) => {
                    if (el) valuesRef.current[i] = el
                  }}
                  className="rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-royal/20 hover:shadow-lg"
                >
                  <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 text-royal">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Stats />
      <CTA />
    </>
  )
}
