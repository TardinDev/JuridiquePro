import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"

const loginSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    useSEO({
        title: "Connexion",
        description: "Connectez-vous à votre compte Juridique Pro pour laisser un témoignage.",
    })

    const navigate = useNavigate()
    const location = useLocation()
    const login = useAuthStore((s) => s.login)
    const [serverError, setServerError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            setServerError("")
            await login(data.email, data.password)
            toast.success("Connexion réussie !")

            // Redirect back to admin if coming from AdminRoute
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname
            if (from?.startsWith("/admin")) {
                navigate(from)
                return
            }

            // Admin users go to admin dashboard
            const currentUser = useAuthStore.getState().user
            if (currentUser?.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/temoignages")
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erreur de connexion"
            setServerError(msg)
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
                        Espace client
                    </Badge>
                    <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        Bon retour{" "}
                        <span className="text-gradient-jade">parmi nous</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Connectez-vous pour partager votre expérience avec nos services.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* Login form */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mx-auto max-w-md">
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 text-royal">
                                    <LogIn className="h-7 w-7" />
                                </div>
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Connexion
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Entrez vos identifiants pour accéder à votre espace
                                </p>
                            </div>

                            {serverError && (
                                <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                                        Adresse email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="vous@email.com"
                                            className="rounded-xl pl-10"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password" className="mb-2 block text-sm font-medium">
                                        Mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="rounded-xl pl-10"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
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
                                            Connexion...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Se connecter
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Pas encore de compte ?{" "}
                                    <Link
                                        to="/inscription"
                                        className="font-semibold text-royal hover:text-royal-dark transition-colors"
                                    >
                                        Créer un compte
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
