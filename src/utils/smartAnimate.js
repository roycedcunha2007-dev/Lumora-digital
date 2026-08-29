export function getEasingProgress(t, easing = 'ease_in_out') {
  switch (easing) {
    case 'linear':
      return t;
    case 'ease_in':
      return t * t;
    case 'ease_out':
      return t * (2 - t);
    case 'ease_in_out':
    default:
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}
export function matchFrameElements(frameA, frameB) {
  const childrenA = frameA.children || [];
  const childrenB = frameB.children || [];
  const pairs = [];
  const matchedBIds = new Set();
  childrenA.forEach((elemA) => {
    let match = childrenB.find((b) => b.id === elemA.id);
    if (!match) {
      match = childrenB.find((b) => !matchedBIds.has(b.id) && b.name === elemA.name && b.type === elemA.type);
    }
    if (match) {
      matchedBIds.add(match.id);
      pairs.push({ from: elemA, to: match });
    } else {
      pairs.push({ from: elemA, to: null });
    }
  });
  childrenB.forEach((elemB) => {
    if (!matchedBIds.has(elemB.id)) {
      pairs.push({ from: null, to: elemB });
    }
  });
  return pairs;
}
export function interpolateElementProperties(fromEl, toEl, progress) {
  if (!fromEl && toEl) {
    return {
      ...toEl,
      opacity: (toEl.opacity !== undefined ? toEl.opacity : 1) * progress,
    };
  }
  if (fromEl && !toEl) {
    return {
      ...fromEl,
      opacity: (fromEl.opacity !== undefined ? fromEl.opacity : 1) * (1 - progress),
    };
  }
  const interpolateNum = (a = 0, b = 0) => a + (b - a) * progress;
  return {
    ...toEl,
    x: Math.round(interpolateNum(fromEl.x, toEl.x)),
    y: Math.round(interpolateNum(fromEl.y, toEl.y)),
    width: Math.round(interpolateNum(fromEl.width, toEl.width)),
    height: Math.round(interpolateNum(fromEl.height, toEl.height)),
    rotation: Math.round(interpolateNum(fromEl.rotation || 0, toEl.rotation || 0)),
    cornerRadius: Math.round(interpolateNum(fromEl.cornerRadius || 0, toEl.cornerRadius || 0)),
    opacity: interpolateNum(fromEl.opacity !== undefined ? fromEl.opacity : 1, toEl.opacity !== undefined ? toEl.opacity : 1),
    fill: progress > 0.5 ? toEl.fill : fromEl.fill,
  };
}