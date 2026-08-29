import React from 'react';
import { useEditor } from '../../context/EditorContext';
export function BlueprintOverlay({ zoom = 1 }) {
  const { elements, selectedIds, setSelectedIds } = useEditor();
  const renderBlueprintNode = (el, parentX = 0, parentY = 0) => {
    const absX = parentX + (el.x || 0);
    const absY = parentY + (el.y || 0);
    const w = el.width || 50;
    const h = el.height || 50;
    const isSelected = selectedIds.includes(el.id);
    return (
      <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedIds([el.id]); }}>
        <rect
          x={absX}
          y={absY}
          width={w}
          height={h}
          rx={el.cornerRadius || 0}
          fill="rgba(56, 189, 248, 0.04)"
          stroke={isSelected ? '#6366F1' : '#38BDF8'}
          strokeWidth={1 / zoom}
          strokeDasharray={`${4 / zoom},${2 / zoom}`}
        />
        <g transform={`translate(${absX + 4}, ${absY + 12})`} className="pointer-events-none select-none">
          <rect x="0" y="-10" width={Math.min(w, el.name.length * 6 + 12)} height="12" fill="#0C4A6E" rx="2" />
          <text x="4" y="-1" fill="#BAE6FD" fontSize={8} fontFamily="monospace" fontWeight="600">
            {el.name}
          </text>
        </g>
        {Array.isArray(el.children) && el.children.map((c) => renderBlueprintNode(c, absX, absY))}
      </g>
    );
  };
  return (
    <g id="blueprint-schematic-overlay" className="pointer-events-auto select-none">
      {elements.map((el) => renderBlueprintNode(el, 0, 0))}
    </g>
  );
}