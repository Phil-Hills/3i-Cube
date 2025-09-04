import React from 'react';
import { PlayIcon, SwitchHorizontalIcon } from './icons';
import type { View } from '../types';

interface DashboardViewProps {
  onViewChange: (view: View) => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; command: string; }> = ({ title, children, command }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-cyan-300 mb-2">{title}</h3>
        <p className="text-slate-400 mb-4">{children}</p>
        <pre className="bg-black/50 p-3 rounded-md text-cyan-200 font-mono text-sm overflow-x-auto">
            <code>{command}</code>
        </pre>
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {
  return (
    <div className="flex-grow flex flex-col p-2 sm:p-6 overflow-y-auto animate-fade-in items-center">
        <div className="max-w-4xl w-full">
            <header className="text-center py-12">
                <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                    3i-CUBE: The Remote Control for Imaging and Intelligence
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-xl text-slate-300">
                    3i-CUBE extends the control of your microscope from hardware to AI.
                </p>
            </header>

            <div className="space-y-6">
                <InfoCard
                    title="Instrument Remote Control"
                    command="MICROSCOPY | ZSTACK[100]→CHANNELS[DAPI,GFP] | COMPLETE"
                >
                    Replace long Python scripts or endless clicks with a single, readable CUBE command. Every action — Z-stack, channels, timelapse, adaptive optics — is captured in one line.
                </InfoCard>

                <InfoCard
                    title="AI/ML Remote Control"
                    command="ANALYZE | SEGMENT[U-Net]→MEASURE[Area,Intensity] | RESULTS"
                >
                    Run deconvolution, segmentation, or super-resolution models with the same command structure.
                </InfoCard>

                <InfoCard
                    title="Synthetic Data Generation"
                    command="SIMULATE | AUGMENT[+Noise,+Contrast]→EXPORT[TrainingSet] | READY"
                >
                    Use real captures to generate simulated images through AI models. These simulated datasets accelerate training of microscope-specific ML, improving autofocus, denoising, and analysis accuracy.
                </InfoCard>
            </div>
            
            <p className="text-center text-xl font-bold text-white mt-12 tracking-wide">
                One protocol controls the robot you have — and helps train the robot it’s becoming.
            </p>

            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-white">Ready to Transform Your Workflow?</h2>
                <p className="text-slate-400 mt-2 mb-6">Explore the core tools of the 3i-CUBE protocol.</p>
                <div className="flex justify-center items-center flex-wrap gap-4">
                    <button
                        onClick={() => onViewChange('executor')}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <PlayIcon className="w-5 h-5" />
                        Go to Executor
                    </button>
                    <button
                        onClick={() => onViewChange('converter')}
                        className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                    >
                        <SwitchHorizontalIcon className="w-5 h-5" />
                        Try the CUBE Converter
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};