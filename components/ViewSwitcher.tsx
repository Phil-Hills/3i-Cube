
import React from 'react';
import { PlayIcon, SwitchHorizontalIcon } from './icons';

interface ViewSwitcherProps {
  currentView: 'executor' | 'converter';
  onViewChange: (view: 'executor' | 'converter') => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors duration-200";
  const activeClasses = "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20";
  const inactiveClasses = "text-gray-300 hover:bg-white/10";

  return (
    <div className="flex justify-center mb-0">
      <div className="flex space-x-2 bg-gray-950/40 backdrop-blur-2xl p-1 rounded-lg border border-white/10">
        <button
          onClick={() => onViewChange('executor')}
          className={`${baseClasses} ${currentView === 'executor' ? activeClasses : inactiveClasses}`}
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          Executor
        </button>
        <button
          onClick={() => onViewChange('converter')}
          className={`${baseClasses} ${currentView === 'converter' ? activeClasses : inactiveClasses}`}
        >
          <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
          Code to CUBE Converter
        </button>
      </div>
    </div>
  );
};
