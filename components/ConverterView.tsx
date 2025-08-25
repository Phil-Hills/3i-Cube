import React, { useState } from 'react';
import { generateCubeFromNaturalLanguage, convertCodeToCube } from '../services/geminiService';
import { CODE_CONVERTER_EXAMPLES, NATURAL_LANGUAGE_EXAMPLES, DATA_COMPRESSION_EXAMPLES } from '../constants';
import type { ConversionMetrics, ConverterMode } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, CubeIcon, ClipboardIcon, ShareIcon, ChatBubbleBottomCenterTextIcon, CircleStackIcon } from './icons';
import { Remarkable } from 'remarkable';

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const MetricsDisplay: React.FC<{ metrics: ConversionMetrics | null }> = ({ metrics }) => {
  if (!metrics) return null;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center animate-fade-in">
      {metrics.original_lines !== undefined && (
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400">{metrics.original_size_bytes === undefined ? 'Original Lines' : 'Est. Lines Saved'}</p>
          <p className="text-lg font-bold text-cyan-400">{metrics.original_lines}</p>
        </div>
      )}
      {metrics.cube_lines !== undefined && (
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400">CUBE Lines</p>
          <p className="text-lg font-bold text-green-400">{metrics.cube_lines}</p>
        </div>
      )}
      {metrics.original_size_bytes !== undefined && (
         <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400">Original Size</p>
          <p className="text-lg font-bold text-cyan-400">{formatBytes(metrics.original_size_bytes)}</p>
        </div>
      )}
       {metrics.compressed_size_bytes !== undefined && (
         <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400">Compressed Size</p>
          <p className="text-lg font-bold text-green-400">{formatBytes(metrics.compressed_size_bytes)}</p>
        </div>
      )}
       <div className="bg-slate-800/50 p-3 rounded-lg">
        <p className="text-xs text-slate-400">Compression Ratio</p>
        <p className="text-lg font-bold text-slate-100">{metrics.compression_ratio}</p>
      </div>
      {(metrics.savings_percent !== undefined && metrics.savings_percent > 0) && (
          <div className="bg-green-900/20 p-3 rounded-lg border border-green-800/50">
            <p className="text-xs text-green-300">Code Reduction</p>
            <p className="text-lg font-bold text-green-400">{metrics.savings_percent}%</p>
          </div>
      )}
       {(metrics.original_size_bytes !== undefined && metrics.compressed_size_bytes !== undefined) && (
         <div className="bg-green-900/20 p-3 rounded-lg border border-green-800/50">
            <p className="text-xs text-green-300">Size Reduction</p>
            <p className="text-lg font-bold text-green-400">{(((metrics.original_size_bytes - metrics.compressed_size_bytes) / metrics.original_size_bytes) * 100).toFixed(1)}%</p>
          </div>
       )}
    </div>
  );
};


export const ConverterView: React.FC = () => {
  const [mode, setMode] = useState<ConverterMode>('data');
  const [input, setInput] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [outputCubeCells, setOutputCubeCells] = useState<string[] | null>(null);
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const [selectedExample, setSelectedExample] = useState('');

  const handleModeChange = (newMode: ConverterMode) => {
    setMode(newMode);
    setInput('');
    setOutputCode('');
    setOutputCubeCells(null);
    setMetrics(null);
    setError(null);
    setSelectedExample('');
  };

  const handleConvert = async () => {
    if (!input.trim() || isConverting) return;
    
    setIsConverting(true);
    setError(null);
    setMetrics(null);
    setOutputCode('');
    setOutputCubeCells(null);

    try {
      if (mode === 'data') {
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(input);
        const original_size_bytes = dataBytes.length;

        const stream = new Blob([dataBytes], { type: 'text/plain' }).stream();
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        const compressedBuffer = await new Response(compressedStream).arrayBuffer();
        const compressed_size_bytes = compressedBuffer.byteLength;
        
        const base64String = arrayBufferToBase64(compressedBuffer);
        
        const totalCells = 27;
        const chunkSize = Math.ceil(base64String.length / totalCells);
        const cells = Array.from({ length: totalCells }, (_, i) => 
            base64String.substring(i * chunkSize, (i + 1) * chunkSize)
        ).filter(cell => cell.length > 0);

        setOutputCubeCells(cells);
        setOutputCode(`COMPRESS|DATA[${(original_size_bytes/1024).toFixed(1)}KB]→GZIP→BASE64→CUBE[3x3x3]|STORED`);
        setMetrics({
            original_size_bytes,
            compressed_size_bytes,
            compression_ratio: `${(original_size_bytes / compressed_size_bytes).toFixed(1)}:1`,
            time_saved_minutes: Math.round(original_size_bytes / 1024 * 0.1) // Dummy time saved
        });
      } else {
        const result = mode === 'code'
          ? await convertCodeToCube(input)
          : await generateCubeFromNaturalLanguage(input);
        
        setOutputCode(result.cube_code);
        setMetrics(result.metrics);
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
    let textToCopy = outputCode;
    if (mode === 'data' && outputCubeCells) {
        textToCopy += `\n\n--- CUBE DATA ---\n${outputCubeCells.join('')}`;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };
  
  const handleShare = () => {
     if (!outputCode || !metrics) return;
    let textToShare = '';
    if (mode === 'code' && metrics.original_lines && metrics.cube_lines) {
        textToShare = `I compressed ${metrics.original_lines} lines of code to ${metrics.cube_lines} lines with CUBE Protocol!\n\n${outputCode}`;
    } else if (mode === 'text' && metrics.original_lines) {
        textToShare = `I generated this CUBE script from natural language, replacing an estimated ${metrics.original_lines} lines of code!\n\n${outputCode}`;
    } else if (mode === 'data' && metrics.original_size_bytes && metrics.compressed_size_bytes) {
        textToShare = `I compressed ${metrics.original_size_bytes} bytes down to ${metrics.compressed_size_bytes} bytes (${metrics.compression_ratio} ratio) using the CUBE String-Cube protocol!\n\n${outputCode}`;
    }
    
    if(textToShare) {
        navigator.clipboard.writeText(textToShare).then(() => {
            setShareSuccess('Shared!');
            setTimeout(() => setShareSuccess(''), 2000);
        });
    }
  };

  const currentExamples = mode === 'code' ? CODE_CONVERTER_EXAMPLES : mode === 'text' ? NATURAL_LANGUAGE_EXAMPLES : DATA_COMPRESSION_EXAMPLES;
  const InputIcon = mode === 'code' ? CodeBracketIcon : mode === 'text' ? ChatBubbleBottomCenterTextIcon : CircleStackIcon;
  const inputTitle = mode === 'code' ? 'Input Code' : mode === 'text' ? 'Input Natural Language' : 'Input Data';
  const placeholderText = mode === 'code' ? 'Place code to convert here...' : mode === 'text' ? 'Describe the experiment you want to run...' : 'Paste any text data (HTML, JSON, etc.) to compress...';

  const ModeButton: React.FC<{
    buttonMode: ConverterMode;
    Icon: React.FC<{className?: string}>;
    children: React.ReactNode;
  }> = ({ buttonMode, Icon, children }) => {
    const isActive = mode === buttonMode;
    return (
        <button
            onClick={() => handleModeChange(buttonMode)}
            className={`flex-1 flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-cyan-600/50 text-white' : 'text-slate-300 hover:bg-white/10'
            }`}
        >
            <Icon className="w-5 h-5 mr-2" />
            {children}
        </button>
    );
  };

  return (
    <div className="flex flex-col flex-grow pt-6 overflow-hidden gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow overflow-hidden">
        {/* Input Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <InputIcon className="w-6 h-6 text-cyan-400 mr-2" />
                <h2 className="text-lg font-semibold text-slate-100">{inputTitle}</h2>
            </div>
            <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg border border-white/10 w-auto">
                <ModeButton buttonMode="data" Icon={CircleStackIcon}>From Data</ModeButton>
                <ModeButton buttonMode="code" Icon={CodeBracketIcon}>From Code</ModeButton>
                <ModeButton buttonMode="text" Icon={ChatBubbleBottomCenterTextIcon}>From Text</ModeButton>
            </div>
          </div>
           <select
                value={selectedExample}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSelectedExample(selectedName);
                  const example = currentExamples.find(ex => ex.name === selectedName);
                  if (example) {
                    if ('code' in example) setInput(example.code);
                    else if ('prompt' in example) setInput(example.prompt);
                    else if ('data' in example) setInput(example.data);
                  }
                }}
                className="mb-2 bg-slate-800/50 text-sm text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
              >
                <option value="" disabled>Load an Example...</option>
                {currentExamples.map(example => (
                  <option key={example.name} value={example.name}>{example.name}</option>
                ))}
              </select>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow w-full bg-slate-900 text-slate-200 font-mono p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none border border-white/10 text-sm"
            placeholder={placeholderText}
          />
        </div>
        
        {/* Output Panel */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CubeIcon className="w-6 h-6 text-cyan-400 mr-2" />
              <h2 className="text-lg font-semibold text-slate-100">CUBE Protocol Output</h2>
            </div>
             <div className="flex items-center space-x-1">
                <button onClick={handleCopy} title="Copy" disabled={!outputCode} className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors text-sm flex items-center">
                  <ClipboardIcon className="w-4 h-4 mr-1"/>
                  {copySuccess || ''}
                </button>
                 <button onClick={handleShare} title="Share" disabled={!outputCode || !metrics} className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors text-sm flex items-center">
                  <ShareIcon className="w-4 h-4 mr-1"/>
                   {shareSuccess || ''}
                </button>
            </div>
          </div>
          <div className="flex-grow w-full bg-black/50 p-3 rounded-md border-2 border-cyan-500/50 shadow-inner shadow-black/50 overflow-auto">
            {mode === 'data' && outputCubeCells ? (
                <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Semantic Command:</h3>
                    <pre><code className="text-sm text-cyan-300 font-mono">{outputCode}</code></pre>
                    <h3 className="text-sm font-semibold text-slate-300 mt-4 mb-2">String-Cube Data (3x3x3):</h3>
                    <div className="grid grid-cols-3 gap-1">
                        {outputCubeCells.map((cell, index) => (
                            <pre key={index} className="text-xs text-slate-400 bg-slate-800/50 p-1 rounded-sm overflow-hidden text-ellipsis" title={`Cell ${index + 1}`}>
                                {cell || ' '}
                            </pre>
                        ))}
                    </div>
                </div>
            ) : (
                <pre><code className="text-sm text-cyan-300 font-mono">{outputCode}</code></pre>
            )}
          </div>
           <MetricsDisplay metrics={metrics} />
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-4">
         {error && <div className="text-center text-red-400 mb-2 text-sm p-2 bg-red-900/20 rounded-md border border-red-500/30">{error}</div>}
         <button
          onClick={handleConvert}
          disabled={isConverting || !input.trim()}
          className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl shadow-purple-500/20 transform hover:-translate-y-1"
        >
          {isConverting ? (
            <>
              <LoaderIcon className="animate-spin w-6 h-6 mr-3" />
              {mode === 'code' ? 'Analyzing Code...' : mode === 'text' ? 'Generating Script...' : 'Compressing Data...'}
            </>
          ) : (
            <>
              <SwitchHorizontalIcon className="w-6 h-6 mr-3" />
              {mode === 'data' ? 'Compress to String-Cube' : 'Convert to CUBE'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};