
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
        return 'text-emerald-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
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
    <div className="flex text-[13px] leading-relaxed">
      <span className={`mr-2 font-bold ${getIconAndColor()}`}>{getPrefix()}</span>
      <span className={entry.type === 'INFO' ? 'text-zinc-300' : getIconAndColor()}>{entry.message}</span>
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
    <div className="bg-[#0a0a0a] rounded-xl flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
      <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center">
          <TerminalIcon className="w-5 h-5 text-emerald-400 mr-2" />
          <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">SlideBook™ Execution Log</h2>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
          System Output
        </div>
      </div>
      
      <div className="p-3 bg-emerald-900/10 border-b border-emerald-500/10 text-center text-[11px] text-emerald-400/80 font-mono uppercase tracking-wider flex-shrink-0">
        ⚡️ <strong>Synthetic Mode:</strong> Running Python scripts against synthetic data via mock_sb.
      </div>

      <div ref={logContainerRef} className="flex-grow p-4 font-mono text-[13px] space-y-2 overflow-y-auto bg-[#050505] shadow-inner">
        {logEntries.length === 0 ? (
            <div className="text-zinc-600 italic">Awaiting execution...</div>
        ) : (
            logEntries.map((entry, index) => (
              <LogMessage key={index} entry={entry} />
            ))
        )}
      </div>
    </div>
  );
};
