import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { ChevronRight, FileText, Frame, Folder, Square } from 'lucide-react';
export function Breadcrumbs() {
  const {
    activePage,
    elements,
    selectedIds,
    setSelectedIds,
  } = useEditor();
  if (selectedIds.length === 0) return null;
  const trail = [{ id: 'page', name: activePage.name, type: 'page' }];
  function findPath(list, targetId, currentPath = []) {
    for (const item of list) {
      if (item.id === targetId) {
        return [...currentPath, item];
      }
      if (Array.isArray(item.children)) {
        const found = findPath(item.children, targetId, [...currentPath, item]);
        if (found) return found;
      }
    }
    return null;
  }
  const primaryId = selectedIds[0];
  const itemPath = findPath(elements, primaryId);
  if (itemPath) {
    itemPath.forEach((p) => trail.push(p));
  }
  return (
    <div className="absolute top-4 left-4 z-20 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-neutral-300 shadow-xl select-none">
      {trail.map((item, idx) => {
        const isLast = idx === trail.length - 1;
        return (
          <React.Fragment key={item.id || idx}>
            <button
              onClick={() => {
                if (item.type !== 'page') {
                  setSelectedIds([item.id]);
                }
              }}
              className={`hover:text-white transition-colors truncate max-w-[120px] ${isLast ? 'text-indigo-400 font-semibold' : 'text-neutral-400'}`}
            >
              {item.name}
            </button>
            {!isLast && <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}