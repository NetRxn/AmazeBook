import React, { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import BookPreview from './pages/BookPreview';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import Examples from './pages/Examples';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import PaymentVerification from './pages/PaymentVerification';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const [route, setRoute] = useState(window.location.hash || '#');
  const { user, flags } = useAuth();

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Verification Guard Logic
  // If user is logged in, and verification is required, and user is not verified:
  // Redirect to #verify-payment, unless they are already there or signing out.
  useEffect(() => {
    if (user && flags.verifiedPaymentRequired && !user.paymentVerified) {
      if (route !== '#verify-payment' && route !== '#signin') {
        window.location.hash = '#verify-payment';
      }
    }
  }, [user, flags.verifiedPaymentRequired, route]);

  const renderContent = () => {
    if (route === '#verify-payment') {
      return <PaymentVerification />;
    }

    switch (route) {
      case '#create':
        return <CreateProject />;
      case '#preview':
        return <BookPreview />;
      case '#pricing':
        return <Pricing />;
      case '#how-it-works':
        return <HowItWorks />;
      case '#examples':
        return <Examples />;
      case '#admin':
        return <Admin />;
      case '#signin':
        return <SignIn />;
      case '#profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;