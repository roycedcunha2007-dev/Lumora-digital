import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { CanvasElement } from '../Canvas/CanvasElement';
import { matchFrameElements, interpolateElementProperties, getEasingProgress } from '../../utils/smartAnimate';
import {
  X,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Sparkles
} from 'lucide-react';
export function PresentMode() {
  const {
    presentModeOpen,
    setPresentModeOpen,
    elements,
    project,
    selectedElements,
  } = useEditor();
  const frames = elements.filter((el) => el.type === 'frame');
  const prototypes = project.prototypes || [];
  const [currentFrameId, setCurrentFrameId] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);
  const [flashHotspots, setFlashHotspots] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState('none');
  const [deviceFrame, setDeviceFrame] = useState('none');
  useEffect(() => {
    if (presentModeOpen) {
      if (selectedElements.length === 1 && selectedElements[0].type === 'frame') {
        setCurrentFrameId(selectedElements[0].id);
      } else if (frames.length > 0) {
        setCurrentFrameId(frames[0].id);
      }
      setHistoryStack([]);
    }
  }, [presentModeOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && presentModeOpen) {
        setPresentModeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentModeOpen, setPresentModeOpen]);
  if (!presentModeOpen) return null;
  const currentFrame = frames.find((f) => f.id === currentFrameId) || frames[0];
  const handleElementClick = (clickedElement, e) => {
    e && e.stopPropagation();
    const interaction = prototypes.find(
      (p) => p.fromElementId === clickedElement.id || p.fromElementId === clickedElement.name
    );
    if (interaction) {
      if (interaction.action === 'back') {
        if (historyStack.length > 0) {
          const prevFrameId = historyStack[historyStack.length - 1];
          setHistoryStack((s) => s.slice(0, -1));
          triggerTransition(prevFrameId, interaction.transition || 'slide_right');
        }
      } else if (interaction.toFrameId) {
        setHistoryStack((s) => [...s, currentFrameId]);
        triggerTransition(interaction.toFrameId, interaction.transition || 'smart_animate');
      }
    } else {
      setFlashHotspots(true);
      setTimeout(() => setFlashHotspots(false), 500);
    }
  };
  const triggerTransition = (targetFrameId, transitionType) => {
    setIsTransitioning(true);
    setTransitionStyle(transitionType);
    setTimeout(() => {
      setCurrentFrameId(targetFrameId);
      setIsTransitioning(false);
    }, 240);
  };
  const handleRestart = () => {
    if (frames.length > 0) {
      setCurrentFrameId(frames[0].id);
      setHistoryStack([]);
    }
  };
  const handlePrev = () => {
    const currentIndex = frames.findIndex((f) => f.id === currentFrameId);
    if (currentIndex > 0) {
      triggerTransition(frames[currentIndex - 1].id, 'slide_right');
    }
  };
  const handleNext = () => {
    const currentIndex = frames.findIndex((f) => f.id === currentFrameId);
    if (currentIndex < frames.length - 1) {
      triggerTransition(frames[currentIndex + 1].id, 'slide_left');
    }
  };
  const interactiveElementIds = prototypes
    .filter((p) => p.fromElementId)
    .map((p) => p.fromElementId);
  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div
        onClick={() => {
          setFlashHotspots(true);
          setTimeout(() => setFlashHotspots(false), 500);
        }}
        className="w-full h-full flex items-center justify-center p-8 cursor-default overflow-auto"
      >
        {currentFrame ? (
          <div
            className={`relative transition-all duration-200 ${
              deviceFrame === 'iphone'
                ? 'w-[380px] h-[780px] rounded-[52px] p-3.5 bg-neutral-800 border-4 border-neutral-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
                : deviceFrame === 'ipad'
                ? 'w-[640px] h-[820px] rounded-[36px] p-4 bg-neutral-800 border-4 border-neutral-700'
                : deviceFrame === 'macbook'
                ? 'w-[800px] h-[520px] rounded-2xl pt-6 px-3 pb-3 bg-neutral-800 border-2 border-neutral-700'
                : ''
            }`}
          >
            {deviceFrame === 'iphone' && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20" />
            )}
            <div
              style={{
                width: deviceFrame === 'none' ? `${currentFrame.width}px` : '100%',
                height: deviceFrame === 'none' ? `${currentFrame.height}px` : '100%',
                maxWidth: deviceFrame === 'none' ? '90vw' : undefined,
                maxHeight: deviceFrame === 'none' ? '85vh' : undefined,
              }}
              className={`relative rounded-3xl shadow-2xl overflow-hidden bg-neutral-950 transition-all duration-240 ${
                isTransitioning
                  ? transitionStyle === 'slide_left'
                    ? '-translate-x-10 opacity-0'
                    : transitionStyle === 'slide_right'
                    ? 'translate-x-10 opacity-0'
                    : 'opacity-0 scale-95'
                  : 'translate-x-0 opacity-100 scale-100'
              }`}
            >
              <svg
                viewBox={`0 0 ${currentFrame.width} ${currentFrame.height}`}
                className="w-full h-full"
              >
                <rect
                  width={currentFrame.width}
                  height={currentFrame.height}
                  fill={currentFrame.fill || '#090D16'}
                  rx={currentFrame.cornerRadius || 24}
                />
                {(currentFrame.children || []).map((child) => (
                  <g key={child.id} onClick={(e) => handleElementClick(child, e)}>
                    <CanvasElement
                      element={child}
                      isSelected={false}
                      isHovered={false}
                      onSelect={(el, e) => handleElementClick(el, e)}
                      zoom={1}
                    />
                    {flashHotspots && interactiveElementIds.includes(child.id) && (
                      <rect
                        x={child.x}
                        y={child.y}
                        width={child.width}
                        height={child.height}
                        rx={child.cornerRadius || 4}
                        fill="rgba(56, 189, 248, 0.35)"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        className="animate-pulse pointer-events-none"
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-400">
            <p className="text-sm font-medium">No frames available to present</p>
            <p className="text-xs text-neutral-500 mt-1">Add a Frame in the editor to test prototype presentation</p>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl text-xs text-neutral-200">
        <select
          value={currentFrameId || ''}
          onChange={(e) => triggerTransition(e.target.value, 'dissolve')}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-200 outline-none font-medium"
        >
          {frames.map((f, idx) => (
            <option key={f.id} value={f.id}>
              {idx + 1}. {f.name}
            </option>
          ))}
        </select>
        <div className="h-4 w-px bg-neutral-700" />
        <div className="flex items-center gap-1 bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-700/60">
          <button
            onClick={() => setDeviceFrame('none')}
            className={`p-1 rounded ${deviceFrame === 'none' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            title="Clean Stage"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceFrame('iphone')}
            className={`p-1 rounded ${deviceFrame === 'iphone' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            title="iPhone Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceFrame('ipad')}
            className={`p-1 rounded ${deviceFrame === 'ipad' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            title="iPad Frame"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceFrame('macbook')}
            className={`p-1 rounded ${deviceFrame === 'macbook' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            title="MacBook Frame"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-4 w-px bg-neutral-700" />
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
            title="Previous Frame"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
            title="Next Frame"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="h-4 w-px bg-neutral-700" />
        <button
          onClick={handleRestart}
          className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
          title="Restart Prototype Flow"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-neutral-700" />
        <button
          onClick={() => setPresentModeOpen(false)}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit (ESC)</span>
        </button>
      </div>
    </div>
  );
}