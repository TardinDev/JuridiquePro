import gsap from "gsap"

export const EASE = {
  smooth: "power3.out",
  elastic: "elastic.out(1, 0.5)",
  bounce: "bounce.out",
  expo: "expo.out",
  snappy: "power4.out",
  circ: "circ.out",
} as const

export const fadeUp = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1
) => {
  return gsap.fromTo(
    element,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: EASE.smooth }
  )
}

export const fadeIn = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 0.8
) => {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: EASE.smooth }
  )
}

export const staggerUp = (
  elements: gsap.TweenTarget,
  stagger = 0.1,
  delay = 0
) => {
  return gsap.fromTo(
    elements,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger, delay, ease: EASE.smooth }
  )
}

export const scaleIn = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 0.8
) => {
  return gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration, delay, ease: EASE.snappy }
  )
}

export const slideInLeft = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1
) => {
  return gsap.fromTo(
    element,
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: EASE.smooth }
  )
}

export const slideInRight = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1
) => {
  return gsap.fromTo(
    element,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: EASE.smooth }
  )
}

export const splitTextReveal = (
  chars: gsap.TweenTarget,
  stagger = 0.03,
  delay = 0
) => {
  return gsap.fromTo(
    chars,
    { y: 80, opacity: 0, rotateX: -90 },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger,
      delay,
      ease: EASE.snappy,
    }
  )
}

export const counterAnimation = (
  element: HTMLElement,
  endValue: number,
  duration = 2,
  delay = 0
) => {
  const obj = { value: 0 }
  return gsap.to(obj, {
    value: endValue,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString()
    },
  })
}

export const clipReveal = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1.2
) => {
  return gsap.fromTo(
    element,
    { clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration,
      delay,
      ease: EASE.expo,
    }
  )
}

export const magneticHover = (
  element: HTMLElement,
  strength = 0.3
) => {
  const handleMove = (e: MouseEvent) => {
    const { left, top, width, height } = element.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * strength
    const y = (e.clientY - top - height / 2) * strength
    gsap.to(element, { x, y, duration: 0.4, ease: EASE.smooth })
  }

  const handleLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 0.6, ease: EASE.elastic })
  }

  element.addEventListener("mousemove", handleMove)
  element.addEventListener("mouseleave", handleLeave)

  return () => {
    element.removeEventListener("mousemove", handleMove)
    element.removeEventListener("mouseleave", handleLeave)
  }
}

export const parallaxScroll = (
  element: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  speed = 0.3
) => {
  return gsap.to(element, {
    yPercent: -speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  })
}

export const drawLine = (
  path: SVGPathElement,
  delay = 0,
  duration = 1.5
) => {
  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  return gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease: "power2.inOut",
  })
}
