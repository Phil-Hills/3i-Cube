import React, { useState, useMemo } from 'react';
import type { GalleryImage } from '../types';
import { PhotoIcon, CubeIcon, CalendarIcon, TagIcon, PlayIcon } from './icons';

interface GalleryViewProps {
  images: GalleryImage[];
  onImageSelect: (image: GalleryImage) => void;
}

type DateFilter = 'all' | 'today' | '7d';

export const GalleryView: React.FC<GalleryViewProps> = ({ images, onImageSelect }) => {
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [systemFilter, setSystemFilter] = useState<string>('all');
    const [techniqueFilter, setTechniqueFilter] = useState<string>('all');

    const systems = useMemo(() => ['all', ...Array.from(new Set(images.map(img => img.tags.system)))], [images]);
    const techniques = useMemo(() => ['all', ...Array.from(new Set(images.map(img => img.tags.technique)))], [images]);

    const filteredImages = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

        return images.filter(image => {
            const imageDate = new Date(image.createdAt);
            const dateMatch =
                dateFilter === 'all' ||
                (dateFilter === 'today' && imageDate >= today) ||
                (dateFilter === '7d' && imageDate >= sevenDaysAgo);

            const systemMatch = systemFilter === 'all' || image.tags.system === systemFilter;
            const techniqueMatch = techniqueFilter === 'all' || image.tags.technique === techniqueFilter;
            
            return dateMatch && systemMatch && techniqueMatch;
        });
    }, [images, dateFilter, systemFilter, techniqueFilter]);
    
    const FilterButton: React.FC<{onClick: () => void, isActive: boolean, children: React.ReactNode}> = ({ onClick, isActive, children }) => (
        <button
          onClick={onClick}
          className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
            isActive ? 'bg-cyan-400/20 text-cyan-200' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
          }`}
        >
          {children}
        </button>
    );

  return (
    <div className="flex-grow grid grid-cols-12 gap-6 pt-6 overflow-hidden">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg p-4 flex flex-col overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-100 mb-6 flex items-center">
                <PhotoIcon className="w-6 h-6 text-cyan-400 mr-2" />
                Media Gallery
            </h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center"><CalendarIcon className="w-5 h-5 mr-2"/>Date Generated</h3>
                    <div className="space-y-1">
                        <FilterButton onClick={() => setDateFilter('all')} isActive={dateFilter === 'all'}>All Time</FilterButton>
                        <FilterButton onClick={() => setDateFilter('today')} isActive={dateFilter === 'today'}>Today</FilterButton>
                        <FilterButton onClick={() => setDateFilter('7d')} isActive={dateFilter === '7d'}>Last 7 Days</FilterButton>
                    </div>
                </div>
                 <div>
                    <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center"><CubeIcon className="w-5 h-5 mr-2"/>System</h3>
                    <div className="space-y-1">
                        {systems.map(sys => (
                           <FilterButton key={sys} onClick={() => setSystemFilter(sys)} isActive={systemFilter === sys}>{sys}</FilterButton>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Imaging Technique</h3>
                     <div className="space-y-1">
                        {techniques.map(tech => (
                           <FilterButton key={tech} onClick={() => setTechniqueFilter(tech)} isActive={techniqueFilter === tech}>{tech}</FilterButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Image Grid */}
        <div className="col-span-12 md:col-span-9 overflow-y-auto">
            {filteredImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map(media => (
                        <div 
                            key={media.id} 
                            className="relative aspect-square group cursor-pointer"
                            onClick={() => onImageSelect(media)}
                        >
                            {media.mediaType === 'image' ? (
                                <img src={media.imageUrl} alt={`Microscopy image from ${media.createdAt.toLocaleString()}`} className="w-full h-full object-cover rounded-lg bg-black/30" />
                            ) : (
                                <video src={media.imageUrl} muted loop className="w-full h-full object-cover rounded-lg bg-black/30" onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()}></video>
                            )}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-xs">
                                {media.mediaType === 'video' && (
                                    <div className="self-start">
                                        <PlayIcon className="w-5 h-5 text-white/80" />
                                    </div>
                                )}
                                <div className="text-right">
                                    <p className="font-bold">{media.tags.system} - {media.tags.technique}</p>
                                    <p className="text-gray-400">{media.createdAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                    <PhotoIcon className="w-16 h-16 mb-4 text-gray-600"/>
                    <h3 className="text-lg font-semibold text-gray-400">The Gallery is Empty</h3>
                    <p className="max-w-xs">Run experiments in the Executor and click "Save" on the preview to start your collection.</p>
                </div>
            )}
        </div>
    </div>
  );
};