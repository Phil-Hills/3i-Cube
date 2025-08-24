import type { ExampleScriptCategory, ConverterExample } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "Real 3i Workflows",
    description: "End-to-end examples of complex experiments on 3i systems.",
    scripts: [
      {
        name: "Marianas Confocal - Live Cell",
        description: "Track cell division over 24 hours with temperature and CO2 control.",
        script: `# Live cell imaging with 3i Marianas
MARIANAS|LIVE_CELL→TEMP[37C]→CO2[5%]→OBJECTIVE[60x_Oil]|READY
TIMELAPSE|DURATION[24h]→INTERVAL[5min]→CHANNELS[GFP,RFP]→AUTOFOCUS[ON]|RUNNING
ANALYZE|TRACK[Cells]→MEASURE[Division_Time]→PLOT[Growth_Curve]|COMPLETE`
      },
      {
        name: "AXL Lattice Light Sheet",
        description: "4D imaging of a developing zebrafish embryo with AI-powered deconvolution.",
        script: `# 4D Lattice light sheet with AXL
AXL|LATTICE→SAMPLE[Zebrafish_Embryo]→GENTLE[Low_Power]|CONFIGURED
ACQUIRE|4D→VOLUME[500x500x200um]→TIME[6h]→INTERVAL[30s]|CAPTURING
PROCESS|DECONVOLVE[AI]→PROJECT[MIP]→RENDER[3D]→EXPORT[Movie]|COMPLETE`
      },
      {
        name: "Cleared Tissue Imaging",
        description: "Image an entire mouse brain section by scanning and stitching large tiles.",
        script: `# Cleared tissue with 3i AXL
AXL|CLEARED[Mouse_Brain]→OBJECTIVE[10x_Clarity]→IMMERSION[RI_1.45]|READY
SCAN|VOLUME[10x10x5mm]→TILE[20x20]→OVERLAP[10%]→CHANNELS[DAPI,GFP]|IMAGING
STITCH|TILES→FUSE[Blending]→COMPRESS[HDF5]→VISUALIZE[3D]|COMPLETE`
      }
    ]
  },
  {
    category: "AXL Extreme Light Microscopy",
    description: "Cutting-edge techniques for the flagship 3i AXL system.",
    scripts: [
      {
        name: "Lattice Light Sheet",
        description: "Gentle, high-resolution 4D imaging of live samples over time.",
        script: `AXL|LATTICE→SAMPLE[Live_Cells]→VOLUME[200x200x50um]→TIME[10min]→GENTLE|4D`
      },
      {
        name: "Cleared Tissue Volume",
        description: "Deep imaging of large, cleared samples like a mouse brain.",
        script: `AXL|CLEARED[Mouse_Brain]→DEPTH[5mm]→CHANNELS[Neurons,Vessels]→TILE[10x10]|VOLUME`
      },
      {
        name: "6-Color Live Cell Imaging",
        description: "Simultaneous long-term imaging of 6 fluorescent channels with minimal photobleaching.",
        script: `AXL|LIVE→CHANNELS[DAPI,GFP,RFP,iRFP,Cy5,Cy7]→TIMELAPSE[24h]→MINIMAL_BLEACH|MULTICOLOR`
      },
      {
        name: "AI Deconvolution",
        description: "Acquire raw data and use AI to dramatically enhance resolution and clarity.",
        script: `AXL|ACQUIRE[Raw]→DECONVOLVE[AI]→ENHANCE[2x_Resolution]→DENOISE|CRYSTAL_CLEAR`
      },
      {
        name: "High-Speed Volumetric",
        description: "Capture 3D volumes at 100fps to track fast-moving particles.",
        script: `AXL|VOLUME→SPEED[100fps]→ZSTACK[100_planes]→TRACK[Particles]|FAST_3D`
      },
      {
        name: "Simultaneous FRAP & Imaging",
        description: "Perform photomanipulation (FRAP) while simultaneously imaging the sample.",
        script: `AXL|FRAP→BLEACH[ROI]→MONITOR[Recovery]→SIMULTANEOUS[Imaging]|QUANTIFIED`
      }
    ]
  },
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