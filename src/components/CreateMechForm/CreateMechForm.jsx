import React, { useState, useRef } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import './CreateMechForm.css';

const CreateMechForm = ({ onClose, onMechCreated }) => {
  const { saveMech } = useDatabase();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    Hp: 0,
    'Heat cap': 0,
    Stress: 0,
    Structure: 0,
    Hull: 0,
    Agility: 0,
    Systems: 0,
    Engineering: 0,
    Evasion: 0,
    Speed: 0,
    Sensors: 0,
    Armor: 0,
    'E-defense': 0,
    Size: '',
    'Save Target': 0
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only convert to number for numeric fields
    const numericFields = [
      'Hp', 'Heat cap', 'Stress', 'Structure', 'Hull', 'Agility',
      'Systems', 'Engineering', 'Evasion', 'Speed', 'Sensors',
      'Armor', 'E-defense', 'Save Target'
    ];
    
    // Allow empty string for numeric fields
    if (numericFields.includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
    setFormData(prev => ({
      ...prev,
        [name]: value
    }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
        setPreviewImage(base64String);
        setIsUploading(false);
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert empty strings to 0 for numeric fields
      const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
        const numericFields = [
          'Hp', 'Heat cap', 'Stress', 'Structure', 'Hull', 'Agility',
          'Systems', 'Engineering', 'Evasion', 'Speed', 'Sensors',
          'Armor', 'E-defense', 'Save Target'
        ];
        acc[key] = numericFields.includes(key) && value === '' ? 0 : value;
        return acc;
      }, {});
      
      const mechId = await saveMech(processedData);
      onMechCreated({ ...processedData, id: mechId });
      onClose();
    } catch (error) {
      console.error('Error creating mech:', error);
      // TODO: Add error handling UI
    }
  };

  return (
    <div className="mech-form-overlay">
      <div className="mech-form-content">
        <div className="mech-form-header">
          <h2>Create New Mech</h2>
          <button className="mech-form-close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="mech-form">
          <div className="mech-form-section">
            <div className="mech-form-group">
              <label htmlFor="name">Mech Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter mech name"
              />
            </div>
            
            <div className="mech-form-group mech-form-image-upload-group">
              <label>Mech Image</label>
              <div 
                className="mech-form-image-upload-area"
                onClick={handleImageClick}
                style={{ 
                  backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!previewImage && (
                  <div className="mech-form-upload-placeholder">
                    {isUploading ? 'Uploading...' : 'Click to upload image'}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="mech-form-section">
            <h3>Key Stats</h3>
            <div className="mech-form-stats-grid">
              <div className="mech-form-group">
                <label htmlFor="Hp">HP</label>
                <input
                  type="number"
                  id="Hp"
                  name="Hp"
                  value={formData.Hp}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Heat cap">Heat Cap</label>
                <input
                  type="number"
                  id="Heat cap"
                  name="Heat cap"
                  value={formData['Heat cap']}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Stress">Stress</label>
                <input
                  type="number"
                  id="Stress"
                  name="Stress"
                  value={formData.Stress}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Structure">Structure</label>
                <input
                  type="number"
                  id="Structure"
                  name="Structure"
                  value={formData.Structure}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mech-form-section">
            <h3>Additional Stats</h3>
            <div className="mech-form-stats-grid">
              <div className="mech-form-group">
                <label htmlFor="Hull">Hull</label>
                <input
                  type="number"
                  id="Hull"
                  name="Hull"
                  value={formData.Hull}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Agility">Agility</label>
                <input
                  type="number"
                  id="Agility"
                  name="Agility"
                  value={formData.Agility}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Systems">Systems</label>
                <input
                  type="number"
                  id="Systems"
                  name="Systems"
                  value={formData.Systems}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Engineering">Engineering</label>
                <input
                  type="number"
                  id="Engineering"
                  name="Engineering"
                  value={formData.Engineering}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Evasion">Evasion</label>
                <input
                  type="number"
                  id="Evasion"
                  name="Evasion"
                  value={formData.Evasion}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Speed">Speed</label>
                <input
                  type="number"
                  id="Speed"
                  name="Speed"
                  value={formData.Speed}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Sensors">Sensors</label>
                <input
                  type="number"
                  id="Sensors"
                  name="Sensors"
                  value={formData.Sensors}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Armor">Armor</label>
                <input
                  type="number"
                  id="Armor"
                  name="Armor"
                  value={formData.Armor}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="E-defense">E-Defense</label>
                <input
                  type="number"
                  id="E-defense"
                  name="E-defense"
                  value={formData['E-defense']}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Size">Size</label>
                <input
                  type="text"
                  id="Size"
                  name="Size"
                  value={formData.Size}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mech-form-group">
                <label htmlFor="Save Target">Save Target</label>
                <input
                  type="number"
                  id="Save Target"
                  name="Save Target"
                  value={formData['Save Target']}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mech-form-actions">
            <button type="button" className="mech-form-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="mech-form-submit-button">
              Create Mech
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMechForm; 