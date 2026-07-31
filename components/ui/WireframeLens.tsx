"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MoveRight, Layers, Eye, ShieldCheck, Zap } from "lucide-react";

export default function WireframeLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<"masterpiece" | "wireframe">("masterpiece");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      {/* Interactive Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>INTERACTIVE X-RAY LENS // HOVER TO REFRACT</span>
        </div>

        <div className="flex items-center gap-2 bg-navy-900/80 border border-white/10 rounded-full p-1 text-xs">
          <button
            onClick={() => setActiveTab("masterpiece")}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              activeTab === "masterpiece"
                ? "bg-gradient-to-r from-electric-500 to-purple-500 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            Lumora Masterpiece
          </button>
          <button
            onClick={() => setActiveTab("wireframe")}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              activeTab === "wireframe"
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Basic Wireframe
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-navy-950 shadow-2xl cursor-crosshair select-none group"
      >
        {/* BASE LAYER: Basic Template Wireframe */}
        <div className="absolute inset-0 bg-[#090b14] p-6 sm:p-10 flex flex-col justify-between font-mono text-white/30">
          {/* Wireframe Navbar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="h-6 w-28 bg-white/10 rounded border border-white/10" />
            <div className="flex gap-4">
              <div className="h-4 w-16 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/10 rounded" />
            </div>
          </div>

          {/* Wireframe Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto items-center">
            <div className="space-y-4">
              <div className="h-3 w-32 bg-white/10 rounded" />
              <div className="h-10 w-full bg-white/10 rounded border border-dashed border-white/20" />
              <div className="h-10 w-3/4 bg-white/10 rounded border border-dashed border-white/20" />
              <div className="h-16 w-full bg-white/5 rounded" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-32 bg-white/15 rounded" />
                <div className="h-10 w-28 bg-white/10 rounded" />
              </div>
            </div>
            <div className="aspect-video w-full bg-white/5 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center">
              <Layers className="h-8 w-8 text-white/20 mb-2" />
              <span className="text-xs">Generic Template Placeholder</span>
              <span className="text-[10px] text-white/20 mt-1">[Unoptimized Media]</span>
            </div>
          </div>

          {/* Wireframe Footer stats */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px]">
            <span>Lighthouse Score: 42/100</span>
            <span>FPS: 30</span>
            <span>Latency: High</span>
          </div>
        </div>

        {/* OVERLAY LAYER: Lumora Bespoke Masterpiece (Revealed by X-Ray Lens / Tab) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-[#04060f] p-6 sm:p-10 flex flex-col justify-between transition-all duration-300"
          style={{
            clipPath:
              activeTab === "masterpiece" && !isHovered
                ? "inset(0 0 0 0)"
                : activeTab === "wireframe" && !isHovered
                ? "inset(100% 100% 100% 100%)"
                : `circle(160px at ${position.x}% ${position.y}%)`,
          }}
        >
          {/* Masterpiece Ambient Lighting */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-electric-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Masterpiece Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-electric-500 to-purple-500 font-display text-xs font-bold text-white shadow-lg shadow-electric-500/30">
                L
              </span>
              <span className="font-display font-semibold text-white tracking-wide text-sm sm:text-base">
                Lumora Digital Studio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-medium text-cyan-300 backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> Bespoke Craft
              </span>
            </div>
          </div>

          {/* Masterpiece Body */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 my-auto items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
                Next-Gen Web Platform
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Architecting websites that <span className="text-gradient">outshine competitors.</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                Sub-second loading speeds, 60fps animations, and bespoke UI art direction engineered to elevate local brands.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-navy-950 transition-transform hover:scale-105 shadow-xl shadow-white/10">
                  Explore Live Demo
                  <MoveRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Masterpiece Floating Card Widget */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300">CORE ENGINE METRICS</span>
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              </div>
              <div className="grid grid-cols-3 gap-3 my-auto">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <span className="block font-display text-xl font-bold text-white">99/100</span>
                  <span className="text-[10px] text-white/50">Lighthouse</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <span className="block font-display text-xl font-bold text-cyan-300">60 FPS</span>
                  <span className="text-[10px] text-white/50">Animations</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <span className="block font-display text-xl font-bold text-purple-300">+140%</span>
                  <span className="text-[10px] text-white/50">Conversions</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/40 border-t border-white/10 pt-2">
                <span>Hand-coded Next.js &amp; Tailwind</span>
                <span className="text-cyan-300">Bespoke Architecture</span>
              </div>
            </div>
          </div>

          {/* Masterpiece Footer Bar */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-[11px] text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
              100% Custom Code · No Templates
            </span>
            <span className="font-mono text-cyan-300">STATUS: OPTIMIZED</span>
          </div>
        </div>

        {/* Floating Reticle Guide when hovering */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute z-30 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/80 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,240,255,0.4)] backdrop-blur-sm"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff]" />
            <span className="absolute -bottom-6 font-mono text-[9px] uppercase tracking-widest text-cyan-300">
              REFRACTION LENS
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
