"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Sparkles, Layers, Calendar } from "lucide-react";
import { Project } from "@/lib/site";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-white/15 bg-navy-900/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-white/25" />
                <span className="flex h-3 w-3 rounded-full bg-white/15" />
                <span className="flex h-3 w-3 rounded-full bg-white/10" />
                <span className="ml-2 font-mono text-xs text-white/40">
                  case-study://{project.id}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close project modal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="overflow-y-auto p-6 sm:p-8 md:p-10">
              {/* Visual Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
                />
                <div className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

                {/* Banner overlay information */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 sm:left-8 sm:right-8 sm:bottom-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                      <Sparkles className="h-3.5 w-3.5" /> {project.category}
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                      {project.title}
                    </h2>
                  </div>
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.03]"
                  >
                    Request Similar Site
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
                {/* Main Body */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Overview &amp; Impact
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {project.blurb} Designed with performance-first architecture, buttery smooth micro-interactions, and high-converting visual hierarchy tailored to convert visitors into loyal customers.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display text-base font-semibold text-white">
                      Key Highlights Delivered
                    </h4>
                    <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {[
                        "Sub-second page loading speed",
                        "Fully responsive mobile-first UI",
                        "Custom GSAP & Framer Motion transitions",
                        "Lighthouse score 98+ guaranteed",
                        "On-page SEO & Schema markup",
                        "Headless CMS integration",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-xs text-white/80"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs italic leading-relaxed text-white/60">
                      &ldquo;[Client Quote] — Working with Lumora Digital elevated our local brand into an industry-leading position. Our conversion rates jumped within weeks of launch!&rdquo;
                    </p>
                    <span className="mt-2 block text-[11px] font-semibold text-cyan-300">
                      — [Client Founder Name], [Company Name]
                    </span>
                  </div>
                </div>

                {/* Sidebar details */}
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" /> Timeline
                    </span>
                    <span className="mt-1 block text-sm text-white font-medium">
                      {project.year} · 4 Weeks
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      <Layers className="h-3.5 w-3.5" /> Technologies
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.tags.concat(["Next.js", "Tailwind CSS"]).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <a
                    href="#contact"
                    onClick={onClose}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 py-3 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
                  >
                    Start a Project Like This
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
