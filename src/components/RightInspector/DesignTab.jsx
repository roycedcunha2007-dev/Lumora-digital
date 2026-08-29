import React, { useState, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { FONT_FAMILIES } from '../../constants/presets';
import { ColorPickerModal } from './ColorPickerModal';
import { readLocalImageFile } from '../../utils/import';
import { saveAssetToDB } from '../../utils/idb';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Lock,
  Unlock,
  Sliders,
  Plus,
  Trash2,
  Columns,
  Rows,
  Layers,
  ChevronDown,
  Image as ImageIcon,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export function DesignTab() {
  const {
    selectedIds,
    selectedElements,
    updateElementProperties,
    alignSelected,
    distributeSelected,
    createMasterComponent,
    showToast,
  } = useEditor();

  const [activePicker, setActivePicker] = useState(null);
  const [aspectLocked, setAspectLocked] = useState(false);
  const replaceImageInputRef = useRef(null);

  if (selectedElements.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-neutral-500">
        <Sliders className="w-8 h-8 mx-auto mb-2 opacity-30 text-neutral-400" />
        <p className="font-medium text-neutral-400">No selection</p>
        <p className="text-[11px] text-neutral-600 mt-1">Select an object on the canvas to inspect its design properties</p>
      </div>
    );
  }

  const primary = selectedElements[0];
  const isMulti = selectedElements.length > 1;

  const handlePropChange = (key, val) => {
    updateElementProperties(selectedIds, { [key]: val }, true);
  };

  const handleDimensionChange = (dimension, val) => {
    const num = Math.max(1, Number(val) || 1);
    if (aspectLocked && primary.width && primary.height) {
      const aspect = primary.width / primary.height;
      if (dimension === 'width') {
        updateElementProperties(selectedIds, { width: num, height: Math.round(num / aspect) }, true);
      } else {
        updateElementProperties(selectedIds, { height: num, width: Math.round(num * aspect) }, true);
      }
    } else {
      updateElementProperties(selectedIds, { [dimension]: num }, true);
    }
  };

  const handleReplaceImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

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
      showToast('Image replaced successfully', 'success');
    } catch (err) {
      showToast('Failed to replace image', 'error');
    } finally {
      if (replaceImageInputRef.current) {
        replaceImageInputRef.current.value = '';
      }
    }
  };

  const handleResetImageDimensions = () => {
    if (primary.originalWidth && primary.originalHeight) {
      const maxDim = 600;
      const scale = Math.min(1, maxDim / Math.max(primary.originalWidth, primary.originalHeight));
      updateElementProperties(
        selectedIds,
        {
          width: Math.round(primary.originalWidth * scale),
          height: Math.round(primary.originalHeight * scale),
        },
        true
      );
      showToast('Reset to natural dimensions', 'success');
    }
  };

  return (
    <div className="flex flex-col p-3 gap-3.5 text-xs select-none overflow-y-auto max-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 text-neutral-400">
        <button
          onClick={() => alignSelected('left')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignSelected('center')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignSelected('right')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-neutral-800" />
        <button
          onClick={() => alignSelected('top')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Top"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="4" x2="22" y2="4"/><rect x="7" y="8" width="10" height="12" rx="1"/></svg>
        </button>
        <button
          onClick={() => alignSelected('middle')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Middle"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="12" x2="22" y2="12"/><rect x="7" y="6" width="10" height="12" rx="1"/></svg>
        </button>
        <button
          onClick={() => alignSelected('bottom')}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
          title="Align Bottom"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="20" x2="22" y2="20"/><rect x="7" y="4" width="10" height="12" rx="1"/></svg>
        </button>
        <div className="w-px h-3.5 bg-neutral-800" />
        <button
          onClick={() => distributeSelected('horizontal')}
          disabled={selectedIds.length < 3}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg disabled:opacity-30 transition-colors"
          title="Distribute Horizontally"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="6" width="4" height="12" rx="1"/><rect x="16" y="6" width="4" height="12" rx="1"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
        </button>
        <button
          onClick={() => distributeSelected('vertical')}
          disabled={selectedIds.length < 3}
          className="p-1.5 hover:bg-neutral-800 hover:text-white rounded-lg disabled:opacity-30 transition-colors"
          title="Distribute Vertically"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="12" height="4" rx="1"/><rect x="6" y="16" width="12" height="4" rx="1"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
        </button>
      </div>

      <div className="space-y-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          <span>Transform</span>
          <button
            onClick={() => setAspectLocked(!aspectLocked)}
            className={`p-1 rounded ${aspectLocked ? 'text-indigo-400 bg-indigo-950/60' : 'text-neutral-500 hover:text-neutral-300'}`}
            title="Constrain Proportions"
          >
            {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">X</span>
            <input
              type="number"
              value={Math.round(primary.x || 0)}
              onChange={(e) => handlePropChange('x', Number(e.target.value))}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">Y</span>
            <input
              type="number"
              value={Math.round(primary.y || 0)}
              onChange={(e) => handlePropChange('y', Number(e.target.value))}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">W</span>
            <input
              type="number"
              value={Math.round(primary.width || 0)}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">H</span>
            <input
              type="number"
              value={Math.round(primary.height || 0)}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">∠</span>
            <input
              type="number"
              value={primary.rotation || 0}
              onChange={(e) => handlePropChange('rotation', Number(e.target.value))}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
            <span className="text-neutral-500 text-[10px]">°</span>
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px] font-mono">R</span>
            <input
              type="number"
              min="0"
              value={primary.cornerRadius || 0}
              onChange={(e) => handlePropChange('cornerRadius', Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
            <span className="text-neutral-500 text-[10px]">px</span>
          </div>
        </div>
      </div>

      {primary.type === 'image' && (
        <div className="space-y-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            <span>Image Controls</span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {primary.originalWidth || primary.width} × {primary.originalHeight || primary.height}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => replaceImageInputRef.current && replaceImageInputRef.current.click()}
              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-neutral-700/60"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Replace Image</span>
            </button>
            <button
              onClick={handleResetImageDimensions}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg transition-colors border border-neutral-700/60"
              title="Reset to Natural Dimensions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={replaceImageInputRef}
              onChange={handleReplaceImage}
              accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
              className="hidden"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] text-neutral-400 font-medium">Object Fit</div>
            <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
              {['cover', 'contain', 'fill'].map((fit) => (
                <button
                  key={fit}
                  onClick={() => handlePropChange('objectFit', fit)}
                  className={`flex-1 py-1 rounded-md capitalize transition-colors ${
                    (primary.objectFit || 'cover') === fit
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] text-neutral-400">
              <span>Brightness</span>
              <span className="font-mono text-neutral-300">{primary.brightness !== undefined ? primary.brightness : 100}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={primary.brightness !== undefined ? primary.brightness : 100}
              onChange={(e) => handlePropChange('brightness', Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between items-center text-[10px] text-neutral-400">
              <span>Contrast</span>
              <span className="font-mono text-neutral-300">{primary.contrast !== undefined ? primary.contrast : 100}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={primary.contrast !== undefined ? primary.contrast : 100}
              onChange={(e) => handlePropChange('contrast', Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between items-center text-[10px] text-neutral-400">
              <span>Saturation</span>
              <span className="font-mono text-neutral-300">{primary.saturation !== undefined ? primary.saturation : 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={primary.saturation !== undefined ? primary.saturation : 100}
              onChange={(e) => handlePropChange('saturation', Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}

      {primary.type === 'frame' && (
        <div className="space-y-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            <span>Auto Layout</span>
            <button
              onClick={() => {
                if (!primary.autoLayout || !primary.autoLayout.enabled) {
                  handlePropChange('autoLayout', {
                    enabled: true,
                    direction: 'column',
                    gap: 12,
                    padding: 16,
                    alignItems: 'start',
                    justifyContent: 'start',
                  });
                } else {
                  handlePropChange('autoLayout', { ...primary.autoLayout, enabled: false });
                }
              }}
              className={`p-1 rounded ${primary.autoLayout && primary.autoLayout.enabled ? 'text-indigo-400 bg-indigo-950/60' : 'text-neutral-500 hover:text-white'}`}
            >
              {primary.autoLayout && primary.autoLayout.enabled ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          {primary.autoLayout && primary.autoLayout.enabled && (
            <div className="space-y-2 pt-1">
              <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
                <button
                  onClick={() => handlePropChange('autoLayout', { ...primary.autoLayout, direction: 'row' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center gap-1 ${primary.autoLayout.direction === 'row' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400'}`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Row</span>
                </button>
                <button
                  onClick={() => handlePropChange('autoLayout', { ...primary.autoLayout, direction: 'column' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center gap-1 ${primary.autoLayout.direction === 'column' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400'}`}
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span>Column</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
                  <span className="text-neutral-500 text-[10px]">Gap</span>
                  <input
                    type="number"
                    value={primary.autoLayout.gap || 0}
                    onChange={(e) =>
                      handlePropChange('autoLayout', { ...primary.autoLayout, gap: Number(e.target.value) })
                    }
                    className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
                  />
                </div>
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
                  <span className="text-neutral-500 text-[10px]">Pad</span>
                  <input
                    type="number"
                    value={typeof primary.autoLayout.padding === 'number' ? primary.autoLayout.padding : 16}
                    onChange={(e) =>
                      handlePropChange('autoLayout', { ...primary.autoLayout, padding: Number(e.target.value) })
                    }
                    className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {primary.type === 'text' && (
        <div className="space-y-2 border-b border-neutral-800 pb-3">
          <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            Typography
          </div>
          <div className="space-y-2">
            <select
              value={primary.fontFamily || 'Inter'}
              onChange={(e) => handlePropChange('fontFamily', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 outline-none font-medium"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
                <span className="text-neutral-500 text-[10px]">Size</span>
                <input
                  type="number"
                  value={primary.fontSize || 16}
                  onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
                  className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
                />
              </div>
              <select
                value={primary.fontWeight || 400}
                onChange={(e) => handlePropChange('fontWeight', Number(e.target.value))}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none"
              >
                <option value={300}>Light (300)</option>
                <option value={400}>Regular (400)</option>
                <option value={500}>Medium (500)</option>
                <option value={600}>SemiBold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={800}>ExtraBold (800)</option>
              </select>
            </div>
            <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => handlePropChange('textAlign', align)}
                  className={`flex-1 py-1 rounded-md capitalize transition-colors ${
                    primary.textAlign === align ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {primary.type !== 'image' && (
        <div className="space-y-2 border-b border-neutral-800 pb-3 relative">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            <span>Fill</span>
            <button
              onClick={() => setActivePicker(activePicker === 'fill' ? null : 'fill')}
              className="p-1 hover:text-white rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between p-1.5 bg-neutral-900 rounded-lg border border-neutral-800">
            <div
              onClick={() => setActivePicker(activePicker === 'fill' ? null : 'fill')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <div
                className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm shrink-0"
                style={{
                  backgroundColor: typeof primary.fill === 'string' ? primary.fill : '#6366F1',
                }}
              />
              <span className="font-mono text-xs uppercase text-neutral-200 truncate">
                {typeof primary.fill === 'string' ? primary.fill : 'Gradient'}
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">100%</div>
          </div>

          {activePicker === 'fill' && (
            <div className="absolute right-0 top-full mt-2 z-50">
              <ColorPickerModal
                value={primary.fill}
                onChange={(newVal) => handlePropChange('fill', newVal)}
                onClose={() => setActivePicker(null)}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 border-b border-neutral-800 pb-3 relative">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          <span>Stroke</span>
          <button
            onClick={() => {
              if (!primary.stroke) {
                handlePropChange('stroke', '#1E293B');
                handlePropChange('strokeWidth', 1);
              } else {
                handlePropChange('stroke', null);
                handlePropChange('strokeWidth', 0);
              }
            }}
            className="p-1 hover:text-white rounded"
          >
            {primary.stroke ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {primary.stroke && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between p-1.5 bg-neutral-900 rounded-lg border border-neutral-800">
              <div
                onClick={() => setActivePicker(activePicker === 'stroke' ? null : 'stroke')}
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <div
                  className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm shrink-0"
                  style={{ backgroundColor: primary.stroke }}
                />
                <span className="font-mono text-xs uppercase text-neutral-200">
                  {primary.stroke}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={primary.strokeWidth || 1}
                  onChange={(e) => handlePropChange('strokeWidth', Number(e.target.value))}
                  className="w-10 bg-transparent text-right text-xs font-mono text-neutral-200 outline-none"
                />
                <span className="text-[10px] text-neutral-500">px</span>
              </div>
            </div>

            {activePicker === 'stroke' && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <ColorPickerModal
                  value={primary.stroke}
                  onChange={(newVal) => handlePropChange('stroke', newVal)}
                  onClose={() => setActivePicker(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 border-b border-neutral-800 pb-3">
        <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          Appearance
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px]">Opacity</span>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round((primary.opacity !== undefined ? primary.opacity : 1) * 100)}
              onChange={(e) => handlePropChange('opacity', Number(e.target.value) / 100)}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
            <span className="text-neutral-500 text-[10px]">%</span>
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 gap-1">
            <span className="text-neutral-500 text-[10px]">Blur</span>
            <input
              type="number"
              value={primary.blur || 0}
              onChange={(e) => handlePropChange('blur', Number(e.target.value))}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono"
            />
            <span className="text-neutral-500 text-[10px]">px</span>
          </div>
        </div>
      </div>

      {primary.type === 'chart' && (
        <div className="space-y-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
              Chart Dataset ({primary.chartType || 'bar'})
            </span>
            <button
              onClick={() => {
                const cur = primary.chartData || [];
                const updated = [...cur, { label: `Item ${cur.length + 1}`, value: 100 }];
                handlePropChange('chartData', updated);
              }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Point
            </button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {(primary.chartData || []).map((pt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={pt.label}
                  onChange={(e) => {
                    const next = [...primary.chartData];
                    next[idx] = { ...next[idx], label: e.target.value };
                    handlePropChange('chartData', next);
                  }}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none"
                />
                <input
                  type="number"
                  value={pt.value}
                  onChange={(e) => {
                    const next = [...primary.chartData];
                    next[idx] = { ...next[idx], value: Number(e.target.value) || 0 };
                    handlePropChange('chartData', next);
                  }}
                  className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs font-mono text-neutral-200 outline-none"
                />
                <button
                  onClick={() => {
                    const next = primary.chartData.filter((_, i) => i !== idx);
                    handlePropChange('chartData', next);
                  }}
                  className="p-1 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
            Design Insights
          </span>
          <span className="px-1.5 py-0.2 bg-indigo-950/60 text-indigo-300 rounded text-[9px] font-mono">
            {primary.type}
          </span>
        </div>
        <div className="p-2.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-1.5 text-[11px] text-neutral-400">
          <div className="flex justify-between">
            <span>Component:</span>
            <strong className="text-neutral-200 font-mono">
              {primary.isMasterComponent ? 'Master Component (❖)' : primary.componentMasterId ? 'Instance' : 'Standard Element'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span>Auto Layout:</span>
            <strong className="text-neutral-200 font-mono">
              {primary.autoLayout && primary.autoLayout.enabled ? `${primary.autoLayout.direction} (Gap: ${primary.autoLayout.gap}px)` : 'Fixed Coordinates'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span>Constraints:</span>
            <strong className="text-neutral-200 font-mono">
              {primary.constraints ? `${primary.constraints.horizontal} + ${primary.constraints.vertical}` : 'Default (Left, Top)'}
            </strong>
          </div>
        </div>
      </div>

      <div className="pt-0.5">
        <button
          onClick={() => createMasterComponent(primary.id)}
          className="w-full py-2 bg-neutral-800/80 hover:bg-purple-900/40 text-neutral-200 hover:text-purple-300 border border-neutral-700/80 hover:border-purple-500/50 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Create Master Component</span>
        </button>
      </div>
    </div>
  );
}