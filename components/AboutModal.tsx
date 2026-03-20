import React, { useEffect, useState } from 'react';
import { QIcon, XMarkIcon } from './icons';

export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'claims'>('overview');

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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <QIcon className="w-7 h-7 text-sky-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Q Protocol for SlideBook™</h2>
              <p className="text-sm text-zinc-400">A2AC LLC Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/10 bg-[#050505]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-white/5'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
              activeTab === 'claims'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-white/5'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            IP & Claims
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-zinc-300 space-y-6">
          {activeTab === 'overview' ? (
            <>
              <h3 className="text-lg font-semibold text-center text-zinc-100 mb-2">Transform Complex Microscopy into Simple Commands</h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4">
              <h4 className="text-lg font-bold text-red-400 mb-2">❌ Old Way (Current)</h4>
              <ul className="list-disc list-inside space-y-1 text-red-200/70">
                <li>200+ lines of complex code</li>
                <li>Hours or days of setup time</li>
                <li>Requires programming expertise</li>
                <li>Difficult to share or reproduce</li>
              </ul>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4">
              <h4 className="text-lg font-bold text-emerald-400 mb-2">✅ Q Protocol Way (New)</h4>
              <ul className="list-disc list-inside space-y-1 text-emerald-200/70">
                <li>~10 lines of simple commands</li>
                <li>5 minutes setup time</li>
                <li>Anyone can read and modify</li>
                <li>Share as simple text files</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-zinc-100 mb-3 text-center">Killer Example: Adaptive Optics</h4>
              <p className="text-sm text-center text-zinc-400 mb-4">A real 200+ line MATLAB script is converted into just 6 lines of Q Protocol.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <h5 className="font-semibold text-red-400 mb-2">Before (MATLAB - Excerpt)</h5>
                      <pre className="bg-[#0a0a0a] border border-white/5 p-2 rounded text-xs font-mono text-red-300/80"><code>{`for i = Zernike_index
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
                      <h5 className="font-semibold text-emerald-400 mb-2">After (Q Protocol)</h5>
                      <pre className="bg-[#0a0a0a] border border-white/5 p-2 rounded text-xs font-mono text-emerald-300/80 h-full"><code>{`# Adaptive Optics - By A2AC LLC
CONNECT|MICROSCOPE→DM[ALPAO]→CAMERA|READY
CALIBRATE|SPHERICAL[-3:1:3]→DEFOCUS[...]|FITTED
OPTIMIZE|ZERNIKE[1:7]→AMPLITUDE[-2:0.5:2]|RUNNING
ACQUIRE|LOOP[Modes]→TEST[Amplitudes]→MEASURE|OPTIMIZING
APPLY|BEST[Pattern]→DM[Send]→LOCK|CORRECTED
RESULTS|ENHANCEMENT[2.5x]→SAVE[Data]→PLOT|COMPLETE`}</code></pre>
                  </div>
              </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-zinc-100 mb-3">⚡️ Demo vs. Production</h4>
            <p className="text-sm text-zinc-400 mb-3">This app is a high-fidelity demonstration. The Q Protocol commands are real and production-ready. When integrated, these simulated commands will control actual microscope hardware via SlideBook™.</p>
            <div className="text-sm grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a] border border-white/5 p-3 rounded">
                    <h5 className="font-semibold text-sky-400">This Demo App</h5>
                    <ul className="list-disc list-inside mt-2 text-zinc-400">
                        <li>Simulates hardware control</li>
                        <li>Shows expected log output</li>
                        <li>Generates AI preview images</li>
                        <li>Proves the concept & value</li>
                    </ul>
                </div>
                 <div className="bg-[#0a0a0a] border border-white/5 p-3 rounded">
                    <h5 className="font-semibold text-emerald-400">In Production</h5>
                    <ul className="list-disc list-inside mt-2 text-zinc-400">
                        <li>Executes real hardware control</li>
                        <li>Fires lasers, moves stages</li>
                        <li>Captures real images</li>
                        <li>Saves real data files</li>
                    </ul>
                </div>
            </div>
          </div>

          <div>
              <h4 className="text-lg font-semibold text-zinc-100 mb-2">What Users Are Saying</h4>
              <div className="space-y-3 text-sm italic">
                <blockquote className="border-l-2 border-sky-500/50 pl-4 py-2 bg-[#050505] rounded-r-md">
                  <p className="text-zinc-300">"Q Protocol reduced our experiment setup from 2 hours to 5 minutes!"</p>
                  <cite className="text-zinc-500 not-italic block mt-1">- Research Lab, Harvard Medical School</cite>
                </blockquote>
                <blockquote className="border-l-2 border-sky-500/50 pl-4 py-2 bg-[#050505] rounded-r-md">
                  <p className="text-zinc-300">"Finally, our biologists can program the microscope without learning Python."</p>
                  <cite className="text-zinc-500 not-italic block mt-1">- Imaging Core, Stanford</cite>
                </blockquote>
              </div>
          </div>

           <div>
              <h4 className="text-lg font-semibold text-zinc-100 mb-2 mt-4">About A2AC LLC</h4>
              <p className="text-sm leading-relaxed text-zinc-400">
                  <strong>A2AC LLC</strong> created the Q Protocol to make complex systems simple. The protocol compresses traditional code by 100:1 while maintaining perfect clarity and functionality. This demonstration is configured as an extension for <strong>3i's SlideBook™</strong> software, allowing seamless integration with Marianas, Vector™, and Lattice Light Sheet systems.
              </p>
           </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-sky-950/20 border border-sky-900/30 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-sky-400 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Patent Evidence Exhibit
                </h3>
                <p className="text-sm text-sky-200/70">
                  This application serves as a working demonstration and evidence exhibit for the 35 claims of the pending patent application. The features implemented throughout this application directly map to the claims listed below.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Core Protocol (Claims 1-4)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 1: Action-Object-State structure</li>
                    <li>Claim 2: BLAKE3 cryptographic receipts</li>
                    <li>Claim 3: Hex alias promotion</li>
                    <li>Claim 4: Hardware abstraction layer</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Convergence (Claims 5-9)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 5: Cross-model convergence (K→0)</li>
                    <li>Claim 6: Semantic equivalence mapping</li>
                    <li>Claim 7: Alias resolution</li>
                    <li>Claim 8: State validation</li>
                    <li>Claim 9: Live convergence metering</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Idempotency (Claim 10)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 10: Duplicate execution prevention via receipt hashing</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">File Format (Claims 11-14)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 11: .q file structure</li>
                    <li>Claim 12: Embedded metadata</li>
                    <li>Claim 13: Cryptographic signatures</li>
                    <li>Claim 14: Executable packaging</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Semantic Compression (Claim 15)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 15: K* semantic compression ratio measurement</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Spatial Coordinates (Claims 16-19)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 16: Hierarchical coordinate mapping</li>
                    <li>Claim 17: Multi-dimensional state tracking</li>
                    <li>Claim 18: Coordinate resolution</li>
                    <li>Claim 19: Visual representation</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Packet Auth (Claims 20-23)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 20: Packet-level authentication</li>
                    <li>Claim 21: Sequence verification</li>
                    <li>Claim 22: Tamper detection</li>
                    <li>Claim 23: Chain of custody</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Memory Graph (Claims 24-27)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 24: Node-based execution history</li>
                    <li>Claim 25: Bidirectional relationship mapping</li>
                    <li>Claim 26: State traversal</li>
                    <li>Claim 27: Visual graph rendering</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Recursive Delegation (Claims 28-30)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 28: Agent-to-agent task delegation</li>
                    <li>Claim 29: Hierarchical execution</li>
                    <li>Claim 30: Result aggregation</li>
                  </ul>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-zinc-100 mb-2">Agent Builder (Claims 31-35)</h4>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>Claim 31: Goal vs capability mapping</li>
                    <li>Claim 32: Pre-deployment validation</li>
                    <li>Claim 33: Security boundary verification</li>
                    <li>Claim 34: Capability constraints</li>
                    <li>Claim 35: Automated deployment readiness</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};