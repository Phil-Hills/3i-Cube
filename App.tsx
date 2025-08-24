
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Editor } from './components/Editor';
import { OutputLog } from './components/OutputLog';
import { StatusBar } from './components/StatusBar';
import { interpretCubeScript } from './services/geminiService';
import type { LogEntry, MicroscopeStatus } from './types';
import { METHOD_SCRIPTS } from './constants';
import { AboutModal } from './components/AboutModal';
import { ViewSwitcher } from './components/ViewSwitcher';
import { ConverterView } from './components/ConverterView';


const App: React.FC = () => {
  const [cubeScript, setCubeScript] = useState<string>(METHOD_SCRIPTS[0].scripts[0].script);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [microscopeStatus, setMicroscopeStatus] = useState<MicroscopeStatus>('DISCONNECTED');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [view, setView] = useState<'executor' | 'converter'>('executor');


  const handleExecute = useCallback(async () => {
    if (isExecuting || !cubeScript.trim()) return;

    setIsExecuting(true);
    setMicroscopeStatus('EXECUTING');
    setLogEntries([]);
    setSimulatedImageUrl(null);

    try {
      const generatedLogs = await interpretCubeScript(cubeScript);
      
      let status: MicroscopeStatus = 'IDLE';
      if (cubeScript.includes('CONNECT|')) status = 'CONNECTED';

      for (let i = 0; i < generatedLogs.length; i++) {
        const log = generatedLogs[i];
        
        await new Promise(resolve => setTimeout(resolve, 75));

        if (log.includes('[IMAGE_GENERATED]')) {
            const cleanLog = log.replace('[IMAGE_GENERATED]', '').trim();
             if(cleanLog) {
                setLogEntries(prev => [...prev, { type: 'INFO', message: cleanLog, timestamp: new Date() }]);
             }
            setSimulatedImageUrl(`https://picsum.photos/512/512?random=${Date.now()}`);
        } else if (log.toLowerCase().includes('success') || log.toLowerCase().includes('complete')) {
            setLogEntries(prev => [...prev, { type: 'SUCCESS', message: log, timestamp: new Date() }]);
        } else if (log.toLowerCase().includes('error') || log.toLowerCase().includes('fail')) {
            setLogEntries(prev => [...prev, { type: 'ERROR', message: log, timestamp: new Date() }]);
        } else {
            setLogEntries(prev => [...prev, { type: 'INFO', message: log, timestamp: new Date() }]);
        }
      }

      setMicroscopeStatus(status);

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setLogEntries(prev => [...prev, { type: 'ERROR', message: `Gemini API Error: ${errorMessage}`, timestamp: new Date() }]);
      setMicroscopeStatus('ERROR');
    } finally {
      setIsExecuting(false);
    }
  }, [cubeScript, isExecuting]);

  const selectScript = (script: string) => {
    setCubeScript(script);
    setLogEntries([]);
    setSimulatedImageUrl(null);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onAboutClick={() => setIsAboutModalOpen(true)} />
      
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
            <div className="md:col-span-4 flex flex-col gap-4 overflow-hidden">
              <OutputLog logEntries={logEntries} imageUrl={simulatedImageUrl} />
            </div>
          </div>
        ) : (
          <ConverterView />
        )}
      </main>
      
      <StatusBar status={microscopeStatus} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
    </div>
  );
};

export default App;
