
import React, { useState } from 'react';
import { convertCodeToCube } from '../services/geminiService';
import { EXAMPLE_PYTHON_CODE } from '../constants';
import type { ConversionMetrics } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, CubeIcon } from './icons';

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

  const handleLoadExample = () => {
    setInputCode(EXAMPLE_PYTHON_CODE);
    setOutputCode('');
    setMetrics(null);
    setError(null);
  };

  return (
    <div className="flex flex-col flex-grow pt-4 overflow-hidden gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        {/* Input Panel */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
          <div className="flex items-center mb-4">
            <CodeBracketIcon className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-100">Your 3i Python Code</h2>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-grow w-full bg-gray-900/70 text-gray-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 text-sm"
            placeholder="Paste your Python microscope code here..."
          />
           <button
                onClick={handleLoadExample}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
                Load Example Code
            </button>
        </div>
        
        {/* Output Panel */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col h-full border border-gray-700/50">
          <div className="flex items-center mb-4">
            <CubeIcon className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-100">CUBE Protocol Output</h2>
          </div>
          <textarea
            value={outputCode}
            readOnly
            className="flex-grow w-full bg-gray-900/70 text-cyan-300 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 text-sm"
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
          className="w-full flex items-center justify-center p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
