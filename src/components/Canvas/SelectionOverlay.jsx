import React from 'react';
export function SelectionOverlay({
  bounds,
  zoom,
  onResizeStart,
  onRotateStart,
  isLocked = false,
}) {
  if (!bounds) return null;
  const { x, y, width, height, rotation = 0 } = bounds;
  const handleSize = Math.max(7, 7 / zoom);
  const handleOffset = handleSize / 2;
  const cx = width / 2;
  const cy = height / 2;
  const handles = [
    { id: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { id: 'n', x: cx, y: 0, cursor: 'ns-resize' },
    { id: 'ne', x: width, y: 0, cursor: 'nesw-resize' },
    { id: 'e', x: width, y: cy, cursor: 'ew-resize' },
    { id: 'se', x: width, y: height, cursor: 'nwse-resize' },
    { id: 's', x: cx, y: height, cursor: 'ns-resize' },
    { id: 'sw', x: 0, y: height, cursor: 'nesw-resize' },
    { id: 'w', x: 0, y: cy, cursor: 'ew-resize' },
  ];
  return (
    <g
      id="selection-bounding-overlay"
      transform={`translate(${x}, ${y}) rotate(${rotation} ${cx} ${cy})`}
      className="pointer-events-auto"
    >
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke="#6366F1"
        strokeWidth={1.5 / zoom}
        className="pointer-events-none"
      />
      {!isLocked && (
        <g
          transform={`translate(${cx}, ${-24 / zoom})`}
          className="cursor-crosshair group"
          onMouseDown={(e) => {
            e.stopPropagation();
            onRotateStart && onRotateStart(e);
          }}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={24 / zoom}
            stroke="#6366F1"
            strokeWidth={1 / zoom}
            className="pointer-events-none"
          />
          <circle
            cx="0"
            cy="0"
            r={handleSize / 1.3}
            fill="#FFFFFF"
            stroke="#6366F1"
            strokeWidth={1.5 / zoom}
            className="hover:scale-125 transition-transform"
          />
        </g>
      )}
      {!isLocked &&
        handles.map((h) => (
          <rect
            key={h.id}
            x={h.x - handleOffset}
            y={h.y - handleOffset}
            width={handleSize}
            height={handleSize}
            fill="#FFFFFF"
            stroke="#6366F1"
            strokeWidth={1.5 / zoom}
            style={{ cursor: h.cursor }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart && onResizeStart(h.id, e);
            }}
          />
        ))}
      <g
        transform={`translate(${cx}, ${height + 16 / zoom})`}
        className="pointer-events-none select-none"
      >
        <rect
          x="-35"
          y="-8"
          width="70"
          height="16"
          rx="3"
          fill="#1E1B4B"
          stroke="#6366F1"
          strokeWidth="0.75"
        />
        <text
          x="0"
          y="3.5"
          fill="#E0E7FF"
          fontSize={9}
          fontFamily="monospace"
          fontWeight="600"
          textAnchor="middle"
        >
          {Math.round(width)} × {Math.round(height)}
        </text>
      </g>
    </g>
  );
}