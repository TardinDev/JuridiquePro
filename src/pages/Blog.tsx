import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import { CTA } from "@/components/sections/CTA"
import { useSEO } from "@/hooks/useSEO"

const BLOG_POSTS = [
  {
    title: "Les 5 étapes clés pour créer votre entreprise en 2026",
    excerpt:
      "Guide complet pour lancer votre activité : choix du statut, immatriculation, et premières démarches essentielles.",
    category: "Création",
    readTime: "5 min",
    date: "15 Fév 2026",
  },
  {
    title: "Auto-entrepreneur : comment optimiser votre statut fiscal",
    excerpt:
      "Découvrez les stratégies pour maximiser vos revenus tout en restant dans le cadre légal du régime micro-entrepreneur.",
    category: "Fiscalité",
    readTime: "4 min",
    date: "10 Fév 2026",
  },
  {
    title: "SARL ou SAS : quel statut choisir pour votre projet ?",
    excerpt:
      "Comparaison détaillée des deux formes juridiques les plus populaires pour vous aider à faire le bon choix.",
    category: "Juridique",
    readTime: "6 min",
    date: "5 Fév 2026",
  },
  {
    title: "Les erreurs à éviter lors de la création de votre société",
    excerpt:
      "Les pièges courants qui peuvent retarder ou compromettre votre projet de création d'entreprise.",
    category: "Conseils",
    readTime: "3 min",
    date: "1 Fév 2026",
  },
  {
    title: "Domiciliation d'entreprise : tout ce qu'il faut savoir",
    excerpt:
      "L'adresse de votre siège social a un impact juridique et fiscal. Voici comment bien choisir.",
    category: "Juridique",
    readTime: "4 min",
    date: "28 Jan 2026",
  },
  {
    title: "Les aides à la création d'entreprise en France",
    excerpt:
      "Tour d'horizon des dispositifs d'aide disponibles pour les nouveaux entrepreneurs en 2026.",
    category: "Financement",
    readTime: "7 min",
    date: "25 Jan 2026",
  },
]

const CATEGORIES = ["Tous", "Création", "Juridique", "Fiscalité", "Conseils", "Financement"]

export default function Blog() {
  useSEO({
    title: "Blog",
    description:
      "Conseils et actualités sur la création d'entreprise, les formalités juridiques et la gestion administrative.",
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            Ressources & Conseils
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Le blog{" "}
            <span className="text-gradient-jade">Juridique Pro</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Conseils pratiques et décryptages pour entrepreneurs et futurs créateurs.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background">
        <div className="container-custom flex gap-2 overflow-x-auto py-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all first:border-royal first:bg-royal/10 first:text-royal hover:border-royal/30 hover:text-foreground"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post, i) => (
              <article
                key={i}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-royal/20 hover:shadow-lg hover:shadow-royal/5"
              >
                {/* Placeholder image area */}
                <div className="relative h-48 bg-gradient-to-br from-royal/10 to-jade/10">
                  <Badge className="absolute left-4 top-4 bg-royal text-white">
                    {post.category}
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="mb-3 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-royal">
                    {post.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-royal transition-all group-hover:gap-2">
                    Lire l'article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
