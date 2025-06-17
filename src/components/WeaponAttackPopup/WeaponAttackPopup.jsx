import React, { useState } from 'react';
import './WeaponAttackPopup.css';

const WeaponAttackPopup = ({ weapon, onClose, onAttack }) => {
  const [diceCount, setDiceCount] = useState(1);
  const [bonus, setBonus] = useState(weapon.rollBonus || 0);
  const [accuracy, setAccuracy] = useState(weapon.Accuracy);
  const [difficulty, setDifficulty] = useState(weapon.Difficulty);
  const [rollResult, setRollResult] = useState(null);
  const [rollDetails, setRollDetails] = useState(null);
  const [hitResponses, setHitResponses] = useState({});

  const rollDice = (sides, count) => {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    return rolls;
  };

  const handleRoll = () => {
    // Roll d20
    const d20Rolls = diceCount > 0 ? rollDice(20, diceCount) : [];
    
    // Calculate net accuracy/difficulty
    const netAccuracy = Math.max(0, accuracy - difficulty);
    const netDifficulty = Math.max(0, difficulty - accuracy);

    // Calculate results for each d20 roll
    const results = d20Rolls.map(d20Roll => {
      // Roll accuracy dice if there's net accuracy
      const accuracyRolls = netAccuracy > 0 ? rollDice(6, netAccuracy) : [];
      const accuracyResult = accuracyRolls.length > 0 ? Math.max(...accuracyRolls) : 0;

      // Roll difficulty dice if there's net difficulty
      const difficultyRolls = netDifficulty > 0 ? rollDice(6, netDifficulty) : [];
      const difficultyResult = difficultyRolls.length > 0 ? Math.max(...difficultyRolls) : 0;

      return {
        d20Roll,
        d20WithBonus: d20Roll + bonus,
        accuracyRolls,
        accuracyResult,
        difficultyRolls,
        difficultyResult,
        finalResult: d20Roll + bonus + accuracyResult - difficultyResult
      };
    });

    setRollResult(results.map(r => r.finalResult));
    setRollDetails({
      results,
      netAccuracy,
      netDifficulty
    });
    setHitResponses({});
    onAttack(); // Notify parent that an attack was made
  };

  const handleHitResponse = (index, hit) => {
    setHitResponses(prev => ({
      ...prev,
      [index]: hit
    }));
  };

  const allRollsResponded = rollResult && Object.keys(hitResponses).length === rollResult.length;

  return (
    <div className="attack-overlay">
      <div className="attack-popup">
        <div className="attack-header">
          <h2>Attack Roll</h2>
          <button className="attack-close-button" onClick={onClose}>×</button>
        </div>

        <div className="attack-content">
          <div className="attack-settings">
            <div className="attack-setting-group combined">
              <div className="attack-setting-pair">
                <label>D20:</label>
                <input
                  type="number"
                  min="1"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="attack-setting-pair">
                <label>Bonus:</label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="attack-setting-group combined">
              <div className="attack-setting-pair">
                <label>Accuracy:</label>
                <input
                  type="number"
                  min="0"
                  value={accuracy}
                  onChange={(e) => setAccuracy(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="attack-setting-pair">
                <label>Difficulty:</label>
                <input
                  type="number"
                  min="0"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>

          <button className="attack-roll-button" onClick={handleRoll}>
            Roll Attack
          </button>

          {rollResult !== null && (
            <div className="attack-results">
              <div className="attack-final-result">
                Final Results: {rollResult.join(', ')}
              </div>
              <div className="attack-details">
                {rollDetails.results.map((result, index) => (
                  <div key={index} className="attack-result-group">
                    <div>D20 Roll {index + 1}:</div>
                    <div>Base Roll: {result.d20Roll}</div>
                    <div>With Bonus: {result.d20WithBonus}</div>
                    {rollDetails.netAccuracy > 0 && (
                      <div>Accuracy ({rollDetails.netAccuracy}): {result.accuracyRolls.join(', ')} (Highest: {result.accuracyResult})</div>
                    )}
                    {rollDetails.netDifficulty > 0 && (
                      <div>Difficulty ({rollDetails.netDifficulty}): {result.difficultyRolls.join(', ')} (Highest: {result.difficultyResult})</div>
                    )}
                    <div>Final Result: {result.finalResult}</div>
                    {hitResponses[index] === undefined && (
                      <div className="attack-hit-confirmation">
                        <div className="attack-hit-question">Hit?</div>
                        <div className="attack-hit-buttons">
                          <button onClick={() => handleHitResponse(index, true)}>Yes</button>
                          <button onClick={() => handleHitResponse(index, false)}>No</button>
                        </div>
                      </div>
                    )}
                    {hitResponses[index] !== undefined && (
                      <div className="attack-damage-result">
                        <div className="attack-damage-title">Damage:</div>
                        <div className="attack-damage-value">
                          {hitResponses[index] ? `${weapon.damage} ${weapon.damageType}` : 'No damage'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {allRollsResponded && (
            <div className="attack-total-damage">
              <div className="attack-damage-title">Total Damage:</div>
              <div className="attack-damage-value">
                {Object.values(hitResponses).filter(Boolean).length * weapon.damage} {weapon.damageType}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeaponAttackPopup; 