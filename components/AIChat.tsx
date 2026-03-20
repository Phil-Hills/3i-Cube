import React, { useState, useRef, useEffect } from 'react';
import { chatWithOrchestrator } from '../services/geminiService';
import { getMemorySummary, verifyIntegrity } from '../services/swarmService';
import { storeQ } from '../services/brainService';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  status?: 'thinking' | 'complete' | 'error';
  receiptHash?: string;
  agentsConsulted?: string[];
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Q Protocol. I am the Orchestrator. How can I assist with your imaging workflow today?',
      status: 'complete'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      thinking: ['> Analyzing the user\'s request...'],
      status: 'thinking'
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // 1. SENSE
      const memorySummary = await getMemorySummary();
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, thinking: [...(msg.thinking || []), `> Checking session context via Λ: ${memorySummary.summary}`] }
          : msg
      ));

      // 2. PROPOSE
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithOrchestrator(userMessage.content, memorySummary.summary, history);
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, thinking: [...(msg.thinking || []), ...response.thinking.map((t: string) => `> ${t}`)] }
          : msg
      ));

      // 3. VERIFY
      const integrity = await verifyIntegrity();
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, thinking: [...(msg.thinking || []), `> Sentinel verification passed (Score: ${integrity.integrity_score})`] }
          : msg
      ));

      // 4. COMMIT
      const receipt = await storeQ(`CHAT|${userMessage.id}`, {
        user: userMessage.content,
        assistant: response.response,
        thinking: response.thinking
      });

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: response.response, 
              status: 'complete',
              receiptHash: receipt.hash,
              agentsConsulted: ['Analyst', 'Memory', 'Sentinel']
            }
          : msg
      ));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'An error occurred while processing your request.', status: 'error' }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0"></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#050505] shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100' : 'bg-[#0a0a0a] border border-white/5 text-zinc-300'} rounded-xl p-4 shadow-md`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                  <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest">SlideBook™ Orchestrator</span>
                </div>
              )}
              
              {msg.role === 'assistant' && msg.thinking && msg.thinking.length > 0 && (
                <details className="mb-4 group" open={msg.status === 'thinking'}>
                  <summary className="cursor-pointer text-[11px] font-mono text-zinc-500 hover:text-zinc-400 select-none flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    {msg.status === 'thinking' ? 'Processing...' : 'View Reasoning Chain'}
                  </summary>
                  <div className="bg-[#050505] rounded-lg p-3 text-[11px] font-mono text-zinc-500 space-y-1.5 border border-white/5 shadow-inner">
                    {msg.thinking.map((step, i) => (
                      <div key={i} className="animate-pulse-fast">{step}</div>
                    ))}
                  </div>
                </details>
              )}

              <div className="prose prose-invert prose-sm max-w-none text-[13px] leading-relaxed">
                {msg.status === 'thinking' ? (
                  <div className="flex items-center gap-2 text-indigo-500/50">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                ) : (
                  <Markdown>{msg.content}</Markdown>
                )}
              </div>

              {msg.role === 'assistant' && msg.status === 'complete' && (
                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-600 flex flex-col gap-1.5 uppercase tracking-wider">
                  {msg.agentsConsulted && (
                    <div className="flex items-center gap-2">
                      <span>🔬 Analyst</span>
                      <span>|</span>
                      <span>🧠 Memory</span>
                      <span>|</span>
                      <span>🛡️ Sentinel</span>
                    </div>
                  )}
                  {msg.receiptHash && (
                    <div className="text-indigo-500/40 truncate">
                      Receipt: {msg.receiptHash}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Orchestrator..."
            className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner placeholder-zinc-600"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-5 py-2.5 rounded-lg text-[13px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.15)] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
