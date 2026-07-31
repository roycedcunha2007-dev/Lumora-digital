"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, Activity } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Counter from "@/components/ui/Counter";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { heroStats } from "@/lib/site";

const headlineLines = ["Crafting digital", "experiences that", "illuminate your"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6"
    >
      {/* Cursor-following spotlight — clean white, monochrome */}
      <Spotlight
        className="-top-20 left-6 from-white via-neutral-300 to-transparent md:left-1/3"
        size={520}
      />

      <div className="container-px relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
        {/* ---------- Left: copy ---------- */}
        <motion.div
          style={{ y: yText, opacity }}
          className="flex flex-col items-start text-left"
        >
          {/* Studio Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-6 flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5 text-xs font-mono text-white/70">
              <Activity className="h-3.5 w-3.5 animate-pulse text-white/70" />
              LUMORA STUDIO TELEMETRY
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs font-medium text-white/70">
              Premium websites for ambitious local businesses
            </span>
          </motion.div>

          {/* Headline with Staggered Line Reveals */}
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-[5rem]">
            {headlineLines.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    delay: 0.5 + li * 0.12,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block text-gradient"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.86,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                brand identity.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-7 max-w-lg text-balance text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Lumora Digital takes raw business identities and refracts them
            through bespoke design, sub-second code architecture, and
            high-converting visual storytelling.
          </motion.p>

          {/* Dual Magnetic CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <MagneticButton href="#contact" variant="primary" data-cursor="Let's go">
              Start Your Transformation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#portfolio" variant="outline">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
              View Selected Work
            </MagneticButton>
          </motion.div>

          {/* Trust Rating Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 flex items-center gap-3 text-xs text-white/55 sm:text-sm"
          >
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-white/80 text-white/80" />
              ))}
            </div>
            <span>
              Trusted by{" "}
              <span className="font-medium text-white">
                [90+ local businesses]
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* ---------- Right: interactive 3D robot ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[360px] w-full sm:h-[440px] lg:h-[560px] lg:-mr-6 xl:-mr-12"
        >
          {/* soft neutral glow pool behind the robot (no colour clash) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[62%] w-[62%] rounded-full bg-white/[0.06] blur-[110px]" />
          </div>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full"
          />
          {/* fade the base into black so the framing reads intentional */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </motion.div>
      </div>

      {/* Animated Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.9 }}
        className="container-px relative z-10 mt-14 grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {heroStats.map((s) => (
          <div
            key={s.label}
            className="glass flex flex-col items-center rounded-2xl p-5 text-center shadow-glass"
          >
            <span className="font-display text-3xl font-bold text-white sm:text-4xl">
              <Counter to={s.value} suffix={s.suffix} />
            </span>
            <span className="mt-1 text-xs text-white/50">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
