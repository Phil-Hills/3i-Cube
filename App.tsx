
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Editor } from './components/Editor';
import { OutputLog } from './components/OutputLog';
import { StatusBar } from './components/StatusBar';
import { interpretCubeScript } from './services/geminiService';
import { ReceiptChain } from './components/ReceiptChain';
import type { LogEntry, MicroscopeStatus, Receipt } from './types';
import { METHOD_SCRIPTS } from './constants';
import { AboutModal } from './components/AboutModal';
import { DocsModal } from './components/DocsModal';
import { ViewSwitcher } from './components/ViewSwitcher';
import { ConverterView } from './components/ConverterView';
import { MicroscopyImageGenerator } from './services/imageGenerator';
import { ImagePreview } from './components/ImagePreview';

const getInitialScript = (): string => {
  if (
    METHOD_SCRIPTS &&
    METHOD_SCRIPTS.length > 0 &&
    METHOD_SCRIPTS[0].scripts &&
    METHOD_SCRIPTS[0].scripts.length > 0
  ) {
    return METHOD_SCRIPTS[0].scripts[0].script;
  }
  return '';
};


import { LiveMetricsPanel } from './components/LiveMetricsPanel';
import { AIChat } from './components/AIChat';
import { MemoryGraph } from './components/MemoryGraph';
import { SpatialVisualizer } from './components/SpatialVisualizer';
import { storeCube, getCubes, getSessionTraceId } from './services/brainService';

import { SystemCheckModal } from './components/SystemCheckModal';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const imageGenerator = useMemo(() => new MicroscopyImageGenerator(), []);

  const initialScript = getInitialScript();
  const [cubeScript, setCubeScript] = useState<string>(initialScript);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [duplicatesSkipped, setDuplicatesSkipped] = useState(0);
  const receiptsRef = useRef<Receipt[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [microscopeStatus, setMicroscopeStatus] = useState<MicroscopeStatus>('DISCONNECTED');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(() => {
    if (!initialScript) return null;
    try {
      return imageGenerator.generateFromCube(initialScript);
    } catch (e) {
      console.error("Failed to generate initial image:", e);
      return null;
    }
  });
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isSystemCheckModalOpen, setIsSystemCheckModalOpen] = useState(false);
  const [view, setView] = useState<'executor' | 'converter' | 'memory' | 'chat'>('executor');
  
  const [lastCommand, setLastCommand] = useState<string>('');


  const handleExecute = useCallback(async () => {
    if (isExecuting || !cubeScript.trim()) return;

    setIsExecuting(true);
    setMicroscopeStatus('EXECUTING');
    setLogEntries([]);
    // Keep the existing preview image during execution for better UX

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: cubeScript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      const output = data.stdout + (data.stderr ? '\n' + data.stderr : '');
      const lines = output.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Add a small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 20));
        
        if (line.includes('Error') || line.includes('Exception') || line.includes('Traceback')) {
          setLogEntries(prev => [...prev, { type: 'ERROR', message: line, timestamp: new Date() }]);
        } else if (line.includes('✓') || line.includes('Success') || line.includes('Saved')) {
          setLogEntries(prev => [...prev, { type: 'SUCCESS', message: line, timestamp: new Date() }]);
        } else {
          setLogEntries(prev => [...prev, { type: 'INFO', message: line, timestamp: new Date() }]);
        }
        
        // If we see a BLAKE3 receipt, we could potentially parse it and add it to the receipts list
        // For now, we just log it.
        if (line.includes('◈') && line.includes('[')) {
           const match = line.match(/\[([a-f0-9]{16})\]/);
           if (match) {
             const hash = match[1];
             let coord = line.trim().replace(/^◈\s*/, '');
             coord = coord.replace(/\s*\[[a-f0-9]{16}\]$/, '');
             const newReceipt = { 
                timestamp: new Date(), 
                coordinate: coord, 
                hash: hash, 
                verified: true, 
                isDuplicate: false,
                packetAuth: {
                  seq: Math.floor(Math.random() * 10000),
                  signature: `Q-SIG-${Math.floor(Math.random() * 10000).toString(16).toUpperCase().padStart(4, '0')}`
                }
              };
              setReceipts(prev => [...prev, newReceipt]);
              receiptsRef.current.push(newReceipt);
           }
        }
      }

      setMicroscopeStatus('IDLE');

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setLogEntries(prev => [...prev, { type: 'ERROR', message: `Execution Error: ${errorMessage}`, timestamp: new Date() }]);
      setMicroscopeStatus('ERROR');
    } finally {
      setIsExecuting(false);
    }
  }, [cubeScript, isExecuting]);

  const selectScript = (script: string) => {
    setCubeScript(script);
    setLogEntries([]);
    const imageUrl = imageGenerator.generateFromCube(script);
    setSimulatedImageUrl(imageUrl);
  };
  
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header 
        onAboutClick={() => setIsAboutModalOpen(true)}
        onDocsClick={() => setIsDocsModalOpen(true)}
        onSystemCheckClick={() => setIsSystemCheckModalOpen(true)}
      />
      
      <main className="flex-grow flex flex-col p-4 overflow-hidden">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        {view === 'executor' ? (
           <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 overflow-hidden">
            <div className="md:col-span-3 flex flex-col gap-4 overflow-y-auto">
              <CommandPalette onSelectScript={selectScript} />
              <LiveMetricsPanel duplicatesSkipped={duplicatesSkipped} refreshTrigger={receipts.length} />
              {lastCommand && <SpatialVisualizer command={lastCommand} />}
            </div>
            <div className="md:col-span-5 flex flex-col gap-4 overflow-hidden">
              <Editor
                script={cubeScript}
                onScriptChange={setCubeScript}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div className="md:col-span-4 grid grid-rows-3 gap-4 overflow-hidden">
              <div className="row-span-1 overflow-hidden">
                <ImagePreview imageUrl={simulatedImageUrl} />
              </div>
              <div className="row-span-1 overflow-hidden">
                <OutputLog logEntries={logEntries} />
              </div>
              <div className="row-span-1 overflow-hidden">
                <ReceiptChain receipts={receipts} duplicatesSkipped={duplicatesSkipped} />
              </div>
            </div>
          </div>
        ) : view === 'converter' ? (
          <ConverterView />
        ) : view === 'chat' ? (
          <div className="flex-grow pt-4 overflow-hidden">
            <AIChat />
          </div>
        ) : (
          <div className="flex-grow pt-4 overflow-hidden">
            <MemoryGraph refreshTrigger={receipts.length} />
          </div>
        )}
      </main>
      
      <StatusBar status={microscopeStatus} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isDocsModalOpen && <DocsModal onClose={() => setIsDocsModalOpen(false)} />}
      {isSystemCheckModalOpen && <SystemCheckModal onClose={() => setIsSystemCheckModalOpen(false)} />}
    </div>
  );
};

export default App;
