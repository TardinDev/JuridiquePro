import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitType from "split-type"

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  delay?: number
  splitBy?: "chars" | "words" | "lines"
  trigger?: boolean
}

export function TextReveal({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
  splitBy = "chars",
  trigger = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const split = new SplitType(ref.current, { types: splitBy })
    const targets =
      splitBy === "chars"
        ? split.chars
        : splitBy === "words"
          ? split.words
          : split.lines

    if (!targets) return

    gsap.set(targets, { y: 50, opacity: 0 })

    const animation = trigger
      ? gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: splitBy === "chars" ? 0.02 : 0.08,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        })
      : gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: splitBy === "chars" ? 0.02 : 0.08,
          delay,
          ease: "power3.out",
        })

    return () => {
      animation.kill()
      split.revert()
    }
  }, [children, splitBy, delay, trigger])

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {children}
    </Tag>
  )
}
