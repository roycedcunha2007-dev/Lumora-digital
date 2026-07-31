"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "text">(
    "default"
  );
  const [label, setLabel] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

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
      const t = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor]"
      ) as HTMLElement | null;
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

  if (!enabled) return null;

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: variant === "text" ? 76 : variant === "hover" ? 56 : 34,
          height: variant === "text" ? 76 : variant === "hover" ? 56 : 34,
          backgroundColor:
            variant === "hover" || variant === "text"
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0.85)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <span
          className="rounded-full border"
          style={{
            position: "absolute",
            inset: 0,
            borderColor: "inherit",
            borderWidth: 1.5,
            borderRadius: 999,
          }}
        />
        {label && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white">
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
          opacity: variant === "text" ? 0 : 1,
        }}
      />
    </>
  );
}
