"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, Activity } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Counter from "@/components/ui/Counter";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { heroStats } from "@/lib/site";
import RobotSpeechPresenter from "@/components/ui/RobotSpeechPresenter";
import RobotAtmosphere from "@/components/effects/RobotAtmosphere";
import ContinuousAIScanHeading from "@/components/effects/ContinuousAIScanHeading";
import HeroStatsBar from "@/components/effects/HeroStatsBar";
import { useCheckout } from "@/components/checkout/CheckoutContext";

export default function Hero() {
  const { openCheckout } = useCheckout();
  const ref = useRef<HTMLElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isSpeakingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep isSpeakingRef in sync
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Smooth 60fps Lerp Cursor & Eye Tracking Physics Loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = robotContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const nx = (e.clientX - centerX) / (window.innerWidth * 0.45);
      const ny = (e.clientY - centerY) / (window.innerHeight * 0.45);

      // Natural clamped range (-1 to 1)
      mouseTarget.current.x = Math.max(-1, Math.min(1, nx));
      mouseTarget.current.y = Math.max(-1, Math.min(1, ny));
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateTracking = () => {
      const app = splineAppRef.current;
      if (app) {
        // Smooth lerp interpolation with 0.08 damping
        currentMouse.current.x = lerp(currentMouse.current.x, mouseTarget.current.x, 0.08);
        currentMouse.current.y = lerp(currentMouse.current.y, mouseTarget.current.y, 0.08);

        const cx = currentMouse.current.x;
        const cy = currentMouse.current.y;
        // When speaking, maintain 50% tracking weight to preserve eye contact
        const speakingWeight = isSpeakingRef.current ? 0.5 : 1.0;

        // Update Spline variables if scene uses them
        if (typeof app.setVariable === "function") {
          app.setVariable("mouseX", cx * speakingWeight);
          app.setVariable("mouseY", -cy * speakingWeight);
        }

        // 1. Eyes Tracking (strongest, most responsive)
        const eyesObj =
          app.findObjectByName?.("Eyes") ||
          app.findObjectByName?.("eyes") ||
          app.findObjectByName?.("Eye") ||
          app.findObjectByName?.("eye");
        if (eyesObj && eyesObj.rotation) {
          eyesObj.rotation.y = cx * 0.28 * speakingWeight;
          eyesObj.rotation.x = -cy * 0.18 * speakingWeight;
        }

        // 2. Head Tracking (refined, small rotation max ~10-12°)
        const headObj =
          app.findObjectByName?.("Head") ||
          app.findObjectByName?.("head") ||
          app.findObjectByName?.("Face") ||
          app.findObjectByName?.("face") ||
          app.findObjectByName?.("Robot") ||
          app.findObjectByName?.("robot");
        if (headObj && headObj.rotation) {
          headObj.rotation.y = cx * 0.18 * speakingWeight;
          headObj.rotation.x = -cy * 0.12 * speakingWeight;
        }

        // 3. Neck Tracking (very subtle movement)
        const neckObj =
          app.findObjectByName?.("Neck") ||
          app.findObjectByName?.("neck");
        if (neckObj && neckObj.rotation) {
          neckObj.rotation.y = cx * 0.04 * speakingWeight;
          neckObj.rotation.x = -cy * 0.03 * speakingWeight;
        }

        // 4. Body Tracking (almost stationary)
        const bodyObj =
          app.findObjectByName?.("Body") ||
          app.findObjectByName?.("body") ||
          app.findObjectByName?.("Torso") ||
          app.findObjectByName?.("torso");
        if (bodyObj && bodyObj.rotation) {
          bodyObj.rotation.y = cx * 0.012 * speakingWeight;
        }
      }

      rafIdRef.current = requestAnimationFrame(updateTracking);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafIdRef.current = requestAnimationFrame(updateTracking);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Periodic Natural Blinking Loop (every 3.5s - 6s)
  useEffect(() => {
    let isMounted = true;
    const scheduleBlink = () => {
      const nextBlinkDelay = 3500 + Math.random() * 2500;
      blinkTimeoutRef.current = setTimeout(() => {
        if (!isMounted) return;
        const app = splineAppRef.current;
        if (app) {
          const eyesObj =
            app.findObjectByName?.("Eyes") ||
            app.findObjectByName?.("eyes") ||
            app.findObjectByName?.("Eye") ||
            app.findObjectByName?.("eye");
          if (eyesObj && eyesObj.scale) {
            eyesObj.scale.y = 0.05;
            setTimeout(() => {
              if (eyesObj.scale) eyesObj.scale.y = 1.0;
            }, 130);
          }
        }
        scheduleBlink();
      }, nextBlinkDelay);
    };

    scheduleBlink();
    return () => {
      isMounted = false;
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  // Handle Robot Animation Actions during speech sequence
  const handleRobotAnimation = useCallback(
    (action: "turn_to_user" | "blink" | "welcome_gesture" | "present_gesture" | "idle") => {
      const app = splineAppRef.current;
      if (!app) return;

      try {
        if (action === "turn_to_user") {
          setIsSpeaking(true);
          const headObj =
            app.findObjectByName?.("Head") ||
            app.findObjectByName?.("head") ||
            app.findObjectByName?.("Robot") ||
            app.findObjectByName?.("robot");
          if (headObj && headObj.rotation) {
            headObj.rotation.x = 0;
            headObj.rotation.y = 0;
          }
          if (typeof app.emitEvent === "function") {
            app.emitEvent("mouseHover", "Head");
          }
        } else if (action === "blink") {
          const eyesObj =
            app.findObjectByName?.("Eyes") ||
            app.findObjectByName?.("eyes") ||
            app.findObjectByName?.("Eye") ||
            app.findObjectByName?.("eye");
          if (eyesObj && eyesObj.scale) {
            eyesObj.scale.y = 0.05;
            setTimeout(() => {
              if (eyesObj.scale) eyesObj.scale.y = 1.0;
            }, 140);
          }
        } else if (action === "welcome_gesture") {
          setIsSpeaking(true);
          if (typeof app.emitEvent === "function") {
            app.emitEvent("mouseDown", "Robot");
          }
        } else if (action === "present_gesture") {
          setIsSpeaking(true);
          const rightArm =
            app.findObjectByName?.("Right Arm") ||
            app.findObjectByName?.("Arm_R") ||
            app.findObjectByName?.("arm_r");
          if (rightArm && rightArm.rotation) {
            rightArm.rotation.z = -0.3;
            setTimeout(() => {
              if (rightArm.rotation) rightArm.rotation.z = 0;
            }, 1200);
          }
        } else if (action === "idle") {
          setIsSpeaking(false);
        }
      } catch (e) {
        // Safe animation fallback
      }
    },
    []
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8 xl:pt-28 xl:pb-16"
    >
      {/* Subtle monochrome spotlight backdrop */}
      <Spotlight
        className="-top-24 left-6 from-white/90 via-neutral-300/40 to-transparent md:left-1/4"
        size={560}
      />

      {/* Hero Main Grid (Text Left + 3D Robot Right) */}
      <div className="container-px relative z-10 my-auto grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
        {/* ---------- Left Column: Copy & CTAs ---------- */}
        <motion.div
          style={{ y: yText, opacity }}
          className="flex flex-col items-start text-left"
        >
          {/* Studio Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-xl sm:mb-5"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-white/70 uppercase">
              <Activity className="h-3 w-3 animate-pulse text-white/80" />
              LUMORA STUDIO TELEMETRY
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs font-medium tracking-tight text-white/60">
              Premium websites for ambitious local businesses
            </span>
          </motion.div>

          {/* Headline - Continuous AI Ping-Pong Scan Heading */}
          <h1 className="w-full">
            <ContinuousAIScanHeading />
          </h1>

          {/* Subtitle / Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.8, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-lg text-balance text-sm leading-relaxed text-white/65 sm:mt-5 sm:text-base lg:text-base font-normal tracking-tight"
          >
            Lumora Digital takes raw business identities and refracts them
            through bespoke design, sub-second code architecture, and
            high-converting visual storytelling.
          </motion.p>

          {/* Dual Magnetic CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col items-start gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4"
          >
            <MagneticButton onClick={() => openCheckout("business")} variant="primary">
              Start Your Transformation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#pricing" variant="outline">
              <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                <Play className="h-2.5 w-2.5 fill-white text-white translate-x-0.5" />
              </span>
              Explore Pricing & Plans
            </MagneticButton>
          </motion.div>

          {/* Trust Rating Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.75 }}
            className="mt-5 flex items-center gap-2.5 text-xs text-white/50 sm:mt-6 sm:text-xs"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-white/80 text-white/80" />
              ))}
            </div>
            <span className="tracking-tight">
              Trusted by{" "}
              <span className="font-semibold text-white/90">
                [90+ local businesses]
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* ---------- Right Column: 3D Robot Frame (Interactive Click-to-Speak 3D Robot) ---------- */}
        <motion.div
          ref={robotContainerRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-[320px] w-full items-center justify-center sm:h-[380px] lg:h-[460px] xl:h-[500px]"
        >
          {/* Breathing aura halo and floating micro light particles */}
          <RobotAtmosphere />

          {/* Spline 3D Robot Canvas */}
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full cursor-pointer"
            onLoad={(app) => {
              splineAppRef.current = app;
            }}
          />

          {/* Interactive Click Hitbox, Speech Engine, Subtitles & Audio Visualizer */}
          <RobotSpeechPresenter
            className="absolute inset-0"
            splineApp={splineAppRef.current}
            onRobotAnimate={handleRobotAnimation}
          />

          {/* Vignette base transition */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </div>

      {/* ---------- Bottom: Premium GSAP Animated Stats Bar ---------- */}
      <HeroStatsBar />
    </section>
  );
}
