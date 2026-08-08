"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Confetti particle configuration - Electric Blue & White
const CONFETTI_PARTICLES = Array.from({ length: 26 }).map((_, i) => {
  const angle = (i / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
  const distance = 90 + Math.random() * 80;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    scale: Math.random() * 0.6 + 0.4,
    color: i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#93C5FD" : "#3B82F6", // White, Light Blue, Electric Blue
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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    // Smooth 350ms exit transition before calling onClose
    setTimeout(() => {
      setIsClosing(false);
      // Ensure body overflow is restored
      document.body.style.overflow = "auto";
      onClose();
    }, 350);
  };

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
      playSuccessChime();

      // Focus close button for accessibility
      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 100);

      // Auto-close after 5 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 5000);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(autoCloseTimer);
        window.removeEventListener("keydown", handleKeyDown);
        // Guarantee body scroll restoration
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          {/* 12px Blurred Backdrop Overlay — Click Outside to Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-[16px]"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{
              opacity: isClosing ? 0 : 1,
              scale: isClosing ? 0.9 : 1,
              filter: isClosing ? "blur(10px)" : "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.25rem] border border-white/[0.08] bg-[#08080c]/95 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />

            {/* 40x40px Glassmorphism Close (X) Button */}
            <button
              ref={closeBtnRef}
              onClick={handleClose}
              className="group absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.08] hover:bg-white/20 sm:right-5 sm:top-5 cursor-pointer"
              aria-label="Close success dialog"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90 text-white" />
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
                    delay: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ backgroundColor: p.color }}
                  className="pointer-events-none absolute h-2 w-2 rounded-full"
                />
              ))}

              {/* Expanding Electric Blue Gradient Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              />

              {/* Animated SVG Checkmark */}
              <svg className="relative z-10 h-12 w-12 text-white" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                />
              </svg>

              {/* Sparkle Badges */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -right-1 -top-1"
              >
                <Sparkles className="h-5 w-5 text-blue-200 fill-blue-200" />
              </motion.div>
            </div>

            {/* Success Heading */}
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Message Sent Successfully!
            </motion.h3>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.45 }}
              className="mt-2 text-sm leading-relaxed text-white/65"
            >
              Thank you for contacting Lumora Digital. We&apos;ve received your message and will get back to you within 24 hours.
            </motion.p>

            {/* Action Button: Continue Browsing */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.45 }}
              className="mt-8"
            >
              <button
                onClick={handleClose}
                className="w-full rounded-full bg-white py-3.5 text-sm font-bold text-navy-950 transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                Continue Browsing
              </button>
            </motion.div>

            {/* 5-Second Auto-Close Countdown Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-60"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
