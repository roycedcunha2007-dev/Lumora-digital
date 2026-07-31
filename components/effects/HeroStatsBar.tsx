"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { heroStats } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function HeroStatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial entrance state (opacity 0, y 40px, scale 0.96)
    cardRefs.current.forEach((card) => {
      if (card) {
        gsap.set(card, { opacity: 0, y: 40, scale: 0.96 });
      }
    });

    let triggered = false;

    const startEntranceAndCounting = () => {
      if (triggered) return;
      triggered = true;

      // GSAP Entrance Timeline with 0.12s stagger & power3.out ease
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(cardRefs.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
      });

      // GSAP Smooth Number Counting over 2.0s with power3.out ease
      heroStats.forEach((stat, idx) => {
        const numEl = numberRefs.current[idx];
        if (!numEl) return;

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: stat.value,
          duration: 2.0,
          ease: "power3.out",
          delay: 0.12 * idx, // Synchronized with card stagger
          onUpdate: () => {
            const currentVal = Math.floor(counterObj.val);
            numEl.textContent = `${currentVal}${stat.suffix}`;
          },
        });
      });
    };

    // Viewport IntersectionObserver Gate
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          startEntranceAndCounting();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    // Infinite 8-second Micro Interaction Light Sweep on Card Borders
    const sweepInterval = setInterval(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const sweepEl = card.querySelector(".border-sweep");
        if (sweepEl) {
          gsap.fromTo(
            sweepEl,
            { x: "-100%", opacity: 0 },
            { x: "200%", opacity: 0.08, duration: 0.9, ease: "power2.inOut" }
          );
        }
      });
    }, 8000);

    return () => {
      observer.disconnect();
      clearInterval(sweepInterval);
      gsap.killTweensOf(cardRefs.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="container-px relative z-20 mt-10 w-full sm:mt-12 lg:mt-14"
    >
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4 lg:gap-5">
        {heroStats.map((s, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={s.label}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                "group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border px-4 py-4 text-center backdrop-blur-xl transition-all duration-350 ease-out sm:py-5 lg:px-6",
                isHovered
                  ? "-translate-y-2 border-white/30 bg-white/[0.06] shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
                  : "border-white/10 bg-white/[0.025] shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              )}
            >
              {/* 8-second recurring micro-interaction light sweep overlay */}
              <div className="border-sweep pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 mix-blend-overlay" />

              {/* Number with 6° rotation + 1.08 scale on hover */}
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className={cn(
                  "font-display text-2xl font-bold tracking-tight text-white transition-transform duration-350 ease-out sm:text-3xl lg:text-4xl",
                  isHovered ? "scale-[1.08] rotate-[6deg] drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "scale-100 rotate-0"
                )}
              >
                0{s.suffix}
              </span>

              {/* Label */}
              <span className="mt-1 text-[11px] font-medium tracking-wider text-white/50 uppercase sm:text-xs">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
