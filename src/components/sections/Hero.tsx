import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Mail, Phone, MapPin, Scale, FileText, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import gsap from "gsap"

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

const fadeUp = (delay: number, duration = 0.8) => ({
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration, delay, ease: EASE },
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

      {/* ══════════════════════════════════════════ */}
      {/* HERO — Texte + Image                      */}
      {/* ══════════════════════════════════════════ */}
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
                <div className="relative z-10">
                  <img src="/images/law.png" alt="Justice et droit" className="w-full max-w-[480px] xl:max-w-[540px] h-auto object-contain" style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5)) drop-shadow(0 0 80px rgba(98,122,147,0.08))" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* 3 THÈMES — Ce que nous faisons              */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section title */}
          <div className="text-center mb-16 md:mb-20">
            <motion.span {...slideInView("top", 0, 0.9)} className="text-[11px] font-semibold uppercase tracking-[0.35em] text-royal/60">
              Nos expertises
            </motion.span>
            <motion.h2 {...slideInView("left", 0.1, 1)} className="mt-4 font-accent font-bold text-white leading-[1.1]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Tout pour lancer et<br />
              <span className="text-royal">sécuriser votre entreprise.</span>
            </motion.h2>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Thème 1 — Création */}
            <motion.div {...slideInView("left", 0, 1)} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-all duration-500 hover:border-royal/20 hover:bg-royal/[0.04]">
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
            </motion.div>

            {/* Thème 2 — Micro-entreprise */}
            <motion.div {...slideInView("bottom", 0.15, 1)} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-all duration-500 hover:border-royal/20 hover:bg-royal/[0.04]">
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
            </motion.div>

            {/* Thème 3 — Droit des sociétés */}
            <motion.div {...slideInView("right", 0.3, 1)} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 lg:p-10 backdrop-blur-sm transition-all duration-500 hover:border-royal/20 hover:bg-royal/[0.04]">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* PRENONS CONTACT — apparaît au scroll       */}
      {/* ══════════════════════════════════════════ */}
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
