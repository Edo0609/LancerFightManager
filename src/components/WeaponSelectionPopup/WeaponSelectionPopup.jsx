import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import CreateWeaponForm from '../CreateWeaponForm/CreateWeaponForm';
import './WeaponSelectionPopup.css';

const WeaponSelectionPopup = ({ onClose, onSelectWeapon }) => {
  const { defaultWeapons, userWeapons } = useDatabase();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleWeaponClick = (weapon) => {
    onSelectWeapon(weapon);
    onClose();
  };

  const handleCreateWeapon = (newWeapon) => {
    onSelectWeapon(newWeapon);
    onClose();
  };

  if (showCreateForm) {
    return (
      <CreateWeaponForm
        onClose={() => setShowCreateForm(false)}
        onWeaponCreated={handleCreateWeapon}
      />
    );
  }

  // Combine default and user weapons
  const allWeapons = [...(defaultWeapons || []), ...(userWeapons || [])];

  return (
    <div className="weapon-select-overlay">
      <div className="weapon-select-content">
        <div className="weapon-select-header">
          <h2>Select a Weapon</h2>
          <button className="weapon-select-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="weapon-select-list">
          {allWeapons && allWeapons.length > 0 ? (
            allWeapons.map((weapon) => (
              <div 
                key={weapon.id || weapon.Name} 
                className="weapon-select-item" 
                onClick={() => handleWeaponClick(weapon)}
                role="button"
                tabIndex={0}
              >
                <div className="weapon-select-details">
                  <h3>{weapon.Name}</h3>
                  <div className="weapon-select-stats">
                    <div className="weapon-select-stat">
                      <span className="stat-label">Type</span>
                      <span className="stat-value">{weapon.Type}</span>
                    </div>
                    <div className="weapon-select-stat">
                      <span className="stat-label">Size</span>
                      <span className="stat-value">{weapon.Size}</span>
                    </div>
                    <div className="weapon-select-stat">
                      <span className="stat-label">Range</span>
                      <span className="stat-value">{weapon.range}</span>
                    </div>
                    <div className="weapon-select-stat">
                      <span className="stat-label">Damage</span>
                      <span className="stat-value">{weapon.damage}</span>
                    </div>
                    <div className="weapon-select-stat">
                      <span className="stat-label">Accuracy</span>
                      <span className="stat-value">{weapon.Accuracy}</span>
                    </div>
                  </div>
                  {weapon.Passives && (
                    <div className="weapon-select-passives">
                      <span className="passive-label">Passives:</span>
                      <p>{weapon.Passives}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="weapon-select-empty">No weapons available</div>
          )}
        </div>

        <div className="weapon-select-footer">
          <button className="weapon-select-create-button" onClick={() => setShowCreateForm(true)}>
            Create Weapon
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeaponSelectionPopup; 