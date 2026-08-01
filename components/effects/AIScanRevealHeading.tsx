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

export default function AIScanRevealHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAlreadyScanned, setIsAlreadyScanned] = useState<boolean>(false);

  useEffect(() => {
    // 1. SessionStorage Check — Run animation ONLY ONCE per session
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("lumora_hero_scanned") === "true"
    ) {
      setIsAlreadyScanned(true);
      lineRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            webkitFilter: "blur(0px)",
          });
        }
      });
      if (scannerRef.current) {
        gsap.set(scannerRef.current, { display: "none" });
      }
      return;
    }

    // 2. Set initial hidden state (opacity 0, y 20px, blur 12px)
    lineRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, {
          opacity: 0,
          y: 20,
          filter: "blur(12px)",
          webkitFilter: "blur(12px)",
        });
      }
    });

    if (scannerRef.current) {
      gsap.set(scannerRef.current, { top: "-15%", opacity: 0 });
    }

    let triggered = false;

    // 3. Execution function: Starts ONLY after 1000ms delay AFTER full page load + viewport visibility
    const launchAnimation = () => {
      if (triggered) return;
      triggered = true;

      try {
        sessionStorage.setItem("lumora_hero_scanned", "true");
      } catch (e) {
        // Storage fallback
      }

      // Wait 1000ms (1 full second) AFTER everything is displayed & rendered
      setTimeout(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
        });

        // Soft white scan line moves top (-15%) -> bottom (115%) over 4.2 seconds
        if (scannerRef.current) {
          tl.to(
            scannerRef.current,
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            0
          );

          tl.to(
            scannerRef.current,
            {
              top: "115%",
              duration: 4.2,
              ease: "power2.inOut",
            },
            0.1
          );

          tl.to(
            scannerRef.current,
            {
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            },
            3.7
          );
        }

        // Staggered line reveals as scan line passes over each line (4–5s total)
        lineRefs.current.forEach((el, idx) => {
          if (!el) return;
          const startTime = 0.3 + idx * 0.95; // Line 0: 0.3s, Line 1: 1.25s, Line 2: 2.2s, Line 3: 3.15s

          tl.to(
            el,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              webkitFilter: "blur(0px)",
              duration: 1.2,
              ease: "power4.out",
            },
            startTime
          );
        });
      }, 1000);
    };

    // 4. Strict Readiness Gating: window.load + document.fonts.ready + RAF paint + IntersectionObserver
    const observeAndViewportStart = () => {
      const container = containerRef.current;
      if (!container) {
        launchAnimation();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            // Double RAF guarantees browser paint completion before starting 1s timer
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                launchAnimation();
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

    const scanner = scannerRef.current;
    const lines = lineRefs.current;
    return () => {
      gsap.killTweensOf([scanner, ...lines]);
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
      {/* Soft White AI Scan Laser Line */}
      {!isAlreadyScanned && (
        <div
          ref={scannerRef}
          className="pointer-events-none absolute left-0 right-0 z-30 h-10 -translate-y-1/2"
        >
          {/* Glowing horizontal laser line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.6)]" />
          {/* Downward light beam aura */}
          <div className="h-10 w-full bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-sm" />
        </div>
      )}

      {/* Heading Lines */}
      {LINES.map((line, idx) => (
        <div key={idx} className="block overflow-hidden py-0.5">
          <div
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            className="inline-block"
            style={
              isAlreadyScanned
                ? { opacity: 1, transform: "none", filter: "none" }
                : {
                    opacity: 0,
                    transform: "translateY(20px)",
                    filter: "blur(12px)",
                  }
            }
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
