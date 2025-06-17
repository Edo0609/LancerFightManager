import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import './LoadSessionPopup.css';

const LoadSessionPopup = ({ isOpen, onClose, onLoadSession, onAuthClick }) => {
  const { currentUser } = useAuth();
  const { userSessions } = useDatabase();
  const [saveSlots, setSaveSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
    if (!slot.isEmpty) {
      setSelectedSlot(slotIndex);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmLoad = () => {
    const session = userSessions.find(s => s.slotIndex === selectedSlot);
    if (session) {
      onLoadSession(session);
      onClose();
    }
    setShowConfirmDialog(false);
    setSelectedSlot(null);
  };

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="load-session-popup">
        <div className="load-session-content">
          <h2>Load Game</h2>
          <p>Please log in to load your saved games.</p>
          <button className="load-login-button" onClick={() => {
            onClose();
            onAuthClick?.();
          }}>
            Login / Sign Up
          </button>
          <button className="load-close-button" onClick={() => onClose()}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="load-session-popup">
      <div className="load-session-content">
        <h2>Load Game</h2>
        {error && <div className="load-error-message">{error}</div>}
        <div className="load-save-slots-grid">
          {saveSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`load-save-slot ${slot.isEmpty ? 'empty' : ''}`}
              onClick={() => handleSlotClick(index)}
            >
              <div className="load-slot-header">
                <span className="load-slot-number">Slot {index + 1}</span>
                {!slot.isEmpty && (
                  <span className="load-slot-date">
                    {new Date(slot.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {slot.isEmpty ? (
                <div className="load-empty-slot">Empty Slot</div>
              ) : (
                <div className="load-slot-info">
                  <div className="load-session-name">{slot.sessionName}</div>
                  <div className="load-mech-count">
                    {slot.mechs.length} Mech{slot.mechs.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          className="load-close-button" 
          onClick={() => onClose()}
        >
          Close
        </button>
      </div>

      {showConfirmDialog && (
        <div className="load-confirm-dialog">
          <div className="load-confirm-content">
            <h3>Load Session</h3>
            <p>Are you sure you want to load this session?</p>
            <div className="load-confirm-buttons">
              <button 
                className="load-confirm-button load"
                onClick={handleConfirmLoad}
              >
                Load
              </button>
              <button 
                className="load-confirm-button cancel"
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

export default LoadSessionPopup; 