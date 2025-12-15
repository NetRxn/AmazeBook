import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Smartphone, Chrome, Shield, Code } from 'lucide-react';

const SignIn = () => {
  const { login, loginWithGoogle, verifyMfa, flags, user } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // REACTIVE REDIRECT: Only redirect when 'user' state is actually populated.
  // This prevents the race condition where we redirect to Profile before the app knows we are logged in.
  useEffect(() => {
    if (user) {
      window.location.hash = '#profile';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (step === 'credentials') {
      await login(email);
      // NOTE: We do not redirect here manually anymore. 
      // We wait for the useEffect above to trigger.
      
      if (flags.mfa) {
        setStep('mfa');
      }
    } else {
      const success = await verifyMfa(mfaCode);
      if (!success) {
        setError('Invalid code. Try 123456');
        setLoading(false);
      }
      // If success, verifyMfa updates user, triggering the useEffect redirect.
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    await login(demoEmail);
    // Redirect happens automatically via useEffect
  };

  const handleGoogleLogin = async () => {
      setLoading(true);
      await loginWithGoogle();
      if (flags.mfa) {
          setStep('mfa');
      }
      // Redirect happens automatically via useEffect
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your stories</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 'credentials' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="password" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="••••••••" />
                 </div>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 flex items-start text-sm">
                 <Smartphone className="shrink-0 mr-3 mt-0.5" size={18} />
                 We sent a verification code to your device. (Hint: 123456)
              </div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full text-center text-2xl tracking-widest py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="000000"
                maxLength={6}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 'credentials' ? 'Sign In' : 'Verify'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-8 border-t border-slate-100">
           <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Demo Access</p>
           <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleDemoLogin('admin@amazebook.club')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition"
              >
                <Shield size={14} className="mr-2" /> Admin
              </button>
              <button 
                type="button"
                onClick={() => handleDemoLogin('dev@amazebook.club')}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition"
              >
                <Code size={14} className="mr-2" /> Developer
              </button>
           </div>
        </div>

        {step === 'credentials' && flags.googleAuth && (
            <>
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or continue with</span></div>
                </div>
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center"
                >
                    <Chrome className="mr-2 text-slate-600" size={20} /> Google
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default SignIn;