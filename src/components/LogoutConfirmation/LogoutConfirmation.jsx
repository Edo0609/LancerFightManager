import React, { useState } from 'react';
import './LogoutConfirmation.css';

const LogoutConfirmation = ({ userEmail, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 300); // Match the animation duration
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300); // Match the animation duration
  };

  return (
    <div className={`logout-confirmation-overlay ${isClosing ? 'fade-out' : ''}`}>
      <div className={`logout-confirmation-content ${isClosing ? 'fade-out' : ''}`}>
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <h2><strong>All game content will be reset</strong></h2>
        <p className="logout-user-email">(Currently logged in as: {userEmail})</p>
        <div className="logout-confirmation-buttons">
          <button className="logout-confirm-button" onClick={handleConfirm}>
            Yes, Logout
          </button>
          <button className="logout-cancel-button" onClick={handleCancel}>
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation; 