import React, { useState } from 'react';
import './GameFooter.css';
import DiceRollOverlay from '../DiceRollOverlay/DiceRollOverlay';
import NextRoundPopup from '../NextRoundPopup/NextRoundPopup';

const GameFooter = ({ onNextRound }) => {
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [showNextRoundPopup, setShowNextRoundPopup] = useState(false);

  const handleRollDice = () => {
    setShowDiceRoll(!showDiceRoll);
  };

  const handleNextRound = () => {
    setShowNextRoundPopup(true);
  };

  const handleConfirmNextRound = () => {
    onNextRound();
    setShowNextRoundPopup(false);
  };

  return (
    <>
      <div className="game-footer">
        <button className="footer-button roll-dice" onClick={handleRollDice}>
          Roll Dice
        </button>
        <button className="footer-button next-round" onClick={handleNextRound}>
          Next Round
        </button>
      </div>
      <DiceRollOverlay 
        isOpen={showDiceRoll} 
        onClose={() => setShowDiceRoll(false)} 
      />
      <NextRoundPopup
        isOpen={showNextRoundPopup}
        onClose={() => setShowNextRoundPopup(false)}
        onConfirm={handleConfirmNextRound}
      />
    </>
  );
};

export default GameFooter; 