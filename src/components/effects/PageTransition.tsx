import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: "blur(4px)",
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(4px)",
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        window.scrollTo(0, 0)
        ScrollTrigger.refresh()
      }}
    >
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={() => {
          ScrollTrigger.refresh()
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
