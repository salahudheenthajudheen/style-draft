import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

type Page = 'landing' | 'login';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState<Page>('landing');

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="login-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="background-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="loading-state">
          <div className="loader-ring"></div>
          <p>Loading Style Draft...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show the dashboard
  if (user) {
    const displayName = user.email?.split('@')[0] || 'Designer';
    return (
      <Dashboard
        username={displayName}
        onLogout={() => { }} // signOut handled inside Dashboard via useAuth
      />
    );
  }

  // If not authenticated, show landing or login
  switch (currentPage) {
    case 'login':
      return <LoginPage onLogin={() => { }} />;
    case 'landing':
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
