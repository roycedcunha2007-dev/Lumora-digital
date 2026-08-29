import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Tooltip } from '../Common/Tooltip';
import { readLocalImageFile } from '../../utils/import';
import { saveAssetToDB } from '../../utils/idb';
import {
  Home,
  Undo2,
  Redo2,
  Plus,
  Palette,
  Play,
  Download,
  ChevronDown,
  Sun,
  Moon,
  Type,
  Image as ImageIcon,
  Square,
  Frame,
  BarChart3,
  Table,
  Check,
  Sparkles,
  Command,
  Layout
} from 'lucide-react';

export function TopBar() {
  const {
    project,
    activePage,
    elements,
    updateProject,
    canUndo,
    canRedo,
    undo,
    redo,
    zoom,
    setZoom,
    zoomToFit,
    zoomTo100,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    setExportModalOpen,
    setPresentModeOpen,
    setTemplateLibraryOpen,
    setPresentationModalOpen,
    addElement,
    setSelectedIds,
    addUploadedAsset,
    setActiveSidebarTab,
    setSidebarOpen,
    setCurrentView,
    showToast,
    pan,
  } = useEditor();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name || 'Untitled Design');
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    setTitleInput(project.name || 'Untitled Design');
  }, [project.name]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
        setShowAddMenu(false);
        setShowDesignMenu(false);
        setShowZoomMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== project.name) {
      updateProject((prev) => ({ ...prev, name: titleInput.trim() }), true);
      showToast('Renamed design', 'success');
    } else {
      setTitleInput(project.name || 'Untitled Design');
    }
  };

  const handleAddAction = (type) => {
    setShowAddMenu(false);
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 400;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    if (type === 'text') {
      const newText = {
        id: `text_${Date.now()}`,
        name: 'Heading',
        type: 'text',
        x: Math.round(cx - 150),
        y: Math.round(cy - 25),
        width: 300,
        height: 50,
        text: 'Heading Text',
        fontFamily: 'Inter',
        fontSize: 32,
        fontWeight: 800,
        fill: '#FFFFFF',
        textAlign: 'left',
      };
      addElement(newText);
      setSelectedIds([newText.id]);
      showToast('Added text', 'success');
    } else if (type === 'image') {
      if (fileInputRef.current) fileInputRef.current.click();
    } else if (type === 'shape') {
      const newShape = {
        id: `rect_${Date.now()}`,
        name: 'Rectangle',
        type: 'rectangle',
        x: Math.round(cx - 100),
        y: Math.round(cy - 100),
        width: 200,
        height: 200,
        fill: '#6366F1',
        cornerRadius: 16,
      };
      addElement(newShape);
      setSelectedIds([newShape.id]);
      showToast('Added shape', 'success');
    } else if (type === 'frame') {
      const newFrame = {
        id: `frame_${Date.now()}`,
        name: 'Card Frame',
        type: 'frame',
        x: Math.round(cx - 200),
        y: Math.round(cy - 150),
        width: 400,
        height: 300,
        fill: '#0F172A',
        cornerRadius: 24,
        stroke: '#1E293B',
        strokeWidth: 1,
        children: [],
      };
      addElement(newFrame);
      setSelectedIds([newFrame.id]);
      showToast('Added frame', 'success');
    } else if (type === 'chart') {
      const newChart = {
        id: `chart_${Date.now()}`,
        name: 'Bar Chart',
        type: 'chart',
        chartType: 'bar',
        x: Math.round(cx - 220),
        y: Math.round(cy - 140),
        width: 440,
        height: 280,
        fill: '#6366F1',
        cornerRadius: 16,
        chartData: [
          { label: 'Q1', value: 120 },
          { label: 'Q2', value: 240 },
          { label: 'Q3', value: 380 },
          { label: 'Q4', value: 510 },
        ],
      };
      addElement(newChart);
      setSelectedIds([newChart.id]);
      showToast('Added chart', 'success');
    }
  };

  const handleImageFilePicked = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      showToast('Uploading image...', 'info');
      const imgData = await readLocalImageFile(file);
      const canvasContainer = document.getElementById('canvas-workspace-container');
      const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 400;
      const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

      const natW = imgData.naturalWidth || 400;
      const natH = imgData.naturalHeight || 300;
      const scale = Math.min(1, 500 / Math.max(natW, natH));
      const targetW = Math.max(60, Math.round(natW * scale));
      const targetH = Math.max(60, Math.round(natH * scale));

      const newImage = {
        id: `img_${Date.now()}`,
        name: imgData.name || file.name,
        type: 'image',
        x: Math.round(cx - targetW / 2),
        y: Math.round(cy - targetH / 2),
        width: targetW,
        height: targetH,
        originalWidth: natW,
        originalHeight: natH,
        src: imgData.src || imgData.dataUrl,
        dataUrl: imgData.dataUrl || imgData.src,
        objectFit: 'cover',
        rotation: 0,
        opacity: 1,
        cornerRadius: 0,
      };

      addElement(newImage);
      setSelectedIds([newImage.id]);
      if (addUploadedAsset) {
        addUploadedAsset({
          id: newImage.id,
          name: newImage.name,
          src: newImage.src,
          dataUrl: newImage.dataUrl,
          naturalWidth: natW,
          naturalHeight: natH,
          createdAt: new Date().toISOString(),
        });
      }
      saveAssetToDB(newImage.id, newImage.src).catch(() => {});
      showToast('Image added to canvas', 'success');
    } catch (err) {
      showToast('Failed to upload image', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header
      ref={menuRef}
      className="h-12 w-full glass-surface border-b border-neutral-800/80 px-3 flex items-center justify-between z-30 select-none shrink-0 text-neutral-200 text-xs"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('home')}
          className="p-1.5 hover:bg-neutral-800/80 rounded-xl text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
          title="Back to Home Dashboard"
        >
          <Home className="w-4 h-4 text-indigo-400" />
        </button>

        <div className="h-4 w-px bg-neutral-800/80 mx-0.5" />

        <div className="flex items-center gap-0.5">
          <Tooltip content="Undo" shortcut="Ctrl+Z">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Redo" shortcut="Ctrl+Shift+Z">
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-neutral-800/80 mx-0.5" />

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>

          {showAddMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-44 glass-modal rounded-2xl py-1.5 z-50 text-xs shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => handleAddAction('text')}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Type className="w-3.5 h-3.5 text-purple-400" />
                <span>Text Heading</span>
              </button>
              <button
                onClick={() => handleAddAction('image')}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Image...</span>
              </button>
              <button
                onClick={() => handleAddAction('shape')}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Square className="w-3.5 h-3.5 text-indigo-400" />
                <span>Shape</span>
              </button>
              <button
                onClick={() => handleAddAction('frame')}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Frame className="w-3.5 h-3.5 text-sky-400" />
                <span>Frame Card</span>
              </button>
              <button
                onClick={() => handleAddAction('chart')}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Chart Graphic</span>
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFilePicked}
          accept="image/*"
          className="hidden"
        />

        <div className="relative">
          <button
            onClick={() => setShowDesignMenu(!showDesignMenu)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Design</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>

          {showDesignMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-48 glass-modal rounded-2xl py-1.5 z-50 text-xs shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setShowDesignMenu(false);
                  setActiveSidebarTab('templates');
                  setSidebarOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Layout className="w-3.5 h-3.5 text-indigo-400" />
                <span>Browse Templates</span>
              </button>
              <button
                onClick={() => {
                  setShowDesignMenu(false);
                  setActiveSidebarTab('slides');
                  setSidebarOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Slide Layouts</span>
              </button>
              <button
                onClick={() => {
                  setShowDesignMenu(false);
                  setPresentationModalOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-200 hover:text-white"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate Presentation</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-neutral-800/80 mx-0.5" />

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            autoFocus
            className="px-2 py-0.5 text-xs bg-neutral-800 border border-indigo-500 rounded-lg text-white outline-none w-36 font-medium"
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="px-2 py-1 rounded-lg font-semibold text-neutral-200 hover:bg-neutral-800/60 cursor-text transition-colors flex items-center gap-1 max-w-[160px] truncate"
            title="Click to rename design"
          >
            <span className="truncate">{project.name || 'Untitled Design'}</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900/60 border border-neutral-800 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Saved</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="px-2 py-1 text-xs font-mono text-neutral-300 hover:bg-neutral-800 rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showZoomMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-32 glass-modal rounded-2xl py-1 z-50 text-xs shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-100">
              {[50, 100, 150, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setZoom(val / 100);
                    setShowZoomMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-neutral-800 hover:text-white flex justify-between"
                >
                  <span>{val}%</span>
                  {Math.round(zoom * 100) === val && <Check className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
              <div className="h-px bg-neutral-800 my-1" />
              <button
                onClick={() => {
                  zoomToFit();
                  setShowZoomMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-neutral-800 hover:text-white flex justify-between"
              >
                <span>Fit</span>
                <span className="text-[10px] text-neutral-500 font-mono">Shift+1</span>
              </button>
            </div>
          )}
        </div>

        <Tooltip content="Command Palette" shortcut="Ctrl+K">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <Command className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}>
          <button
            onClick={toggleTheme}
            className="p-1.5 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>

        <button
          onClick={() => setPresentModeOpen(true)}
          className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 border border-neutral-700/60"
        >
          <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
          <span>Present</span>
        </button>

        <button
          onClick={() => setExportModalOpen(true)}
          className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}