import React from 'react';
import { Camera, Wand2, Truck, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  // Pre-generated static assets using Flux/Pollinations to match the app's aesthetic
  const steps = [
    {
      icon: <Camera size={32} />,
      title: "1. Upload a Photo",
      desc: "We use this to create a consistent illustrated character that looks just like them.",
      color: "bg-blue-100 text-blue-600",
      image: "https://image.pollinations.ai/prompt/3d%20render%20cute%20cartoon%20style%2C%20a%20modern%20smartphone%20standing%20upright%20in%20portrait%20mode%20displaying%20a%20photo%20of%20a%20happy%20cute%20child%20on%20screen%2C%20no%20hands%2C%20simple%20clean%20composition%2C%20soft%20studio%20lighting%2C%20pastel%20colors%2C%20minimalist%20background?width=800&height=600&nologo=true&seed=777"
    },
    {
      icon: <Wand2 size={32} />,
      title: "2. Choose a Theme",
      desc: "Select an adventure! Space, Underwater, Dinosaurs, or type your own custom idea. Our Gemini AI writes a unique story while Flux AI paints the illustrations.",
      color: "bg-purple-100 text-purple-600",
      image: "https://image.pollinations.ai/prompt/3d%20render%20cute%20cartoon%20style%2C%20open%20storybook%20glowing%20with%20magic%2C%20planets%20and%20dinosaurs%20popping%20out%20of%20pages%2C%20sparkles%2C%20wonder%2C%20magical%20atmosphere?width=800&height=600&nologo=true&seed=102"
    },
    {
      icon: <Truck size={32} />,
      title: "3. Order & Enjoy",
      desc: "Preview the entire book online. If you love it, order a hardcover copy or download the digital version instantly. Printed books arrive in 5-7 days.",
      color: "bg-green-100 text-green-600",
      image: "https://image.pollinations.ai/prompt/3d%20render%20cute%20cartoon%20style%2C%20happy%20child%20sitting%20cross%20legged%20holding%20a%20beautiful%20hardcover%20book%20with%20their%20face%20on%20the%20cover%2C%20cozy%20bedroom%2C%20warm%20light?width=800&height=600&nologo=true&seed=103"
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
              <div className="flex-1 w-full">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform transition-transform hover:scale-[1.02] duration-500 bg-slate-50">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-auto object-cover aspect-[4/3]"
                    loading="lazy"
                  />
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