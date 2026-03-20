
import React from 'react';
import { PlayIcon, SwitchHorizontalIcon, BookOpenIcon } from './icons';

interface ViewSwitcherProps {
  currentView: 'executor' | 'converter' | 'memory' | 'chat';
  onViewChange: (view: 'executor' | 'converter' | 'memory' | 'chat') => void;
  showAdvanced: boolean;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange, showAdvanced }) => {
  const baseClasses = "px-5 py-2.5 text-[13px] font-mono uppercase tracking-wider rounded-lg flex items-center transition-all duration-200 border";
  const activeClasses = "bg-sky-600/20 text-sky-400 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]";
  const inactiveClasses = "bg-[#050505] text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300 hover:bg-white/5";

  return (
    <div className="flex justify-center mb-0">
      <div className="flex space-x-2 bg-[#0a0a0a] p-1.5 rounded-xl border border-white/10 shadow-lg overflow-x-auto max-w-full custom-scrollbar">
        <button
          onClick={() => onViewChange('executor')}
          className={`${baseClasses} ${currentView === 'executor' ? activeClasses : inactiveClasses} whitespace-nowrap`}
        >
          <PlayIcon className="w-4 h-4 mr-2" />
          Executor
        </button>
        <button
          onClick={() => onViewChange('converter')}
          className={`${baseClasses} ${currentView === 'converter' ? activeClasses : inactiveClasses} whitespace-nowrap`}
        >
          <SwitchHorizontalIcon className="w-4 h-4 mr-2" />
          Code to Q Protocol Converter
        </button>
        {showAdvanced && (
          <button
            onClick={() => onViewChange('memory')}
            className={`${baseClasses} ${currentView === 'memory' ? activeClasses : inactiveClasses} whitespace-nowrap`}
          >
            <BookOpenIcon className="w-4 h-4 mr-2" />
            Memory Graph
          </button>
        )}
        <button
          onClick={() => onViewChange('chat')}
          className={`${baseClasses} ${currentView === 'chat' ? activeClasses : inactiveClasses} whitespace-nowrap`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          AI Chat
        </button>
      </div>
    </div>
  );
};
