import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { FRAME_PRESETS } from '../../constants/presets';
import { executeMagicResize } from '../../utils/magicResize';
import {
  Scaling,
  ArrowRight,
  Check,
  X,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Sparkles
} from 'lucide-react';
export function MagicResizeModal() {
  const {
    magicResizeOpen,
    setMagicResizeOpen,
    elements,
    selectedElements,
    updateActivePageElements,
    showToast,
  } = useEditor();
  const frames = elements.filter((el) => el.type === 'frame');
  const [selectedFrameId, setSelectedFrameId] = useState(() => (selectedElements.find((el) => el.type === 'frame') || frames[0])?.id);
  const flatPresets = FRAME_PRESETS.flatMap((cat) => cat.items);
  const [selectedPresetName, setSelectedPresetName] = useState('iPhone 16 Pro');
  if (!magicResizeOpen) return null;
  const targetFrame = frames.find((f) => f.id === selectedFrameId) || frames[0];
  const targetPreset = flatPresets.find((p) => p.name === selectedPresetName) || flatPresets[0];
  const handleApplyResize = () => {
    if (!targetFrame || !targetPreset) return;
    const resized = executeMagicResize(targetFrame, targetPreset);
    const updated = elements.map((el) => (el.id === targetFrame.id ? resized : el));
    updateActivePageElements(updated, true);
    setMagicResizeOpen(false);
    showToast(`Magic resized to ${targetPreset.name} (${targetPreset.width}x${targetPreset.height}px)`, 'success');
  };
  return (
    <div
      onClick={() => setMagicResizeOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Scaling className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Magic Responsive Resize</h3>
              <p className="text-[11px] text-neutral-400">Intelligently adapt layouts with constraints & auto layout</p>
            </div>
          </div>
          <button
            onClick={() => setMagicResizeOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Source Frame
            </label>
            <select
              value={selectedFrameId || ''}
              onChange={(e) => setSelectedFrameId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 outline-none"
            >
              {frames.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.width} × {f.height}px)
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Target Preset
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {flatPresets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPresetName(p.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    selectedPresetName === p.name
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-neutral-800/60 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {p.width}x{p.height}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {targetFrame && targetPreset && (
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-neutral-400">
                  {targetFrame.width} × {targetFrame.height}px
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 font-bold">
                  {targetPreset.width} × {targetPreset.height}px
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 space-y-0.5">
                <div>✓ Frame dimensions updated</div>
                <div>✓ Auto Layout recalculated for child containers</div>
                <div>✓ Responsive constraints applied</div>
                <div>✓ Typography reflowed proportionally</div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setMagicResizeOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyResize}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Scaling className="w-3.5 h-3.5" />
            <span>Apply Magic Resize</span>
          </button>
        </div>
      </div>
    </div>
  );
}