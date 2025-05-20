import React, { useState, useEffect, useRef } from 'react';
import DeleteConfirmationPopup from '../DeleteConfirmationPopup/DeleteConfirmationPopup';
import './MechCard.css';

const MechCard = ({ mech, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the card click from triggering
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const renderAdditionalStats = () => {
    const additionalStats = [
      { label: 'Hull', value: mech.Hull },
      { label: 'Agility', value: mech.Agility },
      { label: 'Systems', value: mech.Systems },
      { label: 'Engineering', value: mech.Engineering },
      { label: 'Evasion', value: mech.Evasion },
      { label: 'Speed', value: mech.Speed },
      { label: 'Sensors', value: mech.Sensors },
      { label: 'Armor', value: mech.Armor },
      { label: 'E-Defense', value: mech['E-defense'] },
      { label: 'Size', value: mech.Size },
      { label: 'Save', value: mech['Save Target'] }
    ];

    return (
      <div className="additional-stats">
        {additionalStats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={`mech-card-container ${isExpanded ? 'expanded' : ''}`} ref={cardRef}>
        <button className="mech-card" onClick={handleClick}>
          <button 
            className="delete-button" 
            onClick={handleDeleteClick}
            aria-label="Delete mech"
          >
            ×
          </button>
          <div className="mech-card-content">
            <div className="mech-card-image">
              {mech.image ? (
                <img src={mech.image} alt={mech.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="mech-card-header">
              <h3>{mech.name}</h3>
            </div>
            <div className="mech-card-stats">
              <div className="key-stat">
                <span className="stat-label">HP</span>
                <span className="stat-value">{mech.Hp}</span>
              </div>
              <div className="key-stat">
                <span className="stat-label">Heat</span>
                <span className="stat-value">{mech['Heat cap']}</span>
              </div>
              <div className="key-stat">
                <span className="stat-label">Stress</span>
                <span className="stat-value">{mech.Stress}</span>
              </div>
              <div className="key-stat">
                <span className="stat-label">Struct</span>
                <span className="stat-value">{mech.Structure}</span>
              </div>
            </div>
          </div>
        </button>
        {isExpanded && (
          <div className="expanded-stats-container">
            {renderAdditionalStats()}
          </div>
        )}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup
          mechName={mech.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default MechCard; 