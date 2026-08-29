import { useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { TOOLS } from '../constants/tools';
export function useKeyboardShortcuts() {
  const {
    activeTool,
    setActiveTool,
    selectedIds,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    ungroupSelected,
    undo,
    redo,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    updateElementProperties,
    elements,
    zoomIn,
    zoomOut,
    zoomTo100,
    zoomToFit,
    zoomToSelection,
    showGrid,
    setShowGrid,
    showRulers,
    setShowRulers,
    setCommandPaletteOpen,
    setShortcutsModalOpen,
    setExportModalOpen,
    setPresentModeOpen,
    setSelectedIds,
    setEditingTextId,
    setContextMenu,
  } = useEditor();
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute('role') === 'textbox';
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (e.key === 'Escape') {
        setSelectedIds([]);
        setEditingTextId(null);
        setActiveTool(TOOLS.SELECT);
        setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
        setCommandPaletteOpen(false);
        setShortcutsModalOpen(false);
        setExportModalOpen(false);
        setPresentModeOpen(false);
        return;
      }
      if (isInput) {
        if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setCommandPaletteOpen((prev) => !prev);
        }
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }
      if (cmdOrCtrl && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setExportModalOpen((prev) => !prev);
        return;
      }
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if ((cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (cmdOrCtrl && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        groupSelected();
        return;
      }
      if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        ungroupSelected();
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(elements.map((el) => el.id));
        return;
      }
      if (cmdOrCtrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (cmdOrCtrl && e.key === '-') {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (cmdOrCtrl && e.key === '0') {
        e.preventDefault();
        zoomTo100();
        return;
      }
      if (e.shiftKey && e.key === '1') {
        e.preventDefault();
        zoomToFit();
        return;
      }
      if (e.shiftKey && e.key === '2') {
        e.preventDefault();
        zoomToSelection();
        return;
      }
      if (cmdOrCtrl && e.key === "'") {
        e.preventDefault();
        setShowGrid((prev) => !prev);
        return;
      }
      if (cmdOrCtrl && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setShowRulers((prev) => !prev);
        return;
      }
      if (cmdOrCtrl && e.shiftKey && e.key === ']') {
        e.preventDefault();
        bringToFront();
        return;
      }
      if (cmdOrCtrl && e.shiftKey && e.key === '[') {
        e.preventDefault();
        sendToBack();
        return;
      }
      if (cmdOrCtrl && e.key === ']') {
        e.preventDefault();
        bringForward();
        return;
      }
      if (cmdOrCtrl && e.key === '[') {
        e.preventDefault();
        sendBackward();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let deltaX = 0;
        let deltaY = 0;
        if (e.key === 'ArrowLeft') deltaX = -step;
        if (e.key === 'ArrowRight') deltaX = step;
        if (e.key === 'ArrowUp') deltaY = -step;
        if (e.key === 'ArrowDown') deltaY = step;
        updateElementProperties(selectedIds, (el) => ({
          ...el,
          x: (el.x || 0) + deltaX,
          y: (el.y || 0) + deltaY,
        }), true);
        return;
      }
      if (!cmdOrCtrl && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            setActiveTool(TOOLS.SELECT);
            break;
          case 'h':
            setActiveTool(TOOLS.HAND);
            break;
          case 'f':
            setActiveTool(TOOLS.FRAME);
            break;
          case 'r':
            setActiveTool(TOOLS.RECTANGLE);
            break;
          case 'u':
            setActiveTool(TOOLS.ROUNDED_RECT);
            break;
          case 'o':
            setActiveTool(TOOLS.ELLIPSE);
            break;
          case 't':
            setActiveTool(TOOLS.TEXT);
            break;
          case 'p':
            if (e.shiftKey) setActiveTool(TOOLS.PENCIL);
            else setActiveTool(TOOLS.PEN);
            break;
          case 'l':
            if (e.shiftKey) setActiveTool(TOOLS.ARROW);
            else setActiveTool(TOOLS.LINE);
            break;
          case 'c':
            setActiveTool(TOOLS.COMMENT);
            break;
          case 'z':
            setActiveTool(TOOLS.ZOOM);
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedIds,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    ungroupSelected,
    undo,
    redo,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    updateElementProperties,
    elements,
    zoomIn,
    zoomOut,
    zoomTo100,
    zoomToFit,
    zoomToSelection,
    setShowGrid,
    setShowRulers,
    setCommandPaletteOpen,
    setShortcutsModalOpen,
    setExportModalOpen,
    setPresentModeOpen,
    setSelectedIds,
    setEditingTextId,
    setContextMenu,
    setActiveTool,
  ]);
}