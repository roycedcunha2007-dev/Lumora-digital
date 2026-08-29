export function applyConstraints(child, oldFrame, newFrame) {
  if (!child || !oldFrame || !newFrame) return child;
  const deltaW = newFrame.width - oldFrame.width;
  const deltaH = newFrame.height - oldFrame.height;
  if (deltaW === 0 && deltaH === 0) return child;
  const constraints = child.constraints || { horizontal: 'left', vertical: 'top' };
  let { x = 0, y = 0, width = 50, height = 50 } = child;
  switch (constraints.horizontal) {
    case 'right':
      x += deltaW;
      break;
    case 'center':
      x += deltaW / 2;
      break;
    case 'left_right':
      width = Math.max(10, width + deltaW);
      break;
    case 'scale': {
      const scaleX = newFrame.width / Math.max(oldFrame.width, 1);
      x = x * scaleX;
      width = width * scaleX;
      break;
    }
    case 'left':
    default:
      break;
  }
  switch (constraints.vertical) {
    case 'bottom':
      y += deltaH;
      break;
    case 'center':
      y += deltaH / 2;
      break;
    case 'top_bottom':
      height = Math.max(10, height + deltaH);
      break;
    case 'scale': {
      const scaleY = newFrame.height / Math.max(oldFrame.height, 1);
      y = y * scaleY;
      height = height * scaleY;
      break;
    }
    case 'top':
    default:
      break;
  }
  return {
    ...child,
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}