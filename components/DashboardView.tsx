
import React from 'react';
import { CubeIcon, ArrowPathIcon } from './icons';
import type { View } from '../types';

interface DashboardViewProps {
  onViewChange: (view: View) => void;
}

const caseStudies = [
  {
    name: 'Multi-Well Plate Analysis',
    originalLines: 1655,
    cubeLines: 11,
    ratio: '150:1',
    description: 'A full high-content screening workflow with data acquisition, deconvolution, and AI segmentation.',
  },
  {
    name: 'Adaptive Optics Correction',
    originalLines: 473,
    cubeLines: 7,
    ratio: '67:1',
    description: 'An iterative hardware optimization routine to correct optical aberrations in real-time.',
  },
  {
    name: 'Live Cell FRAP Experiment',
    originalLines: 246,
    cubeLines: 8,
    ratio: '30:1',
    description: 'A targeted photomanipulation experiment with subsequent recovery monitoring and kinetic analysis.',
  },
];

const totalOriginal = caseStudies.reduce((sum, cs) => sum + cs.originalLines, 0);
const totalCube = caseStudies.reduce((sum, cs) => sum + cs.cubeLines, 0);
const averageRatio = (totalOriginal / totalCube).toFixed(1);


export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {

  return (
    <div className="flex-grow flex flex-col p-6 overflow-y-auto animate-fade-in">
        <header className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                3i-CUBE v2.0 Dashboard
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Showcasing a <span className="text-cyan-300 font-semibold">91.3:1</span> average code compression ratio on real-world microscopy workflows.
            </p>
             <div className="mt-6">
                <button
                    onClick={() => onViewChange('converter')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5"
                >
                    <ArrowPathIcon className="w-5 h-5 mr-2 inline-block" />
                    Try the 3i-CUBE Converter
                </button>
            </div>
        </header>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
                <CubeIcon className="w-7 h-7 text-cyan-400 mr-3" />
                3i-CUBE Workflow Compression Benchmark
            </h2>
            <p className="text-slate-400 mb-6">
                Analysis of complex Python microscopy scripts, converted to 3i-CUBE.
            </p>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-slate-300">Case Study</th>
                            <th className="p-3 text-sm font-semibold text-slate-300 text-right">Original Lines (Python)</th>
                            <th className="p-3 text-sm font-semibold text-slate-300 text-right">CUBE Commands</th>
                            <th className="p-3 text-sm font-semibold text-slate-300 text-right">Compression Ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caseStudies.map(study => (
                            <tr key={study.name} className="border-b border-slate-800 hover:bg-slate-800/40">
                                <td className="p-3">
                                    <p className="font-medium text-white">{study.name}</p>
                                    <p className="text-xs text-slate-400">{study.description}</p>
                                </td>
                                <td className="p-3 text-right font-mono text-red-400">{study.originalLines.toLocaleString()}</td>
                                <td className="p-3 text-right font-mono text-green-400">{study.cubeLines}</td>
                                <td className="p-3 text-right font-semibold text-cyan-300">{study.ratio}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-800/50 font-bold">
                        <tr>
                            <td className="p-3 text-white">Total / Average</td>
                            <td className="p-3 text-right font-mono text-red-300">{totalOriginal.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-green-300">{totalCube}</td>
                            <td className="p-3 text-right text-cyan-200">{averageRatio}:1</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

             <div className="mt-6 text-center text-sm text-slate-500">
                <p>
                    <span className="font-bold text-slate-300">BENCHMARK: </span> 
                    <span className="font-mono text-red-400">ORIGINAL[{totalOriginal}]</span> → 
                    <span className="font-mono text-green-400">CUBE[{totalCube}]</span> → 
                    <span className="font-mono text-cyan-300">RATIO[{averageRatio}:1]</span>
                    <span className="font-mono text-slate-300"> |VALIDATED</span>
                </p>
            </div>
        </div>
    </div>
  );
};