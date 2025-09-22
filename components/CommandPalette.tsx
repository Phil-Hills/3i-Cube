import React from 'react';
import type { ExampleScriptCategory } from '../types';
import { BeakerIcon, DocumentTextIcon } from './icons';

interface CommandPaletteProps {
  onSelectScript: (script: string) => void;
  scriptCategories: ExampleScriptCategory[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelectScript, scriptCategories }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center mb-4 flex-shrink-0">
        <DocumentTextIcon className="w-6 h-6 text-cube-blue mr-2" />
        <h2 className="text-lg font-semibold text-slate-100">Method Templates</h2>
      </div>
      <div className="space-y-6 pr-2 flex-grow overflow-y-auto md:overflow-y-hidden">
        {scriptCategories.map((category) => (
          <div key={category.category}>
            <div className="mb-3">
                <h3 className="text-md font-semibold text-cube-blue/90">{category.category}</h3>
                <p className="text-xs text-slate-400 mt-1">{category.description}</p>
            </div>
            <div className="space-y-3">
              {category.scripts.map((example) => (
                <button
                  key={example.name}
                  onClick={() => onSelectScript(example.script)}
                  className="w-full text-left p-3 bg-slate-800/50 rounded-lg hover:bg-cube-blue/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cube-blue border border-white/10 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start">
                    <BeakerIcon className="w-5 h-5 text-cube-blue/70 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-slate-100">{example.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{example.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};