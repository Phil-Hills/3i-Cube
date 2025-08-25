import type { SimCellType, SimArtifact } from '../components/MLBuilderView';

export interface SyntheticDataParams {
    count: number;
    cellType: SimCellType;
    artifacts: SimArtifact[];
}

interface GeneratedPair {
    image: string;
    label: string;
}

const SIZE = 512;

/**
 * Generates a set of synthetic microscopy images and their corresponding segmentation labels.
 * This is a client-side, programmatic generator that requires zero API calls.
 */
export const generateSyntheticData = async (params: SyntheticDataParams): Promise<GeneratedPair[]> => {
    const generator = new SyntheticDataGenerator();
    const results: GeneratedPair[] = [];
    for (let i = 0; i < params.count; i++) {
        const pair = generator.generate(params);
        results.push(pair);
    }
    return results;
}

class SyntheticDataGenerator {
    private imageCanvas: HTMLCanvasElement;
    private imageCtx: CanvasRenderingContext2D;
    private labelCanvas: HTMLCanvasElement;
    private labelCtx: CanvasRenderingContext2D;

    constructor() {
        this.imageCanvas = document.createElement('canvas');
        this.imageCanvas.width = SIZE;
        this.imageCanvas.height = SIZE;
        this.imageCtx = this.imageCanvas.getContext('2d')!;

        this.labelCanvas = document.createElement('canvas');
        this.labelCanvas.width = SIZE;
        this.labelCanvas.height = SIZE;
        this.labelCtx = this.labelCanvas.getContext('2d')!;
    }

    public generate(params: SyntheticDataParams): GeneratedPair {
        this.clearCanvases();
        
        // 1. Generate one base image programmatically
        const baseCanvas = this.generateBaseCellProgrammatically(params.cellType);
        
        // 2. Apply variations and augmentations
        this.applyVariations(baseCanvas);
        
        // 3. Apply realistic microscopy effects to the image canvas
        this.applyMicroscopyEffects(params.artifacts);

        return {
            image: this.imageCanvas.toDataURL(),
            label: this.labelCanvas.toDataURL(),
        };
    }

    private clearCanvases(): void {
        this.imageCtx.fillStyle = '#000000';
        this.imageCtx.fillRect(0, 0, SIZE, SIZE);
        this.labelCtx.fillStyle = '#000000'; // Background class
        this.labelCtx.fillRect(0, 0, SIZE, SIZE);
    }

    private generateBaseCellProgrammatically(cellType: SimCellType): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = SIZE;
        tempCanvas.height = SIZE;
        const ctx = tempCanvas.getContext('2d')!;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,SIZE,SIZE);

        const center = { x: SIZE / 2, y: SIZE / 2 };
        
        // Cell membrane (elliptical)
        const axes = { 
            x: 80 + (Math.random() - 0.5) * 20, 
            y: 100 + (Math.random() - 0.5) * 20 
        };
        const angle = Math.random() * Math.PI * 2;
        
        // Draw cell on image canvas (with color)
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(0, 100, 0, 0.8)';
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, axes.x, axes.y, angle, 0, Math.PI * 2);
        ctx.fill();

        // Draw cell on label canvas (with label color)
        this.labelCtx.fillStyle = '#808080'; // Cytoplasm class
        this.labelCtx.beginPath();
        this.labelCtx.ellipse(center.x, center.y, axes.x, axes.y, angle, 0, Math.PI * 2);
        this.labelCtx.fill();
        
        // Add nucleus
        const nucleusCenter = {
            x: center.x + (Math.random() - 0.5) * 40,
            y: center.y + (Math.random() - 0.5) * 40
        };
        const nucleusRadius = 30 + (Math.random() - 0.5) * 10;
        
        // Draw nucleus on image canvas
        ctx.fillStyle = 'rgba(0, 0, 200, 0.9)';
        ctx.beginPath();
        ctx.arc(nucleusCenter.x, nucleusCenter.y, nucleusRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nucleus on label canvas
        this.labelCtx.fillStyle = '#FFFFFF'; // Nucleus class
        this.labelCtx.beginPath();
        this.labelCtx.arc(nucleusCenter.x, nucleusCenter.y, nucleusRadius, 0, Math.PI * 2);
        this.labelCtx.fill();

        // Add organelles
        for (let i = 0; i < 20; i++) {
            const org_x = center.x + (Math.random() - 0.5) * 120;
            const org_y = center.y + (Math.random() - 0.5) * 120;
            const org_size = Math.random() * 5 + 3;
            ctx.fillStyle = `rgba(0, 150, 0, ${0.5 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(org_x, org_y, org_size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        return tempCanvas;
    }
    
    private applyVariations(baseCanvas: HTMLCanvasElement) {
        // --- Apply transformations to both canvases simultaneously ---
        [this.imageCtx, this.labelCtx].forEach(ctx => {
            ctx.save();
            ctx.translate(SIZE / 2, SIZE / 2);

            // 1. Rotation
            const angle = Math.random() * Math.PI * 2;
            ctx.rotate(angle);

            // 2. Scale
            const scale = 0.8 + Math.random() * 0.4;
            ctx.scale(scale, scale);

            // 7. Flip
            if (Math.random() > 0.5) ctx.scale(-1, 1); // Horizontal
            if (Math.random() > 0.5) ctx.scale(1, -1); // Vertical
            
            ctx.translate(-SIZE / 2, -SIZE / 2);
            ctx.drawImage(baseCanvas, 0, 0);
            ctx.restore();
        });

        // --- Apply transformations to image canvas only ---
        this.imageCtx.save();
        // 3. Brightness
        // 4. Contrast
        // 6. Blur (part of variations)
        const brightness = 0.7 + Math.random() * 0.6;
        const contrast = 0.8 + Math.random() * 0.4;
        const blur = Math.random() > 0.5 ? Math.random() * 2 : 0;
        this.imageCtx.filter = `brightness(${brightness}) contrast(${contrast}) blur(${blur}px)`;
        this.imageCtx.drawImage(this.imageCanvas, 0, 0);
        this.imageCtx.restore();

        // 5. Noise level variation
        const noiseLevel = Math.random() * 20;
        this.addGaussianNoise(this.imageCtx, noiseLevel);
    }

    private applyMicroscopyEffects(artifacts: SimArtifact[]) {
        if (artifacts.includes('PSF_Blur')) {
            this.imageCtx.save();
            this.imageCtx.filter = 'blur(1.5px)';
            this.imageCtx.drawImage(this.imageCanvas, 0, 0);
            this.imageCtx.restore();
        }

        if (artifacts.includes('Poisson_Noise')) {
            this.addPoissonNoise(this.imageCtx);
        }

        if (artifacts.includes('Uneven_Illumination')) {
            this.imageCtx.save();
            const gradient = this.imageCtx.createLinearGradient(0, 0, SIZE, SIZE);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
            this.imageCtx.globalCompositeOperation = 'multiply';
            this.imageCtx.fillStyle = gradient;
            this.imageCtx.fillRect(0, 0, SIZE, SIZE);
            this.imageCtx.restore();
        }
    }
    
    private addGaussianNoise(ctx: CanvasRenderingContext2D, amount: number) {
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            const noise = (Math.random() - 0.5) * amount;
            d[i] += noise;
            d[i+1] += noise;
            d[i+2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
    }
    
    private addPoissonNoise(ctx: CanvasRenderingContext2D) {
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const signal = (data[i] + data[i+1] + data[i+2])/3;
            if (signal > 0) {
                const noise = Math.sqrt(signal) * (Math.random() - 0.5) * 2.5; // Scaled for visual effect
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
}