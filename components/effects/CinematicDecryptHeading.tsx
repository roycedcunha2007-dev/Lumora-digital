"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LineConfig {
  target: string;
  gradientWord?: string;
}

const LINES: LineConfig[] = [
  { target: "Crafting digital" },
  { target: "experiences that" },
  { target: "illuminate your" },
  { target: "brand identity.", gradientWord: "brand identity." },
];

const SCRAMBLE_SYMBOLS = ["#", "@", "$", "%", "&", "!", "¥", "0", "3", "4", "7"];

function getRandomSymbol() {
  return SCRAMBLE_SYMBOLS[Math.floor(Math.random() * SCRAMBLE_SYMBOLS.length)];
}

function getUpperVariant(char: string) {
  if (char === " ") return " ";
  if (/[a-zA-Z]/.test(char)) {
    return Math.random() < 0.35 ? getRandomSymbol() : char.toUpperCase();
  }
  return char;
}

export default function CinematicDecryptHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineTexts, setLineTexts] = useState<string[]>(LINES.map(() => ""));
  const [lineActive, setLineActive] = useState<boolean[]>([false, false, false, false]);
  const [sweepActive, setSweepActive] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const sequenceStartedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Check if already played in this browser session
    if (typeof window !== "undefined" && sessionStorage.getItem("lumora_hero_decrypted") === "true") {
      setLineTexts(LINES.map((l) => l.target));
      setLineActive([true, true, true, true]);
      return;
    }

    // 2. Timeline parameters
    const LINE_DURATION = 1000; // ms per line (slowed down for enjoyment)
    const PAUSE_BETWEEN = 150;  // ms pause after each line completes
    // Line 0: 0ms -> 1000ms
    // Line 1: 1150ms -> 2150ms
    // Line 2: 2300ms -> 3300ms
    // Line 3: 3450ms -> 4450ms
    const TOTAL_LINE_ANIM_TIME = 4450;
    const POST_LOCK_PAUSE = 300; // ms wait before light sweep

    const runSequence = () => {
      if (sequenceStartedRef.current) return;
      sequenceStartedRef.current = true;
      try {
        sessionStorage.setItem("lumora_hero_decrypted", "true");
      } catch (e) {
        // Fallback if cookies/storage blocked
      }

      // Add 700ms grace delay after page load + viewport entry before starting line 1
      setTimeout(() => {
        const startTime = performance.now();

        const updateFrame = (now: number) => {
          const elapsed = now - startTime;

          const newTexts = [...lineTexts];
          const newActive = [false, false, false, false];

          LINES.forEach((line, idx) => {
            const lineStart = idx * (LINE_DURATION + PAUSE_BETWEEN);
            const lineElapsed = elapsed - lineStart;

            if (lineElapsed < 0) {
              // Line hasn't started yet
              newTexts[idx] = "";
              newActive[idx] = false;
            } else if (lineElapsed >= LINE_DURATION) {
              // Line finished & locked
              newTexts[idx] = line.target;
              newActive[idx] = true;
            } else {
              // Line actively decrypting
              newActive[idx] = true;
              const progress = lineElapsed / LINE_DURATION; // 0 to 1
              const targetStr = line.target;
              const len = targetStr.length;

              let result = "";
              for (let i = 0; i < len; i++) {
                const char = targetStr[i];
                if (char === " ") {
                  result += " ";
                  continue;
                }

                // Organic 3-stage left-to-right resolution curve
                const charThreshold = (i / len) * 0.48;
                if (progress < charThreshold) {
                  // Stage 1: Full Scramble (# @ $ % & ! ¥ 0 3 4 7)
                  result += getRandomSymbol();
                } else if (progress < charThreshold + 0.32) {
                  // Stage 2: Intermediate uppercase / partial symbol (BR@ND !D3NT!TY)
                  result += getUpperVariant(char);
                } else {
                  // Stage 3: Target locked character
                  result += char;
                }
              }
              newTexts[idx] = result;
            }
          });

          setLineTexts(newTexts);
          setLineActive(newActive);

          if (elapsed < TOTAL_LINE_ANIM_TIME) {
            animFrameRef.current = requestAnimationFrame(updateFrame);
          } else {
            // All 4 lines complete -> wait 300ms then play single subtle 700ms light sweep
            setTimeout(() => {
              setSweepActive(true);
              setTimeout(() => {
                setSweepActive(false);
              }, 700);
            }, POST_LOCK_PAUSE);
          }
        };

        animFrameRef.current = requestAnimationFrame(updateFrame);
      }, 700);
    };

    // 3. Readiness Gate: Page Load + Fonts Ready + Viewport Intersection
    const observeViewportAndStart = () => {
      const el = containerRef.current;
      if (!el) {
        runSequence();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect();
            runSequence();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    };

    const waitFullLoad = () => {
      const onReady = () => {
        if (document.fonts?.ready) {
          document.fonts.ready.then(observeViewportAndStart).catch(observeViewportAndStart);
        } else {
          observeViewportAndStart();
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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* 700ms One-time light sweep overlay */}
      {sweepActive && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: 0.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay"
        />
      )}

      {LINES.map((line, idx) => {
        const isActive = lineActive[idx];
        const textToDisplay = lineTexts[idx];

        return (
          <div key={idx} className="block overflow-hidden py-0.5">
            <motion.div
              initial={{ y: -60, opacity: 0, filter: "blur(12px)" }}
              animate={
                isActive
                  ? { y: 0, opacity: 1, filter: "blur(0px)" }
                  : { y: -60, opacity: 0, filter: "blur(12px)" }
              }
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1], // easeOutExpo / power4.out
              }}
              className="inline-block"
            >
              {line.gradientWord ? (
                <span className="text-gradient">{textToDisplay || "\u00A0"}</span>
              ) : (
                <span>{textToDisplay || "\u00A0"}</span>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
