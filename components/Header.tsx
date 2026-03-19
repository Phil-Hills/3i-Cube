
import React, { useState, useEffect } from 'react';
import { QIcon, QuestionMarkCircleIcon, BookOpenIcon } from './icons';
import { checkBrainHealth } from '../services/brainService';
import { getSwarmStatus, SwarmStatus } from '../services/swarmService';

interface HeaderProps {
  onAboutClick: () => void;
  onDocsClick: () => void;
  onSystemCheckClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onDocsClick, onSystemCheckClick }) => {
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
    return status === 'ready' || status === 'busy' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <header className="flex items-center p-4 bg-gray-900/80 border-b border-blue-900/50 backdrop-blur-sm">
      <QIcon className="w-8 h-8 text-blue-400 mr-3" />
      <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
        Q Protocol
      </h1>
      
      <div className="ml-8 flex items-center space-x-4 text-xs font-mono">
        <div className="flex items-center" title="Brain">
          <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${brainHealthy ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-gray-400">Brain</span>
        </div>
        <div className="flex items-center" title="Analyst Agent">
          <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${getStatusColor(swarmStatus?.analyst.status)}`}></div>
          <span className="text-gray-400">Analyst</span>
        </div>
        <div className="flex items-center" title="Memory Agent">
          <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${getStatusColor(swarmStatus?.memory.status)}`}></div>
          <span className="text-gray-400">Memory</span>
        </div>
        <div className="flex items-center" title="Sentinel Agent">
          <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${getStatusColor(swarmStatus?.sentinel.status)}`}></div>
          <span className="text-gray-400">Sentinel</span>
        </div>
        <div className="flex items-center" title="Registrar Agent">
          <div className={`w-2.5 h-2.5 rounded-full mr-1.5 ${getStatusColor(swarmStatus?.registrar.status)}`}></div>
          <span className="text-gray-400">Registrar</span>
        </div>
      </div>

      <div className="ml-auto flex items-center space-x-3">
        <button
          onClick={onSystemCheckClick}
          className="px-3 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 rounded text-blue-300 text-xs font-semibold transition-colors"
        >
          System Check
        </button>
        <button
            onClick={onDocsClick}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Documentation"
          >
          <BookOpenIcon className="w-7 h-7" />
        </button>
        <button
          onClick={onAboutClick}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
          aria-label="About Q Protocol"
        >
          <QuestionMarkCircleIcon className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
};