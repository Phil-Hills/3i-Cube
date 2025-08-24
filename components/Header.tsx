
import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick }) => {
  return (
    <header className="flex items-center p-4 bg-black/10 border-b border-cyan-400/10 backdrop-blur-sm">
      <CubeIcon className="w-8 h-8 text-cyan-400 mr-3 text-glow" />
      <h1 className="text-2xl font-bold text-gray-100 tracking-wider text-glow text-cyan-400">
        CUBE Protocol
      </h1>
      <span className="text-sm font-light text-gray-400 ml-2 mt-1.5">for 3i Microscopes</span>
      <div className="ml-auto flex items-center space-x-2">
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