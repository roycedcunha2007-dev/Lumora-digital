"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[9998] h-[3px] w-full origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #4f8dff 0%, #8b5cf6 50%, #22d3ee 100%)",
        boxShadow: "0 0 18px rgba(79,141,255,0.7)",
      }}
    />
  );
}
