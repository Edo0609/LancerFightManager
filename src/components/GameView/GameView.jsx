import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameTopBar from '../GameTopBar/GameTopBar';
import MechList from '../MechList/MechList';
import GameFooter from '../GameFooter/GameFooter';
import Auth from '../Auth/Auth';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import './GameView.css';

const GameView = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { defaultMechs } = useDatabase();
  const { currentUser } = useAuth();
  const [sessionName, setSessionName] = useState('Current Session');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedMechs, setSelectedMechs] = useState([]);
  const [destroyedMech, setDestroyedMech] = useState(null);

  // Handle loaded session data
  useEffect(() => {
    if (location.state?.session) {
      const { sessionName: loadedName, mechs: loadedMechs } = location.state.session;
      setSessionName(loadedName);
      setSelectedMechs(loadedMechs);
    }
  }, [location.state]);

  // Clear session when user logs out
  useEffect(() => {
    if (!currentUser) {
      setSessionName('Current Session');
      setSelectedMechs([]);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Standard way to show a confirmation dialog
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBack = () => {
    if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
      navigate('/');
    }
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

  const handleAddMech = (mech) => {
    // Ensure new mechs have the hasAttacked property
    const mechWithState = {
      ...mech,
      hasAttacked: false
    };
    setSelectedMechs(prev => [...prev, mechWithState]);
  };

  const handleDeleteMech = (index) => {
    setSelectedMechs(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoadSession = (session) => {
    // Ensure all mechs have the hasAttacked property
    const mechsWithState = session.mechs.map(mech => ({
      ...mech,
      hasAttacked: mech.hasAttacked || false
    }));
    setSessionName(session.sessionName);
    setSelectedMechs(mechsWithState);
  };

  const handleNextRound = () => {
    const updatedMechs = selectedMechs.map(mech => {
      const updatedMech = {
        ...mech,
        hasAttacked: false
      };

      // Handle meltdown countdown
      if (mech.meltdownTurns > 0) {
        const newMeltdownTurns = mech.meltdownTurns - 1;
        if (newMeltdownTurns === 0) {
          // Set the destroyed mech before removing it
          setDestroyedMech(mech);
          return null; // This will be filtered out
        }
        updatedMech.meltdownTurns = newMeltdownTurns;
      }

      return updatedMech;
    }).filter(mech => mech !== null); // Remove destroyed mechs

    setSelectedMechs(updatedMechs);
  };

  const handleMechDestroyedClose = () => {
    setDestroyedMech(null);
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
        mechs={selectedMechs}
        onLoadSession={handleLoadSession}
      />
      <div className="game-content">
        <MechList 
          mechs={selectedMechs} 
          onAddMech={handleAddMech}
          onDeleteMech={handleDeleteMech}
          onUpdateMech={(index, updatedMech) => {
            const newMechs = [...selectedMechs];
            newMechs[index] = updatedMech;
            setSelectedMechs(newMechs);
          }}
        />
      </div>
      <GameFooter onNextRound={handleNextRound} />
      <Auth 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      {destroyedMech && (
        <div className="structure-check-overlay">
          <div className="structure-check-content">
            <h2>Mech was Destroyed</h2>
            <p>{destroyedMech.name} was destroyed due to reactor meltdown!</p>
            <button className="close-button" onClick={handleMechDestroyedClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView; 