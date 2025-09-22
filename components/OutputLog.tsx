import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { TerminalIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './icons';

interface OutputLogProps {
  logEntries: LogEntry[];
}

const LogMessage: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const getIcon = () => {
    switch (entry.type) {
      case 'SUCCESS':
        return <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />;
      case 'ERROR':
        return <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-[var(--cube-blue)] flex-shrink-0" />;
    }
  };

  const textColor = {
      'SUCCESS': 'text-green-300',
      'ERROR': 'text-red-300',
      'INFO': 'text-slate-300',
      'SYSTEM': 'text-[var(--cube-blue)]'
  }[entry.type];

  return (
    <div className="flex items-start text-sm animate-fade-in gap-3">
        {getIcon()}
        <div className="flex-grow min-w-0">
            <span className={`font-mono text-slate-500 mr-2`}>
                {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={textColor}>{entry.message}</span>
        </div>
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
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex items-center p-4 border-b border-white/10 flex-shrink-0">
        <TerminalIcon className="w-6 h-6 text-[var(--cube-blue)] mr-2" />
        <h2 className="text-lg font-semibold text-slate-100">Microscope Log</h2>
      </div>
      
      <div ref={logContainerRef} className="flex-grow p-4 font-mono text-sm space-y-3 overflow-y-auto bg-slate-900">
        {logEntries.length === 0 ? (
            <div className="text-slate-500 h-full flex items-center justify-center">Awaiting execution...</div>
        ) : (
            logEntries.map((entry, index) => (
              <LogMessage key={index} entry={entry} />
            ))
        )}
      </div>
    </div>
  );
};