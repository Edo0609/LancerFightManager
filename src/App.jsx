import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth/Auth';
import GameView from './components/GameView/GameView';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      {currentUser ? <GameView /> : <Auth />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
