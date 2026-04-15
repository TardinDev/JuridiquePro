import { useEffect, useState } from "react"
import { apiGetHomepageContent, type HomepageContentItem } from "@/lib/api"
import { ArrowRight, ExternalLink, Megaphone, Tag, Handshake } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL || ""

interface HomepageContentProps {
  position: string
}

function getImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith("http")) return url
  return `${API_BASE}${url}`
}

function AnnouncementCard({ item }: { item: HomepageContentItem }) {
  const imgUrl = getImageUrl(item.image_url)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg">
      {imgUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imgUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-royal/10">
            <Megaphone className="h-3.5 w-3.5 text-royal" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-royal">Actualite</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">{item.title}</h3>
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}
        {item.link_url && (
          <a
            href={item.link_url}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-royal hover:text-royal-dark transition-colors"
          >
            {item.link_text || "En savoir plus"} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

function PromotionBanner({ item }: { item: HomepageContentItem }) {
  const imgUrl = getImageUrl(item.image_url)
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-royal to-royal-dark p-6 sm:p-8 text-white">
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
        />
      )}
      <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-white/80">{item.description}</p>
            )}
          </div>
        </div>
        {item.link_url && (
          <a
            href={item.link_url}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-royal shadow-lg transition-all hover:shadow-xl hover:bg-white/90"
          >
            {item.link_text || "En profiter"} <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function PartnerAd({ item }: { item: HomepageContentItem }) {
  const imgUrl = getImageUrl(item.image_url)
  const Wrapper = item.link_url ? "a" : "div"
  const wrapperProps = item.link_url
    ? { href: item.link_url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
    >
      {imgUrl && (
        <div className="aspect-[2/1] w-full overflow-hidden">
          <img
            src={imgUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <Handshake className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Partenaire</span>
        </div>
        <h3 className="font-heading text-base font-bold text-foreground">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        {item.link_url && (
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-royal">
            Visiter <ExternalLink className="h-3 w-3" />
          </span>
        )}
      </div>
    </Wrapper>
  )
}

export function HomepageContent({ position }: HomepageContentProps) {
  const [items, setItems] = useState<HomepageContentItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    apiGetHomepageContent()
      .then((grouped) => {
        setItems(grouped[position] || [])
      })
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [position])

  if (!loaded || items.length === 0) return null

  // Separate by type for layout
  const promotions = items.filter((i) => i.type === "promotion")
  const announcements = items.filter((i) => i.type === "announcement")
  const ads = items.filter((i) => i.type === "partner_ad")

  return (
    <section className="section-padding bg-background">
      <div className="container-custom space-y-6">
        {/* Promotions as full-width banners */}
        {promotions.map((item) => (
          <PromotionBanner key={item.id} item={item} />
        ))}

        {/* Announcements + Partner ads in a grid */}
        {(announcements.length > 0 || ads.length > 0) && (
          <div className={`grid gap-6 ${
            announcements.length + ads.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : announcements.length + ads.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
          }`}>
            {announcements.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
            {ads.map((item) => (
              <PartnerAd key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
