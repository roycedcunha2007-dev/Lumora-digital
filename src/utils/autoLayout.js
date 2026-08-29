export function computeAutoLayout(frame) {
  if (!frame || !frame.autoLayout || !frame.autoLayout.enabled || !Array.isArray(frame.children) || frame.children.length === 0) {
    return frame;
  }
  const { direction = 'horizontal', gap = 8, padding = 16, align = 'center', justify = 'start', sizing = 'fixed' } = frame.autoLayout;
  const isHoriz = direction === 'horizontal';
  const padTop = typeof padding === 'object' ? padding.top || 0 : padding;
  const padRight = typeof padding === 'object' ? padding.right || 0 : padding;
  const padBottom = typeof padding === 'object' ? padding.bottom || 0 : padding;
  const padLeft = typeof padding === 'object' ? padding.left || 0 : padding;
  let currentMain = isHoriz ? padLeft : padTop;
  let maxCross = 0;
  const updatedChildren = frame.children.map((child) => {
    const childW = child.width || 50;
    const childH = child.height || 50;
    let childX = child.x;
    let childY = child.y;
    if (isHoriz) {
      childX = currentMain;
      if (align === 'center') {
        childY = padTop + Math.max(0, (frame.height - padTop - padBottom - childH) / 2);
      } else if (align === 'end') {
        childY = frame.height - padBottom - childH;
      } else {
        childY = padTop;
      }
      currentMain += childW + gap;
      maxCross = Math.max(maxCross, childH);
    } else {
      childY = currentMain;
      if (align === 'center') {
        childX = padLeft + Math.max(0, (frame.width - padLeft - padRight - childW) / 2);
      } else if (align === 'end') {
        childX = frame.width - padRight - childW;
      } else {
        childX = padLeft;
      }
      currentMain += childH + gap;
      maxCross = Math.max(maxCross, childW);
    }
    return {
      ...child,
      x: Math.round(childX),
      y: Math.round(childY),
    };
  });
  let newWidth = frame.width;
  let newHeight = frame.height;
  if (sizing === 'hug') {
    if (isHoriz) {
      newWidth = Math.round(currentMain - gap + padRight);
      newHeight = Math.round(maxCross + padTop + padBottom);
    } else {
      newHeight = Math.round(currentMain - gap + padBottom);
      newWidth = Math.round(maxCross + padLeft + padRight);
    }
  }
  return {
    ...frame,
    width: Math.max(newWidth, 40),
    height: Math.max(newHeight, 40),
    children: updatedChildren,
  };
}