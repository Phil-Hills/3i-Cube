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
import { XMarkIcon } from './components/icons';
import { DashboardView } from './components/DashboardView';
import { MLBuilderView } from './components/MLBuilderView';

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

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center px-4 py-3 rounded-lg shadow-2xl text-white z-[100] animate-fade-in";
  const typeClasses = {
    success: "bg-green-600/90 backdrop-blur-sm border border-green-500",
    error: "bg-red-600/90 backdrop-blur-sm border border-red-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-4 -mr-2 p-1 rounded-full hover:bg-white/20 transition-colors">
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const imageGenerator = useMemo(() => new MicroscopyImageGenerator(), []);

  const [cubeScript, setCubeScript] = useState<string>(getInitialScript());
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [microscopeStatus, setMicroscopeStatus] = useState<MicroscopeStatus>('DISCONNECTED');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{imageUrl: string; cubeScript: string; id?: number} | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await galleryService.getImages();
        setGalleryImages(images);
      } catch (error) {
        console.error("Failed to load gallery images:", error);
        const errorMessage = error instanceof Error ? error.message : 'Could not load images.';
        setToast({ message: `Gallery error: ${errorMessage}`, type: 'error' });
      }
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
      
      if (!imageGeneratedInLog && /CAPTURE|IMAGE|ACQUIRE|PROCESS|SEGMENT|TRACK|ML\||ENHANCE/i.test(cubeScript)) {
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
    setSimulatedImageUrl(null);
  };

  const handleOpenImageModal = (image: {imageUrl: string; cubeScript: string; id?: number}) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleSaveToGallery = async () => {
    if (simulatedImageUrl) {
        try {
            await galleryService.saveImage(simulatedImageUrl, cubeScript);
            const images = await galleryService.getImages();
            setGalleryImages(images);
            setToast({ message: 'Image saved to gallery!', type: 'success' });
        } catch(error) {
            console.error("Failed to save image:", error);
            const errorMessage = error instanceof Error ? error.message : 'Could not save image.';
            setToast({ message: `Save failed: ${errorMessage}`, type: 'error' });
        }
    }
  };
  
  const handleDeleteFromGallery = async (id: number) => {
    try {
        await galleryService.deleteImage(id);
        const images = await galleryService.getImages();
        setGalleryImages(images);
        setIsImageModalOpen(false);
        setSelectedImage(null);
        setToast({ message: 'Image deleted from gallery.', type: 'success' });
    } catch (error) {
        console.error("Failed to delete image:", error);
        const errorMessage = error instanceof Error ? error.message : 'Could not delete image.';
        setToast({ message: `Delete failed: ${errorMessage}`, type: 'error' });
    }
  };
  
  const loadScriptAndSwitchToExecutor = (script: string) => {
    setCubeScript(script);
    setView('executor');
    setLogEntries([]);
    setSimulatedImageUrl(null);
  };

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <DashboardView onViewChange={setView} />;
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
      case 'ml_builder':
        return <MLBuilderView onLoadInExecutor={loadScriptAndSwitchToExecutor} />;
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;