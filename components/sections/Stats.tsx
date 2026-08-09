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
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#0b0c10]/90 p-10 backdrop-blur-[24px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 mask-fade-y" />

          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="eyebrow">By the numbers</span>
            <h2 className="max-w-2xl font-display text-3xl font-semibold text-[#f4f1ea] sm:text-4xl">
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
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-transparent p-6 text-center transition-all duration-500 group-hover:border-[#8a9a86]/35">
                    <span
                      className="font-display text-5xl font-semibold text-[#faf8f5] sm:text-6xl"
                      style={{ transform: "translateZ(25px)" }}
                    >
                      <Counter to={s.value} suffix={s.suffix} />
                    </span>
                    <span
                      className="mt-2 text-sm text-[#a3a19b] transition-colors group-hover:text-[#d1cfc7]"
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
