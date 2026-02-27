import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiGetBlogPost, type ApiBlogPost } from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import { CTA } from "@/components/sections/CTA"

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<ApiBlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useSEO({
    title: post?.title || "Article",
    description: post?.excerpt,
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    apiGetBlogPost(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-card" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-card" />
            <div className="h-6 w-64 animate-pulse rounded-lg bg-card" />
            <div className="space-y-3 pt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-card" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-heading text-3xl font-bold text-foreground">
            Article introuvable
          </h1>
          <p className="mb-6 text-muted-foreground">
            Cet article n'existe pas ou a été retiré.
          </p>
          <Link to="/blog">
            <Button className="bg-royal hover:bg-royal-dark text-white rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au blog
          </Link>
          <Badge className="mb-4 bg-royal text-white">{post.category}</Badge>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author_name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.read_time} de lecture
              </span>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none text-foreground/80 leading-relaxed [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_strong]:text-foreground [&_a]:text-royal [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-royal/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
            {(post.content || "").split("\n").map((paragraph, i) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              if (trimmed.startsWith("## ")) {
                return <h2 key={i}>{trimmed.slice(3)}</h2>
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i}>{trimmed.slice(4)}</h3>
              }
              if (trimmed.startsWith("> ")) {
                return <blockquote key={i}><p>{trimmed.slice(2)}</p></blockquote>
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return <li key={i} className="ml-6 list-disc">{trimmed.slice(2)}</li>
              }
              return <p key={i}>{trimmed}</p>
            })}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
