import React, { useEffect } from 'react';
import { XMarkIcon, CodeBracketIcon, ArrowDownTrayIcon, TrashIcon } from './icons';
import type { GalleryImage } from '../types';

interface ImageModalProps {
  media: { url: string; cubeScript: string; type: 'image' | 'video'; id?: number };
  onClose: () => void;
  onDelete?: (id: number) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ media, onClose, onDelete }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `cube-${media.type}-${Date.now()}.${media.type === 'video' ? 'webm' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFromGallery = media.id !== undefined && onDelete;

  return (
    <div className="image-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="flex flex-col max-w-full max-h-full w-full h-full p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-end mb-4 flex-shrink-0">
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 bg-black/50 hover:text-white hover:bg-white/20 transition-colors" 
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-grow flex items-center justify-center min-h-0">
            {media.type === 'image' ? (
                <img src={media.url} alt="Full-size microscopy preview" className="image-modal-content rounded-lg shadow-2xl shadow-black/50" />
            ) : (
                <video src={media.url} controls autoPlay loop className="image-modal-content rounded-lg shadow-2xl shadow-black/50" />
            )}
        </div>

        <div className="flex-shrink-0 mt-4 bg-gray-950/60 backdrop-blur-lg border border-white/10 rounded-lg p-3 max-w-4xl mx-auto w-full">
            <div className="flex items-center text-cyan-300 mb-2">
                <CodeBracketIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <h3 className="text-sm font-semibold">CUBE Script</h3>
            </div>
            <pre className="text-xs text-gray-300 font-mono bg-black/30 p-2 rounded overflow-x-auto">
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

      </div>
    </div>
  );
};