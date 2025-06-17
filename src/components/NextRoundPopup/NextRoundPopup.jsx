import React from 'react';
import './NextRoundPopup.css';

const NextRoundPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="next-round-overlay">
      <div className="next-round-content">
        <h2>Next Round</h2>
        <p>Are you sure you want to proceed to the next round?</p>
        <p className="warning-text">This will reset all mechs' attack status and reduce meltdown countdowns.</p>
        <div className="next-round-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes, Next Round
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextRoundPopup; 