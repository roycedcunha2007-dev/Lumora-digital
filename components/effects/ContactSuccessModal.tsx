"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Confetti particle configuration
const CONFETTI_PARTICLES = Array.from({ length: 26 }).map((_, i) => {
  const angle = (i / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
  const distance = 90 + Math.random() * 80;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    scale: Math.random() * 0.6 + 0.4,
    color: i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#C084FC" : "#38BDF8", // White, Light Purple, Soft Blue
  };
});

function playSuccessChime() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Note 1 (C5 - 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.45);

    // Note 2 (G5 - 783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (e) {
    // Audio Context fallback
  }
}

export default function ContactSuccessModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      playSuccessChime();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-[12px]"
          />

          {/* Modal Container (Scale: 0.8->1, Opacity: 0->100%, Blur: 10px->0px) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.25rem] border border-white/15 bg-navy-950/90 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Central Success Icon & Confetti Burst */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {/* Confetti Particles */}
              {CONFETTI_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0, p.scale, 0],
                    opacity: [1, 0.9, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    delay: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ backgroundColor: p.color }}
                  className="pointer-events-none absolute h-2 w-2 rounded-full"
                />
              ))}

              {/* Expanding Emerald/Cyan Gradient Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              />

              {/* Animated SVG Checkmark */}
              <svg className="relative z-10 h-12 w-12 text-navy-950" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.45, duration: 0.4, ease: "easeOut" }}
                />
              </svg>

              {/* Sparkle Badges */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -right-1 -top-1"
              >
                <Sparkles className="h-5 w-5 text-amber-300 fill-amber-300" />
              </motion.div>
            </div>

            {/* Success Heading */}
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Message Sent Successfully!
            </motion.h3>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2 text-sm leading-relaxed text-white/65"
            >
              Thank you for contacting Lumora Digital. We&apos;ve received your message and will get back to you within 24 hours.
            </motion.p>

            {/* Action Button: Continue Browsing */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={onClose}
                className="w-full rounded-full bg-white py-3.5 text-sm font-bold text-navy-950 transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                Continue Browsing
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
