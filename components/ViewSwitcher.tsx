
import React from 'react';
import { PlayIcon, SwitchHorizontalIcon, BookOpenIcon } from './icons';

interface ViewSwitcherProps {
  currentView: 'executor' | 'converter' | 'memory' | 'chat';
  onViewChange: (view: 'executor' | 'converter' | 'memory' | 'chat') => void;
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
          Code to Q Protocol Converter
        </button>
        <button
          onClick={() => onViewChange('memory')}
          className={`${baseClasses} ${currentView === 'memory' ? activeClasses : inactiveClasses}`}
        >
          <BookOpenIcon className="w-5 h-5 mr-2" />
          Memory Graph
        </button>
        <button
          onClick={() => onViewChange('chat')}
          className={`${baseClasses} ${currentView === 'chat' ? activeClasses : inactiveClasses}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          AI Chat
        </button>
      </div>
    </div>
  );
};
