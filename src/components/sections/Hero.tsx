import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Mail, Phone, MapPin, Scale, FileText, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ── Framer Motion helpers ─────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const slideIn = (dir: "left" | "right" | "top" | "bottom", delay: number, duration = 0.9) => {
  const axis = dir === "left" || dir === "right" ? "x" : "y"
  const val = dir === "left" ? -70 : dir === "right" ? 70 : dir === "top" ? -40 : 40
  return {
    initial: { [axis]: val, opacity: 0 },
    animate: { [axis]: 0, opacity: 1 },
    transition: { duration, delay, ease: EASE },
  }
}

const scaleIn = (delay: number, duration = 0.8) => ({
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration, delay, ease: EASE },
})

const lineReveal = (delay: number) => ({
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.8, delay, ease: EASE },
})


// ══════════════════════════════════════════════════════════════
export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgOrbsRef = useRef<HTMLDivElement>(null)
  const firstSlideRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const imageGlowRef = useRef<HTMLDivElement>(null)

  const lastSlideRef = useRef<HTMLDivElement>(null)
  const lastTextRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let heroCompleted = false

    const ctx = gsap.context(() => {
      // ── Initial states ──
      gsap.set(lastSlideRef.current, { opacity: 0 })
      gsap.set(lastTextRef.current, { xPercent: -50, opacity: 0 })
      gsap.set(cardRef.current, { xPercent: 50, opacity: 0, rotateY: 20, scale: 0.9 })
      gsap.set(ctaRef.current, { yPercent: 40, opacity: 0 })
      gsap.set(progressRef.current, { scaleX: 0 })

      // ── Ambient ──
      gsap.to(imageRef.current, { y: -14, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 })
      const orbs = bgOrbsRef.current?.children
      if (orbs) {
        Array.from(orbs).forEach((orb, i) => {
          gsap.to(orb, {
            x: () => gsap.utils.random(-30, 30),
            y: () => gsap.utils.random(-20, 20),
            duration: gsap.utils.random(4, 7),
            ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.8,
          })
        })
      }
      gsap.fromTo(scrollIndicatorRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.8, ease: "power3.out" })

      // ══════════════════════════════════════════
      // RESET
      // ══════════════════════════════════════════
      const resetToSlide1 = () => {
        gsap.set(firstSlideRef.current, { xPercent: 0, opacity: 1, scale: 1, clearProps: "filter" })
        gsap.set(imageRef.current, { yPercent: 0, opacity: 1, scale: 1, clearProps: "filter" })
        gsap.set(imageGlowRef.current, { opacity: 1, scale: 1 })
        gsap.set(scrollIndicatorRef.current, { opacity: 0 })

        gsap.set(lastSlideRef.current, { opacity: 0 })
        gsap.set(lastTextRef.current, { xPercent: -50, opacity: 0, clearProps: "filter" })
        gsap.set(cardRef.current, { xPercent: 50, opacity: 0, rotateY: 20, scale: 0.9 })
        gsap.set(ctaRef.current, { yPercent: 40, opacity: 0 })
      }

      // ══════════════════════════════════════════
      // SCROLL TIMELINE
      // ══════════════════════════════════════════
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=450%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (heroCompleted) { tl.progress(0); gsap.set(progressRef.current, { scaleX: 0 }); return }
            gsap.set(progressRef.current, { scaleX: self.progress })
          },
          onLeave: () => { heroCompleted = true; tl.progress(0); resetToSlide1(); gsap.set(progressRef.current, { scaleX: 0 }) },
          onEnterBack: () => { if (heroCompleted) { tl.progress(0); resetToSlide1() } },
          onLeaveBack: () => { heroCompleted = false },
        },
      })

      // Phase 0 — scroll indicator
      tl.to(scrollIndicatorRef.current, { opacity: 0, y: -10, duration: 0.2 }, 0)

      // Phase 1 — First Slide texts exits (t 0→1)
      tl.to(firstSlideRef.current, { xPercent: -20, opacity: 0, filter: "blur(4px)", duration: 1, ease: "power2.in" }, 0)

      // Phase 2 — Image slides down, glow adjusts, Second Slide enters (t 0.5→2)
      tl.to(imageGlowRef.current, { scale: 1.2, y: 120, opacity: 0.8, duration: 1.2, ease: "power2.inOut" }, 0.5)
        .to(imageRef.current, { y: 150, scale: 0.9, duration: 1.5, ease: "power2.inOut" }, 0.5)

      const slide2Ref = document.getElementById("slide2-content")
      if (slide2Ref) {
        gsap.set(slide2Ref, { y: 50, opacity: 0, filter: "blur(4px)" })
        tl.to(slide2Ref, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }, 1.0)
      }

      // Phase 3 — Second slide exits, Image finally exits (t 2.5→3.5)
      if (slide2Ref) {
        tl.to(slide2Ref, { y: -50, opacity: 0, filter: "blur(4px)", duration: 1, ease: "power2.in" }, 3)
      }
      tl.to(imageGlowRef.current, { opacity: 0, scale: 1.5, duration: 0.8 }, 3)
        .to(imageRef.current, { y: 300, opacity: 0, scale: 0.8, filter: "blur(8px)", duration: 1, ease: "power2.in" }, 3)

      // Phase 4 — Final slide enters (t 4)
      const fin = 4
      tl.to(lastSlideRef.current, { opacity: 1, duration: 0.4 }, fin)
        .fromTo(lastTextRef.current,
          { xPercent: -50, opacity: 0, filter: "blur(6px)" },
          { xPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
          fin
        )
        .fromTo(cardRef.current,
          { xPercent: 50, opacity: 0, rotateY: 20, scale: 0.9 },
          { xPercent: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.4, ease: "power3.out" },
          fin + 0.2
        )
        .fromTo(ctaRef.current,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "back.out(1.2)" },
          fin + 0.6
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#070b14]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1322] via-[#070b14] to-[#0d111e]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(98,122,147,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div ref={bgOrbsRef} className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #627A93, transparent 70%)" }} />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #627A93, transparent 70%)" }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]" style={{ background: "radial-gradient(circle, #8FA5B8, transparent 60%)" }} />
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(7,11,20,0.6) 100%)" }} />
      </div>

      {/* ── Progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div ref={progressRef} className="h-full origin-left" style={{ background: "linear-gradient(90deg, #627A93, #8FA5B8)" }} />
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* PERSISTENT SPLIT LAYOUT                    */}
      {/* ══════════════════════════════════════════ */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container-custom">
          <div className="flex items-center gap-8 lg:gap-12 xl:gap-20">
            {/* Left Column: Changing Texts */}
            <div className="flex-1 relative h-[500px] flex items-center">

              {/* SLIDE 1 TEXT */}
              <div ref={firstSlideRef} className="absolute inset-0 flex flex-col justify-center">
                <motion.div
                  {...slideIn("top", 0.2, 0.8)}
                  className="hero-badge mb-8 inline-flex items-center gap-3 rounded-full border border-royal/25 bg-royal/[0.06] px-6 py-3 backdrop-blur-xl w-fit"
                >
                  <div className="h-2 w-2 rounded-full bg-royal animate-pulse" />
                  <span className="text-xs lg:text-sm font-semibold uppercase tracking-[0.3em] text-royal/90">
                    Sociétés & Micro-entreprises
                  </span>
                </motion.div>

                <motion.div
                  {...lineReveal(0.4)}
                  className="mb-6 h-[1px] w-24"
                  style={{ background: "linear-gradient(90deg, #627A93, transparent)" }}
                />

                <motion.h1
                  {...slideIn("left", 0.3, 1)}
                  className="font-accent font-bold leading-[1.05] tracking-tight text-white mb-2"
                  style={{ fontSize: "clamp(3rem, 5.5vw, 6.5rem)" }}
                >
                  Votre vision,
                </motion.h1>
                <motion.h1
                  {...slideIn("left", 0.5, 1)}
                  className="font-accent font-bold leading-[1.05] tracking-tight"
                  style={{
                    fontSize: "clamp(3rem, 5.5vw, 6.5rem)",
                    background: "linear-gradient(135deg, #627A93 0%, #8FA5B8 50%, #627A93 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  notre protection juridique.
                </motion.h1>

                <motion.p
                  {...slideIn("bottom", 0.7, 0.9)}
                  className="mt-8 max-w-xl text-white/50 text-lg md:text-xl leading-relaxed font-body"
                >
                  Création de société ou immatriculation de micro-entreprise — nous prenons en charge toutes vos formalités juridiques, de A à Z.
                </motion.p>

                <motion.div
                  {...slideIn("bottom", 0.85, 0.9)}
                  className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4"
                >
                  <Link to="/contact">
                    <Button size="lg" className="group h-13 rounded-lg bg-gradient-to-r from-royal to-royal-dark px-8 text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all duration-300">
                      Consultation confidentielle
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button size="lg" variant="outline" className="h-13 rounded-lg border border-white/12 bg-white/[0.03] px-8 text-base font-semibold text-white/80 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 hover:text-white transition-all duration-300">
                      Nos expertises
                    </Button>
                  </Link>
                </motion.div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    { icon: FileText, label: "Création de société" },
                    { icon: Users, label: "Micro-entreprise & INPI" },
                    { icon: Scale, label: "Droit des sociétés" },
                  ].map(({ icon: Icon, label }, i) => (
                    <motion.div
                      key={label}
                      {...slideIn("bottom", 1 + i * 0.1, 0.7)}
                      className="group flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-royal/20 hover:bg-royal/[0.04]"
                    >
                      <Icon className="h-3.5 w-3.5 text-royal/60 group-hover:text-royal/90 transition-colors" />
                      <span className="text-[13px] font-medium text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* SLIDE 2 TEXT */}
              <div id="slide2-content" className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center justify-center p-4 rounded-xl bg-royal/[0.08] border border-royal/20 mb-8">
                    <BookOpen className="h-8 w-8 text-royal" />
                  </div>
                  <h2 className="font-accent text-4xl md:text-6xl lg:text-[4.5rem] font-bold text-white mb-8 leading-[1.1]">
                    Création <br />
                    <span className="text-royal block mt-2">d'entreprise</span>
                  </h2>
                  <p className="text-white/50 text-lg md:text-xl xl:text-2xl mb-10 leading-relaxed max-w-xl">
                    Nous vous accompagnons pas à pas dans le choix du statut juridique, la rédaction de vos statuts, et l'intégralité des formalités d'immatriculation pour lancer votre projet en toute sérénité.
                  </p>
                  <ul className="space-y-5">
                    {[
                      "Choix de la forme sociale adaptée (SAS, SARL, SCI...)",
                      "Rédaction sur-mesure de vos statuts",
                      "Formalités INPI, Greffe et publications légales"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-5 p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                        <div className="h-2.5 w-2.5 rounded-full bg-royal mt-2" style={{ boxShadow: "0 0 12px rgba(184,134,11,0.5)" }} />
                        <span className="text-white/80 text-lg lg:text-xl font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Persistent Image that slides later */}
            <motion.div
              {...slideIn("right", 0.4, 1.3)}
              className="hidden lg:flex flex-1 items-center justify-center pointer-events-none"
              style={{ perspective: "1200px" }}
            >
              <div className="relative w-full flex items-center justify-center">
                <motion.div
                  {...scaleIn(0.7, 1.2)}
                  ref={imageGlowRef}
                  className="absolute -inset-24 rounded-full"
                  style={{ background: "radial-gradient(ellipse at center, rgba(98,122,147,0.15) 0%, rgba(98,122,147,0.05) 40%, transparent 70%)" }}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ duration: 1, delay: 0.9, ease: EASE }}
                  className="absolute -inset-10 rounded-full border border-royal/[0.08]"
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.4 }}
                  transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
                  className="absolute -inset-20 rounded-full border border-royal/[0.04]"
                />
                <div ref={imageRef} className="relative z-10 will-change-transform w-full flex justify-center lg:justify-end pr-0 lg:-mr-32 xl:-mr-48">
                  <img src="/images/law.png" alt="Justice et droit" className="w-[120%] max-w-[850px] xl:max-w-[1200px] h-auto object-contain" style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6)) drop-shadow(0 0 100px rgba(98,122,147,0.12))" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>



      {/* ══════════════════════════════════════════ */}
      {/* FINAL SLIDE — Split layout (text + card)   */}
      {/* ══════════════════════════════════════════ */}
      <div ref={lastSlideRef} className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-16 lg:px-24 opacity-0">
        <div className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div ref={lastTextRef} className="flex-1 text-center lg:text-left">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="mx-auto lg:mx-0 flex h-12 w-12 items-center justify-center rounded-xl border border-royal/20 bg-royal/[0.08] mb-2">
                <BookOpen className="h-5 w-5 text-royal" />
              </div>
              <span className="block font-accent font-bold leading-[1.08] tracking-tight text-white" style={{ fontSize: "clamp(1.8rem, 4.5vw, 5rem)" }}>
                Prenons contact,
              </span>
              <div className="h-[1px] w-16 md:w-24 rounded-full mx-auto lg:mx-0" style={{ background: "linear-gradient(90deg, #627A93, transparent)" }} />
              <span
                className="block font-accent font-bold leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 5rem)", background: "linear-gradient(135deg, #627A93, #8FA5B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                construisons ensemble.
              </span>
              <p className="mt-4 max-w-md text-white/40 text-sm md:text-base leading-relaxed mx-auto lg:mx-0">
                Que vous lanciez une société ou une micro-entreprise, première consultation gratuite et sans engagement. Nous identifions vos besoins et vous proposons un plan d'action clair.
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
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-royal/40 to-transparent" />
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-royal/30" />
              <div className="absolute top-0 left-0 w-[1px] h-8 bg-royal/30" />
              <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-royal/30" />
              <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-royal/30" />

              <div className="mb-6">
                <span className="font-accent text-2xl font-bold text-white">Juridique <span className="text-royal">Pro</span></span>
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

      {/* CTA — last slide */}
      <div ref={ctaRef} className="absolute inset-x-0 bottom-[12%] z-20 flex flex-col items-center justify-center gap-4 px-6 sm:flex-row sm:gap-5">
        <Link to="/contact">
          <Button size="lg" className="group h-14 rounded-lg bg-gradient-to-r from-royal to-royal-dark px-10 text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all duration-300">
            Consultation confidentielle
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/services">
          <Button size="lg" variant="outline" className="h-14 rounded-lg border border-white/12 bg-white/[0.03] px-10 text-base font-semibold text-white/80 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 hover:text-white transition-all duration-300">
            Découvrir nos expertises
          </Button>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">Découvrir</span>
        <div className="h-14 w-[1px] rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full rounded-full" style={{ background: "linear-gradient(to bottom, #627A93, transparent)", animation: "scrollPulse 2.4s ease-in-out infinite" }} />
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
