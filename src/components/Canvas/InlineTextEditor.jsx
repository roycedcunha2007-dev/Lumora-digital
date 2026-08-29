import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { canvasToScreen } from '../../utils/math';
export function InlineTextEditor({ pan, zoom, containerRect }) {
  const {
    editingTextId,
    setEditingTextId,
    elements,
    updateElementProperties,
  } = useEditor();
  const textElement = elements.find((el) => el.id === editingTextId);
  const [val, setVal] = useState('');
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textElement) {
      setVal(textElement.text || '');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 50);
    }
  }, [textElement]);
  if (!textElement || !containerRect) return null;
  const screenCoords = canvasToScreen(textElement.x, textElement.y, pan, zoom, containerRect);
  const handleSubmit = () => {
    if (editingTextId) {
      updateElementProperties(editingTextId, { text: val }, true);
      setEditingTextId(null);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditingTextId(null);
    }
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: `${screenCoords.x}px`,
        top: `${screenCoords.y}px`,
        transform: `scale(${zoom}) rotate(${textElement.rotation || 0}deg)`,
        transformOrigin: 'top left',
        zIndex: 50,
      }}
    >
      <textarea
        ref={textareaRef}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        style={{
          fontFamily: textElement.fontFamily || 'Inter',
          fontSize: `${textElement.fontSize || 16}px`,
          fontWeight: textElement.fontWeight || 400,
          color: typeof textElement.fill === 'string' ? textElement.fill : '#FFFFFF',
          textAlign: textElement.textAlign || 'left',
          lineHeight: textElement.lineHeight || 1.4,
          letterSpacing: textElement.letterSpacing ? `${textElement.letterSpacing}px` : undefined,
          width: `${Math.max(textElement.width || 120, 100)}px`,
          minHeight: `${Math.max(textElement.height || 30, 30)}px`,
        }}
        className="bg-neutral-900/90 border border-indigo-500 rounded p-1 outline-none resize-none shadow-2xl overflow-hidden"
      />
    </div>
  );
}