"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function RobotAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      speedY: Math.random() * -0.2 - 0.05,
      speedX: (Math.random() - 0.5) * 0.1,
    }));

    let animId = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 240, 255, 0.5)";
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
      {/* Soft Breathing Ambient Eye/Chest Glow */}
      <motion.div
        className="h-[60%] w-[60%] rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-electric-500/15 blur-[100px]"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: "easeInOut",
        }}
      />

      {/* Subtle floating light particles around robot */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
