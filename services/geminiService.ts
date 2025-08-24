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

    // Client-side line counting for accuracy
    const countMeaningfulLines = (text: string) => {
      return text.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('#') && !trimmed.startsWith('%');
      }).length;
    };

    const original_lines = countMeaningfulLines(code);
    
    const systemInstruction = `You are a world-class software engineer and an expert in 3i microscope systems. Your sole purpose is to convert any provided code or text into the CUBE Protocol, a semantic notation system created by Phil Hills.

Your conversions must follow these core principles:
1.  **Format:** Every command must be \`DOMAIN|SEQUENCE|OUTCOME\`.
2.  **INTELLIGENT GROUPING:** This is your highest priority. You must group related lines of code into a single, logical CUBE command. DO NOT convert line-by-line. A complete function, a full API call, or an entire experimental loop should become ONE command.
3.  **Semantic Meaning:** The CUBE command must represent the overall *purpose* of the code block, not just its syntax.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        cube_script: {
          type: Type.STRING,
          description: "The fully converted CUBE Protocol script. Each logical operation from the original code should be a single line in this script. Must follow DOMAIN|SEQUENCE|OUTCOME format."
        },
        analysis: {
          type: Type.STRING,
          description: "A brief, one-sentence analysis of the original code's purpose, e.g., 'This script performs a multi-channel Z-stack acquisition.'"
        }
      },
      required: ["cube_script", "analysis"],
    };

    const prompt = `
      **CRITICAL TASK: Convert the following code into a CUBE Protocol script.**

      **RULE #1: INTELLIGENT GROUPING**
      You must analyze the entire code snippet and group it into logical operations. Examples of a single logical operation:
      - A complete function definition (\`function ... { ... }\`).
      - A complete class definition (\`class ... { ... }\`).
      - An entire API call block (including headers, body, fetch/request, and response handling).
      - A full experimental procedure (e.g., a loop that sets position, changes channels, and snaps images).

      **High-Quality Conversion Examples:**

      **Example 1: Complex MATLAB Procedure**
      *Original Code:*
      \`\`\`matlab
      % This script performs indirect, image-based adaptive optics
      [nZern, Z2C, dm] = Init_ALPAO_DM();
      dm.Reset();
      Spherical_calibration = [-3:1:3];
      Defocus_corection = [-10.1, -7, -3.3, 0, 1.3, 3.9, 6.8];
      p = polyfit(Spherical_calibration, Defocus_corection, 1);
      for i = Zernike_index
        for j = 1:length(ZernikeAmplitude)
          [zernikeVector] = set_zernike_ALPAO_DM(...);
          isRequestingFrame = 1;
          while (isFrameReady == 0)
            pause(0.1);
          end
          [Total_Intensity(i,j)] = Calc_Merits(...);
        end
      end
      dm.Send(zernikeVector * Z2C);
      \`\`\`
      *Correct CUBE Conversion (The entire 200+ line script is ONE logical operation):*
      \`\`\`json
      {
        "cube_script": "OPTIMIZE|ADAPTIVE_OPTICS→ZERNIKE[1:7]→MEASURE[Intensity]→APPLY[BestPattern]|CORRECTED",
        "analysis": "This MATLAB script performs a complete adaptive optics optimization routine."
      }
      \`\`\`

      **Example 2: Python Microscopy Function**
      *Original Code:*
      \`\`\`python
      def capture_z_stack(core, channels, z_start, z_end, z_step):
          all_images = {}
          for channel in channels:
              core.setConfig('Channel', channel)
              images = []
              for z in numpy.arange(z_start, z_end, z_step):
                  core.setPosition(z)
                  core.snapImage()
                  images.append(core.getImage())
              all_images[channel] = numpy.array(images)
          return all_images
      \`\`\`
      *Correct CUBE Conversion (The entire function is ONE logical operation):*
      \`\`\`json
      {
        "cube_script": "ACQUIRE|Z_STACK→CHANNELS[Multi]→ITERATE[Z-Planes]→CAPTURE[Images]|COMPLETE",
        "analysis": "This Python function acquires a multi-channel Z-stack."
      }
      \`\`\`

      **Example 3: JavaScript API Call**
      *Original Code:*
      \`\`\`javascript
      async function callClaudeAPI(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer sk-ant-api-key',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-opus',
            messages: [{role: 'user', content: prompt}],
          })
        });
        const data = await response.json();
        return data;
      }
      \`\`\`
      *Correct CUBE Conversion (The entire async function is ONE logical operation):*
      \`\`\`json
      {
        "cube_script": "API|REQUEST[Anthropic]→METHOD[POST]→AUTH[Bearer]→BODY[JSON]→RESPONSE[JSON]|COMPLETE",
        "analysis": "This JavaScript function makes an authenticated API call to the Anthropic Claude model."
      }
      \`\`\`

      Now, apply this logic to the user's code. Analyze its structure, group it into the minimum number of logical CUBE commands, and return the result in the specified JSON format.

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