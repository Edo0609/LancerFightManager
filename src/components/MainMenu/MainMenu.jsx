import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Popup from '../Popup/Popup';
import './MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();
  const [currentLogo, setCurrentLogo] = useState('/Logo Dark Theme.png');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowPopup(true);
      localStorage.setItem('hasVisited', 'true');
    }

    // Initial theme check
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentLogo(theme === 'dark' ? '/Logo Dark Theme.png' : '/Logo Light Theme.png');
    };

    // Check theme on mount
    checkTheme();

    // Create observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    // Start observing theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  const handleNewGame = () => {
    navigate('/game');
  };

  const handleLoadGame = () => {
    // TODO: Implement load game functionality
    console.log('Load game clicked');
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log('Settings clicked');
  };

  const handleInformation = () => {
    // TODO: Implement information functionality
    console.log('Information clicked');
  };

  return (
    <div className="main-menu">
      <Header />
      <div className="main-menu-content">
        <div className="logo-container">
          <img src={currentLogo} alt="Lancer Fight Manager Logo" className="main-logo" />
        </div>
        <div className="menu-options">
          <button className="menu-button" onClick={handleNewGame}>New Session</button>
          <button className="menu-button" onClick={handleLoadGame}>Load Session</button>
          <button className="menu-button" onClick={handleSettings}>Settings</button>
          <button className="menu-button" onClick={handleInformation}>Info and Credits</button>
        </div>
      </div>
      <Footer />
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default MainMenu; 