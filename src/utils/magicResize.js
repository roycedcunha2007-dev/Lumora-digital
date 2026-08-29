import { applyConstraints } from './constraints';
import { computeAutoLayout } from './autoLayout';
export function executeMagicResize(targetFrame, newPreset) {
  if (!targetFrame || !newPreset) return targetFrame;
  const oldFrame = {
    x: targetFrame.x || 0,
    y: targetFrame.y || 0,
    width: targetFrame.width || 800,
    height: targetFrame.height || 600,
  };
  const newWidth = newPreset.width;
  const newHeight = newPreset.height;
  const scaleRatioX = newWidth / oldFrame.width;
  const scaleRatioY = newHeight / oldFrame.height;
  const updatedFrame = {
    ...targetFrame,
    width: newWidth,
    height: newHeight,
    name: `${targetFrame.name} (${newPreset.name})`,
  };
  if (Array.isArray(targetFrame.children)) {
    const resizedChildren = targetFrame.children.map((child) => {
      let updatedChild = applyConstraints(child, oldFrame, { width: newWidth, height: newHeight });
      if (child.type === 'text') {
        const textScale = Math.min(1.2, Math.max(0.7, (scaleRatioX + scaleRatioY) / 2));
        const newFontSize = Math.max(11, Math.round((child.fontSize || 16) * textScale));
        const newTextWidth = Math.min(newWidth - 32, Math.round((child.width || 120) * scaleRatioX));
        updatedChild = {
          ...updatedChild,
          fontSize: newFontSize,
          width: Math.max(80, newTextWidth),
          x: Math.max(16, Math.min(newWidth - 100, updatedChild.x)),
        };
      } else {
        if (updatedChild.width > newWidth - 32) {
          updatedChild.width = newWidth - 32;
          updatedChild.x = 16;
        }
      }
      if (updatedChild.autoLayout && updatedChild.autoLayout.enabled) {
        return computeAutoLayout(updatedChild);
      }
      return updatedChild;
    });
    updatedFrame.children = resizedChildren;
  }
  if (updatedFrame.autoLayout && updatedFrame.autoLayout.enabled) {
    return computeAutoLayout(updatedFrame);
  }
  return updatedFrame;
}