"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Zap, TrendingUp, Cpu, Award } from "lucide-react";

export default function PerformanceSimulator() {
  // Slider value from 0 (Generic Template) to 100 (Lumora Engineered)
  const [value, setValue] = useState(85);

  // Derived metrics based on slider position
  const fps = Math.round(24 + (value / 100) * 36); // 24 to 60
  const lighthouse = Math.round(38 + (value / 100) * 61); // 38 to 99
  const loadTime = (2.8 - (value / 100) * 2.3).toFixed(2); // 2.8s to 0.50s
  const conversionLift = Math.round((value / 100) * 160); // 0% to +160%

  return (
    <div className="w-full rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Cpu className="h-3.5 w-3.5" /> INTERACTIVE PERFORMANCE SIMULATOR
          </span>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white">
            Drag the slider to test <span className="text-gradient">web craft efficiency</span>
          </h3>
        </div>
        <div className="text-right font-mono text-xs text-white/50">
          <span>BENCHMARK DATA: REAL-TIME</span>
        </div>
      </div>

      {/* Interactive Slider Input */}
      <div className="my-8">
        <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-3">
          <span className="text-white/40">Standard Cookie-Cutter Template</span>
          <span className="text-white">Lumora Engineered Platform</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-3 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2">
          <span>0% (Bloated Code)</span>
          <span>50% (Average Agency)</span>
          <span className="text-cyan-300 font-bold">100% (Lumora Gold Standard)</span>
        </div>
      </div>

      {/* Live Metric Display Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Metric 1: FPS */}
        <motion.div
          animate={{ scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-white/50 mb-2">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Frame Rate</span>
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-white">
            {fps} <span className="text-xs text-cyan-300">FPS</span>
          </span>
          <span className="block text-[10px] text-white/40 mt-1">
            {fps >= 55 ? "Buttery Smooth Motion" : "Choppy Animations"}
          </span>
        </motion.div>

        {/* Metric 2: Lighthouse Score */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-white/50 mb-2">
            <Gauge className="h-3.5 w-3.5 text-purple-400" />
            <span>Lighthouse Score</span>
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-white">
            {lighthouse} <span className="text-xs text-purple-300">/ 100</span>
          </span>
          <span className="block text-[10px] text-white/40 mt-1">
            {lighthouse >= 90 ? "SEO & Core Web Vitals Pass" : "Fails Google Vitals"}
          </span>
        </div>

        {/* Metric 3: Load Time */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-white/50 mb-2">
            <Award className="h-3.5 w-3.5 text-electric-400" />
            <span>Load Speed</span>
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-white">
            {loadTime} <span className="text-xs text-electric-300">sec</span>
          </span>
          <span className="block text-[10px] text-white/40 mt-1">
            {Number(loadTime) < 1.0 ? "Instantaneous Load" : "Slow Visitor Retention"}
          </span>
        </div>

        {/* Metric 4: Conversion Lift */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-300 mb-2 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Conversion Lift</span>
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-cyan-300">
            +{conversionLift}%
          </span>
          <span className="block text-[10px] text-cyan-300/70 mt-1 font-mono">
            Projected Client Revenue
          </span>
        </div>
      </div>
    </div>
  );
}
