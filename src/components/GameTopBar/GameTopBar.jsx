import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './GameTopBar.css';

const GameTopBar = ({ 
  sessionName: initialSessionName, 
  onBack, 
  onSave, 
  onHelp, 
  onSessionNameChange,
  onThemeToggle 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionName, setSessionName] = useState(initialSessionName || 'New Session');
  const { currentUser } = useAuth();

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
        <button className="top-bar-button auth-button">
          {currentUser ? '👤' : '🔒'}
        </button>
        <button className="top-bar-button save-button" onClick={onSave}>
          Save
        </button>
        <button className="top-bar-button help-button" onClick={onHelp}>
          ?
        </button>
      </div>
    </div>
  );
};

export default GameTopBar; 