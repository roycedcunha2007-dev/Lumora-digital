import React, { useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { generateCss } from '../../utils/cssGenerator';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lock,
  EyeOff,
  Code,
  Check
} from 'lucide-react';
export function ContextMenu() {
  const {
    contextMenu,
    setContextMenu,
    selectedIds,
    selectedElements,
    duplicateSelected,
    deleteSelected,
    groupSelected,
    ungroupSelected,
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack,
    toggleLock,
    toggleHide,
    createMasterComponent,
    showToast,
  } = useEditor();
  const menuRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
      }
    };
    if (contextMenu.visible) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [contextMenu.visible, setContextMenu]);
  if (!contextMenu.visible) return null;
  const hasSelection = selectedIds.length > 0;
  const primary = selectedElements[0];
  const handleCopyCss = () => {
    if (primary) {
      const css = generateCss(primary);
      navigator.clipboard.writeText(css);
      showToast('Copied CSS to clipboard', 'success');
    }
    setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
  };
  return (
    <div
      ref={menuRef}
      style={{
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
      }}
      className="fixed z-[999] w-52 bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-xl shadow-2xl py-1 text-xs text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-75"
    >
      <button
        onClick={() => {
          duplicateSelected();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span className="flex items-center gap-2.5">
          <Copy className="w-3.5 h-3.5 text-neutral-400" /> Duplicate
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+D</span>
      </button>
      <button
        onClick={() => {
          deleteSelected();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-rose-400 text-rose-400/90 disabled:opacity-40"
      >
        <span className="flex items-center gap-2.5">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">Del</span>
      </button>
      <div className="h-px bg-neutral-800 my-1" />
      <button
        onClick={() => {
          bringForward();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span>Bring Forward</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+]</span>
      </button>
      <button
        onClick={() => {
          bringToFront();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span>Bring to Front</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Shift+]</span>
      </button>
      <button
        onClick={() => {
          sendBackward();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span>Send Backward</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+[</span>
      </button>
      <button
        onClick={() => {
          sendToBack();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span>Send to Back</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Shift+[</span>
      </button>
      <div className="h-px bg-neutral-800 my-1" />
      <button
        onClick={() => {
          groupSelected();
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={selectedIds.length < 2}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span>Group Selection</span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+G</span>
      </button>
      <button
        onClick={() => {
          if (primary) createMasterComponent(primary.id);
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-purple-300 disabled:opacity-40"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Create Component
        </span>
      </button>
      <div className="h-px bg-neutral-800 my-1" />
      <button
        onClick={() => {
          if (primary) toggleLock(primary.id);
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-neutral-400" /> Toggle Lock
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+L</span>
      </button>
      <button
        onClick={() => {
          if (primary) toggleHide(primary.id);
          setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        }}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 hover:text-white disabled:opacity-40"
      >
        <span className="flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5 text-neutral-400" /> Toggle Hide
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">Ctrl+Shift+H</span>
      </button>
      <div className="h-px bg-neutral-800 my-1" />
      <button
        onClick={handleCopyCss}
        disabled={!hasSelection}
        className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-indigo-400 hover:bg-neutral-800 hover:text-indigo-300 disabled:opacity-40 font-medium"
      >
        <Code className="w-3.5 h-3.5" /> Copy CSS
      </button>
    </div>
  );
}