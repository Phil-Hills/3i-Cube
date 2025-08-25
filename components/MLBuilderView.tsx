import React, { useState, useEffect } from 'react';
import { CpuChipIcon, CubeIcon, PlayIcon } from './icons';
import type { View } from '../types';

type DataSource = 'live' | 'gallery' | 'imagenet';
type Model = 'unet' | 'stardist' | 'custom';
type LossFunction = 'bce' | 'tversky' | 'dice' | 'focal';
type OutputAction = 'apply' | 'save' | 'export';

interface MLBuilderViewProps {
  onLoadInExecutor: (script: string) => void;
}

const PipelineNode: React.FC<{ title: string; children: React.ReactNode; icon: React.FC<{ className?: string }> }> = ({ title, children, icon: Icon }) => (
  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 w-full">
    <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center">
      <Icon className="w-5 h-5 mr-2" />
      {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const PipelineConnector: React.FC = () => (
  <div className="flex-shrink-0 self-center text-slate-600 my-2 lg:my-0 lg:mx-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8 transform lg:rotate-0 rotate-90">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
  </div>
);


export const MLBuilderView: React.FC<MLBuilderViewProps> = ({ onLoadInExecutor }) => {
  const [dataSource, setDataSource] = useState<DataSource>('live');
  const [model, setModel] = useState<Model>('unet');
  const [epochs, setEpochs] = useState(50);
  const [learningRate, setLearningRate] = useState('0.001');
  const [lossFunction, setLossFunction] = useState<LossFunction>('dice');
  const [outputAction, setOutputAction] = useState<OutputAction>('apply');
  const [generatedScript, setGeneratedScript] = useState('');

  useEffect(() => {
    const dataMap = {
        'live': 'DATA[Live_Feed]',
        'gallery': 'DATA[From_Gallery]',
        'imagenet': 'DATA[Public:ImageNet_Sample]'
    };
    const dataStr = dataMap[dataSource];

    const modelMap = {
        'unet': 'MODEL[U-Net:Segmentation]',
        'stardist': 'MODEL[StarDist_3D:Tracking]',
        'custom': 'MODEL[Custom:Path_To_Model.h5]'
    };
    const modelStr = modelMap[model];

    const trainingStr = `TRAIN[Epochs:${epochs},LR:${learningRate},Loss:${lossFunction.toUpperCase()}]`;

    const outputMap = {
        'apply': 'OUTPUT[Apply_To_View]',
        'save': 'OUTPUT[Save_Trained_Model]',
        'export': 'OUTPUT[Export_Segmentation_Mask]'
    };
    const outputStr = outputMap[outputAction];

    const script = `ML|${dataStr}→${modelStr}→${trainingStr}→${outputStr}|COMPLETE`;
    setGeneratedScript(script);
  }, [dataSource, model, epochs, learningRate, lossFunction, outputAction]);

  const SelectInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="text-sm text-slate-400 block mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-slate-700/50 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {children}
        </select>
    </div>
  );
  
  const NumberInput: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
      <label className="text-sm text-slate-400 block mb-1">{label}</label>
      <input type="number" value={value} onChange={onChange} className="w-full bg-slate-700/50 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
  );

  return (
    <div className="flex flex-col flex-grow pt-6 overflow-y-auto gap-6 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <CpuChipIcon className="w-8 h-8 mr-3 text-cyan-400" />
          Visual ML Pipeline Builder
        </h1>
        <p className="mt-2 text-slate-400">Construct a machine learning workflow and generate the CUBE script automatically.</p>
      </header>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4">
        <PipelineNode title="1. Data Source" icon={CircleStackIcon}>
          <SelectInput label="Source" value={dataSource} onChange={e => setDataSource(e.target.value as DataSource)}>
            <option value="live">Live Microscope Feed</option>
            <option value="gallery">From Gallery</option>
            <option value="imagenet">Public Dataset (ImageNet)</option>
          </SelectInput>
        </PipelineNode>
        
        <PipelineConnector />

        <PipelineNode title="2. ML Model" icon={CpuChipIcon}>
          <SelectInput label="Model Architecture" value={model} onChange={e => setModel(e.target.value as Model)}>
            <option value="unet">U-Net (Segmentation)</option>
            <option value="stardist">StarDist 3D (Tracking)</option>
            <option value="custom">Custom Model</option>
          </SelectInput>
        </PipelineNode>

        <PipelineConnector />

        <PipelineNode title="3. Training" icon={BeakerIcon}>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Epochs" value={epochs} onChange={e => setEpochs(parseInt(e.target.value, 10) || 0)} />
            <div>
              <label className="text-sm text-slate-400 block mb-1">Learning Rate</label>
              <input type="text" value={learningRate} onChange={e => setLearningRate(e.target.value)} className="w-full bg-slate-700/50 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <SelectInput label="Loss Function" value={lossFunction} onChange={e => setLossFunction(e.target.value as LossFunction)}>
            <option value="dice">Dice</option>
            <option value="bce">BCE</option>
            <option value="tversky">Tversky</option>
            <option value="focal">Focal</option>
          </SelectInput>
        </PipelineNode>

        <PipelineConnector />

        <PipelineNode title="4. Output" icon={ArrowDownTrayIcon}>
          <SelectInput label="Action" value={outputAction} onChange={e => setOutputAction(e.target.value as OutputAction)}>
            <option value="apply">Apply to Live View</option>
            <option value="save">Save Trained Model</option>
            <option value="export">Export Segmented Image</option>
          </SelectInput>
        </PipelineNode>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl p-4 mt-4">
        <div className="flex items-center mb-2">
          <CubeIcon className="w-5 h-5 text-cyan-400 mr-2" />
          <h3 className="text-lg font-semibold text-slate-100">Generated CUBE Script</h3>
        </div>
        <pre className="w-full bg-black/50 p-3 rounded-md text-cyan-300 font-mono text-sm overflow-x-auto">
          <code>{generatedScript}</code>
        </pre>
      </div>

      <button
        onClick={() => onLoadInExecutor(generatedScript)}
        className="mt-2 w-full flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl shadow-purple-500/20 transform hover:-translate-y-1"
      >
        <PlayIcon className="w-6 h-6 mr-3" />
        Load in Executor
      </button>
    </div>
  );
};
// Add placeholder icons if they don't exist in icons.tsx
const BeakerIcon = ({ className = '' }) => <svg className={className} />;
const CircleStackIcon = ({ className = '' }) => <svg className={className} />;
const ArrowDownTrayIcon = ({ className = '' }) => <svg className={className} />;
