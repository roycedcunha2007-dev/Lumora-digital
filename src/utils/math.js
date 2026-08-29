export function screenToCanvas(screenX, screenY, pan, zoom, containerRect) {
  const relX = screenX - (containerRect ? containerRect.left : 0);
  const relY = screenY - (containerRect ? containerRect.top : 0);
  return {
    x: (relX - pan.x) / zoom,
    y: (relY - pan.y) / zoom,
  };
}
export function canvasToScreen(canvasX, canvasY, pan, zoom, containerRect) {
  const left = containerRect ? containerRect.left : 0;
  const top = containerRect ? containerRect.top : 0;
  return {
    x: canvasX * zoom + pan.x + left,
    y: canvasY * zoom + pan.y + top,
  };
}
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
export function roundTo(val, step = 1) {
  return Math.round(val / step) * step;
}
export function snapValue(val, snapGrid = 8, enabled = true) {
  if (!enabled || snapGrid <= 0) return val;
  return Math.round(val / snapGrid) * snapGrid;
}
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}
export function rotatePoint(x, y, cx, cy, angleDeg) {
  if (!angleDeg) return { x, y };
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - cx;
  const dy = y - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}
export function getSelectionBoundingBox(elements) {
  if (!elements || elements.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  elements.forEach((el) => {
    const x = el.x || 0;
    const y = el.y || 0;
    const w = el.width || 0;
    const h = el.height || 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });
  return {
    x: minX,
    y: minY,
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1),
    rotation: elements.length === 1 ? elements[0].rotation || 0 : 0,
  };
}
export function calculateResizeTransform(handle, initialBounds, deltaX, deltaY, lockAspect = false) {
  let { x, y, width, height } = initialBounds;
  const initialAspect = initialBounds.width / Math.max(initialBounds.height, 1);
  let newX = x;
  let newY = y;
  let newW = width;
  let newH = height;
  switch (handle) {
    case 'se':
      newW = Math.max(10, width + deltaX);
      newH = lockAspect ? newW / initialAspect : Math.max(10, height + deltaY);
      break;
    case 's':
      newH = Math.max(10, height + deltaY);
      break;
    case 'sw':
      newW = Math.max(10, width - deltaX);
      newH = lockAspect ? newW / initialAspect : Math.max(10, height + deltaY);
      newX = x + (width - newW);
      break;
    case 'w':
      newW = Math.max(10, width - deltaX);
      newX = x + (width - newW);
      break;
    case 'nw':
      newW = Math.max(10, width - deltaX);
      newH = lockAspect ? newW / initialAspect : Math.max(10, height - deltaY);
      newX = x + (width - newW);
      newY = y + (height - newH);
      break;
    case 'n':
      newH = Math.max(10, height - deltaY);
      newY = y + (height - newH);
      break;
    case 'ne':
      newW = Math.max(10, width + deltaX);
      newH = lockAspect ? newW / initialAspect : Math.max(10, height - deltaY);
      newY = y + (height - newH);
      break;
    case 'e':
      newW = Math.max(10, width + deltaX);
      break;
    default:
      break;
  }
  return {
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.round(newW),
    height: Math.round(newH),
  };
}
export function generateId(prefix = 'el') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
}