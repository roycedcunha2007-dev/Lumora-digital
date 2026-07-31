# Lumora Digital — Premium Studio Website

A world-class, animation-rich marketing site for **Lumora Digital**, built to feel
like the website of a premium digital agency. Dark, glassmorphic, cinematic — with
handcrafted motion on every section.

![Stack](https://img.shields.io/badge/Next.js-14-000) ![TS](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Tech stack

| Concern            | Choice                                             |
| ------------------ | -------------------------------------------------- |
| Framework          | **Next.js 14** (App Router) + **TypeScript**       |
| Styling            | **Tailwind CSS** + custom design tokens            |
| Animation          | **Framer Motion** (reveals, layout, gestures)      |
| Smooth scroll      | **Lenis** + **GSAP ScrollTrigger** sync            |
| Interactive BG     | Custom **Canvas** aurora + particle field          |
| Icons              | **lucide-react**                                   |

> **On Three.js:** the brief allows it "only where it genuinely enhances." A
> hand-tuned Canvas aurora delivers the same immersive, GPU-friendly depth at a
> fraction of the bundle size, so Three.js was intentionally left out. Drop it into
> `AuroraBackground` later if you want true 3D geometry.

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## 🧩 What's inside

A single-page experience composed of independent, reusable sections:

- **Loading screen** with animated progress
- **Custom cursor** (magnetic ring + dot, hover labels) — auto-disabled on touch
- **Scroll progress** bar + **Lenis** buttery smooth scroll
- **Sticky glass navbar** — transparent → solid, scroll-spy active link, mobile menu
- **Hero** — per-line reveal, pointer-parallax floating UI cards, animated stats, scroll cue
- **About** — mission/vision/promise, scroll-drawn **journey timeline**, core values
- **Why Choose Us** — 3D tilt cards with hover glow
- **Services** — expandable cards with feature lists (incl. future-service placeholders)
- **Process** — alternating, scroll-animated 7-step timeline
- **Portfolio** — filterable masonry grid, animated layout transitions, hover previews
- **Stats** — animated counters in a glass panel
- **Testimonials** — dual-row infinite marquee, pause on hover
- **Pricing** — 3 tiers, highlighted plan, expandable comparison table
- **Team** — tilt cards with reveal-on-hover socials
- **FAQ** — premium accordion
- **Contact** — animated form + details + map placeholder + business hours
- **Footer** — CTA band, link grid, newsletter, giant ambient wordmark
- **Floating WhatsApp** button with pulse + tooltip

---

## ✏️ Editing content

**All copy lives in one place:** [`lib/site.ts`](lib/site.ts).

Placeholders are wrapped in brackets like `[Business Email]`, `[Project Description]`,
`[$X,XXX]`. Search the project for `[` to find every value to replace. Key things to
set before launch:

- `site.name`, `site.tagline`, `site.email`, `site.phone`, `site.address`
- `site.whatsapp` — digits only, including country code (e.g. `15551234567`)
- `site.url` — your production domain (drives SEO metadata + sitemap)
- `services`, `projects`, `testimonials`, `pricing`, `team`, `faqs`

The contact form and newsletter are **front-end placeholders** — wire them to an API
route or email service (Resend, Formspree, etc.) before going live.

---

## 🎨 Design tokens

- Colors, shadows, keyframes → [`tailwind.config.ts`](tailwind.config.ts)
- Global utilities (`.glass`, `.text-gradient`, `.bg-grid`, cursor, scrollbar) → [`app/globals.css`](app/globals.css)

Brand palette: **Deep Navy** base · **Electric Blue** + **Purple** gradients · **Cyan** highlights.

---

## ♿ Performance & accessibility

- Fully static export (`○ (Static)`), ~161 kB first-load JS
- `prefers-reduced-motion` respected (smooth scroll + heavy motion disabled)
- Semantic landmarks, real heading hierarchy, focus states, ARIA labels
- SEO: dynamic metadata, Open Graph, Twitter cards, JSON-LD schema, `sitemap.xml`, `robots.txt`

---

## 📁 Structure

```
app/               layout, page, globals, sitemap, robots
components/
  effects/         Loader, CustomCursor, ScrollProgress, AuroraBackground, WhatsAppButton
  layout/          Navbar, Footer
  providers/       SmoothScroll (Lenis + GSAP)
  sections/        Hero, About, WhyChooseUs, Services, Process, Portfolio,
                   Stats, Testimonials, Pricing, Team, FAQ, Contact
  ui/              MagneticButton, TiltCard, Reveal, AnimatedHeading,
                   Counter, SectionHeading
lib/               site.ts (content), icons.ts, utils.ts
```
