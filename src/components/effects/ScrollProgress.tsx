import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    })
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-royal to-jade"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
