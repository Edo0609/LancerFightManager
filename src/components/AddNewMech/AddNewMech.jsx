import React, { useState } from 'react';
import AddMechPopup from '../AddMechPopup/AddMechPopup';
import './AddNewMech.css';

const AddNewMech = ({ onAddMech }) => {
  const [showAddMechPopup, setShowAddMechPopup] = useState(false);

  const handleClick = () => {
    setShowAddMechPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddMechPopup(false);
  };

  const handleSelectMech = (mech) => {
    onAddMech(mech);
    setShowAddMechPopup(false);
  };

  return (
    <>
      <button className="add-new-mech" onClick={handleClick}>
        <div className="plus-sign">+</div>
        <span className="add-text">Add New Mech</span>
      </button>
      {showAddMechPopup && (
        <AddMechPopup 
          onClose={handleClosePopup}
          onSelectMech={handleSelectMech}
        />
      )}
    </>
  );
};

export default AddNewMech; 