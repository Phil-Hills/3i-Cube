
import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import { GpuStatusIndicator } from './GpuStatusIndicator';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
  isGpuActive: boolean;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick, isGpuActive, isProcessing }) => {
  return (
    <header className="flex items-center p-4 bg-gray-950/40 backdrop-blur-2xl border-b border-cyan-400/20">
      <div className="flex items-center">
        <CubeIcon className="w-8 h-8 text-cyan-400 mr-3 text-glow" />
        <div>
            <h1 className="text-2xl font-bold text-gray-100 tracking-wider text-glow text-cyan-400 leading-tight">
                CUBE Protocol
            </h1>
            <p className="text-xs font-light text-gray-400">for 3i Microscopes by Phil Hills</p>
        </div>
      </div>
      
      <div className="ml-auto flex items-center space-x-2">
        {isGpuActive && <GpuStatusIndicator isProcessing={isProcessing} />}
        <button
            onClick={onDocsClick}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Documentation"
          >
          <BookOpenIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onAboutClick}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="About CUBE Protocol"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};