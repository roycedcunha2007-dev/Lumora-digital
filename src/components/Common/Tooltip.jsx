import React, { useState } from 'react';
export function Tooltip({ children, content, shortcut, position = 'bottom', delay = 300 }) {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(null);
  if (!content) return children;
  const handleMouseEnter = () => {
    const t = setTimeout(() => setVisible(true), delay);
    setTimer(t);
  };
  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setVisible(false);
  };
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };
  return (
    <div className="relative inline-flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {visible && (
        <div
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-2 py-1 bg-neutral-900 text-neutral-100 text-[11px] font-medium rounded shadow-xl border border-neutral-700/80 flex items-center gap-1.5 transition-opacity duration-150 ${getPositionClasses()}`}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="px-1 py-0.5 text-[9px] font-mono font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700 rounded">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}