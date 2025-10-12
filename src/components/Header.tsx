
import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-xl border-b border-cyan-400/20 flex-shrink-0">
      <div className="flex items-center">
        <CubeIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold ml-3 text-slate-100">
          CUBE Protocol for 3i Microscopes
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
          aria-label="About CUBE Protocol"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};