import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_PROJECTS } from '../constants/templates';
import { TOOLS } from '../constants/tools';
import { DEFAULT_STYLE_TOKENS } from '../constants/presets';
import { generateId, getSelectionBoundingBox } from '../utils/math';
import { computeAutoLayout } from '../utils/autoLayout';
import { applyConstraints } from '../utils/constraints';
import {
  saveProjectToDB,
  getProjectFromDB,
  getAllProjectsFromDB,
  deleteProjectFromDB,
  saveRecoveryCheckpoint,
  getRecoveryCheckpoint,
  clearRecoveryCheckpoint
} from '../utils/idb';
import { getStoredTheme, setStoredTheme, getLastProjectId, setLastProjectId, getStoredUIPrefs, setStoredUIPrefs } from '../utils/storage';
import { exportProjectToJson, exportToSvg, exportToPng } from '../utils/export';
import { validateProjectJson, readLocalImageFile } from '../utils/import';
const EditorContext = createContext(null);
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
export function EditorProvider({ children }) {
  const [project, setProject] = useState(() => {
    return DEMO_PROJECTS[0];
  });
  const [activePageId, setActivePageId] = useState(() => {
    return DEMO_PROJECTS[0].pages[0].id;
  });
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [activeTab, setActiveTab] = useState('design');
  const [currentView, setCurrentView] = useState('editor');
  const [activeSidebarTab, setActiveSidebarTab] = useState('templates');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [leftTab, setLeftTab] = useState('layers');
  const [theme, setTheme] = useState(() => getStoredTheme());

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 100, y: 80 });
  const initialPrefs = getStoredUIPrefs();
  const [showGrid, setShowGrid] = useState(initialPrefs.showGrid ?? true);
  const [gridType, setGridType] = useState(initialPrefs.gridType || 'dots');
  const [showRulers, setShowRulers] = useState(initialPrefs.showRulers ?? true);
  const [snapToObjects, setSnapToObjects] = useState(initialPrefs.snapToObjects ?? true);
  const [snapToGrid, setSnapToGrid] = useState(initialPrefs.snapToGrid ?? false);
  const [smartGuides, setSmartGuides] = useState([]);
  const [distanceBadges, setDistanceBadges] = useState([]);
  const [altMeasurement, setAltMeasurement] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [presentModeOpen, setPresentModeOpen] = useState(false);
  const [presentationModalOpen, setPresentationModalOpen] = useState(false);
  const [speakerNotesOpen, setSpeakerNotesOpen] = useState(false);
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);


  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetId: null });
  const [designDoctorOpen, setDesignDoctorOpen] = useState(false);
  const [componentLabOpen, setComponentLabOpen] = useState(false);
  const [timeMachineOpen, setTimeMachineOpen] = useState(false);
  const [styleExtractorOpen, setStyleExtractorOpen] = useState(false);
  const [magicResizeOpen, setMagicResizeOpen] = useState(false);
  const [variationsOpen, setVariationsOpen] = useState(false);
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [deviceMockupOpen, setDeviceMockupOpen] = useState(false);
  const [designPackageOpen, setDesignPackageOpen] = useState(false);
  const [offlineDashboardOpen, setOfflineDashboardOpen] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [responsiveSimulatorActive, setResponsiveSimulatorActive] = useState(false);
  const [recoveryCheckpoint, setRecoveryCheckpoint] = useState(null);
  useEffect(() => {
    getRecoveryCheckpoint().then((rec) => {
      if (rec && rec.data && rec.timestamp) {
        setRecoveryCheckpoint(rec);
      }
    });
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (project) {
        saveRecoveryCheckpoint(project);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [project]);
  const [clipboard, setClipboard] = useState({ elements: [], properties: null });
  const [autosaveStatus, setAutosaveStatus] = useState('saved');
  const [toastMessage, setToastMessage] = useState(null);
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);
  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ id: Date.now(), text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  }, []);
  useEffect(() => {
    setStoredTheme(theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const addUploadedAsset = useCallback((asset) => {
    setUploadedAssets((prev) => [asset, ...prev.filter((a) => a.id !== asset.id)]);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    setStoredUIPrefs({ showGrid, gridType, showRulers, snapToObjects, snapToGrid });
  }, [showGrid, gridType, showRulers, snapToObjects, snapToGrid]);
  const activePage = project.pages.find((p) => p.id === activePageId) || project.pages[0] || {
    id: 'page_fallback',
    name: 'Page 1',
    background: '#09090B',
    elements: [],
  };
  const elements = activePage.elements || [];
  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));
  const recordHistory = useCallback((prevProject) => {
    setHistoryPast((past) => [...past.slice(-40), JSON.parse(JSON.stringify(prevProject))]);
    setHistoryFuture([]);
  }, []);
  const undo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((past) => past.slice(0, -1));
    setHistoryFuture((future) => [JSON.parse(JSON.stringify(project)), ...future]);
    setProject(previous);
    showToast('Undo', 'info');
  }, [historyPast, project, showToast]);
  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture((future) => future.slice(1));
    setHistoryPast((past) => [...past, JSON.parse(JSON.stringify(project))]);
    setProject(next);
    showToast('Redo', 'info');
  }, [historyFuture, project, showToast]);
  const updateProject = useCallback((updater, commit = true) => {
    setProject((prev) => {
      if (commit) recordHistory(prev);
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      setAutosaveStatus('saving');
      return {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [recordHistory]);
  const updateActivePageElements = useCallback((newElements, commit = true) => {
    updateProject((prev) => {
      const updatedPages = prev.pages.map((p) => {
        if (p.id === activePageId) {
          return { ...p, elements: newElements };
        }
        return p;
      });
      return { ...prev, pages: updatedPages };
    }, commit);
  }, [activePageId, updateProject]);
  const updateElementProperties = useCallback((targetIds, updates, commit = true) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    updateProject((prev) => {
      const updatedPages = prev.pages.map((p) => {
        if (p.id !== activePageId) return p;
        const updateRecursive = (list) => {
          return list.map((el) => {
            if (ids.includes(el.id)) {
              const updatedEl = typeof updates === 'function' ? updates(el) : { ...el, ...updates };
              if (updatedEl.autoLayout && updatedEl.autoLayout.enabled) {
                return computeAutoLayout(updatedEl);
              }
              return updatedEl;
            }
            if (el.children && el.children.length > 0) {
              const updatedChildren = updateRecursive(el.children);
              let parentEl = { ...el, children: updatedChildren };
              if (parentEl.autoLayout && parentEl.autoLayout.enabled) {
                parentEl = computeAutoLayout(parentEl);
              }
              return parentEl;
            }
            return el;
          });
        };
        return { ...p, elements: updateRecursive(p.elements) };
      });
      return { ...prev, pages: updatedPages };
    }, commit);
  }, [activePageId, updateProject]);
  const addElement = useCallback((newElement) => {
    const elWithId = {
      ...newElement,
      id: newElement.id || generateId(newElement.type || 'el'),
      name: newElement.name || `${newElement.type || 'Layer'} ${elements.length + 1}`,
    };
    updateActivePageElements([...elements, elWithId], true);
    setSelectedIds([elWithId.id]);
    setActiveTool(TOOLS.SELECT);
    showToast(`Created ${elWithId.name}`, 'success');
    return elWithId;
  }, [elements, updateActivePageElements, showToast]);
  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const deleteRecursive = (list) => {
      return list
        .filter((el) => !selectedIds.includes(el.id))
        .map((el) => {
          if (el.children) return { ...el, children: deleteRecursive(el.children) };
          return el;
        });
    };
    updateActivePageElements(deleteRecursive(elements), true);
    setSelectedIds([]);
    showToast('Deleted selected items', 'info');
  }, [elements, selectedIds, updateActivePageElements, showToast]);
  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newItems = [];
    const cloneRecursive = (el) => {
      const cloned = {
        ...JSON.parse(JSON.stringify(el)),
        id: generateId(el.type),
        name: `${el.name} (Copy)`,
        x: (el.x || 0) + 24,
        y: (el.y || 0) + 24,
      };
      if (cloned.children) {
        cloned.children = cloned.children.map(cloneRecursive);
      }
      return cloned;
    };
    elements.forEach((el) => {
      if (selectedIds.includes(el.id)) {
        const cloned = cloneRecursive(el);
        newItems.push(cloned);
      }
    });
    if (newItems.length > 0) {
      updateActivePageElements([...elements, ...newItems], true);
      setSelectedIds(newItems.map((item) => item.id));
      showToast(`Duplicated ${newItems.length} item(s)`, 'success');
    }
  }, [elements, selectedIds, updateActivePageElements, showToast]);
  const groupSelected = useCallback(() => {
    if (selectedIds.length < 2) return;
    const itemsToGroup = elements.filter((el) => selectedIds.includes(el.id));
    const remaining = elements.filter((el) => !selectedIds.includes(el.id));
    const bounds = getSelectionBoundingBox(itemsToGroup);
    const relativeChildren = itemsToGroup.map((item) => ({
      ...item,
      x: item.x - bounds.x,
      y: item.y - bounds.y,
    }));
    const groupElement = {
      id: generateId('group'),
      name: `Group ${elements.length + 1}`,
      type: 'group',
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      children: relativeChildren,
    };
    updateActivePageElements([...remaining, groupElement], true);
    setSelectedIds([groupElement.id]);
    showToast('Grouped selection', 'success');
  }, [elements, selectedIds, updateActivePageElements, showToast]);
  const ungroupSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    let hasUngrouped = false;
    let newElements = [];
    const newSelectedIds = [];
    elements.forEach((el) => {
      if (selectedIds.includes(el.id) && (el.type === 'group' || el.type === 'frame') && el.children) {
        hasUngrouped = true;
        const unpacked = el.children.map((child) => ({
          ...child,
          x: (el.x || 0) + (child.x || 0),
          y: (el.y || 0) + (child.y || 0),
        }));
        newElements = [...newElements, ...unpacked];
        newSelectedIds.push(...unpacked.map((u) => u.id));
      } else {
        newElements.push(el);
      }
    });
    if (hasUngrouped) {
      updateActivePageElements(newElements, true);
      setSelectedIds(newSelectedIds);
      showToast('Ungrouped selection', 'info');
    }
  }, [elements, selectedIds, updateActivePageElements, showToast]);
  const bringForward = useCallback(() => {
    if (selectedIds.length === 0) return;
    const list = [...elements];
    for (let i = list.length - 2; i >= 0; i--) {
      if (selectedIds.includes(list[i].id) && !selectedIds.includes(list[i + 1].id)) {
        const temp = list[i];
        list[i] = list[i + 1];
        list[i + 1] = temp;
      }
    }
    updateActivePageElements(list, true);
  }, [elements, selectedIds, updateActivePageElements]);
  const sendBackward = useCallback(() => {
    if (selectedIds.length === 0) return;
    const list = [...elements];
    for (let i = 1; i < list.length; i++) {
      if (selectedIds.includes(list[i].id) && !selectedIds.includes(list[i - 1].id)) {
        const temp = list[i];
        list[i] = list[i - 1];
        list[i - 1] = temp;
      }
    }
    updateActivePageElements(list, true);
  }, [elements, selectedIds, updateActivePageElements]);
  const bringToFront = useCallback(() => {
    if (selectedIds.length === 0) return;
    const selected = elements.filter((el) => selectedIds.includes(el.id));
    const rest = elements.filter((el) => !selectedIds.includes(el.id));
    updateActivePageElements([...rest, ...selected], true);
  }, [elements, selectedIds, updateActivePageElements]);
  const sendToBack = useCallback(() => {
    if (selectedIds.length === 0) return;
    const selected = elements.filter((el) => selectedIds.includes(el.id));
    const rest = elements.filter((el) => !selectedIds.includes(el.id));
    updateActivePageElements([...selected, ...rest], true);
  }, [elements, selectedIds, updateActivePageElements]);
  const toggleLock = useCallback((id) => {
    updateElementProperties(id, (el) => ({ ...el, locked: !el.locked }), true);
  }, [updateElementProperties]);
  const toggleHide = useCallback((id) => {
    updateElementProperties(id, (el) => ({ ...el, hidden: !el.hidden }), true);
  }, [updateElementProperties]);
  const createMasterComponent = useCallback((id) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;
    const compId = generateId('comp_master');
    const masterComponent = {
      ...JSON.parse(JSON.stringify(target)),
      id: compId,
      name: `❖ ${target.name}`,
      isMasterComponent: true,
    };
    updateProject((prev) => ({
      ...prev,
      components: {
        ...(prev.components || {}),
        [compId]: masterComponent,
      },
    }), true);
    updateElementProperties(id, { isMasterComponent: true, componentId: compId }, true);
    showToast('Created Master Component', 'success');
  }, [elements, updateProject, updateElementProperties, showToast]);
  const createComponentInstance = useCallback((masterCompId, x = 100, y = 100) => {
    const master = project.components && project.components[masterCompId];
    if (!master) return;
    const instance = {
      ...JSON.parse(JSON.stringify(master)),
      id: generateId('instance'),
      name: `◇ ${master.name.replace('❖ ', '')} Instance`,
      x,
      y,
      isMasterComponent: false,
      masterComponentId: masterCompId,
    };
    addElement(instance);
  }, [project.components, addElement]);
  const alignSelected = useCallback((type) => {
    if (selectedIds.length === 0) return;
    const selected = elements.filter((el) => selectedIds.includes(el.id));
    if (selected.length === 0) return;
    const bounds = getSelectionBoundingBox(selected);
    updateProject((prev) => {
      const updatedPages = prev.pages.map((p) => {
        if (p.id !== activePageId) return p;
        const updatedElements = p.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          let newX = el.x;
          let newY = el.y;
          switch (type) {
            case 'left':
              newX = bounds.x;
              break;
            case 'center':
              newX = bounds.x + (bounds.width - el.width) / 2;
              break;
            case 'right':
              newX = bounds.x + bounds.width - el.width;
              break;
            case 'top':
              newY = bounds.y;
              break;
            case 'middle':
              newY = bounds.y + (bounds.height - el.height) / 2;
              break;
            case 'bottom':
              newY = bounds.y + bounds.height - el.height;
              break;
            default:
              break;
          }
          return { ...el, x: Math.round(newX), y: Math.round(newY) };
        });
        return { ...p, elements: updatedElements };
      });
      return { ...prev, pages: updatedPages };
    }, true);
    showToast(`Aligned ${type}`, 'info');
  }, [elements, selectedIds, activePageId, updateProject, showToast]);
  const distributeSelected = useCallback((axis) => {
    if (selectedIds.length < 3) return;
    const selected = elements.filter((el) => selectedIds.includes(el.id));
    if (axis === 'horizontal') {
      selected.sort((a, b) => a.x - b.x);
      const totalWidth = selected.reduce((sum, item) => sum + item.width, 0);
      const minX = selected[0].x;
      const maxX = selected[selected.length - 1].x + selected[selected.length - 1].width;
      const totalGap = maxX - minX - totalWidth;
      const gap = totalGap / (selected.length - 1);
      let currentX = minX;
      const updates = {};
      selected.forEach((item) => {
        updates[item.id] = { x: Math.round(currentX) };
        currentX += item.width + gap;
      });
      updateProject((prev) => {
        const updatedPages = prev.pages.map((p) => {
          if (p.id !== activePageId) return p;
          return {
            ...p,
            elements: p.elements.map((el) => (updates[el.id] ? { ...el, ...updates[el.id] } : el)),
          };
        });
        return { ...prev, pages: updatedPages };
      }, true);
    } else {
      selected.sort((a, b) => a.y - b.y);
      const totalHeight = selected.reduce((sum, item) => sum + item.height, 0);
      const minY = selected[0].y;
      const maxY = selected[selected.length - 1].y + selected[selected.length - 1].height;
      const totalGap = maxY - minY - totalHeight;
      const gap = totalGap / (selected.length - 1);
      let currentY = minY;
      const updates = {};
      selected.forEach((item) => {
        updates[item.id] = { y: Math.round(currentY) };
        currentY += item.height + gap;
      });
      updateProject((prev) => {
        const updatedPages = prev.pages.map((p) => {
          if (p.id !== activePageId) return p;
          return {
            ...p,
            elements: p.elements.map((el) => (updates[el.id] ? { ...el, ...updates[el.id] } : el)),
          };
        });
        return { ...prev, pages: updatedPages };
      }, true);
    }
    showToast(`Distributed ${axis}`, 'info');
  }, [elements, selectedIds, activePageId, updateProject, showToast]);
  const addPage = useCallback((name) => {
    const newPage = {
      id: generateId('page'),
      name: name || `Page ${project.pages.length + 1}`,
      background: '#09090B',
      elements: [],
    };
    updateProject((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }), true);
    setActivePageId(newPage.id);
    showToast(`Created ${newPage.name}`, 'success');
  }, [project.pages.length, updateProject, showToast]);
  const renamePage = useCallback((pageId, newName) => {
    updateProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.id === pageId ? { ...p, name: newName } : p)),
    }), true);
  }, [updateProject]);
  const duplicatePage = useCallback((pageId) => {
    const pageToDup = project.pages.find((p) => p.id === pageId);
    if (!pageToDup) return;
    const cloned = {
      ...JSON.parse(JSON.stringify(pageToDup)),
      id: generateId('page'),
      name: `${pageToDup.name} (Copy)`,
    };
    updateProject((prev) => ({
      ...prev,
      pages: [...prev.pages, cloned],
    }), true);
    setActivePageId(cloned.id);
    showToast(`Duplicated page`, 'success');
  }, [project.pages, updateProject, showToast]);
  const deletePage = useCallback((pageId) => {
    if (project.pages.length <= 1) {
      showToast('Cannot delete the only page in project', 'error');
      return;
    }
    const remaining = project.pages.filter((p) => p.id !== pageId);
    updateProject((prev) => ({
      ...prev,
      pages: remaining,
    }), true);
    if (activePageId === pageId) {
      setActivePageId(remaining[0].id);
    }
    showToast('Deleted page', 'info');
  }, [project.pages, activePageId, updateProject, showToast]);
  const addPrototypeLink = useCallback((fromElementId, toFrameId, options = {}) => {
    const link = {
      id: generateId('proto'),
      fromElementId,
      toFrameId,
      trigger: options.trigger || 'click',
      action: options.action || 'navigate',
      transition: options.transition || 'slide_left',
      duration: options.duration || 300,
    };
    updateProject((prev) => ({
      ...prev,
      prototypes: [...(prev.prototypes || []).filter((p) => p.fromElementId !== fromElementId), link],
    }), true);
    showToast('Connected prototype interaction', 'success');
  }, [updateProject, showToast]);
  const removePrototypeLink = useCallback((linkId) => {
    updateProject((prev) => ({
      ...prev,
      prototypes: (prev.prototypes || []).filter((p) => p.id !== linkId),
    }), true);
    showToast('Removed interaction', 'info');
  }, [updateProject, showToast]);
  const addComment = useCallback((x, y, text, author = 'Designer') => {
    const newComment = {
      id: generateId('comm'),
      pageId: activePageId,
      x: Math.round(x),
      y: Math.round(y),
      author,
      text,
      createdAt: 'Just now',
      resolved: false,
      replies: [],
    };
    updateProject((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }), true);
    showToast('Comment added', 'success');
    setActiveTool(TOOLS.SELECT);
  }, [activePageId, updateProject, showToast]);
  const resolveComment = useCallback((id) => {
    updateProject((prev) => ({
      ...prev,
      comments: (prev.comments || []).map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)),
    }), true);
  }, [updateProject]);
  const deleteComment = useCallback((id) => {
    updateProject((prev) => ({
      ...prev,
      comments: (prev.comments || []).filter((c) => c.id !== id),
    }), true);
    showToast('Comment deleted', 'info');
  }, [updateProject, showToast]);
  const replyComment = useCallback((id, replyText, author = 'You') => {
    updateProject((prev) => ({
      ...prev,
      comments: (prev.comments || []).map((c) => {
        if (c.id === id) {
          return {
            ...c,
            replies: [...(c.replies || []), { id: generateId('rep'), author, text: replyText, createdAt: 'Just now' }],
          };
        }
        return c;
      }),
    }), true);
  }, [updateProject]);
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveProjectToDB(project);
        setLastProjectId(project.id);
        setAutosaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setAutosaveStatus('unsaved');
      }
    }, 600);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [project]);
  useEffect(() => {
    async function initStorage() {
      const lastId = getLastProjectId();
      if (lastId) {
        const savedProj = await getProjectFromDB(lastId);
        if (savedProj && savedProj.pages && savedProj.pages.length > 0) {
          setProject(savedProj);
          setActivePageId(savedProj.pages[0].id);
        }
      }
    }
    initStorage();
  }, []);
  const loadProject = useCallback((newProj) => {
    const validated = validateProjectJson(newProj);
    setProject(validated);
    setActivePageId(validated.pages[0].id);
    setSelectedIds([]);
    setHistoryPast([]);
    setHistoryFuture([]);
    showToast(`Loaded ${validated.name}`, 'success');
  }, [showToast]);
  const createNewProject = useCallback((templateId = null) => {
    let projToLoad = null;
    if (templateId) {
      projToLoad = DEMO_PROJECTS.find((p) => p.id === templateId);
    }
    if (!projToLoad) {
      projToLoad = {
        id: generateId('proj'),
        name: 'Untitled Design',
        updatedAt: new Date().toISOString(),
        pages: [
          {
            id: generateId('page'),
            name: 'Page 1',
            background: '#09090B',
            elements: [],
          }
        ],
        prototypes: [],
        comments: [],
        components: {},
      };
    } else {
      projToLoad = JSON.parse(JSON.stringify(projToLoad));
      projToLoad.id = generateId('proj');
      projToLoad.name = `${projToLoad.name} (New)`;
    }
    setProject(projToLoad);
    setActivePageId(projToLoad.pages[0].id);
    setSelectedIds([]);
    setHistoryPast([]);
    setHistoryFuture([]);
    showToast(`Created new project`, 'success');
  }, [showToast]);
  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(32, Math.round((z + 0.15) * 100) / 100));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.1, Math.round((z - 0.15) * 100) / 100));
  }, []);
  const zoomTo100 = useCallback(() => {
    setZoom(1);
  }, []);
  const zoomToFit = useCallback(() => {
    if (elements.length === 0) {
      setZoom(1);
      setPan({ x: 100, y: 80 });
      return;
    }
    const bounds = getSelectionBoundingBox(elements);
    const canvasContainer = document.getElementById('canvas-workspace-container');
    if (!canvasContainer) return;
    const viewW = canvasContainer.clientWidth - 160;
    const viewH = canvasContainer.clientHeight - 160;
    const scaleX = viewW / bounds.width;
    const scaleY = viewH / bounds.height;
    const newZoom = Math.min(1.5, Math.max(0.2, Math.min(scaleX, scaleY)));
    setZoom(Math.round(newZoom * 100) / 100);
    setPan({
      x: Math.round((viewW - bounds.width * newZoom) / 2 - bounds.x * newZoom + 80),
      y: Math.round((viewH - bounds.height * newZoom) / 2 - bounds.y * newZoom + 80),
    });
    showToast('Zoom to fit', 'info');
  }, [elements, showToast]);
  const zoomToSelection = useCallback(() => {
    if (selectedElements.length === 0) {
      zoomToFit();
      return;
    }
    const bounds = getSelectionBoundingBox(selectedElements);
    const canvasContainer = document.getElementById('canvas-workspace-container');
    if (!canvasContainer) return;
    const viewW = canvasContainer.clientWidth - 200;
    const viewH = canvasContainer.clientHeight - 200;
    const scaleX = viewW / bounds.width;
    const scaleY = viewH / bounds.height;
    const newZoom = Math.min(2.5, Math.max(0.3, Math.min(scaleX, scaleY)));
    setZoom(Math.round(newZoom * 100) / 100);
    setPan({
      x: Math.round((viewW - bounds.width * newZoom) / 2 - bounds.x * newZoom + 100),
      y: Math.round((viewH - bounds.height * newZoom) / 2 - bounds.y * newZoom + 100),
    });
  }, [selectedElements, zoomToFit]);
  const value = {
    project,
    setProject,
    activePageId,
    setActivePageId,
    activePage,
    elements,
    selectedIds,
    setSelectedIds,
    selectedElements,
    hoveredId,
    setHoveredId,
    editingTextId,
    setEditingTextId,
    activeTool,
    setActiveTool,
    activeTab,
    setActiveTab,
    currentView,
    setCurrentView,
    activeSidebarTab,
    setActiveSidebarTab,
    sidebarOpen,
    setSidebarOpen,
    uploadedAssets,
    setUploadedAssets,
    addUploadedAsset,
    leftTab,
    setLeftTab,
    theme,

    toggleTheme,
    zoom,
    setZoom,
    pan,
    setPan,
    showGrid,
    setShowGrid,
    gridType,
    setGridType,
    showRulers,
    setShowRulers,
    snapToObjects,
    setSnapToObjects,
    snapToGrid,
    setSnapToGrid,
    smartGuides,
    setSmartGuides,
    distanceBadges,
    setDistanceBadges,
    altMeasurement,
    setAltMeasurement,
    commandPaletteOpen,
    setCommandPaletteOpen,
    exportModalOpen,
    setExportModalOpen,
    shortcutsModalOpen,
    setShortcutsModalOpen,
    presentModeOpen,
    setPresentModeOpen,
    presentationModalOpen,
    setPresentationModalOpen,
    speakerNotesOpen,
    setSpeakerNotesOpen,
    projectManagerOpen,
    setProjectManagerOpen,
    resetModalOpen,
    setResetModalOpen,

    contextMenu,
    setContextMenu,
    designDoctorOpen,
    setDesignDoctorOpen,
    componentLabOpen,
    setComponentLabOpen,
    timeMachineOpen,
    setTimeMachineOpen,
    styleExtractorOpen,
    setStyleExtractorOpen,
    magicResizeOpen,
    setMagicResizeOpen,
    variationsOpen,
    setVariationsOpen,
    templateLibraryOpen,
    setTemplateLibraryOpen,
    missionsOpen,
    setMissionsOpen,
    accessibilityModalOpen,
    setAccessibilityModalOpen,
    performanceModalOpen,
    setPerformanceModalOpen,
    deviceMockupOpen,
    setDeviceMockupOpen,
    designPackageOpen,
    setDesignPackageOpen,
    offlineDashboardOpen,
    setOfflineDashboardOpen,
    blueprintMode,
    setBlueprintMode,
    responsiveSimulatorActive,
    setResponsiveSimulatorActive,
    recoveryCheckpoint,
    setRecoveryCheckpoint,
    clipboard,
    setClipboard,
    autosaveStatus,
    toastMessage,
    showToast,
    undo,
    redo,
    canUndo: historyPast.length > 0,
    canRedo: historyFuture.length > 0,
    updateProject,
    updateActivePageElements,
    updateElementProperties,
    addElement,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    ungroupSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    toggleLock,
    toggleHide,
    createMasterComponent,
    createComponentInstance,
    alignSelected,
    distributeSelected,
    addPage,
    renamePage,
    duplicatePage,
    deletePage,
    addPrototypeLink,
    removePrototypeLink,
    addComment,
    resolveComment,
    deleteComment,
    replyComment,
    loadProject,
    createNewProject,
    zoomIn,
    zoomOut,
    zoomTo100,
    zoomToFit,
    zoomToSelection,
  };
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}