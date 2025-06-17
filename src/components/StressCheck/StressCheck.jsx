import React, { useState } from 'react';
import './StressCheck.css';

const StressCheck = ({ 
  onClose, 
  currentStress, 
  maxStress, 
  engineeringStat,
  onApplyStatus,
  onSetMeltdownTurns,
  onDestroyMech,
  onApplyCondition
}) => {
  const [diceResults, setDiceResults] = useState([]);
  const [showRollButton, setShowRollButton] = useState(true);
  const [showEngineeringCheck, setShowEngineeringCheck] = useState(false);
  const [engineeringRollResult, setEngineeringRollResult] = useState(null);
  const [engineeringBonus, setEngineeringBonus] = useState(0);
  const [engineeringCheckPassed, setEngineeringCheckPassed] = useState(null);
  const [outcome, setOutcome] = useState(null);

  const stressLost = maxStress - currentStress;

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
    const onesCount = results.filter(result => result === 1).length;
    
    // Check for multiple 1s first
    if (onesCount > 1) {
      setOutcome({
        type: 'irreversible',
        message: 'Multiple 1s rolled - Meltdown in 1 turn'
      });
      onSetMeltdownTurns(1);
      return;
    }
    
    if (worstResult >= 5) {
      // Emergency Shunt
      setOutcome({
        type: 'emergency',
        message: 'Emergency Shunt - Apply Impaired condition'
      });
    } else if (worstResult >= 2) {
      // Destabilized Power Plant
      setOutcome({
        type: 'destabilized',
        message: 'Destabilized Power Plant - Apply Exposed status'
      });
    } else {
      // Meltdown
      if (currentStress >= 3) {
        // If stress is 3 or more, just apply exposed status
        setOutcome({
          type: 'destabilized',
          message: 'Meltdown - Apply Exposed status'
        });
      } else if (currentStress === 2) {
        // If stress is 2, require engineering check
        setOutcome({
          type: 'meltdown',
          message: 'Meltdown - Engineering check required'
        });
        setShowEngineeringCheck(true);
      } else {
        // If stress is 1, meltdown in 1 turn
        setOutcome({
          type: 'meltdown',
          message: 'Meltdown - Destruction in 1 turn'
        });
        onSetMeltdownTurns(1);
      }
    }
  };

  const handleEngineeringRoll = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setEngineeringRollResult(roll + engineeringStat + engineeringBonus);
  };

  const handleEngineeringCheckResult = (passed) => {
    if (passed) {
      setOutcome({
        type: 'destabilized',
        message: 'Engineering check passed - Apply Exposed status'
      });
    } else {
      setOutcome({
        type: 'meltdown',
        message: 'Engineering check failed - Roll 1d6 for turns until destruction'
      });
      // Roll 1d6 for turns
      const meltdownTurns = Math.floor(Math.random() * 6) + 1;
      setOutcome({
        type: 'meltdown',
        message: `Engineering check failed - Meltdown in ${meltdownTurns} turns`
      });
      onSetMeltdownTurns(meltdownTurns);
    }
  };

  const handleClose = () => {
    if (outcome) {
      switch (outcome.type) {
        case 'emergency':
          onApplyCondition('impaired');
          break;
        case 'destabilized':
          onApplyStatus('exposed');
          break;
        case 'meltdown':
          onApplyStatus('meltdown');
          break;
        case 'irreversible':
          onApplyStatus('meltdown');
          break;
      }
    }
    onClose();
  };

  return (
    <div className="stress-check-overlay">
      <div className="stress-check-content">
        <button className="stress-check-close-button" onClick={handleClose}>×</button>
        <h2>Stress Check</h2>
        {showRollButton && (
          <div className="stress-check-roll-section">
            <p>Roll {stressLost} d6 for stress check</p>
            <button onClick={() => rollDice(stressLost)}>Roll Dice</button>
          </div>
        )}
        
        {diceResults.length > 0 && (
          <div className="stress-check-dice-results">
            <p>Dice Results: {diceResults.join(', ')}</p>
            <p>Worst Result: {Math.min(...diceResults)}</p>
          </div>
        )}

        {outcome && (
          <div className={`stress-check-outcome ${outcome.type}`}>
            <h3>{outcome.message}</h3>
          </div>
        )}

        {showEngineeringCheck && (
          <div className="stress-check-engineering">
            <h3>Engineering Check</h3>
            <div className="stress-check-engineering-bonus">
              <label>Bonus/Penalty:</label>
              <input 
                type="number" 
                value={engineeringBonus}
                onChange={(e) => setEngineeringBonus(parseInt(e.target.value) || 0)}
              />
            </div>
            {!engineeringRollResult ? (
              <button onClick={handleEngineeringRoll}>Roll d20 + Engineering ({engineeringStat}) + Bonus</button>
            ) : (
              <div className="stress-check-engineering-result">
                <p>Roll Result: {engineeringRollResult}</p>
                <div className="stress-check-engineering-buttons">
                  <button onClick={() => handleEngineeringCheckResult(true)}>Passed</button>
                  <button onClick={() => handleEngineeringCheckResult(false)}>Failed</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="stress-check-buttons">
          <button className="stress-check-confirm-button" onClick={handleClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StressCheck; 