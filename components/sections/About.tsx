"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Eye, Target } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { coreValues, journey } from "@/lib/site";

export default function About() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="About Lumora"
          title="A studio obsessed with craft"
          description="We're a small, senior team that treats every local business like a flagship brand. Our mission is simple: give ambitious companies a website worthy of their ambition."
          align="left"
        />

        {/* Mission / Vision / Values intro cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our Mission",
              body: "Helping local businesses establish a powerful online presence through affordable, beautiful and high-performing websites.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              body: "[Vision] — A world where every great local business has a digital home as impressive as the work they do.",
            },
            {
              icon: Compass,
              title: "Our Promise",
              body: "[Promise] — Premium craft, honest pricing and a partnership that lasts far beyond launch day.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} direction="up" delay={i * 0.12}>
              <TiltCard intensity={1.8} className="group h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-transparent p-7 transition-all duration-500 group-hover:border-[#8a9a86]/35">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#9ab096] ring-1 ring-white/5 transition-all duration-300 group-hover:border-[#8a9a86]/35 group-hover:bg-[#8a9a86]/10 group-hover:scale-105"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <card.icon className="h-5 w-5" />
                  </span>
                  <h3
                    className="mt-5 font-display text-xl font-semibold text-[#f4f1ea]"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-2.5 text-sm leading-relaxed text-[#a3a19b]"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {card.body}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Journey timeline */}
        <div className="mt-28 grid gap-12 lg:grid-cols-[0.4fr_0.6fr]">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <span className="eyebrow mb-5">Our journey</span>
            <h3 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              From a bold idea to a{" "}
              <span className="text-gradient">borderless studio</span>
            </h3>
            <p className="mt-4 max-w-md text-white/60">
              [Company Story] — Every milestone shaped how we think about design,
              speed and the businesses we serve.
            </p>
          </div>

          <div ref={timelineRef} className="relative pl-8">
            {/* track */}
            <div className="absolute left-[7px] top-2 h-full w-px bg-white/10" />
            <motion.div
              className="absolute left-[7px] top-2 w-px bg-gradient-to-b from-[#8a9a86] via-[#c5a880] to-[#8a9a86] shadow-[0_0_10px_rgba(138,154,134,0.3)]"
              style={{ height: lineHeight }}
            />

            <Stagger gap={0.14} className="flex flex-col gap-10">
              {journey.map((item) => (
                <motion.div
                  key={item.year}
                  variants={staggerItem}
                  className="relative"
                >
                  <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center">
                    <span className="relative h-2.5 w-2.5 rounded-full border border-white/40 bg-[#8a9a86]" />
                  </span>
                  <span className="text-xs font-mono font-semibold tracking-wider text-[#9ab096]">
                    {item.year}
                  </span>
                  <h4 className="mt-1 font-display text-xl font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>

        {/* Core values */}
        <div className="mt-28">
          <Reveal>
            <h3 className="mb-10 text-center font-display text-2xl font-semibold text-white sm:text-3xl">
              The values behind every build
            </h3>
          </Reveal>
          <Stagger gap={0.1} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v) => (
              <motion.div key={v.title} variants={staggerItem}>
                <TiltCard intensity={1.8} className="group h-full">
                  <div className="relative h-full rounded-[2rem] border border-white/[0.08] bg-transparent p-6 transition-all duration-500 group-hover:border-blue-500/30">
                    <h4
                      className="font-display text-lg font-semibold text-white"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {v.title}
                    </h4>
                    <p
                      className="mt-2 text-sm leading-relaxed text-white/60"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      {v.body}
                    </p>
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
