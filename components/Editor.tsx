
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
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
      <div className="flex items-center mb-4">
        <CodeBracketIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">Python Script Editor</h2>
      </div>
      <textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        className="flex-grow w-full bg-gray-900/70 text-gray-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 text-sm"
        placeholder="Enter your Python script here..."
      />
      <button
        onClick={onExecute}
        disabled={isExecuting}
        className="mt-4 w-full flex items-center justify-center p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
