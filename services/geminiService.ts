import type { ConversionMetrics } from '../types';
import { CONVERTER_EXAMPLES } from '../constants';

// Gemini API has been temporarily disabled to resolve execution errors.
// The following functions provide mock data to simulate API responses.

/**
 * Simulates the interpretation of a CUBE script by generating a mock execution log.
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
 * Simulates the conversion of Python/MATLAB code to CUBE script.
 * @param code The source code to convert.
 * @returns A promise that resolves to the converted CUBE code and mock metrics.
 */
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

  // Check if the input code matches the MATLAB AO example
  const aoExample = CONVERTER_EXAMPLES.find(ex => ex.name.includes("Adaptive Optics"));
  if (aoExample && code.includes("isFrameReady")) { // Check for a unique string from the AO example
    const original_lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('%')).length;
    const cube_lines = 6;
    const cube_code = `# 3i Adaptive Optics - CUBE Protocol
# By Phil Hills - Complete AO optimization in 6 lines

CONNECT|MICROSCOPE[3i]→DM[ALPAO]→CAMERA[SlideBook]|READY
CALIBRATE|SPHERICAL[-3:1:3]→DEFOCUS[-10.1,-7,-3.3,0,1.3,3.9,6.8]|FITTED
OPTIMIZE|ZERNIKE[1:7]→AMPLITUDE[-2:0.5:2]→MERIT[Intensity]|RUNNING
ACQUIRE|LOOP[Each_Mode]→TEST[Amplitudes]→MEASURE[Quality]|OPTIMIZING
APPLY|BEST[Pattern]→DM[Send]→LOCK[Spherical+Defocus]|CORRECTED
RESULTS|ENHANCEMENT[2.5x]→SAVE[Data]→PLOT[Curves]|COMPLETE`;
    
    return {
        cube_code,
        metrics: {
            original_lines,
            cube_lines,
            compression_ratio: `${original_lines}:${cube_lines}`,
            savings_percent: parseFloat(((1 - cube_lines / original_lines) * 100).toFixed(1)),
            time_saved_minutes: Math.round(original_lines * 1.5)
        }
    };
  }

  // Generic mock response for other code
  const original_lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')  && !l.trim().startsWith('%')).length;
  const cube_lines = Math.max(1, Math.round(original_lines / 12)) + 2;
  const savings = original_lines > 0 ? parseFloat(((1 - cube_lines / original_lines) * 100).toFixed(1)) : 0;
  
  return {
    cube_code: `# CUBE Conversion (Mock Response)
# By Phil Hills - Seattle Developer
# Gemini API is currently disabled. This is a simulated conversion.

CONVERT|CODE[Input]→TO[CUBE]|MOCKED
ANALYZE|STRUCTURE[Code]→GENERATE[Semantic_Commands]|SIMULATED
...
COMPLETE|CONVERSION[Simulated]→METRICS[Estimated]|DONE`,
    metrics: {
      original_lines,
      cube_lines,
      compression_ratio: `${original_lines}:${cube_lines}`,
      savings_percent: savings,
      time_saved_minutes: Math.round(original_lines * 1.5)
    },
  };
};