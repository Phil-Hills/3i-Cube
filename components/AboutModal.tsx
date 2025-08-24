
import React, { useEffect } from 'react';
import { CubeIcon, XMarkIcon } from './icons';

export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-800 border border-blue-900/50 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center">
            <CubeIcon className="w-7 h-7 text-blue-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">CUBE Protocol for 3i Microscopes</h2>
              <p className="text-sm text-gray-400">Created by Phil Hills - Seattle Developer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-gray-300 space-y-6">
          <h3 className="text-lg font-semibold text-center text-gray-100 mb-2">Transform Complex Microscopy into Simple Commands</h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
              <h4 className="text-lg font-bold text-red-300 mb-2">❌ Old Way (Current)</h4>
              <ul className="list-disc list-inside space-y-1 text-red-200/90">
                <li>500+ lines of code per experiment</li>
                <li>2-3 days setup time</li>
                <li>Requires programming expertise</li>
                <li>Difficult to share or reproduce</li>
                <li>Expensive on-site support</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
              <h4 className="text-lg font-bold text-green-300 mb-2">✅ CUBE Way (New)</h4>
              <ul className="list-disc list-inside space-y-1 text-green-200/90">
                <li>1-5 lines per experiment</li>
                <li>5 minutes setup time</li>
                <li>Anyone can use</li>
                <li>Share as simple text files</li>
                <li>Remote support possible</li>
              </ul>
            </div>
          </div>
          
          <div>
             <h4 className="text-lg font-semibold text-gray-100 mb-3">Real Examples</h4>
             <div className="space-y-3 text-sm">
                <div>
                    <p className="font-semibold text-blue-300">Capture Multi-Channel Image:</p>
                    <pre className="bg-gray-900/80 p-2 mt-1 rounded-md text-cyan-300 font-mono text-xs"><code>CAPTURE|MULTI[DAPI,GFP,RFP]→EXPOSURE[100ms]→MERGE→SAVE[cells.tif]|DONE</code></pre>
                </div>
                <div>
                    <p className="font-semibold text-blue-300">Run Time-Lapse Experiment:</p>
                    <pre className="bg-gray-900/80 p-2 mt-1 rounded-md text-cyan-300 font-mono text-xs"><code>EXPERIMENT|TIMELAPSE→INTERVAL[5min]→DURATION[24h]→TRACK[cells]|RUNNING</code></pre>
                </div>
             </div>
          </div>

           <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-2">About the Creator</h4>
              <p className="text-sm leading-relaxed">
                  <strong>Phil Hills</strong> is a Seattle-based developer who created the CUBE Protocol to make complex systems simple. The protocol compresses traditional code by 100:1 while maintaining perfect clarity and functionality. CUBE was designed to help people spend less time coding and more time on what matters.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
