
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
