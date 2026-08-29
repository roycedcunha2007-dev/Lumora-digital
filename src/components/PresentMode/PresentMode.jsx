import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { CanvasElement } from '../Canvas/CanvasElement';
import {
  X,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Monitor,
  FileText,
  Clock,
  Layout,
  Maximize2
} from 'lucide-react';

export function PresentMode() {
  const {
    presentModeOpen,
    setPresentModeOpen,
    project,
    activePageId,
    setActivePageId,
    elements,
  } = useEditor();

  const pages = project?.pages || [];
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPresenterNotesView, setIsPresenterNotesView] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (presentModeOpen) {
      const idx = pages.findIndex((p) => p.id === activePageId);
      setCurrentPageIndex(idx >= 0 ? idx : 0);
      setElapsedSeconds(0);
    }
  }, [presentModeOpen, activePageId]);

  useEffect(() => {
    let timer;
    if (presentModeOpen) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [presentModeOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!presentModeOpen) return;
      if (e.key === 'Escape') {
        setPresentModeOpen(false);
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key.toLowerCase() === 'p') {
        setIsPresenterNotesView((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentModeOpen, currentPageIndex, pages.length]);

  if (!presentModeOpen) return null;

  const currentSlide = pages[currentPageIndex] || pages[0];
  const nextSlide = pages[currentPageIndex + 1];
  const currentFrame = currentSlide?.elements?.[0];

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextIdx = currentPageIndex + 1;
        setCurrentPageIndex(nextIdx);
        if (pages[nextIdx]) setActivePageId(pages[nextIdx].id);
        setIsTransitioning(false);
      }, 120);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        const prevIdx = currentPageIndex - 1;
        setCurrentPageIndex(prevIdx);
        if (pages[prevIdx]) setActivePageId(pages[prevIdx].id);
        setIsTransitioning(false);
      }, 120);
    }
  };

  const handleScreenClick = (e) => {
    const clickX = e.clientX;
    const screenW = window.innerWidth;
    if (clickX > screenW / 2) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none overflow-hidden text-white animate-in fade-in duration-150">
      {!isPresenterNotesView ? (
        <div
          onClick={handleScreenClick}
          className="w-full h-full flex items-center justify-center p-4 md:p-8 cursor-pointer relative"
        >
          {currentFrame ? (
            <div
              style={{
                width: `${currentFrame.width || 1920}px`,
                height: `${currentFrame.height || 1080}px`,
                maxWidth: '96vw',
                maxHeight: '94vh',
                aspectRatio: `${currentFrame.width || 1920} / ${currentFrame.height || 1080}`,
                backgroundColor: currentFrame.fill || currentSlide.background || '#0F172A',
              }}
              className={`relative rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 ${
                isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
              }`}
            >
              <svg
                viewBox={`0 0 ${currentFrame.width || 1920} ${currentFrame.height || 1080}`}
                className="w-full h-full"
              >
                <rect
                  width={currentFrame.width || 1920}
                  height={currentFrame.height || 1080}
                  fill={currentFrame.fill || currentSlide.background || '#0F172A'}
                />
                {(currentFrame.children || []).map((child) => (
                  <CanvasElement
                    key={child.id}
                    element={child}
                    isSelected={false}
                    isHovered={false}
                    zoom={1}
                  />
                ))}
              </svg>
            </div>
          ) : (
            <div className="text-center text-neutral-400">
              <p className="text-base font-semibold">{currentSlide?.name || 'Untitled Slide'}</p>
              <p className="text-xs text-neutral-500 mt-1">Empty slide canvas</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full p-6 flex flex-col gap-4 bg-neutral-950 text-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-xs font-bold">
                Presenter View
              </span>
              <span className="font-bold text-sm text-white">{project.name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Elapsed: <strong className="text-white">{formatTimer(elapsedSeconds)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Layout className="w-3.5 h-3.5 text-indigo-400" />
                <span>Slide: <strong className="text-white">{currentPageIndex + 1} / {pages.length}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden">
            <div className="md:col-span-8 flex flex-col gap-2 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800">
              <span className="text-xs font-bold text-neutral-400">Current Slide</span>
              <div className="flex-1 flex items-center justify-center bg-black/60 rounded-2xl p-2 overflow-hidden">
                {currentFrame && (
                  <svg
                    viewBox={`0 0 ${currentFrame.width || 1920} ${currentFrame.height || 1080}`}
                    className="w-full h-full max-h-full"
                  >
                    <rect
                      width={currentFrame.width || 1920}
                      height={currentFrame.height || 1080}
                      fill={currentFrame.fill || currentSlide.background || '#0F172A'}
                    />
                    {(currentFrame.children || []).map((child) => (
                      <CanvasElement
                        key={child.id}
                        element={child}
                        isSelected={false}
                        isHovered={false}
                        zoom={1}
                      />
                    ))}
                  </svg>
                )}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="h-44 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800 flex flex-col gap-2">
                <span className="text-xs font-bold text-neutral-400">Next Slide</span>
                <div className="flex-1 bg-black/60 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                  {nextSlide ? (
                    <div className="text-center">
                      <div className="text-xs font-bold text-white">{nextSlide.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Slide {currentPageIndex + 2}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 font-medium">End of Presentation</span>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-neutral-900/60 p-4 rounded-3xl border border-neutral-800 flex flex-col gap-2 overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Speaker Notes</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {currentSlide?.notes || 'No speaker notes written for this slide.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-lg border border-neutral-700/80 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl text-xs text-neutral-200 opacity-20 hover:opacity-100 transition-opacity z-50"
      >
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="p-1.5 hover:bg-neutral-800 rounded-lg disabled:opacity-30 transition-colors"
          title="Previous Slide (← / Space)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs font-bold px-2 text-indigo-300">
          {currentPageIndex + 1} / {pages.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pages.length - 1}
          className="p-1.5 hover:bg-neutral-800 rounded-lg disabled:opacity-30 transition-colors"
          title="Next Slide (→ / Space)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-700 mx-1" />

        <button
          onClick={() => setIsPresenterNotesView(!isPresenterNotesView)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isPresenterNotesView
              ? 'bg-indigo-600 text-white'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title="Toggle Presenter Notes View (P)"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes View</span>
        </button>

        <button
          onClick={() => {
            setCurrentPageIndex(0);
            if (pages[0]) setActivePageId(pages[0].id);
          }}
          className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
          title="Start from Beginning"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-700 mx-1" />

        <button
          onClick={() => setPresentModeOpen(false)}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit (ESC)</span>
        </button>
      </div>
    </div>
  );
}