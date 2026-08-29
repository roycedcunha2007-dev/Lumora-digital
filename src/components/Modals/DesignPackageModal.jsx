import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { extractDesignSystem, exportTokensToCss } from '../../utils/designTokens';
import { exportProjectToJson, exportToSvg } from '../../utils/export';
import { Package, Download, Check, X, FileCode, Sparkles } from 'lucide-react';
export function DesignPackageModal() {
  const {
    designPackageOpen,
    setDesignPackageOpen,
    project,
    elements,
    showToast,
  } = useEditor();
  if (!designPackageOpen) return null;
  const handleDownloadFullPackage = () => {
    const tokens = extractDesignSystem(elements);
    const cssVars = exportTokensToCss(tokens);
    const packageData = {
      project,
      designTokens: tokens,
      cssTokens: cssVars,
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        tool: 'FigmaLite 2.0 Studio',
        license: 'Local-First Production Creative Bundle',
      },
    };
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_design_package.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDesignPackageOpen(false);
    showToast('Downloaded Full FigmaLite Design Package', 'success');
  };
  return (
    <div
      onClick={() => setDesignPackageOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Export Design Package</h3>
              <p className="text-[11px] text-neutral-400">Export structured design bundle with tokens, CSS & components</p>
            </div>
          </div>
          <button
            onClick={() => setDesignPackageOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="font-semibold text-neutral-200">Package Contents:</div>
            <div className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
              <div>✓ Complete Multi-Page Document Schema</div>
              <div>✓ Master Component Definitions & Variants</div>
              <div>✓ Interactive Prototype Cable Definitions</div>
              <div>✓ Extracted Design Tokens (Colors, Typography, Spacing)</div>
              <div>✓ Production CSS Custom Variables Sheet</div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setDesignPackageOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadFullPackage}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Design Package</span>
          </button>
        </div>
      </div>
    </div>
  );
}