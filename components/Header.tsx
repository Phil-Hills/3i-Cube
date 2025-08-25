
import React from 'react';
import { CubeIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import type { Brand } from '../types';
import { BRAND_CONFIGS } from '../constants';

interface HeaderProps {
  brand: Brand;
  onBrandChange: (brand: Brand) => void;
  onAboutClick: () => void;
  onDocsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ brand, onBrandChange, onAboutClick, onDocsClick }) => {
  const currentBrandConfig = BRAND_CONFIGS[brand];

  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
      <div className="flex items-center">
        <CubeIcon className="w-8 h-8 text-cube-cyan" />
        <h1 className="text-xl font-bold ml-3 text-slate-100">
          {currentBrandConfig.appName}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <div>
          <label htmlFor="brand-select" className="sr-only">Select Brand</label>
          <select
            id="brand-select"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value as Brand)}
            className="bg-slate-800/50 text-sm text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cube-cyan"
          >
            {Object.entries(BRAND_CONFIGS).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>
        </div>
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