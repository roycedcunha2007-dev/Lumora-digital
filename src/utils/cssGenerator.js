import { formatGradientCss } from './color';
export function generateCss(element) {
  if (!element) return '';
  const lines = [];
  if (element.width) lines.push(`width: ${Math.round(element.width)}px;`);
  if (element.height) lines.push(`height: ${Math.round(element.height)}px;`);
  if (element.x !== undefined) lines.push(``);
  if (element.cornerRadius) lines.push(`border-radius: ${element.cornerRadius}px;`);
  if (element.fill) {
    if (typeof element.fill === 'object') {
      lines.push(`background: ${formatGradientCss(element.fill)};`);
    } else {
      lines.push(`background: ${element.fill};`);
    }
  }
  if (element.stroke && element.strokeWidth) {
    lines.push(`border: ${element.strokeWidth}px solid ${element.stroke};`);
  }
  if (element.opacity !== undefined && element.opacity < 1) {
    lines.push(`opacity: ${element.opacity};`);
  }
  if (element.shadows && element.shadows.length > 0) {
    const shadowStr = element.shadows
      .map((s) => `${s.x || 0}px ${s.y || 0}px ${s.blur || 0}px ${s.spread || 0}px ${s.color || 'rgba(0,0,0,0.25)'}`)
      .join(', ');
    lines.push(`box-shadow: ${shadowStr};`);
  }
  if (element.blur) {
    lines.push(`filter: blur(${element.blur}px);`);
  }
  if (element.rotation) {
    lines.push(`transform: rotate(${element.rotation}deg);`);
  }
  if (element.type === 'text') {
    if (element.fontFamily) lines.push(`font-family: '${element.fontFamily}', sans-serif;`);
    if (element.fontSize) lines.push(`font-size: ${element.fontSize}px;`);
    if (element.fontWeight) lines.push(`font-weight: ${element.fontWeight};`);
    if (element.lineHeight) lines.push(`line-height: ${element.lineHeight};`);
    if (element.letterSpacing) lines.push(`letter-spacing: ${element.letterSpacing}px;`);
    if (element.textAlign) lines.push(`text-align: ${element.textAlign};`);
    if (element.fill) lines.push(`color: ${typeof element.fill === 'string' ? element.fill : '#FFFFFF'};`);
  }
  if (element.autoLayout && element.autoLayout.enabled) {
    lines.push(`display: flex;`);
    lines.push(`flex-direction: ${element.autoLayout.direction === 'vertical' ? 'column' : 'row'};`);
    lines.push(`gap: ${element.autoLayout.gap || 0}px;`);
    lines.push(`padding: ${element.autoLayout.padding || 0}px;`);
    lines.push(`align-items: ${element.autoLayout.align || 'center'};`);
    lines.push(`justify-content: ${element.autoLayout.justify || 'flex-start'};`);
  }
  return lines.join('\n');
}
export function generateTailwind(element) {
  if (!element) return '';
  const classes = [];
  if (element.width) classes.push(`w-[${Math.round(element.width)}px]`);
  if (element.height) classes.push(`h-[${Math.round(element.height)}px]`);
  if (element.cornerRadius) {
    if (element.cornerRadius >= 9999) classes.push('rounded-full');
    else if (element.cornerRadius === 4) classes.push('rounded-sm');
    else if (element.cornerRadius === 8) classes.push('rounded-md');
    else if (element.cornerRadius === 12) classes.push('rounded-lg');
    else if (element.cornerRadius === 16) classes.push('rounded-xl');
    else if (element.cornerRadius === 24) classes.push('rounded-2xl');
    else if (element.cornerRadius === 32) classes.push('rounded-3xl');
    else classes.push(`rounded-[${element.cornerRadius}px]`);
  }
  if (typeof element.fill === 'string') {
    if (element.type === 'text') {
      classes.push(`text-[${element.fill}]`);
    } else {
      classes.push(`bg-[${element.fill}]`);
    }
  }
  if (element.stroke && element.strokeWidth) {
    classes.push(`border-[${element.strokeWidth}px] border-[${element.stroke}]`);
  }
  if (element.opacity !== undefined && element.opacity < 1) {
    classes.push(`opacity-${Math.round(element.opacity * 100)}`);
  }
  if (element.type === 'text') {
    if (element.fontSize) classes.push(`text-[${element.fontSize}px]`);
    if (element.fontWeight >= 700) classes.push('font-bold');
    else if (element.fontWeight >= 600) classes.push('font-semibold');
    else if (element.fontWeight >= 500) classes.push('font-medium');
    else classes.push('font-normal');
    if (element.textAlign === 'center') classes.push('text-center');
    if (element.textAlign === 'right') classes.push('text-right');
  }
  if (element.autoLayout && element.autoLayout.enabled) {
    classes.push('flex');
    if (element.autoLayout.direction === 'vertical') classes.push('flex-col');
    if (element.autoLayout.gap) classes.push(`gap-[${element.autoLayout.gap}px]`);
    if (element.autoLayout.padding) classes.push(`p-[${element.autoLayout.padding}px]`);
  }
  return classes.join(' ');
}
export function generateReactJsx(element) {
  if (!element) return '';
  const tag = element.type === 'text' ? 'span' : 'div';
  const tw = generateTailwind(element);
  if (element.type === 'text') {
    return `<${tag} className="${tw}">\n  ${element.text || 'Text'}\n</${tag}>`;
  }
  if (element.children && element.children.length > 0) {
    return `<${tag} className="${tw}">\n  {}\n</${tag}>`;
  }
  return `<${tag} className="${tw}" />`;
}