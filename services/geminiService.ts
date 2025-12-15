import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { StoryPage, Character } from "../types";
import { getSystemPrompt, getConfigNumber, PROMPT_KEYS } from "./promptService";

const API_KEY = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

const storySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      pageNumber: { type: Type.INTEGER },
      text: { type: Type.STRING, description: "The story text for this page." },
      imagePrompt: { type: Type.STRING, description: "The highly detailed prompt for the image generator." }
    },
    required: ["pageNumber", "text", "imagePrompt"]
  }
};

const outlineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bookTitle: { type: Type.STRING, description: "A catchy, creative title for the book." },
    coverImageDescription: { type: Type.STRING, description: "A detailed description for the front cover image art." },
    plotOutline: { type: Type.STRING, description: "The numbered list of plot beats." }
  },
  required: ["bookTitle", "coverImageDescription", "plotOutline"]
};

// Helper to get safety settings based on admin config
const getSafetySettings = () => {
  const level = getSystemPrompt(PROMPT_KEYS.GEMINI_SAFETY);
  let threshold = HarmBlockThreshold.BLOCK_ONLY_HIGH;

  switch (level) {
    case 'BLOCK_NONE': threshold = HarmBlockThreshold.BLOCK_NONE; break;
    case 'BLOCK_LOW_AND_ABOVE': threshold = HarmBlockThreshold.BLOCK_LOW_AND_ABOVE; break;
    case 'BLOCK_MEDIUM_AND_ABOVE': threshold = HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE; break;
    case 'BLOCK_ONLY_HIGH': threshold = HarmBlockThreshold.BLOCK_ONLY_HIGH; break;
  }

  return [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold },
  ];
};

/**
 * STEP 1: THE EDITOR
 * Creates a high-level outline + Title + Cover Concept
 */
export const generateStoryOutline = async (
  characters: Character[],
  theme: string,
  customPrompt?: string
): Promise<{ outline: string; title: string; coverPrompt: string }> => {
  if (!API_KEY) return { 
    outline: "Mock Outline", 
    title: "The Mock Adventure", 
    coverPrompt: "A generic book cover" 
  };

  // Pass full details so the Editor knows what they look like for the Cover Prompt
  const characterDetails = characters.map(c => 
    `${c.name} (${c.age}yr old ${c.gender}, ${c.hairColor} hair, ${c.eyeColor} eyes)`
  ).join('; ');

  const request = customPrompt || 'Create an engaging adventure.';
  
  // Get dynamic prompt
  let promptTemplate = getSystemPrompt(PROMPT_KEYS.EDITOR);
  
  // Inject variables
  const prompt = promptTemplate
    .replace('{{CHARACTERS}}', characterDetails)
    .replace('{{THEME}}', theme)
    .replace('{{REQUEST}}', request);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: outlineSchema,
        temperature: getConfigNumber(PROMPT_KEYS.GEMINI_TEMP),
        topP: getConfigNumber(PROMPT_KEYS.GEMINI_TOP_P),
        safetySettings: getSafetySettings()
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    return {
      outline: data.plotOutline || '',
      title: data.bookTitle || `${characters[0].name}'s Adventure`,
      coverPrompt: data.coverImageDescription || `A book cover featuring ${characterDetails}`
    };
  } catch (error) {
    console.error("Outline Gen Error:", error);
    throw error;
  }
};

/**
 * STEP 2: THE STUDIO (Author + Art Director)
 * Executes the book based on the outline using separated personas.
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

  // Retrieve separate prompts
  const authorPrompt = getSystemPrompt(PROMPT_KEYS.AUTHOR);
  let artDirectorPrompt = getSystemPrompt(PROMPT_KEYS.ART_DIRECTOR);
  
  // Inject Style into Art Director prompt immediately
  artDirectorPrompt = artDirectorPrompt.replace(/{{STYLE}}/g, style);

  // Construct the Master Prompt
  const masterPrompt = `
    TASK: Generate the full content for the 12-page book based on the provided Outline.
    
    INPUT CONTEXT:
    [THE OUTLINE]: 
    ${outline}

    [CHARACTER BIBLE]:
    ${charBible}

    ---

    [PERSONA 1: THE AUTHOR]
    ${authorPrompt}

    ---

    [PERSONA 2: THE ART DIRECTOR]
    ${artDirectorPrompt}

    ---

    OUTPUT:
    Generate a JSON Array of 12 pages matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: masterPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: getConfigNumber(PROMPT_KEYS.GEMINI_TEMP),
        topP: getConfigNumber(PROMPT_KEYS.GEMINI_TOP_P),
        safetySettings: getSafetySettings()
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

  // Append user-defined style suffix for better quality
  const styleSuffix = getSystemPrompt(PROMPT_KEYS.IMAGE_STYLE_SUFFIX);
  const finalPrompt = `${prompt}, ${styleSuffix}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: finalPrompt }]
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
  const names = characters.map(c => c.name).join(' and ');
  return Array.from({ length: 12 }).map((_, i) => ({
    pageNumber: i + 1,
    text: `Page ${i + 1}: ${names} continued their ${theme} adventure with great excitement.`,
    imagePrompt: `Illustration of ${names} in a ${theme} setting, page ${i + 1}.`
  }));
}