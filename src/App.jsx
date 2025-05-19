import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth/Auth';
import GameView from './components/GameView/GameView';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu/MainMenu';
import './styles/global.css';

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<GameView onAuthClick={handleAuthClick} />} />
        </Routes>
        <Auth
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
