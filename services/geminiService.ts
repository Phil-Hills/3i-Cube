
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
export const convertCodeToCube = async (code: string): Promise<{ cube_code: string; metrics: ConversionMetrics; }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const countMeaningfulLines = (text: string) => {
      return text.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('#') && !trimmed.startsWith('%');
      }).length;
    };

    const original_lines = countMeaningfulLines(code);
    
    const systemInstruction = `You are an expert at converting code to the CUBE Protocol, created by Phil Hills. Your highest priority is INTELLIGENT GROUPING. Group related lines of code (like a whole function, class, or API call) into a single, semantic CUBE command in the format: DOMAIN|SEQUENCE|OUTCOME. Do not convert line-by-line. Capture the overall purpose of a code block.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        cube_script: {
          type: Type.STRING,
          description: "The fully converted CUBE Protocol script. Each logical operation should be a single line. Must follow DOMAIN|SEQUENCE|OUTCOME format."
        },
        analysis: {
          type: Type.STRING,
          description: "A brief, one-sentence analysis of the original code's purpose."
        }
      },
      required: ["cube_script", "analysis"],
    };

    const prompt = `
      **CRITICAL TASK: Convert the user's code into a CUBE Protocol script and provide a brief analysis.**

      **High-Quality Grouping Examples:**

      *Example 1: Complex MATLAB Procedure*
      \`\`\`matlab
      % ... 200+ lines for adaptive optics ...
      [nZern, Z2C, dm] = Init_ALPAO_DM();
      p = polyfit(Spherical_calibration, Defocus_corection, 1);
      for i = Zernike_index
        % ... loops and calculations ...
      end
      dm.Send(zernikeVector * Z2C);
      \`\`\`
      *Correct CUBE:* "OPTIMIZE|ADAPTIVE_OPTICS→ZERNIKE[1:7]→APPLY[BestPattern]|CORRECTED"
      
      *Example 2: Python API Call*
      \`\`\`python
      def get_user_data(user_id):
          headers = {"Authorization": "Bearer ..."}
          response = requests.get(f"https://api.service.com/users/{user_id}", headers=headers)
          return response.json()
      \`\`\`
      *Correct CUBE:* "API|REQUEST[users]→AUTH[Bearer]→METHOD[GET]→RESPONSE[JSON]|COMPLETE"

      Now, apply this logic to the user's code.

      **User's Code to Convert:**
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    
    const cube_lines = countMeaningfulLines(result.cube_script);

    const cube_code_with_header = [
      `# Converted to CUBE Protocol`,
      `# By Phil Hills - Seattle Developer`,
      `# Analysis: ${result.analysis}`,
      `# Compression: ${original_lines}:${cube_lines} lines\n`,
      result.cube_script,
    ].join('\n');
    
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