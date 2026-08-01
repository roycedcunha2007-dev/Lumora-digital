/* ============================================================
   LUMORA DIGITAL — Central content source
   All copy is placeholder. Swap the [bracketed] values for
   real business details before launch.
   ============================================================ */

export const site = {
  name: "Lumora Digital",
  tagline: "[Insert tagline here]",
  description:
    "Lumora Digital helps local businesses establish a powerful online presence through affordable, beautiful and high-performing websites.",
  url: "https://lumoradigital.example", // [Production URL]
  email: "[business@lumoradigital.com]",
  phone: "[+00 000 000 0000]",
  whatsapp: "0000000000", // [WhatsApp number, digits only, incl. country code]
  address: "[123 Placeholder Street, Suite 000, City, Country]",
  hours: [
    { day: "Monday – Friday", time: "[09:00 – 18:00]" },
    { day: "Saturday", time: "[10:00 – 15:00]" },
    { day: "Sunday", time: "[Closed]" },
  ],
  socials: [
    { label: "Instagram", href: "#", handle: "@lumoradigital" },
    { label: "Dribbble", href: "#", handle: "lumora" },
    { label: "LinkedIn", href: "#", handle: "lumora-digital" },
    { label: "X", href: "#", handle: "@lumora" },
  ],
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const heroStats = [
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 60, suffix: "fps", label: "Buttery interactions" },
];

export const coreValues = [
  {
    title: "Craft over templates",
    body: "Every pixel is intentional. We design and build from scratch — never from a cookie-cutter theme.",
  },
  {
    title: "Speed is a feature",
    body: "Beautiful and fast are not a trade-off. We obsess over performance budgets and buttery motion.",
  },
  {
    title: "Radical clarity",
    body: "Clear timelines, transparent pricing, honest communication. You always know where things stand.",
  },
  {
    title: "Partners, not vendors",
    body: "We invest in your outcomes. Your growth is the metric we actually care about.",
  },
];

export const journey = [
  {
    year: "[2021]",
    title: "The spark",
    body: "[Company Story] — Two builders set out to give small businesses agency-grade websites without the agency price tag.",
  },
  {
    year: "[2022]",
    title: "First 25 launches",
    body: "[Milestone] — Word of mouth turned a side project into a full studio serving clients across multiple industries.",
  },
  {
    year: "[2023]",
    title: "A design language",
    body: "[Milestone] — We codified our system: motion, depth and clarity that make every project feel unmistakably premium.",
  },
  {
    year: "[2024]",
    title: "Going global",
    body: "[Milestone] — Remote-first and borderless, we now craft experiences for founders on multiple continents.",
  },
  {
    year: "[Today]",
    title: "Just getting started",
    body: "[Vision] — We are building the studio we always wished existed. The best work is still ahead.",
  },
];

export type Service = {
  id: string;
  title: string;
  blurb: string;
  features: string[];
  icon: string;
};

export const services: Service[] = [
  {
    id: "design",
    title: "Website Design",
    blurb:
      "Distinctive, brand-led interfaces designed to make you look like the category leader.",
    features: ["Art direction", "Design systems", "Wireframe → hi-fi", "Motion language"],
    icon: "PenTool",
  },
  {
    id: "development",
    title: "Website Development",
    blurb:
      "Hand-built, blazing-fast front-ends engineered for scale, stability and clean code.",
    features: ["Next.js / React", "Headless CMS", "Clean architecture", "60fps animation"],
    icon: "Code2",
  },
  {
    id: "responsive",
    title: "Responsive Design",
    blurb:
      "Pixel-perfect from ultrawide monitors down to the smallest phone — never a broken layout.",
    features: ["Mobile-first", "Fluid grids", "Touch-ready", "Cross-browser"],
    icon: "MonitorSmartphone",
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    blurb:
      "Research-driven experiences that turn visitors into customers with effortless flows.",
    features: ["User journeys", "Prototyping", "Accessibility", "Conversion focus"],
    icon: "Sparkles",
  },
  {
    id: "maintenance",
    title: "Website Maintenance",
    blurb:
      "Ongoing care so your site stays fast, secure and fresh — without you lifting a finger.",
    features: ["Updates & backups", "Security patches", "Content edits", "Uptime monitoring"],
    icon: "ShieldCheck",
  },
  {
    id: "seo",
    title: "SEO Optimization",
    blurb:
      "Technical and on-page SEO baked in so the right customers actually find you.",
    features: ["Core Web Vitals", "Structured data", "Keyword strategy", "Analytics"],
    icon: "TrendingUp",
  },
  {
    id: "future-1",
    title: "[Future Service]",
    blurb: "[Placeholder] — a new offering is on the way. Tell us what you need most.",
    features: ["[Feature]", "[Feature]", "[Feature]", "[Feature]"],
    icon: "Rocket",
  },
  {
    id: "future-2",
    title: "[Future Service]",
    blurb: "[Placeholder] — reserved for an upcoming capability from the Lumora studio.",
    features: ["[Feature]", "[Feature]", "[Feature]", "[Feature]"],
    icon: "Wand2",
  },
];

export const whyChooseUs = [
  {
    title: "Design that sells",
    body: "Beautiful is table stakes. Our interfaces are engineered to convert browsers into buyers.",
    icon: "Gem",
  },
  {
    title: "Truly affordable",
    body: "Agency-grade craft at a price local businesses can actually justify. No bloated retainers.",
    icon: "Wallet",
  },
  {
    title: "Lightning performance",
    body: "Sub-second loads and 60fps motion. Speed that Google — and your customers — reward.",
    icon: "Zap",
  },
  {
    title: "Built to grow",
    body: "Clean, modular code that scales with you. Add pages, products and features with ease.",
    icon: "Layers",
  },
  {
    title: "Real partnership",
    body: "One dedicated team, direct communication, and honest advice from kickoff to launch and beyond.",
    icon: "HeartHandshake",
  },
  {
    title: "Obsessed with detail",
    body: "The micro-interactions others skip are exactly where we spend our time. It shows.",
    icon: "MousePointerClick",
  },
];

export const process = [
  {
    step: "01",
    title: "Discovery",
    body: "We dig into your goals, audience and market to define what success actually looks like.",
    icon: "Search",
  },
  {
    step: "02",
    title: "Planning",
    body: "Sitemap, strategy and scope. A clear roadmap so there are zero surprises down the line.",
    icon: "Map",
  },
  {
    step: "03",
    title: "Design",
    body: "We craft a distinctive visual language and pixel-perfect screens you'll be proud of.",
    icon: "Palette",
  },
  {
    step: "04",
    title: "Development",
    body: "Hand-built, performant and accessible. Your design brought to life, exactly as intended.",
    icon: "Code2",
  },
  {
    step: "05",
    title: "Testing",
    body: "Cross-device, cross-browser and performance QA until everything is flawless.",
    icon: "Bug",
  },
  {
    step: "06",
    title: "Launch",
    body: "A smooth, stress-free go-live with all the SEO and analytics wired up from day one.",
    icon: "Rocket",
  },
  {
    step: "07",
    title: "Support",
    body: "We stick around. Ongoing care, iteration and growth long after the confetti settles.",
    icon: "LifeBuoy",
  },
];



export const pricing = [
  {
    id: "starter",
    name: "Starter",
    price: "[$X,XXX]",
    cadence: "one-time",
    tagline: "For a striking first impression.",
    highlight: false,
    features: [
      "Up to 3 pages",
      "Custom responsive design",
      "Core animations",
      "Basic SEO setup",
      "Contact form",
      "2 rounds of revisions",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "[$X,XXX]",
    cadence: "one-time",
    tagline: "Our most popular package.",
    highlight: true,
    features: [
      "Up to 8 pages",
      "Premium bespoke design",
      "Advanced scroll animations",
      "Full on-page SEO",
      "CMS integration",
      "Performance optimization",
      "4 rounds of revisions",
      "30 days support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "[$XX,XXX]",
    cadence: "one-time",
    tagline: "The full flagship experience.",
    highlight: false,
    features: [
      "Unlimited pages",
      "Signature art direction",
      "3D & immersive motion",
      "E-commerce ready",
      "Advanced SEO & analytics",
      "Priority delivery",
      "Unlimited revisions",
      "90 days support & care",
    ],
  },
];

export const comparison = {
  features: [
    "Custom design",
    "Responsive layouts",
    "Scroll animations",
    "SEO optimization",
    "CMS integration",
    "E-commerce",
    "3D / immersive motion",
    "Ongoing support",
  ],
  plans: [
    { name: "Starter", values: [true, true, "Core", "Basic", false, false, false, "—"] },
    { name: "Business", values: [true, true, "Advanced", "Full", true, "Add-on", false, "30 days"] },
    { name: "Premium", values: [true, true, "Signature", "Advanced", true, true, true, "90 days"] },
  ],
};

export const faqs = [
  {
    q: "How long does a typical project take?",
    a: "[Placeholder] — Most sites launch in 3–6 weeks depending on scope. We'll give you a precise timeline after the discovery call.",
  },
  {
    q: "Do you work with businesses outside my city?",
    a: "[Placeholder] — Absolutely. We're remote-first and have partnered with clients across multiple countries and time zones.",
  },
  {
    q: "What do you need from me to get started?",
    a: "[Placeholder] — Just your goals, any brand assets you have, and a short kickoff call. We guide you through every step.",
  },
  {
    q: "Will my website be fast and mobile-friendly?",
    a: "[Placeholder] — Always. Every build is mobile-first, accessible and optimized for Core Web Vitals and 60fps motion.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "[Placeholder] — Yes. We offer flexible care plans for updates, backups, security and content changes.",
  },
  {
    q: "What if I need something not listed here?",
    a: "[Placeholder] — Just ask. Our services grow with our clients — tell us what you need and we'll craft a solution.",
  },
];

export const team = [
  {
    name: "[Founder Name]",
    role: "Founder & Creative Director",
    bio: "[Bio] — Sets the vision and guards the craft across every project.",
    initials: "FN",
    accent: "from-electric-500 to-purple-500",
    socials: ["LinkedIn", "Dribbble", "X"],
  },
  {
    name: "[Developer Name]",
    role: "Lead Developer",
    bio: "[Bio] — Turns beautiful designs into fast, resilient, clean code.",
    initials: "DN",
    accent: "from-cyan-500 to-electric-500",
    socials: ["GitHub", "LinkedIn", "X"],
  },
  {
    name: "[Designer Name]",
    role: "Product Designer",
    bio: "[Bio] — Crafts the interactions and details that make it all feel alive.",
    initials: "DS",
    accent: "from-purple-500 to-cyan-500",
    socials: ["Dribbble", "Instagram", "LinkedIn"],
  },
];

export const stats = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 90, suffix: "+", label: "Happy clients" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 250, suffix: "+", label: "5-star reviews" },
];
