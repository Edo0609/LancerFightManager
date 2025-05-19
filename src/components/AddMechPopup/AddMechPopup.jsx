import React, { useEffect } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import './AddMechPopup.css';

const AddMechPopup = ({ onClose }) => {
  const { defaultMechs } = useDatabase();

  useEffect(() => {
    console.log('AddMechPopup - defaultMechs:', defaultMechs);
  }, [defaultMechs]);

  return (
    <div className="add-mech-popup-overlay">
      <div className="add-mech-popup-content">
        <div className="add-mech-popup-header">
          <h2>Select a Mech</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="mech-list">
          {defaultMechs && defaultMechs.length > 0 ? (
            defaultMechs.map((mech) => {
              console.log('Rendering mech:', mech);
              return (
                <div key={mech.name} className="mech-item">
                  <div className="mech-image">
                    {mech.image ? (
                      <img src={mech.image} alt={mech.name} />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="mech-details">
                    <h3>{mech.name}</h3>
                    <div className="mech-stats">
                      <div className="stat-row">
                        <span className="stat-label">Hull:</span>
                        <span className="stat-value">{mech.Hull}</span>
                        <span className="stat-label">Agility:</span>
                        <span className="stat-value">{mech.Agility}</span>
                        <span className="stat-label">Systems:</span>
                        <span className="stat-value">{mech.Systems}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Engineering:</span>
                        <span className="stat-value">{mech.Engineering}</span>
                        <span className="stat-label">Structure:</span>
                        <span className="stat-value">{mech.Structure}</span>
                        <span className="stat-label">Stress:</span>
                        <span className="stat-value">{mech.Stress}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">HP:</span>
                        <span className="stat-value">{mech.Hp}</span>
                        <span className="stat-label">Evasion:</span>
                        <span className="stat-value">{mech.Evasion}</span>
                        <span className="stat-label">Speed:</span>
                        <span className="stat-value">{mech.Speed}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Heat Cap:</span>
                        <span className="stat-value">{mech['Heat cap']}</span>
                        <span className="stat-label">Sensors:</span>
                        <span className="stat-value">{mech.Sensors}</span>
                        <span className="stat-label">Armor:</span>
                        <span className="stat-value">{mech.Armor}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">E-Defense:</span>
                        <span className="stat-value">{mech['E-defense']}</span>
                        <span className="stat-label">Size:</span>
                        <span className="stat-value">{mech.Size}</span>
                        <span className="stat-label">Save:</span>
                        <span className="stat-value">{mech['Save Target']}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-mechs-message">No mechs available</div>
          )}
        </div>

        <div className="add-mech-popup-footer">
          <button className="create-mech-button" onClick={() => console.log('Create Mech clicked')}>
            Create Mech
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMechPopup; 