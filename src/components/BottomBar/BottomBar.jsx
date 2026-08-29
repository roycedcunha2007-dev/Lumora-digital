import React from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  Grid,
  Magnet,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText
} from 'lucide-react';

export function BottomBar() {
  const {
    project,
    activePage,
    setActivePageId,
    elements,
    selectedElements,
    zoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    snapToObjects,
    setSnapToObjects,
  } = useEditor();

  const selectedPrimary = selectedElements[0];

  return (
    <footer className="h-8 w-full glass-surface border-t border-neutral-800/80 px-3 flex items-center justify-between text-[11px] text-neutral-400 select-none z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-200 bg-neutral-800/40 px-2 py-0.5 rounded-md border border-neutral-700/40">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>{activePage.name}</span>
        </div>

        <div className="h-3.5 w-px bg-neutral-800/80" />

        <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
          <span>{elements.length} layer(s)</span>
          {selectedElements.length > 0 && (
            <span className="text-indigo-400 font-semibold">({selectedElements.length} selected)</span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-neutral-400 bg-neutral-900/40 px-3 py-0.5 rounded-full border border-neutral-800/60">
        {selectedPrimary ? (
          <>
            <span>X: <strong className="text-neutral-200">{Math.round(selectedPrimary.x || 0)}</strong></span>
            <span>Y: <strong className="text-neutral-200">{Math.round(selectedPrimary.y || 0)}</strong></span>
            <span>W: <strong className="text-neutral-200">{Math.round(selectedPrimary.width || 0)}</strong></span>
            <span>H: <strong className="text-neutral-200">{Math.round(selectedPrimary.height || 0)}</strong></span>
          </>
        ) : (
          <span>Canvas Workspace Active</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
            showGrid ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Toggle Grid (Ctrl+')"
        >
          <Grid className="w-3 h-3" />
          <span className="text-[10px]">Grid</span>
        </button>

        <button
          onClick={() => setSnapToObjects(!snapToObjects)}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
            snapToObjects ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Toggle Smart Snapping"
        >
          <Magnet className="w-3 h-3" />
          <span className="text-[10px]">Snap</span>
        </button>

        <button
          onClick={() => setShowRulers(!showRulers)}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
            showRulers ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Toggle Rulers (Ctrl+R)"
        >
          <Compass className="w-3 h-3" />
          <span className="text-[10px]">Rulers</span>
        </button>

        <div className="h-3.5 w-px bg-neutral-800/80 mx-0.5" />

        <div className="flex items-center gap-0.5 font-mono text-[10px] bg-neutral-800/40 px-1 py-0.5 rounded-lg border border-neutral-700/40">
          <button
            onClick={zoomOut}
            className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="px-1.5 text-neutral-200 font-semibold">{Math.round(zoom * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={zoomToFit}
            className="p-1 hover:text-white rounded hover:bg-neutral-800 transition-colors ml-0.5"
            title="Zoom to Fit (Shift+1)"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}