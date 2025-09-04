
import React, { useEffect } from 'react';
import { CubeIcon, XMarkIcon } from './icons';

const LatticeLightSheetShowcase: React.FC = () => (
    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 my-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-3 text-center">A Concrete Example: 4D Lattice LightSheet Imaging</h4>
        <p className="text-sm text-center text-slate-400 mb-4">A complex multi-day acquisition script is compressed into 3 lines of 3i-CUBE.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h5 className="font-semibold text-red-300 mb-2">Before (Vendor Script - Excerpt)</h5>
                <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-red-200/80 h-full overflow-auto"><code>{`
# Fictional complex script for a 3i Marianas system
# (represents dozens of UI clicks and settings)

- acquisition:
    - type: timelapse
    - duration: 24h
    - interval: 30s
- lattice_optics:
    - sheet_NA: 0.5
    - excitation_NA: 0.55
    - dither_range: 5um
- z_stack:
    - mode: piezo
    - steps: 200
    - step_size: 0.5um
- channels:
    - name: GFP
      laser: 488nm
      power: 5%
    - name: RFP
      laser: 561nm
      power: 8%
- post_processing:
    - deskew: true
    - deconvolution:
        - algorithm: richardson_lucy
        - iterations: 10
`}</code></pre>
            </div>
             <div>
                <h5 className="font-semibold text-green-300 mb-2">After (3i-CUBE)</h5>
                <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-green-200/80 h-full overflow-auto"><code>{`
# 4D Lattice Light Sheet with GPU acceleration - by 3i
SETUP|LATTICE[Marianas]→SAMPLE[Zebrafish_Embryo]|CONFIGURED

ACQUIRE|4D→VOLUME[500x500x100um]→TIME[24h]→INTERVAL[30s]|CAPTURING

PROCESS|DECONVOLVE[AI]→GPU[ACCELERATED]→RENDER[3D]|COMPLETE
`}</code></pre>
            </div>
        </div>
    </div>
);


export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <CubeIcon className="w-7 h-7 text-cyan-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">About 3i-CUBE</h2>
              <p className="text-sm text-slate-400">From Intelligent Imaging Innovations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-slate-300 space-y-6">
          <p className="text-lg text-center text-slate-100 mb-2">Transform Complex Microscopy into Simple, Universal Commands</p>
          
           <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-300">The Challenge: The Complexity Crisis</h3>
              <p className="text-slate-400">
                  3i systems are the most powerful in the world, but with great power comes great complexity. Scientists face major hurdles: software overload with hundreds of buttons, brittle and unshareable workflows tied to complex scripts, and a significant barrier to using groundbreaking AI/ML models for analysis.
              </p>
          </div>

          <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-300">The Solution: The Ultimate Remote Control</h3>
              <p className="text-slate-400">
                  3i-CUBE is a modern extension of 3i's software that solves the complexity crisis by acting as a universal remote control for your microscope. Instead of hundreds of buttons, CUBE uses a simple, intuitive language based on the <code>DOMAIN|SEQUENCE|OUTCOME</code> pattern. You tell the system what you want, and it handles the complex "button presses" for you, making workflows readable, shareable, and perfectly reproducible.
              </p>
          </div>

          <LatticeLightSheetShowcase />
          
           <div className="text-center border-t border-white/10 pt-6 mt-6">
              <h4 className="text-xl font-semibold text-slate-100 mb-2">Ready to Transform Your Workflow?</h4>
              <p className="text-slate-400 mb-4">Bring the power of 3i-CUBE to your lab.</p>
              <div className="flex justify-center space-x-4">
                  <button className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-md hover:brightness-110 transition-all duration-300 shadow-lg shadow-purple-500/30">
                      Schedule Demo
                  </button>
                  <button className="px-5 py-2 bg-white/10 text-white font-bold rounded-md hover:bg-white/20 transition-colors">
                      Download Examples
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
