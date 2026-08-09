"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
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
          <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-white/10 lg:block" />
          <motion.div
            style={{ height: progress }}
            className="absolute left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#8a9a86] via-[#c5a880] to-[#8a9a86] shadow-[0_0_15px_rgba(138,154,134,0.3)] lg:block"
          />

          {/* left rail (mobile) */}
          <div className="absolute left-[19px] top-0 h-full w-[2px] bg-white/10 lg:hidden" />
          <motion.div
            style={{ height: progress }}
            className="absolute left-[19px] top-0 w-[2px] bg-gradient-to-b from-[#8a9a86] via-[#c5a880] to-[#8a9a86] shadow-[0_0_15px_rgba(138,154,134,0.3)] lg:hidden"
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
                  {/* Sphere Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-[7px] z-10 flex h-7 w-7 items-center justify-center lg:left-1/2 lg:-translate-x-1/2"
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/30 bg-black/80 shadow-[0_0_10px_rgba(138,154,134,0.3)] backdrop-blur-md">
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-[#8a9a86] to-[#c5a880]" />
                    </span>
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
                    <TiltCard intensity={1.8} className="group w-full">
                      <div className="relative inline-block w-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-transparent p-6 transition-colors duration-500 group-hover:border-[#8a9a86]/35">
                        <div
                          className={`flex items-center gap-4 ${
                            isLeft ? "lg:flex-row-reverse" : ""
                          }`}
                          style={{ transform: "translateZ(30px)" }}
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#9ab096] ring-1 ring-white/5 transition-all duration-300 group-hover:border-[#8a9a86]/35 group-hover:bg-[#8a9a86]/10">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className={isLeft ? "lg:text-right" : ""}>
                            <span className="font-mono text-xs font-semibold tracking-widest text-[#a3a19b]/60">
                              STEP {item.step}
                            </span>
                            <h3 className="font-display text-xl font-semibold text-[#f4f1ea]">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <p
                          className={`mt-3 text-sm leading-relaxed text-[#a3a19b] ${
                            isLeft ? "lg:text-right" : ""
                          }`}
                          style={{ transform: "translateZ(20px)" }}
                        >
                          {item.body}
                        </p>
                      </div>
                    </TiltCard>
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
