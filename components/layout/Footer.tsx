"use client";

import { useState } from "react";
import { ArrowUpRight, Send, ArrowUp, Check } from "lucide-react";
import { site, navLinks, services } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-24">
      {/* giant ambient wordmark glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <span className="select-none font-display text-[22vw] font-bold leading-none text-white/[0.02]">
          Lumora
        </span>
      </div>
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-electric-500/10 blur-[120px]" />

      <div className="container-px relative">
        {/* CTA band */}
        <Reveal>
          <div className="mb-20 flex flex-col items-center gap-6 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] px-8 py-14 text-center">
            <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Ready to make your business{" "}
              <span className="text-gradient">unforgettable?</span>
            </h2>
            <p className="max-w-md text-white/55">
              Let&apos;s craft a website that works as hard as you do.
            </p>
            <a
              href="#contact"
              className="group mt-2 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>

        {/* link grid */}
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500 via-purple-500 to-cyan-500 font-display font-bold text-white">
                L
              </span>
              <span className="font-display text-xl font-semibold text-white">
                Lumora Digital
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {site.description}
            </p>
            <div className="mt-6 flex gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
                >
                  {s.label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Explore
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Services
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Newsletter
            </h4>
            <p className="mt-5 text-sm text-white/50">
              Occasional insights on design, performance and growth. No spam.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
                setTimeout(() => setSubscribed(false), 4000);
              }}
              className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-4 focus-within:border-white/25"
            >
              <input
                type="email"
                required
                placeholder="[your email]"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric-500 to-purple-500 text-white transition-transform hover:scale-105"
              >
                {subscribed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Lumora Digital. All rights reserved. ·
            [Placeholder legal info]
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white">
              Terms
            </a>
            <a
              href="#top"
              className="group flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white"
            >
              Back to top
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 transition-transform group-hover:-translate-y-0.5">
                <ArrowUp className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
