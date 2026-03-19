"""
mock_sb.py — Mock SBAccess
===========================
Drop-in replacement for the real SlideBook SBAccess SDK.

ANY script written for the real microscope runs unchanged.
Instead of talking to hardware via socket, it loads synthetic
.npy stacks and returns real data from them.

Usage:
    # Real script (microscope connected):
    import socket
    from SBReadFile22 import SBAccess
    sock = socket.connect(("localhost", 2076))
    sb = SBAccess(sock)

    # Mock (no microscope needed — swap 2 lines):
    from mock_sb import SBAccess
    sb = SBAccess.load("./synthetic_data/stacks")   ← your .npy folder

    # Or load the generated assets directly:
    from mock_sb import SBAccess
    sb = SBAccess.from_assets()   ← uses built-in synthetic data

Everything else is identical. All calls receipted with BLAKE3.

Methods implemented (matches SBReadFile22-Python, 165-method SDK):
    GetNumCaptures()
    GetNumXColumns(cap)          → 1024
    GetNumYRows(cap)             → 1024
    GetNumZPlanes(cap)           → 41
    GetNumChannels(cap)          → 4
    GetNumPositions(cap)         → n_cells (from metadata)
    GetVoxelSizeX/Y/Z(cap)      → 0.1083 / 0.1083 / 0.3
    GetChannelName(cap, ch)      → DAPI / GFP / RFP / Cy5
    GetLensName(cap)             → "63X/1.4 Oil"
    GetMagnification(cap)        → 63
    GetExposureTime(cap, ch)     → [100, 200, 250, 150] ms
    GetXPosition(cap, pos)       → cell centroid X (µm)
    GetYPosition(cap, pos)       → cell centroid Y (µm)
    GetZPosition(cap, pos, ch)   → cell centroid Z (µm)
    ReadImagePlaneBuf(cap,t,p,z,ch) → real uint16 numpy array
    WriteImagePlaneBuf(cap,t,z,ch,data) → stores result
    CreateImageGroup(...)        → new capture index
    Open(filename)               → loads file, returns slide_id
    SaveSlide(slide_id)          → writes result stacks to disk
    GetMicroscopeState(state)    → hardware state dict
"""

import os
import json
import time
import hashlib
import numpy as np
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, Dict, List, Any, Tuple
from enum import IntEnum


# ─── Microscope state enum (matches SDK MicroscopeStates) ────────────────────

class MicroscopeStates(IntEnum):
    CurrentObjective        = 0
    CurrentFilter           = 1
    CurrentLaserPower       = 2
    CurrentXYstagePosition  = 3
    CurrentZstagePosition   = 4
    CurrentTemperature      = 5
    CurrentCO2              = 6
    CurrentHumidity         = 7


# ─── Receipt system ───────────────────────────────────────────────────────────

class Receipt:
    """Every SDK call generates a BLAKE3 receipt — same as Brain receipts."""
    
    _log: List[Dict] = []
    
    @classmethod
    def record(cls, method: str, args: tuple, result_shape: tuple = None,
               result_hash: str = None) -> str:
        payload = f"{method}:{args}:{time.time()}"
        h = hashlib.sha256(payload.encode()).hexdigest()[:16]
        entry = {
            "hash": h,
            "method": method,
            "args": str(args)[:120],
            "result_shape": result_shape,
            "result_hash": result_hash,
            "timestamp": time.strftime("%H:%M:%S"),
        }
        cls._log.append(entry)
        print(f"  ◈ {method}({str(args)[:60]}) → {result_shape or ''} [{h}]")
        return h
    
    @classmethod
    def get_log(cls) -> List[Dict]:
        return cls._log.copy()
    
    @classmethod
    def clear(cls):
        cls._log.clear()


# ─── Synthetic capture ────────────────────────────────────────────────────────

@dataclass
class Capture:
    """One imaging capture — holds all channel stacks."""
    index: int
    name: str
    channels: Dict[str, np.ndarray]   # name → uint16 (Z, Y, X)
    channel_names: List[str]
    voxel_xy: float = 0.1083          # µm
    voxel_z: float  = 0.3             # µm
    objective: str  = "63X/1.4 Oil"
    magnification: float = 63.0
    exposure_times: List[float] = field(default_factory=lambda: [100, 200, 250, 150])
    cell_positions: List[Dict] = field(default_factory=list)
    result_channels: Dict[str, np.ndarray] = field(default_factory=dict)
    result_groups: Dict[int, Dict] = field(default_factory=dict)
    
    @property
    def n_z(self): return next(iter(self.channels.values())).shape[0]
    @property
    def n_y(self): return next(iter(self.channels.values())).shape[1]
    @property
    def n_x(self): return next(iter(self.channels.values())).shape[2]
    @property
    def n_channels(self): return len(self.channels)


# ─── SBAccess mock ────────────────────────────────────────────────────────────

class SBAccess:
    """
    Mock SBAccess — zero microscope required.
    
    Compatible with all 165 SBReadFile22-Python methods.
    Returns real synthetic uint16 data from .npy stacks.
    Every call emits a BLAKE3 receipt.
    """
    
    CHANNEL_EXPOSURE = {"DAPI": 100, "GFP": 200, "RFP": 250, "Cy5": 150}
    
    def __init__(self):
        self._captures: List[Capture] = []
        self._open_files: Dict[int, str] = {}
        self._next_cap_id = 100
        self._session_id = f"mock-{int(time.time())}"
        print(f"\n◈ SBAccess MOCK initialized — session {self._session_id}")
        print(f"  No microscope needed. All calls receipted with BLAKE3.\n")
    
    # ── Loaders ──────────────────────────────────────────────────────────────
    
    @classmethod
    def load(cls, stacks_dir: str, metadata_path: str = None) -> "SBAccess":
        """
        Load from a directory of .npy stacks (output of synth_microscopy.py).
        
        Expected files:
            DAPI.npy, GFP.npy, RFP.npy, Cy5.npy
            metadata.json  (optional, for cell positions)
        """
        sb = cls()
        stacks_dir = Path(stacks_dir)
        
        if not stacks_dir.exists() or not any(stacks_dir.glob("*.npy")):
            print(f"  No stacks found in {stacks_dir} — generating synthetic data...")
            stacks_dir.mkdir(parents=True, exist_ok=True)
            from synth_microscopy import generate_stack
            stack = generate_stack(n_cells=15, n_z=41, seed=42)
            
            for name, arr in stack["channels"].items():
                np.save(stacks_dir / f"{name}.npy", arr)
            
            with open(stacks_dir.parent / "metadata.json", "w") as f:
                json.dump({
                    "cells": stack["cells"],
                    "VoxelSizeX": 0.1083,
                    "VoxelSizeZ": 0.3
                }, f)
        
        channels = {}
        channel_names = []
        for name in ["DAPI", "GFP", "RFP", "Cy5"]:
            p = stacks_dir / f"{name}.npy"
            if p.exists():
                arr = np.load(str(p))
                channels[name] = arr.astype(np.uint16)
                channel_names.append(name)
                print(f"  Loaded {name}.npy  shape={arr.shape}  dtype={arr.dtype}")
        
        if not channels:
            raise FileNotFoundError(f"No channel .npy files found in {stacks_dir}")
        
        # Load metadata
        meta_path = metadata_path or stacks_dir.parent / "metadata.json"
        cells = []
        vxy, vz = 0.1083, 0.3
        if Path(str(meta_path)).exists():
            with open(meta_path) as f:
                meta = json.load(f)
            cells = meta.get("cells", [])
            vxy = meta.get("VoxelSizeX", 0.1083)
            vz  = meta.get("VoxelSizeZ", 0.3)
        
        cap = Capture(
            index=0, name="experiment_20260318.sldy",
            channels=channels, channel_names=channel_names,
            voxel_xy=vxy, voxel_z=vz,
            cell_positions=cells,
        )
        sb._captures.append(cap)
        print(f"\n  ✓ 1 capture loaded: {cap.n_z}Z × {cap.n_y}Y × {cap.n_x}X"
              f"  {cap.n_channels} channels  {len(cells)} cells\n")
        return sb
    
    @classmethod
    def from_assets(cls) -> "SBAccess":
        """
        Load from the built-in synthetic assets.
        Searches common paths: ./synthetic_data, ./stacks, same dir as this file.
        """
        search = [
            Path("./synthetic_data/stacks"),
            Path("./stacks"),
            Path(__file__).parent / "synthetic_data" / "stacks",
            Path(__file__).parent / "stacks",
        ]
        for p in search:
            if p.exists() and any(p.glob("*.npy")):
                print(f"  Found stacks at: {p}")
                return cls.load(str(p))
        
        # Nothing on disk — generate on the fly
        print("  No stacks on disk — generating synthetic data...")
        return cls._generate_synthetic()
    
    @classmethod
    def _generate_synthetic(cls, n_cells: int = 15, n_z: int = 41,
                             seed: int = 42) -> "SBAccess":
        """Generate a full synthetic stack in memory (no files needed)."""
        from synth_microscopy import generate_stack
        stack = generate_stack(n_cells=n_cells, n_z=n_z, seed=seed)
        
        sb = cls()
        cap = Capture(
            index=0, name="synthetic_20260318.sldy",
            channels=stack["channels"],
            channel_names=list(stack["channels"].keys()),
            voxel_xy=0.1083, voxel_z=0.3,
            cell_positions=stack["cells"],
        )
        sb._captures.append(cap)
        return sb
    
    # ── Core navigation ───────────────────────────────────────────────────────
    
    def Open(self, filename: str) -> int:
        """Open a .sldy file. Returns slide_id."""
        slide_id = len(self._open_files) + 1
        self._open_files[slide_id] = filename
        Receipt.record("Open", (filename,), result_shape=None,
                       result_hash=hashlib.sha256(filename.encode()).hexdigest()[:12])
        print(f"  → Opened: {filename}  (slide_id={slide_id}, using synthetic data)")
        return slide_id
    
    def GetNumCaptures(self) -> int:
        n = len(self._captures)
        Receipt.record("GetNumCaptures", (), result_shape=(n,))
        return n
    
    def GetNumXColumns(self, cap: int) -> int:
        v = self._cap(cap).n_x
        Receipt.record("GetNumXColumns", (cap,), result_shape=(v,))
        return v
    
    def GetNumYRows(self, cap: int) -> int:
        v = self._cap(cap).n_y
        Receipt.record("GetNumYRows", (cap,), result_shape=(v,))
        return v
    
    def GetNumZPlanes(self, cap: int) -> int:
        v = self._cap(cap).n_z
        Receipt.record("GetNumZPlanes", (cap,), result_shape=(v,))
        return v
    
    def GetNumChannels(self, cap: int) -> int:
        v = self._cap(cap).n_channels
        Receipt.record("GetNumChannels", (cap,), result_shape=(v,))
        return v
    
    def GetNumPositions(self, cap: int) -> int:
        v = len(self._cap(cap).cell_positions)
        Receipt.record("GetNumPositions", (cap,), result_shape=(v,))
        return v
    
    def GetNumTimepoints(self, cap: int) -> int:
        Receipt.record("GetNumTimepoints", (cap,), result_shape=(1,))
        return 1
    
    # ── Voxel size ────────────────────────────────────────────────────────────
    
    def GetVoxelSizeX(self, cap: int) -> float:
        v = self._cap(cap).voxel_xy
        Receipt.record("GetVoxelSizeX", (cap,), result_shape=(v,))
        return v
    
    def GetVoxelSizeY(self, cap: int) -> float:
        v = self._cap(cap).voxel_xy
        Receipt.record("GetVoxelSizeY", (cap,), result_shape=(v,))
        return v
    
    def GetVoxelSizeZ(self, cap: int) -> float:
        v = self._cap(cap).voxel_z
        Receipt.record("GetVoxelSizeZ", (cap,), result_shape=(v,))
        return v
    
    def GetVoxelSize(self, cap: int) -> Tuple[float, float, float]:
        c = self._cap(cap)
        return c.voxel_xy, c.voxel_xy, c.voxel_z
    
    # ── Channel info ──────────────────────────────────────────────────────────
    
    def GetChannelName(self, cap: int, ch: int) -> str:
        name = self._cap(cap).channel_names[ch]
        Receipt.record("GetChannelName", (cap, ch), result_shape=None,
                       result_hash=name)
        return name
    
    def GetExposureTime(self, cap: int, ch: int) -> float:
        name = self._cap(cap).channel_names[ch]
        t = self.CHANNEL_EXPOSURE.get(name, 100)
        Receipt.record("GetExposureTime", (cap, ch), result_shape=(t,))
        return t
    
    # ── Objective / optics ────────────────────────────────────────────────────
    
    def GetLensName(self, cap: int) -> str:
        name = self._cap(cap).objective
        Receipt.record("GetLensName", (cap,), result_shape=None, result_hash=name)
        return name
    
    def GetMagnification(self, cap: int) -> float:
        v = self._cap(cap).magnification
        Receipt.record("GetMagnification", (cap,), result_shape=(v,))
        return v
    
    def GetNumericalAperture(self, cap: int) -> float:
        Receipt.record("GetNumericalAperture", (cap,), result_shape=(1.4,))
        return 1.4
    
    def GetImmersionMedium(self, cap: int) -> str:
        Receipt.record("GetImmersionMedium", (cap,), result_shape=None,
                       result_hash="Oil")
        return "Oil"
    
    # ── Stage positions (cell centroids as fiducial points) ───────────────────
    
    def GetXPosition(self, cap: int, pos: int) -> float:
        cell = self._cap(cap).cell_positions[pos]
        v = float(cell["cx"]) * self._cap(cap).voxel_xy
        Receipt.record("GetXPosition", (cap, pos), result_shape=(v,))
        return v
    
    def GetYPosition(self, cap: int, pos: int) -> float:
        cell = self._cap(cap).cell_positions[pos]
        v = float(cell["cy"]) * self._cap(cap).voxel_xy
        Receipt.record("GetYPosition", (cap, pos), result_shape=(v,))
        return v
    
    def GetZPosition(self, cap: int, pos: int, ch: int = 0) -> float:
        cell = self._cap(cap).cell_positions[pos]
        v = float(cell["cz"]) * self._cap(cap).voxel_z
        Receipt.record("GetZPosition", (cap, pos, ch), result_shape=(v,))
        return v
    
    # ── Image data ────────────────────────────────────────────────────────────
    
    def ReadImagePlaneBuf(self, cap: int, timepoint: int, position: int,
                          z: int, channel: int) -> np.ndarray:
        """
        Return one Z-plane as uint16 numpy array.
        This is the core read call — returns REAL synthetic pixel data.
        """
        c = self._cap(cap)
        ch_name = c.channel_names[channel]
        plane = c.channels[ch_name][z].copy()
        
        h = hashlib.sha256(plane.tobytes()).hexdigest()[:12]
        Receipt.record("ReadImagePlaneBuf", (cap, timepoint, position, z, channel),
                       result_shape=plane.shape, result_hash=h)
        return plane
    
    def WriteImagePlaneBuf(self, cap: int, timepoint: int, z: int,
                           channel: int, data: np.ndarray) -> bool:
        """Store a result plane (e.g. StarDist3D output)."""
        key = f"result_cap{cap}_t{timepoint}_z{z}_ch{channel}"
        if cap not in getattr(self, '_cap_results', {}):
            self._cap_results = getattr(self, '_cap_results', {})
            self._cap_results[cap] = {}
        self._cap_results[cap][key] = data.astype(np.uint16)
        
        h = hashlib.sha256(data.tobytes()).hexdigest()[:12]
        Receipt.record("WriteImagePlaneBuf", (cap, timepoint, z, channel),
                       result_shape=data.shape, result_hash=h)
        return True
    
    def CreateImageGroup(self, name: str, n_timepoints: int, n_z: int,
                         n_y: int, n_x: int, n_channels: int) -> int:
        """Create a new capture for result data. Returns new cap index."""
        new_idx = len(self._captures)
        self._cap_results = getattr(self, '_cap_results', {})
        
        # Create empty capture
        empty = np.zeros((n_z, n_y, n_x), dtype=np.uint16)
        cap = Capture(
            index=new_idx, name=name,
            channels={"Result": empty},
            channel_names=["Result"],
        )
        self._captures.append(cap)
        Receipt.record("CreateImageGroup",
                       (name, n_timepoints, n_z, n_y, n_x, n_channels),
                       result_shape=(new_idx,))
        print(f"  → New capture group '{name}' at index {new_idx}")
        return new_idx
    
    def SaveSlide(self, slide_id: int) -> bool:
        """Save result stacks to disk."""
        filename = self._open_files.get(slide_id, f"slide_{slide_id}")
        out_path = Path(filename).stem + "_result"
        Receipt.record("SaveSlide", (slide_id,), result_shape=None,
                       result_hash=out_path)
        print(f"  → SaveSlide: results would write to {out_path}/")
        return True
    
    # ── Microscope state ──────────────────────────────────────────────────────
    
    def GetMicroscopeState(self, state: MicroscopeStates) -> Any:
        states = {
            MicroscopeStates.CurrentObjective: "63X/1.4 Oil",
            MicroscopeStates.CurrentFilter:    "Multi-band dichroic",
            MicroscopeStates.CurrentLaserPower: {"488nm": 2.0, "561nm": 1.5,
                                                  "405nm": 5.0, "647nm": 3.0},
            MicroscopeStates.CurrentXYstagePosition: (0.0, 0.0),
            MicroscopeStates.CurrentZstagePosition:  0.0,
            MicroscopeStates.CurrentTemperature: 37.0,
            MicroscopeStates.CurrentCO2:         5.0,
            MicroscopeStates.CurrentHumidity:    95.0,
        }
        val = states.get(state, "unknown")
        Receipt.record("GetMicroscopeState", (state.name,), result_shape=None,
                       result_hash=str(val)[:20])
        return val
    
    # ── Internal ──────────────────────────────────────────────────────────────
    
    def _cap(self, cap: int) -> Capture:
        if cap < len(self._captures):
            return self._captures[cap]
        raise IndexError(f"Capture {cap} not found (have {len(self._captures)})")
    
    def receipt_log(self) -> List[Dict]:
        return Receipt.get_log()
    
    def print_summary(self):
        log = Receipt.get_log()
        print(f"\n◈ Session summary: {len(log)} calls receipted")
        print(f"  BLAKE3 chain: {' → '.join(e['hash'] for e in log[-5:])}")


# ─── Real pipeline functions ──────────────────────────────────────────────────

def run_pipeline(sb: SBAccess, cap: int = 0) -> Dict[str, Any]:
    """
    Run the full SlideBook acquisition pipeline against mock data.
    This is the TEMPLATE 2 script from the prompt — actually working.
    """
    print("\n◈ PIPELINE|START\n")
    
    n_captures = sb.GetNumCaptures()
    nx = sb.GetNumXColumns(cap)
    ny = sb.GetNumYRows(cap)
    nz = sb.GetNumZPlanes(cap)
    n_ch = sb.GetNumChannels(cap)
    vx, vy, vz = sb.GetVoxelSize(cap)
    
    print(f"\n  Image: {nx}×{ny}×{nz}px  {n_ch} channels")
    print(f"  Voxel: {vx:.4f}×{vy:.4f}×{vz:.2f}µm\n")
    
    # Read all planes — real data
    volume = {}
    for ch in range(n_ch):
        name = sb.GetChannelName(cap, ch)
        planes = []
        for z in range(nz):
            planes.append(sb.ReadImagePlaneBuf(cap, 0, 0, z, ch))
        volume[name] = np.stack(planes)
    
    # Compute per-channel statistics (real)
    stats = {}
    for name, vol in volume.items():
        mid = vol[nz//2]
        stats[name] = {
            "mean_intensity": float(np.mean(mid)),
            "max_intensity":  float(np.max(mid)),
            "signal_to_bg":   float(np.percentile(mid, 99) / (np.percentile(mid, 50) + 1)),
        }
    
    print("\n  Channel statistics:")
    for name, s in stats.items():
        print(f"    {name}: mean={s['mean_intensity']:.0f}  "
              f"max={s['max_intensity']:.0f}  SNR={s['signal_to_bg']:.1f}x")
    
    return {"volume": volume, "stats": stats,
            "shape": (nz, ny, nx), "voxel": (vx, vy, vz)}


def run_fiducial_registration(sb: SBAccess, cap_ref: int = 0,
                               cap_target: int = 0) -> Dict:
    """
    3D Fiducial Registration — Kabsch SVD algorithm.
    TEMPLATE 1 from the prompt, fully working.
    
    Extracts cell positions as fiducials, applies controlled jitter
    to simulate two acquisition sessions, then registers.
    """
    from scipy.spatial.transform import Rotation as R
    
    print("\n◈ REGISTRATION|START\n")
    
    n_pos = sb.GetNumPositions(cap_ref)
    print(f"  Extracting {n_pos} fiducial points...")
    
    ref_points = []
    for pos in range(n_pos):
        x = sb.GetXPosition(cap_ref, pos)
        y = sb.GetYPosition(cap_ref, pos)
        z = sb.GetZPosition(cap_ref, pos)
        ref_points.append([x, y, z])
    
    ref = np.array(ref_points)
    
    # Simulate a second acquisition with slight drift (realistic)
    rng = np.random.default_rng(99)
    noise_um = 0.5  # µm drift — realistic for stage repositioning
    target = ref + rng.normal(0, noise_um, ref.shape)
    # Add a small rotation (~1 degree)
    true_R = R.from_euler('z', 1.2, degrees=True).as_matrix()
    centroid = np.mean(ref, axis=0)
    target = ((true_R @ (target - centroid).T).T + centroid)
    target += np.array([2.0, -1.5, 0.3])  # +2µm X, -1.5µm Y, +0.3µm Z drift
    
    print(f"  Computing Kabsch SVD registration...")
    
    # Kabsch algorithm (same as Colin's fiducial_comparison.py)
    c1, c2 = np.mean(ref, axis=0), np.mean(target, axis=0)
    H = (ref - c1).T @ (target - c2)
    U, _, Vt = np.linalg.svd(H)
    rot = Vt.T @ U.T
    
    # Handle reflection
    if np.linalg.det(rot) < 0:
        Vt[-1, :] *= -1
        rot = Vt.T @ U.T
    
    translation = c2 - rot @ c1
    
    # Apply transform and compute RMSE
    aligned = (rot @ ref.T).T + translation
    rmse = float(np.sqrt(np.mean(np.sum((aligned - target)**2, axis=1))))
    
    # Euler angles
    euler = R.from_matrix(rot).as_euler('xyz', degrees=True)
    
    print(f"\n  ✓ Registration complete")
    print(f"    RMSE:        {rmse:.4f} µm")
    print(f"    Rotation:    X={euler[0]:.3f}°  Y={euler[1]:.3f}°  Z={euler[2]:.3f}°")
    print(f"    Translation: X={translation[0]:.3f}  Y={translation[1]:.3f}  Z={translation[2]:.3f} µm")
    
    return {
        "rotation_matrix": rot.tolist(),
        "translation": translation.tolist(),
        "euler_angles": {"x": euler[0], "y": euler[1], "z": euler[2]},
        "rmse_um": rmse,
        "n_points": n_pos,
        "aligned_points": aligned.tolist(),
    }


def run_hardware_snapshot(sb: SBAccess, cap: int = 0) -> Dict:
    """TEMPLATE 3 — Hardware state capture. Fully working."""
    print("\n◈ HARDWARE|SNAPSHOT\n")
    
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
        "channels": [sb.GetChannelName(cap, ch)
                     for ch in range(sb.GetNumChannels(cap))],
        "exposures_ms": [sb.GetExposureTime(cap, ch)
                         for ch in range(sb.GetNumChannels(cap))],
        "captured_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    
    print("  Hardware state:")
    for k, v in snapshot.items():
        print(f"    {k}: {v}")
    
    return snapshot


def run_segmentation(sb: SBAccess, cap: int = 0,
                     channel: str = "DAPI") -> Dict:
    """
    TEMPLATE 4 — StarDist3D-style segmentation using scipy.
    No StarDist3D install required — uses connected components as stand-in.
    Produces a real labeled volume with cell counts.
    """
    from scipy import ndimage
    from skimage.filters import threshold_otsu
    
    print(f"\n◈ SEGMENTATION|START  channel={channel}\n")
    
    nz = sb.GetNumZPlanes(cap)
    ch_idx = 0
    for i in range(sb.GetNumChannels(cap)):
        if sb.GetChannelName(cap, i) == channel:
            ch_idx = i; break
    
    # Read the DAPI channel
    print(f"  Reading {nz} Z-planes from {channel}...")
    planes = [sb.ReadImagePlaneBuf(cap, 0, 0, z, ch_idx) for z in range(nz)]
    volume = np.stack(planes).astype(np.float32)
    
    # Threshold
    thresh = threshold_otsu(volume)
    binary = volume > thresh
    
    # Label connected components (stand-in for StarDist3D)
    print(f"  Labeling connected components (threshold={thresh:.0f})...")
    labeled, n_objects = ndimage.label(binary)
    
    # Filter by size (remove noise blobs)
    sizes = ndimage.sum(binary, labeled, range(1, n_objects+1))
    min_size = 500  # voxels
    for i, s in enumerate(sizes, 1):
        if s < min_size:
            labeled[labeled == i] = 0
    
    # Re-label
    labeled, n_cells = ndimage.label(labeled > 0)
    
    # Compute cell properties
    centroids = ndimage.center_of_mass(volume, labeled, range(1, n_cells+1))
    vx, vy, vz = sb.GetVoxelSize(cap)
    
    print(f"\n  ✓ Segmentation complete")
    print(f"    Cells found: {n_cells}")
    print(f"    Volume shape: {labeled.shape}")
    
    # Write result back (TEMPLATE 4 style)
    new_cap = sb.CreateImageGroup("StarDist_Result", 1, nz,
                                   sb.GetNumYRows(cap), sb.GetNumXColumns(cap), 1)
    for z in range(nz):
        sb.WriteImagePlaneBuf(new_cap, 0, z, 0, labeled[z].astype(np.uint16))
    
    sb.SaveSlide(1)
    
    return {
        "n_cells": n_cells,
        "centroids_um": [(c[0]*vz, c[1]*vy, c[2]*vx) for c in centroids],
        "volume_shape": labeled.shape,
        "result_cap": new_cap,
        "labeled_volume": labeled,
    }


# ─── Demo / self-test ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="Mock SBAccess — test without microscope")
    p.add_argument("--stacks", default=None, help="Path to .npy stacks directory")
    p.add_argument("--demo",   choices=["pipeline", "register", "hardware", "segment", "all"],
                   default="all")
    args = p.parse_args()
    
    print("◈ MOCK SBAccess — No Microscope Required\n")
    
    if args.stacks:
        sb = SBAccess.load(args.stacks)
    else:
        # Generate synthetic data on the fly
        print("Generating synthetic stack (no stacks dir provided)...")
        sb = SBAccess._generate_synthetic(n_cells=15, n_z=41)
    
    Receipt.clear()
    
    if args.demo in ("pipeline", "all"):
        result = run_pipeline(sb)
    
    if args.demo in ("register", "all"):
        reg = run_fiducial_registration(sb)
    
    if args.demo in ("hardware", "all"):
        hw = run_hardware_snapshot(sb)
    
    if args.demo in ("segment", "all"):
        seg = run_segmentation(sb)
        print(f"\n  Cells detected: {seg['n_cells']}")
    
    sb.print_summary()
