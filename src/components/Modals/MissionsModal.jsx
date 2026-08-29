import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { DESIGN_MISSIONS, evaluateMissionProgress } from '../../constants/missions';
import { Trophy, CheckCircle2, Circle, X, ArrowRight, Award } from 'lucide-react';
export function MissionsModal() {
  const {
    missionsOpen,
    setMissionsOpen,
    elements,
    project,
  } = useEditor();
  const [activeMissionId, setActiveMissionId] = useState(DESIGN_MISSIONS[0].id);
  if (!missionsOpen) return null;
  const currentMission = DESIGN_MISSIONS.find((m) => m.id === activeMissionId) || DESIGN_MISSIONS[0];
  const evalResult = evaluateMissionProgress(currentMission, elements, project);
  return (
    <div
      onClick={() => setMissionsOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-xs text-neutral-200 select-none animate-in zoom-in-95 duration-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-100">Design Mission Challenge</h3>
              <p className="text-[11px] text-neutral-400">Master product design requirements through interactive checkpoints</p>
            </div>
          </div>
          <button
            onClick={() => setMissionsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-neutral-100">{currentMission.title}</h4>
              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 rounded font-semibold text-[10px]">
                {currentMission.difficulty}
              </span>
            </div>
            <p className="text-neutral-400 text-xs">{currentMission.description}</p>
          </div>
          <div className="space-y-1.5 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between font-semibold text-xs">
              <span className="text-neutral-300">Mission Progress</span>
              <span className="text-amber-400 font-mono">{evalResult.percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${evalResult.percentage}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Required Checkpoints
            </div>
            <div className="space-y-2">
              {evalResult.checklist.map((req) => (
                <div
                  key={req.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                    req.passed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-neutral-800/40 border-neutral-700/60 text-neutral-400'
                  }`}
                >
                  {req.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
                  )}
                  <span className={`text-xs ${req.passed ? 'font-medium text-neutral-200' : ''}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}