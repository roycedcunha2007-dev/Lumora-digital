"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "text" | "hidden">("default");
  const [label, setLabel] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const auraX = useSpring(x, { stiffness: 140, damping: 24, mass: 0.8 });
  const auraY = useSpring(y, { stiffness: 140, damping: 24, mass: 0.8 });
  const ringX = useSpring(x, { stiffness: 350, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 26, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 950, damping: 38 });
  const dotY = useSpring(y, { stiffness: 950, damping: 38 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // When over form inputs, textareas, selects, or checkout modal, hide custom cursor
      const isInput = target.closest(
        "input, textarea, select, [contenteditable='true'], .checkout-modal, .checkout-input"
      );
      if (isInput) {
        setVariant("hidden");
        setLabel("");
        return;
      }

      const t = target.closest("a, button, [data-cursor]") as HTMLElement | null;
      if (!t) {
        setVariant("default");
        setLabel("");
        return;
      }
      const custom = t.getAttribute("data-cursor");
      if (custom) {
        setVariant("text");
        setLabel(custom);
      } else {
        setVariant("hover");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled || variant === "hidden") return null;

  return (
    <>
      {/* Ambient cursor light aura */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9990] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl opacity-50"
        style={{ x: auraX, y: auraY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Trailing glass ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-white/80 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: variant === "text" ? 82 : variant === "hover" ? 58 : 34,
          height: variant === "text" ? 82 : variant === "hover" ? 58 : 34,
          backgroundColor:
            variant === "hover" || variant === "text"
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0)",
          scale: variant === "hover" ? 1.15 : 1,
          opacity: variant === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">
            {label}
          </span>
        )}
      </motion.div>

      {/* Precise dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: variant === "text" || variant === "hidden" ? 0 : 1,
        }}
      />
    </>
  );
}
