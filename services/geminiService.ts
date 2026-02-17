
import { GoogleGenAI } from "@google/genai";

export async function editRamadanImage(base64Image: string, prompt: string, mimeType: string): Promise<string | null> {
  // Always use a new GoogleGenAI instance with the direct process.env.API_KEY reference.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Please edit this Ramadan memory photo based on this request: ${prompt}. If the request is about adding filters, decorative elements like lanterns, crescent moons, or enhancing the colors for a spiritual feel, do it artistically.`,
          },
        ],
      },
    });

    // Iterate through all response parts to find the generated image data.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    return null;
  }
}
