import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import './SaveSlotsPopup.css';

const SaveSlotsPopup = ({ isOpen, onClose, sessionName, mechs, onLoadSession }) => {
  const { currentUser } = useAuth();
  const { userSessions, saveSession, updateSession } = useDatabase();
  const [saveSlots, setSaveSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      // Load save slots from userSessions
      const slots = Array(4).fill(null).map((_, index) => {
        const session = userSessions.find(s => s.slotIndex === index);
        if (session) {
          return {
            ...session,
            isEmpty: false
          };
        }
        return {
          slotIndex: index,
          isEmpty: true
        };
      });
      setSaveSlots(slots);
    }
  }, [isOpen, currentUser, userSessions]);

  const handleSlotClick = (slotIndex) => {
    const slot = saveSlots[slotIndex];
    if (slot.isEmpty) {
      handleSave(slotIndex);
    } else {
      setSelectedSlot(slotIndex);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmAction = (action) => {
    if (action === 'save') {
      handleSave(selectedSlot);
    } else if (action === 'load') {
      handleLoad(selectedSlot);
    }
    setShowConfirmDialog(false);
    setSelectedSlot(null);
  };

  const handleSave = async (slotIndex) => {
    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const saveData = {
        sessionName,
        mechs,
        slotIndex,
        updatedAt: new Date().toISOString()
      };

      const existingSession = userSessions.find(s => s.slotIndex === slotIndex);
      
      if (existingSession) {
        await updateSession(existingSession.id, saveData);
      } else {
        await saveSession(saveData);
      }

      // Update local state
      setSaveSlots(prev => prev.map(slot => 
        slot.slotIndex === slotIndex 
          ? { ...saveData, isEmpty: false }
          : slot
      ));

      onClose();
    } catch (err) {
      setError('Failed to save game. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = (slotIndex) => {
    const session = userSessions.find(s => s.slotIndex === slotIndex);
    if (session) {
      onLoadSession(session);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="save-slots-popup">
        <div className="save-slots-content">
          <h2>Save Game</h2>
          <p>Please log in to save your game.</p>
          <button className="save-slots-login-button" onClick={() => onClose('login')}>
            Login / Sign Up
          </button>
          <button className="save-slots-close-button" onClick={() => onClose()}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="save-slots-popup">
      <div className="save-slots-content">
        <h2>Save Game</h2>
        {error && <div className="save-slots-error-message">{error}</div>}
        <div className="save-slots-grid">
          {saveSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`save-slots-slot ${slot.isEmpty ? 'empty' : ''}`}
              onClick={() => handleSlotClick(index)}
            >
              <div className="save-slots-slot-header">
                <span className="save-slots-slot-number">Slot {index + 1}</span>
                {!slot.isEmpty && (
                  <span className="save-slots-slot-date">
                    {new Date(slot.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {slot.isEmpty ? (
                <div className="save-slots-empty-slot">Empty Slot</div>
              ) : (
                <div className="save-slots-slot-info">
                  <div className="save-slots-session-name">{slot.sessionName}</div>
                  <div className="save-slots-mech-count">
                    {slot.mechs.length} Mech{slot.mechs.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          className="save-slots-close-button" 
          onClick={() => onClose()}
          disabled={isSaving}
        >
          Close
        </button>
      </div>

      {showConfirmDialog && (
        <div className="save-slots-confirm-dialog">
          <div className="save-slots-confirm-content">
            <h3>Slot {selectedSlot + 1} already has a save</h3>
            <p>What would you like to do?</p>
            <div className="save-slots-confirm-buttons">
              <button 
                className="save-slots-confirm-button save"
                onClick={() => handleConfirmAction('save')}
                disabled={isSaving}
              >
                Save (Overwrite)
              </button>
              <button 
                className="save-slots-confirm-button load"
                onClick={() => handleConfirmAction('load')}
              >
                Load
              </button>
              <button 
                className="save-slots-confirm-button cancel"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveSlotsPopup; 