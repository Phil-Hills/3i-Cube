
import React from 'react';
import { PlayIcon, CodeBracketIcon, LoaderIcon } from './icons';

interface EditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export const Editor: React.FC<EditorProps> = ({ script, onScriptChange, onExecute, isExecuting }) => {
  return (
    <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CodeBracketIcon className="w-5 h-5 text-sky-400 mr-2" />
          <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">Python Script Editor</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
        </div>
      </div>
      <textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        className="flex-grow w-full bg-[#050505] text-sky-100/90 font-mono p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500/50 resize-none border border-white/5 text-[13px] leading-relaxed shadow-inner"
        placeholder="Enter your Python script here..."
        spellCheck={false}
      />
      <button
        onClick={onExecute}
        disabled={isExecuting}
        className="mt-4 w-full flex items-center justify-center p-3.5 bg-sky-600 text-white font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:shadow-none"
      >
        {isExecuting ? (
          <>
            <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
            Executing in SlideBook™...
          </>
        ) : (
          <>
            <PlayIcon className="w-5 h-5 mr-2" />
            Send to SlideBook™
          </>
        )}
      </button>
    </div>
  );
};
