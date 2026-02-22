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
    id: "creation-societe",
    title: "Création de société",
    description:
      "De la rédaction des statuts à l'immatriculation définitive, nous créons votre société clé en main selon la forme juridique adaptée à votre projet.",
    icon: FileText,
    features: [
      "Rédaction des statuts sur mesure",
      "SARL, SAS, SASU, SA, SCI",
      "Dépôt du capital & immatriculation",
      "Publication d'annonce légale",
    ],
  },
  {
    id: "micro-entreprise",
    title: "Micro-entreprise",
    description:
      "Toutes les formalités liées à votre entreprise individuelle sur le guichet unique INPI : création, modification et cessation d'activité.",
    icon: Users,
    features: [
      "Immatriculation sur l'INPI",
      "Modification d'activité",
      "Cessation d'activité",
      "Conseil URSSAF & optimisation",
    ],
  },
  {
    id: "droit-societes",
    title: "Droit des sociétés",
    description:
      "Expertise juridique pour sécuriser la vie de votre société : modifications statutaires, cessions, transformations et conformité réglementaire.",
    icon: Scale,
    features: [
      "Modification de statuts",
      "Transfert de siège social",
      "Changement de dirigeant",
      "Cession de parts & actions",
    ],
  },
  {
    id: "juridique-comptable",
    title: "Formalités juridiques",
    description:
      "Prise en charge complète de vos obligations légales et administratives pour sociétés et entreprises individuelles.",
    icon: ClipboardCheck,
    features: [
      "Approbation des comptes",
      "Publication légale (JAL)",
      "Dépôt au greffe",
      "Déclaration des bénéficiaires effectifs",
    ],
  },
  {
    id: "gestion-admin",
    title: "Gestion Administrative",
    description:
      "Support à la gestion administrative et financière pour vous concentrer sur votre cœur de métier.",
    icon: ShieldCheck,
    features: [
      "Gestion courrier",
      "Suivi des échéances légales",
      "Organisation documentaire",
      "Tableaux de bord",
    ],
  },
  {
    id: "suivi",
    title: "Suivi & Accompagnement",
    description:
      "Un accompagnement continu après la création pour assurer la pérennité de votre activité, société comme micro-entreprise.",
    icon: HeadphonesIcon,
    features: [
      "Point régulier",
      "Mise à jour des obligations",
      "Conseil stratégique",
      "Support réactif",
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
    question: "Quelle est la différence entre une entreprise et une société ?",
    answer:
      "Une entreprise individuelle (micro-entreprise) est exploitée en nom propre par une seule personne, sans création de personne morale distincte. Une société (SARL, SAS, SASU, SA, SCI…) est une entité juridique à part entière avec ses propres statuts, un capital social et une responsabilité limitée aux apports. Nous vous accompagnons dans les deux cas.",
  },
  {
    question: "Quels sont les délais pour créer une micro-entreprise ou une société ?",
    answer:
      "Pour une micro-entreprise, l'immatriculation sur le guichet unique de l'INPI se fait en 24 à 48h. Pour une société (SARL, SAS, SA…), comptez 1 à 2 semaines : rédaction des statuts, dépôt du capital, publication d'annonce légale et immatriculation au greffe.",
  },
  {
    question: "Quelles formalités gérez-vous pour les micro-entreprises ?",
    answer:
      "Nous prenons en charge l'immatriculation de votre micro-entreprise sur l'INPI, la modification de votre activité (changement d'adresse, d'activité principale…) ainsi que la cessation d'activité. Nous vous conseillons également sur vos obligations URSSAF.",
  },
  {
    question: "Quelles sont les formes de sociétés que vous créez ?",
    answer:
      "Nous créons toutes les formes de sociétés : SARL, SAS, SASU, SA, SCI, EURL, SNC, et bien d'autres. Cela inclut la rédaction des statuts sur mesure, le dépôt du capital social, la publication de l'annonce légale et l'immatriculation complète.",
  },
  {
    question: "Combien coûte la création d'une entreprise ou d'une société ?",
    answer:
      "Les frais varient selon la structure. Une immatriculation de micro-entreprise est moins coûteuse qu'une création de société (qui implique rédaction de statuts, frais de greffe, annonce légale…). Nous proposons des forfaits transparents. Contactez-nous pour un devis gratuit.",
  },
  {
    question: "Intervenez-vous sur toute la France ?",
    answer:
      "Oui, nous accompagnons entrepreneurs et dirigeants de sociétés partout en France. Avec nos bureaux à Vénissieux (Lyon) et Nice, nous couvrons tout le territoire grâce à nos outils digitaux et au guichet unique INPI.",
  },
  {
    question: "Proposez-vous un suivi après la création ?",
    answer:
      "Absolument. Que vous soyez micro-entrepreneur ou dirigeant de société, nous assurons un suivi continu : mise à jour de vos obligations, modifications statutaires, et conseil stratégique pour pérenniser votre activité.",
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
