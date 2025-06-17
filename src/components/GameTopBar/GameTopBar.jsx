import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../Notification/Notification';
import LogoutConfirmation from '../LogoutConfirmation/LogoutConfirmation';
import SaveSlotsPopup from '../SaveSlotsPopup/SaveSlotsPopup';
import './GameTopBar.css';

const GameTopBar = ({ 
  sessionName: initialSessionName, 
  onBack, 
  onSave, 
  onHelp, 
  onSessionNameChange,
  onThemeToggle,
  onAuthClick,
  mechs,
  onLoadSession
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionName, setSessionName] = useState(initialSessionName || 'New Session');
  const [notification, setNotification] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    setSessionName(initialSessionName || 'New Session');
  }, [initialSessionName]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleNameChange = (e) => {
    setSessionName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onSessionNameChange?.(sessionName);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSessionNameChange?.(sessionName);
  };

  const handleAuthClick = () => {
    if (currentUser) {
      setShowLogoutConfirmation(true);
    } else {
      onAuthClick?.();
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setNotification({
        message: 'Successfully logged out!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to log out. Please try again.',
        type: 'error'
      });
      console.error('Failed to log out:', error);
    }
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleSaveClick = () => {
    setShowSaveSlots(true);
  };

  const handleSaveSlotsClose = (action) => {
    setShowSaveSlots(false);
    if (action === 'login') {
      onAuthClick?.();
    }
  };

  return (
    <div className="top-bar">
      <button className="top-bar-button back-button" onClick={onBack}>
        ← Back
      </button>
      
      <div className="top-bar-session-name-container">
        {isEditing ? (
          <input
            type="text"
            className="top-bar-session-name-input"
            value={sessionName}
            onChange={handleNameChange}
            onKeyDown={handleNameSubmit}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div className="top-bar-session-name">
            {sessionName}
          </div>
        )}
        <button 
          className="top-bar-edit-button" 
          onClick={handleEditToggle}
          title={isEditing ? "Save" : "Edit session name"}
        >
          {isEditing ? "✓" : "✎"}
        </button>
      </div>
      
      <div className="top-bar-right">
        <button className="top-bar-button top-bar-theme-toggle" onClick={onThemeToggle}>
          Theme
        </button>
        <button 
          className="top-bar-button" 
          onClick={handleAuthClick}
          title={currentUser ? 'Logout' : 'Login/Sign Up'}
        >
          {currentUser ? 'Logout' : 'Login/Sign Up'}
        </button>
        <button className="top-bar-button save-button" onClick={handleSaveClick}>
          Save/Load
        </button>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {showLogoutConfirmation && (
        <LogoutConfirmation
          userEmail={currentUser.email}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
      <SaveSlotsPopup
        isOpen={showSaveSlots}
        onClose={handleSaveSlotsClose}
        sessionName={sessionName}
        mechs={mechs}
        onLoadSession={onLoadSession}
      />
    </div>
  );
};

export default GameTopBar; 