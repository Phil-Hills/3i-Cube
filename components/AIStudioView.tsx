import React, { useState } from 'react';
import { VideoBuilderView } from './VideoBuilderView';
import { MLBuilderView } from './MLBuilderView';
import { DataHubView } from './DataHubView';
import { VideoCameraIcon, CpuChipIcon, CircleStackIcon } from './icons';

interface AIStudioViewProps {
  onLoadInExecutor: (script: string) => void;
}

type AIView = 'video' | 'ml' | 'data';

const TabButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.FC<{className?: string}>;
    children: React.ReactNode;
}> = ({ isActive, onClick, icon: Icon, children }) => {
    const baseClasses = "flex-1 flex flex-col items-center justify-center p-4 text-sm font-medium transition-colors duration-200 border-b-2";
    const activeClasses = "text-cyan-300 border-cyan-400 bg-cyan-900/20";
    const inactiveClasses = "text-slate-400 border-transparent hover:bg-white/5 hover:text-white";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <Icon className="w-6 h-6 mb-1" />
            {children}
        </button>
    );
};

export const AIStudioView: React.FC<AIStudioViewProps> = ({ onLoadInExecutor }) => {
    const [activeView, setActiveView] = useState<AIView>('video');

    const renderActiveView = () => {
        switch (activeView) {
            case 'video':
                return <VideoBuilderView onLoadInExecutor={onLoadInExecutor} />;
            case 'ml':
                return <MLBuilderView onLoadInExecutor={onLoadInExecutor} />;
            case 'data':
                return <DataHubView onLoadInExecutor={onLoadInExecutor} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="flex flex-col flex-grow pt-2 overflow-hidden">
            <div className="flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-t-xl overflow-hidden">
                <nav className="flex items-stretch">
                    <TabButton isActive={activeView === 'video'} onClick={() => setActiveView('video')} icon={VideoCameraIcon}>
                        VEO Video Generation
                    </TabButton>
                    <TabButton isActive={activeView === 'ml'} onClick={() => setActiveView('ml')} icon={CpuChipIcon}>
                        Synthetic Data ML Builder
                    </TabButton>
                    <TabButton isActive={activeView === 'data'} onClick={() => setActiveView('data')} icon={CircleStackIcon}>
                        Scientific Data Hub
                    </TabButton>
                </nav>
            </div>
            <div className="flex-grow bg-slate-900/30 rounded-b-xl overflow-hidden">
                {renderActiveView()}
            </div>
        </div>
    );
};