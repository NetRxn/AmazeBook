import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { User, FeatureFlags } from '../types';

interface AuthContextType {
  user: User | null;
  flags: FeatureFlags;
  login: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  verifyMfa: (code: string) => Promise<boolean>;
  logout: () => void;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  verifyUserPayment: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [flags, setFlags] = useState<FeatureFlags>({
    googleAuth: false,
    mfa: false,
    stripePayment: false,
    verifiedPaymentRequired: false
  });

  const login = async (email: string) => {
    // Mock login
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!flags.mfa) {
          let role: 'user' | 'admin' | 'dev' = 'user';
          let name = email.split('@')[0];
          let avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`;
          // Admin & Devs bypass payment verification
          let paymentVerified = false;

          if (email.includes('admin')) {
            role = 'admin';
            name = 'Super Admin';
            avatarUrl = 'https://ui-avatars.com/api/?name=Super+Admin&background=0f172a&color=fff';
            paymentVerified = true;
          } else if (email.includes('dev')) {
            role = 'dev';
            name = 'Developer';
            avatarUrl = 'https://ui-avatars.com/api/?name=Developer&background=8b5cf6&color=fff';
            paymentVerified = true;
          }

          setUser({
            id: '123',
            name,
            email,
            isAuthenticated: true,
            avatarUrl,
            role,
            paymentVerified
          });
        }
        resolve();
      }, 800);
    });
  };

  const loginWithGoogle = async () => {
    if (!flags.googleAuth) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
         // Mock Google User
         if (!flags.mfa) {
           setUser({
            id: 'google_123',
            name: 'Google User',
            email: 'user@gmail.com',
            isAuthenticated: true,
            avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            role: 'user',
            paymentVerified: false
           });
         }
         resolve();
      }, 1000);
    });
  };

  const verifyMfa = async (code: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (code === '123456') {
           setUser({
            id: 'mfa_user',
            name: 'Secure User',
            email: 'secure@example.com',
            isAuthenticated: true,
            avatarUrl: 'https://ui-avatars.com/api/?name=Secure+User&background=8b5cf6&color=fff',
            role: 'user',
            paymentVerified: false
           });
           resolve(true);
        } else {
           resolve(false);
        }
      }, 800);
    });
  };

  const verifyUserPayment = () => {
    if (user) {
      setUser({ ...user, paymentVerified: true });
    }
  };

  const logout = () => {
    setUser(null);
    window.location.hash = '#';
  };

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      flags,
      login,
      loginWithGoogle,
      verifyMfa,
      logout,
      updateFlag,
      verifyUserPayment,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};