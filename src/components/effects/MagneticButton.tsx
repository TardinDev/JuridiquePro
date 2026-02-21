import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || !ref.current) return

    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * strength
    const y = (e.clientY - top - height / 2) * strength

    gsap.to(ref.current, {
      x,
      y,
      duration: 0.4,
      ease: "power3.out",
    })
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
