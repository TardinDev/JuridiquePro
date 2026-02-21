import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Subtle parallax on background image
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -5, scale: 1.1 },
          {
            yPercent: 5,
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background image — justice statues */}
          <div className="absolute inset-0">
            <img
              ref={imgRef}
              src="/images/law.png"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/75" />
          </div>
          <div className="noise absolute inset-0" />

          {/* Decorative orbs */}
          <div
            className="absolute -right-20 -top-20 h-80 w-80 animate-float opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(98, 122, 147, 0.4) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-60 w-60 opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(98, 122, 147, 0.3) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 px-8 py-16 text-center md:px-16 md:py-24">
            <h2 className="mx-auto max-w-3xl font-accent text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Prêt à donner vie à{" "}
              <span className="text-royal">votre projet</span> ?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
              Prenez rendez-vous pour une consultation gratuite et sans
              engagement. Nous étudions votre projet ensemble.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="group h-13 rounded-full bg-royal px-8 text-base font-semibold text-white hover:bg-royal-dark transition-all"
                >
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <a href="tel:+33600000000">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Nous appeler
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
