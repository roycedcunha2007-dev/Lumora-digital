import { hexToRgb } from './color';
function getLuminance(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return 0.5;
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
export function calculateContrastRatio(foregroundHex, backgroundHex) {
  const l1 = getLuminance(foregroundHex);
  const l2 = getLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
export function runDesignAnalysis(elements = [], activePage = null) {
  const issues = [];
  const categories = {
    layout: { score: 100, passCount: 0, issueCount: 0 },
    typography: { score: 100, passCount: 0, issueCount: 0 },
    color: { score: 100, passCount: 0, issueCount: 0 },
    components: { score: 100, passCount: 0, issueCount: 0 },
    accessibility: { score: 100, passCount: 0, issueCount: 0 },
    responsive: { score: 100, passCount: 0, issueCount: 0 },
  };
  const standardGaps = [4, 8, 12, 16, 24, 32, 40, 48, 64];
  const standardFontSizes = [11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];
  const frames = elements.filter((el) => el.type === 'frame');
  const allElements = [];
  function collectElements(list, parent = null) {
    list.forEach((el) => {
      allElements.push({ ...el, parentFrame: parent });
      if (Array.isArray(el.children)) {
        collectElements(el.children, el.type === 'frame' ? el : parent);
      }
    });
  }
  collectElements(elements);
  if (frames.length > 0) {
    categories.layout.passCount += 2;
  } else {
    issues.push({
      id: 'iss_no_frames',
      category: 'layout',
      severity: 'warning',
      message: 'Design lacks top-level Frames/Artboards for structured presentation',
      elementId: elements[0] ? elements[0].id : null,
      fixable: false,
    });
    categories.layout.issueCount += 1;
  }
  allElements.forEach((el) => {
    if (el.parentFrame) {
      const isOutside =
        el.x + (el.width || 0) > el.parentFrame.width + 20 ||
        el.y + (el.height || 0) > el.parentFrame.height + 20 ||
        el.x < -20 ||
        el.y < -20;
      if (isOutside) {
        issues.push({
          id: `iss_outside_${el.id}`,
          category: 'layout',
          severity: 'warning',
          message: `Object "${el.name}" extends outside its parent frame "${el.parentFrame.name}"`,
          elementId: el.id,
          fixable: true,
          fixType: 'fit_to_frame',
        });
        categories.layout.issueCount += 1;
      }
    }
  });
  const textElements = allElements.filter((el) => el.type === 'text');
  textElements.forEach((txt) => {
    const sz = txt.fontSize || 16;
    if (!standardFontSizes.includes(sz)) {
      issues.push({
        id: `iss_font_scale_${txt.id}`,
        category: 'typography',
        severity: 'info',
        message: `Text "${txt.text ? txt.text.slice(0, 18) : txt.name}" uses non-standard font size (${sz}px)`,
        elementId: txt.id,
        fixable: true,
        fixType: 'normalize_font_size',
        targetSize: standardFontSizes.reduce((prev, curr) => (Math.abs(curr - sz) < Math.abs(prev - sz) ? curr : prev)),
      });
      categories.typography.issueCount += 1;
    } else {
      categories.typography.passCount += 1;
    }
    if (sz < 12) {
      issues.push({
        id: `iss_small_text_${txt.id}`,
        category: 'accessibility',
        severity: 'warning',
        message: `Text "${txt.text ? txt.text.slice(0, 18) : txt.name}" is very small (${sz}px), violating WCAG readability guidelines`,
        elementId: txt.id,
        fixable: true,
        fixType: 'increase_font_size',
      });
      categories.accessibility.issueCount += 1;
    } else {
      categories.accessibility.passCount += 1;
    }
    const textColor = typeof txt.fill === 'string' && txt.fill.startsWith('#') ? txt.fill : '#FFFFFF';
    const bg = txt.parentFrame && typeof txt.parentFrame.fill === 'string' && txt.parentFrame.fill.startsWith('#')
      ? txt.parentFrame.fill
      : '#09090B';
    const contrast = calculateContrastRatio(textColor, bg);
    if (contrast < 4.5) {
      issues.push({
        id: `iss_contrast_${txt.id}`,
        category: 'color',
        severity: 'warning',
        message: `Low contrast ratio (${contrast.toFixed(1)}:1) for text "${txt.text ? txt.text.slice(0, 18) : txt.name}". WCAG AA requires 4.5:1`,
        elementId: txt.id,
        fixable: true,
        fixType: 'high_contrast_text',
      });
      categories.color.issueCount += 1;
      categories.accessibility.issueCount += 1;
    } else {
      categories.color.passCount += 1;
      categories.accessibility.passCount += 1;
    }
  });
  const interactiveShapes = allElements.filter((el) => ['rounded_rect', 'rectangle'].includes(el.type) && el.name.toLowerCase().includes('btn') || el.name.toLowerCase().includes('button'));
  interactiveShapes.forEach((btn) => {
    if ((btn.width && btn.width < 44) || (btn.height && btn.height < 44)) {
      issues.push({
        id: `iss_touch_target_${btn.id}`,
        category: 'accessibility',
        severity: 'warning',
        message: `Button "${btn.name}" has touch target smaller than 44x44px (${btn.width}x${btn.height}px)`,
        elementId: btn.id,
        fixable: true,
        fixType: 'enlarge_touch_target',
      });
      categories.accessibility.issueCount += 1;
    } else {
      categories.accessibility.passCount += 1;
    }
  });
  const nonFrameElements = allElements.filter((el) => el.type !== 'frame' && el.parentFrame);
  nonFrameElements.forEach((el) => {
    if (!el.constraints) {
      issues.push({
        id: `iss_no_constraint_${el.id}`,
        category: 'responsive',
        severity: 'info',
        message: `Object "${el.name}" lacks responsive resizing constraints`,
        elementId: el.id,
        fixable: true,
        fixType: 'add_default_constraints',
      });
      categories.responsive.issueCount += 1;
    } else {
      categories.responsive.passCount += 1;
    }
  });
  Object.keys(categories).forEach((catKey) => {
    const cat = categories[catKey];
    const total = cat.passCount + cat.issueCount;
    if (total > 0) {
      cat.score = Math.max(50, Math.round(100 - (cat.issueCount * 12)));
    } else {
      cat.score = 95;
    }
  });
  const overallScore = Math.round(
    Object.values(categories).reduce((sum, c) => sum + c.score, 0) / Object.keys(categories).length
  );
  return {
    score: overallScore,
    categories,
    issues,
    analyzedElementCount: allElements.length,
    timestamp: new Date().toISOString(),
  };
}
export function generateDesignImprovements(elements = []) {
  const suggestions = [];
  const standardGaps = [8, 12, 16, 24, 32];
  const standardFontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48];
  const textNodes = elements.filter((el) => el.type === 'text');
  if (textNodes.length > 0) {
    suggestions.push({
      id: 'sug_normalize_typography',
      category: 'Typography',
      title: 'Normalize Typography Scale',
      description: 'Align font sizes to standard design system typographic hierarchy scale (12, 14, 16, 20, 24, 32px)',
      impact: 'High',
      apply: (el) => {
        if (el.type === 'text') {
          const sz = el.fontSize || 16;
          const target = standardFontSizes.reduce((prev, curr) => (Math.abs(curr - sz) < Math.abs(prev - sz) ? curr : prev));
          return { ...el, fontSize: target };
        }
        return el;
      },
    });
  }
  const rects = elements.filter((el) => ['rectangle', 'rounded_rect', 'frame'].includes(el.type));
  if (rects.length > 0) {
    suggestions.push({
      id: 'sug_normalize_radius',
      category: 'Radius',
      title: 'Harmonize Corner Radii',
      description: 'Standardize rounded corners across cards and containers to cohesive 16px radius',
      impact: 'Medium',
      apply: (el) => {
        if (['rectangle', 'rounded_rect', 'frame'].includes(el.type) && (el.cornerRadius || 0) > 0) {
          return { ...el, cornerRadius: 16 };
        }
        return el;
      },
    });
  }
  suggestions.push({
    id: 'sug_ensure_contrast',
    category: 'Color',
    title: 'Boost Text Readability Contrast',
    description: 'Ensure all primary headings and text meet strict WCAG AAA contrast requirements against dark surface backgrounds',
    impact: 'High',
    apply: (el) => {
      if (el.type === 'text') {
        return { ...el, fill: '#FFFFFF' };
      }
      return el;
    },
  });
  return suggestions;
}