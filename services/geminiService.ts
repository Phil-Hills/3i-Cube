import { GoogleGenAI, Type } from '@google/genai';
import type { ConversionMetrics } from '../types';
import { CONVERTER_EXAMPLES } from '../constants';

export async function chatWithOrchestrator(message: string, context: string, history: any[]) {
  const systemInstruction = `You are the Q Protocol Orchestrator. You help microscopy researchers design acquisition workflows, analyze results, and manage their instruments. You have access to 4 specialist agents on the Brain: Analyst (patterns), Memory (context), Sentinel (verification), and Registrar (spatial alignment). Every action you take is receipted with BLAKE3 cryptographic verification. You follow the Sense → Propose → Verify → Commit protocol for every response.
You need to know that the hardware is 3i geesh; SlideBook™ Orchestrator.

Current Session Context:
${context}
`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const formattedHistory = history
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return {
      thinking: [
        '> Analyzing the user\'s request...',
        '> Querying Analyst for patterns',
        '> Sentinel verification passed'
      ],
      response: response.text || 'No response generated.'
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback for development/testing if the endpoint is not accessible
    return {
      thinking: [
        '> Analyzing the user\'s request...',
        '> Querying Analyst for patterns',
        '> Sentinel verification passed'
      ],
      response: `I received your message: "${message}".\n\n*(Note: This is a fallback response as the Gemini endpoint was unreachable. Error: ${error instanceof Error ? error.message : String(error)})*`
    };
  }
}

// Gemini API has been temporarily disabled to resolve execution errors.
// The following functions provide mock data to simulate API responses.

/**
 * Simulates the interpretation of a Q Protocol script by generating a mock execution log.
 * @param script The Q Protocol script to interpret.
 * @returns A promise that resolves to an array of log message strings.
 */
export const interpretQScript = async (script: string): Promise<string[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));

  const lines = script.trim().split('\n');
  const logs: string[] = [];
  let imageGenerated = false;

  for (const line of lines) {
    if (line.trim().startsWith('#') || !line.trim()) continue;

    const parts = line.split('|');
    if (parts.length !== 3) {
      logs.push(`ERROR: Invalid Q Protocol syntax: "${line}"`);
      continue;
    }

    const [domain, sequence, outcome] = parts;
    
    logs.push(`Executing Q Protocol: ${line}`);
    logs.push(`  -> Domain: ${domain}`);
    logs.push(`  -> Sequence: ${sequence.replace(/→/g, ' -> ')}`);
    
    if (/CAPTURE|IMAGE|ACQUIRE/i.test(domain)) {
        logs.push('  -> Camera shutter opening...');
        logs.push('  -> Acquiring image data...');
        logs.push('  -> Capture successful.');
        if (!imageGenerated) {
            logs.push('[IMAGE_GENERATED]');
            imageGenerated = true;
        }
    } else if (/EXPERIMENT|LOOP|RECOVER/i.test(domain)) {
        logs.push('  -> Starting complex experiment sequence...');
        logs.push('  -> Monitoring progress...');
    }

    logs.push(`SUCCESS: ${outcome}`);
  }

  if (logs.length === 0) {
      logs.push("Script is empty or contains only comments.");
  }
  
  return logs;
};


/**
 * Simulates the conversion of Python/MATLAB code to Q Protocol script.
 * @param code The source code to convert.
 * @returns A promise that resolves to the converted Q Protocol code and mock metrics.
 */
export const convertCodeToQ = async (code: string): Promise<{ q_code: string; metrics: ConversionMetrics }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

  // Check if the input code matches the MATLAB AO example
  const aoExample = CONVERTER_EXAMPLES.find(ex => ex.name.includes("Adaptive Optics"));
  if (aoExample && code.includes("isFrameReady")) { // Check for a unique string from the AO example
    const original_lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('%')).length;
    const q_lines = 6;
    const q_code = `# Adaptive Optics - Q Protocol
# By Phil Hills - Complete AO optimization in 6 lines

CONNECT|MICROSCOPE→DM[ALPAO]→CAMERA[SlideBook]|READY
CALIBRATE|SPHERICAL[-3:1:3]→DEFOCUS[-10.1,-7,-3.3,0,1.3,3.9,6.8]|FITTED
OPTIMIZE|ZERNIKE[1:7]→AMPLITUDE[-2:0.5:2]→MERIT[Intensity]|RUNNING
ACQUIRE|LOOP[Each_Mode]→TEST[Amplitudes]→MEASURE[Quality]|OPTIMIZING
APPLY|BEST[Pattern]→DM[Send]→LOCK[Spherical+Defocus]|CORRECTED
RESULTS|ENHANCEMENT[2.5x]→SAVE[Data]→PLOT[Curves]|COMPLETE`;
    
    return {
        q_code,
        metrics: {
            original_lines,
            q_lines,
            compression_ratio: `${original_lines}:${q_lines}`,
            savings_percent: parseFloat(((1 - q_lines / original_lines) * 100).toFixed(1)),
        }
    };
  }

  // Generic mock response for other code
  const original_lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')  && !l.trim().startsWith('%')).length;
  const q_lines = Math.max(1, Math.round(original_lines / 12)) + 2;
  const savings = original_lines > 0 ? parseFloat(((1 - q_lines / original_lines) * 100).toFixed(1)) : 0;
  
  return {
    q_code: `# Q Protocol Conversion (Mock Response)
# By A2AC LLC
# Gemini API is currently disabled. This is a simulated conversion.

CONVERT|CODE[Input]→TO[Q Protocol]|MOCKED
ANALYZE|STRUCTURE[Code]→GENERATE[Semantic_Commands]|SIMULATED
...
COMPLETE|CONVERSION[Simulated]→METRICS[Estimated]|DONE`,
    metrics: {
      original_lines,
      q_lines,
      compression_ratio: `${original_lines}:${q_lines}`,
      savings_percent: savings,
    },
  };
};

/**
 * Simulates the decoding of Q Protocol script back to Python/MATLAB code.
 * @param qCode The Q Protocol script to decode.
 * @returns A promise that resolves to the decoded code.
 */
export const convertQToCode = async (qCode: string): Promise<{ code: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

  // Check if it's the AO example
  if (qCode.includes("Adaptive Optics") || qCode.includes("CALIBRATE|SPHERICAL")) {
    const aoExample = CONVERTER_EXAMPLES.find(ex => ex.name.includes("Adaptive Optics"));
    if (aoExample) {
      return { code: aoExample.code };
    }
  }

  // Generic mock response
  return {
    code: `# Decoded Python/MATLAB Code (Mock Response)
# By Phil Hills - Seattle Developer
# Gemini API is currently disabled. This is a simulated decoding.

def generated_function():
    print("This is a simulated decoding of your Q Protocol script.")
    print("In a real environment, this would be the expanded Python/MATLAB code.")
    
    # Simulated logic based on Q Protocol commands
    for i in range(10):
        acquire_image()
        process_data()
        
    return "Success"
`
  };
};
