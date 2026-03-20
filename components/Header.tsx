
import React, { useState, useEffect } from 'react';
import { QIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import { checkBrainHealth } from '../services/brainService';
import { getSwarmStatus, SwarmStatus } from '../services/swarmService';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
  onSystemCheckClick: () => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick, onSystemCheckClick, showAdvanced, onToggleAdvanced }) => {
  const [brainHealthy, setBrainHealthy] = useState(false);
  const [swarmStatus, setSwarmStatus] = useState<SwarmStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const health = await checkBrainHealth();
      setBrainHealthy(health);
      const swarm = await getSwarmStatus();
      setSwarmStatus(swarm);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status?: string) => {
    return status === 'ready' || status === 'busy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600';
  };

  return (
    <header className="flex items-center p-4 bg-[#0a0a0a] border-b border-white/10 backdrop-blur-md">
      <QIcon className="w-8 h-8 text-sky-400 mr-3" />
      <h1 className="text-2xl font-bold text-zinc-100 tracking-wider flex items-baseline">
        Q Protocol <span className="text-sm font-normal text-sky-400/80 ml-3 tracking-normal hidden sm:inline">SlideBook™ Integration</span>
      </h1>
      
      {showAdvanced && (
        <div className="ml-8 hidden lg:flex items-center space-x-5 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center" title="Brain">
            <div className={`w-2 h-2 rounded-full mr-2 ${brainHealthy ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`}></div>
            <span className="text-zinc-500">Brain</span>
          </div>
          <div className="flex items-center" title="Analyst Agent">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(swarmStatus?.analyst.status)}`}></div>
            <span className="text-zinc-500">Analyst</span>
          </div>
          <div className="flex items-center" title="Memory Agent">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(swarmStatus?.memory.status)}`}></div>
            <span className="text-zinc-500">Memory</span>
          </div>
          <div className="flex items-center" title="Sentinel Agent">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(swarmStatus?.sentinel.status)}`}></div>
            <span className="text-zinc-500">Sentinel</span>
          </div>
          <div className="flex items-center" title="Registrar Agent">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(swarmStatus?.registrar.status)}`}></div>
            <span className="text-zinc-500">Registrar</span>
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center space-x-3">
        <button
          onClick={onToggleAdvanced}
          className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors border ${showAdvanced ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-[#050505] text-zinc-500 border-white/10 hover:text-zinc-300 hover:bg-white/5'}`}
        >
          {showAdvanced ? 'Advanced: ON' : 'Advanced: OFF'}
        </button>
        {showAdvanced && (
          <button
            onClick={onSystemCheckClick}
            className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded text-sky-400 text-[10px] font-mono uppercase tracking-wider transition-colors"
          >
            System Check
          </button>
        )}
        <button
            onClick={onDocsClick}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
            aria-label="Documentation"
          >
          <BookOpenIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onAboutClick}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
          aria-label="About Q Protocol"
        >
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};