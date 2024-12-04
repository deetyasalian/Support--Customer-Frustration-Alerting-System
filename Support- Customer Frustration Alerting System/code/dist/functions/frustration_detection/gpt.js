"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeData = exports.analyzeSentiment = void 0;
const openai_1 = __importDefault(require("openai")); // Importing OpenAIApi directly
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Initialize OpenAI API client
let OPENAI_API_KEY;
//if (process.env.open_ai_key != undefined) {
OPENAI_API_KEY = process.env.open_ai_key; // Replace with your actual API key
//}
// Initialize the OpenAI API client using the API key
const openai = new openai_1.default({
    apiKey: OPENAI_API_KEY,
});
/**
 * Analyzes the sentiment of the provided text using GPT-4 API.
 * @param text - The input text to analyze.
 * @returns Promise<{ score: number; emotion: string }> - Sentiment score (-1 to +1) and emotion detected.
 */
function analyzeSentiment(text) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
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
function analyzeData(conversations) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
