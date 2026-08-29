import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { EXTENDED_TEMPLATES, TEMPLATE_CATEGORIES } from '../../constants/templatesExtended';
import { Layout, Search, Sparkles, X, Check, ArrowRight } from 'lucide-react';
export function TemplateLibraryModal() {
  const {
    templateLibraryOpen,
    setTemplateLibraryOpen,
    loadProject,
    showToast,
  } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  if (!templateLibraryOpen) return null;
  const filteredTemplates = EXTENDED_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const handleSelectTemplate = (tpl) => {
    loadProject(tpl);
    setTemplateLibraryOpen(false);
    showToast(`Loaded template: ${tpl.name}`, 'success');
  };
  return (
    <div
      onClick={() => setTemplateLibraryOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Canva-Style Template Studio</h3>
              <p className="text-[11px] text-neutral-400">Jumpstart professional designs with curated layouts & prototypes</p>
            </div>
          </div>
          <button
            onClick={() => setTemplateLibraryOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/40 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none"
            />
          </div>
        </div>
        <div className="p-6 max-h-[420px] overflow-y-auto grid grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className="p-4 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/60 hover:border-indigo-500/60 rounded-xl cursor-pointer transition-all space-y-2.5 group"
            >
              <div className="w-full h-28 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/40">
                <Sparkles className="w-6 h-6 text-indigo-400/60 group-hover:scale-125 transition-transform" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-neutral-900/80 rounded text-[9px] font-mono text-neutral-400">
                  {tpl.pages.length} Page(s)
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-neutral-100 group-hover:text-indigo-300 transition-colors">
                  {tpl.name}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-1">
                <span>{tpl.category || 'General'}</span>
                <span className="text-indigo-400 font-medium flex items-center gap-1">
                  Load Template <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}