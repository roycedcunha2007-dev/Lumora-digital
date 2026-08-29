import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { canvasToScreen, getSelectionBoundingBox } from '../../utils/math';
import {
  Copy,
  Trash2,
  Layers,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus
} from 'lucide-react';
export function QuickActionsHUD({ pan, zoom, containerRect }) {
  const {
    selectedIds,
    selectedElements,
    duplicateSelected,
    deleteSelected,
    groupSelected,
    ungroupSelected,
    alignSelected,
    createMasterComponent,
    updateElementProperties,
  } = useEditor();
  if (selectedElements.length === 0 || !containerRect) return null;
  const bounds = getSelectionBoundingBox(selectedElements);
  if (!bounds) return null;
  const screenCoords = canvasToScreen(bounds.x + bounds.width / 2, bounds.y, pan, zoom, containerRect);
  const primary = selectedElements[0];
  const isMulti = selectedElements.length > 1;
  const handleToggleAutoLayout = () => {
    if (primary.type === 'frame') {
      const current = primary.autoLayout || { enabled: false };
      updateElementProperties(primary.id, {
        autoLayout: {
          enabled: !current.enabled,
          direction: 'horizontal',
          gap: 12,
          padding: 16,
          align: 'center',
          justify: 'start',
        },
      }, true);
    }
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: `${screenCoords.x}px`,
        top: `${screenCoords.y - 48}px`,
        transform: 'translateX(-50%)',
        zIndex: 30,
      }}
      className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-xl px-2 py-1 flex items-center gap-1 shadow-2xl text-xs text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={duplicateSelected}
        className="p-1.5 hover:bg-neutral-800 hover:text-white rounded transition-colors"
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      {isMulti ? (
        <button
          onClick={groupSelected}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded transition-colors"
          title="Group Selection (Ctrl+G)"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      ) : (
        primary.children && (
          <button
            onClick={ungroupSelected}
            className="p-1.5 hover:bg-neutral-800 hover:text-white rounded transition-colors"
            title="Ungroup (Ctrl+Shift+G)"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )
      )}
      <div className="w-px h-3.5 bg-neutral-800 mx-0.5" />
      <button
        onClick={() => alignSelected('center')}
        className="p-1.5 hover:bg-neutral-800 hover:text-white rounded transition-colors"
        title="Align Center"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => alignSelected('middle')}
        className="p-1.5 hover:bg-neutral-800 hover:text-white rounded transition-colors"
        title="Align Middle"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="12" x2="22" y2="12"/><rect x="7" y="6" width="10" height="12" rx="1"/></svg>
      </button>
      <div className="w-px h-3.5 bg-neutral-800 mx-0.5" />
      {!primary.isMasterComponent && (
        <button
          onClick={() => createMasterComponent(primary.id)}
          className="px-2 py-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Component</span>
        </button>
      )}
      {primary.type === 'frame' && (
        <button
          onClick={handleToggleAutoLayout}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${primary.autoLayout && primary.autoLayout.enabled ? 'bg-indigo-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}`}
        >
          {primary.autoLayout && primary.autoLayout.enabled ? 'Auto Layout ✓' : '+ Auto Layout'}
        </button>
      )}
      <button
        onClick={deleteSelected}
        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 rounded transition-colors"
        title="Delete (Del)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}