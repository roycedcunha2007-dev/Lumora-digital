"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Loader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Lock scroll while loading.
    document.body.style.overflow = "hidden";

    let current = 0;
    const tick = () => {
      const increment = Math.random() * 12 + 4;
      current = Math.min(100, current + increment);
      setCount(Math.floor(current));
      if (current < 100) {
        setTimeout(tick, Math.random() * 120 + 60);
      } else {
        setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
        }, 380);
      }
    };
    const start = setTimeout(tick, 200);
    return () => clearTimeout(start);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-navy-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-500/20 blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                Lumora<span className="text-electric-400"> Digital</span>
              </span>
            </div>

            {/* progress bar */}
            <div className="relative h-[2px] w-64 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg,#4f8dff,#8b5cf6,#22d3ee)",
                }}
                animate={{ width: `${count}%` }}
                transition={{ ease: "linear", duration: 0.15 }}
              />
            </div>

            <div className="flex w-64 items-center justify-between text-xs uppercase tracking-[0.25em] text-white/40">
              <span>Crafting experience</span>
              <span className="tabular-nums text-white/70">{count}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
