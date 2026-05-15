# Shashank SJ — Portfolio

A production-grade personal portfolio for a backend software engineer.
Astro 4 islands · Three.js · GSAP · Lenis · Tailwind · TypeScript strict.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output → dist/
npm run preview   # serve the build locally
```

## Edit content

**All text lives in one file:** [`src/data/site.ts`](src/data/site.ts).
Update `personal`, `projects`, `experience`, `techStack`, etc. — that's it.

## Replace the resume

Drop your PDF at `public/resume.pdf` (overwrite the placeholder).
The Resume modal will pick it up automatically.

## Stack

| Concern        | Tool                                    |
| -------------- | --------------------------------------- |
| Framework      | Astro 4 (static, islands)               |
| Styling        | Tailwind CSS 3.4 (custom design tokens) |
| 3D             | Three.js r160 (particle galaxy + bloom) |
| Animations     | GSAP 3 + ScrollTrigger + SplitType      |
| Smooth scroll  | Lenis                                   |
| Language       | TypeScript strict                       |

## Project structure

```
src/
├── data/site.ts             ← single source of truth
├── components/
│   ├── three/HeroCanvas.tsx ← Three.js island (client:only)
│   ├── sections/            ← Hero, About, TechStack, Projects, Experience, Contact
│   ├── ui/                  ← Navbar, ProjectCard, ResumeModal, CustomCursor, MagneticButton
│   └── layout/BaseLayout.astro
├── scripts/motion.ts        ← Lenis + GSAP + reveals + magnetic + scroll progress
├── styles/global.css        ← Tailwind layers + scrollbar
└── pages/index.astro
```

## Performance

- Astro ships **zero JS by default**; Three.js + GSAP only load on the hero/components that need them.
- `client:only` for the 3D canvas (no SSR cost).
- `client:idle` for cursor + resume modal (load after main thread free).
- Particle count scales by viewport: 500 mobile → 2500 desktop.
- `prefers-reduced-motion` shuts down rotation, parallax, and reveals.
- Custom cursor and mouse parallax hidden on touch.

## Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
Drop the `dist/` folder onto Netlify, or:
```bash
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

Both are auto-detected as static Astro builds — no extra config needed.

## License

MIT — feel free to fork and adapt for your own portfolio.
