import React, { useState } from 'react';
import Header from '../Header/Header';
import GameTopBar from '../GameTopBar/GameTopBar';
import './GameView.css';

const GameView = () => {
  const [sessionName, setSessionName] = useState('Current Session');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleBack = () => {
    // TODO: Implement back navigation
    console.log('Back clicked');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save clicked');
  };

  const handleHelp = () => {
    // TODO: Implement help functionality
    console.log('Help clicked');
  };

  const handleSessionNameChange = (newName) => {
    setSessionName(newName);
    // TODO: Implement saving the new session name
    console.log('Session name changed to:', newName);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark');
  };

  return (
    <div className="game-view">
      <GameTopBar 
        sessionName={sessionName}
        onBack={handleBack}
        onSave={handleSave}
        onHelp={handleHelp}
        onSessionNameChange={handleSessionNameChange}
        onThemeToggle={handleThemeToggle}
      />
      <div className="game-content">
        
      </div>
    </div>
  );
};

export default GameView; 