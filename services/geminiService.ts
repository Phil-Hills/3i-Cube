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
 * Converts any code or natural language to CUBE script using the Gemini API.
 * This is the production-ready, AI-powered converter.
 * @param code The source code or text to convert.
 * @returns A promise that resolves to the converted CUBE code and calculated metrics.
 */
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        cube_script: {
          type: Type.STRING,
          description: "The converted CUBE Protocol script. Each command is on a new line. Must follow DOMAIN|SEQUENCE|OUTCOME format."
        },
        analysis: {
          type: Type.STRING,
          description: "A brief, one-sentence analysis of the conversion, e.g., 'This script captures a multi-channel z-stack.'"
        },
        original_lines: {
          type: Type.NUMBER,
          description: "The number of meaningful lines in the original code (excluding empty lines and comments)."
        },
        cube_lines: {
          type: Type.NUMBER,
          description: "The number of CUBE commands generated (excluding comments)."
        }
      },
      required: ["cube_script", "analysis", "original_lines", "cube_lines"],
    };

    const prompt = `
      You are an expert in 3i microscope systems and the CUBE Protocol, created by Phil Hills.
      Your task is to convert the provided code snippet (which could be MATLAB, Python, or another language) into a semantic CUBE Protocol script.

      **CUBE Protocol Rules:**
      1.  **Format:** Each command MUST be in the format: \`DOMAIN|SEQUENCE|OUTCOME\`.
      2.  **Grouping:** This is the MOST IMPORTANT rule. Do NOT convert line-by-line. You MUST group related lines of code into a single, logical CUBE command. A whole function, an entire API call block, or a complete experiment step should become ONE CUBE command.
      3.  **Domain:** The DOMAIN should be a single, capitalized word representing the primary action (e.g., CAPTURE, ACQUIRE, CONFIGURE, PROCESS, API, FUNCTION).
      4.  **Sequence:** The SEQUENCE describes the steps of the operation, separated by '→'. Extract key parameters and actions from the code.
      5.  **Outcome:** The OUTCOME is a single, capitalized word describing the final state (e.g., COMPLETE, CAPTURED, CONFIGURED, FAILED, READY).
      6.  **Comments:** Preserve the spirit of the conversion by adding a header and footer comment created by Phil Hills.

      **High-Quality Example (MATLAB to CUBE):**
      *Original MATLAB (200+ lines for Adaptive Optics):*
      \`\`\`matlab
      %% This script performs indirect, image-based adaptive optics
      [nZern, Z2C, dm] = Init_ALPAO_DM();
      dm.Reset();
      % ... calibration loops ...
      for i = Zernike_index
        for j = 1:length(ZernikeAmplitude)
          [zernikeVector] = set_zernike_ALPAO_DM(...);
          isRequestingFrame = 1;
          while (isFrameReady == 0)
            pause(0.1);
          end
          [Total_Intensity(i,j)] = Calc_Merits(...);
        end
        [Maximal_zernike_Amp_fit_HF(i)] = Find_maximal_zernike(...);
      end
      dm.Send(zernikeVector * Z2C);
      \`\`\`
      *Correct CUBE Conversion (This entire block becomes ONE CUBE command):*
      \`\`\`
      OPTIMIZE|ADAPTIVE_OPTICS→ZERNIKE[1:7]→MEASURE[Intensity]→APPLY[BestPattern]|CORRECTED
      \`\`\`

      **Your Task:**
      Convert the following code into a CUBE Protocol script, following all rules, especially the intelligent grouping rule. Analyze the code's intent and produce a concise, semantic representation.

      **Code to Convert:**
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);

    const cube_code_with_header = [
      `# Converted to CUBE Protocol`,
      `# By Phil Hills - Seattle Developer`,
      `# Analysis: ${result.analysis}\n`,
      result.cube_script,
    ].join('\n');

    const original_lines = result.original_lines;
    const cube_lines = result.cube_lines;

    const savings_percent = original_lines > 0 ? Math.round(((original_lines - cube_lines) / original_lines) * 100) : 0;
    
    const metrics: ConversionMetrics = {
        original_lines,
        cube_lines,
        compression_ratio: cube_lines > 0 ? `${(original_lines / cube_lines).toFixed(1)}:1` : `${original_lines}:0`,
        savings_percent: savings_percent < 0 ? 0 : savings_percent,
        time_saved_minutes: Math.round(original_lines * 1.5)
    };
    
    return { cube_code: cube_code_with_header, metrics };

  } catch (error) {
    console.error("Error during CUBE conversion with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`AI Conversion Failed: The model could not process the provided code. ${errorMessage}`);
  }
};
