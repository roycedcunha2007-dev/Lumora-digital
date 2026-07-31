"use client";

import { Star, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/site";
import { cn } from "@/lib/utils";

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="group relative w-[340px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 transition-colors duration-500 hover:border-white/20 sm:w-[400px]">
      <div className="pointer-events-none absolute -right-8 -top-8 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
        <Quote className="h-24 w-24 text-white" />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-cyan-400 text-cyan-400" />
        ))}
      </div>
      <blockquote className="relative mt-4 text-[15px] leading-relaxed text-white/80">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-electric-500 to-purple-500 text-sm font-semibold text-white">
          {t.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "CN"}
        </span>
        <div>
          <div className="text-sm font-semibold text-white">{t.name}</div>
          <div className="text-xs text-white/45">{t.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  reverse,
}: {
  items: typeof testimonials;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="group flex overflow-hidden mask-fade-x">
      <div
        className={cn(
          "flex shrink-0 gap-5 pr-5 group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee [animation-direction:reverse]" : "animate-marquee"
        )}
        style={{ animationDuration: "48s" }}
      >
        {doubled.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="container-px">
        <SectionHeading
          eyebrow="Kind words"
          title="Clients who became believers"
          description="We measure success by the businesses we help grow. Here's what a few of them had to say."
        />
      </div>

      <div className="mt-16 flex flex-col gap-5">
        <Row items={testimonials.slice(0, half)} />
        <Row items={testimonials.slice(half)} reverse />
      </div>
    </section>
  );
}
