import React from 'react';
import { PlayIcon, SparklesIcon, SwitchHorizontalIcon, PhotoIcon, CubeIcon } from './icons';
import type { View, GalleryImage } from '../types';

interface DashboardViewProps {
  onViewChange: (view: View) => void;
  galleryImages: GalleryImage[];
  onImageClick: (media: GalleryImage) => void;
}

const ActionCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, buttonText, onClick }) => (
  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-200">
    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 flex-grow mb-4">{description}</p>
    <button
      onClick={onClick}
      className="w-full mt-auto px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-cyan-600/80 transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

const benchmarkData = [
  { workflow: 'Multi-Well Plate Analysis', original: 1655, cube: 11 },
  { workflow: 'Adaptive Optics Correction', original: 473, cube: 7 },
  { workflow: 'Live Cell FRAP Experiment', original: 246, cube: 8 },
];

const totals = {
  original: 2374,
  cube: 26,
};

const BenchmarkCard: React.FC = () => {
    const maxLines = Math.max(...benchmarkData.map(d => d.original));
    
    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Validated Efficiency</h2>
            <p className="text-center text-slate-400 mb-6">Real-world workflows, radically simplified. Less code, more science.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-4xl font-extrabold text-cyan-400">91:1</p>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Average Compression</p>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-4xl font-extrabold text-white">{totals.original.toLocaleString()}</p>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Lines of Python</p>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-4xl font-extrabold text-white">{totals.cube}</p>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">CUBE Commands</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-4xl font-extrabold text-green-400">98%</p>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Code Reduction</p>
                </div>
            </div>

            <div className="space-y-4 flex-grow">
                {benchmarkData.map(item => (
                    <div key={item.workflow}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-semibold text-slate-200">{item.workflow}</span>
                            <span className="font-mono text-slate-400">{item.original.toLocaleString()} vs. {item.cube} lines</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 relative" title={`Original: ${item.original} lines`}>
                             <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full absolute" 
                                style={{ width: `${(item.original / maxLines) * 100}%` }}
                             ></div>
                             <div 
                                className="bg-purple-500 h-3 rounded-full absolute" 
                                style={{ width: `${(item.cube / maxLines) * 100}%` }}
                                title={`CUBE: ${item.cube} commands`}
                             ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center text-xs mt-4 justify-end text-slate-400">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mr-2"></span> Original Code
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2 ml-4"></span> CUBE Code
            </div>
        </div>
    );
};

const RecentMediaCard: React.FC<{
    images: GalleryImage[];
    onImageClick: (media: GalleryImage) => void;
    onViewGalleryClick: () => void;
}> = ({ images, onImageClick, onViewGalleryClick }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Latest from Gallery</h2>
            <button onClick={onViewGalleryClick} className="text-sm text-cyan-400 hover:underline">View All</button>
        </div>
        {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
                {images.slice(0, 3).map(image => (
                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative" onClick={() => onImageClick(image)}>
                        {image.mediaType === 'image' ? (
                            <img src={image.imageUrl} alt="Recent media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                        ) : (
                             <video src={image.imageUrl} muted loop className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()}></video>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <p className="text-xs text-white truncate">{image.tags.technique}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-slate-500 py-8">
                <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Your generated media will appear here.</p>
                <p className="text-xs">Run a script in the Executor to get started.</p>
            </div>
        )}
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange, galleryImages, onImageClick }) => {
  return (
    <div className="flex-grow flex flex-col p-2 sm:p-4 overflow-y-auto animate-fade-in items-center">
        <div className="max-w-6xl w-full space-y-8">
            <header className="text-center pt-8 pb-4">
                <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl flex items-center justify-center">
                    <CubeIcon className="w-10 h-10 mr-4 text-cyan-400" />
                    3i-CUBE Dashboard
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
                   Your central hub for intelligent imaging. Start an experiment, explore AI tools, or review your latest work.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard 
                    icon={PlayIcon}
                    title="Start Experiment"
                    description="Jump into the CUBE Executor to write, load, and run imaging protocols with live feedback."
                    buttonText="Open Executor"
                    onClick={() => onViewChange('executor')}
                />
                 <ActionCard 
                    icon={SparklesIcon}
                    title="Explore AI Studio"
                    description="Generate synthetic data, build ML models, or create video from text prompts, all powered by CUBE."
                    buttonText="Open AI Studio"
                    onClick={() => onViewChange('ai_studio')}
                />
                 <ActionCard 
                    icon={SwitchHorizontalIcon}
                    title="Convert & Compress"
                    description="Use the CUBE Converter to transform legacy code, natural language, or raw data into compact CUBE commands."
                    buttonText="Open Converter"
                    onClick={() => onViewChange('converter')}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentMediaCard 
                    images={galleryImages} 
                    onImageClick={onImageClick}
                    onViewGalleryClick={() => onViewChange('gallery')}
                />
                <BenchmarkCard />
            </div>
        </div>
    </div>
  );
};