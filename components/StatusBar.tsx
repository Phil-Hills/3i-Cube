
import React from 'react';
import type { MicroscopeStatus, Brand } from '../types';
import { BRAND_CONFIGS } from '../constants';

interface StatusBarProps {
  status: MicroscopeStatus;
  brand: Brand;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, brand }) => {
  const getStatusIndicator = () => {
    switch (status) {
      case 'CONNECTED':
      case 'IDLE':
        return { color: 'bg-green-500', text: 'Simulated: Connected & Idle' };
      case 'EXECUTING':
        return { color: 'bg-yellow-500 animate-pulse', text: 'Simulated: Executing...' };
      case 'ERROR':
        return { color: 'bg-red-500', text: 'Error' };
      case 'DISCONNECTED':
      default:
        return { color: 'bg-slate-500', text: 'Simulated: Disconnected' };
    }
  };

  const { color, text } = getStatusIndicator();
  const currentBrandConfig = BRAND_CONFIGS[brand];

  return (
    <footer className="flex items-center justify-between p-2 px-4 bg-slate-900 border-t-2 border-[var(--cube-blue)] text-sm">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
        <span className="text-slate-300">Microscope Status:</span>
        <span className="font-semibold text-white ml-1.5">{text}</span>
      </div>
      <div className="text-slate-500 text-right">
        <div>{currentBrandConfig.name} Protocol v2.0</div>
        <div className="text-xs">From Intelligent Imaging Innovations</div>
      </div>
    </footer>
  );
};