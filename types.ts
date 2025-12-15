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
  characters: Character[];
  theme: string;
  customPrompt?: string;
  
  // Book Metadata
  title?: string;
  dedication?: string;
  
  // Assets
  coverImagePrompt?: string;
  coverImageUrl?: string;
  
  status: 'DRAFT' | 'UPLOADING' | 'PLANNING_STORY' | 'GENERATING_STORY' | 'GENERATING_IMAGES' | 'COMPLETED' | 'FAILED';
  storyPages: StoryPage[];
  consentGiven: boolean;
  style: 'watercolor' | 'cartoon' | 'storybook_classic' | '3d_render';
  
  // Commerce
  isPurchased: boolean;
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
  name: string;
  email: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | 'dev';
  paymentVerified: boolean;
}

export interface FeatureFlags {
  googleAuth: boolean;
  mfa: boolean;
  stripePayment: boolean;
  verifiedPaymentRequired: boolean;
}