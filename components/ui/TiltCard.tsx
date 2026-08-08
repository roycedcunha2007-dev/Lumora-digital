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

  // Strictly cap maximum rotation to 2.0 degrees for refined luxury feel
  const maxTilt = Math.min(Math.max(intensity, 0.5), 2.0);

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

  /* Cursor-reactive refraction spotlight coordinates */
  const glareX = useTransform(sx, [-0.5, 0.5], ["15%", "85%"]) as MotionValue<string>;
  const glareY = useTransform(sy, [-0.5, 0.5], ["15%", "85%"]) as MotionValue<string>;

  /* Directional shadow offset */
  const shadowX = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [16, 6]);

  const dynamicBoxShadow = useTransform(
    [shadowX, shadowY],
    ([sxVal, syVal]) =>
      `${sxVal}px ${syVal}px 45px -10px rgba(0, 0, 0, 0.75), 0 0 30px -8px rgba(59, 130, 246, 0.16)`
  );

  /* Subtle single electric-blue cursor-following reflection glare */
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.18) 0%, rgba(59,130,246,0.10) 35%, transparent 75%)`
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
      {/* Subtle Ambient Electric Blue Backglow - Idle: very subtle (0.12), Hover: slightly stronger (0.32) */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_70%)] blur-2xl transition-opacity duration-700 ease-out",
          isHovered ? "opacity-100" : "opacity-35"
        )}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          isHovered
            ? { y: -8, scale: 1.015 }
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
          boxShadow: isHovered ? dynamicBoxShadow : "0 18px 45px -15px rgba(0,0,0,0.65)",
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative will-change-transform rounded-[2rem] border border-white/[0.08] bg-[#08080c]/85 backdrop-blur-[24px] transition-colors duration-500 hover:border-blue-500/30 hover:bg-[#090a10]/90",
          className
        )}
      >
        {/* Slow light sweep on thin border */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] opacity-25 transition-opacity duration-500 group-hover:opacity-80 bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.25),rgba(59,130,246,0.45)_30%,rgba(255,255,255,0.06)_60%,rgba(59,130,246,0.35)_85%,rgba(255,255,255,0.25)_100%)] animate-[rotate-border_12s_linear_infinite]"
        />

        {/* Specular Inner Edge Top Highlight (Subtle Inner Highlight & Rim Light) */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_-1px_0_0_rgba(255,255,255,0.02)]" />

        {/* Occasional Slow Shimmer Light Sweep */}
        <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />

        {/* Layered Content Container with Preserved 3D Depth */}
        <div className="relative z-10 [transform-style:preserve-3d]">{children}</div>

        {/* Cursor-Reactive Glare Reflection */}
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
