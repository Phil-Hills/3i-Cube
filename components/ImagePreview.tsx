
import React from 'react';
import { PhotoIcon } from './icons';

interface ImagePreviewProps {
  imageUrl: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col border border-gray-700/50 h-full">
      <div className="flex items-center mb-3 flex-shrink-0">
        <PhotoIcon className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-100">AI-Generated Preview</h2>
      </div>
      <div className="relative flex-grow flex items-center justify-center bg-gray-900/50 rounded-md min-h-0">
        {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="AI-generated microscopy preview" 
              className="rounded-md object-contain max-w-full max-h-full"
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
