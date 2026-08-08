"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, Activity } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();
  const { openCheckout } = useCheckout();

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
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-[9000] flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-[1360px] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-out sm:px-6",
            scrolled
              ? "bg-[#06070a]/80 backdrop-blur-3xl shadow-[0_16px_45px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.18)] border border-white/15"
              : "border border-white/10 bg-[#08080c]/40 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
          )}
        >
          {/* Logo */}
          <a
            href="#top"
            className="group flex items-center gap-3 pl-1"
            aria-label={`${site.name} home`}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-xl bg-blue-500 opacity-60 blur-[3px] transition-all duration-500 group-hover:opacity-90 group-hover:blur-[5px]" />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-display text-sm font-bold text-white shadow-inner">
                L
              </span>
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-white leading-none group-hover:text-white/90 transition-colors">
                Lumora
              </span>
              <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                DIGITAL STUDIO
              </span>
            </div>
          </a>

          {/* Telemetry Badge (Middle) */}
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono text-white/50 backdrop-blur-md">
            <Activity className="h-3 w-3 text-blue-400 animate-pulse" />
            <span>60 FPS</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70 font-medium">99 LIGHTHOUSE</span>
          </div>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                    active === link.href
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCheckout("business")}
              className="group hidden items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy-950 transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 shadow-[0_4px_20px_rgba(255,255,255,0.15)] sm:inline-flex cursor-pointer"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden cursor-pointer"
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
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-24 rounded-3xl border border-white/15 bg-[#08080c]/95 p-6 shadow-2xl backdrop-blur-2xl"
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
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCheckout("business");
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 cursor-pointer"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
