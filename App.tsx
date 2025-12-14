import React, { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import BookPreview from './pages/BookPreview';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import Examples from './pages/Examples';
import { ProjectProvider } from './contexts/ProjectContext';

const App = () => {
  const [route, setRoute] = useState(window.location.hash || '#');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
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
      default:
        return <Home />;
    }
  };

  return (
    <ProjectProvider>
      <Layout>
        {renderContent()}
      </Layout>
    </ProjectProvider>
  );
};

export default App;