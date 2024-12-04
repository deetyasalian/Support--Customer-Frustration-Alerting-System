import OpenAIApi from "openai";

export async function openai_api(event: any) {
  let OPENAI_API_KEY;
  OPENAI_API_KEY = event.input_data.keyrings.open_ai;

  // Initialize the OpenAI API client using the API key
  const openai = new OpenAIApi({
    apiKey: OPENAI_API_KEY,
  });
  return openai;
}
