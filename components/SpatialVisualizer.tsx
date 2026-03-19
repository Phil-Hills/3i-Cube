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
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-100 flex items-center">
          <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          Spatial Coordinate Visualizer
        </h3>
        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50">
          ◈ Claims 16-19
        </span>
      </div>

      <div className="flex-grow overflow-y-auto font-mono text-sm">
        <div className="text-purple-400 font-bold mb-2">[{action}]</div>
        <div className="pl-4 border-l-2 border-gray-700 space-y-2 relative">
          {steps.map((step, index) => {
            const match = step.match(/^([A-Z_]+)\[(.*)\]$/);
            const name = match ? match[1] : step;
            const args = match ? match[2] : '';

            return (
              <div key={index} className="relative">
                <div className="absolute -left-[17px] top-2 w-4 h-px bg-gray-700"></div>
                <div className="bg-gray-900/60 p-2 rounded border border-gray-700/50 inline-block min-w-[150px]">
                  <span className="text-blue-300 font-semibold">{name}</span>
                  {args && (
                    <span className="text-gray-400 ml-2">
                      [{args.split(',').map((arg, i) => (
                        <React.Fragment key={i}>
                          <span className="text-green-400">{arg.trim()}</span>
                          {i < args.split(',').length - 1 && ', '}
                        </React.Fragment>
                      ))}]
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
