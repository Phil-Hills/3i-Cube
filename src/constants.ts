import type { ExampleScriptCategory, ConverterExample } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "AXL with CUDA Acceleration",
    description: "GPU-accelerated workflows for real-time processing and AI.",
    scripts: [
      {
        name: "Real-time Deconvolution",
        description: "Process a 4K video stream live with GPU-accelerated deconvolution.",
        script: `# GPU-accelerated deconvolution with AXL
AXL|GPU[RTX_4090]→DECONVOLVE[REALTIME_DECONV]→CUDA[ACCELERATED]|INSTANT
PROCESS|STREAM[4K_Video]→DECONV[Live]→DISPLAY[120fps]→LATENCY[8ms]|SMOOTH
SAVE|FORMAT[H265]→COMPRESS[GPU]→BITRATE[100Mbps]|EFFICIENT`
      },
      {
        name: "AI Cell Segmentation",
        description: "Run a deep learning model on the GPU to segment and label cells in real-time.",
        script: `# AI segmentation with CUDA acceleration
AXL|AI[CellSegNet]→GPU[RTX_4090]→SEGMENT[AI_SEGMENT]|INTELLIGENT
PROCESS|BATCH[100_Images]→INFERENCE[50ms/image]→LABEL[Unique_IDs]|FAST
ANALYZE|COUNT[Cells]→MEASURE[Area,Shape]→CLASSIFY[Types]→EXPORT[CSV]|COMPLETE`
      },
      {
        name: "Massive Volume Rendering",
        description: "Render and interact with a 10GB+ cleared tissue dataset in real-time.",
        script: `# Interactive volume rendering with CUDA
AXL|VOLUME[MASSIVE_VOLUME]→GPU[Stream]→RENDER[Realtime]|MASSIVE
INTERACT|ROTATE[360°]→ZOOM[1000x]→SLICE[Any_Plane]→FPS[60]|SMOOTH
VISUALIZE|MIP[Maximum]→COLOR[Depth]→SHADOWS[Ambient]→EXPORT[4K]|BEAUTIFUL`
      },
      {
        name: "Multiview Light Sheet Fusion",
        description: "Acquire from 4 angles and fuse into a single high-res volume on the GPU.",
        script: `# GPU-accelerated multiview fusion
AXL|MULTIVIEW_FUSION[4_Angles]→ACQUIRE[Simultaneous]→GPU[Register]|ALIGNED
FUSE|CUDA[Accelerated]→BLEND[Weighted]→RESOLUTION[Enhanced]→TIME[30s]|FAST
OUTPUT|ISOTROPIC[Resolution]→ARTIFACTS[None]→QUALITY[Superior]|PERFECT`
      },
       {
        name: "Live Processing Pipeline",
        description: "Run a full analysis pipeline on live data with less than 50ms latency.",
        script: `# Zero-lag live processing with CUDA
AXL|LIVE_PROCESS[Acquisition]→GPU[Pipeline]→DISPLAY[Instant]|REALTIME
PIPELINE|DENOISE→DECONVOLVE→TRACK→MEASURE→VISUALIZE|PARALLEL
PERFORMANCE|LATENCY[<50ms]→THROUGHPUT[4K@120fps]→CUDA[Optimized]|BLAZING`
      }
    ]
  },
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
  }
];


export const CODE_CONVERTER_EXAMPLES: { name: string, description: string, code: string }[] = [
  {
    name: "AXL: Real-time Deconvolution (MATLAB)",
    description: "Process massive datasets in real-time with GPU acceleration.",
    code: `% Traditional deconvolution - 10+ minutes per frame
for frame = 1:numFrames
    raw_image = imread(sprintf('frame_%04d.tif', frame));
    psf = generatePSF(NA, wavelength, pixelSize);
    
    % Slow CPU deconvolution
    deconv_image = deconvlucy(raw_image, psf, iterations);
    
    % Wait for processing...
    imwrite(deconv_image, sprintf('deconv_%04d.tif', frame));
end`
  },
  {
    name: "AXL: AI Cell Segmentation (MATLAB)",
    description: "Deep learning segmentation on GPU",
    code: `% Complex AI segmentation setup - 300+ lines
model = loadTrainedNetwork('cellSegmentationNet.mat');
gpu = gpuDevice(1);
wait(gpu);

for i = 1:numImages
    img = imread(images{i});
    img_gpu = gpuArray(img);
    
    % Preprocess
    processed = preprocessForNetwork(img_gpu);
    
    % Run inference
    segmentation = predict(model, processed);
    
    % Post-process
    labeled = postprocessSegmentation(segmentation);
    
    % Transfer back from GPU
    result = gather(labeled);
end`
  },
  {
    name: "AXL: Massive Volume Rendering (MATLAB)",
    description: "Render TB-scale datasets interactively.",
    code: `% Volume rendering - requires workstation with 128GB RAM
volume_data = load_volume('mouse_brain_cleared.h5'); % 2TB file
gpu_volume = gpuArray(volume_data);

% Complex rendering pipeline
for angle = 0:360
    projection = maximum_intensity_projection(gpu_volume, angle);
    % ... hundreds of lines of rendering code
end`
  },
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
  }
];

export const NATURAL_LANGUAGE_EXAMPLES: { name: string, description: string, prompt: string }[] = [
  {
    name: "Live Cell Division",
    description: "Track dividing cells over a day with environmental control.",
    prompt: "I want to do a 24-hour time-lapse of live cells dividing. I need to keep them at 37 degrees C with 5% CO2. I want to see two colors, GFP and RFP. It's important to keep them in focus the whole time."
  },
  {
    name: "Zebrafish Embryo Development",
    description: "Gentle 4D imaging of a whole zebrafish embryo.",
    prompt: "Image a developing zebrafish embryo for 6 hours using a lattice light sheet microscope. I need a full 3D volume every 30 seconds. The key is to be very gentle to not damage the sample. After capture, deconvolve it with AI and make a 3D movie."
  },
  {
    name: "Whole Mouse Brain Section",
    description: "Scan and stitch a large, cleared tissue sample.",
    prompt: "I need to image an entire cleared mouse brain section. It's about 10 by 10 millimeters. I need to see two channels, one for DAPI and one for GFP. I'll need to scan it as a grid of tiles and then stitch them together into one big volume."
  },
  {
    name: "Super-Resolution of Cytoskeleton",
    description: "Achieve sub-120nm resolution on fixed cells.",
    prompt: "Use SoRa super-resolution to image the cytoskeleton in fixed cells. I'm looking for 120 nanometer resolution. I've stained them for actin with a 488 dye and tubulin with a 561 dye."
  },
  {
    name: "Targeted Photobleaching (FRAP)",
    description: "Bleach a specific region and monitor its recovery.",
    prompt: "Perform a FRAP experiment. I want to target a small, specific region of interest inside a cell with a 405 nanometer laser at full power to bleach it. Then, I need to monitor the fluorescence recovery in that spot over time."
  },
];

export const DATA_COMPRESSION_EXAMPLES: { name: string, description: string, data: string }[] = [
  {
    name: "Sample JSON Data",
    description: "Compress a typical JSON payload from an API.",
    data: JSON.stringify({
      "experimentId": "EXP-2024-07-29-001",
      "user": "phil_hills",
      "system": "3i_AXL",
      "parameters": {
        "objective": "60x Oil",
        "mode": "Lattice Light Sheet",
        "channels": ["GFP", "RFP"],
        "z_stack": {
          "slices": 200,
          "step_um": 0.5
        },
        "timelapse": {
          "points": 120,
          "interval_s": 30
        }
      },
      "rawDataUri": "/data/raw/exp001.sldy"
    }, null, 2)
  },
  {
    name: "Sample HTML Document",
    description: "Compress a small webpage, similar to AI token saving.",
    data: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>3i Experiment Report</title>
</head>
<body>
    <h1>Experiment EXP-2024-07-29-001</h1>
    <p>Conducted by: Phil Hills</p>
    <p>System: 3i AXL</p>
    <p>This report contains the preliminary findings from the live cell imaging session. Further analysis is pending.</p>
</body>
</html>`
  },
  {
    name: "README.md Content",
    description: "Compress a markdown document.",
    data: `# CUBE Protocol Technical Overview for 3i Systems

## 1. Introduction

CUBE Protocol is a semantic control language designed for 3i's SlideBook software and associated microscopy systems. It standardizes complex microscopy operations into a simple, three-part command structure, aiming to improve reproducibility, automation, and ease of use.

## 2. Core Syntax

The protocol follows a universal \`DOMAIN|SEQUENCE|OUTCOME\` pattern.`
  },
];