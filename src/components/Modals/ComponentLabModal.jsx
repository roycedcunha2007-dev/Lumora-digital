import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Sparkles, Plus, Copy, Trash2, X, Check, Eye } from 'lucide-react';
export function ComponentLabModal() {
  const {
    componentLabOpen,
    setComponentLabOpen,
    project,
    createComponentInstance,
    showToast,
  } = useEditor();
  const components = Object.values(project.components || {});
  const [selectedCompId, setSelectedCompId] = useState(() => (components[0] ? components[0].id : null));
  const [selectedVariantType, setSelectedVariantType] = useState('primary'); 
  const [selectedVariantSize, setSelectedVariantSize] = useState('medium'); 
  const [selectedVariantState, setSelectedVariantState] = useState('default'); 
  if (!componentLabOpen) return null;
  const activeComponent = components.find((c) => c.id === selectedCompId) || components[0];
  const handleInsertVariantInstance = () => {
    if (activeComponent) {
      createComponentInstance(activeComponent.id, 200, 200);
      setComponentLabOpen(false);
      showToast(`Inserted ${activeComponent.name} (${selectedVariantType}, ${selectedVariantSize})`, 'success');
    }
  };
  const getVariantStyles = () => {
    let fill = activeComponent && typeof activeComponent.fill === 'string' ? activeComponent.fill : '#6366F1';
    let stroke = 'none';
    let strokeWidth = 0;
    let opacity = 1;
    let scale = 1;
    if (selectedVariantType === 'secondary') fill = '#334155';
    if (selectedVariantType === 'outline') {
      fill = 'transparent';
      stroke = '#6366F1';
      strokeWidth = 2;
    }
    if (selectedVariantSize === 'small') scale = 0.8;
    if (selectedVariantSize === 'large') scale = 1.2;
    if (selectedVariantState === 'hover') opacity = 0.85;
    if (selectedVariantState === 'pressed') scale *= 0.95;
    if (selectedVariantState === 'disabled') opacity = 0.4;
    return { fill, stroke, strokeWidth, opacity, scale };
  };
  const variantStyle = getVariantStyles();
  return (
    <div
      onClick={() => setComponentLabOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Component Lab & Variants</h3>
              <p className="text-[11px] text-neutral-400">Inspect master components, test variants and generate instances</p>
            </div>
          </div>
          <button
            onClick={() => setComponentLabOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-neutral-800 min-h-[360px]">
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider mb-2">
              Master Components ({components.length})
            </div>
            {components.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-[11px]">
                No components created yet. Select an element on canvas and click Create Component.
              </div>
            ) : (
              components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    comp.id === (activeComponent && activeComponent.id)
                      ? 'bg-purple-950/30 border-purple-500/80 text-purple-200 font-semibold'
                      : 'bg-neutral-800/40 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="truncate">{comp.name}</span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                </button>
              ))
            )}
          </div>
          <div className="col-span-2 p-6 flex flex-col justify-between space-y-6">
            {activeComponent ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-neutral-100">{activeComponent.name}</h4>
                    <span className="px-2 py-0.5 bg-purple-900/40 text-purple-300 rounded text-[10px] font-mono">
                      Master ID: {activeComponent.id.slice(0, 10)}...
                    </span>
                  </div>
                  <div className="h-36 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div
                      style={{
                        transform: `scale(${variantStyle.scale})`,
                        transition: 'all 0.15s ease',
                      }}
                      className="px-6 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2"
                    >
                      <div
                        style={{
                          backgroundColor: variantStyle.fill,
                          border: variantStyle.strokeWidth ? `${variantStyle.strokeWidth}px solid ${variantStyle.stroke}` : undefined,
                          opacity: variantStyle.opacity,
                          color: variantStyle.fill === 'transparent' ? '#6366F1' : '#FFFFFF',
                        }}
                        className="px-4 py-2 rounded-lg"
                      >
                        {activeComponent.name.replace('❖ ', '')}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-medium">Type</label>
                      <select
                        value={selectedVariantType}
                        onChange={(e) => setSelectedVariantType(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="outline">Outline</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-medium">Size</label>
                      <select
                        value={selectedVariantSize}
                        onChange={(e) => setSelectedVariantSize(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-medium">State</label>
                      <select
                        value={selectedVariantState}
                        onChange={(e) => setSelectedVariantState(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 outline-none"
                      >
                        <option value="default">Default</option>
                        <option value="hover">Hover</option>
                        <option value="pressed">Pressed</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    onClick={handleInsertVariantInstance}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Variant Instance</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-500 my-auto">Select a component to inspect</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}