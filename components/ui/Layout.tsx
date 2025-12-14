import React, { PropsWithChildren } from 'react';
import { BookOpen, User, Menu } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const { project } = useProject();

  const navigate = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.hash = '#'}>
              <div className="bg-gradient-to-br from-brand-500 to-magic-500 text-white p-2 rounded-lg shadow-lg">
                <BookOpen size={24} />
              </div>
              <span className="ml-3 text-2xl font-display font-bold text-slate-800 tracking-tight">
                amazebook<span className="text-brand-500">.club</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" onClick={navigate('#how-it-works')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">How it Works</a>
              <a href="#pricing" onClick={navigate('#pricing')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Pricing</a>
              <a href="#examples" onClick={navigate('#examples')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Examples</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-slate-500 hover:text-slate-800">
                <User size={24} />
              </button>
              <button className="md:hidden text-slate-500">
                <Menu size={24} />
              </button>
              {project.status === 'COMPLETED' && (
                 <button 
                 onClick={() => window.location.hash = '#preview'}
                 className="hidden md:block px-4 py-2 bg-brand-500 text-white rounded-full text-sm font-semibold hover:bg-brand-600 transition shadow-md">
                 Resume Book
               </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <span className="text-xl font-display font-bold text-white">amazebook.club</span>
            <p className="mt-4 text-sm text-slate-400">
              Turning your little ones into the heroes of their own magical stories. 
              Secure, private, and powered by AI.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#pricing" onClick={navigate('#pricing')} className="hover:text-white transition">Hardcover Books</a></li>
              <li><a href="#pricing" onClick={navigate('#pricing')} className="hover:text-white transition">Digital Downloads</a></li>
              <li><a href="#" className="hover:text-white transition">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Biometric Notice (TX)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@amazebook.club</li>
              <li>1-800-AMAZE-ME</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Amazebook Club. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;