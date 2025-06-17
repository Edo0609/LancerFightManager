import React, { useState } from 'react';
import './StructureCheck.css';

const StructureCheck = ({ 
  onClose, 
  currentStructure, 
  maxStructure, 
  hullStat,
  onApplyCondition,
  onUninstallSystem,
  onUnequipWeapon,
  onDestroyMech,
  systems
}) => {
  const [diceResults, setDiceResults] = useState([]);
  const [showRollButton, setShowRollButton] = useState(true);
  const [showSystemSelect, setShowSystemSelect] = useState(false);
  const [showHullCheck, setShowHullCheck] = useState(false);
  const [hullRollResult, setHullRollResult] = useState(null);
  const [hullBonus, setHullBonus] = useState(0);
  const [hullCheckPassed, setHullCheckPassed] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [traumaRoll, setTraumaRoll] = useState(null);

  const rollDice = (numDice) => {
    const results = [];
    for (let i = 0; i < numDice; i++) {
      results.push(Math.floor(Math.random() * 6) + 1);
    }
    setDiceResults(results);
    setShowRollButton(false);
    handleResults(results);
  };

  const handleResults = (results) => {
    const worstResult = Math.min(...results);
    const structureLost = maxStructure - currentStructure;
    
    // Check for crushing hit - multiple 1s in the current roll
    const onesCount = results.filter(result => result === 1).length;
    if (structureLost > 1 && onesCount > 1) {
      setOutcome({
        type: 'crushing',
        message: 'Crushing Hit - Multiple 1s rolled on structure damage'
      });
      return;
    }

    if (worstResult >= 5) {
      // Glancing Blow
      setOutcome({
        type: 'glancing',
        message: 'Glancing Blow - Apply Impaired condition'
      });
    } else if (worstResult >= 2) {
      // System Trauma
      const roll = Math.floor(Math.random() * 6) + 1;
      setTraumaRoll(roll);
      if (roll <= 3) {
        setOutcome({
          type: 'trauma',
          message: `System Trauma - Rolled ${roll} - Weapon must be unequipped`
        });
      } else {
        setOutcome({
          type: 'trauma',
          message: `System Trauma - Rolled ${roll} - Select a system to uninstall`
        });
        setShowSystemSelect(true);
      }
    } else {
      // Direct Hit
      if (currentStructure >= 3) {
        setOutcome({
          type: 'direct',
          message: 'Direct Hit - Apply Stunned condition'
        });
      } else if (currentStructure === 2) {
        setOutcome({
          type: 'direct',
          message: 'Direct Hit - Hull check required'
        });
        setShowHullCheck(true);
      } else {
        setOutcome({
          type: 'direct',
          message: 'Direct Hit - Mech is destroyed'
        });
      }
    }
  };

  const handleHullRoll = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setHullRollResult(roll + hullStat + hullBonus);
  };

  const handleHullCheckResult = (passed) => {
    setHullCheckPassed(passed);
    if (passed) {
      setOutcome({
        type: 'direct',
        message: 'Direct Hit - Hull check passed - Apply Stunned condition'
      });
    } else {
      setOutcome({
        type: 'direct',
        message: 'Direct Hit - Hull check failed - Mech is destroyed'
      });
    }
  };

  const handleSystemSelect = (system) => {
    setOutcome({
      type: 'trauma',
      message: `System Trauma - System "${system.Name}" uninstalled`
    });
    onUninstallSystem(system);
  };

  const handleConfirm = () => {
    if (outcome) {
      switch (outcome.type) {
        case 'glancing':
          onApplyCondition('impaired');
          break;
        case 'trauma':
          if (traumaRoll <= 3) {
            onUnequipWeapon();
          }
          break;
        case 'direct':
          if (currentStructure >= 3) {
            onApplyCondition('stunned');
          } else if (currentStructure === 2 && hullCheckPassed === false) {
            onDestroyMech();
          } else if (currentStructure === 1) {
            onDestroyMech();
          }
          break;
        case 'crushing':
          onDestroyMech();
          break;
      }
    }
    onClose();
  };

  const structureLost = maxStructure - currentStructure;

  return (
    <div className="structure-check-overlay">
      <div className="structure-check-content">
        <button className="structure-check-close-button" onClick={onClose}>×</button>
        <h2>Structure Loss</h2>
        {showRollButton && (
          <div className="structure-check-roll-section">
            <p>Roll {structureLost} d6 for structure damage</p>
            <button onClick={() => rollDice(structureLost)}>Roll Dice</button>
          </div>
        )}
        
        {diceResults.length > 0 && (
          <div className="structure-check-dice-results">
            <p>Dice Results: {diceResults.join(', ')}</p>
            <p>Worst Result: {Math.min(...diceResults)}</p>
          </div>
        )}

        {outcome && (
          <div className={`structure-check-outcome ${outcome.type}`}>
            <h3>{outcome.message}</h3>
          </div>
        )}

        {showSystemSelect && (
          <div className="structure-check-system-select">
            <h3>Select a system to uninstall:</h3>
            <div className="structure-check-system-list">
              {systems.map((system, index) => (
                <button 
                  key={index}
                  onClick={() => handleSystemSelect(system)}
                >
                  {system.Name}
                </button>
              ))}
            </div>
          </div>
        )}

        {showHullCheck && (
          <div className="structure-check-hull">
            <h3>Hull Check</h3>
            <div className="structure-check-hull-bonus">
              <label>Bonus/Penalty:</label>
              <input 
                type="number" 
                value={hullBonus}
                onChange={(e) => setHullBonus(parseInt(e.target.value) || 0)}
              />
            </div>
            {!hullRollResult ? (
              <button onClick={handleHullRoll}>Roll d20 + Hull ({hullStat}) + Bonus</button>
            ) : (
              <div className="structure-check-hull-result">
                <p>Roll Result: {hullRollResult}</p>
                <div className="structure-check-hull-buttons">
                  <button onClick={() => handleHullCheckResult(true)}>Passed</button>
                  <button onClick={() => handleHullCheckResult(false)}>Failed</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="structure-check-buttons">
          <button className="structure-check-confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StructureCheck; 