export class MicroscopyImageGenerator {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private width = 512;
  private height = 512;
  private colorMap = {
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF',
  };

  constructor() {
    // Safely create canvas and context only in a browser-like environment
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d'); // This can be null
    } else {
      this.canvas = null;
      this.ctx = null;
    }
  }

  private getErrorPlaceholder(): string {
    const errorText = 'Image generation failed.';
    const svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#f87171" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">${errorText}</text></svg>`;
    // btoa is a standard browser function.
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
      // Clear canvas
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.width, this.height);

      const commands = cubeCommand.toUpperCase();
      let hasDrawn = false;
      
      // Draw combined for multi-channel
      if (commands.includes('GFP') && commands.includes('DAPI')) {
          this.drawFluorescentCells('green');
          this.drawNuclei('blue');
          hasDrawn = true;
      } else if (commands.includes('GFP') && commands.includes('RFP')) {
          this.drawFluorescentCells('green');
          this.drawFluorescentCells('red');
          hasDrawn = true;
      } else {
          if (commands.includes('GFP') || commands.includes('LIVE_CELLS') || commands.includes('CALCIUM')) {
              this.drawFluorescentCells('green');
              this.drawNuclei('blue');
              hasDrawn = true;
          }
          if (commands.includes('RFP')) {
              this.drawFluorescentCells('red');
              hasDrawn = true;
          }
          if (commands.includes('DAPI') || commands.includes('NUCLEI')) {
              this.drawNuclei('blue');
              hasDrawn = true;
          }
          if (commands.includes('NEURONS')) {
              this.drawNeurons();
              hasDrawn = true;
          }
      }
      
      if (!hasDrawn) {
          // Default image if no specific keywords
          this.drawFluorescentCells('green');
          this.drawNuclei('blue');
      }

      this.addMicroscopyNoise();
      this.addScaleBar();
      this.addAttribution();

      return this.canvas.toDataURL();

    } catch (e) {
      console.error("Error during canvas drawing:", e);
      return this.getErrorPlaceholder();
    }
  }

  private drawFluorescentCells(color: 'green' | 'red') {
    if (!this.ctx) return;
    const numCells = 10 + Math.random() * 10;
    const hexColor = this.colorMap[color];
    
    for (let i = 0; i < numCells; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const radius = 20 + Math.random() * 30;
      
      this.ctx.beginPath();
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `${hexColor}99`);
      gradient.addColorStop(0.8, `${hexColor}55`);
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawNuclei(color: 'blue') {
      if (!this.ctx) return;
      const numNuclei = 15 + Math.random() * 10;
      const hexColor = this.colorMap[color];
      for (let i = 0; i < numNuclei; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const radius = 8 + Math.random() * 8;

          this.ctx.beginPath();
          const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, `${hexColor}AA`);
          gradient.addColorStop(1, 'transparent');
          this.ctx.fillStyle = gradient;
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fill();
      }
  }
  
  private drawNeurons() {
      if (!this.ctx) return;
      this.ctx.strokeStyle = '#33ff33'; // GCaMP green
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.7;

      for (let i = 0; i < 3; i++) { 
          let x = Math.random() * this.width;
          let y = Math.random() * this.height;
          const radius = 10 + Math.random() * 5;

          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fillStyle = '#33ff33';
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
  }

  private addMicroscopyNoise() {
    if (!this.ctx) return;
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }

  private addScaleBar() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - 80, this.height - 30);
    this.ctx.lineTo(this.width - 30, this.height - 30);
    this.ctx.stroke();
    
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('50μm', this.width - 55, this.height - 35);
  }

  private addAttribution() {
    if (!this.ctx) return;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('AI Preview | Phil Hills', 10, this.height - 10);
  }
}