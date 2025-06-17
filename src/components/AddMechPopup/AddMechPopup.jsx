import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import CreateMechForm from '../CreateMechForm/CreateMechForm';
import Notification from '../Notification/Notification';
import './AddMechPopup.css';

const AddMechPopup = ({ onClose, onSelectMech }) => {
  const { defaultMechs, userMechs } = useDatabase();
  const { currentUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allMechs, setAllMechs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Combine default mechs and user mechs
    const combinedMechs = [
      ...(defaultMechs || []),
      ...(userMechs || [])
    ];
    setAllMechs(combinedMechs);
  }, [defaultMechs, userMechs]);

  const handleMechClick = (mech) => {
    console.log('Mech clicked:', mech);
    onSelectMech(mech);
    onClose();
  };

  const handleCreateMech = (newMech) => {
    onSelectMech(newMech);
    onClose();
  };

  const handleCreateMechClick = () => {
    if (!currentUser) {
      setNotification({
        message: 'Please log in to create custom mechs',
        type: 'error'
      });
      return;
    }
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return (
      <CreateMechForm
        onClose={() => setShowCreateForm(false)}
        onMechCreated={handleCreateMech}
      />
    );
  }

  return (
    <div className="add-mech-popup-overlay">
      <div className="add-mech-popup-content">
        <div className="add-mech-popup-header">
          <h2>Select a Mech</h2>
          <button className="add-mech-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="add-mech-popup-list">
          {allMechs && allMechs.length > 0 ? (
            allMechs.map((mech) => {
              console.log('Rendering mech:', mech);
              return (
                <div 
                  key={mech.id || mech.name} 
                  className="add-mech-item" 
                  onClick={() => handleMechClick(mech)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="add-mech-image">
                    {mech.image ? (
                      <img src={mech.image} alt={mech.name} />
                    ) : (
                      <div className="add-mech-placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="add-mech-details">
                    <h3>{mech.name}</h3>
                    <div className="add-mech-stats">
                      {/* Key Stats Row */}
                      <div className="add-mech-key-stats-row">
                        <div className="add-mech-key-stat">
                          <span className="add-mech-stat-label">HP</span>
                          <span className="add-mech-stat-value">{mech.Hp}</span>
                        </div>
                        <div className="add-mech-key-stat">
                          <span className="add-mech-stat-label">Heat Cap</span>
                          <span className="add-mech-stat-value">{mech['Heat cap']}</span>
                        </div>
                        <div className="add-mech-key-stat">
                          <span className="add-mech-stat-label">Stress</span>
                          <span className="add-mech-stat-value">{mech.Stress}</span>
                        </div>
                        <div className="add-mech-key-stat">
                          <span className="add-mech-stat-label">Structure</span>
                          <span className="add-mech-stat-value">{mech.Structure}</span>
                        </div>
                      </div>

                      {/* Remaining Stats Grid */}
                      <div className="add-mech-remaining-stats-grid">
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Hull</span>
                          <span className="add-mech-stat-value">{mech.Hull}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Agility</span>
                          <span className="add-mech-stat-value">{mech.Agility}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Systems</span>
                          <span className="add-mech-stat-value">{mech.Systems}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Engineering</span>
                          <span className="add-mech-stat-value">{mech.Engineering}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Evasion</span>
                          <span className="add-mech-stat-value">{mech.Evasion}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Speed</span>
                          <span className="add-mech-stat-value">{mech.Speed}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Sensors</span>
                          <span className="add-mech-stat-value">{mech.Sensors}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Armor</span>
                          <span className="add-mech-stat-value">{mech.Armor}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">E-Defense</span>
                          <span className="add-mech-stat-value">{mech['E-defense']}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Size</span>
                          <span className="add-mech-stat-value">{mech.Size}</span>
                        </div>
                        <div className="add-mech-stat-item">
                          <span className="add-mech-stat-label">Save</span>
                          <span className="add-mech-stat-value">{mech['Save Target']}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="add-mech-no-mechs">No mechs available</div>
          )}
        </div>

        <div className="add-mech-popup-footer">
          <button className="add-mech-create-button" onClick={handleCreateMechClick}>
            Create Mech
          </button>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AddMechPopup; 