
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
    <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <CodeBracketIcon className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">CUBE Script Editor</h2>
      </div>
      <textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        className="flex-grow w-full bg-gray-900/70 text-gray-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none border border-white/10 text-sm"
        placeholder="Enter your CUBE script here..."
      />
      <button
        onClick={onExecute}
        disabled={isExecuting}
        className="mt-4 w-full flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-md hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transform hover:-translate-y-0.5"
      >
        {isExecuting ? (
          <>
            <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
            Executing...
          </>
        ) : (
          <>
            <PlayIcon className="w-5 h-5 mr-2" />
            Execute Script
          </>
        )}
      </button>
    </div>
  );
};
