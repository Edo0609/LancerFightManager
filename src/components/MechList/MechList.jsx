import React from 'react';
import AddNewMech from '../AddNewMech/AddNewMech';
import MechCard from '../MechCard/MechCard';
import './MechList.css';

const MechList = () => {
  // This will be populated with actual mechs later
  const mechs = [];
  const totalSlots = 10; // 5 columns * 2 rows
  const emptySlots = totalSlots - mechs.length - 1; // -1 for the AddNewMech button

  return (
    <div className="mech-list">
      <div className="mech-grid">
        {mechs.map((mech, index) => (
          <MechCard key={`mech-${index}`} mech={mech} />
        ))}
        <AddNewMech />
        {[...Array(emptySlots)].map((_, index) => (
          <div key={`empty-${index}`} className="empty-slot" />
        ))}
      </div>
    </div>
  );
};

export default MechList; 