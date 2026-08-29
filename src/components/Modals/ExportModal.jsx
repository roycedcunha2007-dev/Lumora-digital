import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { exportProjectToJson, exportToSvg, exportToPng } from '../../utils/export';
import { Download, X, FileCode, Image, FileJson, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
export function ExportModal() {
  const {
    exportModalOpen,
    setExportModalOpen,
    project,
    activePage,
    elements,
    selectedElements,
    showToast,
  } = useEditor();
  const [format, setFormat] = useState('png'); 
  const [scale, setScale] = useState(2); 
  const [scope, setScope] = useState(() => (selectedElements.length > 0 ? 'selection' : 'page')); 
  const [transparentBg, setTransparentBg] = useState(false);
  const [customName, setCustomName] = useState(() => {
    return (project.name || 'FigmaLite_Design').replace(/\s+/g, '_');
  });
  if (!exportModalOpen) return null;
  const handleExport = async () => {
    try {
      showToast('Exporting...', 'info');
      if (format === 'json') {
        exportProjectToJson(project);
      } else {
        const itemsToExport =
          scope === 'selection' && selectedElements.length > 0 ? selectedElements : elements;
        if (format === 'svg') {
          exportToSvg(itemsToExport, {
            filename: `${customName}.svg`,
            transparent: transparentBg,
            background: activePage.background || '#09090B',
          });
        } else if (format === 'png') {
          await exportToPng(itemsToExport, {
            filename: `${customName}@${scale}x.png`,
            scale,
            transparent: transparentBg,
            background: activePage.background || '#09090B',
          });
        }
      }
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#A855F7', '#38BDF8'],
        });
      } catch (e) {}
      showToast(`Exported ${customName}.${format.toUpperCase()} successfully`, 'success');
      setExportModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Export failed: ' + err.message, 'error');
    }
  };
  return (
    <div
      onClick={() => setExportModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Export Design</h3>
              <p className="text-[11px] text-neutral-400">Save your work as high-res PNG, SVG, or JSON</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  format === 'png'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <Image className="w-5 h-5" />
                <span>PNG Raster</span>
              </button>
              <button
                onClick={() => setFormat('svg')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  format === 'svg'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <FileCode className="w-5 h-5" />
                <span>SVG Vector</span>
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  format === 'json'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <FileJson className="w-5 h-5" />
                <span>JSON Project</span>
              </button>
            </div>
          </div>
          {format !== 'json' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Export Scope
              </label>
              <div className="flex bg-neutral-800 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setScope('page')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${scope === 'page' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400'}`}
                >
                  Entire Page ({elements.length} elements)
                </button>
                <button
                  onClick={() => setScope('selection')}
                  disabled={selectedElements.length === 0}
                  className={`flex-1 py-1.5 rounded-md transition-colors disabled:opacity-30 ${scope === 'selection' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400'}`}
                >
                  Selected ({selectedElements.length})
                </button>
              </div>
            </div>
          )}
          {format === 'png' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Resolution Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`py-2 rounded-lg border text-xs font-semibold ${
                      scale === s
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750'
                    }`}
                  >
                    {s}x {s === 1 ? '(100%)' : s === 2 ? '(Retina)' : '(Ultra HD)'}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              File Name
            </label>
            <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 gap-1">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-transparent text-neutral-100 text-xs outline-none"
              />
              <span className="text-neutral-500 font-mono text-[11px]">.{format}</span>
            </div>
          </div>
          {format !== 'json' && (
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-neutral-800 border-neutral-700"
              />
              <span className="text-neutral-300 text-xs font-medium">Transparent Background</span>
            </label>
          )}
        </div>
        <div className="px-5 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setExportModalOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}