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

const SIZE = 256;

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
        
        const numCells = params.cellType === 'Tissue' ? 5 + Math.floor(Math.random() * 5) : 1;
        
        for (let i=0; i < numCells; i++) {
            const baseCanvas = this.generateBaseCellProgrammatically(params.cellType, i + 1);
            this.applyVariations(baseCanvas, i + 1);
        }
        
        this.applyMicroscopyEffects(params.artifacts);

        return {
            image: this.imageCanvas.toDataURL(),
            label: this.labelCanvas.toDataURL(),
        };
    }

    private clearCanvases(): void {
        this.imageCtx.fillStyle = '#050505';
        this.imageCtx.fillRect(0, 0, SIZE, SIZE);
        this.labelCtx.fillStyle = '#000000'; // Background class
        this.labelCtx.fillRect(0, 0, SIZE, SIZE);
    }

    private generateBaseCellProgrammatically(cellType: SimCellType, labelId: number): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = SIZE;
        tempCanvas.height = SIZE;
        const ctx = tempCanvas.getContext('2d')!;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,SIZE,SIZE);

        const center = { x: SIZE / 2, y: SIZE / 2 };
        const labelColor = `hsl(${(labelId * 60) % 360}, 100%, 50%)`;
        
        if (cellType === 'Neurons') {
            this.drawNeuron(ctx, this.labelCtx, center, labelColor);
        } else { // Tissue or other cells
            this.drawStandardCell(ctx, this.labelCtx, center, labelColor);
        }
        
        return tempCanvas;
    }

    private drawStandardCell(imageCtx: CanvasRenderingContext2D, labelCtx: CanvasRenderingContext2D, center: {x: number, y: number}, labelColor: string) {
        const axes = { 
            x: SIZE * 0.15 + (Math.random() - 0.5) * SIZE * 0.05, 
            y: SIZE * 0.2 + (Math.random() - 0.5) * SIZE * 0.05 
        };
        const angle = Math.random() * Math.PI * 2;
        
        imageCtx.globalCompositeOperation = 'lighter';
        
        // Cytoplasm
        const cytoGradient = imageCtx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.max(axes.x, axes.y));
        cytoGradient.addColorStop(0, 'rgba(0, 200, 50, 0.9)');
        cytoGradient.addColorStop(1, 'rgba(0, 50, 0, 0.1)');
        imageCtx.fillStyle = cytoGradient;
        imageCtx.beginPath();
        imageCtx.ellipse(center.x, center.y, axes.x, axes.y, angle, 0, Math.PI * 2);
        imageCtx.fill();

        labelCtx.fillStyle = labelColor; 
        labelCtx.beginPath();
        labelCtx.ellipse(center.x, center.y, axes.x, axes.y, angle, 0, Math.PI * 2);
        labelCtx.fill();
        
        // Nucleus
        const nucleusCenter = {
            x: center.x + (Math.random() - 0.5) * 40,
            y: center.y + (Math.random() - 0.5) * 40
        };
        const nucleusRadius = SIZE * 0.06 + (Math.random() - 0.5) * SIZE * 0.02;
        
        const nucGradient = imageCtx.createRadialGradient(nucleusCenter.x, nucleusCenter.y, 0, nucleusCenter.x, nucleusCenter.y, nucleusRadius);
        nucGradient.addColorStop(0, 'rgba(100, 100, 255, 1)');
        nucGradient.addColorStop(1, 'rgba(50, 50, 200, 0.2)');
        imageCtx.fillStyle = nucGradient;
        imageCtx.beginPath();
        imageCtx.arc(nucleusCenter.x, nucleusCenter.y, nucleusRadius, 0, Math.PI * 2);
        imageCtx.fill();

        imageCtx.globalCompositeOperation = 'source-over';
    }

    private drawNeuron(imageCtx: CanvasRenderingContext2D, labelCtx: CanvasRenderingContext2D, center: {x: number, y: number}, labelColor: string) {
        const somaRadius = SIZE * 0.1 + (Math.random() - 0.5) * SIZE * 0.04;
        
        // Draw Soma
        imageCtx.globalCompositeOperation = 'lighter';
        const somaGradient = imageCtx.createRadialGradient(center.x, center.y, 0, center.x, center.y, somaRadius);
        somaGradient.addColorStop(0, 'rgba(0, 255, 150, 0.9)');
        somaGradient.addColorStop(1, 'rgba(0, 100, 50, 0.2)');
        imageCtx.fillStyle = somaGradient;
        imageCtx.beginPath();
        imageCtx.arc(center.x, center.y, somaRadius, 0, Math.PI * 2);
        imageCtx.fill();

        labelCtx.fillStyle = labelColor;
        labelCtx.beginPath();
        labelCtx.arc(center.x, center.y, somaRadius, 0, Math.PI * 2);
        labelCtx.fill();
        
        // Draw Dendrites
        const numDendrites = 5 + Math.floor(Math.random() * 4);
        for(let i=0; i<numDendrites; i++) {
            const startAngle = Math.random() * Math.PI * 2;
            const startX = center.x + Math.cos(startAngle) * somaRadius * 0.8;
            const startY = center.y + Math.sin(startAngle) * somaRadius * 0.8;
            const endX = center.x + (Math.random() - 0.5) * SIZE;
            const endY = center.y + (Math.random() - 0.5) * SIZE;
            
            const path = this.createWigglyPath(startX, startY, endX, endY, 5, 15);
            
            imageCtx.strokeStyle = 'rgba(0, 200, 100, 0.6)';
            imageCtx.lineWidth = 3 + Math.random() * 3;
            imageCtx.stroke(path);

            labelCtx.strokeStyle = labelColor;
            labelCtx.lineWidth = imageCtx.lineWidth;
            labelCtx.stroke(path);
        }
        imageCtx.globalCompositeOperation = 'source-over';
    }

    private createWigglyPath(sx: number, sy: number, ex: number, ey: number, segments: number, wiggle: number): Path2D {
        const path = new Path2D();
        path.moveTo(sx, sy);
        const dx = (ex - sx) / segments;
        const dy = (ey - sy) / segments;
        for (let i = 1; i < segments; i++) {
            path.lineTo(
                sx + dx * i + (Math.random() - 0.5) * wiggle,
                sy + dy * i + (Math.random() - 0.5) * wiggle
            );
        }
        path.lineTo(ex, ey);
        return path;
    }
    
    private applyVariations(baseCanvas: HTMLCanvasElement, labelId: number) {
        // --- Apply transformations to both canvases simultaneously ---
        [this.imageCtx, this.labelCtx].forEach(ctx => {
            ctx.save();
            ctx.translate(SIZE / 2, SIZE / 2);

            const angle = Math.random() * Math.PI * 2;
            ctx.rotate(angle);

            const scale = 0.8 + Math.random() * 0.4;
            ctx.scale(scale, scale);

            if (Math.random() > 0.5) ctx.scale(-1, 1);
            if (Math.random() > 0.5) ctx.scale(1, -1);
            
            const offsetX = (Math.random() - 0.5) * SIZE * 0.5;
            const offsetY = (Math.random() - 0.5) * SIZE * 0.5;
            
            ctx.translate(-SIZE / 2 + offsetX, -SIZE / 2 + offsetY);
            ctx.drawImage(baseCanvas, 0, 0);
            ctx.restore();
        });

        this.imageCtx.save();
        const brightness = 0.7 + Math.random() * 0.6;
        const contrast = 0.8 + Math.random() * 0.4;
        const blur = Math.random() > 0.5 ? Math.random() * 0.5 : 0;
        this.imageCtx.filter = `brightness(${brightness}) contrast(${contrast}) blur(${blur}px)`;
        
        // Need to draw to a temp canvas to apply filter, then draw back
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = SIZE;
        tempCanvas.height = SIZE;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(this.imageCanvas, 0, 0);

        this.imageCtx.clearRect(0, 0, SIZE, SIZE);
        this.imageCtx.drawImage(tempCanvas, 0, 0);

        this.imageCtx.restore();
    }

    private applyMicroscopyEffects(artifacts: SimArtifact[]) {
        if (artifacts.includes('PSF_Blur')) {
            this.imageCtx.save();
            this.imageCtx.filter = 'blur(1px) brightness(1.1)';
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = SIZE;
            tempCanvas.height = SIZE;
            tempCanvas.getContext('2d')!.drawImage(this.imageCanvas, 0, 0);
            this.imageCtx.clearRect(0,0,SIZE,SIZE);
            this.imageCtx.drawImage(tempCanvas, 0, 0);
            this.imageCtx.restore();
        }

        if (artifacts.includes('Poisson_Noise')) {
            this.addPoissonNoise(this.imageCtx);
        }

        if (artifacts.includes('Uneven_Illumination')) {
            this.imageCtx.save();
            const gradient = this.imageCtx.createRadialGradient(SIZE/2, SIZE/2, 0, SIZE/2, SIZE/2, SIZE * 0.8);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0.7)');
            this.imageCtx.globalCompositeOperation = 'multiply';
            this.imageCtx.fillStyle = gradient;
            this.imageCtx.fillRect(0, 0, SIZE, SIZE);
            this.imageCtx.restore();
        }
    }
    
    private addPoissonNoise(ctx: CanvasRenderingContext2D) {
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const signal = (data[i] + data[i+1] + data[i+2])/3;
            if (signal > 5) { // only apply to signal, not background
                const noise = Math.sqrt(signal) * (Math.random() - 0.5) * 3;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
}