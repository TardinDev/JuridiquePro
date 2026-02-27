import {
  FileText,
  Users,
  Scale,
  ClipboardCheck,
  ShieldCheck,
  HeadphonesIcon,
  Building2,
  Briefcase,
  Receipt,
  MapPin,
  type LucideIcon,
} from "lucide-react"

// ── Services (existants enrichis) ────────────────────────────
export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  features: string[]
  startingPrice?: string
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
      "SARL, SAS, SASU, SA, SCI, EURL",
      "Dépôt du capital & immatriculation",
      "Publication d'annonce légale",
      "Immatriculation au Guichet Unique",
      "Garantie anti-rejet du greffe",
    ],
    startingPrice: "0",
  },
  {
    id: "micro-entreprise",
    title: "Micro-entreprise",
    description:
      "Toutes les formalités liées à votre entreprise individuelle sur le guichet unique INPI : création, modification et cessation d'activité.",
    icon: Users,
    features: [
      "Déclaration d'activité complète",
      "Immatriculation sur l'INPI",
      "Obtention Kbis et SIRET",
      "Modification d'activité",
      "Cessation d'activité",
      "Conseil URSSAF & optimisation",
    ],
    startingPrice: "59",
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
      "Transformation de société",
      "Augmentation de capital",
    ],
    startingPrice: "59",
  },
  {
    id: "formalites-juridiques",
    title: "Formalités juridiques",
    description:
      "Prise en charge complète de vos obligations légales et administratives pour sociétés et entreprises individuelles.",
    icon: ClipboardCheck,
    features: [
      "Approbation des comptes",
      "Publication légale (JAL)",
      "Dépôt au greffe",
      "Déclaration des bénéficiaires effectifs",
      "Dissolution & liquidation",
      "Radiation d'entreprise",
    ],
    startingPrice: "59",
  },
  {
    id: "domiciliation",
    title: "Domiciliation commerciale",
    description:
      "Une adresse professionnelle prestigieuse pour le siège social de votre entreprise, avec gestion du courrier et services associés.",
    icon: MapPin,
    features: [
      "Adresse de siège social",
      "Réexpédition du courrier",
      "Numérisation des documents",
      "Salle de réunion sur demande",
      "Disponible pour toutes formes juridiques",
      "Adresses à Lyon & Nice",
    ],
    startingPrice: "19",
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
      "Veille réglementaire",
      "Archivage numérique",
    ],
    startingPrice: "29",
  },
  {
    id: "comptabilite",
    title: "Comptabilité",
    description:
      "Service comptable complet pour votre entreprise : tenue des comptes, déclarations fiscales et bilans annuels par des experts dédiés.",
    icon: Receipt,
    features: [
      "Tenue de la comptabilité",
      "Déclarations fiscales (TVA, IS, IR)",
      "Bilan & compte de résultat",
      "Logiciel de facturation inclus",
      "Expert-comptable dédié",
      "Tableau de bord financier",
    ],
    startingPrice: "39",
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
      "Assistance téléphonique",
      "Accompagnement personnalisé",
    ],
  },
]

// ── Pricing ──────────────────────────────────────────────────
export interface PricingPlan {
  name: string
  price: string
  suffix?: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
  cta: string
}

export interface PricingCategory {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  adminFees?: string
  plans: PricingPlan[]
}

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: "creation-societe",
    title: "Création de société",
    subtitle: "SASU, EURL, SAS, SARL, SCI",
    icon: FileText,
    adminFees: "Frais administratifs (greffe + annonce légale) : ~190 € en sus",
    plans: [
      {
        name: "Basique",
        price: "0",
        suffix: "HT",
        description: "L'essentiel pour créer votre société vous-même",
        features: [
          "Génération des statuts",
          "Dossier complet",
          "Publication annonce légale",
          "Immatriculation Guichet Unique",
          "Garantie anti-rejet du greffe",
          "Accompagnement jusqu'au Kbis",
        ],
        cta: "Choisir",
      },
      {
        name: "Standard",
        price: "99",
        suffix: "HT",
        description: "Délégation complète avec un spécialiste dédié",
        features: [
          "Génération des statuts",
          "Dossier complet",
          "Publication annonce légale",
          "Immatriculation Guichet Unique",
          "Garantie anti-rejet du greffe",
          "Accompagnement jusqu'au Kbis",
          "RDV avec spécialiste dédié",
          "Délégation complète du dossier",
        ],
        highlighted: true,
        badge: "Recommandé",
        cta: "Choisir",
      },
      {
        name: "Express",
        price: "199",
        suffix: "HT",
        description: "Traitement prioritaire en 24h avec assistance illimitée",
        features: [
          "Génération des statuts",
          "Dossier complet",
          "Publication annonce légale",
          "Immatriculation Guichet Unique",
          "Garantie anti-rejet du greffe",
          "Accompagnement jusqu'au Kbis",
          "RDV avec spécialiste dédié",
          "Délégation complète du dossier",
          "Traitement prioritaire 24h",
          "Assistance illimitée (tél, mail, chat)",
        ],
        cta: "Choisir",
      },
    ],
  },
  {
    id: "micro-entreprise",
    title: "Création micro-entreprise",
    subtitle: "Auto-entrepreneur & entreprise individuelle",
    icon: Users,
    plans: [
      {
        name: "Standard",
        price: "59",
        suffix: "HT",
        description: "Immatriculation complète de votre micro-entreprise",
        features: [
          "Déclaration d'activité complète",
          "Dossier juridique complet",
          "Immatriculation Guichet Unique",
          "Garantie anti-rejet",
          "Obtention Kbis et SIRET",
        ],
        cta: "Choisir",
      },
      {
        name: "Express",
        price: "99",
        suffix: "HT",
        description: "Création accélérée avec obtention ACRE",
        features: [
          "Déclaration d'activité complète",
          "Dossier juridique complet",
          "Immatriculation Guichet Unique",
          "Garantie anti-rejet",
          "Obtention Kbis et SIRET",
          "Traitement express 24h",
          "Assistance illimitée",
          "Obtention ACRE",
        ],
        highlighted: true,
        badge: "Populaire",
        cta: "Choisir",
      },
    ],
  },
  {
    id: "modification-statuts",
    title: "Modification de statuts",
    subtitle: "Changements juridiques pour votre société",
    icon: Scale,
    adminFees: "Frais de greffe et annonce légale en sus selon la modification",
    plans: [
      {
        name: "Changement de dirigeant",
        price: "59",
        suffix: "HT",
        description: "Modification de la direction de votre société",
        features: [
          "Rédaction du PV d'assemblée",
          "Mise à jour des statuts",
          "Publication annonce légale",
          "Dépôt au greffe",
          "Accompagnement spécialiste",
        ],
        cta: "Choisir",
      },
      {
        name: "Transfert de siège",
        price: "79",
        suffix: "HT",
        description: "Changement d'adresse du siège social",
        features: [
          "Rédaction du PV d'assemblée",
          "Mise à jour des statuts",
          "Publication annonce légale",
          "Dépôt au greffe",
          "Radiation ancien greffe si besoin",
          "Accompagnement spécialiste",
        ],
        highlighted: true,
        badge: "Populaire",
        cta: "Choisir",
      },
      {
        name: "Cession de parts",
        price: "99",
        suffix: "HT",
        description: "Transfert de parts sociales ou actions",
        features: [
          "Rédaction acte de cession",
          "Mise à jour des statuts",
          "PV d'assemblée",
          "Enregistrement aux impôts",
          "Dépôt au greffe",
          "Publication annonce légale",
          "Accompagnement complet",
        ],
        cta: "Choisir",
      },
    ],
  },
  {
    id: "domiciliation",
    title: "Domiciliation commerciale",
    subtitle: "Adresse professionnelle à Lyon ou Nice",
    icon: MapPin,
    plans: [
      {
        name: "Micro-entreprise",
        price: "19",
        suffix: "HT/mois",
        description: "Adresse professionnelle pour auto-entrepreneurs",
        features: [
          "Adresse de siège social",
          "Réexpédition courrier 1x/semaine",
          "Numérisation sur demande",
          "Attestation de domiciliation",
          "Sans engagement (préavis 1 mois)",
        ],
        cta: "Choisir",
      },
      {
        name: "Société",
        price: "29",
        suffix: "HT/mois",
        description: "Domiciliation complète pour sociétés",
        features: [
          "Adresse de siège social",
          "Réexpédition courrier 2x/semaine",
          "Numérisation automatique",
          "Attestation de domiciliation",
          "Salle de réunion (2h/mois)",
          "Ligne téléphonique dédiée",
          "Sans engagement (préavis 1 mois)",
        ],
        highlighted: true,
        badge: "Recommandé",
        cta: "Choisir",
      },
    ],
  },
  {
    id: "comptabilite",
    title: "Comptabilité",
    subtitle: "Gestion comptable et fiscale pour votre entreprise",
    icon: Receipt,
    plans: [
      {
        name: "Essentiel",
        price: "39",
        suffix: "HT/mois",
        description: "Comptabilité de base pour les petites structures",
        features: [
          "Tenue de la comptabilité",
          "Déclarations de TVA",
          "Bilan & compte de résultat",
          "Logiciel de facturation inclus",
          "Tableau de bord financier",
        ],
        cta: "Choisir",
      },
      {
        name: "Premium",
        price: "69",
        suffix: "HT/mois",
        description: "Comptabilité complète avec expert dédié",
        features: [
          "Tenue de la comptabilité",
          "Déclarations de TVA",
          "Bilan & compte de résultat",
          "Logiciel de facturation inclus",
          "Tableau de bord financier",
          "Expert-comptable dédié",
          "Déclarations fiscales (IS, IR)",
          "Conseil optimisation fiscale",
          "Assistance illimitée",
        ],
        highlighted: true,
        badge: "Recommandé",
        cta: "Choisir",
      },
    ],
  },
  {
    id: "dissolution",
    title: "Dissolution & fermeture",
    subtitle: "Fermeture de votre société en toute conformité",
    icon: ClipboardCheck,
    plans: [
      {
        name: "Dissolution",
        price: "59",
        suffix: "HT",
        description: "Dissolution de votre société",
        features: [
          "Rédaction PV de dissolution",
          "Publication annonce légale",
          "Dépôt au greffe",
          "Accompagnement spécialiste",
        ],
        cta: "Choisir",
      },
      {
        name: "Dissolution + Liquidation",
        price: "149",
        suffix: "HT",
        description: "Dissolution et liquidation complètes",
        features: [
          "Rédaction PV de dissolution",
          "Publication annonce légale dissolution",
          "Comptes de liquidation",
          "Publication annonce légale liquidation",
          "Radiation au greffe",
          "Accompagnement complet",
          "Assistance illimitée",
        ],
        highlighted: true,
        badge: "Complet",
        cta: "Choisir",
      },
    ],
  },
]

// ── Services complémentaires (affichés séparément) ───────────
export interface ComplementaryService {
  title: string
  price: string
  suffix?: string
  icon: LucideIcon
}

export const COMPLEMENTARY_SERVICES: ComplementaryService[] = [
  { title: "Approbation des comptes", price: "49", suffix: "HT", icon: ClipboardCheck },
  { title: "Publication légale (JAL)", price: "149", suffix: "HT", icon: FileText },
  { title: "Dépôt de capital social", price: "0", suffix: "HT", icon: Building2 },
  { title: "Déclaration bénéficiaires effectifs", price: "29", suffix: "HT", icon: ShieldCheck },
  { title: "Contrat de travail (CDI/CDD)", price: "49", suffix: "HT", icon: Briefcase },
  { title: "Conditions générales de vente", price: "39", suffix: "HT", icon: FileText },
]

// ── Process Steps ────────────────────────────────────────────
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
      "Échange approfondi sur votre projet, vos objectifs et votre situation pour définir la meilleure stratégie.",
  },
  {
    number: "02",
    title: "Étude Personnalisée",
    description:
      "Analyse complète de votre dossier et élaboration d'un plan d'action sur mesure adapté à vos besoins.",
  },
  {
    number: "03",
    title: "Réalisation & Formalités",
    description:
      "Prise en charge intégrale des démarches administratives et juridiques nécessaires à votre projet.",
  },
  {
    number: "04",
    title: "Suivi Continu",
    description:
      "Accompagnement post-création avec un suivi régulier pour garantir la réussite de votre activité.",
  },
]

// ── Stats ────────────────────────────────────────────────────
export interface Stat {
  value: string
  suffix: string
  label: string
}

export const STATS: Stat[] = [
  { value: "15", suffix: "", label: "ans d'expérience" },
  { value: "500", suffix: "+", label: "entreprises créées" },
  { value: "98", suffix: "%", label: "de satisfaction" },
]

// ── Testimonials ─────────────────────────────────────────────
export interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sophie Martin",
    role: "Fondatrice, Atelier Créatif",
    content:
      "Grâce à ce cabinet, j'ai pu créer mon entreprise en toute sérénité. Un accompagnement exemplaire du début à la fin.",
    rating: 5,
  },
  {
    name: "Karim Benali",
    role: "Gérant, KB Consulting",
    content:
      "Le professionnalisme et la réactivité sont remarquables. Toutes mes formalités ont été gérées en un temps record.",
    rating: 5,
  },
  {
    name: "Marie Dupont",
    role: "Auto-Entrepreneuse",
    content:
      "Je recommande vivement ! Les conseils juridiques m'ont permis d'optimiser mon statut et de démarrer dans les meilleures conditions.",
    rating: 5,
  },
  {
    name: "Thomas Laurent",
    role: "Co-fondateur, TechStart",
    content:
      "Un vrai gain de temps et d'énergie. La partie administrative a été prise en charge pour que je me concentre sur mon business.",
    rating: 5,
  },
]

// ── FAQ ──────────────────────────────────────────────────────
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
    question: "Combien coûte la création d'une entreprise ?",
    answer:
      "La création de société commence dès 0 € HT (hors frais administratifs d'environ 190 €). La micro-entreprise est à partir de 59 € HT. Nous proposons des forfaits transparents : Basique, Standard et Express selon le niveau d'accompagnement souhaité. Consultez notre page tarifs pour plus de détails.",
  },
  {
    question: "Intervenez-vous sur toute la France ?",
    answer:
      "Oui, nous accompagnons entrepreneurs et dirigeants de sociétés partout en France. Avec nos bureaux à Vénissieux (Lyon) et Nice, nous couvrons tout le territoire grâce à nos outils digitaux et au guichet unique INPI.",
  },
  {
    question: "Proposez-vous un suivi après la création ?",
    answer:
      "Absolument. Que vous soyez micro-entrepreneur ou dirigeant de société, nous assurons un suivi continu : mise à jour de vos obligations, modifications statutaires, comptabilité et conseil stratégique pour pérenniser votre activité.",
  },
  {
    question: "Proposez-vous la domiciliation commerciale ?",
    answer:
      "Oui, nous proposons des adresses de domiciliation à Lyon et Nice à partir de 19 € HT/mois pour les micro-entreprises et 29 € HT/mois pour les sociétés. Ce service inclut la réexpédition du courrier, la numérisation des documents et une attestation de domiciliation.",
  },
]

// ── Locations ────────────────────────────────────────────────
export interface Location {
  city: string
  address: string
  postalCode: string
  description: string
}

export const LOCATIONS: Location[] = [
  {
    city: "Lyon - Vénissieux",
    address: "37 Avenue Jean Cagne",
    postalCode: "69200 Vénissieux",
    description: "Siège social — Région Auvergne-Rhône-Alpes",
  },
  {
    city: "Nice",
    address: "13 Avenue Cagnoli",
    postalCode: "06100 Nice",
    description: "Établissement — Région Provence-Alpes-Côte d'Azur",
  },
]

// ── Navigation ───────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "/services" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Témoignages", href: "/temoignages" },
  { label: "Notre approche", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const

// ── Company ──────────────────────────────────────────────────
export const COMPANY = {
  name: "LC",
  fullName: "Oyane Nze Clodia",
  siren: "999 885 171",
  siret: "999 885 171 00010",
  ape: "8211Z",
  email: "nze.claudia@yahoo.fr",
  phone: "+33 7 58 74 56 23",
  linkedin: "https://www.linkedin.com/in/clodia-oyane-nze-35b0681ba",
  instagram: "https://www.instagram.com/charlynoyane",
  tagline: "Votre vision. Notre protection juridique.",
  description:
    "Votre partenaire de confiance pour la création d'entreprise, les formalités juridiques et l'accompagnement administratif.",
} as const
