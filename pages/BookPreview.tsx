import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { ChevronLeft, ChevronRight, ShoppingCart, Download, RefreshCw } from 'lucide-react';

const BookPreview = () => {
  const { project } = useProject();
  const [currentPage, setCurrentPage] = useState(0);

  if (project.status !== 'COMPLETED') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <p className="text-slate-500">No book generated yet. <a href="#create" className="text-brand-500 underline">Start here</a>.</p>
      </div>
    );
  }

  const pages = project.storyPages;
  const currentContent = pages[currentPage];
  const title = project.characters.map(c => c.name).join(' & ') + "'s Adventure";

  const handleFlip = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(c => c + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(c => c - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Your Preview</h1>
          <p className="text-slate-500">{title}</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
            <Download size={18} className="mr-2"/> Digital Only ($9.99)
          </button>
          <button className="flex items-center px-6 py-2 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 shadow-lg">
            <ShoppingCart size={18} className="mr-2"/> Order Hardcover ($29.99)
          </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="relative bg-slate-800 p-4 md:p-8 rounded-3xl shadow-2xl">
        <div className="bg-[#fdfbf7] aspect-[3/2] rounded-r-xl rounded-l-md shadow-inner flex overflow-hidden">
           
           {/* Left Page (Text) */}
           <div className="w-1/2 p-8 md:p-16 flex flex-col justify-center border-r border-slate-200 relative">
             <div className="absolute top-8 left-8 text-slate-300 text-4xl font-display opacity-20">
               {currentContent.pageNumber}
             </div>
             <p className="font-serif text-lg md:text-2xl leading-relaxed text-slate-800">
               {currentContent.text}
             </p>
           </div>

           {/* Right Page (Image) */}
           <div className="w-1/2 bg-slate-100 relative overflow-hidden group">
             {currentContent.imageUrl ? (
               <img 
                 src={currentContent.imageUrl} 
                 alt={currentContent.imagePrompt}
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400">
                 Generating...
               </div>
             )}
             
             {/* Hover Action for Regen */}
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white/90 p-2 rounded-full shadow-md text-slate-700 hover:text-brand-500" title="Regenerate this image">
                  <RefreshCw size={20} />
                </button>
             </div>
           </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-0 -ml-4 md:-ml-6">
          <button 
            onClick={() => handleFlip('prev')}
            disabled={currentPage === 0}
            className="bg-white p-3 rounded-full shadow-lg text-slate-800 disabled:opacity-50 hover:scale-110 transition"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 -mr-4 md:-mr-6">
          <button 
            onClick={() => handleFlip('next')}
            disabled={currentPage === pages.length - 1}
            className="bg-white p-3 rounded-full shadow-lg text-slate-800 disabled:opacity-50 hover:scale-110 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        Page {currentPage + 1} of {pages.length}
      </div>
    </div>
  );
};

export default BookPreview;