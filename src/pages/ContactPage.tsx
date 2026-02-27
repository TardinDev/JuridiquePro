import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react"
import { COMPANY, LOCATIONS } from "@/lib/constants"
import { MagneticButton } from "@/components/effects/MagneticButton"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"
import { apiSubmitContact } from "@/lib/api"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  useSEO({
    title: "Contact — Consultation gratuite",
    description:
      "Contactez Juridique Pro pour une consultation gratuite et sans engagement. Bureaux à Lyon-Vénissieux (37 av. Jean Cagne) et Nice (13 av. Cagnoli). Réponse sous 24h. Tél: +33 7 58 74 56 23.",
    canonical: "/contact",
  })

  const formRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-info",
            start: "top 85%",
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data: ContactForm) => {
    try {
      const result = await apiSubmitContact(data)
      toast.success(result.message)
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'envoi")
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            Contactez-nous
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Parlons de{" "}
            <span className="text-gradient-jade">votre projet</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Première consultation gratuite et sans engagement.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Contact info cards */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="contact-info mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="contact-card rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md">
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-royal/10 text-royal">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-heading text-sm font-bold text-foreground">Email</h3>
              <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-royal">
                {COMPANY.email}
              </a>
            </div>

            <div className="contact-card rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md">
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-royal/10 text-royal">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-heading text-sm font-bold text-foreground">Téléphone</h3>
              <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-royal">
                {COMPANY.phone}
              </a>
            </div>

            {LOCATIONS.map((loc) => (
              <div key={loc.city} className="contact-card rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md">
                <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-royal/10 text-royal">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{loc.city}</h3>
                <p className="text-sm text-muted-foreground">{loc.address}</p>
              </div>
            ))}
          </div>

          {/* Form + Info */}
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div ref={formRef} className="lg:col-span-3">
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                  Envoyez-nous un message
                </h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  Décrivez votre projet et nous vous répondons sous 24h.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Nom complet *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        className="rounded-xl"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="vous@email.com"
                        className="rounded-xl"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+33 7 58 74 56 23"
                        className="rounded-xl"
                        {...register("phone")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="mb-2 block text-sm font-medium">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Création d'entreprise, etc."
                        className="rounded-xl"
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block text-sm font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Décrivez votre projet ou votre besoin..."
                      className="rounded-xl resize-none"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <MagneticButton className="inline-block">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group h-12 rounded-full bg-gradient-to-r from-royal to-royal-dark px-8 text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all"
                    >
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Envoyer le message
                          <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </form>
              </div>

              {/* Sidebar info */}
              <div className="lg:col-span-2">
                <div className="sticky top-28 space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-heading text-lg font-bold text-foreground">
                      Horaires d'ouverture
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-royal" />
                        <span>Lun - Ven : 9h00 - 18h00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-royal" />
                        <span>Sam : Sur rendez-vous</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-royal/20 bg-royal/5 p-6">
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
                      Consultation gratuite
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      La première consultation est offerte. Nous étudions ensemble
                      votre projet sans aucun engagement de votre part.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
