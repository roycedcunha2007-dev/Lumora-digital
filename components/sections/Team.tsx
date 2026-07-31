"use client";

import { motion } from "framer-motion";
import { Linkedin, Github, Instagram, Dribbble, Twitter } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { team } from "@/lib/site";

const socialIcon: Record<string, typeof Linkedin> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram,
  Dribbble,
  X: Twitter,
};

export default function Team() {
  return (
    <section id="team" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="The people"
          title="The team behind the pixels"
          description="A compact, senior crew who genuinely love what they do — and it shows in every detail we ship."
        />

        <Stagger
          gap={0.12}
          className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={staggerItem}>
              <TiltCard intensity={9} className="group h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-2">
                  {/* portrait placeholder */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${member.accent} opacity-90`}
                    />
                    <div className="absolute inset-0 bg-dots opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-6xl font-bold text-white/90">
                        {member.initials}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-navy-950/40 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
                      [Portfolio Image]
                    </span>

                    {/* socials reveal */}
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-center gap-2 pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {member.socials.map((s) => {
                        const Icon = socialIcon[s] ?? Linkedin;
                        return (
                          <a
                            key={s}
                            href="#"
                            aria-label={s}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-950"
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-4 py-5">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-cyan-300">{member.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
