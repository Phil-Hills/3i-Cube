
import type { ConversionMetrics } from '../types';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const calculateOptimalDimensions = (dataLength: number): [number, number, number] => {
    if (dataLength === 0) return [1, 1, 1];
    // Target ~150 chars per cell
    const totalCells = Math.ceil(dataLength / 150);
    if (totalCells <= 1) return [1, 1, 1];

    // Try for a perfect cube-like shape first
    const cubeRoot = Math.round(Math.cbrt(totalCells));
    for (let size = Math.max(2, cubeRoot - 5); size < cubeRoot + 5; size++) {
        if (size * size * size >= totalCells) {
            return [size, size, size];
        }
    }
    
    // Fallback to a rectangular prism, trying to keep dimensions similar
    let bestDims: [number, number, number] = [totalCells, 1, 1];
    let minSurfaceArea = Infinity;

    for (let x = 1; x <= Math.min(totalCells, 25); x++) {
        for (let y = x; y <= Math.min(Math.ceil(totalCells / x), 25); y++) {
            const z = Math.ceil(totalCells / (x * y));
            if (x * y * z >= totalCells && z <= 25) {
                const surfaceArea = 2 * (x*y + y*z + x*z);
                if (surfaceArea < minSurfaceArea) {
                    minSurfaceArea = surfaceArea;
                    bestDims = [x, y, z];
                }
            }
        }
    }
    return bestDims.sort((a, b) => a - b);
};

const generateCubeHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 16);
};


export const compressDataToCube = async (currentInput: string): Promise<{ outputCubeCells: string[][][]; outputCode: string; metrics: ConversionMetrics; }> => {
    if (!window.CompressionStream) {
        throw new Error('Browser Not Supported: This feature requires the Compression Streams API, which is unavailable in your current browser.');
    }
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Insecure Context: The Crypto API for hashing requires a secure context (HTTPS or localhost).');
    }

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(currentInput);
    const original_size_bytes = dataBytes.length;

    const stream = new Blob([dataBytes], { type: 'text/plain' }).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const compressedBuffer = await new Response(compressedStream).arrayBuffer();
    const compressed_size_bytes = compressedBuffer.byteLength;
    
    const base64String = arrayBufferToBase64(compressedBuffer);

    const dims = calculateOptimalDimensions(base64String.length);
    const [x, y, z] = dims;
    const totalCells = x * y * z;
    const chunkSize = Math.ceil(base64String.length / totalCells);

    const cube: string[][][] = [];
    let idx = 0;
    for (let i = 0; i < z; i++) {
        const layer: string[][] = [];
        for (let j = 0; j < y; j++) {
            const row: string[] = [];
            for (let k = 0; k < x; k++) {
                const start = idx * chunkSize;
                const end = start + chunkSize;
                row.push(base64String.substring(start, end));
                idx++;
            }
            layer.push(row);
        }
        cube.push(layer);
    }
    
    const concatenatedData = cube.flat(2).join('');
    const cells_used = cube.flat(2).filter(c => c.length > 0).length;
    const hash = await generateCubeHash(concatenatedData);

    const compressionMethod = compressed_size_bytes < 10000 ? "STANDARD" : "HEAVY";
    const ratio = compressed_size_bytes > 0 ? (original_size_bytes / compressed_size_bytes).toFixed(1) : "Infinity";

    const outputCode = `COMPRESS|DATA[${original_size_bytes}b]→${compressionMethod}[${ratio}:1]→CUBE[${dims.join('x')}]|STORED`;
    const metrics: ConversionMetrics = {
        original_size_bytes,
        compressed_size_bytes,
        compression_ratio: `${ratio}:1`,
        time_saved_minutes: Math.round(original_size_bytes / 1024 * 0.1),
        dimensions: dims,
        cells_used,
        hash
    };

    return { outputCubeCells: cube, outputCode, metrics };
};
