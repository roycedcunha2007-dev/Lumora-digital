import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Play, Plus, Trash2, ArrowRight, Zap } from 'lucide-react';
export function PrototypeTab() {
  const {
    elements,
    selectedIds,
    selectedElements,
    project,
    addPrototypeLink,
    removePrototypeLink,
    updateProject,
    setPresentModeOpen,
    showToast,
  } = useEditor();
  const frames = elements.filter((el) => el.type === 'frame');
  const prototypes = project.prototypes || [];
  if (selectedElements.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-neutral-500">
        <Zap className="w-8 h-8 mx-auto mb-2 opacity-30 text-neutral-400" />
        <p className="font-medium text-neutral-400">No element selected</p>
        <p className="text-[11px] text-neutral-600 mt-1">Select an element or button to connect an interaction flow</p>
      </div>
    );
  }
  const primary = selectedElements[0];
  const activeLink = prototypes.find((p) => p.fromElementId === primary.id);
  const handleUpdateLink = (updates) => {
    if (!activeLink) return;
    updateProject((prev) => ({
      ...prev,
      prototypes: prev.prototypes.map((p) => (p.id === activeLink.id ? { ...p, ...updates } : p)),
    }), true);
  };
  const handleCreateNewInteraction = () => {
    if (frames.length === 0) {
      showToast('Create at least one Frame to connect to', 'error');
      return;
    }
    const targetFrame = frames.find((f) => f.id !== primary.id) || frames[0];
    addPrototypeLink(primary.id, targetFrame.id, {
      trigger: 'click',
      action: 'navigate',
      transition: 'slide_left',
      duration: 300,
    });
  };
  return (
    <div className="flex flex-col p-3 gap-4 text-xs select-none overflow-y-auto max-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
        <span>Interactions</span>
        {!activeLink && (
          <button
            onClick={handleCreateNewInteraction}
            className="p-1 hover:text-white rounded flex items-center gap-1 text-indigo-400"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>
      {activeLink ? (
        <div className="p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-indigo-400 text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Interaction Flow
            </span>
            <button
              onClick={() => removePrototypeLink(activeLink.id)}
              className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
              title="Remove interaction"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400 font-medium">Trigger</label>
            <select
              value={activeLink.trigger || 'click'}
              onChange={(e) => handleUpdateLink({ trigger: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700/80 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
            >
              <option value="click">On Click / Tap</option>
              <option value="hover">While Hovering</option>
              <option value="mousedown">Mouse Down</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400 font-medium">Action</label>
            <select
              value={activeLink.action || 'navigate'}
              onChange={(e) => handleUpdateLink({ action: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700/80 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
            >
              <option value="navigate">Navigate To Frame</option>
              <option value="overlay">Open Modal / Overlay</option>
              <option value="back">Go Back</option>
            </select>
          </div>
          {activeLink.action !== 'back' && (
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 font-medium">Destination Frame</label>
              <select
                value={activeLink.toFrameId || ''}
                onChange={(e) => handleUpdateLink({ toFrameId: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700/80 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
              >
                {frames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400 font-medium">Transition Animation</label>
            <select
              value={activeLink.transition || 'slide_left'}
              onChange={(e) => handleUpdateLink({ transition: e.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700/80 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
            >
              <option value="instant">Instant (No Animation)</option>
              <option value="dissolve">Dissolve (Fade)</option>
              <option value="slide_left">Slide Left ←</option>
              <option value="slide_right">Slide Right →</option>
              <option value="slide_up">Slide Up ↑</option>
            </select>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-neutral-400">Duration (ms)</span>
            <input
              type="number"
              step="50"
              value={activeLink.duration || 300}
              onChange={(e) => handleUpdateLink({ duration: Number(e.target.value) })}
              className="w-20 bg-neutral-800 border border-neutral-700/80 rounded px-2 py-1 text-xs font-mono text-neutral-200 outline-none text-right"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-800 text-center space-y-2">
          <p className="text-neutral-400 text-xs">No interaction configured</p>
          <button
            onClick={handleCreateNewInteraction}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-colors"
          >
            + Connect to Frame
          </button>
        </div>
      )}
      <div className="pt-2 border-t border-neutral-800">
        <button
          onClick={() => setPresentModeOpen(true)}
          className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 hover:text-white border border-neutral-700/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
          <span>Launch Prototype Preview</span>
        </button>
      </div>
    </div>
  );
}