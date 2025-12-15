import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { Project, Theme, Character, StoryPage } from '../types';
import { generateStoryOutline, generateStoryFromOutline } from '../services/geminiService';
import { generateFluxImage } from '../services/fluxService';
import { jsPDF } from "jspdf";
import { EXAMPLE_PROJECTS } from '../data/examples';

interface ProjectContextType {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  updateProject: (updates: Partial<Project>) => void;
  addCharacter: () => void;
  updateCharacter: (index: number, updates: Partial<Character>) => void;
  removeCharacter: (index: number) => void;
  startGeneration: () => Promise<void>;
  purchaseBook: () => void;
  downloadBook: () => Promise<void>;
  saveAsExample: () => Promise<void>;
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
  style: 'watercolor',
  isPurchased: false
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

  const purchaseBook = () => {
    setProject(prev => ({ ...prev, isPurchased: true }));
  };

  const downloadBook = async () => {
    if (project.status !== 'COMPLETED') return;
    
    try {
      // Basic PDF Generation using jsPDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [200, 200] // Square book format
      });

      // Cover
      if (project.coverImageUrl) {
        doc.addImage(project.coverImageUrl, 'JPEG', 0, 0, 200, 200);
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(project.title || "My Adventure", 100, 180, { align: "center" });
      }

      // Title Page
      doc.addPage();
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text(project.title || "My Adventure", 100, 80, { align: "center" });
      doc.setFontSize(12);
      doc.text(project.dedication || "A special story.", 100, 100, { align: "center" });

      // Story Pages
      for (const page of project.storyPages) {
        doc.addPage();
        if (page.imageUrl) {
          // Image on left (simulated by splitting spread, or just full page image)
          // For PDF, let's put image top, text bottom
          doc.addImage(page.imageUrl, 'JPEG', 10, 10, 180, 120);
        }
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(page.text, 180);
        doc.text(splitText, 10, 140);
        doc.text(`- ${page.pageNumber} -`, 100, 190, { align: "center" });
      }

      doc.save(`${project.title?.replace(/\s+/g, '_')}_Book.pdf`);

    } catch (e) {
      console.error("Download failed", e);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const saveAsExample = async () => {
    const newExample: Project = { 
      ...project, 
      id: `ex_${Date.now()}`,
      isPurchased: true 
    };
    
    // Add to in-memory list (immediate feedback)
    EXAMPLE_PROJECTS.unshift(newExample);
    
    // Persist to LocalStorage for future sessions
    try {
      const stored = localStorage.getItem('amazebook_saved_examples');
      const existing: Project[] = stored ? JSON.parse(stored) : [];
      const updated = [newExample, ...existing];
      localStorage.setItem('amazebook_saved_examples', JSON.stringify(updated));
      console.log("Saved to local storage:", newExample.title);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }

    // Simulate delay
    await new Promise(r => setTimeout(r, 500));
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
      // Step 1: Planning (Outline + Title + Cover Prompt)
      updateProject({ status: 'PLANNING_STORY' });
      const { outline, title, coverPrompt } = await generateStoryOutline(
        project.characters,
        project.theme,
        project.customPrompt
      );

      // Save metadata immediately
      updateProject({ title, coverImagePrompt: coverPrompt });

      // Step 2: Writing & Art Direction
      updateProject({ status: 'GENERATING_STORY' });
      const pages = await generateStoryFromOutline(
        outline,
        project.characters,
        project.style
      );

      // Step 3: Illustration (Story + Cover)
      updateProject({ storyPages: pages, status: 'GENERATING_IMAGES' });

      // Generate Cover first
      const coverUrl = await generateFluxImage(coverPrompt + `, ${project.style} style book cover, high quality`);
      updateProject({ coverImageUrl: coverUrl });

      // Process pages in batches to avoid Rate Limiting which causes generic backup images to appear
      let processedPages = [...pages]; // Clone array
      const batchSize = 3;

      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);
        
        // Process batch in parallel
        const batchResults = await Promise.all(batch.map(async (page) => {
          const imageUrl = await generateFluxImage(page.imagePrompt);
          return { ...page, imageUrl };
        }));

        // Update local array
        for (let j = 0; j < batchResults.length; j++) {
           processedPages[i + j] = batchResults[j];
        }

        // Update state progressively so user sees progress
        updateProject({ storyPages: [...processedPages] });
      }

      updateProject({ 
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
      purchaseBook,
      downloadBook,
      saveAsExample,
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