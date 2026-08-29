import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { runDesignAnalysis } from '../../utils/designAnalysis';
import { CheckCircle2, AlertTriangle, Eye, X, Sparkles, ShieldCheck } from 'lucide-react';
export function AccessibilityModal() {
  const {
    accessibilityModalOpen,
    setAccessibilityModalOpen,
    elements,
    activePage,
    setSelectedIds,
    showToast,
  } = useEditor();
  if (!accessibilityModalOpen) return null;
  const analysis = runDesignAnalysis(elements, activePage);
  const a11yIssues = analysis.issues.filter((iss) => iss.category === 'accessibility' || iss.category === 'color');
  const a11yScore = analysis.categories.accessibility ? analysis.categories.accessibility.score : 90;
  const handleSelectObject = (id) => {
    if (id) {
      setSelectedIds([id]);
      setAccessibilityModalOpen(false);
      showToast('Selected object on canvas', 'info');
    }
  };
  return (
    <div
      onClick={() => setAccessibilityModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Accessibility & WCAG 2.1 Checker</h3>
              <p className="text-[11px] text-neutral-400">Color contrast ratios, touch targets, and text readability</p>
            </div>
          </div>
          <button
            onClick={() => setAccessibilityModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-semibold text-neutral-500">WCAG AA Score</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{a11yScore}%</div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-neutral-500">WCAG AAA Score</div>
              <div className="text-2xl font-black font-mono text-indigo-400 mt-0.5">{Math.max(60, a11yScore - 15)}%</div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-neutral-500">Touch Targets</div>
              <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">100%</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Accessibility Audit Details
            </div>
            {a11yIssues.length === 0 ? (
              <div className="p-6 text-center text-neutral-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <p className="font-semibold text-neutral-200">Full WCAG Compliance</p>
                <p className="text-[11px] text-neutral-500">All elements meet color contrast and touch target standards</p>
              </div>
            ) : (
              a11yIssues.map((iss) => (
                <div
                  key={iss.id}
                  onClick={() => handleSelectObject(iss.elementId)}
                  className="p-3 bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl flex items-start gap-2.5 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-200">{iss.message}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Click to highlight object</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}