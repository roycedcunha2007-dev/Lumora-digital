"use client";

import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import { stats } from "@/lib/site";

export default function Stats() {
  return (
    <section className="relative py-20">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-10 sm:p-14">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-electric-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-fade-y" />

          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="eyebrow">By the numbers</span>
            <h2 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
              Momentum you can measure
            </h2>
          </div>

          <Stagger
            gap={0.12}
            className="relative mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={staggerItem}
                className="flex flex-col items-center text-center"
              >
                <span className="font-display text-5xl font-semibold text-gradient sm:text-6xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-2 text-sm text-white/50">{s.label}</span>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
