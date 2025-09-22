import React from 'react';
import type { MicroscopeStatus, ExecutionMode } from '../types';

interface StatusBarProps {
  status: MicroscopeStatus;
  executionMode: ExecutionMode;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, executionMode }) => {
  const getStatusIndicator = () => {
    switch (status) {
      case 'CONNECTED':
      case 'IDLE':
        return { color: 'bg-green-500', text: executionMode === 'live' ? 'Connected & Idle' : 'Idle' };
      case 'EXECUTING':
        return { color: 'bg-yellow-500 animate-pulse', text: 'Executing...' };
      case 'ERROR':
        return { color: 'bg-red-500', text: 'Error' };
      case 'DISCONNECTED':
      default:
        return { color: 'bg-slate-500', text: 'Disconnected' };
    }
  };

  const { color, text } = getStatusIndicator();
  const label = executionMode === 'simulated' ? 'Simulator Status:' : 'Microscope Status:';

  return (
    <footer className="flex items-center justify-between p-2 px-4 bg-slate-900 border-t-2 border-[var(--cube-blue)] text-sm">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white ml-1.5">{text}</span>
      </div>
      <div className="text-slate-400 text-right text-[10px] sm:text-xs max-w-[50%]">
        <p className="font-semibold text-slate-300">
            Powered by EasyAI Chatbots
        </p>
        <p className="hidden sm:block">
            3i-CUBE is built on the CUBE Protocol, invented by EasyAI Chatbots.
            Our promise is simple: secure data, faster development, quicker microscope updates, and AI that improves with every experiment.
        </p>
      </div>
    </footer>
  );
};