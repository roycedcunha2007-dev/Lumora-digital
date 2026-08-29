import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  SLIDE_LAYOUT_TYPES,
  createSlideElements,
  PRESENTATION_STYLES,
  applyDesignStyleToProject,
  checkPresentationConsistency
} from '../../utils/presentationGenerator';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layout,
  Palette,
  ShieldCheck,
  FileText,
  Sparkles,
  Play
} from 'lucide-react';

export function SlidesPanel({ searchQuery = '' }) {
  const {
    project,
    activePageId,
    setActivePageId,
    updateProject,
    showToast,
    setPresentModeOpen,
  } = useEditor();

  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const pages = project.pages || [];

  const handleAddSlide = (layoutType) => {
    const newElements = createSlideElements(
      layoutType,
      `Slide ${pages.length + 1}`,
      'Add subtitle or descriptive takeaway',
      project.styleKey || 'modern'
    );

    const newPage = {
      id: `page_slide_${Date.now()}`,
      name: `Slide ${pages.length + 1}: ${layoutType.replace('_', ' ')}`,
      background: project.pages[0]?.background || '#090D16',
      notes: `Speaker Notes for Slide ${pages.length + 1}`,
      elements: newElements,
    };

    updateProject((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }), true);

    setActivePageId(newPage.id);
    setShowLayoutPicker(false);
    showToast(`Added ${layoutType} slide`, 'success');
  };

  const handleDuplicateSlide = (page, e) => {
    e.stopPropagation();
    const dupPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: `page_slide_${Date.now()}`,
      name: `${page.name} (Copy)`,
    };

    const idx = pages.findIndex((p) => p.id === page.id);
    const newPages = [...pages];
    newPages.splice(idx + 1, 0, dupPage);

    updateProject((prev) => ({ ...prev, pages: newPages }), true);
    setActivePageId(dupPage.id);
    showToast('Slide duplicated', 'success');
  };

  const handleDeleteSlide = (pageId, e) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      showToast('A presentation must have at least one slide', 'error');
      return;
    }

    const filtered = pages.filter((p) => p.id !== pageId);
    updateProject((prev) => ({ ...prev, pages: filtered }), true);

    if (activePageId === pageId) {
      setActivePageId(filtered[0].id);
    }
    showToast('Slide deleted', 'info');
  };

  const handleMoveSlide = (idx, direction, e) => {
    e.stopPropagation();
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= pages.length) return;

    const newPages = [...pages];
    const [moved] = newPages.splice(idx, 1);
    newPages.splice(targetIdx, 0, moved);

    updateProject((prev) => ({ ...prev, pages: newPages }), true);
  };

  const handleApplyTheme = (styleKey) => {
    const restyled = applyDesignStyleToProject(project, styleKey);
    updateProject(restyled, true);
    setShowThemePicker(false);
    showToast(`Applied ${PRESENTATION_STYLES[styleKey]?.name || 'Theme'} style`, 'success');
  };

  const handleRunConsistencyCheck = () => {
    const report = checkPresentationConsistency(project);
    if (report.isConsistent) {
      showToast(`All ${report.slideCount} slides are harmonious with no overflow issues!`, 'success');
    } else {
      showToast(`Found ${report.issues.length} layout warnings across slides.`, 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto select-none text-xs">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setShowLayoutPicker(!showLayoutPicker)}
          className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </button>

        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-300 hover:text-white transition-colors"
          title="Apply Presentation Theme"
        >
          <Palette className="w-4 h-4 text-indigo-400" />
        </button>

        <button
          onClick={handleRunConsistencyCheck}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-300 hover:text-emerald-400 transition-colors"
          title="Audit Deck Consistency"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>

      {showLayoutPicker && (
        <div className="glass-modal rounded-2xl p-3 border border-indigo-500/30 space-y-2 animate-in fade-in zoom-in-95 duration-100 shadow-2xl">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <span className="font-bold text-neutral-200">Choose Slide Layout</span>
            <span className="text-[10px] text-neutral-500 font-mono">16:9 HD</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SLIDE_LAYOUT_TYPES.map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleAddSlide(layout.id)}
                className="p-2 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 rounded-xl text-left transition-all hover:scale-105 group"
              >
                <div className="font-semibold text-xs text-neutral-200 group-hover:text-indigo-300 truncate">
                  {layout.name}
                </div>
                <div className="text-[10px] text-neutral-500 line-clamp-1">{layout.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showThemePicker && (
        <div className="glass-modal rounded-2xl p-3 border border-indigo-500/30 space-y-2 animate-in fade-in zoom-in-95 duration-100 shadow-2xl">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <span className="font-bold text-neutral-200">Apply Design Palette</span>
          </div>
          <div className="space-y-1.5">
            {Object.values(PRESENTATION_STYLES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleApplyTheme(theme.id)}
                className="w-full p-2 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 rounded-xl flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-neutral-200">{theme.name}</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          <span>Slides ({pages.length})</span>
          <button
            onClick={() => setPresentModeOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 normal-case text-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Present</span>
          </button>
        </div>

        <div className="space-y-2">
          {pages.map((page, idx) => {
            const isActive = page.id === activePageId;
            const frame = page.elements && page.elements[0];

            return (
              <div
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-neutral-900 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/40'
                    : 'border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700'
                }`}
              >
                <div className="h-24 bg-neutral-950 flex flex-col justify-between p-2 relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-mono text-neutral-300">
                      {idx + 1}
                    </span>
                    {page.notes && (
                      <span className="text-[10px] bg-indigo-600/30 text-indigo-300 px-1 rounded flex items-center gap-1">
                        <FileText className="w-2.5 h-2.5" />
                        <span>Notes</span>
                      </span>
                    )}
                  </div>

                  <div className="text-center px-2 py-1 z-10">
                    <div className="text-xs font-bold text-white truncate">{page.name}</div>
                  </div>

                  <div
                    style={{ backgroundColor: frame ? frame.fill || page.background : '#0F172A' }}
                    className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
                  />
                </div>

                <div className="p-2 flex items-center justify-between border-t border-neutral-800/60 text-neutral-400">
                  <span className="text-[11px] font-medium truncate flex-1">{page.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleMoveSlide(idx, -1, e)}
                      disabled={idx === 0}
                      className="p-1 hover:text-white rounded disabled:opacity-20"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleMoveSlide(idx, 1, e)}
                      disabled={idx === pages.length - 1}
                      className="p-1 hover:text-white rounded disabled:opacity-20"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDuplicateSlide(page, e)}
                      className="p-1 hover:text-white rounded"
                      title="Duplicate Slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSlide(page.id, e)}
                      className="p-1 hover:text-rose-400 rounded"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
