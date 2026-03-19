
import React from 'react';
import { PlayIcon, SwitchHorizontalIcon, BookOpenIcon } from './icons';

interface ViewSwitcherProps {
  currentView: 'executor' | 'converter' | 'memory' | 'builder';
  onViewChange: (view: 'executor' | 'converter' | 'memory' | 'builder') => void;
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
        <button
          onClick={() => onViewChange('memory')}
          className={`${baseClasses} ${currentView === 'memory' ? activeClasses : inactiveClasses}`}
        >
          <BookOpenIcon className="w-5 h-5 mr-2" />
          Memory Graph
        </button>
        <button
          onClick={() => onViewChange('builder')}
          className={`${baseClasses} ${currentView === 'builder' ? activeClasses : inactiveClasses}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Agent Builder
        </button>
      </div>
    </div>
  );
};
