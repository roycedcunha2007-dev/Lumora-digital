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

export type CardVariant =
  | "default"
  | "luxury"
  | "ai-futuristic"
  | "gold-luxury"
  | "silver-cyan"
  | "trust-blue";

export default function TiltCard({
  children,
  className,
  intensity = 1.8,
  glare = true,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  variant?: CardVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
    }
  }, []);

  const sx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 24, mass: 0.4 });

  // Strictly cap maximum rotation to 1.5 degrees for refined luxury feel
  const maxTilt = Math.min(Math.max(intensity, 0.5), 1.5);

  const rotateX = useTransform(
    sy,
    [-0.5, 0.5],
    [isTouch ? 0 : maxTilt, isTouch ? 0 : -maxTilt]
  );
  const rotateY = useTransform(
    sx,
    [-0.5, 0.5],
    [isTouch ? 0 : -maxTilt, isTouch ? 0 : maxTilt]
  );

  /* Cursor-reactive refraction coordinates */
  const glareX = useTransform(sx, [-0.5, 0.5], ["15%", "85%"]) as MotionValue<string>;
  const glareY = useTransform(sy, [-0.5, 0.5], ["15%", "85%"]) as MotionValue<string>;

  /* Directional natural shadow offset */
  const shadowX = useTransform(sx, [-0.5, 0.5], [6, -6]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [14, 6]);

  const dynamicBoxShadow = useTransform(
    [shadowX, shadowY],
    ([sxVal, syVal]) =>
      `${sxVal}px ${syVal}px 45px -10px rgba(0, 0, 0, 0.85), 0 10px 24px -5px rgba(0, 0, 0, 0.6)`
  );

  /* Very subtle warm ivory / specular sheen */
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 75%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative group [perspective:1400px]">
      {/* Soft natural ambient shadow */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-[2.5rem] bg-black/40 blur-xl transition-opacity duration-700 ease-out",
          isHovered ? "opacity-90" : "opacity-30"
        )}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          isHovered
            ? { y: -7, scale: 1.01 }
            : { y: 0, scale: 1 }
        }
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
          mass: 0.5,
        }}
        style={{
          rotateX,
          rotateY,
          boxShadow: isHovered ? dynamicBoxShadow : "0 18px 45px -15px rgba(0,0,0,0.7)",
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative will-change-transform rounded-[2rem] border border-white/[0.08] bg-[#0e1014]/90 backdrop-blur-[24px] transition-colors duration-500 hover:border-white/20 hover:bg-[#12151b]/95",
          className
        )}
      >
        {/* Specular Inner Edge Top Highlight (Subtle Inner Highlight & Rim Light) */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(255,255,255,0.02)]" />

        {/* Layered Content Container with Preserved 3D Depth */}
        <div className="relative z-10 [transform-style:preserve-3d]">{children}</div>

        {/* Subtle Specular Glare Reflection */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-screen"
            style={{ background: glareBg, transform: "translateZ(10px)" }}
          />
        )}
      </motion.div>
    </div>
  );
}
