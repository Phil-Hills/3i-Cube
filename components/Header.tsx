import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import { BRAND_CONFIGS } from '../constants';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick }) => {
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