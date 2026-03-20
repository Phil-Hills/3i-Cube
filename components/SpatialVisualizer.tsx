import React from 'react';

interface SpatialVisualizerProps {
  command: string;
}

export const SpatialVisualizer: React.FC<SpatialVisualizerProps> = ({ command }) => {
  if (!command) return null;

  const parts = command.split('|');
  const action = parts[0];
  const coordinateString = parts.length > 1 ? parts[1] : '';

  if (!coordinateString) return null;

  const steps = coordinateString.split('→');

  return (
    <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-sm font-mono tracking-widest text-zinc-300 uppercase flex items-center">
          <svg className="w-5 h-5 text-sky-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          Spatial Coordinate Visualizer
        </h3>
        <span className="text-[10px] font-mono text-sky-500/80 uppercase tracking-widest bg-sky-900/10 px-2 py-1 rounded border border-sky-500/20">
          ◈ Claims 16-19
        </span>
      </div>

      <div className="flex-grow overflow-y-auto font-mono text-[13px] custom-scrollbar">
        <div className="text-sky-400 font-bold mb-3 uppercase tracking-wider">[{action}]</div>
        <div className="pl-4 border-l border-white/10 space-y-3 relative">
          {steps.map((step, index) => {
            const match = step.match(/^([A-Z_]+)\[(.*)\]$/);
            const name = match ? match[1] : step;
            const args = match ? match[2] : '';

            return (
              <div key={index} className="relative">
                <div className="absolute -left-[17px] top-3 w-4 h-px bg-white/10"></div>
                <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 inline-block min-w-[150px] shadow-inner">
                  <span className="text-zinc-300 font-semibold tracking-wider">{name}</span>
                  {args && (
                    <span className="text-zinc-500 ml-2">
                      [
                      {args.split(',').map((arg, i) => (
                        <React.Fragment key={i}>
                          <span className="text-emerald-400/90">{arg.trim()}</span>
                          {i < args.split(',').length - 1 && ', '}
                        </React.Fragment>
                      ))}
                      ]
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
