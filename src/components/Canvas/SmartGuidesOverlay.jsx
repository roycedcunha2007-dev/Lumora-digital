import React from 'react';
export function SmartGuidesOverlay({
  guides = [],
  distanceBadges = [],
  altMeasurement = null,
  zoom = 1,
}) {
  return (
    <g id="smart-guides-overlay" className="pointer-events-none select-none">
      {guides.map((g, idx) => {
        if (g.type === 'v') {
          return (
            <line
              key={`g_v_${idx}`}
              x1={g.pos}
              y1={g.from - 50}
              x2={g.pos}
              y2={g.to + 50}
              stroke="#EC4899"
              strokeWidth={1 / zoom}
              strokeDasharray={`${3 / zoom},${3 / zoom}`}
            />
          );
        } else {
          return (
            <line
              key={`g_h_${idx}`}
              x1={g.from - 50}
              y1={g.pos}
              x2={g.to + 50}
              y2={g.pos}
              stroke="#EC4899"
              strokeWidth={1 / zoom}
              strokeDasharray={`${3 / zoom},${3 / zoom}`}
            />
          );
        }
      })}
      {distanceBadges.map((badge, idx) => {
        const { x, y, distance, line } = badge;
        return (
          <g key={`dist_${idx}`}>
            {line && (
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#EC4899"
                strokeWidth={1 / zoom}
              />
            )}
            <g transform={`translate(${x}, ${y})`}>
              <rect
                x="-16"
                y="-8"
                width="32"
                height="16"
                rx="3"
                fill="#831843"
                stroke="#EC4899"
                strokeWidth={0.75}
              />
              <text
                x="0"
                y="3.5"
                fill="#FDF2F8"
                fontSize={9}
                fontFamily="monospace"
                fontWeight="700"
                textAnchor="middle"
              >
                {distance}
              </text>
            </g>
          </g>
        );
      })}
      {altMeasurement && (
        <g id="alt-measurement-hud">
          <rect
            x={altMeasurement.bounds.tgt.x}
            y={altMeasurement.bounds.tgt.y}
            width={altMeasurement.bounds.tgt.width}
            height={altMeasurement.bounds.tgt.height}
            fill="none"
            stroke="#F43F5E"
            strokeWidth={1.5 / zoom}
          />
        </g>
      )}
    </g>
  );
}