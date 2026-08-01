"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SCRIPT_PARTS = [
  "Welcome to Lumora Digital.",
  "Crafting digital experiences that illuminate your brand identity.",
];

export default function RobotSpeechPresenter({
  className,
}: {
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!synthRef.current || isMuted) {
        // Fallback typewriter timer if speech synthesis is muted or unsupported
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
            if (onEnd) onEnd();
          }
        }, 320);
        return;
      }

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select natural voice if available
      const voices = synthRef.current.getVoices();
      const selectedVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha"))
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (selectedVoice) utterance.voice = selectedVoice;

      const words = text.split(" ");
      setDisplayedText("");
      setCurrentWordIdx(0);

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const charIdx = event.charIndex;
          const textUpToChar = text.substring(0, charIdx + 1);
          const wIdx = textUpToChar.trim().split(/\s+/).length - 1;
          setCurrentWordIdx(Math.max(0, Math.min(wIdx, words.length - 1)));
          setDisplayedText(words.slice(0, wIdx + 1).join(" "));
        }
      };

      utterance.onend = () => {
        setDisplayedText(text);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        setDisplayedText(text);
        if (onEnd) onEnd();
      };

      synthRef.current.speak(utterance);
    },
    [isMuted]
  );

  const startPresentation = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentPartIdx(0);

    // Part 1
    speakText(SCRIPT_PARTS[0], () => {
      // 1 second pause between sentences
      timerRef.current = setTimeout(() => {
        setCurrentPartIdx(1);
        // Part 2
        speakText(SCRIPT_PARTS[1], () => {
          // Finished
          timerRef.current = setTimeout(() => {
            setIsPlaying(false);
            setCurrentPartIdx(0);
            setCurrentWordIdx(-1);
            setDisplayedText("");
          }, 1500);
        });
      }, 1000);
    });
  }, [speakText]);

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
    <div className={cn("pointer-events-none relative z-20", className)}>
      {/* Click Trigger Area overlay on the robot container */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-start justify-center pt-4">
          <motion.button
            onClick={startPresentation}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Interact with AI Robot Presenter"
            className="pointer-events-auto group flex items-center gap-2 rounded-full border border-white/20 bg-navy-950/80 px-4 py-2 text-xs font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/40 focus:outline-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Click robot to speak</span>
          </motion.button>
        </div>
      )}

      {/* Floating Glass Speech Panel */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 sm:-top-28 sm:left-auto sm:right-4 sm:translate-x-0 w-[90%] max-w-sm rounded-3xl border border-white/20 bg-navy-950/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Specular inner line */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Lumora AI Presenter
                </span>
              </div>

              {/* Speech Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={togglePause}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15"
                  aria-label={isPaused ? "Resume speech" : "Pause speech"}
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15"
                  aria-label={isMuted ? "Unmute speech" : "Mute speech"}
                >
                  {isMuted ? <VolumeX className="h-3 w-3 text-red-400" /> : <Volume2 className="h-3 w-3 text-cyan-300" />}
                </button>
                <button
                  onClick={startPresentation}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15"
                  aria-label="Replay speech"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Typewriter Subtitle Text with Active Word Glow */}
            <div className="mt-3.5 min-h-[52px]">
              <p className="font-display text-sm font-medium leading-relaxed text-white/90">
                {words.map((w, idx) => {
                  const isActive = idx === currentWordIdx;
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "inline-block transition-all duration-200 mr-1.5",
                        isActive
                          ? "scale-105 font-semibold text-cyan-300 drop-shadow-[0_0_8px_#00f0ff]"
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
