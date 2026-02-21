import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
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

        <div className="mt-8">
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
      </div>
    </section>
  )
}
