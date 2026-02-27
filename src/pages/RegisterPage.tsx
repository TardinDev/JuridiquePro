import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"

const registerSchema = z
    .object({
        fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Adresse email invalide"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    useSEO({
        title: "Inscription",
        description: "Créez votre compte Juridique Pro pour partager votre témoignage.",
    })

    const navigate = useNavigate()
    const registerUser = useAuthStore((s) => s.register)
    const [serverError, setServerError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterForm) => {
        try {
            setServerError("")
            await registerUser(data.fullName, data.email, data.password)
            toast.success("Compte créé avec succès ! Bienvenue 🎉")
            navigate("/temoignages")
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Erreur lors de l'inscription"
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
                        Nouveau compte
                    </Badge>
                    <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        Rejoignez{" "}
                        <span className="text-gradient-jade">notre communauté</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Créez votre compte pour partager votre expérience avec nos services juridiques.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* Register form */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mx-auto max-w-md">
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 text-royal">
                                    <UserPlus className="h-7 w-7" />
                                </div>
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Créer un compte
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Remplissez les informations ci-dessous pour commencer
                                </p>
                            </div>

                            {serverError && (
                                <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                                    {serverError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <Label htmlFor="fullName" className="mb-2 block text-sm font-medium">
                                        Nom complet
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            placeholder="Jean Dupont"
                                            className="rounded-xl pl-10"
                                            {...register("fullName")}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
                                    )}
                                </div>

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
                                            placeholder="Minimum 8 caractères"
                                            className="rounded-xl pl-10"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Retapez votre mot de passe"
                                            className="rounded-xl pl-10"
                                            {...register("confirmPassword")}
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
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
                                            Création du compte...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Créer mon compte
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Déjà un compte ?{" "}
                                    <Link
                                        to="/connexion"
                                        className="font-semibold text-royal hover:text-royal-dark transition-colors"
                                    >
                                        Se connecter
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
