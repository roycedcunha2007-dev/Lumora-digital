import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { exportProjectToJson, exportToSvg, exportToPng } from '../../utils/export';
import { exportPresentationToPptx } from '../../utils/pptxExport';
import { Download, X, FileCode, Image, FileJson, Presentation, Check } from 'lucide-react';
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
      if (format === 'pptx') {
        exportPresentationToPptx(project);
      } else if (format === 'json') {
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
      showToast('Export failed: ' + err.message, 'error');
    }
  };

  return (
    <div
      onClick={() => setExportModalOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-modal rounded-3xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100 border border-neutral-800"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Export Design & Presentation</h3>
              <p className="text-[11px] text-neutral-400">Save as PPTX presentation, PNG, SVG, or JSON</p>
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
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setFormat('pptx')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'pptx'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <Presentation className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px]">PowerPoint</span>
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'png'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="text-[10px]">PNG Image</span>
              </button>
              <button
                onClick={() => setFormat('svg')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'svg'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span className="text-[10px]">SVG Vector</span>
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  format === 'json'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold shadow'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span className="text-[10px]">JSON Project</span>
              </button>
            </div>
          </div>

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
                    className={`py-2 rounded-xl border text-xs font-semibold ${
                      scale === s
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {s}x {s === 1 ? '(Standard)' : s === 2 ? '(Retina HD)' : '(4K Ultra)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              File Name
            </label>
            <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 gap-1">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-transparent text-neutral-100 text-xs outline-none font-medium"
              />
              <span className="text-neutral-500 font-mono text-[11px]">.{format}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setExportModalOpen(false)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}