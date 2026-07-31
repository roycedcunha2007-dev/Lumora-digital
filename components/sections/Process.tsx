"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/site";
import { getIcon } from "@/lib/icons";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="How we work"
          title="A process built for calm"
          description="Seven deliberate steps that take you from first idea to a live site — and well beyond. No chaos, no surprises."
        />

        <div ref={ref} className="relative mt-20">
          {/* center rail (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 lg:block" />
          <motion.div
            style={{ height: progress }}
            className="absolute left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-electric-400 via-purple-500 to-cyan-400 lg:block"
          />

          {/* left rail (mobile) */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-white/10 lg:hidden" />
          <motion.div
            style={{ height: progress }}
            className="absolute left-[19px] top-0 w-px bg-gradient-to-b from-electric-400 via-purple-500 to-cyan-400 lg:hidden"
          />

          <div className="flex flex-col gap-10 lg:gap-4">
            {process.map((item, i) => {
              const Icon = getIcon(item.icon);
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.step}
                  className="relative grid grid-cols-[auto_1fr] items-center gap-6 pl-0 lg:grid-cols-2 lg:gap-16"
                >
                  {/* node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-[10px] z-10 flex h-5 w-5 items-center justify-center lg:left-1/2 lg:-translate-x-1/2"
                  >
                    <span className="absolute h-5 w-5 animate-ping rounded-full bg-electric-500/30" />
                    <span className="relative h-3.5 w-3.5 rounded-full border-2 border-navy-950 bg-gradient-to-br from-electric-400 to-cyan-400" />
                  </motion.div>

                  {/* card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`col-start-2 ${
                      isLeft
                        ? "lg:col-start-1 lg:pr-16 lg:text-right"
                        : "lg:col-start-2 lg:pl-16"
                    }`}
                  >
                    <div className="group relative inline-block w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-500 hover:border-white/20">
                      <div
                        className={`flex items-center gap-4 ${
                          isLeft ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-500/20 to-purple-500/20 ring-1 ring-white/10">
                          <Icon className="h-6 w-6 text-cyan-300" />
                        </span>
                        <div className={isLeft ? "lg:text-right" : ""}>
                          <span className="font-display text-xs font-semibold tracking-widest text-white/40">
                            STEP {item.step}
                          </span>
                          <h3 className="font-display text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p
                        className={`mt-3 text-sm leading-relaxed text-white/55 ${
                          isLeft ? "lg:text-right" : ""
                        }`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
