"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";
import { pricing, comparison } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [showTable, setShowTable] = useState(false);

  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, honest pricing"
          description="Transparent packages with no hidden fees. Pick a starting point — we'll tailor the details to your business."
        />

        <Stagger
          gap={0.12}
          className="mt-16 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {pricing.map((plan) => (
            <motion.div key={plan.id} variants={staggerItem}>
              <TiltCard intensity={7} className="group h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 transition-all duration-500",
                    plan.highlight
                      ? "gradient-border-animated bg-gradient-to-b from-white/[0.09] via-white/[0.03] to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:-translate-y-4 lg:scale-[1.02]"
                      : "border border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  {plan.highlight && (
                    <>
                      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
                      <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-electric-500 to-purple-500 px-3 py-1 text-[11px] font-semibold text-white shadow-glow">
                        <Sparkles className="h-3 w-3" /> Most popular
                      </span>
                    </>
                  )}

                  <h3
                    className="font-display text-lg font-semibold text-white"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="mt-1 text-sm text-white/50"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {plan.tagline}
                  </p>

                  <div
                    className="mt-6 flex items-end gap-2"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    <span className="font-display text-4xl font-semibold text-white sm:text-5xl">
                      {plan.price}
                    </span>
                    <span className="mb-1.5 text-sm text-white/40">
                      /{plan.cadence}
                    </span>
                  </div>

                  <div className="my-7 h-px w-full bg-white/10" />

                  <ul
                    className="flex flex-1 flex-col gap-3.5"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            plan.highlight
                              ? "bg-gradient-to-br from-electric-500 to-purple-500"
                              : "bg-white/10"
                          )}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8" style={{ transform: "translateZ(20px)" }}>
                    {plan.highlight ? (
                      <MagneticButton href="#contact" variant="primary" className="w-full">
                        Get started
                        <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                    ) : (
                      <a
                        href="#contact"
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                      >
                        Choose {plan.name}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </Stagger>

        {/* Comparison toggle */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setShowTable((v) => !v)}
            className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {showTable ? "Hide" : "Compare"} full feature breakdown
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: showTable ? "auto" : 0,
            opacity: showTable ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <Reveal className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-white/10">
              <thead>
                <tr>
                  <th className="bg-white/[0.03] p-5 text-left text-sm font-medium text-white/50">
                    Features
                  </th>
                  {comparison.plans.map((p) => (
                    <th
                      key={p.name}
                      className="bg-white/[0.03] p-5 text-center font-display text-base font-semibold text-white"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.features.map((feature, ri) => (
                  <tr key={feature}>
                    <td className="border-t border-white/10 p-5 text-sm text-white/70">
                      {feature}
                    </td>
                    {comparison.plans.map((p) => {
                      const val = p.values[ri];
                      return (
                        <td
                          key={p.name}
                          className="border-t border-white/10 p-5 text-center text-sm text-white/70"
                        >
                          {val === true ? (
                            <Check className="mx-auto h-4 w-4 text-cyan-400" />
                          ) : val === false ? (
                            <X className="mx-auto h-4 w-4 text-white/20" />
                          ) : (
                            <span className="text-white/60">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
