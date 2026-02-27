import { Link } from "react-router-dom"
import { ArrowLeft, Home, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/effects/MagneticButton"
import { useSEO } from "@/hooks/useSEO"

export default function NotFound() {
  useSEO({ title: "Page introuvable" })

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="noise absolute inset-0" />

      <div className="container-custom relative z-10 text-center">
        <span className="font-accent text-[150px] font-bold leading-none text-foreground/10 md:text-[200px]">
          404
        </span>

        <h1 className="mt-[-30px] font-heading text-3xl font-bold text-foreground md:text-4xl">
          Page introuvable
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton className="inline-block">
            <Link to="/">
              <Button
                size="lg"
                className="group rounded-full bg-royal px-8 text-base font-semibold text-white hover:bg-royal-dark"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à l'accueil
              </Button>
            </Link>
          </MagneticButton>
        </div>

        <div className="mx-auto mt-12 grid max-w-lg gap-3 sm:grid-cols-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/50 p-4 text-sm text-muted-foreground transition-all hover:border-royal/20 hover:text-foreground"
          >
            <Home className="h-5 w-5 text-royal" />
            Accueil
          </Link>
          <Link
            to="/services"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/50 p-4 text-sm text-muted-foreground transition-all hover:border-royal/20 hover:text-foreground"
          >
            <FileText className="h-5 w-5 text-royal" />
            Nos services
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/50 p-4 text-sm text-muted-foreground transition-all hover:border-royal/20 hover:text-foreground"
          >
            <Phone className="h-5 w-5 text-royal" />
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
