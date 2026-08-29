import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Tooltip } from '../Common/Tooltip';
import { runDesignAnalysis } from '../../utils/designAnalysis';
import {
  Layers,
  Play,
  Download,
  ChevronDown,
  Sun,
  Moon,
  Command,
  Plus,
  FolderOpen,
  History,
  Package,
  Check,
  Activity,
  Layout,
  Scaling,
  Smartphone,
  Palette,
  Trophy,
  ShieldCheck,
  Gauge,
  Monitor,
  Grid,
  Home
} from 'lucide-react';

export function TopBar() {
  const {
    project,
    elements,
    activePage,
    updateProject,
    canUndo,
    canRedo,
    undo,
    redo,
    zoom,
    setZoom,
    zoomTo100,
    zoomToFit,
    zoomToSelection,
    theme,
    toggleTheme,
    autosaveStatus,
    setCommandPaletteOpen,
    setExportModalOpen,
    setPresentModeOpen,
    setDesignDoctorOpen,
    setComponentLabOpen,
    setTimeMachineOpen,
    setStyleExtractorOpen,
    setMagicResizeOpen,
    setVariationsOpen,
    setTemplateLibraryOpen,
    setMissionsOpen,
    setAccessibilityModalOpen,
    setPerformanceModalOpen,
    setDeviceMockupOpen,
    setDesignPackageOpen,
    setOfflineDashboardOpen,
    blueprintMode,
    setBlueprintMode,
    responsiveSimulatorActive,
    setResponsiveSimulatorActive,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    createNewProject,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    ungroupSelected,
    showToast,
    setCurrentView,
  } = useEditor();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name || 'Untitled Design');
  const [activeMenu, setActiveMenu] = useState(null);
  const [zoomDropdownOpen, setZoomDropdownOpen] = useState(false);

  const menuRef = useRef(null);
  const titleInputRef = useRef(null);

  const analysis = runDesignAnalysis(elements, activePage);

  useEffect(() => {
    setTitleInput(project.name || 'Untitled Design');
  }, [project.name]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
        setZoomDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== project.name) {
      updateProject((prev) => ({ ...prev, name: titleInput.trim() }), true);
      showToast('Renamed design', 'success');
    } else {
      setTitleInput(project.name || 'Untitled Design');
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleInput(project.name || 'Untitled Design');
    }
  };

  return (
    <header
      ref={menuRef}
      className="h-12 w-full glass-surface border-b border-neutral-800/80 px-3 flex items-center justify-between z-30 select-none shrink-0 text-neutral-200"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('home')}
          className="p-1.5 hover:bg-neutral-800/80 rounded-xl text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
          title="Home Dashboard"
        >
          <Home className="w-4 h-4 text-indigo-400" />
        </button>

        <div className="h-3.5 w-px bg-neutral-800/80" />

        <div className="flex items-center gap-0.5 relative text-xs">
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                activeMenu === 'file'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute left-0 top-full mt-1.5 w-56 glass-modal rounded-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs shadow-2xl">
                <button
                  onClick={() => { createNewProject(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-neutral-400" /> New Design
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Alt+N</span>
                </button>
                <button
                  onClick={() => { setTemplateLibraryOpen(true); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-indigo-400" /> Templates...
                  </span>
                </button>
                <button
                  onClick={() => { setCurrentView('home'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-neutral-400" /> Home Projects
                  </span>
                </button>
                <button
                  onClick={() => { setTimeMachineOpen(true); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-indigo-400" /> Version History
                  </span>
                </button>
                <div className="h-px bg-neutral-800 my-1" />
                <button
                  onClick={() => { setExportModalOpen(true); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-neutral-400" /> Download Design...
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+E</span>
                </button>
                <button
                  onClick={() => { setDesignPackageOpen(true); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-indigo-400" /> Export Design Package
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                activeMenu === 'edit'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div className="absolute left-0 top-full mt-1.5 w-52 glass-modal rounded-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs shadow-2xl">
                <button
                  onClick={() => { undo(); setActiveMenu(null); }}
                  disabled={!canUndo}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white disabled:opacity-40"
                >
                  <span>Undo</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => { redo(); setActiveMenu(null); }}
                  disabled={!canRedo}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white disabled:opacity-40"
                >
                  <span>Redo</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Shift+Z</span>
                </button>
                <div className="h-px bg-neutral-800 my-1" />
                <button
                  onClick={() => { duplicateSelected(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Duplicate</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+D</span>
                </button>
                <button
                  onClick={() => { groupSelected(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Group</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+G</span>
                </button>
                <button
                  onClick={() => { ungroupSelected(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Ungroup</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Shift+G</span>
                </button>
                <div className="h-px bg-neutral-800 my-1" />
                <button
                  onClick={() => { deleteSelected(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-rose-400 text-rose-400/90"
                >
                  <span>Delete</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Del</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                activeMenu === 'view'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute left-0 top-full mt-1.5 w-52 glass-modal rounded-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs shadow-2xl">
                <button
                  onClick={() => { zoomToFit(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Zoom to Fit</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Shift+1</span>
                </button>
                <button
                  onClick={() => { zoomToSelection(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Zoom to Selection</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Shift+2</span>
                </button>
                <button
                  onClick={() => { zoomTo100(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span>Zoom 100%</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+0</span>
                </button>
                <div className="h-px bg-neutral-800 my-1" />
                <button
                  onClick={() => { setShowGrid(!showGrid); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {showGrid && <Check className="w-3 h-3 text-indigo-400" />} Grid
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+'</span>
                </button>
                <button
                  onClick={() => { setShowRulers(!showRulers); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {showRulers && <Check className="w-3 h-3 text-indigo-400" />} Rulers
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Ctrl+R</span>
                </button>
                <button
                  onClick={() => { setBlueprintMode(!blueprintMode); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {blueprintMode && <Check className="w-3 h-3 text-sky-400" />} Blueprint
                  </span>
                </button>
                <button
                  onClick={() => { setResponsiveSimulatorActive(!responsiveSimulatorActive); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800/80 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {responsiveSimulatorActive && <Check className="w-3 h-3 text-sky-400" />} Simulator
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-3.5 w-px bg-neutral-800/80" />

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="px-2 py-0.5 text-xs bg-neutral-800 border border-indigo-500 rounded-lg text-neutral-100 outline-none w-36 font-medium"
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="px-2 py-0.5 rounded-lg text-xs font-semibold text-neutral-200 hover:bg-neutral-800/60 cursor-text transition-colors flex items-center gap-1 max-w-[150px] truncate"
            title="Click to rename design"
          >
            <span className="truncate">{project.name || 'Untitled Design'}</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900/60 border border-neutral-800 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Saved locally</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setMagicResizeOpen(true)}
          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-800"
        >
          <Scaling className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Resize</span>
        </button>

        <button
          onClick={() => setPresentModeOpen(true)}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border border-neutral-700/60"
        >
          <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
          <span>Present</span>
        </button>

        <div className="h-3.5 w-px bg-neutral-800/80 mx-0.5" />

        <div className="flex items-center gap-0.5 relative">
          <button
            onClick={() => setZoomDropdownOpen(!zoomDropdownOpen)}
            className="px-2 py-1 text-xs font-mono text-neutral-300 hover:bg-neutral-800 rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {zoomDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 glass-modal rounded-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 shadow-2xl">
              {[50, 100, 150, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => { setZoom(val / 100); setZoomDropdownOpen(false); }}
                  className="w-full px-3 py-1.5 text-left hover:bg-neutral-800 hover:text-white flex justify-between"
                >
                  <span>{val}%</span>
                  {Math.round(zoom * 100) === val && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
              <div className="h-px bg-neutral-800 my-1" />
              <button
                onClick={() => { zoomToFit(); setZoomDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-neutral-800 hover:text-white flex justify-between"
              >
                <span>Fit</span>
                <span className="text-[10px] text-neutral-500 font-mono">Shift+1</span>
              </button>
            </div>
          )}
        </div>

        <Tooltip content="Command Palette" shortcut="Ctrl+K">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <Command className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}>
          <button
            onClick={toggleTheme}
            className="p-1.5 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>

        <button
          onClick={() => setExportModalOpen(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}