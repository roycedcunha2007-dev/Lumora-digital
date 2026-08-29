export function calculateSnapping({
  activeBounds,
  otherElements = [],
  snapThreshold = 6,
  snapToGrid = false,
  gridSize = 8,
  parentBounds = null,
}) {
  let snappedX = activeBounds.x;
  let snappedY = activeBounds.y;
  const w = activeBounds.width;
  const h = activeBounds.height;
  const guides = []; 
  const distanceBadges = []; 
  if (snapToGrid && gridSize > 1) {
    const gridX = Math.round(snappedX / gridSize) * gridSize;
    const gridY = Math.round(snappedY / gridSize) * gridSize;
    if (Math.abs(gridX - snappedX) <= snapThreshold) snappedX = gridX;
    if (Math.abs(gridY - snappedY) <= snapThreshold) snappedY = gridY;
  }
  const activeLeft = snappedX;
  const activeCenterX = snappedX + w / 2;
  const activeRight = snappedX + w;
  const activeTop = snappedY;
  const activeCenterY = snappedY + h / 2;
  const activeBottom = snappedY + h;
  let minDeltaX = snapThreshold;
  let minDeltaY = snapThreshold;
  let snapGuideX = null;
  let snapGuideY = null;
  const targets = [];
  if (parentBounds) {
    targets.push({
      x: parentBounds.x,
      y: parentBounds.y,
      width: parentBounds.width,
      height: parentBounds.height,
      isParent: true,
    });
  }
  otherElements.forEach((el) => {
    if (el && typeof el.x === 'number' && typeof el.y === 'number') {
      targets.push({
        x: el.x,
        y: el.y,
        width: el.width || 0,
        height: el.height || 0,
        id: el.id,
      });
    }
  });
  targets.forEach((target) => {
    const targetLeft = target.x;
    const targetCenterX = target.x + target.width / 2;
    const targetRight = target.x + target.width;
    const xAlignments = [
      { active: activeLeft, target: targetLeft, offset: 0, guidePos: targetLeft },
      { active: activeLeft, target: targetRight, offset: 0, guidePos: targetRight },
      { active: activeCenterX, target: targetCenterX, offset: -w / 2, guidePos: targetCenterX },
      { active: activeRight, target: targetLeft, offset: -w, guidePos: targetLeft },
      { active: activeRight, target: targetRight, offset: -w, guidePos: targetRight },
    ];
    xAlignments.forEach((align) => {
      const diff = Math.abs(align.active - align.target);
      if (diff <= minDeltaX) {
        minDeltaX = diff;
        snappedX = align.target + align.offset;
        snapGuideX = {
          type: 'v',
          pos: align.guidePos,
          from: Math.min(activeTop, target.y),
          to: Math.max(activeBottom, target.y + target.height),
        };
      }
    });
  });
  targets.forEach((target) => {
    const targetTop = target.y;
    const targetCenterY = target.y + target.height / 2;
    const targetBottom = target.y + target.height;
    const yAlignments = [
      { active: activeTop, target: targetTop, offset: 0, guidePos: targetTop },
      { active: activeTop, target: targetBottom, offset: 0, guidePos: targetBottom },
      { active: activeCenterY, target: targetCenterY, offset: -h / 2, guidePos: targetCenterY },
      { active: activeBottom, target: targetTop, offset: -h, guidePos: targetTop },
      { active: activeBottom, target: targetBottom, offset: -h, guidePos: targetBottom },
    ];
    yAlignments.forEach((align) => {
      const diff = Math.abs(align.active - align.target);
      if (diff <= minDeltaY) {
        minDeltaY = diff;
        snappedY = align.target + align.offset;
        snapGuideY = {
          type: 'h',
          pos: align.guidePos,
          from: Math.min(activeLeft, target.x),
          to: Math.max(activeRight, target.x + target.width),
        };
      }
    });
  });
  if (snapGuideX) guides.push(snapGuideX);
  if (snapGuideY) guides.push(snapGuideY);
  targets.forEach((target) => {
    if (target.isParent) return;
    const overlapsX = Math.max(snappedX, target.x) < Math.min(snappedX + w, target.x + target.width);
    if (overlapsX) {
      const midX = (Math.max(snappedX, target.x) + Math.min(snappedX + w, target.x + target.width)) / 2;
      if (target.y + target.height <= snappedY && snappedY - (target.y + target.height) <= 120) {
        const dist = Math.round(snappedY - (target.y + target.height));
        if (dist > 0) {
          distanceBadges.push({
            x: midX,
            y: target.y + target.height + dist / 2,
            distance: dist,
            orientation: 'v',
            line: { x1: midX, y1: target.y + target.height, x2: midX, y2: snappedY },
          });
        }
      }
      else if (snappedY + h <= target.y && target.y - (snappedY + h) <= 120) {
        const dist = Math.round(target.y - (snappedY + h));
        if (dist > 0) {
          distanceBadges.push({
            x: midX,
            y: snappedY + h + dist / 2,
            distance: dist,
            orientation: 'v',
            line: { x1: midX, y1: snappedY + h, x2: midX, y2: target.y },
          });
        }
      }
    }
    const overlapsY = Math.max(snappedY, target.y) < Math.min(snappedY + h, target.y + target.height);
    if (overlapsY) {
      const midY = (Math.max(snappedY, target.y) + Math.min(snappedY + h, target.y + target.height)) / 2;
      if (target.x + target.width <= snappedX && snappedX - (target.x + target.width) <= 120) {
        const dist = Math.round(snappedX - (target.x + target.width));
        if (dist > 0) {
          distanceBadges.push({
            x: target.x + target.width + dist / 2,
            y: midY,
            distance: dist,
            orientation: 'h',
            line: { x1: target.x + target.width, y1: midY, x2: snappedX, y2: midY },
          });
        }
      }
      else if (snappedX + w <= target.x && target.x - (snappedX + w) <= 120) {
        const dist = Math.round(target.x - (snappedX + w));
        if (dist > 0) {
          distanceBadges.push({
            x: snappedX + w + dist / 2,
            y: midY,
            distance: dist,
            orientation: 'h',
            line: { x1: snappedX + w, y1: midY, x2: target.x, y2: midY },
          });
        }
      }
    }
  });
  return {
    snappedX: Math.round(snappedX),
    snappedY: Math.round(snappedY),
    guides,
    distanceBadges,
  };
}
export function calculateAltMeasurement(selectedBounds, targetBounds) {
  if (!selectedBounds || !targetBounds) return null;
  const sel = selectedBounds;
  const tgt = targetBounds;
  return {
    top: Math.round(sel.y - (tgt.y + tgt.height)),
    bottom: Math.round(tgt.y - (sel.y + sel.height)),
    left: Math.round(sel.x - (tgt.x + tgt.width)),
    right: Math.round(tgt.x - (sel.x + sel.width)),
    bounds: {
      sel,
      tgt,
    }
  };
}