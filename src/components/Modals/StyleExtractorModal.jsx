import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { extractDesignSystem, exportTokensToCss } from '../../utils/designTokens';
import { Palette, Copy, Check, Sparkles, X, Download, FileCode } from 'lucide-react';
export function StyleExtractorModal() {
  const {
    styleExtractorOpen,
    setStyleExtractorOpen,
    elements,
    updateProject,
    showToast,
  } = useEditor();
  const [copied, setCopied] = useState(false);
  if (!styleExtractorOpen) return null;
  const extracted = extractDesignSystem(elements);
  const cssVars = exportTokensToCss(extracted);
  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssVars);
    setCopied(true);
    showToast('Copied Design Tokens CSS variables', 'success');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSaveToProjectStyles = () => {
    updateProject((prev) => ({
      ...prev,
      styles: {
        ...(prev.styles || {}),
        tokens: extracted,
      },
    }), true);
    setStyleExtractorOpen(false);
    showToast('Saved Design System to Project Assets', 'success');
  };
  return (
    <div
      onClick={() => setStyleExtractorOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Design System Style Extractor</h3>
              <p className="text-[11px] text-neutral-400">Auto-detect reusable colors, typography scale, spacing, and radii</p>
            </div>
          </div>
          <button
            onClick={() => setStyleExtractorOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto space-y-5">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Detected Colors ({extracted.colors.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {extracted.colors.map((c) => (
                <div
                  key={c.id}
                  className="p-2 bg-neutral-800/50 border border-neutral-700/60 rounded-xl flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                    style={{ backgroundColor: c.value }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-neutral-200 truncate">{c.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Detected Typography Scale ({extracted.typography.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {extracted.typography.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 bg-neutral-800/50 border border-neutral-700/60 rounded-xl space-y-0.5"
                >
                  <div className="font-medium text-neutral-200">{t.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {t.fontSize}px • {t.fontFamily}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Detected Spacing & Radius Tokens
            </div>
            <div className="flex flex-wrap gap-1.5">
              {extracted.spacing.map((s) => (
                <span
                  key={s}
                  className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md font-mono text-[11px] text-neutral-300"
                >
                  {s}px
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleCopyCss}
            className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied CSS' : 'Copy CSS Variables'}</span>
          </button>
          <button
            onClick={handleSaveToProjectStyles}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save to Project Tokens</span>
          </button>
        </div>
      </div>
    </div>
  );
}