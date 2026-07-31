"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const LINES = [
  { text: "Crafting digital", isGradient: false },
  { text: "experiences that", isGradient: false },
  { text: "illuminate your", isGradient: false },
  { text: "brand identity.", isGradient: true },
];

export default function ContinuousAIScanHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial State: Text is hidden (opacity 0, blur 12px) before first scan
    lineRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, {
          opacity: 0,
          filter: "blur(12px)",
          webkitFilter: "blur(12px)",
        });
      }
    });

    if (scannerRef.current) {
      gsap.set(scannerRef.current, { top: "-10%", opacity: 0 });
    }

    let triggered = false;

    const startScanSequence = () => {
      if (triggered) return;
      triggered = true;

      // Wait 800ms grace delay after page load + viewport entry
      setTimeout(() => {
        const masterTl = gsap.timeline();

        // --- FIRST SCAN (Reveal Sequence: Top -> Bottom over 4.0s) ---
        const firstPass = gsap.timeline();

        if (scannerRef.current) {
          firstPass.to(
            scannerRef.current,
            {
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            0
          );

          firstPass.to(
            scannerRef.current,
            {
              top: "110%",
              duration: 4.0,
              ease: "power2.inOut",
            },
            0.1
          );
        }

        // Reveal text lines permanently as scan line passes
        lineRefs.current.forEach((el, idx) => {
          if (!el) return;
          const revealStart = 0.25 + idx * 0.9;

          firstPass.to(
            el,
            {
              opacity: 1,
              filter: "blur(0px)",
              webkitFilter: "blur(0px)",
              duration: 1.1,
              ease: "power4.out",
            },
            revealStart
          );
        });

        masterTl.add(firstPass);

        // --- CONTINUOUS PING-PONG LOOP (Infinite Scan: 4s down, 1s pause, 4s up, 1s pause) ---
        const loopTl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          repeatDelay: 1.0,
        });

        if (scannerRef.current) {
          loopTl.to(scannerRef.current, {
            top: "-10%",
            duration: 4.0,
            ease: "power2.inOut",
            onUpdate: function () {
              // Highlight active line as scanner passes over during continuous loop
              const progress = this.progress(); // 0 to 1
              lineRefs.current.forEach((lineEl, i) => {
                if (!lineEl) return;
                const linePosition = i / (LINES.length - 1 || 1);
                const distance = Math.abs(progress - linePosition);

                if (distance < 0.18) {
                  // Scanner is passing over this line -> subtle 120% brightness boost
                  const boost = 1 + (0.18 - distance) * 1.1; // 1.0 to 1.2
                  gsap.set(lineEl, {
                    filter: `brightness(${boost})`,
                    webkitFilter: `brightness(${boost})`,
                  });
                } else {
                  gsap.set(lineEl, {
                    filter: "brightness(1)",
                    webkitFilter: "brightness(1)",
                  });
                }
              });
            },
          });
        }

        // Add loop to master timeline after 1s pause post-first-reveal
        masterTl.add(loopTl, "+=1.0");
      }, 800);
    };

    // 2. Readiness Gating: window.load + document.fonts.ready + RAF paint + IntersectionObserver
    const observeAndViewportStart = () => {
      const container = containerRef.current;
      if (!container) {
        startScanSequence();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                startScanSequence();
              });
            });
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(container);
    };

    const waitFullLoad = () => {
      const onReady = () => {
        if (document.fonts?.ready) {
          document.fonts.ready
            .then(observeAndViewportStart)
            .catch(observeAndViewportStart);
        } else {
          observeAndViewportStart();
        }
      };

      if (document.readyState === "complete") {
        onReady();
      } else {
        window.addEventListener("load", onReady, { once: true });
      }
    };

    waitFullLoad();

    return () => {
      gsap.killTweensOf([scannerRef.current, ...lineRefs.current]);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] transition-all duration-250 ease-out select-none",
        isHovered ? "brightness-125 text-white" : "brightness-100"
      )}
    >
      {/* Premium Continuous Soft White/Blue Tint Scanning Line */}
      <div
        ref={scannerRef}
        className="pointer-events-none absolute left-0 right-0 z-30 h-8 -translate-y-1/2"
      >
        {/* Soft 2.5px light line with subtle blue tint */}
        <div className="h-[2.5px] w-full rounded-full bg-gradient-to-r from-transparent via-[rgba(240,246,255,0.95)] to-transparent shadow-[0_0_16px_rgba(200,225,255,0.35),0_0_32px_rgba(180,210,255,0.15)]" />
        {/* Feathered ambient light aura */}
        <div className="h-8 w-full bg-gradient-to-b from-[rgba(220,235,255,0.15)] via-[rgba(220,235,255,0.05)] to-transparent blur-sm" />
      </div>

      {/* Heading Lines — Permanent after first scan reveal */}
      {LINES.map((line, idx) => (
        <div key={idx} className="block overflow-hidden py-0.5">
          <div
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            className="inline-block transition-opacity duration-300"
            style={{ opacity: 0, filter: "blur(12px)" }}
          >
            {line.isGradient ? (
              <span className="text-gradient">{line.text}</span>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
