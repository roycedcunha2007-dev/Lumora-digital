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
          {whyChooseUs.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div key={item.title} variants={staggerItem}>
                <TiltCard intensity={1.8} className="group h-full">
                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-transparent p-8 transition-all duration-500 group-hover:border-blue-500/30">
                    {/* Subtle Electric Blue Corner Glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                    </div>

                    <div
                      className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/90 ring-1 ring-white/5 transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:scale-105"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3
                      className="relative mt-6 font-display text-xl font-semibold text-white"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="relative mt-3 text-sm leading-relaxed text-white/60"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      {item.body}
                    </p>

                    <span className="relative mt-6 inline-block h-px w-12 bg-gradient-to-r from-blue-400 to-transparent transition-all duration-500 group-hover:w-20" />
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
