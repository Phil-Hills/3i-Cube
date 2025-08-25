# CUBE Protocol Technical Overview for 3i Systems

## 1. Introduction

CUBE Protocol is a semantic control language designed for 3i's SlideBook software and associated microscopy systems. It standardizes complex microscopy operations into a simple, three-part command structure, aiming to improve reproducibility, automation, and ease of use.

## 2. Core Syntax

The protocol follows a universal `DOMAIN|SEQUENCE|OUTCOME` pattern.

- **DOMAIN**: The system, context, or high-level command (e.g., `CAPTURE`, `PROCESS`).
- **SEQUENCE**: A chain of operations and parameters, separated by `→` (e.g., `ZSTACK[100]→CHANNELS[GFP,DAPI]`).
- **OUTCOME**: The expected result or state (e.g., `COMPLETE`, `ACQUIRED`).

### Example

A multi-dimensional acquisition can be expressed in a single line:

```cube
CAPTURE|ZSTACK[100]→CHANNELS[GFP,DAPI,RFP]→TIMELAPSE[5min]→DECONVOLVE|COMPLETE
```

This command replaces potentially hundreds of lines of traditional script code.

## 3. Key Capabilities

### A. System & Hardware Control
CUBE provides direct semantic control over all aspects of the microscopy system.

**Microscope:**
```cube
SCOPE|OBJECTIVE[40x]→IMMERSION[Oil]→POSITION[X:100,Y:200]|READY
```
**Camera:**
```cube
CAMERA|DEVICE[Hamamatsu-ORCA]→EXPOSURE[50ms]→BINNING[2x2]|CONFIGURED
```
**Lasers:**
```cube
LASER|POWER[488nm:20%,561nm:30%]→AOTF[Enable]|ALIGNED
```

### B. SlideBook Module Integration
The protocol maps directly to key SlideBook analysis and processing modules.

| Module | CUBE Domain | Example |
|---|---|---|
| 3D Deconvolution | `DECONVOLVE` | `DECONVOLVE\|PSF[Measured]→GPU[CUDA]\|RESTORED` |
| FRET | `FRET` | `FRET\|DONOR[CFP]→ACCEPTOR[YFP]\|MEASURED` |
| Photomanipulation | `PHOTOMANIP` | `PHOTOMANIP\|FRAP[ROI]→BLEACH\|COMPLETE` |

### C. Advanced Applications
Complex, multi-stage experiments can be defined concisely.

**Cleared Tissue Imaging:**
```cube
LIGHTSHEET|TISSUE[Brain]→SCAN[4.5cm]→STITCH|WHOLE_ORGAN
```
**Conditional (Smart) Imaging:**
```cube
CONDITIONAL|SCAN[LowMag]→DETECT[Cells>Threshold]→CAPTURE[HighMag]|SMART
```

## 4. Data Management & Interoperability

CUBE commands can also manage data formats and integration with external tools.

**File Operations:**
```cube
DATA|FORMAT[SLDY]→COMPRESS[Zstandard]→EXPORT[OME-TIFF]|SAVED
```
**Python/AI Integration:**
```cube
ANALYZE|EXPORT[NumPy]→PYTHON[Process]→IMPORT[Results]|COMPLETE
```

## 5. Benefits

- **Simplicity & Clarity**: Self-documenting, human-readable experiment definitions.
- **Reproducibility**: Protocols can be shared as simple text strings.
- **Automation**: Enables programmatic generation and execution of complex experiments, ideal for AI-driven microscopy.
- **Efficiency**: Drastically reduces experiment setup time and code complexity.
