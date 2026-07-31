"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import ChromeArtifact from "@/components/3d/ChromeArtifact";
import { whyChooseUs } from "@/lib/site";
import { getIcon } from "@/lib/icons";

export default function WhyChooseUs() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why choose Lumora"
          title="Engineering that drives growth"
          description="It's not just how our work looks — it's how it performs, how it's built, and the measurable business lift we engineer into every launch."
        />

        {/* Real-time chrome artifact — a demonstration of craft, not a claim */}
        <div className="relative mt-14 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] shadow-card">
          {/* grounding light pool */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[130px]" />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1.05fr] lg:gap-4">
            <div className="flex flex-col items-start">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Real-time WebGL
              </span>

              <h3 className="mt-6 font-display text-3xl font-semibold leading-[1.08] tracking-tightest text-white sm:text-4xl">
                <span className="text-gradient">Rendered live</span>
                <br />
                in your browser.
              </h3>

              <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
                This isn&apos;t a video or an image. It&apos;s a physically-lit
                metal surface drawn on your GPU every frame, reflecting a real
                environment map. The same obsession with material, light and
                motion goes into every interface we ship.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/60">
                <MousePointer2 className="h-3.5 w-3.5" />
                Drag to rotate
              </span>
            </div>

            <ChromeArtifact className="h-[340px] w-full sm:h-[420px] lg:h-[480px]" />
          </div>
        </div>

        {/* 3D Tilt Advantage Cards */}
        <Stagger
          gap={0.09}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div key={item.title} variants={staggerItem}>
                <TiltCard intensity={8} className="group h-full">
                  <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 transition-all duration-500 group-hover:border-white/20">
                    {/* Hover Glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-electric-500/25 blur-3xl" />
                    </div>

                    <div
                      className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <Icon className="h-7 w-7 text-cyan-300 transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    <h3
                      className="relative mt-6 font-display text-xl font-semibold text-white"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="relative mt-3 text-sm leading-relaxed text-white/55"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {item.body}
                    </p>

                    <span className="relative mt-6 inline-block h-px w-12 bg-gradient-to-r from-electric-400 to-transparent transition-all duration-500 group-hover:w-24" />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
