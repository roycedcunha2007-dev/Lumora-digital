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
  intensity = 12,
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
    ([sxVal, syVal]) => {
      const shadowColor =
        variant === "gold-luxury"
          ? "rgba(212, 175, 55, 0.22)"
          : variant === "ai-futuristic"
          ? "rgba(0, 240, 255, 0.25)"
          : variant === "trust-blue"
          ? "rgba(129, 140, 248, 0.22)"
          : "rgba(97, 130, 255, 0.18)";
      return `${sxVal}px ${syVal}px 55px rgba(0, 0, 0, 0.65), 0 0 35px ${shadowColor}`;
    }
  );

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => {
      if (variant === "ai-futuristic") {
        return `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.4) 0%, rgba(0,240,255,0.25) 30%, rgba(97,130,255,0.12) 60%, transparent 85%)`;
      }
      if (variant === "gold-luxury") {
        return `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,235,160,0.45) 0%, rgba(212,175,55,0.25) 30%, rgba(255,190,40,0.12) 60%, transparent 85%)`;
      }
      if (variant === "silver-cyan") {
        return `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.42) 0%, rgba(0,240,255,0.16) 32%, rgba(220,225,235,0.1) 60%, transparent 85%)`;
      }
      if (variant === "trust-blue") {
        return `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.38) 0%, rgba(129,140,248,0.22) 30%, rgba(99,102,241,0.1) 60%, transparent 85%)`;
      }
      return `radial-gradient(circle 380px at ${gx} ${gy}, rgba(255,255,255,0.35) 0%, rgba(0,240,255,0.18) 30%, rgba(139,92,246,0.1) 60%, transparent 85%)`;
    }
  );

  const holoBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => {
      if (variant === "ai-futuristic") {
        return `radial-gradient(circle 340px at ${gx} ${gy}, rgba(0,240,255,0.35) 0%, rgba(97,130,255,0.25) 35%, rgba(0,240,255,0.15) 65%, transparent 85%)`;
      }
      if (variant === "gold-luxury") {
        return `radial-gradient(circle 340px at ${gx} ${gy}, rgba(255,215,0,0.32) 0%, rgba(212,175,55,0.25) 35%, rgba(255,235,160,0.16) 65%, transparent 85%)`;
      }
      if (variant === "silver-cyan") {
        return `radial-gradient(circle 340px at ${gx} ${gy}, rgba(255,255,255,0.34) 0%, rgba(0,240,255,0.2) 35%, rgba(200,215,240,0.12) 65%, transparent 85%)`;
      }
      if (variant === "trust-blue") {
        return `radial-gradient(circle 340px at ${gx} ${gy}, rgba(129,140,248,0.3) 0%, rgba(99,102,241,0.22) 35%, rgba(168,85,247,0.14) 65%, transparent 85%)`;
      }
      return `radial-gradient(circle 340px at ${gx} ${gy}, rgba(0, 240, 255, 0.28) 0%, rgba(139, 92, 246, 0.22) 32%, rgba(236, 72, 153, 0.16) 62%, transparent 85%)`;
    }
  );

  const backglowMap: Record<CardVariant, string> = {
    default: "from-electric-500/20 via-cyan-500/20 to-purple-500/25",
    luxury: "from-purple-500/30 via-electric-500/20 to-cyan-500/25",
    "ai-futuristic": "from-cyan-500/28 via-blue-500/22 to-electric-500/25",
    "gold-luxury": "from-amber-500/35 via-yellow-500/25 to-amber-600/30",
    "silver-cyan": "from-white/20 via-cyan-500/15 to-white/10",
    "trust-blue": "from-purple-500/22 via-indigo-500/22 to-cyan-500/20",
  };

  const borderConicMap: Record<CardVariant, string> = {
    default:
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.4),rgba(0,240,255,0.6)_25%,rgba(139,92,246,0.6)_50%,rgba(97,130,255,0.5)_75%,rgba(255,255,255,0.4)_100%)]",
    luxury:
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.6),rgba(139,92,246,0.6)_35%,rgba(97,130,255,0.5)_70%,rgba(255,255,255,0.6)_100%)]",
    "ai-futuristic":
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.5),rgba(0,240,255,0.85)_30%,rgba(97,130,255,0.65)_65%,rgba(255,255,255,0.5)_100%)]",
    "gold-luxury":
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,223,128,0.8),rgba(212,175,55,0.6)_30%,rgba(255,215,0,0.7)_65%,rgba(255,223,128,0.8)_100%)]",
    "silver-cyan":
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.55),rgba(220,225,235,0.35)_40%,rgba(0,240,255,0.45)_75%,rgba(255,255,255,0.55)_100%)]",
    "trust-blue":
      "bg-[conic-gradient(from_var(--border-angle,0deg),rgba(255,255,255,0.45),rgba(129,140,248,0.6)_35%,rgba(99,102,241,0.45)_70%,rgba(255,255,255,0.45)_100%)]",
  };

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
      {/* Soft Ambient Backglow behind the card (Variant Specific) */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-3 rounded-[2.8rem] bg-gradient-to-r opacity-30 blur-2xl transition-opacity duration-700 group-hover:opacity-100",
          backglowMap[variant]
        )}
      />

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
        <div
          className={cn(
            "pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] opacity-40 transition-opacity duration-500 group-hover:opacity-100 animate-[rotate-border_8s_linear_infinite]",
            borderConicMap[variant]
          )}
        />

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

