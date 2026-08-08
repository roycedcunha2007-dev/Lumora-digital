"use client";

import { useEffect, useRef } from "react";

/**
 * A GPU-friendly animated backdrop: slow-drifting gradient orbs painted on a
 * canvas + a faint interactive particle field that leans toward the cursor.
 * Uses Deep Obsidian, single Electric Blue accent, and soft white highlights.
 */
export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const orbs = [
      { x: 0.2, y: 0.25, r: 0.45, hue: [59, 130, 246], t: 0, speed: 0.00018 },  // Electric Blue
      { x: 0.8, y: 0.3, r: 0.38, hue: [215, 228, 250], t: 2, speed: 0.00015 },  // Soft White
      { x: 0.6, y: 0.8, r: 0.50, hue: [37, 99, 235], t: 4, speed: 0.00014 },   // Deep Electric Blue
      { x: 0.35, y: 0.7, r: 0.36, hue: [8, 12, 24], t: 1, speed: 0.00016 },    // Deep Obsidian
    ];

    type P = { x: number; y: number; vx: number; vy: number; s: number };
    let particles: P[] = [];

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(60, Math.floor((w * h) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        s: Math.random() * 1.5 + 0.4,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;

    const drawOrbs = (time: number) => {
      ctx.globalCompositeOperation = "lighter";
      for (const o of orbs) {
        const driftX = Math.sin(time * o.speed + o.t) * 0.08;
        const driftY = Math.cos(time * o.speed * 1.3 + o.t) * 0.08;
        const parX = (mouse.x - 0.5) * 0.06;
        const parY = (mouse.y - 0.5) * 0.06;
        const cx = (o.x + driftX + parX) * w;
        const cy = (o.y + driftY + parY) * h;
        const radius = o.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, gr, b] = o.hue;
        g.addColorStop(0, `rgba(${r},${gr},${b},0.12)`);
        g.addColorStop(0.4, `rgba(${r},${gr},${b},0.04)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawParticles = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const mx = mouse.x * w;
      const my = mouse.y * h;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // gentle attraction to cursor
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          p.x += (dx / dist) * 0.10;
          p.y += (dy / dist) * 0.10;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(215,225,245,0.30)";
        ctx.fill();
      }

      // connective lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(180,205,245,${(1 - d / 110) * 0.10})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      drawOrbs(time);
      drawParticles();
      raf = requestAnimationFrame(render);
    };

    if (reduced) {
      // paint a single static frame
      drawOrbs(0);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950">
      {/* deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(10,14,28,0.75),_rgba(0,0,0,1)_60%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* animated grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.5] mask-fade-y" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_42%,_rgba(0,0,0,0.92)_100%)]" />
      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
