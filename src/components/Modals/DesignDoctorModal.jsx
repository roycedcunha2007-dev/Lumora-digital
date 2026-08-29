import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { runDesignAnalysis, generateDesignImprovements } from '../../utils/designAnalysis';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  X,
  ArrowRight,
  Wand2,
  Check
} from 'lucide-react';
export function DesignDoctorModal() {
  const {
    designDoctorOpen,
    setDesignDoctorOpen,
    elements,
    activePage,
    setSelectedIds,
    updateElementProperties,
    updateActivePageElements,
    showToast,
  } = useEditor();
  const [activeCategory, setActiveCategory] = useState('all');
  const [appliedFixes, setAppliedFixes] = useState(new Set());
  if (!designDoctorOpen) return null;
  const analysis = runDesignAnalysis(elements, activePage);
  const improvements = generateDesignImprovements(elements);
  const filteredIssues = analysis.issues.filter(
    (iss) => activeCategory === 'all' || iss.category === activeCategory
  );
  const handleSelectIssueObject = (elementId) => {
    if (elementId) {
      setSelectedIds([elementId]);
      showToast('Selected object on canvas', 'info');
    }
  };
  const handleFixIssue = (issue) => {
    if (!issue.elementId) return;
    if (issue.fixType === 'normalize_font_size' && issue.targetSize) {
      updateElementProperties(issue.elementId, { fontSize: issue.targetSize }, true);
    } else if (issue.fixType === 'high_contrast_text') {
      updateElementProperties(issue.elementId, { fill: '#FFFFFF' }, true);
    } else if (issue.fixType === 'enlarge_touch_target') {
      updateElementProperties(issue.elementId, { width: 140, height: 48 }, true);
    } else if (issue.fixType === 'add_default_constraints') {
      updateElementProperties(issue.elementId, { constraints: { horizontal: 'left', vertical: 'top' } }, true);
    }
    setAppliedFixes((prev) => new Set([...prev, issue.id]));
    showToast(`Fixed: ${issue.message.slice(0, 30)}...`, 'success');
  };
  const handleApplyImprovement = (imp) => {
    const updated = elements.map((el) => {
      let mod = imp.apply(el);
      if (Array.isArray(mod.children)) {
        mod.children = mod.children.map(imp.apply);
      }
      return mod;
    });
    updateActivePageElements(updated, true);
    showToast(`Applied improvement: ${imp.title}`, 'success');
  };
  return (
    <div
      onClick={() => setDesignDoctorOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Design Doctor & QA Scanner</h3>
              <p className="text-[11px] text-neutral-400">Deterministic layout, accessibility & typography inspection</p>
            </div>
          </div>
          <button
            onClick={() => setDesignDoctorOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-indigo-400">{analysis.score}</span>
              <span className="text-neutral-500 font-mono text-xs">/ 100</span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px] font-mono">
              {Object.keys(analysis.categories).map((cat) => (
                <div key={cat} className="text-center">
                  <div className="text-neutral-400 capitalize">{cat}</div>
                  <div className={`font-bold ${analysis.categories[cat].score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {analysis.categories[cat].score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex border-b border-neutral-800 px-6 pt-1 gap-1 text-xs bg-neutral-900">
          {['all', 'layout', 'typography', 'color', 'accessibility', 'responsive'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-2 font-medium capitalize border-b-2 transition-colors ${
                activeCategory === c
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="p-6 max-h-80 overflow-y-auto space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="font-semibold text-neutral-200">No issues detected in this category</p>
              <p className="text-[11px] text-neutral-500">Your design adheres to standard design tokens and constraints</p>
            </div>
          ) : (
            filteredIssues.map((iss) => {
              const isFixed = appliedFixes.has(iss.id);
              return (
                <div
                  key={iss.id}
                  onClick={() => handleSelectIssueObject(iss.elementId)}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                    isFixed
                      ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                      : 'bg-neutral-800/50 border-neutral-700/60 hover:bg-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {iss.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-xs text-neutral-200">{iss.message}</span>
                        <span className="px-1.5 py-0.2 bg-neutral-700/60 text-neutral-300 rounded text-[9px] uppercase font-mono">
                          {iss.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500">Click to locate on canvas</div>
                    </div>
                  </div>
                  {iss.fixable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFixIssue(iss);
                      }}
                      disabled={isFixed}
                      className={`px-2.5 py-1 rounded text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                        isFixed
                          ? 'bg-emerald-800 text-emerald-200'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isFixed ? <Check className="w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                      <span>{isFixed ? 'Fixed' : 'Auto Fix'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Design Improvement Engine</span>
            </div>
            <div className="space-y-1.5">
              {improvements.map((imp) => (
                <div
                  key={imp.id}
                  className="p-2.5 bg-neutral-800/40 border border-neutral-700/60 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-neutral-200">{imp.title}</div>
                    <div className="text-[10px] text-neutral-400">{imp.description}</div>
                  </div>
                  <button
                    onClick={() => handleApplyImprovement(imp)}
                    className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md font-medium text-[11px] shrink-0 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}