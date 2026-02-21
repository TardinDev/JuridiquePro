import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    if (!isDesktop || !cursorRef.current || !cursorDotRef.current) return

    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    let mouseX = 0
    let mouseY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      })

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: "power3.out",
      })
    }

    const handleMouseEnterInteractive = () => {
      gsap.to(cursor, {
        scale: 2.5,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(dot, { scale: 0, duration: 0.3 })
    }

    const handleMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    window.addEventListener("mousemove", moveCursor)

    const interactives = document.querySelectorAll("a, button, [data-cursor]")
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterInteractive)
      el.addEventListener("mouseleave", handleMouseLeaveInteractive)
    })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive)
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive)
      })
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-royal/50 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal"
        style={{ willChange: "transform" }}
      />
    </>
  )
}
