import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { generateId } from '../../utils/math';
import { Sparkles, X, Copy, Check, LayoutGrid } from 'lucide-react';
export function VariationsModal() {
  const {
    variationsOpen,
    setVariationsOpen,
    elements,
    activePage,
    updateActivePageElements,
    showToast,
  } = useEditor();
  const [selectedVariation, setSelectedVariation] = useState('dark');
  if (!variationsOpen) return null;
  const targetFrame = elements.find((el) => el.type === 'frame') || {
    id: 'f_default',
    name: 'Canvas Design',
    x: 80,
    y: 80,
    width: 800,
    height: 600,
    fill: '#09090B',
    children: elements,
  };
  const variations = [
    {
      id: 'dark',
      name: 'Cyberpunk Dark Mode',
      description: 'Deep navy background with neon cyan and purple accents',
      transform: (f) => ({
        ...f,
        fill: '#050814',
        children: (f.children || []).map((c) => (c.type === 'text' ? { ...c, fill: '#38BDF8' } : c)),
      }),
    },
    {
      id: 'minimal',
      name: 'Clean Minimalist',
      description: 'Neutral slate monochromatic styling with sharp high legibility',
      transform: (f) => ({
        ...f,
        fill: '#18181B',
        children: (f.children || []).map((c) => (c.type === 'text' ? { ...c, fill: '#F4F4F5' } : c)),
      }),
    },
    {
      id: 'high_contrast',
      name: 'High Contrast Mode',
      description: 'Pitch black background with pure stark white text and bright amber highlights',
      transform: (f) => ({
        ...f,
        fill: '#000000',
        children: (f.children || []).map((c) => (c.type === 'text' ? { ...c, fill: '#FFFFFF' } : c)),
      }),
    },
    {
      id: 'compact',
      name: 'Compact Dense Layout',
      description: 'Reduced padding, smaller font scale and tight spacing matrix',
      transform: (f) => ({
        ...f,
        children: (f.children || []).map((c) =>
          c.type === 'text' ? { ...c, fontSize: Math.max(11, (c.fontSize || 16) - 2) } : c
        ),
      }),
    },
  ];
  const handleGenerateVariation = () => {
    const chosen = variations.find((v) => v.id === selectedVariation);
    if (!chosen) return;
    const cloned = JSON.parse(JSON.stringify(targetFrame));
    const variantFrame = {
      ...chosen.transform(cloned),
      id: generateId('frame_var'),
      name: `${targetFrame.name} (${chosen.name})`,
      x: (targetFrame.x || 80) + (targetFrame.width || 800) + 60,
      y: targetFrame.y || 80,
    };
    updateActivePageElements([...elements, variantFrame], true);
    setVariationsOpen(false);
    showToast(`Generated design variation: ${chosen.name}`, 'success');
  };
  return (
    <div
      onClick={() => setVariationsOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Design Variations Generator</h3>
              <p className="text-[11px] text-neutral-400">Generate deterministic aesthetic theme variations</p>
            </div>
          </div>
          <button
            onClick={() => setVariationsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
          {variations.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVariation(v.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedVariation === v.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md'
                  : 'bg-neutral-800/50 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-neutral-100">{v.name}</span>
                {selectedVariation === v.id && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setVariationsOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateVariation}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Variation Frame</span>
          </button>
        </div>
      </div>
    </div>
  );
}