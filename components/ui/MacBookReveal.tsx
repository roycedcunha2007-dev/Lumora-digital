"use client";

import { useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projects } from "@/lib/site";

/* ==================================================================
   SCROLL TIMELINE — everything derives from scroll. Nothing autoplays.
   ================================================================== */
const P_LID_START = 0.06;
const P_LID_END = 0.34;
const P_LED_START = 0.30; // ≈80° open
const P_LED_END = 0.36;
const P_GLOW = 0.355;
const P_CONTENT = 0.42;
const P_SITES = 0.44; // projects change only after this

const N = projects.length;
const STEP = 100 / N;

const ACCENT = "#8a9a86";

const macEase = cubicBezier(0.65, 0, 0.35, 1);
const hingeEase = cubicBezier(0.34, 0, 0.1, 1);

/* Tiny, dim star field. Deterministic so SSR matches the client. */
const STARS = [
  [7, 22, 0.16], [16, 64, 0.10], [24, 36, 0.20], [33, 79, 0.12], [39, 14, 0.15],
  [46, 55, 0.09], [54, 29, 0.18], [60, 70, 0.11], [66, 43, 0.14], [73, 17, 0.10],
  [79, 61, 0.17], [85, 33, 0.12], [90, 75, 0.15], [94, 49, 0.10], [12, 9, 0.13],
  [29, 6, 0.14], [57, 11, 0.10], [88, 8, 0.12], [4, 47, 0.11], [96, 26, 0.13],
] as const;

/* ==================================================================
   LIVE SITE — real DOM inside the panel
   ================================================================== */
function SiteMockup({
  project,
  index,
  activeIndex,
}: {
  project: (typeof projects)[number];
  index: number;
  activeIndex: number;
}) {
  const isActive = index === activeIndex;
  const name = project.title.replace(/[[\]]/g, "");
  const year = project.year.replace(/[[\]]/g, "");

  return (
    // width MUST be 1/N of the strip — the strip itself is N×100% wide.
    <div
      className="relative h-full shrink-0 overflow-hidden bg-[#0b0b0d]"
      style={{ width: `${100 / N}%` }}
    >
      <div
        className="relative h-full w-full px-[6%] pt-[5.5%]"
        style={
          isActive
            ? { animation: "mbDrift 10s ease-in-out 1.4s infinite alternate" }
            : undefined
        }
      >
        {/* nav */}
        <div className="flex items-center justify-between">
          <span className="text-[1.85cqw] font-semibold tracking-tight text-white">
            {name}
          </span>
          <div className="flex gap-[2.7cqw] text-[1.35cqw] text-white/30">
            <span className="text-white/75">Work</span>
            <span>Studio</span>
            <span>Contact</span>
          </div>
        </div>

        {/* hero */}
        <div className="mt-[6.5%] flex gap-[5%]">
          <div className="flex-1">
            <h4 className="text-[5.4cqw] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              {project.category}
            </h4>
            <h4 className="text-[5.4cqw] font-bold leading-[1.06] tracking-[-0.035em] text-white">
              for {year}
            </h4>

            <div className="mt-[7%] space-y-[1.2cqw]">
              <span className="block h-[0.85cqw] w-[88%] rounded-full bg-white/[0.15]" />
              <span className="block h-[0.85cqw] w-[60%] rounded-full bg-white/[0.09]" />
            </div>

            <div className="mt-[8%] flex items-center gap-[1.3cqw]">
              <span className="cursor-pointer rounded-full bg-white px-[2.4cqw] py-[1.2cqw] text-[1.32cqw] font-semibold text-black transition-transform duration-300 hover:-translate-y-[2px]">
                View case study
              </span>
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.15] px-[2cqw] py-[1.15cqw] text-[1.32cqw] font-medium text-white/60 transition-colors duration-300 hover:border-white/30 hover:text-white/85"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3.4] w-[36%] shrink-0 overflow-hidden rounded-[1.2cqw] border border-white/[0.07] bg-gradient-to-br from-white/[0.10] via-white/[0.025] to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.11),transparent_62%)]" />
          </div>
        </div>

        {/* cards */}
        <div className="mt-[6%] grid grid-cols-3 gap-[2.4%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.025] p-[6.5%] transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span className="block h-[2.6cqw] w-[2.6cqw] rounded-[0.65cqw] bg-white/[0.12]" />
              <span className="mt-[15%] block h-[0.75cqw] w-[80%] rounded-full bg-white/[0.10]" />
              <span className="mt-[9%] block h-[0.75cqw] w-[54%] rounded-full bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>

      {isActive && (
        <svg
          key={`cur-${index}`}
          viewBox="0 0 12 18"
          className="pointer-events-none absolute z-20 h-[2cqw] w-[2cqw] drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          style={{ animation: "mbCursor 8s cubic-bezier(0.45,0,0.2,1) 1s infinite" }}
        >
          <path d="M0 0l12 7-5.2 1.4L4.6 18z" fill="#fff" stroke="#000" strokeWidth="0.6" />
        </svg>
      )}
    </div>
  );
}

/* ==================================================================
   KEYBOARD — dark keys in a recessed well, soft white backlight
   ================================================================== */
const ROWS: number[][] = [
  Array(13).fill(1),
  [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4],
  [1.65, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.2],
  [1.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.95],
  [2.45, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.45],
  [1.3, 1.3, 1.3, 6.8, 1.3, 1.3, 1.3],
];

function Keyboard({ led }: { led: MotionValue<number> }) {
  return (
    // Sits in the upper half of the deck, like a real MacBook.
    <div className="absolute left-1/2 top-[7%] h-[45%] w-[86%] -translate-x-1/2">
      {/* recessed black well the keys drop into */}
      <div className="absolute -inset-[1.5%] rounded-[6px] bg-[#0b0b0d] shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),inset_0_-1px_0_rgba(255,255,255,0.05)]" />

      {/* one soft backlight pool escaping the well */}
      <motion.div
        style={{ opacity: led }}
        className="pointer-events-none absolute -inset-[7%] rounded-[10px] bg-[radial-gradient(ellipse_at_center,rgba(228,238,255,0.22),rgba(228,238,255,0.07)_52%,transparent_76%)] blur-[6px]"
      />

      <div className="relative flex h-full flex-col gap-[1.6%]">
        {ROWS.map((row, r) => (
          <div key={r} className="flex gap-[0.8%]" style={{ flex: r === 0 ? 0.8 : 1 }}>
            {row.map((flex, c) => (
              <div
                key={c}
                style={{ flex }}
                className="relative rounded-[2px] bg-[linear-gradient(180deg,#232328_0%,#17171b_55%,#101013_100%)] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.10),0_1px_1.5px_rgba(0,0,0,0.9)]"
              >
                <motion.span
                  style={{ opacity: led }}
                  className="pointer-events-none absolute -inset-[0.5px] rounded-[2.5px] bg-[rgba(228,238,255,0.18)] blur-[1.3px]"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================================================================
   MAIN
   ================================================================== */
export default function MacBookReveal() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 40,
    mass: 0.45,
    restDelta: 0.0001,
  });

  const lidAngle = useTransform(
    sp,
    [P_LID_START, 0.13, 0.24, 0.305, 0.325, P_LID_END],
    [-90, -71, -30, -7, 1.1, 0],
    { ease: hingeEase }
  );
  const lidRotate = useTransform(lidAngle, (a) => `rotateX(${a}deg)`);

  const led = useTransform(sp, [P_LED_START, P_LED_END], [0, 1], { clamp: true });
  const panelBlack = useTransform(sp, [P_GLOW, P_CONTENT], [1, 0], { clamp: true });
  const bloom = useTransform(sp, [P_GLOW, P_CONTENT, 1], [0, 0.35, 0.26], { clamp: true });
  const contentOpacity = useTransform(sp, [P_GLOW + 0.02, P_CONTENT], [0, 1], { clamp: true });

  const stripIn: number[] = [];
  const stripOut: number[] = [];
  const span = 1 - P_SITES;
  for (let i = 0; i < N; i++) {
    stripIn.push(P_SITES + (i / N) * span, P_SITES + ((i + 0.68) / N) * span);
    stripOut.push(-i * STEP, -i * STEP);
  }
  stripIn.push(1);
  stripOut.push(-(N - 1) * STEP);

  const stripX = useTransform(sp, stripIn, stripOut, { ease: macEase });
  const stripTransform = useTransform(stripX, (v) => `translateX(${v}%)`);

  const idxMv = useTransform(sp, (v) => {
    if (v < P_SITES) return 0;
    return Math.min(N - 1, Math.floor(Math.min(1, (v - P_SITES) / span) * N));
  });
  useMotionValueEvent(idxMv, "change", (v) => setActiveIndex(v));

  const openedMv = useTransform(sp, (v) => (v >= P_CONTENT ? 1 : 0));
  useMotionValueEvent(openedMv, "change", (v) => setIsOpen(v === 1));

  return (
    <div ref={trackRef} className="relative h-[620vh]">
      <style>{`
        @keyframes mbDrift { from { transform: translateY(0); } to { transform: translateY(-2.6%); } }
        @keyframes mbCursor {
          0%   { left: 24%; top: 72%; opacity: 0; }
          8%   { opacity: 1; }
          30%  { left: 27%; top: 60%; }
          54%  { left: 61%; top: 42%; }
          76%  { left: 44%; top: 76%; }
          92%  { left: 31%; top: 68%; opacity: 1; }
          100% { left: 24%; top: 72%; opacity: 0; }
        }
      `}</style>

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#050507]">
        {/* ================= ambient — deliberately restrained ================= */}
        <div className="pointer-events-none absolute inset-0">
          {/* soft ambient pool behind the machine */}
          <div
            className="absolute left-1/2 top-[56%] h-[52vh] w-[62vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            style={{
              background: `radial-gradient(ellipse at center, ${ACCENT}1c, ${ACCENT}08 45%, transparent 72%)`,
            }}
          />
          {/* very faint grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "110px 110px",
              maskImage: "radial-gradient(ellipse at center, #000 8%, transparent 62%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, #000 8%, transparent 62%)",
            }}
          />
          {/* tiny dim stars */}
          {STARS.map(([x, y, o], i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${x}%`, top: `${y}%`, width: 1.5, height: 1.5, opacity: o }}
            />
          ))}
        </div>

        {/* ================= left rail ================= */}
        <div className="pointer-events-none absolute left-[3%] top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-[1.6vh] lg:flex">
          {projects.map((p, i) => {
            const on = isOpen && i === activeIndex;
            return (
              <div key={p.id} className="flex items-center gap-2.5">
                <span
                  className="h-[5px] w-[5px] rounded-full transition-all duration-500"
                  style={{
                    background: on ? ACCENT : "transparent",
                    boxShadow: on ? `0 0 8px ${ACCENT}` : "none",
                  }}
                />
                <span
                  className={`font-mono text-[11px] tabular-nums transition-colors duration-500 ${
                    on ? "text-white/85" : "text-white/25"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>

        {/* ================= composition ================= */}
        <div
          className="relative z-10 flex h-full flex-col items-center justify-between px-6"
          style={{ paddingTop: "clamp(84px, 8.5vh, 116px)", paddingBottom: "1.8vh" }}
        >
          {/* ---- heading ---- */}
          <div className="flex shrink-0 flex-col items-center text-center">
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.42em]"
              style={{ color: ACCENT }}
            >
              Our Work
            </span>
            <h3 className="mt-3.5 font-display text-[clamp(1.75rem,3.1vw,3.1rem)] font-bold leading-[1.05] tracking-tightest text-white">
              Crafted Experiences
            </h3>
            <p
              className="mt-3.5 text-[clamp(0.8rem,0.95vw,0.98rem)] leading-relaxed text-white/45"
              style={{ maxWidth: "31rem" }}
            >
              A selection of digital products we&apos;ve designed and developed
              for forward-thinking brands.
            </p>
          </div>

          {/* ---- the machine ---- */}
          <div
            className="relative shrink-0"
            /* laptop height ≈ 0.77 × width (lid 0.60 + body 0.17) */
            style={{ width: "min(70vw, calc((100svh - 21rem) / 0.70), 1220px)" }}
          >
            <div
              className="relative w-full"
              style={{ perspective: "2900px", perspectiveOrigin: "50% 34%" }}
            >
              {/* ============ LID ============ */}
              <motion.div
                style={{
                  transform: lidRotate,
                  transformOrigin: "50% 100%",
                  transformStyle: "preserve-3d",
                }}
                className="relative z-20 w-full"
              >
                {/* rear shell — visible while shut */}
                <div
                  className="absolute inset-0 rounded-t-[0.85rem] rounded-b-[3px] bg-[linear-gradient(178deg,#303036_0%,#1e1e23_14%,#16161a_48%,#101013_100%)]"
                  style={{ transform: "translateZ(-4px) rotateY(180deg)" }}
                >
                  <div
                    className="absolute inset-0 rounded-t-[0.85rem] opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
                    }}
                  />
                </div>

                {/* display chassis — the aluminium frame around the glass */}
                <div
                  className="relative aspect-[16/9.2] w-full rounded-t-[0.85rem] rounded-b-[3px] p-[0.8%]"
                  style={{
                    transformStyle: "preserve-3d",
                    background:
                      "linear-gradient(180deg,#3a3a41 0%,#24242a 3%,#17171b 34%,#121215 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.22)",
                  }}
                >
                  {/* bright chamfer along the very edge */}
                  <span className="pointer-events-none absolute inset-0 rounded-t-[0.85rem] rounded-b-[3px] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.26)]" />

                  {/* panel */}
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[0.5rem] bg-black"
                    style={{ containerType: "inline-size" }}
                  >
                    <motion.div
                      style={{
                        transform: stripTransform,
                        width: `${N * 100}%`,
                        opacity: contentOpacity,
                        willChange: "transform",
                      }}
                      className="flex h-full"
                    >
                      {projects.map((p, i) => (
                        <SiteMockup
                          key={p.id}
                          project={p}
                          index={i}
                          activeIndex={isOpen ? activeIndex : -1}
                        />
                      ))}
                    </motion.div>

                    <motion.div
                      style={{ opacity: panelBlack }}
                      className="pointer-events-none absolute inset-0 bg-black"
                    />

                    {/* notch */}
                    <div className="absolute left-1/2 top-0 z-30 flex h-[2.4%] w-[10.5%] -translate-x-1/2 items-center justify-center rounded-b-[0.4rem] bg-black">
                      <span className="h-[3px] w-[3px] rounded-full bg-[#17171c] ring-[0.5px] ring-white/10" />
                    </div>

                    {/* glass sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(116deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.014)_18%,transparent_42%)]" />
                  </div>

                  <motion.div
                    style={{
                      opacity: bloom,
                      background:
                        "radial-gradient(ellipse at center, rgba(138,154,134,0.18), transparent 66%)",
                    }}
                    className="pointer-events-none absolute -inset-[7%] -z-10 rounded-[1.8rem] blur-[44px]"
                  />
                </div>
              </motion.div>

              {/* ============ BASE ============
                   Real MacBook proportions: the deck is ~68% of the body width
                   deep, laid back to 81°. At perspective 2900px that puts the
                   front edge ~0.67W closer to the camera, so it projects ~1.27×
                   wider than the lid — the trapezoid spread seen in the
                   reference. The outer box reserves only the *projected*
                   height (12%) so layout stays correct. */}
              {/* preserve-3d is essential here: without it this wrapper
                  flattens the subtree and the deck loses all perspective,
                  rendering as a plain 2D rectangle. */}
              <div
                className="relative z-10 w-full"
                style={{ paddingBottom: "12.5%", transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute inset-x-0 top-0"
                  style={{
                    paddingBottom: "68%",
                    transformOrigin: "50% 0%",
                    transform: "rotateX(88.2deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* ---- machined aluminium deck ---- */}
                  <div
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      background:
                        "linear-gradient(168deg,#4c4c55 0%,#3f3f47 12%,#35353c 38%,#2c2c32 68%,#25252a 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.28), inset 1px 0 0 rgba(255,255,255,0.10), inset -1px 0 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(0,0,0,0.6)",
                    }}
                  >
                    {/* brushed grain */}
                    <div
                      className="absolute inset-0 rounded-[10px] opacity-[0.35]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)",
                      }}
                    />
                    {/* soft key light falling across the palm rest */}
                    <div
                      className="absolute inset-0 rounded-[10px]"
                      style={{
                        background:
                          "radial-gradient(ellipse 70% 55% at 28% 12%, rgba(255,255,255,0.10), transparent 60%)",
                      }}
                    />

                    {/* hinge shadow where the lid meets the body */}
                    <div
                      className="absolute inset-x-[3%] top-0 h-[3.5%] rounded-b-[4px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
                      }}
                    />

                    {/* speaker grilles either side of the keyboard */}
                    <div
                      className="absolute left-[3.5%] top-[9%] h-[41%] w-[5.5%] rounded-[3px] opacity-70"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(0,0,0,0.55) 34%, transparent 36%)",
                        backgroundSize: "4px 4px",
                      }}
                    />
                    <div
                      className="absolute right-[3.5%] top-[9%] h-[41%] w-[5.5%] rounded-[3px] opacity-70"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(0,0,0,0.55) 34%, transparent 36%)",
                        backgroundSize: "4px 4px",
                      }}
                    />

                    <Keyboard led={led} />

                    {/* trackpad — MacBook-sized: ~45% wide, sits in the palm rest */}
                    <div
                      className="absolute bottom-[7%] left-1/2 h-[36%] w-[45%] -translate-x-1/2 rounded-[8px]"
                      style={{
                        background:
                          "linear-gradient(170deg,#3a3a41 0%,#33333a 45%,#2c2c32 100%)",
                        boxShadow:
                          "inset 0 0 0 1px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    />
                  </div>

                  {/* ---- front edge wall: rotated back to vertical so the
                          body reads as a solid machined slab with thickness ---- */}
                  <div
                    className="absolute inset-x-0 top-full"
                    style={{
                      height: "3.8%",
                      transformOrigin: "50% 0%",
                      transform: "rotateX(-88.2deg)",
                    }}
                  >
                    <div
                      className="h-full w-full rounded-b-[9px]"
                      style={{
                        background:
                          "linear-gradient(180deg,#54545e 0%,#3a3a42 18%,#26262b 62%,#151518 100%)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.42), 0 0 0 1px rgba(0,0,0,0.55)",
                      }}
                    >
                      {/* finger groove */}
                      <span className="absolute left-1/2 top-0 h-[62%] w-[11%] -translate-x-1/2 rounded-b-[6px] bg-black/45" />
                    </div>
                  </div>
                </div>
              </div>

              {/* contact shadow */}
              <div className="pointer-events-none absolute -bottom-[4%] left-1/2 h-[7%] w-[92%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-[28px]" />
            </div>

            {/* floor reflection */}
            <div
              className="pointer-events-none absolute inset-x-[8%] top-full h-[18%] opacity-[0.13]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(200,200,200,0.15), transparent 56%)",
                maskImage: "linear-gradient(180deg, #000, transparent 68%)",
                WebkitMaskImage: "linear-gradient(180deg, #000, transparent 68%)",
                filter: "blur(9px)",
              }}
            />
          </div>

          {/* ---- bottom indicators ---- */}
          <div className="flex shrink-0 flex-col items-center gap-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tabular-nums text-white/45">01</span>
              <div className="flex items-center gap-2.5">
                {projects.map((p, i) => {
                  const on = isOpen && i === activeIndex;
                  return (
                    <span
                      key={p.id}
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: on ? 7 : 5,
                        height: on ? 7 : 5,
                        background: on ? ACCENT : "rgba(255,255,255,0.18)",
                        boxShadow: on ? "0 0 9px rgba(138,154,134,0.6)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              <span className="font-mono text-[11px] tabular-nums text-white/45">
                {String(N).padStart(2, "0")}
              </span>
            </div>

            <span className="text-[11px] text-white/40">Scroll to explore</span>

            <span className="mt-0.5 flex h-[21px] w-[13px] items-start justify-center rounded-full border border-white/20 pt-[3px]">
              <span className="h-[4px] w-[1.5px] rounded-full bg-white/45" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
