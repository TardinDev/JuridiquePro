import { useRef, useEffect } from "react"
import { MapPin } from "lucide-react"
import { LOCATIONS } from "@/lib/constants"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const LOCATION_IMAGES = ["/images/lyon.jpg", "/images/nice.jpg"]

export function Locations() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const imgRefs = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards staggered reveal
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      )

      // Image parallax with scrub
      imgRefs.current.forEach((img) => {
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-wider text-royal">
            Nos Implantations
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Présents là où{" "}
            <span className="text-gradient">vous êtes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Deux bureaux pour vous accompagner au plus près, partout en France.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {LOCATIONS.map((location, i) => (
            <div
              key={location.city}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 card-glow"
            >
              {/* City image with parallax */}
              <div className="h-48 overflow-hidden">
                <img
                  ref={(el) => {
                    if (el) imgRefs.current[i] = el
                  }}
                  src={LOCATION_IMAGES[i]}
                  alt={location.city}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Gradient accent bar */}
              <div className="h-1 bg-gradient-to-r from-royal to-jade" />

              <div className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-royal/10 text-royal">
                  <MapPin className="h-6 w-6" />
                </div>

                <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
                  {location.city}
                </h3>

                <p className="mb-4 text-sm font-medium text-royal">
                  {location.description}
                </p>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{location.address}</p>
                  <p>{location.postalCode}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
