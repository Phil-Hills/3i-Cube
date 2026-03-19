
import React, { useState } from 'react';
import { convertCodeToCube, convertCubeToCode } from '../services/geminiService';
import { CONVERTER_EXAMPLES } from '../constants';
import type { ConversionMetrics } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, CubeIcon, ClipboardIcon, ArrowDownTrayIcon } from './icons';

const MetricsDisplay: React.FC<{ metrics: ConversionMetrics }> = ({ metrics }) => (
  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
    <div className="bg-gray-900/50 p-2 rounded-md">
      <p className="text-xs text-gray-400">Original Lines</p>
      <p className="text-lg font-bold text-blue-300">{metrics.original_lines}</p>
    </div>
    <div className="bg-gray-900/50 p-2 rounded-md">
      <p className="text-xs text-gray-400">CUBE Lines</p>
      <p className="text-lg font-bold text-green-300">{metrics.cube_lines}</p>
    </div>
    <div className="bg-gray-900/50 p-2 rounded-md">
      <p className="text-xs text-gray-400">Compression</p>
      <p className="text-lg font-bold text-gray-100">{metrics.compression_ratio}</p>
    </div>
    <div className="bg-green-900/20 p-2 rounded-md border border-green-800/50">
      <p className="text-xs text-green-300">Code Reduction</p>
      <p className="text-lg font-bold text-green-300">{metrics.savings_percent}%</p>
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
    
    const cubeFile = {
      version: "1.0",
      metadata: {
        author: "A2AC LLC",
        timestamp: new Date().toISOString(),
        claims: [11, 12, 13, 14]
      },
      script: outputCode.split('\n').filter(l => l.trim()),
      signature: `blake3:${generateHex(outputCode).toLowerCase()}...`
    };
    return JSON.stringify(cubeFile, null, 2);
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
        const result = await convertCodeToCube(inputCode);
        setOutputCode(result.cube_code);
        setMetrics(result.metrics);
      } else {
        const result = await convertCubeToCode(inputCode);
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

  const handleDownloadCube = () => {
    const element = document.createElement("a");
    const file = new Blob([getDisplayCode()], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = outputMode === 'file' ? "experiment.cube" : "experiment.cuby";
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
    <div className="flex flex-col flex-grow pt-4 overflow-hidden gap-4">
      <div className="flex justify-center mb-2">
        <div className="bg-gray-800 p-1 rounded-lg flex space-x-1 border border-gray-700">
          <button
            onClick={() => {
              setConversionMode('encode');
              setInputCode('');
              setOutputCode('');
              setMetrics(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              conversionMode === 'encode' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Encode to CUBE
          </button>
          <button
            onClick={() => {
              setConversionMode('decode');
              setInputCode('');
              setOutputCode('');
              setMetrics(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              conversionMode === 'decode' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Decode from CUBE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        {/* Input Panel */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
          <div className="flex items-center mb-4">
            <CodeBracketIcon className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-100">
              {conversionMode === 'encode' ? 'Your 3i Microscope Code' : 'Your CUBE Protocol Script'}
            </h2>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-grow w-full bg-gray-900/70 text-gray-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 text-sm"
            placeholder={conversionMode === 'encode' ? "Paste your Python or MATLAB microscope code here..." : "Paste your CUBE script here..."}
          />
          {conversionMode === 'encode' && (
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
                className="bg-gray-700 text-sm text-gray-200 rounded-md p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:flex-grow"
              >
                <option value="" disabled>Load Example Snippet...</option>
                {CONVERTER_EXAMPLES.map(example => (
                  <option key={example.name} value={example.name}>{example.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedExample && conversionMode === 'encode' && (
              <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-900/50 rounded-md">
                  <strong>Description:</strong> {CONVERTER_EXAMPLES.find(ex => ex.name === selectedExample)?.description}
              </p>
          )}
        </div>
        
        {/* Output Panel */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CubeIcon className="w-6 h-6 text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">
                {conversionMode === 'encode' 
                  ? (outputMode === 'script' ? 'CUBE Protocol Output' : '.cube File Format ◈ Claims 11-14')
                  : 'Decoded Python/MATLAB Code'}
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              {conversionMode === 'encode' && (
                <select 
                  value={outputMode} 
                  onChange={(e) => setOutputMode(e.target.value as 'script' | 'file')}
                  className="bg-gray-700 text-xs text-gray-200 rounded p-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="script">Raw Script</option>
                  <option value="file">.cube File</option>
                </select>
              )}
                <button onClick={handleCopy} disabled={!outputCode} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                  <ClipboardIcon className="w-4 h-4 mr-1"/>
                  {copySuccess || 'Copy'}
                </button>
                {conversionMode === 'encode' && (
                  <button onClick={handleDownloadCube} disabled={!outputCode} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1"/>
                    {outputMode === 'file' ? '.cube' : '.cuby'}
                  </button>
                )}
                {conversionMode === 'encode' && (
                  <button onClick={handleDownloadComparison} disabled={!outputCode || !metrics} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1"/>
                    Compare
                  </button>
                )}
            </div>
          </div>
          <textarea
            value={conversionMode === 'encode' ? getDisplayCode() : outputCode}
            readOnly
            className="flex-grow w-full bg-gray-900/70 text-cyan-300 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 text-sm"
            placeholder={conversionMode === 'encode' ? "Converted CUBE script will appear here..." : "Decoded code will appear here..."}
          />
           {metrics && conversionMode === 'encode' && <MetricsDisplay metrics={metrics} />}
           
           {/* Hex Aliases Panel */}
           {hexAliases.length > 0 && outputMode === 'script' && conversionMode === 'encode' && (
             <div className="mt-4 bg-gray-900/50 rounded-md p-3 border border-gray-700/50 overflow-y-auto max-h-32">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hex Alias Promotion ◈ Claims 3, 7</h3>
                 <span className="text-xs text-blue-400">K* Semantic Compression Active ◈ Claim 15</span>
               </div>
               <ul className="space-y-1">
                 {hexAliases.map((alias, idx) => (
                   <li key={idx} className="text-xs font-mono flex items-start">
                     <span className="text-purple-400 font-bold mr-2">{alias.hex}</span>
                     <span className="text-gray-500 mr-2">→</span>
                     <span className="text-gray-300 break-all">{alias.command}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="flex-shrink-0">
         {error && <div className="text-center text-red-400 mb-2 text-sm">{error}</div>}
         <button
          onClick={handleConvert}
          disabled={isConverting || !inputCode.trim()}
          className="w-full flex items-center justify-center p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isConverting ? (
            <>
              <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
              {conversionMode === 'encode' ? 'Converting...' : 'Decoding...'}
            </>
          ) : (
            <>
              <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
              {conversionMode === 'encode' ? 'Convert to CUBE' : 'Decode to Python/MATLAB'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
