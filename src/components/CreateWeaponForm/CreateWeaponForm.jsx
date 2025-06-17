import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import './CreateWeaponForm.css';

const WEAPON_TYPES = ['Melee', 'Rifle', 'Nexus', 'CQB', 'Cannon', 'Launcher'];
const WEAPON_SIZES = ['Auxiliary', 'Main', 'Heavy', 'Superheavy'];
const RANGE_TYPES = ['Threat', 'Range', 'Cone', 'Burst', 'Line', 'Blast'];
const DAMAGE_TYPES = ['Kinetic', 'Energy', 'Explosive', 'Heat', 'Burn'];

const CreateWeaponForm = ({ onClose, onWeaponCreated }) => {
  const { saveWeapon } = useDatabase();
  const [formData, setFormData] = useState({
    Name: '',
    Type: WEAPON_TYPES[0],
    Size: WEAPON_SIZES[0],
    rangeType: RANGE_TYPES[0],
    range: 0,
    damage: 0,
    damageType: DAMAGE_TYPES[0],
    rollBonus: 0,
    Accuracy: 0,
    Difficulty: 0,
    Passives: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const weaponId = await saveWeapon(formData);
      onWeaponCreated({ ...formData, id: weaponId });
      onClose();
    } catch (error) {
      console.error('Error saving weapon:', error);
    }
  };

  return (
    <div className="weapon-form-overlay">
      <div className="weapon-form-content">
        <div className="weapon-form-header">
          <h2>Create New Weapon</h2>
          <button className="weapon-form-close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="weapon-form-group">
            <label htmlFor="Name">Weapon Name</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="weapon-form-group">
            <label htmlFor="Type">Weapon Type</label>
            <select
              id="Type"
              name="Type"
              value={formData.Type}
              onChange={handleInputChange}
              required
            >
              {WEAPON_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="weapon-form-group">
            <label htmlFor="Size">Weapon Size</label>
            <select
              id="Size"
              name="Size"
              value={formData.Size}
              onChange={handleInputChange}
              required
            >
              {WEAPON_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="weapon-form-group">
            <label htmlFor="rangeType">Range Type</label>
            <select
              id="rangeType"
              name="rangeType"
              value={formData.rangeType}
              onChange={handleInputChange}
              required
            >
              {RANGE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="weapon-form-input-row">
            <div className="weapon-form-group">
              <label htmlFor="range">Range</label>
              <input
                type="number"
                id="range"
                name="range"
                value={formData.range}
                onChange={handleNumberInputChange}
                min="0"
                required
              />
            </div>

            <div className="weapon-form-group">
              <label htmlFor="damage">Damage</label>
              <input
                type="number"
                id="damage"
                name="damage"
                value={formData.damage}
                onChange={handleNumberInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="weapon-form-group">
            <label htmlFor="damageType">Damage Type</label>
            <select
              id="damageType"
              name="damageType"
              value={formData.damageType}
              onChange={handleInputChange}
              required
            >
              {DAMAGE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="weapon-form-input-row">
            <div className="weapon-form-group">
              <label htmlFor="rollBonus">Bonus/Penalty</label>
              <input
                type="number"
                id="rollBonus"
                name="rollBonus"
                value={formData.rollBonus}
                onChange={handleNumberInputChange}
                required
              />
            </div>

            <div className="weapon-form-group">
              <label htmlFor="Accuracy">Accuracy</label>
              <input
                type="number"
                id="Accuracy"
                name="Accuracy"
                value={formData.Accuracy}
                onChange={handleNumberInputChange}
                min="0"
                required
              />
            </div>

            <div className="weapon-form-group">
              <label htmlFor="Difficulty">Difficulty</label>
              <input
                type="number"
                id="Difficulty"
                name="Difficulty"
                value={formData.Difficulty}
                onChange={handleNumberInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="weapon-form-group">
            <label htmlFor="Passives">Passives</label>
            <textarea
              id="Passives"
              name="Passives"
              value={formData.Passives}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="weapon-form-actions">
            <button type="button" className="weapon-form-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="weapon-form-submit-button">
              Create Weapon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWeaponForm; 