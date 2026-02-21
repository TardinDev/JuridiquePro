import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function CountUp({
  end,
  suffix = "",
  duration = 2,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!ref.current || hasAnimated) return

    const obj = { value: 0 }

    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        setHasAnimated(true)
        gsap.to(obj, {
          value: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.round(obj.value) + suffix
            }
          },
        })
      },
    })
  }, [end, suffix, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
