import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { clearRecoveryCheckpoint } from '../../utils/idb';
import { RotateCcw, AlertTriangle, Trash2, X } from 'lucide-react';
export function CrashRecoveryModal() {
  const {
    recoveryCheckpoint,
    setRecoveryCheckpoint,
    loadProject,
    showToast,
  } = useEditor();
  if (!recoveryCheckpoint) return null;
  const handleRestore = () => {
    if (recoveryCheckpoint.data) {
      loadProject(recoveryCheckpoint.data);
      clearRecoveryCheckpoint();
      setRecoveryCheckpoint(null);
      showToast('Restored unsaved recovery state', 'success');
    }
  };
  const handleDiscard = async () => {
    await clearRecoveryCheckpoint();
    setRecoveryCheckpoint(null);
    showToast('Discarded recovery checkpoint', 'info');
  };
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom duration-200">
      <div className="w-80 bg-neutral-900 border border-amber-500/80 rounded-2xl shadow-2xl p-4 text-xs text-neutral-200 select-none space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-neutral-100">Recover Design Session</h4>
              <p className="text-[10px] text-neutral-400">Found auto-saved local checkpoint</p>
            </div>
          </div>
          <button
            onClick={handleDiscard}
            className="p-1 text-neutral-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-neutral-300">
          Saved at {new Date(recoveryCheckpoint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Would you like to restore this session?
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleDiscard}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleRestore}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore</span>
          </button>
        </div>
      </div>
    </div>
  );
}