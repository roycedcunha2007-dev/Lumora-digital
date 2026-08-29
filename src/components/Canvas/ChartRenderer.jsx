import React from 'react';
export function ChartRenderer({ element }) {
  const {
    width = 300,
    height = 200,
    chartType = 'bar',
    chartData = [],
    fill = '#6366F1',
    cornerRadius = 12,
  } = element;
  const padX = 40;
  const padY = 30;
  const innerW = Math.max(10, width - padX * 2);
  const innerH = Math.max(10, height - padY * 2);
  const values = chartData.map((d) => Number(d.value) || 0);
  const maxVal = Math.max(...values, 10);
  if (chartType === 'donut' || chartType === 'pie') {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(innerW, innerH) / 2;
    const innerRadius = chartType === 'donut' ? radius * 0.55 : 0;
    const totalVal = values.reduce((sum, v) => sum + v, 0) || 1;
    let currentAngle = -Math.PI / 2;
    const slices = chartData.map((item, idx) => {
      const sliceAngle = ((Number(item.value) || 0) / totalVal) * (Math.PI * 2);
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const ix1 = cx + innerRadius * Math.cos(endAngle);
      const iy1 = cy + innerRadius * Math.sin(endAngle);
      const ix2 = cx + innerRadius * Math.cos(startAngle);
      const iy2 = cy + innerRadius * Math.sin(startAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathD = innerRadius > 0
        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const sliceColor = item.color || ['#6366F1', '#38BDF8', '#EC4899', '#10B981', '#F59E0B', '#A855F7'][idx % 6];
      return <path key={idx} d={pathD} fill={sliceColor} stroke="#0B0F19" strokeWidth="2" />;
    });
    return (
      <g>
        <rect width={width} height={height} rx={cornerRadius} fill="#0B0F19" stroke="#1E293B" strokeWidth="1" />
        {slices}
      </g>
    );
  }
  if (chartType === 'line' || chartType === 'area') {
    const stepX = chartData.length > 1 ? innerW / (chartData.length - 1) : innerW;
    const points = chartData.map((d, idx) => {
      const px = padX + idx * stepX;
      const py = padY + innerH - (Number(d.value) / maxVal) * innerH;
      return { x: px, y: py, label: d.label, val: d.value };
    });
    const lineD = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
    const areaD = `${lineD} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`;
    return (
      <g>
        <rect width={width} height={height} rx={cornerRadius} fill="#0B0F19" stroke="#1E293B" strokeWidth="1" />
        <line x1={padX} y1={padY + innerH} x2={padX + innerW} y2={padY + innerH} stroke="#334155" strokeWidth="1" />
        <path d={areaD} fill="rgba(56, 189, 248, 0.15)" />
        <path d={lineD} fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4" fill="#38BDF8" stroke="#0B0F19" strokeWidth="2" />
            <text x={p.x} y={padY + innerH + 16} fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
      </g>
    );
  }
  const barWidth = Math.max(12, (innerW / chartData.length) * 0.6);
  const gap = innerW / chartData.length;
  return (
    <g>
      <rect width={width} height={height} rx={cornerRadius} fill="#0B0F19" stroke="#1E293B" strokeWidth="1" />
      <line x1={padX} y1={padY + innerH} x2={padX + innerW} y2={padY + innerH} stroke="#334155" strokeWidth="1" />
      {chartData.map((d, idx) => {
        const barH = (Number(d.value) / maxVal) * innerH;
        const bx = padX + idx * gap + (gap - barWidth) / 2;
        const by = padY + innerH - barH;
        return (
          <g key={idx}>
            <rect x={bx} y={by} width={barWidth} height={barH} rx="4" fill={typeof fill === 'string' ? fill : '#6366F1'} />
            <text x={bx + barWidth / 2} y={padY + innerH + 16} fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              {d.label}
            </text>
            <text x={bx + barWidth / 2} y={by - 4} fill="#F8FAFC" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {d.value}
            </text>
          </g>
        );
      })}
    </g>
  );
}