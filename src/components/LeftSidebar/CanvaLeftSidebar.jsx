import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TemplatesPanel } from './TemplatesPanel';
import { ElementsTab } from './ElementsTab';
import { UploadsPanel } from './UploadsPanel';
import { TextPanel } from './TextPanel';
import { LayersTree } from './LayersTree';
import { AppsPanel } from './AppsPanel';

import {
  Layout,
  Shapes,
  UploadCloud,
  Type,
  Layers,
  Sparkles,
  Search,
  ChevronLeft,
  X
} from 'lucide-react';

export function CanvaLeftSidebar() {
  const {
    activeSidebarTab = 'templates',
    setActiveSidebarTab,
    sidebarOpen = true,
    setSidebarOpen,
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'templates', label: 'Design', icon: <Layout className="w-4 h-4" /> },
    { id: 'elements', label: 'Elements', icon: <Shapes className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'uploads', label: 'Uploads', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" /> },
    { id: 'apps', label: 'Apps', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
  ];

  const handleTabClick = (tabId) => {
    if (activeSidebarTab === tabId && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveSidebarTab(tabId);
      setSidebarOpen(true);
      setSearchQuery('');
    }
  };

  const getTitle = () => {
    switch (activeSidebarTab) {
      case 'templates': return 'Design Templates';
      case 'elements': return 'Elements Library';
      case 'text': return 'Text';
      case 'uploads': return 'Uploads';
      case 'layers': return 'Layers';
      case 'apps': return 'Studio Apps';
      default: return 'Library';
    }
  };

  return (
    <div className="flex h-full z-20 shrink-0 select-none">
      <nav className="w-16 glass-surface border-r border-neutral-800/80 flex flex-col items-center py-3 gap-1 z-20 shrink-0 h-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-13 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all group ${
              activeSidebarTab === item.id && sidebarOpen
                ? 'bg-indigo-600 text-white font-semibold shadow-lg glow-indigo scale-105'
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
            }`}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <aside className="w-72 glass-surface border-r border-neutral-800/80 flex flex-col h-full z-10 animate-in slide-in-from-left-2 duration-150">
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="font-bold text-xs text-neutral-100">{getTitle()}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Close Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {activeSidebarTab !== 'layers' && (
            <div className="p-2.5 border-b border-neutral-800/60">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeSidebarTab}...`}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-neutral-500 hover:text-neutral-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col">
            {activeSidebarTab === 'templates' && <TemplatesPanel searchQuery={searchQuery} />}
            {activeSidebarTab === 'elements' && <ElementsTab searchQuery={searchQuery} />}
            {activeSidebarTab === 'text' && <TextPanel searchQuery={searchQuery} />}
            {activeSidebarTab === 'uploads' && <UploadsPanel searchQuery={searchQuery} />}
            {activeSidebarTab === 'layers' && <LayersTree searchQuery={searchQuery} />}
            {activeSidebarTab === 'apps' && <AppsPanel searchQuery={searchQuery} />}
          </div>
        </aside>
      )}
    </div>
  );
}
