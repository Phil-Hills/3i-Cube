
import React from 'react';
import { METHOD_SCRIPTS } from '../constants';
import { BeakerIcon, DocumentTextIcon } from './icons';

interface CommandPaletteProps {
  onSelectScript: (script: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelectScript }) => {
  return (
    <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
      <div className="flex items-center mb-4 flex-shrink-0">
        <DocumentTextIcon className="w-5 h-5 text-sky-400 mr-2" />
        <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">Method-Specific Templates</h2>
      </div>
      <div className="space-y-6 overflow-y-auto pr-2 flex-grow custom-scrollbar">
        {METHOD_SCRIPTS.map((category) => (
          <div key={category.category}>
            <div className="mb-3">
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-sky-400/90">{category.category}</h3>
                <p className="text-[11px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">{category.description}</p>
            </div>
            <div className="space-y-3">
              {category.scripts.map((example) => (
                <button
                  key={example.name}
                  onClick={() => onSelectScript(example.script)}
                  className="w-full text-left p-3.5 bg-[#050505] rounded-lg hover:bg-sky-900/10 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-sky-500/50 border border-white/5 hover:border-sky-500/30 shadow-inner group"
                >
                  <div className="flex items-start">
                    <BeakerIcon className="w-5 h-5 text-sky-500/50 group-hover:text-sky-400 mr-3 mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                        <p className="font-medium text-zinc-200 text-[13px]">{example.name}</p>
                        <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed">{example.description}</p>
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
