import { generateId } from './math';

export function validateProjectJson(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid project file: Content is not a JSON object.');
  }
  if (!Array.isArray(data.pages) || data.pages.length === 0) {
    if (Array.isArray(data.elements)) {
      data.pages = [
        {
          id: 'page_imported',
          name: 'Imported Page',
          background: data.background || '#09090B',
          elements: data.elements,
        }
      ];
    } else {
      throw new Error('Invalid project structure: Missing pages or elements list.');
    }
  }

  const sanitizedPages = data.pages.map((page, pIdx) => ({
    id: page.id || `page_${pIdx}_${Date.now()}`,
    name: String(page.name || `Page ${pIdx + 1}`).slice(0, 50),
    background: typeof page.background === 'string' ? page.background : '#09090B',
    elements: sanitizeElementList(page.elements || []),
  }));

  return {
    id: data.id || generateId('proj'),
    name: String(data.name || 'Imported Project').slice(0, 80),
    updatedAt: new Date().toISOString(),
    pages: sanitizedPages,
    prototypes: Array.isArray(data.prototypes) ? data.prototypes : [],
    comments: Array.isArray(data.comments) ? data.comments : [],
    components: typeof data.components === 'object' && data.components !== null ? data.components : {},
    styles: data.styles || {},
  };
}

function sanitizeElementList(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map((el) => {
    const cleanEl = {
      id: el.id || generateId('el'),
      name: String(el.name || 'Layer').slice(0, 60),
      type: String(el.type || 'rectangle'),
      x: Number(el.x) || 0,
      y: Number(el.y) || 0,
      width: Math.max(1, Number(el.width) || 100),
      height: Math.max(1, Number(el.height) || 100),
      rotation: Number(el.rotation) || 0,
      opacity: el.opacity !== undefined ? Math.min(1, Math.max(0, Number(el.opacity))) : 1,
      fill: el.fill || '#6366F1',
      stroke: el.stroke || null,
      strokeWidth: Number(el.strokeWidth) || 0,
      cornerRadius: Number(el.cornerRadius) || 0,
      blur: Number(el.blur) || 0,
      locked: Boolean(el.locked),
      hidden: Boolean(el.hidden),
      shadows: Array.isArray(el.shadows) ? el.shadows : [],
      constraints: el.constraints || { horizontal: 'left', vertical: 'top' },
      autoLayout: el.autoLayout || null,
    };

    if (el.type === 'text') {
      cleanEl.text = String(el.text || 'Text');
      cleanEl.fontFamily = el.fontFamily || 'Inter';
      cleanEl.fontSize = Number(el.fontSize) || 16;
      cleanEl.fontWeight = Number(el.fontWeight) || 400;
      cleanEl.textAlign = el.textAlign || 'left';
      cleanEl.lineHeight = Number(el.lineHeight) || 1.4;
      cleanEl.letterSpacing = Number(el.letterSpacing) || 0;
    }

    if (el.type === 'image') {
      cleanEl.src = String(el.src || el.dataUrl || '');
      cleanEl.dataUrl = cleanEl.src;
      cleanEl.originalWidth = Number(el.originalWidth) || cleanEl.width;
      cleanEl.originalHeight = Number(el.originalHeight) || cleanEl.height;
      cleanEl.objectFit = el.objectFit || 'cover';
      cleanEl.brightness = Number(el.brightness) || 100;
      cleanEl.contrast = Number(el.contrast) || 100;
      cleanEl.saturation = Number(el.saturation) || 100;
      cleanEl.grayscale = Number(el.grayscale) || 0;
    }

    if (el.type === 'chart') {
      cleanEl.chartType = el.chartType || 'bar';
      cleanEl.chartData = Array.isArray(el.chartData) ? el.chartData : [];
    }

    if (el.type === 'pen_path' || el.type === 'pencil_stroke') {
      cleanEl.d = String(el.d || '');
      cleanEl.points = Array.isArray(el.points) ? el.points : [];
    }

    if (Array.isArray(el.children)) {
      cleanEl.children = sanitizeElementList(el.children);
    }
    return cleanEl;
  });
}

export function readLocalImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const naturalWidth = img.naturalWidth || 400;
        const naturalHeight = img.naturalHeight || 300;
        resolve({
          src: dataUrl,
          dataUrl: dataUrl,
          width: naturalWidth,
          height: naturalHeight,
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          name: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Imported Image',
        });
      };
      img.onerror = () => reject(new Error('Failed to parse image data.'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read local file.'));
    reader.readAsDataURL(file);
  });
}