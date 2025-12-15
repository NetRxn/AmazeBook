import React, { useState, useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { Theme, Character } from '../types';
import { Camera, Check, AlertCircle, Loader2, Plus, Trash2, User, Heart } from 'lucide-react';

const steps = ['Characters', 'Photos', 'Theme & Style', 'Review'];

const CreateProject = () => {
  const { 
    project, 
    updateProject, 
    addCharacter, 
    updateCharacter, 
    removeCharacter, 
    startGeneration, 
    isLoading, 
    error 
  } = useProject();
  const [currentStep, setCurrentStep] = useState(0);

  // Pre-populate dedication when entering Review step if empty
  useEffect(() => {
    if (currentStep === 3 && !project.dedication) {
      const names = project.characters.map(c => c.name).filter(Boolean).join(' and ');
      if (names) {
        updateProject({ dedication: `For ${names}, the bravest adventurer${project.characters.length > 1 ? 's' : ''} I know.` });
      }
    }
  }, [currentStep, project.characters, project.dedication]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleGenerate = async () => {
    await startGeneration();
    if (project.status !== 'FAILED') {
      window.location.hash = '#preview';
    }
  };

  const isGenerating = isLoading || project.status === 'PLANNING_STORY' || project.status === 'GENERATING_STORY' || project.status === 'GENERATING_IMAGES';

  if (isGenerating) {
    let statusText = "Initializing...";
    let subText = "Preparing your adventure...";
    let progress = 10;

    if (project.status === 'PLANNING_STORY') {
      statusText = "Architecting the Plot...";
      subText = "Our AI Editor is creating the title and narrative arc.";
      progress = 30;
    } else if (project.status === 'GENERATING_STORY') {
      statusText = "Writing the Book...";
      subText = "Our AI Author is drafting prose while the Art Director designs the scenes.";
      progress = 60;
    } else if (project.status === 'GENERATING_IMAGES') {
      statusText = "Painting Illustrations...";
      subText = "Generating publication-quality artwork for cover and pages.";
      progress = 90;
    }

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-8 relative">
           <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 animate-pulse">
          {statusText}
        </h2>
        <p className="text-slate-500 max-w-md text-center">
          {subText}
        </p>
        <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-brand-500 animate-progress transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                idx <= currentStep 
                  ? 'bg-brand-500 border-brand-500 text-white' 
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
                idx <= currentStep ? 'text-brand-600' : 'text-slate-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-[20px] left-0 w-full h-1 bg-slate-100 -z-0"></div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <AlertCircle className="shrink-0 mr-3 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Steps Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* STEP 1: Characters */}
        {currentStep === 0 && (
          <div className="p-8 md:p-12 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Cast of Characters</h2>
            <p className="text-slate-500 mb-8">Who are the heroes of this story? Add physical details to help us illustrate them.</p>
            
            <div className="space-y-8">
              {project.characters.map((char, idx) => (
                <div key={char.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center">
                       <User size={18} className="mr-2 text-brand-500"/>
                       Character {idx + 1}
                     </h3>
                     {project.characters.length > 1 && (
                       <button onClick={() => removeCharacter(idx)} className="text-red-400 hover:text-red-600">
                         <Trash2 size={18} />
                       </button>
                     )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={char.name}
                        onChange={(e) => updateCharacter(idx, { name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                        placeholder="e.g. Jack"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Age</label>
                      <input 
                        type="number" 
                        value={char.age}
                        onChange={(e) => updateCharacter(idx, { age: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Gender</label>
                      <select 
                        value={char.gender}
                        onChange={(e) => updateCharacter(idx, { gender: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                      >
                        <option value="boy">Boy</option>
                        <option value="girl">Girl</option>
                        <option value="neutral">Neutral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hair Color & Style</label>
                      <input 
                        type="text" 
                        value={char.hairColor}
                        onChange={(e) => updateCharacter(idx, { hairColor: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                        placeholder="e.g. Curly Brown"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Eye Color</label>
                      <input 
                        type="text" 
                        value={char.eyeColor}
                        onChange={(e) => updateCharacter(idx, { eyeColor: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                        placeholder="e.g. Blue"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addCharacter}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-brand-500 hover:text-brand-500 transition-colors flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" /> Add Another Character
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Upload */}
        {currentStep === 1 && (
          <div className="p-8 md:p-12 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Character Photos</h2>
            <p className="text-slate-500 mb-8">Upload a clear photo for each character to use as reference.</p>

            <div className="grid md:grid-cols-2 gap-8">
              {project.characters.map((char, idx) => (
                <div key={char.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-4">{char.name || `Character ${idx + 1}`}</h3>
                   
                   <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer relative h-48 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                           updateCharacter(idx, { photo: e.target.files[0] });
                        }
                      }}
                    />
                    {char.photo ? (
                      <div className="text-green-600 flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                           <Check size={24} />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[150px]">{char.photo.name}</span>
                        <span className="text-xs text-green-500 mt-1">Click to change</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <Camera size={32} className="mb-2" />
                        <span className="text-sm font-medium">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2 text-xs text-slate-500">
                     <span className="px-2 py-1 bg-slate-200 rounded">{char.hairColor} Hair</span>
                     <span className="px-2 py-1 bg-slate-200 rounded">{char.eyeColor} Eyes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Theme & Style */}
        {currentStep === 2 && (
          <div className="p-8 md:p-12 animate-fade-in">
             <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Theme & Style</h2>
             <p className="text-slate-500 mb-8">Set the scene for the adventure.</p>

             <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase text-slate-500 mb-3">Story Theme</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.values(Theme).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateProject({ theme })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          project.theme === theme 
                            ? 'border-brand-500 bg-brand-50 text-brand-700' 
                            : 'border-slate-100 hover:border-brand-200 text-slate-600'
                        }`}
                      >
                        <span className="block font-bold text-sm">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold uppercase text-slate-500 mb-3">Art Style</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'watercolor', label: 'Watercolor' },
                        { id: 'cartoon', label: 'Cartoon' },
                        { id: 'storybook_classic', label: 'Classic' },
                        { id: '3d_render', label: '3D Render' }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateProject({ style: style.id as any })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            project.style === style.id
                              ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200' 
                              : 'border-slate-200 hover:border-brand-200'
                          }`}
                        >
                          <span className="font-bold text-slate-900">{style.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-500 mb-2">
                    Custom Story Details <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    value={project.customPrompt || ''}
                    onChange={(e) => updateProject({ customPrompt: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900 h-24 resize-none"
                    placeholder="e.g. They find a hidden map inside a hollow tree..."
                  />
                </div>
             </div>
          </div>
        )}

        {/* STEP 4: Review & Consent */}
        {currentStep === 3 && (
          <div className="p-8 md:p-12 animate-fade-in">
             <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Final Review</h2>
             <p className="text-slate-500 mb-8">Please confirm details and provide consent.</p>

             <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                <div className="mb-6">
                   <h4 className="font-bold text-slate-900 mb-2">Characters</h4>
                   <ul className="space-y-1 text-sm text-slate-600">
                     {project.characters.map((c, i) => (
                       <li key={i}>• {c.name} ({c.age}, {c.hairColor} hair) {c.photo ? '✅ Photo' : '⚠️ No Photo'}</li>
                     ))}
                   </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-slate-500 block">Theme</span>
                    <span className="font-semibold text-slate-900">{project.theme}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Style</span>
                    <span className="font-semibold capitalize text-slate-900">{project.style}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-sm font-bold uppercase text-brand-600 mb-2 flex items-center">
                    <Heart size={14} className="mr-1 fill-brand-600" /> Dedication
                  </label>
                  <textarea
                    value={project.dedication || ''}
                    onChange={(e) => updateProject({ dedication: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 outline-none bg-brand-50 text-slate-900 h-20 resize-none text-sm font-serif italic"
                    placeholder="For [Name], with love..."
                  />
                </div>

                {project.customPrompt && (
                  <div className="pt-4 border-t border-slate-200 mt-4">
                     <span className="text-slate-500 block text-sm">Custom Request</span>
                     <p className="text-slate-900 text-sm italic mt-1">"{project.customPrompt}"</p>
                  </div>
                )}
             </div>

             <div className="space-y-4 border-t border-slate-100 pt-6">
                <label className="flex items-start cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={project.consentGiven}
                      onChange={(e) => updateProject({ consentGiven: e.target.checked })}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-brand-500 checked:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    />
                    <Check className="pointer-events-none absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <div className="ml-3 text-sm text-slate-600">
                    <span className="font-bold text-slate-800">Parental Consent</span> <br/>
                    I represent that I am the parent or legal guardian of the child(ren) depicted. I consent to Amazebook.club using photos solely for generating this storybook.
                  </div>
                </label>
             </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Back
          </button>

          {currentStep === steps.length - 1 ? (
             <button 
             onClick={handleGenerate}
             disabled={!project.consentGiven || project.characters.length === 0}
             className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
           >
             Generate Magic ✨
           </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;