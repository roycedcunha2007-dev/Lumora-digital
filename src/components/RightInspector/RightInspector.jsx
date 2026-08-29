import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { DesignTab } from './DesignTab';
import { PrototypeTab } from './PrototypeTab';
import { InspectTab } from './InspectTab';
import { Sliders, Zap, Code } from 'lucide-react';

export function RightInspector() {
  const { activeTab, setActiveTab } = useEditor();

  return (
    <aside className="w-72 glass-surface border-l border-neutral-800/80 flex flex-col select-none z-10 shrink-0 h-full">
      <div className="flex items-center border-b border-neutral-800/80 px-2 pt-1 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'design'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Design</span>
        </button>
        <button
          onClick={() => setActiveTab('prototype')}
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'prototype'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Prototype</span>
        </button>
        <button
          onClick={() => setActiveTab('inspect')}
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'inspect'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'design' && <DesignTab />}
        {activeTab === 'prototype' && <PrototypeTab />}
        {activeTab === 'inspect' && <InspectTab />}
      </div>
    </aside>
  );
}