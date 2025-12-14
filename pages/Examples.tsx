import React from 'react';

const Examples = () => {
  const examples = [
    {
      title: "Leo in Space",
      style: "Cartoon",
      image: "https://picsum.photos/seed/space/600/600"
    },
    {
      title: "Maya's Forest Friends",
      style: "Watercolor",
      image: "https://picsum.photos/seed/forest/600/600"
    },
    {
      title: "Sam the Superhero",
      style: "Comic",
      image: "https://picsum.photos/seed/hero/600/600"
    },
    {
      title: "Olivia Under the Sea",
      style: "Storybook Classic",
      image: "https://picsum.photos/seed/sea/600/600"
    },
    {
      title: "Noah's Dino Dig",
      style: "3D Render",
      image: "https://picsum.photos/seed/dino/600/600"
    },
    {
      title: "Zara's Magic Castle",
      style: "Watercolor",
      image: "https://picsum.photos/seed/castle/600/600"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Library of Adventures
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See what other parents are creating. Every book is unique, just like every child.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((ex, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="aspect-square overflow-hidden bg-slate-200 relative">
                <img 
                  src={ex.image} 
                  alt={ex.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                   <h3 className="text-white font-display font-bold text-xl">{ex.title}</h3>
                   <p className="text-white/80 text-sm">{ex.style} Style</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
             <p className="text-slate-500 mb-6">Ready to make your own?</p>
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