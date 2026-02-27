import { useRef, useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Send, LogIn, MessageSquarePlus, CheckCircle } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { apiGetTestimonials, apiSubmitTestimonial, type ApiTestimonial } from "@/lib/api"
import { TESTIMONIALS } from "@/lib/constants"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const testimonialSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    role: z.string().min(2, "Le rôle/entreprise doit contenir au moins 2 caractères"),
    content: z
        .string()
        .min(20, "Le témoignage doit contenir au moins 20 caractères")
        .max(500, "Le témoignage ne doit pas dépasser 500 caractères"),
})

type TestimonialForm = z.infer<typeof testimonialSchema>

export default function TestimonialsPage() {
    useSEO({
        title: "Témoignages",
        description: "Découvrez les témoignages de nos clients satisfaits. Partagez votre expérience avec Juridique Pro.",
    })

    const sectionRef = useRef<HTMLElement>(null)
    const user = useAuthStore((s) => s.user)
    const [apiTestimonials, setApiTestimonials] = useState<ApiTestimonial[]>([])
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TestimonialForm>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            name: user?.fullName || "",
        },
    })

    const loadTestimonials = useCallback(async () => {
        try {
            const data = await apiGetTestimonials()
            setApiTestimonials(data)
        } catch {
            // Silently fallback to hardcoded testimonials
        }
    }, [])

    useEffect(() => {
        loadTestimonials()
    }, [loadTestimonials])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".testimonial-card",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".testimonials-grid",
                        start: "top 85%",
                        once: true,
                    },
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [apiTestimonials])

    const onSubmit = async (data: TestimonialForm) => {
        try {
            await apiSubmitTestimonial({
                ...data,
                rating,
            })
            toast.success("Merci pour votre témoignage ! Il sera visible après validation.")
            setSubmitted(true)
            reset()
            setRating(5)
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erreur lors de la soumission"
            toast.error(msg)
        }
    }

    // Combine hardcoded + API testimonials
    const allTestimonials = [
        ...apiTestimonials.map((t) => ({
            name: t.name,
            role: t.role,
            content: t.content,
            rating: t.rating,
        })),
        ...TESTIMONIALS,
    ]

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 mesh-gradient opacity-60" />
                <div className="noise absolute inset-0" />
                <div className="container-custom relative z-10 text-center">
                    <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
                        Témoignages clients
                    </Badge>
                    <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        La parole à{" "}
                        <span className="text-gradient-jade">nos clients</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Découvrez les retours de ceux qui nous ont fait confiance pour leurs projets juridiques.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* Testimonials grid */}
            <section ref={sectionRef} className="section-padding bg-background">
                <div className="container-custom">
                    <div className="testimonials-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {allTestimonials.map((testimonial, i) => (
                            <div
                                key={i}
                                className="testimonial-card group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:border-royal/20 hover:shadow-lg card-glow"
                            >
                                <Quote className="mb-4 h-8 w-8 text-royal/30" />

                                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                                    "{testimonial.content}"
                                </p>

                                <div className="mb-4 flex gap-0.5">
                                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                                        <Star
                                            key={j}
                                            className="h-4 w-4 fill-royal text-royal"
                                        />
                                    ))}
                                </div>

                                <div>
                                    <p className="font-heading text-sm font-bold text-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Submit testimonial section */}
            <section className="section-padding bg-card/50 border-t border-border">
                <div className="container-custom">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
                            Votre avis compte
                        </span>
                        <div className="mx-auto mt-3 mb-6 h-px w-12 bg-royal/40" />
                        <h2 className="font-accent text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Partagez votre{" "}
                            <span className="text-royal">expérience</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                            Vous avez utilisé nos services ? Votre témoignage aide d'autres entrepreneurs à faire le bon choix.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 max-w-lg">
                        {!user ? (
                            /* Not logged in — prompt to login */
                            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 text-royal">
                                    <LogIn className="h-7 w-7" />
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                                    Connectez-vous pour témoigner
                                </h3>
                                <p className="mb-6 text-sm text-muted-foreground">
                                    Créez un compte ou connectez-vous pour partager votre expérience.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                    <Link to="/connexion">
                                        <Button className="h-11 rounded-full bg-gradient-to-r from-royal to-royal-dark px-8 font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all">
                                            Se connecter
                                        </Button>
                                    </Link>
                                    <Link to="/inscription">
                                        <Button
                                            variant="outline"
                                            className="h-11 rounded-full border-border px-8 font-semibold hover:border-royal/30 hover:bg-royal/5 transition-all"
                                        >
                                            Créer un compte
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : submitted ? (
                            /* Submission success */
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle className="h-7 w-7" />
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                                    Merci pour votre témoignage !
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Votre avis a bien été enregistré. Il sera visible sur le site après validation par notre équipe.
                                </p>
                                <Button
                                    onClick={() => setSubmitted(false)}
                                    variant="outline"
                                    className="mt-6 h-11 rounded-full border-border px-8 font-semibold hover:border-royal/30"
                                >
                                    Soumettre un autre témoignage
                                </Button>
                            </div>
                        ) : (
                            /* Logged in — show form */
                            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-royal/10 text-royal">
                                        <MessageSquarePlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-heading text-sm font-bold text-foreground">
                                            {user.fullName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name" className="mb-2 block text-sm font-medium">
                                                Votre nom *
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Jean Dupont"
                                                className="rounded-xl"
                                                {...register("name")}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="role" className="mb-2 block text-sm font-medium">
                                                Rôle / Entreprise *
                                            </Label>
                                            <Input
                                                id="role"
                                                placeholder="Gérant, Ma Société"
                                                className="rounded-xl"
                                                {...register("role")}
                                            />
                                            {errors.role && (
                                                <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Star rating */}
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">
                                            Votre note *
                                        </Label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-0.5 transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 transition-colors ${star <= (hoverRating || rating)
                                                                ? "fill-royal text-royal"
                                                                : "fill-transparent text-border"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="content" className="mb-2 block text-sm font-medium">
                                            Votre témoignage *
                                        </Label>
                                        <Textarea
                                            id="content"
                                            rows={4}
                                            placeholder="Décrivez votre expérience avec nos services..."
                                            className="rounded-xl resize-none"
                                            {...register("content")}
                                        />
                                        {errors.content && (
                                            <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group h-12 w-full rounded-full bg-gradient-to-r from-royal to-royal-dark text-base font-semibold text-white shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Envoi en cours...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Soumettre mon témoignage
                                                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground">
                                        Votre témoignage sera visible après validation par notre équipe.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
