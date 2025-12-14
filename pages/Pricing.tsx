import React from 'react';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Digital Edition",
      price: "$9.99",
      description: "Perfect for tablets and reading on the go.",
      features: [
        "High-resolution PDF download",
        "Compatible with iPad, Kindle Fire",
        "Shareable via email",
        "Keep forever"
      ],
      color: "blue",
      cta: "Create Digital Book"
    },
    {
      name: "Hardcover Keepsake",
      price: "$29.99",
      description: "A beautiful 8x8 hardcover book to cherish.",
      features: [
        "Premium hardcover binding",
        "Archival quality paper",
        "Vibrant full-color printing",
        "Includes Digital Edition (Free)",
        "Free shipping in US"
      ],
      color: "brand",
      cta: "Create Hardcover",
      popular: true
    },
    {
      name: "Softcover",
      price: "$19.99",
      description: "Durable and kid-friendly softcover.",
      features: [
        "Glossy cardstock cover",
        "High-quality paper",
        "Lightweight and portable",
        "Includes Digital Edition (Free)"
      ],
      color: "purple",
      cta: "Create Softcover"
    }
  ];

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600">
            Create a memory that lasts a lifetime. No subscriptions, just pay for the books you create.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-transform hover:-translate-y-1 ${
              plan.popular ? 'border-brand-500 ring-4 ring-brand-100' : 'border-slate-100'
            }`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Star size={14} className="mr-1 fill-white" /> Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-display font-bold text-slate-900 mb-2">{plan.price}</div>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-slate-700">
                    <Check size={18} className="text-green-500 mr-2 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.location.hash = '#create'}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  plan.popular 
                    ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Questions?</h3>
          <p className="text-slate-600">
            Contact our support team at <a href="#" className="text-brand-600 font-medium">support@amazebook.club</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;