import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { EXTENDED_TEMPLATES } from '../../constants/templatesExtended';
import { DEMO_PROJECTS } from '../../constants/templates';
import { getAllProjectsFromDB } from '../../utils/idb';
import {
  Layers,
  Search,
  Plus,
  Layout,
  Smartphone,
  Monitor,
  Tv,
  FileText,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Trash2,
  FolderOpen
} from 'lucide-react';

export function HomeDashboard() {
  const {
    setCurrentView,
    loadProject,
    createNewProject,
    theme,
    toggleTheme,
    showToast,
    addElement,
    setZoom,
    setPan
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedProjects, setSavedProjects] = useState([]);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    getAllProjectsFromDB().then((projs) => {
      if (projs && projs.length > 0) {
        setSavedProjects(projs);
      } else {
        setSavedProjects(DEMO_PROJECTS);
      }
    }).catch(() => {
      setSavedProjects(DEMO_PROJECTS);
    });
  }, []);

  const formatPresets = [
    { id: 'ig', name: 'Instagram Post', width: 1080, height: 1080, icon: <span className="text-pink-400 font-bold">IG</span>, desc: '1080 × 1080 px' },
    { id: 'pres', name: 'Presentation', width: 1920, height: 1080, icon: <Monitor className="w-5 h-5 text-indigo-400" />, desc: '1920 × 1080 px' },
    { id: 'yt', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: <Tv className="w-5 h-5 text-rose-400" />, desc: '1280 × 720 px' },
    { id: 'poster', name: 'Marketing Poster', width: 1200, height: 1600, icon: <FileText className="w-5 h-5 text-amber-400" />, desc: '1200 × 1600 px' },
    { id: 'web', name: 'Website Landing', width: 1440, height: 1024, icon: <Layout className="w-5 h-5 text-sky-400" />, desc: '1440 × 1024 px' },
    { id: 'mobile', name: 'Mobile App Screen', width: 393, height: 852, icon: <Smartphone className="w-5 h-5 text-emerald-400" />, desc: '393 × 852 px' },
  ];

  const handleStartPreset = (preset) => {
    createNewProject();
    const frame = {
      id: `frame_${Date.now()}`,
      name: preset.name,
      type: 'frame',
      x: 100,
      y: 100,
      width: preset.width,
      height: preset.height,
      fill: '#090D16',
      cornerRadius: 0,
      stroke: '#1E293B',
      strokeWidth: 1,
      children: [],
    };
    addElement(frame);
    setZoom(0.6);
    setPan({ x: 80, y: 60 });
    setCurrentView('editor');
    showToast(`Created new ${preset.name} canvas`, 'success');
  };

  const handleCreateCustom = () => {
    createNewProject();
    const frame = {
      id: `frame_${Date.now()}`,
      name: 'Custom Design',
      type: 'frame',
      x: 100,
      y: 100,
      width: Math.max(100, Number(customWidth) || 1080),
      height: Math.max(100, Number(customHeight) || 1080),
      fill: '#090D16',
      cornerRadius: 0,
      stroke: '#1E293B',
      strokeWidth: 1,
      children: [],
    };
    addElement(frame);
    setShowCustomModal(false);
    setCurrentView('editor');
    showToast('Created custom canvas', 'success');
  };

  const handleOpenTemplate = (template) => {
    loadProject(template);
    setCurrentView('editor');
    showToast(`Loaded ${template.name}`, 'success');
  };

  const handleOpenSaved = (proj) => {
    loadProject(proj);
    setCurrentView('editor');
    showToast(`Opened ${proj.name}`, 'success');
  };

  const filteredTemplates = EXTENDED_TEMPLATES.filter((t) => {
    const matchesCat = activeCategory === 'all' || (t.category && t.category.toLowerCase().includes(activeCategory.toLowerCase()));
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-screen h-screen flex flex-col overflow-y-auto bg-neutral-950 text-neutral-100 antialiased font-sans select-none">
      <header className="h-14 w-full glass-surface border-b border-neutral-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Figma<span className="text-indigo-400">Lite</span>
          </span>
        </div>

        <div className="w-96 relative hidden md:block">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, formats, graphics..."
            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/60 rounded-xl transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Size</span>
          </button>
          <button
            onClick={() => { createNewProject(); setCurrentView('editor'); }}
            className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-950/60 via-neutral-900 to-purple-950/40 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Visual Design Studio</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              What will you design today?
            </h1>
            <p className="text-sm text-neutral-400">
              Pick a canvas format, browse curated editable templates, or jump straight into the studio.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 relative z-10">
            {formatPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleStartPreset(preset)}
                className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-neutral-800/80 group flex flex-col justify-between transition-all hover:scale-105 active:scale-95"
              >
                <div className="p-2.5 rounded-xl bg-neutral-800/90 w-fit group-hover:bg-indigo-600/20 transition-colors">
                  {preset.icon}
                </div>
                <div className="mt-3">
                  <h2 className="font-semibold text-xs text-neutral-100 group-hover:text-indigo-300 transition-colors">
                    {preset.name}
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{preset.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {savedProjects.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-neutral-100">Recent Designs</h2>
              </div>
              <span className="text-xs text-neutral-500">{savedProjects.length} saved</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedProjects.slice(0, 4).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenSaved(proj)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-indigo-500/40 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <div className="h-32 bg-neutral-900 flex items-center justify-center p-3 relative overflow-hidden border-b border-neutral-800/80">
                    <div className="w-full h-full bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col items-center justify-center text-xs text-neutral-500 gap-1 group-hover:border-indigo-500/50 transition-colors">
                      <Layout className="w-6 h-6 text-indigo-400/60 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-[10px] font-mono">{proj.pages ? proj.pages[0]?.elements?.length || 0 : 0} objects</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-100 truncate group-hover:text-indigo-300 transition-colors">
                      {proj.name || 'Untitled Design'}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString() : 'Just now'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-100">Featured Templates</h2>
              <p className="text-xs text-neutral-400">100% editable multi-layer designs ready to customize</p>
            </div>

            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'social', label: 'Social Media' },
                { id: 'marketing', label: 'Marketing' },
                { id: 'business', label: 'Business' },
                { id: 'web', label: 'Web & Apps' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleOpenTemplate(tpl)}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-all hover:scale-[1.02] active:scale-98 flex flex-col justify-between"
              >
                <div className="h-36 bg-gradient-to-br from-indigo-950/80 to-slate-900 flex items-center justify-center p-3 relative border-b border-neutral-800">
                  <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-2 text-center text-white shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform">
                    <div className="text-xs font-bold truncate max-w-full px-2">{tpl.name}</div>
                    <div className="text-[10px] opacity-70 font-mono mt-1">{tpl.category}</div>
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/30 flex items-center justify-center transition-colors">
                      <span className="px-3 py-1 bg-white text-neutral-900 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        Use Template
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-xs text-neutral-100 truncate group-hover:text-indigo-300 transition-colors">
                    {tpl.name}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                    <span className="capitalize">{tpl.category}</span>
                    <span>{tpl.pages ? `${tpl.pages[0]?.elements?.length || 0} layers` : 'Editable'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showCustomModal && (
        <div
          onClick={() => setShowCustomModal(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-100"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm glass-modal rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-100 text-xs"
          >
            <h2 className="text-sm font-bold text-white">Create Custom Dimensions</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-medium">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-medium">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-neutral-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustom}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
              >
                Create Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
