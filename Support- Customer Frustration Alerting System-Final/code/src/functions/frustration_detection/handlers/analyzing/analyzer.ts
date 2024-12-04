import { openai_api } from "../../api/openai";

/**
 * Analyzes the sentiment of the provided text using GPT-4 API.
 * @param text - The input text to analyze.
 * @returns Promise<{ score: number; emotion: string }> - Sentiment score (-1 to +1) and emotion detected.
 */
export async function analyzeSentiment(
  text: string,
  event: any
): Promise<{ score: number; emotion: string }> {
  const openai = await openai_api(event);
  try {
    const response = await openai.chat.completions.create({
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
    const content = response.choices[0]?.message?.content || "{}";
    const sentiment = JSON.parse(content);

    return {
      score: sentiment.score || 0,
      emotion: sentiment.emotion || "neutral",
    };
  } catch (error) {
    console.error("Error in sentiment analysis:", error);

    // Default fallback in case of error
    return {
      score: 0,
      emotion: "neutral",
    };
  }
}

export async function analyzeData(
  conversations: { id: string; text: string; score: number; emotion: string }[],
  event: any
) {
  const openai = await openai_api(event);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes sentiment data.",
        },
        {
          role: "user",
          content: `Analyze the following conversation data. Provide a summary of sentiment trends, emotion distribution, and highlight interesting insights. Also tell if there are any common cause for the frustration: ${JSON.stringify(
            conversations,
            null,
            2
          )}`,
        },
      ], // Pass the messages array instead of a prompt
      max_tokens: 1500,
    });

    const messageContent = response.choices[0].message?.content;
    return messageContent;
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw error;
  }
}
