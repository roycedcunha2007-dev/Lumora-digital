import React from 'react';

export function GridOverlay({ pan, zoom, gridType = 'dots', showGrid = true }) {
  if (!showGrid) return null;
  const baseSize = 24;
  const scaledSize = baseSize * zoom;
  if (scaledSize < 6) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {gridType === 'dots' && (
          <pattern
            id="canvas-grid-pattern-dots"
            x={pan.x % scaledSize}
            y={pan.y % scaledSize}
            width={scaledSize}
            height={scaledSize}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={scaledSize / 2}
              cy={scaledSize / 2}
              r={Math.max(0.75, Math.min(1.5, zoom))}
              className="fill-neutral-500/20"
            />
          </pattern>
        )}
        {gridType === 'grid' && (
          <pattern
            id="canvas-grid-pattern-lines"
            x={pan.x % scaledSize}
            y={pan.y % scaledSize}
            width={scaledSize}
            height={scaledSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${scaledSize} 0 L 0 0 0 ${scaledSize}`}
              fill="none"
              className="stroke-neutral-500/10"
              strokeWidth="1"
            />
          </pattern>
        )}
        {gridType === 'layout' && (
          <pattern
            id="canvas-grid-pattern-layout"
            x={pan.x % (scaledSize * 4)}
            y={pan.y % (scaledSize * 4)}
            width={scaledSize * 4}
            height={scaledSize * 4}
            patternUnits="userSpaceOnUse"
          >
            <rect width={scaledSize * 3} height={scaledSize * 4} fill="rgba(99, 102, 241, 0.03)" />
            <line x1={scaledSize * 3} y1="0" x2={scaledSize * 3} y2={scaledSize * 4} stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
          </pattern>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={
          gridType === 'dots'
            ? 'url(#canvas-grid-pattern-dots)'
            : gridType === 'grid'
            ? 'url(#canvas-grid-pattern-lines)'
            : 'url(#canvas-grid-pattern-layout)'
        }
      />
    </svg>
  );
}