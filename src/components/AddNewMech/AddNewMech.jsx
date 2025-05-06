import React from 'react';
import './AddNewMech.css';

const AddNewMech = () => {
  const handleClick = () => {
    // This will be implemented later
    console.log('Add new mech clicked');
  };

  return (
    <button className="add-new-mech" onClick={handleClick}>
      <div className="plus-sign">+</div>
      <span className="add-text">Add New Mech</span>
    </button>
  );
};

export default AddNewMech; 