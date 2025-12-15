import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { processStripePayment } from '../services/stripeService';
import { ChevronLeft, ChevronRight, ShoppingCart, Download, RefreshCw, Loader2, CheckCircle, Save, BookOpen } from 'lucide-react';

const BookPreview = () => {
  const { project, purchaseBook, downloadBook, saveAsExample, updateProject } = useProject();
  const { user, flags } = useAuth();
  const [currentPage, setCurrentPage] = useState(-1); // Start at Cover
  const [processing, setProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [savingExample, setSavingExample] = useState(false);
  const [editingDedication, setEditingDedication] = useState(false);
  const [tempDedication, setTempDedication] = useState('');

  if (project.status !== 'COMPLETED') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <p className="text-slate-500">No book generated yet. <a href="#create" className="text-brand-500 underline">Start here</a>.</p>
      </div>
    );
  }

  // Define Page Structure
  // Index -1: Front Cover
  // Index -2: Title Page / Dedication
  // Index 0 to N: Story Pages
  // Index N+1: Back Cover
  const pages = project.storyPages;
  const totalPages = pages.length;
  
  const canDownload = () => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'dev') return true;
    // User must have purchased OR payment isn't required by flag
    if (!flags.stripePayment) return true; 
    return project.isPurchased;
  };

  const handleFlip = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentPage < totalPages + 1) setCurrentPage(c => c + 1);
    } else {
      if (currentPage > -1) setCurrentPage(c => c - 1);
    }
  };

  const handleOrder = async (type: 'digital' | 'hardcover') => {
    if (!user) {
      window.location.hash = '#signin';
      return;
    }

    setProcessing(true);
    setOrderStatus('idle');

    try {
      const price = type === 'digital' ? 9.99 : 29.99;
      
      if (flags.stripePayment) {
        const result = await processStripePayment(price);
        if (!result.success) throw new Error(result.error);
      }
      
      purchaseBook();
      setOrderStatus('success');
      setTimeout(() => setOrderStatus('idle'), 3000);
      
      if (type === 'digital') {
        await downloadBook();
      }

    } catch (e: any) {
      console.error(e);
      alert("Payment failed: " + e.message);
      setOrderStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    setProcessing(true);
    await downloadBook();
    setProcessing(false);
  };

  const handleSaveExample = async () => {
    setSavingExample(true);
    await saveAsExample();
    setSavingExample(false);
    // Redirect to examples page to show it in the first position
    window.location.hash = '#examples';
  };

  const renderPageContent = () => {
    // 1. FRONT COVER
    if (currentPage === -1) {
      return (
        <div className="w-full h-full relative overflow-hidden bg-[#fdfbf7] flex items-center justify-center">
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
          ) : (
             <div className="text-slate-800 text-center p-8">
                <h1 className="text-4xl font-display font-bold mb-4">{project.title}</h1>
                <p className="text-xl opacity-75">By Amazebook AI</p>
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30 flex flex-col justify-between p-8 text-center border-8 border-[#fdfbf7]/10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-lg mt-8">{project.title}</h1>
            <p className="text-white/90 font-display font-bold text-lg mb-8 drop-shadow-md bg-black/20 inline-block mx-auto px-4 py-1 rounded-full backdrop-blur-sm">
               An Adventure with {project.characters.map(c => c.name).join(' & ')}
            </p>
          </div>
        </div>
      );
    }

    // 2. TITLE PAGE & DEDICATION
    if (currentPage === 0) {
      return (
        <div className="w-full h-full bg-[#fdfbf7] p-12 flex flex-col items-center justify-center text-center border-l border-slate-200">
           <div className="mb-12">
             <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{project.title}</h1>
             <p className="text-slate-500 uppercase tracking-widest text-sm">Written & Illustrated by AI</p>
           </div>
           
           <div className="max-w-md w-full">
             <div className="w-16 h-1 bg-slate-300 mx-auto mb-8"></div>
             {editingDedication ? (
               <div className="flex flex-col gap-2">
                 <textarea 
                   value={tempDedication}
                   onChange={(e) => setTempDedication(e.target.value)}
                   className="w-full p-3 border border-slate-300 rounded text-center font-serif italic bg-white"
                   spellCheck={true}
                 />
                 <button 
                   onClick={() => { updateProject({ dedication: tempDedication }); setEditingDedication(false); }}
                   className="px-4 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-700"
                 >
                   Save Dedication
                 </button>
               </div>
             ) : (
               <div 
                 onClick={() => { setTempDedication(project.dedication || ''); setEditingDedication(true); }}
                 className="font-serif italic text-slate-700 text-lg cursor-pointer hover:text-brand-600 transition p-4 border border-transparent hover:border-slate-100 rounded"
                 title="Click to edit"
               >
                 "{project.dedication}"
               </div>
             )}
           </div>
        </div>
      );
    }

    if (currentPage === totalPages + 1) {
       // Back Cover
       return (
         <div className="w-full h-full bg-brand-900 p-12 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <BookOpen size={64} className="mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">The End</h2>
            <p className="max-w-sm text-brand-100 mb-8">
              We hope you enjoyed this magical adventure featuring {project.characters.map(c => c.name).join(', ')}.
            </p>
            <div className="text-xs opacity-50 font-mono">
              Generated by Amazebook.club
            </div>
         </div>
       );
    }

    // Story Pages (Indices 1 to N)
    // We map UI index 1 to Array index 0
    const storyIndex = currentPage - 1;
    const pageContent = project.storyPages[storyIndex];

    return (
      <div className="w-full h-full bg-[#fdfbf7] flex overflow-hidden">
        {/* Left Page (Text) */}
        <div className="w-1/2 p-8 md:p-12 flex flex-col justify-center border-r border-slate-200 relative">
             <div className="absolute top-8 left-8 text-slate-300 text-4xl font-display opacity-20">
               {pageContent.pageNumber}
             </div>
             <p className="font-serif text-lg md:text-xl leading-relaxed text-slate-800">
               {pageContent.text}
             </p>
        </div>
        {/* Right Page (Image) */}
        <div className="w-1/2 bg-slate-100 relative overflow-hidden group">
             {pageContent.imageUrl ? (
               <img 
                 src={pageContent.imageUrl} 
                 alt={pageContent.imagePrompt}
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400">
                 Generating...
               </div>
             )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Your Preview</h1>
          <p className="text-slate-500">{project.title}</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          
          {/* Admin Tools */}
          {(user?.role === 'admin' || user?.role === 'dev') && (
            <button 
              onClick={handleSaveExample}
              disabled={savingExample}
              className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200"
            >
              {savingExample ? <Loader2 className="animate-spin mr-2" size={18}/> : <Save size={18} className="mr-2"/>}
              Save Example
            </button>
          )}

          {/* Download Button */}
          {canDownload() ? (
            <button 
              onClick={handleDownload}
              disabled={processing}
              className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
            >
               {processing ? <Loader2 className="animate-spin mr-2" size={18}/> : <Download size={18} className="mr-2"/>} 
               Download PDF
            </button>
          ) : (
             <div className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-400 font-medium cursor-not-allowed bg-slate-50" title="Purchase to unlock">
                <Download size={18} className="mr-2"/> Download Locked
             </div>
          )}

          {/* Order Buttons */}
          {orderStatus === 'success' ? (
            <div className="flex items-center px-6 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
               <CheckCircle size={18} className="mr-2"/> Order Placed!
            </div>
          ) : (
            <>
               {!project.isPurchased && (
                  <button 
                  onClick={() => handleOrder('hardcover')}
                  disabled={processing}
                  className="flex items-center px-6 py-2 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 shadow-lg disabled:opacity-50"
                >
                  {processing ? <Loader2 className="animate-spin mr-2" size={18}/> : <ShoppingCart size={18} className="mr-2"/>}
                  Buy Hardcover ($29.99)
                </button>
               )}
               {project.isPurchased && (
                 <span className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold border border-blue-100">
                    <CheckCircle size={16} className="mr-2" /> Owned
                 </span>
               )}
            </>
          )}
        </div>
      </div>

      {/* Book Container */}
      <div className="relative bg-slate-800 p-4 md:p-8 rounded-3xl shadow-2xl">
        <div className="bg-[#fdfbf7] aspect-[3/2] rounded-r-xl rounded-l-md shadow-inner flex overflow-hidden">
           {renderPageContent()}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-0 -ml-4 md:-ml-6 z-10">
          <button 
            onClick={() => handleFlip('prev')}
            disabled={currentPage === -1}
            className="bg-white p-3 rounded-full shadow-lg text-slate-800 disabled:opacity-50 hover:scale-110 transition"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 -mr-4 md:-mr-6 z-10">
          <button 
            onClick={() => handleFlip('next')}
            disabled={currentPage === totalPages + 1}
            className="bg-white p-3 rounded-full shadow-lg text-slate-800 disabled:opacity-50 hover:scale-110 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm font-mono">
        {currentPage === -1 ? "Front Cover" : 
         currentPage === 0 ? "Title Page" :
         currentPage === totalPages + 1 ? "Back Cover" :
         `Page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  );
};

export default BookPreview;