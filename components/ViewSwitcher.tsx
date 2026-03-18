
import React from 'react';
import { PlayIcon, SwitchHorizontalIcon } from './icons';

interface ViewSwitcherProps {
  currentView: 'executor' | 'converter';
  onViewChange: (view: 'executor' | 'converter') => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-gray-700/50 text-gray-300 hover:bg-gray-600/80";

  return (
    <div className="flex justify-center mb-0">
      <div className="flex space-x-2 bg-gray-800/80 p-1 rounded-lg border border-gray-700/50">
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
