import { useRef, useEffect } from "react"
import { PROCESS_STEPS } from "@/lib/constants"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "center center",
              scrub: 1,
            },
          }
        )
      }

      gsap.fromTo(
        stepsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-surface">
      <div className="container-custom">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-wider text-royal">
            Notre Processus
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Simple, rapide,{" "}
            <span className="text-gradient">efficace</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Quatre étapes pour concrétiser votre projet entrepreneurial en toute
            tranquillité.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            ref={lineRef}
            className="absolute left-0 right-0 top-[60px] hidden h-0.5 origin-left bg-gradient-to-r from-royal via-jade to-royal md:block"
            style={{ transform: "scaleX(0)" }}
          />

          <div className="grid gap-8 md:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  if (el) stepsRef.current[i] = el
                }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto mb-6 flex h-[120px] w-[120px] items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-royal/5" />
                  <div className="absolute inset-3 rounded-full bg-royal/10" />
                  <span className="relative font-accent text-4xl font-bold text-royal">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>

                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
