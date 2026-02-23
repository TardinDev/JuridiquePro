import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { WhyUs } from "@/components/sections/WhyUs"
import { Stats } from "@/components/sections/Stats"
import { Testimonials } from "@/components/sections/Testimonials"
import { FAQ } from "@/components/sections/FAQ"
import { CTA } from "@/components/sections/CTA"
import { WhatsAppCard } from "@/components/effects/WhatsAppCard"
import { useSEO } from "@/hooks/useSEO"

export default function Home() {
  useSEO({
    description:
      "Juridique Pro — Cabinet juridique expert en création de sociétés, micro-entreprises et droit des affaires. Votre vision. Notre protection juridique.",
  })

  return (
    <div className="relative">
      <Hero />
      <Services />
      <WhyUs />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <WhatsAppCard />
    </div>
  )
}
