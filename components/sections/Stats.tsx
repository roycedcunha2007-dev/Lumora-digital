"use client";

import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { stats } from "@/lib/site";

export default function Stats() {
  return (
    <section className="relative py-20">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#07080d]/80 p-10 backdrop-blur-[24px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] sm:p-14">
          {/* Subtle Ambient Electric Blue Glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-y" />

          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="eyebrow">By the numbers</span>
            <h2 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
              Momentum you can measure
            </h2>
          </div>

          <Stagger
            gap={0.12}
            className="relative mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={staggerItem}>
                <TiltCard intensity={1.8} className="group h-full">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-transparent p-6 text-center transition-all duration-500 group-hover:border-blue-500/30">
                    <span
                      className="font-display text-5xl font-semibold text-white sm:text-6xl"
                      style={{ transform: "translateZ(25px)" }}
                    >
                      <Counter to={s.value} suffix={s.suffix} />
                    </span>
                    <span
                      className="mt-2 text-sm text-white/55 transition-colors group-hover:text-white/80"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
