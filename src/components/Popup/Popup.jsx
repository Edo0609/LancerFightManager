import React from 'react';
import './Popup.css';

const Popup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Welcome to Lancer Fight Manager</h2>
        <div className="popup-text">
          <p>WORK IN PROGRESS.</p>
        </div>
        <button className="popup-button" onClick={onClose}>
          I Understand
        </button>
      </div>
    </div>
  );
};

export default Popup; 