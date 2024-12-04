/**
 * Analyzes the sentiment of the provided text using GPT-4 API.
 * @param text - The input text to analyze.
 * @returns Promise<{ score: number; emotion: string }> - Sentiment score (-1 to +1) and emotion detected.
 */
export declare function analyzeSentiment(text: string): Promise<{
    score: number;
    emotion: string;
}>;
export declare function analyzeData(conversations: {
    id: string;
    text: string;
    score: number;
    emotion: string;
}[]): Promise<string | null>;
