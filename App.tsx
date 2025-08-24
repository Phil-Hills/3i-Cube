
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Editor } from './components/Editor';
import { OutputLog } from './components/OutputLog';
import { StatusBar } from './components/StatusBar';
import { interpretCubeScript } from './services/geminiService';
import type { LogEntry, MicroscopeStatus, View, GalleryImage } from './types';
import { METHOD_SCRIPTS } from './constants';
import { AboutModal } from './components/AboutModal';
import { DocsModal } from './components/DocsModal';
import { ViewSwitcher } from './components/ViewSwitcher';
import { ConverterView } from './components/ConverterView';
import { MicroscopyImageGenerator } from './services/imageGenerator';
import { ImagePreview } from './components/ImagePreview';
import { ImageModal } from './components/ImageModal';
import { GalleryView } from './components/GalleryView';
import * as galleryService from './services/galleryService';

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
  const [view, setView] = useState<View>('converter');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{imageUrl: string; cubeScript: string; id?: number} | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  
  useEffect(() => {
    const loadImages = async () => {
      const images = await galleryService.getImages();
      setGalleryImages(images);
    };
    loadImages();
  }, []);

  const handleExecute = useCallback(async () => {
    if (isExecuting || !cubeScript.trim()) return;

    setIsExecuting(true);
    setMicroscopeStatus('EXECUTING');
    setLogEntries([]);
    
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
      
      if (!imageGeneratedInLog && /CAPTURE|IMAGE|ACQUIRE|PROCESS/i.test(cubeScript)) {
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

  const handleOpenImageModal = (image: {imageUrl: string; cubeScript: string; id?: number}) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleSaveToGallery = async () => {
    if (simulatedImageUrl) {
        await galleryService.saveImage(simulatedImageUrl, cubeScript);
        const images = await galleryService.getImages();
        setGalleryImages(images);
    }
  };
  
  const handleDeleteFromGallery = async (id: number) => {
    await galleryService.deleteImage(id);
    const images = await galleryService.getImages();
    setGalleryImages(images);
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };
  
  const renderView = () => {
    switch(view) {
      case 'executor':
        return (
           <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 overflow-hidden">
            <div className="md:col-span-3 flex flex-col gap-6 overflow-y-auto">
              <CommandPalette onSelectScript={selectScript} />
            </div>
            <div className="md:col-span-5 flex flex-col gap-6 overflow-hidden">
              <Editor
                script={cubeScript}
                onScriptChange={setCubeScript}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-6 overflow-hidden">
              <div className="row-span-1 overflow-hidden">
                <ImagePreview 
                  imageUrl={simulatedImageUrl} 
                  onImageClick={() => simulatedImageUrl && handleOpenImageModal({imageUrl: simulatedImageUrl, cubeScript})}
                  onSaveClick={handleSaveToGallery}
                />
              </div>
              <div className="row-span-1 overflow-hidden">
                <OutputLog logEntries={logEntries} />
              </div>
            </div>
          </div>
        );
      case 'converter':
        return <ConverterView />;
      case 'gallery':
        return <GalleryView images={galleryImages} onImageSelect={handleOpenImageModal} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-200 font-sans">
      <Header 
        onAboutClick={() => setIsAboutModalOpen(true)}
        onDocsClick={() => setIsDocsModalOpen(true)}
      />
      
      <main className="flex-grow flex flex-col p-4 sm:p-6 overflow-hidden">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        {renderView()}
      </main>
      
      <StatusBar status={microscopeStatus} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isDocsModalOpen && <DocsModal onClose={() => setIsDocsModalOpen(false)} />}
      {isImageModalOpen && selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setIsImageModalOpen(false)}
          onDelete={handleDeleteFromGallery}
        />
      )}
    </div>
  );
};

export default App;