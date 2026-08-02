"use client";

import { motion } from "framer-motion";
import { Compass, Eye, Target } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { coreValues } from "@/lib/site";

export default function About() {

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
              accent: "from-electric-500 to-purple-500",
            },
            {
              icon: Eye,
              title: "Our Vision",
              body: "[Vision] — A world where every great local business has a digital home as impressive as the work they do.",
              accent: "from-purple-500 to-cyan-500",
            },
            {
              icon: Compass,
              title: "Our Promise",
              body: "[Promise] — Premium craft, honest pricing and a partnership that lasts far beyond launch day.",
              accent: "from-cyan-500 to-electric-500",
            },
          ].map((card, i) => (
            <Reveal key={card.title} direction="up" delay={i * 0.12}>
              <TiltCard variant="trust-blue" intensity={8} className="group h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 transition-all duration-500 group-hover:border-white/20">
                  <div
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.accent} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40`}
                  />
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} transition-transform duration-500 group-hover:scale-110`}
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <card.icon className="h-6 w-6 text-white" />
                  </span>
                  <h3
                    className="mt-5 font-display text-xl font-semibold text-white"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-2.5 text-sm leading-relaxed text-white/55"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {card.body}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
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
                <TiltCard intensity={6} className="group h-full">
                  <div className="gradient-border relative h-full rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 transition-all duration-500 group-hover:border-white/20">
                    <h4
                      className="font-display text-lg font-semibold text-white"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {v.title}
                    </h4>
                    <p
                      className="mt-2 text-sm leading-relaxed text-white/55"
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
