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
    <div className={cn("relative z-20 h-full w-full", className)}>
      {/* 
        ========================================================================
        INTERACTIVE ROBOT CLICK DETECTION HITBOX
        Covers the entire visible robot (head, face, eyes, body, arms, hands).
        Clicking anywhere on the robot starts speech immediately!
        ========================================================================
      */}
      <div
        onClick={triggerSpeechSequence}
        onMouseEnter={() => setIsHoveringRobot(true)}
        onMouseLeave={() => setIsHoveringRobot(false)}
        className="absolute inset-0 z-30 cursor-pointer select-none"
        aria-label="Click anywhere on the robot to speak"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerSpeechSequence();
          }
        }}
      >
        {/* Subtle hover tooltip cue when hovering over the robot */}
        {!isPlaying && isHoveringRobot && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5 }}
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-[#08080c]/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>Click robot to speak</span>
          </motion.div>
        )}
      </div>

      {/* 
        ========================================================================
        SUBTLE SPEAKING STATE UI & SOUND-WAVE EQUALIZER
        While speaking: Soft Electric Blue glow + Live animated equalizer bars
        + Small "Speaking..." indicator + Typewriter subtitle with active word glow
        ========================================================================
      */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 sm:-top-28 sm:left-auto sm:right-4 sm:translate-x-0 z-40 w-[92%] max-w-sm rounded-3xl border border-white/[0.12] bg-[#08080c]/92 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(59,130,246,0.18)] backdrop-blur-2xl"
          >
            {/* Specular inner rim highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20)]" />

            {/* Header with sound-wave visualizer and audio controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                {/* 4 Animated Sound-Wave Equalizer Bars */}
                <div className="flex items-center gap-0.5 h-3.5">
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["4px", "14px", "6px", "12px", "4px"] }
                        : { height: "4px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-blue-400"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["10px", "4px", "14px", "6px", "10px"] }
                        : { height: "6px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.15, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-blue-300"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["6px", "14px", "4px", "12px", "6px"] }
                        : { height: "4px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.75, delay: 0.3, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-blue-400"
                  />
                  <motion.span
                    animate={
                      !isPaused
                        ? { height: ["12px", "6px", "10px", "4px", "12px"] }
                        : { height: "5px" }
                    }
                    transition={{ repeat: Infinity, duration: 0.85, delay: 0.2, ease: "easeInOut" }}
                    className="w-1 rounded-full bg-blue-200"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    Lumora AI Presenter
                  </span>
                  <span className="text-[9px] text-white/45">
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
                    <Volume2 className="h-3 w-3 text-blue-400" />
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
              <p className="font-display text-sm font-medium leading-relaxed text-white/90">
                {words.map((w, idx) => {
                  const isActive = idx === currentWordIdx;
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "inline-block transition-all duration-200 mr-1.5",
                        isActive
                          ? "scale-105 font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                          : "opacity-80"
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
