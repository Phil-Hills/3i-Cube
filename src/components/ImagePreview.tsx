
import React from 'react';
import { PhotoIcon, BookmarkSquareIcon } from './icons';

interface ImagePreviewProps {
  imageUrl: string | null;
  onImageClick: () => void;
  onSaveClick: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onImageClick, onSaveClick }) => {
  return (
    <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg p-6 flex flex-col h-full shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center">
            <PhotoIcon className="w-6 h-6 text-cyan-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-100">AI-Generated Preview</h2>
        </div>
        <button 
            onClick={onSaveClick}
            disabled={!imageUrl}
            className="flex items-center text-sm px-2 py-1 rounded-md bg-white/5 text-cyan-300 hover:bg-cyan-400/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            title="Save Image to Gallery"
        >
            <BookmarkSquareIcon className="w-4 h-4 mr-1.5" />
            Save
        </button>
      </div>
      <div 
        className="relative flex-grow flex items-center justify-center bg-black/30 rounded-md min-h-0 shadow-inner"
        onClick={imageUrl ? onImageClick : undefined}
      >
        {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="AI-generated microscopy preview" 
              className="rounded-lg object-contain max-w-full max-h-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 cursor-pointer hover:opacity-90 transition-opacity"
            />
        ) : (
          <div className="text-gray-500 text-center p-4">
             <PhotoIcon className="w-12 h-12 mx-auto mb-2 text-gray-600" />
            <p>No image preview</p>
          </div>
        )}
      </div>
    </div>
  );
};