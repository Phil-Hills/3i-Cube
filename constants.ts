import type { ExampleScriptCategory, ConverterExample } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "AI Media Generation",
    description: "Use generative AI models to create images and videos from text prompts.",
    scripts: [
        {
            name: "VEO Video Generation",
            description: "Generate a short, photorealistic video clip from a text prompt using a simulated VEO model.",
            script: `GENERATE|VIDEO[A photorealistic video of a spaceship flying through a colorful nebula]→MODEL[veo-2.0-generate-001]|RENDERING`
        }
    ]
  },
  {
    category: "AXL with CUDA Acceleration",
    description: "GPU-accelerated workflows for real-time processing and AI.",
    scripts: [
      {
        name: "SRDTrans Super-Resolution",
        description: "Apply a state-of-the-art Dense Transformer model (SRDTrans) for 4x super-resolution.",
        script: `# SRDTrans: 500+ lines of Python -> 1 CUBE command
ENHANCE|IMAGE[input.tif]→SUPER_RES[SRDTrans:4x]→DENOISE→SAVE|HD`
      },
      {
        name: "U-Net Nuclei Segmentation",
        description: "Run a U-Net model on the GPU to segment and label nuclei in an image.",
        script: `# AI segmentation with CUDA acceleration
AXL|AI[U-Net_Nuclei]→GPU[RTX_4090]→SEGMENT|INTELLIGENT
PROCESS|IMAGE[Input]→INFERENCE[25ms]→MASK[Instance]→LABEL[Unique_IDs]|FAST
ANALYZE|COUNT[Nuclei]→MEASURE[Area,Shape]→EXPORT[CSV]|COMPLETE`
      },
      {
        name: "StarDist 3D Cell Tracking",
        description: "Use StarDist 3D for high-accuracy object detection and tracking in a volume over time.",
        script: `# 3D tracking with StarDist
AXL|AI[StarDist_3D]→GPU[RTX_4090]→TRACK[4D_Volume]|PRECISE
PROCESS|TIMESERIES[100_Volumes]→DETECT[Cells]→LINK[Trajectories]|ACCURATE
VISUALIZE|RENDER[3D_Tracks]→COLOR[Time]→EXPORT[Movie]|DYNAMIC`
      },
      {
        name: "Real-time Deconvolution",
        description: "Process a 4K video stream live with GPU-accelerated deconvolution.",
        script: `# GPU-accelerated deconvolution with AXL
AXL|GPU[RTX_4090]→DECONVOLVE[REALTIME_DECONV]→CUDA[ACCELERATED]|INSTANT
PROCESS|STREAM[4K_Video]→DECONV[Live]→DISPLAY[120fps]→LATENCY[8ms]|SMOOTH
SAVE|FORMAT[H265]→COMPRESS[GPU]→BITRATE[100Mbps]|EFFICIENT`
      },
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
    name: "3i Case Study 1: Multi-Well Plate Analysis",
    description: "Original Lines: 1655, CUBE Commands: 11, Ratio: 150:1. A full high-content screening workflow.",
    code: `# Full Python script includes extensive error handling, parallel processing setup (Dask/Ray), 
# database logging, and custom visualization functions using libraries like NumPy, 
# Pycro-Manager, SciPy, Scikit-Image, and a custom U-Net inference engine.

import numpy as np
from pycromanager import Core
from scipy.ndimage import gaussian_filter
from skimage.restoration import richardson_lucy
# ... dozens of other imports for database, parallelization, etc.

class ExperimentManager:
    def __init__(self, db_path, config_path):
        # ... database connection setup ...
        # ... load instrument configuration ...
    
    def run_plate(self, plate_id):
        # ... load plate geometry from database ...
        # ... initialize parallel worker pool ...
        for well in self.get_wells(plate_id):
            # ... submit job to worker: self.process_well(well) ...

    def process_well(self, well):
        # ... move to well, run autofocus routine ...
        raw_data_path = self.acquire_zstack(well)
        decon_data_path = self.analysis_pipeline.deconvolve(raw_data_path)
        segmentation_results = self.analysis_pipeline.segment(decon_data_path)
        self.log_results_to_db(well, segmentation_results)
        return True

    def acquire_zstack(self, well):
        # ... complex multi-channel Z-stack acquisition logic ...
        # ... save data to distributed .sldy files with metadata ...
        return path_to_data

class AnalysisPipeline:
    def __init__(self, psf_path, model_path):
        # ... load PSF and U-Net model weights ...

    def deconvolve(self, data_path):
        # ... load raw data, measure PSF or load from file ...
        # ... run Richardson-Lucy deconvolution on GPU ...
        return path_to_decon_data
    
    def segment(self, deconvolved_data_path):
        # ... load deconvolved data ...
        # ... apply U-Net model for segmentation ...
        # ... measure props (intensity, area) for each nucleus ...
        return props

# ... hundreds of lines for setup, execution, analysis, and teardown ...
# Total original lines: 1655
`
  },
  {
    name: "3i Case Study 2: Adaptive Optics Correction",
    description: "Original Lines: 473, CUBE Commands: 7, Ratio: 67:1. An iterative hardware optimization routine.",
    code: `# This Python script performs indirect, image-based adaptive optics correction
# by iterating through Zernike modes and optimizing a merit function.
# It uses the ALPAO SDK and custom image quality metrics.

import alpaodm
import numpy as np
from scipy.optimize import curve_fit
# ... other imports for camera control and image analysis

class AdaptiveOpticsController:
    def __init__(self):
        self.dm = alpaodm. डीएम() # Initialize ALPAO DM
        # ... camera and device setup ...

    def calculate_merit_function(self, image):
        # ... calculate image sharpness using FFT high-pass filter ...
        return sharpness_metric

    def find_optimal_amplitudes(self, modes, amplitude_range):
        # ... complex nested loops for each Zernike mode and amplitude ...
        for mode in modes:
            merit_values = []
            for amplitude in amplitude_range:
                # ... apply Zernike mode to DM ...
                # ... acquire image from camera ...
                merit = self.calculate_merit_function(image)
                merit_values.append(merit)
            # ... fit polynomial to find the amplitude with the peak merit value ...
            self.optimal_shape[mode] = best_amplitude
    
    def apply_correction(self):
        # ... combine all optimal Zernike modes into a final DM shape ...
        self.dm.send_shape(self.optimal_shape)

# ... main execution block with extensive setup, plotting, and result saving ...
# Total original lines: 473
`
  },
  {
    name: "3i Case Study 3: Live Cell FRAP Experiment",
    description: "Original Lines: 246, CUBE Commands: 8, Ratio: 30:1. A photomanipulation and recovery monitoring workflow.",
    code: `# Python script to perform a multi-ROI FRAP experiment using a 3i Vector scanner.
# Includes environmental control, precise timing, and kinetic analysis.

import time
import numpy as np
from pycromanager import Core
from skimage.draw import polygon
from scipy.optimize import curve_fit

class FrapExperiment:
    def __init__(self, params):
        self.core = Core()
        # ... set temperature, CO2, and perfect focus ...

    def load_rois_from_file(self, path):
        # ... load ROI coordinates from a JSON or text file ...

    def run_frap(self):
        self.acquire_pre_bleach()
        self.execute_bleach()
        self.monitor_post_bleach()
        self.analyze_recovery_kinetics()

    def acquire_pre_bleach(self):
        # ... capture N frames at low laser power for baseline ...

    def execute_bleach(self):
        # ... control Vector scanner to target ROIs ...
        # ... set laser to high power, open shutter for specified duration ...
    
    def monitor_post_bleach(self):
        # ... run high-speed time-lapse to capture recovery ...

    def analyze_recovery_kinetics(self):
        # ... measure mean intensity in ROIs over time ...
        # ... fit exponential curve to data to calculate half-life ...

# ... Main script logic to initialize and run the experiment ...
# Total original lines: 246
`
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