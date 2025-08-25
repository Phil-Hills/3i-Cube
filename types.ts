export type MicroscopeStatus = 'DISCONNECTED' | 'CONNECTED' | 'EXECUTING' | 'IDLE' | 'ERROR';

export type LogType = 'INFO' | 'SUCCESS' | 'ERROR' | 'SYSTEM';

export interface LogEntry {
  type: LogType;
  message: string;
  timestamp: Date;
}

export interface ExampleScript {
    name: string;
    description: string;
    script: string;
}

export interface ExampleScriptCategory {
    category: string;
    description: string;
    scripts: ExampleScript[];
}

export interface ConversionMetrics {
    // For code/text conversion
    original_lines?: number;
    cube_lines?: number;
    savings_percent?: number;

    // For data compression
    original_size_bytes?: number;
    compressed_size_bytes?: number;
    hash?: string;
    dimensions?: [number, number, number];
    cells_used?: number;

    // Common
    compression_ratio: string;
    time_saved_minutes: number;
}


export interface ConverterExample {
    name: string;
    description: string;
    code: string;
}

export interface GalleryImage {
  id: number; // timestamp
  imageUrl: string;
  cubeScript: string;
  createdAt: Date;
  mediaType: 'image' | 'video';
  tags: {
    system: string;
    technique: string;
  };
}

export type View = 'executor' | 'converter' | 'gallery' | 'dashboard' | 'ml_builder' | 'video_builder';
export type ConverterMode = 'code' | 'text' | 'data';