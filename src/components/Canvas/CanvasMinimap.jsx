import React, { useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { getSelectionBoundingBox } from '../../utils/math';
export function CanvasMinimap({ containerRect }) {
  const {
    elements,
    pan,
    setPan,
    zoom,
    selectedIds,
  } = useEditor();
  const mapRef = useRef(null);
  if (elements.length === 0 || !containerRect) return null;
  const bounds = getSelectionBoundingBox(elements) || { x: 0, y: 0, width: 1000, height: 800 };
  const pad = 100;
  const worldMinX = bounds.x - pad;
  const worldMinY = bounds.y - pad;
  const worldW = bounds.width + pad * 2;
  const worldH = bounds.height + pad * 2;
  const mapW = 140;
  const mapH = 90;
  const scale = Math.min(mapW / worldW, mapH / worldH);
  const viewX = (-pan.x / zoom - worldMinX) * scale;
  const viewY = (-pan.y / zoom - worldMinY) * scale;
  const viewW = (containerRect.width / zoom) * scale;
  const viewH = (containerRect.height / zoom) * scale;
  const handleMinimapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const targetWorldX = clickX / scale + worldMinX;
    const targetWorldY = clickY / scale + worldMinY;
    setPan({
      x: containerRect.width / 2 - targetWorldX * zoom,
      y: containerRect.height / 2 - targetWorldY * zoom,
    });
  };
  return (
    <div
      ref={mapRef}
      onClick={handleMinimapClick}
      style={{ width: `${mapW}px`, height: `${mapH}px` }}
      className="absolute bottom-4 right-4 z-20 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl overflow-hidden shadow-2xl cursor-crosshair select-none group"
    >
      <svg className="w-full h-full">
        {elements.map((el) => {
          const ex = (el.x - worldMinX) * scale;
          const ey = (el.y - worldMinY) * scale;
          const ew = Math.max(2, (el.width || 50) * scale);
          const eh = Math.max(2, (el.height || 50) * scale);
          const isSel = selectedIds.includes(el.id);
          return (
            <rect
              key={el.id}
              x={ex}
              y={ey}
              width={ew}
              height={eh}
              rx="1"
              fill={isSel ? '#6366F1' : el.type === 'frame' ? '#334155' : '#475569'}
              opacity={isSel ? 0.9 : 0.6}
            />
          );
        })}
        <rect
          x={viewX}
          y={viewY}
          width={Math.max(10, viewW)}
          height={Math.max(10, viewH)}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#6366F1"
          strokeWidth="1.5"
          rx="2"
        />
      </svg>
    </div>
  );
}