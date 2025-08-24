
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
    original_lines: number;
    cube_lines: number;
    compression_ratio: string;
    savings_percent: number;
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
  tags: {
    system: string;
    technique: string;
  };
}

export type View = 'executor' | 'converter' | 'gallery';