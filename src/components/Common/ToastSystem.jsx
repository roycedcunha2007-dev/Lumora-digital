import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
export function ToastSystem() {
  const { toastMessage } = useEditor();
  if (!toastMessage) return null;
  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-bottom-3">
      <div className="px-3.5 py-2 bg-neutral-900/95 backdrop-blur-md text-neutral-100 text-xs font-medium rounded-lg shadow-2xl border border-neutral-700/80 flex items-center gap-2.5">
        {getIcon()}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
}