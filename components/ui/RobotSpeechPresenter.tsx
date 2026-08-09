"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SCRIPT_PARTS = [
  "Welcome to Lumora Digital.",
  "Crafting digital experiences that illuminate your brand identity.",
];

interface RobotSpeechPresenterProps {
  className?: string;
  splineApp?: any;
  onRobotAnimate?: (action: "turn_to_user" | "blink" | "welcome_gesture" | "present_gesture" | "idle") => void;
  isSpeakingExternal?: boolean;
}

export default function RobotSpeechPresenter({
  className,
  splineApp,
  onRobotAnimate,
}: RobotSpeechPresenterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [isHoveringRobot, setIsHoveringRobot] = useState(false);
  const [speechPhase, setSpeechPhase] = useState<"idle" | "turning" | "blinking" | "speaking">("idle");

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis and load high-quality natural English voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        if (!synthRef.current) return;
        const available = synthRef.current.getVoices();
        if (available && available.length > 0) {
          voicesRef.current = available;
        }
      };

      loadVoices();
      if ("onvoiceschanged" in synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
    };
  }, []);

  // Helper to pick the best natural voice available
  const getBestNaturalVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!voicesRef.current || voicesRef.current.length === 0) {
      if (synthRef.current) {
        voicesRef.current = synthRef.current.getVoices();
      }
    }
    const voices = voicesRef.current;
    if (!voices || voices.length === 0) return null;

    // Prioritize natural neural English voices
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Online (Natural)") ||
            v.name.includes("Neural") ||
            v.name.includes("Google US English") ||
            v.name.includes("Samantha") ||
            v.name.includes("Alex") ||
            v.name.includes("Daniel"))
      ) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    return preferredVoice || null;
  }, []);

  // Safe Speech Execution with word boundary tracking
  const executeUtterance = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (!synthRef.current || isMuted) {
        // Fallback typewriter timer when speech is muted or unavailable
        const words = text.split(" ");
        let wordCount = 0;
        setDisplayedText("");
        setCurrentWordIdx(0);

        const wordInterval = setInterval(() => {
          wordCount++;
          if (wordCount <= words.length) {
            setCurrentWordIdx(wordCount - 1);
            setDisplayedText(words.slice(0, wordCount).join(" "));
          } else {
            clearInterval(wordInterval);
            if (onEndCallback) onEndCallback();
          }
        }, 340);
        return;
      }

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Natural, articulate, comfortable speaking rate
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voice = getBestNaturalVoice();
      if (voice) {
        utterance.voice = voice;
      }

      const words = text.split(" ");
      setDisplayedText("");
      setCurrentWordIdx(0);

      // Word boundary event for live subtitle highlight
      utterance.onboundary = (event) => {
        if (event.name === "word" || event.charIndex !== undefined) {
          const charIdx = event.charIndex;
          const textUpToChar = text.substring(0, charIdx + 1);
          const wIdx = textUpToChar.trim().split(/\s+/).length - 1;
          setCurrentWordIdx(Math.max(0, Math.min(wIdx, words.length - 1)));
          setDisplayedText(words.slice(0, wIdx + 1).join(" "));
        }
      };

      utterance.onend = () => {
        setDisplayedText(text);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        // Ignore canceled errors on restart
        if (e.error !== "canceled" && e.error !== "interrupted") {
          setDisplayedText(text);
          if (onEndCallback) onEndCallback();
        }
      };

      activeUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    },
    [isMuted, getBestNaturalVoice]
  );

  // Exact 6-Step Speech & Animation Sequence
  const triggerSpeechSequence = useCallback(() => {
    // 1. If clicked while already playing, cancel previous and restart cleanly
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);

    setIsPlaying(true);
    setIsPaused(false);
    setCurrentPartIdx(0);
    setCurrentWordIdx(-1);
    setDisplayedText("");

    // Step 1: Robot turns toward visitor
    setSpeechPhase("turning");
    if (onRobotAnimate) onRobotAnimate("turn_to_user");

    // Step 2 & 3: Eyes look at visitor and robot blinks
    timerRef.current = setTimeout(() => {
      setSpeechPhase("blinking");
      if (onRobotAnimate) onRobotAnimate("blink");

      // Step 4 & 5: Small natural head movement & 300-500ms grace period
      secondaryTimerRef.current = setTimeout(() => {
        setSpeechPhase("speaking");

        // Gesture 1: Welcoming hand gesture
        if (onRobotAnimate) onRobotAnimate("welcome_gesture");

        // Step 6: Start voice speech Part 1
        executeUtterance(SCRIPT_PARTS[0], () => {
          // Brief pause (~600ms) between sentences
          timerRef.current = setTimeout(() => {
            setCurrentPartIdx(1);
            // Gesture 2: Presentation gesture toward website content
            if (onRobotAnimate) onRobotAnimate("present_gesture");

            // Part 2
            executeUtterance(SCRIPT_PARTS[1], () => {
              // Speech complete: smooth 1.5s wrap-up
              timerRef.current = setTimeout(() => {
                setIsPlaying(false);
                setSpeechPhase("idle");
                setCurrentPartIdx(0);
                setCurrentWordIdx(-1);
                setDisplayedText("");
                if (onRobotAnimate) onRobotAnimate("idle");
              }, 1400);
            });
          }, 650);
        });
      }, 400);
    }, 250);
  }, [executeUtterance, onRobotAnimate]);

  // Pause / Resume
  const togglePause = () => {
    if (!synthRef.current) return;
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && synthRef.current) {
        synthRef.current.cancel();
      }
      return next;
    });
  };

  const words = SCRIPT_PARTS[currentPartIdx]?.split(" ") || [];

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20 h-full w-full", className)}>
      {/* 
        ========================================================================
        PRECISE ROBOT HEAD HITBOX
        Accurately positioned over the 3D robot's head and face.
        Only triggers hover cue ("Click to speak") and speech when the cursor
        or tap is directly over the visible head.
        ========================================================================
      */}
      <div
        data-cursor="Click to speak"
        onClick={triggerSpeechSequence}
        onTouchEnd={(e) => {
          e.preventDefault();
          triggerSpeechSequence();
        }}
        onMouseEnter={() => setIsHoveringRobot(true)}
        onMouseLeave={() => setIsHoveringRobot(false)}
        className={cn(
          "pointer-events-auto absolute top-[12%] sm:top-[14%] left-[34%] sm:left-[36%] w-[32%] sm:w-[28%] h-[32%] sm:h-[30%] rounded-full cursor-pointer select-none z-30 transition-all duration-300",
          !isPlaying && isHoveringRobot
            ? "ring-1 ring-[#8a9a86]/40 shadow-[0_0_30px_rgba(138,154,134,0.3)] bg-[#8a9a86]/[0.03]"
            : "bg-transparent"
        )}
        aria-label="Click robot head to speak"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerSpeechSequence();
          }
        }}
      >
        {/* Subtle "Click to speak" hint directly above the robot's head */}
        {!isPlaying && isHoveringRobot && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-40 flex items-center gap-1.5 rounded-full border border-[#8a9a86]/35 bg-[#08080c]/95 px-3 py-1 text-[11px] font-medium text-[#f4f1ea] shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 text-[#9ab096]" />
            <span>Click to speak</span>
          </motion.div>
        )}
      </div>

      {/* 
        ========================================================================
        SPEAKING STATE UI & SOUND-WAVE EQUALIZER
        While speaking: Refined Quiet Luxury equalizer bars + live subtitles
        ========================================================================
      */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 sm:-top-28 sm:left-auto sm:right-4 sm:translate-x-0 z-40 w-[92%] max-w-sm rounded-3xl border border-white/[0.12] bg-[#0c0e12]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* Specular inner rim highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]" />

            {/* Header with sound-wave visualizer and audio controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                {/* 4 Animated Sound-Wave Equalizer Bars in Muted Sage */}
                <div className="flex items-center gap-0.5 h-3.5">
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["4px", "14px", "6px", "12px", "4px"] }
                        : { height: "4px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-[#8a9a86]"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["10px", "4px", "14px", "6px", "10px"] }
                        : { height: "6px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.15, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-[#9ab096]"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["6px", "14px", "4px", "12px", "6px"] }
                        : { height: "4px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.75, delay: 0.3, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-[#8a9a86]"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["12px", "6px", "10px", "4px", "12px"] }
                        : { height: "5px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.85, delay: 0.2, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-[#c5a880]"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9ab096]">
                    Lumora AI Presenter
                  </span>
                  <span className="text-[9px] text-[#a3a19b]">
                    {speechPhase === "speaking" ? "Speaking..." : "Focusing..."}
                  </span>
                </div>
              </div>

              {/* Speech Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={togglePause}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/15 cursor-pointer"
                  aria-label={isPaused ? "Resume speech" : "Pause speech"}
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/15 cursor-pointer"
                  aria-label={isMuted ? "Unmute speech" : "Mute speech"}
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3 text-red-400" />
                  ) : (
                    <Volume2 className="h-3 w-3 text-[#9ab096]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={triggerSpeechSequence}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/15 cursor-pointer"
                  aria-label="Replay speech"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Typewriter Subtitle Text with Active Word Glow */}
            <div className="mt-3.5 min-h-[50px]">
              <p className="font-display text-sm font-medium leading-relaxed text-[#f4f1ea]">
                {words.map((w, idx) => {
                  const isActive = idx === currentWordIdx;
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "inline-block transition-all duration-200 mr-1.5",
                        isActive
                          ? "scale-105 font-bold text-[#9ab096] drop-shadow-[0_0_10px_rgba(138,154,134,0.6)]"
                          : "opacity-75 text-[#d1cfc7]"
                      )}
                    >
                      {w}
                    </span>
                  );
                })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
