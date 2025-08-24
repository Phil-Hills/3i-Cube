
import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { TerminalIcon } from './icons';

interface OutputLogProps {
  logEntries: LogEntry[];
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

export const OutputLog: React.FC<OutputLogProps> = ({ logEntries }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logEntries]);
  
  return (
    <div className="bg-gray-800/50 rounded-lg flex flex-col h-full border border-gray-700/50 overflow-hidden">
      <div className="flex items-center p-4 border-b border-gray-700/50 flex-shrink-0">
        <TerminalIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">Simulated Microscope Log</h2>
      </div>
      
      <div className="p-3 bg-blue-900/20 border-b border-gray-700/50 text-center text-xs text-blue-200 flex-shrink-0">
        ⚡️ <strong>Demo Mode:</strong> This log shows the commands that would execute on real 3i hardware.
      </div>

      <div ref={logContainerRef} className="flex-grow p-4 font-mono text-sm space-y-2 overflow-y-auto">
        {logEntries.length === 0 ? (
            <div className="text-gray-500">Awaiting execution...</div>
        ) : (
            logEntries.map((entry, index) => (
              <LogMessage key={index} entry={entry} />
            ))
        )}
      </div>
    </div>
  );
};
