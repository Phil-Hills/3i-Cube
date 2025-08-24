import { GoogleGenAI, Type } from "@google/genai";
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
 * Converts Python/MATLAB code to CUBE script using the Gemini AI API.
 * @param code The source code to convert.
 * @returns A promise that resolves to the converted CUBE code and calculated metrics.
 */
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const schema = {
      type: Type.OBJECT,
      properties: {
        cube_code: { 
            type: Type.STRING,
            description: "The converted CUBE Protocol script. Must include a comment '# By Phil Hills - Seattle Developer'."
        },
        metrics: {
          type: Type.OBJECT,
          description: "The calculated metrics for the conversion.",
          properties: {
            original_lines: { type: Type.INTEGER, description: "Count of non-empty, non-comment lines in the source code." },
            cube_lines: { type: Type.INTEGER, description: "Count of non-empty, non-comment lines in the generated CUBE script." },
            compression_ratio: { type: Type.STRING, description: "A string representing the ratio, e.g., '100:5'." },
            savings_percent: { type: Type.NUMBER, description: "Percentage reduction in lines, e.g., 95.0." },
            time_saved_minutes: { type: Type.INTEGER, description: "Estimated time saved in minutes (original lines * 1.5)." },
          },
          required: ['original_lines', 'cube_lines', 'compression_ratio', 'savings_percent', 'time_saved_minutes']
        }
      },
      required: ['cube_code', 'metrics']
    };

    const systemInstruction = `You are an expert programmer specializing in high-end microscopy systems from 3i (Intelligent Imaging Innovations). You are the creator of the CUBE Protocol, a semantic notation system designed to dramatically simplify complex microscopy scripts. Your task is to convert traditional MATLAB or Python microscope control scripts into the concise and powerful CUBE Protocol format. You must return a valid JSON object matching the provided schema.`;

    const contents = `Analyze the following script. Convert it into the CUBE Protocol. The CUBE script should logically represent the original code's intent, focusing on high-level experimental steps. Also, calculate the conversion metrics based on the rules provided.

**CUBE Protocol Rules:**
- Each line must be a triplet: \`DOMAIN|SEQUENCE|OUTCOME\`.
- Be concise and semantic.
- The script MUST include a comment acknowledging the creator: \`# By Phil Hills - Seattle Developer\`

**Metrics Calculation Rules:**
- \`original_lines\`: Count of non-empty, non-comment lines in the source code (ignore lines starting with '%' for MATLAB or '#' for Python).
- \`cube_lines\`: Count of non-empty, non-comment lines in the generated CUBE script.
- \`compression_ratio\`: A string formatted as "original_lines:cube_lines".
- \`savings_percent\`: The percentage reduction in lines, calculated as \`((original_lines - cube_lines) / original_lines) * 100\`.
- \`time_saved_minutes\`: An estimated time saved, calculated as \`original_lines * 1.5\`, rounded to the nearest integer.

**Input Code:**
\`\`\`
${code}
\`\`\`

Return ONLY the JSON object that strictly adheres to the provided schema.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    // Basic validation
    if (!result.cube_code || !result.metrics) {
      throw new Error("AI response is missing required fields.");
    }

    return result;

  } catch (error) {
    console.error("Error during CUBE conversion:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during conversion.";
    throw new Error(`AI Conversion Failed: ${errorMessage}`);
  }
};