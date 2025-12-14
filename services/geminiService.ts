import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryPage, Character } from "../types";

const API_KEY = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

const storySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      pageNumber: { type: Type.INTEGER },
      text: { type: Type.STRING, description: "The story text for this page. 3-4 sentences." },
      imagePrompt: { type: Type.STRING, description: "A detailed visual description for an AI image generator. MUST include physical descriptions of characters." }
    },
    required: ["pageNumber", "text", "imagePrompt"]
  }
};

/**
 * STEP 1: THE EDITOR
 * Creates a high-level outline to ensure narrative structure.
 */
export const generateStoryOutline = async (
  characters: Character[],
  theme: string,
  customPrompt?: string
): Promise<string> => {
  if (!API_KEY) return "Mock Outline";

  const names = characters.map(c => c.name).join(' and ');
  
  const prompt = `
    ROLE: You are the Editor-in-Chief at a prestigious children's book publishing house.
    TASK: Create a detailed 12-page outline for a children's picture book.
    
    DETAILS:
    - Characters: ${names}
    - Theme: ${theme}
    - Request: ${customPrompt || 'Create an engaging adventure.'}
    
    REQUIREMENTS:
    - Structure: Introduction -> Inciting Incident -> Rising Action -> Climax -> Resolution.
    - Length: Exactly 12 pages.
    - Tone: Heartwarming, adventurous, and safe for kids.
    
    OUTPUT:
    Return a simple numbered list (Page 1 to Page 12) describing the plot beat for each page. Do not write the full story text yet.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error("Outline Gen Error:", error);
    throw error;
  }
};

/**
 * STEP 2: THE AUTHOR & ILLUSTRATOR
 * Executes the book based on the outline.
 */
export const generateStoryFromOutline = async (
  outline: string,
  characters: Character[],
  style: string
): Promise<StoryPage[]> => {
  if (!API_KEY) return mockStoryGeneration(characters, "Mock Theme");

  // Create a "Character Bible" for consistency
  const charBible = characters.map(c => 
    `NAME: ${c.name}
     APPEARANCE: ${c.age}-year-old ${c.gender}, ${c.hairColor} hair, ${c.eyeColor} eyes.`
  ).join('\n');

  const prompt = `
    You are a dual-persona expert:
    1. THE AUTHOR: A Hugo-award winning writer known for lyrical, sensory-rich prose for children.
    2. THE ART DIRECTOR: A visual expert who demands strict character consistency.

    INPUT CONTEXT:
    [THE OUTLINE]: 
    ${outline}

    [CHARACTER BIBLE - FOLLOW STRICTLY]:
    ${charBible}

    [ART STYLE]: ${style}

    TASK:
    Generate the full content for the 12-page book based on the outline.

    CONSTRAINTS:
    - TEXT: Write 3-4 engaging sentences per page. Avoid generic AI phrases (e.g., 'whimsical', 'tapestry', 'testament'). Show, don't tell.
    - IMAGE PROMPTS: You MUST explicitly describe the physical appearance of EACH character on EVERY page. 
      - BAD: "Jack runs."
      - GOOD: "Jack, a small boy with curly blonde hair and blue eyes, running through..."
      - Use the art style (${style}) in the description.
    
    OUTPUT:
    JSON Array of 12 pages matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.7, // Slightly creative
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    return JSON.parse(text) as StoryPage[];
  } catch (error) {
    console.error("Story Gen Error:", error);
    throw error;
  }
};

export const generateBackupImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) return "https://picsum.photos/1024/1024";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: prompt }]
      },
      config: {}
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return "https://picsum.photos/1024/1024"; 
  }
};

const mockStoryGeneration = (characters: Character[], theme: string): StoryPage[] => {
  // Updated mock to return 12 pages for consistency
  const names = characters.map(c => c.name).join(' and ');
  return Array.from({ length: 12 }).map((_, i) => ({
    pageNumber: i + 1,
    text: `Page ${i + 1}: ${names} continued their ${theme} adventure with great excitement.`,
    imagePrompt: `Illustration of ${names} in a ${theme} setting, page ${i + 1}.`
  }));
}