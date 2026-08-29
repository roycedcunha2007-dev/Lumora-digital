import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { SHORTCUT_CATEGORIES } from '../../constants/shortcuts';
import { HelpCircle, X, Keyboard } from 'lucide-react';
export function ShortcutsModal() {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useEditor();
  if (!shortcutsModalOpen) return null;
  return (
    <div
      onClick={() => setShortcutsModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-neutral-400">Master FigmaLite productivity like a pro</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 max-h-[480px] overflow-y-auto grid grid-cols-2 gap-6">
          {SHORTCUT_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-semibold text-xs text-indigo-400 uppercase tracking-wider border-b border-neutral-800 pb-1">
                {cat.category}
              </h4>
              <div className="space-y-1.5">
                {cat.shortcuts.map((sc, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between py-1 text-xs">
                    <span className="text-neutral-300">{sc.description}</span>
                    <kbd className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded font-mono text-[11px] font-semibold">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}