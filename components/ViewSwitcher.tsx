import React from 'react';
import { PlayIcon, SwitchHorizontalIcon, PhotoIcon, HomeIcon, SparklesIcon } from './icons';
import type { View } from '../types';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const views: { id: View; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'executor', label: 'Executor', icon: PlayIcon },
    { id: 'ai_studio', label: 'AI Studio', icon: SparklesIcon },
    { id: 'converter', label: 'CUBE Converter', icon: SwitchHorizontalIcon },
    { id: 'gallery', label: 'Media Gallery', icon: PhotoIcon },
  ];

  const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200";
  const activeClasses = "bg-slate-700/50 text-white";
  const inactiveClasses = "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200";

  return (
    <div className="flex-shrink-0 -mt-2 mb-4">
       <div className="flex p-1 space-x-1 bg-slate-900/70 backdrop-blur-xl rounded-lg border border-white/10 overflow-x-auto">
        {views.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`${baseClasses} ${currentView === id ? activeClasses : inactiveClasses}`}
          >
            <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};