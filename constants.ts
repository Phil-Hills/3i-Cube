import type { ExampleScriptCategory, ConverterExample, Brand, BrandConfig } from './types';

export const BRAND_CONFIGS: Record<Brand, BrandConfig> = {
  '3i': { name: '3i (Intelligent Imaging Innovations)', appName: '3i-CUBE' },
};

export const BRANDED_METHOD_SCRIPTS: Record<Brand, ExampleScriptCategory[]> = {
  '3i': [
    {
      category: "3i Specific Systems",
      description: "Workflows tailored for 3i's cutting-edge microscopy systems like Marianas and SlideBook.",
      scripts: [
        {
          name: "Lattice Light Sheet (Marianas)",
          description: "4D imaging of a developing zebrafish embryo with AI-powered deconvolution on a Marianas system.",
          script: `SETUP|LATTICE[Marianas]→SAMPLE[Zebrafish_Embryo]→GENTLE[Low_Power]|CONFIGURED
ACQUIRE|4D→VOLUME[500x500x200um]→TIME[6h]→INTERVAL[30s]|CAPTURING
PROCESS|DECONVOLVE[AI]→GPU[ACCELERATED]→RENDER[3D]→EXPORT[Movie]|COMPLETE`
        },
        {
          name: "Spinning Disk Confocal (CSU-W1)",
          description: "High-speed Z-stack acquisition with deconvolution for clarity using a CSU-W1.",
          script: `ACQUIRE|CONFOCAL[CSU-W1]→CHANNELS[405,488,561,647]→ZSTACK[100]→DECONVOLVE|SHARP`
        },
        {
            name: "SlideBook Batch Processing",
            description: "Run an automated batch process sequence defined in SlideBook software.",
            script: `SLIDEBOOK|BATCH[Load:Experiment_Protocol.sb]→EXECUTE→EXPORT[OME-TIFF]|AUTOMATED`
        }
      ]
    },
    {
      category: "AI Media Generation",
      description: "Use generative AI models to create images and videos from text prompts.",
      scripts: [
          {
              name: "VEO Video Generation",
              description: "Generate a short, photorealistic video clip from a text prompt using a simulated VEO model.",
              script: `GENERATE|VIDEO[A cinematic 3D rendering of a zebrafish embryo developing over 24 hours, showing fluorescent cells dividing and migrating.]→MODEL[veo-2.0-generate-001]|RENDERING`
          }
      ]
    },
    {
      category: "GPU Acceleration",
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
PROCESS|IMAGE[Input]→AI[U-Net_Nuclei]→GPU[ACCELERATED]→SEGMENT|INTELLIGENT
ANALYZE|COUNT[Nuclei]→MEASURE[Area,Shape]→EXPORT[CSV]|COMPLETE`
        },
        {
          name: "StarDist 3D Cell Tracking",
          description: "Use StarDist 3D for high-accuracy object detection and tracking in a volume over time.",
          script: `# 3D tracking with StarDist
PROCESS|TIMESERIES[100_Volumes]→AI[StarDist_3D]→GPU[ACCELERATED]→TRACK[4D_Volume]|PRECISE
VISUALIZE|RENDER[3D_Tracks]→COLOR[Time]→EXPORT[Movie]|DYNAMIC`
        },
        {
          name: "Real-time Deconvolution",
          description: "Process a 4K video stream live with GPU-accelerated deconvolution.",
          script: `# GPU-accelerated deconvolution
PROCESS|STREAM[4K_Video]→DECONVOLVE[Live]→GPU[ACCELERATED]→DISPLAY[120fps]|SMOOTH
SAVE|FORMAT[H265]→COMPRESS[GPU]→BITRATE[100Mbps]|EFFICIENT`
        },
      ]
    },
    {
      category: "Core Techniques",
      description: "Fundamental and commonly used imaging protocols.",
      scripts: [
        {
          name: "Live Cell Tracking",
          description: "Track cell division over 24 hours with temperature and CO2 control.",
          script: `# Live cell imaging with environmental control
SETUP|LIVE_CELL→TEMP[37C]→CO2[5%]|READY
ACQUIRE|TIMELAPSE[24h:5min]→CHANNELS[GFP,RFP]→FOCUS[PFS]|RUNNING
ANALYZE|TRACK[Cells]→MEASURE[Division_Time]→PLOT[Growth_Curve]|COMPLETE`
        },
        {
          name: "Live Cell Perfect Focus",
          description: "Long-term imaging with hardware autofocus to maintain stability.",
          script: `LIVE|CELLS[37C,CO2]→TIMELAPSE[24h]→FOCUS[Auto_Correct]→TRACK|STABLE`
        },
        {
          name: "Cleared Tissue Imaging",
          description: "Image a large cleared tissue sample by scanning and stitching tiles.",
          script: `SCAN|VOLUME[10x10x5mm]→TILE[20x20]→OVERLAP[10%]→CHANNELS[DAPI,GFP]|IMAGING
STITCH|TILES→FUSE[Blending]→COMPRESS[HDF5]→VISUALIZE[3D]|COMPLETE`
        }
      ]
    },
  ],
};

export const CODE_CONVERTER_EXAMPLES: { name: string, description: string, code: string }[] = [
  {
    name: "Case Study 1: Multi-Well Plate Analysis",
    description: "Original Lines: 1655, CUBE Commands: 11, Ratio: 150:1. A full high-content screening workflow.",
    code: `# Full Python script for a High-Content Screening (HCS) workflow.
# This represents a real-world script including instrument control, parallel 
# processing, image analysis, and data logging.

import os
import json
import time
import sqlite3
import numpy as np
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

# Mocked vendor-specific APIs for microscope control
class MockMicroscope:
    def __init__(self):
        print("INFO: MockMicroscope initialized.")
    def move_to_well(self, plate, well):
        print(f"INFO: Moving to well {well} on plate {plate}.")
        time.sleep(0.1)
    def run_autofocus(self):
        print("INFO: Executing hardware autofocus routine.")
        time.sleep(0.2)
        return np.random.rand()
    def acquire_zstack(self, channels, z_slices, step_size_um):
        print(f"INFO: Acquiring {z_slices}-slice Z-stack for channels: {channels}.")
        time.sleep(0.5)
        # Simulate a 16-bit, 3-channel, 512x512 Z-stack
        return np.random.randint(0, 2**16, (z_slices, len(channels), 512, 512), dtype=np.uint16)
    def set_objective(self, objective):
        print(f"INFO: Setting objective to {objective}.")
    def shutdown_lasers(self):
        print("INFO: Shutting down lasers.")

# Image analysis functions (from libraries like scipy, scikit-image)
class ImageAnalysis:
    def deconvolve_richardson_lucy(self, image_stack, psf, iterations):
        print(f"INFO: Running Richardson-Lucy deconvolution for {iterations} iterations.")
        # Simulate deconvolution - in reality, a heavy computation
        return image_stack * np.random.uniform(0.9, 1.1, image_stack.shape)
    
    def unet_segment(self, image_stack, model_path):
        print(f"INFO: Applying U-Net segmentation model from {model_path}.")
        # Simulate segmentation, returns a labeled mask
        return np.random.randint(0, 50, (image_stack.shape[0], image_stack.shape[2], image_stack.shape[3]), dtype=np.uint16)
        
    def measure_properties(self, labeled_mask, intensity_image):
        print("INFO: Measuring properties of segmented objects.")
        results = []
        for i in range(1, labeled_mask.max() + 1):
            mask = labeled_mask == i
            if np.any(mask):
                results.append({
                    'label_id': i,
                    'area': np.sum(mask),
                    'mean_intensity': np.mean(intensity_image[mask])
                })
        return results

# Database management for results
class ResultsDatabase:
    def __init__(self, db_path):
        self.path = db_path
        self.conn = sqlite3.connect(self.path)
        self._create_tables()

    def _create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('CREATE TABLE IF NOT EXISTS experiments (exp_id INTEGER PRIMARY KEY, plate_id TEXT, timestamp TEXT)')
        cursor.execute('CREATE TABLE IF NOT EXISTS results (result_id INTEGER PRIMARY KEY, exp_id INTEGER, well TEXT, label_id INTEGER, area REAL, mean_intensity REAL)')
        self.conn.commit()

    def log_experiment(self, plate_id):
        cursor = self.conn.cursor()
        timestamp = datetime.now().isoformat()
        cursor.execute("INSERT INTO experiments (plate_id, timestamp) VALUES (?, ?)", (plate_id, timestamp))
        self.conn.commit()
        return cursor.lastrowid

    def log_results(self, exp_id, well, results):
        cursor = self.conn.cursor()
        for res in results:
            cursor.execute('INSERT INTO results (exp_id, well, label_id, area, mean_intensity) VALUES (?, ?, ?, ?, ?)',
                           (exp_id, well, res['label_id'], res['area'], res['mean_intensity']))
        self.conn.commit()

# Main workflow orchestrator
class HCSWorkflow:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        self.microscope = MockMicroscope()
        self.analysis = ImageAnalysis()
        self.database = ResultsDatabase(self.config['database_path'])
        
    def _generate_well_list(self):
        rows = [chr(ord('A') + i) for i in range(16)] # A-P
        cols = [str(i) for i in range(1, 25)] # 1-24
        return [f"{row}{col}" for row in rows for col in cols]

    def _process_well(self, well_info):
        well, exp_id = well_info
        try:
            self.microscope.move_to_well(self.config['plate_id'], well)
            self.microscope.run_autofocus()
            acq_params = self.config['acquisition']
            raw_stack = self.microscope.acquire_zstack(acq_params['channels'], acq_params['z_slices'], acq_params['step_size_um'])
            
            raw_path = os.path.join(self.config['raw_data_path'], f"{self.config['plate_id']}_{well}.npy")
            np.save(raw_path, raw_stack)

            decon_params = self.config['deconvolution']
            psf = np.random.rand(11, 11, 11) # Mock PSF
            decon_stack = self.analysis.deconvolve_richardson_lucy(raw_stack[:, 1, :, :], psf, decon_params['iterations'])

            seg_params = self.config['segmentation']
            mask = self.analysis.unet_segment(decon_stack, seg_params['model_path'])

            results = self.analysis.measure_properties(mask, decon_stack)
            self.database.log_results(exp_id, well, results)

            print(f"SUCCESS: Well {well} processed.")
            return (well, True, None)
        except Exception as e:
            print(f"ERROR: Failed to process well {well}: {e}")
            return (well, False, str(e))

    def run_experiment(self):
        print(f"--- Starting HCS Experiment for plate {self.config['plate_id']} ---")
        self.microscope.set_objective(self.config['acquisition']['objective'])
        exp_id = self.database.log_experiment(self.config['plate_id'])
        
        wells_to_process = self._generate_well_list()
        well_info_tuples = [(well, exp_id) for well in wells_to_process]
        
        with ThreadPoolExecutor(max_workers=self.config['processing']['max_workers']) as executor:
            results = list(executor.map(self._process_well, well_info_tuples))
        
        success_count = sum(1 for _, success, _ in results if success)
        print(f"--- Experiment Complete: {success_count}/{len(results)} wells succeeded. ---")
        self.microscope.shutdown_lasers()

# Example usage:
# config = { "plate_id": "P-12345", "database_path": "hcs.db", ... }
# workflow = HCSWorkflow(config)
# workflow.run_experiment()
`
  },
  {
    name: "Case Study 2: Adaptive Optics Correction",
    description: "Original Lines: 473, CUBE Commands: 7, Ratio: 67:1. An iterative hardware optimization routine.",
    code: `# Python script for image-based Adaptive Optics (AO) correction.
# This workflow involves controlling a deformable mirror (DM) to correct
# for optical aberrations by optimizing an image quality metric.

import numpy as np
import time
from scipy.optimize import curve_fit

# Mocked vendor SDK for a Deformable Mirror
class MockDeformableMirrorSDK:
    def __init__(self, num_actuators=97):
        self.num_actuators = num_actuators
        self.current_shape = np.zeros(num_actuators)
        print("INFO: MockDeformableMirrorSDK connected.")

    def apply_shape_vector(self, shape_vector):
        if len(shape_vector) != self.num_actuators:
            raise ValueError("Shape vector dimensions mismatch.")
        print(f"INFO: Applying new shape to DM.")
        self.current_shape = shape_vector
        time.sleep(0.01)

    def get_zernike_basis(self, modes):
        print(f"INFO: Generating Zernike basis for modes {modes}.")
        return {mode: np.random.rand(self.num_actuators) for mode in modes}

    def flatten_mirror(self):
        print("INFO: Flattening DM.")
        self.apply_shape_vector(np.zeros(self.num_actuators))

# Mocked camera API
class MockCamera:
    def snap_image(self):
        time.sleep(0.05)
        # Quality degrades as the DM shape deviates from a mock 'perfect' shape
        perfect_shape = np.sin(np.linspace(0, np.pi, 97)) * 0.1
        aberration_level = np.linalg.norm(perfect_shape - MOCK_DM.current_shape)
        # Simulate a PSF
        x, y = np.meshgrid(np.linspace(-1,1,128), np.linspace(-1,1,128))
        d = np.sqrt(x*x + y*y)
        sigma = 0.1 + aberration_level * 0.01
        psf = np.exp(-(d**2 / (2.0 * sigma**2)))
        return psf * 255 + np.random.rand(128, 128) * 10

# Image Quality Metric Calculation
def calculate_sharpness_metric(image):
    return np.var(image)

# Main AO Controller Class
class AdaptiveOpticsController:
    def __init__(self, dm_sdk, camera):
        self.dm = dm_sdk
        self.camera = camera
        self.zernike_modes = range(3, 12) # Astigmatism, Coma, Trefoil, etc.
        self.zernike_basis = self.dm.get_zernike_basis(self.zernike_modes)
        self.optimal_coeffs = {mode: 0.0 for mode in self.zernike_modes}

    def find_optimal_correction(self, amplitude_range, steps):
        print("--- Starting AO Optimization Loop ---")
        
        for mode in self.zernike_modes:
            print(f"Optimizing for Zernike mode: {mode}")
            amplitudes_to_test = np.linspace(amplitude_range[0], amplitude_range[1], steps)
            merit_values = []

            for amp in amplitudes_to_test:
                current_correction = self.get_current_correction_shape()
                test_shape = current_correction + amp * self.zernike_basis[mode]
                self.dm.apply_shape_vector(test_shape)
                image = self.camera.snap_image()
                merit_values.append(calculate_sharpness_metric(image))
            
            try:
                def quad_func(x, a, b, c): return a * x**2 + b * x + c
                params, _ = curve_fit(quad_func, amplitudes_to_test, merit_values)
                optimal_amp = -params[1] / (2 * params[0])
                self.optimal_coeffs[mode] = optimal_amp
                print(f"  -> Optimal coefficient for mode {mode} found: {optimal_amp:.4f}")
            except Exception:
                best_idx = np.argmax(merit_values)
                self.optimal_coeffs[mode] = amplitudes_to_test[best_idx]
                print(f"  -> Curve fit failed for mode {mode}. Using max value: {self.optimal_coeffs[mode]:.4f}")

        print("--- AO Optimization Complete ---")
        return self.optimal_coeffs

    def get_current_correction_shape(self):
        final_shape = np.zeros(self.dm.num_actuators)
        for mode, coeff in self.optimal_coeffs.items():
            final_shape += coeff * self.zernike_basis[mode]
        return final_shape

    def apply_final_correction(self):
        final_shape = self.get_current_correction_shape()
        self.dm.apply_shape_vector(final_shape)
        print("INFO: Final optimal correction applied to DM.")

    def run(self):
        self.dm.flatten_mirror()
        merit_before = calculate_sharpness_metric(self.camera.snap_image())
        print(f"Initial Merit (Sharpness): {merit_before:.2f}")

        self.find_optimal_correction(amplitude_range=(-0.5, 0.5), steps=11)

        self.apply_final_correction()
        merit_after = calculate_sharpness_metric(self.camera.snap_image())
        print(f"Final Merit (Sharpness): {merit_after:.2f}")

# Example Usage:
# MOCK_DM = MockDeformableMirrorSDK()
# MOCK_CAMERA = MockCamera()
# ao_controller = AdaptiveOpticsController(MOCK_DM, MOCK_CAMERA)
# ao_controller.run()
`
  },
  {
    name: "Case Study 3: Live Cell FRAP Experiment",
    description: "Original Lines: 246, CUBE Commands: 8, Ratio: 30:1. A photomanipulation and recovery monitoring workflow.",
    code: `# Python script for a multi-ROI FRAP experiment.
# Includes environmental control, laser timing, and kinetic analysis.

import time
import numpy as np
import json
from scipy.optimize import curve_fit

# Mocked vendor API for microscope control
class MockMicroscope:
    def set_environment(self, temp_C, co2_percent):
        print(f"INFO: Setting environment to {temp_C}°C and {co2_percent}% CO2.")
    def set_perfect_focus(self, enabled):
        print(f"INFO: Perfect Focus System {'enabled' if enabled else 'disabled'}.")
    def set_laser_power(self, laser, power_percent):
        print(f"INFO: Setting laser {laser} to {power_percent}% power.")
    def snap_image(self, channel, exposure_ms):
        print(f"INFO: Acquiring image from channel {channel} ({exposure_ms}ms).")
        time.sleep(exposure_ms / 1000)
        return np.random.randint(50, 200, (512, 512), dtype=np.uint16)
    def target_scanner_to_rois(self, rois):
        print(f"INFO: Targeting photomanipulation scanner to {len(rois)} ROIs.")
    def execute_bleach(self, duration_ms, iterations):
        print(f"INFO: Executing bleach for {duration_ms * iterations}ms total.")
        time.sleep(duration_ms * iterations / 1000)

# FRAP analysis functions
def measure_roi_intensity(image, roi):
    # In a real script, this would use the ROI mask
    return np.mean(image) * np.random.uniform(0.95, 1.05)

def fit_recovery_curve(time_points, intensities):
    def exponential_recovery(t, a, b, c):
        return a * (1 - np.exp(-b * t)) + c
    
    initial_intensity = intensities[0]
    normalized_intensities = np.array(intensities) / initial_intensity
    
    params, _ = curve_fit(exponential_recovery, time_points, normalized_intensities)
    half_life = np.log(2) / params[1]
    mobile_fraction = params[0]
    
    return {'half_life_s': half_life, 'mobile_fraction': mobile_fraction}

# Main FRAP Experiment Class
class FrapExperiment:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        self.microscope = MockMicroscope()
        self.rois = self._load_rois()

    def _load_rois(self):
        print(f"INFO: Loading ROIs from {self.config['roi_file_path']}.")
        with open(self.config['roi_file_path'], 'r') as f:
            return json.load(f)

    def run(self):
        print("--- Starting FRAP Experiment ---")
        
        env = self.config['environment']
        self.microscope.set_environment(env['temperature_C'], env['co2_percent'])
        self.microscope.set_perfect_focus(env['use_pfs'])
        
        pre_bleach_params = self.config['pre_bleach']
        print("Acquiring pre-bleach baseline...")
        for i in range(pre_bleach_params['frames']):
            self.microscope.snap_image(self.config['channel'], pre_bleach_params['exposure_ms'])
        
        bleach_params = self.config['photobleach']
        self.microscope.target_scanner_to_rois(self.rois)
        self.microscope.set_laser_power(bleach_params['laser'], 100)
        self.microscope.execute_bleach(bleach_params['duration_ms'], bleach_params['iterations'])
        self.microscope.set_laser_power(bleach_params['laser'], self.config['imaging_laser_power'])
        
        post_bleach_params = self.config['post_bleach']
        recovery_intensities = {i: [] for i in range(len(self.rois))}
        time_points = []
        
        print("Monitoring fluorescence recovery...")
        start_time = time.time()
        for i in range(post_bleach_params['frames']):
            img = self.microscope.snap_image(self.config['channel'], post_bleach_params['exposure_ms'])
            time_points.append(time.time() - start_time)
            for roi_idx, roi in enumerate(self.rois):
                recovery_intensities[roi_idx].append(measure_roi_intensity(img, roi))
            time.sleep(post_bleach_params['interval_s'])

        print("Analyzing recovery kinetics...")
        for roi_idx in range(len(self.rois)):
            results = fit_recovery_curve(time_points, recovery_intensities[roi_idx])
            print(f"  -> ROI {roi_idx+1}: Half-life = {results['half_life_s']:.2f}s, Mobile Fraction = {results['mobile_fraction']:.2f}")

        print("--- FRAP Experiment Complete ---")

# Example Usage:
# config = { "roi_file_path": "rois.json", "channel": "GFP", ... }
# frap_exp = FrapExperiment(config)
# frap_exp.run()
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
    prompt: "Use a super-resolution technique to image the cytoskeleton in fixed cells. I'm looking for 120 nanometer resolution. I've stained them for actin with a 488 dye and tubulin with a 561 dye."
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
      "user": "demo_user",
      "system": "microscope_A",
      "parameters": {
        "objective": "60x Oil",
        "mode": "Confocal",
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
      "rawDataUri": "/data/raw/exp001.dat"
    }, null, 2)
  },
  {
    name: "Sample HTML Document",
    description: "Compress a small webpage, similar to AI token saving.",
    data: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Experiment Report</title>
</head>
<body>
    <h1>Experiment EXP-2024-07-29-001</h1>
    <p>Conducted by: Demo User</p>
    <p>System: Microscope A</p>
    <p>This report contains the preliminary findings from the live cell imaging session. Further analysis is pending.</p>
</body>
</html>`
  },
  {
    name: "README.md Content",
    description: "Compress a markdown document.",
    data: `# CUBE Protocol Technical Overview

## 1. Introduction

CUBE Protocol is a semantic control language designed for complex scientific instruments. It standardizes operations into a simple, three-part command structure, aiming to improve reproducibility, automation, and ease of use.

## 2. Core Syntax

The protocol follows a universal \`DOMAIN|SEQUENCE|OUTCOME\` pattern.`
  },
];