import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { FileText, ChevronUp, ChevronDown, Sparkles, Check } from 'lucide-react';

export function PresenterNotesDrawer() {
  const {
    activePage,
    updateProject,
    speakerNotesOpen,
    setSpeakerNotesOpen,
    showToast,
  } = useEditor();

  const [notesInput, setNotesInput] = useState(activePage?.notes || '');
  const [isSaved, setIsSaved] = useState(true);

  React.useEffect(() => {
    setNotesInput(activePage?.notes || '');
    setIsSaved(true);
  }, [activePage?.id, activePage?.notes]);

  if (!speakerNotesOpen) {
    return (
      <button
        onClick={() => setSpeakerNotesOpen(true)}
        className="fixed bottom-10 right-6 z-20 px-3 py-1.5 glass-panel rounded-full text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 shadow-xl transition-all hover:scale-105"
      >
        <FileText className="w-3.5 h-3.5 text-indigo-400" />
        <span>Speaker Notes</span>
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    );
  }

  const handleNotesChange = (val) => {
    setNotesInput(val);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    updateProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.id === activePage.id ? { ...p, notes: notesInput } : p)),
    }), true);
    setIsSaved(true);
    showToast('Speaker notes saved', 'success');
  };

  const handleGenerateNotes = () => {
    const frame = activePage?.elements?.[0];
    const headings = (frame?.children || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('. ');

    const autoNotes = `Speaker Notes for ${activePage.name}:\n• Introduce the core theme: "${headings.substring(0, 80)}..."\n• Highlight main metrics and tactical outcomes.\n• Engage the audience with real-world case context.\n• Transition seamlessly to the next slide.`;

    handleNotesChange(autoNotes);
    showToast('Generated speaker notes!', 'success');
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20 p-2 animate-in slide-in-from-bottom-2 duration-150 select-none">
      <div className="glass-panel rounded-3xl p-4 border border-indigo-500/30 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs text-white">Speaker Notes — {activePage?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateNotes}
              className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Notes</span>
            </button>
            <button
              onClick={handleSaveNotes}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                isSaved
                  ? 'bg-neutral-800 text-neutral-400'
                  : 'bg-indigo-600 text-white shadow-md'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{isSaved ? 'Saved' : 'Save Notes'}</span>
            </button>
            <button
              onClick={() => setSpeakerNotesOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          value={notesInput}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Type private speaker cues, presentation talking points, or prompt notes here..."
          rows={3}
          className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-indigo-500 resize-none font-sans"
        />
      </div>
    </div>
  );
}
