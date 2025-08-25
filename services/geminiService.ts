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
  let mediaGenerated = false;

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

    if (upperDomain === 'GENERATE' && sequence.toUpperCase().includes('VIDEO')) {
        logs.push('  -> Initializing VEO-3 Generative Video Model...');
        logs.push('     • Parsing text prompt...');
        await new Promise(resolve => setTimeout(resolve, 500));
        logs.push('     • Generating keyframes from diffusion model...');
        await new Promise(resolve => setTimeout(resolve, 800));
        logs.push('     • Interpolating frames and upscaling...');
        await new Promise(resolve => setTimeout(resolve, 600));
        logs.push('     • Encoding video to MP4...');
        if (!mediaGenerated) {
            logs.push('[MEDIA_GENERATED]');
            mediaGenerated = true;
        }
    } else if (upperDomain.includes('ACQUIRE') || upperDomain.includes('CAPTURE') || upperDomain.includes('SCAN') || upperDomain.includes('TIMELAPSE')) {
        logs.push('  -> ✓ Acquisition started');
        logs.push('     • Camera: Hamamatsu ORCA-Fusion BT');
        logs.push('     • Resolution: 2304 x 2304 pixels');
        logs.push('     • Bit depth: 16-bit');
        
        const channelsMatch = sequence.match(/CHANNELS\[(.*?)\]/i);
        if (channelsMatch && channelsMatch[1]) {
            logs.push(`     • Channels: ${channelsMatch[1]}`);
        }

        if (!mediaGenerated) {
            logs.push('[MEDIA_GENERATED]');
            mediaGenerated = true;
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

/**
 * Generates CUBE script from a natural language description using the Gemini API.
 * @param description The natural language description of the experiment.
 * @returns A promise that resolves to the converted CUBE code and calculated metrics.
 */
export const generateCubeFromNaturalLanguage = async (description: string): Promise<{ cube_code: string; metrics: ConversionMetrics; }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are an expert microscopist and a master of the CUBE Protocol, a semantic language for controlling microscopes in the format: DOMAIN|SEQUENCE|OUTCOME. Your task is to convert a user's natural language description of a scientific experiment into a concise, elegant, and syntactically correct CUBE Protocol script. You must also provide a brief analysis and estimate how many lines of traditional code (e.g., Python, MATLAB) this script would replace.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        cube_script: {
          type: Type.STRING,
          description: "The fully converted CUBE Protocol script. Each logical operation should be a single line. Must follow DOMAIN|SEQUENCE|OUTCOME format."
        },
        analysis: {
          type: Type.STRING,
          description: "A brief, one-sentence analysis of the experimental goal."
        },
        estimated_lines_saved: {
          type: Type.NUMBER,
          description: "An integer estimate of how many lines of traditional code (like Python or MATLAB) this CUBE script would replace."
        }
      },
      required: ["cube_script", "analysis", "estimated_lines_saved"],
    };

    const prompt = `
      **CRITICAL TASK: Convert the user's experimental description into a CUBE Protocol script, provide an analysis, and estimate the lines of code saved.**

      **High-Quality Examples:**

      *User Description:* "I want to do a 24-hour time-lapse of live cells, keeping them at 37C and 5% CO2. I'm using GFP and RFP channels and need autofocus."
      *Correct Response JSON:*
      {
        "cube_script": "MARIANAS|LIVE_CELL→TEMP[37C]→CO2[5%]→OBJECTIVE[60x_Oil]|READY\\nTIMELAPSE|DURATION[24h]→INTERVAL[5min]→CHANNELS[GFP,RFP]→AUTOFOCUS[ON]|RUNNING\\nANALYZE|TRACK[Cells]→MEASURE[Division_Time]→PLOT[Growth_Curve]|COMPLETE",
        "analysis": "This experiment involves long-term live-cell imaging with environmental control and subsequent analysis.",
        "estimated_lines_saved": 75
      }
      
      *User Description:* "Scan a whole cleared mouse brain section for DAPI and GFP using tiles and stitch it."
      *Correct Response JSON:*
      {
        "cube_script": "AXL|CLEARED[Mouse_Brain]→OBJECTIVE[10x_Clarity]→IMMERSION[RI_1.45]|READY\\nSCAN|VOLUME[10x10x5mm]→TILE[20x20]→OVERLAP[10%]→CHANNELS[DAPI,GFP]|IMAGING\\nSTITCH|TILES→FUSE[Blending]→COMPRESS[HDF5]→VISUALIZE[3D]|COMPLETE",
        "analysis": "This protocol describes a large-volume tile-scanning experiment on a cleared tissue sample.",
        "estimated_lines_saved": 150
      }

      Now, apply this logic to the user's request.

      **User's Experimental Description:**
      "${description}"
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
    
    const cube_lines = result.cube_script.split('\n').filter((l: string) => l.trim().length > 0 && !l.trim().startsWith('#')).length;
    
    const original_lines = result.estimated_lines_saved;

    const cube_code_with_header = [
      `# Generated from Natural Language with Gemini`,
      `# By Phil Hills - Seattle Developer`,
      `# Analysis: ${result.analysis}`,
      `# Estimated code lines replaced: ${original_lines}\n`,
      result.cube_script,
    ].join('\n');
    
    const metrics: ConversionMetrics = {
        original_lines,
        cube_lines,
        compression_ratio: 'N/A', // Not applicable for NL
        savings_percent: 0, // Not applicable for NL
        time_saved_minutes: Math.round(original_lines * 1.5)
    };
    
    return { cube_code: cube_code_with_header, metrics };

  } catch (error) {
    console.error("Error during CUBE generation with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`AI Generation Failed: The model could not process the description. ${errorMessage}`);
  }
};