import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { XMarkIcon, CodeBracketIcon, ArrowDownTrayIcon, TrashIcon, SparklesIcon, PaperAirplaneIcon, LoaderIcon } from './icons';
import { analyzeMediaWithGemini } from '../services/geminiService';

interface ImageModalProps {
  media: { url: string; cubeScript: string; type: 'image' | 'video'; id?: number };
  onClose: () => void;
  onDelete?: (id: number) => void;
}

interface AnalysisMessage {
    role: 'user' | 'model';
    content: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ media, onClose, onDelete }) => {
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [analysisHistory]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `cube-${media.type}-${Date.now()}.${media.type === 'video' ? 'webm' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleAnalyze = useCallback(async () => {
    if (!analysisPrompt.trim() || isAnalyzing || media.type !== 'image') return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    const newHistory: AnalysisMessage[] = [...analysisHistory, { role: 'user', content: analysisPrompt }];
    setAnalysisHistory(newHistory);
    setAnalysisPrompt('');

    try {
        const response = await analyzeMediaWithGemini(media.url, analysisPrompt);
        setAnalysisHistory([...newHistory, { role: 'model', content: response }]);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setAnalysisError(errorMessage);
    } finally {
        setIsAnalyzing(false);
    }
  }, [analysisPrompt, isAnalyzing, media.url, media.type, analysisHistory]);

  const isFromGallery = media.id !== undefined && onDelete;
  const isVideo = media.type === 'video';

  return (
    <div className="image-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
        <div 
            className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-lg max-w-7xl w-full h-full max-h-[95vh] flex flex-col shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-2 pl-4 border-b border-white/10 flex-shrink-0">
                <h2 className="text-lg font-semibold text-slate-100">Media Viewer</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-colors" 
                    aria-label="Close"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 min-h-0">
                <section className="flex-grow flex items-center justify-center min-w-0 bg-black/30 rounded-lg shadow-inner">
                    {isVideo ? (
                        <video src={media.url} controls autoPlay loop className="image-modal-content" />
                    ) : (
                        <img src={media.url} alt="Full-size microscopy preview" className="image-modal-content" />
                    )}
                </section>
                
                <aside className="w-full md:w-96 lg:w-[420px] flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-gray-950/40 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center text-cyan-300 mb-2">
                            <CodeBracketIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            <h3 className="text-sm font-semibold">CUBE Script</h3>
                        </div>
                        <pre className="text-xs text-gray-300 font-mono bg-black/30 p-2 rounded max-h-40 overflow-y-auto">
                            <code>{media.cubeScript}</code>
                        </pre>
                        <div className="mt-3 flex items-center justify-end space-x-2">
                            {isFromGallery && (
                                <button
                                    onClick={() => onDelete(media.id!)}
                                    className="flex items-center text-sm px-3 py-1.5 rounded-md bg-red-800/40 text-red-300 hover:bg-red-800/60 transition-colors"
                                    title="Delete from Gallery"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1.5" />
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={handleDownload}
                                className="flex items-center text-sm px-3 py-1.5 rounded-md bg-cyan-800/40 text-cyan-200 hover:bg-cyan-800/60 transition-colors"
                                title="Download Media"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                                Download
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-950/40 border border-white/10 rounded-lg p-3 flex-grow flex flex-col min-h-0">
                         <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-cyan-300 flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                AI Media Analysis
                            </h3>
                            <button 
                                onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
                                disabled={isVideo}
                                title={isVideo ? 'Analysis is currently only available for images.' : 'Analyze with Gemini'}
                                className="text-xs px-2 py-1 rounded-md bg-white/5 text-cyan-300 hover:bg-cyan-400/10 disabled:text-gray-600 disabled:cursor-not-allowed disabled:bg-white/5 transition-colors"
                            >
                                {showAnalysisPanel ? 'Hide' : 'Analyze'}
                            </button>
                        </div>
                        {showAnalysisPanel && (
                            <div className="flex-grow flex flex-col min-h-0 animate-fade-in">
                                <div ref={chatHistoryRef} className="flex-grow space-y-3 p-2 overflow-y-auto bg-black/20 rounded-t-md">
                                    {analysisHistory.length === 0 && (
                                        <div className="text-center text-xs text-slate-400 h-full flex items-center justify-center">Ask a question about the image, e.g., "Count the nuclei."</div>
                                    )}
                                    {analysisHistory.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                                {msg.role === 'model' ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{msg.content}</ReactMarkdown> : msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isAnalyzing && (
                                         <div className="flex justify-start">
                                            <div className="max-w-[85%] p-2 rounded-lg text-sm bg-slate-700 text-slate-200 flex items-center">
                                                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                                <span>Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {analysisError && <div className="text-xs text-red-400 bg-red-900/30 p-2 mt-1 rounded-b-md">{analysisError}</div>}
                                <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="mt-2 flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={analysisPrompt}
                                        onChange={(e) => setAnalysisPrompt(e.target.value)}
                                        placeholder="Ask Gemini..."
                                        className="flex-grow bg-slate-800 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                                        disabled={isAnalyzing}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!analysisPrompt.trim() || isAnalyzing}
                                        className="p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5"/>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    </div>
  );
};
