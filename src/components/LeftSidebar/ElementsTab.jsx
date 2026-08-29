import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  LIBRARY_ELEMENTS,
  ELEMENT_LIBRARY_CATEGORIES,
} from '../../constants/elementsLibrary';
import { Sparkles, BarChart3, Shapes } from 'lucide-react';

export function ElementsTab({ searchQuery = '' }) {
  const { addElement, setSelectedIds, showToast, pan, zoom } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleInsertElement = (item) => {
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 300;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    const newElement = {
      ...item,
      id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: Math.round(cx - (item.width || 120) / 2),
      y: Math.round(cy - (item.height || 120) / 2),
      opacity: item.opacity ?? 1,
      rotation: item.rotation ?? 0,
    };

    addElement(newElement);
    setSelectedIds([newElement.id]);
    showToast(`Added ${item.name}`, 'success');
  };

  const filteredLibrary = LIBRARY_ELEMENTS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto select-none text-xs">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {ELEMENT_LIBRARY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredLibrary.map((item) => (
          <div
            key={item.id}
            onClick={() => handleInsertElement(item)}
            className="p-3 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98 group flex flex-col items-center justify-center text-center gap-2"
          >
            <div className="h-12 w-full flex items-center justify-center">
              {item.type === 'chart' ? (
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: typeof item.fill === 'string' ? item.fill : '#6366F1',
                    borderRadius: item.cornerRadius ? `${item.cornerRadius / 2}px` : '4px',
                  }}
                  className="w-10 h-8 shadow-sm flex items-center justify-center text-white"
                />
              )}
            </div>
            <div>
              <div className="font-semibold text-xs text-neutral-200 group-hover:text-white truncate max-w-[90px]">
                {item.name}
              </div>
              <div className="text-[10px] text-neutral-500 capitalize">{item.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
