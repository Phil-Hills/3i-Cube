
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

  private getErrorPlaceholder(): string {
    const errorText = 'Image generation failed.';
    const svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#f87171" font-family="sans-serif" font-size="24" text-anchor="middle" dy=".3em">${errorText}</text></svg>`;
    if (typeof btoa === 'function') {
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    return '';
  }

  public generateFromCube(cubeCommand: string): string {
    if (!this.ctx || !this.canvas) {
      console.error("Canvas context is not available for image generation.");
      return this.getErrorPlaceholder();
    }

    try {
      const commands = cubeCommand.toUpperCase();
      
      // Black background (3i images have very clean backgrounds)
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Determine imaging mode from CUBE
      if (commands.includes('CONFOCAL') || commands.includes('MARIANAS')) {
        this.generateConfocalImage(commands);
      } else if (commands.includes('LIGHTSHEET')) {
        this.generateLightSheetImage(commands);
      } else if (commands.includes('WIDEFIELD')) {
        this.generateWidefieldImage(commands);
      } else if (commands.includes('SIM') || commands.includes('SORA')) {
        this.generateSuperResImage(commands);
      } else {
        // Default to confocal style for other captures
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
    if (channels.length === 0) channels.push('488'); // Default if no channel specified
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
    // Add more haze/noise for widefield effect
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

      if (channels.includes('488')) { // GFP
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 3; 
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.drawCellularStructure(x, y, radius, '#00FF00');
      }
      
      if (channels.includes('561')) { // RFP
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * (0.8 + Math.random()*0.2), 0, Math.PI * 2);
        this.ctx.stroke();
      }
      
      if (channels.includes('647')) { // Far Red
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      if (channels.includes('405')) { // DAPI
        const nucleusRadius = radius * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(x, y, nucleusRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4B0AFF';
        this.ctx.fill();
        this.drawChromatinTexture(x, y, nucleusRadius);
      }
    }
    this.ctx.globalCompositeOperation = 'source-over';
    this.addNoise(20);
  }

  private drawCellularStructure(x: number, y: number, radius: number, color: string) {
    if(!this.ctx) return;
    this.ctx.strokeStyle = color + '40';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const innerX = x + Math.cos(angle) * radius * 0.3;
      const innerY = y + Math.sin(angle) * radius * 0.3;
      this.ctx.beginPath();
      this.ctx.arc(innerX, innerY, radius * 0.15, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  private drawChromatinTexture(x: number, y: number, radius: number) {
    if(!this.ctx) return;
    const numSpeckles = 20;
    for (let i = 0; i < numSpeckles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.8;
      const speckleX = x + Math.cos(angle) * r;
      const speckleY = y + Math.sin(angle) * r;
      this.ctx.beginPath();
      this.ctx.arc(speckleX, speckleY, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#6B3AFF';
      this.ctx.fill();
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
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const size = 50 + Math.random() * 100;
        const hue = (d / depths) * 240; // Blue to red
        this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1;
  }

  private generateSuperResImage(cubeCommand: string) {
    if (!this.ctx) return;
    const numStructures = 50 + Math.floor(Math.random() * 50);
    for (let i = 0; i < numStructures; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 10);
      gradient.addColorStop(0, '#00FF00FF');
      gradient.addColorStop(0.5, '#00FF0080');
      gradient.addColorStop(1, '#00FF0000');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - 10, y - 10, 20, 20);
    }
    this.drawMicrotubules();
  }

  private drawMicrotubules() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = '#00FF00';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      this.ctx.beginPath();
      let startX = Math.random() * this.width;
      let startY = Math.random() * this.height;
      this.ctx.moveTo(startX, startY);
      for (let j = 0; j < 5; j++) {
        const cpX = startX + (Math.random() - 0.5) * 200;
        const cpY = startY + (Math.random() - 0.5) * 200;
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = startY + (Math.random() - 0.5) * 400;
        this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        startX = endX;
        startY = endY;
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
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

  private addMetadata(cubeCommand: string) {
    if (!this.ctx) return;
    
    // Scale bar
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    const scaleBarLength = 200; 
    const scaleBarMicrons = 10;
    this.ctx.moveTo(this.width - scaleBarLength - 40, this.height - 50);
    this.ctx.lineTo(this.width - 40, this.height - 50);
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${scaleBarMicrons} µm`, this.width - scaleBarLength/2 - 40, this.height - 60);
    
    // System info
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('3i Marianas | CUBE Protocol', 20, 30);
    this.ctx.fillText('AI Preview by Phil Hills', 20, 55);
    
    // Imaging mode
    let mode = 'Confocal';
    if (cubeCommand.includes('LIGHTSHEET')) mode = 'Light Sheet';
    if (cubeCommand.includes('SORA') || cubeCommand.includes('SIM')) mode = 'SIM Super-Resolution';
    if (cubeCommand.includes('WIDEFIELD')) mode = 'Widefield';
    
    this.ctx.fillText(`Mode: ${mode}`, 20, 80);
  }
}
