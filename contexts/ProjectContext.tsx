import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { Project, Theme, Character } from '../types';
import { generateStoryOutline, generateStoryFromOutline } from '../services/geminiService';
import { generateFluxImage } from '../services/fluxService';

interface ProjectContextType {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  updateProject: (updates: Partial<Project>) => void;
  addCharacter: () => void;
  updateCharacter: (index: number, updates: Partial<Character>) => void;
  removeCharacter: (index: number) => void;
  startGeneration: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const defaultCharacter: Character = {
  id: '1',
  name: '',
  age: 5,
  gender: 'neutral',
  hairColor: 'brown',
  eyeColor: 'brown'
};

const defaultProject: Project = {
  id: '',
  characters: [{ ...defaultCharacter }],
  theme: Theme.SPACE,
  status: 'DRAFT',
  storyPages: [],
  consentGiven: false,
  style: 'watercolor'
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: PropsWithChildren<{}>) => {
  const [project, setProject] = useState<Project>(defaultProject);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const addCharacter = () => {
    setProject(prev => ({
      ...prev,
      characters: [
        ...prev.characters,
        { ...defaultCharacter, id: Math.random().toString(36).substr(2, 9) }
      ]
    }));
  };

  const updateCharacter = (index: number, updates: Partial<Character>) => {
    setProject(prev => {
      const newChars = [...prev.characters];
      newChars[index] = { ...newChars[index], ...updates };
      return { ...prev, characters: newChars };
    });
  };

  const removeCharacter = (index: number) => {
    setProject(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }));
  };

  const startGeneration = async () => {
    if (!project.consentGiven) {
      setError("Parental consent is required to proceed.");
      return;
    }

    if (project.characters.length === 0 || !project.characters[0].name) {
      setError("Please add at least one character details.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Planning
      updateProject({ status: 'PLANNING_STORY' });
      const outline = await generateStoryOutline(
        project.characters,
        project.theme,
        project.customPrompt
      );

      // Step 2: Writing & Art Direction
      updateProject({ status: 'GENERATING_STORY' });
      const pages = await generateStoryFromOutline(
        outline,
        project.characters,
        project.style
      );

      // Step 3: Illustration
      updateProject({ storyPages: pages, status: 'GENERATING_IMAGES' });

      // Parallelize image generation
      // In a real app with rate limits, we might want to batch these (e.g. 3 at a time)
      const imagePromises = pages.map(async (page) => {
        // The page.imagePrompt is now very detailed from the "Art Director" persona
        const imageUrl = await generateFluxImage(page.imagePrompt);
        return { ...page, imageUrl };
      });

      const pagesWithImages = await Promise.all(imagePromises);

      updateProject({ 
        storyPages: pagesWithImages, 
        status: 'COMPLETED' 
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
      updateProject({ status: 'FAILED' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      project, 
      setProject, 
      updateProject, 
      addCharacter, 
      updateCharacter, 
      removeCharacter,
      startGeneration, 
      isLoading, 
      error 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within ProjectProvider");
  return context;
};