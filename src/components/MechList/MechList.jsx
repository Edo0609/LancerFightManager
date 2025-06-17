import React from 'react';
import AddNewMech from '../AddNewMech/AddNewMech';
import MechCard from '../MechCard/MechCard';
import './MechList.css';

const MechList = ({ mechs = [], onAddMech, onDeleteMech, onUpdateMech }) => {
  const totalSlots = 8; // 4 columns * 2 rows
  const hasReachedMax = mechs.length >= totalSlots;
  const emptySlots = totalSlots - mechs.length - (hasReachedMax ? 0 : 1);

  const handleDeleteMech = (index) => {
    onDeleteMech(index);
  };

  const handleUpdateMech = (index, updatedMech) => {
    onUpdateMech(index, updatedMech);
  };

  // Wrapper to append a persistent number to the mech name
  const handleAddMech = (newMech) => {
    const baseName = newMech.name;
    // Match names like "BaseName 1", "BaseName 2", etc.
    const regex = new RegExp(`^${baseName} (\\d+)$`);
    const existingNumbers = mechs
      .map((m) => {
        const match = m.name.match(regex);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num) => num != null);

    const highest = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = highest + 1;
    const namedMech = { ...newMech, name: `${baseName} ${nextNumber}` };

    onAddMech(namedMech);
  };

  return (
    <div className="mech-list">
      <div className="mech-grid">
        {mechs.map((mech, index) => (
          <MechCard
            key={`mech-${index}`}
            mech={mech}
            onDelete={() => handleDeleteMech(index)}
            onUpdate={(updatedMech) => handleUpdateMech(index, updatedMech)}
          />
        ))}

        {!hasReachedMax && <AddNewMech onAddMech={handleAddMech} />}

        {[...Array(emptySlots)].map((_, index) => (
          <div key={`empty-${index}`} className="empty-slot" />
        ))}
      </div>
    </div>
  );
};

export default MechList;
