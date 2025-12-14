export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: 'boy' | 'girl' | 'neutral';
  hairColor: string;
  eyeColor: string;
  photo?: File;
}

export interface Project {
  id: string;
  // Replaced single child fields with characters array
  characters: Character[];
  theme: string;
  customPrompt?: string;
  status: 'DRAFT' | 'UPLOADING' | 'PLANNING_STORY' | 'GENERATING_STORY' | 'GENERATING_IMAGES' | 'COMPLETED' | 'FAILED';
  storyPages: StoryPage[];
  consentGiven: boolean;
  style: 'watercolor' | 'cartoon' | 'storybook_classic' | '3d_render';
}

export enum Theme {
  SPACE = 'Space Adventure',
  UNDERWATER = 'Underwater Explorer',
  FOREST = 'Magical Forest',
  SUPERHERO = 'Superhero Day',
  DINOSAUR = 'Dinosaur Discovery',
  CUSTOM = 'Custom Adventure'
}

export interface User {
  id: string;
  email: string;
  isAuthenticated: boolean;
}