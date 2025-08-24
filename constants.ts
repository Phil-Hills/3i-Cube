import type { ExampleScriptCategory, ConverterExample } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "Core Techniques",
    description: "Fundamental and commonly used 3i imaging protocols.",
    scripts: [
      {
        name: "Spinning Disk Confocal",
        description: "High-speed Z-stack acquisition with deconvolution for clarity.",
        script: `ACQUIRE|CONFOCAL[CSU-W1]→CHANNELS[405,488,561,647]→ZSTACK[100]→DECONVOLVE|SHARP`
      },
      {
        name: "Live Cell Perfect Focus",
        description: "Long-term imaging with hardware autofocus to maintain stability.",
        script: `LIVE|CELLS[37C,CO2]→TIMELAPSE[24h]→FOCUS[Auto_Correct]→TRACK|STABLE`
      },
    ]
  },
  {
    category: "Advanced Applications",
    description: "Cutting-edge methods for super-resolution and photomanipulation.",
    scripts: [
      {
        name: "SoRa Super-Resolution",
        description: "Achieve 120nm resolution for seeing subcellular details.",
        script: `ACQUIRE|SORA[Super_Res]→CHANNELS[488,561]→RESOLUTION[120nm]→RECONSTRUCT|ENHANCED`
      },
      {
        name: "Vector FRAP",
        description: "Targeted laser bleaching and recovery monitoring using Vector photomanipulation.",
        script: `VECTOR|TARGET[ROI]→LASER[405nm,100%]→BLEACH→MONITOR[Recovery]|FRAP`
      }
    ]
  },
  {
    category: "Large Volume Imaging",
    description: "Methods for imaging large, cleared tissue samples.",
    scripts: [
      {
        name: "Light Sheet Volume",
        description: "Scan a large cleared tissue sample and fuse tiled volumes.",
        script: `ACQUIRE|LIGHTSHEET[Cleared_Tissue]→VOLUME[5x5x3mm]→TILE[3x3]→FUSE|COMPLETE`
      }
    ]
  }
];


export const CONVERTER_EXAMPLES: { name: string, description: string, code: string }[] = [
  {
    name: "3i Adaptive Optics (MATLAB)",
    description: "Convert a real, 200+ line AO script from MATLAB to CUBE.",
    code: `%% This script performs indirect, image-based adaptive optics
% ... (200+ lines of MATLAB code)
% Complex initialization
[nZern, Z2C, dm] = Init_ALPAO_DM();
dm.Reset();

% Calibration
Spherical_calibration = [-3:1:3];
Defocus_corection = [-10.1, -7, -3.3, 0, 1.3, 3.9, 6.8];
p = polyfit(Spherical_calibration, Defocus_corection, 1);

% Main optimization loop
for i = Zernike_index
  for j = 1:length(ZernikeAmplitude)
    % Set DM pattern
    [zernikeVector] = set_zernike_ALPAO_DM(...);
    
    % Acquire image
    isRequestingFrame = 1;
    while (isFrameReady == 0)
      pause(0.1);
    end
    
    % Calculate merit
    [Total_Intensity(i,j), High_f_content(i,j)] = Calc_Merits(...);
  end
  
  % Find optimal amplitude
  [Maximal_zernike_Amp_fit_HF(i)] = Find_maximal_zernike(...);
end

% Apply optimal pattern
dm.Send(zernikeVector * Z2C);
% ... (more code for results and plotting)`
  },
  {
    name: "Basic Image Capture (Python)",
    description: "A simple Python script for capturing and saving a single image.",
    code: `from pycromanager import Core
import tifffile

core = Core()
core.setExposure(100)
core.snapImage()
image = core.getImage()
tifffile.imwrite("output.tif", image)`
  },
  {
    name: "Multi-Channel Z-Stack (Python)",
    description: "Acquire a 3D stack across multiple fluorescent channels.",
    code: `# 3i Multi-channel Z-stack
import numpy
from pycromanager import Core
import tifffile

channels = ['DAPI', 'GFP', 'RFP']
z_start, z_end, z_step = -10, 10, 0.5

for channel in channels:
    core.setConfig('Channel', channel)
    images = []
    for z in numpy.arange(z_start, z_end, z_step):
        core.setPosition(z)
        core.snapImage()
        images.append(core.getImage())
    tifffile.imwrite(f'{channel}_stack.tif', numpy.array(images))`
  },
  {
    name: "Time-lapse Experiment (Python)",
    description: "Run a long-term time-lapse acquisition over 24 hours.",
    code: `# 3i Time-lapse
import time
from pycromanager import Core
import tifffile

duration_hours = 24
interval_minutes = 5
num_timepoints = int(duration_hours * 60 / interval_minutes)

for t in range(num_timepoints):
    core.snapImage()
    image = core.getImage()
    tifffile.imwrite(f'timelapse_t{t:04d}.tif', image)
    time.sleep(interval_minutes * 60)`
  }
];