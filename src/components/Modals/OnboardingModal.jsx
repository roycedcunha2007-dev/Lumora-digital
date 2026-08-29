import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layout,
  Type,
  Image as ImageIcon,
  Play,
  ArrowRight,
  Check,
  X
} from 'lucide-react';


export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('figmalite_onboarding_completed');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('figmalite_onboarding_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to FigmaLite',
      subtitle: 'Create professional presentations, graphics, and visual designs in minutes.',
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      desc: 'Simple by default, powerful when needed. Everything runs right in your browser with zero sign-up required.',
    },
    {
      title: '1. Pick a Format or Template',
      subtitle: 'Start with ready-made layouts tailored for any screen.',
      icon: <Layout className="w-8 h-8 text-sky-400" />,
      desc: 'Choose from 16:9 Presentations, Instagram Posts, Posters, YouTube Thumbnails, or start with a custom blank canvas.',
    },
    {
      title: '2. Add Text, Images & Shapes',
      subtitle: 'Intuitive drag-and-drop creation.',
      icon: <Type className="w-8 h-8 text-purple-400" />,
      desc: 'Click on the left sidebar to add headings, upload local pictures from your computer, or drop in charts and graphics.',
    },
    {
      title: '3. Customize with Contextual Tools',
      subtitle: 'The toolbar changes automatically based on what you select.',
      icon: <ImageIcon className="w-8 h-8 text-emerald-400" />,
      desc: 'Select text to change fonts and colors. Select images to crop and adjust radius. Select multiple objects to align and group.',
    },
    {
      title: '4. Present or Export',
      subtitle: 'Share your work with the world in one click.',
      icon: <Play className="w-8 h-8 text-pink-400" />,
      desc: 'Enter full-screen Present mode with live speaker notes, or download as PowerPoint (.pptx), PNG images, or SVG vectors.',
    },
  ];

  const current = steps[step];

  return (
    <div
      onClick={handleComplete}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-modal rounded-3xl p-6 space-y-6 shadow-2xl border border-indigo-500/30 text-xs text-neutral-200 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Quick Guide ({step + 1} of {steps.length})
            </span>
          </div>
          <button
            onClick={handleComplete}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-3 py-2">
          <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl mb-1">
            {current.icon}
          </div>
          <h2 className="text-lg font-extrabold text-white">{current.title}</h2>
          <p className="text-xs font-semibold text-indigo-300">{current.subtitle}</p>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">{current.desc}</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                step === idx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-neutral-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <button
            onClick={handleComplete}
            className="px-3.5 py-1.5 text-neutral-400 hover:text-white rounded-xl font-medium"
          >
            Skip
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Start Designing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
