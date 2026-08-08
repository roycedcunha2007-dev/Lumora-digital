"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="relative my-12 flex w-full items-center justify-center overflow-hidden py-4">
      {/* Horizontal glowing line */}
      <div className="h-px w-full max-w-[1360px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Animated traveling light beam */}
      <motion.div
        className="absolute h-[1.5px] w-48 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-[1px]"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
        }}
      />

      {/* Central floating crystal node */}
      <div className="absolute flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
        <span className="absolute h-4 w-4 rounded-full border border-white/20 animate-ping opacity-75" />
      </div>
    </div>
  );
}
