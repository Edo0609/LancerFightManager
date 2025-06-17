import React, { useState, useEffect, useRef } from 'react';
import DeleteConfirmationPopup from '../DeleteConfirmationPopup/DeleteConfirmationPopup';
import WeaponAttackPopup from '../WeaponAttackPopup/WeaponAttackPopup';
import CreateWeaponForm from '../CreateWeaponForm/CreateWeaponForm';
import CreateSystemForm from '../CreateSystemForm/CreateSystemForm';
import StructureCheck from '../StructureCheck/StructureCheck';
import StressCheck from '../StressCheck/StressCheck';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../Notification/Notification';
import './MechCard.css';

const STATUSES = ['engaged', 'hidden', 'invisible', 'prone', 'intangible', 'danger zone', 'exposed', 'shut down'];
const CONDITIONS = ['immobilized', 'impaired', 'jammed', 'lock on', 'shredded', 'slowed', 'stunned'];

const MechCard = ({ mech, onDelete, onUpdate }) => {
  const { currentUser } = useAuth();
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(mech.name);
  const [editedStats, setEditedStats] = useState({
    ...mech,
    currentHeat: mech.currentHeat || 0,
    currentHp: mech.currentHp || mech.Hp,
    currentStructure: mech.currentStructure ?? mech.Structure,
    currentStress: mech.currentStress ?? mech.Stress,
    maxHp: mech.Hp,
    maxHeat: mech['Heat cap'],
    maxStructure: mech.Structure,
    maxStress: mech.Stress
  });
  const [activeStatuses, setActiveStatuses] = useState(mech.activeStatuses || []);
  const [activeConditions, setActiveConditions] = useState(mech.activeConditions || []);
  const [showWeaponDropdown, setShowWeaponDropdown] = useState(false);
  const [showAttackPopup, setShowAttackPopup] = useState(false);
  const [showCreateWeaponForm, setShowCreateWeaponForm] = useState(false);
  const [hasAttacked, setHasAttacked] = useState(false);
  const [showStatusConditions, setShowStatusConditions] = useState(false);
  const [showSystems, setShowSystems] = useState(false);
  const [showAddSystemPopup, setShowAddSystemPopup] = useState(false);
  const [showCreateSystemForm, setShowCreateSystemForm] = useState(false);
  const [showStructureCheck, setShowStructureCheck] = useState(false);
  const [showMechDestroyed, setShowMechDestroyed] = useState(false);
  const [showStressCheck, setShowStressCheck] = useState(false);
  const [meltdownTurns, setMeltdownTurns] = useState(mech.meltdownTurns || 0);
  const cardRef = useRef(null);
  const weaponDropdownRef = useRef(null);
  const statusConditionsRef = useRef(null);
  const systemsRef = useRef(null);
  const { defaultWeapons, userWeapons, defaultSystems, userSystems } = useDatabase();

  // Combine default and user weapons
  const availableWeapons = [...defaultWeapons, ...userWeapons];
  // Combine default and user systems
  const availableSystems = [...(defaultSystems || []), ...(userSystems || [])];

  // Initialize stats when mech changes
  useEffect(() => {
    setEditedStats({
      ...mech,
      currentHeat: mech.currentHeat || 0,
      currentHp: mech.currentHp || mech.Hp,
      currentStructure: mech.currentStructure ?? mech.Structure,
      currentStress: mech.currentStress ?? mech.Stress,
      maxHp: mech.Hp,
      maxHeat: mech['Heat cap'],
      maxStructure: mech.Structure,
      maxStress: mech.Stress
    });
    setActiveStatuses(mech.activeStatuses || []);
    setActiveConditions(mech.activeConditions || []);
    setMeltdownTurns(mech.meltdownTurns || 0);
    setEditedName(mech.name);
    setIsEditingName(false);
  }, [mech]);

  // Check for danger zone status
  useEffect(() => {
    const isInDangerZone = editedStats.currentHeat >= (editedStats.maxHeat / 2);
    const newStatuses = activeStatuses.filter(status => status !== 'danger zone');
    if (isInDangerZone) {
      newStatuses.push('danger zone');
    }
    setActiveStatuses(newStatuses);
    onUpdate({
      ...mech,
      activeStatuses: newStatuses,
      activeConditions,
      hasAttacked
    });
  }, [editedStats.currentHeat, editedStats.maxHeat]);

  // Handle clicks outside of status/conditions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusConditionsRef.current && !statusConditionsRef.current.contains(event.target)) {
        setShowStatusConditions(false);
      }
      // Add check for clicking outside of expanded mech card
      if (isExpanded && cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]); // Add isExpanded to dependency array

  // Handle clicks outside of systems list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (systemsRef.current && !systemsRef.current.contains(event.target)) {
        setShowSystems(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleStatus = (status) => {
    if (status === 'danger zone') return; // Don't allow manual toggling of danger zone
    const newStatuses = activeStatuses.includes(status)
      ? activeStatuses.filter(s => s !== status)
      : [...activeStatuses, status];
    setActiveStatuses(newStatuses);
    onUpdate({
      ...mech,
      activeStatuses: newStatuses,
      activeConditions,
      hasAttacked
    });
  };

  const toggleCondition = (condition) => {
    const newConditions = activeConditions.includes(condition)
      ? activeConditions.filter(c => c !== condition)
      : [...activeConditions, condition];
    setActiveConditions(newConditions);
    onUpdate({
      ...mech,
      activeStatuses,
      activeConditions: newConditions,
      hasAttacked
    });
  };

  const handleStatusConditionsClick = (e) => {
    e.stopPropagation();
    setShowStatusConditions(!showStatusConditions);
    if (!showStatusConditions) {
      setIsExpanded(false);
      setShowSystems(false);
    }
  };

  const handleSystemsClick = (e) => {
    e.stopPropagation();
    setShowSystems(!showSystems);
    if (!showSystems) {
      setIsExpanded(false);
      setShowStatusConditions(false);
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowSystems(false);
      setShowStatusConditions(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    // Clear meltdown status before deleting
    onUpdate({
      ...mech,
      activeStatuses: activeStatuses.filter(status => status !== 'meltdown'),
      meltdownTurns: 0
    });
    onDelete();
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleNameClick = (e) => {
    e.stopPropagation();
    setEditedName(mech.name);
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
      onUpdate({ ...mech, name: editedName, hasAttacked: hasAttacked });
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(mech.name);
    }
  };

  const handleStatChange = (statName, value) => {
    // Don't allow changes to Size stat
    if (statName === 'Size') return;

    let newValue = value;
    
    // Apply constraints based on stat type
    switch (statName) {
      case 'currentHeat':
        // Allow heat to exceed max heat to trigger stress check
        newValue = Math.max(0, value);
        // Check for stress damage when heat exceeds max
        if (newValue > editedStats.maxHeat && editedStats.currentHeat <= editedStats.maxHeat) {
          if (editedStats.maxStress === 1) {
            // If max stress is 1, just apply exposed status and reset heat
            const newStatuses = [...activeStatuses, 'exposed'];
            setActiveStatuses(newStatuses);
            setEditedStats(prev => ({ ...prev, currentHeat: 0 }));
            onUpdate({
              ...mech,
              activeStatuses: newStatuses,
              activeConditions,
              hasAttacked,
              currentHeat: 0
            });
            return;
          } else if (editedStats.currentStress === 1) {
            // If current stress is 1 and max stress > 1, destroy the mech
            setShowMechDestroyed(true);
            return;
          } else {
            // Otherwise, reduce stress and show stress check
            const updatedStats = {
              ...editedStats,
              currentStress: editedStats.currentStress - 1,
              currentHeat: 0
            };
            setEditedStats(updatedStats);
            onUpdate({ 
              ...mech, 
              currentStress: updatedStats.currentStress,
              currentHeat: 0,
              hasAttacked: hasAttacked 
            });
            setShowStressCheck(true);
            return;
          }
        }
        break;
      case 'currentHp':
        newValue = Math.max(0, Math.min(value, editedStats.maxHp));
        // Check for structure damage
        if (newValue === 0 && editedStats.currentHp > 0) {
          if (editedStats.currentStructure > 1) {
            // Lose one structure and reset HP
            const updatedStats = {
              ...editedStats,
              currentStructure: editedStats.currentStructure - 1,
              currentHp: editedStats.maxHp
            };
            setEditedStats(updatedStats);
            onUpdate({ 
              ...mech, 
              currentStructure: updatedStats.currentStructure,
              currentHp: updatedStats.currentHp,
              hasAttacked: hasAttacked 
            });
            setShowStructureCheck(true);
            return;
          } else {
            // Mech is destroyed when structure would reach 0
            setShowMechDestroyed(true);
            return;
          }
        }
        break;
      case 'currentStructure':
        newValue = Math.max(0, Math.min(value, editedStats.maxStructure));
        break;
      case 'currentStress':
        newValue = Math.max(0, Math.min(value, editedStats.maxStress));
        break;
      case 'Hull':
      case 'Agility':
      case 'Systems':
      case 'Engineering':
        // Allow any value for these stats
        newValue = value;
        break;
      default:
        // For other stats, just ensure non-negative
        newValue = Math.max(0, value);
    }

    setEditedStats(prev => ({ ...prev, [statName]: newValue }));
    onUpdate({ 
      ...mech, 
      [statName]: newValue,
      maxHp: editedStats.maxHp,
      maxHeat: editedStats.maxHeat,
      maxStructure: editedStats.maxStructure,
      maxStress: editedStats.maxStress,
      hasAttacked: hasAttacked,
      meltdownTurns: meltdownTurns
    });
  };

  const handleWeaponSelect = (weapon) => {
    const updatedMech = {
      ...mech,
      weapons: [weapon],
      hasAttacked: hasAttacked
    };
    onUpdate(updatedMech);
    setShowWeaponDropdown(false);
  };

  const handleCreateWeapon = (newWeapon) => {
    handleWeaponSelect(newWeapon);
    setShowCreateWeaponForm(false);
  };

  const handleAttack = () => {
    setHasAttacked(true);
    onUpdate({ ...mech, hasAttacked: true });
  };

  // Add useEffect to initialize hasAttacked from mech prop
  useEffect(() => {
    setHasAttacked(mech.hasAttacked || false);
  }, [mech]);

  const renderWeaponStats = (weapon) => {
    return (
      <div className="weapon-stats">
        <div className="weapon-stat-row">
          <span>Range: {weapon.range} ({weapon.rangeType})</span>
          <span>Damage: {weapon.damage} ({weapon.damageType})</span>
        </div>
        <div className="weapon-stat-row">
          <span>Bonus/Penalty: {weapon.rollBonus > 0 ? `+${weapon.rollBonus}` : weapon.rollBonus}</span>
        </div>
        <div className="weapon-stat-row">
          <span>Difficulty: {weapon.Difficulty}</span>
          <span>Accuracy: {weapon.Accuracy}</span>
        </div>
        {weapon.Passives && (
          <div className="weapon-passives">
            <span>Passives: {weapon.Passives}</span>
          </div>
        )}
      </div>
    );
  };

  const renderWeaponMenu = () => {
    if (showCreateWeaponForm) {
      return (
        <div className="weapon-menu-container">
          <CreateWeaponForm
            onClose={() => setShowCreateWeaponForm(false)}
            onWeaponCreated={handleCreateWeapon}
          />
        </div>
      );
    }

    return (
      <div className="weapon-menu-container">
        <div className="weapon-menu">
          <h4>Weapon</h4>
          {mech.weaponIsDestroyed ? (
            <div className="weapon-destroyed">
              <div className="weapon-destroyed-message">Weapon System Destroyed</div>
              <div className="weapon-destroyed-description">
                This mech's weapon system has been destroyed and cannot be repaired.
              </div>
            </div>
          ) : mech.weapons && mech.weapons.length > 0 ? (
            <div className="weapon-list">
              <div className="weapon-item">
                <div className="weapon-name">{mech.weapons[0].Name}</div>
                <div className="weapon-type">{`${mech.weapons[0].Size} ${mech.weapons[0].Type}`}</div>
                {renderWeaponStats(mech.weapons[0])}
              </div>
              <div className="weapon-buttons">
                <button 
                  className="roll-attack-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAttackPopup(true);
                  }}
                >
                  Roll Attack
                </button>
                <button 
                  className="change-weapon-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWeaponDropdown(!showWeaponDropdown);
                  }}
                >
                  Change Weapon
                </button>
              </div>
            </div>
          ) : (
            <div className="no-weapons">
              <div>No weapon equipped</div>
              <button 
                className="equip-weapon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWeaponDropdown(!showWeaponDropdown);
                }}
              >
                Equip Weapon
              </button>
            </div>
          )}
          {showWeaponDropdown && !mech.weaponIsDestroyed && (
            <div className="weapon-dropdown" ref={weaponDropdownRef}>
              <div className="weapon-options-container">
              {availableWeapons.map((weapon) => (
                <div
                  key={weapon.id || weapon.Name}
                  className="weapon-option"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWeaponSelect(weapon);
                  }}
                >
                  <div className="weapon-name">{weapon.Name}</div>
                  <div className="weapon-type">{`${weapon.Size} ${weapon.Type}`}</div>
                  {renderWeaponStats(weapon)}
                </div>
              ))}
              </div>
              <button 
                className="create-weapon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateWeaponClick(e);
                }}
              >
                Create New Weapon
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatControl = ({ label, value, statName, maxValue, showMax = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const isUnchangeable = statName === 'Size';
    const allowNegative = ['Hull', 'Agility', 'Systems', 'Engineering'].includes(label);

    const handleValueClick = (e) => {
      e.stopPropagation();
      if (!isUnchangeable) {
        setIsEditing(true);
      }
    };

    const handleValueChange = (e) => {
      const newValue = parseInt(e.target.value) || 0;
      setTempValue(newValue);
    };

    const handleValueKeyDown = (e) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        handleStatChange(statName, tempValue);
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setTempValue(value);
      }
    };

    return (
      <div className="stat-item">
        <span className="stat-label">{label}</span>
        <div className="stat-control">
          {!isUnchangeable && (
            <button 
              className="stat-button"
              onClick={(e) => {
                e.stopPropagation();
                handleStatChange(statName, value - 1);
              }}
            >
              -
            </button>
          )}
          {isEditing ? (
            <input
              type="number"
              value={tempValue}
              onChange={handleValueChange}
              onKeyDown={handleValueKeyDown}
              onBlur={() => {
                setIsEditing(false);
                handleStatChange(statName, tempValue);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className={`stat-value ${!isUnchangeable ? 'editable' : ''}`}
              onClick={handleValueClick}
            >
              {showMax ? `${value}/${maxValue}` : value}
            </span>
          )}
          {!isUnchangeable && (
            <button 
              className="stat-button"
              onClick={(e) => {
                e.stopPropagation();
                handleStatChange(statName, value + 1);
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAdditionalStats = () => {
    const additionalStats = [
      { label: 'Hull', value: editedStats.Hull },
      { label: 'Agility', value: editedStats.Agility },
      { label: 'Systems', value: editedStats.Systems },
      { label: 'Engineering', value: editedStats.Engineering },
      { label: 'Evasion', value: editedStats.Evasion },
      { label: 'Speed', value: editedStats.Speed },
      { label: 'Sensors', value: editedStats.Sensors },
      { label: 'Armor', value: editedStats.Armor },
      { label: 'E-Defense', value: editedStats['E-defense'] },
      { label: 'Size', value: editedStats.Size },
      { label: 'Save', value: editedStats['Save Target'] }
    ];

    return (
      <div className="additional-stats">
        {additionalStats.map((stat, index) => (
          <StatControl
            key={index}
            label={stat.label}
            value={stat.value}
            statName={Object.keys(editedStats).find(key => 
              editedStats[key] === stat.value && 
              key.toLowerCase().includes(stat.label.toLowerCase())
            )}
          />
        ))}
      </div>
    );
  };

  const renderStatusAndConditions = () => {
    return (
      <div className="status-conditions-container" ref={statusConditionsRef}>
        <div className="status-section">
          <h4>Statuses</h4>
          <div className="status-list">
            {STATUSES.map(status => (
              <div
                key={status}
                className={`status-item ${activeStatuses.includes(status) ? 'active' : ''} ${status === 'danger zone' ? 'auto-status' : ''}`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
        </div>
        <div className="conditions-section">
          <h4>Conditions</h4>
          <div className="conditions-list">
            {CONDITIONS.map(condition => (
              <div
                key={condition}
                className={`condition-item ${activeConditions.includes(condition) ? 'active' : ''}`}
                onClick={() => toggleCondition(condition)}
              >
                {condition}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleAddSystem = (system) => {
    // Check if the system is already equipped
    if (mech.systems && mech.systems.some(s => s.Name === system.Name)) {
      setNotification({
        message: 'This system is already equipped',
        type: 'error'
      });
      return;
    }

    const updatedMech = {
      ...mech,
      systems: [...(mech.systems || []), system]
    };
    onUpdate(updatedMech);
    setShowAddSystemPopup(false);
  };

  const handleUninstallSystem = (system) => {
    const updatedMech = {
      ...mech,
      systems: mech.systems.filter(s => s !== system)
    };
    onUpdate(updatedMech);
  };

  const renderSystemsList = () => {
    return (
      <div className="systems-container" ref={systemsRef}>
        <div className="systems-list">
          <div className="systems-header">
            <h4>Systems</h4>
          </div>
          <div className="systems-content">
            {mech.systems && mech.systems.length > 0 ? (
              mech.systems.map((system, index) => (
                <div key={index} className="system-item">
                  <div className="system-header">
                    <div className="system-name">{system.Name}</div>
                    <button 
                      className="uninstall-system-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUninstallSystem(system);
                      }}
                      title="Uninstall system"
                    >
                      ×
                    </button>
                  </div>
                  <div className="system-description">{system.Description}</div>
                  {system.Tags && (
                    <div className="system-tags">
                      {system.Tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="system-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-systems">No systems installed</div>
            )}
          </div>
          <div className="add-system-button">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowAddSystemPopup(true);
              }}
            >
              Add System
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCreateSystem = (newSystem) => {
    handleAddSystem(newSystem);
    setShowCreateSystemForm(false);
  };

  const renderAddSystemPopup = () => {
    if (showCreateSystemForm) {
      return (
        <CreateSystemForm
          onClose={() => setShowCreateSystemForm(false)}
          onSystemCreated={handleCreateSystem}
        />
      );
    }

    return (
      <div className="add-system-popup-overlay">
        <div className="add-system-popup-content">
          <div className="add-system-popup-header">
            <h2>Add System</h2>
            <button className="close-button" onClick={() => setShowAddSystemPopup(false)}>×</button>
          </div>
          <div className="systems-grid">
            {availableSystems.map((system, index) => (
              <div 
                key={index} 
                className="system-option"
                onClick={() => handleAddSystem(system)}
              >
                <div className="system-name">{system.Name}</div>
                <div className="system-description">{system.Description}</div>
                {system.Tags && (
                  <div className="system-tags">
                    {system.Tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="system-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="add-system-popup-footer">
            <button 
              className="create-system-button"
              onClick={handleCreateSystemClick}
            >
              Create System
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleStructureCheckClose = () => {
    setShowStructureCheck(false);
  };

  const handleApplyCondition = (condition) => {
    const newConditions = [...activeConditions, condition];
    setActiveConditions(newConditions);
    onUpdate({
      ...mech,
      activeStatuses,
      activeConditions: newConditions,
      hasAttacked
    });
  };

  const handleUnequipWeapon = () => {
    const updatedMech = {
      ...mech,
      weapons: [],
      weaponIsDestroyed: true
    };
    onUpdate(updatedMech);
  };

  const handleDestroyMech = () => {
    setShowMechDestroyed(true);
  };

  const handleMechDestroyedClose = () => {
    setShowMechDestroyed(false);
    onDelete();
  };

  const handleApplyStatus = (status) => {
    const newStatuses = [...activeStatuses, status];
    setActiveStatuses(newStatuses);
    onUpdate({
      ...mech,
      activeStatuses: newStatuses,
      activeConditions,
      hasAttacked,
      meltdownTurns
    });
  };

  const handleSetMeltdownTurns = (turns) => {
    setMeltdownTurns(turns);
    onUpdate({
      ...mech,
      meltdownTurns: turns,
      activeStatuses,
      activeConditions,
      hasAttacked
    });
  };

  const handleStressCheckClose = () => {
    setShowStressCheck(false);
  };

  const handleCreateWeaponClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setNotification({
        message: 'Please log in to create custom weapons',
        type: 'error'
      });
      return;
    }
    setShowCreateWeaponForm(true);
  };

  const handleCreateSystemClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setNotification({
        message: 'Please log in to create custom systems',
        type: 'error'
      });
      return;
    }
    setShowCreateSystemForm(true);
  };

  return (
    <>
      <div className={`mech-card-container ${isExpanded ? 'expanded' : ''}`} ref={cardRef}>
        {isExpanded && renderWeaponMenu()}
        <div className="mech-card" onClick={handleClick}>
          <button 
            className="systems-button" 
            onClick={handleSystemsClick}
            aria-label="Toggle systems"
          >
            ⚙️
          </button>
          <button 
            className="delete-button" 
            onClick={handleDeleteClick}
            aria-label="Delete mech"
          >
            ×
          </button>
          <button
            className="status-conditions-button"
            onClick={handleStatusConditionsClick}
            aria-label="Toggle status and conditions"
          >
            ⚡
          </button>
          <div className="mech-card-background">
            {mech.image ? (
              <img src={mech.image} alt={mech.name} />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
          </div>
          <div className="mech-card-content">
            <div className="mech-card-header">
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  onKeyDown={handleNameKeyDown}
                  onBlur={() => {
                    setIsEditingName(false);
                    onUpdate({ ...mech, name: editedName });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <h3 onClick={handleNameClick}>{mech.name}</h3>
              )}
            </div>
            <div className="mech-card-stats">
              <StatControl 
                label="HP" 
                value={editedStats.currentHp} 
                statName="currentHp" 
                maxValue={editedStats.maxHp}
                showMax={true}
              />
              <StatControl 
                label="Heat" 
                value={editedStats.currentHeat} 
                statName="currentHeat" 
                maxValue={editedStats.maxHeat}
                showMax={true}
              />
              <StatControl 
                label="Stress" 
                value={editedStats.currentStress} 
                statName="currentStress" 
                maxValue={editedStats.maxStress}
                showMax={true}
              />
              <StatControl 
                label="Struct" 
                value={editedStats.currentStructure} 
                statName="currentStructure" 
                maxValue={editedStats.maxStructure}
                showMax={true}
              />
            </div>
            {hasAttacked && (
              <div className="attack-status">Attacked this round</div>
            )}
            {meltdownTurns > 0 && activeStatuses.includes('meltdown') && (
              <div 
                className="meltdown-warning"
                data-tooltip={`Reactor Meltdown in ${meltdownTurns} turn${meltdownTurns !== 1 ? 's' : ''}`}
              >
                {meltdownTurns}
              </div>
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="expanded-stats-container">
            {renderAdditionalStats()}
          </div>
        )}
        {showStatusConditions && renderStatusAndConditions()}
        {showSystems && renderSystemsList()}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup
          mechName={mech.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {showAttackPopup && mech.weapons && mech.weapons.length > 0 && (
        <WeaponAttackPopup
          weapon={mech.weapons[0]}
          onClose={() => setShowAttackPopup(false)}
          onAttack={handleAttack}
        />
      )}
      {showAddSystemPopup && renderAddSystemPopup()}
      {showStructureCheck && (
        <StructureCheck 
          onClose={handleStructureCheckClose}
          currentStructure={editedStats.currentStructure}
          maxStructure={editedStats.maxStructure}
          hullStat={editedStats.Hull}
          onApplyCondition={handleApplyCondition}
          onUninstallSystem={handleUninstallSystem}
          onUnequipWeapon={handleUnequipWeapon}
          onDestroyMech={handleDestroyMech}
          systems={mech.systems || []}
        />
      )}
      {showMechDestroyed && (
        <div className="structure-check-overlay">
          <div className="structure-check-content">
            <h2>Mech was Destroyed</h2>
            <button className="close-button" onClick={handleMechDestroyedClose}>Close</button>
          </div>
        </div>
      )}
      {showStressCheck && (
        <StressCheck 
          onClose={handleStressCheckClose}
          currentStress={editedStats.currentStress}
          maxStress={editedStats.maxStress}
          engineeringStat={editedStats.Engineering}
          onApplyStatus={handleApplyStatus}
          onSetMeltdownTurns={handleSetMeltdownTurns}
          onDestroyMech={handleDestroyMech}
          onApplyCondition={handleApplyCondition}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default MechCard; 