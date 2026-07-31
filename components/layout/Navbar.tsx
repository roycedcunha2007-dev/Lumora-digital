"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, Activity } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // scroll-spy for active link
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[9000] flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-[1360px] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-premium sm:px-6",
            scrolled
              ? "glass-strong shadow-glass border-white/15"
              : "border border-transparent bg-transparent"
          )}
        >
          {/* Logo */}
          <a
            href="#top"
            className="group flex items-center gap-3 pl-1"
            aria-label={`${site.name} home`}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-500 via-purple-500 to-cyan-500 opacity-90 blur-[2px] transition-all duration-500 group-hover:blur-[6px]" />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-navy-900 font-display text-sm font-bold text-white">
                L
              </span>
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white leading-none">
                Lumora
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase opacity-80">
                DIGITAL STUDIO
              </span>
            </div>
          </a>

          {/* Telemetry Badge (Middle) */}
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono text-white/50">
            <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>60 FPS</span>
            <span className="text-white/20">|</span>
            <span className="text-cyan-300">99 LIGHTHOUSE</span>
          </div>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    active === link.href
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy-950 transition-transform duration-300 hover:scale-[1.03] shadow-lg shadow-white/10 sm:inline-flex"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[8999] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-24 rounded-3xl glass-strong p-6 shadow-glass"
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 text-white/40" />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric-500 to-purple-500 px-5 py-3.5 text-sm font-bold text-white"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
