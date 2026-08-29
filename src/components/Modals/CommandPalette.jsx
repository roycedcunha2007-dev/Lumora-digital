import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TOOLS } from '../../constants/tools';
import {
  Search,
  Command,
  Square,
  Circle,
  Frame,
  Type,
  PenTool,
  Pencil,
  Sparkles,
  Download,
  FolderOpen,
  HelpCircle,
  Sun,
  Moon,
  Layers,
  Zap,
  ZoomIn,
  Grid,
  Copy,
  Trash2,
  Activity,
  Layout,
  Scaling,
  History,
  Palette,
  Trophy,
  ShieldCheck,
  Gauge,
  Package,
  HardDrive
} from 'lucide-react';

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTool,
    setExportModalOpen,
    setProjectManagerOpen,
    setShortcutsModalOpen,
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
    setDesignPackageOpen,
    setOfflineDashboardOpen,
    setResetModalOpen,
    zoomToFit,

    zoomToSelection,
    zoomTo100,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    toggleTheme,
    duplicateSelected,
    deleteSelected,
    groupSelected,
    ungroupSelected,
    undo,
    redo,
    elements,
    setSelectedIds,
  } = useEditor();

  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    { id: 'tool_select', name: 'Select Tool', category: 'Tools', shortcut: 'V', icon: <Command className="w-4 h-4" />, action: () => setActiveTool(TOOLS.SELECT) },
    { id: 'tool_frame', name: 'Create Frame / Artboard', category: 'Tools', shortcut: 'F', icon: <Frame className="w-4 h-4" />, action: () => setActiveTool(TOOLS.FRAME) },
    { id: 'tool_rect', name: 'Create Rectangle', category: 'Tools', shortcut: 'R', icon: <Square className="w-4 h-4" />, action: () => setActiveTool(TOOLS.RECTANGLE) },
    { id: 'tool_ellipse', name: 'Create Ellipse / Circle', category: 'Tools', shortcut: 'O', icon: <Circle className="w-4 h-4" />, action: () => setActiveTool(TOOLS.ELLIPSE) },
    { id: 'tool_text', name: 'Create Text', category: 'Tools', shortcut: 'T', icon: <Type className="w-4 h-4" />, action: () => setActiveTool(TOOLS.TEXT) },
    { id: 'tool_pen', name: 'Vector Pen Tool', category: 'Tools', shortcut: 'P', icon: <PenTool className="w-4 h-4" />, action: () => setActiveTool(TOOLS.PEN) },
    { id: 'tool_pencil', name: 'Freehand Pencil Tool', category: 'Tools', shortcut: 'Shift+P', icon: <Pencil className="w-4 h-4" />, action: () => setActiveTool(TOOLS.PENCIL) },

    { id: 'feat_doctor', name: 'Open Design Doctor & QA', category: 'FigmaLite 2.0', shortcut: 'Doctor', icon: <Activity className="w-4 h-4 text-indigo-400" />, action: () => setDesignDoctorOpen(true) },
    { id: 'feat_templates', name: 'Open Template Studio', category: 'FigmaLite 2.0', shortcut: 'Templates', icon: <Layout className="w-4 h-4 text-indigo-400" />, action: () => setTemplateLibraryOpen(true) },
    { id: 'feat_resize', name: 'Magic Responsive Resize', category: 'FigmaLite 2.0', shortcut: 'Resize', icon: <Scaling className="w-4 h-4 text-indigo-400" />, action: () => setMagicResizeOpen(true) },
    { id: 'feat_lab', name: 'Component Lab & Variants', category: 'FigmaLite 2.0', shortcut: 'Components', icon: <Sparkles className="w-4 h-4 text-purple-400" />, action: () => setComponentLabOpen(true) },
    { id: 'feat_time', name: 'Design Time Machine', category: 'FigmaLite 2.0', shortcut: 'History', icon: <History className="w-4 h-4 text-indigo-400" />, action: () => setTimeMachineOpen(true) },
    { id: 'feat_tokens', name: 'Extract Design System Tokens', category: 'FigmaLite 2.0', shortcut: 'Tokens', icon: <Palette className="w-4 h-4 text-indigo-400" />, action: () => setStyleExtractorOpen(true) },
    { id: 'feat_variations', name: 'Generate Design Variations', category: 'FigmaLite 2.0', shortcut: 'Variations', icon: <Sparkles className="w-4 h-4 text-amber-400" />, action: () => setVariationsOpen(true) },
    { id: 'feat_missions', name: 'Design Mission Challenges', category: 'FigmaLite 2.0', shortcut: 'Missions', icon: <Trophy className="w-4 h-4 text-amber-400" />, action: () => setMissionsOpen(true) },
    { id: 'feat_a11y', name: 'Accessibility & WCAG Audit', category: 'FigmaLite 2.0', shortcut: 'A11y', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, action: () => setAccessibilityModalOpen(true) },
    { id: 'feat_perf', name: 'Performance & Canvas Health', category: 'FigmaLite 2.0', shortcut: 'Diagnostics', icon: <Gauge className="w-4 h-4 text-sky-400" />, action: () => setPerformanceModalOpen(true) },
    { id: 'feat_pkg', name: 'Export Full Design Package', category: 'FigmaLite 2.0', shortcut: 'Package', icon: <Package className="w-4 h-4 text-indigo-400" />, action: () => setDesignPackageOpen(true) },
    { id: 'feat_workspace', name: 'Offline Workspace Dashboard', category: 'FigmaLite 2.0', shortcut: 'Workspace', icon: <HardDrive className="w-4 h-4 text-emerald-400" />, action: () => setOfflineDashboardOpen(true) },

    { id: 'view_fit', name: 'Zoom to Fit All', category: 'View', shortcut: 'Shift+1', icon: <ZoomIn className="w-4 h-4" />, action: () => zoomToFit() },
    { id: 'view_sel', name: 'Zoom to Selection', category: 'View', shortcut: 'Shift+2', icon: <ZoomIn className="w-4 h-4" />, action: () => zoomToSelection() },
    { id: 'view_100', name: 'Zoom to 100%', category: 'View', shortcut: 'Ctrl+0', icon: <ZoomIn className="w-4 h-4" />, action: () => zoomTo100() },
    { id: 'view_grid', name: 'Toggle Canvas Grid', category: 'View', shortcut: "Ctrl+'", icon: <Grid className="w-4 h-4" />, action: () => setShowGrid(!showGrid) },
    { id: 'view_theme', name: 'Toggle Dark / Light Theme', category: 'View', shortcut: '', icon: <Sun className="w-4 h-4" />, action: () => toggleTheme() },

    { id: 'act_dup', name: 'Duplicate Selection', category: 'Edit', shortcut: 'Ctrl+D', icon: <Copy className="w-4 h-4" />, action: () => duplicateSelected() },
    { id: 'act_del', name: 'Delete Selection', category: 'Edit', shortcut: 'Del', icon: <Trash2 className="w-4 h-4" />, action: () => deleteSelected() },
    { id: 'act_group', name: 'Group Selection', category: 'Edit', shortcut: 'Ctrl+G', icon: <Layers className="w-4 h-4" />, action: () => groupSelected() },
    { id: 'act_ungroup', name: 'Ungroup Selection', category: 'Edit', shortcut: 'Ctrl+Shift+G', icon: <Layers className="w-4 h-4" />, action: () => ungroupSelected() },
    { id: 'act_undo', name: 'Undo Last Action', category: 'Edit', shortcut: 'Ctrl+Z', icon: <Command className="w-4 h-4" />, action: () => undo() },
    { id: 'act_redo', name: 'Redo Action', category: 'Edit', shortcut: 'Ctrl+Shift+Z', icon: <Command className="w-4 h-4" />, action: () => redo() },

    { id: 'win_present', name: 'Launch Presentation Mode', category: 'Presentation', shortcut: 'Present', icon: <Zap className="w-4 h-4" />, action: () => setPresentModeOpen(true) },
    { id: 'win_export', name: 'Export Design (PNG / SVG / JSON)', category: 'Export', shortcut: 'Ctrl+E', icon: <Download className="w-4 h-4" />, action: () => setExportModalOpen(true) },
    { id: 'win_shortcuts', name: 'Keyboard Shortcuts Cheatsheet', category: 'Help', shortcut: 'Ctrl+/', icon: <HelpCircle className="w-4 h-4" />, action: () => setShortcutsModalOpen(true) },
    { id: 'win_reset', name: 'Reset Project & Application Data', category: 'Settings', shortcut: 'Reset', icon: <Trash2 className="w-4 h-4 text-rose-400" />, action: () => setResetModalOpen(true) },
  ];


  elements.forEach((el) => {
    commands.push({
      id: `layer_${el.id}`,
      name: `Select Layer: ${el.name}`,
      category: 'Layers',
      shortcut: '',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => setSelectedIds([el.id]),
    });
  });

  const filtered = commands.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        filtered[selectedIdx].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-modal rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800/80 gap-3">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, feature, tool, or layer name..."
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700/80 rounded-md">
            ESC
          </kbd>
        </div>

        <div className="max-h-84 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">No matching commands found</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  setCommandPaletteOpen(false);
                }}
                onMouseEnter={() => setSelectedIdx(idx)}
                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition-all ${
                  idx === selectedIdx
                    ? 'bg-indigo-600 text-white font-medium shadow-md glow-indigo'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={idx === selectedIdx ? 'text-white' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      idx === selectedIdx
                        ? 'bg-indigo-700/60 text-indigo-200 font-semibold'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.shortcut && (
                    <kbd
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        idx === selectedIdx
                          ? 'bg-indigo-700 text-white'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700/80'
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Navigate with ↑ ↓ keys</span>
          <span>Press Enter to run command</span>
        </div>
      </div>
    </div>
  );
}