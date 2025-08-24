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

/**
 * An improved, pattern-based CUBE converter.
 * By Phil Hills - Seattle Developer
 */
class ImprovedCubeConverter {
  private author: string;
  private patterns: Record<string, string>;

  constructor() {
    this.author = "Phil Hills - Seattle Developer";
    this.patterns = this.loadImprovedPatterns();
  }

  private loadImprovedPatterns(): Record<string, string> {
    return {
      'fetch(': 'API|REQUEST[{url}]',
      'axios.': 'API|HTTP[{method}]',
      '.post(': '→POST[{endpoint}]',
      '.get(': '→GET[{endpoint}]',
      'headers:': '→HEADERS[{auth}]',
      'Authorization:': '→AUTH[{token}]',
      'response': '→RESPONSE[{data}]',
      'authenticate': 'AUTH|LOGIN[{method}]',
      'token': '→TOKEN[{type}]',
      'Bearer': '→BEARER[Token]',
      'apiKey': '→API_KEY[{key}]',
      'JSON.stringify': '→SERIALIZE[JSON]',
      'JSON.parse': '→PARSE[JSON]',
      '.json()': '→EXTRACT[JSON]',
      'payload': '→PAYLOAD[{data}]',
      'async': 'ASYNC|FUNCTION[{name}]',
      'await': '→AWAIT[{operation}]',
      '.then(': '→THEN[{callback}]',
      '.catch(': '→CATCH[Error]',
      'try {': 'TRY|ATTEMPT[Operation]',
      'catch': '→CATCH[Error]',
      'throw': '→THROW[Exception]',
      'console.error': '→LOG[Error]',
      'return': '→RETURN[{value}]',
      'if (': 'CHECK|CONDITION[{test}]',
      'for (': 'LOOP|ITERATE[{items}]',
      'map(': '→MAP[Transform]',
      'filter(': '→FILTER[Condition]',
    };
  }

  public convertCodeToCube(code: string): string {
    const lines = code.split('\n').filter(line => line.trim());
    const cubeCommands: string[] = [];
    let currentOperation: string | null = null;
    let operationSteps: string[] = [];

    cubeCommands.push(`# Converted to CUBE Protocol`);
    cubeCommands.push(`# By Phil Hills - Seattle Developer\n`);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('%') || trimmed.startsWith('#')) continue;
      
      if (this.isMainOperation(trimmed)) {
        if (currentOperation && operationSteps.length > 0) {
          cubeCommands.push(this.formatCubeCommand(currentOperation, operationSteps));
        }
        currentOperation = this.detectOperation(trimmed);
        operationSteps = [];
      }
      
      const steps = this.extractSteps(trimmed);
      if (steps.length > 0) {
        operationSteps.push(...steps);
      }
    }
    
    if (currentOperation && operationSteps.length > 0) {
      cubeCommands.push(this.formatCubeCommand(currentOperation, operationSteps));
    }
    
    return cubeCommands.join('\n');
  }

  private isMainOperation(line: string): boolean {
    const mainOps = ['fetch', 'axios', 'async function', 'const', 'let', 'class', 'try'];
    return mainOps.some(op => line.includes(op));
  }

  private detectOperation(line: string): string {
    if (line.includes('fetch') || line.includes('axios')) return 'API';
    if (line.includes('authenticate') || line.includes('auth')) return 'AUTH';
    if (line.includes('async function')) return 'FUNCTION';
    if (line.includes('try')) return 'PROCESS';
    if (line.includes('class')) return 'BUILD';
    return 'EXECUTE';
  }

  private extractSteps(line: string): string[] {
    const steps: string[] = [];
    
    const urlMatch = line.match(/fetch\(['"`]([^'"`]+)['"`]/);
    if (urlMatch) steps.push(`REQUEST[${this.shortenUrl(urlMatch[1])}]`);

    const methodMatch = line.match(/method:\s*['"`](\w+)['"`]/);
    if (methodMatch) steps.push(`METHOD[${methodMatch[1].toUpperCase()}]`);

    if (line.includes('Authorization')) steps.push('AUTH[Bearer_Token]');
    if (line.includes('.json()')) steps.push('PARSE[JSON]');
    if (line.includes('const data =') || line.includes('return data')) steps.push('RESPONSE[Received]');
    
    const functionNameMatch = line.match(/async function\s+(\w+)/);
    if (functionNameMatch) steps.push(`${functionNameMatch[1]}→ASYNC`);

    return steps;
  }

  private shortenUrl(url: string): string {
    if (url.includes('anthropic')) return 'Anthropic_Claude';
    if (url.includes('openai')) return 'OpenAI_GPT';
    if (url.includes('google')) return 'Google_API';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'API';
  }

  private formatCubeCommand(operation: string, steps: string[]): string {
    const outcome = this.determineOutcome(operation, steps);
    const stepsStr = steps.join('→');
    return `${operation}|${stepsStr}|${outcome}`;
  }

  private determineOutcome(operation: string, steps: string[]): string {
    if (steps.some(s => s.includes('RESPONSE'))) return 'COMPLETE';
    if (steps.some(s => s.includes('ERROR'))) return 'FAILED';
    if (operation === 'AUTH') return 'AUTHENTICATED';
    if (operation === 'API') return 'RECEIVED';
    if (operation === 'BUILD') return 'CREATED';
    if (operation === 'FUNCTION') return 'DEFINED';
    return 'DONE';
  }
}

/**
 * Converts Python/MATLAB code to CUBE script using a client-side pattern matching engine.
 * @param code The source code to convert.
 * @returns A promise that resolves to the converted CUBE code and calculated metrics.
 */
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

  try {
    const converter = new ImprovedCubeConverter();
    const cube_code = converter.convertCodeToCube(code);

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
        compression_ratio: `${original_lines}:${cube_lines}`,
        savings_percent: savings_percent < 0 ? 0 : savings_percent,
        time_saved_minutes: Math.round(original_lines * 1.5)
    };
    
    if (cube_lines <= 2) { // Only headers were generated
      throw new Error("Could not find any convertible operations in the provided code.");
    }
    
    return { cube_code, metrics };
  } catch (error) {
    console.error("Error during CUBE conversion:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during conversion.";
    throw new Error(`Client-side Conversion Failed: ${errorMessage}`);
  }
};
