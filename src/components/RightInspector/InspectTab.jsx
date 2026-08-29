import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { generateCss, generateTailwind, generateReactJsx } from '../../utils/cssGenerator';
import { Copy, Check, Code, FileCode, Layers, Sliders } from 'lucide-react';
export function InspectTab() {
  const { selectedElements, showToast } = useEditor();
  const [codeType, setCodeType] = useState('css'); 
  const [copied, setCopied] = useState(false);
  if (selectedElements.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-neutral-500">
        <Code className="w-8 h-8 mx-auto mb-2 opacity-30 text-neutral-400" />
        <p className="font-medium text-neutral-400">No selection</p>
        <p className="text-[11px] text-neutral-600 mt-1">Select an object to inspect CSS, Tailwind, and React JSX</p>
      </div>
    );
  }
  const primary = selectedElements[0];
  const cssCode = generateCss(primary);
  const tailwindCode = generateTailwind(primary);
  const jsxCode = generateReactJsx(primary);
  const activeCode =
    codeType === 'css' ? cssCode : codeType === 'tailwind' ? tailwindCode : jsxCode;
  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    showToast(`Copied ${codeType.toUpperCase()} to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col p-3 gap-4 text-xs select-none overflow-y-auto max-h-[calc(100vh-100px)]">
      <div className="space-y-2 border-b border-neutral-800 pb-3">
        <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          Geometry & Position
        </div>
        <div className="grid grid-cols-2 gap-2 bg-neutral-850 p-2 rounded-lg border border-neutral-800 font-mono text-[11px]">
          <div>
            <span className="text-neutral-500">X: </span>
            <span className="text-neutral-200">{Math.round(primary.x || 0)}px</span>
          </div>
          <div>
            <span className="text-neutral-500">Y: </span>
            <span className="text-neutral-200">{Math.round(primary.y || 0)}px</span>
          </div>
          <div>
            <span className="text-neutral-500">W: </span>
            <span className="text-neutral-200">{Math.round(primary.width || 0)}px</span>
          </div>
          <div>
            <span className="text-neutral-500">H: </span>
            <span className="text-neutral-200">{Math.round(primary.height || 0)}px</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 border-b border-neutral-800 pb-3">
        <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          Appearance
        </div>
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between p-1.5 bg-neutral-850 rounded border border-neutral-800">
            <span className="text-neutral-400">Fill</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-sm border border-neutral-700"
                style={{ backgroundColor: typeof primary.fill === 'string' ? primary.fill : '#6366F1' }}
              />
              <span className="text-neutral-200 uppercase">
                {typeof primary.fill === 'string' ? primary.fill : 'Gradient'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-1.5 bg-neutral-850 rounded border border-neutral-800">
            <span className="text-neutral-400">Opacity</span>
            <span className="text-neutral-200">
              {Math.round((primary.opacity !== undefined ? primary.opacity : 1) * 100)}%
            </span>
          </div>
          {primary.cornerRadius > 0 && (
            <div className="flex items-center justify-between p-1.5 bg-neutral-850 rounded border border-neutral-800">
              <span className="text-neutral-400">Radius</span>
              <span className="text-neutral-200">{primary.cornerRadius}px</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex bg-neutral-800 p-0.5 rounded text-[11px] font-medium">
            <button
              onClick={() => setCodeType('css')}
              className={`px-2 py-0.5 rounded ${codeType === 'css' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              CSS
            </button>
            <button
              onClick={() => setCodeType('tailwind')}
              className={`px-2 py-0.5 rounded ${codeType === 'tailwind' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Tailwind
            </button>
            <button
              onClick={() => setCodeType('jsx')}
              className={`px-2 py-0.5 rounded ${codeType === 'jsx' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              JSX
            </button>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded text-[11px] font-medium transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : `Copy ${codeType.toUpperCase()}`}</span>
          </button>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-[11px] text-neutral-300 overflow-x-auto leading-relaxed shadow-inner select-text max-h-56">
          <pre className="whitespace-pre-wrap">{activeCode || ''}</pre>
        </div>
      </div>
    </div>
  );
}