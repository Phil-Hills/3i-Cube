import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons';
import { runFullSystemCheck, SystemCheckResult } from '../services/swarmService';

interface SystemCheckModalProps {
  onClose: () => void;
}

export const SystemCheckModal: React.FC<SystemCheckModalProps> = ({ onClose }) => {
  const [result, setResult] = useState<SystemCheckResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runCheck = async () => {
      setLoading(true);
      try {
        const res = await runFullSystemCheck();
        setResult(res);
      } catch (e) {
        console.error("System check failed", e);
      } finally {
        setLoading(false);
      }
    };
    runCheck();
  }, []);

  const allPassed = result?.analyst.passed && result?.memory.passed && result?.sentinel.passed;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg max-w-2xl w-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center">
            <svg className="w-6 h-6 text-sky-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            SlideBook™ System Check
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 font-mono text-sm space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-sky-400">
              <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running full swarm diagnostic...</span>
            </div>
          ) : result ? (
            <>
              <div className="flex items-center justify-center mb-6">
                {allPassed ? (
                  <div className="flex items-center text-emerald-400 text-lg font-bold">
                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ALL SYSTEMS NOMINAL
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-lg font-bold">
                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    SYSTEM CHECK FAILED
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-[#050505] p-4 rounded border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sky-400 font-bold">Analyst Agent</span>
                    <span className={result.analyst.passed ? "text-emerald-400" : "text-red-400"}>
                      {result.analyst.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                  <div className="text-zinc-400">{result.analyst.message}</div>
                </div>

                <div className="bg-[#050505] p-4 rounded border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sky-400 font-bold">Memory Agent</span>
                    <span className={result.memory.passed ? "text-emerald-400" : "text-red-400"}>
                      {result.memory.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                  <div className="text-zinc-400">{result.memory.message}</div>
                </div>

                <div className="bg-[#050505] p-4 rounded border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sky-400 font-bold">Sentinel Agent</span>
                    <span className={result.sentinel.passed ? "text-emerald-400" : "text-red-400"}>
                      {result.sentinel.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                  <div className="text-zinc-400">{result.sentinel.message}</div>
                  {result.sentinel.integrity_score && (
                    <div className="text-zinc-500 mt-1">Integrity Score: {(result.sentinel.integrity_score * 100).toFixed(1)}%</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-400 text-center">Failed to load system check results.</div>
          )}
        </div>
      </div>
    </div>
  );
};
