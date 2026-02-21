import { useRef, useEffect } from "react"
import type { ReactNode } from "react"

interface SpotlightProps {
  children: ReactNode
  className?: string
}

export function Spotlight({ children, className = "" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = container.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      container.style.setProperty("--spotlight-x", `${x}px`)
      container.style.setProperty("--spotlight-y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(
          600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
          rgba(37, 99, 235, 0.06),
          transparent 40%
        )`,
      }}
    >
      {children}
    </div>
  )
}
