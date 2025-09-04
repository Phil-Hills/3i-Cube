import React, { useState, useEffect } from 'react';
import { CpuChipIcon, CubeIcon, PlayIcon, CircleStackIcon, BeakerIcon, ArrowDownTrayIcon, SparklesIcon, LightBulbIcon, PhotoIcon, LoaderIcon } from './icons';
import { generateSyntheticData } from '../services/syntheticDataService';
import type { SyntheticDataParams } from '../services/syntheticDataService';

type DataSource = 'simulated';
type Model = 'unet' | 'stardist' | 'custom';
type LossFunction = 'bce' | 'tversky' | 'dice' | 'focal';
export type SimCellType = 'Neurons' | 'Tissue';
export type SimArtifact = 'PSF_Blur' | 'Poisson_Noise' | 'Uneven_Illumination';
type OutputAction = 'apply' | 'save' | 'export';

interface MLBuilderViewProps {
  onLoadInExecutor: (script: string) => void;
}

const PipelineNode: React.FC<{ title: string; children: React.ReactNode; icon: React.FC<{ className?: string }> }> = ({ title, children, icon: Icon }) => (
  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 w-full flex flex-col">
    <h3 className="text-md font-semibold text-cyan-300 mb-3 flex items-center">
      <Icon className="w-5 h-5 mr-2" />
      {title}
    </h3>
    <div className="space-y-3 flex-grow">
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

const ImageWithLabelToggle: React.FC<{ image: string, label: string }> = ({ image, label }) => {
  const [showLabel, setShowLabel] = useState(false);
  return (
    <div className="relative aspect-square bg-black rounded-lg overflow-hidden border-2 border-slate-700" onMouseEnter={() => setShowLabel(true)} onMouseLeave={() => setShowLabel(false)}>
      <img src={image} alt="Generated synthetic data" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${showLabel ? 'opacity-0' : 'opacity-100'}`} />
      <img src={label} alt="Segmentation mask" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${showLabel ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
        {showLabel ? 'Label' : 'Image'}
      </div>
    </div>
  );
};

export const MLBuilderView: React.FC<MLBuilderViewProps> = ({ onLoadInExecutor }) => {
  const [model, setModel] = useState<Model>('unet');
  const [epochs, setEpochs] = useState(50);
  const [learningRate, setLearningRate] = useState('0.001');
  const [lossFunction, setLossFunction] = useState<LossFunction>('dice');
  const [outputAction, setOutputAction] = useState<OutputAction>('apply');
  const [generatedScript, setGeneratedScript] = useState('');
  
  const [simCellType, setSimCellType] = useState<SimCellType>('Neurons');
  const [simImageCount, setSimImageCount] = useState(1000);
  const [simArtifacts, setSimArtifacts] = useState<Set<SimArtifact>>(new Set(['PSF_Blur', 'Poisson_Noise']));
  
  const [previewImages, setPreviewImages] = useState<{image: string, label: string}[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const artifactsStr = Array.from(simArtifacts).join(',');
    const dataStr = `SIMULATE|CELLS[Type:${simCellType},Count:${simImageCount}]→ARTIFACTS[${artifactsStr}]|DATASET`;
    
    const modelMap = {
        'unet': 'MODEL[U-Net:Segmentation]',
        'stardist': 'MODEL[StarDist_3D:Tracking]',
        'custom': 'MODEL[Custom:Path_To_Model.h5]'
    };
    const modelStr = modelMap[model];

    const trainingStr = `TRAIN[Epochs:${epochs},LR:${learningRate},Loss:${lossFunction.toUpperCase()}]`;

    const outputMap = {
        'apply': 'DEPLOY[Apply_To_Live_View]',
        'save': 'DEPLOY[Save_Trained_Model]',
        'export': 'DEPLOY[Export_Segmentation_Mask]'
    };
    const outputStr = outputMap[outputAction];

    const script = `ML|${dataStr}\nML|DATASET[Generated]→${modelStr}→${trainingStr}→${outputStr}|COMPLETE`;
    setGeneratedScript(script);
  }, [model, epochs, learningRate, lossFunction, outputAction, simCellType, simImageCount, simArtifacts]);

  const toggleArtifact = (artifact: SimArtifact) => {
    setSimArtifacts(prev => {
        const next = new Set(prev);
        if (next.has(artifact)) next.delete(artifact);
        else next.add(artifact);
        return next;
    });
  };
  
  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    setPreviewImages(null);
    try {
        const params: SyntheticDataParams = {
            count: 9,
            cellType: simCellType,
            artifacts: Array.from(simArtifacts)
        };
        const generated = await generateSyntheticData(params);
        setPreviewImages(generated);
    } catch(e) {
        console.error("Failed to generate preview images", e);
    } finally {
        setIsGenerating(false);
    }
  };

  const SelectInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="text-sm text-slate-400 block mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-slate-900 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {children}
        </select>
    </div>
  );
  
  const NumberInput: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; step?: number }> = ({ label, value, onChange, step=1 }) => (
    <div>
      <label className="text-sm text-slate-400 block mb-1">{label}</label>
      <input type="number" value={value} onChange={onChange} step={step} className="w-full bg-slate-900 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
  );

  return (
    <div className="flex flex-col flex-grow pt-6 overflow-y-auto gap-4 animate-fade-in p-2">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <CpuChipIcon className="w-8 h-8 mr-3 text-cyan-400" />
          Synthetic Data ML Builder
        </h1>
        <p className="mt-2 text-slate-400 max-w-3xl mx-auto">CUBE doesn’t just control microscopes - it also orchestrates the ML around them. Generate synthetic images to train models with zero API cost. Feed them back into 3i systems, making microscopes smarter every experiment.</p>
      </header>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4">
        <PipelineNode title="1. Synthetic Data Generation" icon={CircleStackIcon}>
          <SelectInput label="Cell Type" value={simCellType} onChange={e => setSimCellType(e.target.value as SimCellType)}>
            <option value="Neurons">Neurons</option>
            <option value="Tissue">Tissue Section</option>
          </SelectInput>
          <NumberInput label="Total Image Count" value={simImageCount} onChange={e => setSimImageCount(parseInt(e.target.value, 10) || 0)} step={100} />
          <div>
            <label className="text-sm text-slate-400 block mb-2">Microscopy Artifacts</label>
            <div className="space-y-1">
              {(['PSF_Blur', 'Poisson_Noise', 'Uneven_Illumination'] as SimArtifact[]).map(artifact => (
                <label key={artifact} className="flex items-center text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={simArtifacts.has(artifact)} onChange={() => toggleArtifact(artifact)} className="mr-2 h-4 w-4 rounded bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-600"/>
                  {artifact.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>
        </PipelineNode>
        
        <PipelineConnector />

        <PipelineNode title="2. ML Model Training" icon={BeakerIcon}>
          <SelectInput label="Model Architecture" value={model} onChange={e => setModel(e.target.value as Model)}>
            <option value="unet">U-Net (Segmentation)</option>
            <option value="stardist">StarDist 3D (Object Detection)</option>
            <option value="custom">Custom Model</option>
          </SelectInput>
           <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Epochs" value={epochs} onChange={e => setEpochs(parseInt(e.target.value, 10) || 0)} />
            <div>
              <label className="text-sm text-slate-400 block mb-1">Learning Rate</label>
              <input type="text" value={learningRate} onChange={e => setLearningRate(e.target.value)} className="w-full bg-slate-900 text-slate-200 rounded-md p-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
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

        <PipelineNode title="3. Output & Deployment" icon={ArrowDownTrayIcon}>
          <SelectInput label="Action on Completion" value={outputAction} onChange={e => setOutputAction(e.target.value as OutputAction)}>
            <option value="apply">Apply Model to Live View</option>
            <option value="save">Save Trained Model File</option>
            <option value="export">Export Segmented Image</option>
          </SelectInput>
        </PipelineNode>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-slate-800/50 p-4 rounded-lg flex-grow">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Cost & Time Savings</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-red-900/30 p-2 rounded">
                <p className="text-sm font-semibold text-red-300">Traditional API</p>
                <p className="text-xl font-bold text-white">${((simImageCount * 0.02).toFixed(2))}</p>
                <p className="text-xs text-slate-400">~10 min (rate limits)</p>
              </div>
              <div className="bg-green-900/30 p-2 rounded">
                <p className="text-sm font-semibold text-green-300">CUBE Protocol</p>
                <p className="text-xl font-bold text-white">$0.00</p>
                <p className="text-xs text-slate-400">~10 sec (local)</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                className="w-full flex items-center justify-center p-3 bg-slate-700/80 text-white font-bold rounded-lg hover:bg-slate-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isGenerating ? <><LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate Data Preview</>}
            </button>
          </div>
        </div>
        
        {previewImages && (
            <div className="mt-4 animate-fade-in">
                <h3 className="text-md font-semibold text-slate-200 mb-2">Generated Data Preview (Hover to see labels)</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                    {previewImages.map((p, i) => <ImageWithLabelToggle key={i} image={p.image} label={p.label} />)}
                </div>
            </div>
        )}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <CubeIcon className="w-5 h-5 text-cyan-400 mr-2" />
          <h3 className="text-lg font-semibold text-slate-100">Final CUBE Training Script</h3>
        </div>
        <pre className="w-full bg-black/50 p-3 rounded-md text-cyan-300 font-mono text-sm overflow-x-auto">
          <code>{generatedScript}</code>
        </pre>
        <button
          onClick={() => onLoadInExecutor(generatedScript)}
          className="mt-4 w-full flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg shadow-purple-500/20"
        >
          <PlayIcon className="w-5 h-5 mr-3" />
          Load in Executor & Run Full Training Simulation
        </button>
      </div>

    </div>
  );
};