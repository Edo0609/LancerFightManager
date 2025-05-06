import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Popup from '../Popup/Popup';
import Auth from '../Auth/Auth';
import Notification from '../Notification/Notification';
import './MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [currentLogo, setCurrentLogo] = useState('/Logo Dark Theme.png');
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleNewGame = () => {
    navigate('/game');
  };

  const handleLoadGame = () => {
    // TODO: Implement load game functionality
    showNotification('Load game functionality coming soon!', 'info');
  };

  const handleAuth = async () => {
    if (currentUser) {
      try {
        await logout();
        showNotification('Successfully logged out!', 'success');
      } catch (error) {
        showNotification('Failed to log out. Please try again.', 'error');
        console.error('Failed to log out:', error);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleInformation = () => {
    showNotification('Information and credits coming soon!', 'info');
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
          <button 
            className="menu-button" 
            onClick={handleAuth}
          >
            {currentUser ? 'Logout' : 'Login / Sign Up'}
          </button>
          <button className="menu-button" onClick={handleInformation}>Info and Credits</button>
        </div>
      </div>
      <Footer />
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <Auth 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default MainMenu; 