import { useEffect } from "react"

interface SEOProps {
  title?: string
  description?: string
  ogImage?: string
  canonical?: string
}

const BASE_TITLE = "Juridique Pro"
const BASE_URL = "https://projuridique.com"

export function useSEO({ title, description, ogImage, canonical }: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} — Expert en formalités juridiques & création d'entreprises`
    document.title = fullTitle

    const setMeta = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name"
      let meta = document.querySelector(`meta[${attr}="${property}"]`)
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute(attr, property)
        document.head.appendChild(meta)
      }
      meta.setAttribute("content", content)
    }

    if (description) {
      setMeta("description", description)
      setMeta("og:description", description, true)
    }

    setMeta("og:title", fullTitle, true)
    setMeta("og:type", "website", true)
    setMeta("og:locale", "fr_FR", true)
    setMeta("og:site_name", BASE_TITLE, true)

    if (ogImage) {
      setMeta("og:image", ogImage, true)
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement("link")
        link.setAttribute("rel", "canonical")
        document.head.appendChild(link)
      }
      link.setAttribute("href", `${BASE_URL}${canonical}`)
      setMeta("og:url", `${BASE_URL}${canonical}`, true)
    }
  }, [title, description, ogImage, canonical])
}
