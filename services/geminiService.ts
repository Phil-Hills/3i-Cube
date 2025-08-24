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

// productionCubeConverter.js - The Ultimate CUBE Converter
// By Phil Hills - Seattle Developer
// THIS IS THE MOST IMPORTANT COMPONENT
class ProductionCubeConverter {
  private author: string;
  private conversionCache: Map<string, string>;
  private patterns: any;

  constructor() {
    this.author = "Phil Hills - Seattle Developer";
    this.conversionCache = new Map();
    this.initializePatterns();
  }

  private initializePatterns() {
    this.patterns = {
      // MICROSCOPY PATTERNS (Critical for 3i) - Most specific first
      microscopy: {
        'core.': { domain: 'MICROSCOPE', action: 'CONTROL' },
        'snapImage': { domain: 'CAPTURE', action: 'IMAGE' },
        'setExposure': { domain: 'CONFIGURE', action: 'EXPOSURE' },
        'setChannel': { domain: 'CONFIGURE', action: 'CHANNEL' },
        'setPosition': { domain: 'STAGE', action: 'MOVE' },
        'startSequence': { domain: 'ACQUIRE', action: 'SEQUENCE' },
        'dm.': { domain: 'ADAPTIVE_OPTICS', action: 'DM' },
        'zernike': { domain: 'OPTIMIZE', action: 'ZERNIKE' },
        'deconvolve': { domain: 'PROCESS', action: 'DECONVOLVE' },
        'stitch': { domain: 'MONTAGE', action: 'STITCH' }
      },
      // API PATTERNS
      api: {
        'fetch(': { domain: 'API', action: 'REQUEST' },
        'axios': { domain: 'API', action: 'HTTP' },
        'requests.': { domain: 'API', action: 'REQUEST' },
        'http.': { domain: 'API', action: 'HTTP' },
        'XMLHttpRequest': { domain: 'API', action: 'AJAX' },
        '.get(': { domain: 'API', action: 'GET' },
        '.post(': { domain: 'API', action: 'POST' },
        '.put(': { domain: 'API', action: 'PUT' },
        '.delete(': { domain: 'API', action: 'DELETE' }
      },
      // AUTHENTICATION
      auth: {
        'Bearer': { domain: 'AUTH', action: 'BEARER' },
        'API-Key': { domain: 'AUTH', action: 'API_KEY' },
        'OAuth': { domain: 'AUTH', action: 'OAUTH' },
        'login': { domain: 'AUTH', action: 'LOGIN' },
        'authenticate': { domain: 'AUTH', action: 'VERIFY' },
        'token': { domain: 'AUTH', action: 'TOKEN' }
      },
      // DATA OPERATIONS
      data: {
        'SELECT': { domain: 'QUERY', action: 'SELECT' },
        'INSERT': { domain: 'STORE', action: 'INSERT' },
        'UPDATE': { domain: 'MODIFY', action: 'UPDATE' },
        'DELETE': { domain: 'REMOVE', action: 'DELETE' },
        'CREATE TABLE': { domain: 'BUILD', action: 'TABLE' },
        'json': { domain: 'FORMAT', action: 'JSON' },
        'parse': { domain: 'PROCESS', action: 'PARSE' },
        'stringify': { domain: 'PROCESS', action: 'SERIALIZE' }
      },
      // CONTROL FLOW
      flow: {
        'if ': { domain: 'CHECK', action: 'CONDITION' },
        'else': { domain: 'ALTERNATE', action: 'PATH' },
        'for ': { domain: 'LOOP', action: 'ITERATE' },
        'while': { domain: 'LOOP', action: 'WHILE' },
        'try': { domain: 'ATTEMPT', action: 'EXECUTE' },
        'catch': { domain: 'HANDLE', action: 'ERROR' },
        'async': { domain: 'ASYNC', action: 'FUNCTION' },
        'await': { domain: 'WAIT', action: 'PROMISE' }
      },
      // LANGUAGE DETECTION - Least specific last
      languages: {
        'import ': 'LANG[Python]',
        'const ': 'LANG[JavaScript]',
        'function ': 'LANG[JavaScript]',
        'def ': 'LANG[Python]',
        'class ': 'LANG[OOP]',
        'public ': 'LANG[Java/C#]',
        '#include': 'LANG[C/C++]',
        'library(': 'LANG[R]',
        '%': 'LANG[MATLAB]'
      },
    };
  }

  public convertCodeToCube(code: string): string {
    const cacheKey = this.hashCode(code);
    if (this.conversionCache.has(cacheKey)) {
      return this.conversionCache.get(cacheKey)!;
    }

    try {
      const language = this.detectLanguage(code);
      const blocks = this.parseIntoBlocks(code);
      const cubeCommands: string[] = [];
      
      cubeCommands.push(`# Converted to CUBE Protocol`);
      cubeCommands.push(`# By Phil Hills - Seattle Developer`);
      const originalLines = code.split('\n').length;
      cubeCommands.push(`# Original: ${language} (${originalLines} lines)\n`);

      blocks.forEach(block => {
        const cubeCommand = this.blockToCube(block);
        if (cubeCommand) {
          cubeCommands.push(cubeCommand);
        }
      });
      
      const cubeLines = cubeCommands.filter(l => l.trim() && !l.startsWith('#')).length;
      if (cubeLines > 0) {
        cubeCommands.push(`\n# Compression: ${originalLines}:${cubeLines} lines`);
      }

      const result = cubeCommands.join('\n');
      this.conversionCache.set(cacheKey, result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return `# Error converting code\n# ${message}\n# By Phil Hills - Seattle Developer`;
    }
  }

  private detectLanguage(code: string): string {
    for (const [pattern, lang] of Object.entries(this.patterns.languages)) {
      if (code.includes(pattern)) {
        return lang as string;
      }
    }
    return 'LANG[Unknown]';
  }

  private parseIntoBlocks(code: string): { type: string; lines: string[]; indent: number }[] {
    const blocks: { type: string; lines: string[]; indent: number }[] = [];
    const lines = code.split('\n');
    let currentBlock: { type: string; lines: string[]; indent: number } = {
      type: 'GENERAL',
      lines: [],
      indent: 0
    };

    for (const line of lines) {
      const trimmed = line.trim();
      const indent = line.search(/\S|$/);

      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('%')) {
        continue;
      }
      
      // A simple but effective block strategy: group by function/class/try block or major operation.
      const isNewMajorBlock = /^(async\s+)?(function|def|class|try|for|while|if|core\.|dm\.|fetch|axios|requests\.)/.test(trimmed);

      if (isNewMajorBlock && currentBlock.lines.length > 0) {
        blocks.push(currentBlock);
        currentBlock = {
          type: this.detectBlockType(trimmed),
          lines: [trimmed],
          indent: indent
        };
      } else {
        if(currentBlock.lines.length === 0) {
           currentBlock.type = this.detectBlockType(trimmed);
           currentBlock.indent = indent;
        }
        currentBlock.lines.push(trimmed);
      }
    }
    if (currentBlock.lines.length > 0) {
      blocks.push(currentBlock);
    }
    return blocks;
  }
  
  private detectBlockType(line: string): string {
    // Check each pattern category
    for (const [category, patterns] of Object.entries(this.patterns)) {
        for (const pattern of Object.keys(patterns as object)) {
            if (line.includes(pattern)) {
                return category.toUpperCase();
            }
        }
    }
    return 'GENERAL';
  }
  
  private blockToCube(block: { type: string; lines: string[] }): string | null {
    const { type, lines } = block;
    const mainOp = this.extractMainOperation(lines[0], type);
    const steps = this.extractStepsFromBlock(lines);
    const outcome = this.determineOutcome(type, steps, lines);
    
    if (steps.length === 0) return null;
    
    return `${mainOp}|${steps.join('→')}|${outcome}`;
  }

  private extractMainOperation(firstLine: string, blockType: string): string {
    const apiMatch = firstLine.match(/fetch|axios|requests\./);
    if(apiMatch) return 'API';

    const microMatch = firstLine.match(/core\.|snapImage|setExposure|setChannel|dm\./);
    if(microMatch) return 'MICROSCOPE';

    const funcMatch = firstLine.match(/^(async\s+)?function\s+(\w+)/);
    if(funcMatch) return `FUNCTION[${funcMatch[2]}]`;

    const defMatch = firstLine.match(/^def\s+(\w+)/);
    if(defMatch) return `FUNCTION[${defMatch[1]}]`;

    const classMatch = firstLine.match(/class\s+(\w+)/);
    if(classMatch) return `BUILD[${classMatch[1]}]`;
    
    const dbMatch = firstLine.match(/SELECT|INSERT|UPDATE|DELETE/i);
    if(dbMatch) return `DATABASE[${dbMatch[0]}]`;

    return blockType;
  }

  private extractStepsFromBlock(lines: string[]): string[] {
    const steps: string[] = [];
    for (const line of lines) {
      const urlMatch = line.match(/['"`](https?:\/\/[^'"`]+)['"`]/);
      if (urlMatch) steps.push(`REQUEST[${this.shortenUrl(urlMatch[1])}]`);

      const methodMatch = line.match(/method:\s*['"`](\w+)['"`]/);
      if (methodMatch) steps.push(`METHOD[${methodMatch[1].toUpperCase()}]`);

      if (line.includes('Authorization') || line.includes('Bearer')) steps.push('AUTH[Token]');
      if (line.includes('snapImage')) steps.push('CAPTURE[Image]');
      
      const expMatch = line.match(/setExposure\((\d+(\.\d+)?)\)/);
      if (expMatch) steps.push(`EXPOSURE[${expMatch[1]}ms]`);

      const chMatch = line.match(/setChannel\(['"`]([^'"`]+)['"`]\)/);
      if (chMatch) steps.push(`CHANNEL[${chMatch[1]}]`);
      
      if (line.includes('.json()')) steps.push('PARSE[JSON]');
      if (line.includes('JSON.stringify')) steps.push('SERIALIZE[JSON]');
      
      const responseVarMatch = line.match(/(\w+)\s*=\s*await\s+response.json/);
      if(responseVarMatch) steps.push('RESPONSE[DATA]');

      const returnMatch = line.match(/return\s+([^;]+)/);
      if (returnMatch && !returnMatch[1].includes('{')) {
        steps.push(`RETURN[${this.cleanValue(returnMatch[1])}]`);
      }
    }
    return [...new Set(steps)];
  }

  private determineOutcome(type: string, steps: string[], lines: string[]): string {
    if (lines.some(l => l.includes('error') || l.includes('catch'))) return 'FAILED';
    if (steps.some(s => s.includes('RETURN'))) return 'RETURNED';
    if (steps.some(s => s.includes('RESPONSE'))) return 'COMPLETE';

    switch (type) {
      case 'API': return 'RECEIVED';
      case 'AUTH': return 'AUTHENTICATED';
      case 'MICROSCOPE': return 'EXECUTED';
      case 'MICROSCOPY': return 'ACQUIRED';
      case 'DATABASE': return 'EXECUTED';
      case 'FUNCTION': return 'DEFINED';
      case 'BUILD': return 'CREATED';
      default: return 'PROCESSED';
    }
  }
  
  private shortenUrl(url: string): string {
    if (url.includes('anthropic')) return 'Anthropic_Claude';
    if (url.includes('openai')) return 'OpenAI_GPT';
    if (url.includes('google')) return 'Google_AI';
    if (url.includes('gemini')) return 'Gemini';
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        if (pathParts.length > 0) return pathParts.slice(-2).join('/');
        return urlObj.hostname.replace('www.','');
    } catch(e) {
        return 'API_Endpoint';
    }
  }

  private cleanValue(value: string): string {
    return value.trim().replace(/[;,]$/, '').substring(0, 20);
  }

  private hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
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
    const converter = new ProductionCubeConverter();
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
        compression_ratio: cube_lines > 0 ? `${(original_lines / cube_lines).toFixed(1)}:1` : `${original_lines}:0`,
        savings_percent: savings_percent < 0 ? 0 : savings_percent,
        time_saved_minutes: Math.round(original_lines * 1.5)
    };
    
    if (cube_lines === 0) {
      throw new Error("Could not find any convertible operations in the provided code.");
    }
    
    return { cube_code, metrics };
  } catch (error) {
    console.error("Error during CUBE conversion:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during conversion.";
    throw new Error(`Client-side Conversion Failed: ${errorMessage}`);
  }
};