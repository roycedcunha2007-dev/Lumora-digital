import React from 'react';
import { formatGradientCss } from '../../utils/color';
import { ChartRenderer } from './ChartRenderer';

export function CanvasElement({
  element,
  isSelected,
  isHovered,
  onSelect,
  onDoubleClick,
  zoom,
}) {
  if (!element || element.hidden) return null;

  const {
    id,
    type,
    name,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    rotation = 0,
    opacity = 1,
    fill = '#6366F1',
    stroke = null,
    strokeWidth = 0,
    cornerRadius = 0,
    blur = 0,
    shadows = [],
    children = [],
    isMasterComponent = false,
  } = element;

  const cx = width / 2;
  const cy = height / 2;

  let filterStr = '';
  if (blur > 0) filterStr += `blur(${blur}px) `;
  if (type === 'image') {
    if (element.brightness !== undefined && element.brightness !== 100) filterStr += `brightness(${element.brightness}%) `;
    if (element.contrast !== undefined && element.contrast !== 100) filterStr += `contrast(${element.contrast}%) `;
    if (element.saturation !== undefined && element.saturation !== 100) filterStr += `saturate(${element.saturation}%) `;
    if (element.grayscale) filterStr += `grayscale(${element.grayscale}%) `;
  }

  const isGradient = typeof fill === 'object' && fill !== null && fill.stops;
  const gradientId = isGradient ? `grad_${id}` : null;
  const fillValue = isGradient ? `url(#${gradientId})` : (fill || 'none');

  const hasShadows = Array.isArray(shadows) && shadows.length > 0;
  const shadowFilterId = hasShadows ? `shadow_${id}` : null;
  const imageClipId = `clip_img_${id}`;

  const renderShapeGeometry = () => {
    switch (type) {
      case 'chart':
        return <ChartRenderer element={element} />;
      case 'frame':
        return (
          <rect
            width={width}
            height={height}
            rx={cornerRadius}
            fill={fillValue}
            stroke={stroke || '#1E293B'}
            strokeWidth={strokeWidth || 1}
          />
        );
      case 'rectangle':
      case 'rounded_rect':
        return (
          <rect
            width={width}
            height={height}
            rx={type === 'rounded_rect' ? (cornerRadius || 16) : cornerRadius}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
      case 'ellipse':
        return (
          <ellipse
            cx={cx}
            cy={cy}
            rx={width / 2}
            ry={height / 2}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
      case 'triangle':
        return (
          <polygon
            points={`${cx},0 ${width},${height} 0,${height}`}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
      case 'polygon': {
        const sides = 6;
        const pts = [];
        const r = Math.min(width, height) / 2;
        for (let i = 0; i < sides; i++) {
          const a = (i * 2 * Math.PI) / sides - Math.PI / 2;
          pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
      }
      case 'star': {
        const pts = [];
        const numPoints = element.points || 5;
        const rOuter = Math.min(width, height) / 2;
        const rInner = rOuter * (element.innerRadiusRatio || 0.45);
        for (let i = 0; i < numPoints * 2; i++) {
          const r = i % 2 === 0 ? rOuter : rInner;
          const a = (i * Math.PI) / numPoints - Math.PI / 2;
          pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
      }
      case 'line':
        return (
          <line
            x1="0"
            y1="0"
            x2={width}
            y2={height}
            stroke={typeof fill === 'string' && fill !== 'none' ? fill : '#FFFFFF'}
            strokeWidth={strokeWidth || 2}
            strokeLinecap="round"
          />
        );
      case 'arrow':
        return (
          <g>
            <line
              x1="0"
              y1="0"
              x2={width}
              y2={height}
              stroke={typeof fill === 'string' && fill !== 'none' ? fill : '#FFFFFF'}
              strokeWidth={strokeWidth || 2}
              strokeLinecap="round"
            />
            <polygon
              points={`${width},${height} ${width - 10},${height - 4} ${width - 8},${height} ${width - 10},${height + 4}`}
              fill={typeof fill === 'string' && fill !== 'none' ? fill : '#FFFFFF'}
            />
          </g>
        );
      case 'text':
        return (
          <text
            x={element.textAlign === 'center' ? cx : element.textAlign === 'right' ? width : 0}
            y={(element.fontSize || 16) * 0.9}
            fontFamily={element.fontFamily || 'Inter'}
            fontSize={element.fontSize || 16}
            fontWeight={element.fontWeight || 400}
            letterSpacing={element.letterSpacing ? `${element.letterSpacing}px` : undefined}
            fill={typeof fill === 'string' ? fill : '#FFFFFF'}
            textAnchor={element.textAlign === 'center' ? 'middle' : element.textAlign === 'right' ? 'end' : 'start'}
            className="select-none pointer-events-none"
          >
            {element.text || 'Text'}
          </text>
        );
      case 'image': {
        const imgSrc = element.src || element.dataUrl;
        if (!imgSrc) {
          return (
            <g>
              <rect width={width} height={height} rx={cornerRadius} fill="#18181B" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 4" />
              <text x={cx} y={cy} fill="#71717A" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Image not found</text>
            </g>
          );
        }
        return (
          <g clipPath={cornerRadius > 0 ? `url(#${imageClipId})` : undefined}>
            <image
              href={imgSrc}
              xlinkHref={imgSrc}
              width={width}
              height={height}
              preserveAspectRatio={
                element.objectFit === 'contain'
                  ? 'xMidYMid meet'
                  : element.objectFit === 'fill'
                  ? 'none'
                  : 'xMidYMid slice'
              }
            />
            {stroke && strokeWidth > 0 && (
              <rect
                width={width}
                height={height}
                rx={cornerRadius}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            )}
          </g>
        );
      }
      case 'pen_path':
        return (
          <path
            d={element.d || ''}
            fill={fillValue}
            stroke={stroke || '#38BDF8'}
            strokeWidth={strokeWidth || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'pencil_stroke':
        return (
          <path
            d={element.d || ''}
            fill="none"
            stroke={stroke || '#A855F7'}
            strokeWidth={strokeWidth || 3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'group':
        return null;
      default:
        return (
          <rect
            width={width}
            height={height}
            fill={fillValue}
            stroke={stroke || 'none'}
            strokeWidth={strokeWidth}
          />
        );
    }
  };

  return (
    <g
      id={`canvas-element-${id}`}
      transform={`translate(${x}, ${y}) rotate(${rotation} ${cx} ${cy})`}
      opacity={opacity}
      style={{ filter: filterStr || undefined }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect && onSelect(element, e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick && onDoubleClick(element, e);
      }}
      className="cursor-pointer"
    >
      <defs>
        {type === 'image' && cornerRadius > 0 && (
          <clipPath id={imageClipId}>
            <rect width={width} height={height} rx={cornerRadius} />
          </clipPath>
        )}
        {isGradient && fill.type === 'radial' && (
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            {fill.stops.map((s, idx) => (
              <stop key={idx} offset={`${s.offset}%`} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
            ))}
          </radialGradient>
        )}
        {isGradient && fill.type !== 'radial' && (
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${fill.angle || 90} 0.5 0.5)`}
          >
            {fill.stops.map((s, idx) => (
              <stop key={idx} offset={`${s.offset}%`} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
            ))}
          </linearGradient>
        )}
        {hasShadows && (
          <filter id={shadowFilterId} x="-30%" y="-30%" width="160%" height="160%">
            {shadows.map((s, idx) => (
              <feDropShadow
                key={idx}
                dx={s.x || 0}
                dy={s.y || 4}
                stdDeviation={(s.blur || 8) / 2}
                floodColor={s.color || 'rgba(0,0,0,0.3)'}
              />
            ))}
          </filter>
        )}
      </defs>

      {type === 'frame' && (
        <g transform="translate(0, -20)" className="pointer-events-none select-none">
          <text
            x="0"
            y="12"
            fill="#94A3B8"
            fontSize={Math.max(11, 11 / zoom)}
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            className="select-none"
          >
            {name}
          </text>
          <text
            x={width}
            y="12"
            fill="#64748B"
            fontSize={Math.max(10, 10 / zoom)}
            fontFamily="monospace"
            textAnchor="end"
            className="select-none"
          >
            {width} × {height}
          </text>
        </g>
      )}

      {isMasterComponent && (
        <g transform="translate(0, -20)" className="pointer-events-none select-none">
          <text
            x="0"
            y="12"
            fill="#C084FC"
            fontSize={Math.max(11, 11 / zoom)}
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            ❖ {name}
          </text>
        </g>
      )}

      <g filter={hasShadows ? `url(#${shadowFilterId})` : undefined}>
        {renderShapeGeometry()}
      </g>

      {children && children.length > 0 && (
        <g>
          {children.map((child) => (
            <CanvasElement
              key={child.id}
              element={child}
              isSelected={false}
              isHovered={false}
              onSelect={onSelect}
              onDoubleClick={onDoubleClick}
              zoom={zoom}
            />
          ))}
        </g>
      )}
    </g>
  );
}