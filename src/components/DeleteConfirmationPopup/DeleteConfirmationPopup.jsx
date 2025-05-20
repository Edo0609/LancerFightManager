import React from 'react';
import './DeleteConfirmationPopup.css';

const DeleteConfirmationPopup = ({ mechName, onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-content">
        <h2>Delete Mech</h2>
        <p>Are you sure you want to delete {mechName}?</p>
        <div className="delete-confirmation-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup; 