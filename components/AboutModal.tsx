
import React, { useEffect } from 'react';
import { CubeIcon, XMarkIcon } from './icons';

const AdaptiveOpticsShowcase: React.FC = () => (
  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 my-6">
      <h4 className="text-lg font-semibold text-slate-100 mb-3 text-center">Killer Example: Adaptive Optics</h4>
      <p className="text-sm text-center text-slate-400 mb-4">A real 200+ line 3i MATLAB script is converted into just 6 lines of CUBE.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <h5 className="font-semibold text-red-300 mb-2">Before (MATLAB - Excerpt)</h5>
              <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-red-200/80 h-full overflow-auto"><code>{`
% This script performs indirect, image-based adaptive optics
% ... (150+ lines of nested loops, calibration, and plotting)

[nZern, Z2C, dm] = Init_ALPAO_DM();
dm.Reset();

p = polyfit(Spherical_calibration, Defocus_corection, 1);

for i = Zernike_index
  for j = 1:length(ZernikeAmplitude) 
    [zernikeVector] = set_zernike_ALPAO_DM(dm, nZern, Z2C, ...);      
    
    isRequestingFrame = 1;
    while (isFrameReady == 0)
      pause(0.1);
    end
    
    [Total_Intensity(i,j)] = Calc_Merits(...);
  end
  
  [Max_amp_fit(i)] = Find_maximal_zernike(...);
end

% Apply optimal pattern
dm.Send(zernikeVector * Z2C);
`}</code></pre>
          </div>
           <div>
              <h5 className="font-semibold text-green-300 mb-2">After (CUBE Protocol)</h5>
              <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-green-200/80 h-full overflow-auto"><code>{`
# 3i Adaptive Optics - By Phil Hills
CONNECT|MICROSCOPE[3i]→DM[ALPAO]|READY

CALIBRATE|SPHERICAL[-3:1:3]→DEFOCUS[...]|FITTED

OPTIMIZE|ZERNIKE[1:7]→AMPLITUDE[-2:0.5:2]|RUNNING

ACQUIRE|LOOP[Modes]→TEST[Amplitudes]→MEASURE|OPTIMIZING

APPLY|BEST[Pattern]→DM[Send]→LOCK|CORRECTED

RESULTS|ENHANCEMENT[2.5x]→SAVE[Data]|COMPLETE
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
              <h2 className="text-xl font-bold text-white">About CUBE Protocol</h2>
              <p className="text-sm text-slate-400">Created by Phil Hills - Seattle Developer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-slate-300 space-y-6">
          <p className="text-lg text-center text-slate-100 mb-2">Transform Complex Microscopy into Simple, Universal Commands</p>

          <AdaptiveOpticsShowcase />
          
           <div className="text-center border-t border-white/10 pt-6 mt-6">
              <h4 className="text-xl font-semibold text-slate-100 mb-2">Ready to Transform Your 3i Workflow?</h4>
              <p className="text-slate-400 mb-4">Contact Colin Monks to bring CUBE Protocol to your lab.</p>
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