import React, { PropsWithChildren, useState, useRef, useEffect } from 'react';
import { BookOpen, User as UserIcon, Menu, LogOut, Package, X, ShieldCheck } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const { project } = useProject();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = hash;
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
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
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" onClick={navigate('#how-it-works')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">How it Works</a>
              <a href="#pricing" onClick={navigate('#pricing')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Pricing</a>
              <a href="#examples" onClick={navigate('#examples')} className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Examples</a>
            </div>

            <div className="flex items-center space-x-4">
              {project.status === 'COMPLETED' && (
                 <button 
                 onClick={() => window.location.hash = '#preview'}
                 className="hidden md:block px-4 py-2 bg-brand-500 text-white rounded-full text-sm font-semibold hover:bg-brand-600 transition shadow-md mr-2">
                 Resume Book
               </button>
              )}

              {/* Desktop User Menu */}
              <div className="hidden md:block">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center text-slate-700 hover:text-slate-900 focus:outline-none"
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                          <UserIcon size={18} />
                        </div>
                      )}
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-fade-in-up origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        
                        {(user.role === 'admin' || user.role === 'dev') && (
                          <a href="#admin" onClick={navigate('#admin')} className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center bg-slate-50/50">
                            <ShieldCheck size={16} className="mr-2 text-brand-600" /> Admin Console
                          </a>
                        )}

                        <a href="#profile" onClick={navigate('#profile')} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                          <UserIcon size={16} className="mr-2 text-slate-400" /> Profile
                        </a>
                        <a href="#profile" onClick={navigate('#profile')} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                          <Package size={16} className="mr-2 text-slate-400" /> Orders
                        </a>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                          <LogOut size={16} className="mr-2" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => window.location.hash = '#signin'}
                    className="text-slate-600 hover:text-brand-600 font-medium text-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button 
                className="md:hidden text-slate-500 hover:text-slate-800 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl animate-fade-in-down z-40">
            <div className="px-4 py-6 space-y-4">
              <a href="#how-it-works" onClick={navigate('#how-it-works')} className="block text-lg font-medium text-slate-700 hover:text-brand-600">How it Works</a>
              <a href="#pricing" onClick={navigate('#pricing')} className="block text-lg font-medium text-slate-700 hover:text-brand-600">Pricing</a>
              <a href="#examples" onClick={navigate('#examples')} className="block text-lg font-medium text-slate-700 hover:text-brand-600">Examples</a>
              <div className="border-t border-slate-100 pt-4">
                {user ? (
                   <>
                    <div className="flex items-center mb-4 px-2">
                       {user.avatarUrl && <img src={user.avatarUrl} className="w-8 h-8 rounded-full mr-3"/>}
                       <div>
                         <p className="font-bold text-slate-900">{user.name}</p>
                         <p className="text-xs text-slate-500">{user.email}</p>
                       </div>
                    </div>
                    
                    {(user.role === 'admin' || user.role === 'dev') && (
                      <a href="#admin" onClick={navigate('#admin')} className="block py-2 font-bold text-brand-600 hover:text-brand-700 flex items-center">
                        <ShieldCheck size={18} className="mr-2"/> Mission Control
                      </a>
                    )}

                    <a href="#profile" onClick={navigate('#profile')} className="block py-2 text-slate-600 hover:text-brand-600">My Profile</a>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-600">Sign Out</button>
                   </>
                ) : (
                   <button 
                     onClick={() => { window.location.hash = '#signin'; setIsMobileMenuOpen(false); }}
                     className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600"
                   >
                     Sign In
                   </button>
                )}
              </div>
            </div>
          </div>
        )}
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
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Amazebook Club. All rights reserved.</div>
          {(user?.role === 'admin' || user?.role === 'dev') && (
            <a href="#admin" onClick={navigate('#admin')} className="text-slate-600 hover:text-slate-400 transition-colors font-mono">
              [Admin Console]
            </a>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;