import type { ExampleScriptCategory, ConverterExample } from './types';

export const METHOD_SCRIPTS: ExampleScriptCategory[] = [
  {
    category: "Agent Delegation",
    description: "Demonstrates agent-to-agent task delegation (Claims 28-30).",
    scripts: [
      {
        name: "Recursive Delegation Demo",
        description: "A master agent delegates a task to a specialized agent.",
        script: `DELEGATE|TASK[FindCells]→AGENT[CellFinder]|DISPATCHED
ACQUIRE|ZSTACK[50]→CHANNELS[DAPI]|CAPTURED
RETURN|DATA[CellLocations]→AGENT[Master]|RECEIVED`
      }
    ]
  },
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
    category: "3i Workflows",
    description: "Automated workflows specific to 3i systems.",
    scripts: [
      {
        name: "3D Fiducial Registration",
        description: "Automated spatial alignment — replaces 288 lines of Python",
        script: `# 3D Fiducial Point Registration
# Kabsch SVD alignment via Brain Registrar agent
REGISTER|FIDUCIAL[ref=REF1.mlt.prefs,target=3Montage.mlt.prefs]→LOAD|READY
ALIGN|3D→POINTS[auto_detect]→TRANSFORM[rigid:SVD]→ERROR[threshold=0.5um]|ALIGNED
VERIFY|REGISTRATION→RECEIPT[BLAKE3]→EXPORT[registered.mlt.prefs]|COMPLETE`
      },
      {
        name: "SlideBook Acquisition Pipeline",
        description: "Full acquisition → analysis pipeline with receipts",
        script: `# SlideBook Acquisition Pipeline
# Connects via SBAccess socket protocol
CONNECT|SLIDEBOOK[socket:localhost:5000]→STATUS|READY
ACQUIRE|CAPTURE[channels=3,z_planes=50,timepoints=1]→STORE|RECORDING
CUBIFY|VOLUME[128x128x128]→SPLIT[auto_pad]→CUBES|READY
ANALYZE|CUBES→SEGMENT[StarDist3D:threshold=0.4]→RESULTS|STORED
VERIFY|PIPELINE→RECEIPT[BLAKE3]→EXPORT[results.sld]|COMPLETE`
      },
      {
        name: "Oil Immersion Automation",
        description: "Automated objective switch with OilBoy — BLE hardware control",
        script: `# Oil Immersion Objective Switch
# OilBoy BLE + SlideBook stage control
CONNECT|OILBOY[BLE:serial=OB001]→STATUS|READY
ACQUIRE|LOW_POWER[20x_air]→IMAGE[preview]|CAPTURED
SWITCH|OBJECTIVE[oilboy_position]→PUMP[oil_amount=50]→STAGE[raise:offset]|OILING
STAGE[lower]→SWITCH|OBJECTIVE[100x_oil]→ACQUIRE[100x]|CAPTURED
VERIFY|ACQUISITION→RECEIPT[BLAKE3]|COMPLETE`
      },
      {
        name: "Deep Learning Inference",
        description: "Run trained UNET/StarDist on cubified volumes",
        script: `# Deep Learning Inference Pipeline
# prediction_cubes.py cubify → model → uncubify
LOAD|VOLUME[capture_index=0]→READ[all_planes]|LOADED
CUBIFY|3D[shape=128x128x128]→PAD[auto]→CUBES[n=auto]|READY
PREDICT|MODEL[StarDist3D]→CUBES[batch]→MASKS|SEGMENTED
UNCUBIFY|MASKS→REASSEMBLE[original_shape]→VOLUME|RECONSTRUCTED
VERIFY|PREDICTIONS→RECEIPT[BLAKE3]→WRITE[SlideBook]|COMPLETE`
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
