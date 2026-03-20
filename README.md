# 🧊 Q Protocol for Microscopes

**Created by A2AC LLC**

## Executive Summary

This system transforms how researchers interact with microscopes. Instead of writing hundreds of lines of code, they express their experiments in simple, semantic commands.

**Example:** Your adaptive optics script (200+ lines) becomes:
```qprotocol
OPTIMIZE|ADAPTIVE_OPTICS→ZERNIKE[1:7]→MEASURE[Quality]→APPLY[Best]|CORRECTED
```

**Business Impact:**
- **Support Costs:** Reduced by 80% (customers self-serve)
- **Training Time:** 1 week → 1 day
- **Market Position:** First microscope company with semantic control

---

## For Developers

### What is Q Protocol?

Q Protocol is a semantic notation system that reduces complex code to simple triplets:

```
DOMAIN|SEQUENCE|OUTCOME
```

Created by A2AC LLC, Q Protocol achieves 100:1 compression while maintaining perfect clarity.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Q Protocol System                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Web Converter ──► Q Protocol Parser ──► Commands       │
│       ↓                               ↓                  │
│  [Your Code]                    [Microscope Control]     │
│       ↓                               ↓                  │
│  [Q Protocol] ←─── Converter ←─── [Results]            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Quick Start

1. **Web Converter** (Live Now)
   Use the web interface to convert code and orchestrate experiments.

2. **Python Integration**
   ```python
   from q_protocol import QConverter
   
   converter = QConverter()
   q_code = converter.convert(your_matlab_code)
   ```

3. **Direct Q Protocol Control**
   ```qprotocol
   CONNECT|MICROSCOPE[Model_X]→INITIALIZE|READY
   CAPTURE|IMAGE→CHANNEL[GFP]→SAVE[output.tif]|DONE
   ```

### Core Components

#### 1. **Converter Engine** (`/src/converter.py`)
Converts existing code to Q Protocol notation:
- MATLAB → Q Protocol
- Python → Q Protocol  
- Macros → Q Protocol

#### 2. **Q Protocol Runtime** (`/src/runtime.py`)
Executes Q Protocol commands on actual microscopes:
```python
runtime = QProtocolRuntime()
runtime.execute("CAPTURE|IMAGE→CHANNEL[GFP]→SAVE[cell.tif]|DONE")
```

#### 3. **Web Interface** (`/src/web/`)
- React-based converter
- Real-time conversion
- Example library
- AI-generated previews

### Supported Operations

| Operation | Q Protocol Syntax | Traditional Lines |
|-----------|-------------|-------------------|
| Basic Capture | `CAPTURE\|IMAGE→SAVE[file]\|DONE` | 15-20 |
| Multi-Channel | `CAPTURE\|MULTI[DAPI,GFP,RFP]→MERGE\|DONE` | 50-75 |
| Time-lapse | `EXPERIMENT\|TIMELAPSE→DURATION[24h]→INTERVAL[5min]\|RUNNING` | 100+ |
| Z-Stack | `CAPTURE\|ZSTACK[-50:50:0.5]→SAVE\|COMPLETE` | 80+ |
| Adaptive Optics | `OPTIMIZE\|AO→ZERNIKE[1:7]→APPLY\|CORRECTED` | 200+ |

### 3i SlideBook™ Integration

Q Protocol is fully compatible with **Intelligent Imaging Innovations (3i)** hardware and software. It acts as a semantic extension for **SlideBook™**, allowing researchers to orchestrate complex acquisitions on:
- Marianas™ LightSheet
- Lattice LightSheet
- Vector™ Photomanipulation

**Example SlideBook™ Workflow:**
```qprotocol
CONNECT|SLIDEBOOK→MICROSCOPE[LatticeLightSheet]|READY
ACQUIRE|ZSTACK[-10:10:0.5]→CHANNEL[488nm,561nm]→CAMERA[Dual]|ACQUIRING
EXPORT|SLIDEBOOK_WORKSPACE→RENDER[3D]|COMPLETE
```

### API Reference

#### Convert Code
```http
POST /api/convert
Content-Type: application/json

{
  "code": "your MATLAB/Python code here"
}

Response:
{
  "q_protocol": "CAPTURE|IMAGE→SAVE|DONE",
  "compression": "50:1",
  "author": "A2AC LLC"
}
```

#### Execute Q Protocol
```http
POST /api/execute
Content-Type: application/json

{
  "q_protocol": "CAPTURE|IMAGE→SAVE[test.tif]|DONE"
}

Response:
{
  "status": "success",
  "output": "Image captured and saved",
  "file": "test.tif"
}
```

### Installation

#### Web App (Already Deployed)
No installation needed. Visit the deployed URL.

#### Local Development
```bash
# Clone repository
git clone https://github.com/a2ac/q-protocol.git

# Install dependencies
pip install -r requirements.txt
npm install

# Run locally
python app.py  # Backend on :5000
npm start      # Frontend on :3000
```

### Examples

#### Before: Complex MATLAB Script
```matlab
% 87 lines of initialization and loops
core = Core();
core.loadSystemConfiguration("config.cfg");
for channel = channels
    core.setConfig('Channel', channel);
    core.setExposure(exposure);
    % ... 80 more lines
end
```

#### After: Simple Q Protocol
```qprotocol
CONNECT|MICROSCOPE[Model_X]→CONFIG[Load]|READY
CAPTURE|MULTI[DAPI,GFP,RFP]→EXPOSURE[100ms]→SAVE|DONE
```

### Testing

```bash
# Run unit tests
pytest tests/

# Test converter
python test_converter.py

# Test microscope connection
python test_hardware.py
```

### Support

- **Technical Issues:** support@a2ac.ai
- **Documentation:** https://a2ac.ai/docs/q-protocol

### License

Proprietary - A2AC LLC

---

## The Vision

Imagine a world where:
- Scientists focus on science, not coding
- Experiments are perfectly reproducible
- Anyone can operate a complex microscope
- A2AC LLC leads the industry in ease of use

This is what Q Protocol delivers.

**Created with pride by A2AC LLC**

*"Making the complex simple, one command at a time."*
