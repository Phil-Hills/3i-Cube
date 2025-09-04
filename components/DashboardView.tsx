import React from 'react';
import { SwitchHorizontalIcon } from './icons';
import type { View } from '../types';

interface DashboardViewProps {
  onViewChange: (view: View) => void;
}

const benchmarkData = [
  { workflow: 'Multi-Well Plate Analysis', original: 1655, cube: 11, ratio: '150:1' },
  { workflow: 'Adaptive Optics Correction', original: 473, cube: 7, ratio: '67:1' },
  { workflow: 'Live Cell FRAP Experiment', original: 246, cube: 8, ratio: '30:1' },
];

const totals = {
  original: 2374,
  cube: 26,
  ratio: '91:1'
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {
  return (
    <div className="flex-grow flex flex-col p-2 sm:p-6 overflow-y-auto animate-fade-in items-center">
        <div className="max-w-4xl w-full">
            <header className="text-center py-12">
                <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                    Welcome to 3i-CUBE
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
                    We’re so glad you’re here! This is where you’ll see just how much simpler and lighter your workflows can become.
                    <br/><br/>
                    On average, our protocol reduces thousands of lines of complex code into just a handful of easy-to-read commands. In fact, across real microscopy case studies, we’ve seen a <strong>91:1 reduction</strong>. That means more focus on science, and less time wrestling with scripts.
                    <br/><br/>
                    Please try the converter below to see it for yourself. Even if the first cubes you make feel a little basic, that’s okay. Building the habit of using CUBEs now will set you up for smoother, reproducible experiments later.
                </p>
                <div className="mt-8">
                    <button
                        onClick={() => onViewChange('converter')}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                    >
                        <SwitchHorizontalIcon className="w-5 h-5" />
                        Try the Converter
                    </button>
                </div>
            </header>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 my-12">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Validated Efficiency Benchmarks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="p-3 text-sm font-semibold text-slate-300">Workflow</th>
                                <th className="p-3 text-sm font-semibold text-slate-300 text-right">Original Lines</th>
                                <th className="p-3 text-sm font-semibold text-slate-300 text-right">CUBE Commands</th>
                                <th className="p-3 text-sm font-semibold text-slate-300 text-right">Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {benchmarkData.map(item => (
                                <tr key={item.workflow} className="border-b border-slate-800">
                                    <td className="p-3 text-slate-100">{item.workflow}</td>
                                    <td className="p-3 text-slate-300 font-mono text-right">{item.original.toLocaleString()}</td>
                                    <td className="p-3 text-slate-300 font-mono text-right">{item.cube}</td>
                                    <td className="p-3 text-cyan-400 font-mono text-right">{item.ratio}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold">
                                <td className="p-3 text-slate-100">Total / Avg</td>
                                <td className="p-3 text-white font-mono text-right">{totals.original.toLocaleString()}</td>
                                <td className="p-3 text-white font-mono text-right">{totals.cube}</td>
                                <td className="p-3 text-cyan-300 font-mono text-right">{totals.ratio}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <p className="text-center text-slate-400 mt-4 text-sm italic">
                  These are not toy examples; they’re real 3i workflows. Thousands of lines of brittle Python replaced by a handful of commands. 91× simpler, 100% intact.
                </p>
            </div>
            
            <p className="text-center text-xl font-bold text-white mt-12 tracking-wide">
                One protocol controls the robot you have and helps train the robot it’s becoming.
            </p>
        </div>
    </div>
  );
};