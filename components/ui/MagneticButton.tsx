"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  strength?: number;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  strength = 0.4,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-colors duration-300 will-change-transform";

  const variants: Record<string, string> = {
    primary: "text-white shadow-glow",
    outline: "text-white border border-white/15 hover:border-white/30",
    ghost: "text-white/80 hover:text-white",
  };

  const Inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      className={cn(base, variants[variant], className)}
    >
      {variant === "primary" && (
        <>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-500 via-purple-500 to-cyan-500 bg-[length:200%_100%] animate-gradient-x" />
          <span className="absolute inset-[1.5px] rounded-full bg-navy-900/40 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0" />
        </>
      )}
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{ x: pos.x * 0.25, y: pos.y * 0.25 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex" onClick={onClick}>
        {Inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {Inner}
    </button>
  );
}
