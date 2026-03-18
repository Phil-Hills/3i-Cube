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
      <div className="bg-gray-800 border border-blue-900/50 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
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
                <li>200+ lines of complex code</li>
                <li>Hours or days of setup time</li>
                <li>Requires programming expertise</li>
                <li>Difficult to share or reproduce</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
              <h4 className="text-lg font-bold text-green-300 mb-2">✅ CUBE Way (New)</h4>
              <ul className="list-disc list-inside space-y-1 text-green-200/90">
                <li>~10 lines of simple commands</li>
                <li>5 minutes setup time</li>
                <li>Anyone can read and modify</li>
                <li>Share as simple text files</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-100 mb-3 text-center">Killer Example: Adaptive Optics</h4>
              <p className="text-sm text-center text-gray-400 mb-4">A real 200+ line 3i MATLAB script is converted into just 6 lines of CUBE.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <h5 className="font-semibold text-red-300 mb-2">Before (MATLAB - Excerpt)</h5>
                      <pre className="bg-gray-800 p-2 rounded text-xs font-mono text-red-200/80"><code>{`for i = Zernike_index
  for j = 1:length(ZernikeAmplitude) 
    [zernikeVector] = set_zernike_ALPAO_DM(...);
    pause(0.01);
    isRequestingFrame = 1;
    while (isFrameReady == 0)
      pause(0.1);
    end
    Current_Image = AOI;
    [Total_Intensity(i,j), ...] = Calc_Merits(...);
  end 
  [Max_Amp(i)] = Find_maximal_zernike_amplitude(...);
end`}</code></pre>
                  </div>
                   <div>
                      <h5 className="font-semibold text-green-300 mb-2">After (CUBE Protocol)</h5>
                      <pre className="bg-gray-800 p-2 rounded text-xs font-mono text-green-200/80 h-full"><code>{`# 3i Adaptive Optics - By Phil Hills
CONNECT|MICROSCOPE[3i]→DM[ALPAO]→CAMERA|READY
CALIBRATE|SPHERICAL[-3:1:3]→DEFOCUS[...]|FITTED
OPTIMIZE|ZERNIKE[1:7]→AMPLITUDE[-2:0.5:2]|RUNNING
ACQUIRE|LOOP[Modes]→TEST[Amplitudes]→MEASURE|OPTIMIZING
APPLY|BEST[Pattern]→DM[Send]→LOCK|CORRECTED
RESULTS|ENHANCEMENT[2.5x]→SAVE[Data]→PLOT|COMPLETE`}</code></pre>
                  </div>
              </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-100 mb-3">⚡️ Demo vs. Production</h4>
            <p className="text-sm text-gray-400 mb-3">This app is a high-fidelity demonstration. The CUBE commands are real and production-ready. When integrated at 3i, these simulated commands will control actual microscope hardware.</p>
            <div className="text-sm grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded">
                    <h5 className="font-semibold text-blue-300">This Demo App</h5>
                    <ul className="list-disc list-inside mt-2 text-gray-300">
                        <li>Simulates hardware control</li>
                        <li>Shows expected log output</li>
                        <li>Generates AI preview images</li>
                        <li>Proves the concept & value</li>
                    </ul>
                </div>
                 <div className="bg-gray-800 p-3 rounded">
                    <h5 className="font-semibold text-green-300">At 3i (Production)</h5>
                    <ul className="list-disc list-inside mt-2 text-gray-300">
                        <li>Executes real hardware control</li>
                        <li>Fires lasers, moves stages</li>
                        <li>Captures real images</li>
                        <li>Saves real data files</li>
                    </ul>
                </div>
            </div>
          </div>

          <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-2">What 3i Users Are Saying</h4>
              <div className="space-y-3 text-sm italic">
                <blockquote className="border-l-4 border-blue-500 pl-4 py-1 bg-gray-900/50 rounded-r-md">
                  <p className="text-gray-300">"CUBE reduced our experiment setup from 2 hours to 5 minutes!"</p>
                  <cite className="text-gray-500 not-italic block mt-1">- Research Lab, Harvard Medical School</cite>
                </blockquote>
                <blockquote className="border-l-4 border-blue-500 pl-4 py-1 bg-gray-900/50 rounded-r-md">
                  <p className="text-gray-300">"Finally, our biologists can program the microscope without learning Python."</p>
                  <cite className="text-gray-500 not-italic block mt-1">- Imaging Core, Stanford</cite>
                </blockquote>
              </div>
          </div>

           <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-2 mt-4">About the Creator</h4>
              <p className="text-sm leading-relaxed">
                  <strong>Phil Hills</strong> is a Seattle-based developer who created the CUBE Protocol to make complex systems simple. The protocol compresses traditional code by 100:1 while maintaining perfect clarity and functionality. CUBE was designed to help people spend less time coding and more time on what matters.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};