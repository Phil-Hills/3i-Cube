
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
    <div className="bg-black/20 backdrop-blur-lg rounded-lg p-4 flex flex-col h-full border border-white/10">
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
        className="mt-4 w-full flex items-center justify-center p-3 bg-cyan-600 text-gray-900 font-bold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40"
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