
import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick }) => {
  return (
    <header className="flex items-center p-4 bg-gray-900/80 border-b border-blue-900/50 backdrop-blur-sm">
      <CubeIcon className="w-8 h-8 text-blue-400 mr-3" />
      <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
        CUBE Protocol
      </h1>
      <span className="text-sm font-light text-gray-400 ml-2 mt-1.5">for 3i Microscopes</span>
      <div className="ml-auto flex items-center space-x-2">
        <button
            onClick={onDocsClick}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Documentation"
          >
          <BookOpenIcon className="w-7 h-7" />
        </button>
        <button
          onClick={onAboutClick}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
          aria-label="About CUBE Protocol"
        >
          <QuestionMarkCircleIcon className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
};