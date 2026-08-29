import React, { useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { FONT_FAMILIES } from '../../constants/presets';
import { readLocalImageFile } from '../../utils/import';
import { saveAssetToDB } from '../../utils/idb';
import {
  Copy,
  Trash2,
  Layers,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus,
  RefreshCw,
  RotateCcw,
  Maximize2,
  Columns,
  Rows
} from 'lucide-react';

export function ContextualTopBar() {
  const {
    selectedIds,
    selectedElements,
    updateElementProperties,
    duplicateSelected,
    deleteSelected,
    groupSelected,
    ungroupSelected,
    alignSelected,
    distributeSelected,
    showToast,
  } = useEditor();

  const replaceImageRef = useRef(null);

  const primary = selectedElements[0];
  const isMulti = selectedElements.length > 1;

  const handlePropChange = (key, val) => {
    updateElementProperties(selectedIds, { [key]: val }, true);
  };

  const handleReplaceImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !primary) return;

    try {
      showToast('Replacing image...', 'info');
      const imgData = await readLocalImageFile(file);
      updateElementProperties(
        selectedIds,
        {
          src: imgData.src || imgData.dataUrl,
          dataUrl: imgData.dataUrl || imgData.src,
          originalWidth: imgData.naturalWidth,
          originalHeight: imgData.naturalHeight,
          name: imgData.name || primary.name,
        },
        true
      );
      saveAssetToDB(primary.id, imgData.dataUrl || imgData.src).catch(() => {});
      showToast('Image replaced', 'success');
    } catch (err) {
      showToast('Failed to replace image', 'error');
    } finally {
      if (replaceImageRef.current) {
        replaceImageRef.current.value = '';
      }
    }
  };

  return (
    <div className="h-10 w-full glass-surface border-b border-neutral-800/80 px-4 flex items-center justify-between text-xs select-none z-10 shrink-0">
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {selectedElements.length === 0 && (
          <div className="flex items-center gap-3 text-neutral-400 text-xs">
            <span className="text-[11px] font-medium text-neutral-300">Canvas Ready</span>
            <span className="text-neutral-600">|</span>
            <span className="text-[10px] text-neutral-500">Select any element to edit, or drag templates & elements from the sidebar</span>
          </div>
        )}

        {isMulti && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
              {selectedElements.length} items
            </span>
            <button
              onClick={() => alignSelected('left')}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('center')}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alignSelected('right')}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-neutral-800 mx-0.5" />
            <button
              onClick={groupSelected}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-[11px] font-medium flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Group</span>
            </button>
          </div>
        )}

        {!isMulti && primary && primary.type === 'text' && (
          <div className="flex items-center gap-2">
            <select
              value={primary.fontFamily || 'Inter'}
              onChange={(e) => handlePropChange('fontFamily', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none w-32 font-medium"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>

            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => handlePropChange('fontSize', Math.max(8, (primary.fontSize || 16) - 2))}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                value={primary.fontSize || 16}
                onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
                className="w-10 text-center bg-transparent text-xs font-mono text-white outline-none"
              />
              <button
                onClick={() => handlePropChange('fontSize', (primary.fontSize || 16) + 2)}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => handlePropChange('fontWeight', (primary.fontWeight || 400) >= 700 ? 400 : 700)}
              className={`p-1.5 rounded-lg transition-colors ${(primary.fontWeight || 400) >= 700 ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-neutral-300'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-0.5 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => handlePropChange('textAlign', align)}
                  className={`p-1 rounded ${primary.textAlign === align ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                >
                  {align === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : align === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pl-1">
              <input
                type="color"
                value={typeof primary.fill === 'string' ? primary.fill : '#FFFFFF'}
                onChange={(e) => handlePropChange('fill', e.target.value)}
                className="w-6 h-6 rounded-md bg-transparent cursor-pointer border border-neutral-700"
              />
            </div>
          </div>
        )}

        {!isMulti && primary && primary.type === 'image' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => replaceImageRef.current && replaceImageRef.current.click()}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-700/60"
            >
              <RefreshCw className="w-3 h-3 text-indigo-400" />
              <span>Replace</span>
            </button>
            <input
              type="file"
              ref={replaceImageRef}
              onChange={handleReplaceImage}
              accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
              className="hidden"
            />

            <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[10px]">
              {['cover', 'contain', 'fill'].map((fit) => (
                <button
                  key={fit}
                  onClick={() => handlePropChange('objectFit', fit)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    (primary.objectFit || 'cover') === fit
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1">
              <span className="text-[10px] text-neutral-500">Radius:</span>
              <input
                type="number"
                min="0"
                value={primary.cornerRadius || 0}
                onChange={(e) => handlePropChange('cornerRadius', Math.max(0, Number(e.target.value)))}
                className="w-10 bg-transparent text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        )}

        {!isMulti && primary && ['rectangle', 'rounded_rect', 'ellipse', 'triangle', 'polygon', 'star'].includes(primary.type) && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-500">Color:</span>
              <input
                type="color"
                value={typeof primary.fill === 'string' ? primary.fill : '#6366F1'}
                onChange={(e) => handlePropChange('fill', e.target.value)}
                className="w-6 h-6 rounded-md bg-transparent cursor-pointer border border-neutral-700"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1">
              <span className="text-[10px] text-neutral-500">Radius:</span>
              <input
                type="number"
                min="0"
                value={primary.cornerRadius || 0}
                onChange={(e) => handlePropChange('cornerRadius', Math.max(0, Number(e.target.value)))}
                className="w-10 bg-transparent text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        )}

        {!isMulti && primary && primary.type === 'frame' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-500">Canvas Color:</span>
              <input
                type="color"
                value={typeof primary.fill === 'string' ? primary.fill : '#090D16'}
                onChange={(e) => handlePropChange('fill', e.target.value)}
                className="w-6 h-6 rounded-md bg-transparent cursor-pointer border border-neutral-700"
              />
            </div>
          </div>
        )}
      </div>

      {selectedElements.length > 0 && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={duplicateSelected}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={deleteSelected}
            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Delete (Del)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
