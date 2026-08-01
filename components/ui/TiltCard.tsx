"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({
  children,
  className,
  intensity = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
    }
  }, []);

  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [isTouch ? 0 : intensity, isTouch ? 0 : -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [isTouch ? 0 : -intensity, isTouch ? 0 : intensity]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]) as MotionValue<string>;
  const glareY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]) as MotionValue<string>;

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, transparent 70%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative group">
      {/* Soft ambient backglow behind the card */}
      <div className="pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-electric-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "relative [perspective:1000px] will-change-transform rounded-[2rem] border border-white/12 bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]",
          className
        )}
      >
        {/* Specular inner top highlight line */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" />

        {/* 12-Second Shimmer Reflection Light Sweep */}
        <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />

        <div className="relative z-10">{children}</div>

        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
