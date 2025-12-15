import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, User as UserIcon, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { EXAMPLE_PROJECTS } from '../data/examples';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    window.location.hash = '#signin';
    return null;
  }

  // Use the static assets from our examples to simulate the user's order history
  // ensuring the images are high quality and load instantly.
  const leoBook = EXAMPLE_PROJECTS[0];
  const mayaBook = EXAMPLE_PROJECTS[1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
             <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full overflow-hidden mb-4">
               {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover"/> : <UserIcon className="w-12 h-12 m-6 text-slate-400"/>}
             </div>
             <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
             <p className="text-slate-500 text-sm">{user.email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             
             {/* ADMIN ONLY LINK */}
             {(user.role === 'admin' || user.role === 'dev') && (
               <button onClick={() => window.location.hash = '#admin'} className="w-full text-left px-6 py-4 border-b border-slate-100 font-bold text-slate-700 hover:bg-slate-50 flex items-center bg-slate-50/50">
                  <ShieldCheck size={18} className="mr-3 text-brand-500" /> Mission Control
               </button>
             )}

             <button className="w-full text-left px-6 py-4 border-b border-slate-100 font-medium text-slate-700 hover:bg-slate-50 flex items-center">
                <UserIcon size={18} className="mr-3" /> Personal Info
             </button>
             <button className="w-full text-left px-6 py-4 border-b border-slate-100 font-medium text-slate-700 hover:bg-slate-50 flex items-center">
                <Package size={18} className="mr-3" /> Orders
             </button>
             <button className="w-full text-left px-6 py-4 border-b border-slate-100 font-medium text-slate-700 hover:bg-slate-50 flex items-center">
                <Settings size={18} className="mr-3" /> Settings
             </button>
             <button onClick={logout} className="w-full text-left px-6 py-4 font-medium text-red-600 hover:bg-red-50 flex items-center">
                <LogOut size={18} className="mr-3" /> Sign Out
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Recent Orders</h3>
              
              <div className="space-y-4">
                 <div className="border border-slate-100 rounded-xl p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0 overflow-hidden">
                      <img 
                        src={leoBook.storyPages[0].imageUrl} 
                        alt="Book" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                       <h4 className="font-bold text-slate-900">Leo's Space Adventure</h4>
                       <p className="text-sm text-slate-500">Hardcover • Ordered Oct 24, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Delivered</span>
                 </div>
                 
                 <div className="border border-slate-100 rounded-xl p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0 overflow-hidden">
                      <img 
                        src={mayaBook.storyPages[0].imageUrl} 
                        alt="Book" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                       <h4 className="font-bold text-slate-900">Maya's Magical Forest</h4>
                       <p className="text-sm text-slate-500">Digital Edition • Ordered Nov 02, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Sent</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;