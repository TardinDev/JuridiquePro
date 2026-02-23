import { useState, useEffect, useRef, useCallback } from "react"
import { X, Mail, Phone, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const INTERVAL = 5 * 60 * 1000 // 5 minutes
const INITIAL_DELAY = 10_000 // 10 secondes

export function WhatsAppCard() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const mountedRef = useRef(true)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showCard = useCallback(() => {
    if (!mountedRef.current) return
    setFading(false)
    setVisible(true)
  }, [])

  const scheduleShow = useCallback((delay: number) => {
    clearTimer()
    timerRef.current = window.setTimeout(showCard, delay)
  }, [clearTimer, showCard])

  const dismiss = useCallback(() => {
    setFading(true)
    window.setTimeout(() => {
      if (!mountedRef.current) return
      setVisible(false)
      setFading(false)
      scheduleShow(INTERVAL)
    }, 600)
  }, [scheduleShow])

  useEffect(() => {
    mountedRef.current = true
    scheduleShow(INITIAL_DELAY)

    return () => {
      mountedRef.current = false
      clearTimer()
    }
  }, [scheduleShow, clearTimer])

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
            className="relative rounded-2xl border border-white/[0.08] p-7 backdrop-blur-2xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(7,11,20,0.95) 0%, rgba(12,19,34,0.95) 50%, rgba(7,11,20,0.95) 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Decorative lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-royal/40 to-transparent" />
            <div className="absolute top-0 left-0 w-6 h-[1px] bg-royal/30" />
            <div className="absolute top-0 left-0 w-[1px] h-6 bg-royal/30" />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white/70 transition-all duration-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <span className="font-accent text-xl font-bold text-white">
                Juridique <span className="text-royal">Pro</span>
              </span>
            </div>

            {/* Name */}
            <div className="mb-4">
              <p className="font-accent text-base font-semibold text-white">Oyane Nze Clodia</p>
              <p className="text-xs text-royal/70 mt-0.5">Fondatrice & Experte juridique</p>
            </div>

            <div className="mb-4 h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

            {/* Contact info */}
            <div className="space-y-2.5">
              {[
                { icon: Mail, text: "oyaneclaudia@juridique.fr" },
                { icon: Phone, text: "+33 7 58 74 56 23" },
                { icon: MapPin, text: "Lyon & Nice" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-royal/[0.08]">
                    <Icon className="h-3 w-3 text-royal/70" />
                  </div>
                  <span className="text-xs text-white/60">{text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/33758745623"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-royal to-royal-dark py-3 text-sm font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all duration-300 group"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
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
