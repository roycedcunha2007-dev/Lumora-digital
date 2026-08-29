import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { saveSnapshotToDB, getSnapshotsFromDB, deleteSnapshotFromDB } from '../../utils/idb';
import { History, Plus, RotateCcw, Trash2, X, Clock, Check, Sparkles } from 'lucide-react';
export function TimeMachineModal() {
  const {
    timeMachineOpen,
    setTimeMachineOpen,
    project,
    loadProject,
    showToast,
  } = useEditor();
  const [snapshots, setSnapshots] = useState([]);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const fetchSnapshots = async () => {
    try {
      const list = await getSnapshotsFromDB(project.id);
      setSnapshots(list);
      if (list.length > 0 && !selectedSnapshot) {
        setSelectedSnapshot(list[0]);
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (timeMachineOpen) {
      fetchSnapshots();
    }
  }, [timeMachineOpen, project.id]);
  if (!timeMachineOpen) return null;
  const handleCreateSnapshot = async () => {
    if (!newSnapshotName.trim()) return;
    const snap = await saveSnapshotToDB(project.id, newSnapshotName.trim(), project);
    setNewSnapshotName('');
    await fetchSnapshots();
    showToast(`Created snapshot: ${snap.name}`, 'success');
  };
  const handleRestoreSnapshot = (snap) => {
    if (snap && snap.data) {
      loadProject(snap.data);
      setTimeMachineOpen(false);
      showToast(`Restored snapshot: ${snap.name}`, 'success');
    }
  };
  const handleDeleteSnapshot = async (id, e) => {
    e.stopPropagation();
    await deleteSnapshotFromDB(id);
    await fetchSnapshots();
    showToast('Deleted snapshot', 'info');
  };
  return (
    <div
      onClick={() => setTimeMachineOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Design Time Machine</h3>
              <p className="text-[11px] text-neutral-400">Save named version snapshots and jump back in time</p>
            </div>
          </div>
          <button
            onClick={() => setTimeMachineOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/40 flex items-center gap-2">
          <input
            type="text"
            value={newSnapshotName}
            onChange={(e) => setNewSnapshotName(e.target.value)}
            placeholder="Name your version (e.g. Homepage Final, Client Review)..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateSnapshot();
            }}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleCreateSnapshot}
            disabled={!newSnapshotName.trim()}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Snapshot</span>
          </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-neutral-800 min-h-[340px]">
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider mb-2">
              Timeline History ({snapshots.length})
            </div>
            {snapshots.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 space-y-1">
                <Clock className="w-8 h-8 mx-auto opacity-30 text-neutral-400 mb-1" />
                <p className="font-medium text-neutral-300">No version snapshots saved</p>
                <p className="text-[11px] text-neutral-500">Save a milestone to safely preserve design states</p>
              </div>
            ) : (
              snapshots.map((snap) => (
                <div
                  key={snap.id}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedSnapshot && selectedSnapshot.id === snap.id
                      ? 'bg-indigo-950/30 border-indigo-500/80 text-indigo-200'
                      : 'bg-neutral-800/40 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-neutral-100 truncate">{snap.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {(snap.data.pages || []).length} Page(s)</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                    className="p-1 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-6 flex flex-col justify-between space-y-4">
            {selectedSnapshot ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-neutral-100">{selectedSnapshot.name}</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(selectedSnapshot.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5 text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span>Project Name:</span>
                      <strong className="text-neutral-200">{selectedSnapshot.data.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <strong className="text-neutral-200">{(selectedSnapshot.data.pages || []).length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Elements:</span>
                      <strong className="text-neutral-200">
                        {(selectedSnapshot.data.pages || []).reduce((sum, p) => sum + (p.elements || []).length, 0)}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end pt-3 border-t border-neutral-800">
                  <button
                    onClick={() => handleRestoreSnapshot(selectedSnapshot)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore This Version</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-500 my-auto">Select a snapshot to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}