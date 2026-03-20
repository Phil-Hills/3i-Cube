import React from 'react';
import type { MicroscopeStatus } from '../types';

interface StatusBarProps {
  status: MicroscopeStatus;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  const getStatusIndicator = () => {
    switch (status) {
      case 'CONNECTED':
      case 'IDLE':
        return { color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', text: 'Simulated: Connected & Idle' };
      case 'EXECUTING':
        return { color: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse', text: 'Simulated: Executing...' };
      case 'ERROR':
        return { color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]', text: 'Error' };
      case 'DISCONNECTED':
      default:
        return { color: 'bg-zinc-500', text: 'Simulated: Disconnected' };
    }
  };

  const { color, text } = getStatusIndicator();

  return (
    <footer className="flex items-center justify-between p-2 px-6 bg-[#0a0a0a] border-t border-white/5 text-[11px] font-mono uppercase tracking-wider">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-3 ${color}`}></div>
        <span className="text-zinc-500">SlideBook™ Status:</span>
        <span className="font-medium text-zinc-300 ml-2">{text}</span>
      </div>
      <div className="text-zinc-600 text-right flex items-center gap-4">
        <div>Q Protocol v1.0</div>
        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
        <div>A2AC LLC · a2ac.ai · Patent Pending</div>
        <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
        <div>© 2026 A2AC LLC</div>
      </div>
    </footer>
  );
};