
import React from 'react';
import { NvidiaIcon } from './icons';

interface GpuStatusIndicatorProps {
  isProcessing: boolean;
}

export const GpuStatusIndicator: React.FC<GpuStatusIndicatorProps> = ({ isProcessing }) => (
  <div className="hidden md:flex items-center space-x-2 mr-2 border border-[#76B900]/40 bg-black/20 rounded-full p-1 pr-3">
    <div className="w-8 h-8 bg-[#76B900] rounded-full flex items-center justify-center">
        <NvidiaIcon className="w-6 h-6 text-black" />
    </div>
    <div>
        <p className="text-xs font-bold text-[#76B900] leading-none">NVIDIA CUDA</p>
        <p className="text-xs text-gray-400 leading-none">{isProcessing ? 'Processing...' : 'Enabled'}</p>
    </div>
    <div className={`w-3 h-3 rounded-full bg-green-500 ${isProcessing ? 'animate-pulse-gpu' : ''}`} />
  </div>
);
