
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
}

export interface ConverterExample {
    name: string;
    description: string;
    code: string;
}
