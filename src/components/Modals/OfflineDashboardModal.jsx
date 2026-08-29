import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { getAllProjectsFromDB } from '../../utils/idb';
import { ShieldCheck, HardDrive, Plus, Folder, Sparkles, X, Check } from 'lucide-react';
export function OfflineDashboardModal() {
  const {
    offlineDashboardOpen,
    setOfflineDashboardOpen,
    project,
    loadProject,
    createNewProject,
    showToast,
  } = useEditor();
  const [recentProjects, setRecentProjects] = useState([]);
  useEffect(() => {
    if (offlineDashboardOpen) {
      getAllProjectsFromDB().then((list) => setRecentProjects(list));
    }
  }, [offlineDashboardOpen]);
  if (!offlineDashboardOpen) return null;
  return (
    <div
      onClick={() => setOfflineDashboardOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Offline-First Studio Workspace</h3>
              <p className="text-[11px] text-neutral-400">All projects, assets & prototypes are stored locally on this device</p>
            </div>
          </div>
          <button
            onClick={() => setOfflineDashboardOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-semibold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100% Local-First Engine Active</span>
              </span>
              <span className="text-xs font-mono">Zero Cloud Leak</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Your files never leave your browser sandbox. Project data is saved instantly to high-speed IndexedDB and LocalStorage without any external tracking.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                Recent Local Projects ({recentProjects.length})
              </span>
              <button
                onClick={() => {
                  createNewProject();
                  setOfflineDashboardOpen(false);
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New Blank Project
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto">
              {recentProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    loadProject(proj);
                    setOfflineDashboardOpen(false);
                    showToast(`Opened project: ${proj.name}`, 'success');
                  }}
                  className={`p-3 bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-700/60 hover:border-indigo-500/60 rounded-xl cursor-pointer transition-all space-y-1 ${
                    proj.id === project.id ? 'border-indigo-500/80 bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-neutral-100 truncate">{proj.name}</span>
                    <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Updated: {new Date(proj.updatedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}