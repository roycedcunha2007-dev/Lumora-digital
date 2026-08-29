import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { CanvasElement } from '../Canvas/CanvasElement';
import { Smartphone, Tablet, Laptop, Monitor, X } from 'lucide-react';
export function DeviceMockupModal() {
  const {
    deviceMockupOpen,
    setDeviceMockupOpen,
    elements,
    selectedElements,
  } = useEditor();
  const [deviceType, setDeviceType] = useState('iphone'); 
  if (!deviceMockupOpen) return null;
  const targetFrame = selectedElements.find((el) => el.type === 'frame') || elements.find((el) => el.type === 'frame');
  return (
    <div
      onClick={() => setDeviceMockupOpen(false)}
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-neutral-100">Realistic Device Mockup Studio</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                deviceType === 'iphone' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 16</span>
            </button>
            <button
              onClick={() => setDeviceType('ipad')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                deviceType === 'ipad' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>iPad Pro</span>
            </button>
            <button
              onClick={() => setDeviceType('macbook')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                deviceType === 'macbook' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>MacBook</span>
            </button>
            <button
              onClick={() => setDeviceType('browser')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                deviceType === 'browser' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Browser</span>
            </button>
          </div>
          <button
            onClick={() => setDeviceMockupOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-8 bg-neutral-950 flex items-center justify-center overflow-auto">
          {targetFrame ? (
            <div
              className={`relative shadow-2xl transition-all duration-200 ${
                deviceType === 'iphone'
                  ? 'w-[360px] h-[720px] rounded-[48px] p-3 bg-neutral-800 border-4 border-neutral-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
                  : deviceType === 'ipad'
                  ? 'w-[580px] h-[780px] rounded-[36px] p-4 bg-neutral-800 border-4 border-neutral-700'
                  : deviceType === 'macbook'
                  ? 'w-[720px] h-[480px] rounded-2xl pt-6 px-3 pb-3 bg-neutral-800 border-2 border-neutral-700'
                  : 'w-[720px] h-[480px] rounded-xl pt-7 bg-neutral-900 border border-neutral-700'
              }`}
            >
              {deviceType === 'iphone' && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20" />
              )}
              {deviceType === 'browser' && (
                <div className="absolute top-2 left-3 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              )}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-950">
                <svg viewBox={`0 0 ${targetFrame.width} ${targetFrame.height}`} className="w-full h-full">
                  <rect
                    width={targetFrame.width}
                    height={targetFrame.height}
                    fill={targetFrame.fill || '#090D16'}
                  />
                  {(targetFrame.children || []).map((child) => (
                    <CanvasElement
                      key={child.id}
                      element={child}
                      isSelected={false}
                      isHovered={false}
                      zoom={1}
                    />
                  ))}
                </svg>
              </div>
            </div>
          ) : (
            <div className="text-center text-neutral-500">No frame found to preview in device frame</div>
          )}
        </div>
      </div>
    </div>
  );
}