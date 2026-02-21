import { useRef, useEffect } from "react"
import { STATS } from "@/lib/constants"
import { CountUp } from "@/components/effects/CountUp"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
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

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20">
      {/* Light grey background */}
      <div className="absolute inset-0 bg-[#E3E6EB]" />
      <div className="noise absolute inset-0" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
            Chiffres Clés
          </span>
          <div className="mx-auto mt-3 h-px w-12 bg-royal/40" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                if (el) itemsRef.current[i] = el
              }}
              className="text-center"
            >
              <div className="font-accent text-5xl font-bold text-royal md:text-6xl lg:text-7xl">
                <CountUp
                  end={parseInt(stat.value)}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground/50 md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
