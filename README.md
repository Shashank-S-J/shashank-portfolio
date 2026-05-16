<div align="center">

# Shashank S J

### Backend Software Engineer · Java · Spring Boot · AWS

**Bengaluru, India** &nbsp;·&nbsp; *Open to opportunities*

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-3b82f6?style=for-the-badge&logo=astro&logoColor=white)](https://shashanksj.sasalu.workers.dev/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shashank-s-j-sasalu)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shashank-S-J)
[![Email](https://img.shields.io/badge/Email-Contact-ea4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shashanksj6247@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-PDF-f59e0b?style=for-the-badge&logo=readthedocs&logoColor=white)](https://shashanksj.sasalu.workers.dev/shashanksj.pdf)

*I build backends that **stay boring in production.***

</div>

---

## About

Software engineer with **2+ years** building scalable Java backends and ETL pipelines on AWS — shipping production systems that move **10,000+ records daily at 99.9% uptime**.

Currently at **Happiest Minds Technologies**, working on FHIR R4–compliant healthcare data integration with Spring Boot, Apache Camel, and AWS EKS. I care about clean APIs, observable systems, and infrastructure that doesn't surprise you.

**OCI 2025 Generative AI Professional** · I write the unit tests I want to inherit.

---

## By the numbers

| 2+ | 10K+ | 99.9% | 85%+ | 40% | 60% |
|:-:|:-:|:-:|:-:|:-:|:-:|
| years building backends | records / day | production uptime | unit-test coverage | API latency cut | faster deploys (EKS) |

---

## What I'm good at

- **Java backend systems** — Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, Apache Camel, REST + OpenAPI
- **Cloud & infra** — AWS (EKS, ECS, S3, RDS, API Gateway), Azure, OCI, Terraform-managed IaC, Docker, Kubernetes
- **Data & streaming** — PostgreSQL, MySQL, Redis caching, Apache Kafka, RabbitMQ, pgvector + FTS hybrid search
- **AI / RAG** — Spring AI, LLM integration (Groq, Mistral, Ollama), retrieval pipelines, hallucination guards
- **DevOps & quality** — Jenkins, GitHub Actions, JUnit + Mockito (85%+), Prometheus + Grafana, structured logging
- **Security** — JWT / OAuth 2.0, RBAC, PII redaction, HIPAA-compliant data flows (0 incidents, 100% audit pass)

---

## Featured projects

### [EAKP — Enterprise AI Knowledge Platform](https://github.com/Shashank-S-J/EAKP-Enterprise-AI-Knowledge-Platform) &nbsp;·&nbsp; [Live ↗](https://eakp.vercel.app)
> Production-deployed, multi-tenant RAG platform — *"ChatGPT for your company's private data"* with citations you can trust.

- 5 Spring Boot microservices (**Java 21**, virtual threads) behind a JWT-secured gateway
- Hybrid retrieval: **pgvector HNSW + Postgres FTS** fused via **Reciprocal Rank Fusion**, then LLM re-ranked
- Async ingestion: **RabbitMQ → Apache Tika → Mistral embeddings**, with DLQ + retries
- **Faithfulness-gated semantic cache** — hallucinations never poison results
- Streams answers token-by-token over **Server-Sent Events**

`Spring AI` `RAG` `pgvector` `Groq / Mistral` `RabbitMQ` `Java 21` `Spring Boot 3` `React 19` `Redis` `Docker`

---

### Happiest Health — Healthcare Data Integration Platform &nbsp;·&nbsp; *Work*
> FHIR R4–compliant ETL and transformation engine spanning **20+ resource types**.

- **15,000+ records / hour** with auto-scaling on AWS EKS
- IaC provisioning time cut to **under 10 minutes** (Terraform)
- **70% reduction** in integration cost
- End-to-end observability with Prometheus + Grafana

`Java` `Spring Boot` `Apache Camel` `AWS EKS` `PostgreSQL` `Terraform` `Docker`

---

### Venture Backed (VBC) — Startup Accelerator Platform &nbsp;·&nbsp; *Work*
> Full-stack platform with persona-based microservices (Investor, Startup, Admin).

- **OAuth 2.0 + RBAC** via Spring Security
- Persona-based microservice architecture
- **Azure Event Grid** for async notifications with retry + DLQ

`Spring Boot` `React` `Azure` `PostgreSQL` `JWT` `OpenAPI`

---

### [SpeedyGO](https://github.com/Shashank-S-J) — Event-Driven Microservices &nbsp;·&nbsp; *Personal*
- **Apache Kafka** async messaging backbone
- **35% API latency reduction** via Redis caching
- Eureka service discovery, Prometheus dashboards, Jenkins CI/CD

`Spring Boot` `Kafka` `Redis` `Docker` `Eureka` `Prometheus` `Jenkins`

---

### [Finance Dashboard API](https://github.com/Shashank-S-J/finance-dashboard) &nbsp;·&nbsp; *Personal*
- **JWT auth** + hierarchical RBAC (ADMIN / ANALYST / VIEWER)
- Soft-delete records, inclusive date-range filtering
- **Swagger / OpenAPI 3** docs + 12-month trend analytics endpoint

`Java 17` `Spring Boot 3.2` `Spring Security` `JWT` `Spring Data JPA` `H2` `Swagger`

---

## Experience

**Software Engineer — Java & Backend Systems** &nbsp;·&nbsp; *Happiest Minds Technologies* &nbsp;·&nbsp; Aug 2024 – Present

- Built **FHIR R4–compliant ETL pipelines** on Spring Boot + Apache Camel, processing **10K+ records daily** on AWS at 99.9% uptime
- Profiled and resolved Hibernate/JPA bottlenecks, tuned SQL, introduced Redis caching — **40% latency cut**
- Designed PII redaction & data-sanitisation system — **0 HIPAA incidents, 100% audit pass**
- Hardened CI/CD on Jenkins + GitHub Actions with Docker, EKS, Terraform — **95% deployment success, 60% faster releases**
- Wrote JUnit + Mockito suites at **85%+ coverage**, reduced MTTR by 45% across 8+ Agile sprints

**Engineer Trainee — Java Full Stack** &nbsp;·&nbsp; *Happiest Minds Technologies* &nbsp;·&nbsp; May 2024 – Aug 2024

- Shipped production-grade REST APIs with 85%+ test coverage — *promoted to Software Engineer within 3 months*

---

## Education & certifications

**B.E. Computer Science** &nbsp;·&nbsp; *Malnad College of Engineering (VTU)* &nbsp;·&nbsp; 2019 – 2023 &nbsp;·&nbsp; **CGPA 8.25, Distinction**

- **OCI 2025 Certified Generative AI Professional** — Oracle (Oct 2025)
- **Java Full Stack Development with AWS** — Happiest Minds / StackRoute (Nov 2024)
- **McKinsey.org Forward Program** — McKinsey & Company (Dec 2025)

---

## About this repository

This repo is the source for my portfolio site at **[shashanksj.dev](https://shashanksj.sasalu.workers.dev/)** — built and deployed by the engineer it represents.

| Concern | Stack |
|---|---|
| Framework | Astro 4 (static, islands) |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| 3D | Three.js r160 (hero terminal) |
| Animation | GSAP 3 + ScrollTrigger + SplitType |
| Smooth scroll | Lenis |
| Language | TypeScript strict |
| Hosting | Cloudflare Workers (static assets) |
| CI/CD | GitHub Actions → `wrangler deploy` |

**Why Astro?** Ships **zero JS by default**. Three.js + GSAP load only on the islands that need them. 100/100 Lighthouse targets, under 50 KB initial JS on the landing route.

See [`portfolio/README.md`](portfolio/README.md) for dev setup, [`DEPLOY.md`](DEPLOY.md) for deployment notes.

---

## Get in touch

The fastest way to reach me:

- **Email** — [shashanksj6247@gmail.com](mailto:shashanksj6247@gmail.com)
- **LinkedIn** — [/in/shashank-s-j-sasalu](https://linkedin.com/in/shashank-s-j-sasalu)
- **Phone** — +91 97419 91065
- **Resume** — [shashanksj.dev/shashanksj.pdf](https://shashanksj.sasalu.workers.dev//shashanksj.pdf)

<sub>Hiring backend engineers? I'd love to talk about your team, your incidents, and what you'd like to stop worrying about.</sub>
