"use client";

import { useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/ui/ProjectModal";
import { projects, projectCategories, Project } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="relative py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Selected work"
          title="Work we're proud of"
          description="A glimpse of the sites and experiences we've crafted. Every project is bespoke — click any project to view its full case study details."
        />

        {/* Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-2.5">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300",
                filter === cat ? "text-navy-950" : "text-white/60 hover:text-white"
              )}
            >
              {filter === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedProject(project)}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10",
                    project.span === "tall" && "sm:row-span-2",
                    project.span === "wide" && "lg:col-span-2"
                  )}
                  data-cursor="View"
                >
                  {/* gradient art placeholder */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
                      project.gradient
                    )}
                  />
                  <div className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                  {/* floating mock browser frame */}
                  <div className="absolute inset-6 rounded-2xl border border-white/10 bg-navy-900/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/50">
                          {project.category} · {project.year}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-navy-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-2 max-h-0 overflow-hidden text-xs leading-relaxed text-white/60 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                      {project.blurb}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Start your project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

