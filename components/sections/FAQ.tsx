"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { faqs } from "@/lib/site";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-px">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
              description="Everything you might want to know before we start. Still curious? Reach out any time."
              align="left"
            />
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={faq.q} direction="up" delay={i * 0.05}>
                  <div
                    className={`overflow-hidden rounded-2xl border transition-colors duration-400 ${
                      isOpen
                        ? "border-white/20 bg-white/[0.04]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-display text-base font-medium text-white sm:text-lg">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-6 pb-6 text-sm leading-relaxed text-white/55">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
