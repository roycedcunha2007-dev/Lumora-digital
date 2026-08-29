import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Type, Sparkles } from 'lucide-react';

export function TextPanel({ searchQuery = '' }) {
  const {
    addElement,
    setSelectedIds,
    showToast,
    pan,
    zoom,
  } = useEditor();

  const addTextElement = (text, fontSize, fontWeight, fontFamily = 'Inter', fill = '#FFFFFF') => {
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 300;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    const newText = {
      id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: text,
      type: 'text',
      x: Math.round(cx - 150),
      y: Math.round(cy - 25),
      width: Math.max(200, text.length * fontSize * 0.6),
      height: Math.round(fontSize * 1.5),
      text: text,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fill: fill,
      textAlign: 'left',
      lineHeight: 1.3,
      letterSpacing: 0,
      rotation: 0,
      opacity: 1,
    };

    addElement(newText);
    setSelectedIds([newText.id]);
    showToast(`Added ${text}`, 'success');
  };

  const textPresets = [
    {
      label: 'Add a heading',
      preview: 'Heading',
      fontSize: 36,
      fontWeight: 700,
      fontFamily: 'Inter',
      className: 'text-2xl font-extrabold',
    },
    {
      label: 'Add a subheading',
      preview: 'Subheading',
      fontSize: 22,
      fontWeight: 600,
      fontFamily: 'Inter',
      className: 'text-lg font-semibold text-neutral-200',
    },
    {
      label: 'Add a little bit of body text',
      preview: 'Body text',
      fontSize: 15,
      fontWeight: 400,
      fontFamily: 'Inter',
      className: 'text-xs text-neutral-400',
    },
  ];

  const fontPairings = [
    {
      id: 'pair1',
      title: 'Modern Sans',
      heading: 'CREATIVE STUDIO',
      body: 'Transforming visual experiences through design and craft.',
      hFont: 'Inter',
      bFont: 'Inter',
      hWeight: 800,
      bWeight: 400,
    },
    {
      id: 'pair2',
      title: 'Editorial Elegance',
      heading: 'Summer Collection',
      body: 'Curated essentials crafted with sustainable materials and timeless precision.',
      hFont: 'Playfair Display',
      bFont: 'Inter',
      hWeight: 700,
      bWeight: 400,
    },
    {
      id: 'pair3',
      title: 'Tech Minimalist',
      heading: 'DECIMALS & CODE',
      body: 'High frequency data architecture built for zero latency systems.',
      hFont: 'Space Mono',
      bFont: 'Space Mono',
      hWeight: 700,
      bWeight: 400,
    },
    {
      id: 'pair4',
      title: 'Bold Statement',
      heading: 'MEGA SALE 50% OFF',
      body: 'Limited time promotion across all digital design assets.',
      hFont: 'Montserrat',
      bFont: 'Inter',
      hWeight: 900,
      bWeight: 500,
    },
  ];

  const addFontPairing = (pair) => {
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 300;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    const headingEl = {
      id: `text_${Date.now()}_h`,
      name: pair.heading,
      type: 'text',
      x: Math.round(cx - 180),
      y: Math.round(cy - 50),
      width: 360,
      height: 48,
      text: pair.heading,
      fontFamily: pair.hFont,
      fontSize: 28,
      fontWeight: pair.hWeight,
      fill: '#FFFFFF',
      textAlign: 'left',
      lineHeight: 1.2,
      opacity: 1,
    };

    const bodyEl = {
      id: `text_${Date.now()}_b`,
      name: pair.body,
      type: 'text',
      x: Math.round(cx - 180),
      y: Math.round(cy + 10),
      width: 360,
      height: 40,
      text: pair.body,
      fontFamily: pair.bFont,
      fontSize: 14,
      fontWeight: pair.bWeight,
      fill: '#A1A1AA',
      textAlign: 'left',
      lineHeight: 1.4,
      opacity: 1,
    };

    addElement(headingEl);
    addElement(bodyEl);
    setSelectedIds([headingEl.id, bodyEl.id]);
    showToast(`Added ${pair.title} typography pairing`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-4 overflow-y-auto select-none text-xs">
      <div className="space-y-2">
        <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
          Default Text Styles
        </div>
        <div className="space-y-1.5">
          {textPresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => addTextElement(preset.preview, preset.fontSize, preset.fontWeight, preset.fontFamily)}
              className="p-3 bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800/80 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98 group flex flex-col justify-center"
            >
              <div className={preset.className}>{preset.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            Curated Font Pairings
          </span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        <div className="space-y-2">
          {fontPairings.map((pair) => (
            <div
              key={pair.id}
              onClick={() => addFontPairing(pair)}
              className="p-3.5 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98 group space-y-1"
            >
              <div className="text-[10px] text-indigo-400 font-mono font-medium">{pair.title}</div>
              <div className="font-bold text-sm text-white truncate" style={{ fontFamily: pair.hFont }}>
                {pair.heading}
              </div>
              <div className="text-[11px] text-neutral-400 line-clamp-2" style={{ fontFamily: pair.bFont }}>
                {pair.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
