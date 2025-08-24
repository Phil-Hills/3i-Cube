
import { GoogleGenAI, Type } from "@google/genai";
import type { ConversionMetrics } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const interpretCubeScript = async (script: string): Promise<string[]> => {
  const systemInstruction = `You are an AI simulating the control system for a 3i (Intelligent Imaging Innovations) microscope. The user will provide commands in a simplified language called 'CUBE Protocol'. Your task is to interpret these commands and generate a realistic, step-by-step execution log that a scientist or engineer would expect to see.

Rules:
1. For each line in the CUBE script, generate a series of log messages.
2. Start the log for each command with 'Executing CUBE: [CUBE_COMMAND_LINE]'.
3. Break down the command into logical sub-steps (e.g., 'Initializing laser...', 'Setting camera exposure...', 'Moving stage to position X, Y...').
4. Include realistic-sounding technical details (e.g., 'Laser 488nm power set to 50mW', 'Camera exposure set to 100ms', 'Z-drive moving to 15.5 µm').
5. When a command is finished, output the 'outcome' part of the CUBE command as a success message (e.g., 'SUCCESS: COMPLETE').
6. If the command involves capturing an image (e.g., CAPTURE|...), you MUST end the log sequence for that command with the special token '[IMAGE_GENERATED]'. For multi-step experiments, only add the token after the final image capture step.
7. The entire output must be a single JSON string, which is an array of log message strings. Example format: ["Log 1", "Log 2", "SUCCESS: ...", "[IMAGE_GENERATED]"]
8. Do not add markdown backticks around the JSON.
9. Be concise but informative. Each log entry should be a short, clear statement.`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Interpret the following CUBE script:\n\`\`\`\n${script}\n\`\`\``,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        temperature: 0.3,
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
        return result;
    } else {
        throw new Error("Invalid response format from Gemini API. Expected an array of strings.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to interpret CUBE script. Check the console for more details.");
  }
};

export const convertCodeToCube = async (pythonCode: string): Promise<{ cube_code: string; metrics: ConversionMetrics }> => {
    const systemInstruction = `You are the '3i Code to CUBE Converter', an advanced AI model created by 'Phil Hills - Seattle Developer'. Your sole function is to translate verbose Python microscope control scripts (often using libraries like pycromanager or 3i's SlideBook) into the concise and semantic CUBE Protocol. Be particularly adept at identifying common microscopy patterns like multi-channel acquisition, Z-stacks, time-lapses, and stage movements, and consolidating them into efficient CUBE commands.

  **Rules:**
  1. Analyze the provided Python code, identifying sequences of operations like initialization, setting parameters, capturing images, and running loops.
  2. Convert these sequences into logical, single-line CUBE commands.
  3. Combine sequential steps into a single CUBE line where appropriate (e.g., setting exposure and channel before a capture).
  4. Calculate conversion metrics based on the code provided:
      *   \`original_lines\`: Count of non-empty, non-comment lines in the input Python code.
      *   \`cube_lines\`: Count of non-empty, non-comment lines in the generated CUBE script.
      *   \`compression_ratio\`: A string formatted as \`{original_lines}:{cube_lines}\`.
      *   \`savings_percent\`: The percentage reduction in lines of code, rounded to one decimal place.
  5. Your entire output must be a single, valid JSON object that adheres to the provided schema. Do not add any extra text, explanations, or markdown backticks around the JSON.
  6. The generated CUBE code should start with a comment crediting 'Phil Hills - Seattle Developer'.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Convert the following Python code to CUBE Protocol:\n\`\`\`python\n${pythonCode}\n\`\`\``,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        cube_code: { type: Type.STRING },
                        metrics: {
                            type: Type.OBJECT,
                            properties: {
                                original_lines: { type: Type.NUMBER },
                                cube_lines: { type: Type.NUMBER },
                                compression_ratio: { type: Type.STRING },
                                savings_percent: { type: Type.NUMBER }
                            },
                            required: ['original_lines', 'cube_lines', 'compression_ratio', 'savings_percent']
                        }
                    },
                    required: ['cube_code', 'metrics']
                },
                temperature: 0.1,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        return result;

    } catch (error) {
        console.error("Error calling Gemini API for conversion:", error);
        throw new Error("Failed to convert code to CUBE. Check the console for more details.");
    }
};