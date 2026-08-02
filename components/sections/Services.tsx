"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { services } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function Services() {
  const [expanded, setExpanded] = useState<string | null>("design");

  return (
    <section id="services" className="relative py-28 sm:py-36">
      {/* section divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Services crafted end to end"
            description="Everything you need to launch and grow online — designed, built and cared for under one roof."
            align="left"
          />
          <a
            href="#contact"
            className="group hidden items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white lg:flex"
          >
            Discuss your project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <Stagger
          gap={0.07}
          className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            const isOpen = expanded === service.id;
            return (
              <motion.div key={service.id} variants={staggerItem} layout>
                <TiltCard variant="silver-cyan" intensity={7} className="group h-full">
                  <div
                    className={cn(
                      "relative h-full overflow-hidden rounded-3xl border p-7 transition-all duration-500 cursor-pointer",
                      isOpen
                        ? "border-white/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    )}
                    onClick={() => setExpanded(isOpen ? null : service.id)}
                    data-cursor={isOpen ? "Close" : "Expand"}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                        service.id === "design"
                          ? "bg-electric-500/25"
                          : service.id === "development"
                          ? "bg-cyan-500/25"
                          : service.id === "responsive"
                          ? "bg-purple-500/25"
                          : service.id === "uiux"
                          ? "bg-emerald-500/25"
                          : service.id === "maintenance"
                          ? "bg-amber-500/25"
                          : "bg-indigo-500/25"
                      )}
                    />

                    <div className="flex items-start justify-between" style={{ transform: "translateZ(35px)" }}>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-500/20 to-purple-500/20 p-3 ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-white" />
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </div>

                    <h3
                      className="mt-5 font-display text-xl font-semibold text-white"
                      style={{ transform: "translateZ(25px)" }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed text-white/55"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      {service.blurb}
                    </p>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <ul className="mt-5 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-5">
                            {service.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-center gap-2 text-xs text-white/70"
                              >
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20">
                                  <Check className="h-2.5 w-2.5 text-cyan-300" />
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                          <a
                            href="#contact"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                          >
                            Learn more
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
