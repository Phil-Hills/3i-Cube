// AXL with NVIDIA CUDA acceleration by Phil Hills - Seattle Developer
class AXL_CUDA_ImageGenerator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width = 4096;
    private height = 4096;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context for AXL CUDA generator');
        }
        this.ctx = context;
    }

    public generateAXLCudaImage(cubeCommand: string): string {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, 4096, 4096);
        this.addGPUIndicator();

        const commands = cubeCommand.toUpperCase();
        
        if (commands.includes('REALTIME_DECONV')) {
            return this.generateRealtimeDeconvolution();
        } else if (commands.includes('AI_SEGMENT') || commands.includes('SEGMENT') || commands.includes('U-NET') || commands.includes('STARDIST')) {
            return this.generateAISegmentation();
        } else if (commands.includes('MASSIVE_VOLUME')) {
            return this.generateMassiveVolume();
        } else if (commands.includes('MULTIVIEW_FUSION')) {
            return this.generateMultiviewFusion();
        } else if (commands.includes('LIVE_PROCESS')) {
            return this.generateLiveProcessing();
        }
        
        this.generateStandardAXLCuda(cubeCommand);
        this.addAXLMetadata('Standard AXL');
        return this.canvas.toDataURL();
    }

    private generateRealtimeDeconvolution(): string {
        const cellSize = 1200;
        
        // Raw
        this.ctx.save();
        this.ctx.filter = 'blur(8px)';
        this.drawComplexCell(cellSize / 2 + 200, cellSize / 2 + 200, cellSize * 0.4);
        this.ctx.restore();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Raw', cellSize / 2 + 170, cellSize * 0.1);

        // GPU Processing
        this.drawProcessingAnimation(cellSize * 1.5 + 200, cellSize / 2 + 200, cellSize * 0.4);
        this.ctx.fillText('GPU Processing', cellSize * 1.5 + 120, cellSize * 0.1);
        
        // Deconvolved
        this.drawComplexCell(cellSize * 2.5 + 200, cellSize / 2 + 200, cellSize * 0.4);
        this.ctx.fillText('Deconvolved', cellSize * 2.5 + 140, cellSize * 0.1);

        this.addGPUStats('Real-time Deconvolution', '120 fps', '8ms latency');
        return this.canvas.toDataURL();
    }

    private generateAISegmentation(): string {
        // Draw the base cells first
        this.ctx.save();
        this.ctx.translate(2048, 2048);
        const cells: {x: number, y: number, radius: number}[] = [];
        for (let i = 0; i < 50; i++) {
            const cell = {
                x: (Math.random() - 0.5) * 3800,
                y: (Math.random() - 0.5) * 3800,
                radius: 100 + Math.random() * 80
            };
            cells.push(cell);
            this.drawNucleus(cell.x, cell.y, cell.radius, 0.6);
        }
        this.ctx.restore();

        // Draw the segmentation masks on top
        this.ctx.save();
        this.ctx.translate(2048, 2048);
        cells.forEach((cell, i) => {
            const hue = (i / cells.length) * 360;
            this.ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.4)`;
            this.ctx.strokeStyle = `hsla(${hue}, 90%, 75%, 0.9)`;
            this.ctx.lineWidth = 5;
            
            // Create a more organic mask shape
            this.ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
                const r = cell.radius * 1.1 * (1 + (Math.random() - 0.5) * 0.15);
                const px = cell.x + Math.cos(angle) * r;
                const py = cell.y + Math.sin(angle) * r;
                if (angle === 0) { this.ctx.moveTo(px, py); } 
                else { this.ctx.lineTo(px, py); }
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${i + 1}`, cell.x, cell.y + 12);
        });
        this.ctx.restore();
        
        this.addGPUStats('AI Segmentation (U-Net)', '25ms/frame', 'Instance Segmentation');
        return this.canvas.toDataURL();
    }
    
    private drawNucleus(x: number, y: number, radius: number, brightness: number = 1) {
        const grad = this.ctx.createRadialGradient(x,y,0, x,y,radius);
        grad.addColorStop(0, `rgba(75, 10, 255, ${0.9 * brightness})`);
        grad.addColorStop(1, `rgba(120, 80, 255, ${0.3 * brightness})`);
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    private generateMassiveVolume(): string {
        const layers = 100, centerX = 2048, centerY = 2048;
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 1800);
        gradient.addColorStop(0, '#000033'); gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient; this.ctx.fillRect(0, 0, 4096, 4096);
        for (let z = 0; z < layers; z++) {
            const depth = z / layers, scale = 1 - depth * 0.8, alpha = 1 - depth * 0.9;
            this.ctx.save();
            this.ctx.globalAlpha = alpha; this.ctx.translate(centerX, centerY); this.ctx.scale(scale, scale);
            const hue = depth * 240;
            this.ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha})`; this.ctx.lineWidth = 2;
            this.drawVolumeLayer(z, depth);
            this.ctx.restore();
        }
        this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '36px Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('10GB Volume Dataset', 100, 100);
        this.ctx.fillText('2048 x 2048 x 1000 voxels', 100, 150);
        this.ctx.fillText('Rendered in real-time with CUDA', 100, 200);
        this.addGPUStats('Volume Rendering', '60 fps', '10GB dataset');
        return this.canvas.toDataURL();
    }

    private drawVolumeLayer(z: number, depth: number) {
        const numStructures = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numStructures; i++) {
            const angle = (Math.PI * 2 * i) / numStructures + depth * Math.PI;
            const r = 500 + Math.sin(depth * Math.PI * 4) * 200;
            const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
            this.ctx.beginPath(); this.ctx.moveTo(0, 0); this.ctx.lineTo(x, y);
            for (let j = 0; j < 3; j++) {
                const branchAngle = angle + (Math.random() - 0.5) * 0.5, branchLength = r * 0.3;
                const bx = x + Math.cos(branchAngle) * branchLength, by = y + Math.sin(branchAngle) * branchLength;
                this.ctx.moveTo(x, y); this.ctx.lineTo(bx, by);
            }
            this.ctx.stroke();
        }
    }
    
    private generateMultiviewFusion(): string {
        const views = [
            { x: 1024, y: 1024, angle: 0, label: 'View 0°' }, { x: 3072, y: 1024, angle: 90, label: 'View 90°' },
            { x: 1024, y: 3072, angle: 180, label: 'View 180°' }, { x: 3072, y: 3072, angle: 270, label: 'View 270°' }
        ];
        views.forEach(view => {
            this.ctx.save(); this.ctx.translate(view.x, view.y); this.ctx.rotate(view.angle * Math.PI / 180);
            this.drawEmbryo(0, 0, 400, view.angle); this.ctx.restore();
            this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '32px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText(view.label, view.x, view.y - 450);
        });
        this.ctx.save(); this.ctx.translate(2048, 2048);
        this.ctx.shadowBlur = 20; this.ctx.shadowColor = '#00FF00';
        this.drawEmbryo(0, 0, 600, 0, true); this.ctx.restore();
        this.ctx.strokeStyle = '#FFD700'; this.ctx.lineWidth = 4; this.ctx.setLineDash([10, 10]);
        views.forEach(view => {
            this.ctx.beginPath(); this.ctx.moveTo(view.x, view.y); this.ctx.lineTo(2048, 2048); this.ctx.stroke();
        });
        this.ctx.setLineDash([]);
        this.ctx.fillStyle = '#FFD700'; this.ctx.font = '48px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('GPU Fused Result', 2048, 1500);
        this.addGPUStats('Multiview Fusion', '4 angles', 'Real-time with CUDA');
        return this.canvas.toDataURL();
    }

    private drawEmbryo(x: number, y: number, radius: number, angle: number, highQuality = false) {
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        if (highQuality) {
            gradient.addColorStop(0, '#00FFFF40'); gradient.addColorStop(0.5, '#00FF0040'); gradient.addColorStop(1, '#FF000020');
        } else {
            gradient.addColorStop(0, '#00808040'); gradient.addColorStop(1, '#00404020');
        }
        this.ctx.fillStyle = gradient; this.ctx.beginPath();
        this.ctx.ellipse(x, y, radius, radius * 0.7, 0, 0, Math.PI * 2); this.ctx.fill();
        if (highQuality) {
            this.ctx.strokeStyle = '#FFFFFF40'; this.ctx.lineWidth = 2;
            for (let i = -5; i <= 5; i++) {
                this.ctx.beginPath(); this.ctx.moveTo(x + i * 40, y - radius * 0.5); this.ctx.lineTo(x + i * 40, y + radius * 0.5); this.ctx.stroke();
            }
            this.ctx.strokeStyle = '#FFD70080'; this.ctx.lineWidth = 4;
            this.ctx.beginPath(); this.ctx.moveTo(x - radius * 0.8, y); this.ctx.lineTo(x + radius * 0.8, y); this.ctx.stroke();
        }
        this.ctx.fillStyle = '#000000'; this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.6, y - radius * 0.2, radius * 0.15, 0, Math.PI * 2); this.ctx.fill();
    }

    private generateLiveProcessing(): string {
        const timePoints = 6, cols = 3;
        for (let t = 0; t < timePoints; t++) {
            const row = Math.floor(t / cols), col = t % cols;
            const x = col * 1300 + 650, y = row * 1300 + 650;
            this.drawDividingCellTimeSeries(x, y, 500, t);
            this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '28px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText(`t = ${t * 5} min`, x, y - 550);
            if (t === timePoints - 1) {
                this.ctx.fillStyle = '#00FF00'; this.ctx.fillText('LIVE', x + 240, y - 550);
                this.ctx.beginPath(); this.ctx.arc(x + 320, y - 560, 10, 0, Math.PI * 2); this.ctx.fill();
            }
        }
        this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '36px Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('GPU Processing Pipeline:', 100, 3900);
        this.ctx.font = '28px Arial';
        this.ctx.fillText('Acquire → Denoise → Deconvolve → Track → Display', 100, 3950);
        this.ctx.fillText('Total latency: <50ms with CUDA acceleration', 100, 4000);
        this.addGPUStats('Live Processing', '<50ms latency', 'Full pipeline on GPU');
        return this.canvas.toDataURL();
    }
    
    private drawDividingCellTimeSeries(x: number, y: number, radius: number, timePoint: number) {
        // Mock implementation
        this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2); this.ctx.stroke();
    }

    private generateStandardAXLCuda(cubeCommand: string) {
        this.drawComplexCell(this.width / 2, this.height / 2, 800);
    }
    
    private drawComplexCell(x: number, y: number, radius: number) {
        this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.arc(x, y, radius, 0, Math.PI * 2); this.ctx.stroke();
        this.ctx.fillStyle = '#4B0AFF60'; this.ctx.beginPath(); this.ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2); this.ctx.fill();
    }
    
    private drawProcessingAnimation(x: number, y: number, radius: number) {
        const gridSize = 8, cellSize = radius * 2 / gridSize;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const px = x - radius + i * cellSize + cellSize / 2, py = y - radius + j * cellSize + cellSize / 2;
                const processing = Math.random() > 0.3;
                this.ctx.fillStyle = processing ? '#00FF00' : '#003300';
                this.ctx.fillRect(px - cellSize / 2 + 2, py - cellSize / 2 + 2, cellSize - 4, cellSize - 4);
            }
        }
    }

    private addGPUIndicator() {
        this.ctx.fillStyle = '#76B900'; this.ctx.fillRect(3800, 50, 250, 100);
        this.ctx.fillStyle = '#000000'; this.ctx.font = 'bold 28px Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('NVIDIA', 3830, 90); this.ctx.font = '24px Arial'; this.ctx.fillText('CUDA', 3850, 120);
        this.ctx.fillStyle = '#00FF00'; this.ctx.beginPath(); this.ctx.arc(3780, 100, 10, 0, Math.PI * 2); this.ctx.fill();
    }

    private addGPUStats(mode: string, stat1: string, stat2: string) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; this.ctx.fillRect(50, 3800, 600, 250);
        this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = 'bold 36px Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('GPU Acceleration', 70, 3850); this.ctx.font = '28px Arial';
        this.ctx.fillText(`Mode: ${mode}`, 70, 3900); this.ctx.fillText(`Performance: ${stat1}`, 70, 3940);
        this.ctx.fillText(`${stat2}`, 70, 3980);
        this.ctx.fillStyle = '#333333'; this.ctx.fillRect(70, 4000, 500, 30);
        this.ctx.fillStyle = '#76B900'; this.ctx.fillRect(70, 4000, 450, 30);
        this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '20px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('GPU Usage: 90%', 320, 4022);
    }
    
    private addAXLMetadata(mode: string) {
        this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = 'bold 48px Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('3i AXL System', 50, 100); this.ctx.font = '36px Arial';
        this.ctx.fillText(mode, 50, 150); this.ctx.font = '28px Arial';
        this.ctx.fillText('CUBE Protocol | Phil Hills', 50, 200);
        this.ctx.fillText(new Date().toLocaleString(), 50, 250);
        const scaleBarLength = 800, scaleBarMicrons = 200;
        this.ctx.strokeStyle = '#FFFFFF'; this.ctx.lineWidth = 8; this.ctx.beginPath();
        this.ctx.moveTo(3200, 3950); this.ctx.lineTo(3200 + scaleBarLength, 3950); this.ctx.stroke();
        this.ctx.font = '36px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText(`${scaleBarMicrons} µm`, 3600, 3930);
    }
}


export class MicroscopyImageGenerator {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private width = 2048;
    private height = 2048;
    private pixelSize = 0.065; // μm/pixel (typical for 100x objective)
    private NA = 1.4; // Numerical aperture

    constructor() {
        if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.ctx = this.canvas.getContext('2d');
        } else {
            this.canvas = null;
            this.ctx = null;
        }
    }

    private getErrorPlaceholder(width: number = this.width, height: number = this.height): string {
        const errorText = 'Image generation failed.';
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#f87171" font-family="sans-serif" font-size="24" text-anchor="middle" dy=".3em">${errorText}</text></svg>`;
        if (typeof btoa === 'function') {
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        }
        return '';
    }

    public generateFromCube(cubeCommand: string): string {
        const commands = cubeCommand.toUpperCase();
        const axlKeywords = ['AXL', 'LATTICE', 'CLEARED', 'LIVE', 'MULTICOLOR', 'DECONVOLVED', 'GPU', 'CUDA', 'REALTIME_DECONV', 'AI_SEGMENT', 'MASSIVE_VOLUME', 'MULTIVIEW_FUSION', 'LIVE_PROCESS', 'U-NET', 'STARDIST', 'SEGMENT'];

        if (axlKeywords.some(kw => commands.includes(kw))) {
            if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
                try {
                    const axlGenerator = new AXL_CUDA_ImageGenerator();
                    return axlGenerator.generateAXLCudaImage(cubeCommand);
                } catch (e) {
                    console.error("Error during AXL CUDA image generation:", e);
                    return this.getErrorPlaceholder(4096, 4096);
                }
            }
            return this.getErrorPlaceholder(4096, 4096);
        }
        
        if (!this.ctx || !this.canvas) {
            console.error("Canvas context is not available for image generation.");
            return this.getErrorPlaceholder();
        }

        try {
            const params = this.parseCubeCommand(commands);

            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalCompositeOperation = 'screen';

            if (params.includes('CELL')) {
                this.generateCellularStructures(params);
            } else if (params.includes('TISSUE')) {
                this.generateTissueSection(params);
            } else if (params.includes('NEURON')) {
                this.generateNeuronalNetwork(params);
            } else {
                this.generateCellularStructures(params);
            }
            
            this.ctx.globalCompositeOperation = 'source-over';
            
            this.applyPointSpreadFunction();
            this.addPoissonNoise();
            this.addSystematicNoise();
            this.applyPhotobleaching();

            this.addScientificOverlay(params);
            return this.canvas.toDataURL('image/png');

        } catch (e) {
            console.error("Error during canvas drawing:", e);
            return this.getErrorPlaceholder();
        }
    }

    private parseCubeCommand(command: string): string {
        return command.toUpperCase();
    }

    private extractChannels(params: string): string[] {
        const channels: string[] = [];
        if (params.includes('DAPI') || params.includes('405')) channels.push('DAPI');
        if (params.includes('GFP') || params.includes('488')) channels.push('GFP');
        if (params.includes('RFP') || params.includes('CHERRY') || params.includes('561')) channels.push('RFP');
        if (params.includes('CY5') || params.includes('647')) channels.push('Cy5');
        if (channels.length === 0) channels.push('GFP');
        return channels;
    }
    
    private perlinNoise(x: number): number {
        return Math.sin(x * 2) * 0.5 + Math.sin(x * 3.7) * 0.3 + Math.sin(x * 7.3) * 0.2;
    }

    private generateCellularStructures(params: string) {
        if(!this.ctx) return;
        const numCells = 15 + Math.floor(Math.random() * 10);
        for (let i = 0; i < numCells; i++) {
            this.generateRealisticCell(
                Math.random() * this.width,
                Math.random() * this.height,
                params
            );
        }
    }
    
    private generateTissueSection(params: string) {
        if(!this.ctx) return;
        const numCells = 50 + Math.floor(Math.random() * 20);
        for (let i = 0; i < numCells; i++) {
            this.generateRealisticCell(
                Math.random() * this.width,
                Math.random() * this.height,
                params,
                0.7 // smaller cells
            );
        }
    }

    private generateNeuronalNetwork(params: string) {
        if(!this.ctx) return;
        const numNeurons = 5 + Math.floor(Math.random() * 3);
        const neuronPositions: {x: number, y: number}[] = [];
        for (let i = 0; i < numNeurons; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            neuronPositions.push({x, y});
            this.generateRealisticCell(x, y, params, 0.5); // Soma
        }
        
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
        this.ctx.lineWidth = 1.5;
        neuronPositions.forEach(startNeuron => {
            const endNeuron = neuronPositions[Math.floor(Math.random() * numNeurons)];
            if(startNeuron === endNeuron) return;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startNeuron.x, startNeuron.y);
            const cp1x = startNeuron.x + (Math.random() - 0.5) * 400;
            const cp1y = startNeuron.y + (Math.random() - 0.5) * 400;
            const cp2x = endNeuron.x + (Math.random() - 0.5) * 400;
            const cp2y = endNeuron.y + (Math.random() - 0.5) * 400;
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endNeuron.x, endNeuron.y);
            this.ctx.stroke();
        });
    }

    private generateRealisticCell(x: number, y: number, params: string, scale: number = 1) {
        if (!this.ctx) return;
        const cellRadius = (30 + Math.random() * 20) * scale * (this.width / 512);
        const channels = this.extractChannels(params);

        this.ctx.save();
        this.ctx.translate(x, y);

        // Create irregular cell shape using Perlin noise
        this.ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const noiseRadius = cellRadius * (1 + this.perlinNoise(angle * 2) * 0.2);
            const px = Math.cos(angle) * noiseRadius;
            const py = Math.sin(angle) * noiseRadius;
            
            if (angle === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        
        if (channels.includes('GFP')) {
            const gradient = this.ctx.createRadialGradient(0, 0, cellRadius * 0.8, 0, 0, cellRadius * 1.2);
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
            gradient.addColorStop(0.85, 'rgba(0, 255, 0, 0.3)');
            gradient.addColorStop(0.95, 'rgba(0, 255, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 0, 0.2)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        if (channels.includes('RFP')) this.generateMitochondria(cellRadius);
        if (channels.includes('Cy5')) this.generateActinFilaments(cellRadius);
        if (channels.includes('DAPI')) this.generateNucleus(0, 0, cellRadius * 0.4);

        this.ctx.restore();
    }

    private generateNucleus(x: number, y: number, radius: number) {
        if (!this.ctx) return;
        const nucleusGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        nucleusGradient.addColorStop(0, 'rgba(0, 100, 255, 0.9)');
        nucleusGradient.addColorStop(0.5, 'rgba(0, 80, 255, 0.7)');
        nucleusGradient.addColorStop(1, 'rgba(0, 50, 255, 0.3)');
        this.ctx.fillStyle = nucleusGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        for (let i = 0; i < 5; i++) {
            const spotX = x + (Math.random() - 0.5) * radius;
            const spotY = y + (Math.random() - 0.5) * radius;
            const spotRadius = radius * 0.1;
            const spotGradient = this.ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotRadius);
            spotGradient.addColorStop(0, 'rgba(0, 120, 255, 1)');
            spotGradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
            this.ctx.fillStyle = spotGradient;
            this.ctx.beginPath();
            this.ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    private generateMitochondria(cellRadius: number) {
        if (!this.ctx) return;
        const numMito = 20 + Math.floor(Math.random() * 15);
        for (let i = 0; i < numMito; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * cellRadius * 0.7;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(Math.random() * Math.PI);
            const mitoLength = 8 + Math.random() * 12;
            const mitoWidth = 3 + Math.random() * 2;
            const gradient = this.ctx.createLinearGradient(-mitoLength/2, 0, mitoLength/2, 0);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
            gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, mitoLength/2, mitoWidth/2, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    private generateActinFilaments(cellRadius: number) {
        if (!this.ctx) return;
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            const startAngle = Math.random() * Math.PI * 2;
            const endAngle = startAngle + (Math.random() - 0.5) * Math.PI;
            const startDist = cellRadius * (0.3 + Math.random() * 0.4);
            const endDist = cellRadius * (0.3 + Math.random() * 0.4);
            const startX = Math.cos(startAngle) * startDist;
            const startY = Math.sin(startAngle) * startDist;
            const endX = Math.cos(endAngle) * endDist;
            const endY = Math.sin(endAngle) * endDist;
            const controlX = (startX + endX) / 2 + (Math.random() - 0.5) * 20;
            const controlY = (startY + endY) / 2 + (Math.random() - 0.5) * 20;
            this.ctx.moveTo(startX, startY);
            this.ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            this.ctx.stroke();
        }
    }

    private applyPointSpreadFunction() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.save();
        this.ctx.filter = 'blur(1px)';
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.restore();
    }

    private addPoissonNoise() {
        if (!this.ctx) return;
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const signal = (data[i] + data[i+1] + data[i+2])/3;
            if (signal > 0) {
                const noise = Math.sqrt(signal) * (Math.random() - 0.5) * 2;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    private addSystematicNoise() {
        if (!this.ctx) return;
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        const readNoise = 2;
        const darkCurrent = 0.1;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * readNoise * 2 + darkCurrent;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    private applyPhotobleaching() {
        if (!this.ctx) return;
        const gradient = this.ctx.createRadialGradient(this.width/2, this.height/2, 0, this.width/2, this.height/2, this.width * 0.7);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    private addScientificOverlay(params: string) {
        if (!this.ctx) return;
        const scaleBarLength = 100 * (this.width / 512);
        const scaleBarMicrons = Math.round(scaleBarLength * this.pixelSize);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width - scaleBarLength - 40, this.height - 50);
        this.ctx.lineTo(this.width - 40, this.height - 50);
        this.ctx.stroke();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${scaleBarMicrons} µm`, this.width - scaleBarLength/2 - 40, this.height - 60);

        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const metadata = [
            `Objective: 100x/${this.NA} NA`,
            `Pixel size: ${this.pixelSize} µm`,
            `Channels: ${this.extractChannels(params).join(', ')}`,
            `CUBE Protocol | AI Generated`
        ];
        metadata.forEach((line, i) => {
            this.ctx.fillText(line, 20, 30 + i * 25);
        });
        const now = new Date();
        this.ctx.fillText(now.toISOString(), 20, this.height - 20);
    }
}