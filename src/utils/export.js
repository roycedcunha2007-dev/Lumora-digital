import { getSelectionBoundingBox } from './math';
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadText(content, filename, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}
export function exportProjectToJson(project) {
  const cleanProject = {
    ...project,
    figmaLiteVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
  };
  const jsonStr = JSON.stringify(cleanProject, null, 2);
  const safeName = (project.name || 'Untitled').toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadText(jsonStr, `${safeName}.figmalite`, 'application/json');
}
export function buildStandaloneSvg(elements, options = {}) {
  const bounds = options.bounds || getSelectionBoundingBox(elements) || { x: 0, y: 0, width: 800, height: 600 };
  const width = Math.max(bounds.width, 10);
  const height = Math.max(bounds.height, 10);
  const bg = options.transparent ? 'transparent' : (options.background || '#FFFFFF');
  let defs = `
    <defs>
      <filter id="default-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
      </filter>
    </defs>
  `;
  const renderSvgElement = (el) => {
    if (el.hidden) return '';
    const relX = el.x - bounds.x;
    const relY = el.y - bounds.y;
    const w = el.width || 50;
    const h = el.height || 50;
    const fill = typeof el.fill === 'string' ? el.fill : '#6366F1';
    const stroke = el.stroke || 'none';
    const strokeWidth = el.strokeWidth || 0;
    const opacity = el.opacity !== undefined ? el.opacity : 1;
    const rot = el.rotation ? `transform="rotate(${el.rotation} ${relX + w / 2} ${relY + h / 2})"` : '';
    switch (el.type) {
      case 'frame':
      case 'rectangle':
        return `<rect x="${relX}" y="${relY}" width="${w}" height="${h}" rx="${el.cornerRadius || 0}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${rot}/>`;
      case 'rounded_rect':
        return `<rect x="${relX}" y="${relY}" width="${w}" height="${h}" rx="${el.cornerRadius || 16}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${rot}/>`;
      case 'ellipse':
        return `<ellipse cx="${relX + w / 2}" cy="${relY + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${rot}/>`;
      case 'triangle':
        return `<polygon points="${relX + w / 2},${relY} ${relX + w},${relY + h} ${relX},${relY + h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${rot}/>`;
      case 'star': {
        const cx = relX + w / 2;
        const cy = relY + h / 2;
        const rOuter = Math.min(w, h) / 2;
        const rInner = rOuter * 0.45;
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? rOuter : rInner;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" ${rot}/>`;
      }
      case 'line':
        return `<line x1="${relX}" y1="${relY}" x2="${relX + w}" y2="${relY + h}" stroke="${fill !== 'none' ? fill : '#FFFFFF'}" stroke-width="${strokeWidth || 2}" opacity="${opacity}" ${rot}/>`;
      case 'arrow':
        return `
          <g opacity="${opacity}" ${rot}>
            <line x1="${relX}" y1="${relY}" x2="${relX + w}" y2="${relY + h}" stroke="${fill !== 'none' ? fill : '#FFFFFF'}" stroke-width="${strokeWidth || 2}"/>
            <circle cx="${relX + w}" cy="${relY + h}" r="4" fill="${fill !== 'none' ? fill : '#FFFFFF'}"/>
          </g>
        `;
      case 'text':
        return `
          <text x="${relX}" y="${relY + (el.fontSize || 16)}" font-family="${el.fontFamily || 'Inter'}" font-size="${el.fontSize || 16}" font-weight="${el.fontWeight || 400}" fill="${fill}" opacity="${opacity}" ${rot}>
            ${(el.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </text>
        `;
      case 'image':
        return `<image href="${el.src || ''}" x="${relX}" y="${relY}" width="${w}" height="${h}" opacity="${opacity}" preserveAspectRatio="none" ${rot}/>`;
      case 'pen_path':
        return `<path d="${el.d || ''}" fill="${el.fill || 'none'}" stroke="${el.stroke || '#38BDF8'}" stroke-width="${el.strokeWidth || 2}" opacity="${opacity}" ${rot}/>`;
      case 'pencil_stroke':
        return `<path d="${el.d || ''}" fill="none" stroke="${el.stroke || '#A855F7'}" stroke-width="${el.strokeWidth || 3}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" ${rot}/>`;
      default:
        return `<rect x="${relX}" y="${relY}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
    }
  };
  const elementsSvg = (elements || []).map((el) => {
    let out = renderSvgElement(el);
    if (el.children && el.children.length > 0) {
      out += el.children.map((child) => renderSvgElement({
        ...child,
        x: (el.x || 0) + (child.x || 0),
        y: (el.y || 0) + (child.y || 0),
      })).join('\n');
    }
    return out;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${defs}
  ${bg !== 'transparent' ? `<rect width="${width}" height="${height}" fill="${bg}"/>` : ''}
  ${elementsSvg}
</svg>`;
}
export function exportToSvg(elements, options = {}) {
  const svgMarkup = buildStandaloneSvg(elements, options);
  const filename = options.filename || 'figmalite_design.svg';
  downloadText(svgMarkup, filename, 'image/svg+xml');
}
export async function exportToPng(elements, options = {}) {
  const scale = options.scale || 1;
  const bounds = options.bounds || getSelectionBoundingBox(elements) || { x: 0, y: 0, width: 800, height: 600 };
  const width = Math.max(bounds.width, 10);
  const height = Math.max(bounds.height, 10);
  const filename = options.filename || 'figmalite_design.png';
  const svgString = buildStandaloneSvg(elements, {
    ...options,
    bounds,
  });
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!options.transparent) {
        ctx.fillStyle = options.background || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, filename);
          resolve(true);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png');
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}