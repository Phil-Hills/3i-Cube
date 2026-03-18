
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Editor } from './components/Editor';
import { OutputLog } from './components/OutputLog';
import { StatusBar } from './components/StatusBar';
import { interpretCubeScript } from './services/geminiService';
import type { LogEntry, MicroscopeStatus } from './types';
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


const App: React.FC = () => {
  const imageGenerator = useMemo(() => new MicroscopyImageGenerator(), []);

  const initialScript = getInitialScript();
  const [cubeScript, setCubeScript] = useState<string>(initialScript);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
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
  const [view, setView] = useState<'executor' | 'converter'>('executor');


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

      for (const log of generatedLogs) {
        await new Promise(resolve => setTimeout(resolve, 75));

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
      />
      
      <main className="flex-grow flex flex-col p-4 overflow-hidden">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        {view === 'executor' ? (
           <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 overflow-hidden">
            <div className="md:col-span-3 flex flex-col gap-4 overflow-y-auto">
              <CommandPalette onSelectScript={selectScript} />
            </div>
            <div className="md:col-span-5 flex flex-col gap-4 overflow-hidden">
              <Editor
                script={cubeScript}
                onScriptChange={setCubeScript}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-4 overflow-hidden">
              <div className="row-span-1 overflow-hidden">
                <ImagePreview imageUrl={simulatedImageUrl} />
              </div>
              <div className="row-span-1 overflow-hidden">
                <OutputLog logEntries={logEntries} />
              </div>
            </div>
          </div>
        ) : (
          <ConverterView />
        )}
      </main>
      
      <StatusBar status={microscopeStatus} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isDocsModalOpen && <DocsModal onClose={() => setIsDocsModalOpen(false)} />}
    </div>
  );
};

export default App;
