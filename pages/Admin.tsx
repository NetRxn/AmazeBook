import React, { useState, useEffect } from 'react';
import { getSystemPrompt, saveSystemPrompt, resetPrompts, PROMPT_KEYS } from '../services/promptService';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save, RotateCcw, Activity, Users, Book, DollarSign, 
  ToggleLeft, ToggleRight, Lock, Sliders, Image as ImageIcon, 
  Zap, AlertTriangle, Terminal, BarChart2, ShieldCheck, 
  RefreshCw, TrendingUp, PenTool, Palette, CreditCard
} from 'lucide-react';

const Admin = () => {
  const { user, flags, updateFlag } = useAuth();
  
  // Prompt States
  const [editorPrompt, setEditorPrompt] = useState('');
  const [authorPrompt, setAuthorPrompt] = useState('');
  const [artDirectorPrompt, setArtDirectorPrompt] = useState('');
  
  // Tunable States
  const [geminiTemp, setGeminiTemp] = useState('');
  const [geminiTopP, setGeminiTopP] = useState('');
  const [geminiSafety, setGeminiSafety] = useState('');
  const [imageSuffix, setImageSuffix] = useState('');
  const [fluxGuidance, setFluxGuidance] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'prompts' | 'tuning' | 'features'>('dashboard');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Moved useEffect above the early return to comply with Rules of Hooks
  useEffect(() => {
    // Load all values
    setEditorPrompt(getSystemPrompt(PROMPT_KEYS.EDITOR));
    setAuthorPrompt(getSystemPrompt(PROMPT_KEYS.AUTHOR));
    setArtDirectorPrompt(getSystemPrompt(PROMPT_KEYS.ART_DIRECTOR));
    
    setGeminiTemp(getSystemPrompt(PROMPT_KEYS.GEMINI_TEMP));
    setGeminiTopP(getSystemPrompt(PROMPT_KEYS.GEMINI_TOP_P));
    setGeminiSafety(getSystemPrompt(PROMPT_KEYS.GEMINI_SAFETY));
    setImageSuffix(getSystemPrompt(PROMPT_KEYS.IMAGE_STYLE_SUFFIX));
    setFluxGuidance(getSystemPrompt(PROMPT_KEYS.FLUX_GUIDANCE));
  }, []);

  // Access Control
  if (!user || (user.role !== 'admin' && user.role !== 'dev')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col">
        <Lock size={64} className="text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
        <p className="text-slate-500 mt-2">You do not have permission to view the Mission Control.</p>
        <button onClick={() => window.location.hash = '#'} className="mt-6 text-brand-500 hover:underline">Return Home</button>
      </div>
    );
  }

  const handleSave = () => {
    saveSystemPrompt(PROMPT_KEYS.EDITOR, editorPrompt);
    saveSystemPrompt(PROMPT_KEYS.AUTHOR, authorPrompt);
    saveSystemPrompt(PROMPT_KEYS.ART_DIRECTOR, artDirectorPrompt);
    
    saveSystemPrompt(PROMPT_KEYS.GEMINI_TEMP, geminiTemp);
    saveSystemPrompt(PROMPT_KEYS.GEMINI_TOP_P, geminiTopP);
    saveSystemPrompt(PROMPT_KEYS.GEMINI_SAFETY, geminiSafety);
    saveSystemPrompt(PROMPT_KEYS.IMAGE_STYLE_SUFFIX, imageSuffix);
    saveSystemPrompt(PROMPT_KEYS.FLUX_GUIDANCE, fluxGuidance);

    setSaveStatus('System Config Updated Successfully');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleReset = () => {
    if (window.confirm('WARNING: This will reset all prompt engineering and model parameters to factory defaults. Continue?')) {
      resetPrompts();
      // Reload defaults
      setEditorPrompt(getSystemPrompt(PROMPT_KEYS.EDITOR));
      setAuthorPrompt(getSystemPrompt(PROMPT_KEYS.AUTHOR));
      setArtDirectorPrompt(getSystemPrompt(PROMPT_KEYS.ART_DIRECTOR));
      
      setGeminiTemp(getSystemPrompt(PROMPT_KEYS.GEMINI_TEMP));
      setGeminiTopP(getSystemPrompt(PROMPT_KEYS.GEMINI_TOP_P));
      setGeminiSafety(getSystemPrompt(PROMPT_KEYS.GEMINI_SAFETY));
      setImageSuffix(getSystemPrompt(PROMPT_KEYS.IMAGE_STYLE_SUFFIX));
      setFluxGuidance(getSystemPrompt(PROMPT_KEYS.FLUX_GUIDANCE));

      setSaveStatus('Factory Defaults Restored');
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-center md:h-16 py-3 md:py-0">
              <div className="flex items-center mb-3 md:mb-0 shrink-0">
                 <div className="bg-slate-900 text-white p-2 rounded mr-3">
                   <Terminal size={20} />
                 </div>
                 <div>
                   <h1 className="font-display font-bold text-slate-900 text-lg leading-tight">Mission Control</h1>
                   <p className="text-xs text-slate-500 font-mono">env: production | role: {user.role}</p>
                 </div>
              </div>

              {/* Scrollable Nav for Mobile */}
              <div className="flex space-x-1 overflow-x-auto no-scrollbar md:ml-auto w-full md:w-auto pb-1 md:pb-0">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Activity },
                  { id: 'prompts', label: 'Prompts', icon: Terminal },
                  { id: 'tuning', label: 'Tuning', icon: Sliders },
                  { id: 'features', label: 'Features', icon: Lock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap shrink-0 ${
                      activeTab === tab.id 
                        ? 'bg-slate-100 text-slate-900' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Book className="text-blue-600" />} title="Books Generated" value="1,284" change="+12%" trend="up" />
              <StatCard icon={<ImageIcon className="text-purple-600" />} title="Images Created" value="15,408" change="+85%" trend="up" />
              <StatCard icon={<Zap className="text-yellow-600" />} title="API Cost (Est)" value="$42.50" change="-$5.20" trend="down" subtitle="Last 30 days" />
              <StatCard icon={<Activity className="text-green-600" />} title="Avg Generation" value="48s" change="-12%" trend="down" subtitle="Latency improved" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 flex items-center"><BarChart2 size={18} className="mr-2 text-slate-400"/> Story Funnel</h3>
                   <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">LAST 24H</span>
                </div>
                <div className="space-y-4">
                  <FunnelBar label="Visitors" value={1500} total={1500} color="bg-slate-200" />
                  <FunnelBar label="Started Draft" value={850} total={1500} color="bg-blue-200" />
                  <FunnelBar label="Uploaded Photos" value={600} total={1500} color="bg-blue-300" />
                  <FunnelBar label="Generated Story" value={540} total={1500} color="bg-brand-400" />
                  <FunnelBar label="Completed Book" value={535} total={1500} color="bg-brand-500" />
                </div>
                <p className="mt-4 text-xs text-slate-500 text-right">Conversion Rate: <span className="font-bold text-slate-800">35.6%</span></p>
              </div>

              {/* System Health */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center"><ShieldCheck size={18} className="mr-2 text-slate-400"/> System Health</h3>
                <div className="space-y-4">
                   <HealthMetric name="Gemini API" status="Operational" latency="240ms" />
                   <HealthMetric name="Flux Image API" status="Operational" latency="1.2s" />
                   <HealthMetric name="Storage (S3)" status="Operational" latency="45ms" />
                   <HealthMetric name="Database" status="Operational" latency="12ms" />
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Errors</h4>
                   <div className="space-y-2">
                      <div className="text-xs flex justify-between text-red-600 bg-red-50 p-2 rounded">
                        <span>Timeout: Image Gen</span>
                        <span className="font-mono">10m ago</span>
                      </div>
                      <div className="text-xs flex justify-between text-slate-600 bg-slate-50 p-2 rounded">
                        <span>401 Unauthorized</span>
                        <span className="font-mono">1h ago</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs Table - Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Recent Generation Jobs</h3>
                  <button className="text-slate-500 hover:text-brand-500"><RefreshCw size={16} /></button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left whitespace-nowrap">
                   <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                       <th className="px-6 py-3">Job ID</th>
                       <th className="px-6 py-3">User</th>
                       <th className="px-6 py-3">Action</th>
                       <th className="px-6 py-3">Status</th>
                       <th className="px-6 py-3">Cost</th>
                       <th className="px-6 py-3">Time</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {[
                       {id: 'job_832', user: 'parent@gmail.com', action: 'Flux Image Gen (x12)', status: 'Success', cost: '$0.048', time: '2m ago'},
                       {id: 'job_831', user: 'parent@gmail.com', action: 'Gemini Story Gen', status: 'Success', cost: '$0.002', time: '3m ago'},
                       {id: 'job_830', user: 'new_dad@aol.com', action: 'Gemini Outline', status: 'Failed', cost: '$0.000', time: '15m ago'},
                       {id: 'job_829', user: 'mom2024@test.com', action: 'Flux Image Gen (x12)', status: 'Success', cost: '$0.048', time: '22m ago'},
                     ].map((job) => (
                       <tr key={job.id} className="hover:bg-slate-50">
                         <td className="px-6 py-3 font-mono text-slate-400">{job.id}</td>
                         <td className="px-6 py-3 font-medium text-slate-700">{job.user}</td>
                         <td className="px-6 py-3 text-slate-600">{job.action}</td>
                         <td className="px-6 py-3">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                             job.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {job.status}
                           </span>
                         </td>
                         <td className="px-6 py-3 text-slate-600 font-mono">{job.cost}</td>
                         <td className="px-6 py-3 text-slate-400">{job.time}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* --- PROMPTS TAB --- */}
        {activeTab === 'prompts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* 1. EDITOR */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
               <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
                 <div>
                   <h2 className="font-bold text-slate-900 flex items-center"><Terminal size={18} className="mr-2 text-blue-500"/> The Editor</h2>
                   <p className="text-xs text-slate-500">Output: Outline</p>
                 </div>
                 {editorPrompt !== getSystemPrompt(PROMPT_KEYS.EDITOR) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">MODIFIED</span>}
               </div>
               <div className="p-4 flex-grow flex flex-col">
                  <p className="text-xs text-slate-500 mb-2">Structure the narrative arc. Vars: <code>{'{{CHARACTERS}}, {{THEME}}'}</code>.</p>
                  <textarea
                    value={editorPrompt}
                    onChange={(e) => setEditorPrompt(e.target.value)}
                    className="flex-grow w-full p-4 font-mono text-xs leading-relaxed bg-slate-900 text-green-400 rounded-lg outline-none resize-none border border-slate-800 focus:border-blue-500 min-h-[400px]"
                  />
               </div>
            </div>

            {/* 2. AUTHOR */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
               <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
                 <div>
                   <h2 className="font-bold text-slate-900 flex items-center"><PenTool size={18} className="mr-2 text-purple-500"/> The Author</h2>
                   <p className="text-xs text-slate-500">Output: Story Text</p>
                 </div>
                 {authorPrompt !== getSystemPrompt(PROMPT_KEYS.AUTHOR) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">MODIFIED</span>}
               </div>
               <div className="p-4 flex-grow flex flex-col">
                  <p className="text-xs text-slate-500 mb-2">Write the prose. Persona instructions for tone and style.</p>
                  <textarea
                    value={authorPrompt}
                    onChange={(e) => setAuthorPrompt(e.target.value)}
                    className="flex-grow w-full p-4 font-mono text-xs leading-relaxed bg-slate-900 text-green-400 rounded-lg outline-none resize-none border border-slate-800 focus:border-purple-500 min-h-[400px]"
                  />
               </div>
            </div>

            {/* 3. ART DIRECTOR */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
               <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
                 <div>
                   <h2 className="font-bold text-slate-900 flex items-center"><Palette size={18} className="mr-2 text-pink-500"/> Art Director</h2>
                   <p className="text-xs text-slate-500">Output: Image Prompts</p>
                 </div>
                 {artDirectorPrompt !== getSystemPrompt(PROMPT_KEYS.ART_DIRECTOR) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">MODIFIED</span>}
               </div>
               <div className="p-4 flex-grow flex flex-col">
                  <p className="text-xs text-slate-500 mb-2">Generate prompts for Flux. Control lighting, camera, and strict character consistency.</p>
                  <textarea
                    value={artDirectorPrompt}
                    onChange={(e) => setArtDirectorPrompt(e.target.value)}
                    className="flex-grow w-full p-4 font-mono text-xs leading-relaxed bg-slate-900 text-green-400 rounded-lg outline-none resize-none border border-slate-800 focus:border-pink-500 min-h-[400px]"
                  />
               </div>
            </div>
          </div>
        )}

        {/* --- TUNING TAB --- */}
        {activeTab === 'tuning' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center mb-6">
                 <div className="p-2 bg-blue-50 rounded-lg mr-4 text-blue-600"><Zap size={24}/></div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">LLM Parameters (Gemini)</h2>
                    <p className="text-sm text-slate-500">Fine-tune the creativity and safety of the text generation.</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Temperature</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" min="0" max="1" step="0.1" 
                        value={geminiTemp} onChange={(e) => setGeminiTemp(e.target.value)}
                        className="w-full accent-blue-500"
                      />
                      <span className="font-mono font-bold text-slate-900 w-12 text-right">{geminiTemp}</span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Top P</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" min="0" max="1" step="0.05" 
                        value={geminiTopP} onChange={(e) => setGeminiTopP(e.target.value)}
                        className="w-full accent-blue-500"
                      />
                      <span className="font-mono font-bold text-slate-900 w-12 text-right">{geminiTopP}</span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Safety Filter</label>
                    <select 
                      value={geminiSafety}
                      onChange={(e) => setGeminiSafety(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                    >
                      <option value="BLOCK_NONE">No Blocking (Creative)</option>
                      <option value="BLOCK_ONLY_HIGH">Block High Risks Only</option>
                      <option value="BLOCK_MEDIUM_AND_ABOVE">Block Medium & High</option>
                      <option value="BLOCK_LOW_AND_ABOVE">Strict (Kid Safe)</option>
                    </select>
                 </div>
               </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center mb-6">
                 <div className="p-2 bg-purple-50 rounded-lg mr-4 text-purple-600"><ImageIcon size={24}/></div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Image Generation (Flux)</h2>
                    <p className="text-sm text-slate-500">Controls for the visual style and strictness of the BFL Flux model.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Global Style Suffix (Hidden Prompt Injection)
                    </label>
                    <textarea
                      value={imageSuffix}
                      onChange={(e) => setImageSuffix(e.target.value)}
                      className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none h-24 text-sm font-mono text-slate-600"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Guidance Scale</label>
                    <div className="flex items-center gap-4 mb-2">
                      <input 
                        type="range" min="1.5" max="10" step="0.1" 
                        value={fluxGuidance} onChange={(e) => setFluxGuidance(e.target.value)}
                        className="w-full accent-purple-500"
                      />
                      <span className="font-mono font-bold text-slate-900 w-12 text-right">{fluxGuidance}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong>Low (2.0):</strong> More creative/artistic.<br/>
                      <strong>High (5.0+):</strong> Strict prompt adherence.<br/>
                      <em>Recommended: 3.5</em>
                    </p>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* --- FEATURES TAB --- */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-900 mb-6">Feature Flags</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                       <h3 className="font-bold text-slate-900">Google OAuth</h3>
                       <p className="text-sm text-slate-500">Allow users to sign up via Google.</p>
                   </div>
                   <button onClick={() => updateFlag('googleAuth', !flags.googleAuth)} className={`${flags.googleAuth ? 'text-green-600' : 'text-slate-400'}`}>
                     {flags.googleAuth ? <ToggleRight size={40} className="fill-green-100" /> : <ToggleLeft size={40} />}
                   </button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                       <h3 className="font-bold text-slate-900">Force MFA</h3>
                       <p className="text-sm text-slate-500">Require 2-factor auth for all sessions.</p>
                   </div>
                   <button onClick={() => updateFlag('mfa', !flags.mfa)} className={`${flags.mfa ? 'text-green-600' : 'text-slate-400'}`}>
                     {flags.mfa ? <ToggleRight size={40} className="fill-green-100" /> : <ToggleLeft size={40} />}
                   </button>
                 </div>

                 {/* New Payments Flags */}
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                       <h3 className="font-bold text-slate-900 flex items-center">
                         <CreditCard size={16} className="mr-2" /> Stripe Payment
                       </h3>
                       <p className="text-sm text-slate-500">Enable checkout process for printing.</p>
                   </div>
                   <button onClick={() => updateFlag('stripePayment', !flags.stripePayment)} className={`${flags.stripePayment ? 'text-green-600' : 'text-slate-400'}`}>
                     {flags.stripePayment ? <ToggleRight size={40} className="fill-green-100" /> : <ToggleLeft size={40} />}
                   </button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                       <h3 className="font-bold text-slate-900 flex items-center">
                         <ShieldCheck size={16} className="mr-2" /> Verify Payment Method
                       </h3>
                       <p className="text-sm text-slate-500">Gate access until user adds a card.</p>
                   </div>
                   <button onClick={() => updateFlag('verifiedPaymentRequired', !flags.verifiedPaymentRequired)} className={`${flags.verifiedPaymentRequired ? 'text-green-600' : 'text-slate-400'}`}>
                     {flags.verifiedPaymentRequired ? <ToggleRight size={40} className="fill-green-100" /> : <ToggleLeft size={40} />}
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Global Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
              <button onClick={handleReset} className="flex items-center text-red-600 hover:text-red-800 font-bold text-sm">
                <RotateCcw size={16} className="mr-2" /> Restore Factory Defaults
              </button>
              <div className="flex gap-4">
                 <span className="text-slate-400 text-xs flex items-center">{saveStatus && <span className="text-green-600 font-bold mr-4 animate-fade-in">{saveStatus}</span>} Unsaved changes are local only.</span>
                 <button onClick={handleSave} className="flex items-center px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-lg transition">
                   <Save size={18} className="mr-2" /> Deploy Config
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const StatCard = ({ icon, title, value, change, trend, subtitle }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-2">
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change} {trend === 'up' ? <TrendingUp size={12} className="ml-1"/> : <TrendingUp size={12} className="ml-1 rotate-180"/>}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-display font-bold text-slate-900 mt-1">{value}</p>
    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

const FunnelBar = ({ label, value, total, color }: any) => (
  <div className="flex items-center text-sm">
    <div className="w-32 font-medium text-slate-600">{label}</div>
    <div className="flex-grow h-4 bg-slate-100 rounded-full overflow-hidden mx-4 relative group">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${(value / total) * 100}%` }}></div>
      <div className="absolute top-0 right-0 h-full flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-[10px] font-bold text-slate-600">{Math.round((value/total)*100)}%</span>
      </div>
    </div>
    <div className="w-12 text-right font-bold text-slate-800">{value}</div>
  </div>
);

const HealthMetric = ({ name, status, latency }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
    <div className="flex items-center text-xs space-x-4">
      <span className="text-slate-400 font-mono">{latency}</span>
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">{status}</span>
    </div>
  </div>
);

export default Admin;