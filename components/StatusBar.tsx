
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
        return { color: 'bg-green-500', text: 'Connected & Idle' };
      case 'EXECUTING':
        return { color: 'bg-yellow-500 animate-pulse', text: 'Executing...' };
      case 'ERROR':
        return { color: 'bg-red-500', text: 'Error' };
      case 'DISCONNECTED':
      default:
        return { color: 'bg-gray-500', text: 'Disconnected' };
    }
  };

  const { color, text } = getStatusIndicator();

  return (
    <footer className="flex items-center justify-between p-2 px-4 bg-gray-900/80 border-t border-blue-900/50 text-sm">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
        <span className="text-gray-300">Microscope Status:</span>
        <span className="font-semibold text-white ml-1.5">{text}</span>
      </div>
      <div className="text-gray-500 text-right">
        <div>3i CUBE Protocol v1.0</div>
        <div className="text-xs">Created by Phil Hills</div>
      </div>
    </footer>
  );
};
