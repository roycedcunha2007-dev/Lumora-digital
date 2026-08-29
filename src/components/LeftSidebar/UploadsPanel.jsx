import React, { useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { readLocalImageFile } from '../../utils/import';
import { saveAssetToDB } from '../../utils/idb';
import { UploadCloud, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export function UploadsPanel({ searchQuery = '' }) {
  const {
    addElement,
    setSelectedIds,
    selectedElements,
    updateElementProperties,
    uploadedAssets = [],
    addUploadedAsset,
    showToast,
    pan,
    zoom,
  } = useEditor();

  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        showToast('Processing uploaded image...', 'info');
        const imgData = await readLocalImageFile(file);

        const assetRecord = {
          id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: imgData.name || file.name,
          src: imgData.src || imgData.dataUrl,
          dataUrl: imgData.dataUrl || imgData.src,
          naturalWidth: imgData.naturalWidth || imgData.width || 400,
          naturalHeight: imgData.naturalHeight || imgData.height || 300,
          createdAt: new Date().toISOString(),
        };

        if (addUploadedAsset) {
          addUploadedAsset(assetRecord);
        }
        saveAssetToDB(assetRecord.id, assetRecord.src).catch(() => {});

        insertImageOnCanvas(assetRecord);
      } catch (err) {
        showToast('Failed to upload image', 'error');
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertImageOnCanvas = (asset) => {
    const canvasContainer = document.getElementById('canvas-workspace-container');
    const cx = canvasContainer ? (canvasContainer.clientWidth / 2 - pan.x) / zoom : 300;
    const cy = canvasContainer ? (canvasContainer.clientHeight / 2 - pan.y) / zoom : 300;

    const maxDim = 500;
    const natW = asset.naturalWidth || 400;
    const natH = asset.naturalHeight || 300;
    const scale = Math.min(1, maxDim / Math.max(natW, natH));
    const targetW = Math.max(60, Math.round(natW * scale));
    const targetH = Math.max(60, Math.round(natH * scale));

    const newImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: asset.name || 'Image',
      type: 'image',
      x: Math.round(cx - targetW / 2),
      y: Math.round(cy - targetH / 2),
      width: targetW,
      height: targetH,
      originalWidth: natW,
      originalHeight: natH,
      src: asset.src || asset.dataUrl,
      dataUrl: asset.dataUrl || asset.src,
      objectFit: 'cover',
      rotation: 0,
      opacity: 1,
      cornerRadius: 0,
    };

    addElement(newImage);
    setSelectedIds([newImage.id]);
    saveAssetToDB(newImage.id, newImage.src).catch(() => {});
    showToast('Image inserted onto canvas', 'success');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const filteredAssets = uploadedAssets.filter(
    (a) => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto select-none text-xs">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className="border-2 border-dashed border-neutral-700/80 hover:border-indigo-500/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-neutral-900/40 hover:bg-neutral-800/40 transition-all group"
      >
        <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-indigo-600/20 text-neutral-400 group-hover:text-indigo-400 transition-colors">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <span className="font-semibold text-neutral-200 group-hover:text-white block">
            Upload files
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            PNG, JPG, SVG, WebP, GIF from your computer
          </span>
        </div>
        <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-colors mt-1 pointer-events-none">
          Choose Files
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
        multiple
        className="hidden"
      />

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
            Your Uploads ({filteredAssets.length})
          </span>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-500 space-y-1">
            <ImageIcon className="w-6 h-6 mx-auto opacity-30 text-neutral-400 mb-1" />
            <p className="font-medium text-neutral-300">No images uploaded yet</p>
            <p className="text-[11px] text-neutral-500">Upload images above or drag files here to use in your designs</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => insertImageOnCanvas(asset)}
                className="group relative h-24 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500/60 overflow-hidden cursor-pointer flex items-center justify-center transition-all hover:scale-105"
              >
                <img
                  src={asset.src || asset.dataUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="px-2 py-1 bg-indigo-600 text-white rounded-md text-[10px] font-semibold shadow">
                    Insert
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
