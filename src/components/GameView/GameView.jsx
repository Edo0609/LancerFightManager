import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameTopBar from '../GameTopBar/GameTopBar';
import MechList from '../MechList/MechList';
import Auth from '../Auth/Auth';
import './GameView.css';

const GameView = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('Current Session');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleBack = () => {
    navigate('/');
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

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
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
        onAuthClick={handleAuthClick}
      />
      <div className="game-content">
        <MechList />
      </div>
      <Auth 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default GameView; 