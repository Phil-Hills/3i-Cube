
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
import { AgentBuilder } from './components/AgentBuilder';
import { MemoryGraph } from './components/MemoryGraph';
import { SpatialVisualizer } from './components/SpatialVisualizer';
import { storeCube, getCubes, getSessionTraceId } from './services/brainService';

import { SystemCheckModal } from './components/SystemCheckModal';

const App: React.FC = () => {
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
  const [view, setView] = useState<'executor' | 'converter' | 'memory' | 'builder'>('executor');
  
  const [lastCommand, setLastCommand] = useState<string>('');


  const handleExecute = useCallback(async () => {
    if (isExecuting || !cubeScript.trim()) return;

    setIsExecuting(true);
    setMicroscopeStatus('EXECUTING');
    setLogEntries([]);
    // Keep the existing preview image during execution for better UX

    try {
      const generatedLogs = await interpretCubeScript(cubeScript);
      
      let status: MicroscopeStatus = 'IDLE';
      if (cubeScript.includes('CONNECT|')) status = 'CONNECTED';
      let imageGeneratedInLog = false;
      let skipCurrentCommand = false;

      for (const log of generatedLogs) {
        await new Promise(resolve => setTimeout(resolve, 75));

        if (log.startsWith('Executing CUBE: ')) {
          const command = log.replace('Executing CUBE: ', '');
          const traceId = getSessionTraceId();
          
          // Check Brain for existing receipt with same coordinate + trace_id
          const existingCubes = await getCubes(1, command, traceId);
          const isDuplicate = existingCubes.length > 0;
          
          if (isDuplicate) {
            const existingHash = existingCubes[0].hash;
            const displayHash = existingHash.slice(0, 16) + '...';
            setLogEntries(prev => [...prev, { type: 'INFO', message: `[⟳] ${command} — SKIPPED\n    Receipt already exists: ${displayHash}\n    Idempotent execution enforced. ◈ Claim 10`, timestamp: new Date() }]);
            setDuplicatesSkipped(prev => prev + 1);
            skipCurrentCommand = true;
          } else {
            // Store new cube in Brain
            const storedCube = await storeCube(command, { status: 'executed' });
            const realHash = storedCube.hash;
            const displayHash = realHash.slice(0, 16) + '...';
            
            setLogEntries(prev => [...prev, { type: 'SUCCESS', message: `[✓] ${command}\n    BLAKE3: ${displayHash}  · receipt stored · idempotent ✓`, timestamp: new Date() }]);
            const newReceipt = { 
              timestamp: new Date(), 
              coordinate: command, 
              hash: realHash, 
              verified: true, 
              isDuplicate: false,
              packetAuth: {
                seq: Math.floor(Math.random() * 10000),
                signature: `Q-SIG-${Math.floor(Math.random() * 10000).toString(16).toUpperCase().padStart(4, '0')}`
              }
            };
            setReceipts(prev => [...prev, newReceipt]);
            receiptsRef.current.push(newReceipt);
            skipCurrentCommand = false;
            setLastCommand(command);
          }
          continue;
        }

        if (skipCurrentCommand) {
          continue;
        }

        if (log.includes('[IMAGE_GENERATED]')) {
            imageGeneratedInLog = true;
            const newImageUrl = imageGenerator.generateFromCube(cubeScript);
            setSimulatedImageUrl(newImageUrl);
            const cleanLog = log.replace('[IMAGE_GENERATED]', '').trim();
             if(cleanLog) {
                setLogEntries(prev => [...prev, { type: 'INFO', message: cleanLog, timestamp: new Date() }]);
             }
        } else if (log.toLowerCase().includes('success') || log.toLowerCase().includes('complete')) {
            setLogEntries(prev => [...prev, { type: 'SUCCESS', message: log, timestamp: new Date() }]);
        } else if (log.toLowerCase().includes('error') || log.toLowerCase().includes('fail')) {
            setLogEntries(prev => [...prev, { type: 'ERROR', message: log, timestamp: new Date() }]);
        } else {
            setLogEntries(prev => [...prev, { type: 'INFO', message: log, timestamp: new Date() }]);
        }
      }
      
      // Fallback if simulator misses the token
      if (!imageGeneratedInLog && /CAPTURE|IMAGE|ACQUIRE/i.test(cubeScript)) {
          const newImageUrl = imageGenerator.generateFromCube(cubeScript);
          setSimulatedImageUrl(newImageUrl);
      }

      setMicroscopeStatus(status);

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setLogEntries(prev => [...prev, { type: 'ERROR', message: `API Error: ${errorMessage}`, timestamp: new Date() }]);
      setMicroscopeStatus('ERROR');
    } finally {
      setIsExecuting(false);
    }
  }, [cubeScript, isExecuting, imageGenerator]);

  const selectScript = (script: string) => {
    setCubeScript(script);
    setLogEntries([]);
    const imageUrl = imageGenerator.generateFromCube(script);
    setSimulatedImageUrl(imageUrl);
  };
  
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
        ) : view === 'builder' ? (
          <AgentBuilder />
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
