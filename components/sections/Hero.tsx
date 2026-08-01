"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, Activity } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Counter from "@/components/ui/Counter";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { heroStats } from "@/lib/site";
import RobotAtmosphere from "@/components/effects/RobotAtmosphere";
import ContinuousAIScanHeading from "@/components/effects/ContinuousAIScanHeading";
import HeroStatsBar from "@/components/effects/HeroStatsBar";

const headlineLines = [
  "Crafting digital",
  "experiences that",
  "illuminate your",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8 xl:pt-28 xl:pb-16"
    >
      {/* Subtle monochrome spotlight backdrop */}
      <Spotlight
        className="-top-24 left-6 from-white/90 via-neutral-300/40 to-transparent md:left-1/4"
        size={560}
      />

      {/* Hero Main Grid (Text Left + 3D Robot Right) */}
      <div className="container-px relative z-10 my-auto grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
        {/* ---------- Left Column: Copy & CTAs ---------- */}
        <motion.div
          style={{ y: yText, opacity }}
          className="flex flex-col items-start text-left"
        >
          {/* Studio Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-xl sm:mb-5"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-white/70 uppercase">
              <Activity className="h-3 w-3 animate-pulse text-white/80" />
              LUMORA STUDIO TELEMETRY
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs font-medium tracking-tight text-white/60">
              Premium websites for ambitious local businesses
            </span>
          </motion.div>

          {/* Headline - Continuous AI Ping-Pong Scan Heading */}
          <h1 className="w-full">
            <ContinuousAIScanHeading />
          </h1>

          {/* Subtitle / Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.8, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-lg text-balance text-sm leading-relaxed text-white/65 sm:mt-5 sm:text-base lg:text-base font-normal tracking-tight"
          >
            Lumora Digital takes raw business identities and refracts them
            through bespoke design, sub-second code architecture, and
            high-converting visual storytelling.
          </motion.p>

          {/* Dual Magnetic CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col items-start gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4"
          >
            <MagneticButton href="#contact" variant="primary">
              Start Your Transformation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#portfolio" variant="outline">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                <Play className="h-2.5 w-2.5 fill-white text-white translate-x-0.5" />
              </span>
              View Selected Work
            </MagneticButton>
          </motion.div>

          {/* Trust Rating Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.75 }}
            className="mt-5 flex items-center gap-2.5 text-xs text-white/50 sm:mt-6 sm:text-xs"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-white/80 text-white/80" />
              ))}
            </div>
            <span className="tracking-tight">
              Trusted by{" "}
              <span className="font-semibold text-white/90">
                [90+ local businesses]
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* ---------- Right Column: 3D Robot Frame (Untouched Scene) ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-[320px] w-full items-center justify-center sm:h-[380px] lg:h-[460px] xl:h-[500px]"
        >
          {/* Breathing aura halo and floating micro light particles */}
          <RobotAtmosphere />

          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full"
          />

          {/* Vignette base transition */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </div>

      {/* ---------- Bottom: Premium GSAP Animated Stats Bar ---------- */}
      <HeroStatsBar />
    </section>
  );
}

