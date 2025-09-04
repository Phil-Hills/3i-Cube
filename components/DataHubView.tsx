import React, { useState, useMemo } from 'react';
import { CircleStackIcon, PlayIcon } from './icons';
import type { Dataset } from '../types';

interface DataHubViewProps {
  onLoadInExecutor: (script: string) => void;
}

const allDatasets: Dataset[] = [
  {
    id: 'zenodo-7812603',
    source: 'Zenodo',
    title: 'Fluorescence Microscopy Bacteria Segmentation',
    description: '200 images of 40 individual E. coli cells with ground truth masks. Ideal for training segmentation models like U-Net.',
    tags: ['Segmentation', 'Microscopy', 'E. coli', 'Fluorescence'],
    size: '1.2 GB',
    citation: 'DOI: 10.5281/zenodo.7812603',
    cubeScript: 'DATA|LOAD[Zenodo:7812603]→PREPARE[Train/Val]→READY|LOADED'
  },
  {
    id: 'zenodo-3890887',
    source: 'Zenodo',
    title: 'Live-cell imaging of mitochondrial fission/fusion',
    description: 'Time-lapse movies of U2OS cells showing mitochondrial dynamics. Perfect for developing tracking algorithms.',
    tags: ['Tracking', 'Live Cell', 'Mitochondria', 'Time-lapse'],
    size: '5.8 GB',
    citation: 'DOI: 10.5281/zenodo.3890887',
    cubeScript: 'DATA|LOAD[Zenodo:3890887]→ANALYZE[Dynamics]→READY|LOADED'
  },
  {
    id: 'kaggle-bbbc038',
    source: 'Kaggle',
    title: 'BBBC038 - Nuclei Image Segmentation (Broad)',
    description: 'A large-scale dataset of diversified nuclei images from the Broad Bioimage Benchmark Collection, used for segmentation tasks.',
    tags: ['Segmentation', 'Nuclei', 'High-Content Screening'],
    size: '750 MB',
    citation: 'Broad Bioimage Benchmark Collection',
    cubeScript: 'DATA|LOAD[Kaggle:bbbc038]→TRAIN[U-Net]→READY|LOADED'
  },
  {
    id: 'figshare-7447910',
    source: 'FigShare',
    title: '3D Electron Microscopy of a Fly Brain',
    description: 'A large volume dataset of a Drosophila melanogaster brain, suitable for neuron tracing and connectomics research.',
    tags: ['Volume Imaging', 'EM', 'Connectomics', 'Neuron Tracing'],
    size: '21 GB',
    citation: 'DOI: 10.6084/m9.figshare.7447910.v1',
    cubeScript: 'DATA|LOAD[FigShare:7447910]→RENDER[3D]→READY|LOADED'
  },
];

const DatasetCard: React.FC<{ dataset: Dataset, onLoad: (script: string) => void }> = ({ dataset, onLoad }) => {
  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-200">
      <div>
        <p className="text-xs font-semibold text-cyan-400">{dataset.source}</p>
        <h3 className="font-bold text-slate-100 mt-1">{dataset.title}</h3>
        <p className="text-sm text-slate-400 mt-2 text-pretty">{dataset.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
            {dataset.tags.map(tag => (
                <span key={tag} className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-slate-500 font-mono">CUBE: {dataset.cubeScript}</p>
        <button
          onClick={() => onLoad(dataset.cubeScript)}
          className="mt-2 w-full flex items-center justify-center p-2 bg-slate-700/80 text-white font-semibold rounded-lg hover:bg-cyan-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          Load in Executor
        </button>
      </div>
    </div>
  );
};


export const DataHubView: React.FC<DataHubViewProps> = ({ onLoadInExecutor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('All');

    const sources = ['All', 'Zenodo', 'Kaggle', 'FigShare'];

    const filteredDatasets = useMemo(() => {
        return allDatasets.filter(dataset => {
            const sourceMatch = sourceFilter === 'All' || dataset.source === sourceFilter;
            const searchMatch = searchTerm.trim() === '' ||
                dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return sourceMatch && searchMatch;
        });
    }, [searchTerm, sourceFilter]);

  return (
    <div className="flex flex-col flex-grow pt-6 overflow-hidden gap-6 animate-fade-in p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <CircleStackIcon className="w-8 h-8 mr-3 text-cyan-400" />
          Scientific Data Hub
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
          The Scientific Data Hub connects 3i-CUBE to the world’s datasets. With one CUBE command, load benchmark data for training or validation - seamlessly integrated with your microscope workflows.
        </p>
      </header>
      
      <div className="px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-2">
            <input 
                type="text"
                placeholder="Search datasets (e.g., 'segmentation', 'e. coli')..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-grow bg-slate-900 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="bg-slate-900 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-4">
          {filteredDatasets.length > 0 ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDatasets.map(ds => (
                    <DatasetCard key={ds.id} dataset={ds} onLoad={onLoadInExecutor} />
                ))}
            </div>
          ) : (
             <div className="text-center text-slate-500 pt-16">
                 <h3 className="text-lg font-semibold">No datasets found</h3>
                 <p>Try adjusting your search or filter criteria.</p>
             </div>
          )}
      </div>
    </div>
  );
};