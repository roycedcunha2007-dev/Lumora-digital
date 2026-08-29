import React from 'react';
import { useEditor } from '../../context/EditorContext';
export function PrototypeWiresOverlay({ zoom = 1, onStartWireDrag }) {
  const {
    project,
    elements,
    selectedIds,
    activeTab,
    addPrototypeLink,
    removePrototypeLink,
  } = useEditor();
  if (activeTab !== 'prototype') return null;
  const prototypes = project.prototypes || [];
  const findElementBounds = (id) => {
    const root = elements.find((el) => el.id === id);
    if (root) return { x: root.x, y: root.y, width: root.width, height: root.height };
    for (const el of elements) {
      if (el.children) {
        const child = el.children.find((c) => c.id === id);
        if (child) {
          return {
            x: (el.x || 0) + (child.x || 0),
            y: (el.y || 0) + (child.y || 0),
            width: child.width,
            height: child.height,
          };
        }
      }
    }
    return null;
  };
  return (
    <g id="prototype-wires-overlay" className="select-none">
      {prototypes.map((proto) => {
        const fromBounds = findElementBounds(proto.fromElementId);
        const toBounds = findElementBounds(proto.toFrameId);
        if (!fromBounds || !toBounds) return null;
        const startX = fromBounds.x + fromBounds.width;
        const startY = fromBounds.y + fromBounds.height / 2;
        const endX = toBounds.x;
        const endY = toBounds.y + toBounds.height / 2;
        const dx = Math.abs(endX - startX) * 0.5;
        const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
        return (
          <g key={proto.id} className="cursor-pointer group">
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth={14 / zoom}
              onClick={() => removePrototypeLink(proto.id)}
            />
            <path
              d={pathD}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={2 / zoom}
              strokeDasharray={`${6 / zoom},${3 / zoom}`}
              className="group-hover:stroke-rose-400 transition-colors"
            />
            <circle
              cx={startX}
              cy={startY}
              r={4 / zoom}
              fill="#38BDF8"
              stroke="#09090B"
              strokeWidth={1.5 / zoom}
            />
            <circle
              cx={endX}
              cy={endY}
              r={4 / zoom}
              fill="#38BDF8"
              stroke="#09090B"
              strokeWidth={1.5 / zoom}
            />
          </g>
        );
      })}
      {selectedIds.length === 1 && (
        (() => {
          const selBounds = findElementBounds(selectedIds[0]);
          if (!selBounds) return null;
          const handleX = selBounds.x + selBounds.width;
          const handleY = selBounds.y + selBounds.height / 2;
          return (
            <g
              transform={`translate(${handleX}, ${handleY})`}
              className="cursor-crosshair group"
              onMouseDown={(e) => {
                e.stopPropagation();
                onStartWireDrag && onStartWireDrag(selectedIds[0], handleX, handleY, e);
              }}
            >
              <circle
                cx="0"
                cy="0"
                r={7 / zoom}
                fill="#38BDF8"
                stroke="#FFFFFF"
                strokeWidth={2 / zoom}
                className="group-hover:scale-125 transition-transform"
              />
              <text
                x="12"
                y="3"
                fill="#38BDF8"
                fontSize={9}
                fontFamily="Inter"
                fontWeight="600"
              >
                Connect
              </text>
            </g>
          );
        })()
      )}
    </g>
  );
}