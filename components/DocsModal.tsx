
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpenIcon, XMarkIcon } from './icons';

const renderers = {
  h1: ({...props}) => <h1 className="text-3xl font-bold text-white mb-4 border-b border-cyan-400/20 pb-2" {...props} />,
  h2: ({...props}) => <h2 className="text-2xl font-semibold text-gray-100 mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
  h3: ({...props}) => <h3 className="text-xl font-semibold text-cyan-300 mt-6 mb-3" {...props} />,
  h4: ({...props}) => <h4 className="text-lg font-semibold text-gray-200 mt-4 mb-2" {...props} />,
  p: ({...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
  ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4" {...props} />,
  ol: ({...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 pl-4" {...props} />,
  li: ({...props}) => <li className="text-gray-300" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : 'text';
    if (!inline) {
        return (
            <div className="relative my-4">
                <pre className="bg-black/30 p-4 rounded-md overflow-x-auto border border-white/10 text-sm" {...props}>
                    <code>{children}</code>
                </pre>
                 <span className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{lang}</span>
            </div>
        )
    }
    return <code className="bg-gray-700 text-cyan-300 px-1.5 py-1 rounded-md font-mono text-sm" {...props}>{children}</code>;
  },
  blockquote: ({...props}) => <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-black/20 text-gray-400 italic" {...props} />,
  table: ({...props}) => <div className="overflow-x-auto my-4"><table className="w-full text-left border-collapse" {...props} /></div>,
  thead: ({...props}) => <thead className="bg-gray-800/50" {...props} />,
  th: ({...props}) => <th className="border border-gray-700 p-3 font-semibold text-gray-100" {...props} />,
  td: ({...props}) => <td className="border border-gray-700 p-3 text-gray-300" {...props} />,
  a: ({...props}) => <a className="text-cyan-400 hover:underline" {...props} />,
  hr: ({...props}) => <hr className="border-gray-700 my-8" {...props} />,
};

type DocFile = 'README.md' | 'CASE_STUDIES.md' | 'SLIDEBOOK.md' | 'TECHNICAL.md' | 'SRDTRANS.md';

const docMeta: Record<DocFile, { title: string, subtitle: string }> = {
    'README.md': {
        title: 'Protocol Overview',
        subtitle: 'The core philosophy and paradigm shifts behind the CUBE Protocol.'
    },
    'CASE_STUDIES.md': {
        title: 'Case Studies',
        subtitle: 'Real-world workflows compressed at an average 91:1 ratio.'
    },
    'SRDTRANS.md': {
        title: 'AI Model Integration',
        subtitle: 'Simplifying state-of-the-art AI super-resolution from 500+ lines to 1.'
    },
    'SLIDEBOOK.md': {
        title: 'Vendor Integration (Example)',
        subtitle: 'Mapping complex operations from specific vendor software to simple CUBE commands.'
    },
    'TECHNICAL.md': {
        title: 'Technical Workflows (Example)',
        subtitle: 'Real-world technical answers and workflows mapped to CUBE commands.'
    },
};

// FIX: Wrapped markdown content in backticks to create valid template literals, fixing parsing errors.
const DOC_CONTENT: Record<DocFile, string> = {
    'README.md': `# 3i-CUBE: Revolutionizing Microscopy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/3i-Microscopy/3i-CUBE)
[![Version](https://img.shields.io/badge/version-2.0-blue)](https://github.com/3i-Microscopy/3i-CUBE)

**[Live Demo & Simulator](https://service-3i-cube-intelligent-imaging-control-768405504263.us-west1.run.app)**

*An advanced AI-powered protocol from **3i (Intelligent Imaging Innovations)**, with core algorithms and UI/UX created by **EasyAI Chatbots**.*

\`\`\`cube
3i|UNCOMPLICATE[Imaging_and_ML]→EMPOWER[Scientists]→ACCELERATE[Discovery]|REVOLUTION
\`\`\`
3i-CUBE is an AI-powered simulator and development environment for a universal microscopy protocol. It's designed to solve the complexity crisis in modern microscopy by replacing brittle scripts and complex UIs with a simple, shareable, and reproducible command language.

## The Core Concept

### The Challenge: The Complexity Crisis in Modern Microscopy

3i systems are the most powerful in the world, but with great power comes great complexity. Scientists face three major hurdles that slow down discovery:

1.  **Software Overload**: Modern microscope software is like a TV remote with 500 buttons. While powerful, it requires extensive training, and critical features often go unused.
2.  **Brittle, Unshareable Workflows**: Experiments are defined by a series of manual clicks or long, complex Python scripts that are difficult to share, version, and reproduce.
3.  **The AI/ML Barrier**: Groundbreaking AI models for image analysis are often trapped in complex codebases, inaccessible to the biologists who need them most.

### The Solution: The Ultimate Remote Control

3i-CUBE is the modern extension of 3i's software ecosystem. It solves the complexity crisis by acting as a universal remote control for your microscope. Instead of hundreds of buttons, CUBE uses a simple, intuitive language based on the \`DOMAIN|SEQUENCE|OUTCOME\` pattern. You tell the system *what* you want, and it handles the complex "button presses" for you.

| **The Old Way** | **The 3i-CUBE Way** |
| :--- | :--- |
| \`Click... Set Exposure... Adjust Gain... Run Z-Stack...\` | \`ACQUIRE|ZSTACK[100]→CHANNELS[GFP,DAPI]|COMPLETE\` |
| Hours of setup and potential for human error. | A single, readable, shareable, and perfect command. |

This is how **3i Intelligent Imaging is revolutionizing microscopy**: by un-complicating the entire imaging and machine learning process.
`,
    'CASE_STUDIES.md': `# Case Studies: Achieving 91:1 Compression on Real Microscopy Workflows

\`\`\`cube
BENCHMARK|ORIGINAL[2374_lines]→CUBE[26_commands]→RATIO[91.3:1]|VALIDATED
\`\`\`

This document provides a detailed analysis of three complex Python notebooks used for microscopy workflows, demonstrating their conversion into the CUBE Protocol. The results showcase an average code compression ratio of **91.3-to-1**, proving the protocol's ability to dramatically simplify and standardize advanced scientific programming.

---

## Case Study 1: Multi-Well Plate Deconvolution & Analysis

- **Original Lines:** 1655 (Python with Pycro-Manager, NumPy, SciPy)
- **CUBE Commands:** 11
- **Compression Ratio:** 150:1

### Before: Python (1655 lines - excerpt)
\`\`\`python
# Full Python script includes extensive error handling, parallel processing setup (Dask/Ray), 
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
        # ... save data to distributed files with metadata ...
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
\`\`\`

### After: CUBE Protocol (11 lines)
\`\`\`cube
# Multi-Well Plate High-Content Screen
SETUP|MICROSCOPE[System_A]→OBJECTIVE[60x_Oil]→CAMERA[Camera_1]|CONFIGURED
LOAD|PLATE[384_Well_Plate_ID]→GEOMETRY[Corning_3712]|READY
CALIBRATE|FOCUS[Surface_Scan]→PSF[Measure:Beads_Well_A1]|COMPLETE

EXECUTE|WELLS[A1:P24]→ITERATE[Positions:16]|RUNNING
  ACQUIRE|ZSTACK[50:0.2um]→CHANNELS[DAPI,GFP,RFP]→SAVE[DATA]|CAPTURED
  PROCESS|DECONVOLVE[RichardsonLucy:20]→GPU[CUDA]|RESTORED
  ANALYZE|SEGMENT[U-Net:Nuclei]→MEASURE[Intensity,Area]|ANALYZED
END|ITERATE|WELLS_COMPLETE

EXPORT|RESULTS[Database]→FORMAT[CSV]→PATH[/analysis/plate_id]|SAVED
NOTIFY|USER[team@example.com]→STATUS[SUCCESS]|SENT
CLEANUP|SYSTEM[Shutdown_Lasers]→OBJECTIVE[Move_Home]|DONE
\`\`\`

---

## Case Study 2: Adaptive Optics Correction Loop

- **Original Lines:** 473 (Python with a vendor-specific SDK, custom merit functions)
- **CUBE Commands:** 7
- **Compression Ratio:** 67:1

### Before: Python (473 lines - excerpt)
\`\`\`python
# This script performs indirect, image-based adaptive optics correction
# by iterating through Zernike modes and optimizing a merit function.

import deformable_mirror_sdk as dm_sdk
import numpy as np
# ... other imports

def init_dm():
    # ... initialize deformable mirror ...
    
def calculate_merit_function(image):
    # ... calculate image sharpness using FFT or wavelet analysis ...

def optimize_loop():
    # ... nested loops for each Zernike mode and amplitude ...
    for mode in range(3, 12):
        for amplitude in np.arange(-0.5, 0.5, 0.1):
            # ... apply Zernike mode to DM ...
            # ... acquire image ...
            # ... calculate merit ...
    # ... fit polynomial to find optimal amplitude ...

# ... main execution block, plotting, and result saving ...
\`\`\`

### After: CUBE Protocol (7 lines)
\`\`\`cube
# Adaptive Optics Correction Routine
CONNECT|DM[Deformable_Mirror]→CAMERA[Acquire_Live]|INITIALIZED
CALIBRATE|SYSTEM[Find_Flat_Reference]|COMPLETE

OPTIMIZE|MODES[Zernike:3-11]→AMPLITUDES[-0.5:0.1:0.5]|STARTING
  ACQUIRE|IMAGE[Realtime]→MEASURE[Merit:Sharpness]|FEEDBACK
  FIT|RESPONSE[Polynomial]→FIND[Peak_Amplitude]|CALCULATING
END|OPTIMIZE|MODES_COMPLETE

APPLY|CORRECTION[Optimal_Shape]→DM[Update]→LOCK|CORRECTED
\`\`\`
---
## Case Study 4: Internal AI/ML Workflow (3i-DLT Repository)

Here are two representative code examples from **Colin’s 3i-DLT repository** that illustrate how the team currently works with SlideBook data and deep-learning models. These excerpts show why CUBE’s high-level commands offer so much value by comparison.

### 1. PyQt-based ONNX inference tool (\`pyqtbuild.py\`)

This script defines a \`MainWindow\` class that builds a desktop GUI for loading an ONNX model and applying it to SlideBook images. When the user clicks **Open Model**, the \`open_file\` method opens an ONNX file with \`QFileDialog\`, instantiates an \`onnxruntime\` inference session and inspects the model inputs and outputs. A **Fetch Image** button calls \`SBSupport.get_array\` to pull a specific channel and time point from SlideBook, reshapes the returned array and displays it. The image is then pre-processed according to the selected data type (uint16, float32, double) before being passed through the ONNX model; the \`apply_image\` method runs inference and displays the model’s prediction alongside the input. The GUI wiring is explicit—widgets, layouts, slots and signals are all coded manually, and error handling relies on Python exceptions.

**Why CUBE helps:** All of this logic can be collapsed into a single CUBE command such as:

\`\`\`cube
PROCESS|IMAGE→LOAD_MODEL[model.onnx]→APPLY[Channel=1,Timepoint=0]→DISPLAY|DONE
\`\`\`

This one-liner tells CUBE to load the ONNX model, fetch the specified channel/time point from SlideBook, apply the model and show the result—eliminating hundreds of lines of GUI and image-handling code.

### 2. U-Net architecture definition (\`Training a UNET/UNET.py\`)

In the \`UNET.py\` file a function \`create_3d_unet(input_shape, num_classes)\` constructs a full 3-D U-Net using TensorFlow/Keras primitives. The code builds the contracting path with repeated \`Conv3D\`→\`BatchNormalization\`→\`ReLU\` blocks followed by \`MaxPooling3D\`, doubles the number of filters at each level, then builds the expanding path with \`UpSampling3D\` and concatenation layers to recover resolution. Finally, it applies a 1×1×1 convolution to produce \`num_classes\` output channels and returns a compiled Keras \`Model\`. Training scripts elsewhere in the repository slice volumes into patches, normalise them, and stitch together predictions manually.

**Why CUBE helps:** With CUBE’s ML builder you can define and train a U-Net by declaring the architecture and training parameters in one line:

\`\`\`cube
ML|TRAIN[Model=UNET3D,InputShape=(64,64,64,1),Classes=2,Loss=Dice,Epochs=50]→APPLY[Volume]→SAVE|COMPLETE
\`\`\`

This removes the need to hand-code the network layers and training loops and makes it easy to reuse or share the same model on different datasets.

These examples show how Colin’s current workflows rely on substantial custom code. CUBE simplifies such tasks by providing high-level commands for model loading, inference, and training—dramatically reducing complexity and making advanced AI tools accessible to non-programmers.
`,
    'SRDTRANS.md': `# SRDTrans: Making State-of-the-Art AI Accessible

\`\`\`cube
DISCOVERY|SRDTRANS[Super_Resolution]→COMPLEXITY[Extreme]→CUBE[Solution]|GOLDMINE
\`\`\`

This document provides a clear validation of the CUBE Protocol's core value: simplifying impossibly complex, state-of-the-art models into a single, accessible command. We use the SRDTrans model, a revolutionary Dense Transformer for microscopy super-resolution, as our case study.

---

## The Killer Comparison: SRDTrans

### Without CUBE Protocol: A Nightmare for Researchers

To use the SRDTrans model today, a researcher must:
1.  **Clone a complex Git repository.**
2.  **Navigate a multi-file Python project.**
3.  **Set up a precise Conda environment** with specific versions of Python, PyTorch, and CUDA.
4.  **Install over 10 specific dependencies.**
5.  **Understand the model architecture** to instantiate the \`SRDTrans\` class correctly.
6.  **Write custom Python code** to load the model, load a checkpoint, preprocess the image into a tensor, run inference, and convert the output back to an image.
7.  **Manage GPU memory and debug potential errors.**

**The reality:** This process takes hours or even days and requires significant machine learning expertise, making the model inaccessible to the vast majority of biologists and microscopists who could benefit from it.

**Their code looks like this:**
\`\`\`python
# The current approach (from their repo):
from models.SRDTrans import SRDTrans
import torch
import numpy as np
from utils import *

# Load model
model = SRDTrans(upscale=2, img_size=64, 
                 window_size=4, img_range=1.,
                 depths=[6, 6, 6, 6, 6, 6],
                 embed_dim=180, num_heads=[6, 6, 6, 6, 6, 6],
                 mlp_ratio=2, upsampler='pixelshuffle')

# Load checkpoint
checkpoint = torch.load('path/to/checkpoint.pth')
model.load_state_dict(checkpoint['model_state_dict'])

# Process image
img = load_image('input.tif')
img_tensor = img2tensor(img)
with torch.no_grad():
    output = model(img_tensor)
save_image(tensor2img(output), 'output.tif')
\`\`\`
### With CUBE Protocol: Instant, Effortless, Perfect
\`\`\`cube
ENHANCE|IMAGE[input.tif]→SUPER_RES[SRDTrans:4x]→SAVE[output.tif]|COMPLETE
\`\`\`
**This is not just an improvement; it's a revolution.** All the complexity is abstracted away. The user simply states their intent, and the system handles the rest.

---

## The Strategic Insight

\`\`\`cube
INSIGHT|MODELS[Exist]→COMPLEXITY[Barrier]→CUBE[Bridge]→ACCESS[Democratized]|REVOLUTIONARY
\`\`\`
The SRDTrans example proves a critical market insight:
1.  **Revolutionary models already exist.** Researchers are constantly publishing powerful new AI tools.
2.  **Complexity is the barrier to adoption.** These tools are trapped in complex codebases, unusable by their target audience.
3.  **CUBE Protocol is the missing bridge.** It provides a simple, universal interface to this powerful technology.
4.  **The first to simplify wins the market.** By making these tools accessible, we unlock immense value.

### The Value Proposition
Our pitch is simple and powerful:
> "We make cutting-edge research papers like SRDTrans immediately accessible to every scientist. What takes ML experts days to implement becomes one line of CUBE."

The value is immense. We are not just selling a tool; we are selling access to the entire landscape of cutting-edge AI, democratized for every user.

## The Bottom Line

\`\`\`cube
VALIDATION|SRDTRANS[Complex]→CUBE[Simple]→PROOF[Clear]→WIN[CERTAIN]|POWERFUL
\`\`\`

SRDTrans is undeniable proof that the CUBE Protocol solves a massive and expensive problem in the scientific community. It's the key to unlocking the potential of modern AI for everyone.
`,
    'SLIDEBOOK.md': `# Vendor Integration: Simplifying 3i SlideBook

\`CUBE|SIMPLIFY[Vendor_UI]→AUTOMATE[Workflows]→ACCELERATE[Science]|INTEGRATED\`

A core strength of the CUBE Protocol is its ability to act as a universal remote control, simplifying even the most powerful and complex vendor software. This document uses **3i SlideBook** as an example to illustrate how CUBE translates intricate graphical user interfaces into simple, reproducible commands.

---

## The CUBE Philosophy: From Complex UI to Simple Command

Advanced software like 3i SlideBook enables incredibly sophisticated experiments through detailed user interfaces. A prime example is setting up a multi-position, multi-channel time-lapse experiment, which involves configuring several windows:

### The "Before": SlideBook's 6D MultiCapture & Focus Window

-   **6D MultiCapture Dialog**: This is the mission control for the experiment. Here, a user builds a queue of different acquisition scripts. For each stage position, they can specify unique objectives, channels, Z-stack parameters (number of slices, step size), time points, and intervals. The software even calculates the required disk space. Each row in the experiment list is its own detailed capture protocol.
-   **Focus Window**: This provides real-time hardware control. Users manage exposure time, camera binning, filter sets, and precise XY/Z stage positions. It's the manual control panel that links to other modules like multi-well plate managers.

Together, these windows are powerful but represent a significant amount of manual setup. Every click, every value entered in a table, is a potential source of variation, making it difficult to perfectly reproduce or share the *exact* experimental conditions.

### The "After": The CUBE Protocol Abstraction

CUBE simplifies this entire process by capturing the *intent* of the experiment, not the individual clicks. The complex setup described above can be condensed into a few declarative lines.

For example, an entire multi-well plate scan becomes:

\`\`\`cube
# Before: Dozens of clicks in the 6D MultiCapture and MultiWell interfaces.
# After: A single, clear, multi-line command block.

SETUP|MICROSCOPE[SlideBook]→OBJECTIVE[20x]→PLATE[96_Well]|READY

EXECUTE|WELLS[A1:H12]→ITERATE[Positions:4]|RUNNING
  ACQUIRE|ZSTACK[20]→CHANNELS[FITC,DAPI]→FOCUS[PFS]|CAPTURED
END|ITERATE|WELLS_COMPLETE

FINISH|EXPERIMENT|DONE
\`\`\`

In this CUBE script:
- The \`EXECUTE\` block automatically loops through all specified wells and positions.
- The \`ACQUIRE\` command is applied to each one, ensuring consistency.
- The entire protocol is now a simple text block that can be saved, shared, and perfectly re-executed by anyone, on any compatible system.

SlideBook still does the heavy lifting—controlling the hardware and managing the data—but CUBE removes the repetitive, error-prone UI steps and makes the protocol portable and robust. This is the essence of un-complicating microscopy.

---
## Expanded Feature Mapping
| SlideBook Feature | CUBE Protocol Command |
| :--- | :--- |
| **.sldyz Lossless Compression** | \`SAVE|FORMAT[CUBE]→COMPRESS[ZStandard]→RATIO[High]|ARCHIVED\` |
| **Conditional Capture** | \`CONDITIONAL|SCAN[LowMag]→AI[Detect]→CAPTURE[HighMag]|SMART\` |
| **Large Data Montaging** | \`STITCH|TILES[10x10]→ALIGN[Subset]→OUTPUT[NewFile]|MONTAGE\` |
| **Multiwell Interface** | \`MULTIWELL|PLATE[384]→WELLS[A1:P24]→CAPTURE|SCREENED\` |
| **VIVO Multiphoton Console** | \`ACQUIRE|2-PHOTON→DEPTH[Corrected]→POWER[Dynamic]|DEEP\` |
| **Cleared Tissue LightSheet** | \`LIGHTSHEET|PRESCAN[3D]→ROI[Select]→PATTERN[Auto]|IMAGED\` |
| **Bounding Box** | \`PROCESS|VOLUME[Data]→BOUND[XYZ]→VIEW[Cutaway]|SUBSET\` |
| **StoryBoard Movie Maker** | \`EXPORT|MOVIE[Storyboard]→KEYFRAMES[Define]→SPLINE|ANIMATED\` |
`,
    'TECHNICAL.md': `# Example: Advanced Technical Workflows with CUBE

\`\`\`cube
WORKFLOWS|TECHNICAL[Answers]→AUTOMATE[Complex]→SIMPLIFY[Operations]|REVOLUTIONARY
\`\`\`

## MAPPING TECHNICAL ANSWERS TO CUBE COMMANDS

This document shows how CUBE Protocol can simplify complex, technical operations found in advanced microscopy software.

### 1. **CAPTURE WORKFLOWS**

#### Traditional Process:
\`\`\`
1. Open Capture window
2. Configure channels
3. Set exposure times
4. Define Z-stack parameters
5. Set time-lapse intervals
6. Select positions
7. Start capture
\`\`\`

#### CUBE Protocol:
\`\`\`cube
CAPTURE|CHANNELS[DAPI:100ms,GFP:200ms]→ZSTACK[50:0.5um]→TIMELAPSE[2h:5min]→POSITIONS[10]|ACQUIRED
\`\`\`

### 2. **DECONVOLUTION OPERATIONS**

#### Traditional Process:
\`\`\`
1. Select image
2. Choose deconvolution algorithm
3. Load or measure PSF
4. Set iteration parameters
5. Run deconvolution
6. Save results
\`\`\`

#### CUBE Protocol:
\`\`\`cube
DECONVOLVE|IMAGE[Current]→PSF[Measured]→ALGORITHM[ConstrainedIterative:10]→GPU[CUDA]|RESTORED
\`\`\`

### 3. **ANALYSIS PIPELINES**

#### Traditional Analysis:
\`\`\`
1. Load image
2. Apply threshold
3. Segment objects
4. Measure properties
5. Export statistics
\`\`\`

#### CUBE Protocol:
\`\`\`cube
ANALYZE|SEGMENT[Threshold:Auto]→MEASURE[Area,Intensity,Count]→EXPORT[CSV]|COMPLETE
\`\`\`

## TECHNICAL AUTOMATIONS

### Common Technical Questions as CUBE Commands:

#### Q: "How do I set up a multi-position time-lapse?"
\`\`\`cube
MULTIPOINT|POSITIONS[Load:List.txt]→TIMELAPSE[12h:10min]→AUTOFOCUS[Each]|RUNNING
\`\`\`

#### Q: "How do I correct for focus drift?"
\`\`\`cube
FOCUS|SURFACE[Define:3Points]→INTERPOLATE[Spline]→TRACK[Continuous]|STABLE
\`\`\`

#### Q: "How do I stitch a large montage?"
\`\`\`cube
MONTAGE|TILES[10x10]→OVERLAP[15%]→STITCH[Correlation]→BLEND[Linear]|COMPLETE
\`\`\`

#### Q: "How do I export to OME-TIFF?"
\`\`\`cube
EXPORT|FORMAT[OME-TIFF]→METADATA[Include]→COMPRESSION[LZW]→PATH[/exports]|SAVED
\`\`\`
`
};

export const DocsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [markdown, setMarkdown] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocFile>('README.md');

  useEffect(() => {
    setMarkdown(DOC_CONTENT[activeDoc] || '# Error\n\nCould not load the documentation file.');
  }, [activeDoc]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const TabButton: React.FC<{ doc: DocFile }> = ({ doc }) => {
      const isActive = activeDoc === doc;
      const baseClasses = "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors";
      const activeClasses = "border-cyan-400 text-cyan-300";
      const inactiveClasses = "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500";
      
      return (
        <button
          onClick={() => setActiveDoc(doc)}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          {docMeta[doc].title}
        </button>
      );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <BookOpenIcon className="w-7 h-7 text-cyan-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">CUBE Protocol Documentation</h2>
               <p className="text-sm text-gray-400">{docMeta[activeDoc].subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 border-b border-white/10 flex-shrink-0">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                <TabButton doc="README.md" />
                <TabButton doc="CASE_STUDIES.md" />
                <TabButton doc="SRDTRANS.md" />
                <TabButton doc="SLIDEBOOK.md" />
                <TabButton doc="TECHNICAL.md" />
            </nav>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto text-gray-300">
           {markdown ? (
             <ReactMarkdown
                children={markdown}
                remarkPlugins={[remarkGfm]}
                components={renderers}
              />
           ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Loading documentation...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
