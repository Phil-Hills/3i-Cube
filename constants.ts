
import type { ExampleScriptCategory } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "Live Cell Imaging",
    description: "Long-term imaging of living cells with minimal photodamage.",
    scripts: [
      {
        name: "Live Cell Time-lapse",
        description: "48-hour time-lapse with autofocus and environmental control.",
        script: `SETUP|ENVIRONMENT[37C,5%CO2]→OBJECTIVE[60x-Water]→PERFUSION[On]|READY
MINIMIZE|PHOTODAMAGE→LASER[2%]→EXPOSURE[50ms]→INTERVAL[5min]|GENTLE
EXPERIMENT|LIVE_CELLS→DURATION[48h]→CHANNELS[GFP:Minimal]→AUTOFOCUS[Every-3rd]|RUNNING
ANALYZE|TRACK[Cells]→MEASURE[Division,Migration]→PLOT[Growth]|REALTIME`
      },
      {
        name: "Calcium Imaging",
        description: "High-speed capture of calcium transients upon stimulation.",
        script: `PREPARE|CELLS[Load-Fluo4]→WASH[3x]→EQUILIBRATE[10min]|READY
CAPTURE|CALCIUM→RATE[10Hz]→DURATION[5min]→TRIGGER[Stimulation]|FAST
ANALYZE|PEAKS[Detect]→AMPLITUDE[Measure]→FREQUENCY[Calculate]|QUANTIFIED`
      }
    ]
  },
  {
    category: "Super-Resolution",
    description: "Break the diffraction limit with advanced techniques.",
    scripts: [
      {
        name: "STORM Imaging",
        description: "Stochastic Optical Reconstruction Microscopy for single-molecule localization.",
        script: `PREPARE|SAMPLE[Fix]→LABEL[Alexa647-Antibody]→BUFFER[STORM]|READY
CALIBRATE|DRIFT[Fiducials]→PSF[Measure]→BACKGROUND[Subtract]|OPTIMIZED
ACQUIRE|STORM→FRAMES[50000]→LASER[647nm:100%]→ACTIVATE[405nm:Ramp]|LOCALIZING
RECONSTRUCT|LOCALIZE[ThunderSTORM]→FILTER[Precision<20nm]→RENDER[10nm-Pixels]|SUPER_RES`
      },
      {
        name: "SIM Imaging",
        description: "Structured Illumination Microscopy for 2x resolution improvement.",
        script: `SETUP|SIM[3D]→GRATING[Rotate]→PHASE[5-Steps]→ORIENTATIONS[3]|CONFIGURED
ACQUIRE|MULTI_ANGLE→Z_STACK[-2um:2um:0.125um]→CHANNELS[488,561,647]|STRUCTURED
RECONSTRUCT|SIM[Wiener-Filter]→RESOLUTION[2x-Improvement]→OUTPUT[16bit]|ENHANCED`
      }
    ]
  },
  {
    category: "FRAP/FRET Analysis",
    description: "Analyze protein dynamics and interactions.",
    scripts: [
        {
            name: "FRAP Experiment",
            description: "Measure protein mobility using Fluorescence Recovery After Photobleaching.",
            script: `DEFINE|ROI[Circle-5um]→REFERENCE[Background]→CONTROL[Unbleached]|REGIONS
PREBLEACH|CAPTURE[10-Frames]→BASELINE[Establish]→READY|INITIALIZED
BLEACH|ROI→LASER[488nm:100%]→DURATION[500ms]→VERIFY[Bleached]|EXECUTED
RECOVER|MONITOR→INTERVAL[1s]→DURATION[5min]→FIT[Exponential]|ANALYZING
CALCULATE|MOBILE_FRACTION→HALF_TIME→DIFFUSION[Coefficient]|QUANTIFIED`
        },
        {
            name: "FRET Biosensor",
            description: "Use a biosensor to measure Förster Resonance Energy Transfer.",
            script: `SETUP|FRET_PAIR[CFP-YFP]→EXCITATION[440nm]→DETECTION[CFP:480nm,FRET:535nm]|CONFIGURED
CALIBRATE|DONOR_ONLY→ACCEPTOR_ONLY→BLEEDTHROUGH[Calculate]|CORRECTED
ACQUIRE|RATIO_IMAGING→CHANNELS[Simultaneous]→TREATMENT[Add-Stimulus]|MONITORING
ANALYZE|RATIO[FRET/CFP]→NORMALIZE→PLOT[Time-Course]→STATISTICS|PROCESSED`
        }
    ]
  },
  {
    category: "Neuroscience",
    description: "Applications for brain slice and in vivo imaging.",
    scripts: [
        {
            name: "Brain Slice Electrophysiology",
            description: "Combine two-photon imaging with whole-cell patch clamp recording.",
            script: `PREPARE|SLICE[300um]→PERFUSE[ACSF]→TEMPERATURE[32C]→OXYGENATE[95/5]|VIABLE
PATCH|NEURON[Layer5-Pyramidal]→SEAL[GigaOhm]→BREAK[Whole-Cell]|RECORDING
IMAGE|TWO_PHOTON→EXCITATION[920nm]→Z_STACK[Dendrites]→LINE_SCAN[Spines]|STRUCTURAL
STIMULATE|UNCAGE[MNI-Glutamate]→LOCATION[Spine]→MONITOR[Calcium]|FUNCTIONAL`
        },
        {
            name: "In Vivo Two-Photon Imaging",
            description: "Image neuronal activity in a live, head-fixed mouse.",
            script: `SETUP|MOUSE[Head-Fixed]→WINDOW[Cranial]→ANESTHESIA[Isoflurane-1%]|PREPARED
ALIGN|TWO_PHOTON→FIND[Surface-Vessels]→NAVIGATE[Cortex-Layer2/3]|POSITIONED
IMAGE|NEURONS[GCaMP6]→DEPTH[150um]→RATE[30Hz]→DURATION[Trial]|RECORDING
STIMULUS|PRESENT[Visual-Grating]→REPEAT[20x]→RANDOMIZE[Orientation]|EXPERIMENTAL`
        }
    ]
  }
];


export const EXAMPLE_PYTHON_CODE = `# Example 3i Microscope Code
import numpy as np
from pycromanager import Core
import tifffile
import time

# Initialize microscope
core = Core()
core.loadSystemConfiguration("3i_marianas_config.cfg")

# Set up imaging parameters
exposure_time = 100
core.setExposure(exposure_time)

# Configure channels
channels = ['DAPI', 'GFP', 'RFP']
for channel in channels:
    core.setConfig('Channel', channel)
    core.waitForConfig('Channel', channel)
    
    # Capture image
    core.snapImage()
    image = core.getImage()
    
    # Save image
    filename = f"cell_{channel}.tif"
    tifffile.imwrite(filename, image)
    
    time.sleep(0.5)

# Run time-lapse
num_timepoints = 20
interval = 300  # 5 minutes

for t in range(num_timepoints):
    for channel in channels:
        core.setConfig('Channel', channel)
        core.snapImage()
        image = core.getImage()
        tifffile.imwrite(f"timelapse_{channel}_t{t:03d}.tif", image)
    
    if t < num_timepoints - 1:
        time.sleep(interval)
`;
