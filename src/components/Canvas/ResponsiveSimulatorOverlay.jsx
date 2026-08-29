import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Smartphone, Tablet, Laptop, Monitor, Check, AlertTriangle } from 'lucide-react';
export function ResponsiveSimulatorOverlay({ zoom = 1 }) {
  const { elements, selectedElements } = useEditor();
  const [viewportWidth, setViewportWidth] = useState(393);
  const [activePreset, setActivePreset] = useState('mobile'); 
  const targetFrame = selectedElements.find((el) => el.type === 'frame') || elements.find((el) => el.type === 'frame');
  if (!targetFrame) return null;
  const presets = [
    { id: 'mobile', name: 'Mobile (393px)', width: 393, icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'tablet', name: 'Tablet (768px)', width: 768, icon: <Tablet className="w-3.5 h-3.5" /> },
    { id: 'laptop', name: 'Laptop (1280px)', width: 1280, icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'desktop', name: 'Desktop (1440px)', width: 1440, icon: <Monitor className="w-3.5 h-3.5" /> },
  ];
  const handleSelectPreset = (p) => {
    setActivePreset(p.id);
    setViewportWidth(p.width);
  };
  const hasOverflow = (targetFrame.children || []).some((child) => child.x + (child.width || 0) > viewportWidth);
  return (
    <g id="responsive-simulator-overlay" className="pointer-events-auto select-none">
      <rect
        x={targetFrame.x}
        y={targetFrame.y}
        width={viewportWidth}
        height={targetFrame.height}
        fill="none"
        stroke="#38BDF8"
        strokeWidth={2 / zoom}
        strokeDasharray={`${6 / zoom},${3 / zoom}`}
      />
      <g transform={`translate(${targetFrame.x + viewportWidth}, ${targetFrame.y + targetFrame.height / 2})`} className="cursor-ew-resize">
        <rect
          x="-4"
          y="-24"
          width="8"
          height="48"
          rx="4"
          fill="#38BDF8"
          stroke="#09090B"
          strokeWidth="1.5"
        />
      </g>
      <g transform={`translate(${targetFrame.x}, ${targetFrame.y - 36 / zoom})`}>
        <foreignObject width="450" height="32">
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-700/80 rounded-lg px-2 py-1 text-xs text-neutral-200 shadow-xl w-max">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-2 py-0.5 rounded flex items-center gap-1 text-[11px] transition-colors ${
                  activePreset === p.id ? 'bg-sky-600 text-white font-semibold shadow' : 'hover:bg-neutral-800 text-neutral-400'
                }`}
              >
                {p.icon}
                <span>{p.width}px</span>
              </button>
            ))}
            <div className="w-px h-3.5 bg-neutral-700 mx-1" />
            <div className="flex items-center gap-1 font-mono text-[10px]">
              {hasOverflow ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Overflow Detected
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Valid Fit
                </span>
              )}
            </div>
          </div>
        </foreignObject>
      </g>
    </g>
  );
}