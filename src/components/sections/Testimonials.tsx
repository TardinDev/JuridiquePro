import { useRef, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { TESTIMONIALS } from "@/lib/constants"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        <div className="testimonial-header mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
            Témoignages
          </span>
          <div className="mx-auto mt-3 mb-6 h-px w-12 bg-royal/40" />
          <h2 className="font-accent text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ce que disent{" "}
            <span className="text-royal">nos clients</span>
          </h2>
        </div>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {TESTIMONIALS.map((testimonial, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group h-full rounded-2xl border border-border bg-card p-8 card-glow">
                    <Quote className="mb-4 h-8 w-8 text-royal/30" />

                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      "{testimonial.content}"
                    </p>

                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-royal text-royal"
                        />
                      ))}
                    </div>

                    <div>
                      <p className="font-heading text-sm font-bold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-royal/30 hover:bg-royal hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-royal/30 hover:bg-royal hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
