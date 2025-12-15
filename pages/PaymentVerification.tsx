import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { simulateStripeVerification } from '../services/stripeService';

const PaymentVerification = () => {
  const { user, verifyUserPayment } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await simulateStripeVerification(cardNumber.replace(/\s/g, ''));
      setSuccess(true);
      setTimeout(() => {
        verifyUserPayment();
        window.location.hash = '#profile';
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    window.location.hash = '#signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShieldCheck size={32} className="text-brand-400" />
          </div>
          <h1 className="text-2xl font-display font-bold">Verify Your Account</h1>
          <p className="text-slate-400 text-sm mt-2">To prevent platform abuse, we require a valid payment method to access creation tools.</p>
        </div>

        {/* Form */}
        <div className="p-8">
           {success ? (
             <div className="text-center py-8 animate-fade-in">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                 <CheckCircle size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Verified!</h3>
               <p className="text-slate-500">Redirecting you to your dashboard...</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl flex items-start text-sm text-blue-800 border border-blue-100">
                   <Lock size={16} className="shrink-0 mr-2 mt-0.5" />
                   We will verify your card with a temporary $0.00 hold. You will not be charged.
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Card Number</label>
                   <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Expiry</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">CVC</label>
                    <input 
                      type="text" 
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-center"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 shadow-lg disabled:opacity-50 transition flex items-center justify-center"
                >
                  {loading ? 'Verifying...' : 'Verify Card'}
                </button>
             </form>
           )}
           
           <div className="mt-6 text-center">
             <p className="text-xs text-slate-400 flex items-center justify-center">
               <Lock size={12} className="mr-1" />
               Secure Payment Processing by Stripe
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;