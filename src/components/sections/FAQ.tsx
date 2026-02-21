import { useRef, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@/lib/constants"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-[#E0E3E9]">
      <div className="container-custom">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block font-heading text-sm font-semibold uppercase tracking-[0.2em] text-royal">
              FAQ
            </span>
            <div className="mx-auto mt-3 mb-6 h-px w-12 bg-royal/40" />
            <h2 className="font-accent text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions{" "}
              <span className="text-royal">fréquentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="faq-item overflow-hidden rounded-xl border border-border bg-[#E8EAF0] px-6 card-glow data-[state=open]:border-royal/20 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="py-5 font-heading text-base font-semibold text-foreground hover:no-underline hover:text-royal [&[data-state=open]]:text-royal">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
