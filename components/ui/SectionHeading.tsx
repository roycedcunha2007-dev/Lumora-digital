"use client";

import { ReactNode } from "react";
import AnimatedHeading from "./AnimatedHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal direction="up">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <AnimatedHeading
        text={title}
        by="word"
        className={cn(
          "font-display font-semibold tracking-tightest text-white",
          "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl",
          align === "center" ? "max-w-4xl" : "max-w-3xl"
        )}
      />
      {description && (
        <Reveal direction="up" delay={0.1}>
          <p
            className={cn(
              "text-base leading-relaxed text-white/55 sm:text-lg",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
