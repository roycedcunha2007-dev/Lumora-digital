import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TOOLS } from '../../constants/tools';
import { screenToCanvas, getSelectionBoundingBox, calculateResizeTransform, radToDeg } from '../../utils/math';
import { calculateSnapping, calculateAltMeasurement } from '../../utils/snapping';
import { GridOverlay } from './GridOverlay';
import { Rulers } from './Rulers';
import { CanvasElement } from './CanvasElement';
import { SelectionOverlay } from './SelectionOverlay';
import { SmartGuidesOverlay } from './SmartGuidesOverlay';
import { PrototypeWiresOverlay } from './PrototypeWiresOverlay';
import { CommentsOverlay } from './CommentsOverlay';
import { InlineTextEditor } from './InlineTextEditor';
import { Breadcrumbs } from './Breadcrumbs';
import { QuickActionsHUD } from './QuickActionsHUD';
import { CanvasMinimap } from './CanvasMinimap';
import { BlueprintOverlay } from './BlueprintOverlay';
import { ResponsiveSimulatorOverlay } from './ResponsiveSimulatorOverlay';

export function Canvas() {
  const {
    elements,
    selectedIds,
    setSelectedIds,
    selectedElements,
    hoveredId,
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
    pan,
    setPan,
    showGrid,
    gridType,
    showRulers,
    snapToObjects,
    snapToGrid,
    smartGuides,
    setSmartGuides,
    distanceBadges,
    setDistanceBadges,
    altMeasurement,
    setAltMeasurement,
    blueprintMode,
    responsiveSimulatorActive,
    updateActivePageElements,
    updateElementProperties,
    addElement,
    setEditingTextId,
    setContextMenu,
    addComment,
    addPrototypeLink,
  } = useEditor();
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [altPressed, setAltPressed] = useState(false);
  const [marquee, setMarquee] = useState(null); 
  const [isDraggingObjects, setIsDraggingObjects] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialElementPositions, setInitialElementPositions] = useState({});
  const [resizingHandle, setResizingHandle] = useState(null);
  const [initialResizeBounds, setInitialResizeBounds] = useState(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [drawingShape, setDrawingShape] = useState(null);
  const [pencilStroke, setPencilStroke] = useState(null);
  const [wireDrag, setWireDrag] = useState(null);

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) setSpacePressed(true);
      if (e.altKey) setAltPressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') setSpacePressed(false);
      if (!e.altKey) {
        setAltPressed(false);
        setAltMeasurement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAltMeasurement]);
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        const newZoom = Math.min(32, Math.max(0.05, zoom * zoomFactor));
        if (containerRect) {
          const mouseCanvasX = (e.clientX - containerRect.left - pan.x) / zoom;
          const mouseCanvasY = (e.clientY - containerRect.top - pan.y) / zoom;
          setPan({
            x: e.clientX - containerRect.left - mouseCanvasX * newZoom,
            y: e.clientY - containerRect.top - mouseCanvasY * newZoom,
          });
        }
        setZoom(newZoom);
      } else {
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    [zoom, pan, containerRect, setZoom, setPan]
  );
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);
  const handleMouseDown = (e) => {
    if (e.button === 2) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        targetId: hoveredId,
      });
      return;
    }
    setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
    const canvasCoords = screenToCanvas(e.clientX, e.clientY, pan, zoom, containerRect);
    if (activeTool === TOOLS.HAND || spacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    if (activeTool === TOOLS.ZOOM) {
      if (e.altKey) {
        setZoom((z) => Math.max(0.1, z * 0.75));
      } else {
        setZoom((z) => Math.min(32, z * 1.35));
      }
      return;
    }
    if (activeTool === TOOLS.COMMENT) {
      addComment(canvasCoords.x, canvasCoords.y, 'New feedback note...', 'You');
      return;
    }
    if (activeTool === TOOLS.PEN) {
      const newPoint = { x: Math.round(canvasCoords.x), y: Math.round(canvasCoords.y) };
      setPenPoints((prev) => [...prev, newPoint]);
      return;
    }
    if (activeTool === TOOLS.PENCIL) {
      const pt = { x: Math.round(canvasCoords.x), y: Math.round(canvasCoords.y) };
      setPencilStroke({ points: [pt], d: `M ${pt.x} ${pt.y}` });
      return;
    }
    const creationTools = [
      TOOLS.FRAME,
      TOOLS.RECTANGLE,
      TOOLS.ROUNDED_RECT,
      TOOLS.ELLIPSE,
      TOOLS.TRIANGLE,
      TOOLS.POLYGON,
      TOOLS.STAR,
      TOOLS.LINE,
      TOOLS.ARROW,
      TOOLS.TEXT,
    ];
    if (creationTools.includes(activeTool)) {
      if (activeTool === TOOLS.TEXT) {
        const newText = addElement({
          type: 'text',
          name: 'Text',
          x: Math.round(canvasCoords.x),
          y: Math.round(canvasCoords.y),
          width: 140,
          height: 32,
          text: 'Type something...',
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: 500,
          fill: '#FFFFFF',
        });
        setEditingTextId(newText.id);
        setActiveTool(TOOLS.SELECT);
        return;
      }
      setDrawingShape({
        type: activeTool,
        startX: canvasCoords.x,
        startY: canvasCoords.y,
        currentX: canvasCoords.x,
        currentY: canvasCoords.y,
      });
      return;
    }
    if (activeTool === TOOLS.SELECT) {
      if (!hoveredId) {
        if (!e.shiftKey) setSelectedIds([]);
        setMarquee({
          startX: canvasCoords.x,
          startY: canvasCoords.y,
          currentX: canvasCoords.x,
          currentY: canvasCoords.y,
        });
      }
    }
  };
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX - (containerRect ? containerRect.left : 0), y: e.clientY - (containerRect ? containerRect.top : 0) });
    const canvasCoords = screenToCanvas(e.clientX, e.clientY, pan, zoom, containerRect);
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }
    if (pencilStroke) {
      const pt = { x: Math.round(canvasCoords.x), y: Math.round(canvasCoords.y) };
      const updatedPts = [...pencilStroke.points, pt];
      const pathD = updatedPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
      setPencilStroke({ points: updatedPts, d: pathD });
      return;
    }
    if (drawingShape) {
      setDrawingShape((prev) => ({
        ...prev,
        currentX: canvasCoords.x,
        currentY: canvasCoords.y,
      }));
      return;
    }
    if (marquee) {
      const current = {
        ...marquee,
        currentX: canvasCoords.x,
        currentY: canvasCoords.y,
      };
      setMarquee(current);
      const minX = Math.min(current.startX, current.currentX);
      const maxX = Math.max(current.startX, current.currentX);
      const minY = Math.min(current.startY, current.currentY);
      const maxY = Math.max(current.startY, current.currentY);
      const enclosedIds = elements
        .filter((el) => {
          const ex = el.x;
          const ey = el.y;
          const ew = el.width || 50;
          const eh = el.height || 50;
          return ex >= minX && ex + ew <= maxX && ey >= minY && ey + eh <= maxY;
        })
        .map((el) => el.id);
      setSelectedIds(enclosedIds);
      return;
    }
    if (isDraggingObjects && selectedIds.length > 0) {
      const deltaX = canvasCoords.x - dragStartPos.x;
      const deltaY = canvasCoords.y - dragStartPos.y;
      const activeBounds = getSelectionBoundingBox(selectedElements);
      if (activeBounds && snapToObjects) {
        const otherElements = elements.filter((el) => !selectedIds.includes(el.id));
        const snapResult = calculateSnapping({
          activeBounds: {
            ...activeBounds,
            x: activeBounds.x + deltaX,
            y: activeBounds.y + deltaY,
          },
          otherElements,
          snapToGrid,
          gridSize: 8,
        });
        setSmartGuides(snapResult.guides);
        setDistanceBadges(snapResult.distanceBadges);
      }
      updateElementProperties(
        selectedIds,
        (el) => {
          const init = initialElementPositions[el.id] || { x: el.x, y: el.y };
          return {
            ...el,
            x: Math.round(init.x + deltaX),
            y: Math.round(init.y + deltaY),
          };
        },
        false
      );
      return;
    }
    if (resizingHandle && initialResizeBounds) {
      const deltaX = canvasCoords.x - resizeStartPos.x;
      const deltaY = canvasCoords.y - resizeStartPos.y;
      const newBounds = calculateResizeTransform(
        resizingHandle,
        initialResizeBounds,
        deltaX,
        deltaY,
        e.shiftKey
      );
      updateElementProperties(
        selectedIds,
        (el) => ({
          ...el,
          x: newBounds.x,
          y: newBounds.y,
          width: newBounds.width,
          height: newBounds.height,
        }),
        false
      );
      return;
    }
    if (isRotating && selectedElements.length === 1) {
      const target = selectedElements[0];
      const cx = target.x + target.width / 2;
      const cy = target.y + target.height / 2;
      const angleRad = Math.atan2(canvasCoords.y - cy, canvasCoords.x - cx);
      let angleDeg = Math.round(radToDeg(angleRad)) + 90;
      if (e.shiftKey) angleDeg = Math.round(angleDeg / 15) * 15; 
      updateElementProperties(target.id, { rotation: angleDeg }, false);
      return;
    }
    if (wireDrag) {
      setWireDrag((prev) => ({
        ...prev,
        currentX: canvasCoords.x,
        currentY: canvasCoords.y,
      }));
      return;
    }
    if (altPressed && selectedElements.length === 1 && hoveredId && hoveredId !== selectedElements[0].id) {
      const hoveredEl = elements.find((el) => el.id === hoveredId);
      if (hoveredEl) {
        const altResult = calculateAltMeasurement(
          getSelectionBoundingBox(selectedElements),
          getSelectionBoundingBox([hoveredEl])
        );
        setAltMeasurement(altResult);
      }
    } else if (!altPressed) {
      setAltMeasurement(null);
    }
  };
  const handleMouseUp = (e) => {
    setIsPanning(false);
    setSmartGuides([]);
    setDistanceBadges([]);
    if (pencilStroke && pencilStroke.points.length > 1) {
      const bounds = getSelectionBoundingBox(pencilStroke.points);
      addElement({
        type: 'pencil_stroke',
        name: `Pencil Drawing`,
        x: bounds.x,
        y: bounds.y,
        width: Math.max(bounds.width, 10),
        height: Math.max(bounds.height, 10),
        d: pencilStroke.d,
        stroke: '#A855F7',
        strokeWidth: 3,
      });
      setPencilStroke(null);
      setActiveTool(TOOLS.SELECT);
    }
    if (drawingShape) {
      const minX = Math.min(drawingShape.startX, drawingShape.currentX);
      const minY = Math.min(drawingShape.startY, drawingShape.currentY);
      const width = Math.max(Math.abs(drawingShape.currentX - drawingShape.startX), 20);
      const height = Math.max(Math.abs(drawingShape.currentY - drawingShape.startY), 20);
      addElement({
        type: drawingShape.type,
        name: `${drawingShape.type.charAt(0).toUpperCase() + drawingShape.type.slice(1).replace('_', ' ')}`,
        x: Math.round(minX),
        y: Math.round(minY),
        width: Math.round(width),
        height: Math.round(height),
        fill: drawingShape.type === 'frame' ? '#111827' : '#6366F1',
        stroke: drawingShape.type === 'frame' ? '#1F2937' : null,
        strokeWidth: drawingShape.type === 'frame' ? 1 : 0,
        cornerRadius: drawingShape.type === 'frame' ? 16 : drawingShape.type === 'rounded_rect' ? 16 : 0,
        children: [],
      });
      setDrawingShape(null);
      setActiveTool(TOOLS.SELECT);
    }
    if (wireDrag) {
      const canvasCoords = screenToCanvas(e.clientX, e.clientY, pan, zoom, containerRect);
      const targetFrame = elements.find(
        (el) =>
          el.type === 'frame' &&
          canvasCoords.x >= el.x &&
          canvasCoords.x <= el.x + el.width &&
          canvasCoords.y >= el.y &&
          canvasCoords.y <= el.y + el.height
      );
      if (targetFrame && targetFrame.id !== wireDrag.fromId) {
        addPrototypeLink(wireDrag.fromId, targetFrame.id);
      }
      setWireDrag(null);
    }
    if (isDraggingObjects) {
      setIsDraggingObjects(false);
      if (selectedElements.length > 0) {
        const selBounds = getSelectionBoundingBox(selectedElements);
        const targetFrame = elements.find(
          (el) =>
            el.type === 'frame' &&
            !selectedIds.includes(el.id) &&
            selBounds.x >= el.x &&
            selBounds.x + selBounds.width <= el.x + el.width &&
            selBounds.y >= el.y &&
            selBounds.y + selBounds.height <= el.y + el.height
        );
        if (targetFrame) {
          const nestedItems = selectedElements.map((el) => ({
            ...el,
            x: el.x - targetFrame.x,
            y: el.y - targetFrame.y,
          }));
          const remaining = elements.filter((el) => !selectedIds.includes(el.id));
          const updatedFrame = {
            ...targetFrame,
            children: [...(targetFrame.children || []), ...nestedItems],
          };
          updateActivePageElements(
            remaining.map((el) => (el.id === targetFrame.id ? updatedFrame : el)),
            true
          );
        }
      }
    }
    if (resizingHandle) {
      setResizingHandle(null);
      setInitialResizeBounds(null);
    }
    if (isRotating) {
      setIsRotating(false);
    }
    if (marquee) {
      setMarquee(null);
    }
  };
  const handleElementSelect = (el, e) => {
    if (activeTool === TOOLS.SELECT) {
      if (e.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(el.id) ? prev.filter((id) => id !== el.id) : [...prev, el.id]
        );
      } else {
        if (!selectedIds.includes(el.id)) {
          setSelectedIds([el.id]);
        }
      }
      const canvasCoords = screenToCanvas(e.clientX, e.clientY, pan, zoom, containerRect);
      setIsDraggingObjects(true);
      setDragStartPos(canvasCoords);
      const positions = {};
      elements.forEach((item) => {
        positions[item.id] = { x: item.x, y: item.y };
      });
      setInitialElementPositions(positions);
    }
  };
  const handleElementDoubleClick = (el) => {
    if (el.type === 'text') {
      setEditingTextId(el.id);
    }
  };
  const handleResizeStart = (handle, e) => {
    const canvasCoords = screenToCanvas(e.clientX, e.clientY, pan, zoom, containerRect);
    setResizingHandle(handle);
    setResizeStartPos(canvasCoords);
    setInitialResizeBounds(getSelectionBoundingBox(selectedElements));
  };
  const handleRotateStart = (e) => {
    setIsRotating(true);
  };
  const handleStartWireDrag = (fromId, startX, startY, e) => {
    setWireDrag({
      fromId,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  };
  const getCanvasCursor = () => {
    if (isPanning || spacePressed) return 'cursor-grabbing-canvas';
    if (activeTool === TOOLS.HAND) return 'cursor-grab-canvas';
    if (activeTool === TOOLS.ZOOM) return 'cursor-zoom-in-canvas';
    if (activeTool === TOOLS.COMMENT) return 'cursor-comment-canvas';
    if (activeTool === TOOLS.PEN) return 'cursor-pen-canvas';
    if (activeTool === TOOLS.PENCIL) return 'cursor-pencil-canvas';
    if (activeTool === TOOLS.TEXT) return 'cursor-text-canvas';
    if (
      [
        TOOLS.FRAME,
        TOOLS.RECTANGLE,
        TOOLS.ROUNDED_RECT,
        TOOLS.ELLIPSE,
        TOOLS.TRIANGLE,
        TOOLS.POLYGON,
        TOOLS.STAR,
        TOOLS.LINE,
        TOOLS.ARROW,
      ].includes(activeTool)
    )
      return 'cursor-crosshair-canvas';
    return 'default';
  };
  const selectionBounds = getSelectionBoundingBox(selectedElements);
  return (
    <main
      id="canvas-workspace-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{ backgroundColor: 'var(--canvas-bg)' }}
      className={`flex-1 relative overflow-hidden select-none ${getCanvasCursor()}`}
    >
      <GridOverlay pan={pan} zoom={zoom} gridType={gridType} showGrid={showGrid} />
      <svg
        id="main-canvas-svg"
        className="w-full h-full absolute inset-0 overflow-visible"
      >
        <g id="canvas-world-transform" transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {elements.map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              isSelected={selectedIds.includes(el.id)}
              isHovered={hoveredId === el.id}
              onSelect={handleElementSelect}
              onDoubleClick={handleElementDoubleClick}
              zoom={zoom}
            />
          ))}
          {pencilStroke && (
            <path
              d={pencilStroke.d}
              fill="none"
              stroke="#A855F7"
              strokeWidth={3 / zoom}
              strokeLinecap="round"
            />
          )}
          {drawingShape && (
            <rect
              x={Math.min(drawingShape.startX, drawingShape.currentX)}
              y={Math.min(drawingShape.startY, drawingShape.currentY)}
              width={Math.abs(drawingShape.currentX - drawingShape.startX)}
              height={Math.abs(drawingShape.currentY - drawingShape.startY)}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366F1"
              strokeWidth={1.5 / zoom}
              strokeDasharray={`${4 / zoom},${4 / zoom}`}
            />
          )}
          {marquee && (
            <rect
              x={Math.min(marquee.startX, marquee.currentX)}
              y={Math.min(marquee.startY, marquee.currentY)}
              width={Math.abs(marquee.currentX - marquee.startX)}
              height={Math.abs(marquee.currentY - marquee.startY)}
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#6366F1"
              strokeWidth={1 / zoom}
            />
          )}
          {wireDrag && (
            <path
              d={`M ${wireDrag.startX} ${wireDrag.startY} C ${wireDrag.startX + 100} ${wireDrag.startY}, ${wireDrag.currentX - 100} ${wireDrag.currentY}, ${wireDrag.currentX} ${wireDrag.currentY}`}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={2 / zoom}
              strokeDasharray={`${6 / zoom},${4 / zoom}`}
            />
          )}
          {selectionBounds && selectedElements.length > 0 && (
            <SelectionOverlay
              bounds={selectionBounds}
              zoom={zoom}
              onResizeStart={handleResizeStart}
              onRotateStart={handleRotateStart}
              isLocked={selectedElements.some((el) => el.locked)}
            />
          )}
          <SmartGuidesOverlay
            guides={smartGuides}
            distanceBadges={distanceBadges}
            altMeasurement={altMeasurement}
            zoom={zoom}
          />
          <PrototypeWiresOverlay zoom={zoom} onStartWireDrag={handleStartWireDrag} />
          <CommentsOverlay zoom={zoom} />
          {blueprintMode && <BlueprintOverlay zoom={zoom} />}
          {responsiveSimulatorActive && <ResponsiveSimulatorOverlay zoom={zoom} />}
        </g>
      </svg>
      <Breadcrumbs />
      <QuickActionsHUD pan={pan} zoom={zoom} containerRect={containerRect} />
      <CanvasMinimap containerRect={containerRect} />
      <InlineTextEditor pan={pan} zoom={zoom} containerRect={containerRect} />
      {showRulers && (
        <Rulers pan={pan} zoom={zoom} containerRect={containerRect} mousePos={mousePos} />
      )}
    </main>
  );
}