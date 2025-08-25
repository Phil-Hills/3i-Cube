import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, CubeIcon, PlayIcon } from './icons';

interface VideoBuilderViewProps {
  onLoadInExecutor: (script: string) => void;
}

export const VideoBuilderView: React.FC<VideoBuilderViewProps> = ({ onLoadInExecutor }) => {
  const [prompt, setPrompt] = useState('A photorealistic video of a spaceship flying through a colorful nebula');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedScript, setGeneratedScript] = useState('');

  useEffect(() => {
    const script = `GENERATE|VIDEO[${prompt}]→MODEL[veo-2.0-generate-001]→ASPECT[${aspectRatio}]|RENDERING`;
    setGeneratedScript(script);
  }, [prompt, aspectRatio]);

  return (
    <div className="flex flex-col flex-grow pt-6 overflow-y-auto gap-6 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <VideoCameraIcon className="w-8 h-8 mr-3 text-cyan-400" />
          AI Video Builder (VEO)
        </h1>
        <p className="mt-2 text-slate-400">Generate a video from a text prompt and create the CUBE script automatically.</p>
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Prompt Input */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 w-full flex flex-col">
            <label htmlFor="prompt-input" className="text-md font-semibold text-cyan-300 mb-3 flex items-center">
                Video Prompt
            </label>
            <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-24 bg-slate-900 text-slate-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y border border-white/10 text-sm"
                placeholder="e.g., A cat wearing sunglasses driving a convertible..."
            />
        </div>
        
        {/* Configuration */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 w-full flex flex-col">
            <label htmlFor="aspect-ratio-select" className="text-md font-semibold text-cyan-300 mb-3 flex items-center">
                Configuration
            </label>
            <select
                id="aspect-ratio-select"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-700/50 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3 (Classic)</option>
            </select>
        </div>
        
        {/* Generated Script */}
        <div className="bg-slate-900/50 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl p-4 mt-4">
            <div className="flex items-center mb-2">
            <CubeIcon className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-lg font-semibold text-slate-100">Generated CUBE Script</h3>
            </div>
            <pre className="w-full bg-black/50 p-3 rounded-md text-cyan-300 font-mono text-sm overflow-x-auto">
            <code>{generatedScript}</code>
            </pre>
        </div>

        <button
            onClick={() => onLoadInExecutor(generatedScript)}
            className="mt-2 w-full flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl shadow-purple-500/20 transform hover:-translate-y-1"
        >
            <PlayIcon className="w-6 h-6 mr-3" />
            Load in Executor & Generate Video
        </button>
      </div>

    </div>
  );
};
