"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

const fields = [
  { name: "name", label: "Your name", type: "text", placeholder: "[Full name]" },
  { name: "email", label: "Email", type: "email", placeholder: "[you@example.com]" },
  { name: "company", label: "Company", type: "text", placeholder: "[Business name]" },
  { name: "budget", label: "Budget", type: "text", placeholder: "[$ range]" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: wire to your email service / API route before launch.
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something great"
          description="Tell us about your project and we'll get back within one business day. No pressure, no jargon — just a friendly conversation."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          {/* Form */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 sm:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric-500/15 blur-3xl" />
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.name} className="group relative">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    Project details
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="[Tell us about your goals, timeline and what you have in mind…]"
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold text-white"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-electric-500 via-purple-500 to-cyan-500 bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0]" />
                  <span className="relative flex items-center gap-2">
                    {sent ? (
                      <>
                        <Check className="h-4 w-4" /> Message sent
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
                <p className="text-xs text-white/30">
                  This form is a placeholder — connect it to your email service or
                  an API route before going live.
                </p>
              </form>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal direction="left">
            <div className="flex h-full flex-col gap-4">
              {[
                { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
                { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone}` },
                { icon: MapPin, label: "Studio", value: site.address },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-400 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500/20 to-purple-500/20 ring-1 ring-white/10">
                    <item.icon className="h-5 w-5 text-cyan-300" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/40">
                      {item.label}
                    </div>
                    <div className="text-sm text-white/80">{item.value}</div>
                  </div>
                </a>
              ))}

              {/* hours */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                  <Clock className="h-4 w-4" /> Business hours
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {site.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white/60">{h.day}</span>
                      <span className="text-white/80">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* map placeholder */}
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-navy-800/40">
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 to-purple-500/10" />
                <div className="relative flex h-full min-h-[160px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute h-10 w-10 animate-pulse-ring rounded-full bg-cyan-500/40" />
                      <MapPin className="relative h-6 w-6 text-cyan-300" />
                    </span>
                    <span className="text-xs text-white/40">[Google Maps embed]</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
