import React, { useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { readLocalImageFile } from '../../utils/import';
import { saveAssetToDB } from '../../utils/idb';
import { Layout, UploadCloud, Type, Sparkles, Plus } from 'lucide-react';

export function EmptyCanvasGuide() {
  const {
    elements,
    addElement,
    setSelectedIds,
    setActiveSidebarTab,
    setSidebarOpen,
    showToast,
    addUploadedAsset,
    pan,
    zoom,
  } = useEditor();

  const fileRef = useRef(null);

  if (elements && elements.length > 0) return null;

  const handleAddDefaultText = () => {
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 400;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    const newHeading = {
      id: `text_${Date.now()}`,
      name: 'Heading',
      type: 'text',
      x: Math.round(cx - 150),
      y: Math.round(cy - 25),
      width: 300,
      height: 50,
      text: 'Your Creative Heading',
      fontFamily: 'Inter',
      fontSize: 36,
      fontWeight: 800,
      fill: '#FFFFFF',
      textAlign: 'center',
    };

    addElement(newHeading);
    setSelectedIds([newHeading.id]);
    showToast('Added heading text', 'success');
  };

  const handleFileUpload = async (e) => {
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
      showToast('Image uploaded and placed on canvas', 'success');
    } catch (err) {
      showToast('Failed to upload image', 'error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-4">
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col items-center text-center space-y-4 max-w-sm pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white">Start creating</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Choose a template, upload an image, or add text to begin
          </p>
        </div>

        <div className="flex flex-col w-full gap-2 pt-1 text-xs">
          <button
            onClick={() => {
              setActiveSidebarTab('templates');
              setSidebarOpen(true);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Layout className="w-4 h-4" />
            <span>Browse Templates</span>
          </button>

          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Upload Image from Computer</span>
          </button>
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={handleAddDefaultText}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Type className="w-4 h-4 text-purple-400" />
            <span>Add Heading Text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
