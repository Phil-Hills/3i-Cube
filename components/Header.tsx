
import React from 'react';
import { CubeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-gray-900/80 border-b border-blue-900/50 backdrop-blur-sm">
      <CubeIcon className="w-8 h-8 text-blue-400 mr-3" />
      <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
        CUBE Protocol
      </h1>
      <span className="text-sm font-light text-gray-400 ml-2 mt-1.5">for 3i Microscopes</span>
    </header>
  );
};
