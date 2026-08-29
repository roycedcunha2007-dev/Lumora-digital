import { generateId } from './math';
export function extractDesignSystem(elements = []) {
  const colorMap = {};
  const fontFamilies = new Set();
  const fontSizes = new Set();
  const fontWeights = new Set();
  const radii = new Set();
  const spacingCandidates = new Set();
  function scanElement(el) {
    if (typeof el.fill === 'string' && el.fill.startsWith('#')) {
      colorMap[el.fill] = (colorMap[el.fill] || 0) + 1;
    }
    if (typeof el.stroke === 'string' && el.stroke.startsWith('#')) {
      colorMap[el.stroke] = (colorMap[el.stroke] || 0) + 1;
    }
    if (el.type === 'text') {
      if (el.fontFamily) fontFamilies.add(el.fontFamily);
      if (el.fontSize) fontSizes.add(el.fontSize);
      if (el.fontWeight) fontWeights.add(el.fontWeight);
    }
    if (el.cornerRadius !== undefined && el.cornerRadius > 0) {
      radii.add(el.cornerRadius);
    }
    if (el.x) spacingCandidates.add(Math.abs(el.x % 16));
    if (el.y) spacingCandidates.add(Math.abs(el.y % 16));
    if (el.autoLayout && el.autoLayout.gap) {
      spacingCandidates.add(el.autoLayout.gap);
    }
    if (Array.isArray(el.children)) {
      el.children.forEach(scanElement);
    }
  }
  elements.forEach(scanElement);
  const sortedColors = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
  const semanticLabels = ['Primary', 'Secondary', 'Background', 'Surface', 'Text', 'Muted', 'Accent', 'Border'];
  const colors = sortedColors.slice(0, 8).map((hex, idx) => ({
    id: `tok_col_${idx}`,
    name: semanticLabels[idx] || `Color ${idx + 1}`,
    value: hex,
    usageCount: colorMap[hex],
  }));
  const typography = Array.from(fontSizes)
    .sort((a, b) => b - a)
    .map((sz, idx) => ({
      id: `tok_typ_${idx}`,
      name: sz >= 32 ? `Heading ${idx + 1}` : sz >= 18 ? `Subheading` : sz >= 14 ? `Body` : `Caption`,
      fontSize: sz,
      fontFamily: Array.from(fontFamilies)[0] || 'Inter',
      fontWeight: Array.from(fontWeights)[0] || 500,
    }));
  const spacing = [4, 8, 12, 16, 24, 32, 48, 64];
  const borderRadii = Array.from(radii).sort((a, b) => a - b);
  return {
    colors,
    typography,
    spacing,
    radii: borderRadii.length > 0 ? borderRadii : [4, 8, 12, 16, 24],
    extractedAt: new Date().toISOString(),
  };
}
export function exportTokensToCss(tokens) {
  const lines = [':root {'];
  (tokens.colors || []).forEach((c) => {
    const slug = c.name.toLowerCase().replace(/\s+/g, '-');
    lines.push(`  --color-${slug}: ${c.value};`);
  });
  (tokens.typography || []).forEach((t) => {
    const slug = t.name.toLowerCase().replace(/\s+/g, '-');
    lines.push(`  --font-size-${slug}: ${t.fontSize}px;`);
  });
  (tokens.spacing || []).forEach((s) => {
    lines.push(`  --spacing-${s}: ${s}px;`);
  });
  (tokens.radii || []).forEach((r) => {
    lines.push(`  --radius-${r}: ${r}px;`);
  });
  lines.push('}');
  return lines.join('\n');
}