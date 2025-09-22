import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Editor } from './components/Editor';
import { OutputLog } from './components/OutputLog';
import { StatusBar } from './components/StatusBar';
import { microscopeService } from './services/microscopeService';
import { interpretCubeScript } from './services/geminiService';
import type { LogEntry, MicroscopeStatus, View, GalleryImage, Brand, ExecutionMode } from './types';
import { BRANDED_METHOD_SCRIPTS } from './constants';
import { AboutModal } from './components/AboutModal';
import { DocsModal } from './components/DocsModal';
import { ViewSwitcher } from './components/ViewSwitcher';
import { ConverterView } from './components/ConverterView';
import { ImagePreview } from './components/ImagePreview';
import { ImageModal } from './components/ImageModal';
import { GalleryView } from './components/GalleryView';
import * as galleryService from './services/galleryService';
import { XMarkIcon } from './components/icons';
import { DashboardView } from './components/DashboardView';
import { AIStudioView } from './components/AIStudioView';

const getInitialScript = (brand: Brand): string => {
  const scripts = BRANDED_METHOD_SCRIPTS[brand];
  if (
    scripts &&
    scripts.length > 0 &&
    scripts[0].scripts &&
    scripts[0].scripts.length > 0
  ) {
    return scripts[0].scripts[0].script;
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
  const brand: Brand = '3i';

  const [cubeScript, setCubeScript] = useState<string>(getInitialScript(brand));
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [microscopeStatus, setMicroscopeStatus] = useState<MicroscopeStatus>('IDLE');
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('simulated');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string; cubeScript: string; type: 'image' | 'video'; id?: number} | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  useEffect(() => {
    // Setup listeners for microscope service
    microscopeService.onLog = (log) => setLogEntries(prev => [...prev, log]);
    microscopeService.onStatusChange = setMicroscopeStatus;
    microscopeService.onMediaGenerated = (media) => setCapturedMedia(media);
    microscopeService.onExecutionChange = setIsExecuting;
    
    // Set initial status for simulated mode
    if (executionMode === 'simulated') {
        setMicroscopeStatus('IDLE');
        setLogEntries([{ type: 'SYSTEM', message: 'Application started in Simulated Mode.', timestamp: new Date() }]);
    }

    // Load gallery images
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
    
    // Cleanup on unmount
    return () => microscopeService.disconnect();
  }, []);

  const handleExecutionModeChange = (newMode: ExecutionMode) => {
    if (newMode === executionMode) return;
    
    setLogEntries([]);
    setCapturedMedia(null);
    setIsExecuting(false);
    setExecutionMode(newMode);

    if (newMode === 'live') {
        setMicroscopeStatus('DISCONNECTED'); // Will be updated by service
        microscopeService.connect();
    } else { // simulated
        microscopeService.disconnect();
        setMicroscopeStatus('IDLE'); // Simulated is always ready
        setLogEntries([{ type: 'SYSTEM', message: 'Switched to Simulated Mode. Execution will be run locally.', timestamp: new Date() }]);
    }
  };

  const handleExecute = useCallback(async () => {
    if (isExecuting || !cubeScript.trim()) return;

    setLogEntries([]);
    setCapturedMedia(null);
    setIsExecuting(true);

    if (executionMode === 'live') {
        microscopeService.executeScript(cubeScript);
    } else {
        try {
            await interpretCubeScript(
                cubeScript,
                (log) => setLogEntries(prev => [...prev, log]),
                (media) => setCapturedMedia(media)
            );
        } catch (error) {
            console.error("Simulation error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setLogEntries(prev => [...prev, { type: 'ERROR', message: `Simulation failed: ${errorMessage}`, timestamp: new Date() }]);
        } finally {
            setIsExecuting(false);
        }
    }
  }, [cubeScript, isExecuting, executionMode]);

  const selectScript = (script: string) => {
    setCubeScript(script);
    setLogEntries([]);
    setCapturedMedia(null);
  };

  const handleOpenImageModal = (media: {url: string; cubeScript: string; type: 'image' | 'video'; id?: number}) => {
    setSelectedMedia(media);
    setIsImageModalOpen(true);
  };

  const handleSaveToGallery = async () => {
    if (capturedMedia) {
        try {
            await galleryService.saveImage(capturedMedia.url, cubeScript, capturedMedia.type);
            const images = await galleryService.getImages();
            setGalleryImages(images);
            setToast({ message: 'Media saved to gallery!', type: 'success' });
        } catch(error) {
            console.error("Failed to save media:", error);
            const errorMessage = error instanceof Error ? error.message : 'Could not save media.';
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
        setSelectedMedia(null);
        setToast({ message: 'Media deleted from gallery.', type: 'success' });
    } catch (error) {
        console.error("Failed to delete media:", error);
        const errorMessage = error instanceof Error ? error.message : 'Could not delete media.';
        setToast({ message: `Delete failed: ${errorMessage}`, type: 'error' });
    }
  };

  const handleLoadInExecutor = useCallback((script: string) => {
    setCubeScript(script);
    setLogEntries([]);
    setCapturedMedia(null);
    setView('executor');
  }, []);

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <DashboardView 
          onViewChange={setView} 
          galleryImages={galleryImages}
          onImageClick={(media) => handleOpenImageModal({
            id: media.id,
            url: media.imageUrl,
            cubeScript: media.cubeScript,
            type: media.mediaType,
          })}
        />;
      case 'executor':
        return (
           <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
            <div className="md:col-span-3 flex flex-col gap-6">
              <CommandPalette onSelectScript={selectScript} scriptCategories={BRANDED_METHOD_SCRIPTS[brand]} />
            </div>
            <div className="md:col-span-5 flex flex-col gap-6">
              <Editor
                script={cubeScript}
                onScriptChange={setCubeScript}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="flex-1 min-h-[300px] md:min-h-0">
                <ImagePreview 
                  media={capturedMedia} 
                  onImageClick={() => capturedMedia && handleOpenImageModal({...capturedMedia, cubeScript})}
                  onSaveClick={handleSaveToGallery}
                />
              </div>
              <div className="flex-1 min-h-[300px] md:min-h-0">
                <OutputLog logEntries={logEntries} />
              </div>
            </div>
          </div>
        );
      case 'ai_studio':
        return <AIStudioView onLoadInExecutor={handleLoadInExecutor} />;
      case 'converter':
        return <ConverterView onLoadInExecutor={handleLoadInExecutor} />;
      case 'gallery':
        return <GalleryView images={galleryImages} onImageSelect={(media) => handleOpenImageModal({ url: media.imageUrl, cubeScript: media.cubeScript, id: media.id, type: media.mediaType })} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-200 font-sans">
      <Header 
        onAboutClick={() => setIsAboutModalOpen(true)}
        onDocsClick={() => setIsDocsModalOpen(true)}
        executionMode={executionMode}
        onExecutionModeChange={handleExecutionModeChange}
      />
      
      <main className="flex-grow flex flex-col p-4 sm:p-6 overflow-y-auto">
        <ViewSwitcher currentView={view} onViewChange={setView} />
        {renderView()}
      </main>
      
      <StatusBar status={microscopeStatus} executionMode={executionMode} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      {isDocsModalOpen && <DocsModal onClose={() => setIsDocsModalOpen(false)} />}
      {isImageModalOpen && selectedMedia && (
        <ImageModal 
          media={selectedMedia} 
          onClose={() => setIsImageModalOpen(false)}
          onDelete={handleDeleteFromGallery}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;