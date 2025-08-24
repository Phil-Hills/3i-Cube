
import React from 'react';
import { EXAMPLE_SCRIPTS } from '../constants';
import { BeakerIcon, DocumentTextIcon } from './icons';

interface CommandPaletteProps {
  onSelectScript: (script: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelectScript }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
      <div className="flex items-center mb-4">
        <DocumentTextIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">Example Scripts</h2>
      </div>
      <div className="space-y-3 overflow-y-auto pr-2">
        {EXAMPLE_SCRIPTS.map((example) => (
          <button
            key={example.name}
            onClick={() => onSelectScript(example.script)}
            className="w-full text-left p-3 bg-gray-700/50 rounded-md hover:bg-blue-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50"
          >
            <div className="flex items-center">
              <BeakerIcon className="w-5 h-5 text-blue-300 mr-3 flex-shrink-0" />
              <div>
                  <p className="font-medium text-gray-100">{example.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{example.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
