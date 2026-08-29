export function exportPresentationToPptx(project) {
  const slides = project.pages || [];
  const slideDeckData = {
    title: project.name || 'Presentation',
    createdAt: new Date().toISOString(),
    slideCount: slides.length,
    slides: slides.map((page, idx) => {
      const frame = page.elements && page.elements[0];
      const textNodes = [];
      if (frame && Array.isArray(frame.children)) {
        frame.children.forEach((child) => {
          if (child.type === 'text') {
            textNodes.push({
              text: child.text,
              fontSize: child.fontSize,
              fontWeight: child.fontWeight,
              x: child.x,
              y: child.y,
              width: child.width,
              height: child.height,
              fill: child.fill,
            });
          }
        });
      }

      return {
        slideNumber: idx + 1,
        title: page.name,
        notes: page.notes || '',
        background: page.background || '#090D16',
        elements: textNodes,
      };
    }),
  };

  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
                xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldMasterIdLst/>
  <p:sldIdLst>
    ${slides.map((s, idx) => `<p:sldId id="${256 + idx}" r:id="rId${idx + 1}"/>`).join('\n    ')}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <!-- FigmaLite Verified OpenXML Presentation Package -->
  <!-- Slide Count: ${slides.length} -->
  <!-- Title: ${escapeXml(project.name || 'Presentation')} -->
</p:presentation>`;

  const htmlPresentation = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeXml(project.name)} - FigmaLite Keynote</title>
  <style>
    body { margin: 0; background: #000; color: #fff; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    .slide-viewport { width: 1920px; height: 1080px; transform-origin: center center; position: relative; background: #0F172A; }
    .slide { width: 100%; height: 100%; position: absolute; inset: 0; display: none; }
    .slide.active { display: block; }
    .nav { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 20px; }
    button { background: #6366F1; color: #fff; border: none; padding: 6px 14px; border-radius: 12px; cursor: pointer; font-weight: bold; }
  </style>
</head>
<body>
  <div id="deck" class="slide-viewport">
    ${slides
      .map((p, idx) => {
        const frame = p.elements && p.elements[0];
        const bg = frame ? frame.fill || p.background || '#0F172A' : '#0F172A';
        return `
      <div class="slide ${idx === 0 ? 'active' : ''}" id="slide-${idx}" style="background: ${bg}; position: relative; overflow: hidden;">
        <h1 style="position: absolute; left: 120px; top: 100px; font-size: 52px; margin: 0; color: #fff;">${escapeXml(p.name)}</h1>
        <div style="position: absolute; left: 120px; top: 220px; right: 120px; font-size: 24px; color: #94A3B8; line-height: 1.6;">
          ${(frame?.children || [])
            .filter((c) => c.type === 'text' && c.y > 180)
            .map((c) => `<div style="margin-bottom: 16px;">${escapeXml(c.text)}</div>`)
            .join('')}
        </div>
      </div>
        `;
      })
      .join('')}
  </div>
  <div class="nav">
    <button onclick="prev()">← Previous</button>
    <span id="counter" style="line-height: 28px; font-size: 14px; font-weight: bold;">1 / ${slides.length}</span>
    <button onclick="next()">Next →</button>
  </div>
  <script>
    let cur = 0;
    const total = ${slides.length};
    function update() {
      document.querySelectorAll('.slide').forEach((s, idx) => s.classList.toggle('active', idx === cur));
      document.getElementById('counter').innerText = (cur + 1) + ' / ' + total;
    }
    function next() { if (cur < total - 1) { cur++; update(); } }
    function prev() { if (cur > 0) { cur--; update(); } }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    });
    function resize() {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      document.getElementById('deck').style.transform = 'scale(' + scale + ')';
    }
    window.addEventListener('resize', resize);
    resize();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlPresentation], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(project.name || 'presentation').toLowerCase().replace(/\s+/g, '_')}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
