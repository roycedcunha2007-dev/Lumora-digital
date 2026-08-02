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
  intensity = 12,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
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

  const sx = useSpring(x, { stiffness: 280, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 20, mass: 0.4 });

  const rotateX = useTransform(
    sy,
    [-0.5, 0.5],
    [isTouch ? 0 : intensity, isTouch ? 0 : -intensity]
  );
  const rotateY = useTransform(
    sx,
    [-0.5, 0.5],
    [isTouch ? 0 : -intensity, isTouch ? 0 : intensity]
  );

  /* Cursor-reactive refraction spotlight coordinates */
  const glareX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]) as MotionValue<string>;
  const glareY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]) as MotionValue<string>;

  /* Dynamic Directional Shadow Offset opposite cursor displacement */
  const shadowX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [32, 10]);

  const dynamicBoxShadow = useTransform(
    [shadowX, shadowY],
    ([sxVal, syVal]) =>
      `${sxVal}px ${syVal}px 55px rgba(0, 0, 0, 0.65), 0 0 35px rgba(97, 130, 255, 0.18)`
  );

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.35) 0%, rgba(0,240,255,0.18) 30%, rgba(139,92,246,0.1) 60%, transparent 85%)`
  );

  const holoBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 340px at ${gx} ${gy}, rgba(0, 240, 255, 0.28) 0%, rgba(139, 92, 246, 0.22) 32%, rgba(236, 72, 153, 0.16) 62%, transparent 85%)`
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
    <div className="relative group [perspective:1200px]">
      {/* Soft Ambient Backglow behind the card (Electric Blue, Aurora Cyan, Soft Purple) */}
      <div className="pointer-events-none absolute -inset-3 rounded-[2.8rem] bg-gradient-to-r from-electric-500/20 via-cyan-500/20 to-purple-500/25 opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

      {/* Behind Card Ambient Light & Particle Sparkle Field */}
      <div className="pointer-events-none absolute -inset-1 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.12),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          isHovered
            ? { y: -12, scale: 1.02 }
            : { y: [0, -3, 0], scale: 1 }
        }
        transition={
          isHovered
            ? { type: "spring", stiffness: 280, damping: 20 }
            : {
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.4 },
              }
        }
        style={{
          rotateX,
          rotateY,
          boxShadow: isHovered ? dynamicBoxShadow : undefined,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative will-change-transform rounded-[2rem] border border-white/15 bg-white/[0.035] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition-colors duration-500 hover:border-white/30 hover:bg-white/[0.07]",
          className
        )}
      >
        {/* Animated Moving Gradient Border Sweep */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.4),rgba(0,240,255,0.6)_25%,rgba(139,92,246,0.6)_50%,rgba(97,130,255,0.5)_75%,rgba(255,255,255,0.4)_100%)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] opacity-40 transition-opacity duration-500 group-hover:opacity-100 animate-[rotate-border_8s_linear_infinite]" />

        {/* Specular Inner Edge Top & Left Highlight Lines (Apple Vision Pro Liquid Glass Rim) */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.35),inset_0_-1px_0_0_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.03)]" />

        {/* Shimmer Light Reflection Sweep Line */}
        <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />

        {/* Holographic Iridescent Cursor-Reactive Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-color-dodge"
          style={{ background: holoBg, transform: "translateZ(10px)" }}
        />

        {/* Layered Content Container with 3D Preservation */}
        <div className="relative z-10 [transform-style:preserve-3d]">{children}</div>

        {/* Cursor Reactive Spotlight Glare / Caustics */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-400 group-hover:opacity-100 mix-blend-overlay"
            style={{ background: glareBg, transform: "translateZ(15px)" }}
          />
        )}
      </motion.div>
    </div>
  );
}

