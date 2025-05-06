import React from 'react';
import './MechCard.css';

const MechCard = ({ mech }) => {
  const handleClick = () => {
    // This will be implemented later
    console.log('Mech card clicked:', mech);
  };

  return (
    <button className="mech-card" onClick={handleClick}>
      <div className="mech-card-content">
        {/* This will be populated with mech data later */}
        <div className="mech-placeholder">Mech Card</div>
      </div>
    </button>
  );
};

export default MechCard; 