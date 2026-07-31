import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand system
        navy: {
          950: "#000000",
          900: "#050509",
          800: "#0a0c16",
          700: "#111a37",
          600: "#182448",
        },
        // MONOCHROME PREMIUM PALETTE
        // No hue anywhere — "electric", "purple" and "cyan" are all mapped to
        // the same cool silver/graphite scale so every existing class across
        // the site re-themes to a colourless, premium look automatically.
        electric: {
          DEFAULT: "#d4d7de",
          100: "#f2f3f6",
          200: "#e6e8ee",
          300: "#d9dce4",
          400: "#c6cad4",
          500: "#a7acb8",
          600: "#83899a",
        },
        purple: {
          DEFAULT: "#d0d3da",
          100: "#f1f2f5",
          200: "#e4e6ec",
          300: "#d6d9e0",
          400: "#c3c7d1",
          500: "#a3a8b4",
          600: "#7f8593",
        },
        cyan: {
          DEFAULT: "#dfe2e8",
          100: "#f4f5f8",
          200: "#e9ebf0",
          300: "#dce0e7",
          400: "#cbd0d9",
          500: "#aab0bd",
          600: "#888fa0",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tightest: "-0.06em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(222,226,234,0.22)",
        "glow-purple": "0 0 60px -12px rgba(210,214,222,0.20)",
        "glow-cyan": "0 0 50px -12px rgba(216,220,228,0.20)",
        glass:
          "0 8px 32px rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.06)",
        card: "0 24px 60px -20px rgba(0,0,0,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-26px) translateX(10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
