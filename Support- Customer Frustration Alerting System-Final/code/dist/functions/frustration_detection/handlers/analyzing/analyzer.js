"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeData = exports.analyzeSentiment = void 0;
const openai_1 = require("../../api/openai");
/**
 * Analyzes the sentiment of the provided text using GPT-4 API.
 * @param text - The input text to analyze.
 * @returns Promise<{ score: number; emotion: string }> - Sentiment score (-1 to +1) and emotion detected.
 */
function analyzeSentiment(text, event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const openai = yield (0, openai_1.openai_api)(event);
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: `
            Analyze the sentiment of the following text and respond in JSON format.
            Provide a "score" (ranging from -1 to 1)
            and an "emotion" (like "happy", "angry", "frustrated", "neutral" and other).
            Text: "${text}"
            `,
                    },
                ],
            });
            // Parse the JSON response from GPT-4
            const content = ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "{}";
            const sentiment = JSON.parse(content);
            return {
                score: sentiment.score || 0,
                emotion: sentiment.emotion || "neutral",
            };
        }
        catch (error) {
            console.error("Error in sentiment analysis:", error);
            // Default fallback in case of error
            return {
                score: 0,
                emotion: "neutral",
            };
        }
    });
}
exports.analyzeSentiment = analyzeSentiment;
function analyzeData(conversations, event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const openai = yield (0, openai_1.openai_api)(event);
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that analyzes sentiment data.",
                    },
                    {
                        role: "user",
                        content: `Analyze the following conversation data. Provide a summary of sentiment trends, emotion distribution, and highlight interesting insights. Also tell if there are any common cause for the frustration: ${JSON.stringify(conversations, null, 2)}`,
                    },
                ],
                max_tokens: 1500,
            });
            const messageContent = (_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            return messageContent;
        }
        catch (error) {
            console.error("Error analyzing data:", error);
            throw error;
        }
    });
}
exports.analyzeData = analyzeData;
