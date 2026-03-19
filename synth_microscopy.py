import numpy as np
import json
from pathlib import Path

def generate_stack(n_cells=15, n_z=41, seed=42):
    rng = np.random.default_rng(seed)
    
    # Image dimensions
    n_y, n_x = 1024, 1024
    
    # Create empty channels
    channels = {
        "DAPI": np.zeros((n_z, n_y, n_x), dtype=np.uint16),
        "GFP": np.zeros((n_z, n_y, n_x), dtype=np.uint16),
        "RFP": np.zeros((n_z, n_y, n_x), dtype=np.uint16),
        "Cy5": np.zeros((n_z, n_y, n_x), dtype=np.uint16)
    }
    
    cells = []
    
    for i in range(n_cells):
        # Random cell center
        cz = rng.integers(5, n_z - 5)
        cy = rng.integers(50, n_y - 50)
        cx = rng.integers(50, n_x - 50)
        
        cells.append({"id": i, "cz": cz, "cy": cy, "cx": cx})
        
        # Draw a simple "cell" (a blob) in each channel
        # DAPI (nucleus)
        draw_blob(channels["DAPI"], cz, cy, cx, radius_z=2, radius_xy=10, intensity=rng.integers(800, 1200))
        
        # GFP (cytoplasm)
        draw_blob(channels["GFP"], cz, cy, cx, radius_z=3, radius_xy=15, intensity=rng.integers(400, 800))
        
        # RFP (some spots)
        if rng.random() > 0.5:
            draw_blob(channels["RFP"], cz, cy + rng.integers(-5, 5), cx + rng.integers(-5, 5), radius_z=1, radius_xy=3, intensity=rng.integers(1000, 2000))
            
        # Cy5 (membrane)
        draw_hollow_blob(channels["Cy5"], cz, cy, cx, radius_z=3, radius_xy=15, thickness=2, intensity=rng.integers(300, 600))
        
    # Add some background noise
    for name in channels:
        noise = rng.integers(10, 50, size=(n_z, n_y, n_x), dtype=np.uint16)
        channels[name] = np.clip(channels[name] + noise, 0, 65535)
        
    return {"channels": channels, "cells": cells}

def draw_blob(volume, cz, cy, cx, radius_z, radius_xy, intensity):
    nz, ny, nx = volume.shape
    z, y, x = np.ogrid[-cz:nz-cz, -cy:ny-cy, -cx:nx-cx]
    mask = (z**2 / radius_z**2 + y**2 / radius_xy**2 + x**2 / radius_xy**2) <= 1
    volume[mask] = intensity

def draw_hollow_blob(volume, cz, cy, cx, radius_z, radius_xy, thickness, intensity):
    nz, ny, nx = volume.shape
    z, y, x = np.ogrid[-cz:nz-cz, -cy:ny-cy, -cx:nx-cx]
    dist_sq = z**2 / radius_z**2 + y**2 / radius_xy**2 + x**2 / radius_xy**2
    mask = (dist_sq <= 1) & (dist_sq >= (1 - thickness/radius_xy)**2)
    volume[mask] = intensity

if __name__ == "__main__":
    print("Generating synthetic microscopy data...")
    out_dir = Path("synthetic_data/stacks")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    data = generate_stack()
    
    for name, vol in data["channels"].items():
        np.save(out_dir / f"{name}.npy", vol)
        print(f"Saved {name}.npy")
        
    with open(out_dir.parent / "metadata.json", "w") as f:
        json.dump({"cells": data["cells"], "VoxelSizeX": 0.1083, "VoxelSizeZ": 0.3}, f, indent=2)
    print("Saved metadata.json")
    print("Done.")
