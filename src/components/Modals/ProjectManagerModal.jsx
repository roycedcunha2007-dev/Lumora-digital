import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { getAllProjectsFromDB, deleteProjectFromDB } from '../../utils/idb';
import { DEMO_PROJECTS } from '../../constants/templates';
import { validateProjectJson } from '../../utils/import';
import {
  FolderOpen,
  Plus,
  Sparkles,
  Upload,
  Trash2,
  X,
  FileCode,
  Check,
  Clock,
  Layout
} from 'lucide-react';
export function ProjectManagerModal() {
  const {
    projectManagerOpen,
    setProjectManagerOpen,
    project,
    loadProject,
    createNewProject,
    showToast,
  } = useEditor();
  const [savedProjects, setSavedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('projects'); 
  const fileInputRef = useRef(null);
  const fetchProjects = async () => {
    try {
      const list = await getAllProjectsFromDB();
      setSavedProjects(list);
    } catch (e) {}
  };
  useEffect(() => {
    if (projectManagerOpen) {
      fetchProjects();
    }
  }, [projectManagerOpen]);
  if (!projectManagerOpen) return null;
  const handleSelectProject = (proj) => {
    loadProject(proj);
    setProjectManagerOpen(false);
  };
  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (id === project.id) {
      showToast('Cannot delete currently active project', 'error');
      return;
    }
    await deleteProjectFromDB(id);
    await fetchProjects();
    showToast('Project deleted from IndexedDB', 'info');
  };
  const handleImportJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validated = validateProjectJson(parsed);
        loadProject(validated);
        setProjectManagerOpen(false);
        showToast(`Imported ${validated.name}`, 'success');
      } catch (err) {
        showToast('Invalid project JSON: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };
  return (
    <div
      onClick={() => setProjectManagerOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">FigmaLite Projects</h3>
              <p className="text-[11px] text-neutral-400">All data is stored purely in your browser IndexedDB</p>
            </div>
          </div>
          <button
            onClick={() => setProjectManagerOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80 bg-neutral-950/40">
          <div className="flex bg-neutral-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'projects' ? 'bg-neutral-700 text-white font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Saved Projects ({savedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'templates' ? 'bg-neutral-700 text-white font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Demo Templates ({DEMO_PROJECTS.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json,.figmalite"
              className="hidden"
            />
            <button
              onClick={() => {
                createNewProject();
                setProjectManagerOpen(false);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'projects' ? (
            savedProjects.length === 0 ? (
              <div className="p-10 text-center text-neutral-500">
                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30 text-neutral-400" />
                <p className="font-medium text-neutral-400">No saved projects yet</p>
                <p className="text-[11px] text-neutral-600 mt-1">Create a project or load a template</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedProjects.map((proj) => {
                  const isActive = proj.id === project.id;
                  const totalElements = (proj.pages || []).reduce(
                    (sum, p) => sum + (p.elements || []).length,
                    0
                  );
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative group ${
                        isActive
                          ? 'bg-indigo-600/15 border-indigo-500/80 shadow-md'
                          : 'bg-neutral-800/60 border-neutral-700/60 hover:bg-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Layout className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                          <h4 className="font-semibold text-xs text-neutral-100 truncate">{proj.name}</h4>
                        </div>
                        {isActive && (
                          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span>{(proj.pages || []).length} Page(s) • {totalElements} Items</span>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(proj.updatedAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      {!isActive && (
                        <button
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="absolute top-3 right-3 p-1 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {DEMO_PROJECTS.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    loadProject(tpl);
                    setProjectManagerOpen(false);
                  }}
                  className="p-4 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-indigo-500/60 rounded-xl cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-semibold text-xs text-neutral-100 group-hover:text-indigo-300 transition-colors">
                      {tpl.name}
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                    <span>{tpl.pages.length} Pages • Ready to Prototype</span>
                    <span className="text-indigo-400 font-medium">Load Template →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}