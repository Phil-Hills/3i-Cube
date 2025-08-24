
import React, { useState } from 'react';
import { convertCodeToCube } from '../services/geminiService';
import { CONVERTER_EXAMPLES } from '../constants';
import type { ConversionMetrics } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, CubeIcon, ClipboardIcon, ArrowDownTrayIcon } from './icons';

const MetricsDisplay: React.FC<{ metrics: ConversionMetrics }> = ({ metrics }) => (
  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
    <div className="bg-black/20 p-3 rounded-md">
      <p className="text-xs text-gray-400">Original Lines</p>
      <p className="text-lg font-bold text-cyan-300">{metrics.original_lines}</p>
    </div>
    <div className="bg-black/20 p-3 rounded-md">
      <p className="text-xs text-gray-400">CUBE Lines</p>
      <p className="text-lg font-bold text-green-400">{metrics.cube_lines}</p>
    </div>
    <div className="bg-black/20 p-3 rounded-md">
      <p className="text-xs text-gray-400">Compression</p>
      <p className="text-lg font-bold text-gray-100">{metrics.compression_ratio}</p>
    </div>
    <div className="bg-green-900/20 p-3 rounded-md border border-green-800/50">
      <p className="text-xs text-green-300">Code Reduction</p>
      <p className="text-lg font-bold text-green-400">{metrics.savings_percent}%</p>
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

  const handleConvert = async () => {
    if (!inputCode.trim() || isConverting) return;
    
    setIsConverting(true);
    setError(null);
    setMetrics(null);
    setOutputCode('');

    try {
      const result = await convertCodeToCube(inputCode);
      setOutputCode(result.cube_code);
      setMetrics(result.metrics);
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

  const handleDownloadCube = () => {
    const element = document.createElement("a");
    const file = new Blob([outputCode], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "experiment.cuby";
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
# CUBE Protocol Version (${metrics.cube_lines} lines)
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
    <div className="flex flex-col flex-grow pt-6 overflow-hidden gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-hidden">
        {/* Input Panel */}
        <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg p-4 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <CodeBracketIcon className="w-6 h-6 text-cyan-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-100">Your 3i Microscope Code</h2>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-grow w-full bg-gray-900/70 text-gray-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none border border-white/10 text-sm"
            placeholder="Paste your Python or MATLAB microscope code here..."
          />
           <div className="mt-2 flex flex-col sm:flex-row gap-2">
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
                className="bg-gray-900/70 text-sm text-gray-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:flex-grow"
              >
                <option value="" disabled>Load Example Snippet...</option>
                {CONVERTER_EXAMPLES.map(example => (
                  <option key={example.name} value={example.name}>{example.name}</option>
                ))}
              </select>
            </div>
            {selectedExample && (
                <p className="text-xs text-gray-400 mt-2 p-2 bg-black/20 rounded-md">
                    <strong>Description:</strong> {CONVERTER_EXAMPLES.find(ex => ex.name === selectedExample)?.description}
                </p>
            )}
        </div>
        
        {/* Output Panel */}
        <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CubeIcon className="w-6 h-6 text-cyan-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">CUBE Protocol Output</h2>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={handleCopy} title="Copy to Clipboard" disabled={!outputCode} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                  <ClipboardIcon className="w-4 h-4 mr-1"/>
                  {copySuccess || 'Copy'}
                </button>
                <button onClick={handleDownloadCube} title="Download .cuby file" disabled={!outputCode} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1"/>
                  .cuby
                </button>
                <button onClick={handleDownloadComparison} title="Download comparison file" disabled={!outputCode || !metrics} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1"/>
                  Compare
                </button>
            </div>
          </div>
          <textarea
            value={outputCode}
            readOnly
            className="flex-grow w-full bg-gray-900/70 text-cyan-300 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none border border-white/10 text-sm"
            placeholder="Converted CUBE script will appear here..."
          />
           {metrics && <MetricsDisplay metrics={metrics} />}
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="flex-shrink-0">
         {error && <div className="text-center text-red-400 mb-2 text-sm">{error}</div>}
         <button
          onClick={handleConvert}
          disabled={isConverting || !inputCode.trim()}
          className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-md hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transform hover:-translate-y-0.5"
        >
          {isConverting ? (
            <>
              <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
              Converting...
            </>
          ) : (
            <>
              <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
              Convert to CUBE
            </>
          )}
        </button>
      </div>
    </div>
  );
};
