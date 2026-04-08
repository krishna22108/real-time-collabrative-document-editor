import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following document content in a concise way, highlighting key takeaways: \n\n${content}`,
      config: {
        systemInstruction: "You are a helpful AI assistant integrated into a document editor. Provide professional and concise summaries.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate summary. Please check your API key.";
  }
}
