import React, { useState, useEffect, useRef } from 'react';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hsvToRgb, rgbToHsv, formatGradientCss } from '../../utils/color';
import { COLOR_PALETTE_PRESETS, GRADIENT_PRESETS } from '../../constants/presets';
import { Pipette, Plus, Trash2, RotateCw } from 'lucide-react';
export function ColorPickerModal({
  value,
  onChange,
  onClose,
}) {
  const [mode, setMode] = useState(() => {
    if (typeof value === 'object' && value !== null && value.type) return value.type;
    return 'solid';
  });
  const [hsv, setHsv] = useState({ h: 240, s: 0.8, v: 0.95 });
  const [alpha, setAlpha] = useState(1);
  const [hexInput, setHexInput] = useState('#6366F1');
  const [gradientStops, setGradientStops] = useState(() => {
    if (typeof value === 'object' && value !== null && value.stops) return value.stops;
    return [
      { color: '#6366F1', offset: 0, opacity: 1 },
      { color: '#A855F7', offset: 100, opacity: 1 },
    ];
  });
  const [activeStopIdx, setActiveStopIdx] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(() => {
    if (typeof value === 'object' && value !== null && value.angle !== undefined) return value.angle;
    return 90;
  });
  const satValRef = useRef(null);
  useEffect(() => {
    if (typeof value === 'string') {
      const rgb = hexToRgb(value);
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
      setHexInput(value);
    } else if (typeof value === 'object' && value !== null && value.stops) {
      const activeStop = value.stops[activeStopIdx] || value.stops[0];
      if (activeStop) {
        const rgb = hexToRgb(activeStop.color);
        setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
        setHexInput(activeStop.color);
      }
    }
  }, [value, activeStopIdx]);
  const triggerChange = (newHex, newAlpha, newStops, newMode, newAngle) => {
    if (newMode === 'solid') {
      onChange && onChange(newHex);
    } else {
      onChange &&
        onChange({
          type: newMode,
          angle: newAngle !== undefined ? newAngle : gradientAngle,
          stops: newStops || gradientStops,
        });
    }
  };
  const handleSatValMouseDown = (e) => {
    const updateSatVal = (evt) => {
      if (!satValRef.current) return;
      const rect = satValRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, evt.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, evt.clientY - rect.top));
      const s = x / rect.width;
      const v = 1 - y / rect.height;
      const newHsv = { ...hsv, s, v };
      setHsv(newHsv);
      const rgb = hsvToRgb(newHsv.h, s, v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexInput(hex);
      if (mode === 'solid') {
        triggerChange(hex, alpha, null, 'solid');
      } else {
        const updatedStops = gradientStops.map((stop, idx) =>
          idx === activeStopIdx ? { ...stop, color: hex } : stop
        );
        setGradientStops(updatedStops);
        triggerChange(hex, alpha, updatedStops, mode);
      }
    };
    updateSatVal(e);
    const onMouseMove = (evt) => updateSatVal(evt);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  const handleHueChange = (e) => {
    const h = Number(e.target.value);
    const newHsv = { ...hsv, h };
    setHsv(newHsv);
    const rgb = hsvToRgb(h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexInput(hex);
    if (mode === 'solid') {
      triggerChange(hex, alpha, null, 'solid');
    } else {
      const updatedStops = gradientStops.map((stop, idx) =>
        idx === activeStopIdx ? { ...stop, color: hex } : stop
      );
      setGradientStops(updatedStops);
      triggerChange(hex, alpha, updatedStops, mode);
    }
  };
  const handleAlphaChange = (e) => {
    const a = Number(e.target.value);
    setAlpha(a);
  };
  const handleHexInputChange = (e) => {
    const valStr = e.target.value;
    setHexInput(valStr);
    if (/^#[0-9A-F]{6}$/i.test(valStr)) {
      const rgb = hexToRgb(valStr);
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
      if (mode === 'solid') {
        triggerChange(valStr, alpha, null, 'solid');
      } else {
        const updatedStops = gradientStops.map((stop, idx) =>
          idx === activeStopIdx ? { ...stop, color: valStr } : stop
        );
        setGradientStops(updatedStops);
        triggerChange(valStr, alpha, updatedStops, mode);
      }
    }
  };
  const handleEyedropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          setHexInput(hex);
          const rgb = hexToRgb(hex);
          setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
          triggerChange(hex, alpha, null, mode);
        }
      } catch (e) {}
    }
  };
  const pureHueRgb = hsvToRgb(hsv.h, 1, 1);
  const pureHueHex = rgbToHex(pureHueRgb.r, pureHueRgb.g, pureHueRgb.b);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-3 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl space-y-3 w-64 text-xs text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="flex bg-neutral-800 p-0.5 rounded-lg text-[11px] font-medium">
        <button
          onClick={() => {
            setMode('solid');
            triggerChange(hexInput, alpha, null, 'solid');
          }}
          className={`flex-1 py-1 rounded-md transition-colors ${mode === 'solid' ? 'bg-neutral-700 text-white font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Solid
        </button>
        <button
          onClick={() => {
            setMode('linear');
            triggerChange(hexInput, alpha, gradientStops, 'linear');
          }}
          className={`flex-1 py-1 rounded-md transition-colors ${mode === 'linear' ? 'bg-neutral-700 text-white font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Linear
        </button>
        <button
          onClick={() => {
            setMode('radial');
            triggerChange(hexInput, alpha, gradientStops, 'radial');
          }}
          className={`flex-1 py-1 rounded-md transition-colors ${mode === 'radial' ? 'bg-neutral-700 text-white font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Radial
        </button>
      </div>
      {mode !== 'solid' && (
        <div className="space-y-1.5 pt-1">
          <div
            className="h-5 rounded-md relative cursor-pointer border border-neutral-700/80 shadow-inner"
            style={{
              background: formatGradientCss({
                type: mode,
                angle: gradientAngle,
                stops: gradientStops,
              }),
            }}
          >
            {gradientStops.map((stop, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStopIdx(idx);
                }}
                className={`absolute top-0 bottom-0 w-3 -translate-x-1.5 rounded border-2 cursor-pointer transition-transform ${
                  activeStopIdx === idx ? 'border-white scale-110 shadow-lg z-10' : 'border-neutral-900'
                }`}
                style={{
                  left: `${stop.offset}%`,
                  backgroundColor: stop.color,
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <button
              onClick={() => {
                const newStop = { color: '#FFFFFF', offset: 50, opacity: 1 };
                const newStops = [...gradientStops, newStop].sort((a, b) => a.offset - b.offset);
                setGradientStops(newStops);
                setActiveStopIdx(newStops.indexOf(newStop));
                triggerChange(hexInput, alpha, newStops, mode);
              }}
              className="flex items-center gap-1 hover:text-white"
            >
              <Plus className="w-3 h-3" /> Add Stop
            </button>
            {mode === 'linear' && (
              <div className="flex items-center gap-1">
                <span>Angle:</span>
                <input
                  type="number"
                  value={gradientAngle}
                  onChange={(e) => {
                    const a = Number(e.target.value);
                    setGradientAngle(a);
                    triggerChange(hexInput, alpha, gradientStops, 'linear', a);
                  }}
                  className="w-10 px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-center text-[10px] outline-none"
                />
                <span>°</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        ref={satValRef}
        onMouseDown={handleSatValMouseDown}
        className="w-full h-32 rounded-lg relative cursor-crosshair overflow-hidden border border-neutral-700/80 shadow-inner"
        style={{
          backgroundColor: pureHueHex,
          backgroundImage: `
            linear-gradient(to right, #FFFFFF, transparent),
            linear-gradient(to top, #000000, transparent)
          `,
        }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: hexInput,
          }}
        />
      </div>
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="360"
          value={hsv.h}
          onChange={handleHueChange}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none"
          style={{
            background:
              'linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)',
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        {window.EyeDropper && (
          <button
            onClick={handleEyedropper}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 hover:text-white transition-colors"
            title="Pick color from screen"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="flex-1 flex items-center bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 gap-1">
          <span className="text-neutral-500 font-mono">#</span>
          <input
            type="text"
            value={hexInput.replace('#', '')}
            onChange={(e) => handleHexInputChange({ target: { value: `#${e.target.value}` } })}
            className="w-full bg-transparent text-neutral-100 font-mono text-xs outline-none uppercase"
          />
        </div>
        <div className="w-10 bg-neutral-800 border border-neutral-700 rounded-md px-1 py-1 text-center font-mono text-[11px] text-neutral-300">
          100%
        </div>
      </div>
      <div className="pt-2 border-t border-neutral-800 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-neutral-500">Presets</div>
        <div className="flex flex-wrap gap-1">
          {COLOR_PALETTE_PRESETS.slice(0, 14).map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                setHexInput(c);
                const rgb = hexToRgb(c);
                setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
                triggerChange(c, alpha, null, 'solid');
              }}
              className="w-4 h-4 rounded border border-neutral-700/80 hover:scale-125 transition-transform shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}