
export class MicroscopyImageGenerator {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private width = 512;
  private height = 512;

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
    const svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#f87171" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">${errorText}</text></svg>`;
    if (typeof btoa === 'function') {
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    return '';
  }

  public generateFromQ(qCommand: string): string {
    if (!this.ctx || !this.canvas) {
      console.error("Canvas context is not available for image generation.");
      return this.getErrorPlaceholder();
    }

    try {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      const commands = qCommand.toUpperCase();
      let hasDrawn = false;
      
      if (commands.includes('MULTI')) {
          this.generateMultiChannel(commands);
          hasDrawn = true;
      } else {
          if (commands.includes('GFP') || commands.includes('GREEN')) {
              this.generateFluorescentCells('#00FF00', '#0066FF');
              hasDrawn = true;
          }
          if (commands.includes('RFP') || commands.includes('RED')) {
              this.generateFluorescentCells('#FF0000', '#0066FF');
              hasDrawn = true;
          }
          if (commands.includes('DAPI') || commands.includes('NUCLEI')) {
              this.generateNuclei();
              hasDrawn = true;
          }
          if (commands.includes('NEURONS')) {
              this.drawNeurons();
              hasDrawn = true;
          }
      }

      if (!hasDrawn) {
        this.generateGenericMicroscopy();
      }

      this.addMetadata(qCommand);

      return this.canvas.toDataURL('image/png');

    } catch (e) {
      console.error("Error during canvas drawing:", e);
      return this.getErrorPlaceholder();
    }
  }
  
  private generateGenericMicroscopy() {
    this.generateFluorescentCells('#00FF00', '#0066FF'); // Default to GFP
  }
  
  private generateMultiChannel(commands: string) {
    if(!this.ctx) return;
    let channelsDrawn = 0;
    
    if (commands.includes('GFP')) {
      this.generateFluorescentCells('#00FF00', '#8888FF');
      channelsDrawn++;
    }
    if (commands.includes('RFP')) {
      if (channelsDrawn > 0) this.ctx.globalCompositeOperation = 'screen';
      this.generateFluorescentCells('#FF0000', '#8888FF');
      channelsDrawn++;
    }
    if (commands.includes('DAPI')) {
       if (channelsDrawn > 0) this.ctx.globalCompositeOperation = 'screen';
       this.generateNuclei();
       channelsDrawn++;
    }
    
    this.ctx.globalCompositeOperation = 'source-over';
    if(channelsDrawn === 0) { // If MULTI is specified but no known channels
        this.generateGenericMicroscopy();
    }
  }

  private generateFluorescentCells(membraneColor: string, nucleusColor: string) {
    if (!this.ctx) return;
    const numCells = 8 + Math.floor(Math.random() * 7);
    
    for (let i = 0; i < numCells; i++) {
      const x = 50 + Math.random() * (this.width - 100);
      const y = 50 + Math.random() * (this.height - 100);
      const radius = 25 + Math.random() * 20;
      
      const gradient = this.ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius * 1.2);
      gradient.addColorStop(0, membraneColor + '00');
      gradient.addColorStop(0.7, membraneColor + '40');
      gradient.addColorStop(0.9, membraneColor + 'AA');
      gradient.addColorStop(1, membraneColor + '00');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 1.2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.strokeStyle = membraneColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      const nucleusGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 0.4);
      nucleusGradient.addColorStop(0, nucleusColor + 'FF');
      nucleusGradient.addColorStop(0.7, nucleusColor + '88');
      nucleusGradient.addColorStop(1, nucleusColor + '44');
      
      this.ctx.fillStyle = nucleusGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.addNoise();
  }
  
  private generateNuclei() {
    if (!this.ctx) return;
    const nucleusColor = '#8888FF'; // DAPI-like blue
    const numNuclei = 15 + Math.random() * 10;
     for (let i = 0; i < numNuclei; i++) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const radius = 8 + Math.random() * 8;

        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `${nucleusColor}CC`);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
     }
     this.addNoise();
  }

  private drawNeurons() {
      if (!this.ctx) return;
      this.ctx.strokeStyle = '#33ff33'; // GCaMP green
      this.ctx.lineWidth = 1.5;
      this.ctx.globalAlpha = 0.7;

      for (let i = 0; i < 3; i++) { 
          let x = Math.random() * this.width;
          let y = Math.random() * this.height;
          const radius = 10 + Math.random() * 5;

          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, '#AAFFAA');
          gradient.addColorStop(1, '#33ff33');
          this.ctx.fillStyle = gradient;
          this.ctx.fill();

          for (let j = 0; j < 5; j++) {
              this.ctx.beginPath();
              this.ctx.moveTo(x, y);
              let endX = x + (Math.random() - 0.5) * 150;
              let endY = y + (Math.random() - 0.5) * 150;
              this.ctx.lineTo(endX, endY);
              this.ctx.stroke();
          }
      }
      this.ctx.globalAlpha = 1.0;
      this.addNoise();
  }

  private addNoise() {
    if (!this.ctx) return;
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }

  private addMetadata(qCommand: string) {
    if (!this.ctx) return;
    // Scale bar
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - 80, this.height - 30);
    this.ctx.lineTo(this.width - 30, this.height - 30);
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('50μm', this.width - 55, this.height - 35);
    
    // Attribution
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('AI Preview | Q Protocol | A2AC LLC', 10, this.height - 10);
    
    // Timestamp
    const now = new Date();
    this.ctx.textAlign = 'left';
    this.ctx.fillText(now.toLocaleTimeString(), 10, 20);
  }
}
