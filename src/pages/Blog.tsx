import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import { CTA } from "@/components/sections/CTA"
import { useSEO } from "@/hooks/useSEO"
import { apiGetBlogPosts, type ApiBlogPost } from "@/lib/api"

const STATIC_POSTS = [
  {
    title: "Les 5 étapes clés pour créer votre entreprise en 2026",
    slug: "5-etapes-creer-entreprise-2026",
    excerpt:
      "Guide complet pour lancer votre activité : choix du statut, immatriculation, et premières démarches essentielles.",
    category: "Création",
    read_time: "5 min",
    published_at: "2026-02-15",
  },
  {
    title: "Auto-entrepreneur : comment optimiser votre statut fiscal",
    slug: "optimiser-statut-fiscal-auto-entrepreneur",
    excerpt:
      "Découvrez les stratégies pour maximiser vos revenus tout en restant dans le cadre légal du régime micro-entrepreneur.",
    category: "Fiscalité",
    read_time: "4 min",
    published_at: "2026-02-10",
  },
  {
    title: "SARL ou SAS : quel statut choisir pour votre projet ?",
    slug: "sarl-ou-sas-quel-statut-choisir",
    excerpt:
      "Comparaison détaillée des deux formes juridiques les plus populaires pour vous aider à faire le bon choix.",
    category: "Juridique",
    read_time: "6 min",
    published_at: "2026-02-05",
  },
  {
    title: "Les erreurs à éviter lors de la création de votre société",
    slug: "erreurs-creation-societe",
    excerpt:
      "Les pièges courants qui peuvent retarder ou compromettre votre projet de création d'entreprise.",
    category: "Conseils",
    read_time: "3 min",
    published_at: "2026-02-01",
  },
  {
    title: "Domiciliation d'entreprise : tout ce qu'il faut savoir",
    slug: "domiciliation-entreprise-guide",
    excerpt:
      "L'adresse de votre siège social a un impact juridique et fiscal. Voici comment bien choisir.",
    category: "Juridique",
    read_time: "4 min",
    published_at: "2026-01-28",
  },
  {
    title: "Les aides à la création d'entreprise en France",
    slug: "aides-creation-entreprise-france",
    excerpt:
      "Tour d'horizon des dispositifs d'aide disponibles pour les nouveaux entrepreneurs en 2026.",
    category: "Financement",
    read_time: "7 min",
    published_at: "2026-01-25",
  },
]

const CATEGORIES = ["Tous", "Création", "Juridique", "Fiscalité", "Conseils", "Financement"]

export default function Blog() {
  useSEO({
    title: "Blog",
    description:
      "Conseils et actualités sur la création d'entreprise, les formalités juridiques et la gestion administrative.",
  })

  const [posts, setPosts] = useState<(ApiBlogPost | typeof STATIC_POSTS[0])[]>(STATIC_POSTS)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Tous")

  useEffect(() => {
    apiGetBlogPosts()
      .then((apiPosts) => {
        if (apiPosts.length > 0) {
          setPosts(apiPosts)
        }
      })
      .catch(() => {
        // Keep static posts as fallback
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts =
    activeCategory === "Tous"
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

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
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "border-royal bg-royal/10 text-royal"
                  : "border-border text-muted-foreground hover:border-royal/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="h-48 animate-pulse bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, i) => {
                const hasSlug = "slug" in post && post.slug
                const isApiPost = "id" in post

                return (
                  <article
                    key={isApiPost ? post.id : i}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-royal/20 hover:shadow-lg hover:shadow-royal/5"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-royal/10 to-jade/10">
                      <Badge className="absolute left-4 top-4 bg-royal text-white">
                        {post.category}
                      </Badge>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(post.published_at)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.read_time}
                        </span>
                      </div>

                      <h3 className="mb-3 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-royal">
                        {post.title}
                      </h3>

                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>

                      {hasSlug && isApiPost ? (
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-royal transition-all group-hover:gap-2"
                        >
                          Lire l'article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-royal transition-all group-hover:gap-2">
                          Lire l'article
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  )
}
