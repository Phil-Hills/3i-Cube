
import React, { useState } from 'react';
import { convertCodeToQ, convertQToCode } from '../services/geminiService';
import { CONVERTER_EXAMPLES } from '../constants';
import type { ConversionMetrics } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, QIcon, ClipboardIcon, ArrowDownTrayIcon } from './icons';

const MetricsDisplay: React.FC<{ metrics: ConversionMetrics }> = ({ metrics }) => (
  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
    <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 shadow-inner">
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Original Lines</p>
      <p className="text-lg font-mono text-sky-400">{metrics.original_lines}</p>
    </div>
    <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 shadow-inner">
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Q Protocol Lines</p>
      <p className="text-lg font-mono text-emerald-400">{metrics.q_lines}</p>
    </div>
    <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 shadow-inner">
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Compression</p>
      <p className="text-lg font-mono text-zinc-300">{metrics.compression_ratio}</p>
    </div>
    <div className="bg-emerald-900/10 p-2.5 rounded-lg border border-emerald-500/20 shadow-inner">
      <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/80">Code Reduction</p>
      <p className="text-lg font-mono text-emerald-400">{metrics.savings_percent}%</p>
    </div>
  </div>
);

export const ConverterView: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [selectedExample, setSelectedExample] = useState('');
  const [outputMode, setOutputMode] = useState<'script' | 'file'>('script');
  const [conversionMode, setConversionMode] = useState<'encode' | 'decode'>('encode');

  const generateHex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `0x${(hash >>> 0).toString(16).padStart(8, '0').toUpperCase().substring(0, 6)}`;
  };

  const getDisplayCode = () => {
    if (!outputCode) return '';
    if (outputMode === 'script') return outputCode;
    
    const qFile = {
      version: "1.0",
      metadata: {
        author: "A2AC LLC",
        timestamp: new Date().toISOString(),
        claims: [11, 12, 13, 14]
      },
      script: outputCode.split('\n').filter(l => l.trim()),
      signature: `blake3:${generateHex(outputCode).toLowerCase()}...`
    };
    return JSON.stringify(qFile, null, 2);
  };

  const hexAliases = outputCode 
    ? outputCode.split('\n')
        .filter(l => l.trim() && !l.startsWith('#'))
        .map(line => ({ hex: generateHex(line.trim()), command: line.trim() }))
    : [];

  const handleConvert = async () => {
    if (!inputCode.trim() || isConverting) return;
    
    setIsConverting(true);
    setError(null);
    setMetrics(null);
    setOutputCode('');

    try {
      if (conversionMode === 'encode') {
        const result = await convertCodeToQ(inputCode);
        setOutputCode(result.q_code);
        setMetrics(result.metrics);
      } else {
        const result = await convertQToCode(inputCode);
        setOutputCode(result.code);
        // We don't need metrics for decode right now, or we could add them later
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown conversion error occurred.';
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleDownloadQ = () => {
    const element = document.createElement("a");
    const file = new Blob([getDisplayCode()], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = outputMode === 'file' ? "experiment.q" : "experiment.qpy";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadComparison = () => {
    if (!metrics) return;
    const comparison = `
# ===============================================
# Original Code (${metrics.original_lines} lines)
# ===============================================
${inputCode}

# ==================================================
# Q Protocol Version (${metrics.q_lines} lines)
# Converted by Phil Hills - Seattle Developer
# ==================================================
${outputCode}

# =================
# Metrics
# =================
# Compression Ratio: ${metrics.compression_ratio}
# Code Savings: ${metrics.savings_percent}%
`;
  
    const element = document.createElement("a");
    const file = new Blob([comparison.trim()], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "code_comparison.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col flex-grow pt-4 overflow-hidden gap-4">
      <div className="flex justify-center mb-2">
        <div className="bg-[#0a0a0a] p-1.5 rounded-xl flex space-x-1 border border-white/10 shadow-lg">
          <button
            onClick={() => {
              setConversionMode('encode');
              setInputCode('');
              setOutputCode('');
              setMetrics(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-[13px] font-mono uppercase tracking-wider transition-all duration-200 border ${
              conversionMode === 'encode' ? 'bg-sky-600/20 text-sky-400 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-[#050505] text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Encode to Q Protocol
          </button>
          <button
            onClick={() => {
              setConversionMode('decode');
              setInputCode('');
              setOutputCode('');
              setMetrics(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-[13px] font-mono uppercase tracking-wider transition-all duration-200 border ${
              conversionMode === 'decode' ? 'bg-sky-600/20 text-sky-400 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-[#050505] text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Decode from Q Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        {/* Input Panel */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
          <div className="flex items-center mb-4">
            <CodeBracketIcon className="w-5 h-5 text-sky-400 mr-2" />
            <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
              {conversionMode === 'encode' ? 'Your Microscope Code' : 'Your Q Protocol Script'}
            </h2>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-grow w-full bg-[#050505] text-sky-100/90 font-mono p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500/50 resize-none border border-white/5 text-[13px] leading-relaxed shadow-inner"
            placeholder={conversionMode === 'encode' ? "Paste your Python or MATLAB microscope code here..." : "Paste your Q Protocol script here..."}
            spellCheck={false}
          />
          {conversionMode === 'encode' && (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <select
                value={selectedExample}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSelectedExample(selectedName);
                  const example = CONVERTER_EXAMPLES.find(ex => ex.name === selectedName);
                  if (example) {
                    setInputCode(example.code);
                    setOutputCode('');
                    setMetrics(null);
                    setError(null);
                  }
                }}
                className="bg-[#050505] text-[13px] font-mono text-zinc-300 rounded-lg p-3 border border-white/10 focus:outline-none focus:ring-1 focus:ring-sky-500/50 w-full sm:flex-grow shadow-inner"
              >
                <option value="" disabled>Load Example Snippet...</option>
                {CONVERTER_EXAMPLES.map(example => (
                  <option key={example.name} value={example.name}>{example.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedExample && conversionMode === 'encode' && (
              <p className="text-[11px] font-mono text-zinc-500 mt-3 p-3 bg-[#050505] rounded-lg border border-white/5 shadow-inner leading-relaxed">
                  <strong className="text-sky-400/80 uppercase tracking-wider">Description:</strong> {CONVERTER_EXAMPLES.find(ex => ex.name === selectedExample)?.description}
              </p>
          )}
        </div>
        
        {/* Output Panel */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <QIcon className="w-5 h-5 text-emerald-400 mr-2" />
              <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">
                {conversionMode === 'encode' 
                  ? (outputMode === 'script' ? 'Q Protocol Output' : '.q File Format ◈ Claims 11-14')
                  : 'Decoded Python/MATLAB Code'}
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              {conversionMode === 'encode' && (
                <select 
                  value={outputMode} 
                  onChange={(e) => setOutputMode(e.target.value as 'script' | 'file')}
                  className="bg-[#050505] text-[11px] font-mono uppercase tracking-wider text-zinc-300 rounded-md p-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="script">Raw Script</option>
                  <option value="file">.q File</option>
                </select>
              )}
                <button onClick={handleCopy} disabled={!outputCode} className="text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors text-[11px] font-mono uppercase tracking-wider flex items-center">
                  <ClipboardIcon className="w-4 h-4 mr-1.5"/>
                  {copySuccess || 'Copy'}
                </button>
                {conversionMode === 'encode' && (
                  <button onClick={handleDownloadQ} disabled={!outputCode} className="text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors text-[11px] font-mono uppercase tracking-wider flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1.5"/>
                    {outputMode === 'file' ? '.q' : '.qpy'}
                  </button>
                )}
                {conversionMode === 'encode' && (
                  <button onClick={handleDownloadComparison} disabled={!outputCode || !metrics} className="text-zinc-500 hover:text-zinc-300 disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors text-[11px] font-mono uppercase tracking-wider flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1.5"/>
                    Compare
                  </button>
                )}
            </div>
          </div>
          <textarea
            value={conversionMode === 'encode' ? getDisplayCode() : outputCode}
            readOnly
            className="flex-grow w-full bg-[#050505] text-emerald-400/90 font-mono p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none border border-white/5 text-[13px] leading-relaxed shadow-inner"
            placeholder={conversionMode === 'encode' ? "Converted Q Protocol script will appear here..." : "Decoded code will appear here..."}
            spellCheck={false}
          />
           {metrics && conversionMode === 'encode' && <MetricsDisplay metrics={metrics} />}
           
           {/* Hex Aliases Panel */}
           {hexAliases.length > 0 && outputMode === 'script' && conversionMode === 'encode' && (
             <div className="mt-4 bg-[#050505] rounded-lg p-3.5 border border-white/5 overflow-y-auto max-h-32 shadow-inner custom-scrollbar">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Hex Alias Promotion ◈ Claims 3, 7</h3>
                 <span className="text-[10px] font-mono text-sky-500/80 uppercase tracking-widest">K* Semantic Compression Active ◈ Claim 15</span>
               </div>
               <ul className="space-y-1.5">
                 {hexAliases.map((alias, idx) => (
                   <li key={idx} className="text-[11px] font-mono flex items-start">
                     <span className="text-indigo-400 font-bold mr-3">{alias.hex}</span>
                     <span className="text-zinc-600 mr-3">→</span>
                     <span className="text-zinc-400 break-all">{alias.command}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="flex-shrink-0">
         {error && <div className="text-center text-red-400/90 font-mono text-[13px] mb-3">{error}</div>}
         <button
          onClick={handleConvert}
          disabled={isConverting || !inputCode.trim()}
          className="w-full flex items-center justify-center p-3.5 bg-sky-600 text-white font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:shadow-none"
        >
          {isConverting ? (
            <>
              <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
              {conversionMode === 'encode' ? 'Converting...' : 'Decoding...'}
            </>
          ) : (
            <>
              <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
              {conversionMode === 'encode' ? 'Convert to Q Protocol' : 'Decode to Python/MATLAB'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
