import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  Frame,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Folder,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Sparkles,
  PenTool,
  Pencil,
  Triangle,
  Hexagon,
  Star,
  Minus,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  BarChart3
} from 'lucide-react';

export function LayersTree({ searchQuery = '' }) {
  const {
    elements,
    selectedIds,
    setSelectedIds,
    updateElementProperties,
    toggleLock,
    toggleHide,
    hoveredId,
    setHoveredId,
  } = useEditor();

  const [editingLayerId, setEditingLayerId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroupCollapse = (id, e) => {
    e.stopPropagation();
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startRename = (el, e) => {
    e.stopPropagation();
    setEditingLayerId(el.id);
    setEditingName(el.name);
  };

  const submitRename = (id) => {
    if (editingName.trim()) {
      updateElementProperties(id, { name: editingName.trim() }, true);
    }
    setEditingLayerId(null);
  };

  const getElementIcon = (el) => {
    if (el.isMasterComponent) return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    switch (el.type) {
      case 'chart': return <BarChart3 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'frame': return <Frame className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'group': return <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'text': return <Type className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'image': return <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'ellipse': return <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'triangle': return <Triangle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'polygon': return <Hexagon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'star': return <Star className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'line': return <Minus className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'arrow': return <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
      case 'pen_path': return <PenTool className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'pencil_stroke': return <Pencil className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      default: return <Square className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
    }
  };

  const renderLayerNode = (el, depth = 0) => {
    const isSelected = selectedIds.includes(el.id);
    const isHovered = hoveredId === el.id;
    const isEditing = editingLayerId === el.id;
    const hasChildren = Array.isArray(el.children) && el.children.length > 0;
    const isCollapsed = Boolean(collapsedGroups[el.id]);

    if (searchQuery && !el.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!hasChildren) return null;
    }

    return (
      <div key={el.id} className="flex flex-col select-none">
        <div
          onClick={(e) => {
            if (e.shiftKey) {
              setSelectedIds((prev) => (prev.includes(el.id) ? prev.filter((i) => i !== el.id) : [...prev, el.id]));
            } else {
              setSelectedIds([el.id]);
            }
          }}
          onDoubleClick={(e) => startRename(el, e)}
          onMouseEnter={() => setHoveredId(el.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{ paddingLeft: `${Math.max(8, depth * 14 + 8)}px` }}
          className={`h-7 pr-2 flex items-center justify-between text-xs cursor-pointer group transition-all rounded-lg mx-1 ${
            isSelected
              ? 'bg-indigo-600/20 text-indigo-200 font-medium border border-indigo-500/40 shadow-sm'
              : isHovered
              ? 'bg-neutral-800/60 text-neutral-100'
              : 'text-neutral-300 hover:text-neutral-100'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleGroupCollapse(el.id, e)}
                className="p-0.5 hover:text-white rounded transition-colors text-neutral-500"
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            ) : (
              <span className="w-3" />
            )}

            {getElementIcon(el)}

            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => submitRename(el.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename(el.id);
                  if (e.key === 'Escape') setEditingLayerId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-950 border border-indigo-500 text-xs px-1 py-0.2 rounded text-white outline-none w-28 font-normal"
              />
            ) : (
              <span className="truncate text-xs">{el.name}</span>
            )}
          </div>

          <div className={`flex items-center gap-1 ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`}>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLock(el.id); }}
              className={`p-0.5 rounded hover:text-white ${el.locked ? 'text-amber-400 opacity-100' : 'text-neutral-500'}`}
              title={el.locked ? 'Unlock Layer' : 'Lock Layer'}
            >
              {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); toggleHide(el.id); }}
              className={`p-0.5 rounded hover:text-white ${el.hidden ? 'text-rose-400 opacity-100' : 'text-neutral-500'}`}
              title={el.hidden ? 'Show Layer' : 'Hide Layer'}
            >
              {el.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="flex flex-col">
            {el.children.map((child) => renderLayerNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto py-1.5 space-y-0.5">
      {elements.length === 0 ? (
        <div className="p-6 text-center text-xs text-neutral-500 space-y-1">
          <Layers className="w-6 h-6 mx-auto opacity-30 text-neutral-400 mb-1" />
          <p className="font-medium text-neutral-300">No layers on canvas</p>
          <p className="text-[11px] text-neutral-500">Insert frames, shapes or text to begin designing</p>
        </div>
      ) : (
        [...elements].reverse().map((el) => renderLayerNode(el, 0))
      )}
    </div>
  );
}
