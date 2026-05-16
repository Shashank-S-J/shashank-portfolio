// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH — all site content lives here.
//  Edit this file to update the portfolio. No other file should hold copy.
// ─────────────────────────────────────────────────────────────────────────────

export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail' | 'phone' | 'map';
};

export type TechItem = {
  name: string;
  category: 'Backend & Java' | 'AI & Search' | 'Cloud & DevOps' | 'Data & Monitoring' | 'Quality & Security';
  icon: string; // devicon class, e.g. "devicon-java-plain"
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  github: string | null;
  live: string | null;
  duration: string;
  featured: boolean;
  highlights: string[];
  type: 'work' | 'personal';
  /** Optional content category — drives a special badge/animation (e.g. AI projects get a shimmering AI tag). */
  kind?: 'ai';
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  duration: string;
  current: boolean;
  points: string[];
};

export type Education = {
  degree: string;
  institution: string;
  duration: string;
  detail: string;
};

export type Certification = {
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  topics: string[];
};

export type Stat = {
  value: string;
  label: string;
};

// ─── PERSONAL ────────────────────────────────────────────────────────────────
export const personal = {
  name: 'Shashank S J',
  shortName: 'Shashank',
  initials: 'SJ',
  title: 'Backend Software Engineer',
  tagline: 'Java · Backend Systems · Cloud & DevOps',
  location: 'Bengaluru, India',
  email: 'shashanksj6247@gmail.com',
  phone: '+91 97419 91065',
  github: 'https://github.com/Shashank-S-J',
  linkedin: 'https://linkedin.com/in/shashank-s-j-sasalu',
  resumeUrl: '/shashanksj.pdf',
  bio: `Software engineer with 2 years building scalable Java backends and ETL pipelines on AWS — shipping production systems that move 10,000+ records daily at 99.9% uptime. I care about clean APIs, observable systems, and infrastructure that stays boring in production.`,
  longBio: `Currently at Happiest Minds Technologies, working on FHIR R4–compliant healthcare data integration with Spring Boot, Apache Camel, and AWS EKS. Strong on microservices, Terraform IaC, CI/CD, and performance tuning across Hibernate/JPA + Redis caching. OCI 2025 Generative AI Professional. I write the unit tests I want to inherit.`,
} as const;

export const socials: SocialLink[] = [
  { label: 'GitHub',   href: personal.github,   icon: 'github' },
  { label: 'LinkedIn', href: personal.linkedin, icon: 'linkedin' },
  { label: 'Email',    href: `mailto:${personal.email}`, icon: 'mail' },
];

// ─── HEADLINE STATS (About section) ──────────────────────────────────────────
export const stats: Stat[] = [
  { value: '2+',     label: 'Years building backends' },
  { value: '10K+',   label: 'Records processed daily' },
  { value: '99.9%',  label: 'Production uptime' },
  { value: '85%+',   label: 'Unit-test coverage' },
  { value: '40%',    label: 'API latency cut' },
  { value: '60%',    label: 'Faster deploys (EKS)' },
];

// ─── TECH STACK ──────────────────────────────────────────────────────────────
export const techStack: TechItem[] = [
  // Backend & Java
  { name: 'Java',         category: 'Backend & Java', icon: 'devicon-java-plain' },
  { name: 'Spring Boot',  category: 'Backend & Java', icon: 'devicon-spring-plain' },
  { name: 'Spring MVC',   category: 'Backend & Java', icon: 'devicon-spring-plain' },
  { name: 'Hibernate',    category: 'Backend & Java', icon: 'devicon-hibernate-plain' },
  { name: 'REST APIs',    category: 'Backend & Java', icon: 'devicon-swagger-plain' },
  { name: 'Microservices',category: 'Backend & Java', icon: 'devicon-nginx-original' },
  { name: 'Apache Camel', category: 'Backend & Java', icon: 'devicon-apache-plain' },
  { name: 'OpenAPI',      category: 'Backend & Java', icon: 'devicon-swagger-plain' },

  // AI & Search (Retrieval-Augmented Generation stack from the EAKP project)
  { name: 'Spring AI',       category: 'AI & Search', icon: 'devicon-spring-plain' },
  { name: 'RAG Pipelines',   category: 'AI & Search', icon: 'devicon-spring-plain' },
  { name: 'LLM Integration', category: 'AI & Search', icon: 'devicon-openai-original' },
  { name: 'pgvector (HNSW)', category: 'AI & Search', icon: 'devicon-postgresql-plain' },
  { name: 'Hybrid Search',   category: 'AI & Search', icon: 'devicon-elasticsearch-plain' },
  { name: 'Groq / Mistral',  category: 'AI & Search', icon: 'devicon-openai-original' },
  { name: 'Ollama',          category: 'AI & Search', icon: 'devicon-ollama-original' },
  { name: 'Apache Tika',     category: 'AI & Search', icon: 'devicon-apache-plain' },
  { name: 'RabbitMQ',        category: 'AI & Search', icon: 'devicon-rabbitmq-plain' },
  { name: 'SSE Streaming',   category: 'AI & Search', icon: 'devicon-nginx-original' },

  // Cloud & DevOps
  { name: 'AWS',          category: 'Cloud & DevOps', icon: 'devicon-amazonwebservices-plain-wordmark' },
  { name: 'Docker',       category: 'Cloud & DevOps', icon: 'devicon-docker-plain' },
  { name: 'Kubernetes',   category: 'Cloud & DevOps', icon: 'devicon-kubernetes-plain' },
  { name: 'Terraform',    category: 'Cloud & DevOps', icon: 'devicon-terraform-plain' },
  { name: 'Jenkins',      category: 'Cloud & DevOps', icon: 'devicon-jenkins-plain' },
  { name: 'GitHub Actions', category: 'Cloud & DevOps', icon: 'devicon-githubactions-plain' },
  { name: 'Linux',        category: 'Cloud & DevOps', icon: 'devicon-linux-plain' },
  { name: 'Azure',        category: 'Cloud & DevOps', icon: 'devicon-azure-plain' },
  { name: 'OCI',          category: 'Cloud & DevOps', icon: 'devicon-oracle-original' },

  // Data & Monitoring
  { name: 'PostgreSQL',   category: 'Data & Monitoring', icon: 'devicon-postgresql-plain' },
  { name: 'MySQL',        category: 'Data & Monitoring', icon: 'devicon-mysql-plain' },
  { name: 'Redis',        category: 'Data & Monitoring', icon: 'devicon-redis-plain' },
  { name: 'Apache Kafka', category: 'Data & Monitoring', icon: 'devicon-apachekafka-original' },
  { name: 'Prometheus',   category: 'Data & Monitoring', icon: 'devicon-prometheus-original' },
  { name: 'Grafana',      category: 'Data & Monitoring', icon: 'devicon-grafana-original' },

  // Quality & Security
  { name: 'JUnit',        category: 'Quality & Security', icon: 'devicon-junit-plain' },
  { name: 'Mockito',      category: 'Quality & Security', icon: 'devicon-java-plain' },
  { name: 'JWT / OAuth',  category: 'Quality & Security', icon: 'devicon-jwt-plain' },
  { name: 'HIPAA',        category: 'Quality & Security', icon: 'devicon-linux-plain' },
];

export const techCategories = [
  'Backend & Java',
  'AI & Search',
  'Cloud & DevOps',
  'Data & Monitoring',
  'Quality & Security',
] as const;

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    title: 'Happiest Health',
    tagline: 'Healthcare Data Integration Platform',
    description:
      'FHIR R4–compliant ETL and transformation engine spanning 20+ resource types. Built the backend pipeline on AWS EKS with auto-scaling, Terraform-managed IaC, and end-to-end observability.',
    stack: ['Java', 'Spring Boot', 'Apache Camel', 'AWS EKS', 'PostgreSQL', 'Terraform', 'Docker'],
    github: null,
    live: null,
    duration: 'May 2024 – Present',
    featured: true,
    type: 'work',
    highlights: [
      '15,000+ records / hour with auto-scaling on EKS',
      'IaC provisioning time cut to under 10 minutes',
      '70% reduction in integration cost',
    ],
  },
  {
    title: 'Venture Backed (VBC)',
    tagline: 'Startup Accelerator Platform',
    description:
      'Full-stack platform with JWT/OAuth 2.0 auth, RBAC via Spring Security, and persona-based microservices (Investor, Startup, Admin). Azure Event Grid handles async notifications with retry and DLQ.',
    stack: ['Spring Boot', 'React', 'Azure', 'PostgreSQL', 'JWT', 'OpenAPI'],
    github: 'https://github.com/Shashank-S-J',
    live: null,
    duration: 'Nov 2024 – Mar 2025',
    featured: true,
    type: 'work',
    highlights: [
      'Persona-based microservice architecture',
      'OAuth 2.0 + RBAC with Spring Security',
      'Event-driven workflows on Azure Event Grid',
    ],
  },
  {
    title: 'EAKP — Enterprise AI Knowledge Platform',
    tagline: 'Production-Grade Multi-Tenant RAG Platform',
    description:
      'Self-hosted, production-deployed RAG platform — “ChatGPT for your company’s private data” with citations you can trust. 5 Spring Boot microservices (Java 21, virtual threads) behind a JWT-secured gateway, hybrid retrieval (pgvector HNSW + Postgres FTS) fused via Reciprocal Rank Fusion and LLM re-ranked, async ingestion through RabbitMQ → Tika → Mistral embeddings, with a faithfulness-gated hallucination guard. Streams answers token-by-token over SSE.',
    stack: [
      'Spring AI',
      'RAG',
      'pgvector',
      'Groq / Mistral',
      'RabbitMQ',
      'Java 21',
      'Spring Boot 3',
      'React 19',
      'Redis',
      'Docker',
    ],
    github: 'https://github.com/Shashank-S-J/EAKP-Enterprise-AI-Knowledge-Platform',
    live: 'https://eakp.vercel.app',
    duration: 'Personal Project · Live',
    featured: true,
    type: 'personal',
    kind: 'ai',
    highlights: [
      'Hybrid pgvector + FTS retrieval, RRF-fused & LLM re-ranked',
      'Faithfulness-gated semantic cache — hallucinations never poison results',
      'Async ingestion: RabbitMQ → Tika → Mistral embeddings, DLQ + retries',
    ],
  },
  {
    title: 'SpeedyGO',
    tagline: 'Event-Driven Microservices Platform',
    description:
      'Personal project — event-driven backend with Apache Kafka for async messaging, Eureka service discovery, Redis caching, and Prometheus monitoring. Fully containerized and shipped through Jenkins CI/CD.',
    stack: ['Spring Boot', 'Kafka', 'Redis', 'Docker', 'Eureka', 'Prometheus', 'Jenkins'],
    github: 'https://github.com/Shashank-S-J',
    live: null,
    duration: 'Personal Project',
    featured: false,
    type: 'personal',
    highlights: [
      'Apache Kafka async messaging backbone',
      '35% API latency reduction via Redis caching',
      'Prometheus dashboards + Jenkins CI/CD',
    ],
  },
  {
    title: 'Finance Dashboard API',
    tagline: 'Spring Boot REST API with JWT auth & role-based access',
    description:
      'Personal project — secure financial-records backend with JWT-authenticated REST endpoints, hierarchical role-based access (ADMIN > ANALYST > VIEWER), soft-delete semantics, and a monthly-trend analytics view. Documented end-to-end with OpenAPI 3 / Swagger UI.',
    stack: ['Java 17', 'Spring Boot 3.2', 'Spring Security', 'JWT', 'Spring Data JPA', 'H2', 'Swagger / OpenAPI 3', 'Lombok'],
    github: 'https://github.com/Shashank-S-J/finance-dashboard',
    live: null,
    duration: 'Personal Project',
    featured: false,
    type: 'personal',
    highlights: [
      'JWT auth + hierarchical RBAC (ADMIN / ANALYST / VIEWER)',
      'Soft-delete records & inclusive date-range filtering',
      'Swagger UI docs + 12-month trend analytics endpoint',
    ],
  },
];

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
export const experience: ExperienceItem[] = [
  {
    company: 'Happiest Minds Technologies',
    role: 'Software Engineer — Java & Backend Systems',
    location: 'Bengaluru, India',
    duration: 'Aug 2024 – Present',
    current: true,
    points: [
      'Built FHIR R4–compliant ETL pipelines on Spring Boot + Apache Camel, processing 10,000+ records daily on AWS with 99.9% uptime behind API Gateway-managed endpoints.',
      'Profiled and resolved Hibernate/JPA bottlenecks, tuned SQL, and introduced Redis caching — cutting API response times by 40%; instrumented Prometheus/Grafana dashboards.',
      'Designed a PII redaction and data-sanitisation system across logs, metrics, and data stores — 0 HIPAA incidents and 100% audit pass rate.',
      'Hardened CI/CD on Jenkins + GitHub Actions with Docker, EKS, and Terraform-managed infra — 95% deployment success and 60% faster releases.',
      'Wrote JUnit + Mockito suites at 85%+ coverage, maintained OpenAPI docs, and reduced MTTR by 45% through structured incident triage across 8+ Agile sprints.',
    ],
  },
  {
    company: 'Happiest Minds Technologies',
    role: 'Engineer Trainee — Java Full Stack',
    location: 'Bengaluru, India',
    duration: 'May 2024 – Aug 2024',
    current: false,
    points: [
      'Shipped production-grade REST APIs in Spring Boot with peer-reviewed code and 85%+ unit-test coverage.',
      'Built Hibernate/JPA data-access layers with PostgreSQL query optimisation — promoted to Software Engineer within 3 months.',
    ],
  },
];

// ─── EDUCATION ───────────────────────────────────────────────────────────────
export const education: Education = {
  degree: 'B.E. Computer Science',
  institution: 'Malnad College of Engineering (VTU), Hassan',
  duration: '2019 – 2023',
  detail: 'CGPA 8.25 · Graduated with Distinction',
};

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────
export const certifications: Certification[] = [
  {
    name: 'OCI 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    issued: 'Oct 2025',
    expires: 'Oct 2027',
    topics: ['Generative AI', 'OCI AI Services', 'LLMs', 'RAG', 'Vector DBs', 'Responsible AI'],
  },
  {
    name: 'Java Full Stack Development with AWS',
    issuer: 'Happiest Minds / StackRoute (NIIT)',
    issued: 'Nov 2024',
    topics: ['Spring Boot', 'Microservices', 'AWS', 'Terraform', 'CI/CD', 'PostgreSQL'],
  },
  {
    name: 'McKinsey.org Forward Program',
    issuer: 'McKinsey & Company',
    issued: 'Dec 2025',
    topics: ['Problem Solving', 'Critical Thinking', 'Systems Thinking', 'Communication'],
  },
];

// ─── NAV ─────────────────────────────────────────────────────────────────────
export const navLinks = [
  { label: 'About',      href: '#about' },
  { label: 'Stack',      href: '#stack' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
] as const;

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const seo = {
  title: `${personal.name} — ${personal.title}`,
  description: `${personal.title} in ${personal.location} building scalable Java/Spring Boot systems on AWS. ${personal.bio.slice(0, 100)}...`,
  ogImage: '/og-image.svg',
  url: 'https://shashanksj.dev',
  keywords: ['Backend Engineer', 'Java', 'Spring Boot', 'AWS', 'Microservices', 'Bangalore', 'FHIR', 'Kafka'],
} as const;
