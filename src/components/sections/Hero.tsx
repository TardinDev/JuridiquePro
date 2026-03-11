import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Mail, MapPin, Scale, FileText, Users, BookOpen, } from "lucide-react"
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

const slideInView = (dir: "left" | "right" | "top" | "bottom", delay: number, duration = 1) => {
  const axis = dir === "left" || dir === "right" ? "x" : "y"
  const val = dir === "left" ? -80 : dir === "right" ? 80 : dir === "top" ? -50 : 50
  return {
    initial: { [axis]: val, opacity: 0 },
    whileInView: { [axis]: 0, opacity: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration, delay, ease: EASE },
  }
}

// ══════════════════════════════════════════════════════════════
export function Hero() {
  const bgOrbsRef = useRef<HTMLDivElement>(null)
  const themesRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
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
  }, [])

  // ScrollTrigger pour les 3 cartes
  useEffect(() => {
    if (!themesRef.current || cardsRef.current.length === 0) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean)

      // Chaque carte glisse depuis la gauche avec décalage progressif
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { x: -200, opacity: 0, scale: 0.92, rotateY: 8 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.6,
            },
          }
        )
      })
    }, themesRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative bg-[#070b14]">
      {/* ── Background (shared across both sections) ── */}
      <div className="absolute inset-0">
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


      {/* HERO — Texte + Image */}

      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12 xl:gap-20">
            {/* Left — Text */}
            <div className="flex-1 pl-4 lg:pl-8">
              <motion.div
                {...slideIn("top", 0.2, 0.8)}
                className="hero-badge mb-6 inline-flex items-center gap-2.5 rounded-full border border-royal/25 bg-royal/[0.06] px-5 py-2.5 backdrop-blur-xl w-fit"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-royal animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-royal/90">
                  Sociétés & Micro-entreprises
                </span>
              </motion.div>

              <motion.div
                {...lineReveal(0.4)}
                className="mb-5 h-[1px] w-20"
                style={{ background: "linear-gradient(90deg, #627A93, transparent)" }}
              />

              <motion.div {...slideIn("left", 0.3, 1)}>
                <h1 className="font-accent font-bold leading-[1.05] tracking-tight text-white" style={{ fontSize: "clamp(2.4rem, 4.8vw, 5.2rem)" }}>
                  Votre vision,
                </h1>
                <h1
                  className="font-accent font-bold leading-[1.05] tracking-tight"
                  style={{
                    fontSize: "clamp(2.4rem, 4.8vw, 5.2rem)",
                    background: "linear-gradient(135deg, #627A93 0%, #8FA5B8 50%, #627A93 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  notre protection
                </h1>
                <h1
                  className="font-accent font-bold leading-[1.05] tracking-tight"
                  style={{
                    fontSize: "clamp(2.4rem, 4.8vw, 5.2rem)",
                    background: "linear-gradient(135deg, #627A93 0%, #8FA5B8 50%, #627A93 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  juridique.
                </h1>
              </motion.div>

              <motion.p
                {...slideIn("bottom", 0.7, 0.9)}
                className="mt-7 max-w-lg text-white/45 text-base md:text-lg leading-relaxed font-body"
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

            {/* Right — Image */}
            <motion.div
              {...slideIn("right", 0.4, 1.3)}
              className="hidden lg:flex flex-1 items-center justify-center pointer-events-none"
              style={{ perspective: "1200px" }}
            >
              <div className="relative w-full flex items-center justify-center">
                <motion.div
                  {...scaleIn(0.7, 1.2)}
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
                <motion.div
                  className="relative z-10"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src="/images/law.png" alt="Justice et droit" className="w-full max-w-[480px] xl:max-w-[540px] h-auto object-contain" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5)) drop-shadow(0 0 80px rgba(98,122,147,0.08))" }} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* 3 THÈMES — Ce que nous faisons              */}
      {/* ══════════════════════════════════════════ */}
      <section ref={themesRef} className="relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
            {/* Left — Titre sticky */}
            <div className="lg:w-[40%] py-24 md:py-32">
              <div className="lg:sticky lg:top-[30vh]">
                <motion.span {...slideInView("top", 0, 0.9)} className="text-[11px] font-semibold uppercase tracking-[0.35em] text-royal/60">
                  Nos expertises
                </motion.span>
                <motion.h2 {...slideInView("left", 0.1, 1)} className="mt-4 font-accent font-bold text-white leading-[1.1]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                  Tout pour lancer et<br />
                  <span className="text-royal">sécuriser votre entreprise.</span>
                </motion.h2>
                <motion.div {...slideInView("left", 0.2, 0.8)} className="mt-6 h-[1px] w-20" style={{ background: "linear-gradient(90deg, #627A93, transparent)" }} />
              </div>
            </div>

            {/* Right — Cartes qui apparaissent au scroll depuis la gauche */}
            <div className="lg:w-[60%] flex flex-col gap-8 lg:gap-10 py-24 md:py-32" style={{ perspective: "1000px" }}>
              {/* Thème 1 — Création */}
              <div
                ref={(el) => { if (el) cardsRef.current[0] = el }}
                className="opacity-0 group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-[border-color,background-color] duration-500 hover:border-royal/20 hover:bg-royal/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal/[0.08] border border-royal/20 mb-6">
                  <FileText className="h-5 w-5 text-royal" />
                </div>
                <h3 className="font-accent text-xl lg:text-2xl font-bold text-white mb-3">Création d'entreprise</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  De la rédaction des statuts à l'immatriculation définitive, nous créons votre structure clé en main.
                </p>
                <ul className="space-y-3">
                  {[
                    "SARL, SAS, SASU, SCI",
                    "Rédaction des statuts sur mesure",
                    "Dépôt du capital & immatriculation",
                    "Publication d'annonce légale",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-royal/50 flex-shrink-0" />
                      <span className="text-white/55 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thème 2 — Micro-entreprise */}
              <div
                ref={(el) => { if (el) cardsRef.current[1] = el }}
                className="opacity-0 group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-[border-color,background-color] duration-500 hover:border-royal/20 hover:bg-royal/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal/[0.08] border border-royal/20 mb-6">
                  <Users className="h-5 w-5 text-royal" />
                </div>
                <h3 className="font-accent text-xl lg:text-2xl font-bold text-white mb-3">Micro-entreprise & INPI</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Toutes les formalités liées à votre entreprise individuelle sur le guichet unique INPI.
                </p>
                <ul className="space-y-3">
                  {[
                    "Immatriculation sur l'INPI",
                    "Modification d'activité",
                    "Cessation d'activité",
                    "Conseil URSSAF & optimisation",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-royal/50 flex-shrink-0" />
                      <span className="text-white/55 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thème 3 — Droit des sociétés */}
              <div
                ref={(el) => { if (el) cardsRef.current[2] = el }}
                className="opacity-0 group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-[border-color,background-color] duration-500 hover:border-royal/20 hover:bg-royal/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal/[0.08] border border-royal/20 mb-6">
                  <Scale className="h-5 w-5 text-royal" />
                </div>
                <h3 className="font-accent text-xl lg:text-2xl font-bold text-white mb-3">Droit des sociétés</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Expertise juridique pour sécuriser chaque étape de la vie de votre société.
                </p>
                <ul className="space-y-3">
                  {[
                    "Modification de statuts",
                    "Transfert de siège social",
                    "Cession de parts & actions",
                    "Changement de dirigeant",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-royal/50 flex-shrink-0" />
                      <span className="text-white/55 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* PRENONS CONTACT — apparaît au scroll       */}

      <section className="relative z-10 py-24 md:py-32 lg:py-40">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
          <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col gap-3 md:gap-4">
                <motion.div {...slideInView("top", 0, 0.9)} className="mx-auto lg:mx-0 flex h-12 w-12 items-center justify-center rounded-xl border border-royal/20 bg-royal/[0.08] mb-2">
                  <BookOpen className="h-5 w-5 text-royal" />
                </motion.div>
                <motion.span {...slideInView("left", 0.1, 1)} className="block font-accent font-bold leading-[1.08] tracking-tight text-white" style={{ fontSize: "clamp(1.8rem, 4.5vw, 5rem)" }}>
                  Prenons contact,
                </motion.span>
                <motion.div {...slideInView("left", 0.2, 0.9)} className="h-[1px] w-16 md:w-24 rounded-full mx-auto lg:mx-0" style={{ background: "linear-gradient(90deg, #627A93, transparent)" }} />
                <motion.span
                  {...slideInView("right", 0.25, 1)}
                  className="block font-accent font-bold leading-[1.08] tracking-tight"
                  style={{ fontSize: "clamp(1.8rem, 4.5vw, 5rem)", background: "linear-gradient(135deg, #627A93, #8FA5B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  construisons ensemble.
                </motion.span>
                <motion.p {...slideInView("bottom", 0.3, 0.9)} className="mt-4 max-w-md text-white/40 text-sm md:text-base leading-relaxed mx-auto lg:mx-0">
                  Que vous lanciez une société ou une micro-entreprise, première consultation gratuite et sans engagement. Nous identifions vos besoins et vous proposons un plan d'action clair.
                </motion.p>
              </div>
            </div>

            {/* Card */}
            <motion.div {...slideInView("right", 0.2, 1.1)} className="flex-shrink-0" style={{ perspective: "1200px" }}>
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
                  <p className="text-sm text-royal/70 mt-0.5">Fondatrice & Experte en droit des sociétés</p>
                </div>
                <div className="mb-6 h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                <div className="space-y-3.5">
                  {[
                    { icon: Mail, text: "contact@projuridique.fr" },
                    { icon: MapPin, text: "Lyon & Nice" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08]">
                        <Icon className="h-3.5 w-3.5 text-royal/70" />
                      </div>
                      <span className="text-sm text-white/60">{text}</span>
                    </div>
                  ))}
                  <a href="https://wa.me/33758745623"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 group/wa">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08]">
                      <svg className="h-3.5 w-3.5 text-royal/70" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/60 group-hover/wa:text-white/80 transition-colors">+33 6 67 91 85 97</span>
                  </a>
                </div>
                {/* Réseaux sociaux */}
                <div className="mt-5 flex items-center gap-2.5">
                  <a href="https://www.linkedin.com/in/clodia-oyane-nze-35b0681ba" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08] text-royal/70 hover:bg-royal/20 hover:text-royal transition-all" aria-label="LinkedIn">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/charlynoyane" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08] text-royal/70 hover:bg-royal/20 hover:text-royal transition-all" aria-label="Instagram">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/share/18MN6LKsvY/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-royal/[0.08] text-royal/70 hover:bg-royal/20 hover:text-royal transition-all"
                    aria-label="Facebook">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.04]">
                  <p className="text-[11px] text-white/25 tracking-widest font-medium">SIREN 999 885 171</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div {...slideInView("bottom", 0.35, 1)} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
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
          </motion.div>
        </div>
      </section>
    </div>
  )
}
