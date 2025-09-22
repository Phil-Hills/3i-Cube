import type { LogEntry, MicroscopeStatus } from '../types';

// The address of the backend server connected to the microscope.
const WEBSOCKET_URL = 'ws://localhost:8765';

type ServerMessage = 
    | { type: 'log', payload: { type: 'INFO' | 'SUCCESS' | 'ERROR'; message: string } }
    | { type: 'status', payload: MicroscopeStatus }
    | { type: 'media', payload: { url: string, type: 'image' | 'video' } }
    | { type: 'execution_start' }
    | { type: 'execution_complete' }
    | { type: 'error', payload: string };

class MicroscopeService {
    private ws: WebSocket | null = null;
    private reconnectInterval: number = 5000; // 5 seconds

    // Callbacks to update React state
    public onLog: (log: LogEntry) => void = () => {};
    public onStatusChange: (status: MicroscopeStatus) => void = () => {};
    public onMediaGenerated: (media: { url: string, type: 'image' | 'video' }) => void = () => {};
    public onExecutionChange: (isExecuting: boolean) => void = () => {};

    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        try {
            this.ws = new WebSocket(WEBSOCKET_URL);

            this.ws.onopen = () => {
                console.log('Microscope WebSocket connection established.');
                this.onStatusChange('CONNECTED');
                const logEntry: LogEntry = { type: 'SYSTEM', message: 'Connected to hardware control server.', timestamp: new Date() };
                this.onLog(logEntry);
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: ServerMessage = JSON.parse(event.data);
                    this.handleServerMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    const logEntry: LogEntry = { type: 'ERROR', message: 'Received invalid data from server.', timestamp: new Date() };
                    this.onLog(logEntry);
                }
            };

            this.ws.onerror = (event) => {
                // This event is often generic and is immediately followed by onclose,
                // which provides more specific error details. We log it for debugging but
                // avoid noisy console errors for the user.
                console.log('WebSocket error event. See onclose for details.');
            };

            this.ws.onclose = (event: CloseEvent) => {
                console.log('WebSocket connection closed.', { code: event.code, reason: event.reason, wasClean: event.wasClean });
                this.onStatusChange('DISCONNECTED');
                
                let logType: LogEntry['type'] = 'SYSTEM';
                let message = 'Disconnected from hardware server. Attempting to reconnect...';
                
                if (!event.wasClean) {
                    logType = 'ERROR';
                    // Code 1006 is the most common for connection failures (e.g., server not running)
                    if (event.code === 1006) {
                        message = `Connection to microscope server failed. Is it running at ${WEBSOCKET_URL}? Retrying...`;
                    } else {
                        message = `Connection lost unexpectedly (Code: ${event.code}). Retrying...`;
                    }
                }

                const logEntry: LogEntry = { type: logType, message, timestamp: new Date() };
                this.onLog(logEntry);

                this.ws = null;
                setTimeout(() => this.connect(), this.reconnectInterval);
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.onStatusChange('ERROR');
            const logEntry: LogEntry = { type: 'ERROR', message: `Failed to initialize connection: ${error instanceof Error ? error.message : 'Unknown error'}. Retrying...`, timestamp: new Date() };
            this.onLog(logEntry);
            setTimeout(() => this.connect(), this.reconnectInterval);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.onclose = null; // Prevent reconnect logic from firing on intentional close
            this.ws.close();
            this.ws = null;
            console.log('WebSocket connection intentionally closed.');
        }
    }

    private handleServerMessage(message: ServerMessage) {
        switch (message.type) {
            case 'log':
                const logEntry: LogEntry = { ...message.payload, timestamp: new Date() };
                this.onLog(logEntry);
                break;
            case 'status':
                this.onStatusChange(message.payload);
                break;
            case 'media':
                this.onMediaGenerated(message.payload);
                break;
            case 'execution_start':
                this.onExecutionChange(true);
                this.onStatusChange('EXECUTING');
                break;
            case 'execution_complete':
                this.onExecutionChange(false);
                this.onStatusChange('IDLE');
                break;
            case 'error':
                 const errorLog: LogEntry = { type: 'ERROR', message: `Server Error: ${message.payload}`, timestamp: new Date() };
                 this.onLog(errorLog);
                 this.onStatusChange('ERROR');
                 this.onExecutionChange(false);
                break;
        }
    }

    executeScript(script: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            const logEntry: LogEntry = { type: 'ERROR', message: 'Not connected to microscope. Cannot execute script.', timestamp: new Date() };
            this.onLog(logEntry);
            this.onStatusChange('DISCONNECTED');
            return;
        }

        const command = {
            type: 'execute_script',
            payload: script
        };

        this.ws.send(JSON.stringify(command));
    }
}

// Export a singleton instance
export const microscopeService = new MicroscopeService();