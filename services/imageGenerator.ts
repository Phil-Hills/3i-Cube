// Accurate 3i AXL simulations by Phil Hills
class ThreeI_AXL_ImageGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width = 2560;
  private height = 2160;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const context = this.canvas.getContext('2d');
    if (!context) {
        throw new Error('Failed to get 2D context for AXL generator');
    }
    this.ctx = context;
  }

  public generateAXLImage(cubeCommand: string): string {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const commands = cubeCommand.toUpperCase();
    let mode = 'Standard AXL';

    if (commands.includes('LATTICE')) {
      this.generateLatticeLightSheet();
      mode = 'Lattice Light Sheet';
    } else if (commands.includes('CLEARED')) {
      this.generateClearedTissue();
      mode = 'Cleared Tissue - 500μm depth';
    } else if (commands.includes('LIVE')) {
      this.generateLiveCellAXL();
      mode = 'Live Cell - 37°C, 5% CO2';
    } else if (commands.includes('MULTICOLOR')) {
      this.generateMultiColorAXL();
      mode = '6-Color Imaging';
    } else if (commands.includes('DECONVOLVED')) {
      this.generateDeconvolvedAXL();
      mode = 'AI-Powered Deconvolution';
    } else {
      this.generateStandardAXL(cubeCommand);
    }

    if (!commands.includes('DECONVOLVED')) { // Deconvolved adds its own metadata
        this.addAXLMetadata(mode);
    }
    
    return this.canvas.toDataURL();
  }
  
  private generateStandardAXL(cubeCommand: string) {
    this.drawInterphaseCell(this.width / 2, this.height / 2);
  }

  private generateLatticeLightSheet() {
    for (let z = 0; z < 20; z++) {
      this.ctx.save();
      const alpha = 1 - (Math.abs(z - 10) / 10) * 0.7;
      this.ctx.globalAlpha = alpha;
      this.drawMitochondria(z);
      this.drawEndoplasmicReticulum(z);
      this.ctx.restore();
    }
  }

  private drawMitochondria(zPlane: number) {
    const numMito = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < numMito; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const length = 40 + Math.random() * 60;
      const width = 15 + Math.random() * 10;
      const angle = Math.random() * Math.PI;
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(angle);
      this.ctx.strokeStyle = '#00FF00';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, length/2, width/2, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.strokeStyle = '#00FF0080';
      this.ctx.lineWidth = 1;
      for (let j = -length/2 + 10; j < length/2 - 10; j += 8) {
        this.ctx.beginPath();
        this.ctx.moveTo(j, -width/3);
        this.ctx.lineTo(j, width/3);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }

  private drawEndoplasmicReticulum(zPlane: number) {
    this.ctx.strokeStyle = '#FFD70040';
    this.ctx.lineWidth = 3;
    const points: {x: number, y: number}[] = [];
    for (let i = 0; i < 20; i++) { points.push({ x: Math.random() * this.width, y: Math.random() * this.height }); }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (dist < 300 && Math.random() > 0.5) {
          this.ctx.beginPath();
          this.ctx.moveTo(points[i].x, points[i].y);
          this.ctx.lineTo(points[j].x, points[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private generateClearedTissue() {
    const numNeurons = 30;
    for (let i = 0; i < numNeurons; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const z = Math.random() * 100;
      const hue = (z / 100) * 240;
      this.ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
      this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 20 - z/10, 0, Math.PI * 2);
      this.ctx.fill();
      this.drawDendrites(x, y, z);
    }
    this.drawBloodVessels();
  }

  private drawDendrites(x: number, y: number, z: number) {
    this.ctx.lineWidth = Math.max(0.5, 2 - z/50);
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.5;
      const length = 100 + Math.random() * 100;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      let currentX = x; let currentY = y;
      for (let j = 0; j < 5; j++) {
        const nextX = currentX + Math.cos(angle) * length/5;
        const nextY = currentY + Math.sin(angle) * length/5;
        this.ctx.lineTo(nextX, nextY);
        if (Math.random() > 0.5) {
          const branchAngle = angle + (Math.random() - 0.5);
          const branchX = nextX + Math.cos(branchAngle) * 30;
          const branchY = nextY + Math.sin(branchAngle) * 30;
          this.ctx.moveTo(nextX, nextY);
          this.ctx.lineTo(branchX, branchY);
          this.ctx.moveTo(nextX, nextY);
        }
        currentX = nextX; currentY = nextY;
      }
      this.ctx.stroke();
    }
  }

  private drawBloodVessels() {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.4)';
      this.ctx.lineWidth = 25;
      this.ctx.beginPath();
      this.ctx.moveTo(-50, this.height * 0.3);
      this.ctx.bezierCurveTo(this.width*0.2, this.height*0.2, this.width*0.6, this.height*0.4, this.width*0.9, this.height*0.3);
      this.ctx.stroke();
      this.ctx.lineWidth = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(this.width*0.8, -50);
      this.ctx.bezierCurveTo(this.width*0.7, this.height*0.3, this.width*0.8, this.height*0.7, this.width*0.6, this.height + 50);
      this.ctx.stroke();
      this.ctx.restore();
  }

  private generateLiveCellAXL() {
    const numCells = 8;
    for (let i = 0; i < numCells; i++) {
      const x = 300 + (i % 4) * 500;
      const y = 300 + Math.floor(i / 4) * 500;
      const phase = Math.random() * Math.PI * 2;
      if (phase < Math.PI / 2) { this.drawInterphaseCell(x, y); }
      else if (phase < Math.PI) { this.drawProphaseCell(x, y); }
      else if (phase < 1.5 * Math.PI) { this.drawMetaphaseCell(x, y); }
      else { this.drawDividingCell(x, y); }
    }
  }

  private drawInterphaseCell(x: number, y: number) {
    const radius = 80;
    this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 3;
    this.ctx.beginPath(); this.ctx.arc(x, y, radius, 0, Math.PI * 2); this.ctx.stroke();
    this.ctx.fillStyle = '#4B0AFF';
    this.ctx.beginPath(); this.ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.fillStyle = '#6B3AFF';
    this.ctx.beginPath(); this.ctx.arc(x - 10, y - 5, 5, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.beginPath(); this.ctx.arc(x + 8, y + 8, 4, 0, Math.PI * 2); this.ctx.fill();
  }

  private drawProphaseCell(x: number, y: number) { this.drawInterphaseCell(x, y); } 
  private drawDividingCell(x: number, y: number) { this.drawMetaphaseCell(x, y); } 

  private drawMetaphaseCell(x: number, y: number) {
    const radius = 85;
    this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 3;
    this.ctx.beginPath(); this.ctx.arc(x, y, radius, 0, Math.PI * 2); this.ctx.stroke();
    this.ctx.strokeStyle = '#4B0AFF'; this.ctx.lineWidth = 8;
    this.ctx.beginPath(); this.ctx.moveTo(x - 30, y); this.ctx.lineTo(x + 30, y); this.ctx.stroke();
    for (let i = -25; i <= 25; i += 10) {
      this.ctx.fillStyle = '#6B3AFF';
      this.ctx.beginPath(); this.ctx.ellipse(x + i, y, 4, 8, Math.PI / 2, 0, Math.PI * 2); this.ctx.fill();
    }
  }

  private generateMultiColorAXL() {
    const cellX = this.width/2, cellY = this.height/2, cellRadius = 300;
    this.ctx.strokeStyle = '#FF0000'; this.ctx.lineWidth = 4;
    this.ctx.beginPath(); this.ctx.arc(cellX, cellY, cellRadius, 0, Math.PI * 2); this.ctx.stroke();
    this.ctx.fillStyle = '#4B0AFF80';
    this.ctx.beginPath(); this.ctx.arc(cellX, cellY, cellRadius * 0.3, 0, Math.PI * 2); this.ctx.fill();
    this.generateMitochondriaPattern(cellX, cellY, cellRadius);
    this.drawGolgiApparatus(cellX - 100, cellY - 50);
    this.drawLysosomes(cellX, cellY, cellRadius);
    this.drawMicrotubuleNetwork(cellX, cellY, cellRadius);
  }

  private generateMitochondriaPattern(cellX: number, cellY: number, cellRadius: number) {
    this.ctx.save(); this.ctx.fillStyle = '#00FF0040';
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = cellRadius * (0.4 + Math.random() * 0.5);
        const x = cellX + Math.cos(angle) * r; const y = cellY + Math.sin(angle) * r;
        this.ctx.beginPath(); this.ctx.ellipse(x, y, 20, 5, Math.random() * Math.PI, 0, Math.PI * 2); this.ctx.fill();
    } this.ctx.restore();
  }

  private drawMicrotubuleNetwork(cellX: number, cellY: number, cellRadius: number) {
      this.ctx.save(); this.ctx.strokeStyle = '#00FFFF30'; this.ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2; const r = cellRadius * 0.95;
          const endX = cellX + Math.cos(angle) * r; const endY = cellY + Math.sin(angle) * r;
          this.ctx.beginPath(); this.ctx.moveTo(cellX, cellY); this.ctx.lineTo(endX, endY); this.ctx.stroke();
      } this.ctx.restore();
  }

  private drawGolgiApparatus(x: number, y: number) {
    this.ctx.strokeStyle = '#FFA500'; this.ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath(); this.ctx.moveTo(x, y + i * 10);
      this.ctx.bezierCurveTo(x + 20, y + i * 10 - 5, x + 40, y + i * 10 + 5, x + 60, y + i * 10);
      this.ctx.stroke();
    }
  }

  private drawLysosomes(centerX: number, centerY: number, cellRadius: number) {
    const numLysosomes = 30;
    for (let i = 0; i < numLysosomes; i++) {
      const angle = Math.random() * Math.PI * 2; const r = Math.random() * cellRadius * 0.8;
      const x = centerX + Math.cos(angle) * r; const y = centerY + Math.sin(angle) * r;
      this.ctx.fillStyle = '#8B0000'; this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2); this.ctx.fill();
    }
  }

  private generateDeconvolvedAXL() {
    const midX = this.width / 2;
    this.ctx.save(); this.ctx.filter = 'blur(3px)';
    this.generateRawImage(0, 0, midX, this.height); this.ctx.restore();
    this.generateRawImage(midX, 0, midX, this.height);
    this.ctx.strokeStyle = '#FFFFFF'; this.ctx.lineWidth = 2;
    this.ctx.beginPath(); this.ctx.moveTo(midX, 0); this.ctx.lineTo(midX, this.height); this.ctx.stroke();
    this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '30px Arial';
    this.ctx.fillText('Raw', 50, 50); this.ctx.fillText('AI Deconvolved', midX + 50, 50);
  }

  private generateRawImage(xOffset: number, yOffset: number, width: number, height: number) {
    this.ctx.save();
    this.ctx.translate(xOffset, yOffset);
    this.ctx.beginPath(); this.ctx.rect(0, 0, width, height); this.ctx.clip();
    for (let i = 0; i < 5; i++) {
      const cellX = Math.random() * width; const cellY = Math.random() * height;
      this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 3;
      this.ctx.beginPath(); this.ctx.arc(cellX, cellY, 100, 0, Math.PI * 2); this.ctx.stroke();
      this.ctx.fillStyle = '#4B0AFF';
      this.ctx.beginPath(); this.ctx.arc(cellX, cellY, 40, 0, Math.PI * 2); this.ctx.fill();
    }
    this.ctx.restore();
  }
  
  private addAXLMetadata(mode: string) {
    this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`3i AXL System | ${mode}`, 30, 40);
    this.ctx.fillText('CUBE Protocol | Phil Hills', 30, 70);
    const scaleBarLength = 400; const scaleBarMicrons = 100;
    this.ctx.strokeStyle = '#FFFFFF'; this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - scaleBarLength - 60, this.height - 50);
    this.ctx.lineTo(this.width - 60, this.height - 50);
    this.ctx.stroke();
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${scaleBarMicrons} µm`, this.width - scaleBarLength/2 - 60, this.height - 60);
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(new Date().toLocaleString(), 30, this.height - 30);
  }
}

export class MicroscopyImageGenerator {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private width = 2048;
  private height = 2048;

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

    if (commands.includes('AXL') || commands.includes('LATTICE') || commands.includes('CLEARED') || commands.includes('LIVE') || commands.includes('MULTICOLOR') || commands.includes('DECONVOLVED')) {
        if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
            try {
                const axlGenerator = new ThreeI_AXL_ImageGenerator();
                return axlGenerator.generateAXLImage(cubeCommand);
            } catch (e) {
                console.error("Error during AXL image generation:", e);
                return this.getErrorPlaceholder(2560, 2160);
            }
        }
        return this.getErrorPlaceholder(2560, 2160);
    }
    
    if (!this.ctx || !this.canvas) {
      console.error("Canvas context is not available for image generation.");
      return this.getErrorPlaceholder();
    }

    try {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      if (commands.includes('CONFOCAL') || commands.includes('MARIANAS')) {
        this.generateConfocalImage(commands);
      } else if (commands.includes('LIGHTSHEET')) {
        this.generateLightSheetImage(commands);
      } else if (commands.includes('WIDEFIELD')) {
        this.generateWidefieldImage(commands);
      } else if (commands.includes('SIM') || commands.includes('SORA')) {
        this.generateSuperResImage(commands);
      } else {
        this.generateConfocalImage(commands);
      }

      this.addMetadata(commands);
      return this.canvas.toDataURL('image/png');

    } catch (e) {
      console.error("Error during canvas drawing:", e);
      return this.getErrorPlaceholder();
    }
  }

  private parseChannels(cubeCommand: string): string[] {
    const channels: string[] = [];
    if (cubeCommand.includes('DAPI') || cubeCommand.includes('405')) channels.push('405');
    if (cubeCommand.includes('GFP') || cubeCommand.includes('488')) channels.push('488');
    if (cubeCommand.includes('RFP') || cubeCommand.includes('CHERRY') || cubeCommand.includes('561')) channels.push('561');
    if (cubeCommand.includes('CY5') || cubeCommand.includes('647')) channels.push('647');
    if (channels.length === 0) channels.push('488');
    return channels;
  }

  private generateConfocalImage(cubeCommand: string) {
    const channels = this.parseChannels(cubeCommand);
    this.generateConfocalCells(channels);
  }

  private generateWidefieldImage(cubeCommand: string) {
    if (!this.ctx) return;
    const channels = this.parseChannels(cubeCommand);
    this.generateConfocalCells(channels);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.addNoise(50);
  }
  
  private generateConfocalCells(channels: string[]) {
    if(!this.ctx) return;
    const numCells = 5 + Math.floor(Math.random() * 10);
    this.ctx.globalCompositeOperation = 'screen';
    
    for (let i = 0; i < numCells; i++) {
      const x = 200 + Math.random() * (this.width - 400);
      const y = 200 + Math.random() * (this.height - 400);
      const radius = 80 + Math.random() * 60;

      if (channels.includes('488')) {
        this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 3; 
        this.ctx.beginPath(); this.ctx.arc(x, y, radius, 0, Math.PI * 2); this.ctx.stroke();
        this.drawCellularStructure(x, y, radius, '#00FF00');
      }
      if (channels.includes('561')) {
        this.ctx.strokeStyle = '#FFD700'; this.ctx.lineWidth = 3;
        this.ctx.beginPath(); this.ctx.arc(x, y, radius * (0.8 + Math.random()*0.2), 0, Math.PI * 2); this.ctx.stroke();
      }
      if (channels.includes('647')) {
        this.ctx.strokeStyle = '#FF0000'; this.ctx.lineWidth = 2;
        this.ctx.beginPath(); this.ctx.arc(x, y, radius, 0, Math.PI * 2); this.ctx.stroke();
      }
      if (channels.includes('405')) {
        const nucleusRadius = radius * 0.4;
        this.ctx.beginPath(); this.ctx.arc(x, y, nucleusRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4B0AFF'; this.ctx.fill();
        this.drawChromatinTexture(x, y, nucleusRadius);
      }
    }
    this.ctx.globalCompositeOperation = 'source-over';
    this.addNoise(20);
  }

  private drawCellularStructure(x: number, y: number, radius: number, color: string) {
    if(!this.ctx) return;
    this.ctx.strokeStyle = color + '40'; this.ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const innerX = x + Math.cos(angle) * radius * 0.3;
      const innerY = y + Math.sin(angle) * radius * 0.3;
      this.ctx.beginPath(); this.ctx.arc(innerX, innerY, radius * 0.15, 0, Math.PI * 2); this.ctx.stroke();
    }
  }

  private drawChromatinTexture(x: number, y: number, radius: number) {
    if(!this.ctx) return;
    const numSpeckles = 20;
    for (let i = 0; i < numSpeckles; i++) {
      const angle = Math.random() * Math.PI * 2; const r = Math.random() * radius * 0.8;
      const speckleX = x + Math.cos(angle) * r; const speckleY = y + Math.sin(angle) * r;
      this.ctx.beginPath(); this.ctx.arc(speckleX, speckleY, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#6B3AFF'; this.ctx.fill();
    }
  }

  private generateLightSheetImage(cubeCommand: string) {
    if (!this.ctx) return;
    const depths = 10;
    for (let d = 0; d < depths; d++) {
      const alpha = 1 - (d / depths) * 0.7;
      this.ctx.globalAlpha = alpha;
      const numStructures = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numStructures; i++) {
        const x = Math.random() * this.width; const y = Math.random() * this.height;
        const size = 50 + Math.random() * 100; const hue = (d / depths) * 240;
        this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
        this.ctx.beginPath(); this.ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2); this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1;
  }

  private generateSuperResImage(cubeCommand: string) {
    if (!this.ctx) return;
    const numStructures = 50 + Math.floor(Math.random() * 50);
    for (let i = 0; i < numStructures; i++) {
      const x = Math.random() * this.width; const y = Math.random() * this.height;
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 10);
      gradient.addColorStop(0, '#00FF00FF'); gradient.addColorStop(0.5, '#00FF0080'); gradient.addColorStop(1, '#00FF0000');
      this.ctx.fillStyle = gradient; this.ctx.fillRect(x - 10, y - 10, 20, 20);
    }
    this.drawMicrotubules();
  }

  private drawMicrotubules() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = '#00FF00'; this.ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      this.ctx.beginPath();
      let startX = Math.random() * this.width; let startY = Math.random() * this.height;
      this.ctx.moveTo(startX, startY);
      for (let j = 0; j < 5; j++) {
        const cpX = startX + (Math.random() - 0.5) * 200; const cpY = startY + (Math.random() - 0.5) * 200;
        const endX = startX + (Math.random() - 0.5) * 400; const endY = startY + (Math.random() - 0.5) * 400;
        this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        startX = endX; startY = endY;
      }
      this.ctx.stroke();
    }
  }

  private addNoise(amount: number) {
    if (!this.ctx) return;
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * amount;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

  private addMetadata(cubeCommand: string) {
    if (!this.ctx) return;
    this.ctx.strokeStyle = '#FFFFFF'; this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    const scaleBarLength = 200; const scaleBarMicrons = 10;
    this.ctx.moveTo(this.width - scaleBarLength - 40, this.height - 50);
    this.ctx.lineTo(this.width - 40, this.height - 50);
    this.ctx.stroke();
    this.ctx.fillStyle = '#FFFFFF'; this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${scaleBarMicrons} µm`, this.width - scaleBarLength/2 - 40, this.height - 60);
    this.ctx.font = '18px Arial'; this.ctx.textAlign = 'left';
    this.ctx.fillText('3i Marianas | CUBE Protocol', 20, 30);
    this.ctx.fillText('AI Preview by Phil Hills', 20, 55);
    let mode = 'Confocal';
    if (cubeCommand.includes('LIGHTSHEET')) mode = 'Light Sheet';
    if (cubeCommand.includes('SORA') || cubeCommand.includes('SIM')) mode = 'SIM Super-Resolution';
    if (cubeCommand.includes('WIDEFIELD')) mode = 'Widefield';
    this.ctx.fillText(`Mode: ${mode}`, 20, 80);
  }
}