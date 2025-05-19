import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../Notification/Notification';
import LogoutConfirmation from '../LogoutConfirmation/LogoutConfirmation';
import './GameTopBar.css';

const GameTopBar = ({ 
  sessionName: initialSessionName, 
  onBack, 
  onSave, 
  onHelp, 
  onSessionNameChange,
  onThemeToggle,
  onAuthClick 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionName, setSessionName] = useState(initialSessionName || 'New Session'); //TODO change mouse event.
  const [notification, setNotification] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { currentUser, logout } = useAuth();

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

  return (
    <div className="game-top-bar">
      <button className="top-bar-button back-button" onClick={onBack}>
        ← Back
      </button>
      
      <div className="session-name-container">
        {isEditing ? (
          <input
            type="text"
            className="session-name-input"
            value={sessionName}
            onChange={handleNameChange}
            onKeyDown={handleNameSubmit}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div className="session-name">
            {sessionName}
          </div>
        )}
        <button 
          className="edit-button" 
          onClick={handleEditToggle}
          title={isEditing ? "Save" : "Edit session name"}
        >
          {isEditing ? "✓" : "✎"}
        </button>
      </div>
      
      <div className="top-bar-right">
        <button className="top-bar-button theme-toggle" onClick={onThemeToggle}>
          🌙
        </button>
        <button 
          className="top-bar-button auth-button" 
          onClick={handleAuthClick}
          title={currentUser ? 'Logout' : 'Login / Sign Up'}
        >
          {currentUser ? 'Logout' : 'Login / Sign Up'}
        </button>
        <button className="top-bar-button save-button" onClick={onSave}>
          Save
        </button>
        <button className="top-bar-button help-button" onClick={onHelp}>
          ?
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
    </div>
  );
};

export default GameTopBar; 