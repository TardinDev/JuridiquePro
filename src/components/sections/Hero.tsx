import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Mail, Phone, MapPin, Scale, ShieldCheck, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const HERO_SLIDES = [
  { top: "Droit des sociétés", bottom: "& Création d'entreprise." },
  { top: "Contrats commerciaux", bottom: "& Protection juridique." },
  { top: "Un accompagnement", bottom: "sur mesure." },
]

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgOrbsRef = useRef<HTMLDivElement>(null)
  const firstSlideRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const imageGlowRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const slideDecoRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastSlideRef = useRef<HTMLDivElement>(null)
  const lastTextRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const accentLineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const texts = textRefs.current.filter(Boolean) as HTMLDivElement[]
      const decos = slideDecoRefs.current.filter(Boolean) as HTMLDivElement[]
      if (texts.length < 3) return

      // ── Initial states ──
      gsap.set(texts, { yPercent: 80, opacity: 0, scale: 0.92 })
      gsap.set(decos, { scaleX: 0, opacity: 0 })
      gsap.set(lastSlideRef.current, { opacity: 0 })
      gsap.set(lastTextRef.current, { xPercent: -50, opacity: 0 })
      gsap.set(cardRef.current, { xPercent: 50, opacity: 0, rotateY: 20, scale: 0.9 })
      gsap.set(ctaRef.current, { yPercent: 40, opacity: 0 })
      gsap.set(progressRef.current, { scaleX: 0 })

      // ── Floating image animation (continuous) ──
      gsap.to(imageRef.current, {
        y: -12,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })

      // ── Ambient orb movement ──
      const orbs = bgOrbsRef.current?.children
      if (orbs) {
        Array.from(orbs).forEach((orb, i) => {
          gsap.to(orb, {
            x: () => gsap.utils.random(-30, 30),
            y: () => gsap.utils.random(-20, 20),
            duration: gsap.utils.random(4, 7),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.8,
          })
        })
      }

      // ── Intro timeline ──
      const intro = gsap.timeline({ delay: 0.2 })
      const badge = firstSlideRef.current?.querySelector(".hero-badge")
      const title1 = firstSlideRef.current?.querySelector(".hero-title-1")
      const title2 = firstSlideRef.current?.querySelector(".hero-title-2")
      const desc = firstSlideRef.current?.querySelector(".hero-desc")
      const ctas = firstSlideRef.current?.querySelector(".hero-ctas")
      const features = firstSlideRef.current?.querySelectorAll(".hero-feature")
      const line = accentLineRef.current

      intro
        .fromTo(badge!, { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.4)" })
        .fromTo(line!, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.3")
        .fromTo(title1!, { y: 50, opacity: 0, clipPath: "inset(100% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power4.out" }, "-=0.5")
        .fromTo(title2!, { y: 50, opacity: 0, clipPath: "inset(100% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power4.out" }, "-=0.7")
        .fromTo(desc!, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(ctas!, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .fromTo(
          features ? Array.from(features) : [],
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.2)" },
          "-=0.3"
        )
        .fromTo(
          imageRef.current!,
          { scale: 0.7, opacity: 0, x: 80, rotateY: -10 },
          { scale: 1, opacity: 1, x: 0, rotateY: 0, duration: 1.4, ease: "expo.out" },
          "-=1"
        )
        .fromTo(
          imageGlowRef.current!,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=1"
        )
        .fromTo(scrollIndicatorRef.current!, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")

      // ══════════════════════════════════════════
      // SCROLL TIMELINE — cinematic transitions
      // ══════════════════════════════════════════
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(progressRef.current, { scaleX: self.progress })
          },
          onLeave: (self) => {
            self.disable()
            tl.progress(1).kill()
            gsap.set(progressRef.current, { scaleX: 0 })

            // Reset to slide 1 state so it's visible when scrolling back up
            gsap.set(firstSlideRef.current, { xPercent: 0, opacity: 1, scale: 1, clearProps: "filter" })
            gsap.set(imageRef.current, { xPercent: 0, opacity: 1, scale: 1, clearProps: "filter" })
            gsap.set(imageGlowRef.current, { opacity: 1, scale: 1 })
            gsap.set(accentLineRef.current, { scaleX: 1, opacity: 1 })
            gsap.set(scrollIndicatorRef.current, { opacity: 0 })
            texts.forEach(t => gsap.set(t, { opacity: 0 }))
            decos.forEach(d => gsap.set(d, { opacity: 0 }))
            gsap.set(lastSlideRef.current, { opacity: 0 })
            gsap.set(lastTextRef.current, { opacity: 0 })
            gsap.set(cardRef.current, { opacity: 0 })
            gsap.set(ctaRef.current, { opacity: 0 })
          },
        },
      })

      // ── Phase 1: Slide 1 exit (text left + image right + bg shift) ──
      tl.to(scrollIndicatorRef.current, { opacity: 0, y: -10, duration: 0.2 }, 0)

      tl.to(firstSlideRef.current, {
        xPercent: -20, opacity: 0, scale: 0.95, filter: "blur(4px)", duration: 1, ease: "power2.in",
      }, 2)
      .to(imageRef.current, {
        xPercent: 20, opacity: 0, scale: 0.9, filter: "blur(4px)", duration: 1, ease: "power2.in",
      }, 2)
      .to(imageGlowRef.current, {
        opacity: 0, scale: 1.5, duration: 0.8,
      }, 2)
      .to(accentLineRef.current, {
        scaleX: 0, opacity: 0, duration: 0.6,
      }, 2)

      // ── Phase 2: Slides 2-4 (centered text slides with cinematic transitions) ──
      texts.forEach((text, i) => {
        const enterTime = 3 + i * 3
        const exitTime = enterTime + 2.2
        const deco = decos[i]
        const lineTop = text.querySelector(".hero-line-top")
        const lineBottom = text.querySelector(".hero-line-bottom")
        const decoLine = text.querySelector(".hero-deco")

        tl.fromTo(text,
          { yPercent: 80, opacity: 0, scale: 0.92 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
          enterTime
        )

        if (lineTop) {
          tl.fromTo(lineTop,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            enterTime + 0.1
          )
        }
        if (decoLine) {
          tl.fromTo(decoLine,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
            enterTime + 0.3
          )
        }
        if (lineBottom) {
          tl.fromTo(lineBottom,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            enterTime + 0.2
          )
        }
        if (deco) {
          tl.fromTo(deco,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 0.6, duration: 0.8, ease: "power2.inOut" },
            enterTime + 0.2
          )
        }

        tl.to(text, {
          yPercent: -50, opacity: 0, scale: 1.05, filter: "blur(3px)", duration: 0.8, ease: "power2.in",
        }, exitTime)
        if (deco) {
          tl.to(deco, { scaleX: 0, opacity: 0, duration: 0.5 }, exitTime)
        }
      })

      // ── Phase 3: Slide 5 — split final (text + business card) ──
      const finalEnter = 12
      tl.to(lastSlideRef.current, {
        opacity: 1, duration: 0.4,
      }, finalEnter)
      .fromTo(lastTextRef.current,
        { xPercent: -50, opacity: 0, filter: "blur(6px)" },
        { xPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
        finalEnter
      )
      .fromTo(cardRef.current,
        { xPercent: 50, opacity: 0, rotateY: 20, scale: 0.9 },
        { xPercent: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        finalEnter + 0.2
      )
      .fromTo(ctaRef.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "back.out(1.2)" },
        finalEnter + 0.6
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#070b14]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1322] via-[#070b14] to-[#0d111e]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(98,122,147,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient orbs */}
        <div ref={bgOrbsRef} className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #627A93, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #627A93, transparent 70%)" }}
          />
          <div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
            style={{ background: "radial-gradient(circle, #8FA5B8, transparent 60%)" }}
          />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(7,11,20,0.6) 100%)" }}
        />
      </div>

      {/* ── Progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{ background: "linear-gradient(90deg, #627A93, #8FA5B8)" }}
        />
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* SLIDE 1 — Split: text left, image right   */}
      {/* ══════════════════════════════════════════ */}
      <div
        ref={firstSlideRef}
        className="absolute inset-0 z-10 flex items-center"
      >
        <div className="container-custom">
          <div className="flex items-center gap-8 lg:gap-12 xl:gap-20">
            {/* Left: text */}
            <div className="flex-1 max-w-2xl">
              <div className="hero-badge mb-6 inline-flex items-center gap-2.5 rounded-full border border-royal/25 bg-royal/[0.06] px-5 py-2.5 backdrop-blur-xl">
                <div className="h-1.5 w-1.5 rounded-full bg-royal animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-royal/90">
                  Expert en droit des entreprises
                </span>
              </div>

              {/* Accent line */}
              <div
                ref={accentLineRef}
                className="mb-5 h-[1px] w-20 origin-left"
                style={{ background: "linear-gradient(90deg, #627A93, transparent)" }}
              />

              <h1
                className="hero-title-1 font-accent font-bold leading-[1.02] tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 4.8vw, 5.2rem)" }}
              >
                Votre vision,
              </h1>
              <h1
                className="hero-title-2 font-accent font-bold leading-[1.02] tracking-tight mt-1"
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 5.2rem)",
                  background: "linear-gradient(135deg, #627A93 0%, #8FA5B8 50%, #627A93 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                notre protection juridique.
              </h1>

              <p className="hero-desc mt-7 max-w-lg text-white/45 text-base md:text-lg leading-relaxed font-body">
                Accompagnement sur mesure pour la création et la croissance de votre entreprise.
              </p>

              <div className="hero-ctas mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="group h-13 rounded-lg bg-gradient-to-r from-royal to-royal-dark px-8 text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all duration-300"
                  >
                    Consultation confidentielle
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-lg border border-white/12 bg-white/[0.03] px-8 text-base font-semibold text-white/80 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 hover:text-white transition-all duration-300"
                  >
                    Nos expertises
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: ShieldCheck, label: "Protection juridique" },
                  { icon: FileText, label: "Formalités simplifiées" },
                  { icon: Scale, label: "Droit des sociétés" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="hero-feature group flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-royal/20 hover:bg-royal/[0.04]"
                  >
                    <Icon className="h-3.5 w-3.5 text-royal/60 group-hover:text-royal/90 transition-colors" />
                    <span className="text-[13px] font-medium text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: law image */}
            <div className="hidden lg:flex flex-1 items-center justify-center" style={{ perspective: "1200px" }}>
              <div className="relative">
                {/* Glow behind image */}
                <div
                  ref={imageGlowRef}
                  className="absolute -inset-16 rounded-full"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(98,122,147,0.15) 0%, rgba(98,122,147,0.05) 40%, transparent 70%)",
                  }}
                />

                {/* Decorative ring */}
                <div className="absolute -inset-6 rounded-full border border-royal/[0.08] opacity-60" />
                <div className="absolute -inset-12 rounded-full border border-royal/[0.04] opacity-40" />

                <div ref={imageRef} className="relative z-10">
                  <img
                    src="/images/law.png"
                    alt="Justice et droit"
                    className="w-full max-w-[480px] xl:max-w-[540px] h-auto object-contain"
                    style={{
                      filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5)) drop-shadow(0 0 80px rgba(98,122,147,0.08))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* SLIDES 2–4 — Centered cinematic texts     */}
      {/* ══════════════════════════════════════════ */}
      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        <div className="w-full text-center">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              ref={(el) => { textRefs.current[i] = el }}
              className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
            >
              <div className="flex flex-col items-center gap-4 md:gap-6">
                {/* Decorative top line */}
                <div
                  ref={(el) => { slideDecoRefs.current[i] = el }}
                  className="h-[1px] w-24 md:w-32 origin-center"
                  style={{ background: "linear-gradient(90deg, transparent, #627A93, transparent)" }}
                />

                <span
                  className="hero-line-top block font-accent font-bold leading-[1.08] tracking-tight text-white"
                  style={{
                    fontSize: "clamp(2.2rem, 6vw, 7rem)",
                    textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  {slide.top}
                </span>
                <div
                  className="hero-deco h-[2px] w-12 md:w-20 rounded-full origin-center"
                  style={{ background: "linear-gradient(90deg, transparent, #627A93, transparent)" }}
                />
                <span
                  className="hero-line-bottom block font-accent font-bold leading-[1.08] tracking-tight"
                  style={{
                    fontSize: "clamp(2.2rem, 6vw, 7rem)",
                    background: "linear-gradient(135deg, #627A93, #8FA5B8, #627A93)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 4px 30px rgba(98,122,147,0.2))",
                  }}
                >
                  {slide.bottom}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* SLIDE 5 — Split layout (text + card)       */}
      {/* ══════════════════════════════════════════ */}
      <div
        ref={lastSlideRef}
        className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-16 lg:px-24 opacity-0"
      >
        <div className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div ref={lastTextRef} className="flex-1 text-center lg:text-left">
            <div className="flex flex-col gap-3 md:gap-4">
              <span
                className="block font-accent font-bold leading-[1.08] tracking-tight text-white"
                style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 5rem)",
                }}
              >
                Prenons contact,
              </span>
              <div
                className="h-[1px] w-16 md:w-24 rounded-full mx-auto lg:mx-0"
                style={{ background: "linear-gradient(90deg, #627A93, transparent)" }}
              />
              <span
                className="block font-accent font-bold leading-[1.08] tracking-tight"
                style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 5rem)",
                  background: "linear-gradient(135deg, #627A93, #8FA5B8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                construisons ensemble.
              </span>
              <p className="mt-4 max-w-md text-white/40 text-sm md:text-base leading-relaxed mx-auto lg:mx-0">
                Première consultation gratuite. Nous vous accompagnons de la création à la croissance de votre entreprise.
              </p>
            </div>
          </div>

          <div ref={cardRef} className="flex-shrink-0" style={{ perspective: "1200px" }}>
            <div
              className="relative w-[340px] md:w-[400px] rounded-2xl border border-white/[0.08] p-8 md:p-10 backdrop-blur-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(98,122,147,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(98,122,147,0.04) 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-royal/40 to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-royal/30" />
              <div className="absolute top-0 left-0 w-[1px] h-8 bg-royal/30" />
              <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-royal/30" />
              <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-royal/30" />

              <div className="mb-6">
                <span className="font-accent text-2xl font-bold text-white">
                  Juridique <span className="text-royal">Pro</span>
                </span>
              </div>

              <div className="mb-6">
                <p className="font-accent text-lg font-semibold text-white">Oyane Nze Clodia</p>
                <p className="text-sm text-royal/70 mt-0.5">Fondatrice & Experte juridique</p>
              </div>

              <div className="mb-6 h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <div className="space-y-3.5">
                {[
                  { icon: Mail, text: "contact@juridiquepro.fr" },
                  { icon: Phone, text: "+33 6 00 00 00 00" },
                  { icon: MapPin, text: "Lyon & Nice" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08]">
                      <Icon className="h-3.5 w-3.5 text-royal/70" />
                    </div>
                    <span className="text-sm text-white/60">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04]">
                <p className="text-[11px] text-white/25 tracking-widest font-medium">SIREN 999 885 171</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA buttons — last slide */}
      <div
        ref={ctaRef}
        className="absolute inset-x-0 bottom-[12%] z-20 flex flex-col items-center justify-center gap-4 px-6 sm:flex-row sm:gap-5"
      >
        <Link to="/contact">
          <Button
            size="lg"
            className="group h-14 rounded-lg bg-gradient-to-r from-royal to-royal-dark px-10 text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all duration-300"
          >
            Consultation confidentielle
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <Link to="/services">
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-lg border border-white/12 bg-white/[0.03] px-10 text-base font-semibold text-white/80 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 hover:text-white transition-all duration-300"
          >
            Découvrir nos expertises
          </Button>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">
          Découvrir
        </span>
        <div className="h-14 w-[1px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "linear-gradient(to bottom, #627A93, transparent)",
              animation: "scrollPulse 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  )
}
