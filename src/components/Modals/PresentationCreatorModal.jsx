import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  generatePresentationFromTopic,
  PRESENTATION_STYLES,
} from '../../utils/presentationGenerator';
import {
  Presentation,
  Sparkles,
  Plus,
  Layout,
  X,
  ArrowRight,
  Layers,
  Check
} from 'lucide-react';

export function PresentationCreatorModal() {
  const {
    presentationModalOpen,
    setPresentationModalOpen,
    loadProject,
    createNewProject,
    setCurrentView,
    setTemplateLibraryOpen,
    showToast,
    setZoom,
    setPan,
  } = useEditor();

  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [audience, setAudience] = useState('Investors & Executives');
  const [styleKey, setStyleKey] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!presentationModalOpen) return null;

  const handleGenerate = () => {
    const finalTopic = topic.trim() || 'Executive Strategy & Innovation';
    setIsGenerating(true);
    showToast('Generating smart presentation deck...', 'info');

    setTimeout(() => {
      const generatedProject = generatePresentationFromTopic({
        topic: finalTopic,
        slideCount: Number(slideCount),
        audience: audience,
        styleKey: styleKey,
      });

      loadProject(generatedProject);
      setIsGenerating(false);
      setPresentationModalOpen(false);
      setCurrentView('editor');
      setZoom(0.5);
      setPan({ x: 80, y: 60 });
      showToast(`Created ${slideCount}-slide presentation!`, 'success');
    }, 400);
  };

  const handleCreateBlank = () => {
    createNewProject();
    const blankPres = generatePresentationFromTopic({
      topic: 'Untitled Presentation',
      slideCount: 1,
      audience: 'General',
      styleKey: styleKey,
    });
    loadProject(blankPres);
    setPresentationModalOpen(false);
    setCurrentView('editor');
    setZoom(0.5);
    setPan({ x: 80, y: 60 });
    showToast('Created blank presentation canvas', 'success');
  };

  const audiences = [
    'Investors & Executives',
    'Students & Academic',
    'Clients & Customers',
    'Engineering & Tech Team',
    'General Public',
  ];

  return (
    <div
      onClick={() => setPresentationModalOpen(false)}
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-modal rounded-3xl p-6 space-y-6 shadow-2xl border border-indigo-500/30 text-xs text-neutral-200 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Create Presentation</h2>
              <p className="text-[11px] text-neutral-400">
                Generate a ready-to-present slide deck in seconds
              </p>
            </div>
          </div>
          <button
            onClick={() => setPresentationModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-200">
              What is your presentation about?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Artificial Intelligence in Healthcare, SaaS Seed Pitch Deck..."
                className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-200">Number of Slides</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 8, 10, 15].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSlideCount(num)}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                    slideCount === num
                      ? 'bg-indigo-600 text-white shadow-lg glow-indigo scale-105'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {num} Slides
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-200">Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-indigo-500"
              >
                {audiences.map((aud) => (
                  <option key={aud} value={aud}>{aud}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-200">Visual Theme</label>
              <select
                value={styleKey}
                onChange={(e) => setStyleKey(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-indigo-500"
              >
                {Object.values(PRESENTATION_STYLES).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCreateBlank}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Blank 16:9</span>
            </button>
            <button
              onClick={() => {
                setPresentationModalOpen(false);
                setTemplateLibraryOpen(true);
              }}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span>Templates</span>
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Building Deck...' : 'Generate Presentation'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
