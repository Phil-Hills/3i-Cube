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
    category: "3i Workflows (Python SDK)",
    description: "Real Python scripts using the SlideBook SDK (mocked via mock_sb).",
    scripts: [
      {
        name: "Full Stack Pipeline",
        description: "Reads all 164 planes (4 channels × 41 Z), computes intensity stats.",
        script: `from mock_sb import SBAccess
import numpy as np

# Load synthetic data
sb = SBAccess.load("./synthetic_data/stacks")

print("\\n◈ PIPELINE|START\\n")
cap = 0
nz = sb.GetNumZPlanes(cap)
ny = sb.GetNumYRows(cap)
nx = sb.GetNumXColumns(cap)
nc = sb.GetNumChannels(cap)

print(f"  Reading {nz} Z-planes × {nc} channels...")
volume = np.zeros((nc, nz, ny, nx), dtype=np.uint16)

for ch in range(nc):
    for z in range(nz):
        # Real SDK call returning uint16 numpy array
        volume[ch, z] = sb.ReadImagePlaneBuf(cap, 0, 0, z, ch)

print("\\n  ✓ Pipeline complete")
for ch in range(nc):
    name = sb.GetChannelName(cap, ch)
    mean_val = np.mean(volume[ch])
    max_val = np.max(volume[ch])
    print(f"    {name}: mean={mean_val:.0f}  max={max_val:.0f}")
`
      },
      {
        name: "3D Fiducial Registration",
        description: "Automated spatial alignment using Kabsch SVD.",
        script: `from mock_sb import SBAccess
import numpy as np
from scipy.spatial.transform import Rotation as R

sb = SBAccess.load("./synthetic_data/stacks")
print("\\n◈ REGISTRATION|START\\n")

n_pos = sb.GetNumPositions(0)
print(f"  Extracting {n_pos} fiducial points...")

ref_points = []
for pos in range(n_pos):
    x = sb.GetXPosition(0, pos)
    y = sb.GetYPosition(0, pos)
    z = sb.GetZPosition(0, pos)
    ref_points.append([x, y, z])

ref = np.array(ref_points)

# Simulate a second acquisition with slight drift
rng = np.random.default_rng(99)
target = ref + rng.normal(0, 0.5, ref.shape)
true_R = R.from_euler('z', 1.2, degrees=True).as_matrix()
centroid = np.mean(ref, axis=0)
target = ((true_R @ (target - centroid).T).T + centroid)
target += np.array([2.0, -1.5, 0.3])

print("  Computing Kabsch SVD registration...")
c1, c2 = np.mean(ref, axis=0), np.mean(target, axis=0)
H = (ref - c1).T @ (target - c2)
U, _, Vt = np.linalg.svd(H)
rot = Vt.T @ U.T

if np.linalg.det(rot) < 0:
    Vt[-1, :] *= -1
    rot = Vt.T @ U.T

translation = c2 - rot @ c1
aligned = (rot @ ref.T).T + translation
rmse = float(np.sqrt(np.mean(np.sum((aligned - target)**2, axis=1))))

print(f"\\n  ✓ Registration complete")
print(f"    RMSE:        {rmse:.4f} µm")
`
      },
      {
        name: "Hardware Snapshot",
        description: "Captures the full state of the microscope hardware.",
        script: `from mock_sb import SBAccess
from mock_sb import MicroscopeStates
import time

sb = SBAccess.load("./synthetic_data/stacks")
print("\\n◈ HARDWARE|SNAPSHOT\\n")

cap = 0
snapshot = {
    "objective":   sb.GetMicroscopeState(MicroscopeStates.CurrentObjective),
    "filter":      sb.GetMicroscopeState(MicroscopeStates.CurrentFilter),
    "laser_power": sb.GetMicroscopeState(MicroscopeStates.CurrentLaserPower),
    "xy_stage":    sb.GetMicroscopeState(MicroscopeStates.CurrentXYstagePosition),
    "z_stage":     sb.GetMicroscopeState(MicroscopeStates.CurrentZstagePosition),
    "temperature": sb.GetMicroscopeState(MicroscopeStates.CurrentTemperature),
    "magnification": sb.GetMagnification(cap),
    "lens":          sb.GetLensName(cap),
    "voxel_xy_um":   sb.GetVoxelSizeX(cap),
    "voxel_z_um":    sb.GetVoxelSizeZ(cap),
}

print("  Hardware state:")
for k, v in snapshot.items():
    print(f"    {k}: {v}")
`
      },
      {
        name: "Cell Segmentation",
        description: "StarDist3D-style segmentation using connected components.",
        script: `from mock_sb import SBAccess
import numpy as np
from scipy import ndimage
from skimage.filters import threshold_otsu

sb = SBAccess.load("./synthetic_data/stacks")
print("\\n◈ SEGMENTATION|START\\n")

cap = 0
nz = sb.GetNumZPlanes(cap)
ch_idx = 0 # DAPI

print(f"  Reading {nz} Z-planes from DAPI...")
planes = [sb.ReadImagePlaneBuf(cap, 0, 0, z, ch_idx) for z in range(nz)]
volume = np.stack(planes).astype(np.float32)

thresh = threshold_otsu(volume)
binary = volume > thresh

print(f"  Labeling connected components (threshold={thresh:.0f})...")
labeled, n_objects = ndimage.label(binary)

sizes = ndimage.sum(binary, labeled, range(1, n_objects+1))
min_size = 500
for i, s in enumerate(sizes, 1):
    if s < min_size:
        labeled[labeled == i] = 0

labeled, n_cells = ndimage.label(labeled > 0)

print(f"\\n  ✓ Segmentation complete")
print(f"    Cells found: {n_cells}")
print(f"    Volume shape: {labeled.shape}")

new_cap = sb.CreateImageGroup("StarDist_Result", 1, nz, sb.GetNumYRows(cap), sb.GetNumXColumns(cap), 1)
for z in range(nz):
    sb.WriteImagePlaneBuf(new_cap, 0, z, 0, labeled[z].astype(np.uint16))

sb.SaveSlide(1)
`
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
