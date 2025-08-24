
import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { TerminalIcon, PhotoIcon } from './icons';

interface OutputLogProps {
  logEntries: LogEntry[];
  imageUrl: string | null;
}

const LogMessage: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const getIconAndColor = () => {
    switch (entry.type) {
      case 'SUCCESS':
        return 'text-green-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPrefix = () => {
    switch(entry.type) {
        case 'SUCCESS': return '[✓]';
        case 'ERROR': return '[✗]';
        default: return '[>]';
    }
  }

  return (
    <div className="flex text-sm">
      <span className={`mr-2 font-bold ${getIconAndColor()}`}>{getPrefix()}</span>
      <span className={entry.type === 'INFO' ? 'text-gray-300' : getIconAndColor()}>{entry.message}</span>
    </div>
  );
};

export const OutputLog: React.FC<OutputLogProps> = ({ logEntries, imageUrl }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logEntries]);
  
  return (
    <div className="bg-gray-800/50 rounded-lg flex flex-col h-full border border-gray-700/50 overflow-hidden">
      <div className="flex items-center p-4 border-b border-gray-700/50">
        <TerminalIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">Execution Log</h2>
      </div>
      <div ref={logContainerRef} className="flex-grow p-4 font-mono text-sm space-y-2 overflow-y-auto">
        {logEntries.length === 0 && !imageUrl && (
            <div className="text-gray-500">Awaiting execution...</div>
        )}
        {logEntries.map((entry, index) => (
          <LogMessage key={index} entry={entry} />
        ))}
      </div>
      {imageUrl && (
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
          <div className="flex items-center mb-2">
            <PhotoIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-md font-semibold text-gray-200">Simulated Image Capture</h3>
          </div>
          <img 
            src={imageUrl} 
            alt="Simulated microscope output" 
            className="rounded-md w-full object-cover border-2 border-blue-800/50"
          />
        </div>
      )}
    </div>
  );
};
