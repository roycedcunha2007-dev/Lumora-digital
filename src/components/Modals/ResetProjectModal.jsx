import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { clearAllFigmaLiteData } from '../../utils/idb';
import { DEMO_PROJECTS } from '../../constants/templates';
import {
  AlertTriangle,
  X,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export function ResetProjectModal() {
  const {
    resetModalOpen,
    setResetModalOpen,
    loadProject,
    setCurrentView,
    setTheme,
    showToast,
    setPan,
    setZoom,
  } = useEditor();

  const [step, setStep] = useState(1);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (resetModalOpen) {
      setStep(1);
      setConfirmationInput('');
      setIsResetting(false);
    }
  }, [resetModalOpen]);

  if (!resetModalOpen) return null;

  const handleClose = () => {
    setResetModalOpen(false);
    setStep(1);
    setConfirmationInput('');
  };

  const handleExecuteReset = async () => {
    if (confirmationInput.trim() !== 'RESET') return;

    setIsResetting(true);
    showToast('Resetting application data...', 'info');

    try {
      await clearAllFigmaLiteData();

      const freshDefault = JSON.parse(JSON.stringify(DEMO_PROJECTS[0] || {
        id: `proj_${Date.now()}`,
        name: 'Untitled Design',
        pages: [{ id: 'page_1', name: 'Page 1', background: '#090D16', elements: [] }],
      }));

      loadProject(freshDefault);
      setTheme('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setPan({ x: 80, y: 60 });
      setZoom(0.8);
      setCurrentView('home');
      setResetModalOpen(false);

      showToast('FigmaLite has been reset successfully.', 'success');
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const dataCategories = [
    'Saved designs',
    'Projects',
    'Presentation data',
    'Uploaded files',
    'Recent projects',
    'Custom templates',
    'Custom styles',
    'Editor preferences',
    'Local application data',
  ];

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass-modal rounded-3xl p-6 space-y-6 shadow-2xl border border-rose-500/30 text-xs text-neutral-200 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">
                {step === 1 ? 'Reset FigmaLite' : 'Final Confirmation'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {step === 1
                  ? 'Review the data that will be removed'
                  : 'Permanently remove all local data'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 space-y-2">
              <p className="font-bold text-xs text-neutral-100">
                Are you sure you want to reset FigmaLite?
              </p>
              <p className="text-[11px] text-neutral-400">
                The following data will be cleared:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {dataCategories.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-neutral-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs leading-relaxed">
              Your FigmaLite application will return to its initial starting state. This action cannot be undone.
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2 text-center">
              <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="font-bold text-sm text-white">This will permanently clear your FigmaLite data</h3>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                You will lose all locally saved designs, projects, presentations and uploaded files. This cannot be undone.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                Type <span className="text-rose-400 font-mono font-bold">RESET</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="Type RESET"
                className="w-full bg-neutral-900 border border-neutral-700/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-rose-500 font-mono tracking-widest uppercase transition-colors shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>

              <button
                onClick={handleExecuteReset}
                disabled={confirmationInput.trim() !== 'RESET' || isResetting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isResetting ? 'Clearing...' : 'Reset Everything'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
