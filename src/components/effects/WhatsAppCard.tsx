import { useState, useEffect, useRef, useCallback } from "react"
import { X, Mail, Phone, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const IDLE_DELAY = 30_000 // 30 secondes sans activité

export function WhatsAppCard() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const mountedRef = useRef(true)
  const timerRef = useRef<number | null>(null)
  const visibleRef = useRef(false)

  // Garder visibleRef synchronisé
  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startIdleTimer = useCallback(() => {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return
      setFading(false)
      setVisible(true)
    }, IDLE_DELAY)
  }, [clearTimer])

  const dismiss = useCallback(() => {
    setFading(true)
    window.setTimeout(() => {
      if (!mountedRef.current) return
      setVisible(false)
      setFading(false)
      startIdleTimer()
    }, 600)
  }, [startIdleTimer])

  useEffect(() => {
    mountedRef.current = true

    // Le scroll cache la carte et relance le timer
    const onScroll = () => {
      if (visibleRef.current) {
        setVisible(false)
        setFading(false)
      }
      startIdleTimer()
    }

    // Le mouvement de souris relance le timer mais ne cache PAS la carte
    const onMouseMove = () => {
      if (!visibleRef.current) {
        startIdleTimer()
      }
    }

    window.addEventListener("wheel", onScroll, { passive: true })
    window.addEventListener("touchmove", onScroll, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // Lancer le premier timer
    startIdleTimer()

    return () => {
      mountedRef.current = false
      window.removeEventListener("wheel", onScroll)
      window.removeEventListener("touchmove", onScroll)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMouseMove)
      clearTimer()
    }
  }, [startIdleTimer, clearTimer])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whatsapp-card"
          initial={{ x: 400, opacity: 0 }}
          animate={
            fading
              ? { opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }
              : { x: 0, opacity: 1 }
          }
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="fixed bottom-6 right-6 z-[9999] w-[320px] md:w-[360px]"
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(165deg, rgba(18,24,42,0.98) 0%, rgba(7,11,20,0.99) 100%)",
              boxShadow: "0 50px 120px rgba(0,0,0,0.8), 0 0 60px rgba(98,122,147,0.06), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Top accent bar */}
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #627A93 30%, #39648F 70%, transparent)" }} />

            {/* Header section with background glow */}
            <div className="relative px-6 pt-6 pb-5">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #627A93, transparent 70%)" }} />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] text-white/25 hover:text-white/60 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #627A93, #39648F)" }}>
                    <span className="font-accent text-sm font-bold text-white">JP</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f1525] bg-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-accent text-[14px] font-semibold text-white leading-tight">Oyane Nze Clodia</p>
                  <p className="text-[11px] text-white/35 mt-0.5">Fondatrice & Experte juridique</p>
                </div>
              </div>
            </div>

            <div className="h-[1px] mx-6" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)" }} />

            {/* Content */}
            <div className="px-6 py-5">
              {/* Message bubble */}
              <div className="relative rounded-2xl rounded-tl-sm p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(98,122,147,0.08), rgba(57,100,143,0.04))", border: "1px solid rgba(98,122,147,0.1)" }}>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  Besoin d'un accompagnement juridique ? Contactez-moi directement, je vous réponds rapidement.
                </p>
                <div className="absolute bottom-0 left-4 w-2 h-2 rotate-45 translate-y-1" style={{ background: "rgba(98,122,147,0.06)", borderRight: "1px solid rgba(98,122,147,0.1)", borderBottom: "1px solid rgba(98,122,147,0.1)" }} />
              </div>

              {/* Contact info — compact inline */}
              <div className="flex items-center gap-2 text-[11px] text-white/30 mb-5">
                <Phone className="h-3 w-3 text-royal/40" />
                <span>+33 7 58 74 56 23</span>
                <span className="text-white/10">|</span>
                <MapPin className="h-3 w-3 text-royal/40" />
                <span>Lyon & Nice</span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { href: "https://wa.me/33758745623", label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                  { href: "https://www.tiktok.com/@juridiquepro", label: "TikTok", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" },
                  { href: "https://www.facebook.com/juridiquepro", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { href: "https://www.youtube.com/@juridiquepro", label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                ].map(({ href, label, path }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-white/30 hover:text-white hover:border-royal/30 hover:bg-royal/[0.08] transition-all duration-300">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA — full width bottom */}
            <a
              href="https://wa.me/33758745623"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 py-4 text-[13px] font-semibold text-white transition-all duration-300"
              style={{ background: "linear-gradient(90deg, #627A93, #39648F)" }}
            >
              <svg className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Discuter sur WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
