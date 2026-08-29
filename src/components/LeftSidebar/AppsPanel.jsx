import React from 'react';
import { useEditor } from '../../context/EditorContext';
import {
  Activity,
  Scaling,
  Palette,
  Layers,
  History,
  Layout,
  Monitor,
  ShieldCheck,
  Gauge,
  Package,
  Trophy,
  Sparkles
} from 'lucide-react';

export function AppsPanel({ searchQuery = '' }) {
  const {
    setDesignDoctorOpen,
    setMagicResizeOpen,
    setStyleExtractorOpen,
    setComponentLabOpen,
    setTimeMachineOpen,
    setVariationsOpen,
    setDeviceMockupOpen,
    setAccessibilityModalOpen,
    setPerformanceModalOpen,
    setDesignPackageOpen,
    setMissionsOpen,
  } = useEditor();

  const apps = [
    {
      id: 'doctor',
      name: 'Design Doctor & QA',
      desc: 'Automatic layout, color & contrast inspection',
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      action: () => setDesignDoctorOpen(true),
    },
    {
      id: 'resize',
      name: 'Magic Resize',
      desc: 'Adapt layout across social, mobile & web',
      icon: <Scaling className="w-5 h-5 text-sky-400" />,
      action: () => setMagicResizeOpen(true),
    },
    {
      id: 'lab',
      name: 'Component Lab',
      desc: 'Master components, sizes & interactive states',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      action: () => setComponentLabOpen(true),
    },
    {
      id: 'tokens',
      name: 'Style Tokens Extractor',
      desc: 'Extract CSS custom properties & token scales',
      icon: <Palette className="w-5 h-5 text-emerald-400" />,
      action: () => setStyleExtractorOpen(true),
    },
    {
      id: 'variations',
      name: 'Design Variations',
      desc: 'Generate theme & density variants',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      action: () => setVariationsOpen(true),
    },
    {
      id: 'mockup',
      name: 'Device Mockups',
      desc: 'Wrap designs in iPhone, iPad & MacBook frames',
      icon: <Monitor className="w-5 h-5 text-neutral-300" />,
      action: () => setDeviceMockupOpen(true),
    },
    {
      id: 'time',
      name: 'Time Machine',
      desc: 'Named version history snapshots & rollbacks',
      icon: <History className="w-5 h-5 text-indigo-400" />,
      action: () => setTimeMachineOpen(true),
    },
    {
      id: 'a11y',
      name: 'Accessibility Checker',
      desc: 'WCAG 2.1 AA/AAA compliance & touch targets',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      action: () => setAccessibilityModalOpen(true),
    },
    {
      id: 'perf',
      name: 'Performance Monitor',
      desc: 'Canvas memory, object count & render health',
      icon: <Gauge className="w-5 h-5 text-sky-400" />,
      action: () => setPerformanceModalOpen(true),
    },
    {
      id: 'pkg',
      name: 'Design Package Export',
      desc: 'Export structured project bundle & schemas',
      icon: <Package className="w-5 h-5 text-indigo-400" />,
      action: () => setDesignPackageOpen(true),
    },
    {
      id: 'missions',
      name: 'Design Missions',
      desc: 'Interactive UI design challenge quests',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      action: () => setMissionsOpen(true),
    },
  ];

  const filtered = apps.filter(
    (a) =>
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto select-none text-xs">
      <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider mb-1">
        Studio Apps & Tools
      </div>

      <div className="space-y-2">
        {filtered.map((app) => (
          <div
            key={app.id}
            onClick={app.action}
            className="p-3 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98 group flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-neutral-800 group-hover:bg-indigo-600/20 transition-colors shrink-0">
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs text-neutral-100 group-hover:text-indigo-300 transition-colors truncate">
                {app.name}
              </h3>
              <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{app.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
