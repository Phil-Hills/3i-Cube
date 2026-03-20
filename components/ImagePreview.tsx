
import React, { useState, useEffect, useRef } from 'react';
import { PhotoIcon, InformationCircleIcon } from './icons';

interface ImagePreviewProps {
  imageUrl: string | null;
  isExecuting?: boolean;
  qScript?: string;
  onExport?: () => void;
}

const getRealImageUrl = (script: string = ''): string => {
  const upperScript = script.toUpperCase();
  if (upperScript.includes('STORM') || upperScript.includes('LATTICE') || upperScript.includes('SIM')) {
    return 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80&w=800';
  } else if (upperScript.includes('NEURON') || upperScript.includes('BRAIN')) {
    return 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800';
  } else if (upperScript.includes('DAPI') || upperScript.includes('NUCLEI')) {
    return 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800';
  } else if (upperScript.includes('GFP') || upperScript.includes('CELLS')) {
    return 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800';
  }
  return 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800';
};

type Channel = 'MERGE' | 'DAPI' | 'GFP' | 'RFP';

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, isExecuting, qScript, onExport }) => {
  const [activeChannel, setActiveChannel] = useState<Channel>('MERGE');
  const [zDepth, setZDepth] = useState<number>(0);
  const [scanPos, setScanPos] = useState(0);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayUrl = getRealImageUrl(qScript);

  // Scanning animation effect
  useEffect(() => {
    let animationFrame: number;
    if (isExecuting) {
      const animate = () => {
        setScanPos((prev) => (prev >= 100 ? 0 : prev + 1.5));
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    } else {
      setScanPos(0);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isExecuting]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCrosshair({ x, y });
  };

  const getChannelFilter = () => {
    switch (activeChannel) {
      case 'DAPI': return 'grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(400%) brightness(0.9)';
      case 'GFP': return 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(400%) brightness(0.9)';
      case 'RFP': return 'grayscale(100%) sepia(100%) hue-rotate(330deg) saturate(400%) brightness(0.9)';
      default: return 'none';
    }
  };

  // Simulate focus blur based on Z-depth
  const focusBlur = Math.abs(zDepth) * 0.15;
  const scale = 1 + (zDepth * 0.002);

  return (
    <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col border border-white/10 h-full relative group shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mr-3"></div>
          <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">SlideBook™ Viewport</h2>
        </div>
        
        {/* Toolbar (Only show when not executing and image is present) */}
        {!isExecuting && (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                if (onExport) onExport();
                else alert("Image exported to SlideBook™ workspace.");
              }}
              className="flex items-center px-3 py-1 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/30 rounded text-sky-300 text-xs font-semibold transition-colors"
              title="Export to SlideBook™"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Export to SlideBook
            </button>
            <div className="flex bg-[#050505] rounded-md p-1 border border-white/10">
              {(['MERGE', 'DAPI', 'GFP', 'RFP'] as Channel[]).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`px-3 py-1 text-xs font-mono rounded ${activeChannel === ch ? 'bg-sky-600/30 text-sky-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Viewport Area */}
      <div 
        ref={containerRef}
        className="relative flex-grow bg-black rounded-lg min-h-0 overflow-hidden border border-white/5 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCrosshair(null)}
      >
        {isExecuting ? (
          /* High-Tech Acquisition HUD */
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Scanning Line */}
            <div 
              className="absolute left-0 right-0 h-1 bg-sky-400 shadow-[0_0_15px_#38bdf8] z-10"
              style={{ top: `${scanPos}%` }}
            ></div>

            {/* Target Reticle */}
            <div className="relative w-48 h-48 border border-sky-500/30 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-sky-500/20 rounded-full animate-ping"></div>
              <div className="w-1 h-4 bg-sky-500/50 absolute top-0"></div>
              <div className="w-1 h-4 bg-sky-500/50 absolute bottom-0"></div>
              <div className="w-4 h-1 bg-sky-500/50 absolute left-0"></div>
              <div className="w-4 h-1 bg-sky-500/50 absolute right-0"></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
            </div>

            {/* Telemetry Overlay */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-sky-500/80 space-y-1">
              <p>STATUS: ACQUIRING</p>
              <p>LASER: ACTIVE</p>
              <p>Z-POS: {(scanPos * 0.1).toFixed(2)} µm</p>
            </div>
          </div>
        ) : (
          /* Interactive Image View */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
              src={displayUrl} 
              alt="Microscopy data" 
              className="w-full h-full object-cover transition-all duration-200"
              style={{ 
                filter: `${getChannelFilter()} blur(${focusBlur}px)`,
                transform: `scale(${scale})`
              }}
              referrerPolicy="no-referrer"
              draggable={false}
            />
            
            {/* Crosshair & Intensity Readout */}
            {crosshair && (
              <>
                <div className="absolute top-0 bottom-0 w-px bg-white/20 pointer-events-none" style={{ left: crosshair.x }}></div>
                <div className="absolute left-0 right-0 h-px bg-white/20 pointer-events-none" style={{ top: crosshair.y }}></div>
                <div 
                  className="absolute font-mono text-[10px] text-zinc-100 bg-black/80 px-2 py-1 rounded pointer-events-none border border-white/10 shadow-lg"
                  style={{ left: crosshair.x + 10, top: crosshair.y + 10 }}
                >
                  X: {Math.round(crosshair.x)} Y: {Math.round(crosshair.y)}
                  <br/>
                  INT: {Math.round(Math.random() * 1000 + 3000)} AU
                </div>
              </>
            )}

            {/* Z-Stack Slider Overlay */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-48 flex flex-col items-center bg-black/60 p-2 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-[9px] font-mono text-zinc-400 mb-2">Z+</span>
              <input 
                type="range" 
                min="-20" 
                max="20" 
                value={zDepth}
                onChange={(e) => setZDepth(Number(e.target.value))}
                className="h-32 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 cursor-ns-resize"
                style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-2">Z-</span>
            </div>

            {/* Scale Bar */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end pointer-events-none">
              <div className="h-1 w-24 bg-white/80 border-x border-white"></div>
              <span className="text-[10px] font-mono text-white/80 mt-1 shadow-black drop-shadow-md">10 µm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
