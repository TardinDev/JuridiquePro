import {
  FileText,
  Users,
  Scale,
  ClipboardCheck,
  ShieldCheck,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react"

export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  features: string[]
}

export const SERVICES: Service[] = [
  {
    id: "creation",
    title: "Cr\u00e9ation d'entreprise",
    description:
      "Accompagnement complet pour donner vie \u00e0 votre projet entrepreneurial, du choix du statut juridique \u00e0 l'immatriculation d\u00e9finitive.",
    icon: FileText,
    features: [
      "Choix de la forme juridique",
      "R\u00e9daction des statuts",
      "Immatriculation compl\u00e8te",
      "Accompagnement personnalis\u00e9",
    ],
  },
  {
    id: "droit-entreprises",
    title: "Droit des entreprises",
    description:
      "Expertise en droit des affaires pour s\u00e9curiser vos d\u00e9cisions strat\u00e9giques et prot\u00e9ger vos int\u00e9r\u00eats commerciaux.",
    icon: Scale,
    features: [
      "Analyse juridique",
      "Optimisation fiscale",
      "Conformit\u00e9 r\u00e9glementaire",
      "Veille juridique",
    ],
  },
  {
    id: "juridique-comptable",
    title: "Juridique comptable",
    description:
      "Prise en charge compl\u00e8te de vos formalit\u00e9s administratives, comptables et juridiques d'entreprise.",
    icon: ClipboardCheck,
    features: [
      "Modification de statuts",
      "Transfert de si\u00e8ge",
      "Changement de dirigeant",
      "Publication l\u00e9gale",
    ],
  },
  {
    id: "auto-entrepreneur",
    title: "Auto-Entrepreneur",
    description:
      "Cr\u00e9ation de dossiers d'immatriculation et conseils pour optimiser votre statut de micro-entrepreneur.",
    icon: Users,
    features: [
      "D\u00e9claration d'activit\u00e9",
      "Optimisation du statut",
      "Aide aux d\u00e9marches URSSAF",
      "Suivi post-cr\u00e9ation",
    ],
  },
  {
    id: "gestion-admin",
    title: "Gestion Administrative",
    description:
      "Support \u00e0 la gestion administrative et financi\u00e8re pour vous concentrer sur votre c\u0153ur de m\u00e9tier.",
    icon: ShieldCheck,
    features: [
      "Gestion courrier",
      "Suivi des \u00e9ch\u00e9ances",
      "Organisation documentaire",
      "Tableaux de bord",
    ],
  },
  {
    id: "suivi",
    title: "Suivi & Accompagnement",
    description:
      "Un accompagnement continu apr\u00e8s la cr\u00e9ation pour assurer la p\u00e9rennit\u00e9 de votre activit\u00e9.",
    icon: HeadphonesIcon,
    features: [
      "Point r\u00e9gulier",
      "Mise \u00e0 jour des obligations",
      "Conseil strat\u00e9gique",
      "Support r\u00e9actif",
    ],
  },
]

export interface ProcessStep {
  number: string
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Consultation Gratuite",
    description:
      "\u00c9change approfondi sur votre projet, vos objectifs et votre situation pour d\u00e9finir la meilleure strat\u00e9gie.",
  },
  {
    number: "02",
    title: "\u00c9tude Personnalis\u00e9e",
    description:
      "Analyse compl\u00e8te de votre dossier et \u00e9laboration d'un plan d'action sur mesure adapt\u00e9 \u00e0 vos besoins.",
  },
  {
    number: "03",
    title: "R\u00e9alisation & Formalit\u00e9s",
    description:
      "Prise en charge int\u00e9grale des d\u00e9marches administratives et juridiques n\u00e9cessaires \u00e0 votre projet.",
  },
  {
    number: "04",
    title: "Suivi Continu",
    description:
      "Accompagnement post-cr\u00e9ation avec un suivi r\u00e9gulier pour garantir la r\u00e9ussite de votre activit\u00e9.",
  },
]

export interface Stat {
  value: string
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: "15", suffix: "", label: "ans d'exp\u00e9rience" },
  { value: "500", suffix: "+", label: "entreprises cr\u00e9\u00e9es" },
  { value: "98", suffix: "%", label: "de satisfaction" },
]

export interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sophie Martin",
    role: "Fondatrice, Atelier Cr\u00e9atif",
    content:
      "Gr\u00e2ce \u00e0 ce cabinet, j'ai pu cr\u00e9er mon entreprise en toute s\u00e9r\u00e9nit\u00e9. Un accompagnement exemplaire du d\u00e9but \u00e0 la fin.",
    rating: 5,
  },
  {
    name: "Karim Benali",
    role: "G\u00e9rant, KB Consulting",
    content:
      "Le professionnalisme et la r\u00e9activit\u00e9 sont remarquables. Toutes mes formalit\u00e9s ont \u00e9t\u00e9 g\u00e9r\u00e9es en un temps record.",
    rating: 5,
  },
  {
    name: "Marie Dupont",
    role: "Auto-Entrepreneuse",
    content:
      "Je recommande vivement ! Les conseils juridiques m'ont permis d'optimiser mon statut et de d\u00e9marrer dans les meilleures conditions.",
    rating: 5,
  },
  {
    name: "Thomas Laurent",
    role: "Co-fondateur, TechStart",
    content:
      "Un vrai gain de temps et d'\u00e9nergie. La partie administrative a \u00e9t\u00e9 prise en charge pour que je me concentre sur mon business.",
    rating: 5,
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quels sont les d\u00e9lais pour cr\u00e9er une entreprise ?",
    answer:
      "Les d\u00e9lais varient selon la forme juridique choisie. Pour une auto-entreprise, comptez 24 \u00e0 48h. Pour une soci\u00e9t\u00e9 (SARL, SAS), le processus prend g\u00e9n\u00e9ralement 1 \u00e0 2 semaines apr\u00e8s r\u00e9ception de tous les documents.",
  },
  {
    question: "Quel statut juridique choisir pour mon activit\u00e9 ?",
    answer:
      "Le choix d\u00e9pend de plusieurs crit\u00e8res : nature de l'activit\u00e9, chiffre d'affaires pr\u00e9visionnel, protection du patrimoine, r\u00e9gime fiscal souhait\u00e9. Lors de notre consultation gratuite, nous analysons votre situation pour vous recommander le statut le plus adapt\u00e9.",
  },
  {
    question: "Combien co\u00fbte la cr\u00e9ation d'une entreprise ?",
    answer:
      "Les frais varient selon le type de structure. Nous proposons des forfaits transparents et sans surprise. Contactez-nous pour obtenir un devis personnalis\u00e9 gratuit.",
  },
  {
    question: "Intervenez-vous sur toute la France ?",
    answer:
      "Oui, nous accompagnons des entrepreneurs partout en France. Avec nos bureaux \u00e0 V\u00e9nissieux (Lyon) et Nice, nous couvrons tout le territoire gr\u00e2ce \u00e0 nos outils digitaux.",
  },
  {
    question: "Proposez-vous un suivi apr\u00e8s la cr\u00e9ation ?",
    answer:
      "Absolument. Nous ne vous laissons pas seul apr\u00e8s la cr\u00e9ation. Nous assurons un suivi administratif continu, des conseils r\u00e9guliers et une veille sur vos obligations l\u00e9gales.",
  },
  {
    question: "Quels documents dois-je fournir ?",
    answer:
      "Les documents n\u00e9cessaires varient selon le projet. En g\u00e9n\u00e9ral : pi\u00e8ce d'identit\u00e9, justificatif de domicile, et \u00e9l\u00e9ments sp\u00e9cifiques \u00e0 votre activit\u00e9. Nous vous guidons \u00e9tape par \u00e9tape.",
  },
]

export interface Location {
  city: string
  address: string
  postalCode: string
  description: string
}

export const LOCATIONS: Location[] = [
  {
    city: "Lyon - V\u00e9nissieux",
    address: "37 Avenue Jean Cagne",
    postalCode: "69200 V\u00e9nissieux",
    description: "Si\u00e8ge social \u2014 R\u00e9gion Auvergne-Rh\u00f4ne-Alpes",
  },
  {
    city: "Nice",
    address: "13 Avenue Cagnoli",
    postalCode: "06100 Nice",
    description: "\u00c9tablissement \u2014 R\u00e9gion Provence-Alpes-C\u00f4te d'Azur",
  },
]

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "/services" },
  { label: "Notre approche", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const

export const COMPANY = {
  name: "LC",
  fullName: "Oyane Nze Clodia",
  siren: "999 885 171",
  siret: "999 885 171 00010",
  ape: "8211Z",
  email: "contact@juridiquepro.fr",
  phone: "+33 6 00 00 00 00",
  tagline: "Votre vision. Notre protection juridique.",
  description:
    "Votre partenaire de confiance pour la cr\u00e9ation d'entreprise, les formalit\u00e9s juridiques et l'accompagnement administratif.",
} as const
