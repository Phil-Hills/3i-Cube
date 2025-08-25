import React, { useState } from 'react';
import { generateCubeFromNaturalLanguage, convertCodeToCube } from '../services/geminiService';
import { CONVERTER_EXAMPLES, NATURAL_LANGUAGE_EXAMPLES } from '../constants';
import type { ConversionMetrics } from '../types';
import { CodeBracketIcon, LoaderIcon, SwitchHorizontalIcon, CubeIcon, ClipboardIcon, ShareIcon, ChatBubbleBottomCenterTextIcon } from './icons';

type ConverterMode = 'code' | 'text';

const MetricsDisplay: React.FC<{ metrics: ConversionMetrics, mode: ConverterMode }> = ({ metrics, mode }) => {
  const originalLinesLabel = mode === 'code' ? 'Original Lines' : 'Est. Lines Saved';

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center animate-fade-in">
      <div className="bg-slate-800/50 p-3 rounded-lg">
        <p className="text-xs text-slate-400">{originalLinesLabel}</p>
        <p className="text-lg font-bold text-cyan-400">{metrics.original_lines}</p>
      </div>
      <div className="bg-slate-800/50 p-3 rounded-lg">
        <p className="text-xs text-slate-400">CUBE Lines</p>
        <p className="text-lg font-bold text-green-400">{metrics.cube_lines}</p>
      </div>
      <div className="bg-slate-800/50 p-3 rounded-lg">
        <p className="text-xs text-slate-400">Time Saved (est.)</p>
        <p className="text-lg font-bold text-slate-100">{metrics.time_saved_minutes} min</p>
      </div>
      {mode === 'code' && metrics.savings_percent > 0 && (
          <div className="bg-green-900/20 p-3 rounded-lg border border-green-800/50">
            <p className="text-xs text-green-300">Code Reduction</p>
            <p className="text-lg font-bold text-green-400">{metrics.savings_percent}%</p>
          </div>
      )}
    </div>
  );
};


export const ConverterView: React.FC = () => {
  const [mode, setMode] = useState<ConverterMode>('code');
  const [input, setInput] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
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

    try {
      const result = mode === 'code'
        ? await convertCodeToCube(input)
        : await generateCubeFromNaturalLanguage(input);
      
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
    });
  };
  
  const handleShare = () => {
    if (!outputCode || !metrics) return;
    const textToShare = mode === 'code' 
        ? `I compressed ${metrics.original_lines} lines of code to ${metrics.cube_lines} lines with CUBE Protocol!\n\n${outputCode}`
        : `I generated this CUBE script from natural language, replacing an estimated ${metrics.original_lines} lines of code!\n\n${outputCode}`;
    navigator.clipboard.writeText(textToShare).then(() => {
        setShareSuccess('Shared!');
        setTimeout(() => setShareSuccess(''), 2000);
    });
  };

  const currentExamples = mode === 'code' ? CONVERTER_EXAMPLES : NATURAL_LANGUAGE_EXAMPLES;
  const InputIcon = mode === 'code' ? CodeBracketIcon : ChatBubbleBottomCenterTextIcon;
  const inputTitle = mode === 'code' ? 'Input Code' : 'Input Natural Language';
  const placeholderText = mode === 'code' ? 'Place code or text here...' : 'Describe the experiment you want to run...';

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
            <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg border border-white/10 w-1/2">
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
                  if (example) setInput('code' in example ? example.code : example.prompt);
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
              <h2 className="text-lg font-semibold text-slate-100">CUBE Protocol</h2>
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
          <div className="flex-grow w-full bg-black/50 text-cyan-300 font-mono p-3 rounded-md border-2 border-cyan-500/50 shadow-inner shadow-black/50 overflow-auto">
             <pre><code className="text-sm">{outputCode}</code></pre>
          </div>
           {metrics && <MetricsDisplay metrics={metrics} mode={mode} />}
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
              {mode === 'code' ? 'Analyzing & Converting...' : 'Generating CUBE Script...'}
            </>
          ) : (
            <>
              <SwitchHorizontalIcon className="w-6 h-6 mr-3" />
              Convert to CUBE
            </>
          )}
        </button>
      </div>
    </div>
  );
};
