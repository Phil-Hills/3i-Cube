import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import { BRAND_CONFIGS } from '../constants';
import type { ExecutionMode } from '../types';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
  executionMode: ExecutionMode;
  onExecutionModeChange: (mode: ExecutionMode) => void;
}

const ModeToggle: React.FC<{ mode: ExecutionMode, onChange: (mode: ExecutionMode) => void }> = ({ mode, onChange }) => {
  const isSimulated = mode === 'simulated';
  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-full border border-white/10">
      <button 
        onClick={() => onChange('simulated')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${isSimulated ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:bg-white/10'}`}
      >
        Simulated
      </button>
      <button 
        onClick={() => onChange('live')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${!isSimulated ? 'bg-green-500 text-white shadow' : 'text-slate-400 hover:bg-white/10'}`}
      >
        Live
      </button>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick, executionMode, onExecutionModeChange }) => {
  const currentBrandConfig = BRAND_CONFIGS['3i'];

  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
      <div className="flex items-center">
        <CubeIcon className="w-8 h-8 text-cube-cyan" />
        <h1 className="text-xl font-bold ml-3 text-slate-100">
          {currentBrandConfig.appName}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle mode={executionMode} onChange={onExecutionModeChange} />
        <button
            onClick={onDocsClick}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Documentation"
          >
          <BookOpenIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onAboutClick}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="About 3i-CUBE"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};