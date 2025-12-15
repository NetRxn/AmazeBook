export const PROMPT_KEYS = {
  EDITOR: 'editor_prompt_v1',
  AUTHOR: 'author_prompt_v1',
  ART_DIRECTOR: 'art_director_prompt_v1',
  // Tunable Parameters
  GEMINI_TEMP: 'gemini_temperature',
  GEMINI_TOP_P: 'gemini_top_p',
  GEMINI_SAFETY: 'gemini_safety_level', // BLOCK_NONE, BLOCK_ONLY_HIGH, etc.
  IMAGE_STYLE_SUFFIX: 'image_style_suffix', // e.g. "high quality, 8k, masterpiece"
  FLUX_GUIDANCE: 'flux_guidance_scale'
};

const DEFAULT_EDITOR_PROMPT = `ROLE: You are the Editor-in-Chief at a prestigious children's book publishing house.
TASK: Create a detailed 12-page outline for a children's picture book AND plan a compelling Front Cover concept.

DETAILS:
- Characters: {{CHARACTERS}}
- Theme: {{THEME}}
- Request: {{REQUEST}}

REQUIREMENTS:
- Structure: Introduction -> Inciting Incident -> Rising Action -> Climax -> Resolution.
- Length: Exactly 12 pages.
- Tone: Heartwarming, adventurous, and safe for kids.
- Cover: Review the cover concept to ensure it matches the book's themes and art style.
- IMPORTANT: The 'coverImageDescription' MUST explicitly include the physical appearance (hair color, eye color, clothes) of the main characters so the artist knows what to draw.

OUTPUT:
Return a simple numbered list (Page 1 to Page 12) describing the plot beat for each page, and a description for the Front Cover. Do not write the full story text yet.`;

const DEFAULT_AUTHOR_PROMPT = `ROLE: You are a Hugo-award winning children's author.

INSTRUCTIONS:
- Write 3-4 engaging sentences per page based on the Outline.
- Tone: Lyrical, sensory-rich, and emotional.
- Avoid generic AI phrases (e.g., 'whimsical', 'tapestry', 'testament'). 
- Show, don't tell.
- Focus on the interaction between characters.
- NEGATIVE CONSTRAINT: Do NOT describe the characters' physical appearance (e.g. 'Jack, a boy with brown hair') in the story text. The illustrations will show this. Use their names only.`;

const DEFAULT_ART_DIRECTOR_PROMPT = `ROLE: You are an expert Art Director for AI Image Generation (specifically Flux/Midjourney).

INSTRUCTIONS:
- You must write the 'imagePrompt' field for every page.
- CONSTRAINT: You MUST explicitly describe the physical appearance of EACH character on EVERY page (Hair color, eye color, clothes). The image generator has no memory of previous pages.
- BAD: "Jack runs."
- GOOD: "Jack, a small boy with curly blonde hair and blue eyes wearing a red t-shirt, running through..."
- Incorporate the style defined below into every prompt.
- Describe lighting, camera angle, and composition.

STYLE: {{STYLE}}`;

// Default Tunables
const DEFAULT_TEMP = "0.7";
const DEFAULT_TOP_P = "0.95";
const DEFAULT_SAFETY = "BLOCK_ONLY_HIGH"; 
const DEFAULT_IMAGE_SUFFIX = "detailed, vibrant colors, high quality, children's book illustration, 8k resolution";
const DEFAULT_FLUX_GUIDANCE = "3.5"; // Standard for Flux

export const getSystemPrompt = (key: string): string => {
  const stored = localStorage.getItem(key);
  if (stored !== null) return stored;
  
  // Return defaults
  switch (key) {
    case PROMPT_KEYS.EDITOR: return DEFAULT_EDITOR_PROMPT;
    case PROMPT_KEYS.AUTHOR: return DEFAULT_AUTHOR_PROMPT;
    case PROMPT_KEYS.ART_DIRECTOR: return DEFAULT_ART_DIRECTOR_PROMPT;
    case PROMPT_KEYS.GEMINI_TEMP: return DEFAULT_TEMP;
    case PROMPT_KEYS.GEMINI_TOP_P: return DEFAULT_TOP_P;
    case PROMPT_KEYS.GEMINI_SAFETY: return DEFAULT_SAFETY;
    case PROMPT_KEYS.IMAGE_STYLE_SUFFIX: return DEFAULT_IMAGE_SUFFIX;
    case PROMPT_KEYS.FLUX_GUIDANCE: return DEFAULT_FLUX_GUIDANCE;
    default: return '';
  }
};

export const saveSystemPrompt = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const resetPrompts = (): void => {
  Object.values(PROMPT_KEYS).forEach(key => localStorage.removeItem(key));
};

// Helper for numeric configs to ensure safety
export const getConfigNumber = (key: string): number => {
  const val = getSystemPrompt(key);
  return parseFloat(val) || (key === PROMPT_KEYS.FLUX_GUIDANCE ? 3.5 : 0.7);
};