import React from 'react';
import AddNewMech from '../AddNewMech/AddNewMech';
import MechCard from '../MechCard/MechCard';
import './MechList.css';

const MechList = ({ mechs = [], onAddMech, onDeleteMech }) => {
  const totalSlots = 10; // 5 columns * 2 rows
  const hasReachedMax = mechs.length >= totalSlots;
  const emptySlots = totalSlots - mechs.length - (hasReachedMax ? 0 : 1); // -1 for the AddNewMech button if not at max

  const handleDeleteMech = (index) => {
    onDeleteMech(index);
  };

  return (
    <div className="mech-list">
      <div className="mech-grid">
        {mechs.map((mech, index) => (
          <MechCard 
            key={`mech-${index}`} 
            mech={mech} 
            onDelete={() => handleDeleteMech(index)}
          />
        ))}
        {!hasReachedMax && <AddNewMech onAddMech={onAddMech} />}
        {[...Array(emptySlots)].map((_, index) => (
          <div key={`empty-${index}`} className="empty-slot" />
        ))}
      </div>
    </div>
  );
};

export default MechList; 