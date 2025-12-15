import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types';
import { EXAMPLE_PROJECTS } from '../data/examples';

const Examples = () => {
  const { setProject } = useProject();

  const handleExampleClick = (exampleProject: Project) => {
    setProject(exampleProject);
    window.location.hash = '#preview';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Library of Adventures
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Click on any book to read the full story. These stories are pre-generated examples using our production AI pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMPLE_PROJECTS.map((ex, idx) => (
            <div 
              key={idx} 
              onClick={() => handleExampleClick(ex)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-square overflow-hidden bg-slate-200 relative">
                <img 
                  src={ex.storyPages[0].imageUrl} 
                  alt={ex.title || "Story Book"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6 pt-20">
                   <h3 className="text-white font-display font-bold text-xl">{ex.title || `${ex.characters[0].name}'s Adventure`}</h3>
                   <div className="flex items-center justify-between mt-2">
                      <span className="text-white/90 text-sm bg-white/20 px-2 py-1 rounded backdrop-blur-sm capitalize">{ex.style}</span>
                      <span className="text-brand-300 text-xs font-bold uppercase tracking-wider">Read Now &rarr;</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
             <p className="text-slate-500 mb-6">Inspired? Create a unique story for your child.</p>
             <button 
                onClick={() => window.location.hash = '#create'}
                className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 shadow-lg transition-all"
              >
                Create a Book Now
              </button>
        </div>
      </div>
    </div>
  );
};

export default Examples;