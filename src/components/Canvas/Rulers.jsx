import React from 'react';
export function Rulers({ pan, zoom, containerRect, mousePos }) {
  if (!containerRect) return null;
  const width = containerRect.width;
  const height = containerRect.height;
  const rulerSize = 18;
  const getTopTicks = () => {
    const ticks = [];
    const step = zoom >= 2 ? 10 : zoom >= 0.5 ? 50 : 100;
    const startX = -pan.x / zoom;
    const endX = (width - pan.x) / zoom;
    const firstTick = Math.floor(startX / step) * step;
    for (let x = firstTick; x <= endX; x += step) {
      const screenX = x * zoom + pan.x;
      const isMajor = x % (step * 2) === 0;
      ticks.push(
        <g key={`top_${x}`} transform={`translate(${screenX}, 0)`}>
          <line
            x1="0"
            y1={isMajor ? rulerSize - 8 : rulerSize - 4}
            x2="0"
            y2={rulerSize}
            stroke="#525252"
            strokeWidth="1"
          />
          {isMajor && (
            <text x="3" y="9" fill="#737373" fontSize="9" fontFamily="monospace">
              {Math.round(x)}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };
  const getLeftTicks = () => {
    const ticks = [];
    const step = zoom >= 2 ? 10 : zoom >= 0.5 ? 50 : 100;
    const startY = -pan.y / zoom;
    const endY = (height - pan.y) / zoom;
    const firstTick = Math.floor(startY / step) * step;
    for (let y = firstTick; y <= endY; y += step) {
      const screenY = y * zoom + pan.y;
      const isMajor = y % (step * 2) === 0;
      ticks.push(
        <g key={`left_${y}`} transform={`translate(0, ${screenY})`}>
          <line
            x1={isMajor ? rulerSize - 8 : rulerSize - 4}
            y1="0"
            x2={rulerSize}
            y2="0"
            stroke="#525252"
            strokeWidth="1"
          />
          {isMajor && (
            <text
              x="3"
              y="-3"
              fill="#737373"
              fontSize="9"
              fontFamily="monospace"
              transform="rotate(-90)"
            >
              {Math.round(y)}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      <div
        className="absolute top-0 left-0 bg-neutral-900 border-r border-b border-neutral-800 flex items-center justify-center text-[9px] text-neutral-600 font-mono"
        style={{ width: `${rulerSize}px`, height: `${rulerSize}px` }}
      >
        px
      </div>
      <svg
        className="absolute top-0 left-[18px] h-[18px] bg-neutral-900 border-b border-neutral-800"
        style={{ width: `calc(100% - ${rulerSize}px)` }}
      >
        {getTopTicks()}
        {mousePos && (
          <line
            x1={mousePos.x - rulerSize}
            y1="0"
            x2={mousePos.x - rulerSize}
            y2={rulerSize}
            stroke="#6366F1"
            strokeWidth="1.5"
          />
        )}
      </svg>
      <svg
        className="absolute top-[18px] left-0 w-[18px] bg-neutral-900 border-r border-neutral-800"
        style={{ height: `calc(100% - ${rulerSize}px)` }}
      >
        {getLeftTicks()}
        {mousePos && (
          <line
            x1="0"
            y1={mousePos.y - rulerSize}
            x2={rulerSize}
            y2={mousePos.y - rulerSize}
            stroke="#6366F1"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
}