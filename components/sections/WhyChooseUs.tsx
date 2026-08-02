"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import PerformanceSimulator from "@/components/ui/PerformanceSimulator";
import { whyChooseUs } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function WhyChooseUs() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why choose Lumora"
          title="Engineering that drives growth"
          description="It's not just how our work looks — it's how it performs, how it's built, and the measurable business lift we engineer into every launch."
        />

        {/* Live Performance Simulator Widget */}
        <div className="mt-14">
          <PerformanceSimulator />
        </div>

        {/* 3D Tilt Advantage Cards */}
        <Stagger
          gap={0.09}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item, idx) => {
            const Icon = getIcon(item.icon);
            const iconColors = [
              "text-cyan-300",
              "text-electric-300",
              "text-purple-300",
              "text-emerald-300",
              "text-amber-300",
              "text-indigo-300",
            ];
            const iconColor = iconColors[idx % iconColors.length];
            return (
              <motion.div key={item.title} variants={staggerItem}>
                <TiltCard variant="trust-blue" intensity={8} className="group h-full">
                  <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 transition-all duration-500 group-hover:border-white/20">
                    {/* Hover Glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
                    </div>

                    <div
                      className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <Icon className={cn("h-7 w-7 transition-transform duration-500 group-hover:scale-110", iconColor)} />
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
