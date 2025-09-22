/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
// FIX: Removed import for interpretCubeScript as it is not exported from geminiService.
import {
    convertCodeToCube,
    generateCubeFromNaturalLanguage
} from '../services/geminiService';
import { GoogleGenAI, Type } from "@google/genai";

// Mock the entire @google/genai module
jest.mock("@google/genai", () => {
    const mockGenerateContent = jest.fn();
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => ({
            models: {
                generateContent: mockGenerateContent,
            },
        })),
        Type: { // Make sure to export Type as well
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            NUMBER: 'NUMBER',
        },
    };
});

// Get a typed mock of the generateContent function
const mockGenerateContent = (GoogleGenAI as jest.Mock).mock.results[0].value.models.generateContent;

describe('geminiService', () => {

    beforeEach(() => {
        // Clear mock history before each test
        mockGenerateContent.mockClear();
        (GoogleGenAI as jest.Mock).mockClear();
        // Set a default mock implementation
        process.env.API_KEY = "test-api-key";
    });

    // FIX: Removed tests for interpretCubeScript as the function is not part of geminiService.
    describe('convertCodeToCube', () => {
        it('should call Gemini API with the correct prompt structure', async () => {
            const code = 'console.log("hello world")';
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify({ cube_script: 'LOG|MESSAGE[hello world]|DONE', analysis: 'Logs a message.' }) });

            await convertCodeToCube(code);

            expect(GoogleGenAI).toHaveBeenCalledWith({ apiKey: "test-api-key" });
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            const callArg = mockGenerateContent.mock.calls[0][0];
            expect(callArg.model).toBe("gemini-2.5-flash");
            expect(callArg.contents).toContain(code);
            expect(callArg.config.systemInstruction).toContain('expert at converting code to the 3i-CUBE Protocol');
            expect(callArg.config.responseMimeType).toBe('application/json');
            expect(callArg.config.responseSchema).toBeDefined();
        });

        it('should return formatted CUBE code and metrics', async () => {
            const code = `
                function hello() {
                    console.log("hello"); // a comment
                }
            `;
            const mockResponse = {
                cube_script: 'FUNCTION|DEFINE[hello]→LOG[hello]|COMPLETE',
                analysis: 'Defines and logs a message.'
            };
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockResponse) });

            const { cube_code, metrics } = await convertCodeToCube(code);

            expect(cube_code).toContain('# Converted to 3i-CUBE');
            expect(cube_code).toContain(`# Analysis: ${mockResponse.analysis}`);
            expect(cube_code).toContain(mockResponse.cube_script);
            
            expect(metrics.original_lines).toBe(3);
            expect(metrics.cube_lines).toBe(1);
            expect(metrics.compression_ratio).toBe('3.0:1');
            expect(metrics.savings_percent).toBe(67);
        });

        it('should handle API errors gracefully', async () => {
            mockGenerateContent.mockRejectedValue(new Error('API limit reached'));
            const code = 'some code';

            await expect(convertCodeToCube(code)).rejects.toThrow(
                'AI Conversion Failed: The model could not process the provided code. API limit reached'
            );
        });
    });

    describe('generateCubeFromNaturalLanguage', () => {
        it('should call Gemini API with the correct prompt structure', async () => {
            const description = 'take a picture of cells';
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify({
                cube_script: 'CAPTURE|CELLS|IMAGE',
                analysis: 'Captures an image of cells.',
                estimated_lines_saved: 20
            }) });

            await generateCubeFromNaturalLanguage(description);

            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
            const callArg = mockGenerateContent.mock.calls[0][0];
            expect(callArg.contents).toContain(description);
            expect(callArg.config.systemInstruction).toContain('expert microscopist');
        });

        it('should return formatted CUBE code and estimated metrics', async () => {
            const description = 'take a picture of cells';
            const mockResponse = {
                cube_script: 'CAPTURE|CELLS|IMAGE',
                analysis: 'Captures an image of cells.',
                estimated_lines_saved: 25
            };
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockResponse) });

            const { cube_code, metrics } = await generateCubeFromNaturalLanguage(description);

            expect(cube_code).toContain(`# Analysis: ${mockResponse.analysis}`);
            expect(cube_code).toContain(`# Estimated code lines replaced: 25`);
            expect(cube_code).toContain(mockResponse.cube_script);
            
            expect(metrics.original_lines).toBe(25);
            expect(metrics.cube_lines).toBe(1);
        });
    });
});