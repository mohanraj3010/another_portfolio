/**
 * portfolioData.ts
 *
 * Single source of truth for every section's content.
 * Types + data co-located for tight coupling.
 */

// ══════════════════════════════════════════════════
// Navigation
// ══════════════════════════════════════════════════
export interface NavLink {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: 'WORK', href: '#projects' },
  { label: 'ABOUT', href: '#about' },
  { label: 'STACK', href: '#skills' },
  { label: 'ACHIEVEMENTS', href: '#achievements' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'CONTACT', href: '#contact' },
]

export const navCta = {
  label: 'RESUME',
  href: '/resume.pdf',
  downloadName: 'Deepika_NB_Resume.pdf',
}

// ══════════════════════════════════════════════════
// Hero
// ══════════════════════════════════════════════════
export interface HeroData {
  /** Primary wordmark — set oversized, bleeds to edge */
  wordmark: string
  /** Italic accent word displayed beneath/beside the wordmark */
  accentWord: string
  /** Role descriptor — tracked-out, small */
  role: string
  /** Short punchy editorial tagline */
  tagline: string
  /** Pill badge metadata */
  pills: string[]
  /** Hero portrait image */
  heroImageSrc: string
  heroImageAlt: string
}

export const heroData: HeroData = {
  wordmark: 'DEEPIKA',
  accentWord: 'Developer',
  role: 'FULL-STACK DEVELOPER (MERN)',
  tagline: 'BUILDING PRODUCTS THAT ACTUALLY SHIP.',
  pills: ['BASED IN TAMIL NADU', "CSE '27 · CGPA 8.76", 'OPEN TO SWE INTERNSHIPS'],
  heroImageSrc: '/images/hero-portrait.webp',
  heroImageAlt: 'Portrait of Deepika N.B.',
}

// ══════════════════════════════════════════════════
// About
// ══════════════════════════════════════════════════
export interface AboutData {
  /** Editorial headline — set large, asymmetric. Words wrapped in * are italic-serif accent. */
  headline: string[]
  /** Tight editorial body — 2–3 short paragraphs, not a resume dump */
  body: string[]
  /** Featured stat callout — oversized animated element */
  statValue: string
  statLabel: string
  /** Secondary callout */
  stat2Value: string
  stat2Label: string
}

export const aboutData: AboutData = {
  headline: ['FROM CLASSROOM', 'TO', '*Codebase*'],
  body: [
    'I\u2019m a Computer Science Engineering undergraduate at Anna University\u2019s UCE Kanchipuram, building full-stack applications end-to-end with the MERN stack\u200A\u2014\u200AMongoDB, Express, React, and Node.js.',
    'My approach pairs strong CS fundamentals\u200A\u2014\u200Adata structures, algorithms, OOP\u200A\u2014\u200Awith the ability to ship real products. That discipline earned me a Department Topper title and the Highest CGPA Award in my placement training cohort.',
    'I treat every project like a product launch: it has to work, it has to scale, and it has to feel right.',
  ],
  statValue: '8.76',
  statLabel: 'CGPA',
  stat2Value: 'DEPT.',
  stat2Label: 'TOPPER',
}


// ══════════════════════════════════════════════════
// Education — editorial timeline
// ══════════════════════════════════════════════════
export interface EducationEntry {
  /** Editorial date label: "2027", "BEFORE THAT", etc. */
  label: string
  degree: string
  institution: string
  detail: string
  /** Optional accent — highlights primary entry */
  accent?: boolean
}

export const educationEntries: EducationEntry[] = [
  {
    label: '2027',
    degree: 'B.E. COMPUTER SCIENCE & ENGINEERING',
    institution: 'Anna University, University College of Engineering, Kanchipuram',
    detail: 'CGPA 8.76',
    accent: true,
  },
  {
    label: 'BEFORE THAT',
    degree: 'HSC Biology-Mathematics',
    institution: 'S.S.K.V. Girls Higher Secondary School',
    detail: '89.5%',
  },
]

// ══════════════════════════════════════════════════
// Projects
// ══════════════════════════════════════════════════
export interface Project {
  id: string
  /** Short display number: "01", "02", etc. */
  num: string
  title: string
  /** One-line editorial description — not a paragraph */
  oneliner: string
  tags: string[]
  imageSrc: string
  imageAlt: string
  github?: string
}

export const projects: Project[] = [
  {
    id: 'project-1',
    num: '01',
    title: 'STOCK PORTFOLIO TRACKER',
    oneliner: 'Real-time investment tracking with live data feeds and a responsive React dashboard.',
    tags: ['REACT.JS', 'NODE.JS'],
    imageSrc: '/images/project-stock.webp',
    imageAlt: 'Stock Portfolio Tracking Application interface',
    github: 'https://github.com/Deepika20053/share-serve',
  },
  {
    id: 'project-2',
    num: '02',
    title: 'LATECOMER MANAGEMENT SYSTEM',
    oneliner: 'Digital replacement for manual attendance registers — faculty dashboard with automated flagging.',
    tags: ['REACT.JS', 'NODE.JS', 'SQL'],
    imageSrc: '/images/project-latecomer.webp',
    imageAlt: 'Latecomer Management System dashboard',
    github: 'https://github.com/Deepika20053/college_latecomer_system',
  },
  {
    id: 'project-3',
    num: '03',
    title: 'TNPSC EXAM BOOKS APP',
    oneliner: 'Organized catalog of competitive exam study materials with category-wise search.',
    tags: ['REACT.JS', 'NODE.JS', 'MONGODB'],
    imageSrc: '/images/project-tnpsc.webp',
    imageAlt: 'TNPSC Exam Books Collection App',
    github: 'https://github.com/Deepika20053/tamilnadu-comets',
  },
]

// ══════════════════════════════════════════════════
// Achievements (replaces Experience — no internship yet)
// ══════════════════════════════════════════════════
export interface Achievement {
  /** Date or period label for the timeline */
  date: string
  title: string
  detail: string
  /** Optional accent — highlights one achievement */
  accent?: boolean
  /** Optional small tag shown beside the title (e.g. role) */
  tag?: string
}

export const achievements: Achievement[] = [
  {
    date: '2026',
    title: '2nd Prize — Hackfusion 2026',
    detail: 'National-level hackathon, Render track — finalist & runner-up.',
    tag: 'Team Lead',
    accent: true,
  },
  {
    date: '2024',
    title: 'Highest CGPA Award',
    detail: 'Placement Training Program — recognized for academic discipline under pressure.',
    accent: true,
  },
  {
    date: '2024',
    title: 'Department Topper',
    detail: 'CSE Department, Anna University UCE Kanchipuram — 8.76 CGPA.',
    accent: true,
  },
  {
    date: '2023',
    title: 'Third Prize — Chess',
    detail: 'Zonal Level Competition — strategy under timed constraints.',
  },
  {
    date: '2022',
    title: 'First Prize — English',
    detail: 'Conversation & Storytelling — communication as a competitive edge.',
  },
]

// ══════════════════════════════════════════════════
// Experience — work experience timeline
// ══════════════════════════════════════════════════
export interface ExperienceEntry {
  /** Date range label */
  dates: string
  /** City, State */
  location: string
  /** Job title */
  role: string
  /** Company name */
  company: string
  /** Tight bullet list of contributions */
  bullets: string[]
  /** Tech stack pill chips */
  stack: string[]
}

export const experienceEntries: ExperienceEntry[] = [
  {
    dates: '10 JUN 2026 — 10 JUL 2026',
    location: 'Chennai, Tamil Nadu',
    role: 'FULL-STACK PYTHON DEVELOPER INTERN',
    company: 'Approtech R&D Solutions',
    bullets: [
      'Developed and maintained internal tooling using Flask and React, reducing manual workflow overhead by 40%.',
      'Designed RESTful APIs with SQLAlchemy ORM and PostgreSQL, ensuring type-safe database interactions.',
      'Implemented real-time data synchronization features using WebSockets for live dashboard updates.',
      'Collaborated with senior engineers on code reviews, CI/CD pipeline optimization, and automated testing strategies.',
      'Contributed to architectural decisions for migrating legacy monolithic services to a modular service-oriented structure.',
    ],
    stack: ['Python', 'Flask', 'React', 'PostgreSQL', 'SQLAlchemy', 'WebSockets', 'Docker', 'GitHub Actions', 'Tailwind'],
  },
]

// ══════════════════════════════════════════════════
// Contact — final frame
// ══════════════════════════════════════════════════
export interface ContactLink {
  label: string
  href: string
  /** Display text for the link (e.g. the email address itself) */
  display: string
}

export interface ContactData {
  /** Editorial headline — words wrapped in * are italic-serif accent */
  headline: string[]
  links: ContactLink[]
  /** Small closing note */
  closing: string
}

export const contactData: ContactData = {
  headline: ["LET'S BUILD", '*Something*', 'TOGETHER.'],
  links: [
    {
      label: 'Email',
      href: 'mailto:deepikabhuvaneshwaran8@gmail.com',
      display: 'deepikabhuvaneshwaran8@gmail.com',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/Deepika20053',
      display: 'github.com/Deepika20053',
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/deepika-bhuvaneshwaran',
      display: 'linkedin.com/in/deepika-bhuvaneshwaran',
    },
  ],
  closing: '© 2025 Deepika N.B. — Designed & built from scratch.',
}

// ══════════════════════════════════════════════════
// Site Meta
// ══════════════════════════════════════════════════
export const siteMeta = {
  name: 'DEEPIKA N.B',
  role: 'Full-Stack Developer (MERN) / Computer Science Engineering Undergraduate',
  tagline: 'Computer Science Engineering Undergraduate',
  wordmark: 'DEEPIKA N.B.',
}
