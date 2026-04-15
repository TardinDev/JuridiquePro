import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { WhyUs } from "@/components/sections/WhyUs"
import { Stats } from "@/components/sections/Stats"
import { Testimonials } from "@/components/sections/Testimonials"
import { FAQ } from "@/components/sections/FAQ"
import { CTA } from "@/components/sections/CTA"
import { HomepageContent } from "@/components/sections/HomepageContent"
import { useSEO } from "@/hooks/useSEO"

export default function Home() {
  useSEO({
    description:
      "Juridique Pro — Cabinet expert en création de sociétés (SARL, SAS, SASU, SCI) dès 0€, micro-entreprise dès 59€. 500+ entreprises créées, 15 ans d'expérience. Bureaux à Lyon et Nice. Domiciliation, comptabilité, droit des sociétés.",
    canonical: "/",
  })

  return (
    <div className="relative">
      <Hero />
      <HomepageContent position="after-hero" />
      <Services />
      <HomepageContent position="after-services" />
      <WhyUs />
      <Stats />
      <HomepageContent position="after-stats" />
      <Testimonials />
      <HomepageContent position="after-testimonials" />
      <FAQ />
      <CTA />
    </div>
  )
}
