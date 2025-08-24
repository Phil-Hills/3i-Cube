import type { ConversionMetrics } from '../types';

/**
 * Simulates the interpretation of a CUBE script by generating a mock execution log.
 * This function provides mock data to simulate API responses for script execution.
 * @param script The CUBE script to interpret.
 * @returns A promise that resolves to an array of log message strings.
 */
export const interpretCubeScript = async (script: string): Promise<string[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));

  const lines = script.trim().split('\n');
  const logs: string[] = [
    '🔬 3i Microscope Control System',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'CUBE Protocol Execution Log',
    'Created by Phil Hills - Seattle Developer',
    ''
  ];
  let imageGenerated = false;

  for (const line of lines) {
    if (line.trim().startsWith('#') || !line.trim()) continue;

    const parts = line.split('|');
    if (parts.length !== 3) {
      logs.push(`ERROR: Invalid CUBE syntax: "${line}"`);
      continue;
    }

    const [domain, sequence, outcome] = parts.map(p => p.trim());
    
    logs.push(`[${new Date().toLocaleTimeString()}] Executing: ${line}`);

    const upperDomain = domain.toUpperCase();
    if (upperDomain === 'MARIANAS' || upperDomain === 'AXL') {
        logs.push(`  -> ✓ Connected to 3i ${domain} system`);
        logs.push(`     • Serial: ${upperDomain}-2024-${Math.floor(1000 + Math.random() * 9000)}`);
        logs.push(`     • Firmware: v7.3.2`);
        if (sequence.toUpperCase().includes('TEMP')) logs.push(`     • Temperature: 37.0°C`);
        if (sequence.toUpperCase().includes('CO2')) logs.push(`     • CO2: 5.0%`);
    }

    if (upperDomain.includes('ACQUIRE') || upperDomain.includes('CAPTURE') || upperDomain.includes('SCAN') || upperDomain.includes('TIMELAPSE')) {
        logs.push('  -> ✓ Acquisition started');
        logs.push('     • Camera: Hamamatsu ORCA-Fusion BT');
        logs.push('     • Resolution: 2304 x 2304 pixels');
        logs.push('     • Bit depth: 16-bit');
        
        const channelsMatch = sequence.match(/CHANNELS\[(.*?)\]/i);
        if (channelsMatch && channelsMatch[1]) {
            logs.push(`     • Channels: ${channelsMatch[1]}`);
        }

        if (!imageGenerated) {
            logs.push('[IMAGE_GENERATED]');
            imageGenerated = true;
        }
    }
    
    logs.push(`  -> SUCCESS: ${outcome}`);
    logs.push(''); // for spacing
  }

  if (logs.length <= 5) {
      logs.push("Script is empty or contains only comments.");
  }
  
  return logs;
};

// fixedUniversalConverter.js - Properly groups related code
// By Phil Hills - Seattle Developer
class UniversalCubeConverter {
  private author: string;

  constructor() {
    this.author = "Phil Hills - Seattle Developer";
  }

  public convertToCube(input: string): string {
    const inputType = this.detectInputType(input);
    const operations = this.parseIntoOperations(input, inputType);
    const cubeCommands: string[] = [];

    cubeCommands.push(`# Converted to CUBE Protocol`);
    cubeCommands.push(`# By Phil Hills - Seattle Developer`);
    cubeCommands.push(`# Original: ${inputType} (${input.split('\n').length} lines)\n`);

    operations.forEach(op => {
      const cube = this.operationToCube(op);
      if (cube) {
        cubeCommands.push(cube);
      }
    });

    const originalLines = input.split('\n').filter(l => l.trim()).length;
    const cubeLines = operations.length;
    if (cubeLines > 0) {
        cubeCommands.push(`\n# Compression: ${originalLines}:${cubeLines} lines`);
    }
    
    return cubeCommands.join('\n');
  }

  private parseIntoOperations(input: string, inputType: string): any[] {
    if (inputType.includes('CODE')) {
      return this.parseCodeOperations(input);
    } else if (inputType.includes('NATURAL')) {
      return this.parseNaturalLanguageOperations(input);
    } else {
      return this.parseGenericOperations(input);
    }
  }

  private parseCodeOperations(code: string): any[] {
    const operations: any[] = [];
    const lines = code.split('\n');
    let currentOp: any = {
      type: null,
      mainAction: null,
      steps: [],
      startLine: 0,
      endLine: 0
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('%')) {
        continue;
      }

      if (this.isNewOperation(line, currentOp)) {
        if (currentOp.mainAction) {
          operations.push(this.finalizeOperation(currentOp));
        }
        currentOp = this.startNewOperation(line, i);
      } else {
        this.addToOperation(currentOp, line);
      }
    }

    if (currentOp.mainAction) {
      operations.push(this.finalizeOperation(currentOp));
    }

    return operations;
  }

  private isNewOperation(line: string, currentOp: any): boolean {
    const majorOperations = [
      /^(async\s+)?function\s+/,
      /^class\s+/,
      /^(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/,
      /^(export|import)\s+/,
      /^(if|for|while|switch)\s*\(/,
      /^try\s*{/,
      /\.(get|post|put|delete|patch)\s*\(/,
      /fetch\s*\(/,
      /^return\s+/
    ];
    // If the current operation is empty, any code is a new operation
    if (!currentOp.mainAction) return true;
    // Check if the line matches a major operation pattern
    return majorOperations.some(pattern => pattern.test(line));
  }

  private startNewOperation(line: string, lineNumber: number): any {
    const op = {
      type: this.detectOperationType(line),
      mainAction: this.extractMainAction(line),
      steps: new Set<string>(), // Use a Set to avoid duplicates
      startLine: lineNumber,
      endLine: lineNumber
    };
    const initialStep = this.extractStep(line);
    if (initialStep) {
      op.steps.add(initialStep);
    }
    return op;
  }
  
  private addToOperation(operation: any, line: string) {
    const step = this.extractStep(line);
    if (step) {
      operation.steps.add(step);
    }
    operation.endLine++;
  }

  private finalizeOperation(op: any): any {
    return {
      type: op.type,
      mainAction: op.mainAction,
      steps: Array.from(op.steps).slice(0, 5), // Convert Set to Array and limit steps
      lineCount: op.endLine - op.startLine + 1
    };
  }

  private detectOperationType(line: string): string {
    if (/function|=>\s*{/.test(line)) return 'FUNCTION';
    if (/class\s+/.test(line)) return 'CLASS';
    if (/fetch|axios|http|request/.test(line)) return 'API';
    if (/SELECT|INSERT|UPDATE|DELETE/i.test(line)) return 'DATABASE';
    if (/if\s*\(|switch\s*\(/.test(line)) return 'CONDITION';
    if (/for\s*\(|while\s*\(|\.map|\.forEach/.test(line)) return 'LOOP';
    if (/try\s*{/.test(line)) return 'ERROR_HANDLING';
    if (/import|require/.test(line)) return 'IMPORT';
    if (/export/.test(line)) return 'EXPORT';
    return 'PROCESS';
  }

  private extractMainAction(line: string): string {
    let match;
    match = line.match(/function\s+(\w+)/);
    if (match) return match[1];
    match = line.match(/(?:const|let|var)\s+(\w+)/);
    if (match) return match[1];
    match = line.match(/class\s+(\w+)/);
    if (match) return match[1];
    match = line.match(/['"](\/[\w\/\-]+)['"]/);
    if (match) return this.shortenUrl(match[1]);
    match = line.match(/\.(\w+)\s*\(/);
    if (match) return match[1].toUpperCase();
    return 'PROCESS';
  }

  private extractStep(line: string): string | null {
    let match;
    match = line.match(/['"]((?:https?:\/\/|\/api\/|www\.)[^'"]+)['"]/);
    if (match) return `REQUEST[${this.shortenUrl(match[1])}]`;
    match = line.match(/method:\s*['"](\w+)['"]/);
    if (match) return `METHOD[${match[1]}]`;
    if (/Authorization|Bearer|token/i.test(line)) return 'AUTH[Token]';
    if (/JSON\.stringify/.test(line)) return 'SERIALIZE[JSON]';
    if (/JSON\.parse|\.json\(\)/.test(line)) return 'PARSE[JSON]';
    if (/response|res\.|result/.test(line) && /return|await/.test(line)) return 'RESPONSE[Received]';
    if (/SELECT/i.test(line)) return 'QUERY[Select]';
    if (/INSERT/i.test(line)) return 'INSERT[Data]';
    if (/UPDATE/i.test(line)) return 'UPDATE[Record]';
    if (/DELETE/i.test(line)) return 'DELETE[Record]';
    match = line.match(/setExposure\((\d+)/);
    if (match) return `EXPOSURE[${match[1]}ms]`;
    match = line.match(/setChannel\(['"](\w+)['"]/);
    if (match) return `CHANNEL[${match[1]}]`;
    if (/snapImage|capture/.test(line)) return 'CAPTURE[Image]';
    match = line.match(/return\s+([^;{]+)/);
    if (match && match[1].length < 30) return `RETURN[${this.cleanValue(match[1])}]`;
    return null;
  }

  private operationToCube(operation: any): string | null {
    const { type, mainAction, steps } = operation;
    if (!mainAction && steps.length === 0) return null;
    const domain = this.mapTypeToDomain(type);
    const sequence = steps.length > 0 ? steps.join('→') : mainAction;
    const outcome = this.determineOutcome(type, steps);
    return `${domain}|${sequence}|${outcome}`;
  }

  private mapTypeToDomain(type: string): string {
    const mapping: { [key: string]: string } = {
      'FUNCTION': 'FUNCTION', 'CLASS': 'BUILD', 'API': 'API', 'DATABASE': 'DATABASE',
      'CONDITION': 'CHECK', 'LOOP': 'ITERATE', 'ERROR_HANDLING': 'HANDLE',
      'IMPORT': 'IMPORT', 'EXPORT': 'EXPORT', 'PROCESS': 'PROCESS'
    };
    return mapping[type] || 'EXECUTE';
  }

  private determineOutcome(type: string, steps: string[]): string {
    if (steps.some(s => s.includes('ERROR') || s.includes('CATCH'))) return 'HANDLED';
    if (steps.some(s => s.includes('RESPONSE') || s.includes('RETURN'))) return 'COMPLETE';
    const outcomes: { [key: string]: string } = {
      'FUNCTION': 'DEFINED', 'CLASS': 'CREATED', 'API': 'RECEIVED', 'DATABASE': 'EXECUTED',
      'CONDITION': 'EVALUATED', 'LOOP': 'PROCESSED', 'ERROR_HANDLING': 'HANDLED',
      'IMPORT': 'LOADED', 'EXPORT': 'EXPORTED'
    };
    return outcomes[type] || 'COMPLETE';
  }

  private shortenUrl(url: string): string {
    url = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (url.includes('anthropic')) return 'Anthropic_Claude';
    if (url.includes('openai')) return 'OpenAI_GPT';
    if (url.includes('cube-builder')) return 'Cube_Builder';
    if (url.includes('cube-protocol')) return 'Cube_Protocol';
    const parts = url.split('/').filter(p => p && p.length > 2);
    return parts[parts.length - 1] || url.substring(0, 20);
  }

  private cleanValue(value: string): string {
    return value.trim().replace(/[;,]$/, '').replace(/['"`]/g, '').substring(0, 20);
  }

  private detectInputType(input: string): string {
    const codeIndicators = /[{}();]|function|class|const|let|var|import|export/;
    if (codeIndicators.test(input)) {
      if (/def\s+\w+:|import\s+\w+\s*$|print\s*\(/m.test(input)) return 'CODE_PYTHON';
      if (/function|const|let|var|=>/m.test(input)) return 'CODE_JAVASCRIPT';
      if (/public\s+class|System\.out/m.test(input)) return 'CODE_JAVA';
      return 'CODE_UNKNOWN';
    }
    return 'NATURAL_LANGUAGE';
  }

  private parseNaturalLanguageOperations(text: string): any[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    return sentences.map(sentence => ({
      type: 'NATURAL',
      mainAction: this.extractNaturalAction(sentence),
      steps: this.extractNaturalSteps(sentence),
      lineCount: 1
    }));
  }

  private extractNaturalAction(sentence: string): string {
    const verbs = sentence.match(/\b(create|read|update|delete|get|post|send|receive|process|analyze)\b/i);
    return verbs ? verbs[0].toUpperCase() : 'PROCESS';
  }

  private extractNaturalSteps(sentence: string): string[] {
    const steps: string[] = [];
    const quotes = sentence.match(/["']([^"']+)["']/g);
    if (quotes) {
      quotes.forEach(q => steps.push(`TARGET[${q.replace(/["']/g, '')}]`));
    }
    return steps;
  }

  private parseGenericOperations(input: string): any[] {
    return [{
      type: 'GENERIC',
      mainAction: 'PROCESS',
      steps: ['INPUT', 'ANALYZE', 'OUTPUT'],
      lineCount: input.split('\n').length
    }];
  }
}


/**
 * Converts any code or natural language to CUBE script using the universal client-side engine.
 * @param code The source code or text to convert.
 * @returns A promise that resolves to the converted CUBE code and calculated metrics.
 */
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
  try {
    const converter = new UniversalCubeConverter();
    const cube_code = converter.convertToCube(code);
    
    const original_lines = code.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.startsWith('//') && !trimmed.startsWith('%') && !trimmed.startsWith('#');
    }).length;
    
    const cube_lines = cube_code.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.startsWith('#');
    }).length;

    const savings_percent = original_lines > 0 ? Math.round(((original_lines - cube_lines) / original_lines) * 100) : 0;
    
    const metrics: ConversionMetrics = {
        original_lines,
        cube_lines,
        compression_ratio: cube_lines > 0 ? `${(original_lines / cube_lines).toFixed(1)}:1` : `${original_lines}:0`,
        savings_percent: savings_percent < 0 ? 0 : savings_percent,
        time_saved_minutes: Math.round(original_lines * 1.5)
    };
    
    if (cube_lines === 0 && original_lines > 0) {
      throw new Error("Could not find any convertible operations in the provided input.");
    }
    
    return { cube_code, metrics };
  } catch (error) {
    console.error("Error during CUBE conversion:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during conversion.";
    throw new Error(`Client-side Conversion Failed: ${errorMessage}`);
  }
};