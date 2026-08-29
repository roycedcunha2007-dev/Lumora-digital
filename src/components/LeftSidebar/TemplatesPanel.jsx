import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { EXTENDED_TEMPLATES } from '../../constants/templatesExtended';
import { Layout, Check, Sparkles } from 'lucide-react';

export function TemplatesPanel({ searchQuery = '' }) {
  const { loadProject, showToast } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Social Media', label: 'Social' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Business', label: 'Business' },
    { id: 'Web & Apps', label: 'Web' },
  ];

  const filtered = EXTENDED_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'all' || (t.category && t.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesQuery =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleApplyTemplate = (tpl) => {
    loadProject(tpl);
    showToast(`Loaded ${tpl.name}`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto select-none text-xs">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => handleApplyTemplate(tpl)}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-all hover:scale-[1.02] active:scale-98 flex flex-col"
          >
            <div className="h-28 bg-gradient-to-br from-indigo-950/80 to-slate-900 rounded-t-2xl flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="text-xs font-bold truncate max-w-full">{tpl.name}</div>
              <div className="text-[10px] opacity-70 font-mono mt-1">{tpl.category}</div>
              <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/30 flex items-center justify-center transition-colors">
                <span className="px-3 py-1 bg-white text-neutral-900 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  Use Template
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-neutral-900/90 flex items-center justify-between">
              <span className="font-semibold text-neutral-200 truncate group-hover:text-indigo-300 transition-colors">
                {tpl.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">{tpl.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
