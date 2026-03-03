import React from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

type Page = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('landing');
  const [username, setUsername] = React.useState<string>('');

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = (name: string) => {
    setUsername(name);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUsername('');
    setCurrentPage('login');
  };

  switch (currentPage) {
    case 'landing':
      return <LandingPage onGetStarted={handleGetStarted} />;
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    case 'dashboard':
      return <Dashboard username={username} onLogout={handleLogout} />;
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}
