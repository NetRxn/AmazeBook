import React from 'react';
import { ArrowRight, Star, Shield, Wand2, BookOpen } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

const Home = () => {
  const { updateProject } = useProject();

  const handleStart = () => {
    // Reset project state for new flow
    updateProject({ status: 'DRAFT' });
    window.location.hash = '#create';
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-brand-50 to-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-magic-500/10 text-magic-600 font-medium text-sm mb-8 animate-fade-in-up">
            <Star size={16} className="mr-2 fill-current" />
            Voted #1 Gift for Kids in 2024
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight mb-8">
            Make your child the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-magic-500">
              hero of the story.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Upload a photo, pick a theme, and watch as AI weaves a personalized 
            illustrated adventure book delivered to your door.
          </p>
          
          <button 
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-500 font-display rounded-full hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Create Your Book
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Wand2 size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">AI Magic</h3>
              <p className="text-slate-600">
                Our Flux & Gemini engines create consistent characters that look just like your child in every scene.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Safe & Private</h3>
              <p className="text-slate-600">
                Bank-level encryption. Photos are isolated and used ONLY for your book, never for training.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Premium Print</h3>
              <p className="text-slate-600">
                Archival-quality paper and binding. Available in Hardcover and Softcover. Digital included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;