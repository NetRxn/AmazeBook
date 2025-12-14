import React from 'react';
import { Camera, Wand2, Truck, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Camera size={32} />,
      title: "1. Upload a Photo",
      desc: "Take a quick snap of your child. We use this to analyze their features (hair color, style, smile) to create a consistent illustrated character that looks just like them.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Wand2 size={32} />,
      title: "2. Choose a Theme",
      desc: "Select an adventure! Space, Underwater, Dinosaurs, or type your own custom idea. Our Gemini AI writes a unique story while Flux AI paints the illustrations.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Truck size={32} />,
      title: "3. Order & Enjoy",
      desc: "Preview the entire book online. If you love it, order a hardcover copy or download the digital version instantly. Printed books arrive in 5-7 days.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="bg-white">
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            How the Magic Happens
          </h1>
          <p className="text-xl text-slate-600">
            It takes less than 2 minutes to create a book that will be cherished for years.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-flex p-4 rounded-2xl mb-6 ${step.color}`}>
                  {step.icon}
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{step.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-slate-100 rounded-3xl aspect-[4/3] w-full shadow-inner flex items-center justify-center text-slate-400 font-display text-xl">
                  {/* Placeholder for illustration */}
                  Illustration: {step.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <button 
            onClick={() => window.location.hash = '#create'}
            className="inline-flex items-center px-8 py-4 bg-brand-500 text-white rounded-full text-lg font-bold hover:bg-brand-600 shadow-xl transition-transform hover:-translate-y-1"
          >
            Start Your Story
            <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;